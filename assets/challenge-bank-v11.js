(function(root){
'use strict';
// Probability joins as a new module; every earlier module and saved session keeps its published version.
const old=typeof module==='object'&&module.exports?require('./challenge-bank-v10.js'):root.QuidenceChallengeBankV10;
const probability=typeof module==='object'&&module.exports?require('./probability-challenge-bank.js'):root.QuidenceProbabilityChallenges;
const VERSION='quidence-challenges-11';
const MODULES={...old.MODULES,...probability.CHALLENGES};
const api={VERSION,MODULES,HISTORY:{...old.HISTORY,[old.VERSION]:old.MODULES},SOURCE_FILES:[...old.SOURCE_FILES,'assets/challenge-bank-v10.js','assets/probability-challenge-bank.js']};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceChallengeBankV11=api;
})(typeof window==='undefined'?globalThis:window);
