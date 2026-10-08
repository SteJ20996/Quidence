'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),Element=require('./foundation-dom.cjs');
const root=path.resolve(__dirname,'..'),Goals=require('../assets/hub-goals.js'),Tools=require('../assets/report-tools.js');
function harness({clipboard=true,blocked=false,map=new Map()}={}){
 const host=new Element('html');host.innerHTML=fs.readFileSync(path.join(root,'index.html'),'utf8');
 const document={getElementById:id=>host.querySelector('#'+id),querySelectorAll:s=>host.querySelectorAll(s),createElement:tag=>new Element(tag)};
 const storage={getItem:k=>map.has(k)?map.get(k):null,setItem:(k,v)=>map.set(k,v)},copied=[],tabs=[];
 const window={document,localStorage:storage,location:{href:'https://example.test/?stage=high',search:'?stage=high'},history:{state:null,replaceState(){}},addEventListener(){},navigator:{clipboard:{writeText:async text=>{if(!clipboard)throw Error('denied');copied.push(text);}}},open(){if(blocked)return null;const tab={opener:window,document:{open(){},write(s){tab.html=s;},close(){}},focus(){},print(){throw Error('Must not call print from the opener');}};tabs.push(tab);return tab;}};
 // Preserve independent filter and learning-entry listeners in this test DOM.
 for(const el of host.all()){el.listeners={};el.addEventListener=(type,cb)=>{(el.listeners[type]??=[]).push(cb);el.events[type]=event=>Promise.all(el.listeners[type].map(fn=>fn(event)));};}
 const context={window,document,URL,URLSearchParams};vm.createContext(context);
 for(const file of ['report-tools.js','report-store.js','course-catalog.js','hub-goals.js'])vm.runInContext(fs.readFileSync(path.join(root,'assets',file),'utf8'),context,{filename:file});
 const q=id=>document.getElementById(id),click=el=>el.events.click({target:el}),change=el=>el.events.change({target:el});
 return{window,document,host,map,copied,tabs,q,click,change};
}
test('homepage goals follow subject selection, persist and copy an actual request without filters',async()=>{
 const h=harness();const choose=id=>h.host.querySelector('[data-learning-subject="'+id+'"]');
 h.click(choose('ae01'));assert.equal(h.q('goal-subject-label').textContent,'Statistics');assert.equal(h.q('goal-course').href,'modules/ae01/dist/');
 h.q('learning-goal').value='How can I compare the two spreads?';h.q('learning-goal').events.input({target:h.q('learning-goal')});await h.q('goal-copy').events.click();assert.match(h.copied[0],/Subject: Statistics/);assert.match(h.copied[0],/compare the two spreads/);
 assert.equal(h.q('filter-direction'),null);assert.equal(h.q('filter-stage'),null);h.click(choose('ab01'));assert.equal(h.q('goal-subject-label').textContent,'Linear Algebra');assert.equal(h.q('learning-goal').value,'How can I compare the two spreads?');
 const restored=harness({map:h.map});assert.equal(restored.q('learning-goal').value,h.q('learning-goal').value);assert.equal(restored.q('goal-subject-label').textContent,'Linear Algebra');assert(Goals.hydrate(JSON.parse(h.map.get(Goals.KEY))));
});
test('copy failure keeps a selected Markdown fallback and never automatically sends the work',async()=>{
 const h=harness({clipboard:false});await h.q('goal-copy').events.click();assert.equal(h.q('goal-markdown').hidden,false);assert(h.q('goal-markdown').selected);assert.match(h.q('goal-markdown').value,/# My learning request/);assert.match(h.q('goal-status').textContent,/Copy command/);assert.equal(h.tabs.length,0);
});
test('saved reports can be included with the selected subject and exact response history',async()=>{
 const h=harness();h.window.QuidenceReportStore.save('aa01',{markdown:'# Algebra\n\nQuestion: solve 4x-3=9\n\n> My step: add 3 to both sides.'},'sample',h.window.localStorage);
 const loaded=harness({map:h.map});const option=loaded.q('goal-report').querySelectorAll('option').find(o=>o.value==='aa01:sample');assert(option);loaded.q('goal-report').value=option.value;await loaded.q('goal-copy').events.click();assert.match(loaded.copied[0],/My step: add 3/);assert.match(loaded.copied[0],/solve 4x-3=9/);
});
test('print reports are detached and manual; Markdown rendering escapes student HTML',()=>{
 const h=harness(),T=h.window.QuidenceReportTools,html=T.printable('Algebra',{markdown:'# A check\n\nQuestion: test a claim\n\n> <script>alert(1)</script>\n\nReference: check the two values'});
 assert(T.openPrint(html));assert.equal(h.tabs[0].opener,null);assert.match(h.tabs[0].html,/question-text/);assert.match(h.tabs[0].html,/student-work/);assert.match(h.tabs[0].html,/report-feedback/);assert.match(h.tabs[0].html,/&lt;script&gt;/);assert.doesNotMatch(h.tabs[0].html,/<script>alert/);
 const blocked=harness({blocked:true});assert.equal(blocked.window.QuidenceReportTools.openPrint(html),false);
 assert.match(Tools.markdown('Legacy',{records:{a:{answer:2}}}),/Complete learning record/);
});

test('unreadable saved requests stay byte-for-byte intact through rendering and edits',async()=>{
 for(const raw of ['{broken','{"schema":"unknown","text":"Do not erase me"}','']){
  const map=new Map([[Goals.KEY,raw]]),h=harness({map});
  assert.equal(map.get(Goals.KEY),raw);assert.match(h.q('goal-status').textContent,/original is kept/);
  h.q('learning-goal').value='new draft';h.q('learning-goal').events.input({target:h.q('learning-goal')});
  assert.equal(map.get(Goals.KEY),raw);
  await h.click(h.q('goal-original'));assert.equal(h.q('goal-markdown').value,raw);
  h.window.confirm=()=>false;await h.click(h.q('goal-reset'));assert.equal(map.get(Goals.KEY),raw);
  h.window.confirm=()=>true;await h.click(h.q('goal-reset'));assert.equal(JSON.parse(map.get(Goals.KEY)).text,'new draft');
 }
});

test('report opt-in persists, legacy requests remain opted out, and a different subject needs its own opt-in',async()=>{
 const map=new Map([[Goals.KEY,JSON.stringify({schema:Goals.KEY,subject:'algebra-1',text:'Keep my exact request.\n  Spaces matter.'})]]),h=harness({map});
 assert.equal(h.q('goal-include-report').checked,false);
 h.q('goal-include-report').checked=true;await h.change(h.q('goal-include-report'));
 assert.equal(JSON.parse(map.get(Goals.KEY)).includeInReport,true);
 assert.equal(harness({map}).q('goal-include-report').checked,true);
 await h.click(h.host.querySelector('[data-learning-subject="geometry"]'));
 assert.equal(h.q('learning-goal').value,'Keep my exact request.\n  Spaces matter.');
 assert.equal(h.q('goal-include-report').checked,false);assert.equal(JSON.parse(map.get(Goals.KEY)).includeInReport,false);
 assert.equal(Goals.hydrate({schema:Goals.KEY,subject:'geometry',text:'x',includeInReport:'yes'}),null);
});

test('only a nonblank opted-in request for the matching subject becomes report context',()=>{
 const S=require('../assets/report-store.js'),map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)},payload={markdown:'# Original evidence\n\n> My answer: 4'};
 const goal=(subject,text,includeInReport)=>map.set(Goals.KEY,JSON.stringify({schema:Goals.KEY,subject,text,includeInReport}));
 goal('geometry','Use a diagram.',false);assert.equal(S.save('geometry',payload,'off',storage).payload.learningRequest,undefined);
 goal('algebra-1','Help with equations.',true);assert.equal(S.save('geometry',payload,'other',storage).payload.learningRequest,undefined);
 goal('geometry',' \n ',true);assert.equal(S.save('geometry',payload,'empty',storage).payload.learningRequest,undefined);
 goal('geometry','  Use a diagram.\nKeep these spaces.  ',true);
 const saved=S.save('geometry',payload,'on',storage);assert.equal(saved.payload.learningRequest.text,'  Use a diagram.\nKeep these spaces.  ');
 assert.equal(saved.payload.markdown,payload.markdown);assert.equal(payload.learningRequest,undefined);
 assert.equal(S.save('aa01',payload,'unrelated-school',storage).payload.learningRequest,undefined);
 goal('algebra-1','Compare two equation methods.',true);assert.equal(S.save('aa01',payload,'shared-school',storage).payload.learningRequest.subject,'algebra-1');
 map.set(Goals.KEY,'{unreadable');assert.equal(S.save('geometry',payload,'corrupt',storage).payload.learningRequest,undefined);assert.equal(map.get(Goals.KEY),'{unreadable');
});

