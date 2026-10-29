(function(root){
'use strict';
const old=typeof module==='object'&&module.exports?require('./challenge-bank-v7.js'):root.QuidenceChallengeBankV7;
const coordinate=typeof module==='object'&&module.exports?require('./coordinate-geometry-challenge-bank.js'):root.QuidenceCoordinateGeometryChallenges;
const VERSION='quidence-challenges-8';
const MODULES={...old.MODULES,...coordinate.CHALLENGES};
const api={VERSION,MODULES,HISTORY:{...old.HISTORY,[old.VERSION]:old.MODULES},SOURCE_FILES:[...old.SOURCE_FILES,'assets/challenge-bank-v7.js','assets/coordinate-geometry-challenge-bank.js']};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceChallengeBank=api;
})(typeof window==='undefined'?globalThis:window);
