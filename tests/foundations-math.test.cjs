'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const B=require('../assets/foundation-bank.js'),E=require('../assets/foundation-engine.js'),G=require('../assets/foundation-graphs.js');
const answers=id=>Object.fromEntries(B.MODULES[id].tasks.map(t=>[t.id,Object.fromEntries(t.fields.map(f=>[f.id,f.answer]))]));
const mul=(a,v)=>a.map(row=>row.reduce((s,n,i)=>s+n*v[i],0));
const pure=g=>{const cells=[];for(let r=0;r<2;r++)for(let c=0;c<2;c++)if(g.payoffs[r][c][0]>=g.payoffs[1-r][c][0]&&g.payoffs[r][c][1]>=g.payoffs[r][1-c][1])cells.push(['tl','tr','bl','br'][2*r+c]);return cells;};
test('ninety entry items have unique IDs, five balanced groups, answer fields, and focused reason prompts',()=>{
 const ids=new Set();for(const [module,m]of Object.entries(B.MODULES)){assert.equal(m.tasks.length,15);assert.equal(m.groups.length,5);for(let g=0;g<5;g++)assert.equal(m.tasks.filter(t=>t.group===g).length,3);for(const t of m.tasks){assert.ok(!ids.has(t.id));ids.add(t.id);assert.equal(t.module,module);assert.ok(t.reason.length>25&&t.solution.length>25&&t.next.length>20);assert.ok(t.fields.length>=1);assert.equal(new Set(t.fields.map(f=>f.id)).size,t.fields.length);assert.match(t.provenance,/Newly composed/);}}assert.equal(ids.size,90);
});
test('school-math references match independent arithmetic, slope, and budget calculations',()=>{
 const a=answers('aa01');assert.equal(a['aa-f01'].greater,-3/4>-.8?'fraction':'decimal');assert.equal(a['aa-f02'].value,-2-5);assert.equal(a['aa-f03'].sum,1/2+1/4);assert.deepEqual(a['aa-f04'],{one:12/3,five:5*(12/3)});
 const table=B.MODULES.aa01.tasks[4].table.rows;assert.equal(table[0][1],0);assert.ok(table.slice(1).every(([n,c])=>c/n===3));assert.equal(a['aa-f05'].proportional,'yes');assert.equal(a['aa-f06'].percent,12/40*100);
 for(const x of [-3,0,2.5])assert.equal(2*(x+3),2*x+6);assert.equal(a['aa-f07'].expression,'both');assert.equal(3*a['aa-f08'].x-4,11);for(const x of [-4,4,4.1])assert.equal(2*x+1<=9,x<=4);assert.equal(a['aa-f09'].range,'le');
 for(const [x,y]of B.MODULES.aa01.tasks[9].table.rows)assert.equal(a['aa-f10'].m*x+a['aa-f10'].b,y);assert.equal(a['aa-f11'].slope,(-2-4)/(2-(-1)));assert.deepEqual(a['aa-f12'],{x:3,y:-2});assert.equal(a['aa-f13'].cost,6+4*3);assert.equal(a['aa-f14'].area,3*(6-2));
 const visits=Math.floor((23-6)/4);assert.deepEqual(a['aa-f15'],{visits,cost:6+4*visits,next:6+4*(visits+1)});assert.ok(a['aa-f15'].cost<=23&&a['aa-f15'].next>23);
});
test('vector and matrix references match independent component and column calculations',()=>{
 const a=answers('ab01');assert.deepEqual(a['ab-f01'],{x:2-(-1),y:3-1});assert.deepEqual(a['ab-f02'],{x:2-1,y:-1+3});assert.deepEqual(a['ab-f03'],{x:-2,y:-2*(-3)});assert.deepEqual(a['ab-f04'],{x:2*1-3,y:2*2-(-1)});
 assert.equal(0*2===1,false);assert.equal(a['ab-f05'].reachable,'no');for(const[x,y]of [[-3,4],[0,0],[2.5,-7]])assert.deepEqual([x,2*(y/2)],[x,y]);assert.equal(a['ab-f06'].plane,'yes');
 const tasks=B.MODULES.ab01.tasks;assert.deepEqual(a['ab-f07'],{rows:tasks[6].matrix.length,cols:tasks[6].matrix[0].length,input:tasks[6].matrix[0].length});assert.deepEqual(mul(tasks[7].matrix,[-2,3]),Object.values(a['ab-f08']));assert.deepEqual(tasks[8].matrix.map(r=>r[0]),Object.values(a['ab-f09']));assert.deepEqual(mul(tasks[9].matrix,[1,3]),Object.values(a['ab-f10']));assert.deepEqual(mul(tasks[10].matrix,[0,1]),Object.values(a['ab-f11']));
 assert.notDeepEqual([0+1,0],[0,0]);assert.equal(a['ab-f12'].linear,'no');assert.deepEqual(mul(tasks[12].matrix,[2,3]),Object.values(a['ab-f13']));for(const v of [[1,0],[0,1],[-2,3]]){const p=mul(tasks[13].matrix,v);assert.equal(p[1],2*p[0]);}assert.equal(a['ab-f14'].image,'line');assert.equal(a['ab-f15'].x+a['ab-f15'].y,5);assert.equal(a['ab-f15'].x-a['ab-f15'].y,1);
});
test('game references follow owned payoffs, conditional responses, ties, and unilateral deviations',()=>{
 const t=B.MODULES.ac01.tasks,a=answers('ac01'),p=t[0].visual.payoffs;assert.deepEqual(Object.values(a['ac-f01']),p[0][1]);assert.deepEqual(Object.values(a['ac-f02']),p[0][0]);assert.deepEqual(a['ac-f03'],{a:'x',b:'y'});
 assert.ok(p[1][0][0]>p[0][0][0]);assert.equal(a['ac-f04'].row,'bottom');assert.ok(p[0][1][1]>p[0][0][1]);assert.equal(a['ac-f05'].col,'right');assert.equal(t[5].visual.payoffs[0][0][0],t[5].visual.payoffs[1][0][0]);assert.deepEqual(a['ac-f06'].rows,['top','bottom']);
 assert.ok([0,1].every(c=>p[1][c][0]>p[0][c][0]));assert.equal(a['ac-f07'].dominant,'bottom');const weak=t[7].visual.payoffs;assert.ok([0,1].every(c=>weak[0][c][0]>=weak[1][c][0]));assert.ok([0,1].some(c=>weak[0][c][0]===weak[1][c][0]));assert.equal(a['ac-f08'].type,'weak');assert.equal(a['ac-f09'].dominant,'none');
 const pd=t[9].visual.payoffs;assert.ok([0,1].every(i=>pd[0][0][i]>pd[1][1][i]));assert.equal(a['ac-f10'].mutual,'coop');assert.equal(a['ac-f11'].gain,pd[1][0][0]-pd[0][0][0]);assert.deepEqual(pure(t[9].visual),['br']);assert.equal(a['ac-f12'].why,'incentive');assert.deepEqual(a['ac-f13'].cells,pure(t[12].visual));assert.deepEqual(pure(t[13].visual),[]);assert.equal(a['ac-f14'].pure,'no');assert.ok(pure(t[14].visual).includes('tl'));assert.equal(a['ac-f15'].tie,'no');
});
test('calculus references match one-sided limits, difference quotients, rectangles, and oriented integrals',()=>{
 const a=answers('ad01');assert.equal(a['ad-f01'].limit,1+1);assert.notEqual(-1,1);assert.equal(a['ad-f02'].exists,'no');assert.equal(a['ad-f03'].limit,2**2);assert.equal(a['ad-f04'].rate,(3**2-1**2)/(3-1));assert.equal(a['ad-f05'].derivative,'six');assert.equal(a['ad-f06'].exists,'no');assert.equal(a['ad-f07'].derivative,(0-4)/(2-0));assert.equal(a['ad-f08'].meaning,'velocity');assert.ok(Math.abs(a['ad-f09'].change-3*(2.1-2))<1e-12);
 const rectangles=B.MODULES.ad01.tasks[9].visual.rectangles;assert.equal(a['ad-f10'].sum,rectangles.reduce((n,[x0,x1,y])=>n+(x1-x0)*y,0));assert.ok(Math.abs(8/3-1.75)<Math.abs(8/3-1));assert.equal(a['ad-f11'].closer,'four');const primitive=x=>x*x/2;assert.equal(a['ad-f12'].integral,primitive(1)-primitive(-1));assert.equal(a['ad-f12'].area,.5*1*1+.5*1*1);assert.equal(a['ad-f13'].integral,3*(0-2));assert.equal(a['ad-f14'].derivative,2**2-1);assert.equal(a['ad-f15'].change,-2*(3-1));
});
test('task graphics remain finite and provide readable descriptions at narrow and desktop widths',()=>{for(const m of Object.values(B.MODULES))for(const t of m.tasks)for(const width of [240,320,620]){const svg=G.visual(t,width);assert.doesNotMatch(svg,/NaN|Infinity|undefined/);if(t.visual)assert.ok(svg.includes(t.visual.description));if(t.matrix)assert.match(svg,/Matrix rows:/);}});

