(function(root){
'use strict';
const old=typeof module==='object'&&module.exports?require('./project-bank-v5.js'):root.QuidenceProjectBankV5;
const tracks=typeof module==='object'&&module.exports?require('./physics-foundation-bank.js'):root.QuidencePhysicsFoundationBank;
const VERSION='quidence-projects-6';
const MODULES={...old.MODULES,...tracks.PROJECTS};
const api={VERSION,MODULES,HISTORY:{...old.HISTORY,[old.VERSION]:old.MODULES},SOURCE_FILES:[...old.SOURCE_FILES,'assets/project-bank-v5.js','assets/physics-foundation-bank.js']};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceProjectBankV6=api;
})(typeof window==='undefined'?globalThis:window);
