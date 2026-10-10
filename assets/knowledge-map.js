(function(root,factory){
  const data=typeof module==='object'&&module.exports?require('./knowledge-map-data.js'):root.QuidenceKnowledgeMapData;
  const api=factory(data);
  if(typeof module==='object'&&module.exports)module.exports=api;
  else{root.QuidenceKnowledgeMap=api;api.mount(root.document,root);}
})(typeof window==='object'?window:globalThis,function(data){
  'use strict';
  function courseCandidates(chapter,nodes){
    if(nodes.length!==1||!data.chapters[chapter]?.nodes.some(n=>n.id===nodes[0]))return[];
    if(chapter===1&&nodes[0]==='mathstats')return[];
    return Object.hasOwn(data.bindings,nodes[0])?data.bindings[nodes[0]].filter(id=>data.courses.some(c=>c.id===id)):[];
  }
  function mount(document,window){
    const root=document.getElementById('knowledge-map'),catalog=window.QuidenceCourseCatalog;
    if(!root||!data||!catalog)return;
    const map=root.querySelector('.qa-map'),cities=root.querySelector('.qa-cities'),roads=root.querySelector('.qa-roads'),terrain=root.querySelector('.qa-terrain');
    const layerBar=root.querySelector('.qa-layers'),chapterBar=root.querySelector('.qa-chapters'),next=root.querySelector('.qa-next'),back=root.querySelector('.qa-back'),info=root.querySelector('.qa-focus-text');
    const courses=new Map(data.courses.filter(c=>catalog.COURSES[c.module]&&!catalog.COURSES[c.module].planned).map(c=>[c.id,c]));
    let language=window.QuidenceI18n?.locale==='es'?'es':'en',chapter=0,frontier=['prealgebra'],trail=[],activeLayer=null,chosenCourse=null,syncing=false,layoutFrame=null;
    let selectedModule=document.querySelector('[data-learning-subject][aria-pressed="true"]')?.dataset.learningSubject||'pre-algebra';
    const current=()=>data.chapters[chapter],name=id=>current().nodes.find(n=>n.id===id)?.[language]||id;
    const children=ids=>[...new Set(current().links.filter(([a])=>ids.includes(a)).map(([,b])=>b))].filter(id=>!ids.includes(id));
    const bridgeTargets=()=>chapter<2?[...new Set(frontier.map(id=>data.bridges[chapter][id]).filter(Boolean))]:[];
    const snapshot=()=>({chapter,frontier:[...frontier],activeLayer});
    function remember(){trail.push(snapshot());if(trail.length>200)trail.shift();}
    function focusNodes(ids,layer=null){remember();frontier=ids;activeLayer=layer;chosenCourse=null;update();}
    function chooseChapter(index,targets=null){
      if(index===chapter)return;
      remember();chapter=index;frontier=targets?.length?targets:[...current().initial];activeLayer=null;chosenCourse=null;buildCities();update();
    }
    function selectSubject(module){
      if(selectedModule===module)return;
      const button=[...document.querySelectorAll('[data-learning-subject]')].find(b=>b.dataset.learningSubject===module);
      if(!button)return;
      syncing=true;try{button.click();selectedModule=module;}finally{syncing=false;}
    }
    function focusSubject(module,rememberPrevious=true){
      const course=[...courses.values()].find(c=>c.module===module);if(!course)return;
      if(rememberPrevious)remember();
      chapter=course.chapter;frontier=[course.node];activeLayer=null;chosenCourse=course.id;buildCities();update();
    }
    function buildCities(){
      cities.replaceChildren();layerBar.replaceChildren();
      for(const layer of current().groups){
        const button=document.createElement('button');button.type='button';button.className='qa-layer';button.dataset.layer=layer;
        button.addEventListener('click',()=>focusNodes(current().nodes.filter(n=>n.layer===layer).map(n=>n.id),layer));layerBar.append(button);
      }
      for(const node of [...current().nodes].sort((a,b)=>a.y-b.y)){
        const button=document.createElement('button');button.type='button';button.className='qa-node';button.dataset.node=node.id;button.append(document.createElement('span'));
        button.addEventListener('click',()=>focusNodes([node.id]));cities.append(button);
      }
    }
    function courseLink(module,kind){
      const card=document.querySelector('.subject-card[data-subject="'+module+'"]');
      const anchor=card?.querySelector(kind==='course'?'.subject-link':'.challenge-link');
      const url=new URL(anchor?.getAttribute('href')||catalog.COURSES[module][kind],window.location.href);
      url.searchParams.set('lang',language);return url.pathname+url.search+url.hash;
    }
    function renderSelection(w){
      const body=root.querySelector('.qa-course-body'),title=body.querySelector('.qa-course-title'),meta=body.querySelector('.qa-course-meta'),actions=body.querySelector('.qa-actions'),choices=body.querySelector('.qa-course-choices');
      const candidates=courseCandidates(chapter,frontier).filter(id=>courses.has(id));
      if(!candidates.includes(chosenCourse))chosenCourse=candidates.find(id=>courses.get(id).module===selectedModule)||candidates[0]||null;
      const course=chosenCourse?courses.get(chosenCourse):null;
      root.dataset.selectedCourse=course?.module||'';
      title.textContent=course?w.course+course[language]:frontier.length===1?w.future:w.pick;
      meta.textContent=course?(course.module==='number-theory'?course.scope[language]:w.report):frontier.length===1?w.futureMeta:'';
      actions.hidden=!course;choices.replaceChildren();choices.hidden=candidates.length<2;
      for(const id of candidates){
        if(candidates.length<2)break;
        const button=document.createElement('button');button.type='button';button.className='qa-course-choice';button.textContent=courses.get(id)[language];button.setAttribute('aria-pressed',String(id===chosenCourse));
        button.addEventListener('click',()=>{chosenCourse=id;update();});choices.append(button);
      }
      const learn=root.querySelector('.qa-learn'),diagnose=root.querySelector('.qa-diagnose');
      if(course){learn.href=courseLink(course.module,'course');diagnose.hidden=!catalog.COURSES[course.module].challenge;if(!diagnose.hidden)diagnose.href=courseLink(course.module,'challenge');else diagnose.removeAttribute('href');selectSubject(course.module);}
      else{learn.removeAttribute('href');diagnose.removeAttribute('href');}
    }
    function update(){
      const w=data.words[language],following=children(frontier),parents=current().links.filter(([,b])=>frontier.includes(b)).map(([a])=>a),related=new Set([...frontier,...following,...parents]);
      for(const button of cities.querySelectorAll('button')){
        const available=courseCandidates(chapter,[button.dataset.node]).some(id=>courses.has(id));
        button.querySelector('span').textContent=name(button.dataset.node);button.setAttribute('aria-label',name(button.dataset.node)+'. '+(available?w.available:w.explore));
        button.setAttribute('aria-pressed',String(frontier.includes(button.dataset.node)));button.classList.toggle('qa-neighbor',related.has(button.dataset.node));button.classList.toggle('qa-available',available);
      }
      const groupLabel=activeLayer?w.layers[chapter][current().groups.indexOf(activeLayer)]:null;
      info.querySelector('strong').textContent=w.focus+(groupLabel||frontier.map(name).join(' · '));
      info.querySelector('span').textContent=groupLabel?w.group+related.size+' '+w.topics:following.length?w.toward+following.map(name).join(' · '):w.end;
      next.textContent=following.length?w.next:bridgeTargets().length?w.continue:w.next;next.disabled=!following.length&&!bridgeTargets().length;back.textContent=w.back;back.disabled=!trail.length;
      for(const element of root.querySelectorAll('[data-copy]'))element.textContent=w[element.dataset.copy];
      for(const button of chapterBar.querySelectorAll('button')){button.textContent=w.chapters[Number(button.dataset.chapter)];button.setAttribute('aria-pressed',String(Number(button.dataset.chapter)===chapter));}
      for(const [index,button]of [...layerBar.querySelectorAll('button')].entries()){button.textContent=w.layers[chapter][index];button.setAttribute('aria-pressed',String(button.dataset.layer===activeLayer));}
      root.lang=language;root.dataset.chapter=String(chapter);
      root.setAttribute('aria-label',language==='es'?'Mapa de conocimientos matemáticos':'Mathematics Knowledge Map');
      map.setAttribute('aria-label',language==='es'?'Los conocimientos crecen de abajo hacia arriba':'Knowledge grows from bottom to top');
      chapterBar.setAttribute('aria-label',language==='es'?'Mapas de conocimientos relacionados':'Connected knowledge maps');
      layerBar.setAttribute('aria-label',language==='es'?'Ramas del conocimiento':'Knowledge branches');
      roads.setAttribute('aria-label',language==='es'?'Líneas continuas: bases habituales. Líneas discontinuas: conexiones y aplicaciones.':'Solid routes: common foundations. Dashed routes: connections and applications.');
      renderSelection(w);scheduleLayout();
    }
    function svgPath(d,stroke,width,dashed=false){
      const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',d);path.setAttribute('fill','none');path.setAttribute('stroke',stroke);path.setAttribute('stroke-width',width);if(dashed)path.setAttribute('stroke-dasharray','4 5');return path;
    }
    function layout(){
      const width=map.clientWidth,first=cities.querySelector('button');if(!width||!first||root.hidden)return;
      const compact=width<430,nodeWidth=first.offsetWidth,baseHeight=compact?current().height+240:current().height,placed=[],positions=new Map();
      for(const node of [...current().nodes].sort((a,b)=>b.y-a.y)){
        const x=Math.max(nodeWidth/2+5,Math.min(width-nodeWidth/2-5,node.x*width)),height=cities.querySelector('[data-node="'+node.id+'"]').offsetHeight;
        let y=38+node.y*(baseHeight-76);
        const parents=current().links.filter(([,b])=>b===node.id).map(([a])=>positions.get(a)).filter(Boolean);
        if(parents.length)y=Math.min(y,...parents.map(p=>p.y-Math.max(60,(height+p.height)/2+14)));
        while(placed.some(p=>Math.abs(p.x-x)<nodeWidth+10&&Math.abs(p.y-y)<(height+p.height)/2+14))y-=14;
        positions.set(node.id,{x,y,height});placed.push({x,y,height});
      }
      const minY=Math.min(...placed.map(p=>p.y-p.height/2)),offset=minY<15?15-minY:0,height=baseHeight+offset;
      map.style.height=height+'px';for(const position of positions.values())position.y+=offset;
      for(const button of cities.querySelectorAll('button')){const p=positions.get(button.dataset.node);button.style.left=p.x+'px';button.style.top=p.y+'px';}
      for(const svg of [roads,terrain]){svg.setAttribute('viewBox','0 0 '+width+' '+height);svg.replaceChildren();}
      // Unlabeled decorative region fills were removed; branches and the legend carry the meaning.
      const ordered=[...current().links].sort((a,b)=>Number(frontier.includes(a[0])||frontier.includes(a[1]))-Number(frontier.includes(b[0])||frontier.includes(b[1])));
      for(const [a,b,type]of ordered){
        const p=positions.get(a),q=positions.get(b),bright=frontier.includes(a)||frontier.includes(b),x1=p.x,y1=p.y-p.height/2+9,x2=q.x,y2=q.y-q.height/2+9,delta=y1-y2;
        const path=svgPath(`M ${x1} ${y1} C ${x1} ${y1-delta*.42}, ${x2} ${y2+delta*.44}, ${x2} ${y2}`,bright?'var(--qa-green)':'var(--qa-road)',bright?2.3:1.2,type==='r');
        path.setAttribute('opacity',bright?'1':'.88');path.dataset.from=a;path.dataset.to=b;path.dataset.relationship=type==='r'?'connection':'foundation';roads.append(path);
      }
    }
    function scheduleLayout(){if(layoutFrame!==null)return;layoutFrame=window.requestAnimationFrame(()=>{layoutFrame=null;layout();});}
    for(let index=0;index<data.chapters.length;index++){
      if(index){const join=document.createElement('span');join.className='qa-join';join.textContent='↗';join.setAttribute('aria-hidden','true');chapterBar.append(join);}
      const button=document.createElement('button');button.type='button';button.dataset.chapter=index;button.className='qa-chapter';button.addEventListener('click',()=>chooseChapter(index));chapterBar.append(button);
    }
    next.addEventListener('click',()=>{const following=children(frontier),targets=bridgeTargets();if(following.length)focusNodes(following);else if(targets.length)chooseChapter(chapter+1,targets);});
    back.addEventListener('click',()=>{const previous=trail.pop();if(previous){chapter=previous.chapter;frontier=previous.frontier;activeLayer=previous.activeLayer;chosenCourse=null;buildCities();update();}});
    document.addEventListener('quidence:subject',event=>{selectedModule=event.detail.subject;if(!syncing)focusSubject(selectedModule);});
    document.addEventListener('quidence:language',event=>{language=event.detail.locale==='es'?'es':'en';update();});
    document.addEventListener('quidence:home-view',scheduleLayout);
    root.hidden=false;focusSubject(selectedModule,false);
    new window.ResizeObserver(scheduleLayout).observe(map);document.fonts?.ready.then(scheduleLayout);
    return{layout:scheduleLayout};
  }
  return{courseCandidates,mount};
});
