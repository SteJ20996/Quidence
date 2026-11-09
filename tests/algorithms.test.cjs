'use strict';
// Algorithms course: traces against independent reference results, the predictions against the traces they
// describe, the printed Python and Java against the same references, the challenge checks, and the content.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawnSync}=require('node:child_process');
const A=require('../courses/algorithms/core.js');
const root=path.join(__dirname,'..');
function rng(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
const R=rng(20261109),int=(a,b)=>a+Math.floor(R()*(b-a+1));
const list=(n,lo=-30,hi=60)=>Array.from({length:n},()=>int(lo,hi));
const distinct=n=>{const s=new Set();while(s.size<n)s.add(int(-40,80));return[...s];};
const gcd=(a,b)=>b?gcd(b,a%b):a;
const inversions=a=>{let k=0;for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++)if(a[i]>a[j])k++;return k;};
const run=(k,a,t,pair)=>A.ALGS[k].gen(a,t,R,pair);
const after=(E,i)=>E[i+1];

test('every trace reaches the reference result, and each prediction matches what the trace then does',()=>{
 for(let round=0;round<300;round++){
  const n=int(2,12);
  // Find the maximum.
  {const a=list(n),E=run('find-max',a),done=E.at(-1),best=Math.max(...a);
   assert.equal(done.vars.best,best);assert.equal(E.filter(e=>e.node==='cmp').length,n-1);
   const ups=E.filter(e=>e.node==='upd').length,start=E[0].ask;assert.equal(start.options.en[start.answer],String(ups));
   E.forEach((e,i)=>{if(e.node==='cmp')assert.equal(e.ask.answer===0,after(E,i).node==='upd');});}
  // Linear search, with targets that are present and absent.
  {const a=distinct(n),t=R()<.6?a[int(0,n-1)]:200,E=run('linear-search',a,t),pos=a.indexOf(t);
   assert.equal(E.at(-1).node,pos<0?'notfound':'found');if(pos>=0)assert.deepEqual(E.at(-1).hit,[pos]);
   const checks=E.filter(e=>e.node==='cmp').length;assert.equal(checks,pos<0?n:pos+1);assert.equal(E[0].ask.options.en[E[0].ask.answer],String(checks));
   E.forEach((e,i)=>{if(e.node==='cmp')assert.equal(e.ask.answer===0,after(E,i).node==='found');});}
  // Bubble sort.
  {const a=list(n),E=run('bubble-sort',a),cmps=E.filter(e=>e.node==='cmp').length;
   assert.deepEqual(E.at(-1).arr,[...a].sort((x,y)=>x-y));assert.equal(cmps,n*(n-1)/2);assert.equal(E.filter(e=>e.node==='swap').length,inversions(a));
   assert.equal(E[0].ask.options.en[E[0].ask.answer],String(cmps));
   E.forEach((e,i)=>{if(e.node==='cmp')assert.equal(e.ask.answer===0,after(E,i).node==='swap');});}
  // Insertion sort: one shift per inversion, and the while check runs once more per item than it shifts.
  {const a=list(n),E=run('insertion-sort',a),shifts=E.filter(e=>e.node==='shift').length;
   assert.deepEqual(E.at(-1).arr,[...a].sort((x,y)=>x-y));assert.equal(shifts,inversions(a));
   assert.equal(E.filter(e=>e.node==='wcheck').length,shifts+n-1);assert.equal(A.insertionBoxCounts(a).wcheck,shifts+n-1);
   assert.equal(E[0].ask.options.en[E[0].ask.answer],String(shifts));
   E.forEach((e,i)=>{if(e.node==='wcheck'&&e.ask)assert.equal(e.ask.answer===0,after(E,i).node==='shift');});
   // The gap is drawn where key will land or has just left.
   E.filter(e=>e.hole!=null).forEach(e=>assert.ok(e.hole>=0&&e.hole<n));}
  // Euclid's algorithm.
  {const x=int(1,99999),y=int(1,99999),E=run('euclid',null,null,[x,y]),rems=E.filter(e=>e.node==='rem');
   assert.equal(E.at(-1).arr[0],gcd(x,y));assert.equal(rems.length,A.euclidSteps(x,y));assert.equal(E[0].ask.options.en[E[0].ask.answer],String(rems.length));
   rems.forEach(e=>assert.equal(e.ask.options.en[e.ask.answer],String(e.row[1]%e.row[2])));
   E.forEach((e,i)=>{if(e.node==='check'&&e.ask)assert.equal(e.ask.answer===0,after(E,i).node==='rem');});}
 }
});

