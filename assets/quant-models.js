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

// Lesson 9. Each round you win 1 point with chance p or lose 1. Starting with b points, play until 0 or T.
// Betting 1 point a time: P(reach T) = (1 − r^b) ÷ (1 − r^T) with r = q ÷ p, or b ÷ T in a fair game.
function ruin(p,b,T){const q=1-p;if(Math.abs(p-q)<1e-12)return{reach:b/T,rounds:b*(T-b)};const r=q/p,reach=(1-r**b)/(1-r**T);return{reach,rounds:b/(q-p)-T/(q-p)*reach};}
// Bold play: stake what is needed to reach T, or everything you have, whichever is smaller. Solved by repeated sweeps.
function bold(p,T){const f=new Array(T+1).fill(0);f[T]=1;for(let it=0;it<20000;it++){let change=0;for(let x=1;x<T;x++){const s=Math.min(x,T-x),v=p*f[x+s]+(1-p)*f[x-s];change=Math.max(change,Math.abs(v-f[x]));f[x]=v;}if(change<1e-15)break;}return f;}
function lines(title,description,series,{xmin,xmax,ymin,ymax,xticks,yticks,xlabel,ylabel,marker,yfmt=y=>fmt(y)}){
 const left=70,X=x=>left+(x-xmin)/(xmax-xmin)*(470-left),Y=y=>240-(y-ymin)/(ymax-ymin)*195;
 let b='';for(const x of xticks)b+=`<path d="M${X(x).toFixed(1)} 45V240" stroke="#e4e8ef"/><text x="${X(x).toFixed(1)}" y="258" text-anchor="middle" font-size="12" fill="#52647b">${esc(fmt(x))}</text>`;
 for(const y of yticks)b+=`<path d="M${left} ${Y(y).toFixed(1)}H470" stroke="#e4e8ef"/><text x="${left-8}" y="${(Y(y)+4).toFixed(1)}" text-anchor="end" font-size="12" fill="#52647b">${esc(yfmt(y))}</text>`;
 b+=`<path d="M${left} 45V240H470" fill="none" stroke="#8391a5"/>`;
 for(const s of series){const pts=s.data.filter(([,y])=>Number.isFinite(y));b+=`<path d="${pts.map(([x,y],i)=>(i?'L':'M')+X(x).toFixed(1)+' '+Y(y).toFixed(1)).join(' ')}" fill="none" stroke="${s.color}" stroke-width="${s.width||2.5}"${s.dash?` stroke-dasharray="${s.dash}"`:''}/>`;if(s.dots)for(const[x,y]of pts)b+=`<circle cx="${X(x).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="2.6" fill="${s.color}"/>`;}
 if(marker)b+=`<circle cx="${X(marker[0]).toFixed(1)}" cy="${Y(marker[1]).toFixed(1)}" r="5.5" fill="#a84324"/>`;
 b+=`<text x="270" y="286" text-anchor="middle" font-size="12" fill="#52647b">${esc(xlabel)}</text><text x="20" y="145" transform="rotate(-90 20 145)" text-anchor="middle" font-size="12" fill="#52647b">${esc(ylabel)}</text>`;
 return '<div class="course-model-legend">'+series.map(s=>'<span>'+esc(s.prefix)+esc(s.label)+'</span>').join('')+'</div>'+M.graphic(title,description,b);
}

