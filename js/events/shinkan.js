/* 新歓：7枚のビラを順番に見て、1枚ずつ「入る／入らない」だけを決める。掛け持ちは2つまで（金がかかる）。
   「ビラを捨てて終わり」の選択肢は無い（間違えて未所属になるのを防ぐ）。入らなかった人は秋新歓や友達の紹介で途中加入できる */
/* 4つのジャンルから7枚（2・2・2・1）。同じジャンルの中では規模の大きい団体ほど出やすい（w は所属人数から）。体育会のビラは少なめ */
const CAT_FLYER_W={tennis:3,sports:3,dance:2,music:2,art:2,bunka:2,unei:2,intl:1.5,tech:1.5,kai:1,tai:1};
function flyerList(){
  const cats=[];const pool0=CATS.map(c=>({id:c.id,w:CAT_FLYER_W[c.id]||1}));
  while(cats.length<4&&pool0.length){const c=wpick(pool0);cats.push(c.id);pool0.splice(pool0.indexOf(c),1)}
  const out=[];const per=[2,2,2,1];
  cats.forEach((cat,i)=>{for(let k=0;k<per[i];k++){const pool=CIRCLES.filter(c=>c.cat===cat&&(!c.only||c.only(S.fac))&&(!c.sex||S.sex===c.sex)&&!out.includes(c.id));if(pool.length)out.push(wpick(pool).id)}});
  // 足りなければ他ジャンルから補う
  let guard=0;while(out.length<7&&guard++<20){const pool=CIRCLES.filter(c=>c.cat!=="tai"&&(!c.only||c.only(S.fac))&&(!c.sex||S.sex===c.sex)&&!out.includes(c.id));if(!pool.length)break;out.push(wpick(pool).id)}
  return out.sort(()=>Math.random()-.5);
}
const CAT_N=id=>(CATS.find(c=>c.id===id)||{}).n||"";
const curFly=()=>CIRCLES.find(c=>c.id===(S.flyers||[])[0]);
function nextFlyer(){
  // 今のビラは表示が終わるまで残す（タイトル表示に使う）。次のビラが開くときに捨てる
  S.flyDone=1;
  if(S.flyers.length>1&&!S.flyEnd)S._after=()=>S.today.unshift(EV.flyer);
  else if(!S.circle&&!S.flyEnd)S._txt=(S._txt||"")+" 新歓期が終わった。結局どこにも入らなかった。秋の新歓や、友達の紹介で途中から入る道はある。"
}
function joinFromFlyer(c){
  if(!S.circle){joinCircle(c);S._txt=`${c.n}に入った。${c.t?c.t+"。":""}`}
  else{S.circle2=c;applyD({jin:5,tai:-2,kane:-0.5});log(`${c.n}と掛け持ち`);S._txt=`${S.circle.n}と掛け持ちで${c.n}にも入った。会費と飲み会が倍になる。`}
}
EV.shinkan={title:"新歓期",text:s=>`4月のキャンパスはビラと勧誘の嵐。気づけば両手にビラが${ri(40,120)}枚。気になった団体の新歓に、順番に顔を出してみる。`,
 choices:[
  {label:"ビラをもらいに行く",sub:"7つの団体に順番に声をかけられる。1つずつ、入るか入らないか決める",ok:{t:"ビラの山から、いくつかを手に取った。",d:{jin:2},f:s=>{s.flyers=flyerList();s.flyEnd=0;s._after=()=>s.today.unshift(EV.flyer)}}},
  {label:"ビラを全部断る",sub:"サークルに入らない（途中から入ることはできる）",ok:{t:"新歓期が終わると、教室で話す相手がいないことに気づいた。",d:{men:-5,gaku:6},f:s=>{s.circle=null;s.flyers=[]}}},
 ]};
