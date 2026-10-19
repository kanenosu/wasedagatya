/* 名前・顔写真・学生証の描画 */
/* ---------- 名前・学籍番号・顔写真 ---------- */
const SEI=["佐藤","鈴木","高橋","田中","伊藤","渡辺","山本","中村","小林","加藤","吉田","山田","佐々木","松本","井上","木村","清水","斎藤","森","池田"];
const MEI=["ひかる","優","翼","葵","遥","蓮","陽向","涼","真琴","晴","湊","千尋","薫","渚","歩","樹","光","瑞希","悠","颯"];
const SKINS=["#F6D9C2","#EEC7A6","#E0B08A","#C8946C"];
const HAIRS=["#1E1A1A","#2E231D","#3F2D22"];
const DYED=["#9A6A3A","#B98B4E","#7A4A2E"];
const CLOTHES=["#4E6E8E","#7A8C6E","#8E5A5A","#5E5E6E","#C9B48E","#3E4A5E"];
function newFace(){return{skin:pick(SKINS),hair:pick(HAIRS),dye:pick(DYED),style:ri(0,4),glasses:Math.random()<.3,cloth:pick(CLOTHES),brow:ri(0,2)}}
function faceSVG(f,st){
  const s=st||{men:60,tai:60};
  const hair=(S&&S.flags&&S.flags.dyed)?f.dye:f.hair;
  const suit=S&&S.started&&(S.pol==="job"||S.T===6);
  const back=[
   `<path d="M33 60 Q30 100 40 112 L80 112 Q90 100 87 60Z" fill="${hair}"/>`,
   "",
   `<path d="M31 58 Q28 92 36 96 L84 96 Q92 92 89 58Z" fill="${hair}"/>`,
   "",
   `<path d="M32 60 Q26 110 44 120 L76 120 Q94 110 88 60Z" fill="${hair}"/>`,
  ][f.style];
  const top=[
   `<path d="M33 60 Q31 27 60 25 Q89 27 87 60 Q82 41 60 39 Q40 40 33 60Z" fill="${hair}"/>`,
   `<path d="M34 54 Q33 30 60 28 Q87 30 86 54 Q80 40 60 38 Q40 40 34 54Z" fill="${hair}"/>`,
   `<path d="M31 64 Q29 26 60 24 Q91 26 89 64 Q84 44 66 40 Q60 48 52 41 Q38 44 31 64Z" fill="${hair}"/>`,
   `<path d="M35 50 Q36 32 60 31 Q84 32 85 50 Q78 38 60 37 Q42 38 35 50Z" fill="${hair}"/>`,
   `<path d="M32 62 Q30 26 60 24 Q90 26 88 62 Q86 46 72 42 L60 36 L48 42 Q34 46 32 62Z" fill="${hair}"/>`,
  ][f.style];
  const mouth=s.men>=60?`<path d="M51 82 Q60 90 69 82" stroke="#7A3B33" stroke-width="2.4" fill="none" stroke-linecap="round"/>`:s.men>=30?`<path d="M52 84 L68 84" stroke="#7A3B33" stroke-width="2.4" stroke-linecap="round"/>`:`<path d="M51 87 Q60 80 69 87" stroke="#7A3B33" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  const browY=s.men<30?[52,50]:[50,50];
  const brow=`<path d="M42 ${browY[0]} Q48 ${47+f.brow} 54 ${browY[1]}" stroke="${f.hair}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M66 ${browY[1]} Q72 ${47+f.brow} 78 ${browY[0]}" stroke="${f.hair}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  const eyes=`<ellipse cx="48" cy="61" rx="3.2" ry="${s.tai<25?2:3.8}" fill="#1E1A1A"/><ellipse cx="72" cy="61" rx="3.2" ry="${s.tai<25?2:3.8}" fill="#1E1A1A"/>`;
  const bags=s.tai<35?`<path d="M43 67 Q48 70 53 67 M67 67 Q72 70 77 67" stroke="#9C7A8A" stroke-width="1.6" fill="none" opacity=".7"/>`:"";
  const glass=f.glasses?`<circle cx="48" cy="61" r="8" stroke="#2A2A2A" stroke-width="1.8" fill="none"/><circle cx="72" cy="61" r="8" stroke="#2A2A2A" stroke-width="1.8" fill="none"/><path d="M56 61 L64 61" stroke="#2A2A2A" stroke-width="1.8"/>`:"";
  const blush=S&&S.flags&&S.flags.partner?`<ellipse cx="42" cy="74" rx="5" ry="3" fill="#E58A8A" opacity=".45"/><ellipse cx="78" cy="74" rx="5" ry="3" fill="#E58A8A" opacity=".45"/>`:"";
  const sweat=S&&S.kane<0?`<path d="M86 46 Q90 54 86 57 Q82 54 86 46Z" fill="#7FB6E0"/>`:"";
  const body=suit
   ?`<path d="M14 150 Q16 118 40 110 L60 122 L80 110 Q104 118 106 150Z" fill="#2B2F3A"/><path d="M48 110 L60 130 L72 110 L60 116Z" fill="#FFFFFF"/><path d="M58 118 L62 118 L64 140 L60 145 L56 140Z" fill="#8C1D32"/>`
   :`<path d="M12 150 Q14 116 42 108 Q60 116 78 108 Q106 116 108 150Z" fill="${f.cloth}"/><path d="M46 109 Q60 120 74 109" stroke="#00000022" stroke-width="3" fill="none"/>`;
  return `<svg viewBox="0 0 120 150" role="img" aria-label="顔写真"><rect width="120" height="150" fill="#D5E3EC"/>${back}${body}<rect x="52" y="90" width="16" height="20" fill="${f.skin}"/><ellipse cx="33" cy="64" rx="4.5" ry="7" fill="${f.skin}"/><ellipse cx="87" cy="64" rx="4.5" ry="7" fill="${f.skin}"/><ellipse cx="60" cy="63" rx="27" ry="31" fill="${f.skin}"/>${top}${brow}${eyes}${bags}${glass}<path d="M60 64 Q58 72 61 74" stroke="#00000030" stroke-width="2" fill="none" stroke-linecap="round"/>${mouth}${blush}${sweat}</svg>`;
}
function idHTML(){
  const yr=S.started?Math.min(S.ay+1,5):1;
  return `<div class="idcard">
   <div class="id-top"><span class="id-uni">早稲田大学</span><span class="id-kind">学生証 STUDENT ID</span></div>
   <div class="id-circ">${S.circle?`<span class="circ-name">${esc(S.circle.n)}</span>${S.post?`<span class="kind">${S.post}</span>`:""}`:`<span class="circ-name muted">サークル未所属</span>`}${S.circle2?`<small class="muted">＋${esc(S.circle2.n)}</small>`:""}</div>
   <div class="id-main">
    <div class="id-info">
     <div class="id-name">${esc(S.name)}</div>
     <dl>
      <dt>学部</dt><dd>${S.fac.n}</dd>
      <dt>学年</dt><dd>${yr}年${S.ay>=4?"（留年）":""}・${S.fac.c}キャンパス</dd>
      <dt>生年月日</dt><dd>${S.by}年${S.bd.m}月${S.bd.d}日（${S.date?age():18}歳）</dd>
      <dt>学籍番号</dt><dd class="mono">${S.sid}</dd>
${S.susp>0?`<dt>処分</dt><dd class="neg">停学中（あと${S.susp}日）</dd>`:(S.flags.teigaku?`<dt>処分歴</dt><dd class="neg">停学${S.flags.teigaku}回</dd>`:"")}
     </dl>
    </div>
    <div class="id-photo">${faceSVG(S.face,S.s)}</div>
   </div>
   ${S.started?`<div class="id-stats">${hudHTML()}</div>`:""}
   <div class="id-foot"><span>有効期限 ${BASE_Y+4}年3月31日${S.ay>=4?"（延長）":""}</span><span class="mono">${S.n}周目</span></div>
  </div>`;
}
