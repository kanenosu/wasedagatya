/* 選択が後で効く仕組みと、年をまたぐストーリー線。
   later(days, id, x) で「id の出来事を days 日後に起こす」と予約する。中身は LATER にまとめ、セーブには id と日付だけ残す。
   出来事は流れる文（t・d）か、選択イベント（ev）。選んだときの代償や見返りを、数か月〜数年後に返す */
const LATER={};
function later(days,id,x){
  if(!S.later)S.later=[];
  const d=new Date(S.date.getFullYear(),S.date.getMonth(),S.date.getDate()+days);
  S.later.push({k:dkey(d),id,x:x||null});
  S.later.sort((a,b)=>a.k-b.k);
}
function fireLater(){
  if(!S.later||!S.later.length)return;
  const k=dkey(S.date);
  while(S.later.length&&S.later[0].k<=k){
    const it=S.later.shift();const def=LATER[it.id];if(!def)continue;
    const spec=typeof def==="function"?def(S,it.x):def;
    if(!spec)continue;
    if(spec.ev){const ev={...spec.ev,_x:it.x};S.today.push(ev)}
    else{const t=typeof spec.t==="function"?spec.t(S,it.x):spec.t;const ds=applyD(spec.d||{});feed(t,ds,"key");if(spec.f)spec.f(S,it.x);refreshHud()}
  }
}
const _tickChain=tick;
tick=function(){if(S&&!S.busy&&!S.ending)fireLater();_tickChain()};

/* ===== 1. サークルの会計 ===== 同期の使い込みを知る → 黙る／告げる／一緒に埋める → 半年後の監査で返ってくる */
POOL.push(
 {w:3,terms:[1,3],when:s=>!!s.circle&&!s.flags.kaikei1,title:"会計の帳簿",text:s=>`${s.circle.n}の会計をしている同期の部屋で、帳簿を見てしまった。合宿費から3万円が消えている。本人は「立て替えてただけ」と言うが、目が泳いでいる。`,
  choices:[
   {label:"黙っている",ok:{t:"見なかったことにした。同期は「ありがとう」とだけ言った。",d:{men:-2,jin:1},f:s=>{s.flags.kaikei1="silent";later(180,"kaikeiAudit")}}},
   {label:"幹事長に言う",ok:{t:"幹事長は顔色を変えた。同期は翌週から部室に来なくなった。",d:{jin:-5,men:-3},f:s=>{s.flags.kaikei1="told";later(180,"kaikeiAudit")}}},
   {label:"一緒に穴を埋める",req:{kane:3},ok:{t:"自分の3万円で帳尻を合わせた。同期は泣いて、返すと言った。",d:{kane:-3,jin:4},f:s=>{s.flags.kaikei1="paid";later(120,"kaikeiPayback");later(180,"kaikeiAudit")}}},
  ]},
);
LATER.kaikeiPayback=s=>({t:Math.random()<.5?"会計の同期から封筒が来た。3万円、全額だった。":"会計の同期は「来月には」と言い続けている。3万円は戻ってこない気がする。",d:Math.random()<.5?{kane:3,jin:2}:{men:-2}});
LATER.kaikeiAudit=s=>{const v=s.flags.kaikei1;return {ev:{title:"監査",text:`${s.circle?s.circle.n:"サークル"}の年度末の会計監査。OBの会計士が帳簿を全部めくった。半年前の3万円の穴が見つかった。`,
 choices:v==="silent"?[
   {label:"知らなかったと言う",chance:()=>.5,ok:{t:"通った。でも同期は「あいつは知ってた」と言った。半分の人は信じた。",d:{jin:-6,men:-4}},ng:{t:"帳簿を見た日のLINEが残っていた。「知ってて黙ってた」が確定し、幹部候補から外された。",d:{jin:-12,gk:-4,men:-6},f:s=>s.flags.noKanbu=1}},
   {label:"正直に話す",ok:{t:"「なぜそのとき言わなかった」と幹事長に言われた。信用は落ちたが、残れた。",d:{jin:-5,men:2}}}]
  :v==="told"?[
   {label:"事実を説明する",ok:{t:"半年前に報告した記録が残っていた。OBが「よく言った」と言い、来期の幹部に推された。",d:{jin:8,gk:6,men:4},f:s=>s.flags.kanbuRec=1}}]
  :[
   {label:"自分が立て替えたと話す",ok:{t:"OBは呆れ、そして笑った。「お人好しだな」。使い込んだ同期は退会、自分には会計の引き継ぎが回ってきた。",d:{jin:5,gk:4,men:-2},f:s=>s.flags.kanbuRec=1}}]}}};

