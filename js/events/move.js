/* 引っ越しと住まいの出来事。SCHED と STATIONS の後に読み込む */

const STA=n=>Object.values(STATIONS).flat().find(x=>x.n===n);
function moveTo(home,sta,extra){
  if(home==="上京して一人暮らし"&&SHUTOKEN.includes(S.school.pref))home="実家を出て一人暮らし";
  S.home=HOMES.find(h=>h.n===home)||S.home;
  S.area={...sta,...(extra||{})};
  if(S.fac.tokoro&&home!=="実家から通学")S.area.min=sta.n==="所沢"?15:sta.min+35;
  log(`${S.home.n}（${S.area.n}）に引っ越した`);
}

/* 2年春：住まいを見直す */
EV.move2={title:"2年目の住まい",text:s=>`2年目の春。今は${s.home.n}（${s.area.n}、キャンパスまで${s.area.min}分）。このままでいいか。`,
 choices:s=>[
  {label:"今のまま",ok:{t:"引っ越しは面倒だ。",d:{}}},
  ...(!s.home.solo||s.area.min>12?[{label:"キャンパスの近くに引っ越す",sub:"早稲田・西早稲田・高田馬場",req:{kane:9},ok:{t:"徒歩圏に引っ越した。1限が怖くなくなった。",d:{kane:-15,men:3},f:s=>moveTo("上京して一人暮らし",pick([STA("早稲田"),STA("西早稲田"),STA("高田馬場")]))}}]:[]),
  ...(s.home.solo&&s.area.c>=-2?[{label:"家賃の安いところへ",sub:"江古田・練馬・西葛西",req:{kane:5},ok:{t:"毎月2万円浮いた。通学は少し遠くなった。",d:{kane:-8},f:s=>moveTo("上京して一人暮らし",pick([STA("江古田"),STA("練馬"),STA("西葛西")]))}}]:[]),
  ...(s.home.n==="実家から通学"&&s.area.min>=45?[{label:"実家を出る",sub:"通学が長すぎる",req:{kane:12},ok:{t:"親は少し寂しそうだった。初めての一人暮らしだ。",d:{kane:-20,men:-3,jin:3},f:s=>moveTo("上京して一人暮らし",pick([STA("高田馬場"),STA("落合"),STA("下落合")]))}}]:[]),
  ...(s.home.n==="学生寮"?[{label:"寮を出て一人暮らし",req:{kane:11},ok:{t:"門限から解放された。静かすぎて最初は眠れなかった。",d:{kane:-18,men:2,jin:-3},f:s=>moveTo("上京して一人暮らし",pick([STA("高田馬場"),STA("中野"),STA("東中野")]))}}]:[]),
  ...(s.flags.partner&&s.home.solo?[{label:s=>`${PN("lover")}と同棲する`,sub:"家賃は半分",req:{kane:6},ok:{t:"二人暮らしが始まった。家賃は半分、喧嘩は倍。",d:{kane:-10,men:5},f:s=>{s.area={...s.area,c:(s.area.c||0)-4};s.flags.dousei=1}}}]:[]),
 ]};
SCHED[2].push(["move2",4,5]);

/* 3年春：寮の退去（寮は2年まで、というルールが多い） */
EV.dormOut={title:"寮の退去期限",when:s=>s.home.n==="学生寮",text:"寮は2年まで。退去の通知が来た。",
 choices:s=>[
  {label:"キャンパスの近くに引っ越す",req:{kane:9},ok:{t:"寮の仲間と最後の鍋をして、出た。",d:{kane:-15,jin:-2,men:2},f:s=>moveTo("上京して一人暮らし",pick([STA("早稲田"),STA("高田馬場"),STA("落合")]))}},
  {label:"安いところへ",req:{kane:5},ok:{t:"家賃優先で選んだ。通学は遠くなった。",d:{kane:-8},f:s=>moveTo("上京して一人暮らし",pick([STA("江古田"),STA("練馬"),STA("西葛西")]))}},
  {label:"寮の友達とルームシェア",req:{jin:30},ok:{t:"2LDKを2人で借りた。寮の延長みたいな生活だ。",d:{kane:-6,jin:3},f:s=>{moveTo("上京して一人暮らし",STA("中野"));s.area.c-=3;s.flags.share=1}}},
 ]};
SCHED[4].push(["dormOut",4,3]);

