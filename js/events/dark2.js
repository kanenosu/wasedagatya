/* 大学生の闇、追加分。希死念慮、友人の自死、薬物、ストーカー、性被害、家族、依存、炎上。
   方針：方法や手段は書かない。相談する選択は必ず報われる。死ぬ結末は用意しない（最悪は休学・退学・逮捕）。
   相談先はゲーム内の文として出す。実在の番号：よりそいホットライン 0120-279-338（24時間）、#いのちSOS 0120-061-338 */
const HELP_LINE="よりそいホットライン 0120-279-338（24時間・無料）／#いのちSOS 0120-061-338／早稲田大学保健センター学生相談室";
const DARK2_START=POOL.length;
POOL.push(
 // ---- 希死念慮と友人の死 ----
 {w:2,terms:[1,9],when:s=>s.s.men<25&&!s.flags.ideation,title:"消えたい夜",text:s=>`何も起きていないのに、涙が止まらない。「いなくなれば楽になる」が頭から離れない。スマホの検索窓に打ちかけて、手が止まった。\n（${HELP_LINE}）`,
  choices:[
   {label:"相談窓口に電話する",ok:{t:"深夜でも人が出た。名前も聞かれなかった。30分話して、「明日、保健センターに行く」とだけ約束した。",d:{men:14,tai:2},f:s=>{s.flags.counsel=1;s.flags.ideation=1}}},
   {label:s=>`${PF("friend")}に「死にたい」と送る`,ok:{t:s=>`既読がついて、電話が鳴った。${PF("friend")}はタクシーで来た。朝まで隣にいた。`,d:{men:12,jin:5},f:s=>s.flags.ideation=1}},
   {label:"実家に電話する",ok:{t:"親は何も聞かずに「帰っておいで」と言った。翌日の新幹線に乗った。",d:{men:10,kane:-1.5},f:s=>{s.flags.ideation=1;s.skip=7}}},
   {label:"誰にも言わない",ok:{t:"朝が来た。何も変わっていない。でも、まだここにいる。",d:{men:-8,tai:-3},f:s=>s.flags.ideation=1}},
  ]},
 {w:3,terms:[1,9],when:s=>s.flags.ideation&&!s.flags.counsel,title:"あの夜のあと",text:"あの夜から2週間。誰にも言っていない。授業には出ている。笑ってもいる。",
  choices:[
   {label:"保健センターの予約を取る",ok:{t:"「よく来ましたね」。それだけで待合室で泣いた。医師につないでもらえた。",d:{men:12},f:s=>s.flags.counsel=1}},
   {label:"忙しくして忘れる",ok:{t:"予定を詰めた。夜は相変わらず長い。",d:{men:-4,gk:2,tai:-3}}},
  ]},
 {w:1,terms:[2,9],when:s=>s.s.jin>=30&&!s.flags.lostFriend,title:"訃報",text:s=>`サークルのグループLINEに、見たことのない文面が流れた。${PF("friend")}ではない。でも、何度も一緒に飲んだ同期だった。自ら命を絶ったらしい。`,
  choices:[
   {label:"葬儀に行く",ok:{t:"遺影は笑っていた。親御さんに「仲良くしてくれてありがとう」と言われて、何も返せなかった。",d:{men:-8,jin:2,gk:1},f:s=>s.flags.lostFriend=1}},
   {label:"行けない",ok:{t:"行けなかった。行かなかった自分を、しばらく許せなかった。",d:{men:-10},f:s=>s.flags.lostFriend=1}},
   {label:"残された同期で集まる",ok:{t:"誰も「なんで」とは言わなかった。朝まで、あいつの話をした。",d:{men:-5,jin:6},f:s=>s.flags.lostFriend=1}},
  ]},
 {w:2,terms:[2,9],when:s=>s.flags.lostFriend,title:"あいつの誕生日",text:"カレンダーの通知が鳴った。消していなかった。",
  choices:[
   {label:"墓参りに行く",req:{kane:1},ok:{t:"遠かった。缶ビールを置いて、少し話した。",d:{men:4,kane:-1}}},
   {label:"SNSに書く",ok:{t:"「元気にやってる」とだけ書いた。あいつの親からいいねがついた。",d:{men:3}}},
   {label:"通知を消す",ok:{t:"消せなかった。来年も鳴る。",d:{men:-2}}},
  ]},
 {w:1,terms:[1,9],when:s=>s.s.men<35,title:"駅のホームで",text:"ホームの端に立っていた。電車が来るのを、いつもと違う目で見ていた。後ろから肩を叩かれた。",
  choices:[
   {label:"振り向く",ok:{t:s=>`${PF("senpai")}だった。「飯行くぞ」。何も聞かれなかった。ラーメンが異常にうまかった。`,d:{men:10,jin:3}}},
   {label:"黄色い線の内側に戻る",ok:{t:"次の電車に乗った。家に帰って、相談窓口の番号をメモに書いた。",d:{men:6},f:s=>s.flags.ideation=1}},
  ]},
 // ---- 薬物 ----
 {w:2,terms:[1,7],when:s=>!s.flags.weed,title:"クラブの裏",text:"渋谷のクラブ。サークルの先輩のさらに先輩が「これ、合法だから」と小さな袋を見せた。周りは笑っている。",
  choices:[
   {label:"断って帰る",ok:{t:"「ノリ悪いな」。それでいい。",d:{men:2,jin:-1}}},
   {label:"一度だけ",chance:()=>.6,ok:{t:"何も感じなかった。それが一番怖かった。二度とやらないと決めた。",d:{men:-5}},ng:{t:"翌週も誘われた。断れなかった。",d:{men:-6},f:s=>s.flags.weed=1}},
   {label:"写真を撮って大学に相談する",ok:{t:"学生生活課が警察と連携した。先輩は大学からいなくなった。自分の名前は出なかった。",d:{men:-2,gk:2}}},
  ]},
 {w:3,terms:[1,9],when:s=>s.flags.weed,title:"抜き打ち",text:"ニュースで大学生の大麻事件が続いている。あの先輩から「しばらく静かにしろ」と連絡が来た。",
  choices:[
   {label:"関係を全部切る",req:{men:20},ok:{t:"番号を消して、クラブに行くのをやめた。半年で夜がふつうに戻った。",d:{men:6,jin:-3},f:s=>s.flags.weed=0}},
   {label:"もう少し続ける",chance:()=>.5,ok:{t:"何も起きなかった。今回は。",d:{men:-4}},ng:{t:"",f:s=>{s.ending={type:"yakubutsu"};s._txt="朝6時、ドアが叩かれた。任意同行、尿検査、逮捕。大学の処分は退学だった。"}}},
  ]},
 // ---- ストーカー・性被害 ----
 {w:2,terms:[0,9],when:s=>!s.flags.stalk,title:"同じ人がいる",text:"帰り道、3日連続で同じ人が後ろにいる。マンションの前にも立っていた。",
  choices:[
   {label:"警察に相談する",ok:{t:"生活安全課で相談記録を作った。パトロールが増えた。顔を見なくなった。",d:{men:4,gk:1},f:s=>s.flags.stalk=0}},
   {label:"大学の相談窓口に行く",ok:{t:"学生生活課が帰宅ルートを一緒に考え、警察にもつないでくれた。",d:{men:5},f:s=>s.flags.stalk=0}},
   {label:"気のせいだと思う",ok:{t:"郵便受けに手紙が入っていた。名前を呼ばれた。",d:{men:-10},f:s=>s.flags.stalk=1}},
  ]},
 {w:3,terms:[0,9],when:s=>s.flags.stalk,title:"玄関の前",text:"深夜、玄関のドアノブが回る音がした。鍵はかけてある。息を殺した。",
  choices:[
   {label:"110番する",ok:{t:"5分で来た。相手は元バイト先の客だった。接近禁止命令が出た。引っ越し費用は親が出してくれた。",d:{men:6,kane:-3},f:s=>s.flags.stalk=0}},
   {label:"友達の家に逃げる",req:{jin:25},ok:{t:s=>`${PF("friend")}の家に1週間いた。そのあいだに警察と大学に全部話した。`,d:{men:4,jin:3},f:s=>s.flags.stalk=0}},
   {label:"朝まで耐える",ok:{t:"朝、ドアの前に花が置いてあった。もう限界だ。翌日、警察に行った。",d:{men:-12},f:s=>s.flags.stalk=0}},
  ]},
 {w:1,terms:[0,9],when:s=>!s.flags.assault,title:"記憶のない夜",text:"飲み会のあと、記憶がない。朝、知らない部屋で目が覚めた。服が違う。相手は「合意だった」と言った。",
  choices:[
   {label:"ワンストップ支援センターに連絡する",ok:{t:"24時間の窓口につながった。病院と警察に付き添ってもらえた。自分は悪くない、と何度も言われた。",d:{men:-6,gk:1},f:s=>{s.flags.assault=1;s.flags.counsel=1}}},
   {label:"信頼できる人に話す",req:{jin:25},ok:{t:s=>`${PF("friend")}は黙って聞いて、一緒に相談窓口を調べてくれた。`,d:{men:-4,jin:4},f:s=>{s.flags.assault=1;s.flags.counsel=1}}},
   {label:"なかったことにする",ok:{t:"その飲み会のメンバーとは会えなくなった。夜、何度も目が覚める。",d:{men:-15,jin:-5},f:s=>s.flags.assault=1}},
  ]},
 // ---- 家族 ----
 {w:1,terms:[1,9],when:s=>!s.flags.parentIll,title:"父が倒れた",text:"母から電話。父が脳梗塞で倒れた。命は助かった。仕事はしばらく無理らしい。",
  choices:[
   {label:"すぐ帰る",ok:{t:"病院で父は半分しか喋れなかった。1週間、授業を休んだ。",d:{men:-8,kane:-2},f:s=>{s.flags.parentIll=1;s.skip=7}}},
   {label:"週末に帰る",ok:{t:"授業は守った。父は「来なくていい」と言った。嘘だと分かった。",d:{men:-6,kane:-1.5},f:s=>s.flags.parentIll=1}},
  ]},
 {w:3,terms:[1,9],when:s=>s.flags.parentIll,title:"仕送りの終わり",text:"父の収入が止まった。母から「仕送りは続けられない」と連絡があった。学費も次からは自分で。",
  choices:[
   {label:"給付型奨学金と授業料減免を申請する",req:{gaku:35},ok:{t:"家計急変の申請が通った。授業料が半額になり、月5万の給付が決まった。大学に救われた。",d:{kane:15,men:6,gk:2}}},
   {label:"バイトを週5にする",ok:{t:"深夜まで働いて1限に出る生活。GPAは落ちた。でも辞めなかった。",d:{kane:8,tai:-8,gaku:-4,men:-3},f:s=>s.pol="work"}},
   {label:"休学して働く",ok:{t:"",f:s=>{s.ending={type:"kyugakuWork"};s._txt="休学届を出した。実家に戻って、父の分まで働くことにした。"}}},
  ]},
 {w:1,terms:[0,9],when:s=>!s.flags.shukyo2,title:"宗教二世",text:"実家の宗教団体から「大学でも集会に出るように」と連絡が来た。仕送りの一部は献金から引かれている。",
  choices:[
   {label:"親と縁を切る覚悟で話す",req:{men:30},ok:{t:"母は泣いた。仕送りは止まった。でも、初めて自分の人生だと思えた。",d:{men:8,kane:-6,jin:2},f:s=>s.flags.shukyo2=1}},
   {label:"大学の相談窓口に話す",ok:{t:"宗教2世の相談を受けている弁護士につないでもらえた。一人ではなかった。",d:{men:6,gk:1},f:s=>s.flags.shukyo2=1}},
   {label:"卒業まで我慢する",ok:{t:"月に一度、集会に通った。誰にも言えない4年間。",d:{men:-6,jin:-2},f:s=>s.flags.shukyo2=1}},
  ]},
 // ---- 依存・体 ----
 {w:2,terms:[1,9],when:s=>s.s.men<40&&!s.flags.eating,title:"体重計",text:"食べることをコントロールしている間だけ、落ち着く。1日の摂取カロリーをアプリに打ち込む。体重は2か月で8kg減った。",
  choices:[
   {label:"保健センターに行く",ok:{t:"摂食障害の診断。栄養士と医師がついた。治るのに時間はかかるが、一人ではなくなった。",d:{men:8,tai:4},f:s=>{s.flags.counsel=1;s.flags.eating=1}}},
   {label:"誰にも言わない",ok:{t:"授業中に立ちくらみで倒れた。保健センターに運ばれ、そこで初めて話した。",d:{tai:-10,men:-4},f:s=>{s.flags.counsel=1;s.flags.eating=1}}},
  ]},
 {w:2,terms:[1,9],when:s=>adult()&&(s.flags.drink||0)>=1,title:"救急搬送",text:"飲み会の記憶が途切れた。目が覚めたら病院のベッドで、腕に点滴。急性アルコール中毒だった。",
  choices:[
   {label:"酒をやめる",ok:{t:"3か月、一滴も飲まなかった。飲み会には烏龍茶で行った。意外と誰も気にしなかった。",d:{tai:6,men:4,kane:-2},f:s=>s.flags.sober=1}},
   {label:"量を減らす",ok:{t:"「3杯まで」と決めた。守れた日と守れなかった日がある。",d:{tai:2,kane:-2}}},
   {label:"また飲む",ok:{t:"翌週も飲んだ。次は運ばれなかった。運がよかっただけだ。",d:{tai:-6,men:-3,kane:-2}}},
  ]},
 {w:2,terms:[1,9],when:s=>(s.flags.gamble||0)>=2||s.flags.ribo,title:"闇金の電話",text:"知らない番号から1日20回。「今日中に返さないと実家に行く」。借りた覚えのない額になっている。",
  choices:[
   {label:"警察と弁護士に相談する",ok:{t:"違法な金利は払わなくていい、と弁護士が言った。電話は1週間で止まった。",d:{men:8,gk:1}}},
   {label:"親に全部話す",chance:()=>.7,ok:{t:"親が弁護士を探してくれた。叱られたのは、終わったあとだった。",d:{men:5,jin:-1}},ng:{t:"親は「自分で何とかしろ」と言った。結局、大学の相談窓口経由で弁護士につながった。",d:{men:-4}}},
   {label:"別の所から借りて返す",ok:{t:"借金が借金を呼んだ。",d:{kane:-15,men:-10}}},
  ]},
 {w:2,terms:[1,9],when:s=>s.s.men<35,title:"深夜のゲーム",text:"気づいたら朝8時。1限は諦めた。ゲームを閉じると、やることがなくて怖い。",
  choices:[
   {label:"本体を友達に預ける",req:{jin:20},ok:{t:"1か月預けた。最初の3日は手が震えた。",d:{men:3,gaku:3,jin:1}}},
   {label:"保健センターで相談する",ok:{t:"依存の背景にあるものを一緒に探した。ゲームが悪いのではなかった。",d:{men:8},f:s=>s.flags.counsel=1}},
   {label:"続ける",ok:{t:"単位が消えた。ランクは上がった。",d:{gaku:-6,men:2},f:s=>s.mod-=6}},
  ]},
 // ---- 炎上・事故 ----
 {w:2,terms:[0,9],when:s=>s.flags.job&&!s.flags.enjo,title:"バイトテロ",text:"バイト先で同僚が冷蔵庫に入る動画を撮っている。「お前も映れよ」。",
  choices:[
   {label:"断って店長に言う",ok:{t:"同僚は解雇された。自分は裏切り者扱いされたが、店には残れた。",d:{men:-3,jin:-3,gk:1}}},
   {label:"笑って映る",chance:()=>.5,ok:{t:"動画は身内だけで消えた。",d:{jin:1}},ng:{t:"翌日、大学名と本名が特定されていた。店は閉店、実家に電話が鳴り続けた。",d:{men:-15,jin:-8,gk:-6},f:s=>{s.flags.enjo=1;s.flags.job=0}}},
  ]},
 {w:3,terms:[1,9],when:s=>s.flags.enjo,title:"炎上のあと",text:"検索すると、今も名前が出る。就活のES、サークルの名簿、全部が怖い。",
  choices:[
   {label:"弁護士に削除を依頼する",req:{kane:5},ok:{t:"主要な投稿は消えた。全部は消えない。それでも、眠れるようになった。",d:{kane:-5,men:6}}},
   {label:"大学の相談窓口に行く",ok:{t:"就活の相談も一緒に受けた。「正直に話せば大丈夫」と言われた。",d:{men:4,gk:2}}},
   {label:"アカウントを全部消して耐える",ok:{t:"デジタルタトゥーは残る。顔を上げて歩くまで1年かかった。",d:{men:-4}}},
  ]},
 {w:1,terms:[0,9],when:s=>s.flags.bike,title:"自転車の事故",text:"雨の明治通り。信号無視の車に跳ねられた。救急車の中で意識が戻った。",
  choices:[
   {label:"入院する",ok:{t:"鎖骨骨折で3週間。保険の手続きを親がやってくれた。",d:{tai:-15,kane:3,men:-5},f:s=>{s.skip=21;s.mod-=6}}},
   {label:"通院で済ませる",ok:{t:"右腕が1か月使えなかった。レポートは左手で打った。",d:{tai:-10,men:-3},f:s=>s.mod-=3}},
  ]},
 {w:1,terms:[2,9],when:s=>!s.flags.chutai,title:"退学届",text:"事務所の棚に退学届が置いてある。何のために大学にいるのか、分からなくなって3か月。",
  choices:[
   {label:"書いて、出さずに持ち帰る",ok:{t:"机の引き出しに入れた。出さなかった、ということだけを覚えておく。",d:{men:4},f:s=>s.flags.chutai=1}},
   {label:"教授に相談する",req:{gaku:30},ok:{t:"「辞めるのはいつでもできる」。半年だけ、と言われて半年続けた。",d:{men:6,gaku:2},f:s=>s.flags.chutai=1}},
   {label:"出す",ok:{t:"",f:s=>{s.ending={type:"chutai"};s._txt="退学届を出した。大隈講堂を背に、正門を出た。"}}},
  ]},
);
for(let i=DARK2_START;i<POOL.length;i++)POOL[i].dark=1;

