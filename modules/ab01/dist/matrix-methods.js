(function(root){
'use strict';
function multiply(a,v){
 if(!Array.isArray(a)||!a.length||!Array.isArray(v)||!v.length||!v.every(Number.isFinite)||!a.every(row=>Array.isArray(row)&&row.length===v.length&&row.every(Number.isFinite)))throw new Error('Each matrix row must have one entry per input component.');
 return a.map(row=>row.reduce((sum,n,j)=>sum+n*v[j],0));
}
const EXAMPLES=[
 {name:'Two inputs, two outputs',a:[[1,1],[0,1]],v:[1,2]},
 {name:'Two inputs, three outputs',a:[[1,0],[0,1],[1,-1]],v:[2,1]},
 {name:'Three inputs, two outputs',a:[[1,0,-1],[0,2,1]],v:[2,1,3]}
];
const matrix=a=>'<span class="method-matrix" style="grid-template-columns:repeat('+a[0].length+',minmax(28px,1fr))" role="img" aria-label="'+a.length+' rows and '+a[0].length+' columns: '+a.map(row=>row.join(', ')).join('; ')+'">'+a.flat().map(n=>'<span>'+n+'</span>').join('')+'</span>';
function example(e){const output=multiply(e.a,e.v);return'<article class="method-example"><h3>'+e.name+'</h3><p>'+e.a.length+' × '+e.v.length+' matrix · '+e.v.length+' input components → '+output.length+' output components</p><div class="method-product">'+matrix(e.a)+'<span>×</span>'+matrix(e.v.map(n=>[n]))+'<span>=</span>'+matrix(output.map(n=>[n]))+'</div><ol>'+e.a.map((row,i)=>'<li>'+row.map((n,j)=>'('+n+') × ('+e.v[j]+')').join(' + ')+' = '+output[i]+'</li>').join('')+'</ol></article>';}
function render(){return'<section class="matrix-methods" aria-label="Matrix multiplication as equations"><h2>The same idea, written as a formula</h2><p>If the columns of A are a₁ and a₂ and the input is v = (v₁, v₂), then <span class="method-equation">Av = v₁a₁ + v₂a₂</span>. Each input component multiplies its corresponding column.</p><div class="method-general"><span>For A = </span>'+matrix([['a','b'],['c','d']])+'<span>and v = (v₁, v₂):</span><span class="method-equation">Av = (av₁ + bv₂, cv₁ + dv₂)</span></div><p>The first row gives the first output component; the second row gives the second. In general, an m × n matrix takes n input components and produces m output components. Matrix multiplication requires the input length to match the number of columns.</p><div class="method-examples">'+EXAMPLES.map(example).join('')+'</div><p class="review-text">These are teaching examples, not additional scored questions. A correct formula with enough steps to justify the result can explain your method without matching a preferred sentence.</p></section>';}
const api={multiply,EXAMPLES,render};root.QuidenceMatrixMethods=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
