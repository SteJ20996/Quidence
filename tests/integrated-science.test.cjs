'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const harness=require('./course-dom.cjs');
const C=require('../courses/integrated-science/content.js'),S=require('../assets/science-content.js');
const Models=require('../assets/science-models.js'),Graphs=require('../assets/course-graphs.js'),Policy=require('../assets/sync-policy.js');
const close=(a,b,tol=1e-9)=>assert(Math.abs(a-b)<=tol,a+' != '+b);

test('the course follows the plan: one lesson per segment of grades 6–8 and Living Earth, each with four steps and three questions',()=>{
 assert.equal(C.MODULE,'integrated-science');assert.equal(C.LESSONS.length,18);
 assert.deepEqual(C.UNITS.map(u=>u.id),['grade-6','grade-7','grade-8','living-earth']);
 assert.deepEqual(C.LESSONS.map(l=>l.short),['Cells as systems','Heating ice','Rain shadows','Global warming','Particles in motion','Atoms in living things','Moving plates','Recovering a population','Speed and crashes','Moon phases','Natural selection','Listening with waves','Energy in food chains','The breathing planet','Common ancestry','Inheritance','Homeostasis','Moving uphill']);
 // Each PE comes from the matching instructional-segment box in chapter 5 of the 2016 California Science Framework.
 const segments={'6-1':['MS-LS1-1','MS-LS1-2','MS-LS1-3','MS-LS1-8','MS-ESS2-4','MS-ESS2-6'],'6-2':['MS-ESS2-4','MS-ESS2-6','MS-PS3-3','MS-PS3-4','MS-PS3-5'],'6-3':['MS-LS1-4','MS-LS1-5','MS-LS1-8','MS-LS3-2','MS-ESS2-5','MS-ESS2-6'],'6-4':['MS-LS1-4','MS-LS1-5','MS-ESS3-3','MS-ESS3-5'],
  '7-1':['MS-PS1-1','MS-PS1-3','MS-PS1-4','MS-ESS3-1','MS-LS2-3'],'7-2':['MS-LS1-6','MS-LS1-7','MS-ESS2-1','MS-PS1-2','MS-PS1-5','MS-PS1-6'],'7-3':['MS-LS2-1','MS-LS2-2','MS-LS2-3','MS-ESS2-3','MS-ESS3-1','MS-PS1-2','MS-PS1-3','MS-PS1-5'],'7-4':['MS-LS2-4','MS-LS2-5','MS-ESS2-2','MS-ESS3-2','MS-PS1-3'],
  '8-1':['MS-PS2-1','MS-PS2-2','MS-PS3-1','MS-LS4-1'],'8-2':['MS-ESS1-1','MS-ESS1-2','MS-ESS1-3','MS-PS2-3','MS-PS2-4','MS-PS2-5','MS-PS3-2'],'8-3':['MS-LS3-1','MS-LS4-1','MS-LS4-2','MS-LS4-3','MS-LS4-4','MS-LS4-5','MS-LS4-6','MS-ESS1-4'],'8-4':['MS-PS4-1','MS-PS4-2','MS-PS4-3','MS-ESS1-1','MS-ESS3-3','MS-ESS3-4','MS-LS4-4','MS-LS4-6'],
  // Living Earth segment boxes in framework chapter 7.
  'LE-1':['HS-LS2-1','HS-LS2-2','HS-LS2-4','HS-LS2-8'],'LE-2':['HS-ESS1-6','HS-ESS2-6','HS-ESS2-7','HS-ESS3-6','HS-LS1-5','HS-LS1-6','HS-LS1-7','HS-LS2-3','HS-LS2-5'],'LE-3':['HS-ESS1-5','HS-ESS2-5','HS-ESS3-1','HS-ESS3-4','HS-LS4-1','HS-LS4-2','HS-LS4-4','HS-LS4-5'],'LE-4':['HS-LS3-1','HS-LS3-2','HS-LS3-3','HS-LS4-2','HS-LS4-3'],'LE-5':['HS-LS1-1','HS-LS1-2','HS-LS1-3','HS-LS1-4'],'LE-6':['HS-ESS3-5','HS-ESS3-6','HS-LS2-6','HS-LS2-7','HS-LS4-5','HS-LS4-6']};
 for(const[i,l]of C.LESSONS.entries()){
  const living=i>=12,grade=living?9:6+Math.floor(i/4),segment=living?i-11:i%4+1;
  assert.equal(l.id,'integrated-science-lesson-'+(i+1));assert.equal(l.unit,living?'living-earth':'grade-'+grade);
  assert.equal(l.segment,living?'Living Earth, instructional segment '+segment:'Grade '+grade+', instructional segment '+segment);
  assert(l.pe.length>0);for(const pe of l.pe)assert(segments[(living?'LE':grade)+'-'+segment].includes(pe),l.short+': '+pe);
  assert.equal(l.steps.length,4);
  for(const s of l.steps){assert(s.title&&s.text);for(const k of['predict','test','explain'])assert(s.activity[k],k);}
  const tasks=[l.predict,...l.checks];assert.equal(tasks.length,3);
  for(const[j,t]of tasks.entries()){
   assert.equal(t.id,'integrated-science-l'+(i+1)+'-q'+(j+1));assert.equal(t.options.length,3);assert.deepEqual(t.correct,['0']);
   assert.equal(new Set(t.options.map(o=>o.label)).size,3);assert(t.explanation);
   // The correct answer is not always in the same place.
   assert.equal(t.options.findIndex(o=>o.id==='0'),(3-(i+j)%3)%3);
  }
  for(const c of l.controls){const v=l.defaults[c.name];assert(v!==undefined,c.name);if(c.options)assert(c.options.some(([x])=>x===v));else{assert(v>=c.min&&v<=c.max);close(((v-c.min)/c.step)%1,0);}}
  assert(l.next);
 }
 assert.match(C.scope,/Selected foundations/);assert.match(C.scope,/Not a complete year of science/);
 assert.equal(C.bridge,undefined);
 assert.equal(S.create().LESSONS.length,18,'create() returns a fresh copy');
 assert.equal(C.VERSION,'integrated-science-4');assert.deepEqual(C.PREVIOUS,[{version:'integrated-science-1',lessons:4},{version:'integrated-science-2',lessons:8},{version:'integrated-science-3',lessons:12}]);
});

