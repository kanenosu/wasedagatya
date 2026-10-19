/* 結末、称号、ランク、成績証明書 */
function title(){
  const e=S.ending.type;
  if(ENDINGS[e])return ENDINGS[e].title;
  if(e==="kamen")return "早稲田を踏み台にした人";
  if(e==="kyugaku")return "心が先に休学した";
  if(e==="joseki")return "学費が払えなかった人";
  if(e==="taiho")return "闇バイトに手を出した人";
  if(e==="taigaku")return "処分を重ねた人";
  if(e==="kyugakuWork")return "休学して働く人";
  if(e==="stuck")return "早稲田の主";
  if(S.job&&TIER_TITLE[S.job.tier])return TIER_TITLE[S.job.tier];
  if(S.job&&S.job.tier==="M")return "LUDOが生んだ芸人";
  if(S.job&&S.job.tier==="K")return "学生起業家";
  if(S.flags.hakone)return "箱根を走った人";
  if(S.ay>=4)return "5年生のベテラン";
  if(S.post==="代表")return `${S.circle?S.circle.n:"サークル"}の元代表`;
  if(gpa()>=3.4)return "中央図書館の住人";
  const top=STATS.slice().sort((a,b)=>S.s[b[0]]-S.s[a[0]])[0][0];
  return {gaku:"授業の最前列",jin:"高田馬場の顔",tai:"100キロ歩ける体",men:"メンタル最強の早稲田生",gk:"ガクチカ製造機"}[top];
}
function rankOf(){
  const e=S.ending.type;
  if(ENDINGS[e])return ENDINGS[e].rank;
  if(e==="kamen")return "EX";
  if(["kyugaku","stuck","joseki","kyugakuWork","taiho","taigaku"].includes(e))return "E";
  if(S.job&&(S.job.tier==="M"||S.job.tier==="K"))return "EX";
  const pts=TIER_PTS[S.job?S.job.tier:"D"]+(gpa()>=3.3?.5:0)-(S.ay>=4?1:0);
  return pts>=5?"S":pts>=4?"A":pts>=3?"B":pts>=2?"C":"D";
}
function renderEnd(){
  stop();document.documentElement.classList.remove("noscroll");const ov=$("#ov");if(ov)ov.remove();if($("#panel"))$("#panel").innerHTML="";
  const e=S.ending.type, rank=rankOf(), ttl=title();
  const out=ENDINGS[e]?ENDINGS[e].out:e==="taiho"?"逮捕・退学":e==="taigaku"?"退学":e==="kamen"?"国立大学に再入学":e==="kyugaku"?"休学":e==="joseki"?"除籍":e==="kyugakuWork"?"休学して就労":e==="stuck"?"6年目に突入":(S.job?S.job.label:TIERS.D);
  const head=ENDINGS[e]?ENDINGS[e].head:e==="taiho"?"特殊詐欺の受け子として逮捕された。大学からは退学処分が出た":e==="taigaku"?"2度目の停学処分。学部から退学を勧められ、早稲田を去った":e==="joseki"?"学費を払えず、除籍になった":e==="kyugakuWork"?"借金を返すため、休学して働くことにした":e==="kamen"?"早稲田を去った":e==="kyugaku"?"メンタルが尽きて、休学届を出した":e==="stuck"?"5年でも卒業できなかった":S.ay>=4?"1年遅れて卒業した":"4年で卒業した";
  const firstS=rank==="S"&&!meta.firstS;
  if(firstS)meta.firstS=S.n;
  meta.titles=meta.titles||{};meta.titles[ttl]=(meta.titles[ttl]||0)+1;
  meta.history.unshift({n:S.n,rank,fac:S.fac.s,out});meta.history=meta.history.slice(0,30);save(meta);
  const share=`【早稲田ガチャ】${S.n}周目：${S.fac.s}・${S.route.n}・${cname(S)}→${out}（${rank}ランク）GPA ${gpa().toFixed(2)}／${S.cr}単位「${ttl}」`;
  app.innerHTML=`
  <section class="idwrap">${idHTML()}</section>
  <section class="card cert">
    <div class="stamp" aria-hidden="true">早稲田<br>${e==="grad"?"卒業":"記録"}</div>
    <div class="head"><small>CERTIFICATE</small><h3>成績証明書</h3><span class="muted mono" style="font-size:12px">${fmtLong(S.date)}・早稲田生活 ${S.n} 周目</span></div>
    <div class="rank ${rank==="S"||rank==="EX"?"s":""}">${rank}</div>
    <div class="verdict"><span class="muted">${head}</span><strong>「${esc(ttl)}」</strong>${firstS?`<span style="color:var(--gold);font-weight:700">${S.n}周目で初めてのSランク</span>`:rank==="S"&&meta.firstS?`<span class="muted">初Sは ${meta.firstS} 周目</span>`:""}</div>
    <p class="story">${esc(story())}</p>
    <table>
      <tr><td>学部</td><td>${S.fac.n}（${S.fac.c}）</td></tr>
      <tr><td>入試方式</td><td>${S.route.n}</td></tr>
      ${S.flags.teigaku||S.flags.warn?`<tr><td>処分歴</td><td>${S.flags.teigaku?`停学${S.flags.teigaku}回 `:""}${S.flags.warn?`厳重注意${S.flags.warn}回`:""}</td></tr>`:""}
      <tr><td>住まい・実家</td><td>${S.home.n==="学生寮"?"学生寮":`${S.home.n}（${S.area.n}）`}／実家は${S.wealth.n}</td></tr>
      <tr><td>第二外国語</td><td>${S.lang.n}</td></tr>
      <tr><td>高校時代</td><td>${S.past.n}</td></tr>
      <tr><td>サークル</td><td>${esc(cname(S))}${S.post?`（${S.post}）`:""}${S.circle2?`、${esc(S.circle2.n)}`:""}</td></tr>
      ${S.zemi?`<tr><td>ゼミ</td><td>${S.zemi}</td></tr>`:""}
      <tr><td>取得単位</td><td class="mono">${S.cr} / ${NEED}</td></tr>
      <tr><td>GPA</td><td class="mono">${S.gu?gpa().toFixed(2):"—"} / 4.00</td></tr>
      <tr><td>所持金</td><td class="mono">${Math.round(S.kane)}万円${S.flags.loan?`（奨学金の返済 ${S.flags.loan}万円）`:""}${S.flags.ribo?"（リボ残高あり）":""}</td></tr>
      ${S.grades.length?`<tr><td>学期ごとのGPA</td><td class="mono" style="font-size:13px">${S.grades.map(g=>`${TERMS[g.T]} ${g.gpa.toFixed(2)}${g.f?`（F${g.f}）`:""}`).join("<br>")}</td></tr>`:""}
      <tr><td>進路</td><td><strong>${esc(out)}</strong></td></tr>
      <tr><td>最終ステータス</td><td class="mono" style="font-size:13px">${STATS.map(([k,l])=>`${l} ${S.s[k]}`).join("　")}</td></tr>
    </table>
  </section>
  <div class="share" id="share">${esc(share)}</div>
  <div class="actions"><button class="btn" id="again">もう一周する</button><button class="btn ghost" id="copy">結果をコピー</button><button class="btn ghost" id="home">トップへ</button></div>
  ${logBox()}`;
  $("#again").onclick=()=>{newRun();scrollTop()};
  $("#home").onclick=()=>{S=null;renderHome();scrollTop()};
  $("#copy").onclick=()=>{
    const b=$("#copy");
    Promise.resolve().then(()=>navigator.clipboard.writeText(share)).then(()=>b.textContent="コピーした").catch(()=>{const r=document.createRange();r.selectNodeContents($("#share"));const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent="選択したのでコピーして"});
  };
  scrollTop();
}
