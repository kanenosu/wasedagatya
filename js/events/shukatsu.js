/* 就活の解像度を上げる：志望業界、段階制の本選考（ES→Webテスト→GD→一次→最終）、特別選択肢、就活イベント群
   timeline.js と fate.js の後に読み込む */

/* ---------- 志望業界（3年春に選ぶ） ---------- */
const INDS=[
 {id:"shosha",n:"総合商社",t:"体育会とガクチカの世界",mode:"all"},
 {id:"consul",n:"コンサル・外資",t:"ケース面接と地頭",mode:"all"},
 {id:"kinyu",n:"金融",t:"メガバンク、証券、保険",mode:"safe"},
 {id:"maker",n:"メーカー",t:"安定。理工は技術職も",mode:"safe"},
 {id:"it",n:"IT・通信",t:"SIerからメガベンチャーまで",mode:"safe"},
 {id:"media",n:"広告・マスコミ",t:"倍率は地獄。放研・広研が強い",mode:"all"},
 {id:"venture",n:"ベンチャー",t:"裁量と不安定",mode:"venture"},
 {id:"koumuin",n:"公務員",t:"筆記試験と面接",mode:"koumuin"},
];
const ind=()=>INDS.find(i=>i.id===S.ind)||INDS[2];
EV.gyokai={title:"志望業界を決める",text:"3年の春。就活サイトのプロフィールに「志望業界」の欄がある。どこを第一志望にする？",
 choices:s=>[
  ...INDS.map(i=>({label:i.n,sub:i.t,ok:{t:`第一志望は${i.n}。`,f:s=>{s.ind=i.id;log(`志望業界：${i.n}`)}}})),
  {label:"まだ決めない",ok:{t:"決められなかった。周りは動き始めている。",d:{men:-2},f:s=>s.ind="kinyu"}},
 ]};
SCHED[4].push(["gyokai",4,15]);

/* ---------- 段階制の本選考 ---------- */
// 各段階でスコアを積む。最後に job() に渡す
const JR=()=>S.jobRun||(S.jobRun={bonus:0,strikes:0});
const addJ=(b,t)=>{const j=JR();j.bonus+=b;if(b<0)j.strikes++;return t};
const stage=(id,title,text,choices)=>{EV[id]={title,text,choices,jobStage:1};return EV[id]};

