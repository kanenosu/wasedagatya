/* 就活の結果と進路 */
/* ---------- 就活 ---------- */
const TIERS={S:"総合商社・外資コンサル・外銀",A:"メガバンク・大手デベロッパー・大手メーカー",B:"大手IT・SIer・生損保",C:"中堅企業",D:"内定ゼロ",V:"メガベンチャー・スタートアップ",G:"大学院進学",K:"学生起業",M:"お笑い芸人"};
function tierOf(x){return x>=80?"S":x>=68?"A":x>=56?"B":x>=44?"C":"D"}

function job(s,mode){
  const f=s.flags;
  let x=s.s.gk*.3+s.s.com*.15+s.s.jin*.1+s.s.gaku*.15+s.s.men*.08+gpa()*4+s.fac.job+(f.intern||0)*5+(f.ob?4:0)+(f.spi?3:0)+(f.early?5:0)+(f.hakone?10:0)+(s.post?4:0)-(f.late?6:0)+(s.zemi==="人気ゼミ"?4:0)+(f.jobBonus||0)-(f.teigaku||0)*8+(f.giin?4:0);
  let tier,t;
  if(mode==="all"){const r=x+rnd(-20,20);tier=tierOf(r);if(tier==="B")tier="C";
    t=tier==="S"?pick(["第一志望の総合商社から内定の電話が来た。手が震えた。","外資コンサルから内定。初任給の数字を二度見した。","外銀の内定が出た。体力が持つかは知らない。"]):tier==="A"?"第一志望は落ちたが、滑り止めの大手から内定。":tier==="C"?"上位は全滅。持ち駒が尽きて、夏採用の中堅に決めた。":"全滅した。秋採用か、就職浪人か。";}
  else if(mode==="safe"){const r=x+rnd(-8,8)+4;tier=tierOf(r);if(tier==="S")tier="A";
    t=tier==="A"?"手堅く大手から内定をもらった。":tier==="B"?"大手ITから内定。安定した道だ。":tier==="C"?"中堅企業に決まった。":"手堅くいったはずが、まさかの全滅。";}
  else if(mode==="venture"){const ok=Math.random()<clamp((s.s.gk-25)/60,.08,.92);tier=ok?"V":(x>=44?"C":"D");
    t=ok?"成長中のスタートアップに内定。初年度から裁量がある。":tier==="C"?"ベンチャーは全滅。慌てて中堅企業を受けて決めた。":"ベンチャーは全滅。動き出しが遅すぎた。";}
  else if(mode==="startup"){const ok=Math.random()<clamp((s.s.gk+s.s.men-60)/100,.15,.8);tier=ok?"K":tierOf(x-4);
    t=ok?"資金調達に成功した。社長として卒業する。":"資金が尽きて会社を畳んだ。慌てて就活に戻った。";}
  else if(mode==="geinin"){const ok=Math.random()<clamp(.2+(s.flags.ukeru||0)*.15+(s.s.men-50)/200,.1,.7);tier=ok?"M":tierOf(x-8);
    t=ok?"養成所を経ずに事務所に拾われた。LUDOの先輩たちと同じ道だ。":"オーディションに全部落ちた。ネタ帳を閉じて就活した。";}
  else{const ok=Math.random()<pc(s.s.gaku,48);tier=ok?"G":tierOf(x-6);
    t=ok?"院試に合格。あと2年、研究を続ける。":"院試に落ちた。慌てて就活に戻った。";}
  s.job={tier,label:TIERS[tier]}; assignCompany(s); s._txt=t+(s.job.co?`内定先は${s.job.co}。`:""); log(`進路：${s.job.label}`);
}
