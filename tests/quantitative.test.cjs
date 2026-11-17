'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const harness=require('./course-dom.cjs');
const C=require('../courses/quantitative/content.js'),Q=require('../assets/quant-content.js');
const Models=require('../assets/quant-models.js'),Graphs=require('../assets/course-graphs.js'),Policy=require('../assets/sync-policy.js'),Catalog=require('../assets/course-catalog.js');
const close=(a,b,tol=1e-9)=>assert(Math.abs(a-b)<=tol,a+' != '+b);

test('Parts 1 and 2 have eight lessons, each with four steps, three questions and a model whose controls hold its defaults',()=>{
 assert.equal(C.MODULE,'quantitative');assert.equal(C.VERSION,'quantitative-2');assert.deepEqual(C.PREVIOUS,[{version:'quantitative-1',lessons:4}]);
 assert.deepEqual(C.UNITS.map(u=>u.id),['estimates','shortcuts']);assert.deepEqual(C.LESSONS.map(l=>l.short),['Fermi estimates','Mental approximations','The square-root law','Quick bounds','Indicators and expectation','Symmetry','First-step analysis','Bayes in counts']);
 assert.equal(Q.create().LESSONS.length,8,'create() returns a fresh copy');
 for(const[i,l]of C.LESSONS.entries()){
  assert.equal(l.id,'quantitative-lesson-'+(i+1));assert.equal(l.unit,i<4?'estimates':'shortcuts');assert.equal(l.segment,undefined);
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

test('Indicators: exact distributions from enumeration agree with the models, and their means with the indicator sums',()=>{
 const perms=n=>{const out=[];const go=(a,rest)=>{if(!rest.length){out.push(a);return;}rest.forEach((x,i)=>go([...a,x],rest.filter((_,j)=>j!==i)));};go([],[...Array(n).keys()]);return out;};
 for(let n=1;n<=7;n++){const all=perms(n),count=new Array(n+1).fill(0);for(const p of all)count[p.filter((x,i)=>x===i).length]++;
  const m=Models.matches(n);count.forEach((c,k)=>close(m[k],c/all.length,1e-12));close(m.reduce((s,x,k)=>s+k*x,0),1,1e-12);}
 for(let n=1;n<=5;n++){const count=new Array(7).fill(0);for(let code=0;code<6**n;code++){const seen=new Set();let c=code;for(let i=0;i<n;i++){seen.add(c%6);c=Math.floor(c/6);}count[seen.size]++;}
  const f=Models.faces(n);count.forEach((c,d)=>close(f[d],c/6**n,1e-12));close(f.reduce((s,x,d)=>s+d*x,0),6*(1-(5/6)**n),1e-12);}
 close(Models.matches(10)[0],0.3679,0.0001);close(Models.matches(20)[0],Math.exp(-1),1e-6);close(Models.matches(10)[1],0.3679,0.0001);
 close(6*(1-(5/6)**4),3.106,0.001);close(Models.faces(6)[6],720/6**6);close(Models.faces(4)[4],360/1296);close(435/365,1.19,0.01);assert.equal(30*29/2,435);
 assert.equal(3628800,[...Array(10).keys()].reduce((a,i)=>a*(i+1),1));
 assert.match(Graphs.lab('quantitative',4,{count:'faces',n:6}).readout,/expected number of different faces is 6 × that = 3\.99 · Mean of the exact distribution: 3\.99 · Chance all six faces show: 1\.5%/);
});

test('Symmetry: the first special card, from every arrangement of a small pile',()=>{
 const combos=(N,K)=>{const out=[];const go=(start,a)=>{if(a.length===K){out.push(a);return;}for(let i=start;i<N;i++)go(i+1,[...a,i]);};go(0,[]);return out;};
 for(const[N,K]of[[5,1],[6,2],[8,3],[10,4],[12,5]]){const all=combos(N,K),v=Models.firstSpecial(N,K),dist=new Array(N-K+1).fill(0);
  for(const c of all)dist[c[0]]++;dist.forEach((c,j)=>close(v.p[j],c/all.length,1e-12));
  close(v.p.reduce((s,x,j)=>s+(j+1)*x,0),(N+1)/(K+1),1e-12);close(v.firstPlayer,all.filter(c=>c[0]%2===0).length/all.length,1e-12);
  // Every position holds a special card equally often.
  for(let pos=0;pos<N;pos++)close(all.filter(c=>c.includes(pos)).length/all.length,K/N,1e-12);}
 const deck=Models.firstSpecial(52,4);close(deck.expected,10.6);close(deck.firstPlayer,0.5198,0.0001);close(deck.p[0],4/52,1e-12);assert(deck.p.every((x,j)=>j===0||x<=deck.p[j-1]),'the top card is the most likely');
 close(Models.firstSpecial(10,5).firstPlayer,0.659,0.001);assert(Models.firstSpecial(10,5).firstPlayer>deck.firstPlayer);
 // The top and last cards are counted from the arrangements, and both come out at K/N. With one special card the chances are flat,
 // and the starter gains only from an odd number of cards.
 for(const[N,K]of[[52,4],[10,3],[60,8],[11,1]]){const v=Models.firstSpecial(N,K);close(v.top,K/N,1e-12);close(v.last,K/N,1e-9);}
 close(Models.firstSpecial(11,1).firstPlayer,6/11,1e-12);close(Models.firstSpecial(10,1).firstPlayer,0.5,1e-12);
 assert.match(Graphs.lab('quantitative',5,{cards:20,special:1}).readout,/equally likely to be at any position, 1\/20 each/);assert.doesNotMatch(Graphs.lab('quantitative',5,{cards:20,special:1}).readout,/most likely on top/);
});

test('First-step analysis: turns and collecting, against long sums and a backward recursion',()=>{
 for(const d of[2,3,4,6,10,20])for(let k=2;k<=6;k++){const p=1/d,v=Models.turns(p,k);close(v.reduce((a,b)=>a+b),1,1e-12);
  // Sum the rounds directly: player i wins in round r with chance ((1 − p)^k)^r × (1 − p)^(i−1) × p.
  for(let i=0;i<k;i++){let t=0;for(let r=0;r<3000;r++)t+=((1-p)**k)**r*(1-p)**i*p;close(v[i],t,1e-9);}}
 close(Models.turns(1/6,2)[0],6/11,1e-12);close(Models.turns(1/2,2)[0],2/3,1e-12);close(Models.turns(1/2,3)[0],4/7,1e-12);close(Models.turns(1/20,3)[0],0.3505,0.0001);
 // Collecting: E[m faces seen] = 1 + (m/d) E[m] + (1 − m/d) E[m + 1], solved from the end.
 for(const d of[2,3,4,6,8,20]){let E=0;for(let m=d-1;m>=0;m--)E=(1+(1-m/d)*E)/(1-m/d);close(Models.collect(d),E,1e-9);}
 close(Models.collect(6),14.7,1e-9);
});

test('Bayes in counts: the counts agree with Bayes’ rule in probabilities and in odds',()=>{
 for(const b of[0.1,0.5,1,2.5,9.2,10,33.3,50])for(const se of[50,75,90,95,100])for(const f of[1,5,9,20]){
  const v=Models.bayes(b,se,f),B=b/100,S=se/100,F=f/100;close(v.posterior,B*S/(B*S+(1-B)*F),1e-9);
  close(v.posterior/(1-v.posterior),(B/(1-B))*(S/F),1e-6*(1+B/(1-B)*S/F));assert.equal(v.have+v.not,100000);assert(Number.isInteger(v.have));
  for(const k of['tp','fn','fp','tn'])assert(v[k]>=0&&Math.abs(v[k]-Math.round(v[k]))<1e-6,k+' is a whole number of people');}
 const p=(b,s,f)=>Math.round(1000*Models.bayes(b,s,f).posterior)/10;
 // Every setting the lesson asks for can be set with its controls.
 const bc=Object.fromEntries(C.LESSONS[7].controls.map(c=>[c.name,c]));for(const[name,v]of[['base',1],['base',10],['base',9.2],['sensitivity',99],['sensitivity',90],['falsepos',1],['falsepos',9]]){const steps=(v-bc[name].min)/bc[name].step;close(steps,Math.round(steps),1e-9);assert(v>=bc[name].min&&v<=bc[name].max,name);}
 assert.equal(p(1,90,9),9.2);assert.equal(p(10,90,9),52.6);close(90/171,0.526,0.001);assert.equal(p(9.2,90,9),50.3);assert.equal(p(1,99,9),10);assert.equal(p(1,90,1),47.6);
 close(18/67,0.2687,0.0001);close((9000/8100)/(900/8910),11,1e-9);
 assert.match(Graphs.lab('quantitative',7,{base:1,sensitivity:90,falsepos:9}).readout,/Of all 9,810 positive results, 900 are people who have it: 9\.2%/);
});

test('a record saved with Part 1 alone gains Part 2 and keeps every answer',()=>{
 const map=new Map(),h=harness('quantitative',map);h.click('start');h.choose('unsure');h.input('explanation','Part 1 draft, kept.');
 const now=h.saved(),old={...now,contentVersion:'quantitative-1',labs:now.labs.slice(0,4),lessons:now.lessons.slice(0,4)};
 const up=h.E.hydrate(JSON.parse(JSON.stringify(old)));assert(up);assert.equal(up.contentVersion,'quantitative-2');assert.equal(up.labs.length,8);assert.equal(up.lessons.length,8);
 assert.deepEqual(up.records,old.records);assert.deepEqual(up.labs.slice(4),C.LESSONS.slice(4).map(l=>l.defaults));
 const event=up.events[up.events.length-1];assert.equal(event.type,'lessons_added');assert.equal(event.from,'quantitative-1');assert.deepEqual(event.lessons,C.LESSONS.slice(4).map(l=>l.id));
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
 assert.match(h.app.innerHTML,/Eight starting points\./);assert.match(h.app.innerHTML,/after all eight lessons/);
 h.click('start');assert.match(h.app.innerHTML,/class="lesson-unit">Part 1 · Fast estimates</);assert.doesNotMatch(h.app.innerHTML,/lesson-standards/);
 h.choose('unsure');h.input('explanation','Multiply the factors; keep this draft.');
 h=harness('quantitative',map);assert.equal(h.app.querySelector('[name="explanation"]').value,'Multiply the factors; keep this draft.');
 for(let i=0;i<C.LESSONS.length;i++){
  const lesson=C.LESSONS[i];if(i){h.click('continue');h.choose('unsure');h.input('explanation','A first guess from the factors.');}
  assert.match(h.app.innerHTML,new RegExp('class="lesson-unit">'+(i<4?'Part 1 · Fast estimates':'Part 2 · Probability shortcuts')+'<'));
  h.submit();h.click('next');const before=JSON.stringify(h.saved().records);
  for(const c of lesson.controls)h.lab(c.name,c.options?c.options[c.options.length-1][0]:c.max);
  assert.doesNotMatch(h.app.innerHTML,/NaN/);assert.equal(JSON.stringify(h.saved().records),before,'Moving a slider is not an answer');
  for(let j=0;j<4;j++)h.click('next-step');
  for(const task of lesson.checks){h.choose(task.correct[0]);h.input('explanation','The model shows it: '+task.explanation.slice(0,40));h.submit();h.click('next');}
 }
 h.click('continue');assert.equal(h.saved().view,'summary');assert(h.E.hydrate(h.saved()));
 assert(Policy.valid(h.E.SCHEMA,map.get(h.E.SCHEMA)));assert.equal(map.get('physics_beta01_session_v1'),'another subject remains untouched');
 h.click('export-json');const report=JSON.parse(await h.blobs[0].text());
 assert.match(h.app.innerHTML,/EIGHT-LESSON SUMMARY/);assert.match(h.app.innerHTML,/Guess fast\.<br>Then check\./);
 assert.equal(Object.keys(report.records).length,24);assert.match(report.note,/explanations need human review/);
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
  three:p=>300/num(p.match(/passed ([\d,]+) independent/)[1]),
  runs:p=>(num(p.match(/Flip (\d+) fair/)[1])-1)/4,
  pairs:p=>{const n=num(p.match(/group of (\d+) people/)[1]);return n*(n-1)/2/365;},
  first:p=>{const m=p.match(/pile of (\d+) cards contains (\d+) special/);return(num(m[1])+1)/(num(m[2])+1);},
  color:p=>{const m=p.match(/has (\d+) red and (\d+) blue/);return 100*num(m[1])/(num(m[1])+num(m[2]));},
  turns:p=>{const d=num(p.match(/chance 1 in (\d+)/)[1]);let w=0;for(let r=0;r<5000;r++)w+=(1-1/d)**(2*r)/d;return 100*w;},
  collect:p=>{const d=num(p.match(/fair (\d+)-sided/)[1]);let e=0;for(let k=1;k<=d;k++)e+=d/k;return e;},
  bayes:p=>{const m=p.match(/affects (\d+) in 1,000 people\. A test is positive for (\d+)% of people who have it and for (\d+)%/);const b=num(m[1])/1000,s=num(m[2])/100,f=num(m[3])/100;return 100*b*s/(b*s+(1-b)*f);}
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
 for(const item of all('runs'))assert.equal(R.check(item,String(2*item.exact)),false,'(n − 1) ÷ 2 counts both orders');
 for(const item of all('pairs')){const n=Number(item.prompt.match(/group of (\d+)/)[1]);assert(R.check(item,String(n*n/730)),'n² ÷ 730');assert.equal(R.check(item,String(n/365)),false,'n ÷ 365 counts people, not pairs');}
 for(const item of all('first')){const m=item.prompt.match(/pile of (\d+) cards contains (\d+)/),N=+m[1],K=+m[2];assert.equal(R.check(item,String(N/K)),false,'N ÷ K ignores the gaps');}
 for(const item of all('color'))assert(R.check(item,String(item.exact)),'the first-draw chance');
 for(const item of all('turns'))assert.equal(R.check(item,'50'),false,'going first is an advantage');
 for(const item of all('collect')){const d=Number(item.prompt.match(/fair (\d+)-sided/)[1]);assert(R.check(item,String(d*(Math.log(d)+0.5772))),'d(ln d + 0.577)');assert.equal(R.check(item,String(d)),false,'d rolls');}
 for(const item of all('first'))assert.match(item.prompt,/A decimal is fine\./);
 for(const item of all('bayes')){assert(item.tol<=3&&item.tol<=item.exact/4,'3 points, or a quarter of the answer');assert.equal(R.check(item,String(item.exact/2)),false,'half the right answer');const m=item.prompt.match(/affects (\d+) in 1,000 people\. A test is positive for (\d+)% of people who have it and for (\d+)%/),b=+m[1],se=+m[2],f=+m[3];assert(R.check(item,String(100*b*se/(b*se+1000*f))),'rounding 1,000 − b to 1,000');assert.equal(R.check(item,String(se)),false,'the detection rate is not the answer');}
 // A saved Part 1 round is rebuilt exactly as it was played before Part 2 was added: the same templates, numbers and
 // tolerances. The fingerprint leaves out the computed answers, whose last binary digit can differ between JavaScript
 // engines; those are checked above against a recomputation from each prompt.
 const key=it=>({template:it.template,prompt:it.prompt,kind:it.kind,tol:it.tol,rel:it.rel,accept:it.accept,options:it.options});
 const fingerprint=require('node:crypto').createHash('sha256').update(JSON.stringify(Array.from({length:300},(_,i)=>R.makeRound(i+1,[1,2,3,4]).map(key)))).digest('hex');
 assert.equal(fingerprint,'c9adb68e8dc0152624964651ac699b735c8d47be54f4e55ba270a34db23fa8ce');
 assert.deepEqual(R.LESSONS,[1,2,3,4,5,6,7,8]);for(let seed=1;seed<=200;seed++)for(const item of R.makeRound(seed,[1,2,3,4]))assert(R.TEMPLATES[item.template].lesson<=4);
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
 const bad=[r=>{r.rounds[0].answers[0].correct=!r.rounds[0].answers[0].correct;},r=>{r.rounds[0].answers[0].template='other';},r=>{r.rounds[0].answers[0].confidence=55;},r=>{r.rounds[0].seed=1.5;},r=>{r.rounds[0].lessons=[9];},r=>{r.rounds[0].lessons=[1,1,2,3];},r=>{r.schema='x';},r=>{r.rounds[0].answers.push(...Array(3).fill(r.rounds[0].answers[0]));}];
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
