'use strict';
const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname,'..');
function install(check = false) {
  const changed = [];
  for (const file of require('./build-static-release.cjs').files().filter(f=>f.endsWith('.html'))) {
    const filename = path.join(root,file), source = fs.readFileSync(filename,'utf8');
    const prefix = path.relative(path.dirname(file),'assets').replaceAll('\\','/');
    let html = source;
    if (!html.includes('/themes.js')) html = html.replace(/<head>/,`<head><script src="${prefix}/themes.js"></script>`);
    if (!html.includes('/themes.css')) html = html.replace('</head>',`<link rel="stylesheet" href="${prefix}/themes.css">\n</head>`);
    if (!html.includes('/paper-explorer.css')) html = html.replace('</head>',`<link rel="stylesheet" href="${prefix}/paper-explorer.css">\n</head>`);
    if (!html.includes('/learning-atlas.css')) html = html.replace('</head>',`<link rel="stylesheet" href="${prefix}/learning-atlas.css">\n</head>`);
    // Shared theme headers all use a light surface and the original dark-ink logo.
    html = html.replace(/quidence-logo-dark\.svg(?:\?v=[a-f0-9]+)?/g,'quidence-logo-light.svg');
    if (html !== source) { changed.push(file); if (!check) fs.writeFileSync(filename,html); }
  }
  if (check && changed.length) throw Error('Missing theme integration: '+changed.join(', '));
  return changed;
}
module.exports = {install};
if (require.main === module) console.log(JSON.stringify(install(process.argv.includes('--check'))));
