/* 不可避イベント・奇跡イベント・追加のエンディングと進路
   timeline.js と job.js の後に読み込む（planTerm と job を外側から拡張している） */

/* ---------- 途中で終わるエンディング ---------- */
const ENDINGS={
 takarakuji:{title:"宝くじで人生が変わった人",head:"宝くじが当たり、早稲田をやめた",out:"中退して悠々自適",rank:"EX"},
 geinou:{title:"スカウトされた人",head:"芸能事務所に所属し、大学を去った",out:"芸能界デビュー",rank:"EX"},
};

/* ---------- 追加の進路 ---------- */
Object.assign(TIERS,{P:"国家公務員・地方公務員",L:"法曹（予備試験ルート）",O:"海外の大学院",I:"インフルエンサー",F:"家業を継ぐ",N:"地域おこし協力隊"});
const TIER_TITLE={P:"国を支える早大生",L:"法曹への切符",O:"世界に出た人",I:"フォロワー10万人",F:"家業の跡取り",N:"地域に飛び込んだ人"};
const TIER_PTS={S:5,A:4,B:3,C:2,D:1,V:4,G:4,P:3.5,L:5,O:5,I:3,F:3,N:3};

const baseJob=job;
job=function(s,mode){
  const fin=(tier,t)=>{s.job={tier,label:TIERS[tier]};s._txt=t;log(`進路：${TIERS[tier]}`)};
  const fallback=pre=>{baseJob(s,"safe");s._txt=pre+s._txt};
  if(mode==="koumuin"){Math.random()<pc(s.s.gaku*.6+s.s.men*.4,55)?fin("P","公務員試験に最終合格した。親が一番喜んだ。"):fallback("公務員試験は不合格。民間に切り替えた。")}
  else if(mode==="shiho")fin("L","予備試験に続いて司法試験の勉強を続ける。法曹の道が見えた。");
  else if(mode==="kaigai")fin("O","推薦状と奨学金で、海外の大学院に進学が決まった。");
  else if(mode==="influencer"){Math.random()<.5?fin("I","フォロワーは15万人。企業案件だけで食べていけそうだ。"):fallback("伸び悩んで案件が途切れた。慌てて就活した。")}
  else if(mode==="kagyou")fin("F","実家の会社を継ぐことにした。社長室の椅子が待っている。");
  else if(mode==="chiiki")fin("N","地方の町で地域おこし協力隊になる。家賃は東京の3分の1だ。");
  else baseJob(s,mode);
};
const baseHonsenko=EV.honsenko.choices;
const _oldHonsenko=s=>[
 ...baseHonsenko(s),
 {label:"公務員試験を受ける",req:{gaku:50},ok:{t:"",f:s=>job(s,"koumuin")}},
 ...(s.flags.yobi?[{label:"法曹を目指す",sub:"予備試験に合格している",ok:{t:"",f:s=>job(s,"shiho")}}]:[]),
 ...(s.flags.kaigai?[{label:"海外の大学院に行く",sub:"教授の推薦がある",ok:{t:"",f:s=>job(s,"kaigai")}}]:[]),
 ...(s.flags.buzz?[{label:"インフルエンサーで食べていく",sub:"フォロワー10万人",ok:{t:"",f:s=>job(s,"influencer")}}]:[]),
 ...(s.wealth.kagyou?[{label:"家業を継ぐ",sub:"家業のある家だけの選択肢",ok:{t:"",f:s=>job(s,"kagyou")}}]:[]),
 {label:"地域おこし協力隊に応募する",sub:"東京を出る",req:{men:40},ok:{t:"",f:s=>job(s,"chiiki")}},
];

