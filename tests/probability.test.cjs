'use strict';
// Probability projects: structure, Spanish coverage, and every checked answer recomputed independently, by
// enumerating outcomes and by exact fractions (BigInt) rather than with the formulas the proofs use.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),build=require('../scripts/build-probability.cjs'),C=require('../courses/number-theory/core.js'),R=require('../courses/probability/core.js');
const data=JSON.parse(fs.readFileSync(path.join(root,'courses/probability/data.json'),'utf8'));
const field=(project,id)=>{const p=data.find(p=>p.id===project);for(const s of p.steps)for(const f of s.fields)if(f.id===id)return f;throw Error('No field '+project+'.'+id);};

// Exact fractions as [numerator, denominator] BigInt pairs.
const gcd=(a,b)=>{a=a<0n?-a:a;b=b<0n?-b:b;while(b){[a,b]=[b,a%b];}return a;};
const Q=(n,d=1n)=>{n=BigInt(n);d=BigInt(d);if(d<0n){n=-n;d=-d;}const g=gcd(n,d)||1n;return [n/g,d/g];};
const add=(a,b)=>Q(a[0]*b[1]+b[0]*a[1],a[1]*b[1]),sub=(a,b)=>Q(a[0]*b[1]-b[0]*a[1],a[1]*b[1]),mul=(a,b)=>Q(a[0]*b[0],a[1]*b[1]),div=(a,b)=>Q(a[0]*b[1],a[1]*b[0]);
const pow=(a,k)=>{let r=Q(1);for(let i=0;i<k;i++)r=mul(r,a);return r;};
const str=q=>q[1]===1n?String(q[0]):q[0]+'/'+q[1];
const less=(a,b)=>a[0]*b[1]<b[0]*a[1];
const half=Q(1,2);
const binom=(n,k)=>{let r=1n;for(let i=1n;i<=BigInt(k);i++)r=r*(BigInt(n)-BigInt(k)+i)/i;return r;};
const permutations=n=>{const out=[];(function go(prefix,rest){if(!rest.length){out.push(prefix);return;}rest.forEach((x,i)=>go([...prefix,x],[...rest.slice(0,i),...rest.slice(i+1)]));})([],Array.from({length:n},(_,i)=>i+1));return out;};
// A stored answer must equal the recomputed value exactly, and its rounding rule must accept the correctly rounded
// value and reject one unit off in the last place.
function expect(project,id,value){
 const f=field(project,id);
 if(f.type!=='number'){assert.equal(f.answer,value,project+'.'+id);return;}
 const v=Array.isArray(value)?str(value):String(value);
 assert.ok(C.equalNumber(f.answer,v),project+'.'+id+': stored '+f.answer+', recomputed '+v);
 if(f.minDecimalPlaces){const x=Array.isArray(value)?Number(value[0])/Number(value[1]):Number(value),r=x.toFixed(f.minDecimalPlaces);
  assert.equal(C.grade(f,r).status,'correct',project+'.'+id+' accepts '+r);
  assert.equal(C.grade(f,(Number(r)+10**-f.minDecimalPlaces).toFixed(f.minDecimalPlaces)).status,'retry',project+'.'+id+' rejects one unit off');}
}

