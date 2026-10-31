'use strict';
// Finds standalone controls that look like plain hyperlinks. A navigation link or an action that stands on its
// own (in a toolbar, a header, a course navigation strip, or a paragraph of its own) must look like a button in
// every appearance: a border or a fill, and no underline. These are not standalone:
// - links inside a sentence;
// - links in a page footer;
// - items of a tab bar or a stepper, where one item is marked as the current one;
// - lesson steppers, activity lists and map labels, which have their own designs;
// - icon and tick-mark buttons.
// Pass the function to page.evaluate; it returns one entry per offending control.
function linkLikeControls(){
  const CONTROL='a[href],button';
  const visible=e=>{const r=e.getBoundingClientRect();if(!r.width||!r.height)return false;for(let p=e;p;p=p.parentElement){const s=getComputedStyle(p);if(s.visibility==='hidden'||s.display==='none'||+s.opacity===0)return false;}return true;};
  // Text of a block that is not inside a control: a block whose own words go beyond its controls is a sentence.
  const ownText=node=>[...node.childNodes].map(n=>n.nodeType===3?n.textContent:n.nodeType===1&&!n.matches(CONTROL)&&!['script','style','svg'].includes(n.localName)&&getComputedStyle(n).display.startsWith('inline')?ownText(n):'').join('');
  const inSentence=e=>{let box=e.parentElement;while(box&&getComputedStyle(box).display==='inline')box=box.parentElement;if(!box||/flex|grid/.test(getComputedStyle(box).display))return false;return ownText(box).replace(/[\s·|•,;:()\-–—.]+/g,'').length>1;};
  const MARKED='[aria-current]:not([aria-current="false"]),[aria-selected],[aria-pressed],[role="tab"],.active,.current,.selected';
  const inTabBar=e=>{const bar=e.closest('nav,[role="tablist"]')||e.parentElement,items=[...bar.querySelectorAll(CONTROL)];return items.length>1&&items.some(c=>c.matches(MARKED));};
  const looksLikeButton=e=>{const s=getComputedStyle(e);if(s.textDecorationLine.includes('underline'))return false;
    const filled=!/rgba\(\d+, \d+, \d+, 0\)|transparent/.test(s.backgroundColor)||s.backgroundImage!=='none';
    const bordered=['Top','Right','Bottom','Left'].filter(k=>parseFloat(s['border'+k+'Width'])>=1&&s['border'+k+'Style']!=='none'&&!/rgba\(\d+, \d+, \d+, 0\)/.test(s['border'+k+'Color'])).length>=3;
    return filled||bordered;};
  const OWN_DESIGN='.lesson-link,.area-nav,.route-item,.qa-node,.q-brand,.brand,.skip-link,.q-atlas-note,.q-atlas-qidolab,.q-studio-record-note,.q-studio-qidolab';
  const found=[];
  for(const e of document.querySelectorAll(CONTROL)){
    if(!visible(e)||e.matches(OWN_DESIGN)||e.closest('svg,.q-theme-bar,[data-language-host],.language-toolbar,.q-brand'))continue;
    if(e.matches('a')&&e.closest('footer,[class*="footer"]'))continue;
    const text=e.textContent.replace(/\s+/g,' ').trim();if(text.length<=3)continue;
    if(inSentence(e)||inTabBar(e)||looksLikeButton(e))continue;
    found.push({text:text.slice(0,60),control:e.localName+(e.id?'#'+e.id:'')+(typeof e.className==='string'&&e.className.trim()?'.'+e.className.trim().split(/\s+/).join('.'):''),parent:e.parentElement.localName+(typeof e.parentElement.className==='string'&&e.parentElement.className.trim()?'.'+e.parentElement.className.trim().split(/\s+/)[0]:'')});
  }
  return found;
}
module.exports={linkLikeControls};
