/* 日程、自動再生、1日ごとの進行（tick） */
/* ---------- 日程 ---------- */
const ALLF=[...FLOW,...LIFE_FLOW];
const SCHED={
 0:[["nyugaku",4,1],["shinkan",4,4],["rishu",4,9],["hyakuhai",5,23],["natsu",8,3]],
 1:[["wasedasai",11,1],["circleMain",12,12],["kamen",1,17]],
 2:[["zemiPrep",4,6]],
 3:[["circleMain",10,18],["zemi",11,12],["kanbu",12,5]],
 4:[["summerIntern",6,10],["sils",4,3]],
 5:[["circleMain",10,18],["akifuyu",12,3]],
 6:[["honsenko",6,1]],
 7:[["sotsuron",12,8]],
 8:[["ryunen",4,6]],
 9:[],
};
const BASE_Y=2026;
const WD="日月火水木金土";
function termOf(ay,m){return ay*2+(m>=4&&m<=9?0:1)}
function dateIn(T,m,d){const ay=Math.floor(T/2);return new Date(BASE_Y+ay+(m<=3?1:0),m-1,d)}
function dkey(d){return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate()}
function fmt(d){return `${d.getMonth()+1}/${d.getDate()}`}

function planTerm(T){
  const items=[];
  for(const [id,m,d] of SCHED[T]||[])items.push({k:dkey(dateIn(T,m,d)),ev:EV[id]});
  const even=T%2===0;
  const cand=POOL.filter(e=>T>=e.terms[0]&&T<=e.terms[1]);
  // 候補のほうが多いので、全部は出ない。学期ごとに本数も少し揺らす
  const n=T>=6?ri(2,4):ri(4,6);
  const used=new Set();
  // 毎学期ひとつは「闇」側の出来事を混ぜる
  const darkPool=cand.filter(e=>e.dark);
  for(let i=0;i<n&&cand.length;i++){
    const e=(i===0&&T>=1&&darkPool.length)?wpick(darkPool):wpick(cand);cand.splice(cand.indexOf(e),1);
    let dt;do{dt=even?dateIn(T,ri(4,7),ri(1,28)):dateIn(T,pick([10,11,12,1]),ri(1,28))}while(used.has(dkey(dt))||(even&&dt.getMonth()+1===4&&dt.getDate()<12)||(!even&&dt.getMonth()+1===1&&dt.getDate()>20));
    used.add(dkey(dt));items.push({k:dkey(dt),ev:e});
  }
  items.push({k:dkey(even?dateIn(T,7,24):dateIn(T,1,24)),ev:"exam"});
  items.push({k:dkey(even?dateIn(T,9,1):dateIn(T,3,2)),ev:"grades"});
  S.sched.push(...items);S.sched.sort((a,b)=>a.k-b.k);
}

