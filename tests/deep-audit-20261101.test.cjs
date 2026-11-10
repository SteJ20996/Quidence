'use strict';
// Regressions for the 2026-11-01 deep audit: requested units, exact checks, wording and translations.
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8');
const F=require('../assets/foundation-engine.js');
const banks=[require('../assets/foundation-bank.js'),require('../assets/foundation-extension.js'),require('../assets/challenge-bank.js'),require('../assets/project-bank.js')];
const fields=()=>{const out=new Map();for(const B of banks)for(const M of [B.MODULES,...Object.values(B.HISTORY||{})])for(const m of Object.values(M))for(const t of m.tasks||[])for(const f of t.fields||[])if(f.kind==='number'&&Number.isFinite(f.answer))out.set(t.id+'.'+f.id,f);return out;};
const unitOf=f=>f.unit||f.label.match(/\(([^()]+)\)\s*$/)?.[1];
const UNITS=['$','%','L','km','km/h','min','min²','kW','kWh','cm²','litres','hours','degrees','units²','grid units²','items/100 m','cm per minute','m','m²','cm','h','s','J','W','Wh','N','kg','Hz','m/s','m/s²','kg·m/s','°'];

test('a matching unit from the field label is accepted wherever a label requests one; a different unit is not',()=>{
 let checked=0;
 for(const [key,f] of fields()){
  const unit=unitOf(f);if(!UNITS.includes(unit))continue;
  assert(F.numberMatches(f,String(f.answer)+' '+unit,F.NUMERIC_POLICY),key+' rejected '+f.answer+' '+unit);
  assert(F.numberMatches(f,String(f.answer),F.NUMERIC_POLICY),key+' rejected the bare number');
  assert(!F.numberMatches(f,String(f.answer)+' parsecs',F.NUMERIC_POLICY),key+' accepted a different unit');
  checked++;
 }
 assert(checked>=240,String(checked));
 // Every field the audit listed is among them.
 const listed=['aa-f14.area','ge-f08.area','ge-f09.squareCentimetres','pa-c01.left','pa-c02.original','pa-c02.discount','pa-c02.tax','pa-c03.time','a1-c04.cost','ge-c02.area','ge-c04.product','pc-c04.period','pc-c04.time',
  'pa-p01.concentrate','pa-p01.prepared','pa-p01.extraConcentrate','pa-p01.extraWater','pa-p02.distance','pa-p02.newSpeed','a1-p01.surplus','a1-p01.balance','ge-p01.gridArea','pc-p02.bx','pc-p02.by','pc-p02.distance','pc-p02.angle','pc-p02.rotatedX','pc-p02.rotatedY',
  'ca-p01.turn1','ca-p01.turn2','ca-p01.maxTime1','ca-p01.maxTime2','ca-p02.peakPower','ca-p02.endPower','ca-p02.uncapped','ca-p02.average','ca-p02.exported','ca-p02.sensitivity','st-p01.mean','st-p01.variance','st-p01.se','st-p01.low','st-p01.high','st-p02.mainMean','st-p02.pocketMean','st-p02.pooledMean','la-p02.area'];
 const all=fields();let found=0;
 for(const key of listed){const f=all.get(key);if(!f)continue;found++;assert(F.numberMatches(f,String(f.answer)+' '+unitOf(f),F.NUMERIC_POLICY),key);}
 assert(found>=45,'audit fields found: '+found);
});

test('units shown in Spanish, dollar signs in front, and notation in parentheses',()=>{
 const m=(label,answer,value)=>F.numberMatches({label,answer},value,F.NUMERIC_POLICY);
 assert(m('Concentrate left (litres)',0.45,'9/20 litros'));assert(m('Time to fill (hours)',3,'3 horas'));assert(m('A-to-B angle (degrees)',90,'90 grados'));
 assert(m('Longshore sector mean (items/100 m)',12,'12 objetos/100 m'));assert(m('Image triangle area (units²)',6,'6 unidades²'));
 assert(m('Original price ($)',50,'$50'));assert(m('Net balance ($)',-2,'−$2'));assert(m('Net balance ($)',-2,'$-2'));
 assert(m('Remaining area (cm²)',12,'12 cm^2'));assert(!m('Area (m²)',6,'60000 cm²'),'prefixes are not converted');
 // Parentheses that are notation, not units, never accept a suffix.
 assert(!m('f(3)',5,'5 3'));assert(!m('W(4)',3,'3 4'));assert(!m('Solutions of 6x ≡ 4 (mod 10)',2,'2 mod 10'));assert(m('W(4)',3,'3'));
});

test('the coordinate project checks distances to two decimal places and checks fairness and the road exactly',async()=>{
 const {validate}=await import('../courses/coordinate-geometry/core.mjs');
 const ok=(p,a,b)=>Object.fromEntries(validate('station',3,p,{distanceA:a,distanceB:b}).map(r=>[r.id,r.ok]));
 assert.deepEqual(ok({x:6,y:5},'50','50.00'),{fair:true,road:true,distanceA:true,distanceB:true});
 assert.deepEqual(ok({x:6,y:5},'50.09','50.09'),{fair:true,road:true,distanceA:false,distanceB:false});
 assert.equal(ok({x:6.01,y:5.01},'50.14','49.98').fair,false,'unequal walks are not fair');
 assert.equal(ok({x:6,y:5.01},'50.06','50.06').road,false,'a point off the road is not on it');
 assert.equal(ok({x:6,y:5},'50.004','49.996').distanceA,true,'a correctly rounded value is accepted');
});

test('Linear Algebra matrices: rank is exact for the half-step entries the explorer accepts',()=>{
 const M=require('../modules/ab01/dist/matrix-engine.js');
 assert.equal(M.rank([1e-6,0,0,1e-6]),2,'a tiny invertible matrix is not singular');
 assert.equal(M.rank([0.5,1,1,2]),1);assert.equal(M.rank([0,0,0,0]),0);
 for(const p of M.PRESETS)assert(p.matrix.every(n=>Number.isInteger(n*2)&&Math.abs(n)<=3),p.id);
});

test('the follow-up count stated to learners matches the vector diagnostic',()=>{
 const E=require('../modules/ab01/dist/engine.js');
 assert.equal(E.selectFollowups({}).length,4);
 assert.match(read('modules/ab01/dist/student-materials.js'),/with up to 4 optional follow-ups\./);
});

test('wording corrected after the audit',()=>{
 const benford=read('content/cross-disciplinary/projects.cjs');
 assert(!benford.includes('much more than chance would explain'));assert(!benford.includes('so the test finds no difference'));
 assert(benford.includes('so here χ² describes a distance rather than testing a hypothesis'));
 const intuition=read('intuition/data.js');
 assert.equal((intuition.match(/no three chords meet at one point inside the circle/g)||[]).length,2);
 assert.equal((intuition.match(/en un mismo punto dentro del círculo/g)||[]).length,0,'the Spanish copy is gone');
 const nt=JSON.parse(read('courses/number-theory/data.json'));const text=JSON.stringify(nt);
 assert(text.includes('for b = 1, 2, 3 or 4 the largest is 7b − 5'));assert(text.includes('the swap of any two different symbols'));
});
