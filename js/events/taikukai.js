/* 体育会。入部したら「部活一本」：方針は固定、授業より部活、朝練で1限が消え、試験前も練習。
   4年の秋に引退して解放される。途中で辞める道もある。4年続ければ就活の体育会枠が効く */
const TAI=s=>!!s.circle&&s.circle.cat==="tai"&&!s.flags.taiRetired;
/* 方針「部活一本」。体育会にいる間はこれしか選べない */
POL.push({id:"bukatsu",n:"部活一本",d:{tai:4,gk:3,gaku:-3,men:-1,jin:1},kane:-2,ex:-6,req:{circle:1},t:"朝練、授業（寝る）、午後練、寝る。体育会はこれしかない"});
const _polHTMLTai=polHTML;
polHTML=function(){
  if(!S||!TAI(S))return _polHTMLTai();
  return POL.map(p=>{const ok=p.id==="bukatsu";return `<button data-pol="${p.id}" aria-pressed="${S.pol===p.id}" ${ok?"":"disabled"} title="${esc(ok?p.t:"体育会にいる間は部活一本")}">${esc(p.n)}</button>`}).join("");
};
const _joinCircleTai=joinCircle;
joinCircle=function(c){_joinCircleTai(c);if(c.cat==="tai"){S.pol="bukatsu";S.flags.taiJoinT=S.T;S.flags.taiRetired=0;feed(`${c.n}に入部。今日から部活一本。方針は「部活一本」に固定された。`,null,"key")}};
/* 毎日：体育会なら方針を固定し続ける（辞める・引退で解ける） */
const _tickTai=tick;
tick=function(){if(S&&S.started&&!S.ending&&TAI(S)&&S.pol!=="bukatsu")S.pol="bukatsu";_tickTai()};
function quitTai(s,how){const n=s.circle.n;log(`${n}を退部（${how}）`);s.circle=null;s.post=null;s.flags.taiQuit=1;s.pol="bal";s._txt=`${n}を辞めた。${how}。朝6時の目覚ましを消した。来週から、授業に出る。`}

