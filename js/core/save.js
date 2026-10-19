/* 途中セーブ（この端末のlocalStorage）。毎月1日とイベントのたびに自動保存し、トップの「続きから」で復元する */
const RUN_KEY="waseda-gacha-run-v1";

// イベントのオブジェクトは関数を含むので、保存時は「どの表の何番目か」に変換する
function evRef(ev){
  if(ev==="exam"||ev==="grades")return ev;
  for(const k in EV)if(EV[k]===ev)return ["EV",k];
  let i;
  if((i=POOL.indexOf(ev))>=0)return ["POOL",i];
  if((i=FATE.indexOf(ev))>=0)return ["FATE",i];
  if((i=MIRACLE.indexOf(ev))>=0)return ["MIRACLE",i];
  for(const k in CRISIS)if(CRISIS[k]===ev)return ["CRISIS",k];
  if(ev===EV20)return ["X","EV20"];
  if(ev===AUDIT)return ["X","AUDIT"];
  if(ev===YAMI2)return ["X","YAMI2"];
  return null;
}
function evFromRef(r){
  if(typeof r==="string")return r;
  const [t,k]=r;
  return t==="EV"?EV[k]:t==="POOL"?POOL[k]:t==="FATE"?FATE[k]:t==="MIRACLE"?MIRACLE[k]:t==="CRISIS"?CRISIS[k]:({EV20,AUDIT,YAMI2})[k];
}
const profIdx=p=>Math.max(0,PROFS.indexOf(p));
const rowOut=o=>({...o,prof:profIdx(o.prof)});
const rowIn=o=>({...o,prof:PROFS[o.prof]||PROFS[4]});

function saveRun(){
  if(!S||S.ending||!S.started)return;
  try{
    const out={...S};
    delete out._k;delete out._txt;delete out._hd;delete out._rar;delete out._after;delete out._afterExam;delete out._exam;delete out._rv;
    out.date=S.date.toISOString();
    out.circle=S.circle?S.circle.id:null;out.circle2=S.circle2?S.circle2.id:null;
    out.fac=FACS.indexOf(S.fac);out.route=ROUTES.indexOf(S.route);out.home=HOMES.findIndex(h=>h.n===S.home.n);out.wealth=S.wealth;out.lang=LANGS.indexOf(S.lang);out.past=PASTS.indexOf(S.past);out.brain=BRAINS.indexOf(S.brain);
    out.prof=profIdx(S.prof);
    out.tt=S.tt.map(rowOut);
    out.pending=S.pending?{...S.pending,rows:S.pending.rows.map(rowOut)}:null;
    out.qual=S.qual?QUALS.indexOf(S.qual):-1;
    out.sched=S.sched.map(it=>({k:it.k,ref:evRef(it.ev)})).filter(it=>it.ref);
    out.today=S.today.map(evRef).filter(Boolean);
    out.busy=false;out.userPaused=false;
    localStorage.setItem(RUN_KEY,JSON.stringify(out));
  }catch(e){}
}
function loadRun(){
  try{const r=JSON.parse(localStorage.getItem(RUN_KEY));return r&&r.date?r:null}catch(e){return null}
}
function clearRun(){try{localStorage.removeItem(RUN_KEY)}catch(e){}}
function resumeRun(){
  const r=loadRun();if(!r)return false;
  S=r;
  S.date=new Date(r.date);
  S.fac=FACS[r.fac]||FACS[0];S.route=ROUTES[r.route]||ROUTES[0];S.home=HOMES[r.home]||HOMES[0];S.wealth=(r.wealth&&r.wealth.tier)?r.wealth:WEALTH[4];S.lang=LANGS[r.lang]||LANGS[0];S.past=PASTS[r.past]||PASTS[0];S.brain=BRAINS[r.brain]||BRAINS[2];S.school=r.school||pickSchool(S.route);
  if(S.s.com==null)S.s.com=45;
  if(typeof S.area!=="object"||!S.area||S.area.min==null)S.area=pickStation(S.home,S.fac);
  S.circle=r.circle?CIRCLES.find(c=>c.id===r.circle)||null:null;
  S.circle2=r.circle2?CIRCLES.find(c=>c.id===r.circle2)||null:null;
  S.prof=PROFS[r.prof]||PROFS[4];
  S.tt=(r.tt||[]).map(rowIn);
  S.pending=r.pending?{...r.pending,rows:r.pending.rows.map(rowIn)}:null;
  S.qual=r.qual>=0?QUALS[r.qual]:null;
  S.sched=(r.sched||[]).map(it=>({k:it.k,ev:evFromRef(it.ref)})).filter(it=>it.ev);
  S.today=(r.today||[]).map(evFromRef).filter(Boolean);
  S.busy=false;S.userPaused=false;S.ending=null;
  return true;
}
