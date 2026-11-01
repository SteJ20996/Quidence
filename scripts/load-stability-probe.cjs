'use strict';
// Records what the logo does while a page loads, so a browser test can check that it is painted once, in the right
// color and place. Add recordLogo to a browser context with addInitScript; after a page loads, read the record with
// page.evaluate(logoReport).
// - swapsAfterPaint lists logo src changes made after the first paint, which show as a flash of the other logo.
// - movesAfterPaint lists logo positions after the first paint that are more than `tolerance` pixels from the final
//   one, which show as a jump. A few pixels can come from a web font arriving and are allowed.
function recordLogo(){
  const record=window.__quidenceLogo={firstPaint:null,swaps:[],positions:[]};
  try{new PerformanceObserver(list=>{for(const entry of list.getEntries())if(record.firstPaint===null)record.firstPaint=entry.startTime;}).observe({type:'paint',buffered:true});}catch{}
  new MutationObserver(changes=>{for(const change of changes)if(change.target.matches?.('img.q-brand-logo'))record.swaps.push({time:performance.now(),src:change.target.getAttribute('src')});})
    .observe(document,{subtree:true,attributes:true,attributeFilter:['src']});
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
  const painted=record.firstPaint??0,final=record.positions.at(-1);
  // A position is sampled just before its frame is painted, so the last sample before the first paint is on screen too.
  const before=record.positions.filter(sample=>sample.time<painted).at(-1),shown=[...(before?[before]:[]),...record.positions.filter(sample=>sample.time>=painted)];
  return {
    swapsAfterPaint:record.swaps.filter(swap=>swap.time>=painted).map(swap=>Math.round(swap.time)+'ms '+swap.src),
    movesAfterPaint:shown.filter(sample=>Math.hypot(sample.x-final.x,sample.y-final.y)>tolerance).map(sample=>`${Math.round(sample.time)}ms at ${sample.x},${sample.y}, settles at ${final.x},${final.y}`)
  };
}
module.exports={recordLogo,logoReport};