/* ===== 2. 恋人がいるのに ===== 別の人と2人で会う → 数か月後に発覚するかどうか */
POOL.push(
 {w:3,terms:[1,7],when:s=>s.flags.partner&&!s.flags.uwaki,title:"2人で飲みに",text:s=>`${PN("lover")}がいるのに、${s.circle?"サークル":"授業"}の別の人から「2人で飲みに行かない？」と誘われた。向こうは恋人がいることを知っている。`,
  choices:[
   {label:"行く",ok:{t:"楽しかった。帰りの電車で、スマホの写真を消した。",d:{men:4,jin:2},f:s=>{s.flags.uwaki=1;later(ri(60,200),"uwakiBare")}}},
   {label:"断る",ok:{t:"「真面目だね」と言われた。恋人には言わなかった。",d:{men:1}}},
   {label:"恋人に話してから行く",req:{com:35},ok:{t:"恋人は「いいよ」と言った。声が少し硬かった。行ったが、早く帰った。",d:{men:-1,jin:1},f:s=>s.flags.uwakiOpen=1}},
  ]},
);
LATER.uwakiBare=s=>s.flags.partner?{ev:{title:"写真",text:`${PN("lover")}が、あの夜の写真を見ていた。共通の友達の投稿に、2人で写り込んでいた。「これ、いつ？」`,
 choices:[
  {label:"正直に話す",chance:s=>pc(s.s.com,55),ok:{t:"3時間話した。別れなかった。信用は、ゼロから積み直しになった。",d:{men:-6}},ng:{t:"",d:{men:-18,jin:-4},f:s=>{s.flags.partner=0;s._txt=`${PN("lover")}は泣かなかった。「嘘つかれるのが一番嫌だった」。それで終わった。`}}},
  {label:"ごまかす",chance:()=>.35,ok:{t:"「サークルの集まりだよ」で通った。胸の奥に石が残った。",d:{men:-4}},ng:{t:"",d:{men:-20,jin:-8},f:s=>{s.flags.partner=0;s._txt=`相手の投稿には「2人で」と書いてあった。${PN("lover")}は黙って帰り、その夜、共通の友達全員が知った。`}}},
 ]}}:{t:"あの夜の写真が、共通の友達の投稿に残っていた。もう恋人はいない。それでも少し、背中が冷えた。",d:{men:-2}};

/* ===== 3. ゼミ発表のレジュメ ===== 先輩のレジュメを流用 → 卒論で教授に見抜かれる */
POOL.push(
 {w:3,terms:[4,5],when:s=>s.zemi&&s.zemi!=="なし"&&!s.flags.resume,title:"レジュメの締切前夜",text:s=>`${s.zemi}の発表が明日。何も書けていない。先輩が去年使ったレジュメのPDFが、ドライブに残っている。`,
  choices:[
   {label:"先輩のレジュメをほぼそのまま使う",ok:{t:"発表は無難に終わった。教授は何も言わなかった。",d:{men:3,gaku:-1},f:s=>{s.flags.resume="copy";later(ri(300,420),"resumeSotsuron")}}},
   {label:"先輩のを下敷きに書き直す",req:{tai:25},ok:{t:"朝5時まで書いた。質疑で一つ答えられなかったが、自分の言葉だった。",d:{gaku:4,gk:2,tai:-4},f:s=>s.flags.resume="own"}},
   {label:"白紙で臨んで謝る",ok:{t:"「来週もう一度」と言われた。同期の目が痛い。",d:{men:-5,jin:-2},f:s=>s.flags.resume="late"}},
  ]},
);
LATER.resumeSotsuron=s=>({ev:{title:"卒論の指導",text:"卒論の中間報告。教授がページをめくる手を止めた。「3年のときの発表、あれは誰のだ」。去年の先輩の名前を、教授は覚えていた。",
 choices:[
  {label:"認めて謝る",ok:{t:"「卒論は自分で書け。見ているから」。それだけだった。評価は厳しくなったが、見捨てられはしなかった。",d:{men:-6,gaku:3}}},
  {label:"自分で書いたと言い張る",chance:()=>.25,ok:{t:"教授は深く追わなかった。でも推薦状は書いてもらえない空気になった。",d:{men:-3,gk:-4}},ng:{t:"先輩本人に確認された。卒論の指導教員を変えられ、就活の推薦も消えた。",d:{men:-10,gk:-10,jin:-5},f:s=>s.flags.jobBonus=(s.flags.jobBonus||0)-4}},
 ]}});