test('every prediction has distinct options, a valid answer and an explanation in both languages',()=>{
 for(const k of A.ORDER)for(let r=0;r<40;r++){const g=A.ALGS[k],n=int(2,12),a=k==='linear-search'?distinct(n):list(n),E=k==='euclid'?run(k,null,null,[int(1,5000),int(1,5000)]):run(k,a,a[0]);
  for(const e of E){assert.ok(g.flow.nodes.some(f=>f.id===e.node),k+' node '+e.node);assert.ok(e.line>=-1&&e.line<g.pseudo.en.length);
   for(const lang of ['en','es']){assert.ok(e.note[lang].trim());if(e.chip)assert.ok(e.chip[lang]);}
   if(!e.ask)continue;const q=e.ask;for(const lang of ['en','es']){assert.ok(q.q[lang].trim()&&q.why[lang].trim());assert.equal(new Set(q.options[lang]).size,q.options[lang].length,k+' '+q.q.en);}
   assert.equal(q.options.en.length,q.options.es.length);assert.ok(q.answer>=0&&q.answer<q.options.en.length);}}
});

test('flowcharts, steps, code and the guide line up for every algorithm',()=>{
 for(const k of A.ORDER){const g=A.ALGS[k],ids=new Set(g.flow.nodes.map(n=>n.id)),lines=g.pseudo.en.length;
  assert.equal(A.ALGS[k].num,A.ORDER.indexOf(k)+1);assert.equal(g.pseudo.es.length,lines);assert.equal(g.teach.length,lines);
  for(const [a,b,pts] of g.flow.edges){assert.ok(ids.has(a)&&ids.has(b),k+' edge '+a+'→'+b);for(const [x,y] of pts)assert.ok(x>=0&&x<=g.flow.w&&y>=0&&y<=g.flow.h,k+' edge point inside the drawing');}
  for(const n of g.flow.nodes)assert.ok(n.x-n.w/2>=0&&n.x+n.w/2<=g.flow.w&&n.y-n.h/2>=0&&n.y+n.h/2<=g.flow.h,k+' node '+n.id+' inside the drawing');
  // No two boxes overlap.
  for(const [i,p] of g.flow.nodes.entries())for(const q of g.flow.nodes.slice(i+1))assert.ok(Math.abs(p.x-q.x)*2>=p.w+q.w||Math.abs(p.y-q.y)*2>=p.h+q.h,k+' '+p.id+' overlaps '+q.id);
  for(const lang of ['python','java','matlab']){const c=g.code[lang];assert.equal(c.map.length,lines,k+' '+lang);for(const m of c.map)for(const l of m)assert.ok(l>=1&&l<=c.lines.length);
   for(const t of g.teach)for(const L of ['en','es'])assert.ok(t[lang][L].trim()&&t.step[L].trim());}
  assert.equal(g.trace.en.length,g.trace.es.length);}
});

// The printed programs are run, not only shown: Python and Java must agree with the references.
const CASES={'find-max':Array.from({length:60},()=>[list(int(1,12))]),'linear-search':Array.from({length:60},()=>{const a=distinct(int(1,12));return[a,R()<.6?a[int(0,a.length-1)]:500];}),
 'bubble-sort':Array.from({length:60},()=>[list(int(1,12))]),'insertion-sort':Array.from({length:60},()=>[list(int(1,12))]),euclid:Array.from({length:60},()=>[int(1,99999),int(1,99999)])};
