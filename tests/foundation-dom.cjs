'use strict';
const decode=s=>s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
class Element{
 constructor(tag='div',attrs={}){this.tagName=tag.toUpperCase();this.type=attrs.type||'';this.attrs=attrs;this.id=attrs.id;this.name=attrs.name;this.dataset={};for(const[k,v]of Object.entries(attrs))if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;this.children=[];this.events={};this.value=attrs.value||'';this.checked='checked'in attrs;this.disabled='disabled'in attrs;this.textContent='';}
 set innerHTML(s){this.html=s;this.children=[];const stack=[this];for(const m of s.matchAll(/<\/?([\w-]+)([^>]*?)>/g)){const tag=m[1];if(m[0].startsWith('</')){if(stack.length>1)stack.pop();continue;}const attrs={};for(const a of m[2].matchAll(/([\w-]+)(?:="([^"]*)")?/g))attrs[a[1]]=decode(a[2]||'');const el=new Element(tag,attrs);el.parent=stack.at(-1);stack.at(-1).children.push(el);if(tag==='textarea'){const end=s.indexOf('</textarea>',m.index);el.value=decode(s.slice(m.index+m[0].length,end));}if(!['input','br','hr','img','link','meta','path','circle','rect'].includes(tag))stack.push(el);}for(const el of this.all().filter(x=>x.tagName==='SELECT'))el.value=(el.children.find(x=>'selected'in x.attrs)||el.children[0])?.value||'';}
 get innerHTML(){return this.html||'';} hasAttribute(k){return k in this.attrs;} select(){this.selected=true;}
 all(){return this.children.flatMap(x=>[x,...x.all()]);}
 matches(s){if(s.endsWith(':checked'))return this.checked&&this.matches(s.slice(0,-8));if(s.startsWith('#'))return this.attrs.id===s.slice(1);const a=s.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);if(a)return a[1]in this.attrs&&(a[2]===undefined||this.attrs[a[1]]===a[2]);return this.tagName===s.toUpperCase();}
 querySelectorAll(s){return this.all().filter(x=>x.matches(s));}querySelector(s){return this.querySelectorAll(s)[0]||null;}
 closest(s){return this.matches(s)?this:this.parent?.closest(s)||null;}
 removeAttribute(k){delete this.attrs[k];if(k==='href')delete this.href;}
 setAttribute(k,v){this.attrs[k]=String(v);}addEventListener(type,callback){this.events[type]=callback;}focus(){this.focused=true;}appendChild(e){this.children.push(e);e.parent=this;}remove(){this.parent.children=this.parent.children.filter(x=>x!==this);}click(){}showModal(){this.open=true;}close(){this.open=false;}
}

module.exports=Element;