test('the cell model: surface area for each unit of volume is 6/s for a cube and 12/s for a slab a quarter as thick',()=>{
 for(const s of[2,5,10,13,20]){
  const cube=Models.cell(s,'cube'),slab=Models.cell(s,'flat');
  close(cube.area,6*s*s);close(cube.volume,s*s*s);close(cube.ratio,6/s);
  // Slab s × s × s/4: two faces of s², four edges of s × s/4.
  close(slab.area,2*s*s+4*s*(s/4));close(slab.volume,s*s*(s/4));close(slab.ratio,12/s);
 }
 // The answer keys of lesson 1: 10 µm gives 0.6 per µm; doubling the side halves it, while volume grows 8 times and area 4 times.
 close(Models.cell(10,'cube').ratio,0.6);close(Models.cell(20,'cube').ratio,0.3);
 close(Models.cell(10,'cube').volume/Models.cell(5,'cube').volume,8);close(Models.cell(20,'cube').area/Models.cell(10,'cube').area,4);
 // Step 4 compares cells of about the same volume: a 6 µm cube (216 µm³, ratio 1) and a 10 µm slab (250 µm³, ratio 1.2).
 close(Models.cell(6,'cube').volume,216);close(Models.cell(6,'cube').ratio,1);close(Models.cell(10,'flat').volume,250);close(Models.cell(10,'flat').ratio,1.2);
});

test('the heating model reproduces each stage from specific and latent heats',()=>{
 const c={ice:2.09,water:4.18,melt:334,boil:2256};
 for(const m of[100,200,350,500]){
  const v=Models.heating(m,0),stages=[m*c.ice*20,m*c.melt,m*c.water*100,m*c.boil].map(x=>x/1000);
  for(let i=0;i<4;i++)close(v.stages[i],stages[i],1e-9);close(v.total,stages.reduce((a,b)=>a+b),1e-9);
  close(v.temperature,-20);assert.equal(v.stage,'ice warming');
  const b=[0,stages[0],stages[0]+stages[1],stages[0]+stages[1]+stages[2],v.total];
  // Halfway through each stage.
  close(Models.heating(m,(b[0]+b[1])/2).temperature,-10,1e-9);
  const melt=Models.heating(m,(b[1]+b[2])/2);close(melt.temperature,0);assert.equal(melt.stage,'melting');close(melt.fraction,0.5,1e-9);
  close(Models.heating(m,(b[2]+b[3])/2).temperature,50,1e-9);
  const boil=Models.heating(m,(b[3]+b[4])/2);close(boil.temperature,100);assert.equal(boil.stage,'boiling');close(boil.fraction,0.5,1e-9);
  if(v.total<800)assert.equal(Models.heating(m,800).stage,'all steam');
  assert.equal(v.curve(v.total+1),null);close(v.curve((b[2]+b[3])/2),50,1e-9);
 }
 // Step 1: at 500 g, every reading from 0 to 20 kJ in 5 kJ steps is still ice warming up.
 for(let e=0;e<=20;e+=5){const v=Models.heating(500,e);assert.equal(v.stage,'ice warming');close(v.temperature,-20+e*1000/(500*c.ice),1e-9);}
 // 200 g: about 8.4 kJ to warm the ice, 66.8 kJ to melt it, 83.6 kJ to warm the water and 451.2 kJ to boil it.
 assert.deepEqual(Models.heating(200,0).stages.map(x=>Math.round(x*10)/10),[8.4,66.8,83.6,451.2]);
 // Lesson 2, question 2: 400 g × 4.18 × 10 ≈ 16.7 kJ, twice the 8.4 kJ for 200 g.
 close(400*c.water*10/1000,16.72,1e-9);close(200*c.water*10/1000,8.36,1e-9);
 // Step 4: boiling takes nearly seven times the energy of melting.
 assert(c.boil/c.melt>6.5&&c.boil/c.melt<7);
});

