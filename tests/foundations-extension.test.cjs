'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const B=require('../assets/foundation-bank.js'),X=require('../assets/foundation-extension.js'),E=require('../assets/foundation-engine.js');
const item=id=>Object.values(X.MODULES).flatMap(m=>m.tasks).find(t=>t.id===id);
const refs=id=>Object.fromEntries(item(id).fields.map(f=>[f.id,f.answer]));
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} differs from ${b}`);
const mv=(a,v)=>a.map(row=>row.reduce((s,x,i)=>s+x*v[i],0));
const response=t=>({...E.blank(t),values:Object.fromEntries(t.fields.map(f=>[f.id,f.kind==='multi'?[...f.answer]:String(f.answer)])),explanation:'I checked the relevant quantities and connections.'});
test('thirty supplemental items have distinct IDs, valid choices, explicit reason requests, and retained entry definitions',()=>{
 const ids=new Set(Object.values(B.MODULES).flatMap(m=>m.tasks.map(t=>t.id)));assert.equal(ids.size,210);
 assert.deepEqual(Object.values(X.MODULES).map(m=>m.tasks.length),[8,8,6,8]);
 for(const[module,m]of Object.entries(X.MODULES))for(const t of m.tasks){assert.ok(!ids.has(t.id));ids.add(t.id);assert.equal(t.module,module);assert.equal(t.groupName,m.groups[t.group]);assert.ok(t.reason.length>25&&t.solution.length>30&&t.next.length>25);assert.match(t.provenance,/source clearance has not been independently verified/);assert.equal(new Set(t.fields.map(f=>f.id)).size,t.fields.length);for(const f of t.fields){if(f.kind==='number')assert.ok(Number.isFinite(f.answer));else{assert.ok(f.options.some(o=>o.value===f.answer));assert.equal(new Set(f.options.map(o=>o.value)).size,f.options.length);}}}
 assert.equal(ids.size,240);assert.equal(B.VERSION,'cluevera-foundations-1');
});
test('supplemental school mathematics checks portions, operation order, changing percentage bases, and solution sets',()=>{
 close(refs('aa-x01').cups*(1/8),3/4);assert.deepEqual(refs('aa-x02'),{value:-2*(3-5)+1,valid:'no'});assert.notEqual(-2*3-5+1,refs('aa-x02').value);
 const price=d=>5+2*d;assert.deepEqual(refs('aa-x03'),{proportional:'no',zero:price(0),four:price(4)});assert.notEqual(price(1)/1,price(2)/2);
 const raised=80*(1+25/100),final=raised*(1-20/100);assert.deepEqual(refs('aa-x04'),{raised,final,returns:final===80?'yes':'no'});
 const x=refs('aa-x05').x;assert.equal(4*x+1,2*x+9);
 assert.deepEqual(refs('aa-x06'),{p:'many',q:'none'});assert.equal(2*3,6);assert.notEqual(2*3,7);for(const x of [-5,0,4.2])assert.equal(2*(x+3),2*x+6);
 const range=refs('aa-x07');assert.deepEqual(range,{range:'ge',minus4:-2*(-4)<=6?'yes':'no',zero:-2*0<=6?'yes':'no'});for(const x of [-4,-3,0,5])assert.equal(-2*x<=6,x>=-3);
 const count=Math.floor((30-11)/3);assert.deepEqual(refs('aa-x08'),{fixed:11,rate:3,count,cost:11+3*count,next:11+3*(count+1)});assert.ok(refs('aa-x08').cost<=30&&refs('aa-x08').next>30);
});
test('supplemental linear algebra checks shapes, ordered composition, scaling, independence, and non-unique maps',()=>{
 const a=[[1,0,2],[0,1,3]],b=[[1,0],[0,1],[1,1]];
 assert.equal(a[0].length,b.length);assert.equal(b[0].length,a.length);assert.deepEqual(refs('ab-x01'),{ab:'yes',abRows:a.length,abCols:b[0].length,ba:'yes',baRows:b.length,baCols:a[0].length});assert.deepEqual(refs('ab-x02'),{defined:'no',input:a[0].length,output:a.length});
 const S=v=>mv([[2,0],[0,1]],v),H=v=>mv([[1,1],[0,1]],v),hs=H(S([1,1])),sh=S(H([1,1]));assert.deepEqual(refs('ab-x03'),{hsX:hs[0],hsY:hs[1],shX:sh[0],shY:sh[1]});assert.notDeepEqual(hs,sh);
 const T=([x,y])=>[x*x,y];assert.deepEqual(refs('ab-x04'),{zeroX:T([0,0])[0],zeroY:T([0,0])[1],t2:T([2,0])[0],scaled:2*T([1,0])[0],linear:'no'});assert.notDeepEqual(T([2,0]),T([1,0]).map(v=>2*v));
 const r=refs('ab-x05');assert.equal(r.a+r.b,4);assert.equal(r.a-r.b,2);assert.notEqual(1*(-1)-1*1,0);assert.equal(r.independent,'yes');
 assert.deepEqual(refs('ab-x06'),{p:'many',q:'none'});assert.equal(2*2,4);assert.notEqual(2*2,5);for(const x of [-2,0,7])assert.equal(2*x+2*(2-x),4);
 const matrix=[[1,2],[2,4]];assert.deepEqual(refs('ab-x07'),{x:mv(matrix,[-2,1])[0],y:mv(matrix,[-2,1])[1],unique:'no'});assert.deepEqual(mv(matrix,[-2,1]),mv(matrix,[0,0]));const out=mv([[2,-1],[1,3]],[2,-1]);assert.deepEqual(refs('ab-x08'),{x:out[0],y:out[1],valid:'no'});
});
test('supplemental games enumerate all unilateral deviations rather than assuming familiar or diagonal outcomes',()=>{
 const story=[[[4,3],[2,5]],[[6,1],[1,2]]];assert.deepEqual(refs('ac-x01'),{a:story[1][0][0],b:story[1][0][1]});
 const g=item('ac-x02').visual.payoffs;assert.deepEqual(refs('ac-x02'),{a:g[0][1][0]>g[1][1][0]?'top':'bottom',b:g[1][0][1]>g[1][1][1]?'left':'right'});
 const equilibrium=(p,r,c)=>p[r][c][0]>=p[1-r][c][0]&&p[r][c][1]>=p[r][1-c][1];const pairs=[[0,0,'tl'],[0,1,'tr'],[1,0,'bl'],[1,1,'br']];for(const[r,c,key]of pairs)assert.equal(refs('ac-x03')[key],equilibrium(g,r,c)?'yes':'no');
 const weak=item('ac-x04').visual.payoffs,differences=[0,1].map(c=>weak[0][c][0]-weak[1][c][0]);assert.ok(differences.every(x=>x>=0)&&differences.some(x=>x>0)&&differences.some(x=>x===0));assert.equal(refs('ac-x04').type,'weak');
 const p=item('ac-x05').visual.payoffs;assert.equal(refs('ac-x05').nash,equilibrium(p,1,1)?'yes':'no');assert.equal(refs('ac-x05').better,[0,1].every(i=>p[0][0][i]>p[1][1][i])?'yes':'no');
 const changed=structuredClone(p);changed[0][1][0]=3;assert.deepEqual(refs('ac-x06'),{nash:equilibrium(changed,1,1)?'yes':'no',gain:changed[0][1][0]-changed[1][1][0]});
});
test('supplemental calculus independently computes limits, quotients, nonunit sums, signed motion, and antiderivatives',()=>{
 assert.deepEqual(refs('ad-x01'),{limit:2+2,same:'no'});for(const x of [1.9,2.1])close((x*x-4)/(x-2),x+2);
 const q=refs('ad-x02');for(const h of [-.2,.1,.01])close(((2+h)**2-2**2)/h,q.k*h+q.b);assert.equal(q.derivative,2*2);
 const rows=item('ad-x03').table.rows;close(refs('ad-x03').local,(rows[3][1]-rows[1][1])/(rows[3][0]-rows[1][0]));close(refs('ad-x03').wide,(rows[4][1]-rows[0][1])/(rows[4][0]-rows[0][0]));
 const width=2/4,heights=Array.from({length:4},(_,i)=>((i+1)*width)**2).reduce((s,n)=>s+n,0);assert.deepEqual(refs('ad-x04'),{width,heights,sum:width*heights});assert.notEqual(heights,refs('ad-x04').sum);
 const left=[0,1,2].reduce((s,x)=>s+x,0),right=[1,2,3].reduce((s,x)=>s+x,0);assert.deepEqual(refs('ad-x05'),{left,right,under:'left'});assert.ok(left<3*3/2&&right>3*3/2);
 const segments=[[2,3],[3,-2]],net=segments.reduce((s,[dt,v])=>s+dt*v,0),distance=segments.reduce((s,[dt,v])=>s+dt*Math.abs(v),0);assert.deepEqual(refs('ad-x06'),{net,distance,position:10+net});
 const anti=refs('ad-x07');assert.equal(2*anti.a,2);assert.equal(anti.constant,5);assert.equal(anti.f3,anti.a*3**2+anti.constant);assert.deepEqual(refs('ad-x08'),{value:3**2-1**2,slope:2*3});
});
test('old and further checks restore with their own immutable definitions and reject cross-version answers',()=>{
 const p=E.fresh();for(const module of Object.keys(X.MODULES)){const entry=E.createSession(p,module);for(const t of E.tasks(entry)){E.edit(entry,t,response(t));E.submit(entry,t);}entry.view='report';const original=JSON.stringify(entry);const further=E.createSession(p,module,'followup');assert.equal(JSON.stringify(entry),original);for(const t of E.tasks(further)){E.edit(further,t,response(t));assert.equal(E.submit(further,t).ok,true);}further.view='report';assert.equal(E.portable(entry).bankVersion,B.VERSION);assert.equal(E.portable(further).bankVersion,X.VERSION);assert.equal(E.portable(further).taskDefinitions.length,X.MODULES[module].tasks.length);assert.match(E.markdown(further),/Further foundation check/);assert.deepEqual(E.hydrate(p),p);}
 const bad=structuredClone(p),s=bad.modules.aa01.sessions[1];s.records['aa-x01'].submissions[0].taskVersion=B.VERSION;assert.equal(E.hydrate(bad),null);s.records['aa-x01'].submissions[0].taskVersion=X.VERSION;s.check='entry';assert.equal(E.hydrate(bad),null);
});
test('partial components and multi-select detail are retained without grading uncertainty or explanation text automatically',()=>{
 const p=E.fresh(),s=E.createSession(p,'ab01','followup'),t=item('ab-x03'),a=response(t);a.values.hsX='99';a.explanation='4';E.edit(s,t,a);E.submit(s,t);const o=E.observations(s)[2];assert.deepEqual(o.components.map(c=>c.state),['recheck','matched','matched','matched']);assert.equal(o.explanationReview,null);assert.equal(E.evidenceSummary(s).matched,3);assert.equal(E.evidenceSummary(s).recheck,1);
 const m=B.MODULES.ac01.tasks.find(t=>t.id==='ac-f13'),answer=response(m);answer.values.cells=['tl','tr'];const checked=E.componentChecks(m,{answer,objective:E.evaluate(m,answer)})[0];assert.equal(checked.state,'recheck');assert.equal(checked.selection.correct.length,1);assert.equal(checked.selection.extra.length,1);assert.equal(checked.selection.missing.length,1);answer.unsure=true;const uncertain=E.componentChecks(m,{answer,objective:E.evaluate(m,answer)})[0];assert.equal(uncertain.state,'unsure');assert.equal(uncertain.selection,undefined);
});

