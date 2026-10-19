/* 手遅れになる選択肢と、どちらかを選ぶともう片方が閉じる二者択一
   SCHED の後に読み込む */

/* ---------- 手遅れ：締め切りを過ぎると二度と選べない ---------- */
// 教職課程：2年春までに始めないと卒業までに終わらない
EV.kyoshoku={title:"教職課程を取るか",text:"2年春。教職課程は今から始めないと、卒業までに単位が揃わない。取るなら週に3コマ増える。",
 choices:[
  {label:"教職を取る",sub:"この先、時間割が重くなる",req:{gaku:40},ok:{t:"教員免許への道が開いた。4年の教育実習まで続く。",d:{gaku:2,tai:-2},f:s=>s.flags.kyoshoku=1}},
  {label:"取らない",ok:{t:"教員になる道は、ここで閉じた。",d:{men:1},f:s=>s.flags.noKyoshoku=1}},
 ]};
SCHED[2].push(["kyoshoku",4,8]);
// 交換留学：3年秋の出願が最後
EV.ryugakuLast={title:"交換留学、最後の出願",when:s=>!s.flags.abroad&&!s.fac.sils,text:"3年秋。交換留学に行けるのは、この出願が最後だ。行けば4年の就活は出遅れる。",
 choices:[
  {label:"出願する",req:{gaku:45,kane:12},chance:s=>pc(s.s.gaku+(s.flags.toefl?15:0),58),ok:{t:"通った。4年の春から半年、海外へ。就活は帰国してからだ。",d:{gk:12,gaku:5,kane:-20},f:s=>{s.flags.abroad=1;s.flags.late=1;s.flags.lateAbroad=1}},ng:{t:"学内選考で落ちた。留学の道はここで閉じた。",d:{men:-6},f:s=>s.flags.noAbroad=1}},
  {label:"就活を優先して見送る",ok:{t:"留学はしないと決めた。もう戻れない。",d:{men:-1},f:s=>s.flags.noAbroad=1}},
 ]};
SCHED[5].push(["ryugakuLast",10,20]);
// 卒業判定の手遅れ警告：3年春の時点で単位が足りなさすぎる
EV.tooLate={title:"もう4年では卒業できない",when:s=>s.cr<70,text:s=>`3年春。累計${s.cr}単位。残り3学期で全部取っても、124単位には届かない。4年卒業は、もう手遅れだ。`,
 choices:[
  {label:"5年で卒業する覚悟を決める",ok:{t:"親に電話した。長い沈黙のあと、「わかった」と言われた。",d:{men:-8},f:s=>s.flags.fiveYear=1}},
  {label:"現実を見ない",ok:{t:"見なかったことにしても、単位は増えない。",d:{men:-3}}},
 ]};
SCHED[4].push(["tooLate",4,20]);
// 奨学金の締め切り
POOL.push(
 {w:3,terms:[0,1],when:s=>s.wealth.tier!=="太い"&&!s.flags.shou&&!s.flags.shouLate,title:"奨学金の申請締め切り",text:"給付型奨学金の申請締め切りが明日。書類は半分しか埋まっていない。",
  choices:[
   {label:"徹夜で書き上げる",req:{tai:20},chance:s=>pc(s.s.gaku,50),ok:{t:"採用された。4年間、毎月の重さが変わる。",d:{kane:18,tai:-4},f:s=>s.flags.shou=1},ng:{t:"出したが不採用だった。次の募集は来年だ。",d:{tai:-4,men:-3},f:s=>s.flags.shouLate=1}},
   {label:"間に合わない",ok:{t:"締め切りを過ぎた。この年の給付型は、もう申請できない。",d:{men:-4},f:s=>s.flags.shouLate=1}},
  ]},
 {w:3,terms:[6,6],when:s=>!s.job||s.job.tier==="D",title:"もう6月",text:"4年の6月。周りは内々定を持っている。自分はまだ持ち駒がない。",
  choices:[
   {label:"今から動く",ok:{t:"説明会はほとんど終わっている。残っている会社を片っ端から受けた。",d:{men:-5,gk:3},f:s=>s.flags.late=1}},
   {label:"秋採用に賭ける",ok:{t:"夏を就活に使わないと決めた。賭けだ。",d:{men:2}}},
  ]},
 {w:3,terms:[3,5],when:s=>!s.circle&&!s.flags.noCircle,title:"サークルに入るなら最後",text:"2年の秋。今からサークルに入ると、同期は1年生だ。3年から入る人はほぼいない。",
  choices:[
   {label:"1年生に混ざって入る",req:{com:30},ok:{t:"",f:s=>{const c=pickCircle(["tennis","dance","bunka","music","unei"]);joinCircle(c);applyD({jin:8,men:3});s._txt=`${c.n}に入った。同期は全員年下だ。`}}},
   {label:"もう入らない",ok:{t:"サークルのない大学生活が確定した。",d:{men:-2,gaku:2},f:s=>s.flags.noCircle=1}},
  ]},
);