/* 追加の結末 */
Object.assign(ENDINGS,{
 yakubutsu:{title:"薬物で逮捕された人",head:"大麻取締法違反で逮捕され、退学処分になった",out:"逮捕・退学",rank:"E"},
 chutai:{title:"自分で辞めた人",head:"退学届を出し、早稲田を去った",out:"中退",rank:"E"},
});
/* 10年後の文（ending-scenes.js の epilogue に割り込む） */
const _epilogue0=typeof epilogue==="function"?epilogue:null;
if(_epilogue0)epilogue=function(){
  const e=S.ending.type;
  const spec={yakubutsu:"執行猶予が明けて、介護の仕事に就いた。あの先輩とは、二度と会っていない。",chutai:"辞めてから、専門学校に入り直した。早稲田の学生証は、まだ財布に入っている。"};
  if(spec[e])return spec[e]+(S.flags.counsel?"あのとき相談した窓口の番号は、今も人に教えている。":"大学の友達とは、気づけば疎遠になった。");
  return _epilogue0();
};

/* メンタルが底に近いときの危機イベント。既存の mental（15以下）の下に、もう一段 */
CRISIS.ideation={title:"限界",text:s=>`何日も眠れていない。「終わらせたい」と思う回数が、1日に何度もある。\n（${HELP_LINE}）`,choices:[
  {label:"今すぐ相談窓口に電話する",ok:{t:"つながった。名前を言わなくてよかった。朝まで一緒にいてくれた。翌日、保健センターから折り返しが来た。",d:{men:25,tai:3},f:s=>{s.flags.counsel=1;s.flags.ideation=1}}},
  {label:"実家に帰る",ok:{t:"何も言わずに帰った。親も何も聞かなかった。2週間、ただ寝た。",d:{men:20,tai:8,kane:-2},f:s=>{s.flags.ideation=1;s.skip=14}}},
  {label:"休学する",ok:{t:"",f:s=>{s.ending={type:"kyugaku"};s._txt="休学届を出した。逃げたのではない。生きるほうを選んだ。"}}},
 ]};
