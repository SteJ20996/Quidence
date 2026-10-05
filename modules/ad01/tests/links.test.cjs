'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
test('dashboard and AD01 links resolve locally without a cloud dependency',()=>{
 const root=path.resolve(__dirname,'../../..'),hub=fs.readFileSync(path.join(root,'index.html'),'utf8');
 const links=Array.from(hub.matchAll(/class="subject-link" href="([^"]+)"/g),m=>m[1]);assert.deepEqual(links,['modules/aa01/dist/','modules/ab01/dist/','modules/ac01/dist/','modules/ad01/dist/']);
 links.forEach(l=>assert.ok(fs.existsSync(path.join(root,l,'index.html'))));
 const dir=path.join(__dirname,'../dist'),entry=fs.readFileSync(path.join(dir,'index.html'),'utf8');
 for(const m of entry.matchAll(/(?:href|src)="([^"]+)"/g)){if(m[1]==='./')continue;assert.ok(fs.existsSync(path.resolve(dir,m[1].split(/[?#]/)[0])),m[1]);}
 assert.doesNotMatch(entry,/https?:\/\//);
});
