const assert=require('node:assert/strict'),M=require('../dist/matrix-engine.js');
assert.deepEqual(M.apply([1,0,0,1],[1,2]),[1,2]);
assert.deepEqual(M.apply([2,0,0,1],[1,2]),[2,2]);
assert.deepEqual(M.apply([0,-1,1,0],[1,2]),[-2,1],'Rotation is counterclockwise');
assert.deepEqual(M.apply([-1,0,0,1],[1,2]),[-1,2]);
assert.deepEqual(M.apply([1,1,0,1],[1,2]),[3,2]);
assert.deepEqual(M.apply([1,2,0,0],[1,2]),[5,0]);
assert.equal(M.rank([1,2,0,0]),1);assert.equal(M.rank([0,0,0,0]),0);
assert.equal(M.determinant([-1,0,0,1]),-1);assert.equal(M.determinant([2,0,0,1]),2);
for(const p of M.PRESETS){assert.deepEqual(M.apply(p.matrix,[1,0]),[p.matrix[0],p.matrix[2]]);assert.deepEqual(M.apply(p.matrix,[0,1]),[p.matrix[1],p.matrix[3]]);assert.deepEqual(M.blend(p.matrix,0),[1,0,0,1]);assert.deepEqual(M.blend(p.matrix,1),p.matrix);const u=[1,2],v=[-1,.5],sum=u.map((n,i)=>n+v[i]);const outputSum=M.apply(p.matrix,u).map((n,i)=>n+M.apply(p.matrix,v)[i]);assert.deepEqual(M.apply(p.matrix,sum),outputSum);const ext=M.extent(p.matrix,u);for(const corner of [[-3,-3],[-3,3],[3,-3],[3,3]])assert(M.apply(p.matrix,corner).every(n=>Math.abs(n)<ext));}
assert.deepEqual(M.blend([-1,0,0,1],.5),[0,0,0,1],'Straight reflection blend has a singular intermediate map');
assert.throws(()=>M.apply([1,0,0,NaN],[1,2]));assert.throws(()=>M.apply([1,0,0,1],[4,2]));assert.throws(()=>M.blend([1,0,0,1],2));
console.log('PASS: matrix columns, preset outputs, linearity, orientation, singular maps, interpolation, viewport bounds and invalid inputs.');
