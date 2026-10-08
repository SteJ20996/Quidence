(function(root){
'use strict';
// Preserve the published mathematics definitions and every earlier session.
const old=typeof module==='object'&&module.exports?require('./challenge-bank-v3.js'):root.QuidenceChallengeBankV3;
const physics=typeof module==='object'&&module.exports?require('./physics-bank.js'):root.QuidencePhysicsBank;
const VERSION='quidence-challenges-4',MODULES={...old.MODULES,physics:physics.CHALLENGES};
const api={VERSION,MODULES,HISTORY:{...old.HISTORY,[old.VERSION]:old.MODULES},SOURCE_FILES:[...old.SOURCE_FILES,'assets/challenge-bank-v3.js','assets/physics-bank.js']};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceChallengeBank=api;
})(typeof window==='undefined'?globalThis:window);