const want={'find-max':([a])=>Math.max(...a),'linear-search':([a,t])=>a.indexOf(t),'bubble-sort':([a])=>[...a].sort((x,y)=>x-y).join(' '),'insertion-sort':([a])=>[...a].sort((x,y)=>x-y).join(' '),euclid:([a,b])=>gcd(a,b)};
const has=cmd=>spawnSync(cmd,['--version'],{encoding:'utf8'}).status===0;
test('the Python programs print the reference answers',{skip:!has('python3')&&'python3 is not installed'},()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'quidence-algorithms-py-'));
 try{const calls={'find-max':c=>`find_max(${JSON.stringify(c[0])})`,'linear-search':c=>`linear_search(${JSON.stringify(c[0])}, ${c[1]})`,'bubble-sort':c=>`' '.join(map(str, bubble_sort(${JSON.stringify(c[0])})))`,'insertion-sort':c=>`' '.join(map(str, insertion_sort(${JSON.stringify(c[0])})))`,euclid:c=>`gcd(${c[0]}, ${c[1]})`};
  for(const k of A.ORDER){const file=path.join(dir,k.replace('-','_')+'.py');fs.writeFileSync(file,A.ALGS[k].code.python.lines.join('\n')+'\n\n'+CASES[k].map(c=>`print(${calls[k](c)})`).join('\n')+'\n');
   const r=spawnSync('python3',['-I',file],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);assert.deepEqual(r.stdout.trim().split('\n'),CASES[k].map(c=>String(want[k](c))),k);}}
 finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('the Java methods compile and print the reference answers',{skip:!(has('javac')&&has('java'))&&'a Java compiler is not installed'},()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'quidence-algorithms-java-'));
 try{const arr=a=>`new int[]{${a.join(', ')}}`,show='static String show(int[] a){StringBuilder s=new StringBuilder();for(int i=0;i<a.length;i++){if(i>0)s.append(\' \');s.append(a[i]);}return s.toString();}';
  const calls={'find-max':c=>`System.out.println(findMax(${arr(c[0])}));`,'linear-search':c=>`System.out.println(linearSearch(${arr(c[0])}, ${c[1]}));`,'bubble-sort':c=>`{int[] a=${arr(c[0])};bubbleSort(a);System.out.println(show(a));}`,'insertion-sort':c=>`{int[] a=${arr(c[0])};insertionSort(a);System.out.println(show(a));}`,euclid:c=>`System.out.println(gcd(${c[0]}, ${c[1]}));`};
  const body=A.ORDER.map(k=>A.ALGS[k].code.java.lines.join('\n')).join('\n\n'),main=A.ORDER.flatMap(k=>CASES[k].map(calls[k])).join('\n');
  fs.writeFileSync(path.join(dir,'Algorithms.java'),`public class Algorithms {\n${body}\n${show}\npublic static void main(String[] args){\n${main}\n}\n}\n`);
  const c=spawnSync('javac',['Algorithms.java'],{cwd:dir,encoding:'utf8'});assert.equal(c.status,0,c.stderr);
  const r=spawnSync('java',['-cp',dir,'Algorithms'],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);
  assert.deepEqual(r.stdout.trim().split('\n'),A.ORDER.flatMap(k=>CASES[k].map(c=>String(want[k](c)))));}
 finally{fs.rmSync(dir,{recursive:true,force:true});}
});
// MATLAB cannot run here. Its listings are checked for the 1-based details that differ from Python and Java.
test('the MATLAB listings use 1-based positions and MATLAB syntax',()=>{
 const m=k=>A.ALGS[k].code.matlab.lines.join('\n');
 assert.match(m('find-max'),/best = a\(1\);[\s\S]*for i = 2:numel\(a\)/);assert.match(m('linear-search'),/idx = -1;[\s\S]*for i = 1:numel\(a\)/);
 assert.match(m('bubble-sort'),/for i = 1:n-p[\s\S]*a\(\[i i\+1\]\) = a\(\[i\+1 i\]\);/);assert.match(m('insertion-sort'),/while j >= 1 && a\(j\) > key/);assert.match(m('euclid'),/while b ~= 0[\s\S]*mod\(a, b\)/);
 for(const k of A.ORDER){const src=m(k);assert.equal((src.match(/\b(?:for|while|if|function)\b/g)||[]).length,(src.match(/^\s*end\b/gm)||[]).length,k+': every block has its end');assert.doesNotMatch(src,/[{}]|\+\+|!=|==\s*-?\d+\s*\)\s*\{/);}
});

