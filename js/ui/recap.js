/* 年度末の振り返り（毎年3月31日） */
function yearStart(){S.ys={kane:S.kane,cr:S.cr,logN:S.log.length,ay:S.ay}}
function renderRecap(){
  S.busy=true;stop();
  const ys=S.ys||{kane:S.kane,cr:S.cr,logN:0,ay:S.ay};
  const gr=S.grades.filter(g=>Math.floor(g.T/2)===ys.ay);
  const gu=gr.reduce((a,g)=>a+g.got,0),ygpa=gr.length?gr.reduce((a,g)=>a+g.gpa,0)/gr.length:0,fails=gr.reduce((a,g)=>a+g.f,0);
  const dk=Math.round(S.kane-ys.kane);
  const events=S.log.slice(ys.logN).map(l=>l.t).filter(t=>!/成績：|収支/.test(t)).slice(-6);
  const verdicts=[];
  if(fails===0&&gr.length)verdicts.push("フル単の1年。文句なし。");
  else if(fails>=3)verdicts.push("落とした単位が多い。来年は取り返す年だ。");
  if(dk<=-20)verdicts.push("金がだいぶ減った。");
  else if(dk>=20)verdicts.push("貯金が増えた。");
  if(S.flags.partner)verdicts.push(`${PN("lover")}と付き合っている。`);
  if(S.s.men<30)verdicts.push("心が疲れている。無理をしないこと。");
  if(S.s.jin<25)verdicts.push("人とのつながりが薄くなっている。");
  if(typeof kyara==="function"&&kyara()==="ぼっち")verdicts.push("今年、大学で名前を呼ばれた回数は数えられる。「充実」という言葉は使わないでおく。");
  if(!S.circle&&!S.flags.partner&&!S.flags.job&&S.s.jin<35)verdicts.push("授業に出て、帰った。それを200日。");
  if(S.s.men<30&&S.s.jin>=50)verdicts.push("周りには人がいる。それでも、こんなに疲れている。");
  if(!verdicts.length)verdicts.push(S.s.jin>=40?"可もなく不可もなく。それも大学生活だ。":"可もなく不可もなく。誰も見ていない1年だった。");
  const y=ys.ay+1;
  showPanel(`<section class="card event recap">
    <span class="eyebrow">${fmtLong(S.date)}・年度末</span>
    <h3>${y}年目が終わった</h3>
    <div class="gsum">
      <div><small>今年の取得単位</small><b>${gu}</b></div>
      <div><small>今年のGPA</small><b>${gr.length?ygpa.toFixed(2):"—"}</b></div>
      <div><small>所持金の増減</small><b class="${dk<0?"neg":""}">${dk>=0?"+":""}${dk}<span>万</span></b></div>
      <div><small>累計単位</small><b>${S.cr}<span>/${NEED}</span></b></div>
    </div>
    ${events.length?`<div class="recap-ev"><small>今年のできごと</small><ul>${events.map(t=>`<li>${esc(t)}</li>`).join("")}</ul></div>`:""}
    <p>${esc(verdicts.join(""))}</p>
    <div class="actions"><button class="btn" id="nx">${y+1}年目へ</button></div>
  </section>`);
  log(`${y}年目が終わった`);
  bindNext();
}
