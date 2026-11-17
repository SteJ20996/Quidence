'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const harness=require('./course-dom.cjs');
const C=require('../courses/quantitative/content.js'),Q=require('../assets/quant-content.js');
const Models=require('../assets/quant-models.js'),Graphs=require('../assets/course-graphs.js'),Policy=require('../assets/sync-policy.js'),Catalog=require('../assets/course-catalog.js');
const close=(a,b,tol=1e-9)=>assert(Math.abs(a-b)<=tol,a+' != '+b);

test('Part 1 has four lessons, each with four steps, three questions and a model whose controls hold its defaults',()=>{
 assert.equal(C.MODULE,'quantitative');assert.equal(C.VERSION,'quantitative-1');assert.equal(C.PREVIOUS,undefined);
 assert.deepEqual(C.UNITS.map(u=>u.id),['estimates']);assert.deepEqual(C.LESSONS.map(l=>l.short),['Fermi estimates','Mental approximations','The square-root law','Quick bounds']);
 assert.equal(Q.create().LESSONS.length,4,'create() returns a fresh copy');
 for(const[i,l]of C.LESSONS.entries()){
  assert.equal(l.id,'quantitative-lesson-'+(i+1));assert.equal(l.unit,'estimates');assert.equal(l.segment,undefined);
  assert.equal(l.steps.length,4);for(const s of l.steps){assert(s.title&&s.text);for(const k of['predict','test','explain'])assert(s.activity[k],k);}
  const tasks=[l.predict,...l.checks];assert.equal(tasks.length,3);
  for(const[j,t]of tasks.entries()){assert.equal(t.id,'quantitative-l'+(i+1)+'-q'+(j+1));assert.equal(t.options.length,3);assert.deepEqual(t.correct,['0']);assert.equal(new Set(t.options.map(o=>o.label)).size,3);assert(t.explanation);assert.equal(t.options.findIndex(o=>o.id==='0'),(3-(i+j)%3)%3);}
  for(const c of l.controls){const v=l.defaults[c.name];assert(v!==undefined,c.name);if(c.options)assert(c.options.some(([x])=>x===v));else{assert(v>=c.min&&v<=c.max);close(((v-c.min)/c.step)%1,0);}}
  assert(l.next);
 }
 const card=Catalog.COURSES.quantitative;assert.equal(card.group,'further');assert.equal(card.lessonCount,C.LESSONS.length);assert.equal(card.course,'courses/quantitative/');
 // No check or project is published yet, so the card must not link to one.
 for(const k of['foundation','challenge','project','intuition'])assert.equal(card[k],undefined,k);
});

test('Fermi estimates: errors multiply, so their logarithms add and spread like √n',()=>{
 for(const n of[1,2,4,8])for(const k of[1.5,2,3,5]){
  const v=Models.fermi(n,k),L=Math.log10(k);
  close(v.worst,k**n,1e-6);assert.equal(v.logs.length,Models.FERMI.trials);
  assert(v.logs.every(x=>Math.abs(x)<=n*L+1e-12),'no estimate beyond the worst case');
  // The sample spread matches the sum of n independent uniform errors: L × √(n ÷ 3).
  const mean=v.logs.reduce((a,b)=>a+b)/v.logs.length,sd=Math.sqrt(v.logs.reduce((a,b)=>a+(b-mean)**2,0)/v.logs.length);
  close(sd,L*Math.sqrt(n/3),0.04*L*Math.sqrt(n/3)+1e-9);close(mean,0,0.08*L*Math.sqrt(n)+1e-9);
 }
 // One factor: |log error| is uniform on [0, L], so the median estimate is off by √spread.
 close(Math.log10(Models.fermi(1,4).median),Math.log10(4)/2,0.02);assert.equal(Models.fermi(1,2).within2,1);
 // The typical error grows much more slowly than the worst case.
 const a=Models.fermi(4,2),b=Models.fermi(8,2);assert(b.median<a.median**2);assert(a.median<1.8&&a.median>1.7);assert(a.within2>0.55&&a.within2<0.65);
 assert.match(C.LESSONS[0].predict.explanation,/within about 1\.75 times/);
 // The napkin and dog-food examples.
 assert.equal(1200/3*2*180,144000);close(300000/10*0.3*365,3285000);close(Math.sqrt(200*20000),2000);close(Math.sqrt(100*10000),1000);
});

