/* BGMと効果音（Web Audio APIで合成。音声ファイルは使わない）
   ブラウザの制限で、ユーザーが何か押すまで音は出せない。ヘッダーの「音」で切り替える */
const AU={ctx:null,master:null,bgm:null,on:false,duck:1,timer:null,next:0,step:0,mood:"normal"};

function audioInit(){
  if(AU.ctx)return true;
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return false;
    AU.ctx=new C();
    AU.master=AU.ctx.createGain();AU.master.gain.value=.5;AU.master.connect(AU.ctx.destination);
    AU.bgm=AU.ctx.createGain();AU.bgm.gain.value=0;AU.bgm.connect(AU.master);
    return true;
  }catch(e){return false}
}
function audioOn(v){
  AU.on=v;meta.sound=v;save(meta);
  const b=$("#snd");if(b){b.setAttribute("aria-pressed",v);b.textContent=v?"音 ON":"音 OFF"}
  if(v){if(!audioInit())return;if(AU.ctx.state==="suspended")AU.ctx.resume();bgmStart()}
  else bgmStop();
}
function tone(f,t0,dur,type,vol,dest){
  const o=AU.ctx.createOscillator(),g=AU.ctx.createGain();
  o.type=type;o.frequency.setValueAtTime(f,t0);
  g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+.01);g.gain.exponentialRampToValueAtTime(.0001,t0+dur);
  o.connect(g);g.connect(dest||AU.master);o.start(t0);o.stop(t0+dur+.02);
}
function noise(t0,dur,vol,dest){
  const n=AU.ctx.sampleRate*dur,buf=AU.ctx.createBuffer(1,n,AU.ctx.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);
  const s=AU.ctx.createBufferSource(),g=AU.ctx.createGain();s.buffer=buf;g.gain.value=vol;s.connect(g);g.connect(dest||AU.master);s.start(t0);
}
/* ---------- 効果音 ---------- */
const NOTE=n=>440*Math.pow(2,(n-69)/12);
function sfx(name){
  if(!AU.on||!AU.ctx)return;
  try{
    const t=AU.ctx.currentTime;
    switch(name){
      case "tap":tone(NOTE(84),t,.06,"square",.08);break;
      case "pop":tone(NOTE(72),t,.08,"triangle",.12);tone(NOTE(79),t+.06,.1,"triangle",.1);break;
      case "good":[72,76,79,84].forEach((n,i)=>tone(NOTE(n),t+i*.07,.18,"triangle",.14));break;
      case "bad":tone(NOTE(50),t,.25,"sawtooth",.12);tone(NOTE(47),t+.12,.3,"sawtooth",.12);break;
      case "slot":tone(NOTE(ri(70,82)),t,.04,"square",.06);break;
      case "stop":tone(NOTE(67),t,.1,"square",.1);tone(NOTE(74),t+.05,.14,"square",.1);break;
      case "fanfare":[67,72,76,79,84].forEach((n,i)=>tone(NOTE(n),t+i*.09,.3,"triangle",.16));[79,84].forEach((n,i)=>tone(NOTE(n),t+.5+i*.1,.5,"triangle",.14));break;
      case "sparkle":[96,100,103,108].forEach((n,i)=>tone(NOTE(n),t+i*.05,.3,"sine",.12));break;
      case "thud":tone(NOTE(38),t,.35,"sine",.3);noise(t,.12,.08);break;
      case "tick":tone(NOTE(76),t,.05,"square",.05);break;
      case "rare":[76,80,83,88,95].forEach((n,i)=>tone(NOTE(n),t+i*.06,.4,"triangle",.15));noise(t,.3,.05);break;
      case "coin":tone(NOTE(88),t,.08,"square",.1);tone(NOTE(95),t+.07,.18,"square",.1);break;
      case "sad":[64,62,60,55].forEach((n,i)=>tone(NOTE(n),t+i*.25,.5,"triangle",.12));break;
      case "page":noise(t,.08,.05);break;
    }
  }catch(e){}
}
/* ---------- BGM（8小節ループの簡単なシーケンサー） ---------- */
const PROG={normal:[[60,64,67],[55,59,62],[57,60,64],[53,57,60]],exam:[[57,60,64],[53,57,60],[52,55,59],[55,59,62]],summer:[[60,64,67,71],[65,69,72],[62,65,69],[67,71,74]],winter:[[57,60,64],[55,59,62],[53,57,60],[52,55,59]]};
const BPM={normal:104,exam:128,summer:88,winter:96};
function bgmMood(){
  const l=S&&S.date?seasonLabel(S.date):"春";
  return l==="試験期間"?"exam":l==="夏休み"||l==="夏"?"summer":l==="冬"||l==="年末"||l==="正月"||l==="春休み"?"winter":"normal";
}
function bgmStart(){
  if(!AU.ctx||AU.timer)return;
  AU.bgm.gain.cancelScheduledValues(AU.ctx.currentTime);AU.bgm.gain.linearRampToValueAtTime(.35*AU.duck,AU.ctx.currentTime+1);
  AU.next=AU.ctx.currentTime+.05;AU.step=0;
  AU.timer=setInterval(bgmTick,90);
}
function bgmStop(){
  if(AU.timer){clearInterval(AU.timer);AU.timer=null}
  if(AU.ctx){AU.bgm.gain.cancelScheduledValues(AU.ctx.currentTime);AU.bgm.gain.linearRampToValueAtTime(0,AU.ctx.currentTime+.4)}
}
function bgmDuck(v){AU.duck=v;if(AU.ctx&&AU.timer){AU.bgm.gain.cancelScheduledValues(AU.ctx.currentTime);AU.bgm.gain.linearRampToValueAtTime(.35*v,AU.ctx.currentTime+.3)}}
function bgmTick(){
  if(!AU.ctx||!AU.on)return;
  const mood=bgmMood();if(mood!==AU.mood){AU.mood=mood;AU.step=0}
  const spb=60/BPM[mood]/4;             // 16分音符の長さ
  while(AU.next<AU.ctx.currentTime+.25){
    const st=AU.step,bar=Math.floor(st/16)%4,beat=st%16,chord=PROG[mood][bar],t=AU.next;
    if(beat%4===0)tone(NOTE(chord[0]-24),t,spb*3.5,"sine",.5,AU.bgm);                  // ベース
    if(beat%2===0){const n=chord[(st/2)%chord.length];tone(NOTE(n+12),t,spb*1.6,"triangle",.22,AU.bgm)} // アルペジオ
    if(mood!=="winter"&&beat%4===2)noise(t,.03,.07,AU.bgm);                               // ハイハット
    if(mood==="exam"&&beat%8===4)tone(NOTE(chord[0]),t,spb*2,"square",.08,AU.bgm);
    if(beat===0&&Math.random()<.5)tone(NOTE(chord[2]+24),t,spb*6,"sine",.08,AU.bgm);    // たまに高音
    AU.next+=spb;AU.step++;
  }
}
