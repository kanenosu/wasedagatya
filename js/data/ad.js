/* エンディングの最後に出る広告ページの中身。文言・リンク・表紙はここだけ直せばいい */
const AD={
 name:"早稲田魂",
 edition:"'26",
 kicker:"早大生の早大生による早大受験生のための",
 catch:"俺がやらなきゃ誰がやる",
 cover:"img/tamashii26.jpg",
 publisher:"The Waseda Guardian（早稲田大学英字新聞会）",
 price:"500yen",
 // 公式の紹介文
 lead:"早大受験生に向けた受験生応援雑誌、早稲田魂の2026年度版が完成。ユーモラスな学部紹介、早稲田にまつわる記事は読んでいてクスッと笑えるのに対し、会員達の合格体験記は感動を導くこと間違いなし。友田オレ様を招待したOBインタビューや伊藤賀一先生へのインタビューも含め読みごたえ抜群。是非ご購読下さい！",
 // 表紙の目次
 contents:["OBインタビュー 友田オレ","早稲田大学全11学部紹介","合格体験記・早稲田体験記","孤独の食トレ","逆転合格座談会","伊藤賀一先生インタビュー","ワセダ万博"],
 shop:"https://thewasedaguar.booth.pm/items/7050707", // BOOTHの販売ページ
 url:"https://wasedaguardian.wixsite.com/wasedaguardian/tamashii",
 x:"https://x.com/rikuno_hasya",
 // 結末によって一言変える
 hook:s=>{
  const e=s.ending.type;
  if(e==="kamen")return "早稲田を出ていったあなたに。もう一度、入る側の気持ちを。";
  if(["taiho","taigaku","joseki"].includes(e))return "こうならない4年間のために。先輩たちの本音が載っている。";
  if(s.ay>=4)return "留年しても卒業はできる。でも、1年目から知っていたら。";
  if(s.fac&&s.fac.sci)return "理工の受験生へ。全11学部紹介に、西早稲田の夜も書いてある。";
  return "ガチャの4年間は終わった。次に早稲田を目指す人に、この雑誌を。";
 },
};
