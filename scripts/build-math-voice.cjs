'use strict';
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..'),source=path.join(root,'demos/college-voice-lab/dist'),target=path.join(root,'explain');
const names=['app.js','core.js','views.js','recorder.js','style.css','assets/nunito-900.woff','assets/Nunito-OFL.txt'];
const hash=file=>createHash('sha256').update(fs.readFileSync(path.join(source,file))).digest('hex').slice(0,12);
function build(check=false){const changed=[];for(const name of names){let bytes=fs.readFileSync(path.join(source,name));if(name.endsWith('.js'))bytes=Buffer.from(bytes.toString().replace(/from '\.\/(core|views)\.js(?:\?[^']*)?'/g,(_,module)=>"from './"+module+".js?v="+hash(module+'.js')+"'"));const file=path.join(target,name);if(!fs.existsSync(file)||!fs.readFileSync(file).equals(bytes)){changed.push(name);if(!check){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);}}}if(check&&changed.length)throw Error('Published Math Voice Lab differs from its source: '+changed.join(', '));return{changed:changed.length};}
if(require.main===module)console.log(JSON.stringify(build(process.argv.includes('--check'))));module.exports={build};