stage("jobES","ES提出",s=>`${ind().n}の本選考。まずはES。「学生時代に最も力を入れたこと」400字。`,s=>[
 {label:"4年間で一番の経験を正直に書く",ok:{t:s=>addJ(4,"書きながら、自分の4年間を思い出した。"),d:{gk:2}}},
 ...(s.flags.hakone?[{label:"箱根駅伝を走った話を書く",sub:"特別",ok:{t:s=>addJ(14,"箱根を走った学生のESは、人事が必ず読む。"),d:{men:4}}}]:[]),
 ...(s.flags.king?[{label:"早稲田王になった話を書く",sub:"特別",ok:{t:s=>addJ(10,"「早稲田王とは？」と面接で必ず聞かれる。つかみは完璧だ。"),d:{men:3}}}]:[]),
 ...(s.post==="代表"?[{label:`${s.circle?s.circle.n:"サークル"}の代表経験を書く`,sub:"特別",ok:{t:s=>addJ(8,"組織を動かした話は、どの業界でも通る。"),d:{}}}]:[]),
 ...(s.flags.otoko?[{label:"男祭りで夢を叫んだ話を書く",sub:"特別・賭け",chance:()=>.5,ok:{t:s=>addJ(12,"人事が爆笑した。「会いたい」と連絡が来た。"),d:{men:5}},ng:{t:s=>addJ(-6,"書類で落ちた。真面目な会社だった。"),d:{men:-4}}}]:[]),
 {label:"盛って書く",chance:s=>pc(s.s.com,55),ok:{t:s=>addJ(6,"バレなかった。面接で深掘りされたら終わりだ。"),d:{}},ng:{t:s=>addJ(-8,"矛盾を突かれて、ESの段階で見抜かれた。"),d:{men:-6}}},
 {label:"ネットのテンプレを使う",ok:{t:s=>addJ(-4,"人事は同じ文章を100回読んでいる。"),d:{}}},
]);
stage("jobWeb","Webテスト",s=>"ES通過。次はWebテスト。SPIか玉手箱か、企業によって違う。",s=>[
 ...(s.flags.spi?[{label:"対策済み。普通に解く",sub:"特別",ok:{t:s=>addJ(6,"秋冬に固めた対策が効いた。余裕で通過。"),d:{men:2}}}]:[]),
 {label:"ぶっつけで解く",chance:s=>pc(s.s.gaku+s.brain.ex*2,52),ok:{t:s=>addJ(3,"なんとか通過した。"),d:{}},ng:{t:s=>addJ(-6,"非言語で時間切れ。ボーダーに届かなかった。"),d:{men:-5}}},
 {label:"解答集を使う",sub:"賭け",chance:()=>.7,ok:{t:s=>addJ(4,"通過した。でも何も身についていない。"),d:{men:-2}},ng:{t:s=>addJ(-15,"面接で同じ問題を出されて、答えられなかった。不正を疑われた。"),d:{men:-10}}},
]);
stage("jobGD","グループディスカッション",s=>`${ind().n}のGD。テーマは「${pick(["10年後の日本に必要なサービス","当社の新規事業を提案せよ","大学生の読書量を増やすには","無人島に持っていく3つのもの"])}」。6人、30分。`,s=>[
 ...(s.s.com>=50&&s.circle?[{label:"学注で鍛えた声で仕切る",sub:"特別",ok:{t:s=>addJ(8,"最初の10秒で場を取った。面接官がメモを取った。"),d:{com:2}}}]:[]),
 ...(s.circle&&s.circle.cat==="unei"?[{label:"会議を回してきた経験で進行役",sub:"特別",ok:{t:s=>addJ(8,"3時間会議の経験が、30分のGDを楽勝にした。"),d:{}}}]:[]),
 {label:"進行役を買って出る",chance:s=>pc(s.s.com,50),ok:{t:s=>addJ(6,"全員の意見を引き出せた。"),d:{com:2}},ng:{t:s=>addJ(-5,"仕切ろうとして空回りした。クラッシャー扱いされた。"),d:{men:-5}}},
 {label:"タイムキーパーで堅実に",ok:{t:s=>addJ(2,"目立たないが減点もない。通過した。"),d:{}}},
 {label:"黙る",ok:{t:s=>addJ(-8,"一言も発さずに終わった。"),d:{men:-3}}},
]);
stage("jobI1","一次面接",s=>`一次面接。若手の社員が2人。「${pick(["なぜ当社ですか","学生時代に力を入れたことは","挫折経験を教えてください","あなたを一言で表すと"])}」`,s=>[
 ...(s.flags.ob?[{label:"OB訪問で聞いた社風を交えて話す",sub:"特別",ok:{t:s=>addJ(8,"「よく調べていますね」。面接官の目が変わった。"),d:{}}}]:[]),
 ...(s.flags.early?[{label:"リファラル枠。先輩の名前を出す",sub:"特別",ok:{t:s=>addJ(10,"面接官が先輩の同期だった。終始なごやかだった。"),d:{men:3}}}]:[]),
 ...(s.flags.intern>=2?[{label:"長期インターンの実績を数字で話す",sub:"特別",ok:{t:s=>addJ(8,"「学生でそこまで？」と驚かれた。"),d:{}}}]:[]),
 {label:"準備した答えを話す",chance:s=>pc(s.s.com*.6+s.s.gk*.4,50),ok:{t:s=>addJ(5,"手応えあり。通過。"),d:{}},ng:{t:s=>addJ(-5,"深掘りに答えられず、沈黙が続いた。"),d:{men:-5}}},
 {label:"その場で考えて正直に話す",chance:s=>pc(s.s.com*.5+s.s.men*.5,52),ok:{t:s=>addJ(7,"用意していない言葉が、一番響いたらしい。"),d:{men:3}},ng:{t:s=>addJ(-4,"まとまらなかった。"),d:{men:-3}}},
]);
stage("jobFinal","最終面接",s=>`最終面接。役員が3人。${ind().id==="consul"?"ケース面接がある。「日本のラーメン屋の市場規模は？」":ind().id==="shosha"?"「海外の僻地に5年行けますか」":ind().id==="media"?"「最近面白かったコンテンツとその理由は」":"「入社したら何をしたいですか」"}`,s=>[
 ...(s.s.gaku>=70?[{label:"逆質問で役員を唸らせる",sub:"特別",ok:{t:s=>addJ(10,"役員が「それ、うちの課題なんだよ」と身を乗り出した。"),d:{men:4}}}]:[]),
 ...(s.flags.wasekichi?[{label:"ワセキチ全開で早稲田愛を語る",sub:"特別・賭け",chance:()=>.5,ok:{t:s=>addJ(12,"役員が早稲田OBだった。「都の西北」の話で盛り上がった。"),d:{men:6}},ng:{t:s=>addJ(-8,"役員が慶應OBだった。"),d:{men:-6}}}]:[]),
 ...(ind().id==="consul"&&s.brain.ex>=5?[{label:"フェルミ推定を暗算で組み立てる",sub:"特別",ok:{t:s=>addJ(10,"地頭が効いた。役員が頷きながらメモした。"),d:{}}}]:[]),
 ...(ind().id==="shosha"&&s.s.tai>=70?[{label:"「どこでも行けます」と即答する",sub:"特別",ok:{t:s=>addJ(8,"体育会の顔で言い切った。"),d:{}}}]:[]),
 ...(ind().id==="media"&&s.circle&&["hoken","kouken","benri","eiji"].includes(s.circle.id)?[{label:`${s.circle.n}で作った企画の話をする`,sub:"特別",ok:{t:s=>addJ(10,"作品を見せたら、役員が最後まで見た。"),d:{}}}]:[]),
 {label:"志望動機を全力で",chance:s=>pc(s.s.com*.5+s.s.men*.3+s.s.gk*.2,55),ok:{t:s=>addJ(6,"言い切った。"),d:{}},ng:{t:s=>addJ(-6,"途中で声が震えた。"),d:{men:-5}}},
 {label:"緊張で頭が真っ白",ok:{t:s=>addJ(-5,"何を話したか覚えていない。"),d:{men:-6}}},
]);
EV.jobResult={title:"選考結果",jobResult:1,text:"最終面接から1週間。知らない番号から電話が鳴った。",
 choices:s=>[{label:"電話に出る",ok:{t:"",f:s=>{const j=JR();s.flags.jobBonus=j.bonus-j.strikes*2;job(s,ind().mode);s.flags.jobBonus=0;s.jobRun=null;s._txt=(j.bonus>=20?"4年間の全部が、この電話のためにあった気がした。":j.bonus<=0?"覚悟はしていた。":"")+s._txt}}}]};

