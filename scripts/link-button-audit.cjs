'use strict';
// Finds clickable controls that do not look like buttons. Every link, button, show-more toggle and tab must have a
// visible border on at least three sides, or a fill, and no underline, in every appearance. That includes links
// inside sentences and footers, tabs, steppers, lesson lists and map places; their shapes may differ.
// Only two kinds are exempt:
// - the logo, which links home on every page;
// - controls drawn inside a diagram (SVG), whose rectangle or circle is the button.
// Pass the function to page.evaluate; it returns one entry per offending control.
function linkLikeControls(){
  const CONTROL='a[href],button,summary,[role="button"],[role="link"],[role="tab"]';
  const visible=e=>{const r=e.getBoundingClientRect();if(!r.width||!r.height)return false;for(let p=e;p;p=p.parentElement){const s=getComputedStyle(p);if(s.visibility==='hidden'||s.display==='none'||+s.opacity===0)return false;}return true;};
  const transparent=/rgba\(\d+, \d+, \d+, 0\)|transparent/;
  const looksLikeButton=e=>{const s=getComputedStyle(e);if(s.textDecorationLine.includes('underline'))return false;
    const filled=!transparent.test(s.backgroundColor)||s.backgroundImage!=='none';
    const bordered=['Top','Right','Bottom','Left'].filter(k=>parseFloat(s['border'+k+'Width'])>=1&&s['border'+k+'Style']!=='none'&&!transparent.test(s['border'+k+'Color'])).length>=3;
    return filled||bordered;};
  const drawn=e=>e.closest('svg')&&(e.matches('rect,circle,ellipse,path,polygon')||e.querySelector('rect,circle,ellipse,path,polygon'));
  const found=[];
  for(const e of document.querySelectorAll(CONTROL)){
    if(!visible(e)||e.closest('.q-brand,.brand')||drawn(e))continue;
    if(looksLikeButton(e))continue;
    const text=e.textContent.replace(/\s+/g,' ').trim()||e.getAttribute('aria-label')||'';
    found.push({text:text.slice(0,60),control:e.localName+(e.id?'#'+e.id:'')+(typeof e.className==='string'&&e.className.trim()?'.'+e.className.trim().split(/\s+/).join('.'):''),parent:e.parentElement.localName+(typeof e.parentElement.className==='string'&&e.parentElement.className.trim()?'.'+e.parentElement.className.trim().split(/\s+/)[0]:'')});
  }
  return found;
}
module.exports={linkLikeControls};