test('the challenge checks decide counterexamples and improvements correctly',()=>{
 // #1: starting at 0 fails exactly when every number is negative.
 for(let r=0;r<400;r++){const a=list(int(2,12),-50,50);assert.equal(A.checkMaxZero(a).counter,a.every(x=>x<0));}
 // #1 improvement: all three methods are correct; pairs need 3n/2 − 2 comparisons on an even n.
 for(let r=0;r<300;r++){const a=list(int(1,13));for(const v of [0,1,2]){const x=A.minMaxVariant(a,v);assert.equal(x.max,Math.max(...a));assert.equal(x.min,Math.min(...a));}}
 assert.deepEqual(A.testMinMax(1,R).rows.map(r=>r[3]),[148,148,148]);assert.deepEqual(A.testMinMax(2,R).rows.map(r=>r[3]).slice(1),[99,198]);
 // #2: only a repeated target is a counterexample.
 assert.deepEqual(A.checkLinearFirst([4,7,1,7],7),{first:1,count:2,counter:true});assert.equal(A.checkLinearFirst([4,7,1],7).counter,false);
 // #2 improvement: the halving search passes, and the wrong blocks fail.
 const ok=A.testBuilder(0,[1,2,3],R);assert.equal(ok.passed,ok.total);assert.ok(ok.worst<=7&&ok.halving);
 assert.ok(A.testBuilder(1,[1,2,3],R).passed<300);assert.equal(A.testBuilder(0,[1,2,4],R).fail.error,'stuck');assert.equal(A.testBuilder(0,[2,1,3],R).fail.error,'unset');
 // #3: early stopping is correct and saves nothing on reversed lists; comparing a[i] with a[i + 2] breaks sorting.
 const early=A.testImprove({early:true},R);assert.ok(early.correct&&early.early);const rev=early.rows.find(r=>r[0]==='reversed');assert.equal(rev[2],rev[3]);
 assert.equal(A.testImprove({skip2:true},R).correct,false);
 // #4: decreasing lists are counterexamples, and so is [2, 3, 1]; an increasing list is not.
 assert.ok(A.checkInsertion([5,4,3,2,1]).counter&&A.checkInsertion([2,3,1]).counter);assert.equal(A.checkInsertion([1,2,3,4,5]).counter,false);
 assert.equal(A.judgeInsertionBox('icheck',A.insertionBoxCounts([1,2,3,4])),'max');assert.equal(A.judgeInsertionBox('wcheck',A.insertionBoxCounts([4,3,2,1])),'max');assert.equal(A.judgeInsertionBox('shift',A.insertionBoxCounts([4,3,2,1])),'shift');
 assert.equal(A.judgeBottleneck('icheck',A.bubbleCounts([3,1,2])),'icheck');assert.equal(A.judgeBottleneck('pcheck',A.bubbleCounts([3,1,2])),'outer');
 // #5: (1000, 500) is bigger than (13, 8) but needs fewer steps; only the remainder keeps every answer.
 assert.deepEqual(A.checkEuclidPairs([13,8],[1000,500]),{s1:5,s2:1,bigger:true,counter:true});
 const v=[0,1,2,3].map(x=>A.testEuclidVariant(x,R));assert.equal(v[0].ok,200);assert.equal(v[1].ok,200);assert.ok(v[1].mine<v[1].base);assert.ok(v[2].ok<200&&v[3].ok<200);
});

test('the cost questions state true numbers',()=>{
 const key=k=>A.CPLX[k].options.en[A.CPLX[k].answer];
 assert.equal(key('find-max'),'999');assert.equal(A.ALGS['find-max'].gen([...Array(1000).keys()],null,R).filter(e=>e.node==='cmp').length,999);
 assert.equal(key('linear-search'),'1,000,000');
 assert.equal(key('bubble-sort'),'4,950');assert.equal(A.bubbleVariant([...Array(100).keys()].reverse(),{early:true}).comps,4950);
 assert.equal(key('insertion-sort'),'999');assert.equal(A.insertionCounts([...Array(1000).keys()]).comps,999);
 // Lamé: k remainder steps with a > b need b ≥ F(k + 1), so below 10^6 the worst is 28 steps, 29 if the pair is given smaller first.
 const F=[0,1];while(F.length<32)F.push(F.at(-1)+F.at(-2));assert.equal(F[30],832040);assert.ok(F[31]>=1e6);
 assert.equal(A.euclidSteps(832040,514229),28);assert.equal(A.euclidSteps(514229,832040),29);assert.equal(key('euclid'),'about 30');
 for(let r=0;r<20000;r++)assert.ok(A.euclidSteps(int(1,999999),int(1,999999))<=29);
});

