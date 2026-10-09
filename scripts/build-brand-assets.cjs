'use strict';
// Derive display variants from Stephen's supplied vector paths, without redrawing.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'design/brand/quidence-logo-source.svg'), 'utf8');
const groups = [...source.matchAll(/<g id="[^"]+" fill="rgb\(([^)]+)\)"[^>]*><g>([\s\S]*?)<\/g><\/g>/g)];
const paths = color => {
  const group = groups.find(g => g[1] === color);
  if (!group) throw Error('Missing source logo color: ' + color);
  return group[2].replace(/ id="[^"]+"/g, '');
};
const white = paths('246,247,249'), mint = paths('104,225,175');
const logo = (letters, accent) => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="2850 2850 12270 3100" role="img" aria-label="Quidence"><title>Quidence</title><g fill="' + letters + '">' + white + '</g><g fill="' + accent + '">' + mint + '</g></svg>';
const variants = {dark: logo('#f6f7f9', '#68e1af'), light: logo('#142236', '#087f76')};
for (const [theme, svg] of Object.entries(variants)) fs.writeFileSync(path.join(root, 'assets/quidence-logo-' + theme + '.svg'), svg + '\n');
// Inline vectors make downloaded reports independent of the website or network.
fs.writeFileSync(path.join(root, 'assets/brand.js'), '(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;else root.QuidenceBrand=api;})(typeof window!=="undefined"?window:globalThis,function(){"use strict";const variants=' + JSON.stringify(variants) + ';return Object.freeze({svg:function(theme){return variants[theme]||variants.light;}});});\n');
const sourcePath = id => {
  const match = source.match(new RegExp('<path id="' + id + '" d="([^"]+)"\\s*/>'));
  if (!match) throw Error('Missing source logo path: ' + id);
  return '<path d="' + match[1] + '"/>';
};
const favicon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="2850 2850 3100 3100"><title>Quidence</title><rect x="2850" y="2850" width="3100" height="3100" rx="560" fill="#142236"/><g fill="#f6f7f9">' + sourcePath('pSQdEuSjk') + '</g><g fill="#68e1af">' + sourcePath('pj9MlKyDQ') + sourcePath('pasONU90z') + '</g></svg>\n';
fs.writeFileSync(path.join(root, 'assets/favicon.svg'), favicon);
fs.writeFileSync(path.join(root, 'modules/aa01/dist/favicon.svg'), favicon);
