'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {CONTENT_SECURITY_POLICY} = require('../backend/security.cjs');
const root = path.resolve(__dirname, '..');
const roots = ['index.html', 'assets', 'account', 'data-use', 'records', 'reports',
  'foundations', 'diagnostics', 'projects', 'intuition', 'cross-disciplinary', 'checks', 'explain',
  ...['pre-algebra', 'algebra-1', 'geometry', 'algebra-2', 'basic-logic', 'physics', 'physics-1', 'physics-2', 'number-theory', 'coordinate-geometry', 'discrete-math'].map(id => 'courses/' + id),
  ...['aa01', 'ab01', 'ac01', 'ad01', 'ae01', 'af01'].map(id => 'modules/' + id + '/dist')];
const types = /\.(?:html|js|mjs|css|svg|png|webp|woff|ico|webmanifest)$/;
const excluded = new Set(['assets/account-app.js', 'assets/sync-client.js']);
function allowed(file) {
  return (types.test(file) || ['assets/fonts/Nunito-OFL.txt','assets/fonts/SourceSerif4-OFL.txt','explain/assets/Nunito-OFL.txt'].includes(file) || ['courses/number-theory/data.json', 'courses/discrete-math/data.json', 'cross-disciplinary/data.json'].includes(file)) && !excluded.has(file) &&
    !file.split('/').some(part => part.startsWith('.')) &&
    !file.startsWith('modules/ab01/dist/beta01/') &&
    (!file.startsWith('modules/aa01/dist/sketch-lab/') || file.endsWith('/math.js'));
}
function files() {
  const found = [];
  function walk(file) {
    const absolute = path.join(root, file), stat = fs.lstatSync(absolute);
    if (stat.isSymbolicLink()) throw Error('Release sources must not be symlinks: ' + file);
    if (stat.isDirectory()) {
      for (const name of fs.readdirSync(absolute).sort()) walk(file + '/' + name);
    } else if (allowed(file)) found.push(file);
  }
  roots.forEach(walk);
  for (const file of ['robots.txt', 'sitemap.xml']) {
    if (fs.existsSync(path.join(root, file))) found.push(file);
  }
  return found.sort();
}
function validateLinks(list) {
  const included = new Set(list);
  for (const file of list.filter(name => name.endsWith('.html'))) {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    for (const [, reference] of text.matchAll(/(?:src|href)="([^"]+)"/g)) {
      if (/^(?:[a-z]+:|\/\/|#)/i.test(reference)) continue;
      const url = new URL(reference.replace(/&amp;/g, '&'), 'https://release.test/' + file);
      let target = decodeURIComponent(url.pathname).slice(1);
      if (target.endsWith('/') || !target) target += 'index.html';
      if (!included.has(target)) throw Error('Missing release link: ' + file + ' → ' + target);
    }
  }
}
function headers() {
  return '/*\n  Content-Security-Policy: ' + CONTENT_SECURITY_POLICY +
    '\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: same-origin' +
    '\n  X-Frame-Options: SAMEORIGIN\n  Cache-Control: no-cache\n' +
    ['account', 'records', 'reports'].map(route => '\n/' + route + '/*\n  X-Robots-Tag: noindex, follow\n').join('');
}
function build(output = path.join(root, 'static-release')) {
  // Refuse to mix a fresh public bundle with files left by an earlier build.
  if (fs.existsSync(output)) throw Error('Use an empty output directory for the static release.');
  require('./build-math-voice.cjs').build(true);
  require('./build-seo.cjs').buildSEO(true);
  const list = files();
  validateLinks(list);
  for (const file of list) {
    const target = path.join(output, file);
    fs.mkdirSync(path.dirname(target), {recursive: true});
    fs.copyFileSync(path.join(root, file), target);
  }
  fs.writeFileSync(path.join(output, '_headers'), headers());
  return {files: list.length, output};
}
module.exports = {files, validateLinks, headers, build};
if (require.main === module) console.log(JSON.stringify(build(process.argv[2])));
