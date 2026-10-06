'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),Element=require('./foundation-dom.cjs');
const root=path.resolve(__dirname,'..'),Goals=require('../assets/hub-goals.js'),Tools=require('../assets/report-tools.js');
function harness({clipboard=true,blocked=false,map=new Map()}={}){
 const host=new Element('html');host.innerHTML=fs.readFileSync(path.join(root,'index.html'),'utf8');
 const document={getElementById:id=>host.querySelector('#'+id),querySelectorAll:s=>host.querySelectorAll(s),createElement:tag=>new Element(tag)};
 const storage={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)},copied=[],tabs=[];
 const window={document,localStorage:storage,location:{href:'https://example.test/?stage=high',search:'?stage=high'},history:{state:null,replaceState(){}},addEventListener(){},navigator:{clipboard:{writeText:async text=>{if(!clipboard)throw Error('denied');copied.push(text);}}},open(){if(blocked)return null;const tab={opener:window,document:{open(){},write(s){tab.html=s;},close(){}},focus(){},print(){throw Error('Must not call print from the opener');}};tabs.push(tab);return tab;}};
 // Preserve independent filter and learning-entry listeners in this test DOM.
 for(const el of host.all()){el.listeners={};el.addEventListener=(type,cb)=>{(el.listeners[type]??=[]).push(cb);el.events[type]=event=>Promise.all(el.listeners[type].map(fn=>fn(event)));};}
 const context={window,document,URL,URLSearchParams};vm.createContext(context);
 for(const file of ['report-tools.js','report-store.js','hub-goals.js'])vm.runInContext(fs.readFileSync(path.join(root,'assets',file),'utf8'),context,{filename:file});
 const q=id=>document.getElementById(id),click=el=>el.events.click({target:el}),change=el=>el.events.change({target:el});
 return{window,document,host,map,copied,tabs,q,click,change};
}
test('homepage goals follow subject selection, persist and copy an actual request without filters',async()=>{
 const h=harness();const choose=id=>h.host.querySelector('[data-learning-subject="'+id+'"]');
 h.click(choose('ae01'));assert.equal(h.q('goal-subject-label').textContent,'Statistics');assert.equal(h.q('goal-course').href,'modules/ae01/dist/');
 h.q('learning-goal').value='How can I compare the two spreads?';h.q('learning-goal').events.input({target:h.q('learning-goal')});await h.q('goal-copy').events.click();assert.match(h.copied[0],/Subject: Statistics/);assert.match(h.copied[0],/compare the two spreads/);
 assert.equal(h.q('filter-direction'),null);assert.equal(h.q('filter-stage'),null);h.click(choose('ab01'));assert.equal(h.q('goal-subject-label').textContent,'Linear algebra');assert.equal(h.q('learning-goal').value,'How can I compare the two spreads?');
 const restored=harness({map:h.map});assert.equal(restored.q('learning-goal').value,h.q('learning-goal').value);assert.equal(restored.q('goal-subject-label').textContent,'Linear algebra');assert(Goals.hydrate(JSON.parse(h.map.get(Goals.KEY))));
});
test('copy failure keeps a selected Markdown fallback and never automatically sends the work',async()=>{
 const h=harness({clipboard:false});await h.q('goal-copy').events.click();assert.equal(h.q('goal-markdown').hidden,false);assert(h.q('goal-markdown').selected);assert.match(h.q('goal-markdown').value,/# My mathematics learning request/);assert.match(h.q('goal-status').textContent,/Copy command/);assert.equal(h.tabs.length,0);
});
test('saved reports can be included with the selected subject and exact response history',async()=>{
 const h=harness();h.window.ClueveraReportStore.save('aa01',{markdown:'# Algebra\n\nQuestion: solve 4x-3=9\n\n> My step: add 3 to both sides.'},'sample',h.window.localStorage);
 const loaded=harness({map:h.map});const option=loaded.q('goal-report').querySelectorAll('option').find(o=>o.value==='aa01:sample');assert(option);loaded.q('goal-report').value=option.value;await loaded.q('goal-copy').events.click();assert.match(loaded.copied[0],/My step: add 3/);assert.match(loaded.copied[0],/solve 4x-3=9/);
});
test('print reports are detached and manual; Markdown rendering escapes student HTML',()=>{
 const h=harness(),T=h.window.ClueveraReportTools,html=T.printable('Algebra',{markdown:'# A check\n\nQuestion: test a claim\n\n> <script>alert(1)</script>\n\nReference: check the two values'});
 assert(T.openPrint(html));assert.equal(h.tabs[0].opener,null);assert.match(h.tabs[0].html,/question-text/);assert.match(h.tabs[0].html,/student-work/);assert.match(h.tabs[0].html,/report-feedback/);assert.match(h.tabs[0].html,/&lt;script&gt;/);assert.doesNotMatch(h.tabs[0].html,/<script>alert/);
 const blocked=harness({blocked:true});assert.equal(blocked.window.ClueveraReportTools.openPrint(html),false);
 assert.match(Tools.markdown('Legacy',{records:{a:{answer:2}}}),/Complete learning record/);
});