/* ---------- 進行（自動再生） ---------- */
const SPEEDS=[{n:"×1",ms:420},{n:"×2",ms:220},{n:"×4",ms:100},{n:"×8",ms:40}];
const spd=()=>clamp(meta.spd??0,0,SPEEDS.length-1);
let timer=null;
function newRun(){
  stop();clearRun();
  meta.runs++; save(meta);
  const fac=wpick(FACS),route=wpick(ROUTES),lang=wpick(LANGS),past=wpick(PASTS),brain=wpick(BRAINS);
  const school=pickSchool(route);
  const local=SHUTOKEN.includes(school.pref),near=["茨城","栃木","群馬"].includes(school.pref);
  // 首都圏の高校なら実家通いが基本。地方なら上京か寮。北関東は3割だけ実家から通う
  const home=local?wpick([{...HOMES.find(h=>h.n==="実家から通学"),w:70},{...HOMES.find(h=>h.n==="実家を出て一人暮らし"),w:18},{...HOMES.find(h=>h.n==="学生寮"),w:12}]):near&&Math.random()<.3?HOMES.find(h=>h.n==="実家から通学"):wpick(HOMES.filter(h=>h.n==="上京して一人暮らし"||h.n==="学生寮"));
  // 実家の種類も出身に合わせる（都内の農家・地方の名士は出さない）
  const wealth=wpick(WEALTH.filter(w=>!(local&&(w.n==="農家"||w.n==="地方の名士の家"))&&!(school.pref==="東京"&&w.n==="農家")));
  const dept=pickDept(fac);
  const area=pickStation(home,fac,school.pref);
  const s={gaku:ri(38,58),com:ri(30,55),jin:ri(35,55),tai:ri(50,70),men:ri(45,65),gk:ri(10,25)};
  for(const m of [fac.m,route.m,home.m,area.m||{},past.m])for(const k in m)s[k]=clamp(s[k]+m[k],0,100);
  const sex=pick(["m","f"]);
  const BD={m:ri(1,12),d:ri(1,28)},RONIN=route.n==="一般選抜"&&Math.random()<.3?1:0,BY=BASE_Y-18-RONIN-(BD.m>=4&&!(BD.m===4&&BD.d===1)?1:0);
  S={flyers:[],s0:{...s},n:meta.runs,fac,dept,track:null,lab:null,route,home,area,wealth,lang,past,brain,school,s,kane:wealth.kane+ri(0,10),flagsInit:1,cr:0,gp:0,gu:0,ay:0,T:0,mod:0,flags:{first:Math.random()<.65?1:0},circle:null,circle2:null,post:null,zemi:null,job:null,ending:null,log:[],feed:[],sched:[],today:[],prof:PROFS[4],date:new Date(BASE_Y,2,31),busy:false,recent:[],
    name:pick(SEI)+" "+pick(MEI),sid:`1${"ABCDEFGHJKLMN"[FACS.indexOf(fac)]}${String(BASE_Y%100)}${ri(1000,9999)}-${ri(0,9)}`,face:newFace(sex),diff:"normal",sex,susp:0,people:null,ys:null,bd:BD,by:BY,ronin:RONIN,passed:[],retake:[],failedEl:[],freeN:0,tt:[],pending:null,pol:"bal",crisis:{},skip:0,teT:ri(0,1),grades:[]};
  renderGacha();
}
/* 入学前に学部だけ選び直す。学科・最寄り駅・学部の初期補正・学籍番号を学部に合わせて引き直し、他はそのまま */
function changeFac(fac){
  if(!S||S.started||fac===S.fac)return;
  const s={...S.s0};
  for(const k in S.fac.m)s[k]=clamp(s[k]-S.fac.m[k],0,100);
  for(const k in fac.m)s[k]=clamp(s[k]+fac.m[k],0,100);
  S.fac=fac;S.dept=pickDept(fac);S.area=pickStation(S.home,fac,S.school.pref);
  S.s0={...s};S.s={...s};S.flags.facChosen=1;
  S.sid=`1${"ABCDEFGHJKLMN"[FACS.indexOf(fac)]}${S.sid.slice(2)}`;
}
function startLife(){
  initPeople();yearStart();
  if(S.wealth.loan)S.flags.loan=30;
  log(`${S.school.n}（${S.school.pref}）から${S.fac.n}に${S.route.n}で入学${S.ronin?"（1浪）":""}`);
  renderLife();
  play();
}
function play(){S.userPaused=false;run()}
function run(){
  stop();
  if(S.busy||S.ending||S.userPaused)return syncCtrl();
  timer=setInterval(tick,SPEEDS[spd()].ms);
  document.documentElement.classList.toggle("fast",spd()>=2);
  syncCtrl();
}
function stop(){if(timer){clearInterval(timer);timer=null}}
function pause(){S.userPaused=true;stop();syncCtrl()}

