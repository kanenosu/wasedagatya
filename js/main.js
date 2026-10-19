/* 起動 */
renderHome();
// タブを離れたら止める。戻ったら再開する（自分で止めていた場合は止めたまま）
document.addEventListener("visibilitychange",()=>{if(!S||S.ending||!S.started)return;if(document.hidden){if(timer){stop();S.autoPaused=true;syncCtrl()}}else if(S.autoPaused){S.autoPaused=false;if(!S.userPaused&&!S.busy)run()}});
