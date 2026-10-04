'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const moduleRoot = path.resolve(__dirname, '../modules/ab01');
const testFiles = fs.readdirSync(path.join(moduleRoot, 'tests'))
  .filter(name => name.endsWith('.test.cjs'))
  .sort()
  .map(name => path.join('tests', name));

if (testFiles.length === 0) {
  console.error('No AB01 test files found.');
  process.exit(1);
}

const result = spawnSync(process.execPath, ['--test', ...testFiles], {
  cwd: moduleRoot,
  stdio: 'inherit',
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}
process.exit(result.status === null ? 1 : result.status);
