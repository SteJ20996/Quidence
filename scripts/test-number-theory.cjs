const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),data=JSON.parse(fs.readFileSync(path.join(root,'courses/number-theory/data.json'),'utf8'));
const C=require('../courses/number-theory/core.js');let cases=0;function test(fn){fn();cases++;}
test(()=>{assert.equal(data.length,10);assert.equal(data.flatMap(p=>p.steps).length,43);assert.equal(data.flatMap(p=>p.steps.flatMap(s=>s.fields)).length,120);});
for(const p of data)for(const s of p.steps){
  test(()=>{assert.ok(s.proof.length>50);assert.ok(s.prompt.length>20);assert.equal(new Set(s.fields.map(f=>f.id)).size,s.fields.length);});
  for(const f of s.fields){
    if(f.type==='number'){
      test(()=>assert.equal(C.grade(f,f.answer).status,'correct',p.id+':'+f.id));
      for(const a of f.accepted)test(()=>assert.equal(C.grade(f,a).status,'correct',p.id+':'+f.id+' '+a));
      test(()=>assert.equal(C.grade(f,'').status,'empty'));
      test(()=>assert.equal(C.grade(f,'<script>alert(1)</script>').status,'format'));
    }else if(f.type==='reason'){
      test(()=>{assert.ok(f.criteria.length);assert.equal(C.grade(f,'A plausible-looking but incorrect proof.').status,'pending');assert.equal(C.grade(f,'   ').status,'empty');});
    }else if(f.type==='choice'){
      test(()=>assert.equal(C.grade(f,f.answer).status,'correct'));
      for(const o of f.options)if(o.value!==f.answer)test(()=>assert.equal(C.grade(f,o.value).status,'retry'));
    }else{
      test(()=>assert.equal(C.grade(f,[...f.answer].reverse()).status,'correct'));
      test(()=>assert.equal(C.grade(f,f.options.map(o=>o.value)).status,'retry'));
      test(()=>assert.equal(C.grade(f,[f.answer[0],f.answer[0]]).status,'retry'));
    }
  }
}
// Check the supplied wrong-number examples against the implemented grader.
const source=fs.readFileSync(path.join(root,'content/number-theory/source-v2.md'),'utf8');
for(const p of data){const chunk=source.split(new RegExp(`### 项目 \\d+ · ${p.id} ·`))[1].split(/### 项目 \d+ ·|## 五、/)[0];for(const line of chunk.split('\n').filter(l=>l.startsWith('| `'))){const cells=line.trim().replace(/^\||\|$/g,'').split('|');const fid=cells[0].replace(/`/g,'').trim(),f=p.steps.flatMap(s=>s.fields).find(f=>f.id===fid);if(f?.type!=='number')continue;const wrong=line.split('应判错：')[1];if(!wrong)continue;for(const m of wrong.matchAll(/`([^`]+)`/g))test(()=>assert.notEqual(C.grade(f,m[1]).status,'correct',`${p.id}:${fid} rejected example ${m[1]}`));}}
for(const [a,b] of [['−3','-3'],['84.000','84'],['10/26','5/13'],['8.4e1','84']])test(()=>assert.ok(C.equalNumber(a,b)));
for(const bad of ['1/0','1+1','NaN','Infinity','1,2','', '0x54','6,468'])test(()=>assert.equal(C.rational(bad),null));
test(()=>assert.ok(!C.equalNumber('0.38','5/13')));
test(()=>assert.equal(C.grade({type:'number',answer:'84',accepted:['84']},'83.999').status,'retry'));
for(let m=2;m<=10;m++)for(let n=1;n<m;n++)test(()=>{const t=C.triple(m,n);assert.equal(t.a*t.a+t.b*t.b,t.c*t.c);assert.equal(t.g===1,C.gcd(m,n)===1&&(m-n)%2===1);});
for(let m=0;m<143;m++)test(()=>assert.equal(C.powMod(C.powMod(m,7,143),103,143),m));
test(()=>{let a=[0,0];const cap=[7,11];const moves=[['fill',1],['pour',1],['empty',0],['pour',1],['fill',1],['pour',1],['empty',0],['pour',1],['empty',0]];for(const [op,i] of moves){if(op==='fill')a[i]=cap[i];if(op==='empty')a[i]=0;if(op==='pour')a=C.pour(a,cap,i);assert.ok(a.every((n,i)=>n>=0&&n<=cap[i]));}assert.deepEqual(a,[0,1]);});
for(let n=0;n<=1000;n++)test(()=>{const t=C.ticket(n);assert.equal(t.threshold%5,n%5);if(t.possible){assert.ok(Number.isInteger(t.a)&&t.a>=0);assert.equal(5*t.a+7*t.b,n);}if(n>=24)assert.ok(t.possible);if(n===23)assert.ok(!t.possible);});
test(()=>{const h=fs.readFileSync(path.join(root,'courses/number-theory/index.html'),'utf8');for(const a of h.matchAll(/(?:src|href)="([^"#]+)"/g)){const url=a[1];if(url==='./'||url.startsWith('data:'))continue;assert.ok(!/^https?:/.test(url));assert.ok(fs.existsSync(path.resolve(root,'courses/number-theory',url.split('?')[0])),url);}});
// Minimal document adapters exercise application render/state logic, not browser layout.
const nodes=new Map();class El{
  constructor(id=''){this.id=id;this.value='';this.style={};this.dataset={};this.hidden=false;this.open=false;this._html='';this.textContent='';this.className='';this.attrs={};this.classList={add:()=>{},toggle:()=>{}};}
  set innerHTML(v){this._html=v;for(const match of v.matchAll(/<([a-z]+)\b([^>]*)>/g)){const attrs=match[2],id=attrs.match(/\bid="([^"]+)"/);if(id){const el=new El(id[1]);el.tagName=match[1].toUpperCase();el.value=attrs.match(/\bvalue="([^"]*)"/)?.[1]||'';nodes.set(el.id,el);}}}
  get innerHTML(){return this._html;}addEventListener(){}setAttribute(k,v){this.attrs[k]=v;}showModal(){this.open=true;}close(){this.open=false;}scrollIntoView(){}getBoundingClientRect(){return {left:0,top:0,right:1,bottom:1};}
}
const ids=[...fs.readFileSync(path.join(root,'courses/number-theory/index.html'),'utf8').matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);ids.forEach(id=>nodes.set(id,new El(id)));
const storage=new Map(),context={NTCore:C,document:{getElementById:id=>nodes.get(id),querySelectorAll:()=>[],querySelector:()=>new El(),addEventListener(){},hidden:false},window:{addEventListener(){}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},fetch:async()=>({ok:true,json:async()=>structuredClone(data)}),matchMedia:()=>({matches:true}),setTimeout:()=>1,clearTimeout(){},console,Date,URL,Blob,location:{reload(){}}};
(async()=>{
  context.window.localStorage=context.localStorage;vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'courses/number-theory/app.js'),'utf8'),context);await new Promise(r=>setImmediate(r));
  test(()=>assert.ok(nodes.get('loading').hidden));
  for(const p of data)for(let i=0;i<p.steps.length;i++)test(()=>{vm.runInContext(`selectProject(${JSON.stringify(p.id)});moveStep(${i});`,context);assert.ok(nodes.get('work').innerHTML.includes('See the full proof'));assert.ok(nodes.get('work').innerHTML.includes(p.steps[i].title));assert.ok(nodes.get('lab').innerHTML.length>50);});
  test(()=>{vm.runInContext("selectProject('nt-p01');moveStep(0);state.answers['nt-p01:0:gcd']='84';state.answers['nt-p01:0:divisions']='4';renderWork();checkStep();",context);assert.match(nodes.get('feedback-gcd').textContent,/Correct/);assert.ok(storage.size);});
  test(()=>{vm.runInContext("selectProject('nt-p02');moveStep(0);state.answers['nt-p02:0:pour']='This <img src=x onerror=alert(1)> is my reasoning.';renderWork();showSession();",context);assert.ok(nodes.get('modal-body').innerHTML.includes('&lt;img'));assert.ok(!nodes.get('modal-body').innerHTML.includes('<img src=x'));});
  test(()=>{vm.runInContext("state.answers['nt-p02:0:x']='−3';persist();state={version:1,project:'nt-p01',steps:{},answers:{},checks:{},attempts:[]};restore();",context);assert.equal(vm.runInContext("state.answers['nt-p02:0:x']",context),'−3');assert.ok(vm.runInContext("state.answers['nt-p02:0:pour'].includes('<img')",context));assert.ok(vm.runInContext('state.attempts.length>0',context));});
  test(()=>{vm.runInContext("selectProject('nt-p01');moveStep(0);const edit=$('f-gcd');edit.dataset.field='gcd';edit.value='42';recordInput(edit);",context);assert.equal(vm.runInContext("state.answers['nt-p01:0:gcd']",context),'42');assert.equal(vm.runInContext("state.checks['nt-p01:0:gcd']",context),undefined);assert.equal(vm.runInContext("state.attempts[0].results[0].value",context),'84');});
  test(()=>{vm.runInContext("selectProject('nt-p02');moveStep(0);labAction('jug-fill-1');labAction('jug-pour-1');labAction('jug-undo');",context);assert.equal(vm.runInContext("JSON.stringify(labState['nt-p02'].amounts)",context),'[0,11]');});
  test(()=>{vm.runInContext("showToolkit()",context);assert.ok(nodes.get('modal-body').innerHTML.includes('Euclid’s lemma'));assert.ok(nodes.get('modal-body').innerHTML.includes('Unique prime factorization'));});
  test(()=>{vm.runInContext("selectProject('nt-p06');labAction('rsa-message',11);labAction('rsa-lock');labAction('rsa-unlock');",context);assert.ok(nodes.get('lab').innerHTML.includes('original message returns'));});
  test(()=>{context.localStorage.setItem=()=>{throw Error('quota')};vm.runInContext('persist()',context);assert.ok(nodes.get('save-status').textContent.includes('Could not save'));});
  console.log(JSON.stringify({checks:cases,projects:10,steps:43,fields:120,result:'passed',browser_visual_qa:'See review/number-theory-browser-20261010.json',note:'Document adapters test render and state functions; they are not a real browser and do not verify visual layout.'},null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
