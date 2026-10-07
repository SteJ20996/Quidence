(function(root){
'use strict';
// New checks use these revisions; existing sessions keep their served version.
const old=typeof module==='object'&&module.exports?require('./project-bank-v1.js'):root.QuidenceProjectBankV1;
const VERSION='quidence-projects-2',MODULES=JSON.parse(JSON.stringify(old.MODULES));
for(const m of Object.values(MODULES)){
 m.groups=['Applied mathematics'];
 for(const t of m.tasks){
  t.groupName='Applied mathematics';t.version=VERSION;
  const precision=s=>s.replace(/Give q to four decimal places/g,'Give q rounded to at least two decimal places').replace(/enter numeric answers to four decimals/gi,'round final numeric answers to at least two decimal places').replace(/give four decimal places/gi,'round final numeric answers to at least two decimal places').replace(/four decimal places/gi,'at least two decimal places');
  t.prompt=precision(t.prompt);
  for(const step of t.steps)step.prompt=precision(step.prompt);
 }
}
const task=MODULES.ab01.tasks.find(t=>t.id==='la-p02');
task.steps[1].prompt='Given mapped point q=(−4,2)ᵀ, recover its preimage and verify it by applying T. Find det(T) and the image triangle’s area. Explain orientation and the use of absolute determinant for area.';
task.fields.find(f=>f.id==='inputX').answer=1;
task.fields.find(f=>f.id==='inputY').answer=4;
task.solution=task.solution.replace('recovering (3,2).','recovering (1,4) from q=(−4,2). Verification: T(1,4)=(−4,2), which is a different image from T(w).');
const api={VERSION,MODULES,HISTORY:{[old.VERSION]:old.MODULES}};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceProjectBankV2=api;
})(typeof window==='undefined'?globalThis:window);
