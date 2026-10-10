'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const Data=require('../assets/knowledge-map-data.js'),Map=require('../assets/knowledge-map.js'),Catalog=require('../assets/course-catalog.js');
test('every map route and region refers to a unique topic in the same chapter',()=>{
 for(const chapter of Data.chapters){
  const ids=new Set(chapter.nodes.map(n=>n.id));assert.equal(ids.size,chapter.nodes.length);
  for(const node of chapter.nodes){assert(Number.isFinite(node.x)&&Number.isFinite(node.y));assert(node.en&&node.es);}
  for(const [a,b]of chapter.links){assert(ids.has(a),a);assert(ids.has(b),b);assert.notEqual(a,b);}
  for(const region of chapter.regions)for(const id of region)assert(ids.has(id),id);
  for(const id of chapter.initial)assert(ids.has(id),id);
 }
});
test('map course starts use the current courses and keep advanced directions exploratory',()=>{
 assert.deepEqual(Data.courses.map(c=>c.module).sort(),Object.keys(Catalog.COURSES).sort());
 for(const course of Data.courses){assert(Data.chapters[course.chapter].nodes.some(n=>n.id===course.node));assert(Map.courseCandidates(course.chapter,[course.node]).includes(course.id));}
 assert.deepEqual(Map.courseCandidates(1,['real']),[]);
 assert.deepEqual(Map.courseCandidates(1,['number']),['number-theory']);
 assert.deepEqual(Map.courseCandidates(1,['mathstats']),[]);
 assert.deepEqual(Map.courseCandidates(2,['nuclear']),[]);
 assert.deepEqual(Map.courseCandidates(0,['algebra1','geometry']),[]);
 assert.deepEqual(Map.courseCandidates(0,['__proto__']),[]);
 assert.deepEqual(Map.courseCandidates(999,['operations']),[]);
 assert.deepEqual(Map.courseCandidates(2,['physics']),['physics1','physics2']);
});
test('continuing upward only crosses to the matching concepts on the next chapter',()=>{
 for(const [index,bridge]of Data.bridges.entries())for(const [from,to]of Object.entries(bridge)){
  assert(Data.chapters[index].nodes.some(n=>n.id===from));assert(Data.chapters[index+1].nodes.some(n=>n.id===to));
 }
 assert.equal(Data.bridges[0].geometry,undefined);assert.equal(Data.bridges[1].real,undefined);
});