/* ===== 4. 就活で盛る ===== OB訪問で経歴を盛る → 面接で突っ込まれる */
POOL.push(
 {w:3,terms:[4,6],when:s=>!s.flags.moru,title:"OB訪問の話",text:s=>`OB訪問。「学生時代に力を入れたことは？」。${s.circle?`${s.circle.n}の話をしているうちに、`:"話しているうちに、"}自分がやっていないことまで口から出た。「代表として200人をまとめて」。`,
  choices:[
   {label:"そのまま盛る",ok:{t:"OBは感心していた。ESにも同じ話を書いた。",d:{gk:4,men:2},f:s=>{s.flags.moru=1;later(ri(90,240),"moruBare")}}},
   {label:"途中で訂正する",ok:{t:"「正確には副代表で、50人です」。OBは「そっちの方が信用できる」と言った。",d:{gk:2,com:2,jin:2},f:s=>s.flags.moru=0}},
  ]},
);
LATER.moruBare=s=>({ev:{title:"最終面接",text:"最終面接。面接官が履歴書を見ながら言った。「代表として200人、とありますが、同じサークルの方を先週面接しましてね」。",
 choices:[
  {label:"正直に言い直す",chance:s=>pc(s.s.com,50),ok:{t:"「盛りました。実際は——」。面接官は笑った。通った。",d:{men:2,com:2}},ng:{t:"言い直したが、信用は戻らなかった。お祈りメール。",d:{men:-8},f:s=>s.flags.jobBonus=(s.flags.jobBonus||0)-3}},
  {label:"押し通す",chance:()=>.2,ok:{t:"押し切った。内定は出たが、入社後に同じサークルの同期と同じ部署になった。",d:{men:-4}},ng:{t:"その場で終わった。他社のESも同じ文面だったことを思い出し、全部書き直した。",d:{men:-10,gk:-6},f:s=>s.flags.jobBonus=(s.flags.jobBonus||0)-6}},
 ]}});

/* ===== 5. 貸した金 ===== 同期に5万貸す → 返るか、関係ごと消えるか */
POOL.push(
 {w:3,terms:[0,7],when:s=>s.s.jin>=30&&!s.flags.kashi&&s.kane>=8,title:"5万貸して",text:s=>`${PF("friend")}が「来月返すから5万貸して」と言う。家賃が払えないらしい。`,
  choices:[
   {label:"貸す",ok:{t:"振り込んだ。「マジで助かる」。",d:{kane:-5,jin:3},f:s=>{s.flags.kashi=1;later(ri(45,150),"kashiBack")}}},
   {label:"2万だけ貸す",ok:{t:"「それでもいい」。半分の信用と、半分の不安。",d:{kane:-2,jin:1},f:s=>{s.flags.kashi=2;later(ri(45,150),"kashiBack")}}},
   {label:"断る",ok:{t:"「だよね」。それ以来、飲みの誘いが減った。",d:{jin:-3,men:1}}},
  ]},
);
LATER.kashiBack=s=>{const full=s.flags.kashi===1;const r=Math.random();
 if(r<.45)return {t:`${PF("friend")}から「遅くなってごめん」と振込。${full?"5万":"2万"}、全額。`,d:full?{kane:5,jin:3}:{kane:2,jin:2}};
 if(r<.75)return {t:`${PF("friend")}から「もう少し待って」。3回目だ。`,d:{men:-2},f:s=>later(90,"kashiBack2")};
 return {t:`${PF("friend")}のLINEが既読にならない。SNSは更新されている。${full?"5万":"2万"}は授業料だと思うことにした。`,d:{men:-5,jin:-4}};};
