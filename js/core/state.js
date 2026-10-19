/* ゲーム状態Sとステータス操作 */
/* ---------- 共通処理 ---------- */
let S=null;
function applyD(d){
  const out=[];
  for(const k in d){
    let v=d[k]; if(!v) continue;
    // 難易度：ステータスのマイナス変化だけ倍率をかける
    if(v<0&&k!=="kane"&&k!=="cr"&&S.diff)v=Math.min(-1,Math.round(v*DIFF[S.diff].neg*(k==="tai"?.8:1)));
    if(k==="kane")S.kane=Math.round((S.kane+v)*10)/10;
    else if(k==="cr")S.cr+=v;
    else{const b=S.s[k];S.s[k]=clamp(b+v,0,100);if(S.s[k]===b)continue}
    out.push([k,v]);
  }
  return out;
}
const kaneTxt=(k,v)=>k!=="kane"?(v>0?"+":"")+v:Math.abs(v)<1?(v>0?"+":"-")+Math.round(Math.abs(v)*10)+"千円":(v>0?"+":"")+(Math.round(v*10)/10)+"万円";
function chips(list){return `<div class="chips">${list.map(([k,v])=>`<span class="chip ${v>0?"up":"down"}">${LABEL[k]} ${kaneTxt(k,v)}</span>`).join("")}</div>`}
function log(t){S.log.push({term:S.date?`${S.date.getFullYear()%100}/${S.date.getMonth()+1}`:"入学",t})}
function gpa(){return S.gu?S.gp/S.gu:0}
const val=x=>typeof x==="function"?x(S):x;
function joinCircle(c){S.circle=c;applyD(c.d||{});log(`${c.n}に入った`)}