test('the rain-shadow model follows the dry rate, the cloud base rule and the cloud rate',()=>{
 // A worked case: 20 °C with dew point 12 °C gives a cloud base at 8 × 125 m = 1 km. Over 3 km: crest 20 − 10 − 2 × 5 = 0 °C;
 // down the far side 0 + 30 = 30 °C; the dew point starts at 0 °C (saturated at the crest) and rises 2 °C per km to 6 °C.
 let v=Models.rainShadow(20,12,3);close(v.base,1);assert.equal(v.cloud,true);close(v.crest,0);close(v.far,30);close(v.farDew,6);
 // Without cloud the air returns unchanged.
 v=Models.rainShadow(20,0,1);close(v.base,2.5);assert.equal(v.cloud,false);close(v.crest,10);close(v.far,20);close(v.farDew,0);
 // Question 2: 20 °C rising 1.5 km without cloud.
 close(Models.rainShadow(20,0,1.5).crest,5);
 // The far side is never cooler than the coast, and is warmer exactly when a cloud forms.
 for(let T=10;T<=30;T++)for(let D=0;D<=20;D++)for(let H=0.5;H<=4;H+=0.5){
  const r=Models.rainShadow(T,D,H),base=Math.max(0,T-D)/8;close(r.base,base);
  assert.equal(r.cloud,H>base);
  if(r.cloud){close(r.crest,T-10*base-5*(H-base));close(r.far-T,5*(H-base));assert(r.far>T);assert(r.farDew<=r.far);}
  else{close(r.crest,T-10*H);close(r.far,T);}
 }
 // Lesson 3, step 3: at 20 °C and 12 °C, ranges of 1, 2 and 3 km give 20, 25 and 30 °C on the far side.
 assert.deepEqual([1,2,3].map(H=>Models.rainShadow(20,12,H).far),[20,25,30]);
 // Step 2: dew point 16 °C or 8 °C at 20 °C gives a cloud base at 0.5 km or 1.5 km.
 assert.deepEqual([16,8].map(D=>Models.rainShadow(20,D,3).base),[0.5,1.5]);
});

test('the carbon dioxide model gives about 3 °C and 3.9 W/m² for each doubling from 278 ppm',()=>{
 for(const[c,d]of[[278,0],[556,1],[1112,2]]){const v=Models.warming(c);close(v.doublings,d);close(v.warming,3*d);close(v.forcing,3.93*d);}
 // 426 ppm, the 2025 global mean (NOAA): about 1.8 °C eventually and 2.4 W/m² at first.
 const now=Models.warming(426);close(now.warming,3*Math.log(426/278)/Math.log(2),1e-12);assert(now.warming>1.8&&now.warming<1.9);assert(now.forcing>2.4&&now.forcing<2.5);
 // Question 2: the second doubling adds the same as the first.
 close(Models.warming(1112).warming-Models.warming(556).warming,Models.warming(556).warming-Models.warming(278).warming);
});

test('every lab renders at the defaults and at every control extreme without NaN',()=>{
 for(const[i,l]of C.LESSONS.entries()){
  const settings=[l.defaults];
  for(const c of l.controls){if(c.options)for(const[v]of c.options)settings.push({...l.defaults,[c.name]:v});else for(const v of[c.min,c.max])settings.push({...l.defaults,[c.name]:v});}
  if(i===2)settings.push({temperature:10,dewPoint:20,height:4});
  for(const s of settings){
   const out=Graphs.lab('integrated-science',i,s);
   assert.doesNotMatch(out.graph,/NaN|Infinity|undefined/);assert.match(out.graph,/figcaption/);
   assert(out.readout&&out.formula&&out.note);assert.doesNotMatch(out.readout,/NaN|undefined/);
  }
 }
 assert.match(Graphs.lab('integrated-science',2,{temperature:10,dewPoint:20,height:4}).note,/cannot be above the air temperature/);
 assert.match(Graphs.lab('integrated-science',1,{mass:200,energy:700}).readout,/all the water has boiled away/);
 assert.match(Graphs.lab('integrated-science',3,{co2:426}).note,/1\.2 °C averaged over 2015–2024/);
 assert.match(Graphs.lab('integrated-science',2,{temperature:20,dewPoint:12,height:3}).note,/overstates the far-side warming/);
});

