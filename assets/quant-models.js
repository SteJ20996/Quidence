(function(root){
'use strict';
// Interactive models for Quantitative Reasoning. Each returns {graph, readout, formula, note} for one lesson.
const M=typeof module==='object'&&module.exports?require('./course-models.js'):root.QuidenceCourseModels;
const fmt=x=>Number.isInteger(x)?x.toLocaleString('en-US'):Math.abs(x)>=100?Math.round(x).toLocaleString('en-US'):Number(x.toPrecision(3)).toLocaleString('en-US',{maximumFractionDigits:3});
const pct=x=>x>=0.995&&x<1?'over 99':String(Math.round(100*x)),signed=x=>(x>=0?'+':'−')+Math.abs(x).toFixed(1);
const sup=n=>String(n).split('').map(d=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join('');
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

// Lesson 5. Exact distributions of two counts, to set beside the expected value found by adding indicators.
// Matches: P(k of n people draw their own name) = (1/k!) × Σ_{j=0}^{n−k} (−1)^j / j!.
function matches(n){const f=[1];for(let i=1;i<=n;i++)f[i]=f[i-1]*i;const p=[];for(let k=0;k<=n;k++){let t=0;for(let j=0;j<=n-k;j++)t+=(j%2?-1:1)/f[j];p.push(t/f[k]);}return p;}
// Different faces showing on n fair dice, by stepping through the dice one at a time.
function faces(n){let p=[1,0,0,0,0,0,0];for(let i=0;i<n;i++){const q=new Array(7).fill(0);for(let d=0;d<=6;d++){if(!p[d])continue;q[d]+=p[d]*d/6;if(d<6)q[d+1]+=p[d]*(6-d)/6;}p=q;}return p;}
const mean=p=>p.reduce((s,x,k)=>s+k*x,0);
function bars(title,description,p,labels,{marker,markerLabel,level,levelLabel,xlabel}){
 const top=Math.max(...p,level||0),n=p.length,w=420/n,X=k=>60+k*w,Y=x=>240-x/top*170;
 let b=`<path d="M60 240H480" stroke="#8391a5"/>`;
 p.forEach((x,k)=>{b+=`<rect x="${(X(k)+w*0.12).toFixed(1)}" y="${Y(x).toFixed(1)}" width="${(w*0.76).toFixed(1)}" height="${(240-Y(x)).toFixed(1)}" fill="#6542c0" fill-opacity=".75"/>`;if(labels[k]!=='')b+=`<text x="${(X(k)+w/2).toFixed(1)}" y="258" text-anchor="middle" font-size="12" fill="#52647b">${esc(labels[k])}</text>`;});
 if(marker!==undefined){const x=60+(marker+0.5)*w;b+=`<path d="M${x.toFixed(1)} 52V240" stroke="#b4441f" stroke-width="2" stroke-dasharray="6 4"/><text x="${Math.min(470,Math.max(70,x)).toFixed(1)}" y="44" text-anchor="middle" font-size="12" fill="#b4441f">${esc(markerLabel)}</text>`;}
 if(level!==undefined)b+=`<path d="M60 ${Y(level).toFixed(1)}H480" stroke="#b4441f" stroke-width="2" stroke-dasharray="6 4"/><text x="480" y="${(Y(level)-6).toFixed(1)}" text-anchor="end" font-size="12" fill="#b4441f">${esc(levelLabel)}</text>`;
 b+=`<text x="270" y="286" text-anchor="middle" font-size="12" fill="#52647b">${esc(xlabel)}</text>`;
 return M.graphic(title,description,b);
}

// Lesson 6. A shuffled pile of N cards with K special ones. The first special card is at position j with chance
// C(N − j, K − 1) ÷ C(N, K); on average it is at (N + 1) ÷ (K + 1).
function logC(n,k){return k<0||k>n?-Infinity:logFact(n)-logFact(k)-logFact(n-k);}
function firstSpecial(N,K){const p=[];for(let j=1;j<=N-K+1;j++)p.push(Math.exp(logC(N-j,K-1)-logC(N,K)));return{p,expected:(N+1)/(K+1),firstPlayer:p.reduce((s,x,i)=>i%2===0?s+x:s,0),each:K/N,top:p[0],last:1-Math.exp(logC(N-1,K)-logC(N,K))};}

// Lesson 7. Players take turns; each try succeeds with chance p. Conditioning on the first round,
// P(player 1 wins) = p + (1 − p)^k × P(player 1 wins), so player i wins with chance p(1 − p)^(i−1) ÷ (1 − (1 − p)^k).
function turns(p,k){const round=1-(1-p)**k;return Array.from({length:k},(_,i)=>p*(1-p)**i/round);}
const collect=d=>{let s=0;for(let i=1;i<=d;i++)s+=d/i;return s;};

// Lesson 8. Expected counts in 100,000 people.
function bayes(base,sens,fpos){const N=100000,have=Math.round(N*base/100),not=N-have,tp=have*sens/100,fp=not*fpos/100;return{N,have,not,tp,fn:have-tp,fp,tn:not-fp,posterior:tp/(tp+fp),lr:sens/fpos,priorOdds:have/not};}
function tree(v){
 const n=x=>Math.round(x).toLocaleString('en-US'),box=(x,y,w,label,count,fill)=>`<rect x="${x}" y="${y}" width="${w}" height="40" rx="6" fill="${fill}" stroke="#8391a5"/><text x="${x+w/2}" y="${y+17}" text-anchor="middle" font-size="11" fill="#263c5b">${esc(label)}</text><text x="${x+w/2}" y="${y+33}" text-anchor="middle" font-size="13" font-weight="700" fill="#263c5b">${esc(count)}</text>`,line=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#8391a5"/>`;
 let b=box(200,8,120,'Everyone',n(v.N),'#f1f4f8');
 b+=line(260,48,130,80)+line(260,48,390,80)+box(70,80,120,'Have it',n(v.have),'#ece6f8')+box(330,80,120,'Do not',n(v.not),'#f1f4f8');
 b+=line(130,120,70,152)+line(130,120,190,152)+line(390,120,330,152)+line(390,120,450,152);
 b+=box(20,152,100,'Positive',n(v.tp),'#dcd3f3')+box(140,152,100,'Negative',n(v.fn),'#f7f8fa')+box(280,152,100,'Positive',n(v.fp),'#f6dfd6')+box(400,152,100,'Negative',n(v.tn),'#f7f8fa');
 const total=v.tp+v.fp,W=440,a=total?W*v.tp/total:0;
 b+=`<text x="40" y="222" font-size="12" fill="#263c5b">All ${esc(n(total))} positive results</text><rect x="40" y="230" width="${a.toFixed(1)}" height="22" fill="#6542c0" fill-opacity=".8"/><rect x="${(40+a).toFixed(1)}" y="230" width="${(W-a).toFixed(1)}" height="22" fill="#b4441f" fill-opacity=".55"/>`;
 b+=`<text x="40" y="272" font-size="12" fill="#6542c0">Have it: ${esc(n(v.tp))}</text><text x="480" y="272" text-anchor="end" font-size="12" fill="#a03c1b">Do not: ${esc(n(v.fp))}</text>`;
 return M.graphic('A positive test, in counts',`Of ${n(v.N)} people, ${n(v.have)} have the condition and ${n(v.tp)} of them test positive; ${n(v.fp)} of the ${n(v.not)} without it also test positive. Of all ${n(total)} positive results, ${n(v.tp)} come from people who have it.`,b);
}

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
 if(index===4){const n=s.n,hats=s.count==='hats',p=hats?matches(n):faces(n).slice(1),expected=hats?1:6*(1-(5/6)**n);
  const shown=hats?p.slice(0,Math.min(n,8)+1):p,labels=hats?shown.map((_,k)=>k===8&&n>8?'8+':String(k)):shown.map((_,k)=>String(k+1));
  if(hats&&n>8)shown[8]=p.slice(8).reduce((a,b)=>a+b,0);
  const exactMean=hats?mean(p):mean([0,...p]);
  return{graph:bars(hats?`How many of ${n} people draw their own name`:`How many different faces ${n} dice show`,hats?`Exact chances for 0 to ${Math.min(n,8)} people drawing their own name, when ${n} people each draw one of ${n} shuffled name slips. The dashed line marks the expected number, 1.`:`Exact chances for 1 to 6 different faces showing when ${n} fair dice are rolled. The dashed line marks the expected number, ${fmt(expected)}.`,shown,labels,{marker:hats?expected:expected-1,markerLabel:'expected '+fmt(expected),xlabel:hats?'people who draw their own name':'different faces showing'}),
   readout:hats?`${n===1?'1 person always draws their own name, so the expected number is 1':`${n} people: each draws their own name with chance 1/${n}, so the expected number is ${n} × 1/${n} = 1`} · Mean of the exact distribution: ${mean(p).toFixed(3)} · Chance nobody draws their own name: ${(100*p[0]).toFixed(1)}% · Chance exactly one does: ${(100*(p[1]||0)).toFixed(1)}%`
    :`${n} ${n===1?'die':'dice'}: each face shows with chance 1 − (5/6)${n===1?'':sup(n)} = ${(100*(1-(5/6)**n)).toFixed(1)}%, so the expected number of different faces is 6 × that = ${expected.toFixed(2)} · Mean of the exact distribution: ${exactMean.toFixed(2)} · Chance all six faces show: ${(100*p[5]).toFixed(1)}%`,
   formula:'Write the count as a sum of indicators, 1 when an event happens and 0 when it does not. Then E[count] = P(event 1) + P(event 2) + …, whether or not the events are independent.',
   note:hats?'Every arrangement of the slips is equally likely. The chances come from counting arrangements exactly, not from a simulation.':'The dice are fair and independent. The chances come from adding the dice one at a time exactly, not from a simulation.'};}
 if(index===5){const N=s.cards,K=s.special,v=firstSpecial(N,K),labels=v.p.map((_,j)=>(v.p.length<=15||j===0||(j+1)%5===0)?String(j+1):'');
  return{graph:bars(`Where the first of ${K} special cards lies in ${N}`,`Exact chances that the first special card is at each position, 1 to ${N-K+1}, in a shuffled pile of ${N} cards with ${K} special. The dashed line marks the average position, ${fmt(v.expected)}.`,v.p,labels,{marker:v.expected-1,markerLabel:'average '+fmt(v.expected),xlabel:'position of the first special card'}),
   readout:`${N} cards, ${K} special: counted from every arrangement, the top card is special with chance ${(100*v.top).toFixed(1)}% and the last card with ${(100*v.last).toFixed(1)}%, both ${K}/${N} · ${K===1?`The special card is equally likely to be at any position, 1/${N} each, so on average it is at (${N} + 1) ÷ 2 = ${fmt(v.expected)}`:`The first special card is most likely on top (${(100*v.p[0]).toFixed(1)}%), but on average it is at position (${N} + 1) ÷ (${K} + 1) = ${fmt(v.expected)}`} · Two players draw in turns: the first to draw a special card wins with chance ${(100*v.firstPlayer).toFixed(1)}% for the player who starts`,
   formula:`The ${K} special cards cut the other ${N-K} cards into ${K+1} gaps. By symmetry every gap has the same average size, (N − K) ÷ (K + 1), so the first special card is on average at (N − K) ÷ (K + 1) + 1 = (N + 1) ÷ (K + 1).`,
   note:'Every order of the cards is equally likely. The chances are counted exactly.'};}
 if(index===6){const d=Number(s.odds),k=s.players,p=1/d,v=turns(p,k);
  return{graph:bars(`Who wins when ${k} players take turns`,`Exact chances that each of ${k} players is the first to succeed, taking turns, when each try succeeds with chance 1 in ${d}. The dashed line marks a fair share, 1 in ${k}.`,v,v.map((_,i)=>'Player '+(i+1)),{level:1/k,levelLabel:'fair share',xlabel:'players, in the order they try'}),
   readout:`Each try succeeds with chance 1 in ${d}: ${k} players, taking turns · Player 1 wins with chance ${(100*v[0]).toFixed(1)}%, player ${k} with ${(100*v[k-1]).toFixed(1)}% (a fair share is ${(100/k).toFixed(1)}%) · Expected tries until the first success: ${d} · To see ${d===2?'both sides of a coin':`all ${d} faces of a fair ${d}-sided die`} takes ${fmt(collect(d))} tries on average`,
   formula:`Condition on the first round. Either someone succeeds in it, or all ${k} fail, with chance (1 − p)^${k}, and the game starts again. So P(player 1 wins) = p + (1 − p)^${k} × P(player 1 wins), which gives p ÷ (1 − (1 − p)^${k}).`,
   note:'Each try is independent and has the same chance. The chances are exact. The expected wait E for one success solves E = 1 + (1 − p) × E, so E = 1 ÷ p.'};}
 if(index===7){const v=bayes(s.base,s.sensitivity,s.falsepos),n=x=>Math.round(x).toLocaleString('en-US');
  return{graph:tree(v),
   readout:`Of ${n(v.N)} people, ${n(v.have)} have the condition and ${n(v.tp)} of them test positive · Of the ${n(v.not)} without it, ${n(v.fp)} test positive · Of all ${n(v.tp+v.fp)} positive results, ${n(v.tp)} are people who have it: ${(100*v.posterior).toFixed(1)}% · In odds: ${n(v.have)} : ${n(v.not)} before the test, × ${fmt(v.lr)} for a positive result`,
   formula:'P(condition | positive) = true positives ÷ all positives. In odds form: odds after = odds before × (share of people with it who test positive ÷ share of people without it who test positive).',
   note:'Illustrative numbers, not a real test. A second positive test multiplies the odds again only if its errors are independent of the first test’s. In practice a positive screening result is followed by a different test, and only a doctor can interpret a real result.'};}
 return null;
}
const api={model,fermi,doubling,spread,binomial,atLeastOne,matches,faces,firstSpecial,turns,collect,bayes,FERMI,seeded};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceQuantModels=api;
})(typeof window==='undefined'?globalThis:window);
