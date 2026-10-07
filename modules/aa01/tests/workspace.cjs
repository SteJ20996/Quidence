// DOM-shape and application-state checks; this is not a layout or native-browser test.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const decode=s=>String(s).replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
function load(config={}){
 let time=1000,nodes=[],tools=new Map();
 class Element{
  constructor(tag='div',attrs={}){this.tagName=tag;this.attributes={...attrs};this.dataset={};for(const [k,v]of Object.entries(attrs))if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;this.value=attrs.value??'';this.style={};this.disabled='disabled'in attrs;this.hidden='hidden'in attrs;this.listeners={};this.textContent='';this._html='';}
  appendChild(el){nodes.push(el);return el;}
  setAttribute(k,v){this.attributes[k]=String(v);}getAttribute(k){return this.attributes[k];}
  get classList(){return {add:(name)=>{const classes=new Set((this.attributes.class??'').split(' ').filter(Boolean));classes.add(name);this.attributes.class=[...classes].join(' ');}};}
  addEventListener(k,f){(this.listeners[k]??=[]).push(f);}
  fire(k){for(const f of this.listeners[k]??[])f({target:this});if(this['on'+k])this['on'+k]({target:this});}
  click(){if(!this.disabled)this.fire('click');}
  focus(){}scrollIntoView(){}showModal(){this.open=true;}close(){this.open=false;}
  set innerHTML(s){this._html=s;if(this===app)nodes=parse(s);else{const descendants=parse(s);nodes=nodes.filter(n=>!this._desc?.includes(n));nodes.push(...descendants);this._desc=descendants;}}
  get innerHTML(){return this._html;}
 }
 function parse(html){const out=[];for(const m of html.matchAll(/<([a-z][a-z0-9-]*)(\s[^>]*|)>/gi)){
  const attrs={};for(const a of m[2].matchAll(/([\w:-]+)(?:="([^"]*)"|='([^']*)'|=([^\s>]+))?/g))attrs[a[1]]=decode(a[2]??a[3]??a[4]??'');
  const el=new Element(m[1],attrs),tail=html.slice(m.index+m[0].length),text=tail.split('</'+m[1]+'>')[0];
  el.textContent=decode(text.replace(/<[^>]*>/g,''));if(m[1]==='textarea')el.value=decode(text);out.push(el);
 }return out;}
 function matches(el,selector){
  const last=selector.trim().split(/\s+/).at(-1);if(last.startsWith('#'))return el.attributes.id===last.slice(1);
  const tag=last.match(/^[a-z]+/)?.[0];if(tag&&el.tagName!==tag)return false;
  const cls=last.match(/^\.([\w-]+)/)?.[1];if(cls&&!(el.attributes.class??'').split(' ').includes(cls))return false;
  for(const m of last.matchAll(/\[([\w-]+)(?:=["']?([^\]"']+)["']?)?\]/g))if(!(m[1]in el.attributes)||m[2]!==undefined&&el.attributes[m[1]]!==m[2])return false;
  return true;
 }
 const app=new Element('main',{id:'app'});
 const archiveMap=config.storage??new Map(),document={createElement:t=>new Element(t),querySelector(s){return s==='#app'?app:nodes.find(n=>matches(n,s))??null;},querySelectorAll(s){return nodes.filter(n=>s.split(',').some(part=>matches(n,part)));},modelContext:{registerTool(t){tools.set(t.name,t);}}};
 class MockDate extends Date{static now(){return time;}}
 const context={window:{scrollTo(){},addEventListener(){}},document,crypto,structuredClone,Date:MockDate,Blob,URL,AbortController,setInterval(){},setTimeout(){},clearTimeout(){},console};context.window.document=document;context.window.localStorage={getItem:k=>archiveMap.get(k)||null,setItem:(k,v)=>archiveMap.set(k,v)};vm.createContext(context);
 vm.runInContext(fs.readFileSync(path.join(root,'../../assets/report-tools.js'),'utf8'),context);
 vm.runInContext(fs.readFileSync(path.join(root,'../../assets/report-store.js'),'utf8'),context);
 for(const f of config.files??['rubric.js','reason-evidence.js','reasoning.js','geometry.js','adaptive.js','sketch-lab/math.js','integrated.js',...(config.persistence?['session-store.js']:[])])vm.runInContext(fs.readFileSync(path.join(root,'dist',f),'utf8'),context);
 let source=fs.readFileSync(path.join(root,'dist',config.entry??'app.js'),'utf8').replace(config.marker??'  registerPageTools();',config.expose??'  window.testOnly={state,expected,required,collect,check,ensure,submit,advance,goto,renderQuestion,renderReport,updateTimer,activityTime,form,findings,coordinateGraph,conditionalResults,costBlockDiagram,costSpec,routeAdaptive,sessionExport,saveProgress,restoreProgress,printableReport,sessionMarkdown};\n  registerPageTools();');
 vm.runInContext(source,context);
 const q=s=>document.querySelector(s),qa=s=>document.querySelectorAll(s);
 return {archiveMap,api:context.window.testOnly,reason:context.window.QuidenceReasoning,app,tools,q,qa,tick(ms){time+=ms;},input(k,value){const el=q(`[data-n="${k}"]`);assert(el,`missing field ${k}`);el.value=String(value);el.fire('input');},choose(k,value){const el=q(`[data-choice="${k}"][data-value="${value}"]`)??q(`[data-line="${k}"][data-value="${value}"]`);assert(el,`missing choice ${k}=${value}`);el.click();},text(s){q('[data-text="why"]').value=s;q('[data-text="why"]').fire('input');}};
}
module.exports={load};
if(require.main===module){
 const h=load();assert.equal(h.api.state.phase,'assessment');assert.equal(h.api.state.queue.length,19);assert(!h.api.state.queue.includes('S5'));assert(h.app.innerHTML.includes('Where does −1.5 belong?'));
 // First activity regression: incomplete selections do not become attempts, wrong tries keep counting, correct answers stop.
 h.choose('point','-1.25');h.q('#submit').click();assert(h.q('#validation').textContent.includes('distance from zero'));assert.equal(h.api.state.records.C1.attempts.length,0);
 h.choose('near','-0.5');h.tick(1000);h.q('#submit').click();assert.equal(h.api.state.records.C1.score.correct,false);assert.equal(h.api.state.records.C1.complete,null);h.tick(1000);h.api.updateTimer();assert.equal(h.q('#timer').textContent,'0:02');
 h.choose('point','-1.5');h.q('#submit').click();assert.equal(h.api.state.records.C1.score.correct,true);h.tick(5000);h.api.updateTimer();assert.equal(h.q('#timer').textContent,'0:02');
 h.api.goto(0);assert.equal(h.api.state.records.C1.complete,3000);assert.equal(h.api.collect().point,-1.5);assert.equal(h.api.collect().near,'-0.5');
 // Draft preservation and active time exclude other views and snapshot time.
 h.api.goto(2);h.input('one','2.5');h.input('two','5');h.tick(3000);h.api.goto(7);h.tick(9000);h.api.goto(2);assert.equal(h.api.collect().one,2.5);assert.equal(h.api.collect().two,5);assert.equal(h.api.activityTime(h.api.state.records.C3),3000);
 h.input('five','12.5');h.input('rate','2.5');h.q('#submit').click();h.tick(4000);h.api.updateTimer();assert.equal(h.api.activityTime(h.api.state.records.C3),3000);assert(!h.q('#feedback').innerHTML.includes('correct'));
 // Signed typing, paste, sign changes, and fractional magnitudes.
 h.api.goto(8);h.input('m','-1');h.input('b','2');assert.equal(h.api.collect().m,-1);assert.equal(h.q('[data-sign="m"]').textContent,'−');h.q('[data-sign="m"]').click();assert.equal(h.api.collect().m,1);h.input('m','−1/2');assert.equal(h.api.collect().m,-.5);h.input('m','+1/2');assert.equal(h.api.collect().m,.5);h.input('m','1/0');assert(Number.isNaN(h.api.collect().m));
 // Graph tab changes only the view; it does not score or clear inputs.
 h.api.goto(7);h.input('m','2');h.input('b','3');h.q('[data-view="graph"]').click();assert.equal(h.q('[data-view-panel="graph"]').hidden,false);assert.equal(h.q('[data-view-panel="table"]').hidden,true);assert.equal(h.api.collect().m,2);
 h.api.goto(6);h.input('boundary','3');h.choose('dot','closed');h.choose('ray','right');assert(h.q('#inequality-visual').innerHTML.includes('Filled')===false);assert(h.q('#inequality-visual').innerHTML.includes('boundary 3, closed, right'));assert(h.q('#inequality-visual').innerHTML.includes('M468 57'));
 // Four mission views, with S6 inside Explore and previous values carried into graph.
 h.api.goto(h.api.state.queue.indexOf('S1'));for(const [k,v]of Object.entries({setupA:24,rateA:3,setupB:6,rateB:5}))h.input(k,v);h.text('Setup is paid once and rate is multiplied by n.');h.q('#submit').click();h.api.advance();
 for(const [k,v]of Object.entries({a6:42,b6:36,a12:60,b12:66}))h.input(k,v);h.q('#submit').click();h.api.advance();assert.equal(h.api.state.queue[h.api.state.index],'S3');assert.equal(h.api.collect().a0,24);assert.equal(h.api.collect().b12,66);assert(h.q('#sports-graph').innerHTML.includes('A points (0, 24), (12, 60)'));
 h.input('meetN','9');h.input('meetC','51');h.text('Both plans cost the same at that point.');h.q('#submit').click();h.api.advance();assert.equal(h.api.state.queue[h.api.state.index],'S6');assert(h.app.innerHTML.includes('Challenge the claim'));assert(h.app.innerHTML.includes('Connect the graph'));
 for(const [k,v]of Object.entries({counterN:12,counterA:60,counterB:66}))h.input(k,v);h.text('One counterexample disproves always.');h.q('#submit').click();h.api.advance();assert.equal(h.api.state.queue[h.api.state.index],'S4');
 for(const [k,v]of Object.entries({maxA:22,maxB:16,costA:90,nextA:93,costB:86,nextB:91}))h.input(k,v);h.q('#submit').click();assert.equal(h.api.state.records.S4.score.correct,true);assert.equal(h.api.state.records.S4.reason.points,2);assert.equal(h.api.state.records.S4.reason.method,'structured_boundary_checks_bs02');assert(h.api.state.records.S4.reasonSource);
 const event=h.api.state.events.at(-1);assert.equal(event.item_version,'0.6');assert.equal(event.response.fields.nextB,91);assert(event.timing.total_active_ms>=0);
 // Open report and return without destroying a saved answer or its scoring.
 h.q('#snapshot').click();assert.equal(h.api.state.phase,'report');assert(JSON.parse(h.archiveMap.get('cluevera_saved_reports_v1')).items[0].versions[0].payload.taskContext.every(t=>t.reference===null||t.id));assert(h.app.innerHTML.includes('submitted'));assert(!h.app.innerHTML.includes('undefined/2'));h.q('#return-work').click();assert.equal(h.api.state.records.S4.complete!==null,true);assert.equal(h.api.state.records.S4.reason.points,2);
 // Editing invalidates prior credit, but history remains. Wrong boundary calculations do not reuse the structured explanation.
 h.input('maxA','23');assert.equal(h.api.state.records.S4.complete,null);assert.equal(h.api.state.records.S4.reasonSource,undefined);h.input('costA','93');h.input('nextA','96');h.q('#submit').click();assert.equal(h.api.state.records.S4.score.correct,false);assert(h.api.state.records.S4.reason.reviewReasons.includes('missing_explanation'));
 const conditional=h.api.conditionalResults('S4',{maxA:23,maxB:16,costA:93,nextA:96,costB:86,nextB:91});assert.equal(conditional.costA.correct,true);assert.equal(conditional.maxA.correct,false);
 // Pending drafts are not reported as wrong and do not expose their answer key.
 const empty=load();empty.q('#snapshot').click();assert(empty.app.innerHTML.includes('Not submitted'));assert(!empty.app.innerHTML.includes('−1.5 is midway'));empty.tick(10000);empty.q('#return-work').click();assert.equal(empty.api.activityTime(empty.api.state.records.C1),0);
 // Each accessible activity renders its objective fields and choices.
 const all=load();for(const id of [...all.api.state.queue,'FN','FP','FE','FG','FM','FB']){
  const html=all.api.form(id);assert(!html.includes('undefined'),id);for(const key of all.api.required[id].filter(k=>k!=='why'))assert(html.includes(`data-n="${key}"`)||html.includes(`data-choice="${key}"`)||html.includes(`data-line="${key}"`)||html.includes(`data-slider="${key}"`),`${id} field ${key}`);
 }
 // Replay available prior student explanations exactly; objective flags are from the prior screenshots.
 const fixture=JSON.parse(fs.readFileSync(path.join(__dirname,'previous-response-fixture.json'),'utf8'));
 const replay=fixture.explanations.map(row=>({id:row.item_id,...all.reason.evaluate(row.item_id,row.response,row.objective_correct_status)}));assert.equal(replay.length,11);assert.equal(replay.find(r=>r.id==='C10').points,2);assert.equal(replay.find(r=>r.id==='S6').points,null);
 // Representative valid/invalid tool paths through the registered action interface (mocked registry only).
 const page=load();assert.equal(page.tools.size,5);assert.throws(()=>page.tools.get('submit_quidence_answer').execute({activityId:'C2',answer:{}}));
 const accepted=page.tools.get('submit_quidence_answer').execute({activityId:'C1',answer:{point:-1.5,near:'-0.5'}});assert.equal(accepted.objectiveCorrect,true);page.tools.get('continue_quidence_session').execute({});assert.equal(page.api.state.queue[page.api.state.index],'C2');page.tools.get('submit_quidence_answer').execute({activityId:'C2',answer:{token:-8,end:-8}});page.tools.get('continue_quidence_session').execute({});assert.equal(page.tools.get('submit_quidence_answer').execute({activityId:'C3',answer:{one:2.5,two:5,five:12.5,rate:2.5}}).objectiveCorrect,null);
 console.log(JSON.stringify({result:'passed',scope:'DOM-shape and state checks; browser layout and native APIs unverified',checks:['C1 selections and timer','signed decimal/fraction inputs','navigation preserves drafts and excludes inactive time','table/graph and inequality views','four-view project with embedded S6','carried graph values','budget proof without redundant prose','revision invalidates old credit','early report preserves pending work','23 reachable activity forms','11 previous explanations replayed','tool action guards and delayed feedback']}));
}