test('the complete course flow saves answers and reasoning, reloads, groups lessons by unit and exports',async()=>{
 const map=new Map([['physics_beta01_session_v1','another subject remains untouched']]);
 let h=harness('integrated-science',map);
 assert.equal(map.has(h.E.SCHEMA),false);
 assert.match(h.app.innerHTML,/Selected foundations/);assert.doesNotMatch(h.app.innerHTML,/course-bridge/);assert.match(h.app.innerHTML,/Eighteen starting points\./);assert.match(h.app.innerHTML,/after all eighteen lessons/);
 h.click('start');
 for(const g of[6,7,8])assert.match(h.app.innerHTML,new RegExp('class="lesson-unit">Grade '+g+'<'));assert.match(h.app.innerHTML,/class="lesson-unit">Grade 9 · Living Earth</);
 assert.equal((h.app.innerHTML.match(/class="lesson-unit"/g)||[]).length,4);
 assert.match(h.app.innerHTML,/California grade 6, instructional segment 1 · builds toward MS-LS1-1, MS-LS1-2, MS-LS1-3/);
 h.choose('unsure');h.input('explanation','Volume grows faster than surface area; keep this draft.');
 h=harness('integrated-science',map);
 assert.equal(h.app.querySelector('[name="explanation"]').value,'Volume grows faster than surface area; keep this draft.');
 for(let i=0;i<C.LESSONS.length;i++){
  const lesson=C.LESSONS[i];
  if(i){h.click('continue');h.choose('unsure');h.input('explanation','I compare the model with the rule.');}
  h.submit();h.click('next');
  const before=JSON.stringify(h.saved().records);
  for(const c of lesson.controls)h.lab(c.name,c.options?c.options[c.options.length-1][0]:c.max);
  assert.doesNotMatch(h.app.innerHTML,/NaN/);
  assert.equal(JSON.stringify(h.saved().records),before,'Moving a slider is not an answer');
  for(let j=0;j<4;j++)h.click('next-step');
  for(const task of lesson.checks){h.choose(task.correct[0]);h.input('explanation','The model shows it: '+task.explanation.slice(0,40));h.submit();h.click('next');}
 }
 h.click('continue');
 assert.equal(h.saved().view,'summary');assert(h.E.hydrate(h.saved()));
 assert(Policy.valid(h.E.SCHEMA,map.get(h.E.SCHEMA)));
 assert.equal(map.get('physics_beta01_session_v1'),'another subject remains untouched');
 h.click('export-json');
 const report=JSON.parse(await h.blobs[0].text());
 assert.match(h.app.innerHTML,/EIGHTEEN-LESSON SUMMARY/);assert.match(h.app.innerHTML,/Connect the model<br>to the world\./);
 assert.equal(Object.keys(report.records).length,54);
 assert.match(report.note,/explanations need human review/);
 assert.equal(JSON.parse(map.get('cluevera_saved_reports_v1')).items[0].module,'integrated-science');
});

test('a record saved with only the grade 6 lessons opens with the later lessons added and every answer kept',()=>{
 const map=new Map();let h=harness('integrated-science',map);h.click('start');
 for(let i=0;i<4;i++){
  if(i)h.click('continue');
  h.choose('unsure');h.input('explanation','First idea for lesson '+(i+1));h.submit();h.click('next');
  for(let j=0;j<4;j++)h.click('next-step');
  for(const t of C.LESSONS[i].checks){h.choose(t.correct[0]);h.input('explanation','Because of '+t.id);h.submit();h.click('next');}
 }
 const now=h.saved();
 // The record as the four-lesson version saved it, finished and on its summary.
 const old={...now,contentVersion:'integrated-science-1',labs:now.labs.slice(0,4),lessons:now.lessons.slice(0,4),view:'summary',lessonIndex:3,stage:'review'};
 assert.deepEqual(Object.keys(old.records).map(id=>id.split('-q')[0]).filter((x,i,a)=>a.indexOf(x)===i),['integrated-science-l1','integrated-science-l2','integrated-science-l3','integrated-science-l4']);
 const up=h.E.hydrate(JSON.parse(JSON.stringify(old)));
 assert(up,'The old record upgrades');
 assert.equal(up.contentVersion,'integrated-science-4');assert.equal(up.labs.length,18);assert.equal(up.lessons.length,18);
 assert.deepEqual(up.records,old.records,'Every saved answer and explanation is kept exactly');
 assert.deepEqual(up.labs.slice(0,4),old.labs);assert.deepEqual(up.labs.slice(4),C.LESSONS.slice(4).map(l=>l.defaults));
 assert.equal(up.view,'orientation');assert.equal(up.lessonIndex,4);
 const event=up.events[up.events.length-1];assert.equal(event.type,'lessons_added');assert.equal(event.from,'integrated-science-1');
 assert.deepEqual(event.lessons,C.LESSONS.slice(4).map(l=>l.id));
 map.set(h.E.SCHEMA,JSON.stringify(old));
 const resumed=harness('integrated-science',map);resumed.click('start');
 assert.match(resumed.app.innerHTML,/LESSON 5 OF 18/);assert.match(resumed.app.innerHTML,/California grade 7, instructional segment 1 · builds toward MS-PS1-1, MS-PS1-4/);
 assert(Policy.valid(resumed.E.SCHEMA,map.get(resumed.E.SCHEMA)));
});

