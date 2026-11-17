(function(root){
'use strict';
// Quick rounds for Quantitative Reasoning: short mixed questions built from the lessons' moves. Each round is drawn
// from a seed, so a saved round can be rebuilt and checked exactly. A learner answers, says how sure they are, and only
// then sees the check. Scoring rewards accuracy; the confidence is scored separately for calibration (Brier score).
const SCHEMA='quidence_quick_rounds_v1',ROUND_SIZE=5,CALIBRATION_ANSWERS=20;
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
  return{prompt:`A part passed ${nf(n)} independent tests with no failure. A quick 95% upper bound on its chance of failing one test, in percent?`,kind:'number',unit:'%',exact,tol:0.15,rel:true,accept:'within 15%',why:`Rule of three: 3 ÷ ${nf(n)} = ${(exact).toPrecision(2)}%.`};}}
};
const IDS=Object.keys(TEMPLATES);
// A round takes ROUND_SIZE different templates in a seeded random order, so the lessons' moves are interleaved.
function makeRound(seed,lessons=[1,2,3,4]){
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
   if(!Array.isArray(r.lessons)||!r.lessons.length||r.lessons.some(l=>![1,2,3,4].includes(l)))return null;const items=makeRound(r.seed,r.lessons);if(items.length!==ROUND_SIZE)return null;
   for(const[i,a]of r.answers.entries()){if(!a||a.template!==items[i].template||typeof a.response!=='string'||!scale(items[i]).includes(a.confidence)||a.correct!==check(items[i],a.response)||(a.seconds!==null&&!(Number.isFinite(a.seconds)&&a.seconds>=0)))return null;}
  }
  return JSON.parse(JSON.stringify(v));
 }catch{return null;}
}
const api={SCHEMA,ROUND_SIZE,CALIBRATION_ANSWERS,SCALES,scale,TEMPLATES,IDS,seeded,easy,makeRound,parse,check,summary,calibration,fresh,hydrate};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceQuantRounds=api;
})(typeof window==='undefined'?globalThis:window);