EV.flyer={when:s=>{if(s.flyDone){s.flyers.shift();s.flyDone=0}return !!curFly()},
 title:s=>curFly().n,
 text:s=>{const c=curFly(),n=s.flyers.length;return `【${CAT_N(c.cat)}】「${c.n}です！ 新歓やってます！」${c.t?` ${c.t}。`:""}${s.circle?` 今は${s.circle.n}${s.circle2?`と${s.circle2.n}`:""}に入っている。`:""}${n>1?`（${8-n}枚目／7枚。あと${n-1}枚）`:"（最後の1枚）"}`},
 choices:s=>{const c=curFly();const full=s.circle&&s.circle2;const isTai=c.cat==="tai";return[
  ...(full?[{label:"もう2つ入っている",sub:"掛け持ちは2つまで",ok:{t:"丁重に断った。",d:{},f:s=>nextFlyer()}}]:
   isTai?[{label:s.circle?"掛け持ちで入部する":"入部する",sub:"体力勝負",chance:s=>pc(s.s.tai,c.diff||60),ok:{t:"",d:{},f:s=>{joinFromFlyer(c);s._txt=`${c.n}に入部した。${c.t}。朝練の生活が始まる。`;nextFlyer()}},ng:{t:"",d:{men:-4},f:s=>{s._txt=`${c.n}の練習に参加したが、レベルが違いすぎた。入部は見送った。`;nextFlyer()}}}]:
   [{label:s.circle?`掛け持ちで入る`:"入る",sub:s.circle?"会費と時間が倍になる":c.sub||"",req:s.circle?{kane:1}:null,ok:{t:"",d:{},f:s=>{joinFromFlyer(c);nextFlyer()}}}]),
  {label:"入らない",sub:s.flyers.length>1?"次のビラへ":(s.circle?"新歓はここまで":"新歓はここまで。途中から入ることもできる"),ok:{t:"新歓の飯だけ食べて帰った。",d:{jin:1,kane:0.1},f:s=>nextFlyer()}},
 ]}};

/* 掛け持ちの看板行事と、どちらかに絞る話 */
EV.circle2Main={when:s=>!!s.circle2,title:s=>(s.circle2.ev||CAT_EV[s.circle2.cat]).title,
 text:s=>`掛け持ちの${s.circle2.n}。${(s.circle2.ev||CAT_EV[s.circle2.cat]).text}`,
 choices:s=>{const e=s.circle2.ev||CAT_EV[s.circle2.cat];return[
  {label:"本気で挑む",chance:s=>pc(s.s[e.stat],e.diff),ok:{t:e.ok[0],d:e.ok[1],f:e.ok[2]},ng:{t:e.ng[0],d:e.ng[1]}},
  {label:"ほどほどにやる",ok:{t:"無難に終わった。",d:{men:2,gk:1}}},
  {label:"本命のサークル優先で欠席",ok:{t:"向こうの同期から「最近来ないね」と言われた。",d:{jin:-3,men:2}}},
 ]}};
SCHED[2].push(["circle2Main",6,20]);SCHED[4].push(["circle2Main",11,25]);
EV.shibori={when:s=>!!s.circle&&!!s.circle2,title:"掛け持ちの限界",text:s=>`${s.circle.n}と${s.circle2.n}。合宿の日程が被った。会費も飲み会も二重で、財布と体が持たない。`,
 choices:s=>[
  {label:`${s.circle.n}に絞る`,ok:{t:"",d:{men:3,jin:-4},f:s=>{log(`${s.circle2.n}を辞めた`);s._txt=`${s.circle2.n}を辞めた。向こうの同期とは、たまに飯を食う仲になった。`;s.circle2=null}}},
  {label:`${s.circle2.n}に絞る`,ok:{t:"",d:{men:3,jin:-4},f:s=>{log(`${s.circle.n}を辞めた`);s._txt=`${s.circle.n}を辞めた。${s.circle2.n}が本命になった。`;s.circle=s.circle2;s.circle2=null;s.post=null}}},
  {label:"両方続ける",sub:"金と体力を削る",req:{kane:3,tai:40},ok:{t:"両方の合宿に半分ずつ出た。どっちの打ち上げでも「薄い」と言われた。",d:{kane:-3,tai:-8,jin:4}}},
 ]};
