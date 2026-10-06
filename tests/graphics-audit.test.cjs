'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const H=require('../scripts/build-hub-illustrations.cjs'),A=require('../scripts/audit-graphics.cjs');
const attrs=s=>Object.fromEntries([...s.matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
const near=(a,b,tol=.002)=>assert.ok(Math.abs(a-b)<tol,`${a} ≠ ${b}`);
test('calculus cover uses one function for the curve, tangent, point, and rectangle heights',()=>{
 const svg=H.build().ad01,paths=[...svg.matchAll(/<path[^>]*>/g)].map(m=>attrs(m[0]));
 const read=d=>[...d.matchAll(/[ML]([\d.-]+) ([\d.-]+)/g)].map(m=>[(Number(m[1])-48)/70,(130-Number(m[2]))/23]);
 const curve=read(paths.find(p=>'data-curve'in p).d),tangent=read(paths.find(p=>'data-tangent'in p).d);
 for(const[x,y]of curve)near(y,.4*x*x+.4);
 for(const[x,y]of tangent)near(y,1.6*x-1.2);
 const p=attrs(svg.match(/<circle[^>]*>/)[0]);near(Number(p.cx),188);near(Number(p.cy),84);
 // Tangency means equal height and equal derivative at x=2, rather than just crossing.
 near((tangent.at(-1)[1]-tangent[0][1])/(tangent.at(-1)[0]-tangent[0][0]),2*.4*2);
 for(const r of [...svg.matchAll(/<rect data-midpoint[^>]*>/g)].map(m=>attrs(m[0])))near((130-Number(r.y))/23,.4*Number(r['data-midpoint'])**2+.4);
});
test('pre-calculus cover point lies exactly on a circle, and all six assets are deterministic',()=>{
 const svgs=H.build(),s=svgs.af01,circles=[...s.matchAll(/<circle[^>]*>/g)].map(m=>attrs(m[0])),ring=circles.find(c=>c.r==='40'),p=circles.at(-1);
 near(Math.hypot(Number(p.cx)-Number(ring.cx),Number(p.cy)-Number(ring.cy)),40);
 near(Number(p.cx)-246,74-Number(p.cy));
 for(const[id,svg]of Object.entries(svgs)){assert.equal(fs.readFileSync(path.join(__dirname,'../assets/illustrations',id+'.svg'),'utf8'),svg);assert.match(svg,/<title/);assert.match(svg,/<desc/);assert.doesNotMatch(svg,/NaN|Infinity|fill=""/);}
});
test('homepage offers eight mathematics courses and forty diagnostic challenges',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
 assert.equal([...html.matchAll(/data-subject="/g)].length,8);assert.equal([...html.matchAll(/data-course-state="available"/g)].length,8);assert.equal([...html.matchAll(/data-course-state="planned"/g)].length,0);assert.equal([...html.matchAll(/class="subject-link"/g)].length,8);
 assert.doesNotMatch(html,/Game Theory|Microeconomics|Macroeconomics/);assert.match(html,/AP Calculus AB and BC are planned/);assert.match(html,/Forty intermediate and challenging/);
});
test('active figure families render finite states; calculus labels stay inside the frame',()=>{
 const samples=A.collect();assert.ok(samples.length>290);for(const s of samples){assert.doesNotMatch(s.svg,/NaN|Infinity/,s.name);if(s.group!=='ab01')assert.match(s.svg,/role="img"/,s.name);
  if(s.group==='ad01'){const labels=s.svg.match(/<g class="plot-annotations">([\s\S]*?)<\/g>/)?.[1]||'';for(const m of labels.matchAll(/<text[^>]*>([^<]*)<\/text>/g)){const a=attrs(m[0]);assert.ok(Number(a.x)>=60&&Number(a.x)+m[1].length*8.5<=592,s.name);assert.ok(Number(a.y)>=48&&Number(a.y)<=258,s.name);}}
 }
 for(const id of['hub','aa01','ab01','ad01','ae01','af01','foundations'])assert.ok(samples.some(s=>s.group===id));
 const first=samples.find(s=>s.name==='guide-280-0-1');assert.equal((first.svg.match(/v = \(1, 2\)/g)||[]).length,1);assert.doesNotMatch(first.svg,/>\(1, 2\)<\/text>/);
 const final=samples.find(s=>s.name==='guide-280-6-1');assert.match(final.svg,/Av = \(3, 2\)/);
 const large=samples.find(s=>s.name==='QP-50-1'),tick=large.svg.match(/<text[^>]*>-2000<\/text>/);assert.ok(tick);assert.ok(Number(attrs(tick[0]).x)>=60,'Keep the negative sign of large ticks inside the figure');
});
