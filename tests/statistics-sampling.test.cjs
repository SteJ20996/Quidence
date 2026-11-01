'use strict';
// Statistics lesson 5: the exact sampling-distribution model, its answer keys, and records saved before the lesson existed.
const test=require('node:test'),assert=require('node:assert/strict');
const C=require('../modules/ae01/dist/content.js'),G=require('../assets/course-graphs.js'),create=require('../assets/course-engine.js').create,harness=require('./course-dom.cjs');
const E=create(C),lesson=C.LESSONS.find(l=>l.id==='sampling');
const answer=(choices,explanation='I compared the spread with the sample size.')=>({choices,explanation,otherHelp:false});

test('the chart lists the exact distribution of the mean of n spins, centered at 2.2 with variance 1.96/n',()=>{
 // Whole-number weights 8, 6, 3, 1, 1, 1 out of 20 for the values 1 to 6, kept exact with BigInt.
 const w=[8n,6n,3n,1n,1n,1n];assert.deepEqual(G.SPINNER,w.map(x=>Number(x)/20));
 for(let n=lesson.controls[0].min;n<=lesson.controls[0].max;n++){
  let sums=new Map([[0,1n]]);for(let i=0;i<n;i++){const next=new Map();for(const[s,c]of sums)w.forEach((x,v)=>next.set(s+v+1,(next.get(s+v+1)||0n)+c*x));sums=next;}
  const total=20n**BigInt(n),model=G.sampleMeans(n);assert.equal(model.length,sums.size);
  for(const{mean,p}of model){const c=sums.get(Math.round(mean*n));assert.ok(c!==undefined,'mean '+mean);assert.ok(Math.abs(p-Number(c)/Number(total))<1e-12,'n = '+n+', mean '+mean);}
  // Exact center and spread: Σ c·s = 11/5 · n · total, and Σ c·(5s − 11n)² = 49 · n · total (that is, Var(x̄) = 49/(25n)).
  let first=0n,second=0n;for(const[s,c]of sums){first+=c*BigInt(s);second+=c*(5n*BigInt(s)-11n*BigInt(n))**2n;}
  assert.equal(5n*first,11n*BigInt(n)*total,'center, n = '+n);assert.equal(second,49n*BigInt(n)*total,'variance, n = '+n);
  // The tallest bar stays below the μ ± SE bracket (bar height = probability × n × 150 px from a base at 236).
  assert.ok(236-150*Math.max(...model.map(x=>x.p*n))>64,'bars clear the bracket at n = '+n);
 }
 const r=G.lab('ae01',4,{n:16,curve:'normal'});
 assert.equal(r.readout,'n = 16 · Center of x̄ = 2.2 · Standard error = 1.4/√16 = 0.35');
 assert.equal(G.lab('ae01',4,{n:4,curve:'none'}).readout,'n = 4 · Center of x̄ = 2.2 · Standard error = 1.4/√4 = 0.7');
 assert.match(r.graph,/<polyline/);assert.doesNotMatch(G.lab('ae01',4,{n:16,curve:'none'}).graph,/<polyline/);
 // Every number the lesson states about this population.
 const text=lesson.steps.map(s=>s.text).join(' ');
 for(const s of ['0.40, 0.30, 0.15, 0.05, 0.05 and 0.05','μ = 2.2','σ² = Σ (x − μ)² P(x) = 1.96','σ = 1.4','1.4 at n = 1, 0.7 at n = 4 and 0.35 at n = 16','“Same riders, two training routines”'])assert.ok(text.includes(s),s);
 // The field project the lesson names exists in the Statistics project bank and divides s by √n.
 const st=require('../assets/project-bank.js').MODULES.ae01.tasks.find(t=>t.id==='st-p01');assert.equal(st.title,'Same riders, two training routines');
 const field=k=>st.fields.find(f=>f.id===k).answer;assert.ok(Math.abs(field('se')-Math.sqrt(field('variance'))/Math.sqrt(6))<1e-12);
});

test('the lesson questions are keyed to the computed answers',()=>{
 const [p,c9,c10]=[lesson.predict,...lesson.checks];
 assert.equal(p.correct[0],'half');assert.equal(Math.sqrt(16)/Math.sqrt(4),2);
 // Each option names what it compares with, so “a quarter of the population’s standard deviation” (σ/4, also true) is not an option.
 for(const o of p.options.filter(o=>o.id!=='same'))assert.match(o.label,/of the means of 4 values\.$/);
 assert.equal(c9.correct[0],'se');assert.equal(12/Math.sqrt(36),2);assert.equal(12/36,1/3);
 assert.equal(c10.correct[0],'means');
 for(const t of [p,c9,c10]){assert.equal(t.options.length,3);assert.equal(E.score(t,answer(t.correct)),'correct');}
});

