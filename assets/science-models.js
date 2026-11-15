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
function model(index,s){
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
const api={model,cell,heating,rainShadow,warming,particles,reaction,seafloor,foxes,WATER,AIR,CO2,SUBSTANCES,REACTIONS,NORMAL,FOX,AMU};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceScienceModels=api;
})(typeof window==='undefined'?globalThis:window);
