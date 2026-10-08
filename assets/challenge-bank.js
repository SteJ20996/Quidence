(function(root){
'use strict';
const old=typeof module==='object'&&module.exports?require('./challenge-bank-v4.js'):root.QuidenceChallengeBankV4;
const tracks=typeof module==='object'&&module.exports?require('./physics-foundation-bank.js'):root.QuidencePhysicsFoundationBank;
const VERSION='quidence-challenges-5';
const MODULES={...old.MODULES,...tracks.CHALLENGES};
const api={VERSION,MODULES,HISTORY:{...old.HISTORY,[old.VERSION]:old.MODULES},SOURCE_FILES:[...old.SOURCE_FILES,'assets/challenge-bank-v4.js','assets/physics-foundation-bank.js']};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceChallengeBank=api;
})(typeof window==='undefined'?globalThis:window);
