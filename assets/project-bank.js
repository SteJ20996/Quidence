(function(root){
'use strict';
// Basic Logic joined in quidence-projects-7. quidence-projects-8 rewords one Basic Logic rule;
// every earlier module and saved session keeps its published version.
const old=typeof module==='object'&&module.exports?require('./project-bank-v6.js'):root.QuidenceProjectBankV6;
const logic=typeof module==='object'&&module.exports?require('./basic-logic-project-bank.js'):root.QuidenceBasicLogicProjects;
const VERSION='quidence-projects-8';
const MODULES={...old.MODULES,...logic.PROJECTS};
const PREVIOUS={...old.MODULES,...logic.PUBLISHED['basic-logic-projects-1']};
const api={VERSION,MODULES,HISTORY:{...old.HISTORY,[old.VERSION]:old.MODULES,'quidence-projects-7':PREVIOUS},SOURCE_FILES:[...old.SOURCE_FILES,'assets/project-bank-v6.js','assets/basic-logic-project-bank.js']};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceProjectBank=api;
})(typeof window==='undefined'?globalThis:window);