// 本選考の入口を作り直す：会社を受けるルートは段階制、それ以外は従来どおり
EV.honsenko.text=s=>`いよいよ本選考。志望業界は${ind().n}。${s.flags.intern?"インターンの経験は武器になりそうだ。":""}${s.flags.hakone?"面接官は全員、箱根の話を聞きたがるだろう。":""}`;
EV.honsenko.choices=s=>[
 {label:`${ind().n}の本選考を受ける`,sub:"ES、Webテスト、GD、一次、最終",ok:{t:"エントリーボタンを押した。ここから数か月、気が抜けない。",f:s=>{s.jobRun={bonus:0,strikes:0};s.today.push(EV.jobES,EV.jobWeb,EV.jobGD,EV.jobI1,EV.jobFinal,EV.jobResult)}}},
 ...(s.fac.sci?[{label:"学校推薦でメーカーの技術職",sub:"特別・理工",ok:{t:"",f:s=>{s.flags.jobBonus=12;job(s,"safe");s.flags.jobBonus=0;s._txt="学校推薦。1回の面接でほぼ決まった。"+s._txt}}}]:[]),
 ...(s.circle&&s.circle.id==="hoshi"&&s.flags.giin?[{label:"議員秘書になる",sub:"特別・鵬志会",ok:{t:"",f:s=>{s.job={tier:"P",label:"議員秘書"};s._txt="インターン先の議員事務所に、そのまま秘書として採用された。";log("進路：議員秘書")}}}]:[]),
 ...(s.fac.sci||s.flags.grad?[{label:"大学院に進学する",ok:{t:"",f:s=>job(s,"grad")}}]:[]),
 ...(s.flags.startup?[{label:"自分の会社を続ける",ok:{t:"",f:s=>job(s,"startup")}}]:[]),
 ...((s.flags.ukeru||0)>=1&&s.circle&&s.circle.id==="ludo"?[{label:"芸人になる",ok:{t:"",f:s=>job(s,"geinin")}}]:[]),
 {label:"公務員試験を受ける",req:{gaku:50},ok:{t:"",f:s=>job(s,"koumuin")}},
 ...(s.flags.yobi?[{label:"法曹を目指す",ok:{t:"",f:s=>job(s,"shiho")}}]:[]),
 ...(s.flags.kaigai?[{label:"海外の大学院に行く",ok:{t:"",f:s=>job(s,"kaigai")}}]:[]),
 ...(s.flags.buzz?[{label:"インフルエンサーで食べていく",ok:{t:"",f:s=>job(s,"influencer")}}]:[]),
 ...(s.wealth.kagyou?[{label:"家業を継ぐ",ok:{t:"",f:s=>job(s,"kagyou")}}]:[]),
 {label:"地域おこし協力隊に応募する",req:{men:40},ok:{t:"",f:s=>job(s,"chiiki")}},
];

