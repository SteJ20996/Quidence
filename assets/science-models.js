(function(root){
'use strict';
// Models for Integrated Science 6–10. Each returns a graph, a one-line readout, the formula used and a note on what
// the model leaves out. Constants and their sources are listed in review/integrated-science-unit1-20261115.md.
const M=typeof module==='object'&&module.exports?require('./course-models.js'):root.QuidenceCourseModels;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>{if(!Number.isFinite(n))return'—';const r=Math.abs(n)>=100?Math.round(n):Math.abs(n)>=10?Math.round(n*10)/10:Math.round(n*100)/100;return(Object.is(r,-0)?0:r).toLocaleString('en-US',{maximumFractionDigits:2}).replace('-','−');};
// Water, from OpenStax College Physics 2e (tables 14.1 and 14.2): specific heats in J/(g·°C), latent heats in J/g.
const WATER={iceHeat:2.09,waterHeat:4.18,melt:334,boil:2256,start:-20};
// Rising air (NOAA/NWS): about 10 °C per km without cloud; the dew point falls about 2 °C per km, so a cloud base sits
// about 125 m above the ground for each degree of difference between temperature and dew point; inside cloud the
// cooling is slower and depends on temperature, about 5 °C per km here.
const AIR={dry:10,dew:2,cloud:5,perDegree:.125};
// Carbon dioxide (IPCC AR6 WG1, ch. 7): 278 ppm before industry; about 3.9 W/m² of extra energy and about 3 °C of
// eventual warming for each doubling.
const CO2={base:278,forcing:3.93,warming:3};
function cell(side,shape){const flat=shape==='flat',area=flat?3*side*side:6*side*side,volume=flat?side**3/4:side**3;return{area,volume,ratio:area/volume};}
function heating(mass,kj){
 const e1=mass*WATER.iceHeat*(0-WATER.start),e2=e1+mass*WATER.melt,e3=e2+mass*WATER.waterHeat*100,e4=e3+mass*WATER.boil,E=kj*1000;
 let temperature,stage,fraction=null;
 if(E<=e1){temperature=WATER.start+E/(mass*WATER.iceHeat);stage='ice warming';}
 else if(E<=e2){temperature=0;stage='melting';fraction=(E-e1)/(e2-e1);}
 else if(E<=e3){temperature=(E-e2)/(mass*WATER.waterHeat);stage='water warming';}
 else if(E<=e4){temperature=100;stage='boiling';fraction=(E-e3)/(e4-e3);}
 else{temperature=100;stage='all steam';fraction=1;}
 return{temperature,stage,fraction,stages:[e1,e2-e1,e3-e2,e4-e3].map(x=>x/1000),total:e4/1000,curve:x=>{const J=x*1000;if(J>e4)return null;if(J<=e1)return WATER.start+J/(mass*WATER.iceHeat);if(J<=e2)return 0;if(J<=e3)return(J-e2)/(mass*WATER.waterHeat);return 100;}};
}
function rainShadow(temperature,dewPoint,height){
 const spread=Math.max(0,temperature-dewPoint),base=spread*AIR.perDegree,cloud=height>base;
 const crest=cloud?temperature-AIR.dry*base-AIR.cloud*(height-base):temperature-AIR.dry*height;
 const far=crest+AIR.dry*height,farDew=cloud?crest+AIR.dew*height:Math.min(dewPoint,temperature);
 return{base,cloud,crest,far,farDew};
}
function warming(co2){const doublings=Math.log2(co2/CO2.base);return{doublings,forcing:CO2.forcing*doublings,warming:CO2.warming*doublings,times:co2/CO2.base};}
// A cross-section of the coast, the range and the far side, with the cloud on the windward slope.
function mountain(s,v){
 const X0=60,X1=460,crestX=260,ground=250,kmPx=45,top=ground-s.height*kmPx,y=h=>ground-h*kmPx,slopeX=(h,side)=>side<0?X0+(crestX-X0)*h/s.height:X1-(X1-crestX)*h/s.height;
 let b=`<path d="M20 ${ground}H500" stroke="#8391a5"/><path d="M${X0} ${ground}L${crestX} ${top}L${X1} ${ground}Z" fill="#d9e4cf" stroke="#5b7a52" stroke-width="2"/>`;
 b+=`<path d="M30 52h60" stroke="#087f76" stroke-width="2.5"/><path d="M84 47l8 5-8 5" fill="none" stroke="#087f76" stroke-width="2.5"/><text x="30" y="40" class="tick">wind from the Pacific</text>`;
 if(v.cloud){const cy=y(v.base),x1=slopeX(v.base,-1);
  b+=`<path d="M${x1} ${cy}L${crestX} ${top}L${crestX} ${cy}Z" fill="#c9d3e6" opacity=".9"/><path d="M40 ${cy}H${crestX}" stroke="#6542c0" stroke-dasharray="6 4"/>`;
  for(let i=0;i<5;i++){const x=x1+10+i*((crestX-x1-20)/4),yy=y(v.base)+8;if(yy<ground)b+=`<path d="M${x} ${yy}l-4 10" stroke="#3e6aa0" stroke-width="2"/>`;}
  // The label goes on top, with a halo, so the cloud never hides it.
  b+=`<text x="44" y="${cy-6}" class="tick" stroke="#fff" stroke-width="4" stroke-linejoin="round" paint-order="stroke">cloud base ${fmt(v.base)} km</text>`;}
 const label=(x,yy,t)=>`<text x="${x}" y="${yy}" text-anchor="middle" font-size="14" fill="#263c5b">${esc(t)}</text>`;
 b+=label(X0,ground+22,'coast '+fmt(s.temperature)+' °C')+label(crestX,top-10,'crest '+fmt(v.crest)+' °C')+label(X1,ground+22,'far side '+fmt(v.far)+' °C');
 return M.graphic('Air crossing a mountain range',`A ${s.height} km range. Air reaches the crest at ${fmt(v.crest)} °C and the far side at ${fmt(v.far)} °C.${v.cloud?` A cloud forms above ${fmt(v.base)} km on the windward slope.`:' No cloud forms.'} Heights are to scale; widths are not.`,b);
}
// Grade 7. Substances at sea-level pressure (CRC Handbook): molar mass in atomic mass units, melting and boiling points
// in °C. Carbon dioxide has no liquid state at this pressure: it turns from solid to gas at −78.5 °C.
const SUBSTANCES={
 water:{name:'Water',formula:'H₂O',atoms:{H:2,O:1},mass:18.02,melt:0,boil:100},
 oxygen:{name:'Oxygen',formula:'O₂',atoms:{O:2},mass:32.00,melt:-218.8,boil:-183.0},
 'carbon-dioxide':{name:'Carbon dioxide',formula:'CO₂',atoms:{C:1,O:2},mass:44.01,sublime:-78.5},
 methane:{name:'Methane',formula:'CH₄',atoms:{C:1,H:4},mass:16.04,melt:-182.5,boil:-161.5},
 ethanol:{name:'Ethanol',formula:'C₂H₆O',atoms:{C:2,H:6,O:1},mass:46.07,melt:-114.1,boil:78.3}
};
const ELEMENT={H:'hydrogen',C:'carbon',O:'oxygen'};
// Typical (root-mean-square) speed √(3kT/m) = 157.94 × √(T/m) m/s, with T in kelvins and m in atomic mass units.
const SPEED=Math.sqrt(3*1.380649e-23/1.66053907e-27);
function particles(key,celsius){
 const s=SUBSTANCES[key],kelvin=celsius+273.15;let state;
 if(s.sublime!==undefined)state=celsius<s.sublime?'solid':'gas';
 else state=celsius<s.melt?'solid':celsius===s.melt?'melting':celsius<s.boil?'liquid':celsius===s.boil?'boiling':'gas';
 return{...s,kelvin,state,speed:SPEED*Math.sqrt(kelvin/s.mass),atomCount:Object.values(s.atoms).reduce((a,b)=>a+b,0)};
}
// A small seeded generator, so the drawing is the same every time.
function seeded(seed){let t=seed>>>0;return()=>{t=(t+0x6D2B79F5)>>>0;let r=Math.imul(t^(t>>>15),1|t);r^=r+Math.imul(r^(r>>>7),61|r);return((r^(r>>>14))>>>0)/4294967296;};}
// Ball-and-stick drawings, flattened onto the page: [element, x, y] and bonds between atom indices.
const MOLECULES={
 water:{atoms:[['O',0,0],['H',-24,18],['H',24,18]],bonds:[[0,1],[0,2]]},
 oxygen:{atoms:[['O',-15,0],['O',15,0]],bonds:[[0,1]]},
 'carbon-dioxide':{atoms:[['O',-32,0],['C',0,0],['O',32,0]],bonds:[[0,1],[1,2]]},
 methane:{atoms:[['C',0,0],['H',0,-28],['H',28,0],['H',0,28],['H',-28,0]],bonds:[[0,1],[0,2],[0,3],[0,4]]},
 ethanol:{atoms:[['C',-30,0],['C',2,0],['O',34,-12],['H',-48,-18],['H',-50,12],['H',-30,28],['H',2,-28],['H',2,28],['H',58,-2]],bonds:[[0,1],[1,2],[0,3],[0,4],[0,5],[1,6],[1,7],[2,8]]}
};
const ATOM_STYLE={H:{r:10,fill:'#f4f6f8',text:'#263c5b'},C:{r:14,fill:'#3d4852',text:'#ffffff'},O:{r:15,fill:'#d64545',text:'#ffffff'}};
let boxSerial=0;
function particleBox(key,v){
 const L=24,T=34,S=220,clip='particle-box-'+(++boxSerial),rand=seeded(7+key.length),dot=(x,y)=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="#087f76" opacity=".85"/>`;
 const arrow=(x,y,len,a)=>{const x2=x+len*Math.cos(a),y2=y+len*Math.sin(a);return`<path d="M${x.toFixed(1)} ${y.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="#6542c0" stroke-width="2"/><circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="2.5" fill="#6542c0"/>`;};
 // One arrow scale for every state: the arrangement shows the state, the arrow length shows the typical speed.
 const scale=.03,grid=(x0,x1,y0,y1,jitter)=>{let b='';for(let x=x0;x<=x1;x+=30)for(let y=y0;y<=y1;y+=30){const px=x+(rand()-.5)*jitter,py=y+(rand()-.5)*jitter;b+=dot(px,py)+arrow(px,py,v.speed*scale,rand()*2*Math.PI);}return b;};
 const gas=(n,y0,y1)=>{let b='';for(let i=0;i<n;i++){const px=L+20+rand()*(S-40),py=y0+rand()*(y1-y0);b+=dot(px,py)+arrow(px,py,v.speed*scale,rand()*2*Math.PI);}return b;};
 let b=`<defs><clipPath id="${clip}"><rect x="${L}" y="${T}" width="${S}" height="${S}" rx="8"/></clipPath></defs><rect x="${L}" y="${T}" width="${S}" height="${S}" rx="8" fill="#ffffff" stroke="#8391a5"/><g clip-path="url(#${clip})">`;
 if(v.state==='solid')b+=grid(L+20,L+200,T+20,T+200,0);
 else if(v.state==='liquid')b+=grid(L+20,L+200,T+80,T+200,12);
 else if(v.state==='gas')b+=gas(9,T+20,T+S-20);
 else if(v.state==='melting')b+=grid(L+20,L+80,T+80,T+200,0)+grid(L+110,L+200,T+80,T+200,12);
 else b+=grid(L+20,L+200,T+140,T+200,12)+gas(4,T+20,T+100);
 return b+`</g><text x="${L+S/2}" y="${T+S+22}" text-anchor="middle" class="tick">${esc(v.state==='melting'?'melting: solid and liquid':v.state==='boiling'?'boiling: liquid and gas':v.state)}</text>`;
}
function molecule(key,cx,cy){
 const m=MOLECULES[key],k=1.3,P=a=>[cx+a[1]*k,cy+a[2]*k];let b='';
 for(const[i,j]of m.bonds){const[a,c]=[P(m.atoms[i]),P(m.atoms[j])];b+=`<path d="M${a[0]} ${a[1]}L${c[0]} ${c[1]}" stroke="#52647b" stroke-width="4"/>`;}
 for(const atom of m.atoms){const[x,y]=P(atom),st=ATOM_STYLE[atom[0]];b+=`<circle cx="${x}" cy="${y}" r="${st.r*k}" fill="${st.fill}" stroke="#52647b" stroke-width="1.5"/><text x="${x}" y="${y+5}" text-anchor="middle" font-size="14" font-weight="700" fill="${st.text}">${atom[0]}</text>`;}
 return b;
}
// Reactions, with rounded atomic masses: hydrogen 1, carbon 12, oxygen 16.
const AMU={H:1,C:12,O:16};
const REACTIONS={
 photosynthesis:{name:'Photosynthesis',before:[[6,'CO₂',{C:1,O:2}],[6,'H₂O',{H:2,O:1}]],after:[[1,'C₆H₁₂O₆',{C:6,H:12,O:6}],[6,'O₂',{O:2}]]},
 respiration:{name:'Cellular respiration',before:[[1,'C₆H₁₂O₆',{C:6,H:12,O:6}],[6,'O₂',{O:2}]],after:[[6,'CO₂',{C:1,O:2}],[6,'H₂O',{H:2,O:1}]]},
 methane:{name:'Burning methane',before:[[1,'CH₄',{C:1,H:4}],[2,'O₂',{O:2}]],after:[[1,'CO₂',{C:1,O:2}],[2,'H₂O',{H:2,O:1}]]}
};
const molecularMass=atoms=>Object.entries(atoms).reduce((m,[e,n])=>m+AMU[e]*n,0);
function reaction(key,times){
 const r=REACTIONS[key],side=list=>{const atoms={C:0,H:0,O:0},parts=list.map(([n,formula,a])=>{for(const[e,c]of Object.entries(a))atoms[e]+=n*c*times;return{count:n*times,formula,mass:n*times*molecularMass(a)};});return{atoms,parts,mass:parts.reduce((m,p)=>m+p.mass,0)};};
 const before=side(r.before),after=side(r.after);
 // In photosynthesis the sugar's carbon and oxygen atoms come from carbon dioxide, its hydrogen from water.
 const fromAir=key==='photosynthesis'?{sugar:180,fromCO2:6*AMU.C+6*AMU.O}:null;
 return{name:r.name,before,after,fromAir};
}
function massBars(v){
 const H=190,base=255,scale=H/Math.max(v.before.mass,v.after.mass),colors=['#087f76','#6542c0'];
 const bar=(x,side,label)=>{let y=base,b='';side.parts.forEach((p,i)=>{const h=p.mass*scale;y-=h;b+=`<rect x="${x}" y="${y.toFixed(1)}" width="120" height="${h.toFixed(1)}" fill="${colors[i]}" opacity="${i?.75:.85}" stroke="#ffffff"/><text x="${x+60}" y="${(y+h/2+5).toFixed(1)}" text-anchor="middle" font-size="14" fill="#ffffff">${esc(p.count+' '+p.formula+' · '+fmt(p.mass)+' u')}</text>`;});
  return b+`<text x="${x+60}" y="${base+22}" text-anchor="middle" class="tick">${label} · ${fmt(side.mass)} u</text>`;};
 return`<path d="M40 ${base}H480" stroke="#8391a5"/>`+bar(90,v.before,'Before')+bar(310,v.after,'After')+`<text x="260" y="${base-H-12}" text-anchor="middle" font-size="13" fill="#52647b">Both bars use the same scale</text>`;
}
// Seafloor stripes: intervals of normal polarity (the same as today) in millions of years, rounded from the geomagnetic
// polarity time scale (Brunhes, Jaramillo, Olduvai, Gauss and the Gilbert subchrons). Between them the field was reversed.
const NORMAL=[[0,0.78],[0.99,1.07],[1.78,1.94],[2.58,3.03],[3.12,3.21],[3.33,3.6],[4.19,4.3],[4.49,4.63],[4.8,4.9],[5,5.24]],STRIPE_LIMIT=5.24;
function seafloor(rate,distance){
 const kmPerMyr=rate*10,age=distance/kmPerMyr,known=age<STRIPE_LIMIT;
 return{kmPerMyr,age,known,normal:known?NORMAL.some(([a,b])=>age>=a&&age<b):null,lastFlip:0.78*kmPerMyr};
}
function stripes(s,v){
 const X=km=>260+km*1.1,top=36,h=46;let b=`<rect x="${X(-200)}" y="${top}" width="440" height="${h}" fill="#ffffff" stroke="#8391a5"/>`;
 const edge=Math.min(200,STRIPE_LIMIT*v.kmPerMyr);
 if(edge<200)for(const sign of[-1,1]){const a=X(sign*edge),c=X(sign*200);b+=`<rect x="${Math.min(a,c)}" y="${top}" width="${Math.abs(c-a)}" height="${h}" fill="#e7ebf2"/>`;}
 for(const[a,c]of NORMAL)for(const sign of[-1,1]){const k0=Math.min(200,a*v.kmPerMyr),k1=Math.min(200,c*v.kmPerMyr);if(k1>k0){const x0=X(sign*k0),x1=X(sign*k1);b+=`<rect x="${Math.min(x0,x1)}" y="${top}" width="${Math.abs(x1-x0)}" height="${h}" fill="#263c5b"/>`;}}
 b+=`<path d="M${X(0)} ${top-8}V${top+h+8}" stroke="#d64545" stroke-width="2.5"/><text x="${X(0)}" y="${top-12}" text-anchor="middle" font-size="13" fill="#d64545">ridge</text>`;
 b+=`<path d="M${X(s.distance)} ${top+h+4}l-6 10h12z" fill="#6542c0"/>`;
 // Age against distance on both sides, up to 10 million years.
 const gx=km=>X(km),gy=age=>270-age*15,maxKm=Math.min(200,10*v.kmPerMyr);
 b+=`<path d="M${gx(-200)} ${gy(0)}H${gx(200)}" stroke="#8391a5"/><path d="M${gx(0)} ${gy(0)}V${gy(10)}" stroke="#8391a5"/>`;
 for(const t of[2,4,6,8,10])b+=`<path d="M${gx(0)-4} ${gy(t)}h8" stroke="#8391a5"/><text x="${gx(0)-8}" y="${gy(t)+5}" text-anchor="end" font-size="12" fill="#52647b">${t}</text>`;
 b+=`<path d="M${gx(-maxKm)} ${gy(maxKm/v.kmPerMyr)}L${gx(0)} ${gy(0)}L${gx(maxKm)} ${gy(maxKm/v.kmPerMyr)}" fill="none" stroke="#6542c0" stroke-width="3"/>`;
 if(v.age<=10)b+=`<circle cx="${gx(s.distance)}" cy="${gy(v.age)}" r="6" fill="#b4441f"/>`;
 b+=`<text x="${gx(0)+8}" y="${gy(10)+4}" font-size="12" fill="#52647b">age (million years)</text><text x="${gx(200)}" y="${gy(0)+18}" text-anchor="end" font-size="12" fill="#52647b">200 km</text><text x="${gx(-200)}" y="${gy(0)+18}" font-size="12" fill="#52647b">200 km</text>`;
 return M.graphic('Magnetic stripes and seafloor age',`Spreading at ${fmt(s.rate)} cm per year on each side, ${fmt(v.kmPerMyr)} km per million years. Dark stripes are rock magnetized like today’s field; light stripes, the reverse.${STRIPE_LIMIT*v.kmPerMyr<200?' Gray rock is older than 5.2 million years; its stripes are not drawn.':''} The sample ${s.distance} km from the ridge is about ${fmt(v.age)} million years old.`,b);
}
// Island foxes: a made-up model, not island fox data. Growth slows near the carrying capacity; eagles arrive in
// year 5; a plan starts in year 10.
const FOX={capacity:1500,growth:0.3,arrive:5,start:10,release:20,releaseYears:10,years:40};
function foxes(eagles,plan){
 const take=eagles/100,run=p=>{let n=FOX.capacity;const out=[n];for(let t=0;t<FOX.years;t++){const hunted=t>=FOX.arrive&&!(t>=FOX.start&&(p==='remove'||p==='both')),added=(p==='release'||p==='both')&&t>=FOX.start&&t<FOX.start+FOX.releaseYears?FOX.release:0;n=n+FOX.growth*n*(1-n/FOX.capacity)-(hunted?take*n:0)+added;out.push(n);}return out;};
 const series=run(plan),none=run('none'),back=series.findIndex((n,t)=>t>FOX.start&&n>=1000);
 return{series,none,lowest:Math.min(...series),back:back<0?null:back};
}
const PLAN_NAMES={none:'No plan',remove:'Move the eagles away',release:'Release captive-bred foxes',both:'Both'};
const curve=series=>x=>{const i=Math.floor(x),f=x-i;return i>=series.length-1?series[series.length-1]:series[i]*(1-f)+series[i+1]*f;};
// Grade 8. Stopping: a driver reacts in about 1.5 s; typical braking rates are about 7 m/s² on a dry road and
// 4 m/s² on a wet one.
const STOP={reaction:1.5,rate:{dry:7,wet:4}};
function crash(mass,kmh,road){
 const v=kmh/3.6,a=STOP.rate[road];
 return{v,energy:mass*v*v/2,reaction:v*STOP.reaction,braking:v*v/(2*a),force:mass*a,rate:a};
}
// The Moon: one cycle of phases (a synodic month) is 29.53 days.
const MONTH=29.53;
function moon(day){
 const f=day/MONTH,angle=2*Math.PI*f,lit=(1-Math.cos(angle))/2;
 const name=f<.03||f>=.97?'new moon':f<.22?'waxing crescent':f<.28?'first quarter':f<.47?'waxing gibbous':f<.53?'full moon':f<.72?'waning gibbous':f<.78?'third quarter':'waning crescent';
 // Rising time: about 6 a.m. at new moon, and about 24 hours later over one cycle.
 const minutes=Math.round((6*60+24*60*f)/10)*10%(24*60);
 return{fraction:f,angle,lit,name,waxing:f<.5,rise:minutes};
}
const clock=m=>{const h=Math.floor(m/60),mm=m%60;return m===0?'midnight':m===720?'noon':`${h%12||12}:${String(mm).padStart(2,'0')} ${h<12?'a.m.':'p.m.'}`;};
function phaseDisc(v,cx,cy,R){
 // The lit part as seen from the Northern Hemisphere: right side while waxing, left side while waning.
 const rx=R*Math.abs(Math.cos(v.angle)),gibbous=v.lit>.5,top=`${cx} ${cy-R}`,bottom=`${cx} ${cy+R}`;
 let lit;
 if(v.lit<.001)lit='';
 else if(v.lit>.999)lit=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="#f4f1d0"/>`;
 else if(v.waxing)lit=`<path d="M${top}A${R} ${R} 0 0 1 ${bottom}A${rx.toFixed(2)} ${R} 0 0 ${gibbous?1:0} ${top}Z" fill="#f4f1d0"/>`;
 else lit=`<path d="M${top}A${R} ${R} 0 0 0 ${bottom}A${rx.toFixed(2)} ${R} 0 0 ${gibbous?0:1} ${top}Z" fill="#f4f1d0"/>`;
 return`<circle cx="${cx}" cy="${cy}" r="${R}" fill="#3d4852"/>${lit}<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#52647b"/>`;
}
function moonView(s,v){
 const ex=170,ey=150,orbit=95,a=Math.PI+v.angle,mx=ex+orbit*Math.cos(a),my=ey-orbit*Math.sin(a);
 let b='';
 for(const y of[70,110,150,190,230])b+=`<path d="M14 ${y}h34" stroke="#d99a1e" stroke-width="2"/><path d="M42 ${y-4}l7 4-7 4" fill="none" stroke="#d99a1e" stroke-width="2"/>`;
 b+=`<text x="14" y="50" font-size="13" fill="#9a6a00">sunlight</text>`;
 b+=`<circle cx="${ex}" cy="${ey}" r="${orbit}" fill="none" stroke="#c3cbd8" stroke-dasharray="5 5"/>`;
 // Earth and Moon, each lit on the side facing the Sun (the left).
 b+=`<circle cx="${ex}" cy="${ey}" r="24" fill="#2f5d8a"/><path d="M${ex} ${ey-24}A24 24 0 0 0 ${ex} ${ey+24}Z" fill="#7fb3e0"/><text x="${ex}" y="${ey+44}" text-anchor="middle" font-size="13" fill="#263c5b">Earth</text>`;
 b+=`<circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="11" fill="#3d4852"/><path d="M${mx.toFixed(1)} ${(my-11).toFixed(1)}A11 11 0 0 0 ${mx.toFixed(1)} ${(my+11).toFixed(1)}Z" fill="#f4f1d0"/><circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="11" fill="none" stroke="#52647b"/>`;
 b+=`<text x="${ex}" y="30" text-anchor="middle" font-size="13" fill="#52647b">seen from above the North Pole</text>`;
 b+=phaseDisc(v,410,130,62)+`<text x="410" y="222" text-anchor="middle" font-size="15" font-weight="700" fill="#263c5b">${esc(v.name)}</text><text x="410" y="242" text-anchor="middle" font-size="13" fill="#52647b">seen from Earth: ${Math.round(100*v.lit)}% lit</text>`;
 return M.graphic('The Moon’s phase',`Day ${fmt(s.day)} after new moon: ${v.name}, ${Math.round(100*v.lit)}% of the face we see is lit. Left: the Sun, Earth and the Moon seen from above the North Pole, not to scale. Right: the Moon as seen from the Northern Hemisphere.`,b);
}
// Natural selection on fur color: the better-matched color leaves (1 + advantage) times as many young.
function selection(ground,advantage,start,generations=200){
 const s=advantage/100,out=[start/100];let p=start/100;
 for(let g=0;g<generations;g++){p=ground==='lava'?p*(1+s)/(p*(1+s)+(1-p)):p/(p+(1-p)*(1+s));out.push(p);}
 const half=out.findIndex(x=>x>.5);
 return{series:out,half:half<0?null:half};
}
// Sound speeds near 20 °C (typical values).
const MEDIA={air:{name:'Air',speed:343},water:{name:'Seawater',speed:1500},steel:{name:'Steel',speed:5960}};
function wave(medium,frequency,amplitude){
 const m=MEDIA[medium];
 return{...m,wavelength:m.speed/frequency,period:1/frequency,energy:amplitude*amplitude,inWindow:frequency*0.1};
}
// Living Earth. Energy up a food chain: each level passes on a share of the energy it receives.
const LEVELS=['Plants','Plant-eaters','Small meat-eaters','Larger meat-eaters','Top predators'];
function foodChain(producers,efficiency,levels){
 const e=efficiency/100,energy=[];for(let k=0;k<levels;k++)energy.push(producers*e**k);
 return{energy,top:energy[levels-1],share:energy[levels-1]/producers,lost:producers-energy[levels-1]};
}
function pyramid(v,levels){
 const max=v.energy[0],H=42,top=30;let b='';
 // Bars start after a column of level names; the value sits inside a wide bar and after a narrow one.
 v.energy.forEach((x,k)=>{const y=top+(levels-1-k)*(H+8),x0=165,w=Math.max(2,290*x/max),inside=w>70;
  b+=`<rect x="${x0}" y="${y}" width="${w.toFixed(1)}" height="${H}" rx="4" fill="${k?'#6542c0':'#087f76'}" opacity="${(0.95-0.12*k).toFixed(2)}"/><text x="${x0-10}" y="${y+H/2+5}" text-anchor="end" font-size="13" fill="#263c5b">${esc(LEVELS[k])}</text><text x="${(inside?x0+w-8:x0+w+8).toFixed(1)}" y="${y+H/2+5}" text-anchor="${inside?'end':'start'}" font-size="13" fill="${inside?'#ffffff':'#263c5b'}">${esc(fmt(x))}</text>`;});
 return M.graphic('Energy at each level of a food chain',`Each bar is drawn to the same scale. Plants capture ${fmt(v.energy[0])} units; the top level receives ${fmt(v.top)} units, ${fmt(100*v.share)}% of the plants’ energy.`,b);
}
// Carbon dioxide records (NOAA Global Monitoring Laboratory), simplified: a yearly cycle on a rising trend from 2020.
// swing is the peak-to-trough size of the yearly cycle in ppm; peak and low are the fractions of the year when it is
// highest and lowest; offset is the station's difference from Mauna Loa's yearly mean.
const STATIONS={
 'mauna-loa':{name:'Mauna Loa',swing:6.5,peak:.37,low:.74,offset:0,months:['May','late September']},
 utqiagvik:{name:'Utqiaġvik',swing:18,peak:.33,low:.62,offset:1.2,months:['early May','mid-August']},
 'south-pole':{name:'South Pole',swing:1.2,peak:.78,low:.2,offset:-4,months:['October','March']}
};
const CO2_TREND={start:414.2,rise:2.5};
function keeling(key,t){
 // t in years since the start of 2020. A smooth fall from the peak to the low, then a smooth rise to the next peak.
 const s=STATIONS[key],f=((t%1)+1)%1,fallLen=((s.low-s.peak)%1+1)%1,since=((f-s.peak)%1+1)%1;
 const phase=since<fallLen?Math.cos(Math.PI*since/fallLen):-Math.cos(Math.PI*(since-fallLen)/(1-fallLen));
 return CO2_TREND.start+s.offset+CO2_TREND.rise*t+s.swing/2*phase;
}
// DNA differences: two lineages from one ancestor of 1,000 positions; each lineage changes rate% of positions every
// 10 million years, at positions drawn at random, so a position can change twice.
const SITES=1000,BASES='ACGT';
function lineages(split,rate){
 const anc=[],r0=seeded(11);for(let i=0;i<SITES;i++)anc.push(BASES[Math.floor(r0()*4)]);
 const k=Math.round(SITES*rate/100*split/10),evolve=seed=>{const r=seeded(seed),s=anc.slice();for(let i=0;i<k;i++){const p=Math.floor(r()*SITES),others=BASES.replace(s[p],'');s[p]=others[Math.floor(r()*3)];}return s;};
 const a=evolve(23),b=evolve(37);let diff=0;for(let i=0;i<SITES;i++)if(a[i]!==b[i])diff++;
 return{a,b,changes:k,diff,share:diff/SITES,expected:Math.min(1,2*rate/100*split/10)};
}
function alignment(v){
 let b='';const W=9,x0=35;
 for(let row=0;row<2;row++)for(const[j,seq,name]of[[0,v.a,'A'],[1,v.b,'B']]){
  const y=50+row*90+j*26;b+=`<text x="${x0-10}" y="${y}" text-anchor="end" font-size="12" font-weight="700" fill="#52647b">${name}</text>`;
  for(let i=0;i<50;i++){const p=row*50+i,x=x0+i*W,d=v.a[p]!==v.b[p];if(d&&j===0)b+=`<rect x="${x-1}" y="${y-15}" width="${W}" height="44" rx="2" fill="#f3d9a4"/>`;b+=`<text x="${x+3.5}" y="${y}" text-anchor="middle" font-family="monospace" font-size="12" fill="${d?'#8a3b12':'#263c5b'}">${seq[p]}</text>`;}
 }
 let shown=0;for(let p=0;p<100;p++)if(v.a[p]!==v.b[p])shown++;
 return M.graphic('Two DNA sequences from a shared ancestor',`The first 100 of 1,000 positions; highlighted positions differ (${shown} here). Across all 1,000 positions, ${v.diff} differ.`,b+`<text x="260" y="260" text-anchor="middle" font-size="13" fill="#52647b">first 100 of 1,000 positions · differences highlighted</text>`);
}
// Inheritance of pea flower color: P (purple) is dominant over p (white).
function cross(p1,p2,n){
 const pairs=[];for(const a of p1)for(const c of p2)pairs.push([a,c].sort().join(''));
 const share=g=>pairs.filter(x=>x===g).length/4,expected={PP:share('PP'),Pp:share('Pp'),pp:share('pp')};
 // The seed was chosen so that the fixed samples look like typical real ones: small samples wander from the expected
 // shares (Pp × Pp: 2 white of 4, 7 of 20) and large ones settle near them (248 of 1,000).
 const r=seeded(875+p1.charCodeAt(1)*3+p2.charCodeAt(1)),counts={PP:0,Pp:0,pp:0};
 for(let i=0;i<n;i++){const g=[p1[Math.floor(r()*2)],p2[Math.floor(r()*2)]].sort().join('');counts[g]++;}
 return{pairs,expected,counts,white:counts.pp,purple:counts.PP+counts.Pp,whiteShare:expected.pp};
}
function punnett(s,v){
 const x0=60,y0=60,c=70;let b=`<text x="${x0+c}" y="${y0-28}" text-anchor="middle" font-size="13" fill="#52647b">first parent ${s.parent1}</text><text x="${x0-34}" y="${y0+c}" text-anchor="middle" font-size="13" fill="#52647b" transform="rotate(-90 ${x0-34} ${y0+c})">second parent ${s.parent2}</text>`;
 for(let i=0;i<2;i++){b+=`<text x="${x0+c/2+i*c}" y="${y0-8}" text-anchor="middle" font-size="16" font-weight="700" fill="#263c5b">${s.parent1[i]}</text><text x="${x0-12}" y="${y0+c/2+i*c+6}" text-anchor="middle" font-size="16" font-weight="700" fill="#263c5b">${s.parent2[i]}</text>`;}
 for(let i=0;i<2;i++)for(let j=0;j<2;j++){const g=[s.parent1[i],s.parent2[j]].sort().join(''),white=g==='pp';b+=`<rect x="${x0+i*c}" y="${y0+j*c}" width="${c}" height="${c}" fill="${white?'#f4f6f8':'#e6dcf6'}" stroke="#52647b"/><circle cx="${x0+i*c+c/2}" cy="${y0+j*c+24}" r="11" fill="${white?'#ffffff':'#7a4bc2'}" stroke="#52647b"/><text x="${x0+i*c+c/2}" y="${y0+j*c+58}" text-anchor="middle" font-size="15" fill="#263c5b">${g}</text>`;}
 // Expected and counted shares of white flowers.
 const bx=330,bw=150,bar=(y,label,share)=>`<text x="${bx}" y="${y-6}" font-size="13" fill="#263c5b">${esc(label)}</text><rect x="${bx}" y="${y}" width="${bw}" height="18" fill="#e6dcf6" stroke="#52647b"/><rect x="${bx+bw*(1-share)}" y="${y}" width="${bw*share}" height="18" fill="#ffffff" stroke="#52647b"/>`;
 const n=Number(s.offspring),counted=n?v.white/n:0;
 b+=bar(90,'Expected white: '+fmt(100*v.expected.pp)+'%',v.expected.pp)+bar(150,`Counted white: ${v.white} of ${n.toLocaleString('en-US')} (${fmt(100*counted)}%)`,counted);
 b+=`<text x="${bx}" y="200" font-size="12" fill="#52647b">purple shaded, white unshaded</text>`;
 return M.graphic('Punnett square and counted offspring',`${s.parent1} × ${s.parent2}: expected ${fmt(100*(1-v.expected.pp))}% purple and ${fmt(100*v.expected.pp)}% white. Counted ${v.purple} purple and ${v.white} white of ${n}.`,b);
}
// Body temperature with negative feedback, minute by minute for 2 hours. Without control the body settles at the air
// temperature plus 12 °C (heat from cells against heat lost to the air); feedback pushes back toward the 37 °C set point.
const BODY={setPoint:37,loss:0.002,heat:0.024,gain:{none:0,weak:0.01,normal:0.04,strong:0.12},minutes:120};
function body(air,feedback){
 const g=BODY.gain[feedback];let t=BODY.setPoint;const out=[t];
 for(let m=0;m<BODY.minutes;m++){t=t+BODY.loss*(air-t)+BODY.heat+g*(BODY.setPoint-t);out.push(t);}
 return{series:out,final:out[out.length-1],steady:(BODY.loss*air+BODY.heat+g*BODY.setPoint)/(BODY.loss+g)};
}
// A species' band of elevations on a cone-shaped mountain; air cools 6.5 °C per km.
const LAPSE=6.5;
function uphill(warming,peak,low,width){
 const shift=warming/LAPSE,area=(z1,z2)=>{const a=Math.min(z1,peak),c=Math.min(z2,peak);return Math.max(0,(peak-a)**2-(peak-c)**2);};
 const before=area(low,low+width),z1=low+shift,z2=low+width+shift,after=area(z1,z2);
 return{shift,z1,z2,top:Math.min(z2,peak),gone:z1>=peak,above:low>=peak,share:before?after/before:0};
}
function mountainBand(s,v){
 const base=250,kmPx=46,X0=40,X1=480,cx=260,y=z=>base-z*kmPx,half=z=>(X1-X0)/2*(1-z/s.peak),top=y(s.peak);
 const band=(z1,z2,fill,op)=>{const a=Math.min(z1,s.peak),c=Math.min(z2,s.peak);if(a>=c)return'';return`<path d="M${cx-half(a)} ${y(a)}L${cx-half(c)} ${y(c)}L${cx+half(c)} ${y(c)}L${cx+half(a)} ${y(a)}Z" fill="${fill}" opacity="${op}"/>`;};
 let b=`<path d="M${X0} ${base}L${cx} ${top}L${X1} ${base}Z" fill="#e7ebf2" stroke="#5b7a52" stroke-width="2"/>`;
 b+=band(s.low,s.low+s.width,'#9db8d6',.8)+band(v.z1,v.z2,'#087f76',.55);
 b+=`<path d="M${cx-half(s.low)} ${y(s.low)}H${cx+half(s.low)}M${cx-half(Math.min(s.low+s.width,s.peak))} ${y(Math.min(s.low+s.width,s.peak))}H${cx+half(Math.min(s.low+s.width,s.peak))}" stroke="#3e6aa0" stroke-dasharray="5 4"/>`;
 for(const z of[1,2,3,4])if(z<=s.peak)b+=`<path d="M${X0-6} ${y(z)}h6" stroke="#8391a5"/><text x="${X0-10}" y="${y(z)+4}" text-anchor="end" font-size="12" fill="#52647b">${z} km</text>`;
 b+=`<text x="${X1}" y="40" text-anchor="end" font-size="13" fill="#3e6aa0">dashed: band today</text><text x="${X1}" y="58" text-anchor="end" font-size="13" fill="#087f76">green: band after ${fmt(s.warming)} °C</text>`;
 return M.graphic('A species’ band on a mountain',`A ${fmt(s.peak)} km mountain. Today the species lives from ${fmt(s.low)} to ${fmt(s.low+s.width)} km. After ${fmt(s.warming)} °C of warming the band moves up ${fmt(1000*v.shift)} m${v.gone?' and passes the summit':''}; ${fmt(100*v.share)}% of today’s area is left.`,b);
}
function model(index,s){
 if(index===12){const v=foodChain(s.producers,s.efficiency,s.levels);
  return{graph:pyramid(v,s.levels),
   readout:`${v.energy.map((x,k)=>LEVELS[k]+' '+(x>=1?fmt(x):x.toPrecision(2))).join(' → ')} · The top level gets ${100*v.share>=1?fmt(100*v.share):(100*v.share).toPrecision(2)}% of the plants’ energy; the rest leaves the chain, mostly as heat`,
   formula:'Energy at the next level = energy at this level × the share passed on. Over n steps: energy at the top = plants’ energy × share^n.',
   note:'The share passed on varies by ecosystem and animal, from under 5% to about 20%; 10% is a rule of thumb. Real food webs branch, and many animals eat at more than one level.'};}
 if(index===13){const st=STATIONS[s.station],last=2026,first=last-s.years,trend=t=>CO2_TREND.start+st.offset+CO2_TREND.rise*t,vals=[];for(let i=0;i<=240;i++)vals.push(keeling(s.station,first-2020+s.years*i/240));
  const lo=Math.floor((Math.min(...vals)-2)/5)*5,hi=Math.ceil((Math.max(...vals)+2)/5)*5;
  return{graph:M.cartesian(`Carbon dioxide at ${st.name}`,[{label:'Monthly level',fn:x=>keeling(s.station,x-2020)},{label:'Long-term trend',fn:x=>trend(x-2020)}],{xmin:first,xmax:last,ymin:lo,ymax:hi,xlabel:'Year',ylabel:'Carbon dioxide (ppm)',left:80,ylabelX:22,xticks:Array.from({length:s.years+1},(_,i)=>first+i).filter((x,i,a)=>a.length<=6||(last-x)%2===0),yticks:Array.from({length:Math.floor((hi-lo)/5)+1},(_,i)=>lo+5*i).filter((x,i,a)=>a.length<=7||i%2===0)}),
   readout:`${st.name}: yearly swing about ${fmt(st.swing)} ppm, highest around ${st.months[0]} and lowest around ${st.months[1]} · Long-term rise about ${fmt(CO2_TREND.rise)} ppm a year: ${fmt(trend(first-2020))} ppm at the start of ${first} to ${fmt(trend(last-2020))} ppm at the start of ${last}`,
   formula:'Level = long-term trend + yearly cycle. The trend rises about 2.5 ppm a year; the yearly cycle rises and falls by the station’s swing. ppm means parts per million: molecules of carbon dioxide in every million molecules of air.',
   note:'A simplified record built from typical values for each station (NOAA Global Monitoring Laboratory), not the measured data. The real swing and growth rate vary from year to year.'};}
 if(index===14){const v=lineages(s.split,s.rate);
  return{graph:alignment(v),
   readout:`${fmt(s.split)} million years since the shared ancestor · Each lineage changed about ${v.changes} of 1,000 positions · ${v.diff} positions differ (${fmt(100*v.share)}%); 2 × rate × time predicts ${fmt(100*v.expected)}%`,
   formula:'Expected share that differs ≈ 2 × (share changed per lineage per 10 million years) × (time ÷ 10 million years), while the share is small.',
   note:'Changes are placed at random, so a position can change twice and a difference can disappear. Real genes change at different rates, and real clocks are checked against dated fossils.'};}
 if(index===15){const n=Number(s.offspring),v=cross(s.parent1,s.parent2,n);
  return{graph:punnett(s,v),
   readout:`${s.parent1} × ${s.parent2}: expected PP ${fmt(100*v.expected.PP)}%, Pp ${fmt(100*v.expected.Pp)}%, pp ${fmt(100*v.expected.pp)}%, so ${fmt(100*(1-v.expected.pp))}% purple · Counted ${n.toLocaleString('en-US')} offspring: ${v.purple.toLocaleString('en-US')} purple, ${v.white.toLocaleString('en-US')} white (${fmt(100*v.white/n)}% white)`,
   formula:'Each parent passes on one allele, each with a chance of 1/2. The chance of a combination is the product: for Pp × Pp, pp has a chance of 1/2 × 1/2 = 1/4.',
   note:'The counts are a random sample drawn by the computer, the same sample each time for the same parents. Real crosses also depend on how many seeds grow.'};}
 if(index===16){const v=body(s.air,s.feedback),state=v.final>=40?' · heat stroke danger':v.final<35?' · hypothermia':'';
  return{graph:M.cartesian(`Core temperature in ${s.air} °C air`,[{label:`Feedback: ${s.feedback}`,fn:x=>curve(v.series)(x)},{label:'Set point, 37 °C',fn:()=>BODY.setPoint}],{xmin:0,xmax:120,ymin:10,ymax:60,xlabel:'Minutes',ylabel:'Core temperature (°C)',left:80,ylabelX:22,xticks:[0,30,60,90,120],yticks:[10,20,30,37,50,60]}),
   readout:`Air ${s.air} °C, feedback ${s.feedback}: core temperature after 2 hours ${fmt(v.final)} °C, ${fmt(Math.abs(v.final-BODY.setPoint))} °C ${v.final>=BODY.setPoint?'above':'below'} the set point${state}`,
   formula:'Each minute: change = 0.002 × (air − core) + 0.024 + feedback × (37 − core). Feedback strength: none 0, weak 0.01, normal 0.04, strong 0.12.',
   note:'A made-up model of a person at rest without clothes or shelter, roughly at the speed of a real body. Real feedback is not a straight line: sweating needs water and shivering needs food, and both have limits. A core above about 42 °C is fatal.'};}
 if(index===17){const v=uphill(s.warming,s.peak,s.low,s.width);
  return{graph:mountainBand(s,v),
   readout:v.above?`The band today starts at or above the ${fmt(s.peak)} km summit: lower the band or raise the mountain.`:`Band today ${fmt(s.low)}–${fmt(Math.min(s.low+s.width,s.peak))} km · After ${fmt(s.warming)} °C: ${v.gone?'above the summit, so no suitable area is left':`${fmt(v.z1)}–${fmt(v.top)} km`}, moved up ${fmt(1000*v.shift)} m · Area left ${fmt(100*v.share)}% of today’s`,
   formula:'Move uphill = warming ÷ 6.5 °C per km. On a cone, the area above height z is proportional to (summit − z)², so a band’s area is (summit − bottom)² − (summit − top)².',
   note:'A cone-shaped mountain with a steady cooling rate. Real slopes differ in shape, sun, soil and moisture, and species respond to more than average temperature.'};}
 if(index===8){const v=crash(s.mass,s.speed,s.road),road=s.road==='dry'?'dry':'wet',kmh=x=>x/3.6;
  const graph=s.view==='energy'?M.cartesian('Kinetic energy against speed',[{label:`${s.mass.toLocaleString('en-US')} kg`,fn:x=>s.mass*kmh(x)**2/2000},{label:'1,000 kg, for comparison',fn:x=>1000*kmh(x)**2/2000}],{xmin:0,xmax:130,ymin:0,ymax:2000,xlabel:'Speed (km/h)',ylabel:'Kinetic energy (kJ)',point:[s.speed,v.energy/1000],left:80,ylabelX:22,xticks:[0,20,40,60,80,100,120],yticks:[0,500,1000,1500,2000]})
   :M.cartesian(`Stopping distance on a ${road} road`,[{label:'Braking distance',fn:x=>kmh(x)**2/(2*v.rate)},{label:'Reaction distance (1.5 s)',fn:x=>kmh(x)*STOP.reaction}],{xmin:0,xmax:130,ymin:0,ymax:170,xlabel:'Speed (km/h)',ylabel:'Distance (m)',point:[s.speed,v.braking],left:80,ylabelX:22,xticks:[0,20,40,60,80,100,120],yticks:[0,50,100,150]});
  return{graph,
   readout:`${s.mass.toLocaleString('en-US')} kg at ${s.speed} km/h (${fmt(v.v)} m/s): kinetic energy ${fmt(v.energy/1000)} kJ · Reaction distance ${fmt(v.reaction)} m · Braking distance ${fmt(v.braking)} m · Braking force ${fmt(v.force/1000)} kN`,
   formula:'Kinetic energy = ½ × mass × speed². Speed in m/s = km/h ÷ 3.6. Reaction distance = speed × 1.5 s. Braking distance = speed² ÷ (2 × braking rate). Braking force = mass × braking rate (force = mass × acceleration, a high school idea).',
   note:`An ideal stop on a level road, slowing by ${v.rate} m/s every second (${v.rate} m/s²), a typical rate on a ${road} road. Real braking depends on tires, brakes and the road surface, heavy trucks need farther to stop, and reaction times vary from driver to driver.`};}
 if(index===9){const v=moon(s.day);
  return{graph:moonView(s,v),
   readout:`Day ${fmt(s.day)} after new moon: ${v.name} · ${Math.round(100*v.lit)}% of the face we see is lit · Rises at about ${clock(v.rise)}`,
   formula:'The lit part grows from 0 at new moon to 100% at full moon (day 14.8) and back, following lit fraction = (1 − cos(360° × day ÷ 29.53)) ÷ 2. Rising time ≈ 6 a.m. + 24 hours × day ÷ 29.53.',
   note:'Not to scale: the Moon is about 30 Earth-widths from Earth, and the Sun about 400 times farther away than the Moon. Rising times are averages; real times shift with the season and the place.'};}
 if(index===10){const v=selection(s.ground,s.advantage,s.start),at=g=>Math.round(100*v.series[g]);
  return{graph:M.cartesian(`Dark mice on ${s.ground==='lava'?'dark lava':'pale rock'}`,[{label:'Share of dark mice',prefix:'Line: ',fn:x=>100*curve(v.series)(x)}],{xmin:0,xmax:200,ymin:0,ymax:100,xlabel:'Generation',ylabel:'Dark mice (%)',point:[100,100*v.series[100]],left:80,ylabelX:22,xticks:[0,50,100,150,200],yticks:[0,25,50,75,100]}),
   readout:`Dark mice: ${s.start}% at the start · ${at(50)}% after 50 generations · ${at(100)}% after 100 · ${at(200)}% after 200 · ${s.ground==='sand'?(s.start>0&&s.advantage>0?'dark fur becomes rarer each generation':'no change'):v.half===null?'never more than half within 200 generations':`more than half from generation ${v.half}`}`,
   formula:'Each generation the better-matched color leaves (1 + advantage) times as many young. On lava: dark share next = dark × (1 + advantage) ÷ (dark × (1 + advantage) + light). On pale rock the light mice have the advantage.',
   note:'A simplified model: it treats fur color as one inherited trait with a fixed advantage, and leaves out dominance, mice moving between populations, and chance. The advantages are illustrations, not measurements.'};}
 if(index===11){const v=wave(s.medium,s.frequency,s.amplitude),signal=t=>s.amplitude*Math.sin(2*Math.PI*s.frequency*t/1000),shown=s.samples==='on';
  const series=[{label:`${s.frequency} Hz, amplitude ${s.amplitude}`,prefix:shown?undefined:'Line: ',fn:signal}];if(shown)series.push({label:'the digital version, one number every 2 ms',fn:t=>signal(2*Math.floor(t/2+1e-9))});
  const numbers=shown?' · First samples: '+[0,2,4,6,8,10].map(t=>{const x=signal(t);return(Math.abs(x)<.005?0:x).toFixed(2).replace('-','−');}).join(', '):'';
  return{graph:M.cartesian('Pressure at one place over 0.1 s',series,{xmin:0,xmax:100,ymin:-4.5,ymax:4.5,xlabel:'Time (ms)',ylabel:'Pressure change',left:80,ylabelX:22,xticks:[0,25,50,75,100],yticks:[-4,-2,0,2,4]}),
   readout:`${v.name}, ${s.frequency} Hz: wavelength ${fmt(v.wavelength)} m · One wave every ${fmt(1000*v.period)} ms, ${fmt(v.inWindow)} wave${v.inWindow===1?'':'s'} in 0.1 s · Amplitude ${s.amplitude}: energy ${v.energy} times that of amplitude 1${numbers}`,
   formula:'Wavelength = speed ÷ frequency. Time for one wave = 1 ÷ frequency. Energy grows with amplitude²: twice the amplitude, four times the energy.',
   note:'Speeds are typical values: sound speed changes with temperature, and in seawater also with depth and saltiness. The graph shows the wave passing one place over time; ms means thousandths of a second. The samples are drawn far apart so they can be seen; a real hydrophone takes about 256,000 a second.'};}
 if(index===4){const v=particles(s.substance,s.temperature),state=v.state==='melting'?'at its melting point, solid and liquid together':v.state==='boiling'?'at its boiling point, liquid and gas together':'a '+v.state;
  const counts=Object.entries(v.atoms).map(([e,n])=>n+' '+ELEMENT[e]).join(', ');
  const side=`${molecule(s.substance,390,110)}<text x="390" y="200" text-anchor="middle" font-size="16" font-weight="700" fill="#263c5b">${esc(v.formula)}</text><text x="390" y="222" text-anchor="middle" font-size="13" fill="#52647b">${esc(counts)}: ${v.atomCount} atom${v.atomCount>1?'s':''}</text><text x="390" y="242" text-anchor="middle" font-size="13" fill="#52647b">mass ${Math.round(v.mass)} u · typical speed ${fmt(v.speed)} m/s</text>`;
  return{graph:M.graphic('Particles of '+v.name.toLowerCase(),`${v.name} at ${fmt(s.temperature)} °C is ${state}. Each circle in the box stands for one molecule; the line from it shows its motion. The drawing on the right shows one molecule: ${counts}.`,particleBox(s.substance,v)+side),
   readout:`${v.name} (${v.formula}) at ${fmt(s.temperature)} °C, ${fmt(v.kelvin)} K: ${state} at sea-level pressure · Typical speed of a molecule about ${fmt(v.speed)} m/s`,
   formula:'Typical speed ≈ 158 × √(T ÷ m) m/s, with T the temperature in kelvins (°C + 273) and m the molecule’s mass in atomic mass units (hydrogen 1, carbon 12, oxygen 16).',
   note:'The box shows how particles are arranged, not their real size or spacing; every arrow uses the same scale. Speeds are typical values: at any moment some molecules move much faster and some much slower. Molecules are drawn flat, but most, such as methane, are three-dimensional. States are for sea-level pressure.'};}
 if(index===5){const v=reaction(s.reaction,s.times),list=side=>side.parts.map(p=>p.count+' '+p.formula).join(' + ');
  const rows=[['C','Carbon'],['H','Hydrogen'],['O','Oxygen']].map(([e,name])=>[name,String(v.before.atoms[e]),String(v.after.atoms[e])]);
  return{graph:M.graphic(v.name+': mass before and after',`Before: ${list(v.before)}, ${fmt(v.before.mass)} u. After: ${list(v.after)}, ${fmt(v.after.mass)} u.`,massBars(v))+M.table('Atoms before and after',['Element','Before','After'],rows,''),
   readout:`Before: ${list(v.before)} = ${fmt(v.before.mass)} u · After: ${list(v.after)} = ${fmt(v.after.mass)} u${v.fromAir?` · Of each sugar molecule’s ${v.fromAir.sugar} u, ${v.fromAir.fromCO2} u (${Math.round(100*v.fromAir.fromCO2/v.fromAir.sugar)}%) came from carbon dioxide`:''}`,
   formula:{photosynthesis:'6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂',respiration:'C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O',methane:'CH₄ + 2 O₂ → CO₂ + 2 H₂O'}[s.reaction]+'. Atom masses, rounded: hydrogen 1, carbon 12, oxygen 16 atomic mass units (u).',
   note:{photosynthesis:'One reaction, repeated. Experiments show that the oxygen gas comes from the water and the sugar’s oxygen from carbon dioxide; an equation alone cannot show that. Real plants turn sugar into wood, proteins and other substances, and use some of it for their own energy. Atomic masses go beyond grade 7: the atom counts are the core evidence.',respiration:'The overall change only: cells release the energy in many small steps. Atomic masses go beyond grade 7: the atom counts are the core evidence.',methane:'Complete burning only. A flame short of oxygen also makes carbon monoxide and soot. Atomic masses go beyond grade 7: the atom counts are the core evidence.'}[s.reaction]};}
 if(index===6){const v=seafloor(s.rate,s.distance);
  return{graph:stripes(s,v),
   readout:`Spreading ${fmt(s.rate)} cm per year on each side = ${fmt(v.kmPerMyr)} km per million years · Sample ${s.distance} km from the ridge: about ${fmt(v.age)} million years old${v.known?`, magnetized ${v.normal?'like today’s field':'opposite to today’s field'}`:''}`,
   formula:'Age = distance ÷ speed. 1 cm per year = 10 km per million years. The dark stripe around the ridge reaches rock 780,000 years old.',
   note:'Real ridges change speed over time, and their stripes are blurred and offset by faults. Stripe ages are rounded from the geomagnetic polarity time scale for the last 5.2 million years.'};}
 if(index===7){const v=foxes(s.eagles,s.plan),whole=n=>Math.round(n).toLocaleString('en-US'),count=n=>whole(n)+(whole(n)==='1'?' fox':' foxes');
  const series=s.plan==='none'?[{label:'No plan',prefix:'Line: ',fn:curve(v.series)}]:[{label:PLAN_NAMES[s.plan],fn:curve(v.series)},{label:'No plan',fn:curve(v.none)}];
  const recovery=v.lowest>=1000?'Never below 1,000 foxes':v.back?`Back to 1,000 foxes in year ${v.back}`:'Not back to 1,000 foxes within 40 years';
  return{graph:M.cartesian('Island foxes over 40 years',series,{xmin:0,xmax:40,ymin:0,ymax:1600,xlabel:'Year',ylabel:'Foxes',point:[10,v.series[10]],left:80,ylabelX:22,xticks:[0,5,10,20,30,40],yticks:[0,500,1000,1500]}),
   readout:`Year 10: ${count(v.series[10])} · Year 40: ${count(v.series[40])} · Lowest: ${count(v.lowest)} · ${recovery}`,
   formula:'Each year: foxes next year = foxes + 0.3 × foxes × (1 − foxes ÷ 1,500) − foxes taken by eagles + foxes released. Eagles arrive in year 5; a plan starts in year 10.',
   note:'A made-up model, not island fox data. It leaves out chance events such as disease or a bad year, which can wipe out a very small population; guarding against them is one reason the real program also raised foxes in captivity.'};}
 if(index===0){const v=cell(s.side,s.shape);
  return{graph:M.cartesian('Surface area for each unit of volume',[{label:'Cube: 6 ÷ side',fn:x=>6/x},{label:'Flat slab: 12 ÷ side',fn:x=>12/x}],{xmin:2,xmax:20,ymin:0,ymax:6.5,xlabel:'Side length (µm)',ylabel:'Surface area ÷ volume (per µm)',point:[s.side,v.ratio],left:80,ylabelX:22,xticks:[2,5,10,15,20],yticks:[0,1,2,3,4,5,6]}),
   readout:`Side ${s.side} µm · Surface area ${fmt(v.area)} µm² · Volume ${fmt(v.volume)} µm³ · Ratio ${fmt(v.ratio)} per µm`,
   formula:s.shape==='flat'?'Slab s × s × s/4: surface area = 3s², volume = s³/4, ratio = 12/s.':'Cube with side s: surface area = 6s², volume = s³, ratio = 6/s.',
   note:'Real cells are not cubes or slabs. The model keeps only how surface and volume change with size and shape.'};}
 if(index===1){const v=heating(s.mass,s.energy);
  const state=v.stage==='melting'?`melting: ${fmt(100*v.fraction)}% of the ice has melted`:v.stage==='boiling'?`boiling: ${fmt(100*v.fraction)}% of the water has boiled away`:v.stage==='all steam'?'all the water has boiled away; the model stops here':v.stage;
  return{graph:M.cartesian('Temperature as energy is added',[{label:'Ice, then water, then steam at 1 atmosphere',prefix:'Line: ',fn:v.curve}],{xmin:0,xmax:800,ymin:-30,ymax:115,xlabel:'Energy added (kJ)',ylabel:'Temperature (°C)',point:[Math.min(s.energy,v.total),v.temperature],left:80,ylabelX:22,yticks:[-20,0,20,40,60,80,100]})
    +M.table('Energy for each stage',['Stage','Energy (kJ)'],[['Warm the ice from −20 °C to 0 °C',fmt(v.stages[0])],['Melt the ice',fmt(v.stages[1])],['Warm the water from 0 °C to 100 °C',fmt(v.stages[2])],['Boil the water away',fmt(v.stages[3])]],''),
   readout:`Mass ${s.mass} g · Energy added ${s.energy} kJ · Temperature ${fmt(v.temperature)} °C · ${state}`,
   formula:'Warming: energy = mass × c × temperature change, with c = 2.09 J/(g·°C) for ice and 4.18 J/(g·°C) for water. Melting takes 334 J/g; boiling takes 2,256 J/g.',
   note:'An ideal, stirred sample at 1 atmosphere that loses no energy to its surroundings.'};}
 if(index===2){const v=rainShadow(s.temperature,s.dewPoint,s.height);
  return{graph:mountain(s,v),
   readout:`Cloud base ${v.cloud?fmt(v.base)+' km':'above the crest: no cloud'} · Crest ${fmt(v.crest)} °C · Far side ${fmt(v.far)} °C, dew point ${fmt(v.farDew)} °C`,
   formula:'Without cloud, rising air cools 10 °C per km and sinking air warms 10 °C per km. Cloud base ≈ 125 m × (temperature − dew point). Inside cloud, air cools about 5 °C per km.',
   note:s.dewPoint>s.temperature?'The dew point cannot be above the air temperature; the model treats the air as already saturated.':'A simplified model that overstates the far-side warming. It assumes all the condensed water falls out and that the far side is at sea level; real air keeps some cloud, and the floor of Owens Valley is over 1 km high. The cooling rate inside cloud also depends on temperature.'};}
 const v=warming(s.co2);
 return{graph:M.cartesian('Eventual warming from carbon dioxide alone',[{label:'About 3 °C for each doubling',prefix:'Line: ',fn:c=>CO2.warming*Math.log2(c/CO2.base)}],{xmin:278,xmax:1112,ymin:0,ymax:6.5,xlabel:'Carbon dioxide (parts per million)',ylabel:'Eventual warming (°C)',point:[s.co2,v.warming],left:80,ylabelX:22,xticks:[278,556,834,1112],yticks:[0,1,2,3,4,5,6]}),
  readout:`Carbon dioxide ${s.co2} ppm, ${fmt(v.times)} times the level before industry · Extra energy kept at first ${fmt(v.forcing)} W/m² · Eventual warming about ${fmt(v.warming)} °C`,
  formula:'About 3 °C of eventual warming and about 3.9 W/m² of extra energy kept at first for each doubling: 278 → 556 → 1,112 ppm. Between doublings, count the fraction of a doubling: warming ≈ 3 °C × log₂(CO₂ ÷ 278 ppm).',
  note:'Carbon dioxide alone, after the ocean has caught up, which takes centuries. The warming measured so far, about 1.2 °C averaged over 2015–2024 compared with 1850–1900, also reflects other greenhouse gases, particles that cool, and the ocean’s delay.'};
}
const api={model,cell,heating,rainShadow,warming,particles,reaction,seafloor,foxes,crash,moon,selection,wave,foodChain,keeling,lineages,cross,body,uphill,STATIONS,CO2_TREND,BODY,LAPSE,SITES,STOP,MONTH,MEDIA,WATER,AIR,CO2,SUBSTANCES,REACTIONS,NORMAL,FOX,AMU};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceScienceModels=api;
})(typeof window==='undefined'?globalThis:window);
