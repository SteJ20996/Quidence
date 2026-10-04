'use strict';
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const files=['math.test.cjs','session.test.cjs','flow.test.cjs','links.test.cjs'].map(f=>path.join(__dirname,'../modules/ad01/tests',f));
const result=spawnSync(process.execPath,['--test',...files],{stdio:'inherit'});
if(result.error)throw result.error;
if(result.status!==0)process.exit(result.status??1);
