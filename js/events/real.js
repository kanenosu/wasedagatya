/* 大学生のリアル（お金・制度・サークル運営の闇）と、難易度・資格のデータ */

/* ---------- 難易度（入学前に選ぶ） ---------- */
// ex: 試験の点数補正 / kane: 毎月の収支補正（万円） / neg: マイナス変化の倍率
const DIFF={
 easy:{n:"ゆるめ",t:"留年しにくく、金にも困りにくい",ex:7,kane:1.5,neg:.7},
 normal:{n:"ふつう",t:"真面目にやれば4年で卒業できる",ex:4,kane:.8,neg:.9},
 hard:{n:"シビア",t:"一度つまずくと立て直しが難しい",ex:-5,kane:-1.2,neg:1.25},
};

/* ---------- 資格（イベントのたびに1つ抽選） ---------- */
const QUALS=[
 {n:"TOEIC",fee:1,diff:48,gk:6,ok:"800点を超えた。ESに書ける。",ng:"600点台だった。ESには書かないことにした。"},
 {n:"簿記2級",fee:1,diff:55,gk:5,ok:"合格した。サークルの会計を任されそうだ。",ng:"工業簿記で沈んだ。"},
 {n:"ITパスポート",fee:1,diff:40,gk:3,ok:"合格した。とりあえず履歴書の行が1つ埋まった。",ng:"まさかの不合格。誰にも言えない。"},
 {n:"宅建",fee:1,diff:65,gk:7,ok:"合格した。不動産業界の面接で一目置かれた。",ng:"1点足りなかった。"},
 {n:"英検準1級",fee:1,diff:58,gk:5,ok:"合格した。面接で緊張しすぎて声が裏返ったのに。",ng:"二次試験で落ちた。"},
 {n:"FP3級",fee:1,diff:42,gk:3,ok:"合格した。親の保険の見直しを頼まれた。",ng:"年金の問題で全滅した。"},
 {n:"秘書検定2級",fee:1,diff:45,gk:3,ok:"合格した。敬語だけは完璧になった。",ng:"記述問題で落ちた。"},
];
// 資格イベントが発生する直前に、受ける資格を1つ決める
POOL.find(e=>e.title==="資格を取る？").when=s=>{s.qual=pick(QUALS);return true};

/* ---------- 幹部の横領と会計監査 ---------- */
const AUDIT={title:"会計監査",text:s=>`${s.circle?s.circle.n:"サークル"}の代替わりの会計監査。帳簿と通帳の残高が合わない。使い込んだのは自分だ。`,
 choices:[
  {label:"正直に話して全額返す",req:{kane:10},ok:{t:"頭を下げて返した。幹部は辞任。サークルには居づらくなった。",d:{kane:-10,men:-10,jin:-10},f:s=>{s.flags.oryo=0;s.post=null;log("部費の使い込みを認めて幹部を辞任")}}},
  {label:"領収書を作ってごまかす",chance:()=>.35,ok:{t:"なんとかごまかせた。でも毎晩うなされる。",d:{men:-10},f:s=>s.flags.oryo=0},
   ng:{t:"OBが通帳の記録を照合して発覚した。サークルを除名され、大学にも報告された。",d:{kane:-10,jin:-15},f:s=>{s.flags.oryo=0;const c=s.circle;s.post=null;s.circle=null;log(`${c?c.n:"サークル"}を除名`);s._after=()=>suspend(SUSP_MONTHS(),"サークル部費の横領")}}},
 ]};