test('Doubling times: the exact value, the rule of 72 and 69.3 ÷ rate',()=>{
 for(let r=1;r<=25;r++){const v=Models.doubling(r);close(v.exact,Math.log(2)/Math.log(1+r/100));close(v.rule72,72/r);close(v.rule69,100*Math.log(2)/r);assert(v.rule69<v.exact,'yearly compounding always takes longer than continuous');}
 close(Models.doubling(6).exact,11.896,0.001);close(Models.doubling(8).exact,9.006,0.001);
 // 72 beats 69.3 at ordinary rates but not at very low ones.
 const err=(r,k)=>Math.abs(Models.doubling(r)[k]/Models.doubling(r).exact-1);
 assert(err(8,'rule72')<err(8,'rule69'));assert(err(1,'rule69')<err(1,'rule72'));assert(err(8,'rule72')<err(2,'rule72'));
 assert.equal(2**10,1024);assert.equal(2**30,1073741824);close(1.5*0.5,0.75);close(1.1*0.9,0.99);
});

test('The square-root law: exact binomial shares against the 68–95–99.7 rule',()=>{
 // Exact binomial probabilities by repeated multiplication, independent of the model's logarithms.
 const pmf=n=>{const p=[2**-n];for(let k=1;k<=n;k++)p.push(p[k-1]*(n-k+1)/k);return p;};
 for(const n of[10,100,1000]){const p=pmf(n),v=Models.spread(n);close(p.reduce((a,b)=>a+b),1,1e-9);
  for(const k of[0,Math.floor(n/3),Math.floor(n/2)])close(Models.binomial(n,k),p[k],1e-9*Math.max(1,p[k]));
  close(v.sdCount,Math.sqrt(n)/2);close(v.sdShare,1/(2*Math.sqrt(n)));
  close(v.inside,p.slice(v.lo,v.hi+1).reduce((a,b)=>a+b),1e-9);close(v.tail60,p.slice(Math.ceil(0.6*n)).reduce((a,b)=>a+b,0),1e-12);
  assert(v.inside>0.95&&v.inside<0.99,'about 95% within 2 SD');
 }
 const s100=Models.spread(100);assert.equal(s100.lo,40);assert.equal(s100.hi,60);close(s100.inside,0.9648,0.0001);
 close(Models.spread(10).tail60,386/1024);close(Models.spread(10).z60,0.632,0.001);close(Models.spread(1000).z60,6.32,0.01);assert(Models.spread(1000).tail60<1e-9);
 // Halving the spread takes four times as many tosses; polls: 1.96 × 0.5 ÷ √n.
 close(Models.spread(400).sdShare/Models.spread(1600).sdShare,2);close(1.96*0.5/Math.sqrt(400),0.049);close(1.96*0.5/Math.sqrt(1000),0.031,0.001);
 assert.match(Graphs.lab('quantitative',2,{tosses:'10000'}).readout,/less than 1 in a million/);
});

test('Quick bounds: at least one success, the union bound, 1 − e^(−np) and the rule of three',()=>{
 // Enumerate every outcome of a few tries to check the complement rule exactly.
 for(const p of[0.1,0.25,0.5])for(let n=1;n<=6;n++){let any=0;for(let m=1;m<2**n;m++){let pr=1;for(let i=0;i<n;i++)pr*=(m>>i)&1?p:1-p;any+=pr;}
  const v=Models.atLeastOne(p,n);close(v.exact,any,1e-12);close(v.none,1-any,1e-12);assert(v.union>=v.exact-1e-12);assert(v.approx<=v.exact+1e-12,'1 − e^(−np) is a lower bound, since 1 − p ≤ e^(−p)');}
 close(Models.atLeastOne(0.1,10).exact,0.6513,0.0001);close(Models.atLeastOne(0.05,20).exact,0.6415,0.0001);close(Models.atLeastOne(0.02,3).union-Models.atLeastOne(0.02,3).exact,0.0012,0.0001);
 for(const n of[100,300,600])close((1-3/n)**n,Math.exp(-3),0.003);close(Models.atLeastOne(0.01,300).none,0.049,0.001);
 assert.match(Graphs.lab('quantitative',3,{chance:20,tries:20}).readout,/Union bound n × p = 400%, impossible as a chance/);
});