test('the particle model: typical speed √(3kT/m), states at sea-level pressure, and atoms in each formula',()=>{
 const k=1.380649e-23,u=1.66053907e-27,speed=(c,m)=>Math.sqrt(3*k*(c+273.15)/(m*u));
 for(const[key,s]of Object.entries(Models.SUBSTANCES))for(let c=-250;c<=150;c+=5){
  const v=Models.particles(key,c);close(v.speed,speed(c,s.mass),1e-6);close(v.kelvin,c+273.15);
  const want=s.sublime!==undefined?(c<s.sublime?'solid':'gas'):c<s.melt?'solid':c===s.melt?'melting':c<s.boil?'liquid':c===s.boil?'boiling':'gas';
  assert.equal(v.state,want,key+' '+c);
 }
 // Each formula's atoms, and its mass from hydrogen 1.008, carbon 12.011 and oxygen 15.999.
 const exact={H:1.008,C:12.011,O:15.999};
 for(const[key,s]of Object.entries(Models.SUBSTANCES)){
  const fromFormula=Object.entries(s.atoms).reduce((m,[e,n])=>m+exact[e]*n,0);close(s.mass,fromFormula,0.02);
  const digits=s.formula.replace(/[₀-₉]/g,d=>'₀₁₂₃₄₅₆₇₈₉'.indexOf(d));const counted={};for(const[,e,n]of digits.matchAll(/([A-Z][a-z]?)(\d*)/g))counted[e]=(counted[e]||0)+Number(n||1);
  assert.deepEqual(counted,s.atoms,key);
 }
 assert.equal(Models.particles('ethanol',25).atomCount,9);assert.equal(Models.particles('methane',25).atomCount,5);
 // Step 2: water at 0 °C and 100 °C. Step 3 and question 2: −100 °C. Step 4: 25 °C. Question 3: 20 °C.
 assert.equal(Models.particles('water',0).state,'melting');assert.equal(Models.particles('water',100).state,'boiling');
 assert(Math.abs(Models.particles('water',0).speed-615)<2&&Math.abs(Models.particles('water',100).speed-719)<2);
 assert.deepEqual(['oxygen','carbon-dioxide','ethanol','water'].map(x=>Models.particles(x,-100).state),['gas','solid','liquid','solid']);
 assert(Math.abs(Models.particles('water',25).speed-640)<5&&Math.abs(Models.particles('carbon-dioxide',25).speed-410)<5);
 assert(Math.abs(Models.particles('oxygen',20).speed-480)<5&&Math.abs(Models.particles('carbon-dioxide',20).speed-410)<5);
});

test('the reaction model: atoms and mass are the same before and after, and most of a sugar’s mass comes from carbon dioxide',()=>{
 for(const key of Object.keys(Models.REACTIONS))for(let n=1;n<=10;n++){
  const v=Models.reaction(key,n);assert.deepEqual(v.before.atoms,v.after.atoms,key);close(v.before.mass,v.after.mass);
  // Recount the mass from the atoms.
  close(v.before.mass,v.before.atoms.H*1+v.before.atoms.C*12+v.before.atoms.O*16);
 }
 const p=Models.reaction('photosynthesis',1);assert.deepEqual(p.before.atoms,{C:6,H:12,O:18});close(p.before.mass,372);
 assert.deepEqual(p.fromAir,{sugar:180,fromCO2:168});assert.equal(Math.round(100*168/180),93);
 assert.deepEqual(Models.reaction('photosynthesis',5).after.atoms,{C:30,H:60,O:90});
 close(Models.reaction('methane',1).before.mass,80);
 assert.equal(Models.reaction('respiration',1).fromAir,null);
});

test('the seafloor model: age = distance ÷ speed, with stripes from the polarity time scale',()=>{
 for(let r=0.5;r<=8;r+=0.25)for(let d=0;d<=200;d+=5){const v=Models.seafloor(r,d);close(v.kmPerMyr,10*r);close(v.age,d/(10*r));}
 for(let i=0;i<Models.NORMAL.length;i++){const[a,b]=Models.NORMAL[i];assert(a<b);if(i)assert(a>Models.NORMAL[i-1][1]);}
 assert.deepEqual(Models.NORMAL[0],[0,0.78]);
 assert.equal(Models.seafloor(2.5,0).normal,true);assert.equal(Models.seafloor(2.5,50).normal,false);
 close(Models.seafloor(1.25,100).age,8);close(Models.seafloor(5,50).age,1);
 // Question 2: 60 km in 2 million years is 3 cm per year.
 close(60/2/10,3);
 // Step 3: 4,000 km at 2.5 cm per year in total takes 160 million years.
 close(4000/(2.5*10),160);
 assert.equal(Models.seafloor(0.5,100).known,false);
});

test('the fox model: a population at carrying capacity, a new predator, and two recovery plans',()=>{
 const F=Models.FOX,step=(n,take,add)=>n+F.growth*n*(1-n/F.capacity)-take*n+add;
 for(const eagles of[0,20,50,60])for(const plan of['none','remove','release','both']){
  const v=Models.foxes(eagles,plan);let n=F.capacity;assert.equal(v.series.length,41);
  for(let t=0;t<40;t++){const hunted=t>=5&&!(t>=10&&(plan==='remove'||plan==='both')),add=(plan==='release'||plan==='both')&&t>=10&&t<20?20:0;n=step(n,hunted?eagles/100:0,add);close(v.series[t+1],n,1e-9);}
 }
 assert(Models.foxes(0,'none').series.every(n=>n===1500));
 // Step 2: about 190 foxes in year 10 with eagles taking half.
 const none=Models.foxes(50,'none'),remove=Models.foxes(50,'remove'),release=Models.foxes(50,'release'),both=Models.foxes(50,'both');
 assert(none.series[10]>170&&none.series[10]<200);assert(none.series[40]<1);
 assert.equal(remove.back,20);assert.equal(both.back,18);assert.equal(release.back,null);assert(remove.series[40]>1450);
 // Question 2: releases slow the fall, which continues after they stop.
 for(let t=11;t<=20;t++)assert(release.series[t]<release.series[t-1]&&release.series[t]>none.series[t]);
 for(let t=21;t<=40;t++)assert(release.series[t]<release.series[t-1]);
 assert.match(Graphs.lab('integrated-science',7,{eagles:0,plan:'none'}).readout,/Never below 1,000 foxes/);
 assert.match(Graphs.lab('integrated-science',7,{eagles:50,plan:'remove'}).readout,/Back to 1,000 foxes in year 20/);
});