/* ---------- 選択イベント（ランダム枠に追加） ---------- */
POOL.push(
 {w:5,terms:[3,7],when:s=>!!s.circle&&(s.post==="会計"||s.post==="代表"),title:"部費の通帳",text:s=>`${s.circle.n}の部費の通帳を預かっている。残高は${ri(60,150)}万円。今月の家賃が払えるか怪しい。`,
  choices:s=>[
   {label:"1円も手を付けない",ok:{t:"当たり前のことをした。",d:{men:2}}},
   {label:"来月返すつもりで10万円だけ借りる",ok:{t:"自分の口座に移した。手が震えた。",d:{kane:10,men:-6},f:s=>{s.flags.oryo=1;s.flags.oryoT=s.T}}},
  ]},
 {w:3,terms:[2,7],when:s=>!!s.circle&&!s.post,title:"消えた部費",text:s=>`${s.circle.n}の前の会計が、部費を使い込んでいたことがわかった。合宿の予約金が払えない。`,
  choices:[
   {label:"同期で立て替える",req:{kane:5},ok:{t:"1人5万円ずつ出し合った。合宿は守れた。",d:{kane:-5,jin:5,gk:2}}},
   {label:"前の会計を問い詰める",chance:s=>pc(s.s.men,45),ok:{t:"分割で返すと約束させた。",d:{gk:3,men:-2}},ng:{t:"逆ギレされ、サークルが二つに割れた。",d:{men:-8,jin:-6}}},
   {label:"関わらない",ok:{t:"その年の合宿は中止になった。",d:{men:-3,jin:-2}}},
  ]},
 {w:3,terms:[0,7],when:s=>!!s.circle,title:"合宿の幹事",text:"合宿の幹事を任された。直前になってキャンセルが続出している。",
  choices:[
   {label:"キャンセル料を自腹で立て替える",req:{kane:8},ok:{t:"誰からも返ってこなかった。",d:{kane:-8,jin:3}}},
   {label:"規約どおりキャンセル料を全員から集める",req:{men:30},chance:s=>pc(s.s.jin,45),ok:{t:"全員から回収できた。几帳面さが評価された。",d:{gk:4,jin:2}},ng:{t:"「ケチ」と陰で言われた。",d:{jin:-6,men:-4}}},
  ]},
 {w:2,terms:[1,7],when:s=>!!s.circle&&s.T%2===1,title:"売上金の封筒",text:"早稲田祭の模擬店の売上金を入れた封筒が見当たらない。",
  choices:[
   {label:"全員で探す",chance:()=>.55,ok:{t:"段ボールの底から出てきた。全員で崩れ落ちた。",d:{men:3}},ng:{t:"見つからなかった。責任者として弁償した。",d:{kane:-6,men:-6}}},
   {label:"黙って自腹で補填する",req:{kane:6},ok:{t:"誰にも言わずに埋めた。",d:{kane:-6,men:-3}}},
  ]},
 {w:4,terms:[2,9],when:s=>adult()&&!s.flags.nenkin,title:"国民年金の納付書",text:"20歳になったので、国民年金の納付書が届いた。毎月1万円台後半を払えと書いてある。",
  choices:[
   {label:"学生納付特例を申請する",ok:{t:"手続きをした。在学中は納付が猶予される。",d:{men:1},f:s=>s.flags.nenkin=1}},
   {label:"払う",req:{kane:20},ok:{t:"1年分を払った。痛い。",d:{kane:-20},f:s=>s.flags.nenkin=1}},
   {label:"放っておく",ok:{t:"見なかったことにした。",d:{},f:s=>s.flags.nenkin=2}},
  ]},
 {w:3,terms:[1,7],when:s=>s.flags.job,title:"扶養の壁",text:"親から「バイト代、扶養の範囲を超えないようにしてね」と連絡が来た。",
  choices:[
   {label:"年末までシフトを減らす",ok:{t:"12月はほぼ働けなかった。",d:{kane:-6,tai:3}}},
   {label:"気にせず働く",ok:{t:"翌年、親の税金が増えて怒られた。",d:{kane:4,men:-6}}},
  ]},
 {w:3,terms:[7,9],when:s=>s.job&&!["D","G","K","M"].includes(s.job.tier),title:"内定ブルー",text:"内定先の懇親会から帰ってきて、本当にここでいいのか分からなくなった。",
  choices:[
   {label:"そのまま入社する",ok:{t:"迷いながらも腹をくくった。",d:{men:2}}},
   {label:"内定を辞退して就活をやり直す",chance:s=>pc(s.s.gk,55),ok:{t:"",f:s=>{job(s,"safe");s._txt=`辞退してやり直した。${s._txt}`}},ng:{t:"辞退したが、次は決まらなかった。",d:{men:-12},f:s=>{s.job={tier:"D",label:TIERS.D}}}},
  ]},
 {w:6,terms:[6,6],when:s=>s.fac.s==="教育",title:"教育実習",text:"母校で3週間の教育実習。授業案を毎晩書き直す。",
  choices:[
   {label:"全力でやり切る",chance:s=>pc(s.s.tai,45),ok:{t:"最後の日、生徒から寄せ書きをもらった。",d:{gk:10,men:6,tai:-8}},ng:{t:"途中で体調を崩した。",d:{tai:-12,men:-6,gk:4}}},
   {label:"最低限こなす",ok:{t:"無事に終わった。",d:{gk:3,tai:-3}}},
  ]},
 {w:2,terms:[1,9],title:"実家からの電話",text:"実家から、親が入院したと連絡が来た。",
  choices:[
   {label:"すぐに帰省する",req:{kane:4},ok:{t:"顔を見て安心した。仕送りは少し減ることになった。",d:{kane:-4,men:-3},f:s=>s.flags.lessmoney=1}},
   {label:"電話だけして様子を見る",ok:{t:"大丈夫と言われたが、ずっと気がかりだ。",d:{men:-6}}},
  ]},
 {w:2,terms:[0,7],when:s=>!!s.circle,title:"先輩の終電ルール",text:"飲み会で先輩に「1年は終電後も残るのが伝統」と言われた。",
  choices:[
   {label:"帰る",ok:{t:"次の日から先輩の当たりが少し強い。",d:{jin:-4,tai:2}}},
   {label:"残る",ok:{t:"朝5時の高田馬場。タクシー代は割り勘だった。",d:{tai:-6,kane:-3,jin:3}}},
  ]},
 {w:2,terms:[1,7],when:s=>s.flags.partner&&!!s.circle,title:"サークル内の三角関係",text:"恋人と、自分の同期が二人きりで会っていたらしい。サークル中が知っている。",
  choices:[
   {label:"問いただす",chance:s=>pc(s.s.men,50),ok:{t:"誤解だった。謝られた。",d:{men:4}},ng:{t:"誤解じゃなかった。別れた。サークルにも行きづらい。",d:{men:-15,jin:-5},f:s=>s.flags.partner=0}},
   {label:"気づかないふりをする",ok:{t:"胃が痛い。",d:{men:-6}}},
  ]},
);

