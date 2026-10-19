/* 期末試験の選択肢と受験処理（カンニング含む） */
/* ---------- 試験 ---------- */
const EXAM_CH=[
 {label:"シケプリと過去問をかき集める",req:{jin:20},bonus:s=>(s.s.jin-40)*.35+6,d:{}},
 {label:"中央図書館にこもる",req:{tai:20},bonus:()=>10,d:{tai:-7,men:-3,gaku:1}},
 {label:"一夜漬け",req:{tai:10},bonus:()=>rnd(-10,16),d:{tai:-6}},
 {label:"諦めて単位を捨てる",bonus:()=>-28,d:{men:5}},
 {label:"カンニングペーパーを仕込む",cheat:1,bonus:()=>15,d:{men:-3}},
];
function sitExam(ch){
  const b=ch.bonus(S);
  if(ch.cheat&&Math.random()<.2){
    S.pending={T:S.T,rows:S.tt.map(co=>({...co,g:"F"})),void:"試験中の不正行為により、この学期に登録した全科目が無効になった。"};S.mod=0;
    const ds=applyD(ch.d);S._afterExam=()=>suspend(SUSP_MONTHS(),"定期試験での不正行為");
    return {ds,feel:"試験監督に肩を叩かれた。カンニングペーパーが見つかった。"};
  }
  const rows=S.tt.map(co=>{const sc=courseScore(co,b);return{...co,g:gradeOf(sc)}});
  S.pending={T:S.T,rows};S.mod=0;
  const avg=rows.reduce((a,r)=>a+GP[r.g],0)/Math.max(1,rows.length);
  return {ds:applyD(ch.d),feel:avg>=2.8?"手応えはかなりある。":avg>=1.8?"手応えは微妙。いくつか怪しい。":"終わった。何科目か確実に落とした気がする。"};
}
