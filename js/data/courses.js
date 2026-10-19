/* 科目データと時間割の組み立て、成績の計算 */
/* ---------- 授業（各学部の公開資料にある科目名＋分野名ベースの選択科目） ---------- */
const SCI=[["数学A2（線形代数）",4],["数学B2（微分積分）",4],["理工学基礎実験1A",2,"lab"],["理工学基礎実験1B",2,"lab"],["基礎物理学A",2],["基礎物理学B",2]];
const FAC_REQ={
 "政経":[["政治分析入門",4],["公共哲学（政治）",2],["基礎演習",2],["統計学Ⅰ",2],["経済数学入門",2],["統計学Ⅱ",2],["ゲーム理論入門",2],["公共経済学",2]],
 "法":[["憲法Ⅰ",2],["民法Ⅰ（総則Ⅰ）",2],["刑法Ⅰ（刑法総論）",4],["法学入門",2],["憲法Ⅱ",2],["民法Ⅰ（総則Ⅱ）",2],["導入演習",2]],
 "商":[["基礎数学",4],["基礎会計学",4],["ビジネス概論",2],["統計リテラシーα",1],["統計リテラシーβ",1],["基礎経済学",4],["ビジネス法入門",2],["統計リテラシーγ",1],["Pythonによるデータ解析",1]],
 "社学":[["社会学入門",2],["経営学入門",2],["経済学入門",2],["政治学入門",2],["法学入門",2]],
 "文構":[["必修基礎演習",2],["基礎講義",2],["学術的文章の作成",1]],
 "文":[["基礎講義",2],["学術的文章の作成",1]],
 "人科":[["スタディスキル",2],["学生生活とセルフマネジメント",2],["人間科学概論",2],["基礎ゼミ",2],["データリテラシー",2]],
 "基幹":SCI,"創造":SCI,"先進":SCI,
 "国教":[["統計学",2]],
 "教育":[],"スポ科":[],
};
const FAC_EL={
 "政経":["ミクロ経済学","マクロ経済学","比較政治学","国際政治経済学","計量経済学","財政学"],
 "法":["民法Ⅱ（物権）","行政法","国際法","労働法","商法","刑事訴訟法"],
 "商":["ミクロ経済学","マーケティング論","経営学","金融入門","保険入門","管理会計"],
 "社学":["社会学","国際関係論","メディア論","地域社会論","ミクロ経済学","経営戦略論"],
 "文構":["表象文化論","メディア文化論","社会学概論","文芸創作","現代芸術論","都市文化論"],
 "文":["日本文学史","西洋史概論","哲学概論","心理学概論","東洋史概論","美術史"],
 "教育":["教育学概論","教育心理学","教育社会学","教職入門","生涯学習論","教育方法論"],
 "人科":["心理学概論","環境科学","社会福祉論","認知科学","統計解析","人類学"],
 "スポ科":["スポーツ科学概論","運動生理学","スポーツ心理学","コーチング論","スポーツビジネス論","トレーニング論"],
 "国教":["Introduction to Economics","Introduction to Sociology","Academic Writing","International Relations","Japanese Society","Philosophy"],
 "基幹":["電磁気学","確率統計","プログラミング演習","応用数学","情報理論","力学"],
 "創造":["材料力学","建築計画","環境工学","流体力学","設計製図","応用数学"],
 "先進":["物理化学","有機化学","生命科学","電磁気学","量子力学","応用数学"],
};
const OPEN=["計量経済学","医療人類学","科学史・科学哲学","環境経済学"];
const SUFFIX=["","Ⅱ","特論","演習","応用","研究","特論Ⅱ","演習Ⅱ"];
const DAYS="月火水木金";
function creditTarget(T){if(T<4)return 22;if(T<6)return 20;if(T<8)return 12;return Math.min(24,Math.max(4,Math.ceil((NEED-S.cr+6)/2)*2))}
function buildTT(T){
  const list=[],slots=new Set();
  const slot=lab=>{let s;do{s=pick(DAYS)+(lab?pick([3,4]):ri(1,5))}while(slots.has(s));slots.add(s);return s};
  const add=(n,c,kind,x)=>{if(list.some(o=>o.n===n)||S.passed.includes(n))return;list.push({n,c,kind,lab:x==="lab",lang:x==="lang",prof:wpick(PROFS),slot:slot(x==="lab")})};
  for(const r of S.retake.filter(r=>r.sem===T%2))add(r.n,r.c,"再履修",r.x);
  S.retake=S.retake.filter(r=>r.sem!==T%2);
  const req=FAC_REQ[S.fac.s]||[];
  if(T<=1){const h=Math.ceil(req.length/2);(T===0?req.slice(0,h):req.slice(h)).forEach(([n,c,x])=>add(n,c,"必修",x))}
  if(T<=3)add(`${S.lang.n}（${T<2?"初級":"中級"}）${T%2?"Ⅱ":"Ⅰ"}`,2,"必修","lang");
  if(T===S.teT)add("Tutorial English",1,"必修");
  if(T>=3&&S.zemi&&S.zemi!=="なし")add(`専門演習（${S.zemi}）`,2,"必修");
  if(T>=5&&S.fac.sci)add("研究室ゼミ",2,"必修");
  const pool=[];
  for(const sfx of SUFFIX)for(const b of [...(FAC_EL[S.fac.s]||[]),...OPEN])pool.push(b+sfx);
  const target=creditTarget(T);
  let guard=0;
  while(list.reduce((a,o)=>a+o.c,0)<target&&guard++<80){
    const cand=pool.filter(n=>!S.passed.includes(n)&&!list.some(o=>o.n===n)&&!S.failedEl.includes(n));
    if(!cand.length){add(`自由選択科目（${S.fac.s}）${++S.freeN}`,2,"選択");continue}
    const base=cand.filter(c=>!SUFFIX.slice(1).some(x=>c.endsWith(x)));
    const n=pick(base.length?base:cand);
    add(n,2,OPEN.some(o=>n.startsWith(o))?"全学":"選択");
  }
  list.sort((a,b)=>DAYS.indexOf(a.slot[0])-DAYS.indexOf(b.slot[0])||a.slot[1]-b.slot[1]);
  return list;
}
function courseScore(co,b){
  const p=co.prof;
  const pm=p.m==="jin"?Math.round((S.s.jin-40)*.3):p.m==="att"?(S.mod<0?-12:3):p.m;
  let sc=41+S.s.gaku*.32-S.ay*1.5+b+S.mod+pm+(S.fac.easy||0)+pol().ex+DIFF[S.diff].ex+rnd(-18,22)-(S.s.men<25?10:0)-(S.s.tai<20?8:0);
  if(co.lang)sc+=S.lang.m;
  if(co.lab)sc+=(S.s.tai-50)*.2;
  if(co.kind!=="選択"&&co.kind!=="全学")sc-=2;
  return Math.round(clamp(sc,0,100));
}
const gradeOf=sc=>sc>=90?"A+":sc>=80?"A":sc>=70?"B":sc>=60?"C":"F";
const GP={"A+":4,A:3,B:2,C:1,F:0};