const _crisis0=crisis;
crisis=function(){
  const c=S.crisis;
  if(!c.ideation&&S.s.men<=8){c.ideation=1;S.today.push(CRISIS.ideation);return true}
  if(c.ideation&&S.s.men>=30)c.ideation=0;
  return _crisis0();
};

LIFE_FLOW.push(
 {c:s=>s.flags.ideation&&s.flags.counsel,t:"保健センターの帰り道。空の色が、少しだけ前と違って見えた。",d:{men:2}},
 {c:s=>s.flags.ideation&&!s.flags.counsel,w:2,t:"相談窓口の番号をメモした紙が、机の上にある。まだかけていない。",d:{men:-2}},
 {c:s=>s.flags.lostFriend,t:"あいつが好きだった曲が、馬場の店で流れた。",d:{men:-2}},
 {c:s=>s.flags.lostFriend,t:"サークルの集合写真。あいつの場所が空いている。",d:{men:-2,jin:1}},
 {c:s=>s.flags.weed,w:2,t:"クラブの帰り、パトカーを見て心臓が跳ねた。",d:{men:-3}},
 {c:s=>s.flags.stalk,w:2,t:"帰り道、何度も後ろを振り返った。",d:{men:-3,tai:-1}},
 {c:s=>s.flags.assault,t:"あの店の前を通れない。遠回りして帰った。",d:{men:-2}},
 {c:s=>s.flags.parentIll,t:"父からLINE。リハビリで少し歩けるようになったらしい。",d:{men:3}},
 {c:s=>s.flags.eating,t:"栄養士と決めた献立。今日は全部食べられた。",d:{tai:2,men:2}},
 {c:s=>s.flags.enjo,t:"知らない人からのDMが、まだ来る。",d:{men:-2}},
 {c:s=>s.flags.sober,t:"烏龍茶で朝まで付き合った。記憶があるのは悪くない。",d:{men:2,jin:1}},
 {c:s=>s.flags.shukyo2,t:"実家から集会の案内が届いた。開けずに捨てた。",d:{men:-1}},
 {c:s=>s.flags.chutai,t:"引き出しの退学届。今日も出さなかった。",d:{men:1}},
 {c:s=>s.s.men<20,w:2,t:"保健センターの前を通った。ドアに「予約なしでも相談できます」と貼ってある。",d:{men:1}},
);
