'use strict';
const net = require('node:net');
const {createHash}=require('node:crypto');
const {PRINT_SCRIPT}=require('../assets/report-tools.js');
const PRINT_HASH=createHash('sha256').update(PRINT_SCRIPT).digest('base64');
const CONTENT_SECURITY_POLICY="default-src 'self'; script-src 'self' 'sha256-"+PRINT_HASH+"'; script-src-attr 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'self'; form-action 'self'";
const fail = (status,message) => Object.assign(new Error(message),{status});
// Bounded FIFO: strong hashes share a small memory budget instead of rejecting
// the third student. A disconnected request never starts a queued hash.
function hashQueue({concurrency=2,maxQueued=64,waitMs=30000}={}) {
 let running=0,closed=false;const queue=[];
 function cleanup(job){clearTimeout(job.timer);job.signal?.removeEventListener('abort',job.cancel);}
 function rejectQueued(job,error){const i=queue.indexOf(job);if(i<0)return;queue.splice(i,1);cleanup(job);job.reject(error);}
 function pump(){while(!closed&&running<concurrency&&queue.length){const job=queue.shift();cleanup(job);if(job.signal?.aborted){job.reject(fail(499,'Request cancelled.'));continue;}running++;Promise.resolve().then(()=>{if(job.signal?.aborted)throw fail(499,'Request cancelled.');return job.work();}).then(value=>{if(job.signal?.aborted)throw fail(499,'Request cancelled.');return value;}).then(job.resolve,job.reject).finally(()=>{running--;pump();});}}
 function schedule(work,signal){if(closed)return Promise.reject(fail(503,'Account service is restarting. Please try again.'));if(signal?.aborted)return Promise.reject(fail(499,'Request cancelled.'));if(running>=concurrency&&queue.length>=maxQueued)return Promise.reject(fail(503,'The account queue is full. Please try again shortly.'));return new Promise((resolve,reject)=>{const job={work,resolve,reject,signal};job.cancel=()=>rejectQueued(job,fail(499,'Request cancelled.'));job.timer=setTimeout(()=>rejectQueued(job,fail(503,'The account queue took too long. Please try again.')),waitMs);signal?.addEventListener('abort',job.cancel,{once:true});queue.push(job);pump();});}
 return{schedule,close(){closed=true;for(const job of queue.splice(0)){cleanup(job);job.reject(fail(503,'Account service is restarting. Please try again.'));}},stats:()=>({running,queued:queue.length})};
}
function ipValue(input){let address=String(input||'').toLowerCase();if(address.startsWith('::ffff:')&&net.isIP(address.slice(7))===4)address=address.slice(7);const kind=net.isIP(address);if(kind===4)return{bits:32,value:address.split('.').reduce((a,n)=>(a<<8n)+BigInt(n),0n),address};if(kind!==6)return null;const halves=address.split('::');if(halves.length>2)return null;function groups(part){if(!part)return[];const out=[];for(const g of part.split(':')){if(g.includes('.')){const v=ipValue(g);if(!v||v.bits!==32)throw Error('Invalid IPv6 address');out.push(Number(v.value>>16n),Number(v.value&65535n));}else out.push(parseInt(g,16));}return out;}const a=groups(halves[0]),b=groups(halves[1]||'');const out=halves.length===2?[...a,...Array(8-a.length-b.length).fill(0),...b]:a;if(out.length!==8)return null;return{bits:128,value:out.reduce((v,n)=>(v<<16n)+BigInt(n),0n),address};}
function trustedClients(input='') {const ranges=String(input).split(',').map(s=>s.trim()).filter(Boolean).map(cidr=>{const [address,prefix,...extra]=cidr.split('/'),v=ipValue(address),n=prefix===undefined?v?.bits:Number(prefix);if(!v||extra.length||!/^\d+$/.test(String(n))||n<0||n>v.bits||n===0)throw Error('TRUSTED_PROXY_CIDRS must contain explicit non-universal IP networks.');return{...v,prefix:n};});
 const trusted=address=>{const v=ipValue(address);return!!v&&ranges.some(r=>r.bits===v.bits&&(r.value>>BigInt(r.bits-r.prefix))===(v.value>>BigInt(v.bits-r.prefix)));};
 return req=>{const socket=ipValue(req.socket.remoteAddress)?.address||'unknown';if(!trusted(socket))return socket;const text=req.headers['x-forwarded-for'];if(typeof text!=='string'||text.length>1024)return socket;const hops=text.split(',').map(s=>ipValue(s.trim()));if(hops.length>16||hops.some(x=>!x))return socket;let current=socket;for(let i=hops.length-1;i>=0&&trusted(current);i--)current=hops[i].address;return current;};
}
module.exports={hashQueue,trustedClients,CONTENT_SECURITY_POLICY};