/* ---------- 就活イベント群（3〜4年） ---------- */
POOL.push(
 {w:4,terms:[4,5],title:"逆求人サイト",text:"逆求人サイトに登録したら、知らない会社から「ぜひ面談を」とスカウトが届いた。",
  choices:[
   {label:"面談を受ける",ok:{t:"中小のIT企業だった。悪くなかったが、第一志望ではない。",d:{gk:2,men:2},f:s=>s.flags.scout=1}},
   {label:"無視する",ok:{t:"翌日も5通来た。",d:{}}},
  ]},
 {w:3,terms:[4,6],title:"就活エージェント",text:"就活エージェントから「無料で相談に乗ります」と電話が来た。",
  choices:[
   {label:"相談する",ok:{t:"紹介された企業は、自分の志望と違った。でも面接練習はためになった。",d:{com:3,gk:2}}},
   {label:"断る",ok:{t:"しつこかった。",d:{men:-1}}},
  ]},
 {w:4,terms:[4,5],title:"親の意見",text:s=>`親から「${ind().id==="koumuin"?"公務員ならうちも安心だ":ind().id==="venture"?"ベンチャーって大丈夫なの？公務員は？":"大手に入りなさいよ"}」と電話が来た。`,
  choices:[
   {label:"自分で決めると言う",req:{men:35},ok:{t:"「そうね、あなたの人生だから」。",d:{men:4}}},
   {label:"考えておくと言う",ok:{t:"なんとなくモヤモヤが残った。",d:{men:-3}}},
  ]},
 {w:4,terms:[4,5],title:"冬インターン",text:s=>`${ind().n}の冬インターン。5日間、本選考直結のところもある。`,
  choices:[
   {label:"応募する",chance:s=>pc(s.s.gk*.5+s.s.com*.5,50),ok:{t:"通った。最終日に「早期選考に案内します」と言われた。",d:{gk:6},f:s=>{s.flags.intern=(s.flags.intern||0)+1;s.flags.early=1}},ng:{t:"書類で落ちた。",d:{men:-5}}},
   {label:"試験勉強を優先する",ok:{t:"単位を守った。",d:{gaku:3}}},
  ]},
 {w:3,terms:[4,6],title:"面接練習",text:"キャリアセンターで模擬面接をやっている。予約が取れた。",
  choices:[
   {label:"受ける",ok:{t:"ビデオで自分の面接を見た。目が泳いでいた。直した。",d:{com:5,men:-2}}},
   {label:"友達と練習する",req:{jin:25},ok:{t:s=>`${PN("friend")}と交互に面接官役をやった。笑いが止まらなくなった。`,d:{com:3,jin:2,men:3}}},
  ]},
 {w:3,terms:[5,6],title:"説明会の嘘",text:"説明会で「残業はほぼありません」と言われた会社。OB訪問で聞いたら「毎日終電」だった。",
  choices:[
   {label:"志望度を下げる",ok:{t:"自分の目で確かめてよかった。",d:{gk:2}}},
   {label:"それでも受ける",ok:{t:"福利厚生は良かった。",d:{}}},
  ]},
 {w:3,terms:[5,6],title:"お祈りメール10通目",text:"今週だけで、お祈りメールが10通来た。",
  choices:[
   {label:"ESを見直す",req:{men:25},ok:{t:"書き直したら、次の3社が通った。",d:{gk:4,men:2}}},
   {label:"数を打つ",ok:{t:"30社に出した。消耗した。",d:{men:-6,gk:1}}},
   {label:"1週間就活をやめる",ok:{t:"友達と温泉に行った。戻ったら、少し楽に話せた。",d:{men:8,kane:-3,com:1}}},
  ]},
 {w:3,terms:[5,6],title:"面接官の圧",text:"面接で「君、うちじゃなくてもいいよね？」と言われた。",
  choices:[
   {label:"正直に「御社が第一志望ではない」と言う",chance:()=>.35,ok:{t:"「正直でいい」と通った。",d:{men:4,com:2}},ng:{t:"落ちた。",d:{men:-4}}},
   {label:"「御社が第一志望です」と言い切る",chance:s=>pc(s.s.com,45),ok:{t:"通った。",d:{}},ng:{t:"目が泳いだのを見られた。",d:{men:-4}}},
  ]},
 {w:3,terms:[6,6],title:"内々定の電話",text:"志望度が2番目の会社から、内々定の電話。「1週間以内に返事を」。第一志望の結果はまだだ。",
  choices:[
   {label:"承諾する",ok:{t:"安心を取った。第一志望は受けないことにした。",d:{men:6},f:s=>s.flags.early=1}},
   {label:"待ってもらう",chance:s=>pc(s.s.com,50),ok:{t:"「2週間なら」と言ってもらえた。",d:{men:2}},ng:{t:"「それなら結構です」。持ち駒が1つ減った。",d:{men:-6}}},
  ]},
 {w:3,terms:[6,7],when:s=>s.job&&["S","A","B","C","V"].includes(s.job.tier),title:"オファー面談",text:"内定先とのオファー面談。給与と配属の話が出た。",
  choices:[
   {label:"希望の配属を伝える",req:{com:30},ok:{t:"「考慮します」と言われた。本当かは入社後にわかる。",d:{men:3}}},
   {label:"何も言わない",ok:{t:"配属は運になった。",d:{}}},
  ]},
 {w:3,terms:[6,7],when:s=>s.job&&["S","A","B","C","V"].includes(s.job.tier),title:"内定者懇親会",text:"内定者懇親会。同期になる人たちと初めて会う。",
  choices:[
   {label:"積極的に話す",req:{com:30},ok:{t:"入社前に友達ができた。",d:{jin:5,com:2,men:3}}},
   {label:"壁際にいる",ok:{t:"会話に入れなかった。入社が少し怖くなった。",d:{men:-3}}},
  ]},
 {w:2,terms:[6,7],when:s=>s.job&&["S","A","B","C","V"].includes(s.job.tier),title:"内定先の炎上",text:"内定先の会社が、SNSで炎上した。",
  choices:[
   {label:"気にしない",ok:{t:"1週間で鎮火した。",d:{men:-1}}},
   {label:"不安になって就活を再開する",chance:s=>pc(s.s.gk,55),ok:{t:"",f:s=>{job(s,"safe");s._txt="別の会社から内定が出た。"+s._txt}},ng:{t:"結局、元の内定先に決めた。",d:{men:-5}}},
  ]},
 {w:3,terms:[6,7],when:s=>s.job&&s.job.tier==="D",title:"秋採用",text:"秋採用の求人が出ている。まだ諦めていない。",
  choices:[
   {label:"受ける",chance:s=>pc(s.s.gk*.5+s.s.com*.5,50),ok:{t:"",f:s=>{job(s,"safe");s._txt="秋採用で決まった。"+s._txt}},ng:{t:"また落ちた。",d:{men:-6}}},
   {label:"就職浪人を考える",ok:{t:"親に相談した。",d:{men:-4}}},
  ]},
 {w:2,terms:[4,6],when:s=>s.circle&&s.circle.cat==="tai",title:"体育会の就活",text:"体育会のOBから「うちの会社に来ないか」と声がかかった。部活の縦のつながりだ。",
  choices:[
   {label:"話を聞く",ok:{t:"大手だった。「体育会なら即戦力」と言われた。",d:{gk:4},f:s=>{s.flags.early=1;s.flags.ob=1}}},
   {label:"自分で探す",ok:{t:"縦社会から少し離れたかった。",d:{men:2}}},
  ]},
 {w:2,terms:[4,6],when:s=>s.fac.sils,title:"外資の英語面接",text:"外資系の面接は全部英語だった。",
  choices:[
   {label:"留学で鍛えた英語で勝負",ok:{t:"通った。留学が報われた。",d:{gk:6,men:4},f:s=>s.flags.jobBonus=(s.flags.jobBonus||0)+4}},
   {label:"日本語の会社に絞る",ok:{t:"無理はしないことにした。",d:{}}},
  ]},
);
LIFE_FLOW.push(
 {c:s=>s.ay>=2&&s.ind,w:2,t:s=>`${ind().n}の企業研究で、夜が更けた。`,d:{gk:1,tai:-1}},
 {c:s=>s.ay>=2,t:"面接の帰り、丸の内のカフェで一人反省会をした。",d:{men:-1,kane:-1}},
 {c:s=>s.ay>=2,t:"就活用のメールアドレスに、毎朝30通の案内が来る。"},
 {c:s=>s.ay>=2,t:"エントリーシートの「自由記述欄」が、一番自由じゃない。",d:{men:-1}},
 {c:s=>s.ay>=2,w:2,t:"同じ就活生と、面接の待合室で目が合った。お互い会釈した。"},
 {c:s=>s.ay>=2,t:"一次面接の帰りに、神宮球場の前を通った。早慶戦が懐かしかった。",d:{men:1}},
 {c:s=>s.jobRun,w:3,t:"選考の途中。次の面接のことで頭がいっぱいだ。",d:{men:-1}},
 {c:s=>s.job&&!["D"].includes(s.job.tier)&&s.ay>=3,t:"内定先から、入社前の課題図書が3冊届いた。"},
 {c:s=>s.flags.scout,t:"逆求人サイトから、まだスカウトが届く。もう決まっているのに。"},
 // 通学
 {c:s=>s.area.min>=50,w:3,t:s=>`${s.area.n}からの通学、今日も${s.area.min}分。座れなかった。`,d:{tai:-1}},
 {c:s=>s.area.min>=50,t:"通学の電車で、レポートを1本書き上げた。",d:{gaku:1}},
 {c:s=>s.area.min>=40&&s.home.n==="実家から通学",t:"終電を気にして、飲み会を途中で抜けた。",d:{jin:-1}},
 {c:s=>s.area.min<=8,w:2,t:"1限の10分前に起きて間に合った。近いは正義。",d:{men:1}},
 {c:s=>/東西線/.test(s.area.line),w:2,t:"朝の東西線。人の圧で足が浮いた。",d:{tai:-1}},
 {c:s=>/中央線/.test(s.area.line),t:"中央線が人身事故で止まった。1限は諦めた。",f:s=>s.mod-=1},
 {c:s=>/副都心線/.test(s.area.line),t:"副都心線の直通で、西早稲田まで一本。楽だ。",d:{men:1}},
 {c:s=>/西武/.test(s.area.line),t:"西武線の遅延メールが、今週3通目。"},
 {c:s=>s.area.n==="高円寺",t:"高円寺の古着屋で、1,000円のシャツを買った。",d:{kane:-1,men:2}},
 {c:s=>s.area.n==="新大久保",t:"新大久保の韓国料理屋が、今日も行列だった。"},
 {c:s=>s.area.n==="面影橋",t:"面影橋の都電を見送ってから、歩いてキャンパスへ。",d:{men:1}},
 {c:s=>s.area.n==="神楽坂",t:"神楽坂の路地で、知らない店を見つけた。入る勇気はなかった。"},
 {c:s=>s.area.n==="吉祥寺"&&s.home.n==="実家から通学",t:"帰りに吉祥寺で寄り道して、親に「遅い」と言われた。"},
);

