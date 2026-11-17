(function(root){
'use strict';
// Quick rounds for Quantitative Reasoning: short mixed questions built from the lessons' moves. Each round is drawn
// from a seed, so a saved round can be rebuilt and checked exactly. A learner answers, says how sure they are, and only
// then sees the check. Scoring rewards accuracy; the confidence is scored separately for calibration (Brier score).
const SCHEMA='quidence_quick_rounds_v1',ROUND_SIZE=5,CALIBRATION_ANSWERS=20,LESSONS=[1,2,3,4,5,6,7,8];
// How sure a learner can say they are. A guess at a number is right far less than half the time, so number questions
// offer low ratings; a question with two options starts at 50%, a pure guess.
const SCALES={number:[10,30,50,70,90,100],choice:[50,60,70,80,90,100]};
const scale=item=>SCALES[item.kind];
function seeded(seed){let t=seed>>>0;return()=>{t=(t+0x6D2B79F5)>>>0;let r=Math.imul(t^(t>>>15),1|t);r^=r+Math.imul(r^(r>>>7),61|r);return((r^(r>>>14))>>>0)/4294967296;};}
const pickFrom=(rnd,xs)=>xs[Math.floor(rnd()*xs.length)];
// Rounds a factor to an easy number (1, 1.2, 1.5, 2, 2.5, 3, … 9 times a power of ten), the move the product question teaches.
const EASY=[1,1.2,1.5,2,2.5,3,4,5,6,7,8,9,10];
function easy(x){const e=Math.floor(Math.log10(x)),m=x/10**e;let best=EASY[0];for(const n of EASY)if(Math.abs(Math.log(n/m))<Math.abs(Math.log(best/m)))best=n;return Number((best*10**e).toPrecision(3));}
const nf=x=>x.toLocaleString('en-US'),sup=n=>String(n).split('').map(d=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join('');
// Each template turns random draws into one question. kind 'number' accepts an answer within tol of the exact value
// (relative when rel is true, otherwise absolute); kind 'choice' has one correct option.
const TEMPLATES={
 doubling:{lesson:2,make(rnd){const r=pickFrom(rnd,[2,3,4,6,8,9,12,15,18,20]);const exact=Math.log(2)/Math.log(1+r/100);
  return{prompt:`Something grows by ${r}% a year. About how many years does it take to double?`,kind:'number',unit:'years',exact,tol:0.1,rel:true,accept:'within 10%',why:`72 ÷ ${r} = ${nf(Math.round(72/r*10)/10)}; exactly, ln 2 ÷ ln ${1+r/100} = ${exact.toFixed(2)} years.`};}},
 doublings:{lesson:2,make(rnd){const k=pickFrom(rnd,[3,6,9,12]);const exact=k*Math.log2(10);
  return{prompt:`About how many doublings turn 1 into ${nf(10**k)}?`,kind:'number',unit:'doublings',exact,tol:1,rel:false,accept:'within 1',why:`2¹⁰ ≈ 10³, so 10${sup(k)} takes about ${k/3*10} doublings; exactly ${exact.toFixed(1)}.`};}},
 updown:{lesson:2,make(rnd){const a=pickFrom(rnd,[10,20,30,40,50]);const exact=100*((1+a/100)*(1-a/100)-1);
  return{prompt:`A price rises ${a}% and then falls ${a}%. What is the overall change, in percent? Give a fall as a negative number, such as −5.`,kind:'number',unit:'%',exact,tol:0.5,rel:false,accept:'within 0.5 points',why:`${(1+a/100).toFixed(2)} × ${(1-a/100).toFixed(2)} = ${((1+a/100)*(1-a/100)).toFixed(2)}, a change of −${(a*a/100).toFixed(0)}%. Percent changes multiply; they do not cancel.`};}},
 product:{lesson:1,make(rnd){const a=pickFrom(rnd,[38,47,52,61,73,86]),b=pickFrom(rnd,[220,310,480,590,760]),c=pickFrom(rnd,[0.04,0.07,0.12,0.18,0.26]);const exact=a*b*c,ea=easy(a),eb=easy(b),ec=easy(c);
  return{prompt:`Estimate ${a} × ${b} × ${c} in your head.`,kind:'number',unit:'',exact,tol:0.25,rel:true,accept:'within 25%',why:`Round each factor to an easy number: ${nf(ea)} × ${nf(eb)} × ${ec} = ${nf(Number((ea*eb*ec).toPrecision(4)))}. Exactly ${nf(Math.round(exact*100)/100)}. When you can, round one factor up and another down, so their errors partly cancel.`};}},
 geomean:{lesson:1,make(rnd){const lo=pickFrom(rnd,[10,20,50,100,200]),ratio=pickFrom(rnd,[100,400,900,10000]);const hi=lo*ratio,exact=Math.sqrt(lo*hi);
  return{prompt:`You are sure a quantity is more than ${nf(lo)} and less than ${nf(hi)}. What single estimate is equally many times from both bounds?`,kind:'number',unit:'',exact,tol:0.15,rel:true,accept:'within 15%',why:`The geometric mean √(${nf(lo)} × ${nf(hi)}) = ${nf(exact)}, ${Math.sqrt(ratio)} times each bound.`};}},
 spread:{lesson:3,make(rnd){const n=pickFrom(rnd,[100,400,900,1600,2500,10000]);const exact=Math.sqrt(n);
  return{prompt:`In ${nf(n)} fair coin tosses, about 95% of results lie within how many heads of ${nf(n/2)}?`,kind:'number',unit:'heads',exact,tol:0.15,rel:true,accept:'within 15%',why:`The standard deviation is √${nf(n)} ÷ 2 = ${nf(exact/2)}, and 2 standard deviations is ${nf(exact)} heads.`};}},
 surprise:{lesson:3,make(rnd){const n=pickFrom(rnd,[100,400,1600,2500]),sd=Math.sqrt(n)/2,z=pickFrom(rnd,[0.6,1,3,4]),heads=Math.round(n/2+z*sd),zz=(heads-n/2)/sd;
  return{prompt:`A coin lands heads ${nf(heads)} times in ${nf(n)} tosses. Is that surprising for a fair coin?`,kind:'choice',options:[['yes','Yes: more than 2 standard deviations from half'],['no','No: within 2 standard deviations of half']],exact:zz>2?'yes':'no',why:`The standard deviation is √${nf(n)} ÷ 2 = ${nf(sd)}, so ${nf(heads)} is ${zz.toFixed(1)} standard deviations above ${nf(n/2)}.`};}},
 atleast:{lesson:4,make(rnd){const p=pickFrom(rnd,[2,5,10,20]),n=pickFrom(rnd,[5,10,20,30]);const exact=100*(1-(1-p/100)**n),quick=100*(1-Math.exp(-n*p/100));
  return{prompt:`Each of ${n} independent tries has a ${p}% chance of success. What is the chance of at least one success, in percent?`,kind:'number',unit:'%',exact,tol:5,rel:false,accept:'within 5 points',why:`1 − ${(1-p/100).toFixed(2)}${sup(n)} = ${exact.toFixed(1)}%; the quick value 1 − e^(−np) gives ${quick.toFixed(1)}%. `+(n*p<=25?`Adding ${n} × ${p}% = ${n*p}% is an upper bound, close here because n × p is small.`:`Adding ${n} × ${p}% = ${n*p}% overcounts.`)};}},
 three:{lesson:4,make(rnd){const n=pickFrom(rnd,[150,300,600,1000,3000]);const exact=300/n;
  return{prompt:`A part passed ${nf(n)} independent tests with no failure. A quick 95% upper bound on its chance of failing one test, in percent?`,kind:'number',unit:'%',exact,tol:0.15,rel:true,accept:'within 15%',why:`Rule of three: 3 ÷ ${nf(n)} = ${(exact).toPrecision(2)}%.`};}},
 // Part 2. New templates go after the Part 1 ones, so a saved Part 1 round is rebuilt exactly as it was played.
 runs:{lesson:5,make(rnd){const n=pickFrom(rnd,[21,41,61,81,101]);const exact=(n-1)/4;
  return{prompt:`Flip ${n} fair coins in a row. On average, how many times is a head followed right away by a tail?`,kind:'number',unit:'times',exact,tol:0.1,rel:true,accept:'within 10%',why:`There are ${n-1} neighboring pairs, and each is head-then-tail with chance 1/4: ${n-1} ÷ 4 = ${nf(exact)}. Adding indicators needs no independence between the pairs.`};}},
 pairs:{lesson:5,make(rnd){const n=pickFrom(rnd,[20,25,30,40,50,60]);const exact=n*(n-1)/2/365;
  return{prompt:`In a group of ${n} people, each birthday is equally likely to be any of 365 days. On average, how many pairs of people share a birthday?`,kind:'number',unit:'pairs',exact,tol:0.15,rel:true,accept:'within 15%',why:`There are ${n} × ${n-1} ÷ 2 = ${nf(n*(n-1)/2)} pairs, each sharing a birthday with chance 1/365: ${nf(n*(n-1)/2)} ÷ 365 = ${exact.toFixed(2)}.`};}},
 first:{lesson:6,make(rnd){const N=pickFrom(rnd,[20,30,40,52]),K=pickFrom(rnd,[1,2,3,4,5]);const exact=(N+1)/(K+1);
  return{prompt:`A shuffled pile of ${N} cards contains ${K} special ${K===1?'card':'cards'}. On average, what is the position of the first special card? A decimal is fine.`,kind:'number',unit:'position',exact,tol:0.05,rel:true,accept:'within 5%',why:`The ${K} special ${K===1?'card cuts':'cards cut'} the other ${N-K} into ${K+1} gaps of the same average size, ${nf(Number(((N-K)/(K+1)).toFixed(2)))}. The first special card follows the first gap: (${N} + 1) ÷ (${K} + 1) = ${nf(Number(exact.toFixed(2)))}.`};}},
 color:{lesson:6,make(rnd){const r=pickFrom(rnd,[2,3,4,5]),b=pickFrom(rnd,[3,5,7,8]),k=2+Math.floor(rnd()*(r+b-1));const exact=100*r/(r+b);
  return{prompt:`A bag has ${r} red and ${b} blue marbles, drawn at random one at a time without putting any back. What is the chance, in percent, that draw number ${k} is red?`,kind:'number',unit:'%',exact,tol:2,rel:false,accept:'within 2 points',why:`By symmetry every draw is equally likely to be any marble, so draw ${k} is red with chance ${r}/${r+b} = ${exact.toFixed(1)}%, the same as the first.`};}},
 turns:{lesson:7,make(rnd){const d=pickFrom(rnd,[2,3,4,6,10]);const exact=100*d/(2*d-1);
  return{prompt:`Two players take turns. Each try succeeds with chance 1 in ${d}, and the first success wins. What is the chance, in percent, that the player who starts wins?`,kind:'number',unit:'%',exact,tol:2,rel:false,accept:'within 2 points',why:`P = 1/${d} + (${d-1}/${d})² × P, so P = ${d}/${2*d-1} = ${exact.toFixed(1)}%.`};}},
 collect:{lesson:7,make(rnd){const d=pickFrom(rnd,[3,4,5,6,8]);let exact=0;for(let i=1;i<=d;i++)exact+=d/i;
  return{prompt:`On average, how many rolls of a fair ${d}-sided die does it take to see every face at least once?`,kind:'number',unit:'rolls',exact,tol:0.1,rel:true,accept:'within 10%',why:`Wait for each new face in turn: ${Array.from({length:d},(_,i)=>d+'/'+(d-i)).join(' + ')} = ${exact.toFixed(1)} rolls.`};}},
 bayes:{lesson:8,make(rnd){const b=pickFrom(rnd,[5,10,20,50]),sens=pickFrom(rnd,[80,90,95]),f=pickFrom(rnd,[2,5,10]);const tp=b*sens/100,fp=(1000-b)*f/100,exact=100*tp/(tp+fp);
  // 3 points, or a quarter of the answer when that is smaller, so that half the right answer never counts.
  const tol=Math.min(3,Math.floor(exact/4*10)/10);
  return{prompt:`A condition affects ${b} in 1,000 people. A test is positive for ${sens}% of people who have it and for ${f}% of people who do not. Someone tests positive. What is the chance, in percent, that they have the condition?`,kind:'number',unit:'%',exact,tol,rel:false,accept:`within ${tol} ${tol===1?'point':'points'}`,why:`In 100,000 people, ${nf(100*b)} have it and ${nf(100*tp)} of them test positive; ${nf(100*fp)} of the other ${nf(100*(1000-b))} test positive too. ${nf(100*tp)} ÷ ${nf(100*(tp+fp))} = ${exact.toFixed(1)}%.`};}}
};
const IDS=Object.keys(TEMPLATES);
// A round takes ROUND_SIZE different templates in a seeded random order, so the lessons' moves are interleaved.
function makeRound(seed,lessons=LESSONS){
 const rnd=seeded(seed),pool=IDS.filter(id=>lessons.includes(TEMPLATES[id].lesson));
 for(let i=pool.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
 return pool.slice(0,ROUND_SIZE).map(template=>({template,...TEMPLATES[template].make(rnd)}));
}
function parse(text){
 const s=String(text??'').trim().replace(/,/g,'').replace(/%$/,'').replace(/^[−–]/,'-').trim();
 if(!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(s))return null;const v=Number(s);return Number.isFinite(v)?v:null;
}
function check(item,response){
 if(item.kind==='choice')return item.options.some(([v])=>v===response)?response===item.exact:null;
 const v=parse(response);if(v===null)return null;
 return item.rel?Math.abs(v-item.exact)<=item.tol*Math.abs(item.exact)+1e-12:Math.abs(v-item.exact)<=item.tol+1e-12;
}
// Brier score: the mean of (stated probability − outcome)², from 0 (perfect) to 1. Always saying 50% scores 0.25.
function summary(answers){
 const done=answers.filter(a=>typeof a.correct==='boolean'&&Number.isFinite(a.confidence)&&a.confidence>=0&&a.confidence<=100);
 if(!done.length)return null;
 const right=done.filter(a=>a.correct).length,meanConf=done.reduce((s,a)=>s+a.confidence,0)/done.length,brier=done.reduce((s,a)=>s+(a.confidence/100-(a.correct?1:0))**2,0)/done.length;
 const gap=meanConf-100*right/done.length;
 return{count:done.length,right,accuracy:right/done.length,meanConfidence:meanConf,brier,gap,verdict:Math.abs(gap)<=10?'well calibrated':gap>0?'overconfident':'underconfident'};
}
// Calibration is judged on the last CALIBRATION_ANSWERS answers across rounds, never on one round: with five answers,
// even a perfectly calibrated learner who says 80% each time gets 4 of 5 right only 41% of the time.
function calibration(record,n=CALIBRATION_ANSWERS){
 const answers=record.rounds.flatMap(r=>r.answers);
 return answers.length<n?{enough:false,count:answers.length,needed:n}:{enough:true,count:n,...summary(answers.slice(-n))};
}
function fresh(){return{schema:SCHEMA,version:1,timer:false,rounds:[]};}
// Saved rounds are rebuilt from their seeds; a record whose questions do not match its seed is rejected rather than
// trusted. Answers and confidence ratings are kept exactly as given.
function hydrate(value){
 try{
  const v=typeof value==='string'?JSON.parse(value):value;
  if(!v||v.schema!==SCHEMA||v.version!==1||typeof v.timer!=='boolean'||!Array.isArray(v.rounds))return null;
  for(const r of v.rounds){
   if(!r||!Number.isInteger(r.seed)||!Number.isFinite(Date.parse(r.startedAt))||!Array.isArray(r.answers)||r.answers.length>ROUND_SIZE)return null;
   if(!Array.isArray(r.lessons)||!r.lessons.length||r.lessons.some(l=>!LESSONS.includes(l))||new Set(r.lessons).size!==r.lessons.length)return null;const items=makeRound(r.seed,r.lessons);if(items.length!==ROUND_SIZE)return null;
   for(const[i,a]of r.answers.entries()){if(!a||a.template!==items[i].template||typeof a.response!=='string'||!scale(items[i]).includes(a.confidence)||a.correct!==check(items[i],a.response)||(a.seconds!==null&&!(Number.isFinite(a.seconds)&&a.seconds>=0)))return null;}
  }
  return JSON.parse(JSON.stringify(v));
 }catch{return null;}
}
const api={SCHEMA,ROUND_SIZE,CALIBRATION_ANSWERS,LESSONS,SCALES,scale,TEMPLATES,IDS,seeded,easy,makeRound,parse,check,summary,calibration,fresh,hydrate};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceQuantRounds=api;
})(typeof window==='undefined'?globalThis:window);
