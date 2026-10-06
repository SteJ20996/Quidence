/* Reviewed local branches. No remote generation, ability scores, or timing-based routing. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceAdaptive=api;})(typeof window==='object'?window:globalThis,()=>{
  'use strict';
  const checkpoints={C1:'FAN',C3:'FAR',C5:'FAE',C8:'FAF',C10:'FAM'};
  const num=(key,label,unit='')=>({key,label,type:'number',unit});
  const pick=(key,label,options)=>({key,label,type:'choice',options});
  const tasks={
    'N-midpoint':{title:'Between two negative numbers',topic:'Signed numbers',prompt:'What number is halfway between −3 and −2?',fields:[num('value','Halfway value')],answer:{value:-2.5},anchor:'Halfway is half a unit above −3, or half a unit below −2.',core:'midpoint'},
    'N-distance':{title:'Compare distances from zero',topic:'Signed numbers',prompt:'Which is closer to zero: −0.25 or −2.5?',fields:[pick('choice','Choose the closer number',[['-0.25','−0.25'],['-2.5','−2.5']])],answer:{choice:'-0.25'},anchor:'A distance of 0.25 is smaller than a distance of 2.5.',core:'distance'},
    'N-confirm':{title:'A new negative-number check',topic:'Signed numbers',prompt:'Which is closer to zero: −4 or −1? Explain using distance.',fields:[pick('choice','Choose the closer number',[['-4','−4'],['-1','−1']])],answer:{choice:'-1'},anchor:'One unit from zero is closer than four units.',core:'distance'},
    'N-stretch':{title:'Compare two representations',topic:'Signed numbers',prompt:'Which number is greater: −5/4 or −1.4? Explain your comparison.',fields:[pick('choice','Choose the greater number',[['-5/4','−5/4'],['-1.4','−1.4']])],answer:{choice:'-5/4'},anchor:'−5/4 = −1.25, which is to the right of −1.4 on a number line.',core:'negative-order'},
    'R-bridge':{title:'Find one repeated unit',topic:'Rates & proportionality',prompt:'A runner completes 4 equal laps in 10 minutes at a steady pace. How many minutes does one lap take?',fields:[num('rate','Minutes per lap','min/lap')],answer:{rate:2.5},anchor:'Divide the total time by the number of equal laps: 10 ÷ 4.',core:'rate-bridge'},
    'R-confirm':{title:'Use a new running pace',topic:'Rates & proportionality',prompt:'At a steady pace, 2 equal laps take 7 minutes. How long do 5 laps take?',fields:[num('total','Time for 5 laps','min')],answer:{total:17.5},anchor:'Each lap takes 7 ÷ 2 = 3.5 minutes; multiply by 5.',core:'rate-confirm'},
    'R-stretch':{title:'Distance instead of laps',topic:'Rates & proportionality',prompt:'A student runs 0.75 mile in 6 minutes at a steady pace. Find the time for 1.5 miles and the time per mile.',fields:[num('total','Time for 1.5 miles','min'),num('rate','Minutes per mile','min/mile')],answer:{total:12,rate:8},anchor:'Double the distance doubles the time; 6 ÷ 0.75 = 8 minutes per mile.',core:'rate-stretch'},
    'E-bridge':{title:'Count every term',topic:'Expressions & equations',prompt:'Which expression matches 4(x + 1) for every x?',fields:[pick('choice','Choose an equivalent expression',[['4x+4','4x + 4'],['4x+1','4x + 1'],['x+4','x + 4']])],answer:{choice:'4x+4'},anchor:'The 4 multiplies both x and 1.',core:'distribution'},
    'E-confirm':{title:'A new expanded expression',topic:'Expressions & equations',prompt:'Rewrite 2(x + 5) as ax + b. Give a and b.',fields:[num('coefficient','a · coefficient of x'),num('constant','b · constant')],answer:{coefficient:2,constant:10},anchor:'Multiply both terms by 2; the constant is 2 × 5 = 10.',core:'distribution'},
    'E-stretch':{title:'Change addition to subtraction',topic:'Expressions & equations',prompt:'Which expression matches 3(x − 4) for every x? Then evaluate it at x = 6.',fields:[pick('choice','Choose an equivalent expression',[['3x-12','3x − 12'],['3x-4','3x − 4'],['-3x+12','−3x + 12']]),num('value','Value at x = 6')],answer:{choice:'3x-12',value:6},anchor:'Multiply both x and −4 by 3; the subtracted term is 12.',core:'distribution'},
    'F-start':{title:'Locate the starting value',topic:'Functions & models',prompt:'A line has the table below. Which y-value is its starting value, when x is zero?',table:{heads:['x','y'],rows:[[0,4],[1,7],[2,10]]},fields:[pick('choice','Starting value',[['4','4'],['3','3'],['7','7']])],answer:{choice:'4'},anchor:'Use the row where x = 0, not the amount added each step.',core:'intercept'},
    'F-rate':{title:'Separate change from start',topic:'Functions & models',prompt:'A line passes through (0, 4) and (2, 10). How much does y increase for each +1 in x?',table:{heads:['x','y'],rows:[[0,4],[2,10]]},fields:[num('rate','Increase in y per +1 in x')],answer:{rate:3},anchor:'The change in y is 6 over a change in x of 2: 6 ÷ 2 = 3.',core:'slope'},
    'F-confirm':{title:'A new table-to-rule check',topic:'Functions & models',prompt:'These points lie on one line. Write y = mx + b.',table:{heads:['x','y'],rows:[[0,-2],[2,4],[4,10]]},fields:[num('m','Slope m'),num('b','Starting value b')],answer:{m:3,b:-2},anchor:'The start is −2; y increases 6 while x increases 2, giving slope 3.',core:'slope'},
    'F-stretch':{title:'Build a rule from a movement',topic:'Functions & models',prompt:'A line passes through (0, −3). Every move of 4 units right moves 6 units up. Find its slope and its y-value when x = 2.',fields:[num('m','Slope m'),num('value','y when x = 2')],answer:{m:1.5,value:0},anchor:'The slope is 6 ÷ 4 = 1.5; start at −3 and add 1.5 × 2.',core:'slope'},
    'M-bridge':{title:'Separate once from each time',topic:'Functions & models',prompt:'A game club charges $6 once plus $2 per session. Let s be the number of sessions. Choose the total-cost rule, then find the cost for 3 sessions.',fields:[pick('choice','Choose the rule',[['6+2s','C = 6 + 2s'],['2+6s','C = 2 + 6s'],['8s','C = 8s']]),num('total','Cost for 3 sessions','$')],answer:{choice:'6+2s',total:12},anchor:'Pay the $6 once, then add $2 for each session.',core:'fixed-rate'},
    'M-substitute':{title:'Check a supplied rule',topic:'Functions & models',prompt:'The rule is supplied: C = 12 + 5v. What is the total when v = 2?',suppliedModel:true,fields:[num('total','Total for 2 visits','$')],answer:{total:22},anchor:'Use 2 only in the repeated term: 12 + 5 × 2.',core:'substitution'},
    'M-confirm':{title:'New fees, same structure',topic:'Functions & models',prompt:'A recreation center charges $18 once plus $4 per visit. Find the total at 0 visits and at 3 visits.',fields:[num('start','Total for 0 visits','$'),num('total','Total for 3 visits','$')],answer:{start:18,total:30},anchor:'The fixed fee remains at zero visits; add 3 × 4 for three visits.',core:'fixed-rate'},
    'M-stretch':{title:'Find a whole-number limit',topic:'Functions & models',prompt:'A game booth charges $8 to enter plus $3 per round. You have $20. Find the largest whole number of rounds you can afford. Check its cost and the cost of one more round.',fields:[num('max','Maximum rounds','rounds'),num('cost','Cost of that many rounds','$'),num('next','Cost of one more round','$')],answer:{max:4,cost:20,next:23},integerKeys:['max'],anchor:'Four rounds cost $20; five cost $23, which exceeds the budget.',core:'boundary'}
  };
  for(const key of ['N-midpoint','N-distance','N-confirm','N-stretch'])tasks[key].modelType='optional_number_line_preview';
  tasks['R-bridge'].unitModel={count:4,total:10};tasks['R-confirm'].unitModel={count:2,total:7};
  tasks['R-stretch'].unitModel={count:2,total:6,distance:true};
  for(const key of ['R-bridge','R-confirm','R-stretch'])tasks[key].modelType='optional_equal_unit_model';
  tasks['E-bridge'].areaModel={height:4,constant:1};tasks['E-confirm'].areaModel={height:2,constant:5};
  for(const key of ['E-bridge','E-confirm','E-stretch'])tasks[key].modelType='optional_area_model';
  for(const key of ['F-start','F-rate'])tasks[key].graph={xMin:0,xMax:2,yMin:0,yMax:10,points:[[0,4],[2,10]],line:[[0,4],[2,10]],description:'Optional graph through (0, 4) and (2, 10).'};
  tasks['F-confirm'].graph={xMin:0,xMax:4,yMin:-3,yMax:10,points:[[0,-2],[2,4],[4,10]],line:[[0,-2],[4,10]],description:'Optional graph through (0, −2), (2, 4), and (4, 10).'};
  tasks['F-stretch'].graph={xMin:0,xMax:4,yMin:-3,yMax:4,points:[[0,-3],[4,3]],line:[[0,-3],[4,3]],description:'Optional graph: start at (0, −3), move right 4 and up 6.'};
  for(const key of ['F-start','F-rate','F-confirm','F-stretch'])tasks[key].modelType='optional_coordinate_graph';
  for(const[key,base,rate,unit,budget]of [['M-bridge',6,2,'sessions',null],['M-substitute',12,5,'visits',null],['M-confirm',18,4,'visits',null],['M-stretch',8,3,'rounds',20]]){
    tasks[key].costModel={unit,plans:[['Total',base,rate]],budget};tasks[key].modelType='optional_cost_blocks';
  }
  function select(anchor,record){
    if(!checkpoints[anchor]||!record||record.complete===null)return null;
    const parts=record.score?.parts??{},errors=Object.keys(parts).filter(k=>parts[k]===false);
    const support=record.supportAtSubmission?.hint_ids??[];
    const priorErrors=[...new Set(record.attempts.flatMap(a=>Object.keys(a.score?.parts??{}).filter(k=>a.score.parts[k]===false)))];
    let mode,reason;
    if(record.skip){mode='bridge';reason='The anchor was skipped; collect missing evidence without treating the skip as an error.';}
    else if(errors.length){mode='bridge';reason=`Check the specific submitted components: ${errors.join(', ')}.`;}
    else if(record.reason?.contradicted||record.reason?.objectiveConflict){mode='confirm';reason='A reported conflict between answer and explanation needs a fresh check.';}
    else if(support.length||record.attempts.length>1){mode='confirm';reason='The saved result followed support or another try; collect a new result with help initially closed.';}
    else{mode='stretch';reason='The first submitted objective result matched without optional support; try a changed context. This is not a mastery claim.';}
    const family={C1:'N',C3:'R',C5:'E',C8:'F',C10:'M'}[anchor];
    let key=family+'-'+mode;
    if(mode==='bridge'&&anchor==='C1')key=errors.includes('point')&&!errors.includes('near')?'N-midpoint':'N-distance';
    if(mode==='confirm'&&anchor==='C1'&&priorErrors.includes('point')&&!priorErrors.includes('near'))key='N-midpoint';
    if(mode==='bridge'&&anchor==='C8')key=errors.includes('b')||errors.includes('pair')||record.skip?'F-start':'F-rate';
    if(mode==='bridge'&&anchor==='C10'&&parts.model===true)key='M-substitute';
    const task=tasks[key];return {id:checkpoints[anchor],anchor,mode,key,reason,source_event_id:record.lastEventId??null,source_attempt:record.attempts.length,component_errors:errors,prior_component_errors:priorErrors,source_support_ids:[...support],task:{...structuredClone(task),variant_id:key,provenance:'Self-created within Quidence; uses standard mathematical concepts.',version:'0.4.1'}};
  }
  function reasoning(task,raw,correct){
    const t=String(raw??'').toLowerCase().replace(/[−–]/g,'-').replace(/[×]/g,'*').replace(/[÷]/g,'/');
    const reasons=[];if(!t.trim())reasons.push('missing_explanation');if(!correct)reasons.push('objective_conflict');
    // Do not certify ambiguous or negated claims by a loose keyword match.
    const negated=/\b(?:not|never|only|don't|doesn't|ignore)\b/.test(t);
    const patterns={
      midpoint:/(?:half|midpoint|middle).{0,70}(?:unit|between|-3|-2)|-3\s*\+\s*0?\.5|-2\s*-\s*0?\.5/,
      distance:/(?:closer|smaller|less|shorter).{0,60}(?:distance|zero|0)|(?:distance|zero).{0,60}(?:closer|smaller|less|shorter)/,
      'negative-order':/-1\.25.{0,60}(?:greater|right|closer)|(?:right|closer).{0,60}(?:zero|-1\.4)|-5\s*\/\s*4\s*=\s*-1\.25/,
      'rate-bridge':/10\s*\/\s*4|(?:divide|divided|split).{0,40}(?:10|total).{0,40}(?:4|laps)/,
      'rate-confirm':/7\s*\/\s*2.{0,50}(?:5|multiply)|3\.5\s*\*\s*5|(?:each|per).{0,20}lap.{0,20}3\.5.{0,40}(?:5|multiply)/,
      'rate-stretch':/(?:double|twice).{0,65}(?:distance|time|6|12)|6\s*\/\s*0?\.75\s*=\s*8/,
      distribution:/(?:multipl|distribut).{0,60}(?:both|each|every|all).{0,30}(?:term|part)|(?:both|each|every).{0,30}(?:term|part).{0,50}multipl|2\s*\*\s*5\s*=\s*10|3\s*\*\s*\(?-4\)?\s*=\s*-12/,
      intercept:/(?:x\s*=\s*0|zero|0).{0,60}(?:4|start)|(?:start|4).{0,60}(?:x\s*=\s*0|zero)/,
      slope:/6\s*\/\s*[24]|(?:change|rise).{0,65}(?:divide|over|per|run)|(?:6|six).{0,30}(?:2|two|4|four).{0,30}(?:3|1\.5)/,
      'fixed-rate':/(?:once|fixed|setup|start).{0,90}(?:each|per|repeat|multiply)|(?:each|per|repeat|multiply).{0,90}(?:once|fixed|setup|start)/,
      substitution:/12\s*\+\s*5\s*\*\s*2|12\s*\+\s*10\s*=\s*22/,
      boundary:/(?:4|four|20).{0,60}(?:fits|within|afford|budget).{0,80}(?:5|five|23).{0,50}(?:over|exceed|too much)|20.{0,60}23.{0,50}(?:over|exceed)/
    };
    const plainCore={
      midpoint:/(?:average|mean).{0,45}(?:endpoints|numbers|-3|-2)/,
      distance:/(?:0?\.25\s*<\s*2\.5|1\s*<\s*4)|(?:one|1).{0,35}(?:unit|distance).{0,45}(?:four|4)/,
      distribution:/(?:both|each).{0,45}\bx\b.{0,40}(?:and|,).{0,25}(?:1|5|-4)|4\s*\*\s*1\s*=\s*4|3\s*\*\s*4\s*=\s*12.{0,40}(?:subtract|minus)/,
      slope:new RegExp(`(?:up|rises?|increases?|adds?|gains?).{0,18}${String(task.answer.m??task.answer.rate??3).replace('.', '\\.')}.{0,35}(?:each|per|1 in x)`)
    };
    const matched=correct&&!negated&&(patterns[task.core]?.test(t)||plainCore[task.core]?.test(t))&&!reasons.length;
    if(!matched&&!reasons.includes('missing_explanation'))reasons.push('unknown_or_conflicting_wording');
    const evidence=typeof window==='object'?window.QuidenceReasonEvidence?.assess('',t,{},task):null;
    const recognized=matched||evidence?.matched;
    if(evidence?.matched&&!evidence.errors.length){const i=reasons.indexOf('unknown_or_conflicting_wording');if(i>=0)reasons.splice(i,1);}
    if(evidence?.errors.length)reasons.push('arithmetic_error');
    const points=evidence?.errors.length?(recognized?1:null):recognized?2:null;
    return {points,max:2,connection:evidence?.connection??null,connectionMax:1,status:reasons.length?'Needs review':'Provisional credit',matched:recognized?[task.anchor]:[],anchors:[task.anchor],contradicted:!!evidence?.errors.length,objectiveConflict:!correct,reviewReasons:[...new Set(reasons)],calculationChecks:evidence?.equations??[],method:'reviewed_adaptive_calculation_evidence_0.6; not semantic certification',evidenceSpans:recognized?[{start:0,end:String(raw).length,text:String(raw),claimStatus:evidence?.errors.length?'unresolved':'retained'}]:[]};
  }
  return {checkpoints,tasks,select,reasoning};
});