/* ---------- 早期化した就活の流れ ----------
   3年春：業界決め → 夏：サマーインターン本番 → 秋冬：早期選考（3年のうちに内々定） → 4年3月：広報解禁 → 6月：本選考（持ったまま上を狙う） → 10月：内定式 */
EV.summerJob={title:"サマーインターン本番",when:s=>(s.flags.intern||0)>=1,text:s=>`8月。${ind().n}のサマーインターン本番。5日間、社員に囲まれてグループワーク。`,
 choices:s=>[
  {label:"最終日のプレゼンで前に立つ",req:{com:30},chance:s=>pc(s.s.com*.5+s.s.gk*.5,50),ok:{t:"社員が名前を覚えた。帰り際、「早期選考に案内します」と言われた。",d:{gk:8,com:3},f:s=>s.flags.early=1},ng:{t:"プレゼンで時間切れ。評価は普通だった。",d:{gk:4,men:-3}}},
  {label:"裏方で支える",ok:{t:"チームは評価されたが、自分の名前は残らなかった。",d:{gk:4,jin:2}}},
  {label:"懇親会で社員に食い込む",req:{com:35},ok:{t:"若手社員とLINEを交換した。後のOB訪問につながった。",d:{jin:4,gk:3},f:s=>s.flags.ob=1}},
 ]};