// Lesson 10. Each round you stake a share f of your points; you win b times the stake with chance p, or lose the stake.
// Long-run growth per round: g(f) = p ln(1 + b f) + q ln(1 − f), largest at the Kelly share f* = p − q ÷ b.
function kelly(p,b,f,n=100){
 const q=1-p,star=Math.max(0,p-q/b),g=f>=1?-Infinity:p*Math.log(1+b*f)+q*Math.log(1-f);
 // After n rounds with W wins, the points are multiplied by (1 + b f)^W (1 − f)^(n − W), and W is binomial.
 const logm=w=>f>=1?(w===n?n*Math.log(1+b):-Infinity):w*Math.log(1+b*f)+(n-w)*Math.log(1-f);
 const pmf=Array.from({length:n+1},(_,w)=>Math.exp(logFact(n)-logFact(w)-logFact(n-w)+w*Math.log(p)+(n-w)*Math.log(q)));
 let c=0,medianW=n;for(let w=0;w<=n;w++){c+=pmf[w];if(c>=0.5){medianW=w;break;}}
 const below=Math.min(1,pmf.reduce((s,x,w)=>logm(w)<-1e-12?s+x:s,0)),half=Math.min(1,pmf.reduce((s,x,w)=>logm(w)<Math.log(0.5)?s+x:s,0));
 return{star,g,median:Math.exp(logm(medianW)),mean:(1+f*(p*b-q))**n,below,half,n};
}
const times=x=>!(x>0)?'0':x<0.001?'less than 0.001':x<100?Number(x.toPrecision(3)).toLocaleString('en-US'):x<1e6?Math.round(x).toLocaleString('en-US'):(()=>{const e=Math.floor(Math.log10(x));return (x/10**e).toFixed(1)+' × 10'+sup(e);})();

// Lesson 11. Waiting for a pattern of fair coin flips. The expected wait is the sum of 2^k over every k for which the
// first k letters equal the last k (each overlap makes a failed attempt cost less progress).
function patternWait(a){let e=0;for(let k=1;k<=a.length;k++)if(a.slice(0,k)===a.slice(-k))e+=2**k;return e;}
// Exact chance that the pattern first appears on flip n, by tracking how much of it is already matched.
function firstTime(a,N){
 const step=(s,c)=>{let t=a.slice(0,s)+c;while(t&&!a.startsWith(t))t=t.slice(1);return t.length;};
 let dist=new Array(a.length).fill(0);dist[0]=1;const out=[];
 for(let n=1;n<=N;n++){const next=new Array(a.length).fill(0);let hit=0;for(let s=0;s<a.length;s++){if(!dist[s])continue;for(const c of'HT'){const t=step(s,c);if(t===a.length)hit+=dist[s]/2;else next[t]+=dist[s]/2;}}out.push(hit);dist=next;}
 return out;
}
// A race between two different patterns of the same length: the chance that a appears first.
function race(a,b){
 const keep=t=>{while(t&&!a.startsWith(t)&&!b.startsWith(t))t=t.slice(1);return t;};
 let dist=new Map([['',1]]),won=0,left=1;
 for(let n=0;n<5000&&left>1e-15;n++){const next=new Map();for(const[t,pr]of dist)for(const c of'HT'){const u=t+c;if(u.endsWith(a)){won+=pr/2;continue;}if(u.endsWith(b))continue;const k=keep(u);next.set(k,(next.get(k)||0)+pr/2);}dist=next;left=[...dist.values()].reduce((x,y)=>x+y,0);}
 return won;
}
const PATTERNS=['HH','HT','TH','TT','HHH','HHT','HTH','HTT','THH','THT','TTH','TTT'];

