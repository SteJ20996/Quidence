(function(root){
'use strict';
// Drawings of the classroom investigations suggested at the end of Integrated Science lessons. Each is drawn here in
// SVG, with no outside images, so it carries no third-party rights, works offline and follows the page's appearance.
// Objects are drawn to scale from typical real sizes, each drawing with its own scale bar; where something has to be
// enlarged to be seen (air particles, the Moon's disc), the drawing says so. The sizes used and the rules for any
// future photographs are in review/integrated-science-illustrations-20261115.md.
const M=typeof module==='object'&&module.exports?require('./course-models.js'):root.QuidenceCourseModels;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const INK='#263c5b',MUTED='#52647b',LINE='#8391a5',TEAL='#087f76',PURPLE='#6542c0',RED='#d64545',WATER='#cfe3f3';
const f1=n=>Number(n.toFixed(1));
const text=(x,y,t,o={})=>`<text x="${f1(x)}" y="${f1(y)}" font-size="${o.size||13}" ${o.anchor?`text-anchor="${o.anchor}"`:''} ${o.bold?'font-weight="700"':''} fill="${o.fill||INK}">${esc(t)}</text>`;
const step=(n,x,y,t)=>`<circle cx="${x}" cy="${y-4}" r="9" fill="${TEAL}"/>${text(x,y,String(n),{anchor:'middle',fill:'#ffffff',bold:true,size:12})}${text(x+15,y,t,{size:12})}`;
const arrow=(x1,y1,x2,y2,c=PURPLE)=>{const a=Math.atan2(y2-y1,x2-x1),h=8;return`<path d="M${f1(x1)} ${f1(y1)}L${f1(x2)} ${f1(y2)}" stroke="${c}" stroke-width="2.5"/><path d="M${f1(x2)} ${f1(y2)}L${f1(x2-h*Math.cos(a-0.45))} ${f1(y2-h*Math.sin(a-0.45))}M${f1(x2)} ${f1(y2)}L${f1(x2-h*Math.cos(a+0.45))} ${f1(y2-h*Math.sin(a+0.45))}" stroke="${c}" stroke-width="2.5"/>`;};
// A scale bar: length in pixels and its label in real units.
const scaleBar=(x,y,px,label)=>`<path d="M${f1(x)} ${f1(y)}h${f1(px)}M${f1(x)} ${f1(y-5)}v10M${f1(x+px)} ${f1(y-5)}v10" stroke="${INK}" stroke-width="2"/>`+text(x+px/2,y-8,label,{anchor:'middle',size:11,fill:MUTED});
function seeded(seed){let t=seed>>>0;return()=>{t=(t+0x6D2B79F5)>>>0;let r=Math.imul(t^(t>>>15),1|t);r^=r+Math.imul(r^(r>>>7),61|r);return((r^(r>>>14))>>>0)/4294967296;};}
// Lesson 2: the heating curve for 100 g of crushed ice from −10 °C, with 150 W reaching it.
const HEAT={mass:100,start:-10,power:150,ice:2.09,melt:334,water:4.18};
function heatingCurve(seconds){
 const{mass,start,power,ice,melt,water}=HEAT,e=power*seconds,e1=mass*ice*(0-start),e2=e1+mass*melt;
 return e<=e1?start+e/(mass*ice):e<=e2?0:(e-e2)/(mass*water);
}
// Lesson 10: where the Moon is one hour after sunset, for an observer at 34° N (Southern California) near an equinox,
// treating the Sun and Moon as on the celestial equator; the Moon moves about 12.2° east of the Sun each day.
const SKY={latitude:34,afterSunset:15,perDay:360/29.53};
function moonSky(day){
 const lat=SKY.latitude*Math.PI/180,ha=(90+SKY.afterSunset-SKY.perDay*day)*Math.PI/180;
 const alt=Math.asin(Math.cos(lat)*Math.cos(ha)),az=Math.atan2(Math.sin(ha),Math.cos(ha)*Math.sin(lat));
 return{altitude:alt*180/Math.PI,azimuth:az*180/Math.PI,lit:(1-Math.cos(2*Math.PI*day/29.53))/2};
}
// Each drawing returns [title, description, body]. The keys are lesson numbers (1-based).
const DRAWINGS={
 1:()=>{let b='';
  // A microscope about 35 cm tall, at 6 px per cm.
  const k=6,base=262,x0=40,h=cm=>base-cm*k;
  b+=`<rect x="${x0}" y="${h(3)}" width="${18*k}" height="${3*k}" rx="6" fill="${INK}"/><path d="M${x0+14*k} ${h(3)}V${h(27)}q0-${3*k}-${4*k}-${4*k}" fill="none" stroke="${INK}" stroke-width="${2.2*k}" stroke-linecap="round"/>`;
  b+=`<rect x="${x0+1*k}" y="${h(13)}" width="${12*k}" height="${1*k}" fill="${INK}"/><rect x="${x0+2.5*k}" y="${h(13.15)}" width="${7.5*k}" height="3" fill="#ffffff" stroke="${LINE}"/>`;
  b+=`<path d="M${x0+5.5*k} ${h(14)}h${1.6*k}l${0.4*k} -${4*k}h-${2.4*k}z" fill="${LINE}"/><rect x="${x0+4.9*k}" y="${h(31)}" width="${2.8*k}" height="${13*k}" fill="${MUTED}"/><rect x="${x0+5.2*k}" y="${h(35)}" width="${2.2*k}" height="${4*k}" rx="2" fill="${INK}"/>`;
  b+=scaleBar(x0,286,10*k,'10 cm')+text(x0+6*k,h(13)+20,'slide',{anchor:'middle',size:11,fill:MUTED});
  // The view at 400×: a field of view 0.45 mm across, at 400 px per mm. Onion skin cells about 250 by 50 µm, with
  // nuclei about 15 µm across.
  const cx=268,cy=140,R=90,u=0.4;b+=`<defs><clipPath id="inv-fov"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath></defs><circle cx="${cx}" cy="${cy}" r="${R}" fill="#fbf8ec" stroke="${INK}" stroke-width="2"/><g clip-path="url(#inv-fov)">`;
  for(let r=0;r<10;r++)for(let c=-1;c<3;c++){const w=250*u,ht=50*u,x=cx-R+c*w-(r%2)*w*0.45,y=cy-R+r*ht;b+=`<rect x="${f1(x)}" y="${f1(y)}" width="${w}" height="${ht}" fill="none" stroke="#9a8a4a"/><circle cx="${f1(x+w*0.6)}" cy="${f1(y+ht/2)}" r="${7.5*u}" fill="#9a8a4a"/>`;}
  b+=`</g>`+scaleBar(cx-20,cy+R+26,100*u,'100 µm');
  b+=text(cx,22,'at 400×: about 0.45 mm across',{anchor:'middle',size:12,fill:TEAL});
  b+=step(1,372,90,'Field width:')+text(387,106,'0.45 mm at 400×',{size:11,fill:MUTED})+step(2,372,150,'Cells across it:')+text(387,166,'about 9',{size:11,fill:MUTED})+step(3,372,210,'Cell width:')+text(387,226,'0.45 ÷ 9 = 0.05 mm',{size:11,fill:MUTED});
  return['Measuring onion skin cells','To scale, with scale bars. A light microscope about 35 cm tall with a slide on its stage. The circular field of view at 400 times, about 0.45 mm across, showing onion skin cells about 250 by 50 micrometers, each with a nucleus about 15 micrometers across. About 9 cells fit across the field, so each is about 0.05 mm wide.',b];},
 2:()=>{let b='';
  // At 6 px per cm: a hot plate 18 cm wide, a 250 mL beaker 7 cm wide and 9.5 cm tall, a 30 cm thermometer and a
  // 20 cm stirring rod, both leaning in the beaker. Ice pieces about 1.5 cm.
  const k=6,floor=262,hp=9,x0=36;
  b+=`<rect x="${x0}" y="${floor-hp*k}" width="${18*k}" height="${hp*k}" rx="5" fill="${MUTED}"/><rect x="${x0+2*k}" y="${floor-hp*k-0.6*k}" width="${14*k}" height="${0.6*k}" fill="${INK}"/><circle cx="${x0+15*k}" cy="${floor-hp*k/2}" r="${0.9*k}" fill="#ffffff"/>`;
  const bx=x0+5.5*k,by=floor-hp*k-0.6*k,bw=7*k,bh=9.5*k;
  b+=`<path d="M${bx} ${by-bh}V${by}h${bw}V${by-bh}" fill="${WATER}" stroke="${INK}" stroke-width="2"/>`;
  const r=seeded(5);for(let i=0;i<9;i++){const s=(1+r()*0.6)*k,x=bx+3+r()*(bw-s-6),y=by-6*k+(i%3)*1.6*k+r()*k;b+=`<rect x="${f1(x)}" y="${f1(y)}" width="${f1(s)}" height="${f1(s*0.8)}" rx="2" fill="#ffffff" stroke="#9fb6cf"/>`;}
  const lean=(len,ang,x,col,w)=>{const a=ang*Math.PI/180;return`<path d="M${f1(x)} ${by-3}L${f1(x+len*k*Math.sin(a))} ${f1(by-3-len*k*Math.cos(a))}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;};
  b+=lean(30,8,bx+3.8*k,'#ffffff',5)+lean(30,8,bx+3.8*k,INK,1)+`<circle cx="${bx+3.8*k}" cy="${by-6}" r="4" fill="${RED}"/>`+lean(20,-14,bx+2*k,LINE,4);
  b+=scaleBar(x0,288,10*k,'10 cm')+text(126,24,'Stir; record every 30 s.',{size:12,fill:MUTED});
  // The expected graph for 100 g of ice and 150 W, drawn from the model above: 0–6 minutes, −10 to 40 °C.
  const gx=262,gw=228,gy=222,gh=170,X=t=>gx+t/360*gw,Y=T=>gy-(T+10)/50*gh;
  b+=`<path d="M${gx} ${gy}H${gx+gw}M${gx} ${gy}V${gy-gh}" stroke="${LINE}"/>`;
  for(const T of[-10,0,20,40])b+=`<path d="M${gx-4} ${f1(Y(T))}h4" stroke="${LINE}"/>`+text(gx-7,Y(T)+4,T+' °C',{anchor:'end',size:11,fill:MUTED});
  for(const m of[0,2,4,6])b+=`<path d="M${f1(X(m*60))} ${gy}v4" stroke="${LINE}"/>`+text(X(m*60),gy+16,m+' min',{anchor:'middle',size:11,fill:MUTED});
  let d='';for(let s=0;s<=348;s+=3)d+=(s?'L':'M')+f1(X(s))+' '+f1(Y(heatingCurve(s)));b+=`<path d="${d}" fill="none" stroke="${PURPLE}" stroke-width="3"/>`;
  b+=text(X(125),Y(0)-8,'melting: about 4 minutes',{anchor:'middle',size:11,fill:PURPLE})+text(gx+4,gy-gh-8,'100 g of ice, 150 W reaching it',{size:11,fill:MUTED});
  b+=text(262,280,'With an adult. Wear goggles:',{size:12,fill:RED})+text(262,295,'the hot plate stays hot.',{size:12,fill:RED});
  return['Heating crushed ice','To scale, with a 10 cm scale bar. A 250 mL beaker of crushed ice on a hot plate, with a 30 cm thermometer and a stirring rod leaning in it. Beside it, the graph expected for 100 g of ice from −10 °C if 150 W reaches it: a few seconds to warm to 0 °C, about 4 minutes flat at 0 °C while the ice melts, then about 2 minutes to reach 40 °C. Safety: work with an adult and wear goggles.',b];},
 5:()=>{let b='';
  // At 7 px per cm: a 500 mL bottle 21 cm tall and 6.5 cm wide in a bowl of water 22 cm wide. Warming the bottle's air
  // from 20 °C to 60 °C makes it about 14% bigger, about 70 mL more: enough to fill the balloon to about 5 cm across.
  // Cooling it to 0 °C makes it about 7% smaller, so the balloon is pulled into the neck.
  const k=7,floor=252,setup=(x,hot)=>{let s=`<rect x="${x-11*k}" y="${floor-9*k}" width="${22*k}" height="${9*k}" rx="8" fill="${hot?'#f7d3c6':'#d6e9f7'}" stroke="${INK}"/>`;
   const w=6.5*k,top=floor-21*k,neck=2.5*k;
   s+=`<path d="M${x-w/2} ${floor-0.5*k}V${top+6*k}q0-${2.5*k} ${(w-neck)/2} -${3.5*k}V${top}h${neck}v${2.5*k}q${(w-neck)/2} ${1*k} ${(w-neck)/2} ${3.5*k}V${floor-0.5*k}z" fill="#ffffff" fill-opacity=".55" stroke="${INK}" stroke-width="2"/>`;
   s+=hot?`<circle cx="${x}" cy="${top-2.5*k}" r="${2.5*k}" fill="${PURPLE}" opacity=".85"/>`:`<path d="M${x-neck/2} ${top}q${neck/2} ${1.5*k} ${neck} 0" fill="${PURPLE}" opacity=".85"/>`;
   s+=`<path d="M${x-neck/2-2} ${top}h${neck+4}" stroke="${INK}" stroke-width="3"/>`;
   s+=text(x,floor+18,hot?'hot water, about 60 °C':'ice water, about 0 °C',{anchor:'middle',size:12,fill:hot?RED:'#2f6ea8'});
   const pts=[[x-8,floor-16*k],[x+9,floor-12*k],[x-6,floor-8*k],[x+8,floor-4*k],[x-9,floor-19*k]],len=hot?13:6;
   for(const[i,[px,py]]of pts.entries()){const a=i*1.3;s+=`<circle cx="${px}" cy="${f1(py)}" r="3.5" fill="${TEAL}"/><path d="M${px} ${f1(py)}l${f1(len*Math.cos(a))} ${f1(len*Math.sin(a))}" stroke="${TEAL}" stroke-width="2"/>`;}
   return s;};
  b+=setup(130,true)+setup(390,false);
  b+=text(130,28,'balloon about 5 cm across',{anchor:'middle',size:12,fill:PURPLE})+text(390,62,'pulled into the neck',{anchor:'middle',size:12,fill:PURPLE});
  b+=scaleBar(225,292,10*k,'10 cm')+text(260,262,'air particles enlarged',{anchor:'middle',size:11,fill:MUTED});
  return['A balloon on a bottle','To scale, with a 10 cm scale bar; the air particles are enlarged. A 500 mL bottle 21 cm tall with a balloon over its mouth, in a bowl of water. In hot water at about 60 °C the air expands by about 14%, about 70 mL, enough to fill the balloon to about 5 cm across; the particles have long motion arrows. In ice water the air shrinks by about 7% and the balloon is pulled into the neck; the arrows are short.',b];},
 6:()=>{let b='';
  // At 8 px per cm: kitchen scales with 18 cm platforms, and 500 mL soda bottles 22 cm tall and 6.5 cm wide holding
  // 200 mL of water. Readings are examples: about 27 g of bottle and cap, 200 g of water and half a 3.2 g tablet.
  const k=8,floor=250,setup=(x,capped,reading)=>{let s=`<rect x="${x-9*k}" y="${floor-3*k}" width="${18*k}" height="${3*k}" rx="4" fill="${MUTED}"/><rect x="${x-3.5*k}" y="${floor-2.4*k}" width="${7*k}" height="${1.8*k}" rx="2" fill="#e9f3ea"/>`+text(x,floor-1*k,reading,{anchor:'middle',bold:true,size:12,fill:'#1d5c2e'});
   const w=6.5*k,base=floor-3*k,top=base-22*k,neck=2.5*k;
   s+=`<path d="M${x-w/2} ${base}V${top+8*k}q0-${3*k} ${(w-neck)/2} -${5.5*k}V${top}h${neck}v${2.5*k}q${(w-neck)/2} ${2.5*k} ${(w-neck)/2} ${5.5*k}V${base}z" fill="#ffffff" fill-opacity=".6" stroke="${INK}" stroke-width="2"/>`;
   s+=`<path d="M${x-w/2+2} ${base-1}V${base-6.6*k}h${w-4}V${base-1}z" fill="${WATER}"/>`;
   for(let i=0;i<7;i++)s+=`<circle cx="${x-w/2+6+(i*9)%(w-12)}" cy="${base-1.2*k-(i*13)%(5*k)}" r="2.5" fill="#ffffff" stroke="#7fa6c9"/>`;
   s+=capped?`<rect x="${x-neck/2-2}" y="${top-1.2*k}" width="${neck+4}" height="${1.2*k}" rx="2" fill="${TEAL}"/>`:`<path d="M${x-6} ${top-4}q-5-16 3-28M${x+6} ${top-4}q8-16 0-28" fill="none" stroke="${LINE}" stroke-width="2"/>`+text(x+30,top-14,'gas escapes',{size:12,fill:MUTED});
   return s;};
  b+=setup(130,true,'228.6 g')+text(130,270,'capped: no change',{anchor:'middle',size:12});
  b+=setup(390,false,'228.4 g')+text(390,270,'open: 0.2 g lighter after',{anchor:'middle',size:12});
  b+=scaleBar(225,294,10*k,'10 cm');
  return['Mass before and after a reaction','To scale, with a 10 cm scale bar. Two 500 mL soda bottles with 200 mL of water and half an antacid tablet, each on a kitchen scale. The capped bottle reads 228.6 g before and after the fizzing. The open bottle lets carbon dioxide escape and reads about 0.2 g less after. The readings are examples.',b];},
 9:()=>{let b='';
  // At 2.2 px per cm: a 1 m ramp leaning on books at 10, 20 and 30 cm, a toy car 7.5 cm long, a paper cup 9 cm tall
  // and a meter stick.
  const k=2.2,floor=232,x0=66,len=100;
  for(const[i,hcm]of[10,20,30].entries()){const run=Math.sqrt(len*len-hcm*hcm)*k,top=floor-hcm*k;b+=`<path d="M${x0} ${f1(top)}L${f1(x0+run)} ${floor}" stroke="${i===2?INK:LINE}" stroke-width="${i===2?3:1.5}" ${i===2?'':'stroke-dasharray="5 4"'}/>`+text(x0-6*k-4,top+4,hcm+' cm',{anchor:'end',size:11,fill:MUTED});}
  b+=`<rect x="${x0-6*k}" y="${floor-30*k}" width="${6*k}" height="${30*k}" fill="#e2d6c3" stroke="${MUTED}"/>`;
  const a=Math.asin(30/len),cx=x0+8*Math.cos(a)*k,cy=floor-30*k+8*Math.sin(a)*k;b+=`<rect x="${f1(cx)}" y="${f1(cy-3*k)}" width="${7.5*k}" height="${3*k}" rx="2" fill="${RED}" transform="rotate(${f1(a*180/Math.PI)} ${f1(cx)} ${f1(cy)})"/>`;
  b+=`<path d="M20 ${floor}H505" stroke="${INK}" stroke-width="2"/>`;
  const run=Math.sqrt(len*len-900)*k,cup=x0+run+4;b+=`<path d="M${f1(cup)} ${floor}l${f1(-1.25*k)} -${9*k}h${8*k}l${f1(-1.25*k)} ${9*k}z" fill="#ffffff" stroke="${INK}" stroke-width="1.5"/>`;
  b+=arrow(cup+10*k,floor-12*k,cup+40*k,floor-12*k,PURPLE)+text(cup+25*k,floor-15*k,'slides',{anchor:'middle',size:12,fill:PURPLE});
  b+=`<rect x="${f1(cup)}" y="${floor+5}" width="${100*k}" height="${2.5*k}" fill="#f4e7b6" stroke="${MUTED}"/>`;for(let i=0;i<=10;i++)b+=`<path d="M${f1(cup+i*10*k)} ${floor+5}v${i%5?4:7}" stroke="${MUTED}"/>`;
  b+=text(cup+50*k,floor+30,'how far the cup slides',{anchor:'middle',size:12,fill:MUTED});
  b+=scaleBar(x0,286,20*k,'20 cm')+text(x0+25*k+8,290,'car 7.5 cm, cup 9 cm tall',{size:11,fill:MUTED});
  return['A toy car hits a cup','To scale, with a 20 cm scale bar. A 1 m ramp leaning on books at 10, 20 and 30 cm, a toy car 7.5 cm long at the top, a paper cup 9 cm tall on the floor at the bottom, and a meter stick to measure how far the cup slides.',b];},
 10:()=>{let b='';
  // The southern half of the sky, east (left) to west (right), with altitude and direction on the same angular scale,
  // 2.6 px per degree. The Moon is about 0.5° across, which would be 1.3 px; it is drawn 12 times larger.
  const k=2.6,cx=260,hz=230,X=az=>cx+az*k,Y=alt=>hz-alt*k;
  b+=`<rect x="0" y="0" width="520" height="300" fill="#22314d"/><rect x="0" y="${hz}" width="520" height="${300-hz}" fill="#1b2638"/><path d="M${X(70)} ${hz}H520" stroke="#e8a35c" stroke-width="5" opacity=".6"/>`;
  for(const[az,l]of[[-90,'east'],[-45,'southeast'],[0,'south'],[45,'southwest'],[90,'west']])b+=`<path d="M${f1(X(az))} ${hz}v6" stroke="#9fb6cf"/>`+text(X(az)+(az===-90?4:az===90?-4:0),hz+20,l,{anchor:az===-90?'start':az===90?'end':'middle',size:11,fill:'#d8deea'});
  for(const alt of[20,40,60])b+=`<path d="M0 ${f1(Y(alt))}H520" stroke="#3a4a66" stroke-dasharray="3 5"/>`+text(4,Y(alt)-3,alt+'° up',{size:11,fill:'#9fb6cf'});
  for(const day of[3,5,7,9,11]){const v=moonSky(day),x=X(v.azimuth),y=Y(v.altitude),r=7.8,rx=r*Math.abs(1-2*v.lit),gib=v.lit>.5;
   // Lit toward the Sun, which has set in the west (right).
   b+=`<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="#3a4a66"/><path d="M${f1(x)} ${f1(y-r)}A${r} ${r} 0 0 1 ${f1(x)} ${f1(y+r)}A${f1(rx)} ${r} 0 0 ${gib?1:0} ${f1(x)} ${f1(y-r)}Z" fill="#f4f1d0"/>`+text(x,y+r+14,'day '+day,{anchor:'middle',size:11,fill:'#d8deea'});}
  b+=text(260,22,'one hour after sunset, facing south, 34° N',{anchor:'middle',size:12,fill:'#d8deea'})+text(260,290,'angles to scale; the Moon drawn 12 times larger',{anchor:'middle',size:11,fill:'#9fb6cf'});
  return['Watching the Moon each evening','Angles to scale; the Moon drawn 12 times larger than it looks. The southern half of the sky one hour after sunset, for Southern California near an equinox, on days 3, 5, 7, 9 and 11 after new moon. The Moon starts as a thin crescent low in the west-southwest, lit toward the set Sun, and each evening appears farther east and higher, then lower in the southeast, more fully lit.',b];},
 11:()=>{let b='';
  // At 8 px per cm: two letter-size sheets (27.9 by 21.6 cm) and hole-punch dots 6.4 mm across. Each sheet started with
  // 50 dots of each color; the counts left are an example.
  const k=8,w=27.9*k,h=21.6*k,sheet=(x,dark,keepDark,keepLight)=>{let s=`<rect x="${x}" y="30" width="${f1(w)}" height="${f1(h)}" rx="3" fill="${dark?'#2e3440':'#efe6cf'}" stroke="${MUTED}"/>`;const r=seeded(dark?3:8);
   const dot=isDark=>{const px=x+8+r()*(w-16),py=38+r()*(h-16);return`<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(0.32*k)}" fill="${isDark?'#3b3f47':'#f6f1e2'}" stroke="${isDark?'#14161a':'#b9ad8a'}"/>`;};
   for(let i=0;i<keepDark;i++)s+=dot(true);for(let i=0;i<keepLight;i++)s+=dot(false);return s;};
  b+=sheet(16,true,44,11)+sheet(16+w+22,false,13,45);
  b+=text(16+w/2,224,'dark sheet: 44 dark, 11 light',{anchor:'middle',size:12})+text(38+w*1.5,224,'light sheet: 13 dark, 45 light',{anchor:'middle',size:12});
  b+=step(1,26,252,'Scatter 50 dark and 50 light dots on each sheet.')+step(2,26,276,'Pick dots for 10 s, then count what is left.');
  b+=scaleBar(400,268,10*k,'10 cm');
  return['Dots that match their background','To scale, with a 10 cm scale bar. Two letter-size sheets, one dark and one light, each started with 50 dark and 50 light hole-punch dots 6.4 mm across. After a partner picks dots for 10 seconds, the dark sheet has 44 dark and 11 light dots left, and the light sheet 13 dark and 45 light: the dots that match the sheet survive. The counts are an example.',b];},
 12:()=>{let b='';
  // Phones drawn at true proportions (7 by 15 cm, at 3 px per cm). The waves are graphs of the sound, not objects.
  const k=3,wave=(x,y,noise)=>{let d=`M${x} ${y}`;for(let i=1;i<=60;i++){const t=i/60,n=noise*Math.sin(i*7.3)*Math.cos(i*3.1);d+=`L${f1(x+t*55)} ${f1(y-14*Math.sin(t*4*Math.PI)+n*10)}`;}return`<path d="${d}" fill="none" stroke="${PURPLE}" stroke-width="2"/>`;};
  const phone=(x,y)=>`<rect x="${x}" y="${y}" width="${7*k}" height="${15*k}" rx="4" fill="${INK}"/><rect x="${x+2}" y="${y+4}" width="${7*k-4}" height="${15*k-9}" rx="2" fill="#9fb6cf"/>`;
  b+=text(20,36,'Analog: play it aloud and record again',{bold:true,size:13});
  for(let i=0;i<4;i++){const x=20+i*125;b+=phone(x,54)+wave(x+30,76,i*0.9);if(i<3)b+=arrow(x+92,76,x+118,76,LINE);b+=text(x+50,122,['original','copy 1','copy 2','copy 3'][i],{anchor:'middle',size:12,fill:MUTED});}
  b+=text(20,170,'Digital: copy the file of numbers',{bold:true,size:13});
  for(let i=0;i<4;i++){const x=20+i*125;b+=`<rect x="${x}" y="186" width="96" height="44" rx="5" fill="#eef4fb" stroke="${LINE}"/>`+text(x+48,205,'0.00, 0.25,',{anchor:'middle',size:11})+text(x+48,221,'0.48, 0.68 …',{anchor:'middle',size:11});if(i<3)b+=arrow(x+100,208,x+122,208,LINE);b+=text(x+48,250,['original','copy 1','copy 2','copy 3'][i],{anchor:'middle',size:12,fill:MUTED});}
  b+=text(260,284,'each analog copy adds noise; each digital copy is exact',{anchor:'middle',size:12,fill:MUTED});
  return['Copying a recording','A diagram, not a scene: the phones are drawn at true proportions, and the waves are graphs of the sound. Top: a sound recorded on a phone, played aloud and recorded again three times; the wave gets noisier with each copy. Bottom: the same recording stored as numbers and copied three times; every copy holds the same numbers.',b];},
 16:()=>{let b='';
  // At 24 px per cm: quarters 2.43 cm across and a 3 by 5 inch card (12.7 by 7.6 cm).
  const k=24,coin=(x,y,l)=>`<circle cx="${x}" cy="${y}" r="${f1(1.215*k)}" fill="#d8d8d8" stroke="#9a9a9a" stroke-width="2"/>`+text(x,y+7,l,{anchor:'middle',bold:true,size:20,fill:'#444b55'});
  b+=coin(52,78,'P')+coin(122,78,'p')+text(87,124,'parent 1’s coin',{anchor:'middle',size:12,fill:MUTED})+coin(52,178,'P')+coin(122,178,'p')+text(87,224,'parent 2’s coin',{anchor:'middle',size:12,fill:MUTED});
  b+=text(87,30,'heads P, tails p',{anchor:'middle',size:12,fill:MUTED});
  const tx=184,ty=50,cw=12.7*k,ch=7.6*k;b+=`<rect x="${tx}" y="${ty}" width="${f1(cw)}" height="${f1(ch)}" fill="#ffffff" stroke="${LINE}"/>`;
  for(let i=1;i<=3;i++)b+=`<path d="M${tx} ${f1(ty+i*ch/4)}H${f1(tx+cw)}" stroke="#c7d3e3"/>`;b+=`<path d="M${tx+60} ${ty}V${f1(ty+ch)}" stroke="${RED}" opacity=".5"/>`;
  b+=text(tx+30,ty+30,'Toss',{anchor:'middle',bold:true})+text(tx+180,ty+30,'Tally (40 tosses)',{anchor:'middle',bold:true});
  const tally=(x,y,n)=>{let s='';for(let i=0;i<n;i++){const g=Math.floor(i/5),q=i%5;s+=q<4?`<path d="M${x+g*30+q*6} ${y-12}v16" stroke="${INK}" stroke-width="2"/>`:`<path d="M${x+g*30-2} ${y}l26 -12" stroke="${INK}" stroke-width="2"/>`;}return s;};
  const row=i=>ty+ch/4*i+ch/8+5;
  b+=text(tx+30,row(1),'PP',{anchor:'middle'})+tally(tx+76,row(1),9)+text(tx+30,row(2),'Pp',{anchor:'middle'})+tally(tx+76,row(2),21)+text(tx+30,row(3),'pp',{anchor:'middle'})+tally(tx+76,row(3),10);
  b+=text(tx+cw/2,ty+ch+22,'compare with ¼ : ½ : ¼, that is 10 : 20 : 10',{anchor:'middle',size:12,fill:MUTED});
  b+=scaleBar(tx,288,5*k,'5 cm');
  return['Coin tosses for a cross','To scale, with a 5 cm scale bar. Two quarters for each parent’s alleles, heads P and tails p, and a 3 by 5 inch card with a tally of 40 tosses: 9 PP, 21 Pp and 10 pp, to compare with the expected 10, 20 and 10.',b];},
 17:()=>{let b='';
  // At 8 px per cm: a forearm about 6 cm wide, two fingertips about 1.6 cm wide on the wrist below the thumb, and a
  // stopwatch 5.5 cm across.
  const k=8;b+=`<path d="M20 ${200}h${20*k}" stroke="#d9a77e" stroke-width="${6*k}" stroke-linecap="round"/>`;
  b+=`<path d="M${30+12*k} 182q${2*k} -${5*k} ${6*k} -${7*k}M${30+14*k} 186q${2*k} -${5*k} ${6*k} -${7*k}" fill="none" stroke="#c8926a" stroke-width="${1.6*k}" stroke-linecap="round"/>`;
  b+=text(110,252,'two fingers on the wrist,',{anchor:'middle',size:12,fill:MUTED})+text(110,268,'below the thumb',{anchor:'middle',size:12,fill:MUTED});
  b+=`<circle cx="70" cy="70" r="${2.75*k}" fill="#ffffff" stroke="${INK}" stroke-width="3"/><path d="M70 70V${70-2*k}M70 70l${1.4*k} ${0.8*k}" stroke="${INK}" stroke-width="2.5"/><rect x="65" y="${70-2.75*k-7}" width="10" height="7" fill="${INK}"/>`+text(108,64,'count beats',{size:12,fill:MUTED})+text(108,80,'for 15 s, × 4',{size:12,fill:MUTED});
  b+=scaleBar(20,292,5*k,'5 cm');
  // A typical record: resting about 72 beats a minute, about 128 just after a minute of exercise, back near rest
  // within about 5 minutes.
  const gx=268,gw=222,gy=226,gh=170,X=m=>gx+m/8*gw,Y=bpm=>gy-(bpm-60)/80*gh,data=[[0,72],[1,72],[2,128],[3,104],[4,90],[5,82],[6,76],[7,73],[8,72]];
  b+=`<path d="M${gx} ${gy}H${gx+gw}M${gx} ${gy}V${gy-gh}" stroke="${LINE}"/>`;
  for(const v of[60,80,100,120,140])b+=`<path d="M${gx-4} ${f1(Y(v))}h4" stroke="${LINE}"/>`+text(gx-7,Y(v)+4,String(v),{anchor:'end',size:11,fill:MUTED});
  for(const m of[0,2,4,6,8])b+=`<path d="M${f1(X(m))} ${gy}v4" stroke="${LINE}"/>`+text(X(m),gy+16,String(m),{anchor:'middle',size:11,fill:MUTED});
  b+=`<rect x="${f1(X(1))}" y="${gy-gh}" width="${f1(X(2)-X(1))}" height="${gh}" fill="${PURPLE}" opacity=".08"/>`+text(X(1.5),gy-gh+14,'exercise',{anchor:'middle',size:11,fill:PURPLE});
  b+=`<path d="${data.map(([m,v],i)=>(i?'L':'M')+f1(X(m))+' '+f1(Y(v))).join('')}" fill="none" stroke="${PURPLE}" stroke-width="3"/><path d="M${gx} ${f1(Y(72))}H${gx+gw}" stroke="${TEAL}" stroke-dasharray="5 4"/>`;
  b+=text(gx+gw,Y(72)+16,'resting, about 72',{anchor:'end',size:11,fill:TEAL})+text(gx+4,gy-gh-8,'beats per minute',{size:11,fill:MUTED})+text(gx+gw,gy+30,'minutes',{anchor:'end',size:11,fill:MUTED});
  return['Pulse after exercise','To scale, with a 5 cm scale bar. Two fingers on the wrist below the thumb and a stopwatch, to count beats for 15 seconds and multiply by 4. Beside them, a typical record: about 72 beats a minute at rest, about 128 just after a minute of exercise, and back near 72 within about 5 minutes.',b];}
};
function figure(lesson){
 const draw=DRAWINGS[lesson];if(!draw)return'';
 const[title,description,body]=draw();
 return`<div class="investigation-figure">${M.graphic(title,description,body)}</div>`;
}
const api={figure,heatingCurve,moonSky,HEAT,SKY,LESSONS:Object.keys(DRAWINGS).map(Number)};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceScienceInvestigations=api;
})(typeof window==='undefined'?globalThis:window);
