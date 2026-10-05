'use strict';
const path=require('node:path'),{spawnSync}=require('node:child_process');
const files=['foundations-math.test.cjs','foundations-session.test.cjs','foundations-flow.test.cjs'].map(f=>path.join(__dirname,'../tests',f));
const result=spawnSync(process.execPath,['--test',...files],{stdio:'inherit'});process.exit(result.status??1);
