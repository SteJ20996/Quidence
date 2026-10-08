(function(root){
'use strict';
const old=typeof module==='object'&&module.exports?require('./project-bank-v4.js'):root.QuidenceProjectBankV4;
const tracks=typeof module==='object'&&module.exports?require('./physics-foundation-bank.js'):root.QuidencePhysicsFoundationBank;
const VERSION='quidence-projects-5';
const MODULES={...old.MODULES,...tracks.PROJECTS};
const api={VERSION,MODULES,HISTORY:{...old.HISTORY,[old.VERSION]:old.MODULES},SOURCE_FILES:[...old.SOURCE_FILES,'assets/project-bank-v4.js','assets/physics-foundation-bank.js']};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceProjectBank=api;
})(typeof window==='undefined'?globalThis:window);
