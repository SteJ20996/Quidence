'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const harness=require('./course-dom.cjs'),G=require('../assets/course-graphs.js'),create=require('../assets/course-engine.js').create;
const B=require('../assets/foundation-bank.js'),F=require('../assets/foundation-engine.js'),S=require('../assets/report-store.js');
const modules=['ae01','af01'],content=m=>require('../modules/'+m+'/dist/content.js');
const close=(x,y)=>assert.ok(Math.abs(x-y)<1e-9,`${x} != ${y}`);
const answer=(choices,explanation='I checked the quantities and their relationship.',otherHelp=false)=>({choices,explanation,otherHelp});
function finish(h,i){const l=h.C.LESSONS[i];h.choose('unsure');h.input('explanation','I need to see how the rule works.');h.submit();h.click('next');for(let j=0;j<4;j++)h.click('next-step');for(const t of l.checks){h.choose(t.correct[0]);h.input('explanation',t.explanation);h.submit();h.click('next');}}
test('new course questions require reasons and keep uncertainty separate from mismatched choices',()=>{
 for(const m of modules){const C=content(m),E=create(C);assert.equal(C.LESSONS.length,4);assert.equal(Object.keys(E.TASKS).length,12);for(const t of Object.values(E.TASKS)){assert.equal(E.valid(t,answer(t.correct,' ')),false);assert.equal(E.score(t,answer(['unsure'])),'unsure');assert.equal(E.score(t,answer(t.correct)),'correct');assert.equal(E.score(t,answer([t.options.find(o=>!t.correct.includes(o.id)).id])),'revisit');assert.equal(E.valid(t,answer(['invented'])),false);assert.equal(E.valid(t,answer([t.correct[0],'unsure'])),false);assert.ok(t.explanation.length>30);}}
});
test('independent statistics calculations confirm centers, weighted means, sample spread, and probability references',()=>{
 close(G.mean([2,3,3,4,18]),(2+3+3+4+18)/5);assert.equal(G.median([9,3,7,1]),(3+7)/2);
 const tasks=B.MODULES.ae01.tasks,ref=id=>Object.fromEntries(tasks.find(t=>t.id===id).fields.map(f=>[f.id,f.answer]));
 assert.deepEqual(ref('ae-f04'),{mean:30/5,median:3});assert.equal(ref('ae-f06').mean,(2*80+8*90)/10);assert.deepEqual(ref('ae-f08'),{variance:((1-3)**2+(3-3)**2+(5-3)**2)/2,sd:2});assert.equal(ref('ae-f09').z,(20-14)/3);
 assert.deepEqual(ref('ae-f13'),{joint:8/50,conditional:8/20});close(ref('ae-f14').reverse,8/(8+10));close(ref('ae-f15').union,.4+.3-.1);assert.equal(ref('ae-f15').independent,'no');
 for(const overlap of [2,6,12,18]){const p=G.probability(overlap);close(p.joint,overlap/100);close(p.conditional,overlap/20);close(p.reverse,overlap/30);}
});
test('independent pre-calculus calculations confirm restrictions, compositions, zeros, angles, growth, and logarithms',()=>{
 const tasks=B.MODULES.af01.tasks,ref=id=>Object.fromEntries(tasks.find(t=>t.id===id).fields.map(f=>[f.id,f.answer]));
 assert.equal(G.value({fn:'sqrt',k:2},1),null);assert.equal(G.value({fn:'sqrt',k:2},2),0);assert.equal(G.value({fn:'reciprocal',k:-3},-3),null);assert.equal(G.value({fn:'reciprocal',k:-3},-2),1);
 assert.deepEqual(ref('af-f05'),{fg:2*(2**2)+1,gf:(2*2+1)**2});assert.equal(ref('af-f06').x,(13+2)/3);assert.equal(ref('af-f09').rate,(3**2-1**2)/(3-1));close(ref('af-f10').c,150/180);close(ref('af-f12').sin,Math.sqrt(1-(3/5)**2));
 assert.deepEqual(ref('af-f13'),{factor:1+25/100,amount:80*(1+25/100)**2});assert.equal(ref('af-f14').amount,200*(1-.1)**2);assert.equal(2**ref('af-f15').log,32);
 for(const x of[-2,4])assert.equal((x-1)**2-9,0);assert.equal(content('af01').LESSONS[1].checks[1].correct[0],'pair');
 const angle=120*Math.PI/180;assert.ok(Math.cos(angle)<0&&Math.sin(angle)>0);close(Math.cos(angle)**2+Math.sin(angle)**2,1);
});
test('new course flows gate blank reasons, restore drafts, preserve revisions, and archive portable reports',async()=>{
 const map=new Map();for(const m of modules){let h=harness(m,map);h.click('start');h.choose(h.C.LESSONS[0].predict.correct[0]);h.submit();assert.equal(h.app.querySelector('[data-action="next"]').disabled,true);assert.match(h.document.getElementById('answer-status').textContent,/add a reason/);
 h.input('explanation','<img src=x onerror=alert(1)> I need to check the denominator or domain.');h=harness(m,map);assert.match(h.app.innerHTML,/&lt;img/);h.submit();h.click('next');h.click('step',3);assert.equal(h.app.querySelector('[data-action="next-step"]').disabled,true);h.click('step',1);h.click('step',2);h.click('step',3);h.click('next-step');
 const t=h.C.LESSONS[0].checks[0],wrong=t.options.find(o=>!t.correct.includes(o.id)).id;h.choose(wrong);h.input('explanation','I used the wrong reference group or function order.');h.submit();h.click('next');h.choose(h.C.LESSONS[0].checks[1].correct[0]);h.input('explanation',h.C.LESSONS[0].checks[1].explanation);h.submit();h.click('next');
 const first=JSON.stringify(h.saved().records[t.id].submissions[0]);h.click('revise',0);h.choose(t.correct[0]);h.input('otherHelp',true);h.input('explanation',t.explanation);h.submit();assert.equal(h.saved().records[t.id].submissions[1].support.feedbackSeen,true);assert.equal(h.saved().records[t.id].submissions[1].support.otherHelp,true);assert.equal(JSON.stringify(h.saved().records[t.id].submissions[0]),first);h.click('next');h.click('next');
 for(let i=1;i<4;i++){h.click('continue');finish(h,i);}h.click('continue');assert.equal(h.saved().view,'summary');assert.ok(h.E.hydrate(h.saved()));h.click('export-json');h.click('export-md');assert.equal(h.downloads.length,2);const json=JSON.parse(await h.blobs[0].text());assert.equal(json.taskDefinitions.length,4);assert.equal(Object.keys(json.records).length,12);assert.match(await h.blobs[1].text(),/AI tutor request:/);assert.ok(S.read({getItem:k=>map.get(k)}).data.items.find(x=>x.module===m).versions[0].payload.reportText);assert.equal(harness(m,map).saved().view,'summary');}
 assert.equal(JSON.parse(map.get(S.KEY)).items.length,2);assert.ok(map.has('ae01_beta01_session_v1')&&map.has('af01_beta01_session_v1'));
});
test('all lab control extremes produce finite graphics, text equivalents, and valid saved settings',()=>{
 for(const m of modules){const C=content(m),E=create(C);for(let i=0;i<4;i++){const l=C.LESSONS[i],cases=[l.defaults];for(const c of l.controls)for(const v of c.options?c.options.map(([v])=>v):[c.min,c.max])cases.push({...l.defaults,[c.name]:v});for(const s of cases){const all=E.defaultLabs();all[i]=s;assert.equal(E.validLabs(all),true);const r=G.lab(m,i,s);assert.doesNotMatch(r.graph,/NaN|Infinity/);assert.ok(r.readout&&r.formula&&r.note);assert.match(r.graph,/figcaption/);if(r.graph.includes('<svg'))assert.match(r.graph,/aria-labelledby=/);}for(const t of[l.predict,...l.checks])assert.doesNotMatch(G.task(t.graph),/NaN|Infinity/);}}
 assert.match(G.lab('af01',0,{kind:'sqrt',k:1,x:0}).readout,/undefined/);assert.match(G.lab('af01',2,{angle:270}).readout,/sin θ = -1/);
});
test('animations finish, pause, and yield to manual controls without submitting an answer',()=>{
 for(const m of modules)for(let i=0;i<4;i++){const h=harness(m),l=h.C.LESSONS[i];if(!l.motion)continue;h.click('open',i);h.choose('unsure');h.input('explanation','I need to compare the changing example.');h.submit();h.click('next');const before=JSON.stringify(h.saved().records);h.click('play-motion');h.tick(0);h.tick(1500);h.click('play-motion');assert.equal(h.frames.size,0);h.click('play-motion');h.tick(0);h.tick(4500);assert.equal(h.frames.size,0);assert.equal(h.saved().labs[i][l.motion.key],l.motion.end);assert.equal(JSON.stringify(h.saved().records),before);assert.ok(h.E.hydrate(h.saved()));h.click('play-motion');h.tick(0);h.lab(l.motion.key,l.motion.replay);assert.equal(h.frames.size,0);}
 const h=harness('af01',new Map(),false,{reduced:true});h.click('start');h.choose('unsure');h.input('explanation','I need to check the allowed input.');h.submit();h.click('next');h.click('play-motion');assert.equal(h.frames.size,0);assert.equal(h.saved().labs[0].x,6);
});
test('old four-subject portfolios migrate without altering their records; unknown subjects and impossible further checks fail',()=>{
 const legacy=F.fresh();for(const id of ['ae01','af01','number-theory','physics-1','physics-2','coordinate-geometry','geometry','algebra-2','discrete-math'])delete legacy.modules[id];const s=F.createSession(legacy,'ad01'),t=F.task(s);F.edit(s,t,{...F.blank(t),explanation:'Keep this original unfinished explanation.'});const before=JSON.stringify(legacy),loaded=F.hydrate(legacy);assert.ok(loaded);assert.equal(JSON.stringify(legacy),before);assert.deepEqual(loaded.modules.ad01,legacy.modules.ad01);assert.deepEqual(loaded.modules.ae01,{active:null,sessions:[]});assert.equal(F.hydrate({...legacy,modules:{...legacy.modules,unknown:{active:null,sessions:[]}}}),null);assert.throws(()=>F.createSession(loaded,'ae01','followup'),/No further check/);
});
test('new subject records preserve corrupt storage through cancellation and allow in-memory work when saving fails',()=>{
 const map=new Map([['ae01_beta01_session_v1','{bad'],['af01_beta01_session_v1','other record']]),h=harness('ae01',map);assert.match(h.app.innerHTML,/kept unchanged/);h.click('reset-blocked');h.click('cancel-reset');assert.equal(map.get('ae01_beta01_session_v1'),'{bad');h.click('raw');h.click('reset-blocked');h.click('confirm-reset');assert.equal(map.get('af01_beta01_session_v1'),'other record');assert.ok(h.E.hydrate(h.saved()));
 const denied=harness('af01',new Map(),true);assert.match(denied.note.textContent,/When you start/);assert.equal(denied.map.has(denied.E.SCHEMA),false);denied.click('start');assert.match(denied.note.textContent,/unavailable/);denied.choose('unsure');denied.input('explanation','I am not sure about the domain.');denied.submit();denied.click('next');assert.ok(denied.app.querySelector('[data-lab="kind"]'));
});
test('new subject pages and calculus bridges resolve all local files',()=>{
 const root=path.resolve(__dirname,'..');for(const m of modules){const dir=path.join(root,'modules',m,'dist'),html=fs.readFileSync(path.join(dir,'index.html'),'utf8');for(const [,href]of html.matchAll(/(?:src|href)="([^"]+)"/g)){assert.ok(fs.existsSync(path.resolve(dir,href.split(/[?#]/)[0])),href);}const bridge=content(m).bridge;assert.ok(fs.existsSync(path.resolve(dir,bridge.href.split(/[?#]/)[0])));}
 assert.match(fs.readFileSync(path.join(root,'modules/ad01/dist/app.js'),'utf8'),/af01\/dist/);assert.match(fs.readFileSync(path.join(root,'foundations/index.html'),'utf8'),/subject-foundations.js/);
});