test('every lab renders at the defaults and at every control extreme without NaN',()=>{
 for(const[i,l]of C.LESSONS.entries()){
  const settings=[l.defaults];for(const c of l.controls){if(c.options)for(const[v]of c.options)settings.push({...l.defaults,[c.name]:v});else for(const v of[c.min,c.max])settings.push({...l.defaults,[c.name]:v});}
  for(const s of settings){const out=Graphs.lab('quantitative',i,s);assert.doesNotMatch(out.graph,/NaN|Infinity|undefined/);assert.match(out.graph,/figcaption/);assert(out.readout&&out.formula&&out.note);assert.doesNotMatch(out.readout,/NaN|undefined|Infinity/);}
 }
});

test('the complete course flow saves answers and reasoning, reloads, shows the part and exports',async()=>{
 const map=new Map([['physics_beta01_session_v1','another subject remains untouched']]);
 let h=harness('quantitative',map);assert.equal(map.has(h.E.SCHEMA),false);assert.equal(h.E.SCHEMA,'quantitative_beta01_session_v1');
 assert.match(h.app.innerHTML,/Four starting points\./);assert.match(h.app.innerHTML,/after all four lessons/);
 h.click('start');assert.match(h.app.innerHTML,/class="lesson-unit">Part 1 · Fast estimates</);assert.doesNotMatch(h.app.innerHTML,/lesson-standards/);
 h.choose('unsure');h.input('explanation','Multiply the factors; keep this draft.');
 h=harness('quantitative',map);assert.equal(h.app.querySelector('[name="explanation"]').value,'Multiply the factors; keep this draft.');
 for(let i=0;i<C.LESSONS.length;i++){
  const lesson=C.LESSONS[i];if(i){h.click('continue');h.choose('unsure');h.input('explanation','A first guess from the factors.');}
  h.submit();h.click('next');const before=JSON.stringify(h.saved().records);
  for(const c of lesson.controls)h.lab(c.name,c.options?c.options[c.options.length-1][0]:c.max);
  assert.doesNotMatch(h.app.innerHTML,/NaN/);assert.equal(JSON.stringify(h.saved().records),before,'Moving a slider is not an answer');
  for(let j=0;j<4;j++)h.click('next-step');
  for(const task of lesson.checks){h.choose(task.correct[0]);h.input('explanation','The model shows it: '+task.explanation.slice(0,40));h.submit();h.click('next');}
 }
 h.click('continue');assert.equal(h.saved().view,'summary');assert(h.E.hydrate(h.saved()));
 assert(Policy.valid(h.E.SCHEMA,map.get(h.E.SCHEMA)));assert.equal(map.get('physics_beta01_session_v1'),'another subject remains untouched');
 h.click('export-json');const report=JSON.parse(await h.blobs[0].text());
 assert.match(h.app.innerHTML,/FOUR-LESSON SUMMARY/);assert.match(h.app.innerHTML,/Guess fast\.<br>Then check\./);
 assert.equal(Object.keys(report.records).length,12);assert.match(report.note,/explanations need human review/);
 assert.equal(JSON.parse(map.get('cluevera_saved_reports_v1')).items[0].module,'quantitative');
});

