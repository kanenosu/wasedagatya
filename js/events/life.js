/* 年齢、酒・タバコ・ギャンブル、停学、闇バイト、生活の出来事 */
/* ---------- 年齢 ---------- */
function age(){const d=S.date,y=d.getFullYear()-S.by,m=d.getMonth()+1;return (m<S.bd.m||(m===S.bd.m&&d.getDate()<S.bd.d))?y-1:y}
const adult=()=>age()>=20;

/* ---------- 停学 ---------- */
const SUSP_MONTHS=()=>S.fac.sci?3:S.fac.s==="教育"?1:S.fac.sils?6:2;
function suspend(months,reason){
  S.flags.teigaku=(S.flags.teigaku||0)+1;
  S.susp=months*30;S.mod-=15;
  applyD({men:-12,jin:-5});
  log(`停学${months}か月（${reason}）`);
  feed(`学部から停学${months}か月の処分が出た。理由は${reason}。`,null,"key");
  if(S.flags.shou){S.flags.shou=0;feed("給付型奨学金の受給資格を失った。",applyD({kane:-10}),"key")}
  if(S.flags.teigaku>=2)S.ending={type:"taigaku"};
}

/* ---------- 20歳未満の飲酒 ---------- */
function underageDrink(s){
  s.flags.udrink=(s.flags.udrink||0)+1;
  const r=Math.random();
  if(r<.12){
    applyD({tai:-20,kane:-3,men:-6});
    if(Math.random()<.5){s._txt="急性アルコール中毒で救急搬送された。病院から大学に連絡が入り、20歳未満の飲酒が発覚した。";s._after=()=>{suspend(1,"20歳未満の飲酒");if(s.circle)feed(`${s.circle.n}は飲酒事故で活動停止になった。`,applyD({jin:-6}),"key")}}
    else s._txt="急性アルコール中毒で救急搬送された。命に別状はなかったが、二度とやらないと誓った。";
  }else if(r<.2){
    s.flags.warn=(s.flags.warn||0)+1;applyD({men:-6});
    s._txt="店に通報が入り、学生生活課から呼び出された。厳重注意で済んだが、次はない。";
  }else{applyD({jin:3});s._txt="誰にも何も言われなかった。でも20歳未満の飲酒は法律違反だ。";}
}

/* ---------- 20歳の誕生日 ---------- */
const EV20={title:"20歳の誕生日",text:"20歳になった。酒もタバコも、法律上はもう自分で決めていい。",choices:[
 {label:"コンビニで酒を買ってみる",ok:{t:"年齢確認ボタンを堂々と押した。",d:{men:3},f:s=>s.flags.sake=1}},
 {label:"タバコも吸ってみる",ok:{t:"むせた。でも喫煙所に知り合いが増えそうだ。",d:{jin:2,tai:-2},f:s=>{s.flags.sake=1;s.flags.smoke=1}}},
 {label:"特に何も変わらない",ok:{t:"いつもどおりの一日だった。",d:{men:1}}},
]};

/* ---------- 闇バイト ---------- */
const YAMI2={title:"高額バイトの続き",text:"DMの返事が来た。「仕事の前に、身分証の写真と実家の住所を送ってください」",choices:[
 {label:"言われたとおりに送る",ok:{t:"「荷物を受け取るだけ」の仕事は、特殊詐欺の受け子だった。3回目の受け取りで逮捕された。",f:s=>s.ending={type:"taiho"}}},
 {label:"怖くなってブロックし、警察に相談する",ok:{t:"警察相談専用電話（#9110）に相談した。「送る前で本当によかった」と言われた。",d:{men:-4}}},
]};

