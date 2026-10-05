'use strict';
const path=require('node:path'),{spawnSync}=require('node:child_process');
const result=spawnSync(process.execPath,['--test',path.join(__dirname,'../tests/new-subjects.test.cjs')],{stdio:'inherit'});process.exit(result.status??1);
