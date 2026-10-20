/* 結果を1枚の画像（1200×675、Xのカード比率）にして保存・共有する */
const SITE_URL="https://kanenosu.github.io/wasedagatya/";
const SHARE_TAGS="#早稲田ガチャ";
function shareText(){
  const rank=rankOf(),ttl=title();
  const out=S.job?S.job.label:S.ending&&S.ending.type==="grad"?"卒業":"";
  return `【早稲田ガチャ】${S.fac.s}・${S.route.n}→${out||"結末"}（${rank}ランク）GPA ${S.gu?gpa().toFixed(2):"—"}／${S.cr}単位「${ttl}」 ${SHARE_TAGS}`;
}
/* 顔写真のSVGをImageにする（外部フォントも外部参照も無いので data: で読める） */
function faceImage(){
  return new Promise(res=>{
    const svg=faceSVG(S.face,S.s).replace("<svg ",'<svg xmlns="http://www.w3.org/2000/svg" ');
    const img=new Image();img.onload=()=>res(img);img.onerror=()=>res(null);
    img.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg);
  });
}
function wrapText(ctx,text,maxW){
  const out=[];let line="";
  for(const ch of String(text)){const t=line+ch;if(ctx.measureText(t).width>maxW&&line){out.push(line);line=ch}else line=t}
  if(line)out.push(line);return out;
}
async function shareCanvas(){
  const W=1200,H=675,c=document.createElement("canvas");c.width=W;c.height=H;const x=c.getContext("2d");
  const rank=rankOf(),ttl=title(),gold=rank==="S"||rank==="EX";
  const out=S.job?S.job.label:S.ending&&S.ending.type==="grad"?"卒業":"";
  const F_D='"Zen Old Mincho","Hiragino Mincho ProN","Yu Mincho",serif',F_B='"Zen Kaku Gothic New","Hiragino Sans","Yu Gothic",system-ui,sans-serif',F_M='"IBM Plex Mono",ui-monospace,Menlo,monospace';
  try{await document.fonts.load(`900 80px ${F_D}`);await document.fonts.load(`700 28px ${F_B}`)}catch(e){}
  // 紙
  x.fillStyle="#F5F1F1";x.fillRect(0,0,W,H);
  // 上の帯
  x.fillStyle="#8C1D32";x.fillRect(0,0,W,96);
  x.fillStyle="#FFFFFF";x.font=`900 38px ${F_D}`;x.textBaseline="middle";x.fillText("早稲田ガチャ",40,48);
  x.font=`500 20px ${F_M}`;x.globalAlpha=.9;x.fillText(`早稲田生活 ${S.n} 周目　${fmtLong(S.date)}`,W-40-x.measureText(`早稲田生活 ${S.n} 周目　${fmtLong(S.date)}`).width,48);x.globalAlpha=1;
  // 証明書の枠
  x.strokeStyle="#E3D8D9";x.lineWidth=2;x.strokeRect(40,124,W-80,H-124-56);
  // 顔写真
  const img=await faceImage();
  if(img){x.save();x.beginPath();x.rect(72,156,168,210);x.clip();x.drawImage(img,72,156,168,210);x.restore();x.strokeStyle="#8C1D32";x.lineWidth=3;x.strokeRect(72,156,168,210)}
  // 名前と学部
  x.fillStyle="#1E1517";x.textBaseline="alphabetic";
  x.font=`900 44px ${F_D}`;x.fillText(S.name,272,206);
  x.fillStyle="#6C5F62";x.font=`500 22px ${F_B}`;
  const fl=[S.fac.n+(S.dept?"　"+S.dept.n:""),S.track?S.track.n:"",`${S.route.n}　${S.school.pref}・${S.school.n.replace(/高等学校$/,"")}`,`${cname(S)}${S.post?"（"+S.post+"）":""}`].filter(Boolean);
  fl.forEach((t,i)=>x.fillText(t.length>34?t.slice(0,33)+"…":t,272,246+i*32));
  // ランク
  x.textAlign="center";x.fillStyle=gold?"#9A7420":"#8C1D32";x.font=`900 150px ${F_D}`;x.fillText(rank,W-200,300);
  x.fillStyle="#6C5F62";x.font=`500 16px ${F_M}`;x.fillText("RANK",W-200,330);x.textAlign="left";
  // 称号と進路
  x.fillStyle="#1E1517";x.font=`900 40px ${F_D}`;
  const tl=wrapText(x,`「${ttl}」`,W-320);tl.slice(0,2).forEach((t,i)=>x.fillText(t,72,412+i*46));
  const y0=412+Math.min(tl.length,2)*46;
  x.fillStyle="#8C1D32";x.font=`700 24px ${F_B}`;x.fillText(`進路：${out||(S.ending?S.ending.type:"")}`,72,y0+4);
  // 数字
  const nums=[["GPA",S.gu?gpa().toFixed(2):"—"],["単位",`${S.cr}/${NEED}`],["所持金",`${Math.round(S.kane)}万`]];
  nums.forEach(([l,v],i)=>{const bx=72+i*180,by=y0+26;x.fillStyle="#FFFFFF";x.fillRect(bx,by,166,62);x.strokeStyle="#E3D8D9";x.lineWidth=1.5;x.strokeRect(bx,by,166,62);x.fillStyle="#6C5F62";x.font=`500 14px ${F_B}`;x.fillText(l,bx+12,by+22);x.fillStyle="#1E1517";x.font=`600 28px ${F_M}`;x.fillText(v,bx+12,by+51)});
  // ステータス棒（6本）
  const sx=72+3*180+16,sy=y0+26,sw=W-72-(sx+66);
  STATS.forEach(([k,l],i)=>{const yy=sy+i*16+6;x.fillStyle="#6C5F62";x.font=`500 12px ${F_B}`;x.textBaseline="middle";x.fillText(l,sx,yy);x.fillStyle="#ECE4E5";x.fillRect(sx+66,yy-4,sw,8);x.fillStyle="#1E1517";x.fillRect(sx+66,yy-4,sw*clamp(S.s[k],0,100)/100,8);x.textBaseline="alphabetic"});
  // 透かし印（ランクの下）
  x.save();x.translate(W-110,400);x.rotate(-.18);x.strokeStyle="#8C1D32";x.lineWidth=4;x.globalAlpha=.75;x.beginPath();x.arc(0,0,46,0,Math.PI*2);x.stroke();x.fillStyle="#8C1D32";x.textAlign="center";x.textBaseline="middle";x.font=`900 20px ${F_D}`;x.fillText("早稲田",0,-11);x.fillText(S.ending&&S.ending.type==="grad"?"卒業":"記録",0,13);x.restore();
  // 下の帯
  x.fillStyle="#6C5F62";x.font=`500 18px ${F_M}`;x.textBaseline="middle";x.fillText(SITE_URL.replace(/^https?:\/\//,""),40,H-28);
  x.textAlign="right";x.fillText(SHARE_TAGS,W-40,H-28);x.textAlign="left";
  return c;
}
function canvasBlob(c){return new Promise(r=>c.toBlob(r,"image/png"))}
async function shareImageFile(){
  const c=await shareCanvas();const blob=await canvasBlob(c);
  return new File([blob],`waseda-gacha-${S.n}.png`,{type:"image/png"});
}
/* 画像を保存（ダウンロード） */
async function saveShareImage(btn){
  try{
    const c=await shareCanvas();const url=c.toDataURL("image/png");
    const a=document.createElement("a");a.href=url;a.download=`waseda-gacha-${S.n}.png`;document.body.append(a);a.click();a.remove();
    if(btn)btn.textContent="保存した";
    openSharePreview(url);
  }catch(e){if(btn)btn.textContent="保存できなかった"}
}
/* 画像つきで共有。スマホは共有シート（画像つき）、PCはXの投稿画面＋画像はダウンロード */
async function shareToX(btn){
  const text=shareText();
  try{
    const file=await shareImageFile();
    if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],text,url:SITE_URL});if(btn)btn.textContent="共有した";return}
  }catch(e){if(e&&e.name==="AbortError")return}
  // PC：画像を落としてから投稿画面を開く。投稿画面で画像を添付してもらう
  await saveShareImage(null);
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(SITE_URL)}`,"_blank","noopener");
  if(btn)btn.textContent="画像を保存した。投稿画面で添付して";
}
/* 保存した画像のプレビュー（長押し保存もできる） */
function openSharePreview(url){
  let box=$("#shareprev");
  if(!box){box=document.createElement("div");box.id="shareprev";box.className="shareprev";const sh=$("#share");(sh?sh.parentNode:app).insertBefore(box,sh||null)}
  box.innerHTML=`<img src="${url}" alt="結果の画像"><small class="muted">画像を長押し／右クリックで保存できる。Xの投稿画面で添付して。</small>`;
}