/* ---------- 勝手に流れる出来事 ---------- */
LIFE_FLOW.push(
 {c:s=>s.flags.oryo&&s.T>s.flags.oryoT,w:20,t:"代替わりの会計監査の日程が決まった。",d:{men:-3},f:s=>{s.today.push(AUDIT);s.flags.oryoT=99}},
 {c:s=>s.flags.nenkin===2,w:3,t:"国民年金の督促状が届いた。",d:{men:-4}},
 {c:s=>s.flags.lessmoney,t:"仕送りが減った分、今月もギリギリだ。",d:{kane:-2,men:-1}},
 {c:s=>s.flags.loan&&gpa()<1.5&&s.gu>0,w:3,t:"成績不振で、奨学金の継続に「警告」が出た。",d:{men:-5}},
 {c:s=>!!s.circle,t:"部室に置いていた財布から、現金だけが抜かれていた。",d:{kane:-2,men:-3}},
 {t:"駅前に停めていた自転車が撤去された。引き取りに2千円かかった。",d:{kane:-1,men:-1}},
 {t:"健康診断で再検査の通知が来た。たぶん寝不足のせいだ。",d:{men:-1}},
 {c:s=>s.ay>=2,t:"スマホ代と保険証の手続きを、そろそろ自分でやれと親に言われた。",d:{men:-1}},
 {c:s=>s.ay===4,t:"同期のSNSが社会人の投稿ばかりになった。",d:{men:-3}},
);