POOL.push(
 {w:6,terms:[0,0],when:TAI,title:"入部の洗礼",text:s=>`${s.circle.n}。1年は朝6時集合、グラウンド整備、ボール磨き、先輩のドリンク。練習は週6。授業は「出られたら出る」。`,
  choices:[
   {label:"覚悟を決める",ok:{t:"覚悟を決めた。1限は、入学して2か月で1回も出ていない。",d:{tai:5,gk:3,gaku:-4,men:2},f:s=>s.mod-=6}},
   {label:"授業との両立を主将に相談する",req:{com:30},chance:()=>.4,ok:{t:"「必修だけは行け」と言われた。必修だけは行った。それ以外は消えた。",d:{gaku:-2,gk:2},f:s=>s.mod-=3},ng:{t:"「甘いこと言うな」。相談したことが同期に知れて、1か月ぶん雑用が増えた。",d:{men:-6,jin:-3}}},
  ]},
 {w:5,terms:[0,7],when:TAI,title:"朝練と1限",text:"朝練は6時から8時半。東伏見から本キャンまで40分。1限は9時。間に合う計算だが、体が動かない。",
  choices:[
   {label:"1限に出る",chance:s=>pc(s.s.tai,60),ok:{t:"出た。後ろの席で寝た。出席はついた。",d:{tai:-4,gaku:1}},ng:{t:"電車で寝過ごして高田馬場を通過。1限は欠席。",d:{tai:-3},f:s=>s.mod-=3}},
   {label:"部室で寝る",ok:{t:"部室で2限まで寝た。それが毎週になった。",d:{tai:3,gaku:-2},f:s=>s.mod-=5}},
  ]},
 {w:4,terms:[1,7],when:TAI,title:"試験前の練習",text:s=>`試験1週間前。${s.circle.n}の練習は休みにならない。監督は「両立できないのは甘え」と言う。`,
  choices:[
   {label:"練習後に徹夜で勉強",req:{tai:30},ok:{t:"練習後、深夜2時まで図書館。朝6時に朝練。試験は半分寝ていた。",d:{gaku:3,tai:-10,men:-4}}},
   {label:"練習を休む",chance:()=>.3,ok:{t:"休んだ。意外と何も言われなかった。試験は取れた。",d:{gaku:4,tai:2}},ng:{t:"休んだ。翌日から1週間、レギュラーから外された。試験は取れた。",d:{gaku:4,jin:-5,men:-5}}},
   {label:"試験を捨てる",ok:{t:"試験は捨てた。練習は出た。必修が2つ消えた。",d:{gk:2},f:s=>s.mod-=12}},
  ]},
 {w:4,terms:[0,7],when:TAI,title:"遠征費",text:s=>`${s.circle.n}の遠征。${pick(["関西","九州","北海道","東北"])}で1週間、費用${ri(6,12)}万円。部費とは別だ。`,
  choices:[
   {label:"親に頼む",chance:s=>({"太い":.95,"ふつう":.6,"細い":.2})[s.wealth.tier],ok:{t:"親が出した。「頑張ってね」。頑張るしかない。",d:{gk:3,tai:2}},ng:{t:"親は出せなかった。マネージャーに相談して、分割にしてもらった。",d:{kane:-4,men:-4}}},
   {label:"バイトで作る",req:{tai:25},ok:{t:"練習の合間に深夜バイト。遠征には行けた。遠征先で寝ていた。",d:{kane:-6,tai:-8,gk:2},f:s=>s.flags.job=1}},
  ]},
 {w:3,terms:[0,7],when:TAI,title:"寮",text:s=>`${s.circle.n}の寮に空きが出た。練習場の隣、家賃は安い、門限あり、上級生と同部屋。`,
  choices:[
   {label:"入る",ok:{t:"入った。朝練の移動がゼロになった。自由もゼロになった。",d:{tai:5,kane:3,men:-4,jin:3},f:s=>s.flags.taiRyo=1}},
   {label:"入らない",ok:{t:"入らなかった。「寮に入らない奴は本気じゃない」と、先輩に一度だけ言われた。",d:{men:-2,jin:-2}}},
  ]},
 {w:3,terms:[1,7],when:TAI,title:"監督の一言",text:"練習後、監督に呼ばれた。「お前、最近どうした」。何がどうしたのか、分からない。",
  choices:[
   {label:"「頑張ります」",ok:{t:"頑張ります、と言った。監督は「そうか」と言った。翌週、メニューが1.5倍になった。",d:{tai:-4,gk:2,men:-2}}},
   {label:"正直に話す",req:{com:35},chance:s=>pc(s.s.com,55),ok:{t:"授業と練習と金の話をした。監督は黙って聞いて、「少し休め」と言った。初めて人間に見えた。",d:{men:6,tai:3}},ng:{t:"話した。「言い訳はいい」。翌週、名前が呼ばれなくなった。",d:{men:-6,jin:-3}}},
  ]},
 {w:3,terms:[0,7],when:TAI,title:"部内恋愛禁止",text:s=>`${s.circle.n}は部内恋愛禁止。マネージャーと目が合う回数が増えている。`,
  choices:[
   {label:"ルールを守る",ok:{t:"守った。卒業後に連絡した。",d:{men:-2,gk:1}}},
   {label:"隠れて付き合う",chance:()=>.5,ok:{t:"隠れて付き合った。半年バレなかった。",d:{men:8},f:s=>{s.flags.partner=1;s.flags.partnerT=s.T;s.flags.inCircleLove=1}},ng:{t:"2週間でバレた。2人とも1か月の練習参加停止。関係も終わった。",d:{men:-10,jin:-6}}},
  ]},
 {w:3,terms:[1,7],when:s=>TAI(s)&&s.s.tai<40,title:"マネージャーに回るか",text:s=>`${s.circle.n}で、試合に出られる見込みがない。主将から「マネージャーとして残らないか」と言われた。`,
  choices:[
   {label:"マネージャーになる",ok:{t:"マネージャーになった。試合には出ない。でもチームの一部で、就活では「体育会の裏方」が通った。",d:{gk:5,jin:4,men:-3,tai:4},f:s=>s.flags.taiManager=1}},
   {label:"選手として続ける",ok:{t:"続けた。試合に出られない4年目まで、続けた。",d:{tai:3,men:-4,gk:2}}},
   {label:"辞める",ok:{t:"",d:{men:-6,jin:-8},f:s=>quitTai(s,"試合に出られないまま辞めた")}},
  ]},
 {w:3,terms:[1,6],when:TAI,title:"辞めたい夜",text:s=>`${s.circle.n}。朝練、授業、午後練、寝る。友達は部員だけ。大学に入った意味を、たまに考える。`,
  choices:[
   {label:"続ける",ok:{t:"続けた。辞めたい夜は、月に一度来る。来るたびに、続けた。",d:{men:-3,gk:2,tai:2}}},
   {label:"同期に話す",req:{jin:25},ok:{t:"同期も同じことを考えていた。2人で続けることにした。",d:{men:4,jin:3}}},
   {label:"退部届を出す",ok:{t:"",d:{men:-8,jin:-10,gaku:3},f:s=>quitTai(s,"辞めたい夜が、最後の夜になった")}},
  ]},
 {w:3,terms:[0,7],when:TAI,title:"坊主",text:s=>`${s.circle.n}のルール。試合に負けたら坊主。負けた。`,
  choices:[
   {label:"剃る",ok:{t:"剃った。翌週、学部の授業で誰も話しかけてこなかった。",d:{jin:-2,men:-2,gk:1}}},
   {label:"拒否する",chance:()=>.3,ok:{t:"拒否した。主将が「今年からやめよう」と言った。伝統が1つ消えた。",d:{men:4,gk:2}},ng:{t:"拒否した。全員の前で「協調性がない」と言われ、結局剃った。",d:{men:-8,jin:-4}}},
  ]},
 {w:3,terms:[2,7],when:TAI,title:"体育会以外の友達",text:"学部の飲み会に誘われた。練習が終わるのは21時。行けば22時、翌朝は6時。",
  choices:[
   {label:"行く",ok:{t:"行った。1時間だけ。「体育会の人、初めて見た」と言われた。",d:{jin:3,tai:-4}}},
   {label:"行かない",ok:{t:"行かなかった。誘いは、それが最後だった。",d:{jin:-3,men:-2}}},
  ]},
 {w:2,terms:[4,7],when:TAI,title:"体育会の就活",text:s=>`就活。「体育会の学生を採りたい」企業の説明会に、${s.circle.n}のOBが来ていた。「うちは体育会枠がある」。`,
  choices:[
   {label:"OBのルートに乗る",ok:{t:"乗った。面接は「部活で一番つらかったことは」で終わった。それしか聞かれなかった。",d:{gk:6,jin:3},f:s=>s.flags.jobBonus=(s.flags.jobBonus||0)+6}},
   {label:"自分で受ける",ok:{t:"自分で受けた。練習の合間の面接。「学業は？」と聞かれて、言葉が止まった。",d:{gk:2,men:-3}}},
  ]},
);
/* 4年の秋：引退。方針が解放され、燃え尽きと就活が同時に来る */
EV.taiRetire={when:s=>TAI(s)&&s.ay>=3,title:"引退",text:s=>`${s.circle.n}の最後の試合が終わった。4年間。明日から、朝6時に起きなくていい。`,
 choices:[
  {label:"やり切った",ok:{t:"やり切った。同期と朝まで飲んで、朝練の時間に解散した。体が勝手に目覚めた。",d:{men:10,gk:12,jin:6},f:s=>{s.flags.taiRetired=1;s.pol="bal";s.flags.jobBonus=(s.flags.jobBonus||0)+8;log("体育会を引退")}}},
  {label:"燃え尽きた",ok:{t:"燃え尽きた。1か月、何もできなかった。授業にも就活にも、行く理由が見つからない。",d:{men:-8,gk:10,tai:-3},f:s=>{s.flags.taiRetired=1;s.pol="rest";s.flags.jobBonus=(s.flags.jobBonus||0)+5;log("体育会を引退")}}},
 ]};
