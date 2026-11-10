'use strict';
// Quidence is published in English only (AGENTS.md). These checks cover the shared display layer, every
// published page and the build, and they confirm that saved preferences and learner work stay as they were.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
function runtime(){const context=vm.createContext({});vm.runInContext(fs.readFileSync(path.join(root,'assets/i18n.js'),'utf8'),context);return context.QuidenceI18n;}
// Published files: everything the static release copies, without reviews, archives or tests.
function published(){const out=[];const skip=/^(?:\.git|node_modules|static-release|review|archive|tests|scripts|backend|docs|content|demos\/[^/]+\/tests|modules\/[^/]+\/tests)(?:\/|$)/;
 (function walk(dir){for(const entry of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const rel=dir?dir+'/'+entry.name:entry.name;if(skip.test(rel))continue;if(entry.isDirectory())walk(rel);else if(/\.(?:html|js|mjs|json|css|svg|xml)$/.test(entry.name))out.push(rel);}})('');return out;}

test('the shared display layer is English only and changes neither text nor saved preferences',async()=>{
 const api=runtime();assert.equal(api.locale,'en');
 for(const request of ['es','es-MX','zh-TW','en'])assert.equal(await api.setLocale(request),'en');
 for(const source of ['Question 4 of 12','At u=f the model has no finite image distance; for u<f a virtual image needs another reading.','Original words: 中文 / Español / −3/4','   '])assert.equal(api.text(source),source);
 const report='# Saved reports\n\n> Save my answer\n> Your explanation\n\n```json\n{"note":"Save my answer","answer":"−3/4"}\n```';assert.equal(api.markdown(report),report);
 assert.deepEqual([...api.missing],[]);
 // Dates show an explicit English month and never change the saved value.
 const stamp='2026-10-09T12:30:00Z';assert.match(api.date(stamp),/Oct/);assert.doesNotMatch(api.date(stamp),/oct\b|10\/9\/2026/);assert.equal(stamp,'2026-10-09T12:30:00Z');
});

test('no published page offers a language choice, a Spanish catalogue or a Spanish address',()=>{
 const files=published();assert.ok(files.length>200,String(files.length));
 for(const file of files){const s=fs.readFileSync(path.join(root,file),'utf8');
  assert.doesNotMatch(s,/i18n-es|QuidenceSpanish|data-es-catalog|data-language-host|data-es=|hreflang|Español|quidence:language/,file);
  assert.doesNotMatch(s,/(?:lang|locale|language)\s*===?\s*['"]es['"]\s*\?/,file+' switches on Spanish');
  assert.doesNotMatch(s,/[?&]lang=es\b|searchParams\.set\(\s*['"]lang['"]/,file+' writes a language into an address');
  assert.doesNotMatch(s,/English and Spanish|English or Spanish|in Spanish/,file);
 }
 for(const gone of ['assets/i18n-es.js','assets/i18n-es','localization','assets/illustrations/algorithms-es.svg'])assert.equal(fs.existsSync(path.join(root,gone)),false,gone);
 assert.deepEqual(fs.readdirSync(path.join(root,'assets/illustrations')).filter(f=>/-es\.svg$/.test(f)),[]);
});

test('published text carries no Spanish punctuation, and the sitemap lists each page once',()=>{
 for(const file of published()){if(/\.(?:svg|css)$/.test(file))continue;const s=fs.readFileSync(path.join(root,file),'utf8');assert.doesNotMatch(s,/[¿¡]/,file);}
 const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8'),locs=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 assert.ok(locs.length>=20);assert.equal(new Set(locs).size,locs.length);assert.ok(locs.every(u=>!/[?&]lang=/.test(u)));assert.doesNotMatch(sitemap,/xhtml:link|hreflang/);
});

test('records saved while Spanish was offered remain valid and are not rewritten',()=>{
 // Each course still accepts its earlier language field so that old work opens unchanged in English.
 assert.match(fs.readFileSync(path.join(root,'courses/coordinate-geometry/core.mjs'),'utf8'),/\['en','zh-TW','es'\]\.includes\(raw\.lang\)/);
 assert.match(fs.readFileSync(path.join(root,'modules/ac01/dist/projects/core.js'),'utf8'),/\['en','es'\]\.includes\(s\.locale\)/);
 assert.match(fs.readFileSync(path.join(root,'courses/algorithms/app.js'),'utf8'),/x\.es===undefined\|\|isStr\(x\.es\)/);
 // No page removes or replaces the saved site language.
 for(const file of published()){if(!/\.(?:m?js|html)$/.test(file))continue;const s=fs.readFileSync(path.join(root,file),'utf8');
  assert.doesNotMatch(s,/(?:setItem|removeItem)\(\s*['"]quidence_ui_locale_v1['"]/,file);}
});
test('ambiguous numeric punctuation requires a UI decision while historical grading remains stable',()=>{const E=require('../assets/foundation-engine.js'),t={fields:[{id:'n',kind:'number',label:'Value'}]},a={values:{n:''},unsure:false,notStudied:false};for(const value of ['0,125','1,234','1,57','12.000','1.234.567','−12.000','−12.000/3','1234.567']){a.values.n=value;assert.equal(E.numericFormatIssues(t,a).length,1,value);}for(const value of ['0.125','1234','12000','4.83e14','4.83×10^14','−3/4','12.000e3','12.000×10^3','12.000 ×10^3']){a.values.n=value;assert.deepEqual(E.numericFormatIssues(t,a),[],value);}assert.equal(E.numeric('12.000'),12);assert.equal(E.numeric('1,234'),1234);assert.equal(E.numeric('4.83×10^14'),4.83e14);});
test('portable reports have one brand heading and separate authored field names from original entries',()=>{const E=require('../assets/foundation-engine.js'),R=require('../assets/report-tools.js'),p=E.fresh(),s=E.createSession(p,'aa01');for(const t of E.tasks(s)){const a=E.blank(t);a.unsure=true;a.explanation='Save my answer\nI used 0,125 exactly.';E.edit(s,t,a);assert(E.submit(s,t).ok);}const payload=E.portable(s),copy=structuredClone(payload),out=R.markdown(E.subjectTitle(s),payload);assert.equal(out.split('\n').filter(line=>line==='# Quidence · '+E.subjectTitle(s)).length,1);assert(out.includes('> Save my answer\n> I used 0,125 exactly.'));assert(out.includes(E.tasks(s)[0].fields[0].label+':\n> '));assert.deepEqual(payload,copy);});
