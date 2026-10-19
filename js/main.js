/* 起動 */
renderHome();
// 音：ヘッダーのトグル。ブラウザの制限で、最初の操作のあとでしか鳴らせない
const sndBtn=$("#snd");
if(meta.sound){sndBtn.setAttribute("aria-pressed","true");sndBtn.textContent="音 ON"}
sndBtn.onclick=()=>{audioInit();audioOn(!AU.on)};
document.addEventListener("pointerdown",function once(){document.removeEventListener("pointerdown",once);if(meta.sound&&!AU.on){audioInit();audioOn(true)}},{passive:true});
// タブを離れたら止める。戻ったら再開する（自分で止めていた場合は止めたまま）
document.addEventListener("visibilitychange",()=>{if(!S||S.ending||!S.started)return;if(document.hidden){if(AU.on)bgmStop();if(timer){stop();S.autoPaused=true;syncCtrl()}}else{if(AU.on)bgmStart();if(S.autoPaused){S.autoPaused=false;if(!S.userPaused&&!S.busy)run()}}});

/* スクロール中は時計を小さくする（ステータスの帯は残す） */
addEventListener("scroll",()=>{
  // 固定帯の高さが変わってもスクロール位置が行ったり来たりしないよう、しきい値に幅を持たせる
  const h=document.documentElement,y=window.scrollY;
  if(y>200)h.classList.add("scrolled");else if(y<60)h.classList.remove("scrolled");
  if(typeof watchMeters==="function")watchMeters();
},{passive:true});
