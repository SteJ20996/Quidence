'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const SEO=require('../assets/seo-config.js'),release=require('../scripts/build-static-release.cjs'),{buildSEO}=require('../scripts/build-seo.cjs');
const root=path.resolve(__dirname,'..');
test('canonical URLs keep subjects and languages but drop tracking, versions and fragments',()=>{
  for(const lang of ['en','es']){
    const p=SEO.resolve('http://example.test/diagnostics/index.html?module=ab01&v=old&utm_source=mail&lang='+lang+'#question');
    assert.equal(p.canonical,'https://www.quidence.com/diagnostics/?module=ab01&lang='+lang);
    assert.equal(p.noindex,false);assert.match(p.title,lang==='es'?/Álgebra lineal/:/Linear Algebra/);
    assert.notEqual(p.canonical,SEO.resolve('/diagnostics/?module=ad01&lang='+lang).canonical);
    assert.equal(SEO.resolve('/courses/number-theory?lang='+lang).canonical,SEO.resolve('/courses/number-theory/index.html?lang='+lang).canonical);
  }
  for(const route of ['/diagnostics/?module=ac01','/diagnostics/?module=number-theory','/projects/?module=../../reports/'])assert(SEO.resolve(route).noindex);
  assert(!SEO.resolve('/foundations/?module=aa01').noindex);assert(!SEO.resolve('/foundations/?module=ac01').noindex);assert.equal(SEO.resolve('/unpublished/'),null);
});
test('all active courses have unique bilingual metadata and reciprocal alternatives',()=>{
  const courses=require('../assets/course-catalog.js').COURSES;
  assert.deepEqual(Object.keys(SEO.COURSES).sort(),Object.keys(courses).sort());
  const titles=new Set();
  for(const [id,c]of Object.entries(courses))for(const language of ['en','es']){
    const p=SEO.resolve('/'+c.course+'?lang='+language);
    assert.equal(p.pathname,SEO.COURSES[id][0]);assert(p.sitemap);assert(!p.noindex);
    assert(!titles.has(p.title));titles.add(p.title);assert(p.description.length>45);
    for(const [hreflang,href]of p.alternates){const q=SEO.resolve(href);assert.deepEqual(q.alternates,p.alternates);assert.equal(q.locale,hreflang==='en'?'en':'es');}
    assert(p.alternates.some(([l])=>l==='es-MX'));
  }
});
test('sitemap includes canonical public entries and excludes workspaces and version parameters',()=>{
  const xml=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
  const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1].replaceAll('&amp;','&'));
  assert.equal(urls.length,28);assert.equal(new Set(urls).size,urls.length);
  for(const url of urls){const p=SEO.resolve(url);assert.equal(p.canonical,url);assert(p.sitemap);assert(!p.noindex);assert(!new URL(url).searchParams.has('v'));}
  assert.doesNotMatch(xml,/\/reports\/|\/records\/|\/account\/|\/archive\/|\/qidolab\//);
  const robots=fs.readFileSync(path.join(root,'robots.txt'),'utf8');assert.match(robots,/Sitemap: https:\/\/www\.quidence\.com\/sitemap\.xml/);
  assert.doesNotMatch(robots,/Disallow: \/(?:reports|records|account|assets)\//);
});
test('private noindex survives without JavaScript and valid activities have no initial blocking rule',()=>{
  for(const route of ['account','records','reports']){
    const html=fs.readFileSync(path.join(root,route,'index.html'),'utf8');assert.match(html,/<meta name="robots" content="noindex, follow">/);assert(SEO.resolve('/'+route+'/').noindex);
  }
  for(const route of ['foundations','diagnostics','projects'])assert.doesNotMatch(fs.readFileSync(path.join(root,route,'index.html'),'utf8'),/<meta[^>]+name="robots"[^>]+noindex/);
  for(const file of release.files().filter(f=>f.endsWith('.html'))){
    const html=fs.readFileSync(path.join(root,file),'utf8');
    assert.equal([...html.matchAll(/src="[^"]*\/seo\.js\?/g)].length,1,file);assert.equal([...html.matchAll(/src="[^"]*\/seo-config\.js\?/g)].length,1,file);
    assert.doesNotMatch(html,/<link[^>]+rel="canonical"/,file+' must not hard-code English for both language URLs');
  }
  assert.equal(buildSEO(true).changed,0);
});
test('release includes SEO files and noindex headers, without exposing backend or student exports',t=>{
  const parent=fs.mkdtempSync(path.join(os.tmpdir(),'quidence-seo-'));t.after(()=>fs.rmSync(parent,{recursive:true,force:true}));
  const output=path.join(parent,'public');
  require('node:child_process').execFileSync(process.execPath,[path.join(root,'scripts/build-static-release.cjs'),output],{cwd:root});
  for(const name of ['robots.txt','sitemap.xml','assets/seo.js','assets/seo-config.js'])assert.equal(fs.readFileSync(path.join(output,name),'utf8'),fs.readFileSync(path.join(root,name),'utf8'));
  assert(!fs.existsSync(path.join(output,'backend')));assert(!fs.existsSync(path.join(output,'review')));
  assert.match(fs.readFileSync(path.join(output,'_headers'),'utf8'),/\/reports\/\*\n  X-Robots-Tag: noindex, follow/);
});
test('local server serves sitemap and robots with correct types and keeps source files unavailable',async t=>{
  const server=require('../backend/server.cjs').createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));
  const base='http://127.0.0.1:'+server.address().port;
  for(const [file,type]of [['robots.txt','text/plain'],['sitemap.xml','application/xml']])for(const method of ['GET','HEAD']){
    const response=await fetch(base+'/'+file,{method});assert.equal(response.status,200);assert(response.headers.get('content-type').startsWith(type));if(method==='GET')assert.equal(await response.text(),fs.readFileSync(path.join(root,file),'utf8'));
  }
  for(const route of ['/README.md','/review/source-ledger.json','/content/number-theory/source-v2.md'])assert.equal((await fetch(base+route)).status,404);
});
test('metadata follows successful language changes without changing navigation, student storage or body',()=>{
  const vm=require('node:vm'),children=[],listeners=new Map();
  function node(tag){return{tag,attributes:{},textContent:'',parentNode:null,getAttribute(name){return this.attributes[name]??null;},setAttribute(name,value){this.attributes[name]=value;},remove(){children.splice(children.indexOf(this),1);this.parentNode=null;}};}
  const head={appendChild(n){children.push(n);n.parentNode=head;},querySelectorAll(selector){
    const tag=selector.match(/^\w+/)[0],conditions=[...selector.matchAll(/\[([^=\]]+)(?:="([^"]*)")?\]/g)];
    return children.filter(n=>n.tag===tag&&conditions.every(([,key,value])=>value===undefined?n.getAttribute(key)!==null:n.getAttribute(key)===value));
  }};
  const title=node('title');title.textContent='Old title';head.appendChild(title);
  for(let i=0;i<2;i++){const duplicate=node('link');duplicate.setAttribute('rel','canonical');duplicate.setAttribute('href','https://old.example/');head.appendChild(duplicate);}
  const document={head,readyState:'loading',createElement:node,addEventListener(name,fn){listeners.set(name,fn);}};
  Object.defineProperty(document,'body',{get(){throw Error('Student workspace must not be inspected');}});
  const location=Object.freeze({href:'http://preview.test/courses/number-theory/?lang=en&v=old'});
  const window={document,location,QuidenceSEOConfig:SEO,QuidenceI18n:{locale:'en'},fetch(){throw Error('SEO must not send requests');}};
  Object.defineProperty(window,'localStorage',{get(){throw Error('SEO must not inspect or write student records');}});
  vm.runInNewContext(fs.readFileSync(path.join(root,'assets/seo.js'),'utf8'),{window});listeners.get('DOMContentLoaded')();
  assert.equal(head.querySelectorAll('link[rel="canonical"]').length,1);
  assert.equal(title.textContent,'Number Theory · Quidence');
  for(const locale of ['es','en','es'])listeners.get('quidence:language')({detail:{locale}});
  assert.equal(title.textContent,'Teoría de números · Quidence');
  assert.equal(head.querySelectorAll('link[rel="canonical"]')[0].getAttribute('href'),'https://www.quidence.com/courses/number-theory/?lang=es');
  assert.equal(head.querySelectorAll('meta[name="robots"]')[0].getAttribute('content'),'index, follow');
  assert.equal(head.querySelectorAll('link[rel="alternate"][hreflang]').length,3);
  assert.equal(head.querySelectorAll('meta[property="og:locale"]')[0].getAttribute('content'),'es_MX');
  assert.equal(location.href,'http://preview.test/courses/number-theory/?lang=en&v=old');
});
