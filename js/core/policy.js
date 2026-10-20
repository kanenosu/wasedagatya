/* 行動方針と、選択肢のゲージ条件（REQ） */
/* ---------- 行動方針（毎月1日に効く） ---------- */
const POL=[
 {id:"bal",n:"バランス",d:{},kane:0,ex:0,t:"可もなく不可もなく"},
 {id:"study",n:"勉強漬け",d:{gaku:3,jin:-2,men:-1,com:-1},kane:0,ex:5,t:"前の席に座り、飲み会は断る"},
 {id:"play",n:"遊び倒す",d:{jin:3,com:2,men:2,gaku:-2},kane:-4,ex:-5,req:{kane:5},t:"出席は最低限。金が飛ぶ"},
 {id:"work",n:"バイト漬け",d:{tai:-5,gaku:-1,jin:-1},kane:6,ex:-3,req:{tai:15},t:"週5でシフトに入る。体は確実に削れる"},
 {id:"save",n:"節約生活",d:{jin:-3,men:-2},kane:3,ex:0,t:"誘いを断って自炊する"},
 {id:"circle",n:"サークル全力",d:{jin:2,com:2,gk:2,gaku:-1,tai:-1},kane:-3,ex:-2,req:{circle:1},t:"部室に住んでいる"},
 {id:"job",n:"就活モード",d:{gk:2,com:1,men:-2},kane:-2,ex:-1,req:{ay:2},t:"ESと面接の日々"},
 {id:"rest",n:"休養",d:{tai:4,men:3,gaku:-1,jin:-1,com:-1},kane:0,ex:-1,t:"とにかく寝る"},
];
const pol=()=>POL.find(p=>p.id===S.pol)||POL[0];
function reqOK(r){
  if(!r)return true;
  for(const k in r){
    if(k==="circle"){if(!S.circle)return false}
    else if(k==="male"){if(S.sex!=="m")return false}
    else if(k==="ay"){if(S.ay<r[k])return false}
    else if(k==="kane"){if(S.kane<r[k])return false}
    else if(S.s[k]<r[k])return false;
  }
  return true;
}
function reqTxt(r){return Object.entries(r).map(([k,v])=>k==="circle"?"サークル所属":k==="male"?"男子のみ":k==="ay"?`${v+1}年以上`:`${LABEL[k]}${v}${k==="kane"?"万円":""}以上`).join("・")}

/* 既存イベントの選択肢に付けるゲージ条件 */
const REQ={
 "隣の席の人に話しかける":{com:15},
 "インカレのテニサー":{kane:5},"テニサー":{kane:5},"体育会":{tai:45},
 "1限を詰めて午後を空ける":{tai:30},
 "参加する":{tai:35},
 "免許合宿に行く":{kane:25},"青春18きっぷで一人旅":{kane:10},"短期留学":{kane:35},"サークルの合宿":{kane:8},
 "サークルで模擬店を出す":{jin:25},"客として回る":{kane:1},
 "新歓で先輩風を吹かせる":{kane:3},
 "幹部に立候補する":{jin:40},
 "人気ゼミに出す":{gaku:40},
 "アメリカの大学":{kane:30},"ヨーロッパの大学":{kane:25},"アジアの大学":{kane:10},
 "ESを20社出す":{gk:20},"長期インターンを始める":{tai:30},
 "OB・OG訪問を重ねる":{jin:30},
 "第一志望群に全振りする":{gk:45},"ベンチャー一本で行く":{gk:35},
 "告白する":{com:30},
 "二次会、三次会まで行く":{kane:2,tai:20},
 "神宮で応援する":{kane:2},"国立で観戦する":{kane:3},
 "応募する":{gaku:45},
 "掛け持ちする":{tai:30},
 "間に入って仲裁する":{com:30},
 "それでも行く":{tai:20,kane:2},
 "役割を振ってまとめる":{com:30},
 
 "毎日コツコツ書く":{men:20},"締め切り前に徹夜で仕上げる":{tai:25},
};
