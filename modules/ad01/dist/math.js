(function(root){
'use strict';
const FUNCTIONS={
 square:{label:'f(x) = x²',value:x=>x*x,derivative:x=>2*x,primitive:x=>x*x*x/3},
 cubic:{label:'f(x) = x³',value:x=>x*x*x,derivative:x=>3*x*x,primitive:x=>x**4/4},
 absolute:{label:'f(x) = |x|',value:Math.abs,derivative:x=>x===0?null:Math.sign(x),primitive:x=>x*Math.abs(x)/2},
 linear:{label:'f(x) = x',value:x=>x,derivative:()=>1,primitive:x=>x*x/2},
 rate:{label:'f(x) = x² − 1',value:x=>x*x-1,derivative:x=>2*x,primitive:x=>x*x*x/3-x}
};
function secant(id,a,h){if(!FUNCTIONS[id]||!Number.isFinite(a)||!Number.isFinite(h)||h===0)throw Error('A nonzero step is required.');return(FUNCTIONS[id].value(a+h)-FUNCTIONS[id].value(a))/h;}
function integral(id,a,b){return FUNCTIONS[id].primitive(b)-FUNCTIONS[id].primitive(a);}
function totalArea(id,a,b){if(a>b)return totalArea(id,b,a);const roots=id==='rate'?[-1,1]:[0],cuts=[a,...roots.filter(x=>x>a&&x<b),b];return cuts.slice(1).reduce((s,x,i)=>s+Math.abs(integral(id,cuts[i],x)),0);}
function riemann(id,a,b,n,method='midpoint'){
 if(!FUNCTIONS[id]||!Number.isFinite(a)||!Number.isFinite(b)||a>=b||!Number.isInteger(n)||n<1||!['left','right','midpoint'].includes(method))throw Error('Invalid rectangle settings.');
 const width=(b-a)/n,offset={left:0,right:1,midpoint:.5}[method];
 const rectangles=Array.from({length:n},(_,i)=>{const left=a+i*width,sample=left+offset*width,height=FUNCTIONS[id].value(sample);return{left,width,sample,height,area:height*width};});
 return{width,rectangles,sum:rectangles.reduce((s,r)=>s+r.area,0)};
}
function limitValue(kind,x){if(kind==='wiggle')return x===0?NaN:x*Math.sin(1/x);return kind==='hole'?(x===1?4:x+1):(x<0?-1:1);}
// Lesson 1 examples: the target, the two-sided limit (null when there is none) and the value at the target (null when undefined).
const LIMITS={hole:{target:1,limit:2,value:4},jump:{target:0,limit:null,value:1},wiggle:{target:0,limit:0,value:null}};
// The error-band test: for a band of half-width eps around the limit, a window of half-width delta around the target
// keeps every output inside. |(x + 1) − 2| = |x − 1| and |x·sin(1/x)| ≤ |x|, so delta = eps works for both; the jump has none.
function bandWindow(kind,eps){if(!(eps>0))throw Error('The band must be positive.');return LIMITS[kind].limit===null?null:eps;}
// 0.9, 0.99, 0.999, …: after n nines the gap to 1 is 10^−n.
function nines(n){return 1-10**-n;}
function ninesInside(eps){if(!(eps>0))throw Error('The band must be positive.');let n=1;while(10**-n>=eps*(1-1e-9))n++;return n;}
function accumulation(x){return integral('rate',0,x);}
function accumulationSecant(a,h){if(!Number.isFinite(h)||h===0)throw Error('A nonzero step is required.');return(accumulation(a+h)-accumulation(a))/h;}
// Lesson 5: one antiderivative family and two tails.
// F(x) = x² + C has F′(x) = 2x for every C. The area under the tail from 1 to b is exact: 1 − 1/b for 1/x², ln b for 1/x.
function family(x,c){return x*x+c;}
const TAILS={'inverse-square':{label:'f(x) = 1/x²',value:x=>1/(x*x),area:b=>1-1/b,limit:1},inverse:{label:'f(x) = 1/x',value:x=>1/x,area:b=>Math.log(b),limit:Infinity}};
function tailArea(fn,b){if(!TAILS[fn]||!Number.isFinite(b)||b<1)throw Error('The tail starts at 1.');return TAILS[fn].area(b);}
const api={FUNCTIONS,secant,integral,totalArea,riemann,limitValue,LIMITS,bandWindow,nines,ninesInside,accumulation,accumulationSecant,family,TAILS,tailArea};
if(typeof module==='object'&&module.exports)module.exports=api;else root.AD01Math=api;
})(typeof window==='undefined'?globalThis:window);
