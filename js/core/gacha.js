/* サークルガチャ、幹部ガチャ、ハプニングガチャ */
/* ---------- ガチャ関数 ---------- */
function pickCircle(cats){
  const pool=CIRCLES.filter(c=>cats.includes(c.cat)&&(!c.only||c.only(S.fac))&&(!c.sex||S.sex===c.sex));
  return wpick(pool);
}
function circleGacha(cat){
  const c=pickCircle([cat]);
  if(c.cat==="tai"){
    const p=pc(S.s.tai,c.diff||60),ok=Math.random()<p;
    if(!ok){
      const alt=pickCircle(["tennis","dance","bunka","unei"]);
      joinCircle(alt);
      S._txt=`${c.n}の練習に参加したが、レベルが違いすぎた。流れで${alt.n}に入った。${alt.t?alt.t+"。":""}`;
      applyD({men:-5});return;
    }
    joinCircle(c);S._txt=`${c.n}に入部した。${c.t}。朝練の生活が始まる。`;return;
  }
  joinCircle(c);
  S._txt=`サークルガチャの結果、${c.n}に入った。${c.t?c.t+"。":""}`;
  S._hd=null;
}
function kanbuGacha(){
  const j=(S.s.jin+S.s.com)/2;
  const r=wpick([{n:"代表",w:5+j/10,d:{gk:20,men:-4,tai:-4}},{n:"副代表",w:8,d:{gk:14}},{n:"会計",w:8,d:{gk:12,gaku:2}},{n:"渉外",w:8,d:{gk:10,jin:5}},{n:"落選",w:Math.max(4,14-j/8),d:{men:-8}}]);
  if(r.n==="落選"){S._txt="選挙で負けた。平部員としてやっていく。";applyD(r.d)}
  else{S.post=r.n;S._txt=`${S.circle.n}の${r.n}になった。就活で話せる肩書きができた。`;applyD(r.d);log(`${S.circle.n}の${r.n}に就任`)}
}
function happening(){
  const rar=wpick(RARITY).r,hp=HAPPEN[rar].filter(h=>!h[3]||h[3](S)),h=pick(hp.length?hp:HAPPEN[rar]);
  S._rar=rar;S._txt=h[0];S._hd=h[1];if(h[2])h[2](S);
}
