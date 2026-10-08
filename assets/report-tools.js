(function(root,factory){const api=factory(root);if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceReportTools=api;})(typeof window==='object'?window:globalThis,root=>{
'use strict';
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const quote=s=>String(s??'').split('\n').map(x=>'> '+x).join('\n');
const LEARNING_CRITERION='Use this request alongside the recorded answers to discuss progress and choose next steps. Explain which parts this activity checked, what evidence relates to the request, and what remains to be explored. The request does not change fixed answer checks.';
function learningRequest(payload){const r=payload?.learningRequest;return r?.schema==='quidence_report_learning_request_v1'&&typeof r.subject==='string'&&typeof r.text==='string'&&r.text.trim()&&r.text.length<=3000?r:null;}
function learningRequestMarkdown(payload){const r=learningRequest(payload);return r?'## Your learning focus\n\nYou asked for this request to be used as a criterion in this report:\n\n'+quote(r.text)+'\n\n'+LEARNING_CRITERION+'\n\n':'';}
function learningRequestHtml(payload){const r=learningRequest(payload);return r?'<section class="report-learning-focus" aria-label="Your learning focus"><h2>Your learning focus</h2><p>You asked for this request to be used as a criterion in this report:</p><div class="student-work">'+escape(r.text)+'</div><p>'+escape(LEARNING_CRITERION)+'</p></section>':'';}
const styles=`*{box-sizing:border-box}body{max-width:850px;margin:28px auto;padding:0 24px;color:#203347;font:14px/1.5 system-ui,sans-serif}h1{font-size:24px;line-height:1.2}h2{font-size:18px;margin:22px 0 10px}h3{font-size:15px;margin:12px 0 6px}p{margin:6px 0}section{margin:12px 0}.report-item{border-top:1px solid #cad6e1;padding:10px 0;break-inside:avoid}.question-text{color:#2147a0}.student-work{color:#203347;border-left:3px solid #6689c0;padding:8px 12px;white-space:pre-wrap;overflow-wrap:anywhere;background:#f3f6fc}.report-feedback{color:#096357;border-left:3px solid #408879;padding:8px 12px;background:#eff7f4}.needs-check{color:#8b460e}ul{margin:7px 0;padding-left:22px}li{margin:4px 0}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit}summary{font-weight:650}details{margin:8px 0}.toolbar{border-bottom:1px solid #cad6e1;padding-bottom:16px;display:flex;flex-wrap:wrap;gap:14px;align-items:center}button{font:inherit;padding:10px 16px;border:1px solid #447568;border-radius:7px;background:white;color:#203347;cursor:pointer}.report-meta{font-size:11px;color:#536678}h2,h3{break-after:avoid}.report-drawing{margin:18px 0;break-inside:avoid}.report-drawing svg{display:block;width:100%;max-width:360px;height:auto}.report-drawing figcaption{font-weight:600;margin-bottom:8px}a{color:#2147a0}@page{margin:14mm}@media print{body{max-width:none;margin:0;padding:0;font-size:10.5pt;line-height:1.4}.toolbar{display:none}h1{font-size:19pt}h2{font-size:13pt}h3{font-size:11pt}.student-work,.report-feedback{background:transparent}p,li{orphans:3;widows:3}}`;
// Only this fixed script is permitted by the server CSP hash. Student text is escaped.
const PRINT_SCRIPT="document.querySelector('[data-print-report]').addEventListener('click',function(){window.print();});";
function drawingEntries(payload){const p=root.QuidenceProjectTools||(typeof module==='object'&&module.exports?require('./project-tools.js'):null);return p?p.reportDrawings(payload):[];}
function drawingFigure(d){const p=root.QuidenceProjectTools||(typeof module==='object'&&module.exports?require('./project-tools.js'):null);return'<figure class="report-drawing"><figcaption>'+escape(d.title)+'</figcaption>'+p.svg(d.spec,d.drawing)+'<p>'+escape(p.fieldTypes.drawing.text(d.spec,d.drawing))+'</p></figure>';}
function documentHtml(title,body){return`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title><style>${styles}</style></head><body><div class="toolbar"><button type="button" data-print-report>Print / save as PDF</button><p>Choose Save as PDF. Close this tab to return to your activity.</p></div>${body}<script>${PRINT_SCRIPT}</script></body></html>`;}
function openPrint(html){
 const tab=root.open('','_blank');if(!tab)return false;
 tab.opener=null;tab.document.open();tab.document.write(html);tab.document.close();tab.focus?.();
 // Printing is started by a click inside the report tab. Never synchronously
 // invoke another window's modal print dialog from the activity page.
 return true;
}
// Rebrand generated headings for display only; never rewrite saved student work.
function reportText(text){return String(text).replace(/^(#{1,4}\s+)Cluevera(?=\s*[·:]|\s*$)/gm,'$1Quidence');}
function markdown(subject,payload,request=''){
 const text=reportText(payload.markdown||payload.reportText||'');
 let out=`# Quidence · ${subject}\n\n`+(request?`## Request for an AI tutor\n\n${request}\n\n`:'');
 out+=learningRequestMarkdown(payload);
 out+=text?String(text)+'\n\n':'The complete question, answer and support record is included below.\n\n';
 const allDrawings=drawingEntries(payload),drawings=allDrawings.filter(d=>!out.includes(']('+d.filename+')'));
 if(drawings.length)out+='## Student drawings\n\n'+drawings.map(d=>'!['+d.title.replace(/[\[\]\n]/g,' ')+']('+d.filename+')\n\n').join('');
 if(allDrawings.length)out+='The SVG files are included in Download report with drawings. Keep them beside this Markdown file to display the images. The PDF report includes the diagrams directly.\n\n';
 // Retain the complete portable record when a module only provides prose.
 if(!payload.markdown&&!String(text).startsWith('#')){
  const record=JSON.stringify(payload,null,2);const fence='`'.repeat(Math.max(3,...[...record.matchAll(/`+/g)].map(x=>x[0].length+1)));
  out+=`## Complete learning record\n\n${fence}json\n${record}\n${fence}\n`;
 }
 return out;
}
function printable(subject,payload,request=''){
 // Older snapshots may not have prose. Print their complete preserved record,
 // rather than silently producing a page without the questions and answers.
 const text=payload.markdown||payload.reportText||markdown(subject,{...payload,learningRequest:undefined});
 return documentHtml('Quidence · '+subject,`<header><h1>${escape(subject)}</h1><p class="report-meta">Quidence learning report</p></header>${learningRequestHtml(payload)}${request?`<section class="report-feedback"><h2>Next conversation</h2><p>${escape(request)}</p></section>`:''}<section>${markdownBody(reportText(text),drawingEntries(payload))}</section>`);
}
function summaryBody(subject,payload,standalone=true){
 const brief=payload.studentSummary;if(!brief||!Array.isArray(brief.matched)||!Array.isArray(brief.checks))return'';
 const list=items=>'<ul>'+items.map(x=>'<li><strong>'+escape(x.title)+'</strong>: '+escape(x.detail)+(x.next?'<p>'+escape(x.next)+'</p>':'')+'</li>').join('')+'</ul>';
 const h=standalone?'h2':'h3',title=standalone?'<h1>'+escape(subject)+' · Your next conversation</h1>':'<h3>Your next conversation</h3>';
 return'<header>'+title+'<p class="report-meta">Quidence student summary · '+escape(payload.check||'')+'</p>'+(brief.overview?'<p>'+escape(brief.overview)+'</p>':'')+'</header>'+learningRequestHtml(payload)+'<section><'+h+'>Matching answer components</'+h+'>'+(brief.matched.length?list(brief.matched):'<p>No matching fixed components are available in this record.</p>')+'<'+h+'>One or two things to check next</'+h+'>'+(brief.checks.length?list(brief.checks):'<p>No specific next check was selected. Ask about a new task before making a broader claim.</p>')+'</section><section><'+h+'>How to read this summary</'+h+'><p>Matching fixed answers do not verify the explanation or establish mastery. Unreviewed reasoning is missing verification, not an established mistake.</p><p>'+escape(brief.selection)+'</p><p>The full report retains the questions, calculations, drawings, original explanations, support context and earlier attempts. Read that evidence with your teacher or tutor before choosing a learning priority.</p></section>';
}
function printableSummary(subject,payload){const body=summaryBody(subject,payload);return body?documentHtml('Quidence · '+subject+' · Student summary',body):null;}
function packageFiles(subject,payload,request=''){
 const p=root.QuidenceProjectTools||(typeof module==='object'&&module.exports?require('./project-tools.js'):null);
 return [{name:'Quidence_Report.md',content:markdown(subject,payload,request)},{name:'Quidence_Report.html',content:printable(subject,payload,request)},...drawingEntries(payload).map(d=>({name:d.filename,content:p.svg(d.spec,d.drawing)}))];
}
function markdownBody(text,drawings=[]){
 const lines=String(text).split('\n'),out=[],used=new Set();let quoteLines=[],code=false,codeLines=[];
 const flush=()=>{if(quoteLines.length){out.push('<div class="student-work">'+escape(quoteLines.join('\n'))+'</div>');quoteLines=[];}};
 for(const line of lines){
  if(/^`{3,}/.test(line)){flush();if(code){out.push('<pre class="student-work">'+escape(codeLines.join('\n'))+'</pre>');codeLines=[];}code=!code;continue;}
  if(code){codeLines.push(line);continue;}
  if(/^> ?/.test(line)){quoteLines.push(line.replace(/^> ?/,''));continue;}
  flush();const heading=line.match(/^(#{1,4})\s+(.+)$/);
  if(heading){const level=Math.min(3,heading[1].length);out.push(`<h${level}>${escape(heading[2])}</h${level}>`);}
  else if(/^!\[/.test(line)&&drawings.some(d=>line.endsWith(']('+d.filename+')'))){const d=drawings.find(d=>line.endsWith(']('+d.filename+')'));out.push(drawingFigure(d));used.add(d.filename);}
  else if(line.trim()){const cls=/^(?:Reference|Next|Feedback|Result|Local review|Current component)/i.test(line)?'report-feedback':/^(?:Question|Reasoning prompt)/i.test(line)?'question-text':/^(?:Attempt|Student explanation|Explanation)/i.test(line)?'student-work':'';out.push(`<p${cls?' class="'+cls+'"':''}>${escape(line)}</p>`);}
 }
 flush();if(codeLines.length)out.push('<pre class="student-work">'+escape(codeLines.join('\n'))+'</pre>');const remaining=drawings.filter(d=>!used.has(d.filename));if(remaining.length)out.push('<h2>Student drawings</h2>'+remaining.map(drawingFigure).join(''));return out.join('\n');
}
async function copy(text,target){
 try{if(root.navigator?.clipboard?.writeText){await root.navigator.clipboard.writeText(text);return true;}}catch{}
 if(target){target.hidden=false;target.value=text;target.focus?.();target.select?.();}
 return false;
}
function attach(host,subject,payload,request=''){
 if(!root.document||!host?.appendChild)return;
 const box=root.document.createElement('section');box.className='report-handoff';
 box.innerHTML=learningRequestHtml(payload)+'<h3>Discuss your work with a teacher or tutor</h3><div class="report-handoff-actions">'+(payload.studentSummary?'<button type="button" data-report-summary>Open student summary PDF</button>':'')+'<button type="button" data-report-copy>Copy Markdown report</button><button type="button" data-report-print>Open full PDF report</button><a href="https://chatgpt.com/" target="_blank" rel="noopener">Open ChatGPT ↗</a><a href="https://claude.ai/" target="_blank" rel="noopener">Open Claude ↗</a></div><p>Review the copied record and remove names, school, contact details and other personal information before sharing. Nothing is sent to an external tutor by Quidence. ChatGPT requires age 13 or the local minimum age, and parent or guardian permission under 18. Claude’s consumer service requires age 18 or the higher local minimum. Provider terms checked October 7, 2026. ChatGPT and Claude are products of OpenAI and Anthropic; Quidence is not affiliated with either provider. Check the provider’s current terms. You can review with a teacher or keep working here.</p><p data-report-status role="status"></p><label data-report-fallback hidden>Markdown report<textarea rows="8" readonly></textarea></label>';
 host.appendChild(box);
 // Simple test DOMs may not implement nested querying.
 if(!box.querySelector)return;
 const status=box.querySelector('[data-report-status]'),fallback=box.querySelector('[data-report-fallback]'),area=box.querySelector('textarea');
 const summaryButton=box.querySelector('[data-report-summary]');if(summaryButton)summaryButton.onclick=()=>{try{const html=printableSummary(subject,payload);status.textContent=html&&openPrint(html)?'Your summary opened in a separate tab. Print it there; the full report keeps all evidence.':'The summary tab could not open. Use the full report below.';}catch{status.textContent='The summary could not open. Use the full report below.';}};
 box.querySelector('[data-report-copy]').onclick=async()=>{
  const ok=await copy(markdown(subject,payload,request),area);fallback.hidden=ok;
  status.textContent=ok?'Markdown copied. Paste it into your AI tutor conversation.':'Use your device’s Copy command on the selected Markdown below.';
 };
 box.querySelector('[data-report-print]').onclick=()=>{
  try{status.textContent=openPrint(printable(subject,payload,request))?'Your report opened in a new tab. Use Print / save as PDF there.':'The report tab was blocked. Allow pop-ups or copy the Markdown report.';}catch{status.textContent='The report tab could not open. Copy your Markdown report below.';}
 };
}
return{escape,quote,learningRequestMarkdown,learningRequestHtml,reportText,styles,PRINT_SCRIPT,documentHtml,openPrint,markdown,markdownBody,printable,summaryBody,printableSummary,packageFiles,copy,attach};
});