test('ten bilingual projects with well-formed fields and up-to-date page data',()=>{
 assert.equal(fs.readFileSync(build.OUT,'utf8'),build.serialized(),'run node scripts/build-probability.cjs');
 assert.deepEqual(data.map(p=>p.id),Array.from({length:10},(_,i)=>'pr-p'+String(i+1).padStart(2,'0')));
 assert.equal(data.reduce((n,p)=>n+p.steps.length,0),40);
 assert.equal(data.reduce((n,p)=>n+p.steps.reduce((m,s)=>m+s.fields.length,0),0),83);
 const ids=data.flatMap(p=>p.steps.flatMap(s=>s.fields.map(f=>f.id)));assert.equal(new Set(ids).size,ids.length,'field ids are unique');
 const catalog=build.probabilityCatalog();
 for(const p of data){
  for(const key of ['title','topic','prompt','approach','uses','nextCheck'])assert.ok(catalog[p[key]],p.id+'.'+key+' has Spanish');
  for(const s of p.steps){
   assert.ok(s.fields.length&&s.proof.length>100,p.id+' '+s.title);
   for(const para of s.proof.split(/\n\s*\n/))assert.ok(catalog[para.replace(/\s+/g,' ').trim()],'Spanish proof paragraph: '+para.slice(0,40));
   for(const f of s.fields){
    assert.ok(catalog[f.label],'Spanish label '+f.label);
    if(f.type==='number'){assert.equal(C.grade(f,f.answer).status,'correct',p.id+'.'+f.id);assert.ok(f.accepted.includes(f.answer));assert.ok(f.answer.length<=80&&C.rational(f.answer),p.id+'.'+f.id+' fits the answer parser');}
    if(f.type==='choice'){assert.ok(f.options.some(o=>o.value===f.answer));assert.equal(new Set(f.options.map(o=>o.value)).size,f.options.length);for(const o of f.options)assert.ok(catalog[o.label],'Spanish option '+o.label);}
    if(f.type==='reason')assert.ok(f.criteria.length>=2&&f.criteria.every(c=>catalog[c])&&(!f.followup||catalog[f.followup]),p.id+'.'+f.id+' criteria');
   }
  }
 }
 for(const [en,es]of Object.entries(catalog))if(/[A-Za-z]{4}/.test(en.replace(/\b(Ars Conjectandi|Galton|Bertrand|Chebyshev|Markov|Bayes|Poisson|Selvin|Savant|Fermat|Pascal|Méré)\b/g,'')))assert.notEqual(es,en,'untranslated: '+en.slice(0,60));
});

test('dice, points and screening: outcomes counted one by one',()=>{
 const dice=[];for(let a=1;a<=6;a++)for(let b=1;b<=6;b++)dice.push([a,b]);
 expect('pr-p01','outcomes',dice.length);expect('pr-p01','sumSeven',dice.filter(([a,b])=>a+b===7).length);expect('pr-p01','doubleSix',Q(dice.filter(([a,b])=>a===6&&b===6).length,36));
 // Four rolls of one die: all 1296 sequences.
 let none=0;for(let m=0;m<1296;m++){let x=m,six=false;for(let r=0;r<4;r++){if(x%6===5)six=true;x=Math.floor(x/6);}if(!six)none++;}
 expect('pr-p01','noSix',Q(none,1296));expect('pr-p01','betA',Q(1296-none,1296));expect('pr-p01','overcount','overlap');
 const noDouble=n=>pow(Q(35,36),n);expect('pr-p01','betB',sub(Q(1),noDouble(24)));expect('pr-p01','betBEven','worse');
 let n=1;while(!less(noDouble(n),half))n++;expect('pr-p01','fairRolls',n);
 // Problem of points: every sequence of the imagined rounds.
 const wins=(a,b)=>{const n=a+b-1;let w=0;for(let m=0;m<2**n;m++){let x=m,A=0;for(let i=0;i<n;i++){if(x&1)A++;x>>=1;}if(A>=a)w++;}return [w,2**n];};
 const [w12,t12]=wins(1,2);expect('pr-p02','pointsA12',Q(w12,t12));expect('pr-p02','shareA12',w12*64/t12);
 expect('pr-p02','outcomeA',Q(1,2));expect('pr-p02','objection','unequal');
 const [w23,t23]=wins(2,3);expect('pr-p02','winsA23',w23);expect('pr-p02','shareA23',w23*64/t23);
 const [w34,t34]=wins(3,4);expect('pr-p02','pointsA34',Q(w34,t34));expect('pr-p02','shareA34',w34*64/t34);
 // Pascal's recursion agrees with counting.
 const P=(a,b)=>a===0?Q(1):b===0?Q(0):add(mul(half,P(a-1,b)),mul(half,P(a,b-1)));assert.deepEqual(P(3,4),Q(w34,t34));
 // Screening: 10,000 people, counted.
 const sick=10000/100,tp=sick*90/100,fp=(10000-sick)*9/100;expect('pr-p03','sick',sick);expect('pr-p03','truePositive',tp);expect('pr-p03','falsePositive',fp);
 expect('pr-p03','sickGivenPositive',Q(tp,tp+fp));expect('pr-p03','farFrom90','baseRate');
 // Two positives: weight each group by the chance of a second positive.
 expect('pr-p03','twoPositives',div(Q(tp*90,100),add(Q(tp*90,100),Q(fp*9,100))));
 const ctp=1000*90/100,cfp=9000*9/100;expect('pr-p03','clinic',Q(ctp,ctp+cfp));
});

