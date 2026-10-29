import {VoiceRecorder,appendTranscript} from './recorder.js';
// Local rehearsal only. No audio upload, provider requests, or simulated transcription.
export function installVoice({language,context,onConfirmed}){
 const L=en=>en,el=(tag,text,cls)=>{const e=document.createElement(tag);e.textContent=text||'';if(cls)e.className=cls;return e;};
 document.addEventListener('quidence:speech-reviewed',event=>{if(!event.target.closest('#dialogue,#samples'))return;onConfirmed({...event.detail,field:event.target.id,rawTranscript:event.detail.rawTranscript,confirmedTranscript:event.detail.reviewedText,context:context(),kind:event.detail.kind});});
 const dialog=el('dialog',null,'voice-dialog');dialog.setAttribute('aria-labelledby','voice-title');document.body.append(dialog);
 let target=null,snapshot=null,url=null,ui={},timer;
 const messages=()=>({permission_denied:L('Microphone access was denied. You can continue typing.'),unsupported:L('Recording is unavailable in this browser. You can continue typing.'),no_microphone:L('No microphone found.'),empty_audio:L('No audio captured. Please try again.'),too_large:L('Recording exceeded 8 MB. Try a shorter answer.')});
 const recorder=new VoiceRecorder({media:navigator.mediaDevices,Recorder:globalThis.MediaRecorder,onState:({state,error,blob})=>{
  if(!dialog.open)return;clearInterval(timer);
  ui.start.disabled=['requesting','recording','stopping','ready'].includes(state);ui.stop.disabled=state!=='recording';
  ui.again.hidden=state!=='ready';
  ui.status.textContent=error?(messages()[error]||L('Recording failed. Your existing answer is safe.')):({idle:L('Start when ready. Up to 60 seconds.'),requesting:L('Waiting for microphone permission…'),stopping:L('Finishing recording…'),ready:L('Replay, then type the reasoning you want to keep.')}[state]||'');
  if(state==='recording'){const start=Date.now();const tick=()=>ui.status.textContent=L(`Recording · ${Math.min(60,Math.floor((Date.now()-start)/1000))}/60 sec`);tick();timer=setInterval(tick,500);}
  if(blob&&state==='ready'){if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(blob);ui.audio.src=url;ui.audio.hidden=false;}
 }});
 function clear(){recorder.cancel();clearInterval(timer);ui.audio?.pause();ui.audio?.removeAttribute('src');if(url)URL.revokeObjectURL(url);url=null;target=null;}
 function close(){clear();dialog.close();}
 function requestClose(){if(recorder.blob||['requesting','recording','stopping'].includes(recorder.state)||ui.note.value){ui.discard.hidden=false;ui.keep.hidden=false;ui.back.hidden=true;ui.status.textContent=L('Returning discards this recording and uninserted note. Your existing answer stays.');}else close();}
 dialog.addEventListener('cancel',e=>{e.preventDefault();requestClose();});
 function open(field){if(dialog.open||field.disabled)return;target=field;snapshot=context();dialog.replaceChildren();ui={};
  const title=el('h2',L('Say it, then shape your reasoning.'));title.id='voice-title';dialog.append(el('p','VOICE / REHEARSE YOUR THINKING','eyebrow'),title,el('p',L('Use this window for local audio playback and typed notes. For speech-to-text, choose Dictate in English beside your answer. Audio captured in this playback window stays local and is cleared when it closes.'),'voice-service'));
  ui.status=el('p','','voice-status');ui.status.setAttribute('role','status');dialog.append(ui.status);
  const actions=el('div',null,'actions');ui.start=el('button',L('● Start recording'),'primary');ui.stop=el('button',L('■ Stop recording'),'secondary');ui.again=el('button',L('Discard and record again'),'quiet');ui.stop.disabled=true;ui.again.hidden=true;actions.append(ui.start,ui.stop,ui.again);dialog.append(actions);
  ui.audio=el('audio');ui.audio.controls=true;ui.audio.hidden=true;dialog.append(ui.audio);
  const label=el('label',L('Type the reasoning you want to keep (not automatic transcription)'),'field');label.htmlFor='voice-note';ui.note=el('textarea');ui.note.id='voice-note';ui.note.maxLength=2000;dialog.append(label,ui.note);
  const confirm=el('button',L('Confirm wording and append to my answer'),'primary');confirm.disabled=true;ui.note.oninput=()=>confirm.disabled=!ui.note.value.trim();dialog.append(confirm);
  const end=el('div',null,'actions');ui.back=el('button',L('Back to my answer'),'quiet');ui.discard=el('button',L('Discard and return'),'secondary');ui.keep=el('button',L('Keep working'),'primary');ui.discard.hidden=ui.keep.hidden=true;end.append(ui.back,ui.discard,ui.keep);dialog.append(end);
  ui.start.onclick=()=>recorder.start();ui.stop.onclick=()=>recorder.stop();ui.again.onclick=()=>{recorder.cancel();ui.audio.pause();ui.audio.removeAttribute('src');ui.audio.hidden=true;if(url)URL.revokeObjectURL(url);url=null;};ui.back.onclick=requestClose;ui.discard.onclick=close;ui.keep.onclick=()=>{ui.discard.hidden=ui.keep.hidden=true;ui.back.hidden=false;};
  confirm.onclick=()=>{if(!target?.isConnected||target.disabled)return;try{const text=ui.note.value;target.value=appendTranscript(target.value,text);target.dispatchEvent(new Event('input',{bubbles:true}));onConfirmed({field:target.id,rawTranscript:text,confirmedTranscript:text,context:snapshot,kind:'transcription_correction'});const original=target;close();original.focus();}catch{ui.status.textContent=L('This would exceed 2,000 characters. Your existing answer is safe; shorten the note first.');}};
  dialog.showModal();recorder.emit('idle');
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden)recorder.stop();});window.addEventListener('pagehide',clear);window.addEventListener('beforeunload',e=>{if(dialog.open&&(recorder.blob||['recording','requesting'].includes(recorder.state)||ui.note.value)){e.preventDefault();e.returnValue='';}});
 return{attach(){document.querySelectorAll('#dialogue textarea:not([disabled])').forEach(field=>{const b=el('button',L('Audio playback only'),'secondary voice-entry');const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');icon.setAttribute('viewBox','0 0 20 20');icon.setAttribute('aria-hidden','true');icon.innerHTML='<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="7" y="2" width="6" height="10" rx="3"/><path d="M4 9a6 6 0 0 0 12 0M10 15v3M7 18h6"/></g>';b.prepend(icon);b.type='button';b.onclick=()=>open(field);field.after(b);});},cancelReview(){},reviewBox(){const e=el('div');e.hidden=true;return e;}};
}
