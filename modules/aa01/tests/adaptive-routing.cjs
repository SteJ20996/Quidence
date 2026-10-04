const assert=require('node:assert/strict'),a=require('../dist/adaptive.js'),{load}=require('./workspace.cjs');
const record=(parts,more={})=>({complete:100,skip:false,score:{parts,correct:Object.values(parts).every(Boolean)},attempts:[{score:{parts}}],supportAtSubmission:{hint_ids:[]},lastEventId:'submitted-1',...more});
assert.equal(Object.keys(a.tasks).length,18);
assert.equal(a.select('C1',record({point:false,near:true})).key,'N-midpoint');
assert.equal(a.select('C1',record({point:true,near:false})).key,'N-distance');
assert.equal(a.select('C1',record({point:true,near:true})).key,'N-stretch');
assert.equal(a.select('C8',record({m:false,b:true,pair:true})).key,'F-rate');
assert.equal(a.select('C8',record({m:true,b:false,pair:false})).key,'F-start');
assert.equal(a.select('C10',record({model:true,cost:false})).key,'M-substitute');
assert.equal(a.select('C10',record({model:false,cost:true})).key,'M-bridge');
const clean=record({point:true,near:true});assert.equal(a.select('C1',{...clean,reason:{points:null,status:'Needs review'}}).mode,'stretch');
assert.equal(a.select('C1',{...clean,started:-1000000}).mode,a.select('C1',clean).mode); // Timing is not an ability proxy.
assert.equal(a.select('C1',{...clean,supportAtSubmission:{hint_ids:['C1-clue']}}).mode,'confirm');
assert.equal(a.select('C1',{...clean,complete:null}),null);
assert.equal(a.select('C1',{...clean,skip:true,score:null,attempts:[]}).mode,'bridge');
const checked={
 'N-midpoint':{value:(-3-2)/2},'N-distance':{choice:'-0.25'},'N-confirm':{choice:'-1'},'N-stretch':{choice:'-5/4'},
 'R-bridge':{rate:10/4},'R-confirm':{total:7/2*5},'R-stretch':{total:6*1.5/.75,rate:6/.75},
 'E-bridge':{choice:'4x+4'},'E-confirm':{coefficient:2,constant:2*5},'E-stretch':{choice:'3x-12',value:3*(6-4)},
 'F-start':{choice:'4'},'F-rate':{rate:(10-4)/(2-0)},'F-confirm':{m:(4-(-2))/2,b:-2},'F-stretch':{m:6/4,value:-3+6/4*2},
 'M-bridge':{choice:'6+2s',total:6+2*3},'M-substitute':{total:12+5*2},'M-confirm':{start:18,total:18+4*3},'M-stretch':{max:4,cost:8+3*4,next:8+3*5}
};
for(const[key,answer]of Object.entries(checked))assert.deepEqual(a.tasks[key].answer,answer,key);
assert(Math.abs(-.25)<Math.abs(-2.5));assert(-5/4>-1.4);assert(a.tasks['M-stretch'].answer.cost<=20&&a.tasks['M-stretch'].answer.next>20);
for(const key of ['E-bridge','E-confirm'])for(const x of [-3,0,2,6]){const model=a.tasks[key].areaModel;assert.equal(model.height*(x+model.constant),model.height*x+model.height*model.constant);}
// Exercise every variant through the actual form, signed inputs, optional model and grader.
for(const[key,task]of Object.entries(a.tasks)){
 const h=load(),family=key[0],id={N:'FAN',R:'FAR',E:'FAE',F:'FAF',M:'FAM'}[family],anchor={N:'C1',R:'C3',E:'C5',F:'C8',M:'C10'}[family];
 h.api.state.adaptiveItems[id]={...structuredClone(task),variant_id:key,source_anchor:anchor,source_event_id:'fixture'};
 h.api.required[id]=[...task.fields.map(f=>f.key),'why'];h.api.expected[id]={...task.answer};h.api.state.queue.push(id);h.api.goto(h.api.state.queue.indexOf(id));
 assert(h.app.innerHTML.includes(task.prompt.replaceAll('−','−').split('<')[0]));
 for(const f of task.fields){if(f.type==='choice')h.choose(f.key,task.answer[f.key]);else h.input(f.key,task.answer[f.key]);}
 const panel=h.q('[data-optional-visual]');assert(panel,key);panel.click();assert.equal(h.api.collect().why,'');
 h.text('An unfamiliar but possibly valid explanation.');h.q('#submit').click();assert.equal(h.api.state.records[id].score.correct,true,key);assert.equal(h.api.state.records[id].reason.points,null,key);
 assert(h.api.state.events.at(-1).objective_components.every(c=>c.support_level==='hinted'));assert.equal(h.api.state.events.at(-1).item_variant,key);
 for(const c of h.api.state.events.at(-1).objective_components)assert.equal(c.construct,task.fields.find(f=>f.key===c.subpart).label);
 h.q('#snapshot').click();assert(h.app.innerHTML.includes('Component and answer review'));
}
// Complete journeys must insert exactly one check per checkpoint and retain all base work.
for(const scenario of ['clean','supported','mixed','skipped']){
 const h=load();let steps=0;
 while(h.api.state.phase==='assessment'&&steps++<40){
  const id=h.api.state.queue[h.api.state.index];
  if(scenario==='skipped'){h.q('#skip').click();continue;}
  const answer={...h.api.expected[id],why:'My reasoning can be reviewed.'};
  if(id==='S6')Object.assign(answer,{counterN:12,counterA:60,counterB:66});
  if(scenario==='supported'&&id==='C1')h.q('#hint').click();
  if(scenario==='supported'&&['C3','C5','C10'].includes(id))h.q('[data-optional-visual]').click();
  if(scenario==='mixed'&&id==='C5')Object.assign(answer,{cardA:'different',cardB:'same'});
  if(scenario==='mixed'&&id==='C8')Object.assign(answer,{m:3,b:3,pair:'1,5'});
  if(scenario==='mixed'&&id==='C10')answer.model='17v';
  h.api.submit(answer);assert(h.api.state.records[id].complete!==null,id);h.api.advance();
 }
 assert.equal(h.api.state.phase,'report',scenario);assert.equal(h.api.state.adaptiveDecisions.length,5,scenario);
 assert.equal(h.api.state.queue.filter(id=>/^C\d+$/.test(id)).length,11);assert(h.api.state.queue.includes('V1')&&h.api.state.queue.includes('D1'));assert(!h.api.state.queue.includes('S5'));
 assert.equal(new Set(h.api.state.queue).size,h.api.state.queue.length);assert(h.api.state.queue.length<=25);
 assert(h.app.innerHTML.includes('How your next checks were chosen'));assert.equal(h.api.sessionExport().adaptive_decisions.length,5);
 if(scenario==='clean')assert(h.api.state.adaptiveDecisions.every(d=>d.mode==='stretch'));
 if(scenario==='mixed')assert.equal(h.api.state.adaptiveItems.FAM.variant_id,'M-bridge');
 if(scenario==='skipped')assert(h.api.state.adaptiveDecisions.every(d=>d.mode==='bridge'));
}
// A served question is immutable even when its source answer is revised.
const h=load();h.api.submit({point:-1.5,near:'-0.5'});h.api.advance();const snapshot=JSON.stringify(h.api.state.adaptiveItems.FAN);
h.api.goto(h.api.state.queue.indexOf('C1'));h.q('#hint').click();h.api.submit({point:-1.5,near:'-0.5'});h.api.advance();assert.equal(JSON.stringify(h.api.state.adaptiveItems.FAN),snapshot);assert.equal(h.api.state.adaptiveDecisions.length,1);h.q('#snapshot').click();h.q('#restart').click();h.q('#confirm-restart').click();assert.equal(h.api.state.adaptiveDecisions.length,0);assert.equal(Object.keys(h.api.state.adaptiveItems).length,0);assert.equal(h.api.state.queue.length,18);
console.log(JSON.stringify({result:'passed',checks:['component-specific branch choices','no routing penalty from time or unknown wording','18 reviewed variant answers and mathematical identities','all variant forms, optional helpers, signed input and reports','clean, supported, mixed and skipped complete journeys','five bounded checks, no duplicate IDs','source event and variant export','served questions stay immutable'],scope:'DOM callbacks and reviewed local math; diagnostic validity and native browser behavior unverified'}));
