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
function model(index,s){
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
const api={model,cell,heating,rainShadow,warming,WATER,AIR,CO2};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceScienceModels=api;
})(typeof window==='undefined'?globalThis:window);