/* ---------- 二者択一：片方を取ると、もう片方は閉じる ---------- */
POOL.push(
 {w:4,terms:[4,6],when:s=>!!s.circle&&s.ind,title:"サークルの本番と最終面接",text:s=>`${s.circle.n}の年に一度の本番と、第一志望の最終面接が同じ日になった。どちらかしか行けない。`,
  choices:[
   {label:"最終面接に行く",ok:{t:"本番は後輩に託した。同期の何人かは、それ以来よそよそしい。",d:{jin:-8,gk:4},f:s=>s.flags.jobBonus=(s.flags.jobBonus||0)+8}},
   {label:"本番に出る",ok:{t:"面接は辞退した。本番は最高だった。第一志望は消えた。",d:{men:8,jin:5},f:s=>s.flags.jobBonus=(s.flags.jobBonus||0)-10}},
  ]},
 {w:4,terms:[1,7],when:s=>s.flags.partner&&!!s.circle,title:s=>`${PN("lover")}の誕生日とサークルの合宿`,text:s=>`${PF("lover")}の誕生日と、${s.circle.n}の合宿が重なった。`,
  choices:[
   {label:"誕生日を優先する",ok:{t:"合宿を休んだ。サークルでの立場は少し下がった。",d:{men:6,jin:-5}}},
   {label:"合宿を優先する",chance:s=>pc(s.s.com,55),ok:{t:"事前に祝って、理解してもらえた。",d:{jin:4,men:-2}},ng:{t:"「私とサークル、どっちが大事なの」。別れた。",d:{men:-14,jin:4},f:s=>s.flags.partner=0}},
  ]},
 {w:3,terms:[2,4],when:s=>s.flags.job&&!s.flags.abroad,title:"バイトの昇格と留学",text:"バイト先から「来月から時給を上げて、シフトリーダーに」と言われた。同じ時期に、半年の留学の募集がある。",
  choices:[
   {label:"昇格を受ける",ok:{t:"収入が増えた。留学の募集は、知らないうちに締め切られていた。",d:{kane:5,gk:3},f:s=>{s.flags.noAbroad=1;s.flags.jobLead=1}}},
   {label:"バイトを辞めて留学する",req:{kane:15},chance:s=>pc(s.s.gaku,55),ok:{t:"半年、海外にいた。帰国したらバイト先に自分の席はなかった。",d:{gk:12,gaku:5,kane:-25},f:s=>{s.flags.abroad=1;s.flags.job=0}},ng:{t:"留学の選考に落ちた。バイトの昇格も、別の人に決まっていた。",d:{men:-8},f:s=>s.flags.noAbroad=1}},
  ]},
 {w:3,terms:[2,5],when:s=>s.flags.partner,title:"恋人の留学",text:s=>`${PF("lover")}が1年の留学に行く。「待っててほしい」と言われた。`,
  choices:[
   {label:"待つ",ok:{t:"遠距離が始まった。時差で、会話の時間がずれていく。",d:{men:-4},f:s=>s.flags.ldr=1}},
   {label:"別れる",ok:{t:"お互いのためだと言った。本当かは分からない。",d:{men:-12},f:s=>s.flags.partner=0}},
  ]},
 {w:4,terms:[3,5],when:s=>s.flags.ldr&&s.flags.partner,title:"遠距離の限界",text:s=>`${PF("lover")}との遠距離、半年。最近、返信が1日遅れる。`,
  choices:[
   {label:"会いに行く",req:{kane:9},ok:{t:"航空券を買った。会ったら全部どうでもよくなった。",d:{kane:-15,men:10},f:s=>s.flags.ldr=0}},
   {label:"電話で話す",chance:s=>pc(s.s.com*.5+s.s.men*.5,55),ok:{t:"3時間話した。続けられると思った。",d:{men:4}},ng:{t:"「もう無理かも」と言われた。",d:{men:-12},f:s=>{s.flags.partner=0;s.flags.ldr=0}}},
  ]},
 {w:3,terms:[4,5],when:s=>s.post&&s.ind,title:"幹部の任期と就活",text:s=>`${s.circle?s.circle.n:"サークル"}の${s.post}として、あと半年残っている。でも就活が本格化する。`,
  choices:[
   {label:"任期を全うする",ok:{t:"サークルを最後まで回した。ESに書けるが、面接の準備は足りない。",d:{gk:6,men:-3},f:s=>s.flags.jobBonus=(s.flags.jobBonus||0)-3}},
   {label:"途中で引き継ぐ",ok:{t:"後輩に任せた。「逃げた」と言う人もいた。",d:{jin:-6,gk:-2},f:s=>{s.post=null;s.flags.jobBonus=(s.flags.jobBonus||0)+5}}},
  ]},
 {w:3,terms:[6,7],when:s=>s.job&&!["D","G"].includes(s.job.tier)&&s.fac.sci,title:"卒研と内定者研修",text:"内定先の研修と、研究室の実験が重なった。教授は「研究が優先」と言う。",
  choices:[
   {label:"研究室を優先する",ok:{t:"内定先には頭を下げた。教授の評価は上がった。",d:{gaku:4,gk:2,men:-2}}},
   {label:"研修を優先する",ok:{t:"教授が不機嫌になった。卒研の評価が怖い。",d:{men:-5},f:s=>s.mod-=4}},
  ]},
 {w:3,terms:[1,7],title:"親の入院と大事な日",text:s=>`親が入院した。同じ週に${s.ay>=2?"最終面接":"期末試験"}がある。`,
  choices:[
   {label:"帰省する",ok:{t:s=>s.ay>=2?"面接は辞退した。親の顔を見たら、それでよかった。":"試験を1つ受けられなかった。親の顔を見たら、それでよかった。",d:{men:-4},f:s=>{if(s.ay>=2)s.flags.jobBonus=(s.flags.jobBonus||0)-6;else s.mod-=5}}},
   {label:"東京に残る",ok:{t:"電話で謝った。「気にするな」と言われたのが、一番こたえた。",d:{men:-8}}},
  ]},
 {w:3,terms:[0,7],when:s=>s.flags.job,title:"バイトと単位",text:"バイト先が「試験期間も週5で入って」と言う。断ればシフトを減らされる。",
  choices:[
   {label:"試験を優先してシフトを減らす",ok:{t:"収入が減った。単位は守った。",d:{kane:-4,gaku:2}}},
   {label:"週5で入る",ok:{t:"財布は守った。単位が危ない。",d:{kane:4,tai:-4},f:s=>s.mod-=6}},
  ]},
 {w:2,terms:[2,6],when:s=>s.wealth.oj,title:"親の敷いたレール",text:"親から「卒業したら知り合いの会社に入りなさい。話は通してある」と言われた。",
  choices:[
   {label:"親のコネで決める",ok:{t:"就活をしないまま、進路が決まった。楽だが、何かを手放した気がする。",d:{men:-4},f:s=>{s.flags.jobBonus=20;job(s,"safe");s.flags.jobBonus=0;s._txt="親の知り合いの会社に、ほぼ無選考で入ることになった。"+s._txt;s.flags.earlyDone=1}}},
   {label:"自分で就活すると宣言する",req:{men:40},ok:{t:"親と少し揉めた。でも自分の足で立つと決めた。",d:{men:5,gk:3},f:s=>s.flags.noKone=1}},
  ]},
);
LIFE_FLOW.push(
 {c:s=>s.flags.kyoshoku,w:2,t:"教職の授業で、模擬授業をやった。緊張で声が裏返った。",d:{gk:1,com:1}},
 {c:s=>s.flags.kyoshoku&&s.ay>=2,t:"教育実習の内諾を、母校にお願いしに行った。",d:{gk:1}},
 {c:s=>s.flags.noAbroad&&s.ay>=3,t:"留学から帰ってきた同期の話を聞いて、少しだけ後悔した。",d:{men:-2}},
 {c:s=>s.flags.fiveYear,t:"5年目の学費のことを考えると、胃が痛い。",d:{men:-2}},
 {c:s=>s.flags.ldr,w:2,t:s=>`時差のせいで、${PN("lover")}との通話が深夜になった。`,d:{tai:-1,men:1}},
 {c:s=>s.flags.jobLead,t:"シフトリーダーとして、後輩のミスを謝りに行った。",d:{gk:1,men:-1}},
);