/* ---------- 選択イベント（ランダム枠に追加） ---------- */
POOL.push(
 {w:3,terms:[0,9],when:s=>!!s.circle,title:"一気コール",text:s=>`${s.circle.n}の飲み会。一気コールが始まって、グラスが回ってきた。${adult()?"":`まだ${age()}歳だ。`}`,
  choices:s=>[
   {label:"一気する",chance:adult()?s=>pc(s.s.tai,45):undefined,
    ok:adult()?{t:"盛り上がった。翌日は使い物にならなかった。",d:{jin:4,tai:-5,kane:-3}}:{t:"",f:s=>underageDrink(s)},
    ng:{t:"急性アルコール中毒で救急搬送された。",d:{tai:-18,kane:-4,men:-6}}},
   {label:"コールを止める",req:{men:40},ok:{t:"空気は冷えたけど、誰も倒れなかった。",d:{jin:-2,gk:2}}},
   {label:"トイレに逃げる",ok:{t:"戻ったら次の人に回っていた。",d:{}}},
  ]},
 {w:2,terms:[0,9],when:s=>!s.flags.smoke,title:"喫煙所の誘い",text:s=>adult()?"キャンパスの指定喫煙所で、先輩に一本勧められた。":`サークルの先輩がタバコを差し出してきた。まだ${age()}歳だ。`,
  choices:s=>[
   {label:"吸ってみる",ok:adult()?{t:"喫煙所の常連になった。",d:{jin:3,tai:-2},f:s=>s.flags.smoke=1}:{t:"",f:s=>{if(Math.random()<.15){s.flags.warn=(s.flags.warn||0)+1;applyD({men:-6});s._txt="学生生活課の職員に見つかって呼び出された。厳重注意を受けた。"}else{s.flags.smoke=1;applyD({jin:2});s._txt="吸ってしまった。20歳未満の喫煙は違法だ。"}}}},
   {label:"断る",ok:{t:"「だよね」と笑われて終わった。",d:{}}},
  ]},
 {w:3,terms:[0,9],when:s=>s.flags.smoke,title:"タバコの値上げ",text:"タバコがまた値上がりした。毎月の出費が地味に痛い。",
  choices:[
   {label:"禁煙する",chance:s=>pc(s.s.men,55),ok:{t:"1か月吸わずにいられた。体が軽い。",d:{tai:4,men:-3},f:s=>s.flags.smoke=0},ng:{t:"3日で挫折した。",d:{men:-4}}},
   {label:"吸い続ける",ok:{t:"財布から千円札が消えていく。",d:{kane:-2}}},
  ]},
 {w:2,terms:[1,9],when:s=>adult(),title:"パチンコの誘い",text:"授業の空きコマ。先輩に「一緒に打ちに行こう」と誘われた。",
  choices:[
   {label:"打ちに行く",chance:()=>.35,ok:{t:"3万円勝った。これが一番まずい成功体験だ。",d:{kane:3,men:4},f:s=>s.flags.gamble=(s.flags.gamble||0)+1},ng:{t:"2時間で1万5千円が消えた。",d:{kane:-2,men:-3},f:s=>s.flags.gamble=(s.flags.gamble||0)+1}},
   {label:"断って図書館に行く",ok:{t:"えらい。",d:{gaku:2}}},
  ]},
 {w:2,terms:[1,9],when:s=>adult(),title:"競馬場",text:"友達に誘われて、初めて競馬場に行くことになった。",
  choices:[
   {label:"有り金を全部賭ける",chance:()=>.15,ok:{t:"大穴が来た。手が震えた。",d:{kane:7,men:6},f:s=>s.flags.gamble=(s.flags.gamble||0)+2},ng:{t:"全部消えた。帰りの電車賃を借りた。",d:{kane:-6,men:-6},f:s=>s.flags.gamble=(s.flags.gamble||0)+2}},
   {label:"100円だけ賭けて雰囲気を楽しむ",ok:{t:"外れた。でも楽しかった。",d:{men:3}}},
  ]},
 {w:1,terms:[0,9],title:"高額バイトの募集",text:"SNSで「日給5万円、即日払い。誰でもできる簡単作業」という募集が流れてきた。",
  choices:[
   {label:"無視する",ok:{t:"それが正解だ。",d:{}}},
   {label:"DMしてみる",ok:{t:"すぐに返事が来た。",f:s=>s.today.unshift(YAMI2)}},
  ]},
 {w:2,terms:[0,7],when:s=>s.s.men>=30,title:"レポートの締切前夜",text:"明日締切のレポートが白紙。ネットに似たテーマの文章が落ちている。",
  choices:[
   {label:"自力で書く",chance:s=>pc(s.s.tai,40),ok:{t:"徹夜で書き上げた。",d:{tai:-6,gaku:2}},ng:{t:"間に合わなかった。その科目はほぼ絶望だ。",d:{men:-5},f:s=>s.mod-=4}},
   {label:"コピペして出す",ok:{t:"",f:s=>{if(Math.random()<.18){s._txt="剽窃チェックに引っかかった。";s._after=()=>suspend(SUSP_MONTHS(),"レポートの剽窃")}else{s._txt="何も言われなかった。罪悪感だけが残る。";applyD({men:-3})}}}},
   {label:"諦めて出さない",ok:{t:"その科目は捨てた。",d:{men:2},f:s=>s.mod-=3}},
  ]},
);

