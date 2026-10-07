const assert=require('node:assert/strict');
const M=require('../dist/matrix-methods.js');
const expected=[[3,2],[2,1,1],[-1,5]];
for(const [i,e] of M.EXAMPLES.entries()){
 const original=JSON.stringify(e);
 assert.deepEqual(M.multiply(e.a,e.v),expected[i]);
 const byColumns=e.v.reduce((out,n,j)=>out.map((sum,k)=>sum+n*e.a[k][j]),e.a.map(()=>0));
 assert.deepEqual(M.multiply(e.a,e.v),byColumns);
 assert.equal(JSON.stringify(e),original);
}
assert.deepEqual(M.multiply([[2,-1],[0,3]],[-2,0.5]),[-4.5,1.5]);
assert.deepEqual(M.multiply([[0,0,0]],[1,-1,2]),[0]);
for(const [a,v] of [[[],[1]],[[[1,2]],[1]],[[[1],[2,3]],[1]],[[[NaN]],[1]],[[[1]],[Infinity]]])assert.throws(()=>M.multiply(a,v));
console.log('PASS: rectangular matrix dimensions, signed products, row/column agreement and unchanged teaching examples.');