test('the particle drawing uses one arrow scale in every state, so arrow length follows temperature, not state',()=>{
 const lengths=s=>[...Graphs.lab('integrated-science',4,s).graph.matchAll(/<path d="M([\d.]+) ([\d.]+)L([\d.]+) ([\d.]+)" stroke="#6542c0"/g)].map(m=>Math.hypot(m[3]-m[1],m[4]-m[2]));
 for(const[sub,c]of[['water',-5],['water',5],['water',0],['water',100],['water',105],['oxygen',-100],['carbon-dioxide',-100],['ethanol',-100]]){
  const want=Models.particles(sub,c).speed*.03,ls=lengths({substance:sub,temperature:c});assert(ls.length>0);
  for(const l of ls)assert(Math.abs(l-want)<0.2,sub+' '+c+': '+l+' vs '+want);
 }
 assert.match(Graphs.lab('integrated-science',4,{substance:'oxygen',temperature:-250}).readout,/at −250 °C/);
 assert.match(Graphs.lab('integrated-science',7,{eagles:50,plan:'release'}).readout,/Year 40: 1 fox ·/);
});

test('a record saved with eight lessons, part-way through grade 7, opens with the grade 8 lessons added',()=>{
 const map=new Map();let h=harness('integrated-science',map);h.click('start');
 h.choose('unsure');h.input('explanation','Halfway through the course.');h.submit();
 const now=h.saved();
 const old={...now,contentVersion:'integrated-science-2',labs:now.labs.slice(0,8),lessons:now.lessons.slice(0,8)};
 const up=h.E.hydrate(JSON.parse(JSON.stringify(old)));
 assert(up);assert.equal(up.labs.length,18);assert.deepEqual(up.records,old.records);
 assert.equal(up.view,old.view);assert.equal(up.lessonIndex,old.lessonIndex);
 const event=up.events[up.events.length-1];assert.equal(event.from,'integrated-science-2');assert.deepEqual(event.lessons,C.LESSONS.slice(8).map(l=>l.id));
});

test('the crash model: kinetic energy ½mv², reaction and braking distances, and braking force',()=>{
 for(let m=800;m<=3000;m+=100)for(let k=10;k<=130;k+=5)for(const road of['dry','wet']){
  const v=Models.crash(m,k,road),ms=k/3.6,a=road==='dry'?7:4;
  close(v.energy,0.5*m*ms*ms,1e-6);close(v.reaction,1.5*ms);close(v.braking,ms*ms/(2*a));close(v.force,m*a);
 }
 // Steps 1–3 and questions 1–2.
 close(Models.crash(1500,100,'dry').energy/Models.crash(1500,50,'dry').energy,4);
 close(Models.crash(1500,100,'dry').braking/Models.crash(1500,50,'dry').braking,4);
 assert(Math.abs(Models.crash(1500,50,'dry').braking-14)<0.5&&Math.abs(Models.crash(1500,100,'dry').braking-55)<0.5);
 close(Models.crash(1000,50,'dry').braking,Models.crash(3000,50,'dry').braking);close(Models.crash(3000,50,'dry').force,3*Models.crash(1000,50,'dry').force);
 assert(Models.crash(1500,50,'wet').braking>Models.crash(1500,50,'dry').braking);
});

test('the Moon model: lit fraction (1 − cos θ)/2, phase names in order, and rising times',()=>{
 for(let d=0;d<=29.5;d+=0.5){const v=Models.moon(d),th=2*Math.PI*d/29.53;close(v.lit,(1-Math.cos(th))/2);assert.equal(v.waxing,d/29.53<.5);}
 const names=[];for(let d=0;d<=29.5;d+=0.5){const n=Models.moon(d).name;if(names[names.length-1]!==n)names.push(n);}
 assert.deepEqual(names,['new moon','waxing crescent','first quarter','waxing gibbous','full moon','waning gibbous','third quarter','waning crescent','new moon']);
 assert.equal(Models.moon(7.5).name,'first quarter');assert.equal(Models.moon(15).name,'full moon');assert.equal(Models.moon(22).name,'third quarter');
 // Rising about 6 a.m. at new moon, noon at first quarter, 6 p.m. at full moon, midnight at third quarter.
 const near=(d,m)=>{const r=Models.moon(d).rise,diff=Math.min(Math.abs(r-m),1440-Math.abs(r-m));assert(diff<=30,d+': '+r);};
 near(0,360);near(7.5,720);near(15,1080);near(22,0);
 for(const d of[3.5,11,18.5,26])assert.doesNotMatch(Graphs.lab('integrated-science',9,{day:d}).graph,/NaN|A0\.00 /);
});

