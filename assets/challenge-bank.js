(function(root){
'use strict';
const old=typeof module==='object'&&module.exports?require('./challenge-bank-v9.js'):root.QuidenceChallengeBankV9;
const logic=typeof module==='object'&&module.exports?require('./basic-logic-challenge-bank.js'):root.QuidenceBasicLogicChallenges;
const VERSION='quidence-challenges-10';
const MODULES={...old.MODULES,...logic.CHALLENGES};
const api={VERSION,MODULES,HISTORY:{...old.HISTORY,[old.VERSION]:old.MODULES},SOURCE_FILES:[...old.SOURCE_FILES,'assets/challenge-bank-v9.js','assets/basic-logic-challenge-bank.js']};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceChallengeBank=api;
})(typeof window==='undefined'?globalThis:window);
