// Callback-level regression checks. This harness does not simulate a browser's
// print dialog, popup policy or download manager.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const decode=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
function load(){
  const nodes=new Map(),forms=new Map(),downloads=[],blobs=new Map(),timers=[],scrolls=[];
  let popupBlocked=false,downloadBlocked=false,printThrows=false,preview=null;
  class Element{
    constructor(){this.textContent='';this.style={};this.hidden=false;this.open=false;this._html='';}
    addEventListener(){}
    click(){if(this.onclick)return this.onclick();}
    focus(){this.focused=true;}
    scrollIntoView(){this.scrolled=true;}
    showModal(){this.open=true;}
    close(){this.open=false;}
    remove(){this.removed=true;}
    get innerHTML(){return this._html;}
    set innerHTML(html){this._html=html;}
  }
  const app=new Element();
  Object.defineProperty(app,'innerHTML',{get:()=>app._html,set:html=>{
    app._html=html;nodes.clear();nodes.set('#app',app);forms.clear();nodes.set('#quadratic-test-entry',new Element());
    for(const [,id] of html.matchAll(/\bid="([^"]+)"/g))nodes.set('#'+id,new Element());
    for(const [,id,body] of html.matchAll(/<form data-review="([^"]+)">([\s\S]*?)<\/form>/g)){
      const form=new Element();form.dataset={review:id};
      const options=[...body.matchAll(/<option value="([^"]*)"([^>]*)>/g)];
      form.elements={credit:{value:(options.find(x=>x[2].includes('selected'))??options[0])[1]},note:{value:decode(body.match(/<textarea[^>]*>([\s\S]*?)<\/textarea>/)[1])}};
      form.error=new Element();form.submitButton=new Element();form.querySelector=()=>form.error;forms.set(id,form);
    }
  }});
  app.cloneNode=()=>{
    const copy={innerHTML:app.innerHTML,querySelectorAll(selector){
      if(selector==='details')return [...this.innerHTML.matchAll(/<details>/g)].map(()=>({set open(value){if(value)copy.innerHTML=copy.innerHTML.replace('<details>','<details open>');}}));
      return [{remove(){copy.innerHTML=copy.innerHTML.replace(/<div class="report-actions">[\s\S]*?<\/div>/g,'').replace(/<p class="help report-export-help">[\s\S]*?<\/p>/g,'').replace(/<form\b[\s\S]*?<\/form>/g,'').replace(/<dialog\b[\s\S]*?<\/dialog>/g,'').replace(/<p\b[^>]*role="status"[^>]*>[\s\S]*?<\/p>/g,'');}}];
    }};return copy;
  };
  nodes.set('#app',app);
  const document={body:{appendChild(link){if(downloadBlocked)throw Error('download unavailable');link.attached=true;}},querySelector(selector){
    if(selector==='[data-open-quadratic]')return nodes.get('#quadratic-test-entry');
    if(selector.startsWith('#'))return nodes.get(selector)??null;
    const id=selector.match(/\[data-review="([^"]+)"\]/)?.[1];return id?forms.get(id)?.submitButton:null;
  },querySelectorAll:selector=>selector==='[data-review]'?[...forms.values()]:[],createElement(tag){assert.equal(tag,'a');const link=new Element();link.click=()=>{assert(link.attached);downloads.push({filename:link.download,blob:blobs.get(link.href)});};return link;}};
  const window={scrollY:420,scrollTo:opts=>scrolls.push(opts),open(){
    if(popupBlocked)return null;
    preview={opener:window,html:'',printCount:0,document:{open(){},write(html){preview.html=html;},close(){}},focus(){},print(){if(printThrows)throw Error('printing unavailable');this.printCount++;}};return preview;
  }};
  const URL={createObjectURL(blob){const id='blob:'+blobs.size;blobs.set(id,blob);return id;},revokeObjectURL:id=>blobs.delete(id)};
  const context={window,document,crypto,structuredClone,Date,Blob,URL,setInterval(){},setTimeout:(callback,delay)=>timers.push({callback,delay}),console};vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root,'../../assets/report-tools.js'),'utf8'),context);
  for(const file of ['rubric.js','reason-evidence.js','reasoning.js','adaptive.js','sketch-lab/math.js','integrated.js'])vm.runInContext(fs.readFileSync(path.join(root,'dist',file),'utf8'),context);
  const source=fs.readFileSync(path.join(root,'dist/app.js'),'utf8').replace('  registerPageTools();','  window.testOnly={state,renderReport};\n  registerPageTools();');vm.runInContext(source,context);
  const api=window.testOnly;
  for(const id of ['C4','C10'])api.state.records[id]={id,topic:'Test',answer:{why:'Student response <keep me>'},reason:{points:null,connection:null,status:'Needs review',reviewReasons:['unknown_or_conflicting_wording']},started:1,complete:1001,attempts:[],hints:[],skip:false,lastEventId:'event-'+id,score:null};
  api.state.queue=['C4','C10'];api.state.phase='report';api.state.events=[{event_id:'event-C4',response:{raw_explanation:'Student response <keep me>'}}];api.renderReport();
  return {api,nodes,forms,downloads,blobs,timers,scrolls,app,click:id=>nodes.get('#'+id).click(),submit:id=>forms.get(id).onsubmit({preventDefault(){}}),setPopupBlocked:value=>popupBlocked=value,setDownloadBlocked:value=>downloadBlocked=value,setPrintThrows:value=>printThrows=value,get preview(){return preview;}};
}
(async()=>{
  const one=load();one.click('review-mode');one.forms.get('C4').elements.credit.value='1';one.forms.get('C4').elements.note.value='Partial reasoning.';one.submit('C4');assert.equal(one.api.state.records.C4.verifiedReason.points,1);
  const h=load(),originalSession=h.api.state.sessionId;
  h.click('review-mode');assert.equal(h.forms.size,2);assert(h.nodes.get('#review-heading').focused);
  h.forms.get('C4').elements.credit.value='2';h.forms.get('C4').elements.note.value='Correct meaning <fee> & reasoning.';
  h.forms.get('C10').elements.credit.value='1';h.forms.get('C10').elements.note.value='Keep this unsaved draft.';
  h.submit('C4');assert.equal(h.api.state.reviewed.length,1);assert.equal(h.api.state.records.C4.verifiedReason.points,2);
  assert.equal(h.forms.get('C4').elements.credit.value,'2');assert.equal(h.forms.get('C4').elements.note.value,'Correct meaning <fee> & reasoning.');
  assert.equal(h.forms.get('C10').elements.note.value,'Keep this unsaved draft.');assert.equal(h.forms.get('C10').elements.credit.value,'1');
  assert.equal(h.scrolls.at(-1).top,420);assert(h.app.innerHTML.includes('Earlier detector record'));
  h.click('review-mode');assert.equal(h.forms.size,0);h.click('review-mode');assert.equal(h.forms.get('C10').elements.note.value,'Keep this unsaved draft.');
  h.forms.get('C4').elements.note.value='   ';h.submit('C4');assert.equal(h.api.state.reviewed.length,1);assert(h.forms.get('C4').error.textContent);
  h.forms.get('C4').elements.credit.value='99';h.forms.get('C4').elements.note.value='Invalid credit';h.submit('C4');assert.equal(h.api.state.reviewed.length,1);
  h.forms.get('C4').elements.credit.value='0';h.forms.get('C4').elements.note.value='Revised judgment.';h.submit('C4');assert.equal(h.api.state.reviewed.length,2);assert.equal(h.api.state.records.C4.verifiedReason.points,0);
  h.click('download');const json=JSON.parse(await h.downloads.at(-1).blob.text());
  assert.equal(json.session_id,originalSession);assert.equal(json.events[0].response.raw_explanation,'Student response <keep me>');assert.equal(json.reviewer_decisions.length,2);assert.equal(json.records.C4.verifiedReason.points,0);assert.equal(json.reviewer_drafts.C10.note,'Keep this unsaved draft.');assert.equal(h.blobs.size,1);assert(h.timers.every(t=>t.delay>=1000));
  h.click('print');assert.equal(h.preview.opener,null);assert.equal(h.preview.printCount,0);assert(h.preview.html.includes('Questions, your work and feedback'));assert(h.preview.html.includes('Student response &lt;keep me&gt;'));assert(h.preview.html.includes('Reviewed explanation: 0/2'));assert(!h.preview.html.includes('<form'));assert(!h.preview.html.includes('<dialog'));assert(!h.preview.html.includes('id="download"'));assert(!h.preview.html.includes('id="download-printable"'));assert.equal(h.api.state.sessionId,originalSession);
  h.setPrintThrows(true);h.click('print');assert(h.nodes.get('#report-status').textContent.includes('Use Print'));h.setPrintThrows(false);
  h.setPopupBlocked(true);h.click('print');assert(h.nodes.get('#report-status').textContent.includes('blocked'));h.click('download-printable');assert(h.downloads.at(-1).filename.endsWith('.html'));assert((await h.downloads.at(-1).blob.text()).includes('Questions, your work and feedback'));
  const count=h.downloads.length;h.setDownloadBlocked(true);h.click('download');assert.equal(h.downloads.length,count);assert(h.nodes.get('#report-status').textContent.includes('could not'));h.setDownloadBlocked(false);
  h.click('restart');assert(h.nodes.get('#restart-dialog').open);assert.equal(h.api.state.sessionId,originalSession);h.click('keep-report');assert(!h.nodes.get('#restart-dialog').open);assert.equal(h.api.state.reviewed.length,2);
  h.click('restart');h.setDownloadBlocked(true);h.click('download-before-restart');assert(h.nodes.get('#restart-status').textContent.includes('could not'));h.setDownloadBlocked(false);h.click('download-before-restart');assert(h.nodes.get('#restart-dialog').open);assert.equal(h.api.state.sessionId,originalSession);h.click('confirm-restart');
  assert.equal(h.api.state.phase,'assessment');assert.notEqual(h.api.state.sessionId,originalSession);assert.equal(Object.keys(h.api.state.records).length,1);assert.equal(h.api.state.reviewed.length,0);assert.equal(Object.keys(h.api.state.reviewDrafts).length,0);assert.equal(h.api.state.queue.length,19);
  console.log(JSON.stringify({result:'passed',checks:['review drafts survive save and toggle','saved review prefilled','0/1/2 credit validation','JSON includes saved reviews and separate drafts','expanded printable report','popup and print failure feedback','download failure feedback','restart cancel/download/confirm'],scope:'callback-level; native browser print/download behavior remains unverified'}));
})().catch(error=>{console.error(error);process.exitCode=1;});

