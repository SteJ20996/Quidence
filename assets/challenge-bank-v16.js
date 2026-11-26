(function(root){
'use strict';
// Integrated Science covers all 24 lessons in two parts, each with its own report. Its eight earlier problems are
// carried over unchanged; every earlier module and saved session keeps its published version.
const old=typeof module==='object'&&module.exports?require('./challenge-bank-v15.js'):root.QuidenceChallengeBankV15;
const science=typeof module==='object'&&module.exports?require('./science-challenge-bank-v3.js'):root.QuidenceScienceChallengesV3;
const VERSION='quidence-challenges-16';
const MODULES={...old.MODULES,...science.CHALLENGES};
const api={VERSION,MODULES,HISTORY:{...old.HISTORY,[old.VERSION]:old.MODULES},SOURCE_FILES:[...old.SOURCE_FILES,'assets/challenge-bank-v15.js','assets/science-challenge-bank-v3.js']};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceChallengeBankV16=api;
})(typeof window==='undefined'?globalThis:window);
