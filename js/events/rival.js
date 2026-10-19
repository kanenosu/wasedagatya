/* ライバル：同じ学部の同期。成績・就活で比べられる */
const _initPeople0=initPeople;
initPeople=function(){_initPeople0();S.rival={n:pick(SEI)+" "+pick(MEI),gaku:ri(40,72),jin:ri(35,70),gpa:[],job:null,win:0,lose:0}};
function rivalTermGpa(){const r=S.rival;const g=clamp(2+(r.gaku-50)/28+rnd(-.5,.5),0,4);r.gpa.push(g);r.gaku=clamp(r.gaku+ri(-2,3),20,95);return g}
const _peopleHTML0=peopleHTML;
peopleHTML=function(){const h=_peopleHTML0();if(!S.rival)return h;return h.replace(/<\/div>\s*$/,`<span><small>ライバル</small>${esc(S.rival.n)}</span></div>`)};
POOL.push(
);
EV.rivalGrade={when:s=>!!s.rival&&s.grades.length>0,title:"ライバルの成績",text:s=>{const me=s.grades[s.grades.length-1].gpa,rv=rivalTermGpa();s._rv={me,rv};if(rv>me+.3)s.rival.lose++;else if(me>rv+.3)s.rival.win++;return `同期の${s.rival.n}が成績表を見せてきた。学期GPA ${rv.toFixed(2)}。自分は${me.toFixed(2)}。${rv>me+.3?"負けた。":me>rv+.3?"勝った。":"ほぼ互角。"}`},
  choices:s=>[
   {label:"負けてられない",ok:{t:"次の学期は図書館に住むと決めた。",d:{gaku:3,men:-2}}},
   {label:"人は人、自分は自分",ok:{t:"比べない。それが一番健康だ。",d:{men:3}}},
   {label:"飲みに誘う",req:{kane:1},ok:{t:"結局、お互いの愚痴で終電になった。",d:{jin:3,kane:-0.4}}},
  ]};
for(const T of [0,2,4,6])SCHED[T].push(["rivalGrade",9,12]);
for(const T of [1,3,5,7])SCHED[T].push(["rivalGrade",3,12]);
EV.rivalJob={when:s=>!!s.rival&&!s.rival.job,title:"ライバルの就活",text:s=>{const co=pick([...COMPANIES.shosha.S,...COMPANIES.consul.A,...COMPANIES.kinyu.A,...COMPANIES.maker.A,...COMPANIES.it.A,...COMPANIES.media.A]);s.rival.job=co;return `${s.rival.n}が${co}の内々定をもらったらしい。SNSで知った。`},
  choices:s=>[
   {label:"素直に祝う",ok:{t:"「お前もすぐ決まるよ」と言われた。",d:{men:2,jin:2}}},
   {label:"焦る",ok:{t:"その夜、ESを3社分書いた。",d:{gk:2,men:-4,tai:-2}}},
   {label:"ミュートする",ok:{t:"見なければ、ない。",d:{men:1,jin:-1}}},
  ]};
SCHED[5].push(["rivalJob",1,25]);
POOL.push(
 {w:2,terms:[0,7],when:s=>!!s.rival,title:"ライバルと同じ授業",text:s=>`${s.rival.n}と同じ授業を取っていた。発表の順番が隣だ。`,
  choices:s=>[
   {label:"全力で準備する",req:{tai:20},chance:s=>pc(s.s.gaku,s.rival.gaku),ok:{t:"自分の発表の後、教授が頷いた。向こうは少し悔しそうだった。",d:{gaku:3,men:5},f:s=>s.rival.win++},ng:{t:"向こうの発表の方が、明らかによかった。",d:{men:-4,gaku:2},f:s=>s.rival.lose++}},
   {label:"普通にやる",ok:{t:"どちらも普通だった。",d:{gaku:1}}},
  ]},
 {w:2,terms:[2,7],when:s=>!!s.rival&&!!s.circle,title:"ライバルの肩書き",text:s=>`${s.rival.n}が自分のサークルで代表になったと聞いた。`,
  choices:s=>[
   {label:"自分も幹部を狙う",ok:{t:"次の代替わりで手を挙げると決めた。",d:{gk:2,men:1},f:s=>s.flags.wantKanbu=1}},
   {label:"肩書きに興味はない",ok:{t:"自分のやりたいことをやる。",d:{men:3}}},
  ]},
 {w:1,terms:[6,7],when:s=>!!s.rival&&s.rival.job,title:"ライバルとの最後の飲み",text:s=>`卒業前、${s.rival.n}と二人で飲んだ。4年間、ずっと比べていた。`,
  choices:s=>[
   {label:"正直に「ライバルだった」と言う",ok:{t:"「俺もだよ」と言われた。4年間で一番いい夜だった。",d:{men:8,jin:4}}},
   {label:"何も言わずに乾杯",ok:{t:"言わなくても伝わっていた、と思いたい。",d:{men:4}}},
  ]},
);
LIFE_FLOW.push(
 {c:s=>!!s.rival,w:2,t:s=>`${s.rival.n}が1限に遅刻していた。少し安心した。`,d:{men:1}},
 {c:s=>!!s.rival,t:s=>`${s.rival.n}のSNSに意識の高い投稿。既読スルー。`,d:{}},
 {c:s=>!!s.rival,t:s=>`${s.rival.n}に図書館で会った。無言で隣に座った。`,d:{gaku:1}},
 {c:s=>!!s.rival&&s.rival.job,y:[3,4],t:s=>`${s.rival.n}が内定先の研修で忙しいらしい。`,d:{}},
);
