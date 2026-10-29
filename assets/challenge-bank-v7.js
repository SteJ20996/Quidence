(function(root){
'use strict';
const old=typeof module==='object'&&module.exports?require('./challenge-bank-v6.js'):root.QuidenceChallengeBankV6;
const numberTheory=typeof module==='object'&&module.exports?require('./number-theory-challenge-bank.js'):root.QuidenceNumberTheoryChallenges;
const VERSION='quidence-challenges-7';
const MODULES={...old.MODULES,...numberTheory.CHALLENGES};
const api={VERSION,MODULES,HISTORY:{...old.HISTORY,[old.VERSION]:old.MODULES},SOURCE_FILES:[...old.SOURCE_FILES,'assets/challenge-bank-v6.js','assets/number-theory-challenge-bank.js']};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceChallengeBankV7=api;
})(typeof window==='undefined'?globalThis:window);
