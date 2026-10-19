/* ゲージが底をついたときの危機イベント */
/* ---------- 危機イベント（ゲージが底をつくと発生） ---------- */
const parentChance=()=>({"太い":.9,"ふつう":.55,"細い":.15})[S.wealth.n];
const CRISIS={
 debt:{title:"口座がマイナス",text:"家賃とスマホ代の引き落としができなかった。どうする？",choices:[
  {label:"親に頭を下げる",chance:parentChance,ok:{t:"「今回だけだよ」と振り込んでくれた。情けない。",d:{kane:20,men:-6}},ng:{t:"「自分でなんとかしなさい」と言われた。",d:{men:-8}}},
  {label:"貸与型の奨学金を申し込む",req:{gaku:30},ok:{t:"毎月の振込が決まった。卒業後に返す借金だ。",d:{kane:30,men:-3},f:s=>s.flags.loan=(s.flags.loan||0)+30}},
  {label:"リボ払いで乗り切る",ok:{t:"とりあえず今月は回った。毎月の返済がずっと続く。",d:{kane:15,men:-3},f:s=>s.flags.ribo=1}},
  {label:"方針をバイト漬けに切り替える",req:{tai:15},ok:{t:"シフトを週5に増やした。",d:{},f:s=>s.pol="work"}},
 ]},
 tuition:{title:"学費が払えない",text:"借金がふくらみ、秋の学費の納入期限が過ぎた。このままだと除籍になる。",choices:[
  {label:"実家に土下座する",chance:parentChance,ok:{t:"親が定期預金を崩してくれた。一生頭が上がらない。",d:{kane:45,men:-15}},ng:{t:"実家にも余裕はなかった。",f:s=>s.ending={type:"joseki"}}},
  {label:"休学して1年働く",ok:{t:"休学届を出した。",f:s=>s.ending={type:"kyugakuWork"}}},
 ]},
 hp:{title:"倒れた",text:"駅の階段でめまいがして倒れた。救急車で運ばれた。",choices:[
  {label:"2週間入院する",ok:{t:"点滴と病院食の2週間。授業はかなり休んだ。",d:{tai:30,kane:-6,men:-3},f:s=>{s.mod-=8;s.skip=14}}},
  {label:"点滴だけ打って帰る",chance:()=>.5,ok:{t:"なんとか持ち直した。",d:{tai:12,kane:-1}},ng:{t:"3日後にまた倒れた。結局入院した。",d:{tai:25,kane:-8,men:-6},f:s=>{s.mod-=10;s.skip=18}}},
 ]},
 lonely:{title:"誰とも話していない",text:"気づけば一週間、誰とも話していない。",choices:[
  {label:"新しいサークルの新歓に行く",req:{kane:3},ok:{t:"",f:s=>{const c=pickCircle(["tennis","dance","bunka","unei"]);joinCircle(c);applyD({jin:10});s._txt=`思い切って${c.n}に入った。居場所ができた。`}}},
  {label:"学科の知り合いに連絡する",chance:s=>pc(s.s.men,40),ok:{t:"昼ごはんに行けた。それだけで救われた。",d:{jin:10,men:5}},ng:{t:"既読がつかなかった。",d:{men:-6}}},
  {label:"一人で生きると決める",ok:{t:"図書館が居場所になった。",d:{gaku:4,men:-6}}},
 ]},
 study:{title:"授業についていけない",text:"何を言っているのか分からない授業が増えてきた。",choices:[
  {label:"友達にノートを借りる",req:{jin:25},ok:{t:"ノートのおかげで全体像がつかめた。",d:{jin:-2},f:s=>s.mod+=5}},
  {label:"オフィスアワーで教授に聞く",req:{men:25},ok:{t:"教授は意外と親切だった。",d:{gaku:8,men:-2}}},
  {label:"諦める",ok:{t:"分からないまま試験を迎えることにした。",d:{men:2},f:s=>s.mod-=6}},
 ]},
 mental:{title:"心が限界に近い",text:"朝、布団から出られない日が続いている。",choices:[
  {label:"学生相談センターに行く",ok:{t:"話を聞いてもらえた。少し楽になった。",d:{men:18}}},
  {label:"方針を休養に切り替える",ok:{t:"しばらく何もしないことにした。",d:{men:5},f:s=>s.pol="rest"}},
  {label:"見なかったことにする",ok:{t:"気のせいだと思うことにした。",d:{men:-3}}},
 ]},
};
function crisis(){
  const c=S.crisis;
  const chk=(key,cond,recover)=>{if(!c[key]&&cond()){c[key]=1;S.today.push(CRISIS[key]);return true}if(c[key]&&recover())c[key]=0;return false};
  return chk("tuition",()=>S.kane<=-40,()=>S.kane>=0)
   ||chk("debt",()=>S.kane<0,()=>S.kane>=10)
   ||chk("hp",()=>S.s.tai<=5,()=>S.s.tai>=25)
   ||chk("mental",()=>S.s.men<=15,()=>S.s.men>=35)
   ||chk("lonely",()=>S.s.jin<=8,()=>S.s.jin>=25)
   ||chk("study",()=>S.s.gaku<=12,()=>S.s.gaku>=25);
}
