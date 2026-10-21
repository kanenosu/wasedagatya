/* 名前・顔写真・学生証の描画 */
/* ---------- 名前・学籍番号・顔写真 ---------- */
const SEI=["佐藤","鈴木","高橋","田中","伊藤","渡辺","山本","中村","小林","加藤","吉田","山田","佐々木","松本","井上","木村","清水","斎藤","森","池田","橋本","石川","前田","藤田","岡田","長谷川","村上","近藤","石井","遠藤","青木","坂本","福田","太田","西村","藤井","岡本","三浦","中島","金子","原田","竹内","和田","上田","中野","宮崎","杉山","大野","柴田","久保","今井","河野","野口","松田","菊地","新井","小野","渡部","谷口","内田","石田","丸山","増田","平野","阿部","千葉","服部","五十嵐","二宮","大塚"];
const MEI=["ひかる","優","翼","葵","遥","蓮","陽向","涼","真琴","晴","湊","千尋","薫","渚","歩","樹","光","瑞希","悠","颯","大輝","拓海","翔太","健太","涼介","裕也","駿","亮","慎一","航","海斗","直樹","結衣","美咲","陽菜","さくら","莉子","彩花","愛","杏","凛","芽衣","七海","美月","琴音","奈々","楓","茜","このみ","紬","千夏","智也","圭","碧","朝陽","律","澪","文乃","日向","柚葉","まなか","航平","琉生","怜","暁"];
const SKINS=["#F7DFC9","#F1D2B4","#E6BE9A","#D6A77F","#C08D68"];
const HAIRS=["#1C1718","#2B211D","#3A2A20","#4A3526"];
const DYED=["#8E6039","#B88A4E","#7A4A2E","#A0522D","#6B4C9A"];
const CLOTHES=["#4E6E8E","#7A8C6E","#8E5A5A","#5E5E6E","#C9B48E","#3E4A5E","#D9D4C7","#2F4F6F","#9C7B9C"];
/* 顔のパーツ。性別で髪型の候補・眉の太さ・まつげ・輪郭の出やすさが変わる */
function newFace(sex){
  sex=sex==="f"?"f":"m";
  const f={sex,skin:pick(SKINS),hair:pick(HAIRS),dye:pick(DYED),cloth:pick(CLOTHES),
    style:ri(0,5),eye:ri(0,3),brow:ri(0,2),nose:ri(0,2),mouth:ri(0,2),jaw:wpick([{v:0,w:sex==="f"?5:3},{v:1,w:4},{v:2,w:sex==="f"?2:4}]).v,
    glasses:Math.random()<.28?ri(1,2):0,mole:Math.random()<.2?[pick([44,76]),ri(70,84)]:null,freckle:Math.random()<.12,
    stubble:sex==="m"&&Math.random()<.15,acc:sex==="f"&&Math.random()<.35?ri(1,2):0,lash:sex==="f",pierce:Math.random()<.15};
  return f;
}
/* 髪型：back は頭の後ろ、top は顔の前。性別ごとに6種 */
const HAIR_M=[
 {n:"短髪",top:"M31 60 Q30 28 60 24 Q90 28 89 60 Q84 42 72 40 Q60 36 48 40 Q36 42 31 60Z"},
 {n:"センター分け",top:"M31 62 Q29 26 60 24 Q91 26 89 62 Q86 44 63 42 L60 50 L57 42 Q34 44 31 62Z"},
 {n:"七三",top:"M31 62 Q29 26 60 24 Q91 26 89 62 Q88 42 74 40 Q50 50 44 42 Q34 44 31 62Z"},
 {n:"坊主",top:"M33 58 Q33 30 60 28 Q87 30 87 58 Q84 40 60 36 Q36 40 33 58Z",thin:1},
 {n:"マッシュ",top:"M30 66 Q28 24 60 22 Q92 24 90 66 Q88 50 80 52 L74 56 L66 51 L60 56 L54 51 L46 56 L40 52 Q32 50 30 66Z"},
 {n:"パーマ",top:"M29 64 Q27 24 60 22 Q93 24 91 64 Q90 46 82 48 Q84 40 76 44 Q72 36 66 42 Q60 34 54 42 Q48 36 44 44 Q36 40 38 48 Q30 46 29 64Z",back:"M30 60 Q24 90 34 104 L46 100 L46 80 L74 80 L74 100 L86 104 Q96 90 90 60Z"},
];
const HAIR_F=[
 {n:"ロング・ぱっつん",back:"M33 60 Q26 100 36 128 L84 128 Q94 100 87 60Z",top:"M31 62 Q29 24 60 22 Q91 24 89 62 Q88 48 80 50 L40 50 Q32 48 31 62Z"},
 {n:"ボブ",back:"M32 58 Q26 92 38 100 L82 100 Q94 92 88 58Z",top:"M31 62 Q29 24 60 22 Q91 24 89 62 Q86 44 72 42 L64 48 L58 42 L48 46 Q34 44 31 62Z"},
 {n:"ポニーテール",back:"M80 50 Q104 70 92 112 Q84 118 82 104 Q90 76 76 58Z",top:"M31 60 Q29 26 60 24 Q91 26 89 60 Q86 42 64 40 L58 46 L50 40 Q34 42 31 60Z"},
 {n:"お団子",top:"M31 60 Q29 26 60 24 Q91 26 89 60 Q86 42 60 40 Q34 42 31 60Z",bun:[60,26]},
 {n:"ロング・センター分け",back:"M33 60 Q24 100 34 130 L86 130 Q96 100 87 60Z",top:"M31 64 Q29 24 60 22 Q91 24 89 64 Q88 42 64 40 L60 48 L56 40 Q32 42 31 64Z"},
 {n:"ショート",top:"M31 62 Q29 26 60 24 Q91 26 89 62 Q88 46 78 44 L70 50 L62 44 L52 48 L44 44 Q34 46 31 62Z",back:"M32 58 Q28 82 36 86 L84 86 Q92 82 88 58Z"},
];
function faceSVG(f,st){
  const s=st||{men:60,tai:60};
  if(f.sex===undefined)f={...f,sex:"m",eye:0,brow:f.brow||0,nose:0,mouth:0,jaw:0};
  const hair=(S&&S.flags&&S.flags.dyed)?f.dye:f.hair;
  const H=(f.sex==="f"?HAIR_F:HAIR_M)[f.style%6];
  const suit=S&&S.started&&(S.pol==="job"||S.T===6);
  const sad=s.men<30,tired=s.tai<35,happy=s.men>=60;
  // 輪郭：0 丸 1 面長 2 シャープ
  const head=f.jaw===0?`<ellipse cx="60" cy="63" rx="27" ry="31" fill="${f.skin}"/>`
   :f.jaw===1?`<ellipse cx="60" cy="64" rx="26" ry="34" fill="${f.skin}"/>`
   :`<path d="M34 56 Q33 30 60 29 Q87 30 86 56 Q86 80 60 97 Q34 80 34 56Z" fill="${f.skin}"/>`;
  const ears=`<ellipse cx="33" cy="64" rx="4.5" ry="7" fill="${f.skin}"/><ellipse cx="87" cy="64" rx="4.5" ry="7" fill="${f.skin}"/>${f.pierce?`<circle cx="87" cy="69" r="1.3" fill="#C9A227"/>`:""}`;
  const neck=`<rect x="52" y="88" width="16" height="22" fill="${f.skin}"/><path d="M52 92 Q60 98 68 92" fill="#00000012"/>`;
  const body=suit
   ?`<path d="M14 150 Q16 118 40 110 L60 122 L80 110 Q104 118 106 150Z" fill="#2B2F3A"/><path d="M48 110 L60 130 L72 110 L60 116Z" fill="#FFFFFF"/><path d="M58 118 L62 118 L64 140 L60 145 L56 140Z" fill="#8C1D32"/>`
   :f.cloth==="#D9D4C7"?`<path d="M12 150 Q14 116 42 108 Q60 118 78 108 Q106 116 108 150Z" fill="${f.cloth}"/><path d="M46 109 L60 128 L74 109" stroke="#00000025" stroke-width="2" fill="none"/><path d="M60 128 L60 150" stroke="#00000020" stroke-width="2"/>`
   :`<path d="M12 150 Q14 116 42 108 Q60 116 78 108 Q106 116 108 150Z" fill="${f.cloth}"/><path d="M46 109 Q60 120 74 109" stroke="#00000022" stroke-width="3" fill="none"/>`;
  // 目：0 アーモンド 1 丸 2 切れ長 3 たれ目
  const eye=(cx)=>{const ry=f.eye===1?4.6:f.eye===2?2.6:3.6,rx=f.eye===2?5.2:4.4,dy=f.eye===3?1:0,RY=tired?ry*.7:ry;
    const base=`<ellipse cx="${cx}" cy="${61+dy}" rx="${rx}" ry="${RY}" fill="#FFFFFF"/><ellipse cx="${cx}" cy="${61+dy}" rx="${rx*.62}" ry="${RY*.9}" fill="#2A1E1A"/><circle cx="${cx-1.3}" cy="${59.5+dy}" r="1.1" fill="#FFFFFF"/>`;
    const lid=`<path d="M${cx-rx} ${61+dy-(f.eye===3?-1:1)} Q${cx} ${61+dy-ry-1.5} ${cx+rx} ${61+dy-(f.eye===3?1:-1)}" stroke="#2A1E1A" stroke-width="${f.lash?2.2:1.4}" fill="none" stroke-linecap="round"/>`;
    const lash=f.lash?`<path d="M${cx+rx-1} ${60+dy-ry+1} l2 -2" stroke="#2A1E1A" stroke-width="1.4" stroke-linecap="round"/>`:"";
    return base+lid+lash};
  const eyes=eye(48)+eye(72);
  // 眉：0 ストレート 1 アーチ 2 上がり眉。メンタルが低いと下がる
  const bw=f.sex==="m"?2.8:2,bo=sad?3:0;
  const browL=f.brow===0?`M41 ${52+bo} L55 ${51+bo}`:f.brow===1?`M41 ${53+bo} Q48 ${47+bo} 55 ${51+bo}`:`M41 ${55+bo} Q48 ${50+bo} 55 ${49+bo}`;
  const browR=f.brow===0?`M65 ${51+bo} L79 ${52+bo}`:f.brow===1?`M65 ${51+bo} Q72 ${47+bo} 79 ${53+bo}`:`M65 ${49+bo} Q72 ${50+bo} 79 ${55+bo}`;
  const brows=`<path d="${browL}" stroke="${hair}" stroke-width="${bw}" fill="none" stroke-linecap="round"/><path d="${browR}" stroke="${hair}" stroke-width="${bw}" fill="none" stroke-linecap="round"/>`;
  // 鼻：0 小さく 1 筋 2 丸
  const nose=f.nose===0?`<path d="M60 66 Q58 72 61 74" stroke="#00000030" stroke-width="2" fill="none" stroke-linecap="round"/>`
   :f.nose===1?`<path d="M60 63 L59 74 Q61 76 63 74" stroke="#00000035" stroke-width="1.8" fill="none" stroke-linecap="round"/>`
   :`<ellipse cx="60" cy="73" rx="3.4" ry="2.4" fill="#00000018"/><path d="M57 73 Q60 76 63 73" stroke="#00000030" stroke-width="1.6" fill="none"/>`;
  // 口：表情で変わる。女性は薄く色を入れる
  const lipc=f.sex==="f"?"#C06A6A":"#7A3B33";
  const mouth=happy?`<path d="M51 82 Q60 ${f.mouth===1?92:89} 69 82" stroke="${lipc}" stroke-width="2.4" fill="${f.mouth===1?"#FFFFFF":"none"}" stroke-linecap="round"/>`
   :sad?`<path d="M51 87 Q60 80 69 87" stroke="${lipc}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
   :f.mouth===2?`<path d="M52 84 Q60 87 68 84" stroke="${lipc}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`
   :`<path d="M52 84 L68 84" stroke="${lipc}" stroke-width="2.4" stroke-linecap="round"/>`;
  const lips=f.sex==="f"?`<path d="M53 83 Q60 80 67 83" stroke="${lipc}" stroke-width="1.2" fill="none" opacity=".6"/>`:"";
  const bags=tired?`<path d="M43 67 Q48 70 53 67 M67 67 Q72 70 77 67" stroke="#9C7A8A" stroke-width="1.6" fill="none" opacity=".7"/>`:"";
  const glass=f.glasses===1?`<circle cx="48" cy="61" r="8.5" stroke="#2A2A2A" stroke-width="1.8" fill="none"/><circle cx="72" cy="61" r="8.5" stroke="#2A2A2A" stroke-width="1.8" fill="none"/><path d="M56.5 61 L63.5 61 M39.5 60 L34 58 M80.5 60 L86 58" stroke="#2A2A2A" stroke-width="1.8"/>`
   :f.glasses===2?`<rect x="39" y="54" width="18" height="14" rx="3" stroke="#2A2A2A" stroke-width="1.8" fill="none"/><rect x="63" y="54" width="18" height="14" rx="3" stroke="#2A2A2A" stroke-width="1.8" fill="none"/><path d="M57 60 L63 60 M39 59 L34 57 M81 59 L86 57" stroke="#2A2A2A" stroke-width="1.8"/>`:"";
  const inLove=S&&S.flags&&S.flags.partner;
  const blush=(inLove||f.sex==="f")?`<ellipse cx="42" cy="73" rx="5" ry="3" fill="#E58A8A" opacity="${inLove?.45:.22}"/><ellipse cx="78" cy="73" rx="5" ry="3" fill="#E58A8A" opacity="${inLove?.45:.22}"/>`:"";
  const sweat=S&&S.kane<0?`<path d="M88 46 Q92 54 88 57 Q84 54 88 46Z" fill="#7FB6E0"/>`:"";
  const mole=f.mole?`<circle cx="${f.mole[0]}" cy="${f.mole[1]}" r="1.1" fill="#4A3526"/>`:"";
  const freck=f.freckle?`<g fill="#B07A5A" opacity=".5"><circle cx="44" cy="70" r=".9"/><circle cx="48" cy="72" r=".9"/><circle cx="72" cy="72" r=".9"/><circle cx="76" cy="70" r=".9"/><circle cx="52" cy="74" r=".8"/><circle cx="68" cy="74" r=".8"/></g>`:"";
  const stub=f.stubble?`<path d="M42 82 Q60 102 78 82 Q70 92 60 93 Q50 92 42 82Z" fill="${hair}" opacity=".22"/>`:"";
  const back=H.back?`<path d="${H.back}" fill="${hair}"/>`:"";
  const top=`<path d="${H.top}" fill="${hair}"${H.thin?' opacity=".85"':""}/>`;
  const bun=H.bun?`<circle cx="${H.bun[0]}" cy="${H.bun[1]}" r="9" fill="${hair}"/>`:"";
  const acc=f.acc&&f.sex==="f"?(f.acc===1?`<path d="M74 40 L84 44" stroke="#C9A227" stroke-width="2.2" stroke-linecap="round"/>`:`<path d="M80 44 l-5 -4 l2 6 l-6 2 l6 2 l-2 6 l5 -4 l5 4 l-2 -6 l6 -2 l-6 -2 l2 -6Z" fill="#C85A7A"/>`):"";
  const shade=`<path d="M33 62 Q36 88 60 94 Q84 88 87 62 Q84 80 60 86 Q36 80 33 62Z" fill="#00000008"/>`;
  return `<svg viewBox="0 0 120 150" role="img" aria-label="顔写真"><rect width="120" height="150" fill="#D5E3EC"/>${back}${body}${neck}${ears}${head}${shade}${top}${bun}${brows}${eyes}${bags}${glass}${nose}${freck}${mole}${stub}${mouth}${lips}${blush}${sweat}${acc}</svg>`;
}
function idHTML(){
  const yr=S.started?Math.min(S.ay+1,5):1;
  return `<div class="idcard">
   <div class="id-top"><span class="id-uni">早稲田大学</span><span class="id-kind">学生証・${S.n}周目</span></div>
   <div class="id-circ">${S.circle?`<span class="circ-name">${esc(S.circle.n)}</span>${S.post?`<span class="kind">${S.post}</span>`:""}`:`<span class="circ-name muted">サークル未所属</span>`}${S.circle2?`<small class="muted">＋${esc(S.circle2.n)}</small>`:""}</div>
   <div class="id-main">
    <div class="id-info">
     <div class="id-name">${esc(S.name)}</div>
     <dl>
      <dt>学部</dt><dd>${S.fac.n}${S.dept?`<br><small>${esc(S.dept.n)}</small>`:""}${S.track?`<br><small>${esc(S.track.n)}</small>`:""}</dd>
      <dt>学年</dt><dd>${yr}年${S.ay>=4?"（留年）":""}・${S.fac.c}キャンパス</dd>
      <dt>出身</dt><dd>${S.school.pref}・${S.school.n.replace(/高等学校$/,"")}</dd>
      <dt>最寄り</dt><dd>${S.area.n}・${S.area.min}分</dd>
      <dt>地頭</dt><dd>${S.brain.n}</dd>
${S.susp>0?`<dt>処分</dt><dd class="neg">停学中（あと${S.susp}日）</dd>`:(S.flags.teigaku?`<dt>処分歴</dt><dd class="neg">停学${S.flags.teigaku}回</dd>`:"")}
     </dl>
    </div>
    <div class="id-photo">${faceSVG(S.face,S.s)}</div>
   </div>
   ${S.started?`<div class="id-stats">${hudHTML()}</div>`:""}
  </div>`;
}
