(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceReasonEvidence=api;})(typeof window==='object'?window:globalThis,()=>{
'use strict';
function normalize(raw){return String(raw??'').toLowerCase().replace(/[−–—]/g,'-').replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/²/g,'^2').replace(/\$(?=\s*\d)/g,'').replace(/\bone more\b/g,'1 more').replace(/\s+/g,' ').trim();}
// A small arithmetic/polynomial parser, not eval or a language-model grader.
function polynomial(source){
 let s=normalize(source).replace(/\s/g,'').replace(/(\d|\))(?=x|\()/g,'$1*').replace(/x(?=\()/g,'x*');
 if(!s||s.length>240||/[^\d.x+*/^()-]/.test(s))return null;
 const tokens=s.match(/(?:\d+(?:\.\d*)?|\.\d+)|x|[+*/^()-]/g)||[];if(tokens.join('')!==s)return null;let i=0;
 const add=(a,b,sign=1)=>{const c=a.slice();b.forEach((v,k)=>c[k]=(c[k]||0)+sign*v);return c;};
 const mul=(a,b)=>{if(a.length+b.length>12)throw Error('degree');const c=Array(a.length+b.length-1).fill(0);a.forEach((v,j)=>b.forEach((w,k)=>c[j+k]+=v*w));return c;};
 function atom(){const t=tokens[i++];if(t==='('){const a=sum();if(tokens[i++]!==')')throw Error('parenthesis');return a;}if(t==='x')return[0,1];if(t===undefined||! /^(?:\d|\.)/.test(t))throw Error('number');return[Number(t)];}
 function power(){let a=atom();if(tokens[i]==='^'){i++;const n=Number(tokens[i++]);if(!Number.isInteger(n)||n<0||n>5)throw Error('power');const base=a;a=[1];for(let k=0;k<n;k++)a=mul(a,base);}return a;}
 function signed(){if(tokens[i]==='+'||tokens[i]==='-'){const op=tokens[i++];return signed().map(v=>op==='-'?-v:v);}return power();}
 function product(){let a=signed();while(tokens[i]==='*'||tokens[i]==='/'){const op=tokens[i++],b=signed();if(op==='*')a=mul(a,b);else{if(b.length!==1||b[0]===0)throw Error('division');a=a.map(v=>v/b[0]);}}return a;}
 function sum(){let a=product();while(tokens[i]==='+'||tokens[i]==='-'){const op=tokens[i++];a=add(a,product(),op==='+'?1:-1);}return a;}
 try{const a=sum();if(i!==tokens.length||a.some(v=>!Number.isFinite(v)))return null;while(a.length>1&&Math.abs(a.at(-1))<1e-9)a.pop();return a;}catch{return null;}
}
const equal=(a,b)=>a&&b&&Array.from({length:Math.max(a.length,b.length)},(_,i)=>(a[i]||0)-(b[i]||0)).every(v=>Math.abs(v)<1e-8);
function equations(raw){
 const t=normalize(raw),out=[];
 for(const match of t.matchAll(/[\d.x+*/^()\- \t]+(?:=[\d.x+*/^()\- \t]+)+/g)){
  const terms=match[0].split('=').map(s=>s.trim().replace(/\.$/,''));
  for(let i=1;i<terms.length;i++){const a=polynomial(terms[i-1]),b=polynomial(terms[i]);
   if(!a||!b)continue;
   // x = 3 describes a solution, not an identity. It is not an arithmetic error.
   if((a.length===1)!==(b.length===1))continue;
   out.push({text:terms[i-1]+' = '+terms[i],correct:equal(a,b),value:a.length===1?a[0]:null});
  }
 }
 return out;
}
function assess(id,raw,answer={},task=null){
 const t=normalize(raw),eq=equations(t),valid=eq.filter(x=>x.correct),errors=eq.filter(x=>!x.correct);
  let points=null,connection=null,matched=false;
  if(id==='FG')for(const[label,value]of [['a',3],['b',2]]){
   const claim=t.match(new RegExp('\\b'+label+'\\b[^!?;]{0,30}\\b(?:slope|rate)\\s+(?:is\\s+|of\\s+|equals\\s+)?([+-]?\\d+(?:\\.\\d+)?)'));
   if(claim&&!/\bnot\b|n't/.test(claim[0])&&Number(claim[1])!==value)errors.push({text:claim[0],correct:false,value});
  }
 const numeric=(pattern)=>pattern.test(t);
 if(id==='C4'){
  const a=/\ba\b.{0,45}(?:\(0\s*,\s*0\)|origin|y\s*=\s*3x)/.test(t),b=/\bb\b.{0,45}(?:\(0\s*,\s*2\)|starts?.{0,15}2|non.?zero|y\s*=\s*3x\s*\+\s*2)/.test(t);
  points=a&&b?2:a||b?1:null;connection=a&&b?1:null;
 }else if(id==='C9'){
  const direction=/(?:move|moving).{0,25}right.{0,35}(?:moves?|goes?|1 units?|one unit).{0,20}down/.test(t);
  const slope=valid.some(e=>e.value===-1)&&/(?:slope|rate|right|down)/.test(t);
  points=direction||slope?2:null;connection=points===2?1:null;
 }else if(id==='C10'){
  const zero=/(?:do not|don't|no|never).{0,12}(?:show up|visit|go).{0,50}still.{0,25}(?:pay|cost|owe).{0,15}12/.test(t);
  const fee=/(?:12.{0,35}(?:register|registration|fixed|sign.?up)|(?:register|registration|fixed|sign.?up).{0,35}12)/.test(t);
  points=zero||fee?2:null;connection=zero?1:null;
 }else if(id==='C6'){
  const numbers=/\b9\b/.test(t)&&/\b6\b/.test(t),test=/\b3\b/.test(t)&&/(?:substitut|when|at|x\s*=|3\s*(?:\^\s*2|\*\s*3))/.test(t);
  const rejection=/(?:not|false|different|unequal|counterexample|9\s*(?:>|!=|≠)\s*6)/.test(t);
  points=numbers&&test&&rejection?2:test||numbers?1:null;connection=points===2?1:null;
 }else if(id==='V1'){
  const expansion=valid.some(e=>/x/.test(e.text)&&equal(polynomial(e.text.split('=')[1]),[120,88,16]));
  const cross=/(?:48\s*\+\s*40|40\s*\+\s*48)\s*=\s*88\b/.test(t);
  points=expansion||cross?2:null;connection=points===2?1:null;
 }else if(id==='D1'){
  const distribution=valid.some(e=>/x/.test(e.text)&&equal(polynomial(e.text.split('=')[1]),polynomial(answer.rewrite||'3x-6')));
  const area=/(?:strip|remov|subtract|cut).{0,55}(?:15|5\s*\*\s*3)|5\s*\*\s*3\s*=\s*15/.test(t);
  points=distribution||area?2:null;connection=points===2?1:null;
 }else if(id==='S1'){
  const fixed=/(?:registration|register|setup|fixed|start|beginning|once)/.test(t),per=/(?:per[- ]player|each player|every player)/.test(t);
  points=fixed&&per?2:fixed||per?1:null;
 }else if(id==='S3'){
  const same=/(?:same|equal).{0,20}(?:price|cost|total)|(?:price|cost|total).{0,20}(?:same|equal)/.test(t);
  points=same&&/(?:9|players?|plans?)/.test(t)?2:null;connection=points===2&&/\b9\b/.test(t)?1:null;
 }else if(id==='S6'){
  const reversal=/(?:greater than|more than|above|over)\s*9.{0,70}(?:plan\s*)?b\s+(?:is\s+)?(?:more expensive|costs? more)/.test(t);
  const counter=/(?:not always|counterexample|disprov|single example|1 example)/.test(t)&&/(?:a.{0,15}cheaper|b.{0,15}more expensive)/.test(t);
  points=reversal||counter?2:null;connection=points===2?1:null;
 }else if(id==='FB'||id==='S4'){
  const boundary=/(?:next|1 more|one more|19).{0,50}(?:exceed|over|cannot|can not|can't|not cover|too much)|(?:cannot|can not|can't|not cover).{0,35}(?:19|next|1 more)/.test(t);
  if(boundary)points=2;
  else if(id==='S4'&&/22.{0,45}(?:plan\s*)?a|a.{0,45}22/.test(t)&&/16.{0,45}(?:plan\s*)?b|b.{0,45}16/.test(t))points=1;
  connection=boundary?1:null;
 }
 if(task){
  const core=task.core;
  if(core==='distribution'){
   const target=task.answer.choice||(`${task.answer.coefficient}x+${task.answer.constant}`);
   if(valid.some(e=>/x/.test(e.text)&&equal(polynomial(e.text.split('=')[1]),polynomial(target)))){points=2;connection=1;}
  }else if(core.startsWith('rate')){
   if(valid.some(e=>e.value===(task.answer.rate??(core==='rate-confirm'?task.answer.total:null)))&&/(?:mile|lap|min|rate|divide|\/)/.test(t)){points=2;connection=1;}
  }else if(core==='fixed-rate'){
   const base=task.answer.start??task.costModel?.plans[0]?.[1],total=task.answer.total;
   const noVisit=/(?:no show|do not show|don't show|0 visits?).{0,60}(?:still|fee|pay)/.test(t);
   const fixed=noVisit&&new RegExp('\\b'+base+'\\b').test(t);
   const calculation=valid.some(e=>e.value===total)||(valid.some(e=>e.value===total-base)&&/(?:plus|add)/.test(t)&&new RegExp('\\b'+total+'\\b').test(t));
   if(fixed&&calculation){points=2;connection=1;}
  }else if(core==='slope'){
   const slope=task.answer.m??task.answer.rate;
   if(valid.some(e=>e.value===slope)&&/(?:slope|rate|rise|up|right|\/)/.test(t)){points=2;connection=1;}
  }
 }
 matched=points!==null;
 return{points,connection,matched,errors,equations:eq};
}
return{normalize,polynomial,equal,equations,assess};
});
