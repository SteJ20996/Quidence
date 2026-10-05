const assert=require('node:assert/strict'),{load}=require('./workspace.cjs'),g=require('../dist/geometry.js');
// Dimensions belong to projected silhouette edges, rather than fixed screen slots.
for(const view of [{},{yaw:.65},{yaw:1.6,pitch:-.4},{yaw:-2.1,pitch:.8},{x:5},{zoom:.65},{zoom:1.75}]){
 const labels=g.dimensionLayout(view);assert.equal(labels.length,3);
 for(const c of labels){
  assert([27,42].includes(c.offset));assert(Math.abs(c.angle)<=90);
  const mid=c.p.map((n,i)=>(n+c.q[i])/2),delta=c.center.map((n,i)=>n-mid[i]);
  assert(Math.abs(delta[0]*c.normal[0]+delta[1]*c.normal[1]-c.offset)<1e-8);
 }
 assert(!g.render(view).includes('stroke-dasharray'));
}
assert.equal(g.dimensionLayout({yaw:0,pitch:0}).length,2); // No false depth edge when viewed end-on.
// Numerical checks cover conservation, the four cross-products, and rotation.
for(const x of [1,2,3,4,5])for(const stage of [0,1,2]){
  const m=g.model({x,stage});assert.equal(m.volume,16*x*x+88*x+120);
  assert.equal(m.partVolumes.reduce((a,b)=>a+b,0),m.volume);
  assert(m.parts.every(p=>p.size[1]===8&&p.size.every(n=>n>0)));
  if(stage)assert.deepEqual(m.partVolumes,[16*x*x,40*x,48*x,120]);
  for(const yaw of [-3,-1,0,1,3])for(const pitch of [-1.3,0,1.3]){
    const svg=g.render({x,stage,yaw,pitch});assert(!/NaN|Infinity/.test(svg));assert(svg.includes('<polygon'));
    const p=[2,4,7],r=g.rotate(p,yaw,pitch);assert(Math.abs(Math.hypot(...p)-Math.hypot(...r))<1e-10);
  }
}
const h=load();h.api.goto(h.api.state.queue.indexOf('V1'));assert(h.app.innerHTML.includes('Geometry lab'));
h.q('[data-optional-visual="volume-model"]').click();
const r=h.api.state.records.V1,first=h.q('#solid-viewport').innerHTML;
h.q('[data-solid-action="right"]').click();assert.notEqual(h.q('#solid-viewport').innerHTML,first);
h.q('[data-solid-action="in"]').click();assert(r.solidView.zoom>1);
h.q('[data-solid-stage="2"]').click();assert.equal(r.solidView.stage,2);assert(h.q('#solid-viewport').innerHTML.includes('data-solid-piece="D"'));
const surface=h.q('#solid-viewport'),yaw=r.solidView.yaw;
surface.onpointerdown({button:0,pointerId:7,clientX:50,clientY:50});surface.onpointermove({pointerId:8,clientX:80,clientY:90});assert.equal(r.solidView.yaw,yaw);
surface.onpointermove({pointerId:7,clientX:90,clientY:65});assert.notEqual(r.solidView.yaw,yaw);surface.onpointerup({pointerId:7});
let prevented=false;surface.onkeydown({key:'Home',preventDefault(){prevented=true;}});assert(prevented);assert.equal(r.solidView.zoom,1);assert.equal(r.solidView.stage,2);
const slider=h.q('[data-solid-x]');slider.value='5';slider.fire('input');assert.equal(r.solidView.x,5);
for(const[k,v]of Object.entries({quad:16,linear:88,constant:120,volume2:360}))h.input(k,v);h.text('40x + 48x = 88x.');h.q('#submit').click();assert.equal(r.score.correct,true);assert.equal(r.reason.points,2);
assert.equal(h.api.state.events.at(-1).support.visual_state.x,5);assert(h.api.state.events.at(-1).objective_components.every(c=>c.support_level==='hinted'));
const completed=r.complete;h.q('[data-solid-action="left"]').click();assert.equal(r.complete,completed);assert.equal(r.score.correct,true);h.api.goto(0);h.api.goto(h.api.state.queue.indexOf('V1'));assert.equal(h.api.collect().volume2,360);assert.equal(r.solidView.x,5);
h.api.goto(h.api.state.queue.indexOf('D1'));h.q('[data-optional-visual="subtraction-model"]').click();const d=h.api.state.records.D1;
for(const x of [4,7,9]){
 const s=h.q('[data-minus-x]');s.value=String(x);s.fire('input');const svg=h.q('#minus-diagram').innerHTML;assert(!/NaN|Infinity/.test(svg));assert(svg.includes('width="81" height="135"'));assert(svg.includes(`width="${(x-3)*27}" height="135"`));assert(svg.includes('Remaining area = whole area − removed area'));assert(svg.includes(`the kept width is ${x-3}`));assert(svg.includes(`class="model-small">= ${x-3}</text>`));
}
h.choose('rewrite','5x-15');h.input('areaAt7',20);h.text('The removed strip is 3 wide and 5 tall, so its area is 15.');h.q('#submit').click();assert.equal(d.score.correct,true);assert.equal(d.reason.points,2);
assert.equal(h.reason.evaluate('D1','I subtract only 2 because the removed area is 2.',true).status,'Needs review');
assert.equal(h.reason.evaluate('V1','I used the shape somehow.',true).points,null);
assert.equal(h.reason.evaluate('D1','',true).points,null);
h.q('#snapshot').click();assert(h.app.innerHTML.includes('Area and volume products matched in two tasks'));
console.log(JSON.stringify({result:'passed',scope:'3D math and control callbacks; native pointer/touch dispatch and browser layout unverified',checks:['four positive cuboids conserve volume','all cross terms preserved','finite projection and rotation length invariance','zoom, rotate, keyboard, pointer guards and stage changes','views do not alter answers or saved scores','view state and drafts survive navigation','subtraction removes a height-5 width-3 strip','new rubrics, evidence snapshots and report findings']}));

