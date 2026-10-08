(function(root){
'use strict';
const old=typeof module==='object'&&module.exports?require('./project-bank-v2.js'):root.QuidenceProjectBankV2;
const VERSION='quidence-projects-3',MODULES=JSON.parse(JSON.stringify(old.MODULES));
function american(v){if(typeof v==='string')return v.replace(/metres/g,'meters').replace(/metre/g,'meter').replace(/litres/g,'liters').replace(/litre/g,'liter');if(Array.isArray(v))return v.map(american);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,american(x)]));return v;}
for(const[id,m]of Object.entries(MODULES)){MODULES[id]=american(m);for(const t of MODULES[id].tasks)t.version=VERSION;}
const design=MODULES['algebra-1'].tasks.find(t=>t.id==='a1-p02');
design.prompt='A fictional community court has 30 m of temporary railing for three sides of a rectangle; an existing straight wall forms the fourth side. The two equal side depths are x meters and the long side is L. A usable layout must have L at least three times x. The group wants area at least 100 m². Treat lengths as continuously adjustable and ignore railing thickness.';
design.steps[1].prompt='Solve A(x)=100. Give the smaller and larger solutions, then give the largest x allowed by L≥3x.';
for(const[id,value]of Object.entries({root1:5,root2:10,constraint:6,low:5,high:6,maximum:108}))design.fields.find(f=>f.id===id).answer=value;
design.fields.find(f=>f.id==='constraint').label='Largest x allowed by L≥3x (m)';
design.fields.find(f=>f.id==='designReason').reviewCriteria[1]='Use L≥3x to remove the inadmissible portion.';
design.solution='L=30−2x and A=30x−2x². A=100 gives x²−15x+50=0, with roots 5 and 10. A≥100 holds on [5,10]. The shape condition 30−2x≥3x gives x≤6; with positive lengths the feasible range is [5,6]. The unconstrained vertex x=7.5 is inadmissible because L=15<3×7.5. Area increases on the entire feasible interval, so the constrained maximum is 108 m² at x=6, L=18. Designs x=5, L=20, A=100 and x=5.5, L=19, A=104.5 also qualify; many justified proposals are valid.';
const riders=MODULES.ae01.tasks.find(t=>t.id==='st-p01');
riders.steps[2].title='3 · Assess the claim and its limits';
riders.steps[2].prompt='Assess the claim that routine B reduces mean time: mean d=A−B is positive. Use the confidence interval from Step 2. Count positive observed differences to describe individual riders, not as a separate significance test. State a design assumption or population limit you would investigate before a wider claim.';
const coast=MODULES.ae01.tasks.find(t=>t.id==='st-p02');
function sectors(v){if(typeof v==='string')return v.replace(/Main Beach/g,'Longshore sector').replace(/Pocket Beach/g,'Cove sector').replace(/\bPocket\b/g,'Cove').replace(/\bpocket\b/g,'cove');if(Array.isArray(v))return v.map(sectors);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,sectors(x)]));return v;}
MODULES.ae01.tasks[MODULES.ae01.tasks.indexOf(coast)]=sectors(coast);
const api={VERSION,MODULES,HISTORY:{...old.HISTORY,[old.VERSION]:old.MODULES},SOURCE_FILES:['assets/project-bank.js','assets/project-bank-v1.js','assets/project-bank-v2.js']};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceProjectBankV3=api;
})(typeof window==='undefined'?globalThis:window);