// Lesson 12. A sealed box holds a value V, equally likely anywhere from 0 to 100 points. You offer to buy at 50 − s and
// to sell at 50 + s. A share α of traders know V and trade only when it pays them; the others buy or sell at random.
function quote(alpha,s){
 const fromRandom=(1-alpha)*s,fromInformed=-alpha*(50-s)**2/100;
 const buyRandom=(1-alpha)/2,buyInformed=alpha*(50-s)/100,evBuy=buyRandom+buyInformed>0?(buyRandom*50+buyInformed*(150+s)/2)/(buyRandom+buyInformed):50;
 // Break-even: (1 − α)s = α(50 − s)² ÷ 100, which gives s = 50(1 − √(1 − α²)) ÷ α.
 const breakeven=alpha>0?50*(1-Math.sqrt(1-alpha*alpha))/alpha:0;
 return{fromRandom,fromInformed,profit:fromRandom+fromInformed,evBuy,breakeven};
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
 if(index===8){const p=s.chance/100,b=s.start,T=20,timid=ruin(p,b,T),bf=bold(p,T),xs=Array.from({length:T+1},(_,x)=>x);
  return{graph:lines(`Reaching ${T} points before 0, at ${s.chance}% a round`,`The chance of reaching ${T} points before running out, from each starting amount, when each round is won with chance ${s.chance}%. One line bets 1 point a round; the other bets boldly. The dot marks a start of ${b} points betting 1 point a round.`,[{label:'Bet 1 point a round',prefix:'Purple: ',color:'#6542c0',data:xs.map(x=>[x,ruin(p,x,T).reach]),dots:true},{label:'Bet boldly: everything, or just what you need',prefix:'Orange: ',color:'#b4441f',data:xs.map(x=>[x,bf[x]]),dash:'6 4',dots:true}],{xmin:0,xmax:T,ymin:0,ymax:1,xticks:[0,5,10,15,20],yticks:[0,.25,.5,.75,1],xlabel:'Points at the start',ylabel:'Chance of reaching 20',marker:[b,timid.reach],yfmt:y=>Math.round(100*y)+'%'}),
   readout:`${s.chance}% a round: each round is worth 2p − 1 = ${Math.abs(2*p-1)<1e-9?'0':((2*p-1)>0?'+':'−')+Math.abs(2*p-1).toFixed(2)} points on average · From ${b} points, betting 1 point a round: ${(100*timid.reach).toFixed(1)}% chance to reach ${T}, after about ${Math.round(timid.rounds)} rounds on average · Betting boldly: ${(100*bf[b]).toFixed(1)}%`,
   formula:`Betting 1 point a round, P(reach ${T}) = (1 − r^b) ÷ (1 − r^${T}) with r = (1 − p) ÷ p; in a fair game it is b ÷ ${T}. The expected change per round is p − (1 − p) = 2p − 1 points.`,
   note:'Points in a game, not money. Rounds are independent and won with the same chance. Bold play stakes what is needed to reach 20, or everything you have if that is less. The chances are exact, not simulated.'};}
 if(index===9){const p=s.chance/100,b=Number(s.payoff),f=s.share/100,v=kelly(p,b,f),k=kelly(p,b,v.star),gmax=Math.max(k.g,1e-4),top=Number((gmax*1.6).toPrecision(2)),bottom=-top;
  return{graph:M.cartesian(`Long-run growth for each share staked`,[{label:'Growth per round, ln of the typical multiplier',prefix:'Line: ',fn:x=>x>=100?null:kelly(p,b,x/100).g}],{xmin:0,xmax:100,ymin:bottom,ymax:top,xlabel:'Share of your points staked each round (%)',ylabel:'Growth per round',point:Number.isFinite(v.g)?[s.share,v.g]:undefined,left:80,ylabelX:22,xticks:[0,20,40,60,80,100],yticks:[bottom,bottom/2,0,top/2,top]}),
   readout:`Win ${b===1?'your stake':'twice your stake'} with chance ${s.chance}%: the Kelly share is ${p.toFixed(2)} − ${(1-p).toFixed(2)} ÷ ${b} = ${(100*v.star).toFixed(1)}% · Staking ${s.share}%: growth ${Number.isFinite(v.g)?v.g.toFixed(4).replace('-','−'):'−∞'} a round · After ${v.n} rounds the typical result multiplies your points by ${times(v.median)}; the average result by ${times(v.mean)} · Chance of ending below where you started: ${(100*v.below).toFixed(1)}%; of losing more than half: ${(100*v.half).toFixed(1)}%`,
   formula:'Growth per round g(f) = p ln(1 + b f) + (1 − p) ln(1 − f). It is largest at the Kelly share f = p − (1 − p) ÷ b and, when the edge is small, falls back to about 0 near twice that share.',
   note:'Points in a game, not money. Rounds are independent, and the chance and payoff are known exactly; in real life they are not, which is one reason to stake less. When the edge is negative, as in casino games and lotteries, the Kelly share is 0: stake nothing.'};}
 if(index===10){const a=s.mine,b=s.theirs,N=30,da=firstTime(a,N),db=firstTime(b,N),ns=Array.from({length:N},(_,i)=>i+1),top=Math.ceil(Math.max(...da,...db)*20)/20;
  const parts=x=>{const k=[];for(let j=1;j<=x.length;j++)if(x.slice(0,j)===x.slice(-j))k.push(2**j);return k.length>1?k.join(' + ')+' = '+patternWait(x):String(patternWait(x));};
  const raceText=a===b?'Choose two different patterns to race them':a.length!==b.length?'A race compares two patterns of the same length':`In a race, ${a} appears first ${(100*race(a,b)).toFixed(1)}% of the time`;
  return{graph:lines(`When ${a} and ${b} first appear`,`Exact chances that ${a} and ${b} first appear on each flip from 1 to ${N}, flipping a fair coin. ${a} takes ${patternWait(a)} flips on average and ${b} takes ${patternWait(b)}.`,[{label:a,prefix:'Purple: ',color:'#6542c0',data:ns.map((n,i)=>[n,da[i]])},{label:b,prefix:'Orange: ',color:'#b4441f',data:ns.map((n,i)=>[n,db[i]]),dash:'6 4'}],{xmin:0,xmax:N,ymin:0,ymax:top,xticks:[0,5,10,15,20,25,30],yticks:[0,top/2,top],xlabel:'Flip on which the pattern first appears',ylabel:'Chance',yfmt:y=>Math.round(100*y)+'%'}),
   readout:`Average wait for ${a}: ${parts(a)} flips · for ${b}: ${parts(b)} flips · ${raceText}`,
   formula:'Average wait = the sum of 2^k over every k for which the first k letters of the pattern equal its last k letters. HH: 2 + 4 = 6; HT: 4.',
   note:'A fair coin, flipped until the pattern appears. The chances are computed exactly by tracking how much of each pattern is already matched.'};}
 if(index===11){const al=s.informed/100,v=quote(al,s.spread),top=Math.max(5,Math.ceil(50*(1-al)/5)*5),bottom=-Math.max(5,Math.ceil(25*al/5)*5);
  return{graph:M.cartesian('Points per trader for each spread',[{label:'Expected points per trader',prefix:'Line: ',fn:x=>quote(al,x).profit}],{xmin:0,xmax:50,ymin:bottom,ymax:top,xlabel:'Half-spread: how far each price is from 50',ylabel:'Points per trader',point:[s.spread,v.profit],left:80,ylabelX:22,xticks:[0,10,20,30,40,50],yticks:[bottom,0,top/2,top]}),
   readout:`You buy at ${50-s.spread} and sell at ${50+s.spread} · Traders who guess bring +${s.spread} each (${100-s.informed}% of traders); informed traders cost ${((50-s.spread)**2/100).toFixed(2)} each on average (${s.informed}%) · Expected: ${Math.abs(v.profit)<0.005?'0':(v.profit>0?'+':'−')+Math.abs(v.profit).toFixed(2)} points per trader · Break-even half-spread: ${v.breakeven.toFixed(2)} · After someone buys at ${50+s.spread}, the box is worth ${v.evBuy.toFixed(2)} on average`,
   formula:'Expected points per trader = (1 − α) × s − α × (50 − s)² ÷ 100. It is zero at s = 50(1 − √(1 − α²)) ÷ α.',
   note:'Points in a game, not money. The box’s value is equally likely anywhere from 0 to 100. Informed traders buy only when the value is above your selling price, and sell only when it is below your buying price; the others buy or sell with equal chance.'};}
 return null;
}
const api={model,fermi,doubling,spread,binomial,atLeastOne,matches,faces,firstSpecial,turns,collect,bayes,ruin,bold,kelly,patternWait,firstTime,race,quote,PATTERNS,FERMI,seeded};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceQuantModels=api;
})(typeof window==='undefined'?globalThis:window);
