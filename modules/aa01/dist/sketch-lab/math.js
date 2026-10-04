(function(root){
  'use strict';
  const functions={positive:{id:'positive',a:1,b:-4,c:9,formula:'(x − 2)² + 5',expanded:'x² − 4x + 9',opening:'up',kind:'minimum',h:2,k:5},negative:{id:'negative',a:-1,b:4,c:1,formula:'−(x − 2)² + 5',expanded:'−x² + 4x + 1',opening:'down',kind:'maximum',h:2,k:5}};
  function number(raw){
    const t=String(raw??'').trim().replace(/−/g,'-');
    if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:\/[+-]?(?:\d+(?:\.\d*)?|\.\d+))?$/.test(t))return NaN;
    const parts=t.split('/').map(Number),n=parts.length===1?parts[0]:parts[0]/parts[1];return Number.isFinite(n)?n:NaN;
  }
  const close=(a,b)=>Number.isFinite(a)&&Math.abs(a-b)<=1e-8*Math.max(1,Math.abs(b));
  const value=(id,x)=>functions[id].a*(x-2)**2+5;
  function reason(id,answer){
    const raw=String(answer.why??'').trim(),t=raw.toLowerCase().replace(/−/g,'-');
    const explicit=answer.reason==='bound-and-zero';
    // Unknown or conflicting language stays reviewable, never an automatic zero.
    const conflict=answer.reason==='three-samples'||answer.reason==='x-square-sign'||/square(?:d)?[^.!?]{0,25}(?:can be negative|is negative)|(?:no|not)\s+(?:minimum|maximum)|(?:minimum|maximum)[^.!?]{0,15}(?:is|=)\s*(?:0|2)\b/.test(t);
    const bound=/(?:square|squared)[^.!?]{0,45}(?:cannot be negative|non.?negative|at least (?:zero|0)|>=\s*0)/.test(t);
    const zero=/\b(?:x\s*=\s*2|x is (?:2|two)|at (?:2|two))\b/.test(t)&&/\b(?:zero|0)\b/.test(t);
    const negative=id==='negative'&&/(?:negative|minus|negat|non.?positive|cannot be positive|at most (?:zero|0))/.test(t);
    const matched=explicit||bound&&zero&&(id==='positive'||negative);
    return {status:conflict?'Needs review':matched?'Provisional central reason matched':raw||answer.reason?'Needs review':'Missing explanation',points:matched&&!conflict?2:null,max:2,raw,anchor:id==='positive'?'The square is nonnegative and reaches zero at x=2, so the minimum is 5.':'The negative of the square is nonpositive and reaches zero at x=2, so the maximum is 5.'};
  }
  function validate(id,answer){
    const needed=['a','b','c','vx','vy','x1','y1','x2','y2','x3','y3'];
    if(needed.some(k=>!Number.isFinite(answer[k])))return 'Enter each number. Signed decimals and fractions are welcome.';
    if(!['up','down'].includes(answer.opening)||!['minimum','maximum'].includes(answer.kind))return 'Choose an opening direction and an extremum type.';
    if(new Set([answer.x1,answer.x2,answer.x3]).size!==3)return 'Choose three different x-values. Different y-values are not required.';
    if([answer.x1,answer.x2,answer.x3].some(x=>Math.abs(x)>50))return 'For this graph preview, choose x between −50 and 50. The function itself is defined for all real x.';
    return '';
  }
  function grade(id,answer){
    const f=functions[id];
    const parts={expansion:['a','b','c'].every(k=>close(answer[k],f[k])),points:[1,2,3].every(i=>close(answer['y'+i],value(id,answer['x'+i]))),opening:answer.opening===f.opening,vertex:close(answer.vx,f.h)&&close(answer.vy,f.k),extremum:answer.kind===f.kind};
    return {parts,correct:Object.values(parts).every(Boolean),reason:reason(id,answer)};
  }
  function route(id,result){
    if(!result.parts.expansion)return {target:'expansion',next:id,purpose:'repair',message:'Recheck the expansion first. Keep the same function while you repair that step.'};
    if(!result.parts.points)return {target:'points',next:id,purpose:'repair',message:'Recheck substitution in your chosen points before changing the sign.'};
    if(!result.parts.opening||!result.parts.extremum)return {target:'comparison',next:'negative',purpose:'contrast',message:'Compare the two leading coefficients and the opening directions. This is a contrast task, not a harder-task penalty.'};
    if(!result.parts.vertex)return {target:'vertex',next:id,purpose:'locate',message:'Stay with this function and locate its turning point. Your sample points may not include it.'};
    if(id==='positive')return {target:'negative',next:'negative',purpose:'confirm',message:'Try the sign change as a fresh check. Your positive-function answer stays saved separately.'};
    return {target:'review',next:id,purpose:'complete',message:'Both functions are available for comparison. Review the mathematical reasons alongside the graph.'};
  }
  function vertex(a,b,c){if(!Number.isFinite(a)||a===0)throw new Error('A nonzero quadratic coefficient is required.');return {x:-b/(2*a),y:c-b*b/(4*a)};}
  function plan(id,answer){const error=validate(id,answer);if(error)return {error};const result=grade(id,answer);return {result,route:route(id,result)};}
  const api={functions,number,close,value,reason,validate,grade,route,vertex,plan};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.ClueveraSketch=api;
})(typeof window!=='undefined'?window:globalThis);
