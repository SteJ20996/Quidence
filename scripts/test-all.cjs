'use strict';
const path = require('node:path');
const intuition = require('node:child_process').spawnSync(process.execPath,['--test',path.join(__dirname,'../tests/intuition.test.cjs')],{stdio:'inherit'});if(intuition.status!==0)process.exit(intuition.status??1);
const {spawnSync} = require('node:child_process');
for (const script of ['test-aa01.cjs', 'test-ab01.cjs', 'test-ac01.cjs', 'test-ad01.cjs', 'test-foundations.cjs', 'test-new-subjects.cjs', 'test-number-theory.cjs']) {
  const result = spawnSync(process.execPath, [path.join(__dirname, script)], {stdio: 'inherit'});
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}


const sync = spawnSync(process.execPath, ['--test', path.join(__dirname,'../tests/backend-sync.test.cjs'),path.join(__dirname,'../tests/sync-client.test.cjs')], {stdio:'inherit'});if(sync.status!==0)process.exit(sync.status??1);

const diagnostic = spawnSync(process.execPath, ['--test', path.join(__dirname,'../tests/challenges.test.cjs')], {stdio:'inherit'});if(diagnostic.status!==0)process.exit(diagnostic.status??1);

const projects = spawnSync(process.execPath, ['--test',path.join(__dirname,'../tests/projects.test.cjs')], {stdio:'inherit'});if(projects.status!==0)process.exit(projects.status??1);

const hardening=spawnSync(process.execPath,['--test',path.join(__dirname,'../tests/ac01-restoration.test.cjs'),path.join(__dirname,'../tests/game-projects.test.cjs'),path.join(__dirname,'../tests/knowledge-map.test.cjs'),path.join(__dirname,'../tests/brand-compat.test.cjs'),path.join(__dirname,'../tests/security.test.cjs'),path.join(__dirname,'../tests/csp.test.cjs'),path.join(__dirname,'../tests/local-records.test.cjs'),path.join(__dirname,'../tests/explanation-policy.test.cjs'),path.join(__dirname,'../tests/account-ui.test.cjs')],{stdio:'inherit'});if(hardening.status!==0)process.exit(hardening.status??1);

const inventory=spawnSync(process.execPath,[path.join(__dirname,"build-source-ledger.cjs"),"--check"],{stdio:"inherit"});if(inventory.status!==0)process.exit(inventory.status??1);

const localization=spawnSync(process.execPath,['--test',path.join(__dirname,'../tests/localization.test.cjs'),path.join(__dirname,'../tests/locale-chunks.test.cjs')],{stdio:'inherit'});if(localization.status!==0)process.exit(localization.status??1);

const seo=spawnSync(process.execPath,["--test",path.join(__dirname,"../tests/seo.test.cjs")],{stdio:"inherit"});if(seo.status!==0)process.exit(seo.status??1);

const themes=spawnSync(process.execPath,['--test',path.join(__dirname,'../tests/themes.test.cjs')],{stdio:'inherit'});if(themes.status!==0)process.exit(themes.status??1);
const dialogue=spawnSync(process.execPath,['--test',path.join(__dirname,'../tests/dialogue-language.test.cjs'),path.join(__dirname,'../tests/calculus-dialogue.test.mjs'),path.join(__dirname,'../tests/calculus-recorder.test.mjs')],{stdio:'inherit'});if(dialogue.status!==0)process.exit(dialogue.status??1);

const voice=require('node:child_process').spawnSync(process.execPath,['--test',path.join(__dirname,'../tests/math-voice-release.test.cjs'),path.join(__dirname,'../demos/college-voice-lab/tests/models.test.js')],{stdio:'inherit'});if(voice.status!==0)process.exit(voice.status??1);

const speech=spawnSync(process.execPath,['--test',path.join(__dirname,'../tests/speech-review.test.cjs')],{stdio:'inherit'});if(speech.status!==0)process.exit(speech.status??1);
