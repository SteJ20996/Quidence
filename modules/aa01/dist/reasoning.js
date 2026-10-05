/* Conservative claim-aware layer. Suggestions are provisional, never semantic certification. */
(() => {
  'use strict';
  const original=window.AA01Rubrics;
  const normalize=v=>String(v??'').toLowerCase().replace(/[−–—]/g,'-').replace(/’/g,"'").replace(/×/g,'*')
    .replace(/\bzero\b/g,'0').replace(/\bone\b/g,'1').replace(/\btwo\b/g,'2').replace(/\bthree\b/g,'3').replace(/\bfour\b/g,'4').replace(/\bsix\b/g,'6').replace(/\beight\b/g,'8').replace(/\btwelve\b/g,'12').replace(/\s+/g,' ').trim();
  const has=(t,patterns)=>patterns.some(p=>p.test(t));
  // Narrow equivalences for everyday zero-input wording; other negation is
  // still reviewed, and explicit contradictory clauses are checked first.
  const zeroVisitFee=/(?:do not|don't|never)\s+(?:show up|visit|go)(?:\s+at all)?[^.!?;]{0,45}\bstill\s+(?:costs?|pay|owe|have to pay)[^.!?;]{0,16}\$?\s*12\b/;
  const zeroLapsTime=/0\s*laps?\s+(?:costs?|takes?|uses?|means?|requires?)\s+(?:no\s+(?:time|minutes?)|0\s+(?:time|minutes?))/;
  const zeroVisitsCost=/0\s*visits?\s+(?:(?:already|still)\s+)?(?:costs?|requires?|means?(?:\s+paying)?|owes?)[^.!?;]{0,12}\$?\s*4\b/;
  const sportsAnchors={
    S1:['A setup fee is paid once; the per-player amount is multiplied by the number of players.'],
    S3:['The meeting point means both plans have the same total cost at the same number of players.'],
    FB:['Use a whole number of players; the chosen number fits and the next exceeds the budget.'],
    S4:['Use a whole number of players; the chosen number fits, and the next whole number exceeds the budget.'],
    S5:['Compare both complete costs with the $90 budget for 20 players.'],
    S6:['One valid case where A is cheaper disproves the claim that B is always cheaper.']
  };
  const wrong={
    V1:[/\b40\s*x?\s*\+\s*48\s*x?\s*=\s*(?:40|48)\s*x?\b/,/(?:ignore|skip|leave out).{0,25}(?:mixed|cross).{0,15}(?:term|part)/],
    D1:[/(?:removed|strip|subtract).{0,35}(?:area\s*(?:is|=)\s*[23]\b|only\s*[23]\b)/,/\b5x\s*-\s*3\b.{0,20}(?:correct|right|equivalent)/],
    C4:[/\ba\b.{0,20}(?:not|doesn't|isn't).{0,30}(?:constant ratio|proportional)/,/\bb\s+(?:is\s+(?:still\s+)?|remains\s+)proportional/,/\bboth\b.{0,15}(?:are|is)\s*proportional/],
    C6:[/(?:do not|don't|never)\s+multiply\s+(?:both|every|each)/,/(?:2|two).{0,12}only\s*multiplies?\s*x/,/(?:leave|keep).{0,15}(?:3|constant).{0,15}(?:same|unchanged)/,/\b3\b.{0,10}(?:stays?|remains?).{0,10}(?:same|unchanged)/],
    C9:[/\by\b.{0,10}(?:does not|doesn't|not).{0,10}decrease/,/\b(?:slope|rate)\s+(?:is\s+)?positive/,/\by\b.{0,12}(?:rises?|increases?).{0,20}\bx\b.{0,10}increase/],
    C10:[/\b12\b.{0,25}(?:every|each|per)\s*visit/,/\b0\s*visits?\b.{0,35}(?:free|do not pay|don't pay|no cost)/,/\b0\s*visits?\b.{0,35}\b0\s*dollars?/,/sign.?up fee.{0,15}free/],
    FN:[/(?:do not|don't)\s*subtract\s*4/,/\b(?:move|go)\s*right/,/\b(?:gets?|makes? it)\s*warmer/,/drop\s*means\s*add/],
    FP:[/\brunning\b.{0,25}(?:does not|doesn't).{0,30}(?:0 minutes|origin)/,/\bgym\b.{0,15}(?:passes|goes)\s*through\s*(?:the\s*)?origin/,/\bboth\b.{0,15}(?:pass|go)\s*through\s*(?:the\s*)?origin/,/0\s*visits?\b.{0,25}(?:free|no\s*(?:fee|cost)|costs?\s*\$?\s*0\b)/],
    FE:[/(?:do not|don't|never)\s*multiply\s*(?:the\s*)?2/,/\b2\b.{0,15}(?:stays?|remains?|must remain).{0,15}(?:2|unchanged)/,/(?:leave|keep).{0,15}(?:2|constant).{0,15}(?:same|unchanged)/],
    FG:[/\ba\b.{0,12}(?:does not|doesn't).{0,15}(?:slope|rate)\s*3/,/\bb\b.{0,12}(?:has|is).{0,15}(?:greater rate|faster|steeper)/,/\bb\b.{0,15}grows?\s*faster/]
  };
  function retainedText(raw) {
    let text=normalize(raw),unclearQuote=false;
    // Remove a quoted claim only when rejection is explicit. Otherwise defer it.
    if(/["“”]/.test(text)) {
      if(/(?:wrong|disagree|ignores?|confuses?|mistake)/.test(text)) text=text.replace(/["“][^"”]*["”]/g,' ');
      else unclearQuote=true;
    }
    // History is not the final claim; require an explicit correction marker.
    text=text.replace(/\bi\s+(?:first|initially)\b[\s\S]*?(?:i\s+(?:changed my mind|changed that|corrected that)|now i|but that was wrong)[,:.\s]*/g,' ');
    text=text.replace(/\bi thought\b[^.]*\.\s*i corrected that[:\s]*/g,' ');
    // A description of another student's failed step is not an instruction to keep it.
    text=text.replace(/(?:the student|another student)\s+did not[^.]*?(?:wrong|mistake)[^.]*\./g,' ');
    text=text.replace(/\bmy friend said[^.]*\.(?=\s*that ignores)/g,' ');
    text=text.replace(/\bsomeone said[^.]*\.(?=\s*i disagree)/g,' ');
    return {text:text.trim(),unclearQuote};
  }
  function extraCore(id,t) {
    switch(id){
      case 'C4':return [/\ba\b.{0,25}puzzles?\s*\+\s*puzzles?\s*\+\s*puzzles?/.test(t),/\bb\b.{0,35}2.{0,35}(?:head start|bonus|before any|at 0)/.test(t)];
      case 'C6':case 'FE':return /(?:copies|groups)\s*of\s*(?:everything|every part)/.test(t)||/(?:every|each|all).{0,20}(?:part|term).{0,30}(?:copies|groups)/.test(t)||/multipl(?:y|ies|ied).{0,30}(?:both|each|every|all).{0,20}(?:term|part|inside)/.test(t)?[true,false]:null;
      case 'C9':return /(?:go|moving|move)\s*right.{0,35}(?:go(?:es)?\s*down|lower|smaller)/.test(t)||/going right.{0,25}y\s*smaller/.test(t)?[true,false]:null;
      case 'C10':return zeroVisitFee.test(t)||/12\s*dollars.{0,35}(?:before|entry)/.test(t)||/fixed\s*sign.?up fee/.test(t)?[true,false]:null;
      case 'FN':return /colder\s*means\s*(?:a\s*)?lower/.test(t)?[true,false]:null;
      case 'FP':return [zeroLapsTime.test(t),zeroVisitsCost.test(t)||/gym.{0,45}(?:costs?|fee|dollars).{0,45}(?:before any|0)\s*visits?/.test(t)];
      case 'FG':return [ /\ba\b.{0,20}(?:gains?|changes?|increases?).{0,15}3\s*per/.test(t),/\bb\b.{0,20}(?:gains?|changes?|increases?).{0,15}2\s*per/.test(t)];
      default:return null;
    }
  }
  function sports(id,t,objectiveCorrect) {
    if(id==='S6'){
      const wrongComparison=/(?:more than|greater than|above|over)\s*9\s*(?:players)?\s*[,;]?\s*(?:(?:so|and|therefore|which means)\s*)?(?:plan\s*)?b\s+(?:is\s+(?:(?:still|always|much)\s+)?(?:better|cheaper)|costs?\s+less)|\b(?:plan\s*)?a\s+is\s+always\s+cheaper\b/.test(t);
      if(wrongComparison)return {points:null,connection:null,contradicted:true,reviewReasons:['answer_explanation_conflict']};
    }
    if(/(?:do not|does not|don't|doesn't|not always)/.test(t))return {points:null,connection:null};
    switch(id){
      case 'S1':return {points:/(?:once|fixed|start|setup).{0,90}(?:multipl|times|per player)|(?:multipl|times|per player).{0,90}(?:once|fixed|start|setup)/.test(t)?2:null,connection:null};
      case 'S3':return {points:/(?:both|plans?|same).{0,50}(?:same|equal).{0,25}(?:cost|price|total)|same cost/.test(t)?2:null,connection:/\b9\b.{0,30}\b51\b/.test(t)&&objectiveCorrect?1:null};
      case 'FB':return {points:/(?:next|1 more).{0,45}(?:over|exceed|too much)|101.{0,25}(?:over|exceed|greater)/.test(t)?2:null,connection:objectiveCorrect&&/96/.test(t)&&/101/.test(t)?1:null};
      case 'S4':return {points:/(?:whole|integer|round down)/.test(t)&&/(?:next|1 more).{0,45}(?:over|exceed|too much)/.test(t)?2:/(?:whole|integer|round down)/.test(t)?1:null,connection:/\b(?:90|91|93)\b/.test(t)&&objectiveCorrect?1:null};
      case 'S5':return {points:/\ba\b.{0,35}(?:within|fits|under).{0,60}\bb\b.{0,35}(?:over|exceed|too much)/.test(t)?2:null,connection:/\b84\b/.test(t)&&/\b106\b/.test(t)&&objectiveCorrect?1:null};
      case 'S6':{const recognized=/(?:one|1|a single).{0,30}(?:case|example|counterexample).{0,40}(?:disprov|reject|always)|(?:per.player|each player).{0,35}(?:higher|more|greater)/.test(t);return {points:recognized?2:null,connection:recognized&&objectiveCorrect?1:null};}
      default:return {points:null,connection:null};
    }
  }
  function evaluate(id,raw,objectiveCorrect=true,context={}) {
    const anchors=id==='D1'?['The removed area is 5 × 3 = 15, so subtract 15 from 5x.','At x = 7, the remaining area is 5 × (7 − 3) = 20.']:sportsAnchors[id]??original.anchors(id);
    if(!anchors.length)return null;
    const {text:t,unclearQuote}=retainedText(raw);
    const reasons=[];if(!String(raw??'').trim())reasons.push('missing_explanation');
    if(!objectiveCorrect)reasons.push('objective_conflict');
    if(unclearQuote)reasons.push('quoted_claim_unclear');
    let points=null,connection=null,matched=[],contradicted=false;
    if(sportsAnchors[id]) {
      const result=sports(id,t,objectiveCorrect);({points,connection}=result);
      contradicted=!!result.contradicted;reasons.push(...(result.reviewReasons??[]));
      if(points!==null)matched=[anchors[0]];
    }else{
      const scoped=id==='C10'?t.replace(/not\s*(?:a\s*)?per[- ]visit(?:\s*cost)?/g,'fixed fee'):t;
      const clauses=scoped.split(/(?<=[.!?;])\s+|\s+but\s+/).filter(Boolean);
      const wrongClauses=clauses.filter(c=>has(c,wrong[id]??[]));
      const goodText=clauses.filter(c=>!has(c,wrong[id]??[])).join(' ');
      const base=original.evaluate(id,goodText,true);
      let flags=base.anchors.map(a=>base.matched.includes(a));
      const extra=extraCore(id,goodText);if(extra)flags=flags.map((f,i)=>f||!!extra[i]);
      if(id==='FP')points=flags.some(Boolean)?2:null;
      else if(id==='C4'||id==='FG')points=flags.every(Boolean)?2:flags.some(Boolean)?1:null;
      else if(id==='C10')points=flags.some(Boolean)?2:null;
      else points=flags[0]?2:flags[1]?1:null;
      // Bare named mechanisms and downward movement are partial, not absent.
      if(points===null&&((id==='C6'||id==='FE')&&/distributive property/.test(goodText)||id==='C9'&&/line goes down/.test(goodText)||id==='C10'&&/12.{0,20}y.intercept/.test(goodText)||id==='FN'&&/below\s*0/.test(goodText)))points=1;
      if(id==='FE'&&points===null&&/2.{0,20}(?:become|should become).{0,10}8/.test(goodText))points=1;
      matched=flags.map((f,i)=>f?anchors[i]:null).filter(Boolean);
      if(wrongClauses.length){
        contradicted=true;
        if(points!==null){points=null;reasons.push('internal_contradiction');}
        else {points=0;reasons.push('incorrect_retained_claim');}
      }
      // Unresolved negation is held for review, never automatically marked wrong.
      // Only narrow, mathematically benign negations have explicit handling here.
      let negationCheck=goodText;
      if(id==='C10')negationCheck=negationCheck.replace(zeroVisitFee,' ');
      if(id==='C4')negationCheck=negationCheck.replace(/\bb\b[^.!?;]{0,60}(?:not|isn't|doesn't|fails)[^.!?;]{0,30}(?:proportional|origin|constant ratio)/g,' ');
      if(id==='FP')negationCheck=negationCheck.replace(/\bgym\b[^.!?;]{0,45}(?:not|doesn't|miss)[^.!?;]{0,25}origin/g,' ').replace(/no\s*start(?:ing)?\s*fee/g,' ').replace(zeroLapsTime,' ');
      if(/\b(?:not|never|no)\b|n't\b/.test(negationCheck)) {points=null;connection=null;reasons.push('unresolved_negation');}
      // Concrete connections are separate; never needed for core full credit.
      if(points!==null&&points>0){
        const connections={
          C4:/\ba\b.{0,60}\b3\b/.test(goodText)&&/\bb\b.{0,50}\b2\b/.test(goodText),
          C6:/\b2\b.{0,30}(?:times|multipl|\*).{0,15}\b3\b|\b3\b.{0,25}multipl.{0,15}\b2\b/.test(goodText),
          C9:/-\s*2\s*\/\s*2|from\s*2\s*to\s*0|from\s*0\s*to\s*2|\bx\b[^.!?;]{0,15}(?:grows?|increases?)\s*(?:by\s*)?\+?1\b[^.!?;]{0,25}\by\b[^.!?;]{0,15}(?:decreases?|falls?|drops?)\s*(?:by\s*)?1\b/.test(goodText),
          C10:zeroVisitFee.test(goodText)||/\b0\s*visits?\b.{0,40}\b12\b|\b12\b.{0,40}(?:before|no)\s*(?:any\s*)?visits?/.test(goodText),
          FN:/-\s*2.{0,40}(?:subtract|minus|-|left).{0,20}4|-\s*2.{0,40}-\s*6/.test(goodText),
          FP:zeroLapsTime.test(goodText)||zeroVisitsCost.test(goodText)||/0\s*laps?.{0,40}0\s*minutes?|0\s*minutes?.{0,40}0\s*laps?|gym.{0,45}(?:4|four).{0,40}(?:0|before any)\s*visits?/.test(goodText),
          FE:/\b4\b.{0,35}(?:times|multipl|\*).{0,15}\b2\b|\b2\b.{0,25}multipl.{0,15}\b4\b/.test(goodText),
          FG:/6\s*(?:\/|over)\s*2|7\s*-\s*1/.test(goodText)&&/\bb\b.{0,40}(?:coefficient|slope|rate).{0,15}2/.test(goodText)
        };
        connection=connections[id]?1:0;
      }
    }
    const concrete=window.ClueveraReasonEvidence?.assess(id,t,context.answer??{},context.task??null);
    if(concrete?.matched&&!contradicted&&!unclearQuote){
      points=Math.max(points??0,concrete.points);connection=concrete.connection??connection;
      matched=[...new Set([...matched,...anchors.slice(0,concrete.points===2?anchors.length:1)])];
      // These recognized everyday negations have a specific mathematical role.
      if(['C10','S6','FB'].includes(id)&&concrete.points===2){const n=reasons.indexOf('unresolved_negation');if(n>=0)reasons.splice(n,1);}
    }
    if(concrete?.errors.length){points=points>0?1:null;connection=null;contradicted=true;reasons.push('arithmetic_error');}
    if(unclearQuote){points=null;connection=null;}
    if(points===null&&!reasons.includes('missing_explanation')&&!reasons.includes('answer_explanation_conflict'))reasons.push('unknown_or_conflicting_wording');
    const needsReview=reasons.length>0;
    return {points,max:2,connection,connectionMax:1,status:needsReview?'Needs review':'Provisional credit',matched,anchors,contradicted,objectiveConflict:!objectiveCorrect,reviewReasons:[...new Set(reasons)],calculationChecks:concrete?.equations??[],method:'claim_and_calculation_evidence_0.6; not a semantic certification',evidenceSpans:matched.length?[{start:0,end:String(raw).length,text:String(raw),claimStatus:contradicted||points===null?'unresolved':'retained'}]:[]};
  }
  const counterexampleAnchors=['At x = 3, x² is 9 while 2x is 6. One unequal pair disproves an identity claimed for every x.'];
  function counterexample(raw,correct){
    const evidence=window.ClueveraReasonEvidence.assess('C6',raw),errors=evidence.errors.filter(e=>e.value!==null),reasons=[];
    if(!String(raw??'').trim())reasons.push('missing_explanation');
    else if(evidence.points===null)reasons.push('unknown_or_conflicting_wording');
    if(errors.length)reasons.push('arithmetic_error');if(!correct)reasons.push('objective_conflict');
    return{points:errors.length?null:evidence.points,max:2,connection:evidence.connection,connectionMax:1,status:reasons.length?'Needs review':'Provisional credit',matched:evidence.matched?counterexampleAnchors:[],anchors:counterexampleAnchors,contradicted:!!errors.length,objectiveConflict:!correct,reviewReasons:reasons,calculationChecks:evidence.equations.filter(e=>e.value!==null),method:'counterexample_calculation_evidence_0.6',evidenceSpans:evidence.matched?[{start:0,end:String(raw).length,text:String(raw),claimStatus:errors.length?'unresolved':'retained'}]:[]};
  }
  window.ClueveraReasoning={evaluate,counterexample,counterexampleAnchors,anchors:id=>id==='D1'?['The removed area is 5 × 3 = 15, so subtract 15 from 5x.','At x = 7, the remaining area is 20.']:sportsAnchors[id]??original.anchors(id),ids:[...original.ids,...Object.keys(sportsAnchors)]};
})();
