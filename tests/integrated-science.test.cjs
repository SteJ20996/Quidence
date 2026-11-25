'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const harness=require('./course-dom.cjs');
const C=require('../courses/integrated-science/content.js'),S=require('../assets/science-content.js');
const Models=require('../assets/science-models.js'),Graphs=require('../assets/course-graphs.js'),Policy=require('../assets/sync-policy.js');
const close=(a,b,tol=1e-9)=>assert(Math.abs(a-b)<=tol,a+' != '+b);

test('the course follows the plan: one lesson per segment of grades 6–8, Living Earth and Chemistry in the Earth System, each with four steps and three questions',()=>{
 assert.equal(C.MODULE,'integrated-science');assert.equal(C.LESSONS.length,24);
 assert.deepEqual(C.UNITS.map(u=>u.id),['grade-6','grade-7','grade-8','living-earth','chemistry']);
 assert.deepEqual(C.LESSONS.map(l=>l.short),['Cells as systems','Heating ice','Rain shadows','Global warming','Particles in motion','Atoms in living things','Moving plates','Recovering a population','Speed and crashes','Moon phases','Natural selection','Listening with waves','Energy in food chains','The breathing planet','Common ancestry','Inheritance','Homeostasis','Moving uphill','Combustion','Heat flow','Ions and charge','Reaction rates','Climate feedbacks','Ocean acidification']);
 // Each PE comes from the matching instructional-segment box in chapter 5 of the 2016 California Science Framework.
 const segments={'6-1':['MS-LS1-1','MS-LS1-2','MS-LS1-3','MS-LS1-8','MS-ESS2-4','MS-ESS2-6'],'6-2':['MS-ESS2-4','MS-ESS2-6','MS-PS3-3','MS-PS3-4','MS-PS3-5'],'6-3':['MS-LS1-4','MS-LS1-5','MS-LS1-8','MS-LS3-2','MS-ESS2-5','MS-ESS2-6'],'6-4':['MS-LS1-4','MS-LS1-5','MS-ESS3-3','MS-ESS3-5'],
  '7-1':['MS-PS1-1','MS-PS1-3','MS-PS1-4','MS-ESS3-1','MS-LS2-3'],'7-2':['MS-LS1-6','MS-LS1-7','MS-ESS2-1','MS-PS1-2','MS-PS1-5','MS-PS1-6'],'7-3':['MS-LS2-1','MS-LS2-2','MS-LS2-3','MS-ESS2-3','MS-ESS3-1','MS-PS1-2','MS-PS1-3','MS-PS1-5'],'7-4':['MS-LS2-4','MS-LS2-5','MS-ESS2-2','MS-ESS3-2','MS-PS1-3'],
  '8-1':['MS-PS2-1','MS-PS2-2','MS-PS3-1','MS-LS4-1'],'8-2':['MS-ESS1-1','MS-ESS1-2','MS-ESS1-3','MS-PS2-3','MS-PS2-4','MS-PS2-5','MS-PS3-2'],'8-3':['MS-LS3-1','MS-LS4-1','MS-LS4-2','MS-LS4-3','MS-LS4-4','MS-LS4-5','MS-LS4-6','MS-ESS1-4'],'8-4':['MS-PS4-1','MS-PS4-2','MS-PS4-3','MS-ESS1-1','MS-ESS3-3','MS-ESS3-4','MS-LS4-4','MS-LS4-6'],
  // Living Earth segment boxes in framework chapter 7.
  'LE-1':['HS-LS2-1','HS-LS2-2','HS-LS2-4','HS-LS2-8'],'LE-2':['HS-ESS1-6','HS-ESS2-6','HS-ESS2-7','HS-ESS3-6','HS-LS1-5','HS-LS1-6','HS-LS1-7','HS-LS2-3','HS-LS2-5'],'LE-3':['HS-ESS1-5','HS-ESS2-5','HS-ESS3-1','HS-ESS3-4','HS-LS4-1','HS-LS4-2','HS-LS4-4','HS-LS4-5'],'LE-4':['HS-LS3-1','HS-LS3-2','HS-LS3-3','HS-LS4-2','HS-LS4-3'],'LE-5':['HS-LS1-1','HS-LS1-2','HS-LS1-3','HS-LS1-4'],'LE-6':['HS-ESS3-5','HS-ESS3-6','HS-LS2-6','HS-LS2-7','HS-LS4-5','HS-LS4-6'],
  // Chemistry in the Earth System segment boxes in framework chapter 7.
  'CES-1':['HS-PS1-3','HS-PS1-4','HS-PS1-7','HS-PS3-1'],'CES-2':['HS-ESS2-3','HS-ETS1-4','HS-PS3-1','HS-PS3-2','HS-PS3-4'],'CES-3':['HS-PS1-1','HS-PS1-2','HS-PS1-7'],'CES-4':['HS-PS1-3','HS-PS1-4','HS-PS1-5','HS-PS1-7','HS-PS2-4','HS-PS3-5'],'CES-5':['HS-ESS2-2','HS-ESS2-4','HS-ESS2-6','HS-ESS3-2','HS-ESS3-5','HS-ESS3-6'],'CES-6':['HS-ESS2-2','HS-ESS2-6','HS-PS1-5','HS-PS1-6','HS-PS1-7']};
 for(const[i,l]of C.LESSONS.entries()){
  const course=i>=18?'chemistry':i>=12?'living-earth':null,grade=6+Math.floor(Math.min(i,12)/4)+(i>=18),segment=course?(i-12)%6+1:i%4+1;
  const name={chemistry:'Chemistry in the Earth System','living-earth':'Living Earth'}[course],box={chemistry:'CES','living-earth':'LE'}[course]||grade;
  assert.equal(l.id,'integrated-science-lesson-'+(i+1));assert.equal(l.unit,course||'grade-'+grade);
  assert.equal(l.segment,course?name+', instructional segment '+segment:'Grade '+grade+', instructional segment '+segment);
  assert(l.pe.length>0);for(const pe of l.pe)assert(segments[box+'-'+segment].includes(pe),l.short+': '+pe);
  assert.equal(l.steps.length,4);
  for(const s of l.steps){assert(s.title&&s.text);for(const k of['predict','test','explain'])assert(s.activity[k],k);}
  const tasks=[l.predict,...l.checks];assert.equal(tasks.length,3);
  for(const[j,t]of tasks.entries()){
   // A revised question gets a new id and names the version-1 id it replaces.
   assert.equal(t.id.replace(/-r2$/,''),'integrated-science-l'+(i+1)+'-q'+(j+1));if(t.replaces)assert.deepEqual(t.replaces,['integrated-science-l'+(i+1)+'-q'+(j+1)]);assert.equal(t.options.length,3);assert.deepEqual(t.correct,['0']);
   assert.equal(new Set(t.options.map(o=>o.label)).size,3);assert(t.explanation);
   // The correct answer is not always in the same place.
   assert.equal(t.options.findIndex(o=>o.id==='0'),(3-(i+j)%3)%3);
  }
  for(const c of l.controls){const v=l.defaults[c.name];assert(v!==undefined,c.name);if(c.options)assert(c.options.some(([x])=>x===v));else{assert(v>=c.min&&v<=c.max);close(((v-c.min)/c.step)%1,0);}}
  assert(l.next);
 }
 assert.match(C.scope,/Selected foundations/);assert.match(C.scope,/Not a complete year of science/);
 assert.equal(C.bridge,undefined);
 assert.equal(S.create().LESSONS.length,24,'create() returns a fresh copy');
 assert.equal(C.VERSION,'integrated-science-6');assert.deepEqual(C.PREVIOUS,[{version:'integrated-science-5',lessons:24,revised:true},{version:'integrated-science-1',lessons:4},{version:'integrated-science-2',lessons:8},{version:'integrated-science-3',lessons:12},{version:'integrated-science-4',lessons:18}]);
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
 assert.match(h.app.innerHTML,/Selected foundations/);assert.doesNotMatch(h.app.innerHTML,/course-bridge/);assert.match(h.app.innerHTML,/Twenty-four starting points\./);assert.match(h.app.innerHTML,/after all twenty-four lessons/);
 h.click('start');
 for(const g of[6,7,8])assert.match(h.app.innerHTML,new RegExp('class="lesson-unit">Grade '+g+'<'));assert.match(h.app.innerHTML,/class="lesson-unit">Grade 9 · Living Earth</);assert.match(h.app.innerHTML,/class="lesson-unit">Grade 10 · Chemistry in the Earth System</);
 assert.equal((h.app.innerHTML.match(/class="lesson-unit"/g)||[]).length,5);
 assert.match(h.app.innerHTML,/California grade 6, instructional segment 1 · builds toward MS-LS1-1, MS-LS1-2, MS-LS1-3/);
 h.choose('unsure');h.input('explanation','Volume grows faster than surface area; keep this draft.');
 h=harness('integrated-science',map);
 assert.equal(h.app.querySelector('[name="explanation"]').value,'Volume grows faster than surface area; keep this draft.');
 for(let i=0;i<C.LESSONS.length;i++){
  const lesson=C.LESSONS[i];
  if(i){h.click('continue');h.choose('unsure');h.input('explanation','I compare the model with the rule.');}
  h.submit();h.click('next');
  // Each step opens after a prediction; "not sure" counts.
  h.click('skip-step-prediction');
  const before=JSON.stringify(h.saved().records);
  for(const c of lesson.controls)h.lab(c.name,c.options?c.options[c.options.length-1][0]:c.max);
  assert.doesNotMatch(h.app.innerHTML,/NaN/);
  assert.equal(JSON.stringify(h.saved().records),before,'Moving a slider is not an answer');
  for(let j=0;j<4;j++){if(j)h.click('skip-step-prediction');h.click('next-step');}
  for(const task of lesson.checks){h.choose(task.correct[0]);h.input('explanation','The model shows it: '+task.explanation.slice(0,40));h.submit();h.click('next');}
 }
 h.click('continue');
 assert.equal(h.saved().view,'summary');assert(h.E.hydrate(h.saved()));
 assert(Policy.valid(h.E.SCHEMA,map.get(h.E.SCHEMA)));
 assert.equal(map.get('physics_beta01_session_v1'),'another subject remains untouched');
 h.click('export-json');
 const report=JSON.parse(await h.blobs[0].text());
 assert.match(h.app.innerHTML,/TWENTY-FOUR-LESSON SUMMARY/);assert.match(h.app.innerHTML,/Connect the model<br>to the world\./);
 assert.equal(Object.keys(report.records).length,72);
 assert.match(report.note,/explanations need human review/);
 assert.equal(JSON.parse(map.get('cluevera_saved_reports_v1')).items[0].module,'integrated-science');
});