test('the selection model: the better-matched color gains each generation, on lava or on pale rock',()=>{
 for(const ground of['lava','sand'])for(const adv of[0,1,5,20])for(const start of[1,25,50]){
  const v=Models.selection(ground,adv,start);let p=start/100;const w=1+adv/100;
  for(let g=1;g<=200;g++){p=ground==='lava'?p*w/(p*w+1-p):p/(p+(1-p)*w);close(v.series[g],p,1e-12);}
  // The odds of dark fur change by a factor of w each generation.
  close(v.series[100]/(1-v.series[100]),(start/(100-start))*(ground==='lava'?w:1/w)**100,1e-6*(1+v.series[100]/(1-v.series[100])));
 }
 assert.equal(Models.selection('lava',5,1).half,95);
 assert(Models.selection('lava',5,1).half>=90&&Models.selection('lava',5,1).half<=100);
 assert.equal(Models.selection('lava',1,1).half,null);assert(Models.selection('lava',10,1).half<60);
 assert(Models.selection('sand',5,50).series[100]<0.01);assert.equal(Models.selection('lava',0,30).series[200],0.3);
});

test('the wave model: wavelength = speed ÷ frequency and energy grows with amplitude²',()=>{
 for(const[key,m]of Object.entries(Models.MEDIA))for(let f=10;f<=150;f+=10)for(let A=1;A<=4;A++){const v=Models.wave(key,f,A);close(v.wavelength,m.speed/f);close(v.period,1/f);assert.equal(v.energy,A*A);}
 close(Models.wave('water',20,1).wavelength,75);close(Models.wave('water',30,1).wavelength,50);close(Models.wave('water',20,1).inWindow,2);
 assert(Models.wave('air',20,1).wavelength<Models.wave('water',20,1).wavelength);
 assert.equal(Models.wave('water',20,2).energy,4);
});

test('grade 8 labs: an energy graph, honest selection readouts, and digital samples',()=>{
 const energy=Graphs.lab('integrated-science',8,{mass:1500,speed:50,road:'dry',view:'energy'});
 assert.match(energy.graph,/Kinetic energy against speed/);assert.match(energy.graph,/1,000 kg, for comparison/);
 assert.match(Graphs.lab('integrated-science',8,{mass:1500,speed:50,road:'dry',view:'distance'}).graph,/Stopping distance on a dry road/);
 // A 50% start is not "more than half"; on pale rock dark fur becomes rarer; with none at the start it never spreads.
 assert.match(Graphs.lab('integrated-science',10,{ground:'lava',advantage:0,start:50}).readout,/never more than half/);
 assert.match(Graphs.lab('integrated-science',10,{ground:'sand',advantage:5,start:50}).readout,/becomes rarer/);
 assert.doesNotMatch(Graphs.lab('integrated-science',10,{ground:'sand',advantage:5,start:50}).readout,/more than half/);
 assert(Models.selection('lava',20,0).series.every(x=>x===0));
 assert.equal(Models.selection('lava',5,50).half,1);
 const on=Graphs.lab('integrated-science',11,{medium:'water',frequency:20,amplitude:1,samples:'on'});
 assert.match(on.readout,/First samples: 0\.00, 0\.25, 0\.48, 0\.68, 0\.84, 0\.95/);assert.match(on.graph,/the digital version/);
 assert.doesNotMatch(Graphs.lab('integrated-science',11,{medium:'air',frequency:150,amplitude:4,samples:'on'}).readout,/−0\.00/);
 assert.match(Graphs.lab('integrated-science',11,{medium:'air',frequency:150,amplitude:1,samples:'off'}).readout,/One wave every 6\.67 ms/);
 assert.match(Graphs.lab('integrated-science',11,{medium:'air',frequency:10,amplitude:1,samples:'off'}).readout,/1 wave in 0\.1 s/);
});

