'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const harness=require('./course-dom.cjs');
const C=require('../courses/integrated-science/content.js'),S=require('../assets/science-content.js');
const Models=require('../assets/science-models.js'),Graphs=require('../assets/course-graphs.js'),Policy=require('../assets/sync-policy.js');
const close=(a,b,tol=1e-9)=>assert(Math.abs(a-b)<=tol,a+' != '+b);

test('the course follows the plan: one lesson per grade 6 segment, each with four steps and three questions',()=>{
 assert.equal(C.MODULE,'integrated-science');assert.equal(C.LESSONS.length,4);
 assert.deepEqual(C.UNITS.map(u=>u.id),['grade-6']);
 assert.deepEqual(C.LESSONS.map(l=>l.short),['Cells as systems','Heating ice','Rain shadows','Global warming']);
 // Each PE comes from the matching instructional-segment box in chapter 5 of the 2016 California Science Framework.
 const segments={1:['MS-LS1-1','MS-LS1-2','MS-LS1-3','MS-LS1-8','MS-ESS2-4','MS-ESS2-6'],2:['MS-ESS2-4','MS-ESS2-6','MS-PS3-3','MS-PS3-4','MS-PS3-5'],3:['MS-LS1-4','MS-LS1-5','MS-LS1-8','MS-LS3-2','MS-ESS2-5','MS-ESS2-6'],4:['MS-LS1-4','MS-LS1-5','MS-ESS3-3','MS-ESS3-5']};
 for(const[i,l]of C.LESSONS.entries()){
  assert.equal(l.id,'integrated-science-lesson-'+(i+1));assert.equal(l.unit,'grade-6');
  assert.equal(l.segment,'Grade 6, instructional segment '+(i+1));
  assert(l.pe.length>0);for(const pe of l.pe)assert(segments[i+1].includes(pe),l.short+': '+pe);
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
 assert.equal(S.create().LESSONS.length,4,'create() returns a fresh copy');
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
 assert.match(h.app.innerHTML,/Selected foundations/);assert.doesNotMatch(h.app.innerHTML,/course-bridge/);
 h.click('start');
 assert.match(h.app.innerHTML,/class="lesson-unit">Grade 6</);
 assert.equal((h.app.innerHTML.match(/class="lesson-unit"/g)||[]).length,1);
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
 assert.equal(Object.keys(report.records).length,12);
 assert.match(report.note,/explanations need human review/);
 assert.equal(JSON.parse(map.get('cluevera_saved_reports_v1')).items[0].module,'integrated-science');
});
