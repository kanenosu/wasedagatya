/* 公式サークルガイド（circles-official.js）を CIRCLES に統合する。
   - 体育会（cat:"tai"）は公式ガイドに載らないので circles.js のまま
   - 手書きの団体のうち、公式に同じ団体があるものは公式名に揃え、ゲーム用の設定（d・t・ev・only・sex・id）は残す
   - 手書きにしか無い団体（実在しない「軽音サークル」など）は外す
   - それ以外の公式団体は全部、公式ジャンルから分類して登録する */
const CIRCLE_ALIAS={wtc:3395,galaxy:3388,aus:3372,johoku:3758,orange:3642,laissez:3632,session:3456,breakerz:3450,shockers:3364,geta:3459,hanabi:3363,odori:3360,oasis:3451,flashmo:3466,hula:3454,
 eiji:3042,ludo:3356,rakugo:3156,hoken:3087,hiso:3643,waseoke:3101,glee:3122,konsei:3124,modan:3108,folk:3309,chanson:3127,yuben:3063,tanken:3180,sai:3274,koyo:3046,soukei:3047,kouken:3084,benri:3292,hoshi:3074,jinbutsu:3264,zensouren:3219,wasespo:3043,
 green:3386,badmin:3165,ski:3441,sagi:3431,honjin:3637,kendo:3189,karate:3188,polar:3168,rikudo:3200,rikokutei:3514,swim:3468,seiren:3337,maimuto:3158,kyogi:3196,mmt:3304,mfc:3303,swing:3526,guitar:3100,josei:3734,mandolin:3104,acap:3126,
 engeki:3139,kodama:3141,mori:3324,konzert:3322,butai:3143,kabuki:3140,wmc:3217,eiken:3138,shashin:3090,manken:3093,shodo:3091,sado:3151,bijutsu:3092,bungei:3212,aiesec:3724,mun:3491,wic:3044,wess:3208,
 wasa:3529,robot:3291,quiz:3351,tetsuken:3088,tenmon:3081,shogi:3153,igo:3150,riko:3716,prog:3289,tetsugaku:3275,rekishi:3256,wandervogel:3182,rover:3072,futsal:3409,soccer:3411};
const CAT_DEF_D={tennis:{jin:10,kane:-5},dance:{tai:6,jin:8,gk:4},music:{jin:6,gk:4,kane:-2},art:{gk:5,men:3,jin:4},bunka:{jin:5,men:3,gk:2},unei:{gk:7,jin:6,tai:-2},kai:{jin:6,gk:3},sports:{tai:5,jin:6},intl:{gk:6,jin:5,com:3},tech:{gaku:4,gk:4,jin:3}};
(function mergeOfficial(){
  const byId={};for(const o of OFFICIAL_CIRCLES)byId[o[0]]=o;
  const used=new Set();const out=[];
  for(const c of CIRCLES){
    if(c.cat==="tai"){out.push(c);continue}
    const oid=CIRCLE_ALIAS[c.id];if(!oid||!byId[oid])continue;   // 公式に無い手書き団体は外す
    const o=byId[oid];used.add(oid);
    out.push({...c,n:o[1],t:(c.t||o[2]).replace(/[。！!]+$/,""),oid});
  }
  for(const o of OFFICIAL_CIRCLES){
    const [oid,n,desc,genres]=o;if(used.has(oid)||!n||out.some(x=>x.n===n))continue;
    const cat=GENRE_CAT[genres[0]]||"bunka";
    const e={id:"o"+oid,oid,cat,n,w:cat==="tennis"?3:cat==="dance"?2:1.5,d:{...CAT_DEF_D[cat]},t:desc.replace(/[。！!]+$/,"")};
    if(/最大|最強/.test(desc))e.w+=1;
    if(/理工/.test(n)||/理工/.test(desc))e.only=f=>f.sci;
    else if(/所沢|人間科学部/.test(n)||/所沢/.test(desc))e.only=f=>f.tokoro;
    if(/女声|女子|女の子|早稲女/.test(n+desc)&&!/男女|女子も|男子も/.test(desc))e.sex="f";
    else if(/男だけ|男なら|男声/.test(n+desc))e.sex="m";
    if(genres[0]==="toumonkai")e.w=.4;
    out.push(e);
  }
  CIRCLES.length=0;CIRCLES.push(...out);
})();
/* 分類の表示名を公式ガイドの区分に寄せる */
for(const c of CATS){
  if(c.id==="music"){c.n="音楽系";c.sub="オーケストラ、合唱、ジャズ、バンド、アカペラ"}
  if(c.id==="art"){c.n="演劇・映像・美術";c.sub="劇団、映画、写真、美術、ミュージカル"}
  if(c.id==="bunka"){c.n="文化・趣味系";c.sub="日本文化、マンガ・アニメ、お笑い、趣味の会"}
  if(c.id==="unei"){c.n="運営・メディア・企画";c.sub="運スタ、放研、広研、新聞会、企画サークル、出版"}
  if(c.id==="kai"){c.n="伝統系・学生稲門会";c.sub="昂揚会、雄弁会、鵬志会、便利舎、県人会"}
  if(c.id==="sports"){c.n="スポーツ同好会";c.sub="球技、武道、スキー、アウトドア。体育会ほどガチじゃない"}
  if(c.id==="intl"){c.n="国際交流・ボランティア";c.sub="AIESEC、模擬国連、子ども会、海外支援"}
  if(c.id==="tech"){c.n="学術・研究系";c.sub="法律サークル、政治・経済、歴史・哲学、理工の研究会"}
}
