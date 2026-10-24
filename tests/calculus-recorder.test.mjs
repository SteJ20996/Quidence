import {test} from 'node:test';
import assert from 'node:assert/strict';
import {VoiceRecorder,appendTranscript} from '../modules/ad01/dist/think/recorder.js';
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};};
function fixture(media,options={}){
 const tracks=[{stops:0,stop(){this.stops++;}}],stream={getTracks:()=>tracks},events=[];
 class FakeRecorder{
  static isTypeSupported(m){return m==='audio/webm;codecs=opus';}
  constructor(s,o){this.state='inactive';this.mimeType=o.mimeType;}
  start(){this.state='recording';}
  stop(){this.state='inactive';this.ondataavailable?.({data:new Blob(['audio'])});queueMicrotask(()=>this.onstop?.());}
 }
 const r=new VoiceRecorder({media:media||{getUserMedia:async()=>stream},Recorder:FakeRecorder,onState:e=>events.push(e),...options});return {r,stream,tracks,events};
}
test('permission denial keeps text entry possible and records no audio',async()=>{
 const {r,events}=fixture({getUserMedia:async()=>{throw new DOMException('denied','NotAllowedError');}});await r.start();assert.equal(r.blob,null);assert.equal(events.at(-1).error,'permission_denied');
});
test('late permission after closing immediately releases the microphone',async()=>{
 const d=deferred(),f=fixture({getUserMedia:()=>d.promise});const pending=f.r.start();f.r.cancel();d.resolve(f.stream);await pending;assert.equal(f.tracks[0].stops,1);assert.equal(f.r.state,'idle');assert.equal(f.r.blob,null);
});
test('double start is ignored, double stop is safe, and tracks stop before transcription',async()=>{
 let calls=0;const d=deferred(),f=fixture({getUserMedia:()=>{calls++;return d.promise;}});const a=f.r.start(),b=f.r.start();d.resolve(f.stream);await Promise.all([a,b]);assert.equal(calls,1);f.r.stop();f.r.stop();await Promise.resolve();assert.equal(f.r.state,'ready');assert.equal(f.tracks[0].stops,1);assert.ok(f.r.blob.size);f.r.cancel();assert.equal(f.r.blob,null);
});
test('timer limit stops recording and cancellation ignores late chunks',async()=>{
 const f=fixture(undefined,{limitMs:5});await f.r.start();await new Promise(r=>setTimeout(r,15));assert.equal(f.r.state,'ready');assert.equal(f.tracks[0].stops,1);
 const g=fixture();await g.r.start();g.r.cancel();await Promise.resolve();assert.equal(g.r.state,'idle');assert.equal(g.r.blob,null);assert.equal(g.tracks[0].stops,1);
});
test('transcript insertion appends without rewriting or overflowing existing text',()=>{
 assert.equal(appendTranscript('原本理由','不是向前。'),'原本理由\n不是向前。');assert.throws(()=>appendTranscript('x'.repeat(1999),'yy'));assert.throws(()=>appendTranscript('original','  '));
});