test('boxes and doors: every equally likely draw and every host choice enumerated',()=>{
 const boxes=[['G','G'],['S','S'],['G','S']],draws=[];boxes.forEach((b,i)=>b.forEach((c,j)=>draws.push({box:i,coin:c,other:b[1-j]})));
 const gold=draws.filter(d=>d.coin==='G');expect('pr-p04','goldDraws',gold.length);expect('pr-p04','otherGold',Q(gold.filter(d=>d.other==='G').length,gold.length));
 expect('pr-p04','goldFirst',Q(gold.length,draws.length));expect('pr-p04','halfWrong','twice');
 // Monty Hall with a host who knows: weight each (prize, opened door) by its probability, and keep "host opens 3".
 let opens3=Q(0),win=Q(0);for(const prize of [1,2,3]){const empty=[2,3].filter(d=>d!==prize);for(const d of empty){const w=mul(Q(1,3),Q(1,empty.length));if(d===3){opens3=add(opens3,w);if(prize===2)win=add(win,w);}}}
 expect('pr-p04','switchWins',div(win,opens3));
 // A host who opens 2 or 3 at random; keep "opens 3 and it is empty".
 let ev=Q(0),win2=Q(0);for(const prize of [1,2,3])for(const d of [2,3]){if(d!==3||prize===3)continue;const w=mul(Q(1,3),Q(1,2));ev=add(ev,w);if(prize===2)win2=add(win2,w);}
 expect('pr-p04','randomHost',div(win2,ev));expect('pr-p04','whyChange','process');
 // The lab's simulated host agrees in the long run.
 let games=0,switched=0;const rand=R.random(5);for(let i=0;i<20000;i++){const prize=1+Math.floor(rand()*3),empty=[2,3].filter(d=>d!==prize),open=empty[Math.floor(rand()*empty.length)];games++;if(prize===5-open)switched++;}
 assert.ok(Math.abs(switched/games-2/3)<0.02,'simulated switching wins about 2/3');
});