// A complete record saved with the four earlier lessons, built with the earlier version's engine.
function earlierRecord(){
 const Old=create({...C,VERSION:'ae01-beta-0.1',PREVIOUS:[],LESSONS:C.LESSONS.slice(0,4)}),state=Old.fresh();
 for(const [i,l] of C.LESSONS.slice(0,4).entries()){
  for(const t of [l.predict,...l.checks]){Old.update(state,t.id,answer(t.correct,'Original reason for '+t.id+' — keep exactly.'));Old.submit(state,t.id,t===l.predict?'predict':'check');}
  state.lessons[i].seenSteps=[0,1,2,3];state.lessons[i].reviewed=true;
 }
 state.view='summary';state.labs[3].overlap=6;
 assert.ok(Old.hydrate(state),'the record was valid under the earlier version');assert.ok(Old.allDone(state));
 return JSON.parse(JSON.stringify(state));
}

test('a record saved before lesson 5 existed opens with its answers unchanged and an empty place for the new lesson',()=>{
 const old=earlierRecord(),up=E.hydrate(old);
 assert.ok(up,'the earlier record is readable');
 assert.equal(up.contentVersion,C.VERSION);assert.equal(up.lessons.length,5);assert.equal(up.labs.length,5);
 assert.deepEqual(up.records,old.records,'answers, drafts and submissions are unchanged');
 assert.deepEqual(up.lessons.slice(0,4),old.lessons);assert.deepEqual(up.labs.slice(0,4),old.labs);
 assert.deepEqual(up.lessons[4],{seenSteps:[],reviewed:false});assert.deepEqual(up.labs[4],lesson.defaults);
 assert.deepEqual(up.events.slice(0,-1),old.events,'earlier history is kept');
 const event=up.events.at(-1);assert.equal(event.type,'lessons_added');assert.equal(event.from,'ae01-beta-0.1');assert.equal(event.to,C.VERSION);assert.deepEqual(event.lessons,['sampling']);
 // The summary needs every lesson, so the record reopens at the course start, and resuming opens lesson 5; it is not done yet.
 assert.equal(up.view,'orientation');assert.equal(up.lessonIndex,4);assert.equal(up.stage,'predict');assert.equal(up.questionIndex,0);assert.equal(E.allDone(up),false);for(let i=0;i<4;i++)assert.ok(E.lessonDone(up,i));
 // Opening the upgraded record again adds nothing.
 assert.deepEqual(E.hydrate(up),up);
 // The input object is not modified.
 assert.equal(old.contentVersion,'ae01-beta-0.1');assert.equal(old.lessons.length,4);
});

test('the upgrade still rejects records that were not valid, and records from unknown versions',()=>{
 const tampered=earlierRecord(),id=Object.keys(tampered.records)[0];tampered.records[id].submissions[0].result='revisit';
 assert.equal(E.hydrate(tampered),null,'a changed result is still refused');
 const unknown=earlierRecord();unknown.contentVersion='ae01-beta-0.0';assert.equal(E.hydrate(unknown),null);
 // A summary view needs every earlier lesson finished; the upgrade does not turn such a record into a valid one.
 const early=earlierRecord();early.lessons[2].reviewed=false;assert.equal(E.hydrate(early),null);
 const wrongSize=earlierRecord();wrongSize.lessons.pop();wrongSize.labs.pop();assert.equal(E.hydrate(wrongSize),null);
 // The earlier version could not save lesson 5 answers, so a record that holds one, even a well-formed one, is refused.
 const stray=earlierRecord(),t=lesson.predict;stray.records[t.id]={draft:answer(t.correct),status:'submitted',feedbackSeen:false,submissions:[{at:'2026-11-01T00:00:00.000Z',answer:answer(t.correct),result:'correct',support:{phase:'predict',lessonSeen:false,feedbackSeen:false,otherHelp:false}}]};
 assert.equal(E.hydrate(stray),null);
});

test('the course page reopens an earlier record, says a lesson was added, and saves the upgrade without changing answers',()=>{
 const old=earlierRecord(),map=new Map([[E.SCHEMA,JSON.stringify(old)]]),h=harness('ae01',map);
 assert.doesNotMatch(h.app.innerHTML,/kept unchanged/);assert.match(h.app.innerHTML,/A new lesson was added after you started\. Your earlier answers and reasons are unchanged, and so are reports you saved or exported\./);
 assert.match(h.app.innerHTML,/Five starting points\./);assert.match(h.app.innerHTML,/after all five lessons\./);
 h.click('start');const saved=h.saved();assert.equal(saved.contentVersion,C.VERSION);
 // Every earlier record is saved exactly; resuming opens lesson 5, whose only record is an empty draft.
 for(const id of Object.keys(old.records))assert.deepEqual(saved.records[id],old.records[id],id);
 assert.equal(saved.view,'lesson');assert.equal(saved.lessonIndex,4);assert.deepEqual(Object.keys(saved.records).filter(id=>!old.records[id]),[lesson.predict.id]);assert.equal(saved.records[lesson.predict.id].status,'draft');
 // A record that never had the earlier version shows no note, and an event naming an unknown lesson does not break the page.
 assert.doesNotMatch(harness('ae01',new Map()).app.innerHTML,/A new lesson was added/);
 const odd=E.hydrate(earlierRecord());odd.events.push({at:'2026-11-01T00:00:00.000Z',type:'lessons_added',lessons:['retired']});assert.match(harness('ae01',new Map([[E.SCHEMA,JSON.stringify(odd)]])).app.innerHTML,/A new lesson was added/);
});
