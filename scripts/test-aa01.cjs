'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname, '../modules/aa01');
const tests = fs.readdirSync(path.join(root, 'tests')).filter(name => name.endsWith('.cjs')).sort();
if (!tests.length) throw new Error('No AA01 test suites found.');
for (const test of tests) {
  const result = spawnSync(process.execPath, [path.join('tests', test)], {cwd: root, stdio: 'inherit'});
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
