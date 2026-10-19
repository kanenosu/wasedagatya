/* 4年間の目標（入学時に1つ選ぶ。エンディングで判定） */
const GOALS=[
 {id:"none",n:"特に決めない",t:"流れに身を任せる",check:()=>null},
 {id:"top",n:"一流企業に内定",t:"総合商社・外資・大手に入る",check:s=>!!s.job&&["S","A","L","O"].includes(s.job.tier)},
 {id:"gpa",n:"GPA 3.3以上で卒業",t:"学業で結果を出す",check:s=>s.ending.type==="grad"&&gpa()>=3.3},
 {id:"leader",n:"サークルの代表になる",t:"仲間に選ばれる",check:s=>s.post==="代表"},
 {id:"love",n:"恋人と一緒に卒業",t:"大学で出会って、卒業式も一緒に",check:s=>s.ending.type==="grad"&&!!s.flags.partner},
 {id:"money",n:"借金ゼロ・貯金100万円",t:"金に振り回されない",check:s=>s.ending.type==="grad"&&!s.flags.loan&&!s.flags.ribo&&s.kane>=100},
 {id:"abroad",n:"留学して世界を見る",t:"交換留学か海外大学院",check:s=>!!s.flags.abroad||(!!s.job&&s.job.tier==="O")},
 {id:"straight",n:"4年で、一度も留年せず卒業",t:"当たり前を当たり前にやる",check:s=>s.ending.type==="grad"&&s.ay<4},
];
const goal=()=>GOALS.find(g=>g.id===(S.goal||"none"))||GOALS[0];
function goalResult(){
  const g=goal();if(g.id==="none")return null;
  const ok=g.check(S);
  return {g,ok,text:ok?`目標「${g.n}」を達成した。`:`目標「${g.n}」は叶わなかった。`};
}
