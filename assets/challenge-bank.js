(function(root){
'use strict';
// Integrated Science 6–10 joins as a new module; every earlier module and saved session keeps its published version.
const old=typeof module==='object'&&module.exports?require('./challenge-bank-v12.js'):root.QuidenceChallengeBankV12;
const science=typeof module==='object'&&module.exports?require('./science-challenge-bank.js'):root.QuidenceScienceChallenges;
const VERSION='quidence-challenges-13';
const MODULES={...old.MODULES,...science.CHALLENGES};
const api={VERSION,MODULES,HISTORY:{...old.HISTORY,[old.VERSION]:old.MODULES},SOURCE_FILES:[...old.SOURCE_FILES,'assets/challenge-bank-v12.js','assets/science-challenge-bank.js']};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceChallengeBank=api;
})(typeof window==='undefined'?globalThis:window);