test('quick rounds: every question is recomputed from its own wording, and answers are accepted only within the stated range',()=>{
 const R=require('../assets/quant-rounds.js'),num=s=>Number(s.replace(/,/g,''));
 const recompute={
  doubling:p=>{const r=num(p.match(/grows by (\d+)%/)[1]);return Math.log(2)/Math.log(1+r/100);},
  doublings:p=>Math.log2(num(p.match(/into ([\d,]+)\?/)[1])),
  updown:p=>{const a=num(p.match(/rises (\d+)%/)[1]);return 100*((1+a/100)*(1-a/100)-1);},
  product:p=>{const m=p.match(/Estimate ([\d.]+) × ([\d.]+) × ([\d.]+)/);return num(m[1])*num(m[2])*num(m[3]);},
  geomean:p=>{const m=p.match(/more than ([\d,]+) and less than ([\d,]+)/);return Math.sqrt(num(m[1])*num(m[2]));},
  spread:p=>Math.sqrt(num(p.match(/In ([\d,]+) fair/)[1])),
  surprise:p=>{const m=p.match(/heads ([\d,]+) times in ([\d,]+) tosses/);const h=num(m[1]),n=num(m[2]);return (h-n/2)/(Math.sqrt(n)/2)>2?'yes':'no';},
  atleast:p=>{const m=p.match(/Each of (\d+) independent tries has a (\d+)%/);return 100*(1-(1-num(m[2])/100)**num(m[1]));},
  three:p=>300/num(p.match(/passed ([\d,]+) independent/)[1])
 };
 assert.deepEqual(Object.keys(recompute).sort(),R.IDS.slice().sort());
 const seen=new Set();
 for(let seed=1;seed<=400;seed++){
  const round=R.makeRound(seed);assert.equal(round.length,R.ROUND_SIZE);assert.equal(new Set(round.map(i=>i.template)).size,R.ROUND_SIZE);
  assert.deepEqual(R.makeRound(seed),round,'the same seed rebuilds the same round');
  assert(new Set(round.map(i=>R.TEMPLATES[i.template].lesson)).size>=2,'each round mixes lessons');
  for(const item of round){seen.add(item.template);const expected=recompute[item.template](item.prompt);
   assert(item.prompt&&item.why&&!/NaN|undefined|Infinity/.test(item.prompt+item.why),item.template);
   if(item.kind==='choice'){assert.equal(item.exact,expected);assert.equal(R.check(item,item.exact),true);assert.equal(R.check(item,item.options.find(([v])=>v!==item.exact)[0]),false);assert.equal(R.check(item,'maybe'),null);continue;}
   close(item.exact,expected,1e-9*Math.max(1,Math.abs(expected)));
   const edge=item.rel?item.tol*Math.abs(item.exact):item.tol;
   assert.equal(R.check(item,String(item.exact)),true);assert.equal(R.check(item,String(item.exact+0.98*edge)),true);
   assert.equal(R.check(item,String(item.exact+1.05*edge)),false);assert.equal(R.check(item,String(item.exact-1.05*edge)),false);assert.equal(R.check(item,'about twelve'),null);
  }
 }
 assert.equal(seen.size,R.IDS.length,'every template appears');
 // The lessons' own shortcuts are accepted wherever the bank can ask them; common wrong methods are not.
 const all=id=>{const out=new Map();for(let seed=1;seed<=4000;seed++)for(const item of R.makeRound(seed))if(item.template===id)out.set(item.prompt,item);return[...out.values()];};
 for(const item of all('doubling')){const r=Number(item.prompt.match(/by (\d+)%/)[1]);assert(R.check(item,String(72/r)),'rule of 72 at '+r);assert(R.check(item,String(69.3/r)),'69.3 at '+r);assert(R.check(item,String(69/r)),'69 at '+r);assert.equal(R.check(item,String(100/r)),false,'100 ÷ rate at '+r);}
 for(const item of all('atleast')){const m=item.prompt.match(/Each of (\d+) independent tries has a (\d+)%/),n=+m[1],p=+m[2]/100;assert(R.check(item,String(100*(1-Math.exp(-n*p)))),'1 − e^(−np) for '+n+' at '+p);if(n*p>0.3)assert.equal(R.check(item,String(100*n*p)),false,'n × p for '+n+' at '+p);}
 const products=all('product');assert.equal(products.length,150,'every product combination appears');
 for(const item of products){const f=item.prompt.match(/Estimate ([\d.]+) × ([\d.]+) × ([\d.]+)/).slice(1).map(Number),shown=f.map(R.easy);assert(R.check(item,String(shown[0]*shown[1]*shown[2])),'the rounding shown in the feedback is accepted: '+item.prompt);assert(item.why.includes(shown.map(x=>x.toLocaleString('en-US')).join(' × ')),item.why);}
 for(const item of all('spread')){assert(R.check(item,String(0.98*item.exact)),'1.96 standard deviations');assert.equal(R.check(item,String(item.exact/2)),false,'1 standard deviation');}
 for(const item of all('three')){const n=Number(item.prompt.match(/passed ([\d,]+)/)[1].replace(/,/g,''));assert(R.check(item,String(100*(1-0.05**(1/n)))),'the exact bound');assert.equal(R.check(item,String(100/n)),false,'1 ÷ n');}
 for(const item of all('updown'))assert.equal(R.check(item,String(-item.exact)),false,'a fall must be negative');
 assert.equal(R.parse('1,000'),1000);assert.equal(R.parse('−25%'),-25);assert.equal(R.parse('–4'),-4);assert.equal(R.parse(' 0.5 '),0.5);assert.equal(R.parse('1e3'),1000);assert.equal(R.parse('12 years'),null);assert.equal(R.parse(''),null);
});