/* ---------- 不可避イベント（選択肢は受け止め方だけ） ---------- */
const FATE=[
 {once:"online",title:"不可避：オンライン授業",text:"感染症の流行で、今学期の授業はすべてオンラインになった。サークル活動も止まった。",choices:[
  {label:"東京の部屋で受ける",ok:{t:"画面の中の同期としか話さない日々が続いた。",d:{jin:-10,men:-6,gaku:2}}},
  {label:"実家に帰って受ける",ok:{t:"家賃がもったいないが、メシは出る。",d:{jin:-8,men:-2,kane:-3}}},
 ]},
 {once:"bankrupt",when:s=>s.wealth.tier!=="細い",title:"不可避：実家の倒産",text:"実家の会社が倒産した。来月から仕送りが止まる。",choices:[
  {label:"バイトを増やして自分で稼ぐ",ok:{t:"方針をバイト漬けにした。",d:{men:-12},f:s=>{s.wealth={...s.wealth,tier:"細い",inc:0,oj:0,kagyou:0};s.pol="work"}}},
  {label:"給付型奨学金を探す",chance:s=>pc(s.s.gaku,55),ok:{t:"家計急変の枠で採用された。",d:{men:-8,kane:20},f:s=>{s.wealth={...s.wealth,tier:"細い",inc:0,oj:0,kagyou:0};s.flags.shou=1}},ng:{t:"間に合わなかった。",d:{men:-14},f:s=>s.wealth={...s.wealth,tier:"細い",inc:0,oj:0,kagyou:0}}},
 ]},
 {title:"不可避：祖父の死",text:"祖父が亡くなったと連絡が来た。小さい頃によく遊んでもらった。",choices:[
  {label:"葬儀のために帰省する",ok:{t:"久しぶりに親戚が集まった。祖父の話で少しだけ笑えた。",d:{men:-10,kane:-3}}},
 ]},
 {once:"zemiEnd",when:s=>s.zemi&&s.zemi!=="なし",title:"不可避：ゼミの解散",text:"ゼミの教授が他の大学に移ることになり、ゼミが解散した。",choices:[
  {label:"別のゼミに拾ってもらう",chance:s=>pc(s.s.jin,45),ok:{t:"知り合いの先輩のゼミに入れてもらえた。",d:{men:-3}},ng:{t:"どこにも入れなかった。",d:{gk:-6,men:-6},f:s=>s.zemi="なし"}},
 ]},
 {title:"不可避：骨折",text:"自転車で転んで、右手首を骨折した。全治2か月。",choices:[
  {label:"左手でノートを取る",ok:{t:"字が読めない。",d:{tai:-15,kane:-3},f:s=>s.mod-=6}},
 ]},
 {title:"不可避：同期の退学",text:"いつも隣に座っていた同期が、大学を辞めた。",choices:[
  {label:"最後に飲みに行く",ok:{t:"「お前は卒業しろよ」と言われた。",d:{men:-6,jin:-4}}},
 ]},
 {once:"crash",when:s=>!!s.circle,title:"不可避：サークルの解散",text:s=>`${s.circle.n}で不祥事が起き、大学から活動停止の処分が出た。事実上の解散だ。`,choices:[
  {label:"受け入れる",ok:{t:"居場所がなくなった。",d:{jin:-12,men:-8},f:s=>{log(`${s.circle.n}が活動停止`);s.circle=null;s.post=null}}},
 ]},
 {title:"不可避：物価高",text:"家賃の更新で値上げを言い渡された。食費も上がっている。",choices:[
  {label:"受け入れる",ok:{t:"毎月の余裕がさらに減った。",d:{kane:-8,men:-3}}},
 ]},
];

