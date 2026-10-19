/* 不可避イベントと奇跡イベントの追加分（fate.js の後に読み込む） */

FATE.push(
 {once:"tuitionUp",title:"不可避：学費の値上げ",text:"来年度から学費が値上げされると発表があった。",choices:[
  {label:"受け入れる",ok:{t:"親に申し訳ない。",d:{kane:-5,men:-3}}},
 ]},
 {once:"shopClose",when:s=>s.flags.job,title:"不可避：バイト先の閉店",text:"バイト先が来月で閉店することになった。",choices:[
  {label:"新しいバイトを探す",chance:()=>.6,ok:{t:"すぐに次が見つかった。",d:{men:-2}},ng:{t:"なかなか見つからない。しばらく収入がない。",d:{men:-6},f:s=>s.flags.job=0}},
 ]},
 {title:"不可避：スマホの水没",text:"トイレにスマホを落とした。",choices:[
  {label:"買い替える",ok:{t:"LINEのトーク履歴が半分消えた。",d:{kane:-6,men:-4}}},
 ]},
 {title:"不可避：PCの故障",text:"レポート締め切りの前日、ノートPCの画面が真っ暗になった。",choices:[
  {label:"修理に出して図書館のPCで書く",ok:{t:"徹夜で書き直した。",d:{kane:-8,tai:-6,men:-6}}},
 ]},
 {title:"不可避：大雪",text:"記録的な大雪で、電車が止まった。",choices:[
  {label:"家で過ごす",ok:{t:"授業が休講になった。課題だけは出された。",d:{men:2},f:s=>s.mod-=1}},
 ]},
);

MIRACLE.push(
 {once:"rarebook",title:"奇跡：古本屋の掘り出し物",text:"早稲田通りの古本屋の100円ワゴンで、有名作家のサイン入り初版本を見つけた。",choices:[
  {label:"古書店に売る",ok:{t:"15万円で売れた。",d:{kane:15,men:8}}},
  {label:"自分で持っておく",ok:{t:"本棚の一番いい場所に飾った。",d:{men:10}}},
 ]},
 {once:"kohai",title:"奇跡：母校の後輩",text:"高校の後輩が早稲田に合格して、「先輩に憧れて受けました」と挨拶に来た。",choices:[
  {label:"キャンパスを案内する",ok:{t:"自分がここにいる意味を、少しだけ思い出した。",d:{men:12,jin:3}}},
 ]},
 {once:"offer",when:s=>(s.flags.intern||0)>=1,title:"奇跡：インターン先からのオファー",text:"長期インターン先の社長から、「卒業したら幹部候補で来てほしい」と言われた。",choices:[
  {label:"前向きに考えると答える",ok:{t:"就活の保険ができた。",d:{men:10,gk:8},f:s=>{s.flags.early=1;s.flags.ob=1}}},
 ]},
 {once:"prize",title:"奇跡：懸賞論文",text:"授業の課題を書き直して出した懸賞論文が、最優秀賞に選ばれた。",choices:[
  {label:"授賞式に出る",ok:{t:"賞金と、ESに一生書ける実績をもらった。",d:{kane:10,gk:15,gaku:4}}},
 ]},
);
