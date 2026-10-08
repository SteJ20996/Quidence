(function(root){
'use strict';
// Preserve the published mathematics definitions and every earlier session.
const old=typeof module==='object'&&module.exports?require('./project-bank-v3.js'):root.QuidenceProjectBankV3;
const physics=typeof module==='object'&&module.exports?require('./physics-bank.js'):root.QuidencePhysicsBank;
const VERSION='quidence-projects-4',MODULES={...old.MODULES,physics:physics.PROJECTS};
// Complete the draft's display-name correction; legacy version-three names stay pinned.
const sectorNames=v=>typeof v==='string'?v.replace(/\bMain\b/g,'Longshore').replace(/\bmain\b/g,'Longshore'):Array.isArray(v)?v.map(sectorNames):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,sectorNames(x)])):v;
MODULES.ae01={...old.MODULES.ae01,tasks:old.MODULES.ae01.tasks.map(t=>t.id==='st-p02'?sectorNames(t):t)};
const api={VERSION,MODULES,HISTORY:{...old.HISTORY,[old.VERSION]:old.MODULES},SOURCE_FILES:[...old.SOURCE_FILES,'assets/project-bank-v3.js','assets/physics-bank.js']};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceProjectBank=api;
})(typeof window==='undefined'?globalThis:window);
