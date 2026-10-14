'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=name=>fs.readFileSync(path.join(root,'assets',name),'utf8');
test('course chunks reconstruct every reviewed translation without conflicts or missing templates',()=>{
 const full=vm.createContext({}),split=vm.createContext({});vm.runInContext(read('i18n-es.js'),full);
 const files=['common',...fs.readdirSync(path.join(root,'assets/i18n-es')).filter(n=>n!=='common.js').map(n=>n.replace(/\.js$/,''))];
 for(const name of files)vm.runInContext(read('i18n-es/'+name+'.js'),split);
 assert.equal(JSON.stringify(Object.entries(split.QuidenceSpanish).sort()),JSON.stringify(Object.entries(full.QuidenceSpanish).sort()));
 assert.equal(JSON.stringify(split.QuidenceSpanishQuantities),JSON.stringify(full.QuidenceSpanishQuantities));
 assert(fs.statSync(path.join(root,'assets/i18n-es/common.js')).size<fs.statSync(path.join(root,'assets/i18n-es.js')).size*.85);
});
test('source-scoped course passages stay available on their own course route',()=>{
 const inventory=require('../localization/source-inventory.json'),normal=s=>String(s).replace(/\s+/g,' ').trim();
 const full=vm.createContext({});vm.runInContext(read('i18n-es.js'),full);
 for(const group of ['aa01','ab01','ac01','ad01','ae01','af01']){
  const context=vm.createContext({});vm.runInContext(read('i18n-es/common.js'),context);vm.runInContext(read('i18n-es/'+group+'.js'),context);
  for(const item of inventory.filter(item=>item.files.some(file=>file.startsWith('modules/'+group+'/dist/')))){
   const key=normal(item.text);if(full.QuidenceSpanish[key]!==undefined)assert.equal(context.QuidenceSpanish[key],full.QuidenceSpanish[key],group+': '+key);
  }
 }
});
test('Physics picker uses its visible course name as its accessible name',()=>{
 const buttons=['physics-1','physics-2'].map(id=>({dataset:{learningSubject:id},textContent:'',attrs:{'aria-label':'old'},removeAttribute(name){delete this.attrs[name];}}));
 const subroot={querySelector(selector){return {};},querySelectorAll(selector){return selector==='[data-compact-physics]'?buttons:[];}};
 // Run the label setup only; the rest of home navigation is tested separately.
 const source=fs.readFileSync(path.join(root,'assets/home.js'),'utf8').split('  function show(')[0]+'})();';
 for(const locale of ['en','es']){
  vm.runInNewContext(source,{window:{QuidenceI18n:{locale}},document:{documentElement:{dataset:{uiTheme:"classic"}},getElementById:id=>id==='quidence-home'?subroot:{hidden:false},addEventListener(){}}});
  buttons.forEach((button,i)=>{assert.equal(button.textContent,locale==='es'?'Fundamentos de física '+(i+1):'Physics '+(i+1)+' Foundations');assert.equal(button.attrs['aria-label'],undefined);});
 }
});