test('recommendations follow the evidence and name only real routes',()=>{
 const T=(k,e,p)=>A.recommend(k,e,p);
 assert.equal(T('find-max',{counter:{status:'counter',why:0}}).num,2);assert.equal(T('find-max',{improve:{v:1}}).num,2);assert.equal(T('find-max',{},{asked:6,matched:1}).num,1);
 assert.equal(T('linear-search',{built:{passed:300,total:300}}).num,3);assert.equal(T('linear-search',{},{asked:5,matched:1}).num,2);
 assert.equal(T('bubble-sort',{bottle:{ok:true},improve:{correct:true,early:true}}).num,4);assert.equal(T('bubble-sort',{}).num,3);
 assert.equal(T('insertion-sort',{counter:{status:'counter',why:0}}).num,5);
 const e=T('euclid',{counter:{status:'counter',why:0}});assert.equal(e.num,8);assert.equal(e.key,null);
 // Every outcome, in every combination of evidence, is written in both languages and points at a numbered algorithm.
 const ev=[{},{counter:{status:'counter',why:0}},{counter:{status:'counter',why:1}},{built:{passed:300,total:300}},{built:{passed:12,total:300}},{bottle:{ok:true},improve:{correct:true,early:true}},{bottle:{ok:false}},{improve:{v:1,ok:200,total:200}},{cplx:{ok:true}},{cplx:{ok:false},idea:true}];
 for(const k of A.ORDER)for(const x of ev)for(const p of [undefined,{asked:6,matched:6},{asked:6,matched:1}]){const r=T(k,x,p);assert.ok(A.MAP.nodes.some(n=>n[0]===r.num));
  for(const t of [r.title,r.why,...r.items.map(i=>i.text),...r.alt.flatMap(a=>[a[1],a[2]])])assert.ok(t.en.trim()&&t.es.trim()&&t.en!==t.es,k+' '+JSON.stringify(t));
  for(const a of r.alt)assert.ok(A.MAP.nodes.some(n=>n[0]===a[0]));}
});

test('the course text is complete in English and Spanish',()=>{
 const pairs=[];const walk=v=>{if(v&&typeof v==='object'){if('en' in v&&'es' in v&&Object.keys(v).length===2){pairs.push(v);return;}for(const x of Object.values(v))walk(x);}};
 walk(A.ALGS);walk(A.MAP);walk(A.CPLX);walk(A.IDEAS);walk(A.BUILD);
 assert.ok(pairs.length>150);
 for(const p of pairs){if(Array.isArray(p.en)){assert.equal(p.en.length,p.es.length);continue;}assert.equal(typeof p.en,'string');assert.ok(p.en.trim()&&p.es.trim(),JSON.stringify(p));}
 const app=fs.readFileSync(path.join(root,'courses/algorithms/app.js'),'utf8'),html=fs.readFileSync(path.join(root,'courses/algorithms/index.html'),'utf8');
 // Every interface string is written as L(English, Spanish).
 assert.equal((app.match(/\bL\('/g)||[]).length,(app.match(/\bL\('(?:[^'\\]|\\.)*','(?:[^'\\]|\\.)*'\)/g)||[]).length+(app.match(/\bL\('[^']*'\+/g)||[]).length);
 // The course renders its own language, so the shared translator must leave the workbench alone.
 assert.match(html,/id="app" hidden data-no-translate/);
 // Not a speech or AI activity: no dictation module and no fixed language.
 assert.doesNotMatch(html,/speech-review|data-fixed-language/);
 const catalog=JSON.parse(fs.readFileSync(path.join(root,'localization/algorithms-ui-extra-es.json'),'utf8'));
 const shell=html.replace(/<div class="algo" id="app"[\s\S]*?<\/main>/,'</main>').replace(/<(script|style|title)[\s\S]*?<\/\1>/g,'').replace(/<[^>]+>/g,'\n').split('\n').map(s=>s.replace(/&gt;/g,'>').replace(/&amp;/g,'&').trim()).filter(s=>/[A-Za-z]{3}/.test(s));
 const known=new Set([...Object.keys(catalog),'Mathematics and Science','Online learning foundations, charts and reports','Your session','English and Spanish','Quidence · A little more understanding, one step at a time.','a[i] > best ?','Close dialog']);
 for(const s of shell)assert.ok(known.has(s),'Spanish missing for: '+s);
});