test('birthdays and cards in place: products and full enumeration of shuffles',()=>{
 const allDifferent=n=>{let q=Q(1);for(let i=0;i<n;i++)q=mul(q,Q(365-i,365));return q;};
 expect('pr-p05','allDifferent3',allDifferent(3));
 // The exact fraction has more digits than an answer can hold, so it is stored to 30 decimal places.
 {const f=field('pr-p05','shared23'),exact=sub(Q(1),allDifferent(23)),[w,frac]=f.answer.split('.'),stored=Q(BigInt(w+frac),10n**BigInt(frac.length)),gap=sub(stored,exact);
  assert.equal(frac.length,30);assert.ok(less(gap[0]<0n?Q(-gap[0],gap[1]):gap,Q(1,10n**30n)),'shared23 within 10⁻³⁰');
  for(const r of ['0.507','0.5073','0.50730'])assert.equal(C.grade(f,r).status,'correct','shared23 accepts '+r);assert.equal(C.grade(f,'0.508').status,'retry');}
 let n=2;while(!less(allDifferent(n),half))n++;expect('pr-p05','halfGroup',n);
 expect('pr-p05','pairs23',Number(binom(23,2)));expect('pr-p05','pairMatch',Q(1,365));
 let m=1;while(!less(pow(Q(364,365),m),half))m++;expect('pr-p05','myBirthday',m);
 for(const k of [3,4,5,6,7]){const ps=permutations(k),fixed=ps.map(p=>p.filter((c,i)=>c===i+1).length),N=ps.length;
  assert.deepEqual(Q(fixed.reduce((a,b)=>a+b,0),N),Q(1),'mean 1 for '+k);
  assert.deepEqual(sub(Q(fixed.reduce((a,b)=>a+b*b,0),N),Q(1)),Q(1),'variance 1 for '+k);
  if(k===3){expect('pr-p06','average3',Number(Q(fixed.reduce((a,b)=>a+b,0),N)[0]));expect('pr-p06','none3',Q(fixed.filter(x=>x===0).length,N));}
  if(k===5)expect('pr-p06','none5',Q(fixed.filter(x=>x===0).length,N));
  // Two given cards in place: count the permutations directly.
  assert.deepEqual(Q(ps.filter(p=>p[0]===1&&p[1]===2).length,N),Q(1,k*(k-1)));}
 expect('pr-p06','inPlace52',Q(1,52));expect('pr-p06','expected52',1);expect('pr-p06','bothInPlace',Q(1,52*51));expect('pr-p06','variance',1);expect('pr-p06','largeN','poisson');
 // The lab's shuffles average close to 1 fixed point.
 const rand=R.random(11);let total=0;for(let i=0;i<20000;i++){const p=R.shuffle(8,rand);assert.equal(new Set(p).size,8);total+=R.fixedPoints(p);}
 assert.ok(Math.abs(total/20000-1)<0.03,'simulated mean near 1');
});

test('waiting for a six and collecting faces: exact sums and stage means',()=>{
 expect('pr-p07','third',mul(pow(Q(5,6),2),Q(1,6)));expect('pr-p07','noSixTen',pow(Q(5,6),10));
 // E[T] from Σ k P(T = k): the partial sums approach 6 from below.
 let partial=Q(0);for(let k=1;k<=200;k++)partial=add(partial,mul(Q(k),mul(pow(Q(5,6),k-1),Q(1,6))));
 assert.ok(less(partial,Q(6))&&less(sub(Q(6),partial),Q(1,10**10)),'E[T] = 6');expect('pr-p07','expectedWait',6);
 expect('pr-p07','memoryless',div(pow(Q(5,6),15),pow(Q(5,6),10)));expect('pr-p07','due','still');
 const round=sub(Q(1),pow(Q(5,6),2));expect('pr-p07','roundSucceeds',round);expect('pr-p07','expectedRounds',div(Q(1),round));
 // Coupons: stage means n/(n − k), added exactly.
 const H=(a,b)=>{let h=Q(0);for(let k=a;k<=b;k++)h=add(h,Q(1,k));return h;};
 expect('pr-p08','newFace',Q(4,6));expect('pr-p08','lastStage',6);
 expect('pr-p08','allFaces',mul(Q(6),H(1,6)));
 const fifty=mul(Q(50),H(1,50));expect('pr-p08','fifty',Math.round(Number(fifty[0])/Number(fifty[1])));expect('pr-p08','longestStage','last');
 const first=mul(Q(50),H(26,50));expect('pr-p08','firstHalf',Math.round(Number(first[0])/Number(first[1])));
 // The lab's simulations agree with the means.
 const rand=R.random(23);let waits=0,rolls=0;for(let i=0;i<20000;i++){waits+=R.waitForSix(rand).length;rolls+=R.collectFaces(rand).length;}
 assert.ok(Math.abs(waits/20000-6)<0.15&&Math.abs(rolls/20000-14.7)<0.25,'simulated means near 6 and 14.7');
});

