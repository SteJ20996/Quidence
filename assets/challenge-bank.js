(function(root){
'use strict';
// Algorithms joins as a new module; every earlier module and saved session keeps its published version.
const old=typeof module==='object'&&module.exports?require('./challenge-bank-v11.js'):root.QuidenceChallengeBankV11;
const algorithms=typeof module==='object'&&module.exports?require('./algorithms-challenge-bank.js'):root.QuidenceAlgorithmsChallenges;
const VERSION='quidence-challenges-12';
const MODULES={...old.MODULES,...algorithms.CHALLENGES};
const api={VERSION,MODULES,HISTORY:{...old.HISTORY,[old.VERSION]:old.MODULES},SOURCE_FILES:[...old.SOURCE_FILES,'assets/challenge-bank-v11.js','assets/algorithms-challenge-bank.js']};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceChallengeBank=api;
})(typeof window==='undefined'?globalThis:window);
