(function(root){
'use strict';
// Keep previously served definitions available for exact history restoration.
const old=typeof module==='object'&&module.exports?require('./challenge-bank-v1.js'):root.QuidenceChallengeBankV1;
const VERSION='quidence-challenges-2',MODULES=JSON.parse(JSON.stringify(old.MODULES));
const tasks=MODULES.ab01.tasks;
const area=tasks.find(t=>t.id==='la-c08');
area.referenceVisual=JSON.parse(JSON.stringify(area.visual));
area.visual.polygons=area.visual.polygons.filter(p=>p.style==='original');
area.visual.xmax=4;area.visual.ymax=4;
area.visual.description='The original triangle OUV is shown with equal coordinate units. Its image is withheld until the report; calculate the area factor from the map.';
area.version=VERSION;
const rank=tasks.find(t=>t.id==='la-c11');
rank.prompt='For Aₖ = [[1,2,1],[0,k−1,2],[0,0,k−1]], select every real k making Aₖ singular. At k = 1 give the rank, nullity, and whether A₁x = (0,0,1)ᵀ is consistent.';
rank.fields.find(f=>f.id==='singular').answer=['one'];
rank.solution='The determinant is (k−1)², so only k = 1 is singular. At k = 1 the rows are (1,2,1), (0,0,2), (0,0,0). The two nonzero rows are independent: rank 2, nullity 1. There is only one nonzero diagonal entry, so counting diagonal entries would give the wrong rank. The last equation is 0 = 1 for the stated target, so the system is inconsistent.';
rank.version=VERSION;
const maximum=MODULES.ad01.tasks.find(t=>t.id==='ca-c02');
maximum.prompt='On 0 ≤ x ≤ 4, let f(x) = x²e^(−x). Give the x-location and numerical value of its global maximum. Give c such that f′(3) = c e^(−3).';
const maximumValue=maximum.fields.find(f=>f.id==='m');
maximumValue.label='Global maximum value';maximumValue.answer=4*Math.exp(-2);
maximum.version=VERSION;
const angles=MODULES.af01.tasks.find(t=>t.id==='pc-c02');
angles.prompt='Solve 2 sin²θ − sinθ − 1 = 0 on 0 ≤ θ < 2π. Select all solutions.';
angles.version=VERSION;
const api={VERSION,MODULES,HISTORY:{[old.VERSION]:old.MODULES}};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceChallengeBankV2=api;
})(typeof window==='undefined'?globalThis:window);
