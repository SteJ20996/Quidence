(function(root){
'use strict';
// Quantitative Reasoning "Test your understanding", second version. Problems qr-c01 to qr-c03 of
// quant-challenge-bank.js are carried over unchanged, with their own version. Problem qr-c04 asks for a Kelly
// share, so it now carries the course's gambling-harm notice; its question, fields and answers are unchanged.
// Once published, a task is never edited in place: a revision needs a new bank version.
const first=typeof module==='object'&&module.exports?require('./quant-challenge-bank.js'):root.QuidenceQuantChallenges;
const VERSION='quantitative-items-2';
const before=first.CHALLENGES.quantitative,published=Object.fromEntries(before.tasks.map(t=>[t.id,t]));
// The same words as the course's notice (assets/quant-content.js); a test keeps the two in step.
const HELP='If gambling, yours or someone else’s, is causing worry, talk to a trusted adult. In the United States, the National Problem Gambling Helpline is free and confidential, 24 hours a day: call or text 1-800-MY-RESET (1-800-697-3738). Elsewhere, look for your country’s gambling helpline.';
const notice='Points here are never money. A casino game, sports bet or lottery has a negative expected value, so for real gambling the Kelly share is zero. '+HELP;
const CHALLENGES={quantitative:{...before,
 tasks:before.tasks.map(t=>t.id==='qr-c04'?{...t,version:VERSION,notice}:published[t.id])
}};
const api={VERSION,CHALLENGES,HELP};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceQuantChallengesV2=api;
})(typeof window==='undefined'?globalThis:window);
