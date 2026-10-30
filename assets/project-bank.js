(function(root){
'use strict';
// Basic Logic joins as a new module; every earlier module and saved session keeps its published version.
const old=typeof module==='object'&&module.exports?require('./project-bank-v6.js'):root.QuidenceProjectBankV6;
const logic=typeof module==='object'&&module.exports?require('./basic-logic-project-bank.js'):root.QuidenceBasicLogicProjects;
const VERSION='quidence-projects-7';
const MODULES={...old.MODULES,...logic.PROJECTS};
const api={VERSION,MODULES,HISTORY:{...old.HISTORY,[old.VERSION]:old.MODULES},SOURCE_FILES:[...old.SOURCE_FILES,'assets/project-bank-v6.js','assets/basic-logic-project-bank.js']};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceProjectBank=api;
})(typeof window==='undefined'?globalThis:window);
