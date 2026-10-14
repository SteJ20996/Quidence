'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {createHash} = require('node:crypto');
const root = path.resolve(__dirname, '..');
const entries = ['foundations/index.html', 'diagnostics/index.html', 'projects/index.html'];
const reportAssets = new Set(['assets/themes.js', 'assets/themes.css', 'assets/brand.js', 'assets/brand.css', 'assets/quidence-logo-dark.svg', 'assets/quidence-logo-light.svg', 'assets/favicon.svg','assets/i18n.css', 'assets/i18n-es.js', 'assets/i18n.js', 'assets/hub.css', 'assets/hub-goals.js', 'assets/report-tools.js', 'assets/report-tools.css', 'assets/report-store.js', 'assets/report-viewer.js', 'assets/course-app.js', 'modules/aa01/dist/app.js', 'modules/ab01/dist/learning.js', 'modules/ad01/dist/app.js']);
for (const file of ['assets/favicon-32.png', 'assets/apple-touch-icon.png', 'modules/aa01/dist/favicon.svg']) reportAssets.add(file);
const digest = content => createHash('sha256').update(content).digest('hex').slice(0, 12);
for(const file of ['paper-explorer.css','paper-home.js','paper-art.js','learning-atlas.css','atlas-home.js','atlas-art.js','appearance-layout.css'])reportAssets.add('assets/'+file);
for(const file of ['cartoon-art.js','cartoon-map-data.js','cartoon-map.js','cartoon-map.css','cartoon-home.js','cartoon-home.css','home.css','home.js','knowledge-map-data.js','knowledge-map.js','local-records.js'])reportAssets.add('assets/'+file);
for(const file of ['app.js','core.js','style.css'])reportAssets.add('courses/number-theory/'+file);
for(const file of ['app.js','content.js','engine.js','style.css'])reportAssets.add('modules/ac01/dist/'+file);
for(const file of ['app.js','matrix-guide.js','style.css'])reportAssets.add('modules/ab01/dist/'+file);
reportAssets.add('assets/course-catalog.js');reportAssets.add('assets/sync-policy.js');
reportAssets.add('assets/seo-config.js');reportAssets.add('assets/seo.js');
for (const file of ['color-review.css', 'qidolab-lockup.svg', 'qidolab-water-puzzle.svg']) reportAssets.add('assets/' + file);
function versionActivities(check = false) {
  const updates = new Map();
  const uiVersion = digest(['foundation.css', 'foundation-app.js', 'project.css']
    .map(file => fs.readFileSync(path.join(root, 'assets', file))).join('\n'));
  for (const file of entries) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    const html = source.replace(/data-es-catalog="[^"]*"/g, 'data-es-catalog="?v=' + digest(fs.readFileSync(path.join(root, 'assets/i18n-es.js'))) + '"').replace(/<html\b[^>]*>/, tag => tag.replace(/\sdata-activity-version="[^"]*"/, '').replace(/>$/, ' data-activity-version="' + uiVersion + '">'))
      .replace(/(src|href)="(\.\.\/assets\/[^"?]+\.(?:js|css|svg|png))(?:\?[^" ]*)?"/g, (_, attr, reference) => {
        const hash = digest(fs.readFileSync(path.resolve(root, path.dirname(file), reference)));
        return attr + '="' + reference + '?v=' + hash + '"';
      });
    updates.set(file, html);
  }
  // Change the document URL too: an old cached project document cannot request new assets.
  const routeVersions = Object.fromEntries(entries.map(file => [file.split('/')[0], digest(updates.get(file))]));
  const publicHTML = require('./build-static-release.cjs').files().filter(file => file.endsWith('.html'));
  for (const file of publicHTML) {
    const source = updates.get(file) ?? fs.readFileSync(path.join(root, file), 'utf8');
    const html = source.replace(/data-es-catalog="[^"]*"/g, 'data-es-catalog="?v=' + digest(fs.readFileSync(path.join(root, 'assets/i18n-es.js'))) + '"').replace(/(src|href)="([^"?]+\.(?:js|css|svg|png))(?:\?[^" ]*)?"/g, (match, attr, reference) => {
      const resolved = path.resolve(root, path.dirname(file), reference);
      if (!reportAssets.has(path.relative(root, resolved))) return match;
      const hash = digest(fs.readFileSync(resolved));
      // Keep the original Algebra activity's public release version and pin its content too.
      const query = path.relative(root, resolved) === 'modules/aa01/dist/app.js' ? 'v=0.6&amp;asset=' + hash : 'v=' + hash;
      return attr + '="' + reference + '?' + query + '"';
    }).replace(/href="([^"?]*\b(foundations|diagnostics|projects)\/\?[^" ]*)"/g, (_, reference, route) => {
      const url = new URL(reference.replaceAll('&amp;', '&'), 'https://quidence.test/' + file);
      url.searchParams.set('v', routeVersions[route]);
      return 'href="' + reference.split('?')[0] + '?' + url.searchParams.toString().replaceAll('&', '&amp;') + '"';
    });
    updates.set(file, html);
  }
  const changed = [...updates].filter(([file, content]) => fs.readFileSync(path.join(root, file), 'utf8') !== content);
  if (check && changed.length) throw Error('Activity URLs are out of date. Run npm run version:activities (' + changed.map(([file]) => file).join(', ') + ').');
  if (!check) for (const [file, content] of changed) fs.writeFileSync(path.join(root, file), content);
  return {changed: changed.length, uiVersion};
}
if (require.main === module) console.log(JSON.stringify(versionActivities(process.argv.includes('--check'))));
module.exports = {versionActivities};
