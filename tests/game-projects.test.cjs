'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../modules/ac01/dist/projects/core.js'),C=require('../modules/ac01/dist/projects/content.js'),Policy=require('../assets/sync-policy.js');
test('authored payoffs match separate arithmetic and every unilateral deviation',()=>{
 assert.deepEqual(E.trucks(80),[[[200,200],[500,300]],[[300,500],[100,100]]]);
 assert.deepEqual(E.trucks(50),[[[200,200],[500,150]],[[150,500],[25,25]]]);
 assert.deepEqual(E.trucks(60),[[[200,200],[500,200]],[[200,500],[50,50]]]);
 assert.deepEqual(E.printer(),[[[5,5],[1,6]],[[6,1],[3,3]]]);
 assert.deepEqual(E.printer(1.5),[[[5,5],[1,4.5]],[[4.5,1],[1.5,1.5]]]);
 assert.deepEqual(E.printer(3),[[[5,5],[1,3]],[[3,1],[0,0]]]);
 assert.deepEqual(E.printer(0,2),[[[8,8],[4,6]],[[6,4],[3,3]]]);
 const cases=[['trucks80',['01','10'],'none'],['trucks50',['00'],'0'],['trucks60',['00','01','10'],'none'],['printer0',['11'],'1'],['printer15',['00','11'],'none'],['printer3',['00'],'0'],['printerTraining',['00'],'0']];
 for(const [id,ne,dominance]of cases){const p=E.model(id),result=E.analysis(p);assert.deepEqual(result.ne,ne,id);assert.equal(result.dominance,dominance,id);for(let a=0;a<2;a++)for(let b=0;b<2;b++){const gains=[p[1-a][b][0]-p[a][b][0],p[a][1-b][1]-p[a][b][1]];assert.equal(ne.includes(''+a+b),gains.every(g=>g<=0));}}
 for(const f of [0,0.9,1,1.5,2,2.01,3,6]){const r=E.analysis(E.printer(f));assert.equal(r.ne.includes('00'),f>=1);assert.equal(r.ne.includes('11'),f<=2);assert.equal(r.dominance==='0',f>2);}
 assert.deepEqual(E.printer(3,5,.5),E.printer(1.5));assert.equal(E.analysis(E.printer(3,5,2/3)).dominance,'none');assert.equal(E.analysis(E.printer(3,5,.8)).dominance,'0');
});
test('numeric formats and tied best responses never become strict dominance',()=>{
 assert.equal(E.number(' 1,5 '),1.5);assert.equal(E.number('−2'),null);assert.equal(E.number('-2.5'),-2.5);for(const x of ['', '1,000.5','1.000,5','Infinity','1e3','1 000','4.'])assert.equal(E.number(x),null);
 const step=C.ACTIVITIES[0].steps.find(s=>s.id==='boundary'),expected=E.analysis(E.model(step.model));assert(E.check(step,expected).every(x=>x.status==='matched'));assert.equal(E.check(step,{...expected,ne:['01','10']}).find(x=>x.id==='ne').status,'recheck');
});
test('complete bilingual copy, distinct storage keys and all activity IDs',()=>{
 function walk(v){if(!v||typeof v!=='object')return;if('en'in v||'es'in v){assert.equal(typeof v.en,'string');assert.equal(typeof v.es,'string');assert(v.en.trim()&&v.es.trim());}for(const x of Object.values(v))walk(x);}
 walk(C);assert.deepEqual(C.ACTIVITIES.map(x=>x.id),E.IDS);
 for(const a of C.ACTIVITIES){assert.equal(new Set(a.steps.map(s=>s.id)).size,a.steps.length);assert(Policy.KEYS[E.key(a.id)]);const state=E.fresh(a.id,'sample');assert(Policy.valid(E.key(a.id),JSON.stringify(state)));}
});
test('autosave retains raw text, other activities and protected old records',()=>{
 const data=new Map([['ac01_beta01_session_v1','old lesson untouched']]);const storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};
 const a=E.open(storage,'food-trucks','one');E.record(a.state,'predict').draft={reason:'  原文 <script>\n  x = 1,5  ',otherHelp:true};assert(a.save().ok);const b=E.open(storage,'food-trucks','two');assert.equal(b.state.sessionId,'one');assert.equal(b.state.records.predict.draft.reason,'  原文 <script>\n  x = 1,5  ');
 b.state.step=1;assert(b.save().ok);a.state.step=2;assert.equal(a.save().reason,'conflict');assert.equal(JSON.parse(data.get(a.key)).step,1);assert.equal(data.get('ac01_beta01_session_v1'),'old lesson untouched');
 const other=E.open(storage,'shared-printer','three');assert(other.save().ok);assert.equal(JSON.parse(data.get(a.key)).step,1);
 for(const raw of ['bad json',JSON.stringify({...E.fresh('food-trucks','future'),version:'future'}),JSON.stringify({...E.fresh('food-trucks','broken'),records:{bad:{}}})]){data.set(a.key,raw);const bad=E.open(storage,'food-trucks','replacement');assert.equal(bad.problem,'unreadable');assert.equal(bad.original,raw);assert.equal(bad.save().ok,false);assert.equal(data.get(a.key),raw);}
 const full=E.open({getItem:()=>null,setItem:()=>{throw Error('QuotaExceededError');}},'missed-deadline','q');E.record(full.state,'initial').draft={plan:'Keep this in memory'};assert.equal(full.save().ok,false);assert.equal(full.state.records.initial.draft.plan,'Keep this in memory');
});
