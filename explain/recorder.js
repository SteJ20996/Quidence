// Media lifecycle is separate from the interface so permission races can be tested.
export class VoiceRecorder {
  constructor({media, Recorder, onState=()=>{}, limitMs=60000, maxBytes=8*1024*1024}) {
    Object.assign(this,{media,Recorder,onState,limitMs,maxBytes});
    this.state='idle'; this.generation=0; this.blob=null;
  }
  emit(state,error=''){this.state=state;this.onState({state,error,blob:this.blob});}
  release(){clearTimeout(this.timer);this.stream?.getTracks().forEach(t=>t.stop());this.stream=null;}
  async start(){
    if(['requesting','recording','stopping'].includes(this.state))return;
    const id=++this.generation; this.blob=null;
    if(!this.media?.getUserMedia||!this.Recorder){this.emit('error','unsupported');return;}
    this.emit('requesting');
    try{
      const stream=await this.media.getUserMedia({audio:true});
      if(id!==this.generation){stream.getTracks().forEach(t=>t.stop());return;}
      this.stream=stream;
      const mime=['audio/webm;codecs=opus','audio/mp4','audio/webm'].find(m=>this.Recorder.isTypeSupported(m));
      if(!mime)throw Object.assign(new Error(),{name:'NotSupportedError'});
      const recorder=new this.Recorder(stream,{mimeType:mime});this.recorder=recorder;
      const chunks=[];let size=0,failed=false;
      recorder.ondataavailable=e=>{if(id!==this.generation||!e.data.size)return;size+=e.data.size;if(size>this.maxBytes){failed=true;this.stop();}else chunks.push(e.data);};
      recorder.onerror=()=>{if(id===this.generation){++this.generation;this.release();try{recorder.stop();}catch{}this.emit('error','recording_failed');}};
      recorder.onstop=()=>{if(id!==this.generation)return;this.release();
        if(failed){this.emit('error','too_large');return;}
        const blob=new Blob(chunks,{type:recorder.mimeType||mime});
        if(!blob.size){this.emit('error','empty_audio');return;}
        this.blob=blob;this.emit('ready');
      };
      recorder.start(250);this.emit('recording');this.timer=setTimeout(()=>this.stop(),this.limitMs);
    }catch(e){if(id!==this.generation)return;this.release();this.emit('error',e.name==='NotAllowedError'?'permission_denied':e.name==='NotFoundError'?'no_microphone':e.name==='NotSupportedError'?'unsupported':'recording_failed');}
  }
  stop(){if(this.state!=='recording')return;this.emit('stopping');clearTimeout(this.timer);try{this.recorder.stop();}catch{this.emit('error','recording_failed');}finally{this.release();}}
  cancel(){++this.generation;clearTimeout(this.timer);try{if(this.recorder?.state==='recording')this.recorder.stop();}catch{}this.release();this.recorder=null;this.blob=null;this.emit('idle');}
}
export function appendTranscript(existing,text,max=2000){
  if(typeof text!=='string'||!text.trim())throw Error('empty_transcript');
  const combined=existing?existing+'\n'+text:text;
  if(combined.length>max)throw Error('too_long');
  return combined;
}
