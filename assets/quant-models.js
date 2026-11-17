(function(root){
'use strict';
// Interactive models for Quantitative Reasoning. Each returns {graph, readout, formula, note} for one lesson.
const M=typeof module==='object'&&module.exports?require('./course-models.js'):root.QuidenceCourseModels;
const fmt=x=>Number.isInteger(x)?x.toLocaleString('en-US'):Math.abs(x)>=100?Math.round(x).toLocaleString('en-US'):Number(x.toPrecision(3)).toLocaleString('en-US',{maximumFractionDigits:3});
const pct=x=>x>=0.995&&x<1?'over 99':String(Math.round(100*x)),signed=x=>(x>=0?'+':'−')+Math.abs(x).toFixed(1);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// A small seeded generator (mulberry32), so a setting always shows the same simulated estimates.
function seeded(seed){let t=seed>>>0;return()=>{t=(t+0x6D2B79F5)>>>0;let r=Math.imul(t^(t>>>15),1|t);r^=r+Math.imul(r^(r>>>7),61|r);return((r^(r>>>14))>>>0)/4294967296;};}

// Lesson 1. Each factor's error is a random multiplier between 1/spread and spread, uniform in its logarithm, so the
// logarithm of the total error is a sum of independent uniform errors.
const FERMI={trials:4000,seed:20261117};
function fermi(factors,spread){
 const rnd=seeded(FERMI.seed),L=Math.log10(spread),logs=[];
 for(let i=0;i<FERMI.trials;i++){let s=0;for(let k=0;k<factors;k++)s+=(2*rnd()-1)*L;logs.push(s);}
 const abs=logs.map(Math.abs).sort((a,b)=>a-b),median=abs[Math.floor(abs.length/2)];
 const within=f=>abs.filter(x=>x<=Math.log10(f)+1e-12).length/abs.length;
 return{logs,worst:spread**factors,median:10**median,within2:within(2),within10:within(10),sd:L*Math.sqrt(factors/3)};
}
function histogram(v,factors,spread){
 const W=Math.max(factors*Math.log10(spread),Math.log10(2)),bins=30,counts=new Array(bins).fill(0);
 for(const x of v.logs)counts[Math.min(bins-1,Math.floor((x+W)/(2*W)*bins))]++;
 const top=Math.max(...counts),X=x=>60+(x+W)/(2*W)*420,Y=c=>240-c/top*180;
 let b=`<path d="M60 240H480" stroke="#8391a5"/>`;
 counts.forEach((c,i)=>{const x0=X(-W+2*W*i/bins),x1=X(-W+2*W*(i+1)/bins);b+=`<rect x="${(x0+.5).toFixed(1)}" y="${Y(c).toFixed(1)}" width="${(x1-x0-1).toFixed(1)}" height="${(240-Y(c)).toFixed(1)}" fill="#6542c0" fill-opacity=".75"/>`;});
 for(const [f,label] of [[2,'×2'],[1/2,'÷2'],[10,'×10'],[1/10,'÷10']]){const x=Math.log10(f);if(Math.abs(x)<=W)b+=`<path d="M${X(x).toFixed(1)} 48V240" stroke="#087f76" stroke-dasharray="5 4"/><text x="${X(x).toFixed(1)}" y="42" text-anchor="middle" font-size="12" fill="#087f76">${label}</text>`;}
 b+=`<path d="M${X(0)} 52V240" stroke="#263c5b" stroke-width="1.5"/><text x="${X(0)}" y="262" text-anchor="middle" font-size="12" fill="#263c5b">exact</text>`;
 b+=`<text x="60" y="262" font-size="12" fill="#52647b">÷${esc(fmt(10**W))}</text><text x="480" y="262" text-anchor="end" font-size="12" fill="#52647b">×${esc(fmt(10**W))}</text><text x="270" y="288" text-anchor="middle" font-size="12" fill="#52647b">how many times too small or too big (worst cases at the ends)</text>`;
 return M.graphic('How far off 4,000 simulated estimates were',`A histogram of 4,000 simulated estimates, each the product of ${factors} factors that are each off by up to ${spread} times. Most estimates are near the exact value; the worst cases, off by ${fmt(10**W)} times, are at the ends.`,b);
}

// Lesson 2. Doubling time at a yearly growth rate r%: exact ln 2 ÷ ln(1 + r/100), against 72 ÷ r and 69.3 ÷ r.
function doubling(rate){const exact=Math.log(2)/Math.log(1+rate/100);return{exact,rule72:72/rate,rule69:100*Math.log(2)/rate};}

// Lesson 3. Exact binomial probabilities for n fair tosses, from logarithms of factorials.
const LOGFACT=[0];function logFact(n){for(let i=LOGFACT.length;i<=n;i++)LOGFACT[i]=LOGFACT[i-1]+Math.log(i);return LOGFACT[n];}
function binomial(n,k){return Math.exp(logFact(n)-logFact(k)-logFact(n-k)-n*Math.LN2);}
function spread(n){
 const sdCount=Math.sqrt(n)/2,sdShare=1/(2*Math.sqrt(n)),lo=Math.ceil(n/2-2*sdCount),hi=Math.floor(n/2+2*sdCount);
 let inside=0;for(let k=lo;k<=hi;k++)inside+=binomial(n,k);
 let tail60=0;for(let k=Math.ceil(0.6*n);k<=n;k++)tail60+=binomial(n,k);
 return{sdCount,sdShare,lo,hi,inside,tail60,z60:(0.6-0.5)/sdShare};
}

// Lesson 4. The chance of at least one success in n independent tries at chance p: exact, the union bound n × p,
// and the approximation 1 − e^(−np).
function atLeastOne(p,n){return{exact:1-(1-p)**n,union:n*p,approx:1-Math.exp(-n*p),none:(1-p)**n};}

function model(index,s){
 if(index===0){const v=fermi(s.factors,s.spread);
  return{graph:histogram(v,s.factors,s.spread),
   readout:`${s.factors} factor${s.factors>1?'s':''}, each off by up to ${fmt(s.spread)} times: worst case off by ${fmt(v.worst)} times · Half of the estimates were within ${fmt(v.median)} times of the exact value · ${pct(v.within2)}% within 2 times, ${pct(v.within10)}% within 10 times`,
   formula:'Total error = product of the factors’ errors, so log(total error) = sum of the factors’ log errors. A sum of n independent errors spreads like √n: here its standard deviation is log(spread) × √(n ÷ 3).',
   note:'4,000 simulated estimates, the same each time for the same settings. Each factor’s error is equally likely to be anywhere between 1/spread and spread times on a logarithmic scale, independently of the others. Errors cancel only if each factor is as likely to be too big as too small. Real errors are not capped, and they can share a cause, such as one wrong assumption used twice; then they do not cancel.'};}
 if(index===1){const v=doubling(s.rate);
  return{graph:M.cartesian('Doubling time against the growth rate',[{label:'Exact: ln 2 ÷ ln(1 + rate)',prefix:'Thick line: ',fn:r=>doubling(r).exact},{label:'Rule of 72: 72 ÷ rate',fn:r=>72/r},{label:'69.3 ÷ rate',prefix:'Thin orange line: ',color:'#b4441f',width:1.6,dash:'',fn:r=>69.3/r}],{xmin:1,xmax:25,ymin:0,ymax:75,xlabel:'Growth per year (%)',ylabel:'Years to double',point:[s.rate,v.exact],left:80,ylabelX:22,xticks:[1,5,10,15,20,25],yticks:[0,15,30,45,60,75]}),
   readout:`${s.rate}% a year: exact doubling time ${v.exact.toFixed(2)} years · Rule of 72: ${v.rule72.toFixed(2)} years (${signed(100*(v.rule72/v.exact-1))}%) · 69.3 ÷ rate: ${v.rule69.toFixed(2)} years (${signed(100*(v.rule69/v.exact-1))}%)`,
   formula:'After n years an amount is multiplied by (1 + r)ⁿ. It doubles when n = ln 2 ÷ ln(1 + r). For small r, ln(1 + r) ≈ r, so n ≈ 0.693 ÷ r: 69.3 ÷ (rate in %).',
   note:'Growth once a year at a fixed rate. With continuous growth the exact time is 100 ln 2 ÷ rate ≈ 69.3 ÷ rate; yearly compounding takes a little longer, which is why 72 does better at ordinary rates.'};}
 if(index===2){const n=Number(s.tosses),v=spread(n),sd=v.sdShare,pdf=x=>Math.exp(-((x-0.5)**2)/(2*sd*sd))/(sd*Math.sqrt(2*Math.PI)),top=Math.ceil(pdf(0.5)/5)*5;
  return{graph:M.cartesian(`The share of heads in ${n.toLocaleString('en-US')} tosses`,[{label:'Bell curve with the same average and spread',fn:pdf},{label:'Two standard deviations either side',fn:x=>Math.abs(x-0.5)<=2*sd?top*0.02:null}],{xmin:0,xmax:1,ymin:0,ymax:top,xlabel:'Share of heads',ylabel:'Density',left:80,ylabelX:22,xticks:[0,.2,.4,.5,.6,.8,1],yticks:[0,top/2,top]}),
   readout:`${n.toLocaleString('en-US')} tosses: heads average ${(n/2).toLocaleString('en-US')}, standard deviation ${fmt(v.sdCount)} heads · Share of heads: 50% ± ${fmt(100*v.sdShare)} points (1 SD) · About 95% of results lie from ${v.lo.toLocaleString('en-US')} to ${v.hi.toLocaleString('en-US')} heads; exactly ${(100*v.inside).toFixed(1)}% · 60% heads is ${v.z60.toFixed(1)} SD above the average; chance of 60% or more: ${v.tail60<1e-6?'less than 1 in a million':(100*v.tail60).toFixed(v.tail60<0.01?3:1)+'%'}`,
   formula:'Heads: average n ÷ 2, standard deviation √n ÷ 2. Share of heads: standard deviation 1 ÷ (2√n). About 68% of results lie within 1 SD, 95% within 2 SD and 99.7% within 3 SD.',
   note:'The exact shares come from the binomial distribution; the curve is the bell-shaped approximation. For 10 tosses the bell curve is rough, because only 11 counts are possible.'};}
 if(index===3){const p=s.chance/100,n=s.tries,v=atLeastOne(p,n);
  return{graph:M.cartesian('The chance of at least one success',[{label:'Exact: 1 − (1 − p)ⁿ',prefix:'Thick line: ',fn:k=>atLeastOne(p,k).exact},{label:'Union bound: n × p',fn:k=>k*p},{label:'1 − e^(−np)',prefix:'Thin orange line: ',color:'#b4441f',width:1.6,dash:'',fn:k=>atLeastOne(p,k).approx}],{xmin:0,xmax:50,ymin:0,ymax:1.2,xlabel:'Number of tries',ylabel:'Chance',point:[n,v.exact],left:80,ylabelX:22,xticks:[0,10,20,30,40,50],yticks:[0,.2,.4,.6,.8,1,1.2]}),
   readout:`${n} ${n===1?'try':'tries'} at ${s.chance}% each: chance of at least one success ${(100*v.exact).toFixed(1)}% · Union bound n × p = ${(100*v.union).toFixed(0)}%${v.union>1?', impossible as a chance':''} · 1 − e^(−np) = ${(100*v.approx).toFixed(1)}% · Chance of none: ${(100*v.none).toFixed(1)}%`,
   formula:'P(at least one) = 1 − P(none) = 1 − (1 − p)ⁿ. Because 1 − p ≤ e^(−p), it lies between two quick bounds: 1 − e^(−np) ≤ P ≤ n × p, and both are close when n × p is small. Rule of three: if nothing happened in n tries, the chance per try is below about 3 ÷ n with 95% confidence.',
   note:'The tries are independent and each has the same chance. The union bound needs neither assumption, which is why it is useful as a quick check.'};}
 return null;
}
const api={model,fermi,doubling,spread,binomial,atLeastOne,FERMI,seeded};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceQuantModels=api;
})(typeof window==='undefined'?globalThis:window);