test('saved contexts are immutable across request edits, opt-out, reopens and legacy reports',()=>{
 const S=require('../assets/report-store.js'),map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};
 const goal=(text,on=true)=>map.set(Goals.KEY,JSON.stringify({schema:Goals.KEY,subject:'ab01',text,includeInReport:on}));
 const work={markdown:'Original matrix work',answer:1};goal('My first focus');const first=S.save('ab01',work,'session',storage),raw=map.get(S.KEY),snapshot=JSON.stringify(first.payload);
 goal('My changed focus');assert.equal(S.save('ab01',work,'session',storage).changed,false);assert.equal(map.get(S.KEY),raw);
 assert.equal(S.prepare('ab01',work,'session',storage).learningRequest.text,'My first focus');
 const revised=S.save('ab01',{...work,answer:2},'session',storage);assert.equal(revised.payload.learningRequest.text,'My changed focus');
 goal('Keep this out',false);S.save('ab01',{...work,answer:3},'session',storage);
 const versions=S.read(storage).data.items[0].versions;assert.equal(versions.length,3);assert.equal(JSON.stringify(versions[0].payload),snapshot);assert.equal(versions[2].payload.learningRequest,undefined);
 goal('Legacy report must stay unchanged',false);S.save('ab01',work,'legacy',storage);goal('New focus');const before=map.get(S.KEY);
 assert.equal(S.prepare('ab01',work,'legacy',storage).learningRequest,undefined);assert.equal(S.save('ab01',work,'legacy',storage).changed,false);assert.equal(map.get(S.KEY),before);
});

test('learning criteria reach readable exports, printable reports, summaries and drawing packages safely',()=>{
 const text='<script>alert("goal")</script>\n```\nExact student wording & spaces.',payload={markdown:'# Evidence\n\n> Original answer',learningRequest:{schema:'quidence_report_learning_request_v1',subject:'geometry',text,capturedAt:'2026-10-08T00:00:00Z'},studentSummary:{matched:[],checks:[],selection:'Review the original work.'}};
 assert.match(Tools.markdown('Geometry',payload),/criterion in this report/);assert(Tools.markdown('Geometry',payload).includes(Tools.quote(text)));
 for(const html of [Tools.printable('Geometry',payload),Tools.printableSummary('Geometry',payload)]){assert.match(html,/Your learning focus/);assert.match(html,/&lt;script&gt;/);assert.doesNotMatch(html,/<script>alert/);assert.match(html,/does not change fixed answer checks/);}
 const files=Tools.packageFiles('Geometry',payload);assert(files[0].content.includes(Tools.quote(text)));assert.match(files[1].content,/Your learning focus/);
});
