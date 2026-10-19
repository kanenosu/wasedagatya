/* 試験期間ミニゲーム：5日間、科目ごとの準備度を上げて本番に臨む。render.js の renderExam を置き換える */
const EXAM_EVENTS=[
 {t:"友達が過去問のデータを送ってくれた。",f:x=>{x.rows.forEach(r=>r.p+=8)},d:{jin:1}},
 {t:"風邪をひいた。1日寝込んだ。",f:x=>{x.days--},d:{tai:-6}},
 {t:"教授が最終回で「ここ出す」と言った。",f:x=>{const r=pick(x.rows);r.p+=25;x.hint=r.n}},
 {t:"サークルの先輩から「今日だけ手伝って」と呼び出し。断れなかった。",f:x=>{x.days--},d:{jin:3}},
 {t:"中央図書館の自習席が全部埋まっていた。カフェで集中できなかった。",f:x=>{x.rows.forEach(r=>r.p-=4)}},
 {t:"シケプリの神が同じクラスにいた。",f:x=>{x.rows.forEach(r=>r.p+=5)}},
 {t:"恋人と喧嘩して、何も頭に入らなかった。",c:s=>s.flags.partner,f:x=>{x.rows.forEach(r=>r.p-=6)},d:{men:-3}},
 {t:"バイト先が試験期間のシフトを減らしてくれた。",c:s=>s.flags.job,f:x=>{x.days++}},
];
function prepInit(co){
  const p=co.prof,pm=p.m==="jin"?(S.s.jin-40)*.2:p.m==="att"?(S.mod<0?-10:4):p.m*.6;
  return clamp(Math.round(28+S.s.gaku*.3+S.mod*.8+pm+S.brain.ex*2+(co.kind==="再履修"?-6:0)+(co.lang?S.lang.m*2:0)+rnd(-8,8)),5,80);
}
function renderExam(){
  S.busy=true;stop();
  const name=`${TERMS[S.T]}の試験期間`;
  const X=S._exam=S._exam||{rows:S.tt.map(co=>({n:co.n,p:prepInit(co),c:co.c,kind:co.kind,prof:co.prof.n,scary:co.prof.m===-10||co.prof.m==="att",drop:0})),days:S.s.tai<20?4:5,day:1,kako:0,ev:0,sel:0,done:0,log:[]};
  if(!X.ev&&Math.random()<.6){X.ev=1;const cand=EXAM_EVENTS.filter(e=>!e.c||e.c(S));const e=pick(cand);e.f(X);if(e.d)applyD(e.d);X.log.unshift(e.t)}
  X.ev=1;
  const draw=()=>{
    X.rows.forEach(r=>r.p=clamp(r.p,0,100));
    const sel=X.rows[X.sel]||X.rows[0];
    const rows=X.rows.map((r,i)=>`<button class="xr ${i===X.sel?"on":""} ${r.drop?"drop":""}" data-r="${i}"><span class="xn">${esc(r.n)}${r.scary?` <span class="rar R">鬼</span>`:""}${X.hint===r.n?` <span class="rar SR">ヒント</span>`:""}</span><span class="xb"><span style="width:${r.p}%" class="${r.p>=70?"hi":r.p>=40?"mid":"lo"}"></span></span><span class="xp mono">${r.drop?"捨":r.p}</span></button>`).join("");
    const left=X.days-X.day+1;
    const acts=X.done?"":`
      <button class="choice" data-a="study" ${sel.drop?"disabled":""}><span class="l"><span>「${esc(sel.n.slice(0,14))}」を勉強する</span><small>準備度が上がる。体力を使う</small></span></button>
      <button class="choice" data-a="night" ${sel.drop||S.s.tai<15?"disabled":""}><span class="l"><span>徹夜で詰め込む</span><small>大きく上がるが、体力が削れて翌日に響く</small>${S.s.tai<15?`<small class="req ng">条件：体力15以上</small>`:""}</span></button>
      <button class="choice" data-a="kako" ${X.kako?"disabled":""}><span class="l"><span>過去問・シケプリを回す</span><small>人脈次第で全科目が上がる。期間中1回</small></span></button>
      <button class="choice" data-a="rest"><span class="l"><span>今日は休む</span><small>体力とメンタルを回復</small></span></button>
      <button class="choice" data-a="drop" ${sel.drop||sel.kind==="必修"||sel.kind==="再履修"?"disabled":""}><span class="l"><span>「${esc(sel.n.slice(0,14))}」を捨てる</span><small>その科目は落とす代わりに、他の科目に集中できる</small>${sel.kind==="必修"||sel.kind==="再履修"?`<small class="req ng">必修・再履修は捨てられない</small>`:""}</span></button>
      ${left===1?`<button class="choice" data-a="cheat"><span class="l"><span>カンニングペーパーを仕込む</span><small>最後の手段</small></span></button>`:""}`;
    $("#panel").innerHTML=`<section class="card event exam">
      <span class="eyebrow">${fmtLong(S.date)}・${TERMS[S.T]}</span>
      <h3>${name}</h3>
      <p class="xday">${X.done?"試験が終わった。":`${X.day}日目／${X.days}日　体力 <b class="mono">${S.s.tai}</b>　科目を選んで、今日の過ごし方を決める。`}</p>
      ${X.log.length?`<p class="xlog">${esc(X.log[0])}</p>`:""}
      <div class="xrows">${rows}</div>
      <div class="choices" id="ch">${acts}</div>
      ${X.done?`<div class="result"><p>${esc(X.feel)}</p><p class="muted">成績はMyWasedaで${S.T%2===0?"9月上旬":"3月上旬"}に発表される。</p>${X.ds&&X.ds.length?chips(X.ds):""}</div><div class="actions"><button class="btn" id="nx">続ける</button></div>`:""}
    </section>`;
    document.documentElement.classList.add("noscroll");syncCtrl();
    $("#panel").querySelectorAll(".xr").forEach(b=>b.onclick=()=>{X.sel=+b.dataset.r;sfx("tick");draw()});
    $("#panel").querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>act(b.dataset.a));
    if(X.done)bindNext();
  };
  const act=a=>{
    const sel=X.rows[X.sel]||X.rows[0];let ds=[];
    if(a==="study"){const g=Math.round(ri(12,20)*S.brain.grow*(S.s.men<25?.7:1));sel.p+=g;ds=applyD({tai:-3});X.log.unshift(`「${sel.n}」を勉強した。準備度 +${g}。`);sfx("tick")}
    else if(a==="night"){const g=ri(24,34);sel.p+=g;ds=applyD({tai:-10,men:-2});X.log.unshift(`徹夜。「${sel.n}」の準備度 +${g}。目の下が黒い。`);if(Math.random()<.15){const o=pick(X.rows.filter(r=>r!==sel));if(o){o.p-=15;X.log[0]+=`翌日の「${o.n}」で寝落ちした。`}}sfx("thud")}
    else if(a==="kako"){X.kako=1;const ok=Math.random()<pc(S.s.jin,45);if(ok){const g=ri(8,14);X.rows.forEach(r=>r.p+=g);ds=applyD({jin:2});X.log.unshift(`先輩から過去問が回ってきた。全科目の準備度 +${g}。`);sfx("good")}else{X.rows.forEach(r=>r.p+=2);ds=applyD({men:-3});X.log.unshift("過去問を持っている人が周りにいなかった。");sfx("bad")}}
    else if(a==="rest"){ds=applyD({tai:6,men:4});X.log.unshift("一日休んだ。少し回復した。");sfx("tap")}
    else if(a==="drop"){sel.drop=1;X.rows.filter(r=>!r.drop).forEach(r=>r.p+=5);X.log.unshift(`「${sel.n}」を捨てた。他の科目の準備度 +5。`);sfx("thud");draw();return}
    else if(a==="cheat"){return finish(1)}
    X.day++;
    if(X.day>X.days)return finish(0);
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
    refreshHud();draw();
  };
  sfx("pop");bgmDuck(.35);draw();
};
