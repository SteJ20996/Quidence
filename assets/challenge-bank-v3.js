(function(root){
'use strict';
// Preserve every published revision, including checks started from a review branch.
const old=typeof module==='object'&&module.exports?require('./challenge-bank-v2.js'):root.QuidenceChallengeBankV2;
const VERSION='quidence-challenges-3',MODULES=JSON.parse(JSON.stringify(old.MODULES));
const algebra=MODULES['algebra-1'].tasks.find(t=>t.id==='a1-c01');
algebra.prompt='For 3x + ky = 11 and 6x + 8y = k + 18, find the real k giving infinitely many solutions. For k = 2 give the unique solution. At the exceptional k, change only the second right-hand side to 23. Does the changed system have one solution, no solution, or infinitely many?';
algebra.fields.find(f=>f.id==='k').answer=4;
algebra.fields.find(f=>f.id==='x').answer=4;
algebra.fields.find(f=>f.id==='y').answer=-0.5;
algebra.solution='Subtract twice the first equation: (8−2k)y=k−4. At k=4 this becomes 0=0 and both equations describe 3x+4y=11, giving infinitely many solutions. At k=2, 4y=−2, so y=−1/2 and x=4. Substitution gives 3×4+2×(−1/2)=11 and 6×4+8×(−1/2)=20. At k=4 with second right-hand side 23, elimination gives 0=1, so there is no solution.';
algebra.version=VERSION;
const geometry=MODULES.geometry.tasks.find(t=>t.id==='ge-c01');
geometry.referenceVisual=JSON.parse(JSON.stringify(geometry.visual));
delete geometry.visual.segment;
geometry.visual.points=geometry.visual.points.filter(p=>['A','B','C'].includes(p[2]));
geometry.visual.description='Triangle ABC is shown with equal coordinate units. D, E and DE are withheld; calculate the midpoint coordinates and justify the direction relationship.';
geometry.version=VERSION;
const api={VERSION,MODULES,HISTORY:{...old.HISTORY,[old.VERSION]:old.MODULES},SOURCE_FILES:['assets/challenge-bank.js','assets/challenge-bank-v1.js','assets/challenge-bank-v2.js']};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceChallengeBankV3=api;
})(typeof window==='undefined'?globalThis:window);