LATER.kashiBack2=s=>Math.random()<.5?{t:`${PF("friend")}がバイト代で返してきた。利子代わりに飯を奢られた。`,d:{kane:s.flags.kashi===1?5:2,jin:4}}:{t:`${PF("friend")}は大学に来なくなった。金の話はもうできない。`,d:{men:-4,jin:-6}};

/* ===== 6. 店長への嘘 ===== バイトを嘘で休む → 信用が落ちるか、見つかるか */
POOL.push(
 {w:3,terms:[0,7],when:s=>s.flags.job&&!s.flags.usoYasumi,title:"今日は休みたい",text:"バイトの日に限って、サークルの大事な飲み会。店長に「熱が出た」と送れば休める。",
  choices:[
   {label:"熱が出たと送る",ok:{t:"「お大事に」。飲み会は最高だった。",d:{men:4,jin:3},f:s=>{s.flags.usoYasumi=1;later(ri(20,90),"usoBare")}}},
   {label:"正直に代わりを探す",chance:s=>pc(s.s.jin,45),ok:{t:"同僚が代わってくれた。貸しがひとつ。",d:{jin:2,men:2}},ng:{t:"誰も代われなかった。飲み会は諦めてシフトに入った。",d:{men:-3,kane:1}}},
  ]},
);
LATER.usoBare=s=>Math.random()<.4?{t:"店長が飲み会の写真を見ていた。「熱、下がった？」。シフトが半分に減った。",d:{kane:-4,men:-4},f:s=>s.flags.usoBareD=1}:{t:"店長は何も言わなかった。でも「信用してたのに」という顔を、一度だけされた気がする。",d:{men:-1}};

/* ===== 7. 徹夜の積み重ね ===== 徹夜を重ねると、数か月後に体が壊れる */
LATER.nightsCrash=s=>({ev:{title:"体の限界",text:"朝、起き上がれない。目の前がぐるぐる回る。半年分の徹夜が、まとめて請求書になって来た。",
 choices:[
  {label:"病院に行く",ok:{t:"自律神経の乱れと貧血。「寝てください」と言われた。1週間、何もしなかった。",d:{tai:-6,men:2},f:s=>s.skip=7}},
  {label:"気合で授業に出る",chance:s=>pc(s.s.tai,60),ok:{t:"出た。記憶はない。",d:{tai:-8,gaku:-2}},ng:{t:"教室で倒れて救急車。2週間の入院。",d:{tai:-15,men:-6,kane:-4},f:s=>{s.skip=14;s.mod-=6}}},
 ]}});
const _applyDChain=applyD;
applyD=function(d){const out=_applyDChain(d);
 // 体力を大きく削る選択が続くと、後で返ってくる
 if(S&&d&&d.tai<=-5){S.flags.taiDebt=(S.flags.taiDebt||0)+1;if(S.flags.taiDebt===6&&!S.flags.taiCrashSet){S.flags.taiCrashSet=1;later(ri(60,150),"nightsCrash")}}
 return out};

/* ===== 8. 成績を親に隠す ===== 成績表を隠す → 帰省で見つかる */
POOL.push(
 {w:3,terms:[1,5],when:s=>(s.grades||[]).some(g=>g.f>=2)&&!s.flags.hideGrades,title:"成績表",text:"成績通知が実家に届く前に、MyWasedaの画面を見た。F が2つ。親には「全部取れた」と言ってある。",
  choices:[
   {label:"実家の郵便を先回りして回収する",ok:{t:"帰省のタイミングで封筒を抜いた。しばらくは安全だ。",d:{men:2},f:s=>{s.flags.hideGrades=1;later(ri(150,300),"gradesFound")}}},
   {label:"先に自分から話す",ok:{t:"電話で言った。沈黙が長かった。「次は頑張りなさい」。仕送りは減らなかった。",d:{men:-3,jin:1}}},
  ]},
);
LATER.gradesFound=s=>({ev:{title:"見つかった",text:"帰省中。母が大学からの封筒を手に立っていた。再発行された成績証明書だった。「全部取れたって言ったよね」。",
 choices:[
  {label:"謝る",ok:{t:"3時間説教された。仕送りが1万円減った。それでも、隠すよりは楽になった。",d:{men:-5,kane:-1},f:s=>s.flags.lessmoney=1}},
  {label:"大学のミスだと言う",chance:()=>.2,ok:{t:"一瞬だけ通った。翌月、父が大学に電話した。",d:{men:-8,kane:-3},f:s=>s.flags.lessmoney=1},ng:{t:"父が大学に電話して、全部わかった。仕送りは半分になった。",d:{men:-10,kane:-5},f:s=>{s.flags.lessmoney=1;s.wealth={...s.wealth,inc:Math.round(s.wealth.inc*.6)}}}},
 ]}});

