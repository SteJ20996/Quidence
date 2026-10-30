(function(root){
'use strict';
const old=typeof module==='object'&&module.exports?require('./challenge-bank-v8.js'):root.QuidenceChallengeBankV8;
const discrete=typeof module==='object'&&module.exports?require('./discrete-math-challenge-bank.js'):root.QuidenceDiscreteMathChallenges;
const VERSION='quidence-challenges-9';
const MODULES={...old.MODULES,...discrete.CHALLENGES};
const api={VERSION,MODULES,HISTORY:{...old.HISTORY,[old.VERSION]:old.MODULES},SOURCE_FILES:[...old.SOURCE_FILES,'assets/challenge-bank-v8.js','assets/discrete-math-challenge-bank.js']};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceChallengeBankV9=api;
})(typeof window==='undefined'?globalThis:window);
