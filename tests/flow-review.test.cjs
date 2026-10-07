'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const Element=require('./foundation-dom.cjs'),F=require('../assets/foundation-engine.js'),D=require('../assets/challenge-bank.js'),B=require('../assets/foundation-bank.js'),PB=require('../assets/project-bank.js'),T=require('../assets/project-tools.js'),G=require('../assets/foundation-graphs.js'),S=require('../assets/report-store.js');
const root=path.resolve(__dirname,'..'),empty={VERSION:'no-further-check',MODULES:{}};
const settings={schema:'cluevera_challenge_portfolio_v1',challenge:true,checkTitle:'Intermediate & challenging diagnostic'};
const E=F.forBank(D,empty,settings);
function canonical(engine,t){const a=engine.blank(t);for(const f of t.fields)a.values[f.id]=f.kind==='number'?String(f.answer):f.kind==='reason'?'Synthetic test calculation; the reasoning still needs review.':f.kind==='multi'?[...f.answer]:f.answer;a.explanation='Synthetic test work, not a student sample.';return a;}
function harness(kind='diagnostic',map=new Map(),width=620){
 const host=new Element('main');host.clientWidth=width;
 const storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)},body=new Element('body');
 const document={body,getElementById:id=>host.querySelector('#'+id),createElement:tag=>new Element(tag)};
 const window={document,localStorage:storage,navigator:{}},context=vm.createContext({window,document,Blob,URL:{createObjectURL:()=> 'blob:test',revokeObjectURL(){}},setTimeout:fn=>fn()});
 for(const file of ['challenge-bank-v1.js','challenge-bank.js','project-bank-v1.js','project-bank.js','project-tools.js','subject-foundations.js','foundation-bank.js','foundation-extension.js','foundation-engine.js','foundation-graphs.js','report-tools.js','report-store.js','foundation-app.js','report-viewer.js'])vm.runInContext(fs.readFileSync(path.join(root,'assets',file),'utf8'),context);
 const bank=kind==='project'?window.QuidenceProjectBank:kind==='foundation'?window.QuidenceFoundationBank:window.QuidenceChallengeBank;
 const engine=kind==='foundation'?window.QuidenceFoundationEngine:window.QuidenceFoundationEngine.forBank(bank,empty,{...settings,...(kind==='project'?{schema:'cluevera_project_portfolio_v1',projects:true,fieldTypes:window.QuidenceProjectTools.fieldTypes,checkTitle:'California-inspired field projects'}:{})});
 const controller=window.QuidenceFoundationApp.mount(host,{bank,engine,extension:kind==='foundation'?window.QuidenceFoundationExtension:empty,module:'ab01',storage});
 function click(action,index){const button=host.all().find(x=>x.dataset.fAction===action&&(index===undefined||x.dataset.index===String(index)));assert(button,action);assert(!button.disabled,action+' is disabled');host.events.click({target:button,preventDefault(){}});}
 function input(id,value){const field=host.querySelector('[data-f-field="'+id+'"]');assert(field,id);field.value=String(value);host.events.input({target:field});}
 function fill(t){const answer=canonical(engine,t);for(const f of t.fields){if(f.kind==='choice'||f.kind==='multi'){for(const v of f.kind==='multi'?answer.values[f.id]:[answer.values[f.id]]){const field=host.querySelectorAll('[data-f-field="'+f.id+'"]').find(x=>Number(x.dataset.fOption)===f.options.findIndex(o=>o.value===v));field.checked=true;host.events.input({target:field});}}else input(f.id,answer.values[f.id]);}const field=host.querySelector('[data-f-explanation]');field.value=answer.explanation;host.events.input({target:field});}
 const submit=()=>host.events.submit({target:host.querySelector('[data-f-answer]'),preventDefault(){}});
 function finish(){click('resume');for(const t of engine.tasks(controller.current())){fill(t);submit();click('next');}}
 return{host,map,storage,window,engine,controller,click,input,fill,submit,finish};
}
test('the reported projection and regression decimals match under the displayed final-answer rule',()=>{
 const s=E.createSession(E.fresh(),'ab01');
 for(const[id,values]of [['la-c05',{c:'1.1111',r1:'0.89',r2:'-1.22',r3:'0.78'}],['la-c06',{alpha:'1.17',sse:'0.1667'}]]){
  const t=E.tasks(s).find(t=>t.id===id),a=canonical(E,t);Object.assign(a.values,values);E.edit(s,t,a);assert(E.submit(s,t).ok);assert.equal(E.last(s,t).objective.state,'matched');assert.equal(E.last(s,t).numericPolicy,E.NUMERIC_POLICY);assert.equal(E.nextChecks(s).find(o=>o.id===id),undefined);
 }
 const t=E.tasks(s).find(t=>t.id==='la-c05'),a=canonical(E,t);a.values.c='1.10';E.edit(s,t,a);E.submit(s,t);assert.equal(E.last(s,t).objective.parts.c,false);
 assert(E.numberMatches(t.fields[0],'10/9',E.NUMERIC_POLICY));assert(!E.numberMatches(t.fields[0],'11/10',E.NUMERIC_POLICY));
 assert(E.numberMatches({answer:-16},'−16',E.NUMERIC_POLICY));assert(!E.numberMatches({answer:2},'2.004',E.NUMERIC_POLICY));
});
test('the rounding rule covers non-integer number fields across all four shared check families',()=>{
 let checked=0;
 for(const bank of [B,require('../assets/foundation-extension.js'),D,PB])for(const m of Object.values(bank.MODULES))for(const t of m.tasks)for(const f of t.fields.filter(f=>f.kind==='number'&&!Number.isInteger(f.answer))){
  assert(F.numberMatches(f,f.answer.toFixed(2),F.NUMERIC_POLICY),t.id+' '+f.id);checked++;
 }
 assert(checked>19);
});
test('legacy strict outcomes remain immutable and are distinguished from current precision checks',()=>{
 const p=E.fresh(),s=E.createSession(p,'ab01'),t=E.tasks(s).find(t=>t.id==='la-c05'),a=canonical(E,t);a.values.c='1.1111';a.values.r1='0.89';
 E.edit(s,t,a);E.submit(s,t);const old=E.last(s,t);old.objective=E.evaluate(t,a);delete old.numericPolicy;
 const original=JSON.stringify(old);assert(E.hydrate(p));assert.equal(JSON.stringify(E.last(s,t)),original);
 const observation=E.observations(s).find(o=>o.id===t.id);assert.equal(observation.components.filter(c=>c.state==='rounding-review').length,2);assert.equal(E.evidenceSummary(s).recheck,0);
 E.submit(s,t);assert.equal(JSON.stringify(s.records[t.id].submissions[0]),original);assert.equal(E.last(s,t).objective.parts.c,true);
 const bad=structuredClone(p);bad.modules.ab01.sessions[0].records[t.id].submissions[1].numericPolicy='unrecognized-policy';assert.equal(E.hydrate(bad),null);
});
test('opening or switching entry pages does not create empty saved checks; starting persists the session',()=>{
 for(const kind of ['foundation','diagnostic','project']){
  const h=harness(kind);assert.equal(h.map.size,0);assert.equal(h.controller.portfolio().modules.ab01.sessions.length,0);assert.match(h.host.innerHTML,/Saved checks \(0\)/);
  h.controller.select('ae01');assert.equal(h.map.size,0);h.controller.select('ab01');h.click('resume');assert.equal(h.controller.portfolio().modules.ab01.sessions.length,1);assert(h.map.has(h.engine.SCHEMA));
  const before=h.map.get(h.engine.SCHEMA);h.click('intro');h.click('new');assert.equal(h.controller.portfolio().modules.ab01.sessions.length,1);assert.equal(h.map.get(h.engine.SCHEMA),before.replace('"view":"task"','"view":"intro"'));
 }
});
test('subject names and relative subject order agree across the three available check menus',()=>{
 const lists=[];
 for(const kind of ['foundation','diagnostic','project']){
  const h=harness(kind),menu=h.host.querySelector('#f-subject');
  const ids=menu.children.filter(x=>x.tagName==='option').map(x=>x.value);
  lists.push(ids.filter(id=>['af01','ad01','ae01','ab01'].includes(id)));
  assert.match(h.host.innerHTML,/>Linear Algebra<\/option>/);assert.doesNotMatch(h.host.innerHTML,/>Linear algebra foundations<\/option>/);
 }
 assert.deepEqual(lists[0],lists[1]);assert.deepEqual(lists[1],lists[2]);
});
test('earlier task definitions stay pinned while new checks distinguish rank and inverse shortcuts',()=>{
 const oldD=require('../assets/challenge-bank-v1.js'),oldP=require('../assets/project-bank-v1.js');
 assert.deepEqual(D.HISTORY[oldD.VERSION],oldD.MODULES);assert.deepEqual(PB.HISTORY[oldP.VERSION],oldP.MODULES);
 const rank=D.MODULES.ab01.tasks.find(t=>t.id==='la-c11');assert.deepEqual(rank.fields[0].answer,['one']);assert.equal(rank.fields.find(f=>f.id==='rank').answer,2);
 const atOne=[[1,2,1],[0,0,2],[0,0,0]];assert.equal(atOne.filter((r,i)=>r[i]!==0).length,1);assert(atOne[0][0]*atOne[1][2]!==0);
 const inverse=PB.MODULES.ab01.tasks.find(t=>t.id==='la-p02'),x=inverse.fields.find(f=>f.id==='inputX').answer,y=inverse.fields.find(f=>f.id==='inputY').answer;
 assert.deepEqual([-y,2*x],[-4,2]);assert.notDeepEqual([-y,2*x],[-2,6]);
 const p=E.fresh(),s=E.createSession(p,'ab01');s.bankVersion=oldD.VERSION;assert.match(E.tasks(s).find(t=>t.id==='la-c11').prompt,/k\+2/);assert(E.hydrate(p));
});
test('the mapped triangle is withheld from the active question and appears in the completed report',()=>{
 const h=harness(),area=D.MODULES.ab01.tasks.find(t=>t.id==='la-c08');h.click('resume');h.click('jump',7);
 assert.doesNotMatch(h.host.innerHTML,/data-polygon="mapped"/);assert.match(h.host.innerHTML,/data-polygon="original"/);
 h.click('jump',0);h.click('intro');h.finish();assert.match(h.host.innerHTML,/data-polygon="mapped"/);assert(area.referenceVisual.polygons.some(p=>p.style==='mapped'));
});
test('vector arrows use equal coordinate units and the starting-point label is below the arrow',()=>{
 const t=B.MODULES.ab01.tasks[0];
 for(const width of [240,375,520,620]){
  const html=G.visual(t,width),[,w,h]=html.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number),v=t.visual;
  assert(Math.abs((w-68)/(v.xmax-v.xmin)-(h-64)/(v.ymax-v.ymin))<1e-9);
  const label=Number(html.match(/class="f-point-label" x="[^"]+" y="([^"]+)"/)[1]),point=22+(v.ymax-1)/(v.ymax-v.ymin)*(h-64);assert(label>point);
 }
});
test('downstream follow-ups combine repeated reasons while preserving each affected component',()=>{
 const s=E.createSession(E.fresh(),'ab01'),t=E.tasks(s).find(t=>t.id==='la-c05'),a=canonical(E,t);Object.assign(a.values,{c:'0',r1:'2',r2:'1',r3:'3'});E.edit(s,t,a);E.submit(s,t);
 const reasons=E.nextChecks(s).find(o=>o.id===t.id).followupReasons,dependent=reasons.filter(r=>r.includes('Recheck after Projection coefficient c'));
 assert.equal(dependent.length,1);for(const f of t.fields.filter(f=>f.id.startsWith('r')))assert(dependent[0].includes(f.label));
 assert.equal(E.observations(s).find(o=>o.id===t.id).components.filter(c=>c.state==='recheck').length,4);
});
test('reports distinguish mathematical parts and whole explanations and render legacy subject names without rewriting them',()=>{
 const h=harness('project');assert.match(h.host.innerHTML,/after both responses are saved/);h.finish();
 assert.match(h.host.innerHTML,/these two California-inspired field projects/);assert.doesNotMatch(h.host.innerHTML,/2-question california|PROJECT 1 OF 2.*PROJECT.*TARGET/);
 const md=h.engine.markdown(h.controller.current());assert.match(md,/mathematical response parts awaiting review/);assert.match(md,/Whole-answer explanations awaiting review/);
 const data=S.read(h.storage).data;data.items[0].subject='Linear algebra foundations';h.storage.setItem(S.KEY,JSON.stringify(data));const before=h.storage.getItem(S.KEY),viewer=new Element('main');h.window.QuidenceReportViewer.mount(viewer,{storage:h.storage});
 assert.match(viewer.innerHTML,/Linear Algebra · California-inspired field projects/);assert.equal(h.storage.getItem(S.KEY),before);
});
test('Calculus and Pre-calculus recurring decimals agree with project precision instructions',()=>{
 const s=E.createSession(E.fresh(),'ad01'),t=E.tasks(s).find(t=>t.id==='ca-c03'),a=canonical(E,t);
 Object.assign(a.values,{net:'1.3333',position:'6.3333'});E.edit(s,t,a);E.submit(s,t);assert.equal(E.last(s,t).objective.state,'matched');
 const pc=B.MODULES.af01.tasks.find(t=>t.id==='af-f10');assert(F.numberMatches(pc.fields[0],'0.8333',F.NUMERIC_POLICY));
 for(const m of Object.values(PB.MODULES))for(const t of m.tasks)for(const step of [t,...t.steps])assert.doesNotMatch(step.prompt,/four decimals|four decimal places/);
 for(const answer of [4/3,28/15,-1/15,3*Math.sqrt(3),Math.sqrt(52),Math.atan2(3*Math.sqrt(3),-5)*180/Math.PI,Math.sqrt(52)/4])assert(F.numberMatches({answer},answer.toFixed(4),F.NUMERIC_POLICY));
 assert(!F.numberMatches({answer:4/3},'1.32',F.NUMERIC_POLICY));assert(!F.numberMatches({answer:5/6},'0.82',F.NUMERIC_POLICY));
});
test('the revised maximum question does not reveal its location in the requested answer format',()=>{
 const maximum=D.MODULES.ad01.tasks.find(t=>t.id==='ca-c02');assert.doesNotMatch(maximum.prompt,/m e|e\^\(−2\)/);
 assert(Math.abs(maximum.fields.find(f=>f.id==='m').answer-4/Math.E**2)<1e-12);
 assert(maximum.fields.find(f=>f.id==='m').answer>16/Math.E**4);
 assert(F.numberMatches(maximum.fields.find(f=>f.id==='m'),'0.5413',F.NUMERIC_POLICY));
 assert.doesNotMatch(D.MODULES.af01.tasks.find(t=>t.id==='pc-c02').prompt,/coefficients of π/);
 const old=D.HISTORY['cluevera-challenges-1'].ad01.tasks.find(t=>t.id==='ca-c02');assert.equal(old.fields.find(f=>f.id==='m').answer,4);assert.match(old.prompt,/m e/);
});
test('public option attributes stay neutral while saved choices and restored drafts retain their original identifiers',()=>{
 const h=harness('foundation');h.controller.select('af01');h.click('resume');h.click('jump',5);
 assert.doesNotMatch(h.host.innerHTML,/value="(?:correct|wrong|minus)"/);
 const t=B.MODULES.af01.tasks[5];h.fill(t);h.submit();
 assert.equal(h.controller.current().records[t.id].draft.values.inverse,'correct');assert.equal(h.engine.last(h.controller.current(),t).objective.parts.inverse,true);
 const restored=harness('foundation',h.map);restored.controller.select('af01');restored.click('intro');restored.click('resume');restored.click('jump',5);
 assert(restored.host.querySelectorAll('[data-f-field="inverse"]').find(x=>x.dataset.fOption==='0').checked);
 const second=restored.host.querySelectorAll('[data-f-field="inverse"]').find(x=>x.dataset.fOption==='1');second.checked=true;restored.host.events.input({target:second});
 assert.equal(restored.controller.current().records[t.id].draft.values.inverse,'wrong');
});
test('Calculus point labels have a white outline, clear offsets, and retain function-plot scale',()=>{
 for(const id of ['ad-f04','ad-f07'])for(const width of [240,375,520,620]){
  const html=G.visual(B.MODULES.ad01.tasks.find(t=>t.id===id),width),labels=[...html.matchAll(/<text class="f-point-label"[^>]*>/g)];
  assert.equal(labels.length,2);for(const label of labels){assert.match(label[0],/stroke="#fff"/);assert.match(label[0],/paint-order="stroke"/);}
  assert.match(html,new RegExp('viewBox="0 0 '+width+' 280"'));
 }
 const h=harness('foundation');h.controller.select('ad01');h.click('resume');h.click('jump',4);
 assert.match(h.host.innerHTML,/checks the meaning of derivative notation, not calculating a tangent slope independently/);
});