SCHED[4].push(["summerJob",8,20]);
EV.earlySenko={title:"早期選考",when:s=>!s.job,text:s=>{const open=s.flags.early||(s.flags.intern||0)>=1||["consul","shosha","media","venture"].includes(ind().id);return open?`1月。${ind().n}の早期選考が動いている。3年のうちに内々定が出る人もいる。受けるか。`:`1月。周りで早期選考の話が出始めた。インターンに行っていない自分には、案内が来ていない。`},
 choices:s=>{const open=s.flags.early||(s.flags.intern||0)>=1||["consul","shosha","media","venture"].includes(ind().id);return open?[
  {label:"早期選考を受ける",sub:"ES→面接→結果",ok:{t:"早期選考にエントリーした。本選考より速く、容赦ない。",f:s=>{s.jobRun={bonus:s.flags.early?6:0,strikes:0,early:1};s.today.push(EV.jobES,EV.jobI1,EV.jobResultEarly)}}},
  {label:"本選考まで待つ",ok:{t:"焦らないことにした。周りが決まっていくのを横目に。",d:{men:-2}}},
 ]:[
  {label:"今からできることをやる",ok:{t:"OB訪問とWebテストの対策を始めた。",d:{gk:3,gaku:2},f:s=>s.flags.spi=1}},
  {label:"まだ大丈夫だと思う",ok:{t:"本選考は6月だ。たぶん。",d:{men:1}}},
 ]}};
