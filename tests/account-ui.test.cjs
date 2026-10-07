'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const settle=()=>new Promise(r=>setImmediate(r));
function harness(){
 const nodes=new Map(),listeners={},node=id=>{if(!nodes.has(id))nodes.set(id,{id,textContent:'',hidden:false,disabled:false,children:[],appendChild(n){this.children.push(n);},replaceChildren(){this.children=[];},addEventListener(k,fn){this[k]=fn;}});return nodes.get(id);};
 const forms=['login','register','recover'].map(kind=>({...node(kind),dataset:{kind},fields:{username:'student',password:'a strong password'},reset(){this.fields={};this.resetCount=(this.resetCount||0)+1;}}));
 let current={owner:null,authenticated:false,busy:false,conflicts:[],pending:[]},failLogout=false;
 const controller={state:()=>current,refresh:async()=>({user:null}),sync:async()=>{},signIn:async()=>{current={...current,owner:{id:'student',username:'student'},authenticated:true};listeners['quidence-sync-change']();return{recoveryCode:'private-recovery-code'};},logout:async()=>{current={...current,owner:null,authenticated:false};listeners['quidence-sync-change']();if(failLogout)throw Error('Server sign-out could not be confirmed.');},clearDevice:async()=>{current={...current,owner:null};listeners['quidence-sync-change']();}};
 const buttons=['logout','clear-device','sync','import','download','save-code'].map(node);
 const document={getElementById:node,querySelectorAll:s=>s==='form[data-kind]'?forms:s==='button'?buttons:[],createElement:()=>node('created'),body:node('body')};
 const window={QuidenceAccount:controller,QuidenceSyncPolicy:{KEYS:{}},confirm:()=>true,addEventListener:(k,fn)=>listeners[k]=fn};
 vm.runInNewContext(fs.readFileSync(require.resolve('../assets/account-app.js'),'utf8'),{window,document,URL,Blob,setTimeout,FormData:class{constructor(form){this.form=form;}*[Symbol.iterator](){yield*Object.entries(this.form.fields);}}});
 return{node,forms,async register(){forms[1].submit({preventDefault(){}});await settle();},async logoutFailure(){failLogout=true;node('logout').onclick();await settle();},changeOwner(owner){current={...current,owner};listeners['quidence-sync-change']();}};
}
test('failed server logout still clears recovery code and forms without claiming confirmed sign-out',async()=>{
 const h=harness();await settle();await h.register();assert.equal(h.node('recovery-code').textContent,'private-recovery-code');h.forms[0].fields.password='browser form secret';await h.logoutFailure();
 assert.equal(h.node('recovery-code').textContent,'');assert.equal(h.node('recovery').hidden,true);assert(h.forms.every(f=>Object.keys(f.fields).length===0));assert.match(h.node('message').textContent,/could not be confirmed/);assert.equal(h.node('auth').hidden,false);
});
test('a cross-tab account change removes displayed recovery codes and authentication form values',async()=>{
 const h=harness();await settle();await h.register();h.forms[2].fields.recoveryCode='typed secret';h.changeOwner({id:'other',username:'other'});
 assert.equal(h.node('recovery-code').textContent,'');assert.equal(h.node('recovery').hidden,true);assert(h.forms.every(f=>Object.keys(f.fields).length===0));
});
