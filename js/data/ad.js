/* エンディングの最後に出る広告ページの中身。文言・リンクはここだけ直せばいい */
const AD={
 name:"早稲田魂",
 edition:"'26",
 kicker:"受験生応援雑誌",
 publisher:"早稲田大学英字新聞会（ザ・ワセダ・ガーディアン）",
 // 1行ずつ表示される
 lines:[
  "ガチャの4年間は終わった。本物の4年間は、まだこれからだ。",
  "早大生が受験生のために作る雑誌。合格体験記、学部紹介、OB・OGインタビュー、キャンパスの歩き方。",
  "創刊50年以上。早稲田で最も古い公認出版サークルが、毎年秋に出している。",
 ],
 note:"書店とネット販売で手に入る。1部500円。",
 url:"https://wasedaguardian.wixsite.com/wasedaguardian/tamashii",
 x:"https://x.com/rikuno_hasya",
 // 結末によって一言変える
 hook:s=>{
  const e=s.ending.type;
  if(e==="kamen")return "早稲田を出ていったあなたに。もう一度、入る側の気持ちを。";
  if(["taiho","taigaku","joseki"].includes(e))return "こうならない4年間のために。先輩たちの本音が載っている。";
  if(s.ay>=4)return "留年しても卒業はできる。でも、1年目から知っていたら。";
  if(s.fac&&s.fac.sci)return "理工の受験生へ。西早稲田の実験と製図の夜まで、先輩が書いている。";
  return "次に早稲田を目指す人へ。この雑誌を渡してほしい。";
 },
};
