/* 試験期間：全画面のミニゲーム。5日間、科目ごとの自信度ゲージを選択で上げて本番に臨む */
const EXAM_EVENTS=[
 {t:"友達が過去問のデータを送ってくれた。全科目の自信度が少し上がった。",f:x=>{x.rows.forEach(r=>r.p+=8)},d:{jin:1}},
 {t:"風邪をひいた。1日寝込んで、使える日が減った。",f:x=>{x.days--},d:{tai:-6}},
 {t:"教授が最終回で「ここ出す」と言った。その科目に印がついた。",f:x=>{const r=pick(x.rows);r.p+=25;x.hint=r.n}},
 {t:"サークルの先輩から「今日だけ手伝って」と呼び出し。断れず、1日消えた。",f:x=>{x.days--},d:{jin:3}},
 {t:"中央図書館の自習席が全部埋まっていた。カフェで集中できなかった。",f:x=>{x.rows.forEach(r=>r.p-=4)}},
 {t:"シケプリの神が同じクラスにいた。",f:x=>{x.rows.forEach(r=>r.p+=5)}},
 {t:"恋人と喧嘩して、何も頭に入らなかった。",c:s=>s.flags.partner,f:x=>{x.rows.forEach(r=>r.p-=6)},d:{men:-3}},
 {t:"バイト先が試験期間のシフトを減らしてくれた。使える日が1日増えた。",c:s=>s.flags.job,f:x=>{x.days++}},
 {t:"隣の部屋の騒音で眠れなかった。",c:s=>s.home.solo,f:x=>{x.rows.forEach(r=>r.p-=3)},d:{tai:-3}},
 {t:"親が差し入れを送ってきた。少し元気が出た。",c:s=>!s.home.n.startsWith("実家"),f:x=>{},d:{men:4}},
];
function prepInit(co){
  const p=co.prof,pm=p.m==="jin"?(S.s.jin-40)*.2:p.m==="att"?(S.mod<0?-10:4):p.m*.6;
  return clamp(Math.round(28+S.s.gaku*.3+S.mod*.8+pm+S.brain.ex*2+(co.kind==="再履修"?-6:0)+(co.lang?S.lang.m*2:0)+rnd(-8,8)),5,80);
}
const confLabel=p=>p>=85?"余裕":p>=70?"いける":p>=50?"五分":p>=35?"不安":"絶望";
function renderExam(){
  S.busy=true;stop();
  const name=`${TERMS[S.T]}の試験期間`;
  const X=S._exam=S._exam||{rows:S.tt.map(co=>({n:co.n,p:prepInit(co),c:co.c,kind:co.kind,prof:co.prof.n,scary:co.prof.m===-10||co.prof.m==="att",drop:0})),days:S.s.tai<15?4:5,day:1,kako:0,ev:0,sel:0,done:0,log:[]};
  if(!X.ev&&Math.random()<.65){const cand=EXAM_EVENTS.filter(e=>!e.c||e.c(S));const e=pick(cand);e.f(X);if(e.d)applyD(e.d);X.log.unshift(e.t)}
  X.ev=1;
  let ov=$("#xov");
  if(!ov){ov=document.createElement("div");ov.className="overlay xov";ov.id="xov";ov.setAttribute("role","dialog");ov.setAttribute("aria-label","試験期間");document.body.append(ov);document.documentElement.classList.add("noscroll");sfx("page");bgmDuck(1)}
  const draw=()=>{
    X.rows.forEach(r=>r.p=clamp(r.p,0,100));
    const sel=X.rows[X.sel]||X.rows[0];const left=X.days-X.day+1;
    const rows=X.rows.map((r,i)=>`<button class="xc ${i===X.sel?"on":""} ${r.drop?"drop":""}" data-r="${i}">
      <span class="xc-h"><span class="xn">${esc(r.n)}</span><span class="xtag">${r.scary?`<span class="rar R">鬼</span>`:""}${X.hint===r.n?`<span class="rar SR">出る</span>`:""}${r.kind!=="選択"?`<span class="kind">${r.kind}</span>`:""}</span></span>
      <span class="xc-b"><span class="xb"><span style="width:${r.p}%" class="${r.p>=70?"hi":r.p>=45?"mid":"lo"}"></span></span><span class="xp mono">${r.drop?"捨てた":`${r.p}・${confLabel(r.p)}`}</span></span>
      <small class="xprof">${esc(r.prof)}</small></button>`).join("");
    const acts=X.done?"":`
      <button class="xa" data-a="study" ${sel.drop?"disabled":""}><b>勉強する</b><small>+12〜20／体力−2</small></button>
      <button class="xa" data-a="night" ${sel.drop||S.s.tai<15?"disabled":""}><b>徹夜</b><small>大きく上がる。連続すると効きが落ちて体が壊れる</small></button>
      <button class="xa" data-a="kako" ${X.kako?"disabled":""}><b>過去問を回す</b><small>人脈判定・全科目／1回</small></button>
      <button class="xa" data-a="rest"><b>休む</b><small>体力+9 メンタル+5</small></button>
      <button class="xa" data-a="drop" ${sel.drop||sel.kind==="必修"||sel.kind==="再履修"?"disabled":""}><b>捨てる</b><small>${sel.kind==="必修"||sel.kind==="再履修"?"必修は不可":"落とす代わりに他+5"}</small></button>
      ${left===1?`<button class="xa warn" data-a="cheat"><b>カンペ</b><small>最後の手段</small></button>`:""}
      <button class="xa auto" data-a="auto"><b>おまかせ</b><small>残り${left}日を自動で配分。必修と自信のない科目から、体力を見て休みも入れる</small></button>`;
    ov.innerHTML=`<div class="ov-inner xin">
      <div class="xhead">
      <div class="mw-bar"><span class="mw-logo">${esc(name)}</span><span class="mw-user">${X.done?"試験終了":`${X.day}日目／${X.days}日`}</span></div>
      <div class="xstat"><span>体力 <b class="mono ${S.s.tai<20?"neg":""}">${S.s.tai}</b></span><span>メンタル <b class="mono ${S.s.men<25?"neg":""}">${S.s.men}</b></span><span>学力 <b class="mono">${S.s.gaku}</b></span><span>残り <b class="mono">${X.done?0:left}</b>日</span></div>
      </div>
      <p class="xlog">${X.log.length?esc(X.log[0]):"科目を選んで、今日の過ごし方を決める。"}</p>
      <div class="xcards">${rows}</div>
      ${X.done?`<div class="xres"><p>${esc(X.feel)}</p><p class="muted">成績はMyWasedaで${S.T%2===0?"9月上旬":"3月上旬"}に発表される。</p>${X.ds&&X.ds.length?chips(X.ds):""}<div class="actions"><button class="btn" id="nx">試験期間を終える</button></div></div>`:""}
    </div>
    ${X.done?"":`<div class="xbar"><div class="xsel">選択中：<b>${esc(sel.n)}</b></div><div class="xbar-in">${acts}</div></div>`}`;
    ov.querySelectorAll(".xc").forEach(b=>b.onclick=()=>{X.sel=+b.dataset.r;sfx("tick");draw()});
    ov.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>act(b.dataset.a));
    if(X.done){const b=$("#nx");b.onclick=()=>{sfx("tap");ov.remove();document.documentElement.classList.remove("noscroll");S.busy=false;if(S.ending)return renderEnd();refreshHud();saveRun();S.userPaused?syncCtrl():run()};b.focus({preventScroll:true});try{b.scrollIntoView({block:"nearest"})}catch(e){}}
    syncCtrl();
  };
  const bump=(r,g)=>{r.p+=g;X.flash=r.n};
  const act=a=>{
    const sel=X.rows[X.sel]||X.rows[0];
    if(a==="study"){X.nights=0;const g=Math.round(ri(12,20)*S.brain.grow*(S.s.men<25?.7:1));bump(sel,g);applyD({tai:-2});X.log.unshift(`「${sel.n}」を勉強した。自信度 +${g}。`);sfx("tick")}
    else if(a==="night"){X.nights=(X.nights||0)+1;const cost=7+4*(X.nights-1);const g=Math.max(10,ri(24,34)-6*(X.nights-1));bump(sel,g);applyD({tai:-cost,men:-2});X.log.unshift(`徹夜${X.nights>1?`${X.nights}日目`:""}。「${sel.n}」の自信度 +${g}。体力 −${cost}。${X.nights>=3?"頭が働かない。":"目の下が黒い。"}`);
      if(Math.random()<.15+.15*(X.nights-1)){const o=pick(X.rows.filter(r=>r!==sel&&!r.drop));if(o){o.p-=15;X.log[0]+=`翌日の「${o.n}」で寝落ちした（−15）。`}}
      if(X.nights>=3&&S.s.tai<25){X.days--;applyD({tai:-5});X.log[0]+="限界を超えて倒れた。1日消えた。"}
      sfx("thud")}
    else if(a==="kako"){X.kako=1;const ok=Math.random()<pc(S.s.jin,45);if(ok){const g=ri(8,14);X.rows.forEach(r=>r.p+=g);applyD({jin:2});X.log.unshift(`先輩から過去問が回ってきた。全科目の自信度 +${g}。`);sfx("good")}else{X.rows.forEach(r=>r.p+=2);applyD({men:-3});X.log.unshift("過去問を持っている人が周りにいなかった。");sfx("bad")}}
    else if(a==="rest"){applyD({tai:9,men:5});X.log.unshift("一日休んだ。だいぶ回復した。");sfx("tap")}
    else if(a==="drop"){sel.drop=1;X.rows.filter(r=>!r.drop).forEach(r=>r.p+=5);X.log.unshift(`「${sel.n}」を捨てた。他の科目の自信度 +5。`);sfx("thud");draw();return}
    else if(a==="cheat"){return finish(1)}
    else if(a==="auto"){return autoPlan()}
    X.day++;
    if(X.day>X.days)return finish(0);
    draw();
  };
  /* おまかせ：残りの日を自動で使う。過去問は最初に1回、体力が切れそうなら休む、あとは必修・再履修→自信の低い科目の順に勉強。
     最終日に自信40未満の科目が残っていて体力に余裕があれば徹夜 */
  const autoPlan=()=>{
    let guard=0;const plan=[];
    while(!X.done&&guard++<40){
      const live=X.rows.filter(r=>!r.drop);
      const left=X.days-X.day+1;
      const weak=live.slice().sort((a,b)=>(a.kind==="必修"||a.kind==="再履修"?0:1)-(b.kind==="必修"||b.kind==="再履修"?0:1)||a.p-b.p)[0];
      let a;
      if(!X.kako&&S.s.jin>=35)a="kako";
      else if(S.s.tai<15||(S.s.tai<25&&left>=3))a="rest";
      else if(!weak||weak.p>=85)a="rest";
      else if((weak.kind==="必修"||weak.kind==="再履修")&&weak.p<45&&S.s.tai>=40&&!(X.nights>=1))a="night";
      else if(left===1&&weak.p<40&&S.s.tai>=30&&!(X.nights>=2))a="night";
      else a="study";
      if(weak)X.sel=X.rows.indexOf(weak);
      plan.push(a==="kako"?"過去問":a==="rest"?"休養":a==="night"?`徹夜（${weak.n}）`:`勉強（${weak.n}）`);
      act(a);
    }
    if(X.done)X.log.unshift(`おまかせで配分した：${plan.join("→")}`);
    draw();
  };
  const finish=cheat=>{
    X.done=1;
    if(cheat&&Math.random()<.2){
      S.pending={T:S.T,rows:S.tt.map(co=>({...co,g:"F"})),void:"試験中の不正行為により、この学期に登録した全科目が無効になった。"};S.mod=0;
      X.ds=applyD({men:-3});X.feel="試験監督に肩を叩かれた。カンニングペーパーが見つかった。";
      suspend(SUSP_MONTHS(),"定期試験での不正行為");
    }else{
      const rows=S.tt.map(co=>{const x=X.rows.find(r=>r.n===co.n);if(x&&x.drop)return{...co,g:"F"};const b=x?(x.p-50)*.5+(cheat?12:0):0;return{...co,g:gradeOf(courseScore(co,b))}});
      S.pending={T:S.T,rows};S.mod=0;
      const avg=rows.reduce((a,r)=>a+GP[r.g],0)/Math.max(1,rows.length);
      X.ds=applyD(cheat?{men:-3}:{men:2});
      X.feel=(cheat?"バレなかった。心臓に悪い。":"")+(avg>=2.8?"手応えはかなりある。":avg>=1.8?"手応えは微妙。いくつか怪しい。":"終わった。何科目か確実に落とした気がする。");
    }
    feed(`${name}が終わった。${X.feel}成績発表は${S.T%2===0?"9月上旬":"3月上旬"}。`,X.ds,"key");
    S._exam=null;
    sfx(X.feel.startsWith("終わった")||X.feel.startsWith("試験監督")?"bad":"good");
    refreshHud();draw();
  };
  draw();
}
