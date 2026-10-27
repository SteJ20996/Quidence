'use strict';
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const dir=path.join(__dirname,'../courses/coordinate-geometry');
function build(check=false){
 const localeFile=path.join(__dirname,'../assets/i18n.js'),localeSource=fs.readFileSync(localeFile,'utf8'),copy=JSON.parse(fs.readFileSync(path.join(__dirname,'../localization/coordinate-ui-es.json'),'utf8'));
 const block='// COORDINATE_UI_ES_START\nconst coordinateUI=Object.freeze('+JSON.stringify(copy,null,2)+');\n// COORDINATE_UI_ES_END';
 const localized=localeSource.replace(/\/\/ COORDINATE_UI_ES_START[\s\S]*?\/\/ COORDINATE_UI_ES_END/,block);
 if(localized!==localeSource){if(check)throw Error('Coordinate Geometry UI translations are stale.');fs.writeFileSync(localeFile,localized);}
 const file=path.join(dir,'app.mjs'),source=fs.readFileSync(file,'utf8');
 const updated=source.replace(/from '\.\/(core|content)\.mjs(?:\?[^']*)?'/g,(_,name)=>"from './"+name+'.mjs?v='+createHash('sha256').update(fs.readFileSync(path.join(dir,name+'.mjs'))).digest('hex').slice(0,12)+"'");
 if(updated!==source){if(check)throw Error('Coordinate Geometry imports are stale. Run node scripts/build-coordinate.cjs.');fs.writeFileSync(file,updated);}
 return{changed:Number(updated!==source)};
}
module.exports={build};if(require.main===module)console.log(JSON.stringify(build(process.argv.includes('--check'))));
