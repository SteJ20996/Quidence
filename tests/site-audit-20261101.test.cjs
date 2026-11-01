'use strict';
// Regressions for the 2026-11-01 site audit: grading, evidence labels, page counts and wording.
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8');

test('Linear Algebra matches a typed component exactly: 3.009 is not 3',()=>{
 const E=require('../modules/ab01/dist/engine.js'),v1=E.TASKS.find(t=>t.id==='v1');
 assert.deepEqual(E.score(v1,{values:[3,-2]}),{Coordinates:true});
 for(const values of [[3.009,-2.009],[3.001,-2],[3,-1.999]])assert.deepEqual(E.score(v1,{values}),{Coordinates:false},values.join(', '));
 const c1=E.TASKS.find(t=>t.id==='c1');assert.deepEqual(E.score(c1,{values:[2,1],touched:true}),{Construction:true});
 // A domain with an inexact answer is no longer reported as independent evidence.
 const records={v1:{status:'submitted',answer:{values:[3.009,-2.009]}},v2:{status:'submitted',answer:{values:[3,-2],moved:true}}};
 assert.equal(E.evidence(records,'representation').state,'Conflicting evidence');
});

test('an Algebra answer entered after the reference answer was shown is not independent evidence',()=>{
 const {load}=require('../modules/aa01/tests/workspace.cjs'),expose='window.testOnly={state,goto,submit,feedbackText,renderReport,sessionMarkdown,signal};';
 // Skip Q10, open the report (which shows the reference), then return and enter the reference values.
 const h=load({expose});h.api.goto(9);assert.equal(h.api.state.queue[h.api.state.index],'C10');
 h.q('#skip').click();const r=h.api.state.records.C10;assert.equal(r.skip,true);
 h.api.state.phase='report';h.api.renderReport();assert(Number.isFinite(r.referenceShownAt));assert(h.app.innerHTML.includes('C = 12 + 5v. Three visits cost $27'));
 const shownAt=r.referenceShownAt;h.api.renderReport();assert.equal(r.referenceShownAt,shownAt,'the first time the reference was shown is kept');
 h.api.state.phase='assessment';h.api.goto(9);h.api.submit({model:'12+5v',cost:27,why:'The fee is paid once and each visit adds 5.'});
 assert.equal(r.score.correct,true);assert.equal(r.attempts.at(-1).afterReference,true);
 const event=h.api.state.events.at(-1);assert.deepEqual([...new Set(event.objective_components.map(c=>c.support_level))],['after_reference_answer']);
 assert.equal(event.support.reference_answer_shown_at_ms,shownAt);
 assert.match(h.api.feedbackText(r),/submitted after the reference answer was shown, so it is not independent evidence/);
 const signal=h.api.signal(['C8','C9','C10']);assert(!signal.first.includes(r));assert.match(signal.description,/C10/);
 // Without a shown reference, the same correct answer stays independent.
 const g=load({expose});g.api.goto(9);g.api.submit({model:'12+5v',cost:27,why:'The fee is paid once.'});
 assert.deepEqual([...new Set(g.api.state.events.at(-1).objective_components.map(c=>c.support_level))],['independent']);
 assert.equal(g.api.state.records.C10.attempts[0].afterReference,undefined);
 // The saved session reloads with its marker; a malformed marker is rejected rather than trusted.
 const Store=require('../modules/aa01/dist/session-store.js'),saved=JSON.parse(JSON.stringify(h.api.state));
 assert(Store.hydrate({schema:Store.KEY,savedAt:Date.now(),state:saved}),'a session with a reference marker reloads');
 saved.records.C10.referenceShownAt='soon';assert.equal(Store.hydrate({schema:Store.KEY,savedAt:Date.now(),state:saved}),null);
});

test('project-course pages state the project and step counts their data actually has',()=>{
 for(const[page,data]of [['cross-disciplinary/index.html','cross-disciplinary/data.json'],['courses/number-theory/index.html','courses/number-theory/data.json'],['courses/discrete-math/index.html','courses/discrete-math/data.json']]){
  const d=JSON.parse(read(data)),projects=Array.isArray(d)?d:d.projects,steps=projects.reduce((n,p)=>n+p.steps.length,0);
  assert(read(page).includes(`<small>${projects.length} projects · ${steps} steps · Go at your own pace</small>`),page);
 }
 assert(read('localization/cross-disciplinary-ui-extra-es.json').includes('"3 projects · 18 steps · Go at your own pace": "3 proyectos · 18 pasos · Avanza a tu ritmo"'));
});

test('the Basic Logic tool rule names exactly who may use the tools; earlier records keep their wording',()=>{
 const B=require('../assets/project-bank.js'),L=require('../assets/basic-logic-project-bank.js');
 const stage=bank=>bank['basic-logic'].tasks.find(t=>t.id==='bl-p01').steps[2];
 assert.match(stage(B.MODULES).prompt,/^A new rule says a member may use the power tools exactly when .* Members who do not meet this condition may not use them\./);
 assert.match(stage(B.HISTORY['quidence-projects-7']).prompt,/^A new rule says a member may use the power tools if they passed the quiz/);
 // Only the rule sentence and the task version change; fields and answers stay as published.
 const now=B.MODULES['basic-logic'].tasks,then=L.PUBLISHED['basic-logic-projects-1']['basic-logic'].tasks;
 assert.deepEqual(now.map(t=>t.fields),then.map(t=>t.fields));assert.deepEqual(now[1],then[1]);
 for(const id of Object.keys(B.HISTORY['quidence-projects-7']).filter(id=>id!=='basic-logic'))assert.deepEqual(B.HISTORY['quidence-projects-7'][id],B.MODULES[id],id);
 const es=JSON.parse(read('localization/basic-logic-projects-extra-es.json'));
 assert.match(es[stage(B.MODULES).prompt],/^Una nueva regla dice que un miembro puede usar las herramientas eléctricas exactamente cuando/);
 assert(es[stage(B.HISTORY['quidence-projects-7']).prompt],'the published wording keeps its translation');
});

test('the Benford test lab states the 5% conclusion with its random-sample premise',()=>{
 const app=read('cross-disciplinary/app.js'),es=read('localization/quantity-templates-es.json');
 assert(!app.includes('these first digits do not follow Benford’s law'));
 assert(app.includes('if these numbers were a random sample from Benford’s law, a value this large would happen less than 5% of the time, so the test rejects the law at the 5% level.'));
 assert(app.includes('Passing the test does not prove that the data follow it.'));
 assert(es.includes('"χ² is about [n], above 15.51: if these numbers were a random sample from Benford’s law, a value this large would happen less than 5% of the time, so the test rejects the law at the 5% level."'));
 assert(es.includes('"χ² is about [n], below 15.51: at the 5% level, no evidence against Benford’s law. Passing the test does not prove that the data follow it."'));
});
