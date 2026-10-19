/* エンディングの演出：全画面で「最後の日」→「4年間の軌跡」→「思い出」→「10年後」→ランク発表→成績証明書 */
const _renderEnd0=renderEnd;
const ACHV=[
 ["hakone","箱根を走った","🏃"],["buzz","バズった","📱"],["cherry","初めての夜","🌙"],["dousei","同棲した","🏠"],["share","ルームシェア","🛋"],
 ["abroad","留学した","✈️"],["intern","インターン経験","💼"],["oryo","部費に手をつけた","💸"],["smoke","喫煙者","🚬"],["sober","禁酒した","🍵"],
 ["ukeru","ライブでウケた","🎤"],["giin","議員事務所で働いた","🏛"],["yobi","予備試験合格","⚖️"],["startup","起業した","🚀"],["naiteiLost","内定取り消し","📉"],
 ["langLeader","語学クラスの幹事","🗣"],["dyed","髪を染めた","💇"],["bike","自転車通学","🚲"],["loan","奨学金を背負った","🏦"],["ribo","リボ地獄","💳"],["udrink","未成年飲酒","🚫"],["teigaku","停学","⛔"],
];
function achievements(){
  const f=S.flags,out=[];
  for(const [k,l,i] of ACHV)if(f[k])out.push([i,l+(typeof f[k]==="number"&&f[k]>1?`×${f[k]}`:"")]);
  if(S.post)out.push(["👑",`${S.post}を務めた`]);
  if(S.circle2)out.push(["🎭","掛け持ちした"]);
  if(S.people&&S.people.ex&&S.people.ex.length)out.push(["💔",`${S.people.ex.length}回別れた`]);
  if(gpa()>=3.5)out.push(["📚","GPA3.5超え"]);
  if((S.grades||[]).every(g=>!g.f)&&S.grades.length>=6)out.push(["✅","4年間フル単"]);
  if(S.kane>=100)out.push(["💰","所持金100万円"]);
  if(S.kane<0)out.push(["🕳","卒業時に借金"]);
  if(S.loveCount>=3)out.push(["💘","恋多き学生"]);
  if(S.qual)out.push(["📜",`資格：${S.qual.n||S.qual}`]);
  return out;
}
function epilogue(){
  const t=S.job?S.job.tier:"D",e=S.ending.type,f=S.flags,co=S.job&&S.job.co;
  const love=S.people&&S.people.lover?`${S.people.lover.n}とは${pick(["結婚した。","30歳の手前で別れた。","遠距離の末に結婚した。","今も一緒にいる。"])}`:pick(["結婚相手は社会人になってから出会った。","恋人はいない時期が長かったが、30歳で落ち着いた。","独身を謳歌している。"]);
  const map={
   S:[`${co||"内定先"}で5年働いて、海外駐在を打診された。`,`${co||"内定先"}を3年で辞め、同期と会社を作った。`,`${co||"内定先"}で最年少のマネージャーになった。土日はない。`],
   A:[`${co||"内定先"}で順調に昇進した。後輩に「早稲田ですか」と聞かれるのが少し誇らしい。`,`${co||"内定先"}から転職して年収が上がった。`,`${co||"内定先"}で30歳、結婚と昇進が同じ年に来た。`],
   B:[`${co||"内定先"}で働きながら、副業を始めた。`,`${co||"内定先"}を辞めて地元に帰った。`,`${co||"内定先"}で普通に働いている。普通が一番難しいと知った。`],
   C:["3回転職して、ようやく自分に合う職場を見つけた。","中小企業で部長になった。同期の誰よりも早い出世だった。","地方の支社に飛ばされたが、そこで天職に出会った。"],
   D:["卒業後にフリーターを2年。27歳で正社員になった。","公務員試験に合格して、今は市役所にいる。","バイト先のカフェで店長になった。悪くない。"],
   V:["ベンチャーが上場した。ストックオプションで家を買った。","ベンチャーが潰れた。でも次の会社ですぐ拾われた。"],
   G:["博士号を取った。ポストは不安定だが、研究は楽しい。","修士で就職した。研究室の経験が思った以上に効いた。"],
   P:["霞が関で深夜まで働いている。やりがいはある。","地元の県庁で課長補佐になった。定時に帰れる。"],
   L:["弁護士になった。初めての勝訴で泣いた。","司法試験に3回目で合格した。"],
   O:["海外でPhDを取り、そのまま向こうの大学で教えている。","帰国して外資系に入った。英語の夢を見る。"],
   I:["フォロワーは50万人。企業の広告塔になった。","炎上して引退した。今は普通の会社員だ。"],
   F:["家業を継いで、売上を2倍にした。","家業を継いだが時代に合わず、業態を変えた。"],
   N:["地域おこし協力隊の後、その町で起業した。","3年で東京に戻った。でも、あの町には毎年帰る。"],
   K:["起業した会社を売却した。30歳で一度引退した。","会社は潰れたが、2社目で当てた。"],
   M:["芸人として賞レースの決勝に残った。","芸人は辞めた。今は放送作家をしている。"],
  };
  const spec={kamen:"国立大学を卒業し、早稲田のことは履歴書に書かない。でも、たまに思い出す。",kyugaku:"1年休んで復学し、ゆっくり卒業した。あの休学は正しかった。",joseki:"働きながら通信制大学で学位を取った。",taiho:"刑期を終え、支援団体の手を借りて働いている。",taigaku:"大学を離れて10年。別の道で、ちゃんと生きている。",kyugakuWork:"借金を返して復学し、2年遅れで卒業した。",stuck:"7年目の春、ついに卒業した。",takarakuji:"宝くじの金は5年で半分になった。それでも自由だ。",geinou:"芸能界で10年。名前を知らない人はいない、とは言わないが、食べてはいける。"};
  const main=spec[e]||pick(map[t]||map.D);
  const extra=f.naiteiLost?"内定取り消しの話は、酒の席の鉄板ネタになった。":f.hakone?"箱根の話は10年経っても聞かれる。":f.teigaku?"停学の話は、しばらく誰にもしなかった。":S.circle?`${S.circle.n}の同期とは今も年に一度集まる。`:"大学の友達とは、気づけば疎遠になった。";
  return `${main}${love}${extra}`;
}
function bestMemories(){
  const key=(S.feed||[]).filter(f=>f.cls==="key"||f.rar).slice().reverse();
  const pri=f=>(f.rar==="SSR"?5:f.rar==="SR"?3:0)+(/内定|付き合|箱根|停学|逮捕|代表|留学|初めて|卒業|合格|優勝|バズ/.test(f.t)?2:0)+(f.ds&&f.ds.length?1:0);
  const seen=new Set();const uniq=key.filter(f=>{const k=f.t.replace(/[0-9]/g,"");if(seen.has(k))return false;seen.add(k);return true});
  const sorted=uniq.map((f,i)=>({f,i,p:pri(f)})).sort((a,b)=>b.p-a.p||a.i-b.i).slice(0,6).sort((a,b)=>a.i-b.i);
  const logs=(S.log||[]).filter(l=>/内定|入った|付き合|別れ|停学|進路|就任|留学|初めて/.test(l.t)).slice(0,8);
  return sorted.length>=4?sorted.map(x=>({dt:x.f.dt,t:x.f.t})):logs.map(l=>({dt:l.term,t:l.t}));
}
function statDelta(){
  const s0=S.s0||S.s;
  return STATS.map(([k,l])=>{const a=s0[k]??S.s[k],b=S.s[k];return `<div class="sd"><span>${l}</span><span class="sdb"><i style="width:${a}%"></i><b style="width:${b}%"></b></span><span class="mono ${b>a?"up":b<a?"down":""}">${a}→${b}</span></div>`}).join("");
}
renderEnd=function(){
  if(S._endShown)return _renderEnd0();
  stop();clearRun();S.busy=true;
  const e=S.ending.type,rank=rankOf(),ttl=title();
  document.documentElement.classList.add("noscroll");document.documentElement.classList.remove("hud-off");const old=$("#ov");if(old)old.remove();if($("#panel"))$("#panel").innerHTML="";const xo=$("#xov");if(xo)xo.remove();
  const ov=document.createElement("div");ov.className="overlay endov";ov.id="ov";document.body.append(ov);
  bgmDuck(1);
  const head=e==="grad"?(S.ay>=4?"1年遅れの卒業式":"卒業式"):e==="kamen"?"退学届":e==="kyugaku"?"休学届":e==="joseki"?"除籍通知":e==="taiho"?"逮捕":e==="taigaku"?"退学処分":e==="kyugakuWork"?"休学届":e==="stuck"?"6年目の春":ENDINGS[e]?ENDINGS[e].head:"最後の日";
  const years=(S.grades||[]).map(g=>`<div class="gy"><span>${TERMS[g.T]}</span><span class="gyb"><i style="width:${g.gpa/4*100}%" class="${g.gpa>=3?"hi":g.gpa>=2?"mid":"lo"}"></i></span><b class="mono">${g.gpa.toFixed(2)}</b></div>`).join("");
  const mem=bestMemories();const ach=achievements();
  const scenes=[
   {cls:"dark",html:`<p class="eo-date">${fmtLong(S.date)}</p><h2 class="eo-h">${esc(head)}</h2><p class="eo-sub">${esc(S.fac.n)}　${esc(S.name)}</p><p class="eo-p">${esc(story())}</p>`},
   {html:`<h2 class="eo-h2">4年間の軌跡</h2><p class="muted">入学時 → ${e==="grad"?"卒業時":"最後の日"}</p><div class="sds">${statDelta()}</div>${years?`<h3 class="eo-h3">学期ごとのGPA</h3><div class="gys">${years}</div>`:""}<p class="eo-note">取得単位 <b class="mono">${S.cr}</b>／${NEED}　通算GPA <b class="mono">${S.gu?gpa().toFixed(2):"—"}</b>　所持金 <b class="mono">${(Math.round(S.kane*10)/10).toFixed(1)}</b>万円</p>`},
   {html:`<h2 class="eo-h2">思い出</h2><ol class="eo-mem">${mem.map(m=>`<li><span class="dt mono">${esc(m.dt)}</span><span>${esc(m.t)}</span></li>`).join("")||"<li>静かな4年間だった。</li>"}</ol>${ach.length?`<h3 class="eo-h3">実績</h3><div class="eo-ach">${ach.map(([i,l])=>`<span><em>${i}</em>${esc(l)}</span>`).join("")}</div>`:""}`},
   {cls:"dark",html:`<p class="eo-date">10年後</p><p class="eo-p">${esc(epilogue())}</p>`},
   {cls:"rankscene",html:`<p class="eo-date">早稲田生活 ${S.n} 周目の評価</p><div class="rank big ${rank==="S"||rank==="EX"?"s":""}" id="erank">？</div><div class="verdict"><strong id="ettl">…</strong></div>`,enter:()=>{sfx("drum");let i=0;const ks=["D","C","B","A","S","EX"];const iv=setInterval(()=>{$("#erank").textContent=ks[i++%ks.length];sfx("slot")},110);setTimeout(()=>{clearInterval(iv);$("#erank").textContent=rank;$("#ettl").textContent=`「${ttl}」`;sfx(["S","EX","A"].includes(rank)?"fanfare":rank==="E"?"sad":"good")},reduce?0:1500)}},
  ];
  let i=0;
  const show=()=>{
    const sc=scenes[i];
    ov.className=`overlay endov ${sc.cls||""}`;
    ov.innerHTML=`<div class="ov-inner eo">${sc.html}<div class="actions eo-act"><button class="btn" id="nx">${i<scenes.length-1?"次へ":"成績証明書を見る"}</button></div><p class="eo-step">${i+1} / ${scenes.length}</p></div>`;
    ov.scrollTop=0;sfx("page");
    if(sc.enter)sc.enter();
    $("#nx").onclick=()=>{sfx("tap");if(++i<scenes.length)show();else{S._endShown=1;ov.remove();_renderEnd0()}};
  };
  show();
};
