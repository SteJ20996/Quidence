'use strict';
// Records what the logo does while a page loads, so a browser test can check that it is painted once, in the right
// color and place. Add recordLogo to a browser context with addInitScript; after a page loads, read the record with
// page.evaluate(logoReport, tolerance).
// - wrongAfterPaint lists times after the first paint when the logo was visible in another version than its final one,
//   which shows as a flash of the other logo. themes.js hides a logo until it is marked data-logo-ready.
// - movesAfterPaint lists logo positions after the first paint that are more than `tolerance` pixels from the final
//   one, which show as a jump. A few pixels can come from a web font arriving and are allowed.
function recordLogo(){
  const ids=new WeakMap();let next=0;
  const record=window.__quidenceLogo={firstPaint:null,states:[],positions:[],ids};
  const id=img=>{if(!ids.has(img))ids.set(img,++next);return ids.get(img);};
  const managed=img=>img.matches('[data-logo-light-src][data-logo-dark-src]');
  const note=img=>record.states.push({time:performance.now(),id:id(img),src:img.getAttribute('src'),ready:!managed(img)||img.hasAttribute('data-logo-ready')});
  try{new PerformanceObserver(list=>{for(const entry of list.getEntries())if(record.firstPaint===null)record.firstPaint=entry.startTime;}).observe({type:'paint',buffered:true});}catch{}
  new MutationObserver(changes=>{for(const change of changes){
    if(change.type==='attributes'&&change.target.matches?.('img.q-brand-logo'))note(change.target);
    if(change.type==='childList')for(const node of change.addedNodes)if(node.nodeType===1)for(const img of node.matches('img.q-brand-logo')?[node]:node.querySelectorAll('img.q-brand-logo'))note(img);
  }}).observe(document,{subtree:true,childList:true,attributes:true,attributeFilter:['src','data-logo-ready']});
  const started=performance.now();
  const sample=()=>{
    const logo=[...document.querySelectorAll('img.q-brand-logo')].find(e=>e.getClientRects().length);
    if(logo){const box=logo.getBoundingClientRect(),x=Math.round(box.left),y=Math.round(box.top+scrollY),last=record.positions.at(-1);if(!last||last.x!==x||last.y!==y)record.positions.push({time:performance.now(),x,y});}
    if(performance.now()-started<3000)requestAnimationFrame(sample);
  };
  requestAnimationFrame(sample);
}
function logoReport(tolerance=0){
  const record=window.__quidenceLogo;if(!record)return null;
  const logo=[...document.querySelectorAll('img.q-brand-logo')].find(e=>e.getClientRects().length);if(!logo)return null;
  const painted=record.firstPaint??0,finalSrc=logo.getAttribute('src'),states=record.states.filter(state=>state.id===record.ids.get(logo));
  // A logo that is not marked ready is hidden only where the page's styles say so; check with a stand-in logo.
  const stand=document.createElement('img');stand.className='q-brand-logo';stand.dataset.logoLightSrc=stand.dataset.logoDarkSrc='#';stand.style.animation='none';
  document.body.append(stand);const hides=getComputedStyle(stand).visibility==='hidden';stand.remove();
  // Each recorded state lasts until the next one; it was on screen if any of that time came after the first paint.
  const wrongAfterPaint=states.filter((state,i)=>(state.ready||!hides)&&state.src!==finalSrc&&(states[i+1]?.time??Infinity)>painted).map(state=>Math.round(state.time)+'ms '+state.src);
  const final=record.positions.at(-1);
  // A position is sampled just before its frame is painted, so the last sample before the first paint is on screen too.
  const before=record.positions.filter(sample=>sample.time<painted).at(-1),shown=[...(before?[before]:[]),...record.positions.filter(sample=>sample.time>=painted)];
  return {
    wrongAfterPaint,
    movesAfterPaint:final?shown.filter(sample=>Math.hypot(sample.x-final.x,sample.y-final.y)>tolerance).map(sample=>`${Math.round(sample.time)}ms at ${sample.x},${sample.y}, settles at ${final.x},${final.y}`):[]
  };
}
module.exports={recordLogo,logoReport};
