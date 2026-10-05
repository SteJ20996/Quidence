'use strict';
const path = require('node:path');
const {spawnSync} = require('node:child_process');
for (const script of ['test-aa01.cjs', 'test-ab01.cjs', 'test-ac01.cjs', 'test-ad01.cjs', 'test-foundations.cjs']) {
  const result = spawnSync(process.execPath, [path.join(__dirname, script)], {stdio: 'inherit'});
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
