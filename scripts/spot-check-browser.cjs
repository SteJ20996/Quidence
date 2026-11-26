'use strict';
// Seeded random spot-check of the whole site. It is a tool for people, not part of npm test:
//   node scripts/spot-check-browser.cjs <seed> <samples> <output folder>
// Each sample is a random page state, appearance and screen width, then 0–3 random safe clicks (with text typed into
// empty fields). It then records page overflow, cut-off text, overlapping or small controls, controls past the right
// edge, broken images, low text contrast, script errors and plain-looking controls, and saves a screenshot. Internal
// links on the sampled pages are fetched once at the end. The same seed gives the same samples. The checks are
// heuristics: review each flag against its screenshot before changing anything (see review/spot-check-20261125.md).
const path=require('path'),repo=path.join(__dirname,'..');const [seedArg,nArg,outdir]=process.argv.slice(2);const seed=+seedArg||20261125,N=+nArg||48;
const {chromium}=require('playwright'),{createServer}=require(repo+'/backend/server.cjs'),{files}=require(repo+'/scripts/build-static-release.cjs'),{linkLikeControls}=require(repo+'/scripts/link-button-audit.cjs');
const fs=require('fs');
let s=seed>>>0;const rnd=()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};
const pick=a=>a[Math.floor(rnd()*a.length)];
const pages=files().filter(f=>f.endsWith('.html')).map(f=>'/'+f.replace(/index\.html$/,''));
const states=[...pages,'/?view=courses','/?view=map','/?view=intuition','/?view=projects',
 ...'multiply plans perimeter fair square cards waves sphere groups tosses transforms primes regions choices apex circuit melt patterns halves'.split(' ').map(id=>'/intuition/#'+id),
 ...[1,2,3,4].map(n=>'/cross-disciplinary/?project=cross-p0'+n),
 ...['food-trucks','shared-printer','missed-deadline'].map(id=>'/modules/ac01/dist/projects/?activity='+id),
 ...'bfs binary-search bubble-sort dfs dijkstra euclid fewest-coins find-max greedy-change hanoi insertion-sort kruskal linear-search merge-sort quicksort subset-sum'.split(' ').map(id=>'/courses/algorithms/?algorithm='+id),
 // Checks for several subjects, including a check taken in parts.
 ...'integrated-science quantitative algebra-1 number-theory algorithms probability'.split(' ').flatMap(m=>['/diagnostics/?module='+m,'/foundations/?module='+m]),
 // Walks: open a random lesson of a course, answer its first question, then open a few of its steps.
 ...'integrated-science quantitative pre-algebra algebra-1 geometry algebra-2 basic-logic physics-1 physics-2'.split(' ').map(c=>'walk:/courses/'+c+'/')];