/* ---------- 勝手に流れる生活の出来事 ---------- */
const LIFE_FLOW=[
 // 界隈
 {c:CC("kai"),w:3,t:"学生会館の廊下で、他の界隈サークルの幹部と立ち話。",d:{jin:1}},
 {c:s=>CC("kai")(s)&&adult(),w:2,t:"界隈の合同飲み会。学ランとスタッフパーカーが同じ卓にいる。",d:{jin:2,kane:-0.5,tai:-1}},
 {c:CC("kai"),m:[5],t:"100キロハイクの当日。界隈総出で本庄から早稲田までを支える。",d:{tai:-2,men:2}},
 {c:CC("kai"),m:[11],t:"早稲田祭の準備で、界隈中が学生会館に泊まり込んでいる。",d:{tai:-2,gk:1}},
 {c:s=>CC("kai")(s)&&s.circle.id!=="eiji",t:"ガーディアンの記事に、うちのサークルが載った。",d:{men:2}},
 {c:s=>CC("kai")(s)&&s.circle.id!=="jinbutsu",t:"人物研究会のサークルインタビューに答えた。",d:{gk:1}},
 {c:s=>CC("kai")(s)&&s.circle.id!=="benri",t:"便利舎の企画に芸能人が来た。客席を埋めるのを手伝った。",d:{jin:1}},
 {c:s=>CC("kai")(s)&&s.circle.id!=="hoshi",t:"鵬志会の友達が、議員事務所の名刺を見せてきた。",d:{}},
 {c:CC("kai"),t:"界隈の誰と誰が付き合っているという噂が、一晩で全員に回った。",d:{men:-1}},
 {c:s=>CC("kai")(s)&&s.ay>=2,t:"界隈のOB会に呼ばれた。就職先の話を聞けた。",d:{jin:2},f:s=>{s.flags.ob=1}},
 {c:CC("kai"),t:"界隈の内輪ノリについていけない日もある。",d:{men:-2}},
 {c:C("koyo"),w:2,t:"学ランと角帽と高下駄でキャンパスを歩いた。観光客に写真を撮られた。",d:{men:2,gk:1}},
 {c:C("soukei"),m:[5,10],t:"早慶戦の前に、神宮周辺の清掃ルートを確認した。",d:{tai:-1,gk:1}},
 {c:C("hoshi"),w:2,t:"議員事務所でひたすら封筒に宛名シールを貼った。",d:{gk:1,men:-1}},
 {c:C("kouken"),w:2,t:"広研の部会。早稲田祭のゲストの噂でもちきりだ。",d:{jin:1}},
 {c:C("benri"),w:2,t:"便利舎で、次の企画に呼ぶ芸能人のリストを作った。",d:{gk:1}},
 {c:C("jinbutsu"),w:2,t:"インタビューの文字起こしで夜が明けた。",d:{gk:1,tai:-1}},
 {c:C("zensouren"),t:"地元出身の先輩と、方言丸出しで飲んだ。",d:{jin:2,men:2}},
 // 酒・たばこ・ギャンブル
 {c:s=>adult()&&s.flags.sake,w:2,t:"家で缶チューハイを2本空けて寝落ちした。",d:{kane:-1,tai:-1}},
 {c:s=>adult(),w:2,t:"終電を逃して、漫画喫茶で朝を迎えた。",d:{kane:-2,tai:-2}},
 {c:s=>adult()&&s.flags.sake,t:"酒で記憶をなくした。スマホに知らない写真が残っている。",d:{men:-3}},
 {c:s=>adult()&&s.flags.sake,t:"二日酔いで1限を欠席した。",d:{tai:-2},f:s=>s.mod-=1},
 {c:s=>s.flags.smoke,w:2,t:"喫煙所でしか会わない友達ができた。",d:{jin:1}},
 {c:s=>s.flags.smoke,t:"指定の喫煙所まで遠い。授業の合間に往復した。",d:{tai:-1}},
 {c:s=>s.flags.smoke,t:"朝から咳が止まらない。",d:{tai:-2}},
 {c:s=>(s.flags.gamble||0)>=3,w:3,t:"負けを取り返そうとして、また打ってしまった。",d:{kane:-5,men:-3}},
 {c:s=>!adult(),t:"「まだ未成年なんで」と言ったら、ソフトドリンクを頼んでくれる先輩がいた。",d:{men:1}},
 // 生活
 {t:"マッチングアプリを入れて、3日で消した。",d:{men:-1}},
 {t:"Uber Eatsを頼みすぎて、口座の残高を見て固まった。",d:{kane:-1.5}},
 {c:s=>s.home.solo,w:2,t:"部屋にゴキブリが出た。朝まで眠れなかった。",d:{men:-3,tai:-1}},
 {c:s=>s.home.solo,t:"自炊のつもりが、冷蔵庫の野菜を全部腐らせた。",d:{kane:-1,men:-1}},
 {c:s=>!s.flags.dyed&&s.ay<2,t:"髪を明るく染めた。",d:{kane:-1,men:2},f:s=>s.flags.dyed=1},
 {c:s=>s.flags.dyed&&s.ay>=2,t:"就活に向けて、髪を黒に戻した。",d:{kane:-1},f:s=>s.flags.dyed=0},
 {t:"献血に行った。お菓子とジュースをもらった。",d:{tai:-1,men:2}},
 {c:s=>s.flags.loan,t:"奨学金の振込日。これも卒業後に返す金だ。",d:{men:-1}},
 {c:s=>s.ay>=1,t:"単位計算をしたら、思ったより足りていなかった。",d:{men:-2}},
 {t:"学生証をなくして再発行した。",d:{kane:-0.2,men:-1}},
 {t:"選挙の投票に行った。",d:{men:1}},
 {t:"友達の車でドライブ。深夜のファミレスで将来の話をした。",d:{men:3,kane:-0.3}},
 {t:"インスタの裏垢がサークルの先輩にバレかけた。",d:{men:-2}},
 {t:"寝る前のショート動画で3時間溶けた。",d:{tai:-1,men:-1}},
 {c:s=>(s.flags.warn||0)>0,t:"学生生活課に呼び出されたことを、まだ親に言えていない。",d:{men:-2}},
 {c:s=>(s.flags.teigaku||0)>0,t:"停学のことを、サークルの後輩はみんな知っている。",d:{men:-2,jin:-1}},
];
