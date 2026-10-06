(function(root,factory){const api=factory(root);if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceReportTools=api;})(typeof window==='object'?window:globalThis,root=>{
'use strict';
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const quote=s=>String(s??'').split('\n').map(x=>'> '+x).join('\n');
const styles=`*{box-sizing:border-box}body{max-width:850px;margin:28px auto;padding:0 24px;color:#203347;font:14px/1.5 system-ui,sans-serif}h1{font-size:24px;line-height:1.2}h2{font-size:18px;margin:22px 0 10px}h3{font-size:15px;margin:12px 0 6px}p{margin:6px 0}section{margin:12px 0}.report-item{border-top:1px solid #cad6e1;padding:10px 0;break-inside:avoid}.question-text{color:#2147a0}.student-work{color:#203347;border-left:3px solid #6689c0;padding:8px 12px;white-space:pre-wrap;overflow-wrap:anywhere;background:#f3f6fc}.report-feedback{color:#096357;border-left:3px solid #408879;padding:8px 12px;background:#eff7f4}.needs-check{color:#8b460e}ul{margin:7px 0;padding-left:22px}li{margin:4px 0}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit}summary{font-weight:650}details{margin:8px 0}.toolbar{border-bottom:1px solid #cad6e1;padding-bottom:16px;display:flex;flex-wrap:wrap;gap:14px;align-items:center}button{font:inherit;padding:10px 16px;border:1px solid #447568;border-radius:7px;background:white;color:#203347;cursor:pointer}.report-meta{font-size:11px;color:#536678}h2,h3{break-after:avoid}a{color:#2147a0}@page{margin:14mm}@media print{body{max-width:none;margin:0;padding:0;font-size:10.5pt;line-height:1.4}.toolbar{display:none}h1{font-size:19pt}h2{font-size:13pt}h3{font-size:11pt}.student-work,.report-feedback{background:transparent}p,li{orphans:3;widows:3}}`;
// Only this fixed script is permitted by the server CSP hash. Student text is escaped.
const PRINT_SCRIPT="document.querySelector('[data-print-report]').addEventListener('click',function(){window.print();});";
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
 out+=text?String(text)+'\n\n':'The complete question, answer and support record is included below.\n\n';
 // Retain the complete portable record when a module only provides prose.
 if(!payload.markdown&&!String(text).startsWith('#')){
  const record=JSON.stringify(payload,null,2);const fence='`'.repeat(Math.max(3,...[...record.matchAll(/`+/g)].map(x=>x[0].length+1)));
  out+=`## Complete learning record\n\n${fence}json\n${record}\n${fence}\n`;
 }
 return out;
}
function printable(subject,payload,request=''){
 return documentHtml('Quidence · '+subject,`<header><h1>${escape(subject)}</h1><p class="report-meta">Quidence learning report</p></header>${request?`<section class="report-feedback"><h2>Next conversation</h2><p>${escape(request)}</p></section>`:''}<section>${markdownBody(reportText(payload.markdown||payload.reportText||'The complete learning record is available in your Markdown export.'))}</section>`);
}
function markdownBody(text){
 const lines=String(text).split('\n'),out=[];let quoteLines=[],code=false,codeLines=[];
 const flush=()=>{if(quoteLines.length){out.push('<div class="student-work">'+escape(quoteLines.join('\n'))+'</div>');quoteLines=[];}};
 for(const line of lines){
  if(/^`{3,}/.test(line)){flush();if(code){out.push('<pre class="student-work">'+escape(codeLines.join('\n'))+'</pre>');codeLines=[];}code=!code;continue;}
  if(code){codeLines.push(line);continue;}
  if(/^> ?/.test(line)){quoteLines.push(line.replace(/^> ?/,''));continue;}
  flush();const heading=line.match(/^(#{1,4})\s+(.+)$/);
  if(heading){const level=Math.min(3,heading[1].length);out.push(`<h${level}>${escape(heading[2])}</h${level}>`);}
  else if(line.trim()){const cls=/^(?:Reference|Next|Feedback|Result|Local review|Current component)/i.test(line)?'report-feedback':/^(?:Question|Reasoning prompt)/i.test(line)?'question-text':/^(?:Attempt|Student explanation|Explanation)/i.test(line)?'student-work':'';out.push(`<p${cls?' class="'+cls+'"':''}>${escape(line)}</p>`);}
 }
 flush();if(codeLines.length)out.push('<pre class="student-work">'+escape(codeLines.join('\n'))+'</pre>');return out.join('\n');
}
async function copy(text,target){
 try{if(root.navigator?.clipboard?.writeText){await root.navigator.clipboard.writeText(text);return true;}}catch{}
 if(target){target.hidden=false;target.value=text;target.focus?.();target.select?.();}
 return false;
}
function attach(host,subject,payload,request=''){
 if(!root.document||!host?.appendChild)return;
 const box=root.document.createElement('section');box.className='report-handoff';
 box.innerHTML='<h3>Continue with your learning record</h3><div class="report-handoff-actions"><button type="button" data-report-copy>Copy Markdown report</button><button type="button" data-report-print>Open PDF report</button><a href="https://chatgpt.com/" target="_blank" rel="noopener">Open ChatGPT ↗</a><a href="https://claude.ai/" target="_blank" rel="noopener">Open Claude ↗</a></div><p>Review the copied record and remove names, school, contact details and other personal information before sharing. Nothing is sent to an external tutor by Quidence. ChatGPT requires age 13 or the local minimum age, and parent or guardian permission under 18. Claude’s consumer service requires age 18 or the higher local minimum. Check the provider’s current terms. You can review with a teacher or keep working here.</p><p data-report-status role="status"></p><label data-report-fallback hidden>Markdown report<textarea rows="8" readonly></textarea></label>';
 host.appendChild(box);
 // Simple test DOMs may not implement nested querying.
 if(!box.querySelector)return;
 const status=box.querySelector('[data-report-status]'),fallback=box.querySelector('[data-report-fallback]'),area=box.querySelector('textarea');
 box.querySelector('[data-report-copy]').onclick=async()=>{
  const ok=await copy(markdown(subject,payload,request),area);fallback.hidden=ok;
  status.textContent=ok?'Markdown copied. Paste it into your AI tutor conversation.':'Use your device’s Copy command on the selected Markdown below.';
 };
 box.querySelector('[data-report-print]').onclick=()=>{
  try{status.textContent=openPrint(printable(subject,payload,request))?'Your report opened in a new tab. Use Print / save as PDF there.':'The report tab was blocked. Allow pop-ups or copy the Markdown report.';}catch{status.textContent='The report tab could not open. Copy your Markdown report below.';}
 };
}
return{escape,quote,reportText,styles,PRINT_SCRIPT,documentHtml,openPrint,markdown,markdownBody,printable,copy,attach};
});
