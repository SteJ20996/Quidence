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
function limitValue(kind,x){return kind==='hole'?(x===1?4:x+1):(x<0?-1:1);}
function accumulation(x){return integral('rate',0,x);}
function accumulationSecant(a,h){if(!Number.isFinite(h)||h===0)throw Error('A nonzero step is required.');return(accumulation(a+h)-accumulation(a))/h;}
const api={FUNCTIONS,secant,integral,totalArea,riemann,limitValue,accumulation,accumulationSecant};
if(typeof module==='object'&&module.exports)module.exports=api;else root.AD01Math=api;
})(typeof window==='undefined'?globalThis:window);