SCHED[5].push(["earlySenko",1,20]);
EV.jobResultEarly={title:"早期選考の結果",jobResult:1,text:"面接から10日。メールの件名に「選考結果のご連絡」。",
 choices:s=>[{label:"開く",ok:{t:"",f:s=>{const j=JR();const b=j.bonus-j.strikes*2;s.jobRun=null;
   if(b>=4){s.flags.jobBonus=b;job(s,ind().mode);s.flags.jobBonus=0;s.jobEarly=s.job;s._txt="内々定。3年の冬に、就活がひとつ終わった。"+s._txt}
   else{applyD({men:-6});s._txt="お祈りだった。本選考で取り返す。"}}}}]};
EV.kouhou={title:"広報解禁",text:"3月1日。就活サイトが一斉に動き出した。説明会の予約が、朝から取れない。",
 choices:s=>[
  {label:"片っ端から予約する",ok:{t:"20社の説明会を入れた。スーツの出番だ。",d:{gk:3,men:-2}}},
  ...(s.job?[{label:"内々定があるので、絞って見る",ok:{t:"気になる3社だけ予約した。余裕のある就活は、少しだけ楽しい。",d:{men:3}}}]:[]),
  {label:"まだ動かない",ok:{t:"周りの黒いスーツを見て、初めて焦った。",d:{men:-4},f:s=>s.flags.late=1}},
 ]};