const THEMES=['classic','paper','atlas','studio'],WIDTHS=[320,390,768,1024,1366,1920];
function checks(){
  const out={overflow:document.documentElement.scrollWidth-innerWidth,clipped:[],overlaps:[],small:[],brokenImages:[],lowContrast:[],offscreen:[]};
  // Controls behind an open modal dialog, or scrolled out of an ancestor that clips its content, are not on screen.
  const modal=document.querySelector('dialog:modal');
  const clippedOut=(e,r)=>{for(let p=e.parentElement;p&&p!==document.body;p=p.parentElement){const st=getComputedStyle(p);if(/hidden|clip|auto|scroll/.test(st.overflowX+st.overflowY)){const q=p.getBoundingClientRect();if(r.bottom<=q.top+1||r.top>=q.bottom-1||r.right<=q.left+1||r.left>=q.right-1)return true;}}return false;};
  const vis=e=>{const r=e.getBoundingClientRect();if(r.width<=4||r.height<=2)return false;if(modal&&!modal.contains(e))return false;if(clippedOut(e,r))return false;for(let x=e.closest('details:not([open])');x;x=x.parentElement&&x.parentElement.closest('details:not([open])')){const sum=x.querySelector(':scope>summary');if(!(sum&&sum.contains(e)))return false;}for(let p=e;p;p=p.parentElement){const s=getComputedStyle(p);if(s.visibility==='hidden'||s.display==='none'||+s.opacity===0)return false;}return true;};
  const name=e=>e.localName+(e.id?'#'+e.id:'')+(typeof e.className==='string'&&e.className.trim()?'.'+e.className.trim().split(/\s+/).slice(0,2).join('.'):'');
  const label=e=>(e.textContent||e.getAttribute('aria-label')||'').replace(/\s+/g,' ').trim().slice(0,50);
  // Text cut off by its own box.
  for(const e of document.querySelectorAll('body *')){
    if(['script','style','svg','path','textarea','input','select','option','canvas','img'].includes(e.localName)||e.closest('svg'))continue;
    const st=getComputedStyle(e);if(!/hidden|clip/.test(st.overflowX+st.overflowY)&&st.textOverflow!=='ellipsis')continue;
    if(!e.textContent.trim()||!vis(e))continue;
    if(e.scrollWidth>e.clientWidth+2||e.scrollHeight>e.clientHeight+2){if(/auto|scroll/.test(st.overflowX+st.overflowY))continue;
      // Only report when a text line, not a decorative child, is cut.
      const own=[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());if(own||e.children.length<=2)out.clipped.push({el:name(e),text:label(e),sw:e.scrollWidth,cw:e.clientWidth,sh:e.scrollHeight,ch:e.clientHeight});}
  }
  const CONTROL='a[href],button,summary,[role="button"],[role="tab"],input:not([type="hidden"]),select,textarea';
  const ctrls=[...document.querySelectorAll(CONTROL)].filter(e=>vis(e)&&!e.closest('svg'));
  const inline=e=>{let b=e.parentElement;while(b&&getComputedStyle(b).display==='inline')b=b.parentElement;return getComputedStyle(e).display==='inline'&&b&&!/flex|grid/.test(getComputedStyle(b).display);};
  for(const e of ctrls){const r=e.getBoundingClientRect();
    if(!inline(e)&&!e.matches('input[type="checkbox"],input[type="radio"]')&&(r.width<24||r.height<24))out.small.push({el:name(e),text:label(e),w:Math.round(r.width),h:Math.round(r.height)});
    if(r.right>innerWidth+1&&!e.closest('[style*="overflow"],.map-scroll,.qa-map,pre,.table-scroll'))out.offscreen.push({el:name(e),text:label(e),right:Math.round(r.right)});}
  for(let i=0;i<ctrls.length;i++)for(let j=i+1;j<ctrls.length;j++){const a=ctrls[i],b=ctrls[j];if(a.contains(b)||b.contains(a)||a.closest('label')&&a.closest('label')===b.closest('label'))continue;
    const p=a.getBoundingClientRect(),q=b.getBoundingClientRect();const w=Math.min(p.right,q.right)-Math.max(p.left,q.left),h=Math.min(p.bottom,q.bottom)-Math.max(p.top,q.top);
    if(w>2&&h>2){const share=w*h/Math.min(p.width*p.height,q.width*q.height);if(share>.25)out.overlaps.push({a:name(a)+' «'+label(a)+'»',b:name(b)+' «'+label(b)+'»',share:+share.toFixed(2)});}}
  for(const img of document.images)if(vis(img)&&img.complete&&!img.naturalWidth)out.brokenImages.push(img.getAttribute('src'));
  // Text contrast against the first opaque background behind it (images and gradients are skipped).
  const rgb=c=>c.match(/[\d.]+/g).map(Number);const lum=c=>c.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
  const seen=new Set();
  for(const e of document.querySelectorAll('body *')){
    if(e.closest('svg,script,style,:disabled')||!vis(e))continue;const own=[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim().length>1);if(!own)continue;
    const st=getComputedStyle(e);if(!/^rgb/.test(st.color))continue;let bg=null,img=false;for(let p=e;p;p=p.parentElement){const ps=getComputedStyle(p);if(ps.backgroundImage!=='none'){img=true;break;}if(!/^rgb|^transparent/.test(ps.backgroundColor)){img=true;break;}const c=rgb(ps.backgroundColor);if(c.length<4||c[3]>.9){bg=c;break;}}
    if(img||!bg)continue;const fg=rgb(st.color);if(fg.length>3&&fg[3]<.9)continue;const L1=lum(fg),L2=lum(bg),ratio=(Math.max(L1,L2)+.05)/(Math.min(L1,L2)+.05);
    const big=parseFloat(st.fontSize)>=24||parseFloat(st.fontSize)>=18.6&&+st.fontWeight>=700;const need=big?3:4.5;
    if(ratio<need-.05){const k=name(e)+st.color+st.backgroundColor;if(seen.has(k))continue;seen.add(k);out.lowContrast.push({el:name(e),text:label(e),ratio:+ratio.toFixed(2),fg:st.color,bg:'rgb('+bg.slice(0,3).join(',')+')',size:st.fontSize});}
  }
  return out;
}
(async()=>{fs.mkdirSync(outdir,{recursive:true});
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 const b=await chromium.launch();const results=[];
 for(let i=0;i<N;i++){
  const theme=THEMES[i%4],width=pick(WIDTHS),url=pick(states),clicks=Math.floor(rnd()*4);
  const ctx=await b.newContext({viewport:{width,height:900}});await ctx.addInitScript(t=>localStorage.setItem('quidence_ui_theme_v1',t),theme);
  const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(String(e.message).slice(0,160)));p.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text().slice(0,160));});
  const rec={i,theme,width,url,clicks:[],errors};
  try{
   const walk=url.startsWith('walk:'),target=walk?url.slice(5):url;
   await p.goto(origin+target,{waitUntil:'load'});await p.waitForFunction(()=>window.QuidenceI18n?.locale==='en',null,{timeout:8000}).catch(()=>{});await p.waitForTimeout(400);
   if(walk){
    // Choose the lesson and the number of steps from the seeded generator, so a seed always walks the same way.
    const lessons=await p.locator('[data-action="open"]').count(),lesson=Math.floor(rnd()*Math.max(1,lessons)),steps=Math.floor(rnd()*5);
    if(lessons){await p.locator('[data-action="open"]').nth(lesson).click().catch(()=>{});await p.waitForTimeout(300);}
    await p.evaluate(()=>{const f=document.querySelector('form');if(!f)return;const r=f.querySelector('input[type="radio"]');if(r)r.click();const t=f.querySelector('textarea');if(t&&!t.value){t.value='Because the pattern doubles each time.';t.dispatchEvent(new Event('input',{bubbles:true}));}});
    const submit=p.locator('form button[type="submit"]').first();if(await submit.count())await submit.click().catch(()=>{});await p.waitForTimeout(300);
    for(let k=0;k<steps;k++){for(const a of['continue','skip-step-prediction','next-step']){const b=p.locator(`[data-action="${a}"]`).first();if(await b.count()&&await b.isVisible().catch(()=>false)){await b.click().catch(()=>{});await p.waitForTimeout(250);}}}
    // Move each lab control to a random allowed value.
    const ranges=await p.locator('input[type="range"]').count();for(let k=0;k<ranges;k++){const v=rnd();await p.locator('input[type="range"]').nth(k).evaluate((e,v)=>{const lo=+e.min,hi=+e.max,st=+e.step||1;e.value=String(lo+Math.round((hi-lo)*v/st)*st);e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));},v).catch(()=>{});}
    const selects=await p.locator('select').count();for(let k=0;k<selects;k++){const v=rnd();await p.locator('select').nth(k).evaluate((e,v)=>{if(!e.options.length||e.closest('[data-f-subject],.q-theme-bar'))return;e.selectedIndex=Math.floor(v*e.options.length);e.dispatchEvent(new Event('change',{bubbles:true}));},v).catch(()=>{});}
    await p.waitForTimeout(300);rec.walk={lesson,steps};
   }
   for(let c=0;c<clicks;c++){
    // Fill empty visible text fields, then click a random safe control on this page.
    await p.evaluate(()=>{for(const f of document.querySelectorAll('textarea,input[type="text"],input:not([type])')){const r=f.getBoundingClientRect();if(r.width&&!f.value&&!f.disabled&&!f.readOnly){f.value='Because the pattern doubles each time.';f.dispatchEvent(new Event('input',{bubbles:true}));}}
      for(const g of new Set([...document.querySelectorAll('input[type="radio"]')].map(r=>r.name))){const rs=[...document.querySelectorAll(`input[type="radio"][name="${CSS.escape(g)}"]`)].filter(r=>r.getBoundingClientRect().width);if(rs.length&&!rs.some(r=>r.checked)){rs[0].click();}}});
    const cands=await p.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();if(!r.width||!r.height)return false;const t=(e.textContent+' '+(e.getAttribute('aria-label')||'')).toLowerCase();
      if(e.closest('.q-theme-bar,.q-brand,.brand'))return false;if(/delete|erase|clear|remove|reset|download|export|print|copy|share|dictate|record|microphone/.test(t))return false;
      if(e.matches('a[href]')){const h=e.getAttribute('href');if(/^(https?:|mailto:|blob:|data:)/.test(h)&&!h.startsWith(location.origin))return false;if(e.target==='_blank')return false;}
      return true;};return[...document.querySelectorAll('button:not([disabled]),a[href],summary,[role="tab"]')].filter(ok).map((e,i)=>{e.setAttribute('data-spot',String(i));return{i,text:(e.textContent||e.getAttribute('aria-label')||'').replace(/\s+/g,' ').trim().slice(0,40)};});});
    if(!cands.length)break;const choice=cands[Math.floor(rnd()*cands.length)];rec.clicks.push(choice.text);
    await p.locator(`[data-spot="${choice.i}"]`).first().click({timeout:3000}).catch(e=>rec.clicks.push('click failed'));
    await p.waitForTimeout(600);await p.waitForLoadState('load').catch(()=>{});
   }
   rec.finalUrl=p.url().replace(origin,'');
   rec.checks=await p.evaluate(checks);rec.checks.buttons=await p.evaluate(linkLikeControls);
   rec.links=await p.evaluate(()=>[...new Set([...document.querySelectorAll('a[href]')].map(a=>a.href).filter(h=>h.startsWith(location.origin)).map(h=>h.split('#')[0]))]);
   const shot=path.join(outdir,String(i).padStart(2,'0')+'-'+theme+'-'+width+'.png');
   const h=await p.evaluate(()=>Math.min(document.documentElement.scrollHeight,3200));await p.setViewportSize({width,height:Math.max(600,h)});await p.waitForTimeout(200);
   await p.screenshot({path:shot});rec.shot=shot;
  }catch(err){rec.error=String(err).slice(0,200);}
  results.push(rec);await ctx.close();
 }
 // Internal links on the sampled states: any that do not load.
 const all=new Set(results.flatMap(r=>r.links||[]));const broken=[];for(const h of all){const res=await fetch(h).catch(()=>null);if(!res||res.status>=400)broken.push(h.replace(origin,'')+' '+(res?res.status:'ERR'));}
 fs.writeFileSync(path.join(outdir,'results.json'),JSON.stringify({seed,N,linksChecked:all.size,broken,results},null,1));
 await b.close();server.close();
})();
