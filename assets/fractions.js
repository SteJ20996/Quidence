(function(root,factory){const api=factory(root);if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceFractions=api;})(typeof window==='undefined'?globalThis:window,root=>{
'use strict';
// Draws written fractions such as 2/3, n/2, σ/√n and (n + 1)/(n + 2) stacked, on screen only.
// Text, translations, answers, records and exports keep the slash; the slash form stays in the page
// as visually hidden text, so copying, searching and screen readers still get “2/3”.
// Units such as km/h and m/s², words such as and/or, dates, paths and counters keep the slash.

const SUP='⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁽⁾ⁿⁱᵃᵇᶜᵈᵉᶠᵍʰʲᵏˡᵐᵒᵖʳˢᵗᵘᵛʷˣʸᶻ',SUB='₀₁₂₃₄₅₆₇₈₉ₙₖᵢⱼₘₓ',GREEK='αβγδεζηθικλμνξπρστυφχψωΓΔΘΛΞΦΨΩ';// Σ and Π are sum and product signs, not letters.
const OPEN={'(':')','[':']'},CLOSE={')':'(',']':'['};
const isDigit=c=>c>='0'&&c<='9',isLatin=c=>/^[A-Za-z]$/.test(c||''),isGreek=c=>!!c&&GREEK.includes(c);
// Marks that belong to the letter or number before them, including combining accents such as the bar in x̄.
const isMark=c=>!!c&&(SUP.includes(c)||SUB.includes(c)||c==='!'||c==='′'||(c>='\u0300'&&c<='\u036f'));
// Function names that may stand before a bracket: C(n, k), P(A), E(X), Var(X), SD(x̄), log(x), sin(x).
const FUNCTIONS=new Set(['C','P','E','Var','SD','DE','sd','f','g','h','log','ln','sin','cos','tan','sqrt','max','min','gcd','lcm','mcd','mcm','R','T','M','S','D','N','F','G']);

// An operand made of one token: a number, or one letter (Latin or Greek) with optional number in front,
// marks after it (superscripts, subscripts, !, ′) and an optional root sign before it.
function tokenRight(s,i){
 let j=i,root=false;if(OPEN[s[j]])return group(s,j,false);if(s[j]==='√'){root=true;j++;if(OPEN[s[j]])return group(s,j,root);}
 const start=j;let digits=0;while(isDigit(s[j])||(s[j]==='.'&&isDigit(s[j+1])&&digits)){digits++;j++;}
 let letters=0,greek=0,inner=0;while(isLatin(s[j])||isGreek(s[j])||(letters&&isMark(s[j])&&(isLatin(s[j+1])||isGreek(s[j+1])))){if(isGreek(s[j]))greek++;if(isMark(s[j]))inner++;else letters++;j++;}
 // A function name may carry a subscript before its bracket: log₁₀(10/9).
 if(letters>1&&!digits&&FUNCTIONS.has(s.slice(start,j))){let k=j;while(SUB.includes(s[k]||'x'))k++;if(OPEN[s[k]])return call(s,start,k,root);}
 // Two or more letters form a product rather than a word when a Greek letter or a mark shows it (nσ², mv₀², mv²),
 // and two lowercase letters do too unless they are a unit (bh, ab, but not km or kg).
 const pair=letters===2&&!digits&&/^[a-z]{2}$/.test(s.slice(start,j))&&!UNITS.has(s.slice(start,j));
 if(letters>1&&(greek||inner||isMark(s[j])||pair)&&letters<=3){let marks=0;while(isMark(s[j])){marks++;j++;}if(isLatin(s[j])||isDigit(s[j]))return null;const text=s.slice(i,j);if(!greek&&!inner&&UNITS.has(text.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+$/,'')))return null;return{start:i,end:j,text,show:text,math:true};}
 if(letters>1&&!digits){// A word: only a known function directly followed by a bracket counts.
  const name=s.slice(start,j);if(FUNCTIONS.has(name)&&s[j]==='(')return call(s,start,j,root);return null;}
 if(letters===1&&s[j]==='('&&!digits&&FUNCTIONS.has(s[j-1]))return call(s,start,j,root);
 if(!digits&&!letters)return null;if(letters>1)return null;
 let marks=0,strong=false;while(isMark(s[j])){if(!SUP.includes(s[j]))strong=true;marks++;j++;}
 if(isLatin(s[j])||isDigit(s[j])||(s[j]==='.'&&isDigit(s[j+1])))return null;
 // A lone letter counts as mathematics when it is Greek or carries a subscript, a factorial or an accent (x̄);
 // a superscript alone does not, because units are written that way (m/s²).
 const text=s.slice(i,j);return{start:i,end:j,text,show:text,math:root||digits>0||letters===1&&(isGreek(s[j-1-marks])||strong)};
}
function group(s,open,root){// A bracketed group from s[open] = '(' or '['; returns its end after closing marks.
 const close=OPEN[s[open]];let depth=0,j=open;for(;j<s.length;j++){if(s[j]===s[open])depth++;else if(s[j]===close){depth--;if(!depth)break;}}
 if(depth||j>=s.length)return null;j++;let marks=0;while(isMark(s[j])){marks++;j++;}
 const start=root?open-1:open,inner=s.slice(open+1,j-1-marks);
 // A bracket of units joined by a dot, as in J/(kg·K), is a unit.
 // Outer brackets are dropped when stacked, except around a pair such as (1, 1).
 return{start,end:j,text:s.slice(start,j),show:!root&&!marks&&!inner.includes(',')?inner:s.slice(start,j),math:true,group:true,unit:/^[A-Za-zΩμ]+(?:[·⋅][A-Za-zΩμ]+)+$/.test(inner)};
}
function call(s,start,open,root){const g=group(s,open,false);if(!g)return null;const b=root?start-1:start;return{start:b,end:g.end,text:s.slice(b,g.end),show:s.slice(b,g.end),math:true,group:true};}
// The same operand read leftwards from the character before the slash at s[i].
function tokenLeft(s,i){
 let j=i;while(j>=0&&isMark(s[j]))j--;
 if(s[j]==='|'){// An absolute value |ΔΦ| before the slash.
  const k=s.lastIndexOf('|',j-1);if(k<0||j-k<2)return null;if(k>0&&/[\w/]/.test(s[k-1]))return null;
  return{start:k,end:i+1,text:s.slice(k,i+1),show:s.slice(k,i+1),math:true,group:true};
 }
 if(CLOSE[s[j]]){// A bracket, possibly a function call or a coefficient: 4(n + 1), n(n + 1), C(n, k), E[X].
  const open=CLOSE[s[j]];let depth=0,k=j;for(;k>=0;k--){if(s[k]===s[j])depth++;else if(s[k]===open){depth--;if(!depth)break;}}
  if(k<0)return null;let b=k;while(b>0&&(isLatin(s[b-1])||isGreek(s[b-1])||isDigit(s[b-1])||s[b-1]==='.'||SUB.includes(s[b-1])))b--;
  const head=s.slice(b,k),name=head.replace(/[₀-₉]+$/,'');
  if(head&&!(/^\d+(?:\.\d+)?$/.test(head)||FUNCTIONS.has(name)||/^[A-Za-zα-ωΑ-Ω]$/.test(head)))return null;
  if(b>0&&(s[b-1]==='√'))b--;
  // Factors written side by side belong to the numerator: P(+ | S)P(S).
  let product=false;while(b>0&&CLOSE[s[b-1]]){const prev=tokenLeft(s,b-1);if(!prev)return null;b=prev.start;product=true;}
  if(b>0&&/[\w/]/.test(s[b-1]))return null;
  const marks=i-j,inner=s.slice(k+1,j);
  return{start:b,end:i+1,text:s.slice(b,i+1),show:!head&&!product&&s[b]!=='√'&&!marks&&!inner.includes(',')?inner:s.slice(b,i+1),math:true,group:true,unit:!head&&!product&&/^[A-Za-zΩμ]+(?:[·⋅][A-Za-zΩμ]+)+$/.test(inner)};
 }
 let b=j;while(b>=0&&(isDigit(s[b])||s[b]==='.'||isLatin(s[b])||isGreek(s[b])))b--;b++;
 if(b>j)return null;if(b>0&&s[b-1]==='√')b--;
 if(b>0&&(/[\w/.√]/.test(s[b-1])||isMark(s[b-1])))return null;
 const t=tokenRight(s,b);if(!t||t.end!==i+1)return null;return t;
}
// Unit symbols written with two or three letters; with a superscript they stay units (cm²/s).
const UNITS=new Set(['km','kg','cm','mm','ms','Wh','kW','kWh','mL','Hz','Pa','min','mol','lb','ft','mi','yd','oz','in','hr']);
// Lowercase letter pairs that are a unit or a word rather than a fraction.
const LETTER_PAIRS=new Set(['m/s','y/o','o/y','e/o','a/o']);
// Every fraction in a string, outermost first, as {start, end, num, den, text}.
function find(s){
 const out=[];
 for(let i=0;i<s.length;i++){
  if(s[i]!=='/')continue;
  if(s[i+1]==='/'||s[i-1]==='/')continue;
  const spaced=s[i-1]===' '&&s[i+1]===' ';if(!spaced&&(s[i-1]===' '||s[i+1]===' '))continue;
  const left=tokenLeft(s,spaced?i-2:i-1),right=tokenRight(s,spaced?i+2:i+1);
  if(!left||!right)continue;
  if(left.unit||right.unit)continue;
  // A factor right after the denominator, as in a/b(c), makes the extent unclear: keep the slash.
  if(OPEN[s[right.end]])continue;
  // A function written with a space, such as log₁₀ 2 / log₁₀(10/9), applies to more than the token beside the slash.
  if(/[A-Za-z₀-₉] $/.test(s.slice(Math.max(0,left.start-2),left.start))&&/(?:log|ln|sin|cos|tan)[₀-₉]* $/.test(s.slice(Math.max(0,left.start-8),left.start)))continue;
  // A chain such as a date 11/1/2026, or a path, is not a fraction.
  if(s[right.end]==='/'||s[left.start-1]==='/')continue;
  // Letters on both sides with nothing mathematical is how units and labels are written (m/s, N/m, E/N):
  // keep the slash, except for two lowercase letters such as a/d or v/f, which are fractions.
  if(!left.math&&!right.math){const pair=left.text+'/'+right.text;if(!/^[a-z]\/[a-z]$/.test(pair)||LETTER_PAIRS.has(pair))continue;}
  // Spaced slashes join bigger terms, never bare counters such as “3 / 12”.
  if(spaced&&!(left.group||right.group))continue;
  // A minus sign before the numerator is not part of it and stays in front of the fraction.
  out.push({start:left.start,end:right.end,num:left.show,den:right.show,text:s.slice(left.start,right.end)});
 }
 // Keep outer fractions; an inner one such as n/2 inside C(n, n/2) / 2ⁿ stays written with a slash.
 out.sort((a,b)=>a.start-b.start||b.end-a.end);const kept=[];
 for(const f of out){const last=kept.at(-1);if(last&&f.start<last.end){if(f.end-f.start>last.end-last.start&&f.start>=last.start){kept[kept.length-1]=f;}continue;}kept.push(f);}
 return kept;
}

// ---- Browser drawing -------------------------------------------------------
// Never drawn: form fields, charts, code, a learner's own words, and counters such as “2/4 responses”.
const SKIP='input,textarea,select,option,script,style,noscript,svg,math,pre,code,blockquote,[contenteditable],[data-no-frac],.student-work,.f-quote,.f-answer-text,[data-progress],.area-count,[data-session],.q-frac-run';
// The numerator and denominator are drawn from data attributes, so the page text keeps the slash form;
// the empty alternative text keeps screen readers on that slash form.
const CSS='.q-frac{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;line-height:1.08;font-size:.88em;margin:0 .12em;position:relative;max-width:100%}'
 +'.q-frac::before{content:attr(data-n);content:attr(data-n) / "";display:block;padding:0 .2em .1em;border-bottom:.075em solid currentColor;white-space:normal;overflow-wrap:anywhere}'
 +'.q-frac::after{content:attr(data-d);content:attr(data-d) / "";display:block;padding:.1em .2em 0;white-space:normal;overflow-wrap:anywhere}'
 +'.q-frac-src{position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap}';
function style(doc){if(doc.getElementById('q-frac-style'))return;const el=doc.createElement('style');el.id='q-frac-style';el.textContent=CSS;(doc.head||doc.documentElement).append(el);}
const runs=new Set();
function draw(node){
 const parts=find(node.data);if(!parts.length)return null;
 const doc=node.ownerDocument,run=doc.createElement('span');run.className='q-frac-run';run.setAttribute('data-no-translate','');
 let last=0;
 for(const f of parts){
  if(f.start>last)run.append(node.data.slice(last,f.start));
  const box=doc.createElement('span');box.className='q-frac';box.dataset.n=f.num;box.dataset.d=f.den;
  const src=doc.createElement('span');src.className='q-frac-src';src.textContent=f.text;box.append(src);run.append(box);last=f.end;
 }
 if(last<node.data.length)run.append(node.data.slice(last));
 run.__source=node;node.replaceWith(run);runs.add(run);return run;
}
function render(scope){
 const doc=scope?.ownerDocument||scope;if(!doc?.createTreeWalker||!scope)return 0;style(doc);
 const walker=doc.createTreeWalker(scope,4),nodes=[];let n;
 while((n=walker.nextNode()))if(n.data.includes('/')&&n.parentElement&&!n.parentElement.closest(SKIP))nodes.push(n);
 let count=0;for(const node of nodes)if(draw(node))count++;return count;
}
// Puts back the original text nodes, so that translation sees exactly what it wrote.
function revert(){for(const run of runs){if(run.isConnected&&run.__source)run.replaceWith(run.__source);}runs.clear();}
let observer=null,pending=false;
function start(){
 if(!root.document||observer)return;
 // Pages with the shared translation module draw fractions after each translation pass.
 if(root.QuidenceI18nFractions){render(root.document.body);return;}
 const run=()=>{pending=false;observer.disconnect();render(root.document.body);observer.observe(root.document.body,{childList:true,subtree:true,characterData:true});};
 observer=new MutationObserver(()=>{if(!pending){pending=true;root.queueMicrotask(run);}});run();
}
if(root.document){if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',start,{once:true});else start();}
return{find,render,revert};
});
