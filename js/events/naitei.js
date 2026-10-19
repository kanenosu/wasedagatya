/* 内定後のやらかし → 内定取り消し。suspend をラップする */
const _susp0=suspend;
const NAITEI_OK=j=>j&&!["D","G","K","M"].includes(j.tier);
suspend=function(months,reason){
  _susp0(months,reason);
  if(NAITEI_OK(S.job)&&(S.jobEarly||S.T>=6)&&!S.flags.naiteiLost){
    S.flags.naiteiLost=1;
    const co=S.job.co||S.job.label;
    log(`内定取り消し（${reason}）`);
    feed(`${co}から連絡。停学処分が伝わり、内定は取り消しになった。`,applyD({men:-15,gk:-10}),"key");
    S.job={tier:"D",label:TIERS.D};S.jobEarly=null;
  }
};
POOL.push(
 {w:3,terms:[6,7],when:s=>NAITEI_OK(s.job),title:"内定者SNS",text:s=>`${s.job.co||"内定先"}の内定者懇親会。帰りに同期が酔ってSNSに「社名＋くそ」と投稿した。`,
  choices:[
   {label:"消させる",ok:{t:"翌朝には消えていた。人事は見ていなかった……と思う。",d:{jin:2}}},
   {label:"自分も乗る",chance:()=>.6,ok:{t:"誰も見ていなかった。",d:{men:1}},ng:{t:"人事から電話。内定は取り消しになった。",d:{men:-15,gk:-10},f:s=>{log("内定取り消し（SNS）");s.job={tier:"D",label:TIERS.D};s.jobEarly=null;s.flags.naiteiLost=1}}},
  ]},
 {w:2,terms:[6,7],when:s=>NAITEI_OK(s.job)&&s.cr<NEED-30,title:"内定先からの単位確認",text:"内定先から「卒業見込証明書」の提出を求められた。単位が、足りていない。",
  choices:[
   {label:"正直に相談する",ok:{t:"「卒業できなければ取り消しです」と、淡々と言われた。",d:{men:-5,gaku:3}}},
   {label:"なんとかなると言う",ok:{t:"自分に言い聞かせた。",d:{men:-2}}},
  ]},
 {w:2,terms:[6,7],when:s=>NAITEI_OK(s.job)&&adult(),title:"内定者の飲み会",text:"内定者の飲み会。人事も来ている。先輩社員が「もっと飲め」と言う。",
  choices:[
   {label:"付き合う",chance:s=>pc(s.s.tai,55),ok:{t:"最後まで立っていた。人事の覚えはよくなった。",d:{jin:3,tai:-4,kane:-0.4}},ng:{t:"店で吐いた。翌週、人事から「体調管理も仕事です」とメールが来た。",d:{men:-6,tai:-6,kane:-0.4}}},
   {label:"程よく帰る",ok:{t:"「賢いね」と先輩社員に言われた。",d:{men:2,kane:-0.4}}},
  ]},
 {w:2,terms:[6,7],when:s=>NAITEI_OK(s.job)&&s.flags.smoke&&!adult(),title:"内定先と喫煙",text:"内定先の人事と食事。喫煙所で、20歳未満の自分が吸っているところを見られた。",
  choices:[
   {label:"謝る",chance:()=>.6,ok:{t:"厳重注意で済んだ。",d:{men:-4}},ng:{t:"「法令遵守の観点から」。内定は取り消しになった。",d:{men:-15,gk:-10},f:s=>{log("内定取り消し（未成年喫煙）");s.job={tier:"D",label:TIERS.D};s.jobEarly=null;s.flags.naiteiLost=1}}},
  ]},
 {w:2,terms:[6,7],when:s=>s.flags.naiteiLost&&(!s.job||s.job.tier==="D"),title:"内定取り消しからの再起",text:"内定を失った。卒業まで半年。まだ募集している企業はある。",
  choices:[
   {label:"秋採用に全力",req:{men:25},ok:{t:"",d:{men:5},f:s=>{s.flags.jobBonus=-5;job(s,"safe");s.flags.jobBonus=0;s.flags.naiteiLost=0;s._txt="秋採用で拾ってもらえた。"+s._txt}}},
   {label:"就職留年する",ok:{t:"もう一年、就活をやり直す。親に頭を下げた。",d:{men:-5,kane:-10},f:s=>{s.flags.jobRetry=1}}},
   {label:"フリーターで考える",ok:{t:"卒業だけはする。",d:{men:2},f:s=>{s.job={tier:"D",label:TIERS.D}}}},
  ]},
);
LIFE_FLOW.push(
 {c:s=>NAITEI_OK(s.job),w:2,y:[3,4],t:"内定先から課題図書が送られてきた。分厚い。",d:{gaku:1,men:-1}},
 {c:s=>NAITEI_OK(s.job),y:[3,4],t:"内定者のグループLINEで、意識の高い投稿が流れている。",d:{men:-1}},
 {c:s=>NAITEI_OK(s.job),y:[3,4],t:"内定先からスーツの採寸の案内が来た。社会人が近い。",d:{men:2}},
 {c:s=>s.flags.naiteiLost,y:[3,4],t:"内定取り消しのことを、まだ親に言えていない。",d:{men:-3}},
);
