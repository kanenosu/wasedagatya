/* 画面の描画（ホーム、入学ガチャ、プレイ画面、イベントのポップアップ、試験、成績発表） */
/* ---------- 描画 ---------- */
const OKUMA_SVG=`<svg viewBox="0 0 320 130" preserveAspectRatio="xMidYMax meet"><g fill="currentColor"><rect x="24" y="18" width="40" height="112"/><path d="M22 18 L44 2 L66 18Z"/><rect x="0" y="108" width="320" height="22"/><rect x="64" y="56" width="256" height="52"/><rect x="80" y="40" width="224" height="18"/></g><g fill="var(--bg)"><circle cx="44" cy="34" r="8"/><rect x="34" y="60" width="6" height="14"/><rect x="48" y="60" width="6" height="14"/><rect x="34" y="84" width="6" height="14"/><rect x="48" y="84" width="6" height="14"/>${[0,1,2,3,4,5,6,7,8,9].map(i=>`<path d="M${84+i*23} 100 V76 a7 7 0 0 1 14 0 V100Z"/>`).join("")}</g><g stroke="currentColor" stroke-width="1.6" fill="none"><path d="M44 34 V28 M44 34 L48 36"/></g></svg>`;
function fmtLong(d){return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日（${WD[d.getDay()]}）`}
function hudHTML(){
  const t=S.T;
  const track=[0,1,2,3,4,5,6,7].map(i=>`<i class="${i<t?"done":i===t?"now":""}"></i>`).join("")+(t>=8?`<i class="extra"></i><i class="extra"></i>`:"");
  const meters=STATS.map(([k,l])=>`<div class="meter ${S.s[k]<25?"low":""}"><span>${l}</span><span class="bar"><span style="width:${S.s[k]}%"></span></span><span class="v">${S.s[k]}</span></div>`).join("");
  return `<div class="hud">
    <div class="hud-head"><span class="term">${TERMS[t]}</span><span class="who">単位 <b class="mono">${S.cr}</b>/${NEED}・GPA <b class="mono">${S.gu?gpa().toFixed(2):"—"}</b></span></div>
    <div class="term-track" aria-hidden="true">${track}</div>
    <div class="meters">${meters}</div>
    <div class="facts">
     <span>所持金 <b class="${S.kane<0?"neg":""}">${Math.round(S.kane)}</b>万円</span>
     ${S.flags.smoke?`<span>喫煙者</span>`:""}${S.susp>0?`<span class="neg">停学中 あと${S.susp}日</span>`:""}
     ${S.flags.loan?`<span>奨学金（貸与） <b>${S.flags.loan}</b>万円</span>`:""}${S.flags.ribo?`<span class="neg">リボ払い中</span>`:""}
    </div>
    ${peopleHTML()}
    ${S.tt.length?`<details class="tt" id="ttd"${S.ttOpen?" open":""}><summary>${TERMS[t]}の時間割・${S.tt.length}科目${S.tt.reduce((a,o)=>a+o.c,0)}単位</summary><div class="tt-wrap"><table>${S.tt.map(o=>`<tr><td class="mono">${o.slot}</td><td>${esc(o.n)}${o.kind!=="選択"?` <span class="kind">${o.kind}</span>`:""}</td><td class="mono">${o.c}</td><td class="pt">${esc(o.prof.n)}</td></tr>`).join("")}</table></div></details>`:""}
   </div>`;
}
function refreshHud(){const c=$("#idc");if(c){c.innerHTML=idHTML();const d=$("#ttd");if(d)d.ontoggle=()=>S.ttOpen=d.open}}
function polHTML(){return POL.map(p=>{const ok=reqOK(p.req);return `<button data-pol="${p.id}" aria-pressed="${S.pol===p.id}" ${ok?"":"disabled"} title="${esc(p.t+(ok?"":"（"+reqTxt(p.req)+"が必要）"))}">${p.n}</button>`}).join("")}
function refreshPol(){const el=$("#pol");if(!el)return;el.innerHTML=polHTML();el.querySelectorAll("[data-pol]").forEach(b=>b.onclick=()=>{S.pol=b.dataset.pol;refreshPol();syncCtrl()})}
function renderLife(){
  setLap();
  app.innerHTML=`
  <section class="clock" aria-label="日付と再生">
    <div class="clock-row">
      <div class="date"><span id="date">${fmtLong(S.date)}</span><span class="season" id="season">${seasonLabel(S.date)}</span></div>
      <div class="ctrl"><button class="play" id="pp">停止</button>${SPEEDS.map((s,i)=>`<button data-sp="${i}" aria-pressed="${spd()===i}">${s.n}</button>`).join("")}</div>
    </div>
    <div class="status" id="status"></div>
    <div class="pol-wrap"><span class="pol-label">行動方針</span><div class="pol" id="pol"></div></div>
  </section>
  <section class="idwrap" id="idc" aria-label="学生証">${idHTML()}</section>
  <div class="panel" id="panel"></div>
  <section class="card feed"><h4>できごと</h4><ol id="feed"></ol></section>`;
  $("#pp").onclick=()=>{if(S.busy)return;(timer?pause:play)()};
  app.querySelectorAll("[data-sp]").forEach(b=>b.onclick=()=>{meta.spd=+b.dataset.sp;save(meta);app.querySelectorAll("[data-sp]").forEach(x=>x.setAttribute("aria-pressed",x===b));if(timer)run()});
  for(const f of S.feed)$("#feed").append(feedLi(f));
  refreshPol();refreshHud();
}
function updateClock(){const d=$("#date");if(d)d.textContent=fmtLong(S.date);const sn=$("#season");if(sn){const l=seasonLabel(S.date);if(sn.textContent!==l)sn.textContent=l}}
function syncCtrl(){
  const b=$("#pp"),st=$("#status");if(!b)return;
  b.textContent=timer?"停止":"再生";
  const P=pol();
  st.innerHTML=(S.busy?"<b>イベント発生。</b>選ぶと時間が進む":timer?`${TERMS[S.T]}を進行中`:"一時停止中")+`　方針「${esc(P.n)}」：${esc(P.t)}${S.skip>0?`　<b>入院中（あと${S.skip}日）</b>`:""}`;
  refreshPol();
}
function feedLi(f){
  const li=document.createElement("li");if(f.cls)li.className=f.cls;
  li.innerHTML=`<span class="dt">${f.dt}</span><span class="tx"><span>${f.rar?`<span class="rar ${f.rar}">${f.rar}</span>`:""}${esc(f.t)}</span>${f.ds&&f.ds.length?`<span class="mini">${f.ds.map(([k,v])=>`<span class="${v>0?"up":"down"}">${LABEL[k]}${v>0?"+":""}${v}</span>`).join("")}</span>`:""}</span>`;
  return li;
}
function feed(t,ds,cls,rar){
  const f={dt:`${S.date.getFullYear()%100}/${fmt(S.date)}`,t,ds,cls,rar};
  S.feed.unshift(f);if(S.feed.length>150)S.feed.pop();
  const ol=$("#feed");if(!ol)return;
  ol.prepend(feedLi(f));
  while(ol.children.length>150)ol.lastChild.remove();
}
function chips(list){return `<div class="chips">${list.map(([k,v])=>`<span class="chip ${v>0?"up":"down"}">${LABEL[k]} ${v>0?"+":""}${v}${k==="kane"?"万":""}</span>`).join("")}</div>`}
function showPanel(html){const p=$("#panel");p.innerHTML=html;document.documentElement.classList.add("noscroll");p.scrollTop=0;syncCtrl();const f=p.querySelector(".choice:not([disabled])");if(f)f.focus({preventScroll:true})}
function bindNext(){const b=$("#nx");b.onclick=()=>{$("#panel").innerHTML="";document.documentElement.classList.remove("noscroll");S.busy=false;if(S.ending)return renderEnd();refreshHud();S.userPaused?syncCtrl():run()};b.focus({preventScroll:true})}
function setLap(){$("#lap").innerHTML=`早稲田生活 <b>${S?S.n:meta.runs+1}</b> 周目`}
function scrollTop(){try{window.scrollTo({top:0,behavior:reduce?"auto":"smooth"})}catch(e){}}
function logBox(){
  if(!S.log.length)return "";
  return `<section class="card log"><h4>年表</h4><ol>${S.log.slice().reverse().map(l=>`<li><span>${esc(l.term)}</span><span>${esc(l.t)}</span></li>`).join("")}</ol></section>`;
}

function renderHome(){
  setLap();
  const h=meta.history.slice(0,8);
  app.innerHTML=`
  <section class="hero">
    <div class="okuma" aria-hidden="true">${OKUMA_SVG}</div>
    <h2>早稲田ガチャ</h2>
    <p class="lead">学部も、サークルも、実家の太さも選べない。<br>早稲田の4年間を、引いて生きる。</p>
    <div class="row"><button class="btn big" id="go">入学ガチャを回す</button></div>
    <ul class="hints">
      <li>日付は勝手に進み、大事な場面で止まる</li>
      <li>実在の科目、サークル、行事。400種類以上の出来事</li>
      <li>金が尽きれば借金、心が尽きれば休学。結末はいろいろ</li>
    </ul>
    ${meta.runs?`<span class="muted small">これまで ${meta.runs} 回入学した</span>`:""}
  </section>
  ${meta.titles&&Object.keys(meta.titles).length?`<section class="card hist"><h4>集めた称号・${Object.keys(meta.titles).length}種類</h4><div class="titles">${Object.entries(meta.titles).sort((a,b)=>b[1]-a[1]).slice(0,16).map(([t,n])=>`<span>${esc(t)}${n>1?`<small>×${n}</small>`:""}</span>`).join("")}</div></section>`:""}
  ${h.length?`<section class="card hist"><h4>これまでの早稲田生活</h4><ul>${h.map(x=>`<li><span class="mono muted">${x.n}周目</span><span class="r">${esc(x.rank)}</span><span>${esc(x.fac)}・${esc(x.out)}</span></li>`).join("")}</ul>${meta.firstS?`<p class="muted" style="margin:8px 0 0;font-size:13px">初めてSランクを取ったのは ${meta.firstS} 周目</p>`:""}</section>`:""}`;
  app.insertAdjacentHTML("beforeend",`<p class="disc">このゲームはフィクションです。実在のサークル名・店名・行事名を使っていますが、特定のサークルや個人を誹謗中傷する意図はありません。20歳未満の飲酒・喫煙は法律で禁止された違法行為です。ゲーム内の処分や確率は実際の大学の規程とは異なります。</p>`);
  $("#go").onclick=newRun;
}

function renderGacha(){
  setLap();
  const homeName=S.home.n==="学生寮"?"学生寮":`${S.home.n}（${S.area.n}）`;
  const slots=[["学部",S.fac.n,`${S.fac.c}キャンパス`],["入試方式",S.route.n,S.route.t],["住まい",homeName,S.area.t||S.home.t],["実家の太さ",S.wealth.n,S.wealth.t],["第二外国語",S.lang.n,S.lang.t],["高校時代",S.past.n,S.past.t]];
  const pools=[FACS.map(x=>x.n),ROUTES.map(x=>x.n),HOMES.map(x=>x.n),WEALTH.map(x=>x.n),LANGS.map(x=>x.n),PASTS.map(x=>x.n)];
  app.innerHTML=`
  <section class="card">
   <div class="id-band"><span>入学ガチャ</span><span>${S.n}周目</span></div>
   <div class="id-body">${slots.map((x,i)=>`<div class="slot spin" id="sl${i}"><small>${x[0]}</small><strong>？？？</strong><span class="tag">&nbsp;</span></div>`).join("")}</div>
  </section>
  <section class="card setup" id="setup" hidden>
   <div class="setup-row">
    <label for="nm">名前</label>
    <div class="nm-row"><input id="nm" maxlength="12" value="${esc(S.name)}" autocomplete="off"><button class="btn ghost sm" id="nmr" type="button">別の名前</button><button class="btn ghost sm" id="fcr" type="button">顔を引き直す</button></div>
   </div>
   <div class="setup-row">
    <span class="lbl">性別（昂揚会など、入会条件がある団体の判定にだけ使う）</span>
    <div class="sex-row">${[["m","男性"],["f","女性"],["x","答えない"]].map(([k,l])=>`<button class="kw sx" data-sx="${k}" aria-pressed="${S.sex===k}">${l}</button>`).join("")}</div>
    <span class="lbl">難易度</span>
    <div class="sex-row">${Object.entries(DIFF).map(([k,d])=>`<button class="kw df" data-df="${k}" aria-pressed="${S.diff===k}"><b>${d.n}</b><small>${d.t}</small></button>`).join("")}</div>
    <p class="muted" style="margin:0;font-size:13px">${S.ronin?"1浪して入学。":"現役で入学。"}20歳になるまで酒とタバコは違法だ。</p>
   </div>
   <div id="idprev"></div>
  </section>
  <div class="actions"><button class="btn" id="enter" hidden>入学する</button><button class="btn ghost" id="reroll" hidden>引き直す</button></div>`;
  const prev=()=>{$("#idprev").innerHTML=idHTML()};
  let i=0;
  const reveal=()=>{
    if(i>=slots.length){$("#enter").hidden=false;$("#reroll").hidden=false;$("#setup").hidden=false;prev();return}
    const el=$("#sl"+i),st=el.querySelector("strong"),tg=el.querySelector(".tag"),pool=pools[i],x=slots[i];
    let k=0;const iv=setInterval(()=>{st.textContent=pick(pool);if(++k>7){clearInterval(iv);st.textContent=x[1];tg.textContent=x[2];el.classList.remove("spin");el.classList.add("hit");i++;reveal()}},reduce?0:50);
  };
  reveal();
  $("#nm").oninput=e=>{S.name=e.target.value.trim()||"名無し";prev()};
  $("#nmr").onclick=()=>{S.name=pick(SEI)+" "+pick(MEI);$("#nm").value=S.name;prev()};
  $("#fcr").onclick=()=>{S.face=newFace();prev()};
  app.querySelectorAll(".df").forEach(b=>b.onclick=()=>{S.diff=meta.diff=b.dataset.df;save(meta);app.querySelectorAll(".df").forEach(x=>x.setAttribute("aria-pressed",x===b))});
  app.querySelectorAll(".sx").forEach(b=>b.onclick=()=>{S.sex=b.dataset.sx;app.querySelectorAll(".sx").forEach(x=>x.setAttribute("aria-pressed",x===b))});
  $("#enter").onclick=()=>{startLife();scrollTop()};
  $("#reroll").onclick=()=>{meta.runs--;save(meta);newRun()};
}

function renderEvent(e){
  S.busy=true;stop();
  const choices=val(e.choices).filter(c=>!c.when||c.when(S));
  const rq=c=>c.req||REQ[c.label];
  if(!choices.some(c=>reqOK(rq(c))))choices.push({label:"何もできない",sub:"どの選択肢も条件を満たしていない",ok:{t:"見送るしかなかった。",d:{men:-4}}});
  showPanel(`
  <section class="card event">
    <span class="eyebrow">${fmtLong(S.date)}・${TERMS[S.T]}</span>
    <h3>${esc(val(e.title))}</h3>
    <p>${esc(val(e.text))}</p>
    <div class="choices" id="ch">${choices.map((c,i)=>{const r=rq(c),ok=reqOK(r),p=c.chance?c.chance(S):null;
      return `<button class="choice" data-i="${i}" ${ok?"":"disabled"}><span class="l"><span>${esc(c.label)}</span>${c.sub?`<small>${esc(c.sub)}</small>`:""}${r?`<small class="req ${ok?"":"ng"}">条件：${esc(reqTxt(r))}</small>`:""}</span>${!ok?`<span class="pct lock">選べない</span>`:""}</button>`}).join("")}</div>
  </section>`);
  $("#panel").querySelectorAll(".choice:not([disabled])").forEach(b=>b.onclick=()=>resolve(e,choices[+b.dataset.i]));
}
function resolve(e,c){
  let ok=true,roll=null,p=c.chance?c.chance(S):null;
  if(p!=null){roll=Math.random();ok=roll<p}
  const r=ok?c.ok:c.ng;
  S._txt=null;S._hd=null;S._rar=null;S._after=null;
  if(r.f)r.f(S);
  const ds=applyD(val(r.d)||{});
  syncLover();
  const text=val(r.t)||S._txt||"";
  const ttl=val(e.title);
  if(e!==EV.honsenko)log(`${ttl}：${text.replace(/。.*$/,"")}`);
  feed(`${ttl}：${text}`,ds,"key");
  $("#ch").outerHTML=`<div class="result ${ok?"":"ng"}">
    <span class="roll">${esc(c.label)}</span>
    <p>${esc(text)}</p>
    ${e===EV.honsenko&&S.job?`<p><strong>進路：${esc(S.job.label)}</strong></p>`:""}
    ${ds.length?chips(ds):""}
  </div>
  <div class="actions"><button class="btn" id="nx">続ける</button></div>`;
  if(S._after){const a=S._after;S._after=null;a()}
  refreshHud();
  bindNext();
}

function renderExam(){
  S.busy=true;stop();
  const name=S.T%2===0?"春学期末試験":"秋学期末試験";
  const cr=S.tt.reduce((a,o)=>a+o.c,0);
  const scary=S.tt.filter(o=>o.prof.m===-10||o.prof.m==="att");
  showPanel(`
  <section class="card event">
    <span class="eyebrow">${fmtLong(S.date)}・${TERMS[S.T]}</span>
    <h3>${name}</h3>
    <p>${S.tt.length}科目${cr}単位分の試験とレポートが一気に来た。${S.mod>0?"これまでの立ち回りが効いていて、今学期は少し有利だ。":S.mod<0?"今学期は欠席が多い。正直ヤバい。":""}</p>
    ${scary.length?`<p class="prof"><span class="rar R">要注意</span>${scary.map(o=>`「${esc(o.n)}」は${esc(o.prof.n)}`).join("、")}。</p>`:`<p class="prof muted">今学期は鬼の教授がいない。チャンスだ。</p>`}
    <div class="choices" id="ch">${EXAM_CH.map((c,i)=>{const ok=reqOK(c.req);return `<button class="choice" data-i="${i}" ${ok?"":"disabled"}><span class="l"><span>${c.label}</span>${c.sub?`<small>${c.sub}</small>`:""}${c.req?`<small class="req ${ok?"":"ng"}">条件：${esc(reqTxt(c.req))}</small>`:""}</span>${ok?"":`<span class="pct lock">選べない</span>`}</button>`}).join("")}</div>
  </section>`);
  $("#panel").querySelectorAll(".choice:not([disabled])").forEach(b=>b.onclick=()=>{
    const c=EXAM_CH[+b.dataset.i],r=sitExam(c);
    if(S._afterExam){const a=S._afterExam;S._afterExam=null;a()}
    feed(`${name}が終わった。${r.feel}成績発表は${S.T%2===0?"9月上旬":"3月上旬"}。`,r.ds,"key");
    $("#ch").outerHTML=`<div class="result">
      <span class="roll">${c.label}</span>
      <p>${r.feel}</p><p class="muted">成績はMyWasedaで${S.T%2===0?"9月上旬":"3月上旬"}に発表される。</p>
      ${r.ds.length?chips(r.ds):""}
    </div><div class="actions"><button class="btn" id="nx">続ける</button></div>`;
    refreshHud();
    bindNext();
  });
}
function renderGrades(){
  S.busy=true;stop();
  const pd=S.pending;S.pending=null;
  const name=pd.T%2===0?"春学期":"秋学期";
  syncCtrl();
  const ov=document.createElement("div");ov.className="overlay";ov.id="ov";ov.setAttribute("role","dialog");ov.setAttribute("aria-label","成績発表");
  ov.innerHTML=`<div class="ov-inner">
    <div class="mw-bar"><span class="mw-logo">MyWaseda</span><span class="mw-user">${esc(S.name)}</span></div>
    <div class="mw-crumb">成績照会 ＞ ${BASE_Y+Math.floor(pd.T/2)}年度 ${name} ＞ ${S.fac.n}</div>
    <h2 class="mw-title">${TERMS[pd.T]}の成績</h2>
    <p class="muted">${fmtLong(S.date)} 正午。成績が公開された。震える指で成績照会を開く。</p>${pd.void?`<p class="void">${esc(pd.void)}</p>`:""}
    <div class="mw-live"><span id="gprog">0/${pd.rows.length}科目</span><span>集計中のGPA <b id="glive">—</b></span></div>
    <div class="tt-wrap"><table class="gtable big"><thead><tr><th>科目名</th><th>区分</th><th>単位</th><th>評価</th></tr></thead><tbody id="gt"></tbody></table></div>
    <div id="gsum"></div>
  </div>`;
  document.body.append(ov);document.documentElement.classList.add("noscroll");
  const tb=$("#gt");let i=0,gp=0,gu=0,got=0,f=[];
  const step=()=>{
    if(i>=pd.rows.length)return finish();
    const r=pd.rows[i++];
    gu+=r.c;gp+=GP[r.g]*r.c;
    if(r.g!=="F"){got+=r.c;S.passed.push(r.n)}else{f.push(r);if(r.kind==="選択"||r.kind==="全学")S.failedEl.push(r.n);else S.retake.push({n:r.n,c:r.c,sem:pd.T%2,x:r.lab?"lab":r.lang?"lang":""})}
    const tr=document.createElement("tr");
    tr.innerHTML=`<td>${esc(r.n)}</td><td><span class="kind">${r.kind}</span></td><td class="mono">${r.c}</td><td class="g g-${r.g==="A+"?"Ap":r.g}">${r.g}</td>`;
    tb.append(tr);
    $("#gprog").textContent=`${i}/${pd.rows.length}科目`;$("#glive").textContent=(gp/gu).toFixed(2);
    try{tr.scrollIntoView({block:"nearest",behavior:reduce?"auto":"smooth"})}catch(e){}
    setTimeout(step,reduce?0:r.g==="F"||r.g==="A+"?520:300);
  };
  const finish=()=>{
    S.gp+=gp;S.gu+=gu;S.cr+=got;
    const tg=gu?gp/gu:0;
    const comment=f.length>=3?"親に見せられない成績表だ。":f.length?`「${f[0].n}」を落とした。${f[0].kind==="必修"||f[0].kind==="再履修"?"必修なので来年また取り直しだ。":""}`:tg>=3.5?"ほぼA+。中央図書館に住んだ甲斐があった。":"フル単。とりあえず安心した。";
    const ds=applyD(f.length>=3?{men:-8}:f.length?{men:-3}:tg>=3.5?{men:6,gaku:2}:{men:3});
    S.grades.push({T:pd.T,gpa:tg,got,f:f.length});
    log(`${TERMS[pd.T]}成績：GPA ${tg.toFixed(2)}、${got}単位取得${f.length?`、${f.length}科目落単`:"、フル単"}`);
    feed(`${TERMS[pd.T]}の成績発表。学期GPA ${tg.toFixed(2)}、${got}単位取得${f.length?`、${f.length}科目落とした`:"、フル単"}。`,ds,"key");
    $("#gsum").innerHTML=`<div class="gsum"><div><small>学期GPA</small><b>${tg.toFixed(2)}</b></div><div><small>取得単位</small><b>${got}<span>/${gu}</span></b></div><div><small>累計GPA</small><b>${gpa().toFixed(2)}</b></div><div><small>累計単位</small><b>${S.cr}<span>/${NEED}</span></b></div></div>
      <p>${esc(comment)}</p>${ds.length?chips(ds):""}<div class="actions"><button class="btn" id="nx">MyWasedaを閉じる</button></div>`;
    refreshHud();
    const b=$("#nx");try{b.scrollIntoView({block:"nearest"})}catch(e){}
    b.onclick=()=>{ov.remove();document.documentElement.classList.remove("noscroll");S.busy=false;if(S.ending)return renderEnd();refreshHud();S.userPaused?syncCtrl():run()};
    b.focus({preventScroll:true});
  };
  setTimeout(step,reduce?0:600);
}
