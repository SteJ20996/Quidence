'use strict';
// Stacked fractions are drawn on screen only. These tests check which written forms count as fractions.
const test=require('node:test'),assert=require('node:assert/strict');
const F=require('../assets/fractions.js');
const show=s=>F.find(s).map(f=>[f.num,f.den]);

test('numbers, letters and bracketed expressions written with a slash are found, with their extent',()=>{
 const cases=[
  ['P = 2/3',[['2','3']]],['−3/4 and 0.3/0.1',[['3','4'],['0.3','0.1']]],['44/120 = 11/30',[['44','120'],['11','30']]],
  ['n/2',[['n','2']]],['σ/√n',[['σ','√n']]],['1.4/√16',[['1.4','√16']]],['Dₙ/n!',[['Dₙ','n!']]],['x̄/n',[['x̄','n']]],['T = 2π/k',[['2π','k']]],
  ['(n + 1)/(n + 2)',[['n + 1','n + 2']]],['by only 4(n + 1)/(n + 2).',[['4(n + 1)','n + 2']]],['n(n + 1)/2',[['n(n + 1)','2']]],
  ['(O − E)²/E',[['(O − E)²','E']]],['P(A ∩ B)/P(B)',[['P(A ∩ B)','P(B)']]],['[f(v) − f(u)]/(v − u)',[['f(v) − f(u)','v − u']]],
  ['P(X ≥ a) ≤ E[X]/a.',[['E[X]','a']]],['e⁻¹ = Σ (−1)ᵏ/k!',[['(−1)ᵏ','k!']]],['K=mv²/2',[['mv²','2']]],['|emf|=|ΔΦ|/Δt',[['|ΔΦ|','Δt']]],
  ['gcd(a/g, b/g) = 1',[['a','g'],['b','g']]],['x/y',[['x','y']]],['area is bh/2',[['bh','2']]],['u=(1,1)/sqrt(2)',[['(1,1)','sqrt(2)']]],['(5/6)⁵',[['5','6']]],
  // Outer fractions win; the inner n/2 stays written with a slash inside the numerator.
  ['C(n, n/2) / 2ⁿ',[['C(n, n/2)','2ⁿ']]],
  // Factors side by side belong to the numerator.
  ['P(S | +) = P(+ | S)P(S) / (P(+ | S)P(S) + P(+ | not S)P(not S))',[['P(+ | S)P(S)','P(+ | S)P(S) + P(+ | not S)P(not S)']]],
 ];
 for(const [s,want]of cases)assert.deepEqual(show(s),want,s);
});

test('units, words, labels, dates, paths, counters and unclear forms keep the slash',()=>{
 for(const s of ['6 m/s','g = 10 m/s²','3 km/h','kg·m/s','items/100 m','objetos/100 m','2 rad/s','16 N/m','1000 kg/m³','c = 4186 J/(kg·K)','2000 J/kg·K','30 Wh/20 W','min/lap','$/player','cm²/s',
  'and/or','heat and/or sound','Top/Left','A Early/B Late','the 8-letter E/N words','V/R','overlap / club total','Period / π','Print / save as PDF','distance/time',
  '2026/11/01','11/1/2026, 7:42 PM','../../ad01/dist/','courses/probability/','https://x.org/a/b','01 / 12','3 / 12 recorded','8 × 5 / 2 = 20',
  'log₁₀ 2 / log₁₀(10/9)'.replace('(10/9)',''),'a/b(c)','1/2(n + 1)','P(A | Bⱼ)P(Bⱼ) / Σ P(A | Bₖ)P(Bₖ)','3/4ths','E/N'])
  assert.deepEqual(F.find(s),[],s);
 // A function written with a space keeps the slash beside it, while the fraction inside its bracket is still drawn.
 assert.deepEqual(show('log₁₀ 2 / log₁₀(10/9)'),[['10','9']]);
});

test('across the authored text of every subject, no unit is drawn as a fraction and each fraction covers its own text',()=>{
 // Every string in the subject banks, foundations, course data and project sources.
 const fs=require('node:fs'),path=require('node:path'),root=path.join(__dirname,'..'),texts=new Set();
 const walk=v=>{if(typeof v==='string')texts.add(v);else if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')Object.values(v).forEach(walk);};
 global.window=globalThis;
 for(const f of fs.readdirSync(path.join(root,'assets')).filter(f=>/(bank|foundation|content|catalog|knowledge-map-data|cartoon-map-data)[^/]*\.js$/.test(f)&&!/-v\d+\.js$/.test(f)&&f!=='foundation-start.js'))walk(require(path.join(root,'assets',f)));
 for(const f of ['intuition/data.js','courses/algorithms/core.js','content/probability/projects.cjs','content/discrete-math/projects.cjs','content/cross-disciplinary/projects.cjs','modules/ac01/dist/projects/content.js'])walk(require(path.join(root,f)));
 for(const f of ['courses/number-theory/data.json','courses/discrete-math/data.json','courses/probability/data.json','cross-disciplinary/data.json'])walk(JSON.parse(fs.readFileSync(path.join(root,f),'utf8')));
 // Multi-letter unit words; single-letter units such as m/s are checked by name in the test above.
 const unit=/^(?:km|kg·m|kg|rad|Wh|Pa|min|items|\$)$/;let found=0;
 for(const s of texts){if(!s.includes('/'))continue;for(const f of F.find(s)){
  found++;assert.equal(s.slice(f.start,f.end),f.text);
  assert.ok(!unit.test(f.num.trim())||/\d/.test(f.den),'unit drawn as a fraction: '+f.text+' in '+s.slice(0,80));
  // A plain number over a unit symbol would be a quantity such as 5/s; none is drawn.
  assert.ok(!(/^\d+(?:\.\d+)?$/.test(f.num)&&/^(?:s|h|s²|m|m²|m³|K|kg·K|kg|lap|player)$/.test(f.den.trim())),'number over a unit: '+f.text+' in '+s.slice(0,80));
 }}
 assert.ok(texts.size>9000&&found>1000,'texts '+texts.size+', fractions found: '+found);
});