test('quick rounds: Brier scores and calibration, and saved records are rebuilt from their seeds or rejected',()=>{
 const R=require('../assets/quant-rounds.js'),V=require('../assets/quick-rounds.js');
 const s=R.summary([{correct:true,confidence:90},{correct:false,confidence:80},{correct:true,confidence:70},{correct:true,confidence:100},{correct:false,confidence:60}]);
 assert.equal(s.right,3);close(s.meanConfidence,80);close(s.brier,(0.01+0.64+0.09+0+0.36)/5);close(s.gap,20);assert.equal(s.verdict,'overconfident');
 assert.equal(R.summary([{correct:true,confidence:50},{correct:false,confidence:50}]).brier,0.25);
 assert.equal(R.summary([{correct:true,confidence:60},{correct:true,confidence:70}]).verdict,'underconfident');assert.equal(R.summary([]),null);
 // Calibration is judged on the last 20 answers across rounds, never on one round.
 const many=k=>({...R.fresh(),rounds:Array.from({length:Math.ceil(k/5)},(_,r)=>({seed:r+1,lessons:[1,2,3,4],startedAt:'2026-11-17T10:00:00.000Z',answers:Array.from({length:Math.min(5,k-5*r)},(_,j)=>({correct:5*r+j>=k-20?(5*r+j)%5!==0:false,confidence:90}))}))});
 assert.deepEqual(R.calibration(many(15)),{enough:false,count:15,needed:20});
 const c=R.calibration(many(25));assert.equal(c.enough,true);assert.equal(c.count,20);assert.equal(c.right,16,'only the last 20 answers count');close(c.gap,10);assert.equal(c.verdict,'well calibrated');
 assert.match(V.calibrationText(R.calibration(many(5))),/too few to judge calibration\. After 20 answers \(you have 5\)/);
 assert.match(V.calibrationText(c),/Over your last 20 answers: 80% right, at an average confidence of 90%\./);
 // Number questions offer low confidence ratings; a two-option question starts at a pure guess, 50%.
 assert.deepEqual(R.SCALES,{number:[10,30,50,70,90,100],choice:[50,60,70,80,90,100]});
 // A genuine record, answered from its own seed, is accepted exactly as saved.
 const round={seed:12345,lessons:[1,2,3,4],startedAt:'2026-11-17T10:00:00.000Z',answers:[]};
 const items=R.makeRound(round.seed,round.lessons);
 for(const it of items.slice(0,3)){const response=it.kind==='choice'?it.exact:'1';round.answers.push({template:it.template,response,confidence:70,correct:R.check(it,response),seconds:null});}
 const record={...R.fresh(),rounds:[round]};assert.deepEqual(R.hydrate(JSON.stringify(record)),record);
 // Tampered or unreadable records are rejected, never repaired.
 const bad=[r=>{r.rounds[0].answers[0].correct=!r.rounds[0].answers[0].correct;},r=>{r.rounds[0].answers[0].template='other';},r=>{r.rounds[0].answers[0].confidence=55;},r=>{r.rounds[0].seed=1.5;},r=>{r.rounds[0].lessons=[9];},r=>{r.schema='x';},r=>{r.rounds[0].answers.push(...Array(3).fill(r.rounds[0].answers[0]));}];
 for(const f of bad){const r=JSON.parse(JSON.stringify(record));f(r);assert.equal(R.hydrate(r),null,f.toString());}
 assert.equal(R.hydrate('{broken'),null);
 // The view: a start screen, a question with its confidence choices, and feedback that keeps the answered question.
 assert.match(V.view(R.fresh()),/Start a round →/);assert.doesNotMatch(V.view(R.fresh()),/Your last rounds/);
 const mid=V.view(record);assert.match(mid,/Question 4 of 5/);assert.match(mid,new RegExp(items[3].prompt.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));for(const c of R.scale(items[3]))assert.match(mid,new RegExp('name="qr-confidence" value="'+c+'"'));
 assert.equal((mid.match(/name="qr-confidence"/g)||[]).length,6);if(items[3].kind==='number')assert(mid.includes('Counts as right '+items[3].accept+' of the exact value'));
 const fb=V.view(record,{feedback:record.rounds[0].answers[2],response:'1',confidence:70});assert.match(fb,/Question 3 of 5/);assert.match(fb,/data-qr="next"/);
 assert.match(V.verdict({verdict:'overconfident',gap:20}),/20 points more confident than accurate/);
 assert.doesNotMatch(V.view(record,{response:'<img src=x onerror=alert(1)>'}),/<img src=x/);
});