/* ---------- 奇跡イベント ---------- */
const MIRACLE=[
 {once:"lottery",title:"奇跡：宝くじ",text:"なんとなく買った宝くじが、1000万円当たった。",choices:[
  {label:"大学をやめて自由に生きる",ok:{t:"退学届を出した。",f:s=>s.ending={type:"takarakuji"}}},
  {label:"全額貯金して学生を続ける",ok:{t:"誰にも言わずに口座に入れた。",d:{kane:1000,men:15}}},
 ]},
 {once:"scout",title:"奇跡：スカウト",text:"原宿を歩いていたら、芸能事務所の人に声をかけられた。",choices:[
  {label:"事務所に入る",chance:()=>.4,ok:{t:"ドラマの端役が決まった。大学に通う時間がない。",f:s=>s.ending={type:"geinou"}},ng:{t:"3か月で契約を切られた。",d:{men:-8}}},
  {label:"断る",ok:{t:"名刺だけ財布に入れておいた。",d:{men:3}}},
 ]},
 {once:"buzz",title:"奇跡：大バズり",text:"何気なく投稿した早稲田あるあるの動画が大バズりして、フォロワーが10万人を超えた。",choices:[
  {label:"本気で発信を続ける",ok:{t:"企業から案件の依頼が来るようになった。",d:{jin:10,men:8,kane:10},f:s=>s.flags.buzz=1}},
  {label:"怖くなってアカウントを消す",ok:{t:"平穏が戻った。",d:{men:2}}},
 ]},
 {once:"kaigai",when:s=>s.s.gaku>=60&&s.ay>=2,title:"奇跡：教授の推薦",text:"授業で議論した教授から、海外大学院の奨学金に推薦したいと言われた。",choices:[
  {label:"推薦を受ける",ok:{t:"推薦状を書いてもらえることになった。",d:{gk:10,gaku:4},f:s=>s.flags.kaigai=1}},
  {label:"就職するので、と断る",ok:{t:"少しだけ惜しい。",d:{}}},
 ]},
 {once:"yobi",when:s=>s.fac.s==="法"&&s.s.gaku>=60&&s.ay>=2,title:"奇跡：予備試験",text:"独学で続けてきた司法試験予備試験の論文式。手応えがあった。",choices:[
  {label:"結果を待つ",chance:s=>pc(s.s.gaku,80),ok:{t:"合格していた。法学部の伝説になった。",d:{gk:18,men:12},f:s=>s.flags.yobi=1},ng:{t:"不合格だった。来年また挑む。",d:{men:-8}}},
 ]},
 {once:"savior",title:"奇跡：駅のホーム",text:"駅のホームで倒れた人を介抱したら、大企業の役員だった。後日、お礼の食事に誘われた。",choices:[
  {label:"食事に行く",ok:{t:"「就活で困ったら連絡しなさい」と名刺をもらった。",d:{jin:8,men:5},f:s=>s.flags.ob=1}},
 ]},
 {once:"homerun",title:"奇跡：神宮のホームランボール",text:"早慶戦の外野席。早稲田のホームランボールが、自分の手に飛び込んできた。",choices:[
  {label:"高く掲げる",ok:{t:"スタンド中が沸いた。一生の宝物だ。",d:{men:15,jin:5}}},
 ]},
];

/* 学期の日程に、不可避イベント（30%）と奇跡イベント（6%）を差し込む */
const basePlanTerm=planTerm;
planTerm=function(T){
  basePlanTerm(T);
  S.fateUsed=S.fateUsed||{};
  const insert=(list,p)=>{
    if(Math.random()>=p)return;
    const cand=list.filter(e=>(!e.once||!S.fateUsed[e.once])&&(!e.when||e.when(S)));
    if(!cand.length)return;
    const e=pick(cand);if(e.once)S.fateUsed[e.once]=1;
    const dt=T%2===0?dateIn(T,pick([5,6,7,8]),ri(1,28)):dateIn(T,pick([10,11,12,2]),ri(1,28));
    S.sched.push({k:dkey(dt),ev:e});S.sched.sort((a,b)=>a.k-b.k);
  };
  insert(FATE,.3);
  insert(MIRACLE,.06);
};

/* 不可避・奇跡まわりの流れる出来事 */
ALLF.push(
 {c:s=>s.fateUsed&&s.fateUsed.online&&s.T<=(s.fateOnlineEnd??=s.T),w:3,t:"オンライン授業の画面を切って、昼まで寝た。",d:{tai:1},f:s=>s.mod-=1},
 {c:s=>s.flags.buzz,w:2,t:"知らない人からDMで相談が100件届いていた。",d:{men:-2,jin:1}},
 {c:s=>s.flags.buzz,t:"企業案件の撮影で、授業を1コマ休んだ。",d:{kane:3},f:s=>s.mod-=1},
 {c:s=>s.kane>=500,t:"口座の残高を見て、ニヤニヤしてしまった。",d:{men:2}},
);
