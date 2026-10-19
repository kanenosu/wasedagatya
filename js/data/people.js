/* 登場人物（名前つき）、季節ラベル、4年間の物語の生成 */

/* ---------- 人物 ---------- */
// 役割: friend=同期の親友 / senpai=サークルや学科の先輩 / kohai=後輩 / lover=恋人 / parent=親
const KOHAI_N=["結衣","大翔","美月","悠真","陽菜","颯太","心春","碧","莉子","悠人","蒼","凪","陽翔","紗良","結月","朔","玲","杏奈","湊斗","ひなた","咲良","蓮斗","澪","琥珀"];
function newPerson(role){
  const sei=pick(SEI),mei=role==="kohai"?pick(KOHAI_N):pick(MEI);
  return {n:`${sei}${mei}`,s:mei,role,since:S.T,met:S.date?fmtLong(S.date):""};
}
function initPeople(){
  S.people={friend:newPerson("friend"),senpai:newPerson("senpai"),kohai:null,lover:null,ex:[],borrow:null};
  S.people.friend.fac=Math.random()<.6?S.fac.n:pick(FACS).n;
  S.people.senpai.year=ri(1,2);
}
// 名前を安全に取る（未設定なら役割名）
const PN=role=>{const p=S.people&&S.people[role];return p?p.s:({friend:"同期",senpai:"先輩",kohai:"後輩",lover:"恋人"})[role]};
const PF=role=>{const p=S.people&&S.people[role];return p?p.n:PN(role)};
// 恋人ができた・別れたときに人物を同期する（毎月と、イベント直後に呼ぶ）
function syncLover(){
  if(!S.people)return;
  if(S.flags.partner&&!S.people.lover){S.people.lover=newPerson("lover");S.loveCount=(S.loveCount||0)+1;log(`${S.people.lover.n}と付き合い始めた`)}
  if(!S.flags.partner&&S.people.lover){S.people.ex.push(S.people.lover);log(`${S.people.lover.n}と別れた`);S.people.lover=null}
}
function peopleHTML(){
  if(!S.people)return "";
  const p=S.people,row=[];
  row.push(`<span><small>親友</small>${esc(p.friend.n)}</span>`);
  row.push(`<span><small>先輩</small>${esc(p.senpai.n)}</span>`);
  if(p.kohai)row.push(`<span><small>後輩</small>${esc(p.kohai.n)}</span>`);
  if(p.lover)row.push(`<span><small>恋人</small>${esc(p.lover.n)}</span>`);
  else if(p.ex.length)row.push(`<span class="muted"><small>元恋人</small>${p.ex.length}人</span>`);
  return `<div class="people">${row.join("")}</div>`;
}

/* ---------- 季節ラベル（日付の横に出す） ---------- */
function seasonLabel(d){
  const m=d.getMonth()+1,day=d.getDate();
  if(m===4)return day<=10?"新学期":"春";
  if(m===5)return day<=7?"GW":"春";
  if(m===6)return "梅雨";
  if(m===7)return day>=10?"試験期間":"夏";
  if(m===8)return "夏休み";
  if(m===9)return day<=20?"夏休み":"秋学期";
  if(m===10)return "秋";
  if(m===11)return day<=7?"早稲田祭":"秋";
  if(m===12)return day>=20?"年末":"冬";
  if(m===1)return day<=7?"正月":day>=10?"試験期間":"冬";
  if(m===2)return "春休み";
  return day>=25?"新年度前":"春休み";
}

/* ---------- 4年間の物語（エンディングで表示） ---------- */
function story(){
  const p=S.people||{},f=S.flags,e=S.ending.type;
  const out=[];
  out.push(`${S.school.pref}の${S.school.n}を出て、${BASE_Y}年の春、${S.fac.n}に${S.route.n}で入学した。${S.home.n==="学生寮"?"学生寮に入り、":S.home.n==="実家から通学"?`${S.area.n}の実家から${S.area.min}分かけて通い、`:`${S.area.n}で一人暮らしを始め、`}実家は${S.wealth.n}ほうで、地頭は${S.brain.n}。第二外国語は${S.lang.n}を取った。`);
  if(p.friend)out.push(`最初にできた友達は${p.friend.n}。${S.circle?`${S.circle.n}に入り、${S.post?`${S.post}まで務めた。`:"4年間の居場所になった。"}`:"サークルには入らず、自分の時間を大事にした。"}`);
  const g=S.grades||[],fails=g.reduce((a,x)=>a+x.f,0);
  if(g.length)out.push(`成績は${gpa()>=3.3?"上位で安定していた":gpa()>=2.3?"可もなく不可もなく":"正直ギリギリだった"}。${fails?`落とした科目は合わせて${fails}科目。`:"4年間、一度も単位を落とさなかった。"}`);
  if(p.lover)out.push(`${p.lover.n}とは今も付き合っている。`);
  else if(p.ex&&p.ex.length)out.push(`${p.ex.map(x=>x.n).join("、")}と付き合い、そして別れた。`);
  if(f.teigaku)out.push(`停学処分を${f.teigaku}回受けた。`);
  if(f.loan)out.push(`卒業後に返す奨学金は${f.loan}万円。`);
  if(f.hakone)out.push("箱根駅伝を走った。一生の自慢だ。");
  if(f.buzz)out.push("SNSでバズって、知らない人に声をかけられるようになった。");
  if(e==="grad"){
    const t=S.job?S.job.tier:"D";
    out.push(S.ay>=4?"1年遅れたけれど、ちゃんと卒業した。":"4年で卒業した。");
    out.push(t==="D"?"進路はまだ決まっていない。それでも、ここからだ。":`進路は${S.job.label}。${["S","L","O","K","M"].includes(t)?"同期の誰よりも遠くへ行く。":["A","V","G","P","I"].includes(t)?"胸を張って言える進路だ。":"派手ではないけれど、自分で選んだ道だ。"}`);
  }else out.push({kamen:"早稲田を去り、別の大学で一からやり直す。",kyugaku:"心が先に折れて、休学届を出した。休むことも、たぶん必要だった。",stuck:"5年たっても卒業できず、まだ早稲田にいる。",joseki:"学費を払えず、除籍になった。",kyugakuWork:"借金を返すために休学して働く。戻ってくるつもりだ。",taiho:"闇バイトに手を出して逮捕され、退学になった。",taigaku:"2度目の停学で、早稲田を去った。",takarakuji:"宝くじが当たって、大学をやめた。",geinou:"スカウトされて、芸能界に飛び込んだ。"}[e]||"");
  return out.join("");
}
