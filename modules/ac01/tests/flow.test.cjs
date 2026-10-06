'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const C=require('../dist/content.js'),E=require('../dist/engine.js');
const decode=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
class Element{
 constructor(tag='div',attrs={}){this.tagName=tag;this.attrs=attrs;this.id=attrs.id;this.name=attrs.name;this.dataset={};for(const[k,v]of Object.entries(attrs))if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;this.children=[];this.events={};this.value=attrs.value||'';this.checked='checked'in attrs;this.disabled='disabled'in attrs;this.textContent='';}
 set innerHTML(s){this.html=s;this.children=[];const stack=[this];for(const m of s.matchAll(/<\/?([\w-]+)([^>]*?)>/g)){const tag=m[1];if(m[0].startsWith('</')){if(stack.length>1)stack.pop();continue;}const attrs={};for(const a of m[2].matchAll(/([\w-]+)(?:="([^"]*)")?/g))attrs[a[1]]=decode(a[2]||'');const el=new Element(tag,attrs);el.parent=stack.at(-1);stack.at(-1).children.push(el);if(tag==='textarea'){const end=s.indexOf('</textarea>',m.index);el.value=decode(s.slice(m.index+m[0].length,end));}if(!['input','br','hr','img','link','meta','path','circle','rect'].includes(tag))stack.push(el);}for(const el of this.all().filter(x=>x.tagName==='select'))el.value=(el.children.find(x=>'selected'in x.attrs)||el.children[0])?.value||'';}
 get innerHTML(){return this.html||'';}
 all(){return this.children.flatMap(x=>[x,...x.all()]);}
 matches(s){if(s.endsWith(':checked'))return this.checked&&this.matches(s.slice(0,-8));if(s.startsWith('#'))return this.attrs.id===s.slice(1);const a=s.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);if(a)return a[1]in this.attrs&&(a[2]===undefined||this.attrs[a[1]]===a[2]);return this.tagName===s;}
 querySelectorAll(s){return this.all().filter(x=>x.matches(s));}querySelector(s){return this.querySelectorAll(s)[0]||null;}
 closest(s){return this.matches(s)?this:this.parent?.closest(s)||null;}
 setAttribute(k,v){this.attrs[k]=String(v);}
 addEventListener(type,callback){this.events[type]=callback;}focus(){this.focused=true;}appendChild(e){this.children.push(e);e.parent=this;}remove(){this.parent.children=this.parent.children.filter(x=>x!==this);}click(){}showModal(){this.open=true;}close(){this.open=false;}
}
function harness(map=new Map(),failSaving=false){
 const app=new Element('main',{id:'app'}),note=new Element('span',{id:'storage-note'}),body=new Element('body'),blobs=[],downloads=[];
 const document={body,getElementById:id=>id==='app'?app:id==='storage-note'?note:app.querySelector('#'+id),querySelector:s=>app.querySelector(s),createElement:tag=>{const e=new Element(tag);if(tag==='a')e.click=()=>downloads.push({name:e.download,url:e.href});return e;}};
 const window={scrollTo(){},print(){this.printed=true;},open(){const tab={opener:this,document:{open(){},write(html){tab.html=html;},close(){}},focus(){}};this.preview=tab;return tab;}};
 const context={window,document,localStorage:{getItem:k=>map.get(k)||null,setItem:(k,v)=>{if(failSaving)throw Error('Storage denied');map.set(k,v);}},Blob,URL:{createObjectURL:b=>{blobs.push(b);return 'blob:'+blobs.length;},revokeObjectURL(){}},setTimeout:f=>f()};
 window.document=document;window.localStorage=context.localStorage;vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../../../assets/report-tools.js'),'utf8'),context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../../../assets/report-store.js'),'utf8'),context);for(const file of ['content.js','engine.js','app.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist/',file),'utf8'),context,{filename:file});
 function click(action,index){const b=app.all().find(x=>x.dataset.action===action&&(index===undefined||x.dataset.index===String(index)));assert.ok(b,`Missing ${action} ${index??''}`);if(!b.disabled)app.events.click({target:b});}
 function choose(value){const form=app.querySelector('#answer-form'),x=form.querySelectorAll('[name="choice"]').find(x=>x.value===value);assert.ok(x,`Missing choice ${value}`);if(x.attrs.type==='radio')form.querySelectorAll('[name="choice"]').forEach(x=>x.checked=false);x.checked=!x.checked;app.events.input({target:x});}
 function input(name,value){const x=app.querySelector(`[name="${name}"]`);if(typeof value==='boolean')x.checked=value;else x.value=value;app.events.input({target:x});}
 function submit(){app.querySelector('#answer-form').events.submit({preventDefault(){}});}
 const saved=()=>JSON.parse(map.get(E.SCHEMA));
 return{app,note,window,map,blobs,downloads,document,click,choose,input,submit,saved};
}
function learn(h){h.click('next');for(let i=1;i<=3;i++)h.click('next-step');h.click('next-step');}
function finishLesson(h,i){const l=C.LESSONS[i];h.choose('unsure');h.submit();learn(h);for(const t of l.checks){t.correct.forEach(x=>h.choose(x));h.submit();h.click('next');}}
test('complete mixed workflow, blank gates, revisions, resume, and exports',async()=>{
 const h=harness();assert.match(h.app.innerHTML,/Your choice/);h.click('start');h.submit();assert.match(h.document.getElementById('answer-status').textContent,/Choose an answer/);assert.equal(h.app.querySelector('[data-action="next"]').disabled,true);
 h.choose('a');h.submit();assert.equal(h.saved().records.p1.submissions[0].result,'revisit');assert.doesNotMatch(h.app.innerHTML,/Correct on this question|Revisit this idea/);
 h.click('next');h.click('step',3);assert.equal(h.app.querySelector('[data-action="next-step"]').disabled,true);h.click('step',1);h.click('step',2);h.click('next-step');h.click('next-step');
 h.choose('73');h.submit();h.choose('37');assert.equal(h.app.querySelector('[data-action="next"]').disabled,true);h.input('explanation','<img src=x onerror=alert(1)>');h.input('otherHelp',true);h.submit();
 const first=h.saved().records.c1.submissions[0];assert.equal(first.answer.choices[0],'73');assert.equal(h.saved().records.c1.submissions.length,2);assert.doesNotMatch(h.app.innerHTML,/<img src=x/);
 const resumed=harness(h.map);assert.match(resumed.app.innerHTML,/&lt;img/);assert.equal(resumed.app.querySelector('[data-action="next"]').disabled,false);resumed.click('next');resumed.choose('a');resumed.submit();resumed.click('next');assert.match(resumed.app.innerHTML,/Your first prediction/);assert.match(resumed.app.innerHTML,/Fresh questions after instruction/);
 const r=resumed;r.click('continue');finishLesson(r,1);r.click('continue');finishLesson(r,2);r.click('continue');finishLesson(r,3);r.click('continue');assert.equal(r.saved().view,'summary');assert.equal(JSON.parse(r.map.get('cluevera_saved_reports_v1')).items[0].module,'ac01');assert.ok(r.app.all().some(x=>x.attrs.role==='status'&&x.textContent.includes('report copy')));assert.equal(E.allDone(r.saved()),true);
 r.click('export-json');r.click('export-md');assert.equal(r.downloads.length,2);const exported=JSON.parse(await r.blobs[0].text());assert.equal(Object.keys(exported.records).length,12);assert.equal(exported.records.c1.submissions[0].answer.choices[0],'73');assert.equal(exported.records.c1.submissions[1].support.otherHelp,true);assert.match(await r.blobs[1].text(),/Initial prediction/);assert.match(await r.blobs[1].text(),/> <img src=x/);
 const again=harness(r.map);assert.equal(again.saved().view,'summary');again.click('print');assert.equal(again.window.printed,undefined);assert.match(again.window.preview.html,/Print \/ save as PDF/);
});
test('one-player switches keep the other choice fixed and controls never submit answers',()=>{
 const h=harness();h.click('open',1);h.choose('bright');h.submit();h.click('next');const row=h.document.getElementById('row-choice'),col=h.document.getElementById('col-choice');assert.equal(row.value,'0');assert.equal(col.value,'0');h.click('switch-a');assert.equal(h.document.getElementById('row-choice').value,'1');assert.equal(h.document.getElementById('col-choice').value,'0');assert.match(h.app.innerHTML,/A: 5/);assert.match(h.app.innerHTML,/B: 0/);
 h.click('switch-b');assert.equal(h.document.getElementById('row-choice').value,'1');assert.equal(h.document.getElementById('col-choice').value,'1');assert.match(h.app.innerHTML,/A: 2/);assert.match(h.app.innerHTML,/B: 2/);assert.equal(Object.keys(h.saved().records).length,1);
 const choice=h.document.getElementById('col-choice');choice.value='0';h.app.events.change({target:choice});assert.match(h.app.innerHTML,/A: 5/);assert.equal(h.saved().events.at(-1).type,'table_explored');
});
test('multi-select exclusive choices, navigation, and draft recovery',()=>{
 const h=harness();h.click('open',3);h.choose('unsure');h.submit();learn(h);h.choose('00');h.choose('11');h.choose('unsure');assert.deepEqual(h.saved().records.c7.draft.choices,['unsure']);h.choose('00');assert.deepEqual(h.saved().records.c7.draft.choices,['00']);h.choose('none');assert.deepEqual(h.saved().records.c7.draft.choices,['none']);h.choose('11');h.choose('00');assert.deepEqual(h.saved().records.c7.draft.choices,['00','11']);
 h.click('home');assert.equal(h.saved().view,'orientation');h.click('start');assert.equal(h.saved().stage,'check');const resumed=harness(h.map);assert.equal(resumed.app.querySelectorAll('[name="choice"]:checked').length,2);resumed.submit();assert.equal(resumed.saved().records.c7.submissions[0].result,'correct');
});
test('reviewed revisions preserve feedback exposure and block summary until saved',()=>{
 const h=harness();h.click('start');finishLesson(h,0);h.click('revise',0);h.choose('73');assert.equal(h.saved().records.c1.status,'draft');h.submit();assert.equal(h.saved().records.c1.submissions[1].support.feedbackSeen,true);assert.equal(h.saved().records.c1.submissions[1].result,'revisit');h.click('next');h.click('next');assert.match(h.app.innerHTML,/Revisit this idea/);h.click('relearn');assert.equal(h.saved().stage,'learn');
});
test('saving failure continues in memory; corrupt records are preserved through cancel',()=>{
 const denied=harness(new Map(),true);assert.match(denied.note.textContent,/unavailable/);denied.click('start');denied.choose('b');denied.submit();denied.click('next');assert.match(denied.app.innerHTML,/STEP 1 OF 4/);
 const map=new Map([[E.SCHEMA,'{corrupt']]),h=harness(map);assert.match(h.app.innerHTML,/kept unchanged/);assert.equal(map.get(E.SCHEMA),'{corrupt');h.click('raw');assert.equal(h.downloads[0].name,'AC01_Saved_Record.json');h.click('reset-blocked');assert.equal(h.document.getElementById('reset-dialog').open,true);h.click('cancel-reset');assert.equal(map.get(E.SCHEMA),'{corrupt');h.click('reset-blocked');h.click('confirm-reset');assert.equal(h.saved().schema,E.SCHEMA);assert.equal(h.saved().view,'orientation');
});
test('all course dashboard links and AC01 local assets resolve within the project',()=>{
 const root=path.resolve(__dirname,'../../..'),hub=fs.readFileSync(path.join(root,'index.html'),'utf8');
 const links=Array.from(hub.matchAll(/class="subject-link" href="([^"]+)"/g),m=>m[1]);assert.deepEqual(links,['courses/pre-algebra/','courses/algebra-1/','courses/geometry/','courses/algebra-2/','modules/af01/dist/','modules/ad01/dist/','modules/ae01/dist/','modules/ab01/dist/','courses/microeconomics/','courses/macroeconomics/','modules/ac01/dist/']);
 links.forEach(l=>assert.ok(fs.existsSync(path.join(root,l,'index.html'))));
 const entry=fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');for(const m of entry.matchAll(/(?:href|src)="([^"]+)"/g)){if(m[1]==='./')continue;assert.ok(fs.existsSync(path.resolve(__dirname,'../dist',m[1].split(/[?#]/)[0])),m[1]);}
});

