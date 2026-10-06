'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{createHash}=require('node:crypto');
const {createServer}=require('../backend/server.cjs'),{CONTENT_SECURITY_POLICY}=require('../backend/security.cjs'),Tools=require('../assets/report-tools.js');
const root=path.resolve(__dirname,'..');
test('server sends restrictive script CSP on HTML, assets and API; exposes only the public data-use page',async t=>{
 const server=createServer({dataPath:':memory:'});await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));const base='http://127.0.0.1:'+server.address().port;
 for(const route of ['/','/data-use/','/assets/foundation-start.js','/api/me']){
  const response=await fetch(base+route);assert.equal(response.status,200);assert.equal(response.headers.get('content-security-policy'),CONTENT_SECURITY_POLICY);await response.text();
 }
 assert.equal((await fetch(base+'/PRIVACY_AND_RETENTION_DRAFT.md')).status,404);
 const scriptPolicy=CONTENT_SECURITY_POLICY.split(';').find(s=>s.trim().startsWith('script-src '));
 assert.doesNotMatch(scriptPolicy,/unsafe-inline|unsafe-eval/);assert.match(CONTENT_SECURITY_POLICY,/script-src-attr 'none'/);
 assert(scriptPolicy.includes("'sha256-"+createHash('sha256').update(Tools.PRINT_SCRIPT).digest('base64')+"'"));
});
test('served HTML has no inline script or inline event handler blocked by the CSP',()=>{
 function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
 const files=['index.html',...['account','data-use','courses','diagnostics','foundations','projects','reports','modules'].flatMap(p=>walk(path.join(root,p)).filter(x=>x.endsWith('.html')).map(x=>path.relative(root,x)))];
 for(const file of files){const text=fs.readFileSync(path.join(root,file),'utf8');for(const tag of text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){assert.match(tag[1],/\bsrc=/,file);assert.equal(tag[2].trim(),'',file);}assert.doesNotMatch(text,/\bon(?:click|load|error|input|change|submit)\s*=/i,file);}
});
test('extracted startup scripts still select the subject and mount report and foundation views',()=>{
 const nodes={'project-start':{},'saved-reports':{},'quidence-foundations':{}},listeners=[];let reportHost,foundationHost,selected;
 const context={document:{addEventListener:(event,fn)=>{assert.equal(event,'DOMContentLoaded');listeners.push(fn);},getElementById:id=>nodes[id]},location:{search:'?module=ab01'},URLSearchParams,QuidenceChallengeBank:{MODULES:{ab01:{}}},QuidenceReportViewer:{mount:h=>reportHost=h},QuidenceFoundationApp:{mount:(h,o)=>{foundationHost=h;selected=o.module;}}};
 vm.createContext(context);for(const file of ['diagnostic-start.js','report-start.js','foundation-start.js'])vm.runInContext(fs.readFileSync(path.join(root,'assets',file),'utf8'),context);
 listeners.forEach(fn=>fn());assert.equal(nodes['project-start'].href,'../projects/?module=ab01');assert.equal(reportHost,nodes['saved-reports']);assert.equal(foundationHost,nodes['quidence-foundations']);assert.equal(selected,'ab01');
});
test('standalone downloaded and detached reports bind a manual print click and escape supplied text',()=>{
 const html=Tools.printable('Test',{markdown:'> <script>window.evil()</script>\n\n> <img src=x onerror=evil()>'});
 const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];assert.equal(scripts.length,1);assert.equal(scripts[0][1],Tools.PRINT_SCRIPT);assert.doesNotMatch(html,/onclick=/);
 let clicks=0,handler;vm.runInNewContext(scripts[0][1],{document:{querySelector:s=>{assert.equal(s,'[data-print-report]');return{addEventListener:(type,fn)=>{assert.equal(type,'click');handler=fn;}};}},window:{print:()=>clicks++}});
 assert.equal(clicks,0);handler();assert.equal(clicks,1);assert.match(html,/&lt;script&gt;/);
});
