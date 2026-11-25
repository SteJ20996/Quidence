(function(root){
'use strict';
// Integrated Science gains understanding problems for grades 7 and 8. Its first four problems are carried over
// unchanged; every earlier module and saved session keeps its published version.
const old=typeof module==='object'&&module.exports?require('./challenge-bank-v14.js'):root.QuidenceChallengeBankV14;
const science=typeof module==='object'&&module.exports?require('./science-challenge-bank-v2.js'):root.QuidenceScienceChallengesV2;
const VERSION='quidence-challenges-15';
const MODULES={...old.MODULES,...science.CHALLENGES};
const api={VERSION,MODULES,HISTORY:{...old.HISTORY,[old.VERSION]:old.MODULES},SOURCE_FILES:[...old.SOURCE_FILES,'assets/challenge-bank-v14.js','assets/science-challenge-bank-v2.js']};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceChallengeBankV15=api;
})(typeof window==='undefined'?globalThis:window);
