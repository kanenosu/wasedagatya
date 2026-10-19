/* 共通ユーティリティと保存（localStorage） */
const $=s=>document.querySelector(s);
const app=$("#app");
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rnd=(a,b)=>a+Math.random()*(b-a);
const ri=(a,b)=>Math.floor(rnd(a,b+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const wpick=a=>{let t=a.reduce((s,x)=>s+(x.w||1),0),r=Math.random()*t;for(const x of a){if((r-=(x.w||1))<0)return x}return a[a.length-1]};
const pc=(stat,diff)=>clamp(.5+(stat-diff)/80,.05,.95);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 保存（この端末だけ） ---------- */
const KEY="waseda-gacha-v1";
function load(){try{const m=JSON.parse(localStorage.getItem(KEY));if(m&&m.history)return m}catch(e){}return{runs:0,history:[],firstS:null,speed:2}}
function save(m){try{localStorage.setItem(KEY,JSON.stringify(m))}catch(e){}}
let meta=load();