SCHED[1].push(["shibori",12,1]);SCHED[3].push(["shibori",5,12]);
POOL.push(
 {w:3,terms:[0,5],when:s=>!!s.circle2,title:"掛け持ちの板挟み",text:s=>`${s.circle.n}の飲み会と${s.circle2.n}のイベントが同じ夜。`,
  choices:s=>[
   {label:`${s.circle.n}へ`,ok:{t:"もう片方の同期から「裏切り者」とLINEが来た（冗談）。",d:{jin:2,kane:-0.4}}},
   {label:`${s.circle2.n}へ`,ok:{t:"本命の先輩が少し不機嫌だった。",d:{jin:2,kane:-0.4,men:-1}}},
   {label:"両方ハシゴ",req:{tai:35},ok:{t:"終電を逃してタクシーで帰った。",d:{jin:4,kane:-1.2,tai:-5}}},
  ]},
 {w:2,terms:[0,3],when:s=>!!s.circle2,title:"会費の二重払い",text:s=>`${s.circle.n}と${s.circle2.n}の年会費が同じ月に来た。合わせて${ri(1,2)}万円。`,
  choices:s=>[
   {label:"払う",req:{kane:2},ok:{t:"財布が軽い。",d:{kane:-1.5}}},
   {label:"片方は滞納",ok:{t:"会計の同期から催促のLINEが来た。",d:{jin:-3,men:-2}}},
  ]},
);
LIFE_FLOW.push(
 {c:s=>!!s.circle2,w:2,t:s=>`${s.circle2.n}のグループLINEが100件たまっていた。`,d:{men:-1}},
 {c:s=>!!s.circle2,t:s=>`${s.circle.n}の同期に「あっちのサークル、どう？」と聞かれた。`},
 {c:s=>!!s.circle2,t:"二つのサークルの新歓Tシャツが、クローゼットで喧嘩している。"},
);

/* 途中からサークルに入る：秋の新歓、友達の紹介、2年の春。入らなかった人・辞めた人に出る */
function lateJoin(s,how){
  const c=pickCircle(["tennis","dance","bunka","unei","kai","tai"].filter(k=>CATS.some(x=>x.id===k)));
  if(!c)return;
  joinCircle(c);applyD({jin:6,men:4});log(`${how}で${c.n}に入った`);
  s._txt=`${how}で${c.n}に入った。${c.t?c.t+"。":""}同期より半年遅れだが、顔はすぐ覚えてもらえた。`;
}
POOL.push(
 {w:5,terms:[1,1],when:s=>!s.circle,title:"秋の新歓",text:"秋学期のはじめ、サークルがもう一度ビラを配っている。春より人は少ないが、入りやすい雰囲気だ。",
  choices:[
   {label:"入る",sub:"ジャンルは成り行き",ok:{t:"",d:{},f:s=>lateJoin(s,"秋新歓")}},
   {label:"入らない",ok:{t:"今回も見送った。",d:{men:-1,gaku:2}}}]},
 {w:4,terms:[1,5],when:s=>!s.circle&&s.s.jin>=20,title:"友達の紹介",text:s=>`${PF("friend")}に「うちのサークル来なよ」と誘われた。知り合いがいる団体なら入りやすい。`,
  choices:[
   {label:"入る",ok:{t:"",d:{},f:s=>lateJoin(s,`${PF("friend")}の紹介`)}},
   {label:"入らない",ok:{t:"「気が向いたら」と言って、気が向かなかった。",d:{jin:-1}}}]},
 {w:4,terms:[2,2],when:s=>!s.circle,title:"2年からの新歓",text:"2年の春。新歓は1年生向けだが、「2年生も歓迎」と書いてあるビラが何枚かある。",
  choices:[
   {label:"入る",ok:{t:"",d:{},f:s=>lateJoin(s,"2年の春の新歓")}},
   {label:"入らない",ok:{t:"サークルなしの大学生活でいく、と決めた。",d:{men:2,gaku:2}}}]},
 {w:3,terms:[3,5],when:s=>!s.circle,title:"学生団体の募集",text:"SNSで学生団体のメンバー募集を見た。ビジネスコンテストの運営。経験不問。",
  choices:[
   {label:"応募する",req:{com:30},ok:{t:"",d:{},f:s=>lateJoin(s,"学生団体の募集")}},
   {label:"応募しない",ok:{t:"フォローだけした。",d:{}}}]},
);
LIFE_FLOW.push(
 {c:s=>!s.circle&&s.ay===0,w:2,t:"同期が新歓の話で盛り上がっている。入らなかった自分は、聞き役だった。",d:{men:-1}},
 {c:s=>!s.circle&&s.ay>=1,t:"サークルの集合写真がSNSに流れてきた。自分はどこにも写っていない。",d:{men:-1}},
);
