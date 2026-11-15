(function(root){
'use strict';
// Drawings of the classroom investigations suggested at the end of Integrated Science lessons. Each is drawn here in
// SVG, with no outside images, so it carries no third-party rights, works offline and follows the page's appearance.
// The decision and the rules for any future photographs are in review/integrated-science-illustrations-20261115.md.
const M=typeof module==='object'&&module.exports?require('./course-models.js'):root.QuidenceCourseModels;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const INK='#263c5b',MUTED='#52647b',LINE='#8391a5',TEAL='#087f76',PURPLE='#6542c0',RED='#d64545',WATER='#cfe3f3';
const text=(x,y,t,o={})=>`<text x="${x}" y="${y}" font-size="${o.size||13}" ${o.anchor?`text-anchor="${o.anchor}"`:''} ${o.bold?'font-weight="700"':''} fill="${o.fill||INK}">${esc(t)}</text>`;
const step=(n,x,y,t)=>`<circle cx="${x}" cy="${y-4}" r="9" fill="${TEAL}"/>${text(x,y,String(n),{anchor:'middle',fill:'#ffffff',bold:true,size:12})}${text(x+15,y,t)}`;
const arrow=(x1,y1,x2,y2,c=PURPLE)=>{const a=Math.atan2(y2-y1,x2-x1),h=8;return`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${c}" stroke-width="2.5"/><path d="M${x2} ${y2}L${(x2-h*Math.cos(a-0.45)).toFixed(1)} ${(y2-h*Math.sin(a-0.45)).toFixed(1)}M${x2} ${y2}L${(x2-h*Math.cos(a+0.45)).toFixed(1)} ${(y2-h*Math.sin(a+0.45)).toFixed(1)}" stroke="${c}" stroke-width="2.5"/>`;};
// Each drawing returns [title, description, body]. The keys are lesson numbers (1-based).
const DRAWINGS={
 1:()=>{let b='';
  // Microscope: base, arm, stage, objective and eyepiece.
  b+=`<path d="M40 250h120" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M125 250V90q0-20-20-28" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M55 170h95" stroke="${INK}" stroke-width="7"/><rect x="62" y="162" width="46" height="6" fill="#ffffff" stroke="${LINE}"/><path d="M85 60L72 130h26z" fill="${LINE}"/><rect x="74" y="28" width="22" height="34" rx="3" fill="${MUTED}"/>`;
  b+=text(30,290,'slide on the stage',{size:12,fill:MUTED});
  // The view: onion skin cells as long boxes, each with a nucleus.
  const cx=285,cy=130,R=92;b+=`<defs><clipPath id="inv-fov"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath></defs><circle cx="${cx}" cy="${cy}" r="${R}" fill="#fbf8ec" stroke="${INK}" stroke-width="2"/><g clip-path="url(#inv-fov)">`;
  for(let r=0;r<7;r++)for(let c=0;c<5;c++){const x=cx-R+c*44-(r%2)*20,y=cy-R+r*28;b+=`<rect x="${x}" y="${y}" width="44" height="28" fill="none" stroke="#9a8a4a"/><circle cx="${x+30}" cy="${y+14}" r="4" fill="#9a8a4a"/>`;}
  b+=`</g>${arrow(cx-R,cy+R+14,cx+R,cy+R+14,TEAL)}${arrow(cx+R,cy+R+14,cx-R,cy+R+14,TEAL)}`+text(cx,cy+R+32,'field of view: measure its width',{anchor:'middle',size:12,fill:TEAL});
  b+=step(1,395,70,'Measure')+text(410,86,'the field')+step(2,395,130,'Count the')+text(410,146,'cells across')+step(3,395,190,'Size =')+text(410,206,'width ÷ count',{size:12});
  return['Measuring onion skin cells','A light microscope with a slide on its stage, and the circular field of view showing rows of boxy onion skin cells, each with a dark nucleus. Steps: measure the field’s width, count the cells across it, and divide the width by the count.',b];},
 2:()=>{let b='';
  // Hot plate, beaker of crushed ice, thermometer and stirrer.
  b+=`<rect x="40" y="226" width="150" height="26" rx="4" fill="${MUTED}"/><circle cx="170" cy="239" r="6" fill="#ffffff"/><path d="M60 120v100h110V120" fill="${WATER}" stroke="${INK}" stroke-width="2.5"/>`;
  for(let i=0;i<14;i++){const x=68+(i*23)%96,y=150+Math.floor(i/4)*17;b+=`<rect x="${x}" y="${y}" width="14" height="11" rx="2" fill="#ffffff" stroke="#9fb6cf"/>`;}
  b+=`<rect x="124" y="70" width="8" height="140" rx="4" fill="#ffffff" stroke="${INK}"/><circle cx="128" cy="210" r="7" fill="${RED}"/><path d="M128 210V160" stroke="${RED}" stroke-width="3"/><path d="M84 80L100 205" stroke="${LINE}" stroke-width="4" stroke-linecap="round"/>`;
  b+=text(40,282,'stir all the time; record every 30 s',{size:12,fill:MUTED});
  // The expected graph: a slope, a flat part at 0 °C, a slope.
  const gx=260,gy=220;b+=`<path d="M${gx} ${gy}H480M${gx} ${gy}V60" stroke="${LINE}"/><path d="M${gx} 200L${gx+40} 160H${gx+130}L${gx+210} 80" fill="none" stroke="${PURPLE}" stroke-width="3"/>`;
  b+=text(gx+62,140,'flat at 0 °C while ice melts',{anchor:'middle',size:12,fill:PURPLE})+text(gx-6,164,'0 °C',{anchor:'end',size:12,fill:MUTED})+text(470,240,'time',{anchor:'end',size:12,fill:MUTED})+text(gx+4,56,'temperature',{size:12,fill:MUTED});
  b+=text(260,264,'With an adult. Wear goggles:',{size:12,fill:RED})+text(260,280,'the hot plate stays hot.',{size:12,fill:RED});
  return['Heating crushed ice','A beaker of crushed ice on a hot plate, with a thermometer and a stirring rod. Beside it, the expected graph of temperature against time: rising, then flat at 0 °C while the ice melts, then rising again. Safety: work with an adult and wear goggles.',b];},
 5:()=>{let b='';
  const bottle=(x,hot)=>{let s=`<rect x="${x-70}" y="150" width="140" height="100" rx="8" fill="${hot?'#f7d3c6':'#d6e9f7'}" stroke="${INK}"/>`+text(x,272,hot?'hot water':'ice water',{anchor:'middle',fill:hot?RED:'#2f6ea8'});
   s+=`<path d="M${x-28} 245V135q0-18 14-26V96h28v13q14 8 14 26V245" fill="#ffffff" fill-opacity=".6" stroke="${INK}" stroke-width="2"/>`;
   // The balloon: round and full over the hot bottle; limp over the cold one.
   s+=hot?`<ellipse cx="${x}" cy="62" rx="34" ry="38" fill="${PURPLE}" opacity=".85"/><path d="M${x-14} 96h28" stroke="${INK}" stroke-width="3"/>`:`<path d="M${x-14} 96q-6-26 14-30q20 4 14 30" fill="${PURPLE}" opacity=".85"/><path d="M${x-14} 96h28" stroke="${INK}" stroke-width="3"/>`;
   // Air particles inside, with motion arrows longer when hot.
   const pts=[[x-12,160],[x+10,185],[x-6,210],[x+12,228],[x-14,138]],len=hot?14:6;
   for(const[i,[px,py]]of pts.entries()){const a=i*1.3;s+=`<circle cx="${px}" cy="${py}" r="4" fill="${TEAL}"/><path d="M${px} ${py}l${(len*Math.cos(a)).toFixed(1)} ${(len*Math.sin(a)).toFixed(1)}" stroke="${TEAL}" stroke-width="2"/>`;}
   return s;};
  b+=bottle(140,true)+bottle(380,false);
  b+=text(260,294,'same bottle, same air: only the temperature changes',{anchor:'middle',size:12,fill:MUTED});
  return['A balloon on a bottle','Two drawings of an empty bottle with a balloon over its mouth. Standing in hot water, the balloon is full and the air particles inside have long motion arrows. Standing in ice water, the balloon is limp and the arrows are short.',b];},
 6:()=>{let b='';
  const scale=(x,reading,open)=>{let s=`<rect x="${x-80}" y="200" width="160" height="44" rx="6" fill="${MUTED}"/><rect x="${x-46}" y="212" width="92" height="22" rx="3" fill="#e9f3ea"/>`+text(x,229,reading,{anchor:'middle',bold:true,size:14,fill:'#1d5c2e'});
   s+=`<path d="M${x-60} 196q0-70 20-96h80q20 26 20 96z" fill="#eef4fb" stroke="${INK}" stroke-width="2"/><path d="M${x-40} 100h80" stroke="${open?LINE:TEAL}" stroke-width="5" ${open?'stroke-dasharray="8 6"':''}/>`;
   s+=`<path d="M${x-52} 196q0-40 10-56h84q10 16 10 56z" fill="${WATER}"/>`;
   for(let i=0;i<6;i++)s+=`<circle cx="${x-30+i*12}" cy="${150-(i%3)*12}" r="4" fill="#ffffff" stroke="#7fa6c9"/>`;
   if(open)s+=`<path d="M${x-10} 92q-6-18 4-30M${x+12} 92q8-18-2-30" fill="none" stroke="${LINE}" stroke-width="2"/>`+text(x,52,'gas escapes',{anchor:'middle',size:12,fill:MUTED});
   return s;};
  b+=scale(130,'250.0 g',false)+text(130,272,'sealed: same before and after',{anchor:'middle',size:12})+scale(390,'249.6 g',true)+text(390,272,'open: lighter after fizzing',{anchor:'middle',size:12});
  b+=text(130,52,'water + antacid tablet',{anchor:'middle',size:12,fill:MUTED});
  return['Mass before and after a reaction','Two zip-top bags with water and a fizzing antacid tablet on kitchen scales. The sealed bag reads 250.0 g before and after. The open bag lets gas escape and reads less after the fizzing. The readings are examples.',b];},
 9:()=>{let b='';
  b+=`<path d="M20 240H500" stroke="${INK}" stroke-width="2"/>`;
  // A ramp leaning on a stack of books, at three heights.
  for(const[i,h]of[60,100,140].entries()){const y=240-h;b+=`<path d="M80 ${y}L250 240" stroke="${i===2?INK:LINE}" stroke-width="${i===2?4:2}" ${i===2?'':'stroke-dasharray="6 5"'}/>`+text(52,y+4,['low','middle','high'][i],{anchor:'end',size:12,fill:MUTED});}
  b+=`<rect x="58" y="100" width="22" height="140" fill="#e2d6c3" stroke="${MUTED}"/>`+text(69,258,'books',{anchor:'middle',size:11,fill:MUTED});
  b+=`<rect x="96" y="104" width="34" height="16" rx="4" fill="${RED}" transform="rotate(39 113 112)"/>`;
  // The cup, pushed along the floor, and a ruler.
  b+=`<path d="M300 240l6-40h28l6 40z" fill="#ffffff" stroke="${INK}" stroke-width="2"/>`+arrow(345,215,420,215,PURPLE)+text(382,205,'slides',{anchor:'middle',size:12,fill:PURPLE});
  b+=`<rect x="300" y="248" width="190" height="16" fill="#f4e7b6" stroke="${MUTED}"/>`;for(let i=0;i<=19;i++)b+=`<path d="M${300+i*10} 248v${i%5?5:9}" stroke="${MUTED}"/>`;
  b+=text(395,284,'measure how far the cup slides',{anchor:'middle',size:12,fill:MUTED});
  return['A toy car hits a cup','A ramp leaning on a stack of books at three heights: low, middle and high. A toy car rolls down into a paper cup on the floor, and a ruler measures how far the cup slides.',b];},
 10:()=>{let b='';
  // Facing south: west, where the Sun has set, is on the right; east is on the left.
  b+=`<rect x="0" y="0" width="520" height="300" fill="#22314d"/><path d="M0 230Q260 200 520 230V300H0z" fill="#1b2638"/><path d="M450 230h70" stroke="#e8a35c" stroke-width="6" opacity=".7"/>`+text(506,256,'west: sunset',{anchor:'end',size:12,fill:'#f0c38a'});
  // The same time each evening: the Moon is farther east and fuller each night, lit on the side toward the Sun.
  const nights=[[3,430,190,.15],[5,350,150,.3],[7,265,120,.5],[9,175,110,.7],[11,90,125,.85]];
  for(const[day,x,y,lit]of nights){const r=16,rx=r*Math.abs(1-2*lit),gib=lit>.5;b+=`<circle cx="${x}" cy="${y}" r="${r}" fill="#3a4a66"/><path d="M${x} ${y-r}A${r} ${r} 0 0 1 ${x} ${y+r}A${rx.toFixed(1)} ${r} 0 0 ${gib?1:0} ${x} ${y-r}Z" fill="#f4f1d0"/>`+text(x,y+r+18,'day '+day,{anchor:'middle',size:12,fill:'#d8deea'});}
  b+=arrow(420,60,110,60,'#9fb6cf')+text(265,48,'each evening at the same time, farther east',{anchor:'middle',size:12,fill:'#d8deea'});
  b+=text(14,256,'east',{size:12,fill:'#d8deea'})+text(260,286,'facing south',{anchor:'middle',size:12,fill:'#d8deea'});
  return['Watching the Moon each evening','The evening sky facing south, at the same time on five evenings from day 3 to day 11 after new moon. The Moon starts as a thin crescent low in the west near the sunset, lit on the side toward the Sun, and appears farther east and more fully lit each evening.',b];},
 11:()=>{let b='';
  const sheet=(x,dark)=>{let s=`<rect x="${x}" y="40" width="200" height="150" rx="6" fill="${dark?'#2e3440':'#efe6cf'}" stroke="${MUTED}"/>`;let k=0;
   for(let r=0;r<5;r++)for(let c=0;c<7;c++){const px=x+20+c*27+(r%2)*10,py=60+r*28,isDark=(k++%2)===0;
    // On each sheet the dots that match the sheet are left; the ones that stand out have mostly been picked up.
    const kept=isDark===dark||((r*7+c)%5===0);if(kept)s+=`<circle cx="${px}" cy="${py}" r="7" fill="${isDark?'#3b3f47':'#f6f1e2'}" stroke="${isDark?'#1d2026':'#c9bd9a'}"/>`;}
   return s;};
  b+=sheet(30,true)+sheet(290,false);
  b+=text(130,212,'dark sheet: dark dots left',{anchor:'middle',size:12})+text(390,212,'light sheet: light dots left',{anchor:'middle',size:12});
  b+=step(1,40,250,'Scatter equal numbers of dark and light dots.')+step(2,40,276,'A partner picks dots for 10 s; count what is left.');
  return['Dots that match their background','Two sheets, one dark and one light, after a partner has picked up as many dots as possible in 10 seconds. On the dark sheet mostly dark dots are left; on the light sheet mostly light dots are left. Steps: scatter equal numbers of each color, pick for 10 seconds, count what is left.',b];},
 12:()=>{let b='';
  const wave=(x,y,noise)=>{let d=`M${x} ${y}`;for(let i=1;i<=60;i++){const t=i/60,n=noise*Math.sin(i*7.3)*Math.cos(i*3.1);d+=`L${(x+t*55).toFixed(1)} ${(y-14*Math.sin(t*4*Math.PI)+n*10).toFixed(1)}`;}return`<path d="${d}" fill="none" stroke="${PURPLE}" stroke-width="2"/>`;};
  const phone=(x,y)=>`<rect x="${x}" y="${y}" width="30" height="52" rx="5" fill="${INK}"/><rect x="${x+3}" y="${y+5}" width="24" height="40" rx="2" fill="#9fb6cf"/>`;
  b+=text(20,36,'Analog: play it aloud and record again',{bold:true,size:13});
  for(let i=0;i<4;i++){const x=20+i*125;b+=phone(x,50)+wave(x+36,76,i*0.9);if(i<3)b+=arrow(x+97,76,x+121,76,LINE);b+=text(x+60,122,['original','copy 1','copy 2','copy 3'][i],{anchor:'middle',size:12,fill:MUTED});}
  b+=text(20,170,'Digital: copy the file of numbers',{bold:true,size:13});
  for(let i=0;i<4;i++){const x=20+i*125;b+=`<rect x="${x}" y="186" width="96" height="44" rx="5" fill="#eef4fb" stroke="${LINE}"/>`+text(x+48,205,'0.00, 0.25,',{anchor:'middle',size:11,fill:INK})+text(x+48,221,'0.48, 0.68 …',{anchor:'middle',size:11,fill:INK});if(i<3)b+=arrow(x+100,208,x+122,208,LINE);b+=text(x+48,250,['original','copy 1','copy 2','copy 3'][i],{anchor:'middle',size:12,fill:MUTED});}
  b+=text(260,284,'each analog copy adds noise; each digital copy is exact',{anchor:'middle',size:12,fill:MUTED});
  return['Copying a recording','Top: a sound recorded on a phone, played aloud and recorded again three times; the wave gets noisier with each copy. Bottom: the same recording stored as numbers and copied three times; every copy holds the same numbers.',b];},
 16:()=>{let b='';
  const coin=(x,y,l)=>`<circle cx="${x}" cy="${y}" r="26" fill="#e9c46a" stroke="#b08a2e" stroke-width="3"/>`+text(x,y+7,l,{anchor:'middle',bold:true,size:20,fill:'#5b4410'});
  b+=coin(70,80,'P')+coin(150,80,'p')+text(110,132,'parent 1’s coin',{anchor:'middle',size:12,fill:MUTED})+coin(70,190,'P')+coin(150,190,'p')+text(110,242,'parent 2’s coin',{anchor:'middle',size:12,fill:MUTED});
  b+=text(110,30,'each coin: heads P, tails p',{anchor:'middle',size:12,fill:MUTED});
  // A tally table.
  const tx=270;b+=`<rect x="${tx}" y="50" width="220" height="150" fill="#ffffff" stroke="${LINE}"/><path d="M${tx} 90H${tx+220}M${tx} 130H${tx+220}M${tx} 170H${tx+220}M${tx+70} 50V200" stroke="${LINE}"/>`;
  b+=text(tx+35,75,'Toss',{anchor:'middle',bold:true})+text(tx+145,75,'Tally',{anchor:'middle',bold:true});
  const tally=(x,y,n)=>{let s='';for(let i=0;i<n;i++){const g=Math.floor(i/5),k=i%5;s+=k<4?`<path d="M${x+g*30+k*6} ${y-12}v16" stroke="${INK}" stroke-width="2"/>`:`<path d="M${x+g*30-2} ${y}l26 -12" stroke="${INK}" stroke-width="2"/>`;}return s;};
  b+=text(tx+35,115,'PP',{anchor:'middle'})+tally(tx+86,116,9)+text(tx+35,155,'Pp',{anchor:'middle'})+tally(tx+86,156,21)+text(tx+35,195,'pp',{anchor:'middle'})+tally(tx+86,196,10);
  b+=text(tx+110,232,'40 tosses; compare with ¼ : ½ : ¼',{anchor:'middle',size:12,fill:MUTED});
  return['Coin tosses for a cross','Two coins for each parent’s alleles, heads P and tails p, and a tally table of 40 tosses: PP, Pp and pp, to compare with the expected one quarter, one half and one quarter.',b];},
 17:()=>{let b='';
  // Two fingers on the wrist below the thumb, and a stopwatch.
  b+=`<path d="M30 180q60-30 140-20l40 6" fill="none" stroke="#d9a77e" stroke-width="34" stroke-linecap="round"/><path d="M150 150q20-34 50-40M162 156q26-26 56-28" fill="none" stroke="#c8926a" stroke-width="12" stroke-linecap="round"/>`;
  b+=text(120,236,'two fingers on the wrist,',{anchor:'middle',size:12,fill:MUTED})+text(120,252,'below the thumb',{anchor:'middle',size:12,fill:MUTED});
  b+=`<circle cx="120" cy="70" r="30" fill="#ffffff" stroke="${INK}" stroke-width="3"/><path d="M120 70V48M120 70l14 8" stroke="${INK}" stroke-width="2.5"/><rect x="114" y="32" width="12" height="8" fill="${INK}"/>`+text(160,62,'count beats',{size:12,fill:MUTED})+text(160,78,'for 15 s × 4',{size:12,fill:MUTED});
  // The expected record: rest, exercise, back to rest.
  const gx=270,gy=220;b+=`<path d="M${gx} ${gy}H490M${gx} ${gy}V50" stroke="${LINE}"/><path d="M${gx} 170H${gx+30}L${gx+45} 80L${gx+70} 110L${gx+110} 150L${gx+160} 166L${gx+215} 170" fill="none" stroke="${PURPLE}" stroke-width="3"/>`;
  b+=`<path d="M${gx} 170H490" stroke="${TEAL}" stroke-dasharray="5 4"/>`+text(486,186,'resting pulse',{anchor:'end',size:12,fill:TEAL})+text(gx+45,70,'after exercise',{anchor:'middle',size:12,fill:PURPLE})+text(486,240,'minutes',{anchor:'end',size:12,fill:MUTED})+text(gx+4,44,'beats per minute',{size:12,fill:MUTED});
  return['Pulse after exercise','Two fingers on the wrist below the thumb and a stopwatch to count beats. Beside them, the expected record: the pulse jumps after a minute of exercise, then falls back to the resting pulse over a few minutes.',b];}
};
function figure(lesson){
 const draw=DRAWINGS[lesson];if(!draw)return'';
 const[title,description,body]=draw();
 return`<div class="investigation-figure">${M.graphic(title,description,body)}</div>`;
}
const api={figure,LESSONS:Object.keys(DRAWINGS).map(Number)};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceScienceInvestigations=api;
})(typeof window==='undefined'?globalThis:window);
