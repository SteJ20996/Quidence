(function(root){
  'use strict';
  // Calculations behind the Probability labs. Answer checking uses NTCore from the Number Theory course.
  // Simulations use a seeded generator, so every visit sees the same repeatable sequence of outcomes.
  function random(seed){let s=seed>>>0;return()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
  function choose(n,k){if(k<0||k>n)return 0;let r=1;for(let i=1;i<=k;i++)r=r*(n-k+i)/i;return Math.round(r);}
  const binomial=(n,k,p)=>choose(n,k)*p**k*(1-p)**(n-k);
  // P(at least one success in n independent tries with success probability p).
  const atLeastOne=(p,n)=>1-(1-p)**n;
  // Two dice as 36 ordered outcomes [red, blue].
  const DICE=Array.from({length:36},(_,i)=>[Math.floor(i/6)+1,i%6+1]);
  const DICE_EVENTS={seven:([a,b])=>a+b===7,double:([a,b])=>a===6&&b===6,six:([a,b])=>a===6||b===6};
  // Problem of points: every sequence of a + b − 1 rounds, as strings of A and B, with the winner of each.
  function pointsSequences(a,b){const n=a+b-1,out=[];for(let m=0;m<2**n;m++){const s=Array.from({length:n},(_,i)=>m>>(n-1-i)&1?'B':'A').join('');out.push({rounds:s,winner:[...s].filter(c=>c==='A').length>=a?'A':'B'});}return out;}
  // Counts in a population of the given size for a test with the given rates.
  function screening(size,prevalence,sensitivity,falsePositive){const sick=Math.round(size*prevalence),healthy=size-sick;return {sick,healthy,truePositive:Math.round(sick*sensitivity),falsePositive:Math.round(healthy*falsePositive)};}
  const posterior=(prior,sensitivity,falsePositive)=>sensitivity*prior/(sensitivity*prior+falsePositive*(1-prior));
  function sharedBirthday(n,days=365){let q=1;for(let i=0;i<n;i++)q*=(days-i)/days;return 1-q;}
  function shuffle(n,rand){const a=Array.from({length:n},(_,i)=>i+1);for(let i=n-1;i>0;i--){const j=Math.floor(rand()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  const fixedPoints=perm=>perm.filter((c,i)=>c===i+1).length;
  const die=rand=>1+Math.floor(rand()*6);
  // Rolls of one die until the first six; returns the rolls.
  function waitForSix(rand){const rolls=[];do rolls.push(die(rand));while(rolls[rolls.length-1]!==6);return rolls;}
  // Rolls of one die until every face has appeared; returns the rolls.
  function collectFaces(rand){const seen=new Set(),rolls=[];while(seen.size<6){const r=die(rand);rolls.push(r);seen.add(r);}return rolls;}
  const harmonic=n=>{let h=0;for(let k=1;k<=n;k++)h+=1/k;return h;};
  // A Galton board ball: the list of bounces, 1 for right and 0 for left.
  const galton=(rows,p,rand)=>Array.from({length:rows},()=>rand()<p?1:0);
  const api={random,choose,binomial,atLeastOne,DICE,DICE_EVENTS,pointsSequences,screening,posterior,sharedBirthday,shuffle,fixedPoints,die,waitForSix,collectFaces,harmonic,galton};
  root.PRCore=api;if(typeof module==='object'&&module.exports)module.exports=api;
})(typeof window==='undefined'?globalThis:window);
