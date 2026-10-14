'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const Themes=require('../assets/themes.js'),root=path.resolve(__dirname,'..');
test('every published page restores its theme before loading styles, with versioned shared assets',()=>{
  for(const file of require('../scripts/build-static-release.cjs').files().filter(f=>f.endsWith('.html'))){
    const html=fs.readFileSync(path.join(root,file),'utf8');
    assert.equal((html.match(/src="[^"]*\/themes.js/g)||[]).length,1,file);
    assert.match(html,/<script src="[^"]*\/themes.js\?v=[a-f0-9]+"><\/script>/,file);
    assert(html.indexOf('/themes.js')<html.indexOf('rel="stylesheet"'),file+' early restore');
    assert.match(html,/href="[^"]*\/themes.css\?v=[a-f0-9]+"/,file);
    assert(!html.includes('quidence-logo-dark.svg'),file+' light header logo');
  }
  require('../scripts/install-themes.cjs').install(true);
});
test('saved appearance restores without touching learning records; unknown and blocked storage fall back safely',()=>{
  for(const value of ['paper','atlas','studio','unknown',null]){
    const writes=[],attrs={};
    const window={localStorage:{getItem:key=>{assert.equal(key,Themes.KEY);return value;},setItem:(...args)=>writes.push(args)},document:{readyState:'loading',documentElement:{setAttribute:(k,v)=>attrs[k]=v},querySelector:()=>null,addEventListener:()=>{}}};
    vm.runInNewContext(fs.readFileSync(path.join(root,'assets/themes.js'),'utf8'),{window});
    assert.equal(attrs['data-ui-theme'],Themes.valid(value)?value:'paper');assert.deepEqual(writes,[]);
    assert.equal(window.QuidenceThemes.apply('invalid',true),false);
    window.QuidenceThemes.apply('studio',true);assert.deepEqual(writes,[[Themes.KEY,'studio']]);
    Object.defineProperty(window,'localStorage',{get(){throw Error('blocked');}});
    assert.doesNotThrow(()=>window.QuidenceThemes.apply('atlas',true));assert.equal(attrs['data-ui-theme'],'atlas');
  }
});
