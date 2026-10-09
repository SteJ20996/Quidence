'use strict';
const path = require('node:path');
const {spawnSync} = require('node:child_process');
for (const script of ['test-aa01.cjs', 'test-ab01.cjs', 'test-ad01.cjs', 'test-foundations.cjs', 'test-new-subjects.cjs']) {
  const result = spawnSync(process.execPath, [path.join(__dirname, script)], {stdio: 'inherit'});
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}


const sync = spawnSync(process.execPath, ['--test', path.join(__dirname,'../tests/backend-sync.test.cjs'),path.join(__dirname,'../tests/sync-client.test.cjs')], {stdio:'inherit'});if(sync.status!==0)process.exit(sync.status??1);

const diagnostic = spawnSync(process.execPath, ['--test', path.join(__dirname,'../tests/challenges.test.cjs')], {stdio:'inherit'});if(diagnostic.status!==0)process.exit(diagnostic.status??1);

const projects = spawnSync(process.execPath, ['--test',path.join(__dirname,'../tests/projects.test.cjs')], {stdio:'inherit'});if(projects.status!==0)process.exit(projects.status??1);

const hardening=spawnSync(process.execPath,['--test',path.join(__dirname,'../tests/brand-compat.test.cjs'),path.join(__dirname,'../tests/security.test.cjs'),path.join(__dirname,'../tests/csp.test.cjs'),path.join(__dirname,'../tests/local-records.test.cjs'),path.join(__dirname,'../tests/explanation-policy.test.cjs'),path.join(__dirname,'../tests/account-ui.test.cjs')],{stdio:'inherit'});if(hardening.status!==0)process.exit(hardening.status??1);

const inventory=spawnSync(process.execPath,[path.join(__dirname,"build-source-ledger.cjs"),"--check"],{stdio:"inherit"});if(inventory.status!==0)process.exit(inventory.status??1);

const localization=spawnSync(process.execPath,['--test',path.join(__dirname,'../tests/localization.test.cjs')],{stdio:'inherit'});if(localization.status!==0)process.exit(localization.status??1);