POOL.push(
 {w:2,terms:[0,9],when:s=>s.home.solo,title:"水漏れ",text:"上の階から水が漏れてきた。天井にシミが広がっている。",
  choices:[
   {label:"管理会社に連絡する",ok:{t:"修理に3日かかった。その間ホテル代は出なかった。",d:{men:-3,kane:-2}}},
   {label:"バケツで耐える",ok:{t:"1週間、バケツの音で眠った。",d:{men:-5,tai:-2}}},
  ]},
 {w:2,terms:[0,9],when:s=>s.home.solo,title:"大家さん",text:"大家さんに廊下で呼び止められた。「学生さん、ゴミの日守ってね」。",
  choices:[
   {label:"謝って、お菓子を持っていく",req:{kane:1},ok:{t:"次の日、大家さんから野菜をもらった。",d:{kane:0,men:3,jin:1}}},
   {label:"聞き流す",ok:{t:"それ以来、廊下で目を合わせてくれない。",d:{men:-2}}},
  ]},
 {w:2,terms:[0,7],when:s=>s.area.min>=20&&s.area.min<=40&&!s.flags.bike,title:"自転車を買う",text:"駅までの徒歩と乗り換えが地味に重い。自転車なら通学時間が縮む。",
  choices:[
   {label:"買う",req:{kane:3},ok:{t:"通学時間が10分縮んだ。雨の日は地獄だが。",d:{kane:-3,tai:2},f:s=>{s.flags.bike=1;s.area={...s.area,min:Math.max(5,s.area.min-10)}}}},
   {label:"歩く",ok:{t:"歩数だけは稼げる。",d:{tai:1}}},
  ]},
 {w:2,terms:[1,7],when:s=>!!s.circle,title:"友達の引っ越し",text:s=>`${PF("friend")}の引っ越しを手伝うことになった。4階、エレベーターなし。`,
  choices:[
   {label:"手伝う",req:{tai:25},ok:{t:"冷蔵庫を2人で運んだ。焼肉をおごってもらった。",d:{tai:-5,jin:5,men:3}}},
   {label:"用事があると断る",ok:{t:"後で少し気まずかった。",d:{jin:-3}}},
  ]},
 {w:2,terms:[1,9],title:"引っ越しバイト",text:"3月の引っ越しバイト。日給1万5千円。",
  choices:[
   {label:"3日間入る",req:{tai:30},ok:{t:"腰が死んだ。財布は生き返った。",d:{kane:4,tai:-8}}},
   {label:"やめておく",ok:{t:"体を大事にした。",d:{}}},
  ]},
 {w:2,terms:[1,6],when:s=>s.home.solo&&!s.flags.share&&!s.flags.dousei,title:"ルームシェアの誘い",text:s=>`${PF("friend")}から「広い部屋を2人で借りない？」と誘われた。`,
  choices:[
   {label:"一緒に住む",req:{kane:5},ok:{t:"家賃は下がった。生活リズムの違いで、たまに喧嘩する。",d:{kane:-8,jin:4,men:-2},f:s=>{s.area={...s.area,c:(s.area.c||0)-3};s.flags.share=1}}},
   {label:"一人がいい",ok:{t:"自分の部屋が一番だ。",d:{men:2}}},
  ]},
 {w:3,terms:[1,7],when:s=>s.flags.share,title:"ルームシェアの揉め事",text:"同居人が、洗い物を1週間放置している。",
  choices:[
   {label:"話し合ってルールを決める",req:{com:25},ok:{t:"当番表ができた。",d:{com:2,jin:1}}},
   {label:"自分が全部洗う",ok:{t:"ストレスがたまる。",d:{men:-4}}},
  ]},
 {w:3,terms:[1,7],when:s=>s.flags.dousei,title:"同棲の現実",text:s=>`${PF("lover")}との同棲。相手の生活音が気になりだした。`,
  choices:[
   {label:"ちゃんと話す",chance:s=>pc(s.s.com,45),ok:{t:"お互いの「嫌なこと」を言い合えた。",d:{men:4}},ng:{t:"気まずい沈黙が3日続いた。",d:{men:-5}}},
   {label:"我慢する",ok:{t:"小さな不満が積もっていく。",d:{men:-3}}},
  ]},
 {w:2,terms:[0,7],when:s=>s.home.n==="実家から通学",title:"実家の居心地",text:"大学の友達はみんな一人暮らし。「実家いいな」と言われるが、自由がない。",
  choices:[
   {label:"一人暮らしの計画を立てる",ok:{t:"家賃を調べて、現実を知った。",d:{men:-2,gaku:1}}},
   {label:"実家の良さを噛みしめる",ok:{t:"今日もご飯が出てきた。",d:{men:3,tai:2}}},
  ]},
);
LIFE_FLOW.push(
 {c:s=>s.flags.share,w:2,t:"同居人が友達を連れてきて、リビングが占拠された。",d:{men:-1,jin:1}},
 {c:s=>s.flags.dousei,w:2,t:s=>`${PN("lover")}が先に起きて、コーヒーを淹れてくれた。`,d:{men:3}},
 {c:s=>s.flags.bike,t:"自転車の鍵を家に忘れて、結局歩いた。"},
 {c:s=>s.home.solo,t:"不動産屋の前で、来年の家賃を眺めてため息をついた。"},
 {m:[3],y:[3,4],t:"卒業。部屋の退去立ち会いで、4年分のホコリと向き合った。",d:{men:2}},
 {m:[3],y:[3,4],t:"引っ越しの段ボールに、1年のときの新歓ビラが出てきた。",d:{men:3}},
);
