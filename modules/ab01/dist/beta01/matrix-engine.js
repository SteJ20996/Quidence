(function(root){
'use strict';
const PRESETS=[
{id:'identity',name:'Identity',matrix:[1,0,0,1],note:'Both basis directions stay in place. Every vector stays unchanged.'},
{id:'stretch',name:'Stretch',matrix:[2,0,0,1],note:'The horizontal direction doubles. The vertical direction stays unchanged.'},
{id:'rotate',name:'Rotate 90°',matrix:[0,-1,1,0],note:'Every vector turns 90° counterclockwise, with its length preserved.'},
{id:'reflect',name:'Reflect',matrix:[-1,0,0,1],note:'The plane reflects across the y-axis. Left and right exchange places.'},
{id:'shear',name:'Shear',matrix:[1,1,0,1],note:'The first basis direction stays put. The second shifts right, tilting the vertical grid lines.'},
{id:'collapse',name:'Collapse',matrix:[1,2,0,0],note:'Both basis images lie on the x-axis. The whole plane collapses onto that line.'}
];
function validMatrix(a){return Array.isArray(a)&&a.length===4&&a.every(n=>Number.isFinite(n)&&Math.abs(n)<=3);}
function validVector(v){return Array.isArray(v)&&v.length===2&&v.every(n=>Number.isFinite(n)&&Math.abs(n)<=3);}
function apply(a,v){if(!validMatrix(a)||!validVector(v))throw new Error('Matrix and input vector must contain finite values from −3 to 3.');return[a[0]*v[0]+a[1]*v[1],a[2]*v[0]+a[3]*v[1]];}
function determinant(a){if(!validMatrix(a))throw new Error('Invalid matrix.');return a[0]*a[3]-a[1]*a[2];}
function blend(a,t){if(!validMatrix(a)||!Number.isFinite(t)||t<0||t>1)throw new Error('Transition must be between 0 and 1.');return[1+t*(a[0]-1),t*a[1],t*a[2],1+t*(a[3]-1)].map(n=>n===0?0:n);}
function rank(a){if(a.every(n=>Math.abs(n)<1e-10))return 0;return Math.abs(determinant(a))<1e-10?1:2;}
function extent(a,v){const corners=[[-3,-3],[-3,3],[3,-3],[3,3]],points=[...corners,...corners.map(p=>apply(a,p)),v,apply(a,v)];return Math.max(4,Math.ceil(Math.max(...points.flat().map(Math.abs))+1));}
const api={PRESETS,validMatrix,validVector,apply,determinant,blend,rank,extent};root.MatrixMath=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
