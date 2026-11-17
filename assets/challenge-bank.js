(function(root){
'use strict';
// Quantitative Reasoning joins as a new module; every earlier module and saved session keeps its published version.
const old=typeof module==='object'&&module.exports?require('./challenge-bank-v13.js'):root.QuidenceChallengeBankV13;
const quant=typeof module==='object'&&module.exports?require('./quant-challenge-bank.js'):root.QuidenceQuantChallenges;
const VERSION='quidence-challenges-14';
const MODULES={...old.MODULES,...quant.CHALLENGES};
const api={VERSION,MODULES,HISTORY:{...old.HISTORY,[old.VERSION]:old.MODULES},SOURCE_FILES:[...old.SOURCE_FILES,'assets/challenge-bank-v13.js','assets/quant-challenge-bank.js']};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceChallengeBank=api;
})(typeof window==='undefined'?globalThis:window);
