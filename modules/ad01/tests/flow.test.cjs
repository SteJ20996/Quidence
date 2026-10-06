'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const C=require('../dist/content.js'),E=require('../dist/engine.js');
const decode=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
class Element{
 constructor(tag='div',attrs={}){this.tagName=tag.toUpperCase();this.type=attrs.type||'';this.attrs=attrs;this.id=attrs.id;this.name=attrs.name;this.dataset={};for(const[k,v]of Object.entries(attrs))if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;this.children=[];this.events={};this.value=attrs.value||'';this.checked='checked'in attrs;this.disabled='disabled'in attrs;this.textContent='';}
 set innerHTML(s){this.html=s;this.children=[];const stack=[this];for(const m of s.matchAll(/<\/?([\w-]+)([^>]*?)>/g)){const tag=m[1];if(m[0].startsWith('</')){if(stack.length>1)stack.pop();continue;}const attrs={};for(const a of m[2].matchAll(/([\w-]+)(?:="([^"]*)")?/g))attrs[a[1]]=decode(a[2]||'');const el=new Element(tag,attrs);el.parent=stack.at(-1);stack.at(-1).children.push(el);if(tag==='textarea'){const end=s.indexOf('</textarea>',m.index);el.value=decode(s.slice(m.index+m[0].length,end));}if(!['input','br','hr','img','link','meta','path','circle','rect'].includes(tag))stack.push(el);}for(const el of this.all().filter(x=>x.tagName==='SELECT'))el.value=(el.children.find(x=>'selected'in x.attrs)||el.children[0])?.value||'';}
 get innerHTML(){return this.html||'';}
 all(){return this.children.flatMap(x=>[x,...x.all()]);}
 matches(s){if(s.endsWith(':checked'))return this.checked&&this.matches(s.slice(0,-8));if(s.startsWith('#'))return this.attrs.id===s.slice(1);const a=s.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);if(a)return a[1]in this.attrs&&(a[2]===undefined||this.attrs[a[1]]===a[2]);return this.tagName===s.toUpperCase();}
 querySelectorAll(s){return this.all().filter(x=>x.matches(s));}querySelector(s){return this.querySelectorAll(s)[0]||null;}
 closest(s){return this.matches(s)?this:this.parent?.closest(s)||null;}
 setAttribute(k,v){this.attrs[k]=String(v);}addEventListener(type,callback){this.events[type]=callback;}focus(){this.focused=true;}appendChild(e){this.children.push(e);e.parent=this;}remove(){this.parent.children=this.parent.children.filter(x=>x!==this);}click(){}showModal(){this.open=true;}close(){this.open=false;}
}
function harness(map=new Map(),failSaving=false,options={}){
 const app=new Element('main',{id:'app'}),note=new Element('span',{id:'storage-note'}),body=new Element('body'),blobs=[],downloads=[];
 const document={body,getElementById:id=>id==='app'?app:id==='storage-note'?note:app.querySelector('#'+id),querySelector:s=>app.querySelector(s),createElement:tag=>{const e=new Element(tag);if(tag==='a')e.click=()=>downloads.push({name:e.download,url:e.href});return e;}};
 const frames=new Map();let clockId=0;const window={matchMedia:()=>({matches:!!options.reduced}),scrollTo(){},print(){this.printed=true;},open(){const tab={opener:this,document:{open(){},write(html){tab.html=html;},close(){}},focus(){}};this.preview=tab;return tab;}};
 window.document=document;const context={window,document,requestAnimationFrame:f=>{frames.set(++clockId,f);return clockId;},cancelAnimationFrame:id=>frames.delete(id),localStorage:{getItem:k=>map.get(k)||null,setItem:(k,v)=>{if(failSaving)throw Error('Storage denied');map.set(k,v);}},Blob,URL:{createObjectURL:b=>{blobs.push(b);return 'blob:'+blobs.length;},revokeObjectURL(){}},setTimeout:f=>f()};
 window.document=document;window.localStorage=context.localStorage;vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../../../assets/report-tools.js'),'utf8'),context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../../../assets/report-store.js'),'utf8'),context);for(const file of ['math.js','graphs.js','content.js','engine.js','app.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist/',file),'utf8'),context,{filename:file});
 function click(action,index){const b=app.all().find(x=>x.dataset.action===action&&(index===undefined||x.dataset.index===String(index)));assert.ok(b,`Missing ${action} ${index??''}`);if(!b.disabled)app.events.click({target:b});}
 function choose(value){const form=app.querySelector('#answer-form'),x=form.querySelectorAll('[name="choice"]').find(x=>x.value===value);assert.ok(x,`Missing choice ${value}`);if(x.attrs.type==='radio')form.querySelectorAll('[name="choice"]').forEach(x=>x.checked=false);x.checked=!x.checked;app.events.input({target:x});}
 function input(name,value){const x=app.querySelector(`[name="${name}"]`);if(typeof value==='boolean')x.checked=value;else x.value=value;app.events.input({target:x});}
 function submit(){app.querySelector('#answer-form').events.submit({preventDefault(){}});}
 const saved=()=>JSON.parse(map.get(E.SCHEMA));
 function lab(name,value){const el=app.querySelector('[data-lab=\"'+name+'\"]');assert.ok(el,'Missing lab control '+name);if(typeof value==='boolean')el.checked=value;else el.value=String(value);app.events.input({target:el});app.events.change({target:el});}function tick(time){for(const[id,fn]of [...frames]){frames.delete(id);fn(time);}}return{app,note,window,map,blobs,downloads,document,click,choose,input,lab,submit,saved,frames,tick};
}
function learn(h){h.click('next');for(let i=0;i<4;i++)h.click('next-step');}
function finishLesson(h,i){const l=C.LESSONS[i];h.choose('unsure');h.submit();learn(h);for(const t of l.checks){h.choose(t.correct[0]);h.submit();h.click('next');}}
test('whole lesson flow gates blank answers, records predictions, restores drafts and exports',async()=>{
 const h=harness();h.click('start');h.submit();assert.match(h.document.getElementById('answer-status').textContent,/Choose an answer/);assert.equal(h.app.querySelector('[data-action="next"]').disabled,true);
 h.choose('4');h.submit();assert.doesNotMatch(h.app.innerHTML,/Correct on this question|Revisit this idea/);h.choose('2');assert.equal(h.app.querySelector('[data-action="next"]').disabled,true);h.submit();
 h.click('next');h.click('step',3);assert.equal(h.app.querySelector('[data-action="next-step"]').disabled,true);h.click('step',1);h.click('step',2);h.click('step',3);h.click('next-step');
 h.choose('limit4');h.input('explanation','<img src=x onerror=alert(1)>');h.submit();const r=harness(h.map);assert.match(r.app.innerHTML,/&lt;img/);r.click('next');r.choose('none');r.submit();r.click('next');assert.match(r.app.innerHTML,/Your first saved prediction/);assert.deepEqual(r.saved().records.p1.submissions.map(s=>s.answer.choices),[['4'],['2']]);
 r.click('revise',0);r.choose('limit1');r.input('otherHelp',true);r.submit();assert.equal(r.saved().records.c1.submissions[1].support.feedbackSeen,true);r.click('next');r.click('next');
 for(let i=1;i<4;i++){r.click('continue');finishLesson(r,i);}r.click('continue');assert.equal(r.saved().view,'summary');assert.equal(JSON.parse(r.map.get('cluevera_saved_reports_v1')).items[0].module,'ad01');assert.ok(r.app.all().some(x=>x.attrs.role==='status'&&x.textContent.includes('report copy')));
 r.click('export-json');r.click('export-md');assert.equal(r.downloads.length,2);assert.equal(Object.keys(JSON.parse(await r.blobs[0].text()).records).length,12);assert.match(await r.blobs[1].text(),/# Visual Calculus/);assert.equal(harness(r.map).saved().view,'summary');
});
test('real app handlers change lab settings and calculations without submitting graph explorations',()=>{
 const h=harness();h.click('open',1);h.choose('unsure');h.submit();h.click('next');h.lab('kind','absolute');h.lab('a',0);h.lab('h',.02);h.lab('side',-1);h.lab('showDerivative',true);
 assert.match(h.document.getElementById('live-readout').textContent,/Δy\/Δx = -1/);assert.match(h.document.getElementById('live-readout').textContent,/undefined/);assert.equal(h.document.getElementById('lab-graphs').querySelectorAll('svg').length,2);assert.equal(Object.keys(h.saved().records).length,1);
 const r=harness(h.map);assert.equal(r.saved().labs[1].kind,'absolute');assert.equal(r.document.getElementById('lab-showDerivative').checked,true);r.click('reset-lab');assert.equal(r.saved().labs[1].kind,'square');
 r.click('open',2);r.choose('unsure');r.submit();r.click('next');r.lab('kind','linear');r.lab('n',64);assert.match(r.document.getElementById('live-readout').textContent,/Signed integral = 0/);assert.match(r.document.getElementById('live-readout').textContent,/Total area = 4/);
 r.click('open',3);r.choose('unsure');r.submit();r.click('next');r.lab('x',-1);r.lab('h',.02);assert.match(r.document.getElementById('live-readout').textContent,/A′\(x\) = f\(x\) = 0/);assert.match(r.document.getElementById('lab-graphs').innerHTML,/reverses orientation/);
});
test('storage failure allows in-memory work; corrupt storage is preserved until explicit replacement',()=>{
 const h=harness(new Map(),true);assert.match(h.note.textContent,/unavailable/);h.click('start');h.choose('unsure');h.submit();h.click('next');assert.equal(h.document.getElementById('lab-graphs').querySelectorAll('svg').length,1);
 const map=new Map([[E.SCHEMA,'{corrupt'],['ac01_beta01_session_v1','AC01 unchanged']]),r=harness(map);assert.match(r.app.innerHTML,/kept unchanged/);r.click('reset-blocked');r.click('cancel-reset');assert.equal(map.get(E.SCHEMA),'{corrupt');r.click('raw');assert.equal(r.downloads[0].name,'Quidence_Calculus_Saved_Record.json');r.click('reset-blocked');r.click('confirm-reset');assert.equal(r.saved().schema,E.SCHEMA);assert.equal(map.get('ac01_beta01_session_v1'),'AC01 unchanged');
});
test('graph text equivalents, endpoint extremes, and static question SVGs stay finite',()=>{
 const h=harness();h.click('open',1);h.choose('unsure');h.submit();h.click('next');h.lab('a',2);h.lab('h',1);assert.match(h.document.getElementById('lab-graphs').innerHTML,/Q = \(3, 9\)/);assert.doesNotMatch(h.document.getElementById('lab-graphs').innerHTML,/NaN|Infinity/);
 for(let i=0;i<4;i++){const q=harness();q.click('open',i);assert.ok(q.app.querySelector('svg'));assert.match(q.app.innerHTML,/aria-labelledby="ad-plot/);}
 const l=harness();l.click('start');l.choose('unsure');l.submit();l.click('next');l.lab('kind','jump');assert.match(l.document.getElementById('lab-formula').textContent,/−1 ≠ 1/);l.lab('kind','hole');assert.match(l.document.getElementById('lab-formula').textContent,/f\(1\) = 4/);
});
test('finite animations finish for all four lessons, update graphs, and preserve answers',()=>{
 const goals=[['exponent',-2.3],['h',.001],['n',64],['x',2]];
 for(let i=0;i<4;i++){
  const h=harness();h.click('open',i);h.choose('unsure');h.submit();h.click('next');const before=JSON.stringify(h.saved().records);h.click('play-motion');assert.equal(h.document.getElementById('play-motion').textContent,'Pause animation');
  for(const t of [0,1500,3000,4500])h.tick(t);
  assert.equal(h.frames.size,0);assert.equal(h.saved().labs[i][goals[i][0]],goals[i][1]);assert.equal(JSON.stringify(h.saved().records),before);assert.equal(h.document.getElementById('play-motion').textContent,'Replay animation');assert.ok(E.hydrate(h.saved()));assert.doesNotMatch(h.document.getElementById('lab-graphs').innerHTML,/NaN|Infinity/);
 }
});
test('pause, manual control, navigation, and replay cancel stale frames',()=>{
 const h=harness();h.click('open',2);h.choose('unsure');h.submit();h.click('next');h.click('play-motion');h.tick(0);h.tick(1500);h.click('play-motion');assert.equal(h.frames.size,0);assert.ok(h.saved().labs[2].n>8&&h.saved().labs[2].n<64);
 h.click('play-motion');h.tick(0);h.lab('n',10);assert.equal(h.frames.size,0);assert.equal(h.saved().labs[2].n,10);
 h.click('play-motion');h.tick(0);h.click('home');assert.equal(h.frames.size,0);assert.equal(h.saved().view,'orientation');
 h.click('start');h.lab('n',64);h.click('play-motion');h.tick(0);assert.match(h.document.getElementById('live-readout').textContent,/Rectangle sum/);h.tick(4500);assert.equal(h.saved().labs[2].n,64);assert.equal(h.frames.size,0);
});
test('reduced-motion preference reaches the endpoint without scheduling playback',()=>{
 const h=harness(new Map(),false,{reduced:true});h.click('open',1);h.choose('unsure');h.submit();h.click('next');h.click('play-motion');assert.equal(h.frames.size,0);assert.equal(h.saved().labs[1].h,.001);assert.match(h.document.getElementById('live-readout').textContent,/Δy\/Δx = 2\.001/);
});

