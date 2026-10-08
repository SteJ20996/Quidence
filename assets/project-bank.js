(function(root){
'use strict';
// Preserve the published mathematics definitions and every earlier session.
const old=typeof module==='object'&&module.exports?require('./project-bank-v3.js'):root.QuidenceProjectBankV3;
const physics=typeof module==='object'&&module.exports?require('./physics-bank.js'):root.QuidencePhysicsBank;
const VERSION='quidence-projects-4',MODULES={...old.MODULES,physics:physics.PROJECTS};
const api={VERSION,MODULES,HISTORY:{...old.HISTORY,[old.VERSION]:old.MODULES},SOURCE_FILES:[...old.SOURCE_FILES,'assets/project-bank-v3.js','assets/physics-bank.js']};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceProjectBank=api;
})(typeof window==='undefined'?globalThis:window);
