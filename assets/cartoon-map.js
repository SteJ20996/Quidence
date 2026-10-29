(function(root){'use strict';
const host=document.getElementById('cartoon-knowledge-map');if(!host)return;
const tr=(en,es)=>({en,es});
const maps=root.QuidenceCartoonMapData.maps,icon=root.QuidenceCartoonArt.icon;
let lang=root.QuidenceI18n?.locale==='es'?'es':'en',activeMap='all';
const selected={},W=200,H=124,routes={};
const t=v=>v[lang];const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const strings={
 nav:tr('Knowledge map','Mapa de conocimientos'),puzzle:tr('A little puzzle break','Una pausa con juegos'),
 eyebrow:tr('Three connected worlds · design preview','Tres mundos conectados · vista previa'),
 title:tr('Mathematics & Physics Knowledge Map','Mapa de conocimientos de matemáticas y física'),
 subtitle:tr('Find a starting point. Follow a connection. Build your own route.','Encuentra un punto de partida. Sigue una conexión. Construye tu propia ruta.'),
 all:tr('All','Todas'),style:tr('Preview style','Estilo de vista previa'),course:tr('COURSE','CURSO'),concept:tr('CONCEPT','CONCEPTO'),branch:tr('EXPLORE','EXPLORAR'),bridge:tr('CONNECTION','CONEXIÓN'),
 courseCount:tr('course entrances','entradas a cursos'),keyCourse:tr('Available course','Curso disponible'),keyConcept:tr('Concept / later direction','Concepto / área posterior'),keySolid:tr('Common foundation','Base habitual'),keyRelated:tr('Useful connection','Conexión útil'),
 details:tr('Selected on the map','Selección en el mapa'),hint:tr('Swipe the map sideways to explore →','Desliza el mapa para explorar →'),
 footer:tr('Click a node to explore its connections. These paths are guides, not compulsory prerequisites.','Selecciona un nodo para explorar sus conexiones. Las rutas orientan; no son requisitos obligatorios.'),
 version:tr('Map preview · Website unchanged','Vista previa · Sitio sin cambios')
};
function route(m,a,b){
 if(m.id==='science'&&a.id==='thermal'&&b.id==='materials'){
  const points=[[940,302],[954,302],[954,733],[1080,733],[1080,714]];
  return {points,path:points.map((p,i)=>`${i?'L':'M'}${p[0]},${p[1]}`).join(' ')};
 }
 if(m.id==='further'&&a.id==='number'&&b.id==='algebra'){
  const points=[[700,437],[916,437],[916,272],[980,272]];
  return {points,path:points.map((p,i)=>`${i?'L':'M'}${p[0]},${p[1]}`).join(' ')};
 }
 const start=a.x===b.x?[a.x+W/2,a.y+H]:[a.x+W,a.y+H/2];
 const end=a.x===b.x?[b.x+W/2,b.y]:[b.x,b.y+H/2];
 const out=a.x===b.x?[start[0],start[1]+12]:[start[0]+12,start[1]];
 const into=a.x===b.x?[end[0],end[1]-12]:[end[0]-12,end[1]];
 const rects=m.nodes.map(n=>[n.x-9,n.y-9,n.x+W+9,n.y+H+9]);
 const xs=[...new Set([out[0],into[0],...rects.flatMap(r=>[r[0]-3,r[2]+3])])].sort((x,y)=>x-y);
 const ys=[...new Set([out[1],into[1],-8,735,...rects.flatMap(r=>[r[1]-3,r[3]+3])])].sort((x,y)=>x-y);
 const inside=(x,y)=>rects.some(r=>x>r[0]&&x<r[2]&&y>r[1]&&y<r[3]);
 const blocked=(p,q)=>rects.some(r=>p[0]===q[0]?p[0]>r[0]&&p[0]<r[2]&&Math.max(p[1],q[1])>r[1]&&Math.min(p[1],q[1])<r[3]:p[1]>r[1]&&p[1]<r[3]&&Math.max(p[0],q[0])>r[0]&&Math.min(p[0],q[0])<r[2]);
 const key=(x,y,d)=>`${x},${y},${d}`;
 const sx=xs.indexOf(out[0]),sy=ys.indexOf(out[1]),ex=xs.indexOf(into[0]),ey=ys.indexOf(into[1]);
 const heap=[];function push(v){heap.push(v);let i=heap.length-1;while(i){let p=(i-1)>>1;if(heap[p].f<=v.f)break;heap[i]=heap[p];i=p}heap[i]=v}function pop(){let top=heap[0],tail=heap.pop();if(heap.length){let i=0;while(2*i+1<heap.length){let j=2*i+1;if(j+1<heap.length&&heap[j+1].f<heap[j].f)j++;if(heap[j].f>=tail.f)break;heap[i]=heap[j];i=j}heap[i]=tail}return top}
 const dist=new Map(),parents=new Map();let first={x:sx,y:sy,d:0,g:0,f:0,k:key(sx,sy,0)};push(first);dist.set(first.k,0);let last;
 while(heap.length){let c=pop();if(c.g!==dist.get(c.k))continue;if(c.x===ex&&c.y===ey){last=c;break}for(const [dx,dy,d] of [[1,0,1],[-1,0,1],[0,1,2],[0,-1,2]]){let x=c.x+dx,y=c.y+dy;if(x<0||y<0||x>=xs.length||y>=ys.length)continue;let p=[xs[c.x],ys[c.y]],q=[xs[x],ys[y]];if(inside(...q)||blocked(p,q))continue;let g=c.g+Math.abs(p[0]-q[0])+Math.abs(p[1]-q[1])+(c.d&&c.d!==d?18:0);let k=key(x,y,d);if(g>=(dist.get(k)??Infinity))continue;dist.set(k,g);parents.set(k,c);push({x,y,d,g,k,f:g+Math.abs(xs[x]-into[0])+Math.abs(ys[y]-into[1])})}}
 if(!last)throw Error(`Cannot route ${m.id}:${a.id}→${b.id}`);
 const points=[];while(last){points.unshift([xs[last.x],ys[last.y]]);last=parents.get(last.k)}points.unshift(start);points.push(end);
 const reduced=points.filter((p,i)=>!i||i===points.length-1||!((points[i-1][0]===p[0]&&p[0]===points[i+1][0])||(points[i-1][1]===p[1]&&p[1]===points[i+1][1])));
 return {points:reduced,path:reduced.map((p,i)=>`${i?'L':'M'}${p[0]},${p[1]}`).join(' ')};
}
maps.forEach(m=>{const lookup=Object.fromEntries(m.nodes.map(n=>[n.id,n]));routes[m.id]=m.edges.map(e=>({...route(m,lookup[e[0]],lookup[e[1]]),from:e[0],to:e[1],related:e[2]==='related'}))});
function renderPanel(m){const colors=['--mint','--lilac','--yellow','--coral'];return `<section class="map-panel" data-map="${m.id}" aria-labelledby="title-${m.id}"><div class="map-heading"><span class="map-num">${m.number}</span><div class="map-title"><h2 id="title-${m.id}">${esc(t(m.name))}</h2><p>${esc(t(m.intro))}</p></div><span class="course-count">${m.count} ${t(strings.courseCount)}</span></div><p class="scroll-hint">${t(strings.hint)}</p><div class="detail" id="qkm-detail-${m.id}" aria-live="polite"></div><div class="map-scroll"><svg class="graph" viewBox="-10 -16 1220 770" role="group" aria-label="${esc(t(m.name))}"><defs><marker id="arrow-${m.id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M1 1 9 5 1 9" fill="none" stroke="var(--path)" stroke-width="1.5"/></marker></defs>${routes[m.id].map(r=>`<path class="edge ${r.related?'related':''}" data-from="${r.from}" data-to="${r.to}" d="${r.path}" marker-end="url(#arrow-${m.id})"/>`).join('')}${m.nodes.map((n,i)=>`<foreignObject x="${n.x}" y="${n.y}" width="${W}" height="${H+5}"><button xmlns="http://www.w3.org/1999/xhtml" class="node-card ${n.kind}" data-map-node="${n.id}" style="--node-color:var(${colors[i%4]})" aria-controls="qkm-detail-${m.id}" aria-pressed="false" aria-label="${esc(t(n.title))}: ${esc(t(strings[n.kind]))}">${icon(n.icon)}<span class="node-kind">${t(strings[n.kind])}</span><span class="node-title">${esc(t(n.title))}</span></button></foreignObject>`).join('')}</svg></div><div class="legend"><span><i class="key-course"></i>${t(strings.keyCourse)}</span><span><i class="key-preview"></i>${t(strings.keyConcept)}</span><span><i class="key-line"></i>${t(strings.keySolid)}</span><span><i class="key-line dashed"></i>${t(strings.keyRelated)}</span></div><p class="map-note">${esc(t(m.note))}</p></section>`}
function selectNode(mapId,nodeId,focusLinks=true){selected[mapId]=nodeId;const m=maps.find(x=>x.id===mapId),n=m.nodes.find(x=>x.id===nodeId),panel=document.querySelector(`[data-map="${mapId}"]`);if(!panel)return;const connected=new Set([nodeId]);routes[mapId].forEach(e=>{if(e.from===nodeId)connected.add(e.to);if(e.to===nodeId)connected.add(e.from)});panel.querySelectorAll('[data-map-node]').forEach(el=>{const sel=el.dataset.mapNode===nodeId;el.classList.toggle('selected',sel);el.classList.toggle('dimmed',focusLinks&&!connected.has(el.dataset.mapNode));el.setAttribute('aria-pressed',String(sel))});panel.querySelectorAll('.edge').forEach(el=>{const sel=el.dataset.from===nodeId||el.dataset.to===nodeId;el.classList.toggle('active',focusLinks&&sel);el.classList.toggle('faded',focusLinks&&!sel)});panel.querySelector('.detail').innerHTML=`<div><span class="small">${t(strings.details)}</span><strong>${esc(t(n.title))}</strong></div><div><p>${esc(t(n.desc))}</p>${n.extra.length?`<ul>${n.extra.map(x=>`<li>${esc(t(x))}</li>`).join('')}</ul>`:''}</div>`}

const lessonLabel=()=>lang==='es'?'Explorar la materia':'Explore subject';
function details(mapId,nodeId,focusLinks=true){
 selectNode(mapId,nodeId,focusLinks);
 const m=maps.find(x=>x.id===mapId),n=m.nodes.find(x=>x.id===nodeId),panel=host.querySelector('[data-map="'+mapId+'"]');
 const course=root.QuidenceCourseCatalog.COURSES[n.module];
 if(!course){const module=n.relatedModule,c=root.QuidenceCourseCatalog.COURSES[module];if(c){const links=document.createElement('div');links.className='qkm-actions';const related=document.createElement('a'),u=new URL(c.course,location.href);u.searchParams.set('lang',lang);related.href=u.href;related.textContent=(lang==='es'?'Base relacionada: ':'Related start: ')+c.title;const subject=document.createElement('a');subject.href='?view=courses&lang='+lang+'#subject-'+module;subject.dataset.mapSubjects=module;subject.textContent=lang==='es'?'Ver la materia →':'View subject →';links.append(related,subject);const note=document.createElement('p');note.className='q-related-note';note.textContent=lang==='es'?'Curso inicial relacionado; no es un curso completo de esta rama.':'A related starting course, not a complete course in this branch.';panel.querySelector('.detail').append(note,links);}}

 if(course){
  const links=document.createElement('div');links.className='qkm-actions';
  for(const [href,label] of [[course.course,lessonLabel()],[course.foundation||course.challenge,course.foundation?(lang==='es'?'Comprobar fundamentos':'Check foundations'):(lang==='es'?'Comprobar comprensión':'Check understanding')]]){
   if(!href)continue;const a=document.createElement('a');const u=new URL(href,location.href);u.searchParams.set('lang',lang);a.href=u.href;a.textContent=label;links.append(a);
  }
  panel.querySelector('.detail').append(links);
 }
}
function render(){lang=root.QuidenceI18n?.locale==='es'?'es':'en';const shown=activeMap==='all'?maps:maps.filter(m=>m.id===activeMap);host.innerHTML='<h2 class="qkm-title">'+t(strings.title)+'</h2>'+shown.map(renderPanel).join('')+'<p class="qkm-note">'+t(strings.footer)+'</p>';shown.forEach(m=>details(m.id,selected[m.id]||m.selected,false));}
host.addEventListener('click',e=>{const b=e.target.closest('[data-map-node]');if(!b)return;const mapId=b.closest('[data-map]').dataset.map,nodeId=b.dataset.mapNode;details(mapId,nodeId);const n=maps.find(x=>x.id===mapId).nodes.find(x=>x.id===nodeId);if(n.module)document.querySelector('[data-learning-subject="'+n.module+'"]')?.click();});
document.addEventListener('quidence:category',e=>{activeMap=maps.some(m=>m.id===e.detail.group)?e.detail.group:'all';render();});
document.addEventListener('quidence:language',render);
document.addEventListener('quidence:subject',e=>{for(const m of maps){const n=m.nodes.find(n=>n.module===e.detail.subject);if(n){selected[m.id]=n.id;if(host.querySelector('[data-map="'+m.id+'"]'))details(m.id,n.id,false);}}});
render();root.QuidenceCartoonMap={maps,routes};
})(window);

