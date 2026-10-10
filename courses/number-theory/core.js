(function(root){
  'use strict';
  function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){const r=a%b;a=b;b=r;}return a;}
  function mod(a,n){return ((a%n)+n)%n;}
  function powMod(base,exponent,modulus){let b=BigInt(base),e=BigInt(exponent),m=BigInt(modulus),r=1n;b=(b%m+m)%m;while(e>0n){if(e&1n)r=r*b%m;b=b*b%m;e>>=1n;}return Number(r);}
  function rational(raw){
    let s=String(raw).trim().replace(/[−–]/g,'-').replace(/\s/g,'');
    if(s.length>80||!s)return null;
    if(s.includes(','))return null;
    function atom(x){
      if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d{1,2})?$/.test(x))return null;
      const [body,exp='0']=x.toLowerCase().split('e');const exponent=Number(exp);if(Math.abs(exponent)>30)return null;
      const sign=body.startsWith('-')?-1n:1n;const unsigned=body.replace(/^[+-]/,'');const parts=unsigned.split('.');
      const decimals=parts[1]||'';let a=sign*BigInt((parts[0]||'0')+decimals),b=10n**BigInt(decimals.length);
      if(exponent>0)a*=10n**BigInt(exponent);if(exponent<0)b*=10n**BigInt(-exponent);return [a,b];
    }
    const parts=s.split('/');if(parts.length>2)return null;const a=atom(parts[0]);if(!a)return null;if(parts.length===1)return a;
    const b=atom(parts[1]);if(!b||b[0]===0n)return null;let n=a[0]*b[1],d=a[1]*b[0];if(d<0n){n=-n;d=-d;}return [n,d];
  }
  function equalNumber(a,b){const x=rational(a),y=rational(b);return !!(x&&y&&x[0]*y[1]===y[0]*x[1]);}

  function roundedDecimal(raw,answer,minimumPlaces){
    if(!Number.isInteger(minimumPlaces)||minimumPlaces<1||minimumPlaces>30)return false;
    const normalized=String(raw).trim().replace(/[−–]/g,'-'),match=normalized.match(/^[+-]?(?:\d+)?\.(\d+)$/);
    if(!match||match[1].length<minimumPlaces||normalized.length>80)return false;
    const exact=rational(answer),input=rational(normalized);if(!exact||!input)return false;
    const scale=10n**BigInt(match[1].length),magnitude=exact[0]<0n?-exact[0]:exact[0];
    const rounded=(2n*magnitude*scale+exact[1])/(2n*exact[1]),signed=exact[0]<0n?-rounded:rounded;
    return input[0]*scale===signed*input[1];
  }
  function orderedOptions(field,seed){
    const options=field.options.slice();if(field.type!=='choice')return options;
    // Stable per question across navigation, language changes and reloads.
    let hash=2166136261;for(const c of 'quidence:choices:v1:'+seed)hash=Math.imul(hash^c.charCodeAt(0),16777619)>>>0;
    for(let i=options.length-1;i>0;i--){hash=(hash+0x6D2B79F5)>>>0;let t=hash;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);const j=((t^(t>>>14))>>>0)%(i+1);[options[i],options[j]]=[options[j],options[i]];}
    return options;
  }
  function filled(field,value){return field.type==='multi'?Array.isArray(value)&&value.length>0:typeof value==='string'&&value.trim().length>0;}
  function grade(field,value){
    if(!filled(field,value))return {status:'empty',text:'Add a response when you are ready.'};
    if(field.type==='reason')return {status:'pending',text:'Reasoning saved for review. Compare your argument with the proof and self-check points.'};
    if(field.type==='number'){
      const normalized=String(value).trim();
      const symbol=field.accepted.some(v=>!rational(v)&&v.toLowerCase()===normalized.toLowerCase());
      if(!rational(normalized)&&!symbol)return {status:'format',text:'Use a decimal point with no thousands separators, a fraction such as 5/13, or the stated symbol.'};
      const exact=equalNumber(normalized,field.answer),accepted=field.accepted.some(v=>equalNumber(normalized,v))||symbol||roundedDecimal(normalized,field.answer,field.minDecimalPlaces);
      return exact||accepted?{status:'correct',text:exact?'Correct calculation. Can you explain why it works?':'Accepted as the stated approximation or symbol.'}:{status:'retry',text:'Try again. Revisit the condition or the preceding step.'};
    }
    const good=field.type==='multi'?value.length===field.answer.length&&new Set(value).size===value.length&&field.answer.every(v=>value.includes(v)):value===field.answer;
    return good?{status:'correct',text:'This choice matches the conclusion.'}:{status:'retry',text:'Reconsider the condition. You can change your answer and check again.'};
  }
  function pour(amounts,caps,from){const to=1-from,moved=Math.min(amounts[from],caps[to]-amounts[to]);const next=amounts.slice();next[from]-=moved;next[to]+=moved;return next;}
  function ticket(n){const b=mod(3*n,5),threshold=7*b;return {b,threshold,possible:n>=threshold,a:n>=threshold?(n-threshold)/5:null};}
  function triple(m,n){const a=m*m-n*n,b=2*m*n,c=m*m+n*n;return {a,b,c,g:gcd(gcd(a,b),c)};}
  const api={gcd,mod,powMod,rational,equalNumber,roundedDecimal,orderedOptions,filled,grade,pour,ticket,triple};root.NTCore=api;
  if(typeof module==='object'&&module.exports)module.exports=api;
})(globalThis);