SCHED[5].push(["kouhou",3,1]);
EV.naiteishiki={title:"内定式",when:s=>s.job&&!["D","G","K","M","L","O","N","F","I"].includes(s.job.tier),text:s=>`10月1日。${s.job.co||s.job.label}の内定式。同期になる人たちが、全員スーツで並んでいる。`,
 choices:[
  {label:"同期と連絡先を交換する",req:{com:25},ok:{t:"入社前に飲み仲間ができた。",d:{jin:4,com:1,men:3}}},
  {label:"式だけ出て帰る",ok:{t:"4年間の終わりが、少し見えた。",d:{men:2}}},
 ]};
SCHED[7].push(["naiteishiki",10,1]);
// 本選考：すでに内々定があれば、持ったまま上を狙うか決める
const _honsenkoChoices=EV.honsenko.choices;
EV.honsenko.choices=s=>s.job&&s.jobEarly?[
 {label:`${s.job.co||s.job.label}の内々定を承諾して就活を終える`,ok:{t:"就活が終わった。残りの大学生活は、全部自分のものだ。",d:{men:10},f:s=>s.flags.earlyDone=1}},
 {label:"内々定を持ったまま、さらに上を狙う",sub:"結果が悪ければ、今の内々定を残す",ok:{t:"保険をかけて挑む。",f:s=>{s.jobKeep=s.job;s.jobRun={bonus:0,strikes:0};s.today.push(EV.jobES,EV.jobWeb,EV.jobGD,EV.jobI1,EV.jobFinal,EV.jobResult)}}},
]:_honsenkoChoices(s);
// 本選考の結果が早期の内々定より悪ければ、早期を残す
const _jobResultChoices=EV.jobResult.choices;
EV.jobResult.choices=s=>[{label:"電話に出る",ok:{t:"",f:s=>{const keep=s.jobKeep;_jobResultChoices(s)[0].ok.f(s);if(keep&&TIER_PTS[keep.tier]>TIER_PTS[s.job.tier]){s.job=keep;s._txt+=`結局、${keep.co||keep.label}の内々定を承諾した。`}s.jobKeep=null}}}];