test('the Galton board and the law of large numbers: binomial sums',()=>{
 const pmf=(n,k,p)=>mul(Q(binom(n,k)),mul(pow(p,k),pow(sub(Q(1),p),n-k)));
 expect('pr-p09','paths4',Number(binom(8,4)));expect('pr-p09','bin4',pmf(8,4,half));
 // Mean and variance of the bin number, from the whole distribution.
 let mean=Q(0),sq=Q(0);for(let k=0;k<=8;k++){mean=add(mean,mul(Q(k),pmf(8,k,half)));sq=add(sq,mul(Q(k*k),pmf(8,k,half)));}
 expect('pr-p09','mean8',Number(mean[0]));expect('pr-p09','var8',Number(sub(sq,mul(mean,mean))[0]));
 const p3=Q(3,10);expect('pr-p09','tilted3',pmf(10,3,p3));
 let mode=0;for(let k=1;k<=10;k++)if(less(pmf(10,mode,p3),pmf(10,k,p3)))mode=k;expect('pr-p09','mode',mode);
 // Markov and Chebyshev bounds, and the exact tail they bound.
 expect('pr-p10','busBound',Q(2,10));expect('pr-p10','chebyshev100',Q(25,100));
 let n=1;while(less(Q(1,20),div(Q(1),mul(Q(4*n),Q(1,400)))))n++;expect('pr-p10','tossesNeeded',n);
 let tail=Q(0);for(let k=0;k<=100;k++)if(k<=40||k>=60)tail=add(tail,pmf(100,k,half));expect('pr-p10','exact100',tail);
 assert.ok(less(tail,Q(1,4)),'Chebyshev bounds the exact tail');expect('pr-p10','boundQuality','loose');
});

test('lab helpers: reproducible simulations and the counts the labs show',()=>{
 const a=R.random(9),b=R.random(9);for(let i=0;i<5;i++)assert.equal(a(),b());
 assert.deepEqual(R.DICE.filter(R.DICE_EVENTS.seven).length,6);assert.deepEqual(R.DICE.filter(R.DICE_EVENTS.six).length,11);
 assert.equal(R.pointsSequences(3,4).filter(s=>s.winner==='A').length,42);
 assert.deepEqual(R.screening(10000,.01,.9,.09),{sick:100,healthy:9900,truePositive:90,falsePositive:891});
 assert.ok(Math.abs(R.posterior(.01,.9,.09)-10/109)<1e-12&&Math.abs(R.sharedBirthday(23)-0.507297)<1e-6);
 assert.ok(Math.abs(6*R.harmonic(6)-14.7)<1e-12);
 // The Galton board's pile matches the binomial distribution.
 const rand=R.random(41),counts=Array(9).fill(0);for(let i=0;i<20000;i++)counts[R.galton(8,.5,rand).reduce((s,x)=>s+x,0)]++;
 counts.forEach((c,k)=>assert.ok(Math.abs(c/20000-R.binomial(8,k,.5))<0.015,'bin '+k));
});
test('a stated number of decimal places matches the places the grader requires, in both languages',()=>{
 const source=require('../content/probability/projects.cjs');let checked=0;
 for(const p of source)for(const s of p.steps)for(const f of s.fields){
  if(f.type!=='number')continue;
  const en=(f.label.en||'').match(/at least (\d+) (?:decimal )?places/),es=(f.label.es||'').match(/al menos (\d+) decimales/);
  if(f.minDecimalPlaces>1||en||es){
   assert(en&&es,p.id+' '+f.id+' must state its places in English and Spanish');
   assert.equal(Number(en[1]),f.minDecimalPlaces,p.id+' '+f.id+' English places');assert.equal(Number(es[1]),f.minDecimalPlaces,p.id+' '+f.id+' Spanish places');checked++;
  }
 }
 assert(checked>=30,String(checked));
});
