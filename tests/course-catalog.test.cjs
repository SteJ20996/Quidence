'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),harness=require('./course-dom.cjs');
const C=require('../assets/school-course-content.js'),S=require('../assets/report-store.js'),G=require('../assets/course-graphs.js'),M=require('../assets/course-models.js'),Catalog=require('../assets/course-catalog.js'),Goals=require('../assets/hub-goals.js');
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} ≠ ${b}`);
function submit(h,choice,explanation){h.choose(choice);h.input('explanation',explanation);h.submit();}
function finish(h,i){const l=h.C.LESSONS[i];submit(h,'unsure','I need to compare the quantities before deciding.');h.click('next');for(let j=0;j<4;j++)h.click('next-step');for(const t of l.checks){submit(h,t.correct[0],t.explanation);h.click('next');}}
test('four original course banks have distinct tasks, lessons, keys, and varied option positions',()=>{
 const taskIds=new Set(),keys=new Set(),prompts=new Set();for(const id of C.IDS){const h=harness(id);assert.equal(h.C.LESSONS.length,4);assert.equal(h.app.querySelector('h1')!==null,true);keys.add(h.E.SCHEMA);const positions=[];for(const l of h.C.LESSONS){assert.equal(l.steps.length,4);for(const t of[l.predict,...l.checks]){assert(!taskIds.has(t.id));taskIds.add(t.id);prompts.add(t.prompt);positions.push(t.options.findIndex(o=>o.id===t.correct[0]));assert.equal(h.E.score(t,{choices:['unsure'],explanation:'I need to check.',otherHelp:false}),'unsure');assert.equal(t.graph,undefined,'Do not reveal the lesson solution in a first-prediction diagram');}}assert.deepEqual([...new Set(positions)].sort(),[0,1,2]);}
 assert.equal(taskIds.size,48);assert.equal(prompts.size,48);assert.equal(keys.size,4);
});
test('new courses resume exact drafts, preserve revisions, and archive separately alongside legacy reports',async()=>{
 const map=new Map([['aa01_beta06_session_v1','legacy untouched']]),storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};
 assert(S.save('aa01',{markdown:'Original shared activity report'},'old',storage).ok);
 for(const id of C.IDS){let h=harness(id,map);h.click('start');submit(h,'unsure',' ');assert.equal(h.app.querySelector('[data-action="next"]').disabled,true);h.input('explanation','My exact unfinished work: −2 − (−6).');h=harness(id,map);assert.equal(h.app.querySelector('[name="explanation"]').value,'My exact unfinished work: −2 − (−6).');h.submit();h.click('next');for(let j=0;j<4;j++)h.click('next-step');
 for(const t of h.C.LESSONS[0].checks){submit(h,t.correct[0],t.explanation);h.click('next');}
 const t=h.C.LESSONS[0].checks[0],first=JSON.stringify(h.saved().records[t.id].submissions[0]);h.click('revise',0);submit(h,t.correct[0],'A different valid route, retained for review.');assert.equal(JSON.stringify(h.saved().records[t.id].submissions[0]),first);assert.equal(h.saved().records[t.id].submissions[1].support.feedbackSeen,true);h.click('next');h.click('next');
 for(let i=1;i<4;i++){h.click('continue');finish(h,i);}h.click('continue');assert.equal(h.saved().view,'summary');assert.ok(h.E.hydrate(h.saved()));const report=JSON.parse(map.get(S.KEY)).items.find(r=>r.module===id);assert.ok(report);assert.match(report.versions[0].payload.reportText,/A different valid route/);assert.match(report.versions[0].payload.reportText,/not automatically scored/);assert.equal(h.app.all().find(x=>x.tagName==='A'&&x.textContent==='View saved reports').href,'../../reports/');
 h.click('export-md');assert.match(await h.blobs.at(-1).text(),new RegExp(h.C.TITLE));h.click('print');assert.match(h.window.preview.html,/Print \/ save as PDF/);assert.notEqual(h.window.printed,true);assert.equal(harness(id,map).saved().view,'summary');}
 assert.equal(map.get('aa01_beta06_session_v1'),'legacy untouched');assert.equal(JSON.parse(map.get(S.KEY)).items.length,5);
});
test('course controls update the live model, restore settings, and leave submitted answers unchanged',()=>{
 for(const id of C.IDS)for(let i=0;i<4;i++){const h=harness(id),l=h.C.LESSONS[i];h.click('open',i);submit(h,'unsure','I will inspect this example.');h.click('next');const answers=JSON.stringify(h.saved().records);for(const c of l.controls){const value=c.options?c.options.at(-1)[0]:c.max;h.lab(c.name,value);assert.equal(h.saved().labs[i][c.name],value);assert.equal(JSON.stringify(h.saved().records),answers);assert.ok(h.E.hydrate(h.saved()));assert.doesNotMatch(h.app.innerHTML,/NaN|Infinity/);}const resumed=harness(id,h.map);assert.deepEqual(resumed.saved().labs,h.saved().labs);}
});
test('all model boundaries remain finite, with independent numeric checks for mathematics',()=>{
 for(const id of C.IDS){const c=C.create(id);for(let i=0;i<4;i++){const l=c.LESSONS[i],cases=[l.defaults];for(const control of l.controls)for(const value of control.options?control.options.map(x=>x[0]):[control.min,control.max])cases.push({...l.defaults,[control.name]:value});for(const s of cases){const r=G.lab(id,i,s);assert.doesNotMatch(r.graph,/NaN|Infinity/);assert.ok(r.readout&&r.formula&&r.note);assert.match(r.graph,/figcaption/);}}}
 close(M.midpointElasticity(4,80,6,60),(20/70)/(2/5));close(M.midpointElasticity(6,60,4,80),5/7);close(M.unitRatio(3,4),.75);
 assert.match(M.model('geometry',1,{a:3}).readout,/c = 5/);assert.match(M.model('geometry',2,{k:3}).readout,/Area factor 9/);assert.match(M.model('algebra-1',2,{b:6}).readout,/\(2, 4\)/);assert.match(M.model('algebra-2',1,{k:4}).graph,/Undefined/);assert.match(M.model('algebra-1',3,{r:4}).graph,/data-zero-axis="y" d="M70 175H470"/);
});
test('new course recovery keeps corrupt data and other course records intact',()=>{
 for(const id of C.IDS){const key=id+'_beta01_session_v1',map=new Map([[key,'{unreadable'],['geometry_beta01_session_v1',id==='geometry'?'{unreadable':'preserve other']]),h=harness(id,map);h.click('reset-blocked');h.click('cancel-reset');assert.equal(map.get(key),'{unreadable');h.click('raw');h.click('reset-blocked');h.click('confirm-reset');assert.ok(h.E.hydrate(h.saved()));if(id!=='geometry')assert.equal(map.get('geometry_beta01_session_v1'),'preserve other');const denied=harness(id,new Map(),true);denied.click('start');submit(denied,'unsure','Keep working even if saving is unavailable.');denied.click('next');assert.match(denied.app.innerHTML,/Explore the example/);}
});
test('mathematics and physics entry links resolve and retired subjects cannot start activities',()=>{
 const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.equal(Catalog.GROUPS.length,3);assert.equal(Object.keys(Catalog.COURSES).length,14);assert.equal(Object.values(Catalog.COURSES).filter(c=>!c.planned).length,14);
 for(const[id,c]of Object.entries(Catalog.COURSES)){const dir=path.join(root,c.course),page=fs.readFileSync(path.join(dir,'index.html'),'utf8');assert.match(html,new RegExp('data-subject="'+id+'"'));for(const[,link]of page.matchAll(/(?:href|src)="([^"]+)"/g))if(!/^(https?:|data:|#)/.test(link))assert.ok(fs.existsSync(path.resolve(dir,link.split(/[?#]/)[0])),id+' '+link);}
 const macro=fs.readFileSync(path.join(root,'courses/macroeconomics/index.html'),'utf8');assert.match(macro,/no longer offered/);assert.doesNotMatch(macro,/course-app.js|content.js|data-action="start"/);
 assert.deepEqual(Goals.hydrate({schema:Goals.KEY,subject:'aa01',text:'Keep my old request.'}),{subject:'algebra-1',text:'Keep my old request.',includeInReport:false});assert.equal(Goals.hydrate({schema:Goals.KEY,subject:'macroeconomics',text:'x'}),null);assert.equal(Goals.prompt({subject:'microeconomics',text:'Old request'}),'');
});
test('new covers are deterministic and course page generation is repeatable',()=>{
 const root=path.resolve(__dirname,'..'),pages=require('../scripts/build-course-pages.cjs'),illustrations=require('../scripts/build-course-illustrations.cjs');for(const[id,svg]of Object.entries(illustrations.covers()))assert.equal(fs.readFileSync(path.join(root,'assets/illustrations',id+'.svg'),'utf8'),svg);
 const before=C.IDS.map(id=>fs.readFileSync(path.join(root,'courses',id,'index.html'),'utf8'));pages.build();assert.deepEqual(C.IDS.map(id=>fs.readFileSync(path.join(root,'courses',id,'index.html'),'utf8')),before);const home=fs.readFileSync(path.join(root,'index.html'),'utf8');require('../scripts/build-course-home.cjs').build();assert.equal(fs.readFileSync(path.join(root,'index.html'),'utf8'),home);
});

test('lesson reports and every download use the opted-in learning request saved with the report',async()=>{
 for(const id of ['algebra-1','physics-1']){
  const request='Relate the picture to the equation.\n  Keep my wording.',map=new Map([['cluevera_learning_goal_v1',JSON.stringify({schema:'cluevera_learning_goal_v1',subject:id,text:request,includeInReport:true})]]),h=harness(id,map);
  h.click('start');for(let i=0;i<h.C.LESSONS.length;i++){finish(h,i);h.click('continue');}
  const item=S.read(h.window.localStorage).data.items.find(x=>x.module===id);assert.equal(item.versions[0].payload.learningRequest.text,request);assert(h.app.all().some(x=>x.innerHTML.includes('Your learning focus')));
  h.click('export-json');assert.equal(JSON.parse(await h.blobs.at(-1).text()).learningRequest.text,request);
  h.click('export-md');assert((await h.blobs.at(-1).text()).includes('>   Keep my wording.'));
  h.click('print');assert.match(h.window.preview.html,/Your learning focus/);
  map.set('cluevera_learning_goal_v1',JSON.stringify({schema:'cluevera_learning_goal_v1',subject:id,text:'Changed later',includeInReport:true}));
  const reopened=harness(id,map);reopened.click('export-json');assert.equal(JSON.parse(await reopened.blobs.at(-1).text()).learningRequest.text,request);
 }
});