test('a record saved with only the grade 6 lessons opens with the later lessons added and every answer kept',()=>{
 const map=new Map();let h=harness('integrated-science',map);h.click('start');
 for(let i=0;i<4;i++){
  if(i)h.click('continue');
  h.choose('unsure');h.input('explanation','First idea for lesson '+(i+1));h.submit();h.click('next');
  for(let j=0;j<4;j++){h.click('skip-step-prediction');h.click('next-step');}
  for(const t of C.LESSONS[i].checks){h.choose(t.correct[0]);h.input('explanation','Because of '+t.id);h.submit();h.click('next');}
 }
 const now=h.saved();
 // The record as the four-lesson version saved it, finished and on its summary.
 const old={...now,contentVersion:'integrated-science-1',labs:now.labs.slice(0,4),lessons:now.lessons.slice(0,4),view:'summary',lessonIndex:3,stage:'review'};
 assert.deepEqual(Object.keys(old.records).map(id=>id.split('-q')[0]).filter((x,i,a)=>a.indexOf(x)===i),['integrated-science-l1','integrated-science-l2','integrated-science-l3','integrated-science-l4']);
 const up=h.E.hydrate(JSON.parse(JSON.stringify(old)));
 assert(up,'The old record upgrades');
 assert.equal(up.contentVersion,'integrated-science-6');assert.equal(up.labs.length,24);assert.equal(up.lessons.length,24);
 assert.deepEqual(up.records,old.records,'Every saved answer and explanation is kept exactly');
 assert.deepEqual(up.labs.slice(0,4),old.labs);assert.deepEqual(up.labs.slice(4),C.LESSONS.slice(4).map(l=>l.defaults));
 assert.equal(up.view,'orientation');assert.equal(up.lessonIndex,4);
 const event=up.events[up.events.length-1];assert.equal(event.type,'lessons_added');assert.equal(event.from,'integrated-science-1');
 assert.deepEqual(event.lessons,C.LESSONS.slice(4).map(l=>l.id));
 map.set(h.E.SCHEMA,JSON.stringify(old));
 const resumed=harness('integrated-science',map);resumed.click('start');
 assert.match(resumed.app.innerHTML,/LESSON 5 OF 24/);assert.match(resumed.app.innerHTML,/California grade 7, instructional segment 1 · builds toward MS-PS1-1, MS-PS1-4/);
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
 assert(up);assert.equal(up.labs.length,24);assert.deepEqual(up.records,old.records);
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

test('a record saved with eighteen lessons, at the end of Living Earth, opens with the grade 10 lessons added',()=>{
 const map=new Map();let h=harness('integrated-science',map);h.click('start');
 h.choose('unsure');h.input('explanation','Finished Living Earth.');h.submit();
 const now=h.saved();
 const old={...now,contentVersion:'integrated-science-4',labs:now.labs.slice(0,18),lessons:now.lessons.slice(0,18)};
 const up=h.E.hydrate(JSON.parse(JSON.stringify(old)));
 assert(up);assert.equal(up.contentVersion,'integrated-science-6');assert.equal(up.labs.length,24);assert.deepEqual(up.records,old.records);
 assert.deepEqual(up.labs.slice(18),C.LESSONS.slice(18).map(l=>l.defaults));
 const event=up.events[up.events.length-1];assert.equal(event.type,'lessons_added');assert.equal(event.from,'integrated-science-4');assert.deepEqual(event.lessons,C.LESSONS.slice(18).map(l=>l.id));
});

test('Chemistry in the Earth System models: burning fuel, mixing, ions, rates, feedbacks and seawater',()=>{
 // Burning: atoms balance, so mass in equals mass out; energy = moles × heat of combustion (water as vapor).
 const mm={C:12.011,H:1.008,O:15.999},mass=(c,h,o)=>c*mm.C+h*mm.H+o*mm.O;
 for(const[key,c,h,o,heat]of[['methane',1,4,0,802.3],['octane',8,18,0,5074],['ethanol',2,6,1,1235]]){
  for(const g of[10,100,1000]){
   const v=Models.combustion(key,g),mol=g/mass(c,h,o);
   close(v.mol,mol);close(v.o2,mol*(c+h/4-o/2)*2*mm.O);close(v.co2,mol*c*mass(1,0,2));close(v.h2o,mol*h/2*mass(0,2,1));
   close(g+v.o2,v.co2+v.h2o,1e-6);close(v.energy,mol*heat);
  }
  const v=Models.combustion(key,100);close(v.perMJ,c*mass(1,0,2)/heat*1000);
  // Average bond energies give the measured value to within a few percent.
  assert(Math.abs(v.bondEstimate-heat)/heat<0.03,key+' bond estimate '+v.bondEstimate);
 }
 const m=Models.combustion('methane',100);close(m.co2,274.3,0.1);close(m.energy,5001,1);close(m.perMJ,54.85,0.01);
 assert(Models.combustion('octane',100).perMJ>m.perMJ,'gasoline gives more carbon dioxide per unit of energy than natural gas');
 // Mixing: energy lost by the hot sample equals energy gained by the water.
 for(const obj of['water','iron','aluminum'])for(const[hm,ht,cm,ct]of[[100,80,200,20],[10,100,1000,0],[1000,40,10,30]]){
  const v=Models.mixing(obj,hm,ht,cm,ct),c=Models.SPECIFIC[obj];
  close(hm*c*(ht-v.final),cm*4.18*(v.final-ct),1e-6);close(v.energy,hm*c*(ht-v.final));assert(v.final>=ct&&v.final<=ht);
 }
 close(Models.mixing('water',100,80,100,20).final,50);
 assert(Models.mixing('iron',100,80,100,20).final<Models.mixing('aluminum',100,80,100,20).final,'iron holds less energy per degree');
 // Ions: the charges add to zero, and the formulas match.
 const formulas={NaCl:['Na','Cl'],MgCl2:['Mg','Cl'],Al2O3:['Al','O'],CaF2:['Ca','F'],AlN:['Al','N'],K2S:['K','S'],Mg3N2:['Mg','N'],CaO:['Ca','O']};
 for(const[f,[a,b]]of Object.entries(formulas)){const v=Models.ionic(a,b);assert.equal(v.formula.replace(/[₀-₉]/g,d=>'₀₁₂₃₄₅₆₇₈₉'.indexOf(d)),f);assert.equal(v.nm*Models.ELEMENTS[a].charge+v.nn*Models.ELEMENTS[b].charge,0);}
 for(const[k,e]of Object.entries(Models.ELEMENTS)){const valence=e.shells[e.shells.length-1];assert.equal(e.charge>0?e.charge:8-valence,e.charge>0?valence:-e.charge,k);}
 assert.equal(Models.ionic('Mg','O').ionMetal,'Mg²⁺');assert.equal(Models.ionic('Na','Cl').ionNonmetal,'Cl⁻');
 // Rates: e^(−Ea/RT) relative to 25 °C; doubling the concentration doubles the rate.
 for(const Ea of[40,50,80]){
  close(Models.rate(25,1,Ea),1);close(Models.rate(25,2,Ea),2);
  close(Models.rate(35,1,Ea),Math.exp(Ea*1000/8.314*(1/298.15-1/308.15)));
 }
 const r50=Models.rate(35,1,50);assert(r50>1.8&&r50<2.0,'about double for 10 °C at 50 kJ/mol');
 assert(Models.rate(35,1,80)>Models.rate(35,1,40),'a higher barrier makes the rate more sensitive to temperature');
 // Feedbacks: the rounds add up to first ÷ (1 − f); doubled carbon dioxide (3.93 W/m²) gives about 3.4 °C.
 for(const combo of[[0,0,0],[1,0,0],[1,1,0],[1,1,1]]){
  const v=Models.feedback(4,...combo.map(Boolean)),sum=[1.30,0.35,0.42].reduce((s,x,i)=>s+(combo[i]?x:0),0);
  close(v.f,sum/3.22);close(v.first,4/3.22);close(v.total,4/(3.22-sum));close(v.gain,1/(1-v.f));
  close(v.rounds[0],v.first);for(let k=1;k<v.rounds.length;k++)assert(v.rounds[k]>=v.rounds[k-1]);assert(v.rounds[12]<=v.total+1e-12);
 }
 close(Models.feedback(3.93,true,true,true).total,3.42,0.01);close(Models.feedback(4,false,false,false).total,1.24,0.01);
 // Seawater: the alkalinity balances at the computed pH, and pH falls as carbon dioxide rises.
 const S=Models.SEA;
 for(const ppm of[280,420,700,1000]){
  const v=Models.seawater(ppm),h=v.h,ta=v.hco3+2*v.co3+S.boron*S.KB/(S.KB+h)+S.Kw/h-h;
  close(ta,S.alkalinity,1e-12);close(v.hco3,S.K1*S.K0*ppm*1e-6/h);close(v.co3,S.K2*v.hco3/h);
 }
 const p280=Models.seawater(280).pH,p420=Models.seawater(420).pH,p1000=Models.seawater(1000).pH;
 close(p280,8.17,0.02);close(p420,8.03,0.02);close(p1000,7.70,0.02);
 for(let ppm=290;ppm<=1000;ppm+=10)assert(Models.seawater(ppm).pH<Models.seawater(ppm-10).pH);
 assert(Models.seawater(420).co3<Models.seawater(280).co3);
 close(Models.seawater(280).pH-Models.seawater(370).pH,0.1,0.01);close(Models.seawater(280).pH-Models.seawater(420).pH,0.14,0.01);
 assert.match(Graphs.lab('integrated-science',23,{co2:420,added:0}).note,/about 0\.1 between 280 ppm and 370 ppm.*about 0\.11 from 1770 to 2000.*about 0\.14 at 420 ppm/);
 // Sodium carbonate in a closed tank: dissolved carbon rises by the amount added and alkalinity by twice that.
 for(const[ppm,added]of[[420,100],[1000,220],[280,600]]){
  const before=Models.seawater(ppm),v=Models.seawater(ppm,added),h=v.h;
  close(v.dic,before.dic+added*1e-6,1e-12);close(v.alkalinity,S.alkalinity+2*added*1e-6,1e-12);close(v.co2+v.hco3+v.co3,v.dic,1e-12);
  close(v.hco3+2*v.co3+S.boron*S.KB/(S.KB+h)+S.Kw/h-h,v.alkalinity,1e-12);assert(v.pH>before.pH&&v.co3>before.co3);
 }
 // About 220 µmol/kg brings water at 1,000 ppm back to the carbonate it had at 280 ppm, as step 4 asks.
 assert(Models.seawater(1000,200).co3<Models.seawater(280).co3&&Models.seawater(1000,240).co3>Models.seawater(280).co3);
 assert.match(Graphs.lab('integrated-science',23,{co2:1000,added:220}).readout,/0\.68% more than at 280 ppm/);
});

test('the carbon dioxide model agrees with NOAA’s measured Mauna Loa monthly means, which the lab draws for Mauna Loa only',()=>{
 const v=Models.MLO_MONTHLY.values,t=v.map((_,i)=>2016+(i+.5)/12);assert.equal(v.length,120);assert.equal(Models.MLO_MONTHLY.start,2016);
 for(const[i,x]of t.entries())close(Models.measured(x),v[i],1e-9);
 // The model's trend is the least-squares line through the measurements.
 const n=v.length,mt=t.reduce((a,b)=>a+b)/n,mv=v.reduce((a,b)=>a+b)/n,slope=t.reduce((s,x,i)=>s+(x-mt)*(v[i]-mv),0)/t.reduce((s,x)=>s+(x-mt)**2,0);
 close(slope,Models.CO2_TREND.rise,0.05);close(mv+slope*(2020-mt),Models.CO2_TREND.start,0.05);
 // With the trend removed, the measured yearly cycle has the model's swing, highest in May and lowest in September or October.
 const cycle=Array.from({length:12},(_,m)=>{const r=v.filter((_,i)=>i%12===m).map((y,k)=>y-(mv+slope*(t[m+12*k]-mt)));return r.reduce((a,b)=>a+b)/r.length;});
 close(Math.max(...cycle)-Math.min(...cycle),Models.STATIONS['mauna-loa'].swing,0.3);assert.equal(cycle.indexOf(Math.max(...cycle)),4);assert([8,9].includes(cycle.indexOf(Math.min(...cycle))));
 const rms=Math.sqrt(t.reduce((s,x,i)=>s+(Models.keeling('mauna-loa',x-2020)-v[i])**2,0)/n);assert(rms<1,'model within 1 ppm rms: '+rms);
 const mlo=Graphs.lab('integrated-science',13,{station:'mauna-loa',years:10}),pole=Graphs.lab('integrated-science',13,{station:'south-pole',years:10});
 assert.match(mlo.graph,/Measured monthly mean \(NOAA\)/);assert.match(mlo.readout,/Measured by NOAA: 427\.5 ppm in December 2025; the year’s peak was 430\.5 ppm in May/);assert.match(mlo.note,/Dr\. Xin Lan, NOAA Global Monitoring Laboratory.*Dr\. Ralph Keeling, Scripps/);assert.match(mlo.note,/Maunakea/);
 assert.doesNotMatch(pole.graph,/Measured monthly mean/);assert.doesNotMatch(pole.readout,/Measured by NOAA/);
});

test('lesson photographs are stored with the site, sized as declared, and always shown with credit, licence and source',()=>{
 const fs=require('fs'),path=require('path'),dir=path.join(__dirname,'../courses/integrated-science');
 // Width and height from a WebP header (lossy VP8, lossless VP8L or extended VP8X).
 const size=buf=>{const kind=buf.toString('ascii',12,16);if(kind==='VP8 ')return[buf.readUInt16LE(26)&0x3fff,buf.readUInt16LE(28)&0x3fff];if(kind==='VP8L'){const b=buf.readUInt32LE(21);return[(b&0x3fff)+1,((b>>14)&0x3fff)+1];}if(kind==='VP8X')return[buf.readUIntLE(24,3)+1,buf.readUIntLE(27,3)+1];throw Error('not WebP');};
 const photos=C.LESSONS.flatMap((l,i)=>l.steps.map((s,j)=>[i,j,s.photo]).filter(x=>x[2]));
 assert.deepEqual(photos.map(([i,j])=>[i+1,j+1]),[[8,2],[10,2],[18,1]]);
 for(const[,,p]of photos){
  assert.match(p.src,/^\.\.\/\.\.\/assets\/photos\/[a-z-]+\.webp$/);const file=path.join(dir,p.src),buf=fs.readFileSync(file);
  assert.equal(buf.toString('ascii',0,4),'RIFF');assert.equal(buf.toString('ascii',8,12),'WEBP');assert.deepEqual(size(buf),[p.width,p.height],p.src);
  assert(buf.length<170000,p.src+' is '+buf.length+' bytes');
  for(const k of['alt','caption','credit','license'])assert(p[k]&&p[k].length>8,k);
  assert.match(p.source,/^https:\/\/(www\.nps\.gov|images\.nasa\.gov)\//);assert.match(p.license,/^Public domain/);assert.doesNotMatch(p.license,/\bN[CD]\b/);
 }
 // The step shows the photograph with its credit, licence and a link to its source.
 const h=harness('integrated-science',new Map());h.click('start');h.click('open',7);
 h.choose('unsure');h.input('explanation','A first idea.');h.submit();h.click('next');h.click('step',1);h.click('skip-step-prediction');
 assert.match(h.app.innerHTML,/class="lesson-photo"><img src="\.\.\/\.\.\/assets\/photos\/island-fox\.webp" alt="A grey and rust-colored island fox/);
 assert.match(h.app.innerHTML,/Photo: NPS \/ Jessica Weinberg McClosky · Public domain, U\.S\. National Park Service · <a href="https:\/\/www\.nps\.gov\/im\/medn\/island-fox\.htm" target="_blank" rel="noopener" aria-label="Source page for this image \(opens in a new tab\)">source ↗<\/a>/);
 h.click('step',0);assert.doesNotMatch(h.app.innerHTML,/lesson-photo/);
});

test('lessons with a hands-on investigation show a drawing of it in their feedback, made only of SVG',()=>{
 const I=require('../assets/science-investigations.js');
 assert.deepEqual(I.LESSONS,[1,2,5,6,9,10,11,12,16,17,19,20,21,22,23,24]);
 for(let n=1;n<=C.LESSONS.length;n++){
  const f=Graphs.investigation('integrated-science',n-1);
  if(!I.LESSONS.includes(n)){assert.equal(f,'');continue;}
  assert.match(f,/class="investigation-figure"/);assert.match(f,/<title id=/);assert.match(f,/<desc id=/);assert.match(f,/figcaption/);
  // Drawn here: no images, links or outside resources.
  assert.doesNotMatch(f,/<image|<img|href=|url\((?!#)|NaN|undefined/);
  // Each drawing says how it is scaled, and draws a scale bar or scaled axes.
  assert.match(f,/<desc[^>]*>[^<]*(To scale|Angles to scale|true proportions)/);
 }
 assert.equal(Graphs.investigation('physics',0),'');
 // Every label fits inside the 520-wide drawing even in a wide typeface (0.62 × the font size per character), since
 // the appearances use different fonts.
 for(const n of I.LESSONS)for(const m of I.figure(n).matchAll(/<text x="([\d.-]+)" y="[\d.-]+" font-size="(\d+)" (?:text-anchor="(\w+)")?[^>]*>([^<]*)<\/text>/g)){
  const x=+m[1],w=m[4].replace(/&[a-z#0-9]+;/g,'x').length*m[2]*0.62,left=m[3]==='middle'?x-w/2:m[3]==='end'?x-w:x;
  assert(left>=4&&left+w<=516,'Lesson '+n+' label may overflow: '+m[4]);
 }
 // The drawing appears with "A useful next step" once the lesson's questions are done.
 const h=harness('integrated-science',new Map());h.click('start');
 h.choose('unsure');h.input('explanation','A first idea.');h.submit();h.click('next');
 for(let j=0;j<4;j++){h.click('skip-step-prediction');h.click('next-step');}
 for(const t of C.LESSONS[0].checks){h.choose(t.correct[0]);h.input('explanation','Because of the model.');h.submit();h.click('next');}
 assert.match(h.app.innerHTML,/A useful next step/);assert.match(h.app.innerHTML,/investigation-figure/);assert.match(h.app.innerHTML,/Measuring onion skin cells/);
 // The computed parts of two drawings: the heating curve and the Moon's place in the sky.
 close(I.heatingCurve(0),-10);close(I.heatingCurve(100),0);close(I.heatingCurve(348),40,0.05);
 const melt=(100*334)/150;assert(melt>200&&melt<240,'melting takes about 4 minutes');
 // The numbers written on the grade 10 drawings: the soda-can example, and the ions along a 1 mm edge of salt.
 assert.equal(Models.combustion('octane',1).perGram.toFixed(1),'44.4');assert.match(I.figure(19),/44\.4 kJ per gram/);
 close(100*4.18*20/1000,8.36);close(8.36/0.6,13.9,0.05);assert.match(I.figure(19),/8\.4 kJ reached the water from 0\.6 g of wax, 14 kJ per gram/);
 assert.match(I.figure(20),/predicts 30 °C/);
 close(1e-3/0.282e-9/1e6,3.55,0.01);assert.match(I.figure(21),/about 3\.5 million ions/);
 const m7=I.moonSky(7),m11=I.moonSky(11);assert(m7.altitude>45&&m7.azimuth>0&&m7.azimuth<45);assert(m11.azimuth<0);assert(I.moonSky(3).altitude<I.moonSky(5).altitude);
});

test('lesson 22 compares barriers at one temperature, so a catalyst’s lower barrier always speeds a reaction',()=>{
 // Each line compares a reaction with itself at 25 °C; barriers are compared at the same temperature.
 close(Models.barrierRatio(25,40,80),Math.exp(40000/(8.314*298.15)),1);assert(Models.barrierRatio(25,40,80)>1e7&&Models.barrierRatio(25,40,80)<1.1e7);
 for(const t of[0,25,35,55])for(const[lo,hi]of[[40,50],[50,80],[40,80]])assert(Models.barrierRatio(t,lo,hi)>1,`a lower barrier is faster at ${t} °C`);
 const i=C.LESSONS.findIndex(l=>l.short==='Reaction rates'),view=Models.model(i,{...C.LESSONS[i].defaults,temperature:35,barrier:'50'});
 assert.match(view.readout,/× this reaction’s rate at 25 °C/);assert.match(view.readout,/40 kJ\/mol is 49\.6 times as fast as 50 kJ\/mol; 50 kJ\/mol is 1\.2 × 10⁵ times as fast as 80 kJ\/mol/);
 assert.doesNotMatch(view.readout,/1 = 25 °C/,'no shared reference that the barriers do not have');
 assert.match(C.LESSONS[i].steps[2].activity.test,/how much faster a lower barrier is at the same temperature/);
});

test('lesson setups match their labs: the heating axis covers every mass, and each step’s settings can be made',()=>{
 const i=C.LESSONS.findIndex(l=>l.short==='Heating ice'),energy=C.LESSONS[i].controls.find(c=>c.name==='energy'),mass=C.LESSONS[i].controls.find(c=>c.name==='mass');
 assert(energy.max>=Models.heating(mass.max,0).total,'the energy slider reaches the end of boiling for the largest mass');
 for(const m of[100,200,350,500]){const g=Models.model(i,{mass:m,energy:0}).graph,ticks=[...g.matchAll(/>(\d+)<\/text>/g)].map(x=>+x[1]);assert(Math.max(...ticks)>=Models.heating(m,0).total-100,`the axis reaches the end of boiling at ${m} g`);}
 const L9=C.LESSONS.find(l=>l.short==='Speed and crashes');assert.doesNotMatch(L9.steps[0].activity.explain,/energy against mass/);
 const L18=C.LESSONS.find(l=>l.short==='Moving uphill');assert.match(L18.steps[0].text,/10 °C per kilometer \(lesson 3\)/);
 const k=C.LESSONS.indexOf(L18),low=Models.uphill(5,4,3,L18.defaults.width);assert(low.share<0.1,'from 3 km, 5 °C leaves under a tenth of the area');
});

test('lesson 20 reads energy per degree, and lesson 16 can draw new samples while sample 1 stays as before',()=>{
 const i=C.LESSONS.findIndex(l=>l.short==='Heat flow'),w=Models.model(i,{...C.LESSONS[i].defaults}).readout,f=Models.model(i,{...C.LESSONS[i].defaults,object:'iron'}).readout;
 const per=r=>+r.match(/gave off ([\d.]+) kJ for each degree/)[1];assert.equal(per(w),0.84);assert.equal(per(f),0.09);
 assert.deepEqual([4,20,1000].map(n=>Models.cross('Pp','Pp',n).white),[2,7,248],'sample 1 is the earlier fixed sample');
 const fours=[...Array(10)].map((_,s)=>Models.cross('Pp','Pp',4,s+1).white);assert.deepEqual(fours,[2,1,0,1,0,3,1,1,2,0]);
 assert.equal(fours.filter(x=>x===0).length,3,'3 of 10 samples have no white offspring, near (3/4)^4 ≈ 32%');
 const j=C.LESSONS.findIndex(l=>l.short==='Inheritance');assert.equal(C.LESSONS[j].defaults.sample,1);assert.match(C.LESSONS[j].steps[2].activity.test,/move the sample from 1 to 10/);
});

test('a record saved before lesson 16 had a sample control opens with sample 1 and every answer kept',()=>{
 const map=new Map();const h=harness('integrated-science',map);h.click('start');
 h.choose('unsure');h.input('explanation','My first idea');h.submit();h.click('next');
 for(let j=0;j<4;j++){h.click('skip-step-prediction');h.click('next-step');}
 for(const t of C.LESSONS[0].checks){h.choose(t.correct[0]);h.input('explanation','Because of '+t.id);h.submit();h.click('next');}
 const now=h.saved(),j=C.LESSONS.findIndex(l=>l.short==='Inheritance');
 const old=JSON.parse(JSON.stringify(now));delete old.labs[j].sample;old.labs[j].offspring='100';
 const up=h.E.hydrate(JSON.parse(JSON.stringify(old)));
 assert.equal(Object.keys(old.records).length,3,'the record holds the three answers');assert(up,'the record opens');assert.deepEqual(up.records,old.records);assert.equal(up.labs[j].sample,1);assert.equal(up.labs[j].offspring,'100','a saved setting is kept');
});

test('science reviews judge the science, and the hands-on activities carry their safety notes',()=>{
 assert.equal(C.reviewFocus,'science');
 const next=s=>C.LESSONS.find(l=>l.short===s).next;
 assert.match(next('Cells as systems'),/wash your hands/);assert.match(next('Heating ice'),/goggles/);
 assert.match(next('Particles in motion'),/poured by an adult/);assert.match(next('Atoms in living things'),/eye protection/);
 assert.match(next('Combustion'),/the same 4\.18 J as in lesson 2/);
});

test('each science step asks for a prediction before it shows its text and model, and keeps the prediction',()=>{
 const map=new Map();const h=harness('integrated-science',map);h.click('start');
 h.choose('unsure');h.input('explanation','First idea');h.submit();h.click('next');
 const L=C.LESSONS[0],html=()=>h.app.innerHTML;
 // Step 1 waits for a prediction: its question shows; its text and the model do not; it is not yet opened.
 assert.match(html(),/Predict first/);assert(html().includes(L.steps[0].activity.predict.replace(/’/g,'’')));
 assert(!html().includes('id="lab-graphs"'),'the model waits');assert(!html().includes(L.steps[0].text.slice(0,40)),'the step text waits');
 assert.equal(h.saved().lessons[0].seenSteps.length,0);
 // An empty prediction is not saved.
 h.click('save-step-prediction');assert.equal(h.saved().lessons[0].stepPredictions,undefined);
 h.input('stepPrediction','It grows eight times');h.click('save-step-prediction');
 const p=h.saved().lessons[0].stepPredictions;assert.equal(p[0].text,'It grows eight times');assert.equal(p[0].unsure,false);
 assert(html().includes('id="lab-graphs"'),'the model opens');assert(html().includes('It grows eight times'));assert.deepEqual(h.saved().lessons[0].seenSteps,[0]);
 assert.doesNotMatch(html(),/<span class="activity-label">Predict first<\/span>/,'the answered prediction is not asked again');
 // "Not sure" is kept as such; a saved prediction is never replaced.
 h.click('next-step');h.click('skip-step-prediction');const q=h.saved().lessons[0].stepPredictions;assert.equal(q[1].unsure,true);assert.equal(q[1].text,'');
 h.click('prev-step');assert.equal(h.saved().lessons[0].stepPredictions[0].text,'It grows eight times');
 assert(h.saved().events.filter(e=>e.type==='step_prediction_saved').length===2);
});

test('saved step predictions are validated, appear in the feedback and report, and older records without them still open',()=>{
 const map=new Map();const h=harness('integrated-science',map);h.click('start');
 h.choose('unsure');h.input('explanation','First idea');h.submit();h.click('next');
 h.input('stepPrediction','My guess');h.click('save-step-prediction');
 for(let j=0;j<4;j++){if(j)h.click('skip-step-prediction');h.click('next-step');}
 for(const t of C.LESSONS[0].checks){h.choose(t.correct[0]);h.input('explanation','Because of '+t.id);h.submit();h.click('next');}
 assert.match(h.app.innerHTML,/Your predictions in the lesson steps/);assert.match(h.app.innerHTML,/My guess/);
 const saved=h.saved();
 assert(h.E.hydrate(JSON.parse(JSON.stringify(saved))),'a record with step predictions opens');
 const older=JSON.parse(JSON.stringify(saved));delete older.lessons[0].stepPredictions;assert(h.E.hydrate(older),'a record without them opens');
 for(const bad of[[null,null,null],[{text:'x',unsure:true,at:new Date().toISOString()},null,null,null],[{text:'x'.repeat(501),unsure:false,at:new Date().toISOString()},null,null,null]]){
  const b=JSON.parse(JSON.stringify(saved));b.lessons[0].stepPredictions=bad;assert.equal(h.E.hydrate(b),null);}
 const explains=C.LESSONS.flatMap(l=>l.steps.map(s=>s.activity.explain));
 for(const giveaway of[/eight times as much/,/rises at sunset/,/close to, but not exactly/,/so close to the water/,/far side is warmer/,/cannot see the Moon/])assert(!explains.some(e=>giveaway.test(e)),'explain prompts do not state the result: '+giveaway);
});

test('revised questions keep every earlier answer: a finished lesson stays finished and shows the wording it answered',()=>{
 const revised=C.LESSONS.flatMap(l=>[l.predict,...l.checks]).filter(t=>t.replaces);
 assert(revised.length>=60,'most questions are revised');
 for(const t of revised){assert.match(t.id,/-r2$/);assert.equal(t.replaces.length,1);const old=C.RETIRED.find(r=>r.id===t.replaces[0]);assert(old,'the earlier wording is kept');assert.notEqual(old.prompt+old.options.map(o=>o.label).join(),t.prompt+t.options.map(o=>o.label).join());}
 assert.equal(C.RETIRED.length,revised.length);
 // A learner who finished lesson 1 under version 5, answering the earlier wordings.
 const map=new Map();let h=harness('integrated-science',map);h.click('start');
 const L=C.LESSONS[0],oldIds=[L.predict,...L.checks].map(t=>t.replaces?t.replaces[0]:t.id);
 const state=h.saved(),at=new Date().toISOString();
 oldIds.forEach((id,k)=>{const task=h.E.TASKS[id],answer={choices:[task.correct[0]],explanation:'Old answer '+k,otherHelp:false};
  state.records[id]={draft:answer,status:'submitted',feedbackSeen:true,submissions:[{at,answer,result:h.E.score(task,answer),support:{phase:k?'check':'predict',lessonSeen:k>0,feedbackSeen:false,otherHelp:false}}]};});
 Object.assign(state,{contentVersion:'integrated-science-5',view:'lesson',lessonIndex:0,stage:'review',questionIndex:1});
 state.lessons[0]={seenSteps:[0,1,2,3],reviewed:true};
 const up=h.E.hydrate(JSON.parse(JSON.stringify(state)));
 assert(up,'the record opens');assert.equal(up.contentVersion,C.VERSION);assert.deepEqual(up.records,state.records,'every answer is kept exactly');
 assert(h.E.lessonDone(up,0),'the lesson stays finished');assert.equal(up.events.at(-1).type,'questions_revised');
 map.set(h.E.SCHEMA,JSON.stringify(up));h=harness('integrated-science',map);
 const old1=h.E.TASKS[oldIds[1]];assert(h.app.innerHTML.includes(old1.prompt.replace(/&/g,'&amp;').slice(0,40)),'the feedback shows the earlier wording');
 assert.match(h.app.innerHTML,/You answered an earlier wording of this question/);
 // A lesson half done under version 5 asks only the questions not yet answered, in their new wording.
 const half=JSON.parse(JSON.stringify(state));delete half.records[oldIds[2]];Object.assign(half,{stage:'check',questionIndex:1});half.lessons[0].reviewed=false;
 const up2=h.E.hydrate(half);assert(up2);assert(!h.E.lessonDone(up2,0));assert.equal(L.checks.findIndex(t=>!h.E.answered(up2,t)),1);
});

test('the revised questions balance option lengths, and the first published wordings stay frozen',()=>{
 const all=C.LESSONS.flatMap(l=>[l.predict,...l.checks]);
 const longest=all.filter(t=>{const c=t.options.find(o=>o.id==='0').label.length;return t.options.every(o=>o.id==='0'||o.label.length<c);}).length;
 assert(longest<=all.length/3,'the right answer is the longest option in '+longest+' of '+all.length+' questions');
 for(const t of all){const L=t.options.map(o=>o.label.length);assert(Math.max(...L)/Math.min(...L)<=1.25,t.id+' option lengths');}
 // Answers saved against the version-1 wordings are shown with them, so those wordings never change.
 assert.equal(require('crypto').createHash('sha256').update(JSON.stringify(C.RETIRED)).digest('hex'),'dad50374893a2d4ac1ce7df9ee78762f6a743f47b6522d1dec41e1b3e2018756');
});
