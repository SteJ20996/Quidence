(function(root){
'use strict';
// Quantitative Reasoning's Kelly problem (qr-c04) now carries the course's gambling-harm notice. Its other problems
// are carried over unchanged; every earlier module and saved session keeps its published version.
const old=typeof module==='object'&&module.exports?require('./challenge-bank-v16.js'):root.QuidenceChallengeBankV16;
const quant=typeof module==='object'&&module.exports?require('./quant-challenge-bank-v2.js'):root.QuidenceQuantChallengesV2;
const VERSION='quidence-challenges-17';
const MODULES={...old.MODULES,...quant.CHALLENGES};
const api={VERSION,MODULES,HISTORY:{...old.HISTORY,[old.VERSION]:old.MODULES},SOURCE_FILES:[...old.SOURCE_FILES,'assets/challenge-bank-v16.js','assets/quant-challenge-bank-v2.js']};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceChallengeBank=api;
})(typeof window==='undefined'?globalThis:window);