/* ===== 9. 裏垢 ===== 同期の悪口を裏垢に書く → いつか特定される */
POOL.push(
 {w:2,terms:[0,7],when:s=>!!s.circle&&!s.flags.uraaka,title:"裏垢",text:s=>`${s.circle.n}の同期にイラついた夜。鍵付きの裏垢に、名前は伏せて悪口を書いた。フォロワーは12人。`,
  choices:[
   {label:"投稿する",ok:{t:"「わかる」が3件ついた。少しスッキリした。",d:{men:3},f:s=>{s.flags.uraaka=1;later(ri(100,400),"uraakaBare")}}},
   {label:"下書きで止める",ok:{t:"書いたら、少し冷めた。消した。",d:{men:1}}},
  ]},
);
LATER.uraakaBare=s=>({t:s.circle?`裏垢のスクショが${s.circle.n}のグループに貼られた。フォロワー12人のうちの誰かだ。「名前伏せても分かるよ」。`:"昔の裏垢のスクショが、知らない経路で回ってきた。",d:{jin:-10,men:-8},f:s=>{s.flags.uraakaBareD=1;if(s.post){s.post=null;log("裏垢が発覚して役職を降りた")}}});

/* ===== 10. 教授とのつながり ===== 研究室に顔を出していると、就活や院で返ってくる */
LATER.profRec=s=>({t:"教授から「推薦状、書いておいたから」とメール。あの日、研究室に行った自分を褒めたい。",d:{gk:6,men:4},f:s=>s.flags.jobBonus=(s.flags.jobBonus||0)+4});
POOL.push(
 {w:2,terms:[2,5],when:s=>s.flags.profLink&&!s.flags.profLink2,title:"研究室の手伝い",text:"教授から「学会の資料づくり、手伝ってくれない？」。無給、3日間。",
  choices:[
   {label:"手伝う",req:{tai:25},ok:{t:"3日間、コピー機と仲良くなった。教授の名前で謝辞に載った。",d:{gaku:3,gk:3,tai:-4},f:s=>{s.flags.profLink2=1;later(ri(200,400),"profRec")}}},
   {label:"断る",ok:{t:"「そうか」。それ以来、研究室には呼ばれなくなった。",d:{men:1},f:s=>s.flags.profLink2=1}},
  ]},
);

/* 楽単で固める癖は、ゼミ選考と専門科目で返ってくる（rishu の「楽単で固める」） */
LIFE_FLOW.push(
 {c:s=>s.flags.rakutan>=1&&s.ay>=2,w:2,t:"ゼミの基礎文献が読めない。1年のとき楽単で固めたツケだ。",d:{gaku:-2,men:-1}},
 {c:s=>s.flags.noKanbu,t:"幹部の候補に名前が挙がらなかった。監査のあの日のせいだ。",d:{men:-2}},
 {c:s=>s.flags.kanbuRec,t:"OBが「あいつは信用できる」と言ってくれたらしい。",d:{jin:2}},
 {c:s=>s.flags.uwaki&&s.flags.partner,w:2,t:"恋人のスマホが鳴るたび、自分が見られている気がする。",d:{men:-2}},
 {c:s=>s.flags.moru,t:"ESの「代表として200人」の行を見るたび、胃が痛い。",d:{men:-1}},
 {c:s=>s.flags.hideGrades,w:2,t:"実家からの電話。「成績どうだった？」「うん、大丈夫」。",d:{men:-2}},
 {c:s=>s.flags.uraaka,t:"裏垢の鍵が、ちゃんとかかっているか確かめた。",d:{men:-1}},
);