function tick(){
  if(S.busy||S.ending)return stop();
  if(S.today.length)return fire(S.today.shift());
  const d=S.date=new Date(S.date.getFullYear(),S.date.getMonth(),S.date.getDate()+1);
  const m=d.getMonth()+1,day=d.getDate();
  if(m===4&&day===1&&S.started){S.ay++;yearStart()}
  S.started=1;
  S.T=termOf(S.ay,m);
  if(day===1){
    if(m===4||m===10){
      if(S.T===8||S.T===9){if(!S.job||S.job.tier==="D"){job(S,"safe");feed(`就活をやり直した。${S._txt}`,null,"key")}}
      if(S.T===8&&m===4)S.prof=wpick(PROFS);
      planTerm(S.T);
      S.tt=buildTT(S.T);
      const cr=S.tt.reduce((a,o)=>a+o.c,0),re=S.tt.filter(o=>o.kind==="再履修").length;
      feed(`${TERMS[S.T]}の履修登録。${S.tt.length}科目${cr}単位${re?`（うち再履修${re}科目）`:""}。`,null,"sys");
    }
    const p=pol();
    if(!reqOK(p.req)){S.pol="bal";feed(`方針「${p.n}」を続けられなくなった。バランスに戻した。`,null,"sys")}
    const P=pol();
    const inc=(S.wealth.inc+S.home.cost+(S.area.c||0)+(S.flags.job?14:0))/8+DIFF[S.diff].kane+P.kane-(S.flags.ribo?2:0)-(S.flags.smoke?1.5:0)-(S.flags.lessmoney?1:0)-0.6;
    S.kane=Math.round((S.kane+inc)*10)/10;
    const md={...P.d};if(S.flags.smoke)md.tai=(md.tai||0)-1;
    // 地頭：勉強で学力が伸びる速さ
    if(md.gaku>0)md.gaku=Math.round(md.gaku*S.brain.grow);
    // 第二外国語のクラスは1〜2年の人間関係の単位
    if(S.ay<=1)for(const k in S.lang.cls)md[k]=(md[k]||0)+S.lang.cls[k];
    // コミュ力は使わないと鈍る（高いときだけ）
    if(S.s.com>60&&!S.circle)md.com=(md.com||0)-1;
    // 若い体は月に少し回復する。通学時間が長いと削れる
    if(S.s.tai<50&&P.id!=="work"&&P.id!=="circle")md.tai=(md.tai||0)+1;
    if(commuteTai())md.tai=(md.tai||0)-commuteTai();
    // 掛け持ちは会費と体力が二重にかかる
    if(S.circle2){md.tai=(md.tai||0)-1;S.kane=Math.round((S.kane-0.6)*10)/10}
    // 勉強していない月は学力が少しずつ落ちる（60以上のときだけ）
    if(S.s.gaku>60&&P.id!=="study"&&P.id!=="rest")md.gaku=(md.gaku||0)-1;
    // 90を超えたステータスは現状維持が難しい
    for(const [k] of STATS)if(S.s[k]>=90)md[k]=(md[k]||0)-2;
    // 人間関係は放っておくと薄れる（サークルなし・上級生ほど減りやすい）
    if(S.s.jin>35)md.jin=(md.jin||0)-(S.circle?1:2)-(S.ay>=3?1:0);
    syncLover();
    const ds=applyD(md);
    feed(`${m}月の収支 ${inc>=0?"+":""}${inc.toFixed(1)}万円${P.id!=="bal"?`（方針：${P.n}）`:""}${S.flags.ribo?"。リボの返済が重い":""}`,ds,"sys");
    refreshHud();saveRun();
  }
  if(m===3&&day===20&&(S.ay===3||S.ay===4)){graduationCheck();if(S.ending)return}
  updateClock();
  if(m===S.bd.m&&day===S.bd.d&&age()===20)S.today.push(EV20);
  const k=dkey(d);
  while(S.sched.length&&S.sched[0].k<=k){const it=S.sched.shift();if(it.k===k)S.today.push(it.ev)}
  if(S.today.length)return fire(S.today.shift());
  if(crisis())return fire(S.today.shift());
  if(S.susp>0){S.susp--;if(S.susp===0){feed("停学が明けた。",null,"sys");refreshHud()}return}
  if(S.skip>0){S.skip--;if(S.skip===0)feed("退院した。",null,"sys");return}
  if(m===3&&day===31&&!S.ending&&!S.busy){S.busy=true;stop();renderRecap();return}
  if(Math.random()<.012)return rare();
  if(Math.random()<.12)flow();
  if(S.s.men<=0){S.ending={type:"kyugaku"};stop();return renderEnd()}
}
function graduationCheck(){
  if(S.cr>=NEED){S.ending={type:"grad"};stop();renderEnd();return}
  if(S.ay===4){S.ending={type:"stuck"};stop();renderEnd();return}
  log(`単位が${NEED-S.cr}足りず留年`);feed(`卒業判定。単位が${NEED-S.cr}足りない。留年が決まった。`,null,"key");
  if(S.job&&!["D","G","K","M"].includes(S.job.tier)&&Math.random()<.5){log("内定取り消し");feed("内定先から連絡。内定は取り消しになった。",applyD({men:-10}),"key");S.job={tier:"D",label:TIERS.D}}
}
function flow(){
  const m=S.date.getMonth()+1;
  const cand=ALLF.filter((f,i)=>(!f.m||f.m.includes(m))&&(!f.y||(S.ay>=f.y[0]&&S.ay<=f.y[1]))&&(!f.c||f.c(S))&&!S.recent.includes(i));
  if(!cand.length)return;
  const f=wpick(cand),i=ALLF.indexOf(f);
  S.recent.push(i);if(S.recent.length>14)S.recent.shift();
  const t=val(f.t);if(f.f)f.f(S);
  feed(t,applyD(val(f.d)||{}));
  refreshHud();
}
function rare(){
  const rar=wpick([{r:"R",w:70},{r:"SR",w:25},{r:"SSR",w:5}]).r,h=pick(HAPPEN[rar]);
  if(h[2])h[2](S);
  const ds=applyD(h[1]);
  sfx(rar==="R"?"coin":"rare");
  feed(h[0],ds,"key",rar);
  log(`[${rar}] ${h[0].replace(/。.*$/,"")}`);
  refreshHud();
  if(rar!=="R"){S.busy=true;stop();showPanel(`<section class="card event"><span class="eyebrow">${fmtLong(S.date)}</span><h3><span class="rar ${rar}">${rar}</span>ハプニング</h3><p>${esc(h[0])}</p>${ds.length?chips(ds):""}<div class="actions"><button class="btn" id="nx">続ける</button></div></section>`);bindNext()}
}
function fire(ev){
  if(S.susp>0&&ev!=="grades"){
    if(ev==="exam"){S.pending={T:S.T,rows:S.tt.map(co=>({...co,g:"F"})),void:"停学中のため、期末試験を受けられなかった。"};feed("停学中で期末試験を受けられなかった。",null,"key");return}
    if(!Object.values(CRISIS).includes(ev)&&ev!==EV20){feed(`停学中のため「${val(ev.title)}」には関われなかった。`,null,"sys");return}
  }
  if(ev==="exam")return renderExam();
  if(ev==="grades")return S.pending?renderGrades():null;
  if(ev.when&&!ev.when(S))return;
  renderEvent(ev);
}
