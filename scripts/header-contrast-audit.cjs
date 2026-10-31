'use strict';
// Finds text in page headers and toolbars that is hard to read against its background. Each appearance repaints
// the headers, so a color chosen for one header (white on the dark Classic header, for example) can end up on a
// light header in another appearance. Text needs a contrast of at least 4.5:1 (WCAG AA for normal text). Disabled
// controls are exempt, as WCAG allows. Text over a gradient is skipped because its background has no single color.
// Pass the function to page.evaluate; it returns one entry per unreadable text element.
function lowContrastHeaderText(){
  const channels=color=>color.match(/[\d.]+/g).map(Number);
  const luminance=color=>channels(color).slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
  const background=e=>{
    for(let x=e;x;x=x.parentElement){
      const s=getComputedStyle(x);if(/gradient/.test(s.backgroundImage))return null;
      const c=channels(s.backgroundColor);if(c.length<4||c[3]>.5)return s.backgroundColor;
    }
    return 'rgb(255, 255, 255)';
  };
  const found=new Set();
  for(const region of document.querySelectorAll('header,.site-header,.q-brand-header,.subject-home-nav,.topbar,.f-toolbar')){
    for(const e of region.querySelectorAll('*')){
      if(!e.getClientRects().length||e.closest(':disabled,[aria-disabled="true"],svg'))continue;
      if(![...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))continue;
      const s=getComputedStyle(e);if(s.visibility==='hidden'||+s.opacity===0)continue;
      const bg=background(e);if(!bg)continue;
      const a=luminance(s.color),b=luminance(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
      if(ratio<4.5)found.add(`${e.localName} "${e.textContent.trim().slice(0,40)}" ${s.color} on ${bg} = ${ratio.toFixed(2)}`);
    }
  }
  return [...found];
}
module.exports={lowContrastHeaderText};
