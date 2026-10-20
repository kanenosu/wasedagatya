/* プレイヤー自身が死ぬ結末。超低確率で、毎日の判定で起きる。自死は入れない（事故・急性アル中・病気・熱中症・過労・火事）。
   基本確率は1日あたり 1/100000（4年で約1.5%）。飲酒運転・自転車・大量飲酒・体力不足・バイト漬けなどで上がる。
   死因は状況で決まる。ENDINGS に結末、epilogue に「10年後」を足す。広告ページは出さない */
const DEATHS={
 shiboJiko:{title:"早稲田で生涯を終えた人",head:"交差点で信号無視のトラックにはねられ、亡くなった",out:"死亡（交通事故）",rank:"†",feed:"明治通りの横断歩道。トラックの音を、聞いた記憶はない。",
  w:s=>1},
 shiboJitensha:{title:"早稲田で生涯を終えた人",head:"自転車で帰る途中に事故に遭い、亡くなった",out:"死亡（自転車事故）",rank:"†",feed:"深夜の坂道。ブレーキを握ったのが先か、ヘッドライトが先か。",
  w:s=>(s.flags.bike?2:0)+(s.flags.drunkride?4:0)},
 shiboAru:{title:"早稲田で生涯を終えた人",head:"飲み会のあと、急性アルコール中毒で亡くなった",out:"死亡（急性アルコール中毒）",rank:"†",feed:"一気の声。倒れたあと、誰も救急車を呼ばなかった。",
  w:s=>adult()?((s.flags.drink||0)>=2?4:(s.flags.drink||0)>=1?2:.5):(s.flags.udrink?2:0)},
 shiboByoki:{title:"早稲田で生涯を終えた人",head:"突然の病で倒れ、そのまま亡くなった",out:"死亡（病死）",rank:"†",feed:"レポートを書いている途中、頭の奥で何かが切れる音がした。",
  w:s=>s.s.tai<15?3:s.s.tai<30?1.5:.6},
 shiboNecchu:{title:"早稲田で生涯を終えた人",head:"真夏の炎天下で熱中症になり、亡くなった",out:"死亡（熱中症）",rank:"†",feed:"7月の神宮。応援席で意識が遠くなった。",
  w:s=>{const m=s.date.getMonth()+1;return (m===7||m===8)?(s.s.tai<30?3:1):0}},
 shiboKaro:{title:"早稲田で生涯を終えた人",head:"深夜バイトと授業の両立の末に倒れ、亡くなった",out:"死亡（過労）",rank:"†",feed:"週6のシフト明け。始発のホームで座り込んで、そのまま。",
  w:s=>(s.pol==="work"&&s.s.tai<20)?3:0},
 shiboKaji:{title:"早稲田で生涯を終えた人",head:"アパートの火事で亡くなった",out:"死亡（火災）",rank:"†",feed:"隣室からの出火。古い木造アパートは、逃げる時間をくれなかった。",
  w:s=>s.home.solo?.4:0},
};
const DEATH_BASE=1/100000;
const isDeath=e=>!!DEATHS[e];
function deathRisk(s){
  let r=1;
  if(s.flags.drunkride)r*=3;
  if((s.flags.drink||0)>=2)r*=2;
  if(s.s.tai<15)r*=3;else if(s.s.tai<30)r*=1.5;
  if(s.pol==="work")r*=1.3;
  if(s.flags.bike)r*=1.3;
  if(s.flags.weed)r*=1.5;
  return Math.min(r,10); // 全部重なっても10倍（4年で約14%）まで
}
function deathCheck(){
  if(!S||S.busy||S.ending||!S.started||S.skip>0)return false;
  if(Math.random()>=DEATH_BASE*deathRisk(S))return false;
  const cand=Object.entries(DEATHS).map(([k,v])=>({k,w:v.w(S)})).filter(x=>x.w>0);
  if(!cand.length)return false;
  const k=wpick(cand).k;
  feed(DEATHS[k].feed,null,"key");log(DEATHS[k].head);
  S.ending={type:k};stop();renderEnd();return true;
}
for(const k in DEATHS)ENDINGS[k]={title:DEATHS[k].title,head:DEATHS[k].head,out:DEATHS[k].out,rank:DEATHS[k].rank};
/* 毎日の進行に割り込む */
const _tickDeath=tick;
tick=function(){if(deathCheck())return;_tickDeath()};
/* 10年後：本人はいない */
const _epilogueDeath=epilogue;
epilogue=function(){
  if(!isDeath(S.ending.type))return _epilogueDeath();
  const c=S.circle?`${S.circle.n}の同期は`:"学科の同期は";
  const love=S.people&&S.people.lover?`${S.people.lover.n}は、しばらく大隈講堂の前を通れなかった。`:"";
  return `${c}、毎年その日に集まる。${love}親は、学生証を今も財布に入れている。${S.flags.counsel?"相談していた窓口の人が、葬儀に来ていた。":""}`;
}