SCHED[7].push(["taiRetire",10,25]);
/* 就活：4年続けた体育会は強い（jobPenalty の後に足す） */
const _jobTai=job;
job=function(s,mode){const bonus=(s.circle&&s.circle.cat==="tai"&&!s.flags.taiQuit)?8:(s.flags.taiRetired?8:0);s.flags.jobBonus=(s.flags.jobBonus||0)+bonus;_jobTai(s,mode);s.flags.jobBonus=(s.flags.jobBonus||0)-bonus;if(bonus&&s.job&&["S","A","B"].includes(s.job.tier))s._txt=(s._txt||"")+"「体育会で4年」の一言が、どの面接でも効いた。"};
LIFE_FLOW.push(
 {c:TAI,w:4,t:"朝練。6時。暗い。",d:{tai:1,gaku:-1}},
 {c:TAI,w:3,t:"授業中、気づいたら終わっていた。ノートは白紙。",d:{gaku:-1}},
 {c:TAI,w:2,t:"今週、部員以外と話していない。",d:{jin:-1}},
 {c:TAI,w:2,t:"先輩のドリンクを作った。自分の分は、無い。",d:{}},
 {c:TAI,w:2,t:"筋肉痛で階段が降りられない。1限の教室は4階だった。",d:{tai:-1}},
 {c:TAI,t:"ゼミの友達が「体育会ってどんな感じ？」と聞いた。説明する言葉がなかった。",d:{}},
 {c:s=>TAI(s)&&s.flags.taiRyo,w:2,t:"寮の門限22時。コンビニに行くにも先輩の許可が要る。",d:{men:-1}},
 {c:s=>s.flags.taiQuit,w:2,t:"元部員と学食で会った。向こうは目を合わせなかった。",d:{men:-2}},
 {c:s=>s.flags.taiQuit,t:"辞めてから、朝6時に目が覚める癖が抜けない。",d:{}},
 {c:s=>s.flags.taiRetired,w:2,t:"引退してから、体が重い。練習がないと、動かし方が分からない。",d:{tai:-1,men:-1}},
 {c:s=>s.flags.taiRetired,t:"引退した同期と飲んだ。4年間の話は、4時間では終わらなかった。",d:{men:3,jin:1}},
);