test('Living Earth models: food chains, the carbon dioxide cycle, DNA differences, crosses, feedback and moving uphill',()=>{
 // Food chain: energy × share per step; the values in lesson 13.
 for(let p=1000;p<=20000;p+=1000)for(let e=5;e<=20;e++)for(let n=2;n<=5;n++){const v=Models.foodChain(p,e,n);for(let k=0;k<n;k++)close(v.energy[k],p*(e/100)**k,1e-9);close(v.lost,p-v.energy[n-1],1e-9);}
 close(Models.foodChain(10000,10,4).top,10);close(Models.foodChain(10000,20,4).top/Models.foodChain(10000,10,4).top,8);close(Models.foodChain(10000,10,3).top,100);
 // Carbon dioxide: each station peaks and dips at its stated times, with its stated swing, on a 2.5 ppm a year rise.
 for(const[key,st]of Object.entries(Models.STATIONS)){
  // With the trend removed, the yearly cycle spans exactly the station's swing.
  const year=Array.from({length:1201},(_,i)=>Models.keeling(key,2+i/1200)-Models.CO2_TREND.rise*(2+i/1200)),hi=Math.max(...year),lo=Math.min(...year);
  close(hi-lo,st.swing,1e-3);
  close(Models.keeling(key,2+st.peak)-Models.keeling(key,2+st.low),st.swing+Models.CO2_TREND.rise*(st.peak-st.low),1e-9);
  close(Models.keeling(key,7.5)-Models.keeling(key,2.5),5*2.5,1e-9);
 }
 assert(Models.STATIONS.utqiagvik.swing>2*Models.STATIONS['mauna-loa'].swing&&Models.STATIONS['south-pole'].swing<Models.STATIONS['mauna-loa'].swing);
 // DNA: differences are counted directly; they start at zero, track 2 × rate × time while small, and fall behind it when large.
 assert.equal(Models.lineages(0,1).diff,0);
 for(const[t,r]of[[30,1],[50,1],[6,1]]){const v=Models.lineages(t,r);let d=0;for(let i=0;i<1000;i++)if(v.a[i]!==v.b[i])d++;assert.equal(v.diff,d);assert(Math.abs(v.share-2*r/100*t/10)<0.015,t+': '+v.share);}
 const far=Models.lineages(100,3);assert(far.share<far.expected-0.05);
 for(let t=5;t<=100;t+=5)assert(Models.lineages(t,1).changes>=Models.lineages(t-5,1).changes);
 // Crosses: expected shares from the four combinations; counts add up; large samples come close.
 const g=['PP','Pp','pp'];for(const a of g)for(const b of g)for(const n of[4,20,100,1000]){const v=Models.cross(a,b,n);assert.equal(v.purple+v.white,n);close(v.expected.PP+v.expected.Pp+v.expected.pp,1);}
 assert.deepEqual(Models.cross('Pp','Pp',4).expected,{PP:.25,Pp:.5,pp:.25});assert.deepEqual(Models.cross('PP','pp',4).expected,{PP:0,Pp:1,pp:0});assert.equal(Models.cross('Pp','pp',4).expected.pp,.5);
 assert(Math.abs(Models.cross('Pp','Pp',1000).white/1000-.25)<.04);assert.equal(Models.cross('PP','PP',1000).white,0);
 // The fixed sample wanders when small and settles when large, and never shows the unlikely all-white 4.
 assert.deepEqual([4,20,100,1000].map(n=>Models.cross('Pp','Pp',n).white),[2,7,28,248]);
 close(705/(705+224),0.759,0.001);
 // Body temperature: the recurrence, and the steady states that steps 1–3 use.
 for(const air of[0,25,40,45])for(const f of['none','weak','normal','strong']){const v=Models.body(air,f),B=Models.BODY;let t=37;for(let m=0;m<120;m++)t=t+B.loss*(air-t)+B.heat+B.gain[f]*(37-t);close(v.final,t,1e-9);}
 close(Models.body(25,'none').steady,37);close(Models.body(40,'none').steady,52);
 // Without feedback the body drifts a few degrees in two hours, about as fast as a real body.
 assert(Models.body(40,'none').final>39.5&&Models.body(40,'none').final<41);assert(Models.body(0,'none').final>30&&Models.body(0,'none').final<33);
 for(const air of[0,40])assert(Math.abs(Models.body(air,'strong').final-37)<Math.abs(Models.body(air,'normal').final-37)&&Math.abs(Models.body(air,'normal').final-37)<Math.abs(Models.body(air,'weak').final-37));
 assert(Models.body(40,'normal').final>37);
 // Moving uphill: shift = warming ÷ 6.5 km; cone area; question 1's 3 °C.
 close(Models.uphill(3,4,2.5,1).shift,3/6.5);close(Models.uphill(3,4,2.5,1).z1,2.5+3/6.5);close(Models.uphill(2,4,2.5,1).shift*1000,307.7,0.1);
 const area=(H,a,b)=>(H-Math.min(a,H))**2-(H-Math.min(b,H))**2;
 for(let w=0;w<=5;w+=0.5){const v=Models.uphill(w,4,2.5,1);close(v.share,area(4,2.5+w/6.5,3.5+w/6.5)/area(4,2.5,3.5),1e-9);if(w)assert(v.share<Models.uphill(w-0.5,4,2.5,1).share+1e-12);}
 assert.equal(Models.uphill(5,3,2.5,0.5).gone,true);
 assert(Models.uphill(3,4.5,2.5,1).share>Models.uphill(3,3.5,2.5,1).share);
});

test('Living Earth readouts: no future years, honest edge cases and precise small numbers',()=>{
 const co2=Graphs.lab('integrated-science',13,{station:'mauna-loa',years:10});
 assert.match(co2.readout,/start of 2016 to .* start of 2026/);assert.doesNotMatch(co2.graph,/>2027</);
 assert.match(Graphs.lab('integrated-science',17,{warming:0,peak:3,low:3,width:1}).readout,/starts at or above the 3 km summit/);
 assert.match(Graphs.lab('integrated-science',12,{producers:10000,efficiency:5,levels:5}).readout,/0\.00063% of the plants’ energy/);
 assert.match(Graphs.lab('integrated-science',14,{split:6,rate:1}).readout,/\(1\.2%\)/);
 assert.match(Graphs.lab('integrated-science',15,{parent1:'Pp',parent2:'Pp',offspring:'1000'}).readout,/752 purple, 248 white/);
});
