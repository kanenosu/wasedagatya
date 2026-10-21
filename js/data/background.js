/* 背景（出身・住まい・入試・実家）が初期ステータスとフラグに効く。
   newRun（timeline.js）で bgCompute を呼び、S.bg にタグ、S.flags に背景フラグが入る。
   タグは学生証と入学ガチャの設定欄に出る。背景ごとの出来事は js/events/background.js */
const FAR_PREFS=["北海道","青森","岩手","秋田","山形","宮城","福島","富山","石川","福井","鳥取","島根","岡山","広島","山口","徳島","香川","愛媛","高知","福岡","佐賀","長崎","熊本","大分","宮崎","鹿児島","沖縄","海外"];
function bgCompute(c){
  const m={},tags=[],flags={};
  const add=(d)=>{for(const k in d)m[k]=(m[k]||0)+d[k]};
  const local=SHUTOKEN.includes(c.school.pref);
  // 内部進学：高校からの友達が最初から大勢いる。受験していないぶん学力は低め
  if(c.school.kind==="附属"){flags.naibu=1;tags.push("内部の友達が多い");add({jin:10,com:3,gaku:-3,men:4})}
  // 指定校推薦：高校に成績が報告される。一般組との差を感じやすい
  else if(c.route.n==="指定校推薦"){flags.shiteiko=1;tags.push("指定校組");add({men:2,gaku:-2})}
  // 1浪：打たれ強いが、同期は年下
  if(c.ronin){flags.ronin=1;tags.push("1浪");add({men:4,gaku:3,jin:-2})}
  // 東京の実家：地元のコミュニティがそのまま残る。遠いと通学で削れる
  if(c.home.n==="実家から通学"){
    if(c.school.pref==="東京"){flags.jimoto=2;tags.push("地元が東京");add({jin:6,men:3,kane:2})}
    else{flags.jimoto=1;tags.push(`${c.school.pref}から通学`);add({jin:3,tai:-3,kane:1})}
  }
  // 上京：知り合いゼロから。遠い実家ほど帰れない
  else if(!local&&c.home.n!=="学生寮"){flags.jokyo=1;tags.push("上京組");add({jin:-4,men:-3})}
  if(FAR_PREFS.includes(c.school.pref)){flags.tooi=1;tags.push("実家が遠い");add({men:-2})}
  // 実家の太さ：細いとバイト前提で体力を削るが、苦労ぶんガクチカの種がある
  if(c.wealth.tier==="細い"){flags.hosoi=1;tags.push("仕送りは期待できない");add({tai:-2,gk:3})}
  if(c.wealth.tier==="太い"){tags.push("実家が太い");add({com:2,kane:5})}
  // 高校時代
  if(c.past.n==="帰国子女"){flags.kikoku=1;tags.push("帰国子女")}
  if(c.past.n==="ガリ勉"&&flags.naibu){add({gaku:4})}
  return {m,tags,flags};
}
