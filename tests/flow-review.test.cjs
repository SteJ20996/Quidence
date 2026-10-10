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
 for(const file of ['challenge-bank-v1.js','challenge-bank-v2.js','challenge-bank-v3.js','physics-bank.js','challenge-bank-v4.js','physics-foundation-bank-v1.js','challenge-bank-v5.js','physics-foundation-bank.js','challenge-bank.js','project-bank-v1.js','project-bank-v2.js','project-bank-v3.js','physics-bank.js','project-bank-v4.js','physics-foundation-bank-v1.js','project-bank-v5.js','physics-foundation-bank.js','project-bank.js','project-tools.js','subject-foundations.js','foundation-bank.js','foundation-extension.js','foundation-engine.js','foundation-graphs.js','report-tools.js','report-store.js','foundation-app.js','report-viewer.js'])vm.runInContext(fs.readFileSync(path.join(root,'assets',file),'utf8'),context);
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
  const places=Math.max(2,1-Math.floor(Math.log10(Math.abs(f.answer))));
  assert(F.numberMatches(f,f.precision==='significant'?f.answer.toPrecision(3):f.answer.toFixed(places),F.NUMERIC_POLICY),t.id+' '+f.id);checked++;
 }
 assert(checked>19);
});
test('written precision rejects nearby wrong small numbers and safely reads scientific notation and requested units',()=>{
 const check=(answer,value,label='Value')=>F.numberMatches({answer,label},value,F.NUMERIC_POLICY);
 for(const value of ['0.035','0.04','1/25','0.00','0'])assert(!check(1/27,value),value);
 for(const value of ['1/27','0.037','0.0370','3.7e-2','3.7×10^(-2)'])assert(check(1/27,value),value);
 assert(!check(0.0049,'0.00'));assert(check(0.0049,'0.0049'));assert(check(0.0049,'4.9e-3'));
 assert(!check(6.67e-11,'0'));assert(!check(6.67e-11,'6e-11'));assert(check(6.67e-11,'6.67×10^-11'));
 assert(check(3e8,'3e8 m/s','Speed (m/s)'));assert(!check(3e8,'3e8 m/s²','Speed (m/s)'));
 assert(!check(2,'2.00000001'));assert(!check(2,'2 kg','Force (N)'));
 for(const value of ['1e999','1e-999','1e-308/1e308','Infinity','NaN','1/0','alert(1)','6.67×10^(-11','3+4'])assert.equal(F.numeric(value),null,value);
 const s=E.createSession(E.fresh(),'physics'),t=E.tasks(s).find(t=>t.id==='ph-c06'),a=canonical(E,t);
 Object.assign(a.values,{wavelength:'4 m',period:'3.3e-1 s',newWavelength:'2 m',echoDistance:'1.7×10^2 m'});
 E.edit(s,t,a);assert(E.submit(s,t).ok);assert.equal(E.last(s,t).objective.state,'matched');
});
test('previous broad-tolerance outcomes remain importable and are flagged for precision review without rewriting them',()=>{
 const p=E.fresh(),s=E.createSession(p,'geometry'),t=E.tasks(s).find(t=>t.id==='ge-c03'),a=canonical(E,t);
 a.values.fraction='0.035';E.edit(s,t,a);E.submit(s,t);
 const old=E.last(s,t);old.numericPolicy=F.LEGACY_NUMERIC_POLICY;old.objective=E.evaluate(t,a,F.LEGACY_NUMERIC_POLICY);
 assert(old.objective.parts.fraction);const before=JSON.stringify(old);
 assert(E.hydrate(p));assert.equal(JSON.stringify(E.last(s,t)),before);
 assert.equal(E.observations(s).find(o=>o.id===t.id).components.find(c=>c.id==='fraction').state,'rounding-review');
 E.submit(s,t);assert.equal(E.last(s,t).objective.parts.fraction,false);assert.equal(JSON.stringify(s.records[t.id].submissions[0]),before);
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
  const ids=menu.children.filter(x=>x.tagName==='OPTION').map(x=>x.value);
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
 assert.match(h.host.innerHTML,/supplied tangent slope to connect derivative notation with local change/);
 assert.match(h.engine.scopeReview(h.controller.current()).suppliedInformation.find(x=>x.task==='ad-f05').note,/checks the meaning of derivative notation, not calculating a tangent slope independently/);
});
test('three-choice displays balance correct positions within each block and stay stable after reload',()=>{
 let checked=0;
 for(const kind of ['foundation','diagnostic']){const h=harness(kind),menu=h.host.querySelector('#f-subject'),ids=menu.children.filter(x=>x.tagName==='OPTION').map(x=>x.value);
 for(const id of ids)for(const check of ['entry',...(kind==='foundation'&&h.window.QuidenceFoundationExtension.MODULES[id]?['followup']:[])]){
  h.controller.select(id);h.click('intro');if(check==='followup')h.click('followup');h.click('resume');const slots=[];
  for(const [index,t]of h.engine.tasks(h.controller.current()).entries())for(const f of t.fields.filter(f=>f.kind==='choice'&&f.options.length===3)){
   h.click('jump',index);const options=h.host.querySelectorAll('[data-f-field="'+f.id+'"]'),order=options.map(x=>Number(x.dataset.fOption));
   assert.deepEqual([...order].sort(),[0,1,2]);slots.push(order.indexOf(f.options.findIndex(o=>o.value===f.answer)));
   const reloaded=harness(kind,h.map);reloaded.controller.select(id);
   assert.deepEqual(reloaded.host.querySelectorAll('[data-f-field="'+f.id+'"]') .map(x=>Number(x.dataset.fOption)),order);
   h.fill(t);h.submit();assert.equal(h.engine.last(h.controller.current(),t).objective.parts[f.id],true);checked++;
  }
  for(let i=0;i+2<slots.length;i+=3)assert.deepEqual(slots.slice(i,i+3).sort(),[0,1,2]);
 }}
 assert(checked>=23);
});
test('Geometry C labels sit outside the triangle at narrow and wide widths',()=>{
 const t=D.MODULES.geometry.tasks.find(t=>t.id==='ge-c01'),[a,b]=t.visual.points.find(p=>p[2]==='C');
 for(const width of [240,375,520,620]){const html=G.visual(t,width),[,w,h]=html.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number),v=t.visual;
  const pointX=48+(a-v.xmin)/(v.xmax-v.xmin)*(w-68),pointY=22+(v.ymax-b)/(v.ymax-v.ymin)*(h-64);
  const label=html.match(/<text class="f-point-label" x="([^"]+)" y="([^"]+)"[^>]*>C<\/text>/);assert(label);
  assert(Number(label[1])<pointX);assert(Number(label[2])<pointY);assert.match(label[0],/text-anchor="end"/);
 }
});
test('overflow tables show an edge cue until the last column and release observers on rerender',()=>{
 const source=fs.readFileSync(path.join(root,'assets/foundation-graphs.js'),'utf8'),observers=[];
 const window={ResizeObserver:class{constructor(callback){this.callback=callback;this.boxes=[];this.disconnected=false;observers.push(this);}observe(box){this.boxes.push(box);}disconnect(){this.disconnected=true;}}};
 vm.runInNewContext(source,{window});const edge={hidden:true},box={scrollWidth:650,clientWidth:375,scrollLeft:0,parentElement:{querySelector:()=>edge},addEventListener(name,fn){this[name]=fn;}},host={querySelectorAll:()=>[box]};
 window.QuidenceFoundationGraphs.prepareTables(host);assert.equal(edge.hidden,false);box.scrollLeft=275;box.scroll();assert.equal(edge.hidden,true);
 box.scrollLeft=0;box.clientWidth=700;observers[0].callback();assert.equal(edge.hidden,true);
 box.clientWidth=375;window.QuidenceFoundationGraphs.prepareTables(host);assert(observers[0].disconnected);assert.equal(edge.hidden,false);
 host.querySelectorAll=()=>[];window.QuidenceFoundationGraphs.prepareTables(host);assert(observers[1].disconnected);
 const table=G.visual({table:{headers:['A','B attempts'],rows:[[1,2]]}});assert.match(table,/data-table-edge/);assert.match(table,/Swipe or scroll sideways/);
});
test('current Statistics sector names agree while archived definitions retain their original text',()=>{
 const current=PB.MODULES.ae01.tasks.find(t=>t.id==='st-p02'),legacy=PB.HISTORY['quidence-projects-3']||PB.HISTORY['cluevera-projects-3'];
 assert.doesNotMatch(JSON.stringify(current),/\bMain\b/);assert.match(JSON.stringify(current),/Longshore/);assert(legacy);
 assert.match(JSON.stringify(legacy.ae01.tasks.find(t=>t.id==='st-p02')),/\bMain\b/);
});
test('saved earlier numeric snapshots carry a precision notice without rewriting their original report',()=>{
 const h=harness(),p=h.engine.fresh(),s=h.engine.createSession(p,'ab01'),t=h.engine.task(s),a=canonical(h.engine,t);h.engine.edit(s,t,a);h.engine.submit(s,t);h.engine.last(s,t).numericPolicy=h.engine.LEGACY_NUMERIC_POLICY;
 S.save('ab01',h.engine.portable(s),s.id,h.storage);const before=h.storage.getItem(S.KEY),viewer=new Element('main');h.window.QuidenceReportViewer.mount(viewer,{storage:h.storage});
 viewer.events.click({target:viewer.querySelector('[data-r-action="open"]')});assert.match(viewer.innerHTML,/earlier numeric precision rule/);assert.equal(h.storage.getItem(S.KEY),before);
});
test('properly grouped thousands work with scientific notation and units while malformed commas are rejected',()=>{
 for(const [text,value]of [['3,000',3000],['1,234.50',1234.5],['-1,234e2',-123400],['6,000×10^3',6000000],['1,000/2,000',0.5]])assert.equal(F.numeric(text),value);
 assert(F.numberMatches({answer:3000,label:'Energy (J)'},'3,000 J',F.NUMERIC_POLICY));
 for(const text of ['3,00','3,0000','1,2,345','12,34.5','1,234,','3,14','1 000'])assert.equal(F.numeric(text),null,text);
});
test('authored corrections appear in questions and reports without changing definitions or original student wording',()=>{
 const h=harness('project');h.controller.select('ad01');const definition=JSON.stringify(PB.MODULES.ad01.tasks);h.click('resume');h.click('jump',1);
 assert.doesNotMatch(h.host.innerHTML,/non-rational numerical answers round final numeric answers/);assert.match(h.host.innerHTML,/For irrational results, round only the final answer/);
 h.click('jump',0);h.click('intro');h.finish();h.click('jump',0);h.input('direction','I travelled a metre. My modelling notes are unchanged.');h.submit();h.click('next');h.click('next');
 const md=h.engine.markdown(h.controller.current());assert.match(md,/I travelled a metre\. My modelling notes are unchanged/);assert.doesNotMatch(md,/total distance travelled|non-rational numerical answers round final numeric answers/);assert.equal(JSON.stringify(PB.MODULES.ad01.tasks),definition);assert(h.engine.studentSummary(h.controller.current()).checks.every(x=>!x.detail.includes('Read the open responses')));
 const further=harness('foundation');further.controller.select('aa01');further.click('followup');further.click('resume');assert.match(further.host.innerHTML,/3\/4 liter/);assert.doesNotMatch(further.host.innerHTML,/3\/4 litre/);
 const metadata=harness('project');metadata.controller.select('algebra-2');assert.match(metadata.host.innerHTML,/Analyze a basketball arc|Quadratic modeling/);assert.doesNotMatch(metadata.host.innerHTML,/Analyse|modelling/);
});
test('the given LA triangle labels O U V at every supported width without revealing its image or changing definitions',()=>{
 const t=D.MODULES.ab01.tasks.find(t=>t.id==='la-c08'),before=JSON.stringify(t);
 for(const width of [240,375,520,620]){const html=G.visual(t,width);for(const name of ['O','U','V'])assert.match(html,new RegExp('class="f-point-label"[^>]*>'+name+'<'));
  assert.equal((html.match(/class="f-dot"/g)||[]).length,3);assert.doesNotMatch(html,/data-polygon="mapped"/);
 }
 assert.equal(JSON.stringify(t),before);
});
test('activity navigation follows all ten subjects and preserves unfinished work when switching subjects',()=>{
 const catalog=require('../assets/course-catalog.js');
 for(const kind of ['diagnostic','project']){
  const h=harness(kind);
  for(const [id,c]of Object.entries(catalog.COURSES).filter(([,c])=>c.challenge)){
   h.controller.select(id);const links=h.host.querySelectorAll('[data-f-mode]');
   assert.equal(links.length,3);const mode=kind==='project'?'projects':'check';
   for(const link of links){const url=new URL(link.attrs.href,'https://quidence.test/'+(kind==='project'?'projects':'diagnostics')+'/');
    assert.equal(link.attrs['aria-current']==='page',link.dataset.fMode===mode);
    if(link.dataset.fMode==='learn')assert.equal(url.pathname,'/'+c.course);else assert.equal(url.searchParams.get('module'),id);
    if(link.dataset.fMode!==mode){assert.equal(link.attrs.target,'_blank');assert.equal(link.attrs.rel,'noopener');}
   }
   assert.equal(h.host.querySelector('#f-subject').value,id);
  }
  h.controller.select('ab01');h.click('resume');const t=h.engine.task(h.controller.current()),field=t.fields.find(f=>f.kind==='number');h.input(field.id,'123/7');const before=JSON.stringify(h.controller.current().records);
  h.controller.select('af01');h.controller.select('ab01');assert.equal(JSON.stringify(h.controller.current().records),before);assert(h.host.querySelector('[data-f-action="report"]').disabled);assert.equal(h.host.querySelector('[data-f-field="'+field.id+'"]').value,'123/7');
 }
});

test('published activity documents and their incoming links use current resource fingerprints',()=>{
 assert.doesNotThrow(()=>require('../scripts/version-activity-assets.cjs').versionActivities(true));
});
