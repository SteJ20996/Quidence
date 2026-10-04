/* Prewritten reason anchors. The browser only offers provisional evidence; it never
   assigns zero to an unrecognized explanation. The original text stays available. */
(() => {
  "use strict";
  const normalized = value => String(value ?? "").toLowerCase()
    .replace(/[−–—]/g,"-").replace(/[’]/g,"'").replace(/×/g,"*")
    .replace(/\bzero\b/g,"0").replace(/\bone\b/g,"1")
    .replace(/\btwo\b/g,"2").replace(/\bthree\b/g,"3")
    .replace(/\bfour\b/g,"4").replace(/\bsix\b/g,"6")
    .replace(/\btwelve\b/g,"12").replace(/\s+/g," ").trim();
  const has = (t,expressions) => expressions.some(re=>re.test(t));
  const rubrics = {
    V1:{
      anchors:["Both mixed parts contribute: 8·x·5 = 40x and 8·3·2x = 48x; add them to get 88x.","Partition both lengths and retain height 8 in every part; the four volumes sum to the whole."],
      detect(t){return [has(t,[/\b40\s*x?\s*\+\s*48\s*x?\s*(?:=\s*88\s*x?)?\b/,/\b48\s*x?\s*\+\s*40\s*x?\s*(?:=\s*88\s*x?)?\b/,/\b40x\b.{0,70}\b48x\b.{0,40}(?:add|sum|combin|88)/,/(?:add|sum|combin).{0,40}\b40x\b.{0,40}\b48x\b/]),has(t,[/(?:both|each|every).{0,25}(?:length|term|part).{0,50}(?:8|height|volum)/,/(?:four|4).{0,25}(?:volum|part|block).{0,55}(?:sum|add|8|height)/])];},
      contradiction:t=>/\b40\s*x?\s*\+\s*48\s*x?\s*=\s*(?:40|48)\s*x?\b/.test(t)
    },
    D1:{
      anchors:["The removed strip has width 2 and height 3, so its area is 6, which is subtracted from 3x.","At x=5 the remaining width is 3, so the remaining area is 9."],
      detect(t){return [has(t,[/\b(?:3\s*\*\s*2|2\s*\*\s*3)\s*=\s*6\b/,/(?:strip|remov|subtract|cut).{0,65}(?:area|3|height).{0,40}\b6\b/,/\b6\b.{0,50}(?:strip|remov|subtract|cut)/,/(?:multiply|times|height).{0,35}\b2\b.{0,30}\b3\b/,/\b3x\s*-\s*6\b.{0,60}(?:strip|area|width|remov)/]),has(t,[/\b5\s*-\s*2\s*=\s*3\b/,/\b3\s*\*\s*3\s*=\s*9\b/,/(?:remaining|kept).{0,35}\b9\b/])];},
      contradiction:t=>/(?:removed|strip|subtract).{0,35}(?:area\s*(?:is|=)\s*2\b|only\s*2\b)/.test(t)
    },
    C4:{
      anchors:["A has a constant points-per-puzzle ratio (3 per puzzle).","B begins with 2 points at 0 puzzles, so its points are not proportional to puzzles."],
      detect(t) {
        const a=has(t,[
          /\ba\b.{0,70}(?:constant|same|equal)\s*(?:ratio|rate|quotient)/,
          /\ba\b.{0,80}(?:3\s*(?:points?|pts?)\s*(?:per|each|for every)\s*puzzle|3\s*(?:times|\*|x)\s*(?:the\s*)?(?:puzzles?|x))/,
          /\b(?:ratio|rate)\b.{0,30}\ba\b.{0,45}\b3\b/,
          /\ba\b.{0,45}\b1\s*[:=,]\s*3\b.{0,45}\b2\s*[:=,]\s*6\b/,
          /\ba\b.{0,50}\bproportional\b.{0,35}\b3\b/,
          /\ba\b.{0,45}(?:passes|goes)\s*through\s*(?:the\s*)?origin/,
          /\ba\b.{0,85}(?:points?\s*per\s*puzzle|ratio|rate).{0,35}(?:3|constant|same|stays?)/,
          /\ba\b.{0,30}(?:y\s*=\s*)?3\s*\*?\s*x\b/
        ]);
        const b=has(t,[
          /\bb\b.{0,65}(?:starts?|start(?:ing)?|initial|bonus|base|intercept|at\s*0|when\s*\w*\s*0|origin).{0,35}(?:2|nonzero|not\s*0)/,
          /\bb\b.{0,40}\b2\b.{0,35}(?:0|start|bonus|initial|intercept|origin)/,
          /\b0\s*puzzles?\b.{0,35}\b2\s*points?\b/,
          /\bb\b.{0,35}(?:not|isn't|doesn't|fails).{0,30}(?:proportional|constant ratio|same ratio|origin)/,
          /\bb\b.{0,30}(?:y\s*=\s*)?3\s*\*?\s*x\s*\+\s*2\b/
        ]);
        return [a,b];
      },
      contradiction:t=>/\bb\s+(?:is|must be)\s+proportional\b/.test(t)&&!/\bb\s+is\s+not\s+proportional\b/.test(t)
    },
    C6:{
      anchors:["The 2 must multiply both terms inside the parentheses, including 3.","The constant becomes 6, giving 2x + 6 = 14."],
      detect(t) {
        const core=has(t,[
          /(?:distribut|multiply|multiplied|times|appl).{0,50}(?:both|each|every|inside|parenthes|3|second|constant)/,
          /(?:both|each|every).{0,30}(?:term|part).{0,35}(?:2|multipli|times)/,
          /\b2\b.{0,30}(?:multiply|times|\*).{0,20}\b3\b/,
          /\b3\b.{0,30}(?:multiply|times|\*).{0,20}\b2\b/,
          /\b2\s*\(?\s*3\s*\)?\s*=\s*6\b/,
          /(?:double|twice).{0,25}(?:3|constant)/
        ]);
        const detail=has(t,[/\b3\b.{0,30}\b6\b/,/\b6\b.{0,30}\b3\b/,/\b2x\s*\+\s*6\b/]);
        return [core,detail];
      },
      contradiction:t=>/\b2x\s*\+\s*3\s*(?:=\s*14)?\s*(?:is|was)\s*(?:correct|right)\b/.test(t)
    },
    C9:{
      anchors:["As x increases, y decreases, so the rate of change is negative.","From (0, 2) to (2, 0), the rise is −2 over a run of 2, making m = −1."],
      detect(t) {
        const xUp=has(t,[/\bx\b.{0,25}(?:increas|go(?:es)? up|grow|rise)/,/(?:increas|go(?:es)? up|grow|rise).{0,25}\bx\b/,/left\s*(?:to|→)\s*right/]);
        const yDown=has(t,[/\by\b.{0,25}(?:decreas|go(?:es)? down|drop|fall)/,/(?:decreas|go(?:es)? down|drop|fall).{0,25}\by\b/,/line\s*(?:go(?:es)?|slopes?|tilts?)\s*down/]);
        const arithmetic=has(t,[/\b(?:rise|change\s*in\s*y)\b.{0,35}-\s*2\b/,/\b0\s*-\s*2\b.{0,35}\b2\s*-\s*0\b/,/\b2\s*(?:to|→)\s*0\b.{0,45}\b0\s*(?:to|→)\s*2\b/,/-\s*2\s*\/\s*2/]);
        const core=(xUp&&yDown)||arithmetic||has(t,[
          /\bnegative\s*(?:rate|slope|change)\b.{0,50}(?:down|decreas|fall|drop)/,
          /(?:falls?|drops?|slopes?\s*down|goes?\s*down|decreas(?:es)?)\s*(?:from\s*)?left\s*(?:to|→)\s*right/
        ]);
        return [core,arithmetic];
      },
      contradiction:t=>/\b(?:slope|rate)\s+(?:is\s+)?positive\b/.test(t)||/\bx\b.{0,20}increas.{0,35}\by\b.{0,20}increas/.test(t)
    },
    C10:{
      anchors:["At 0 visits, the center still charges $12.","The $12 is the one-time starting or sign-up fee, not a per-visit cost."],
      detect(t) {
        const zero=has(t,[/\b0\s*(?:visits?|times?)\b.{0,45}\b12\b/,/\b12\b.{0,45}\b0\s*visits?\b/,/before\s*(?:any|the\s*first|0)\s*visits?.{0,35}\b12\b/,/\bc\s*\(\s*0\s*\)\s*=\s*12\b/]);
        const fee=has(t,[/\b12\b.{0,40}(?:fee|sign.?up|initial|start|base|fixed|entry|membership)/,/(?:fee|sign.?up|initial|start|base|fixed|entry|membership).{0,40}\b12\b/]);
        return [zero,fee];
      },
      contradiction:t=>/\b0\s*visits?.{0,35}\b(?:0\s*dollars?|free|no\s*cost)\b/.test(t)
    },
    FN:{
      anchors:["A drop of 4 means subtract 4 from −2 or move 4 spaces left.","The result is a smaller, colder number (−6)."],
      detect(t) {
        const core=has(t,[/(?:subtract|minus|take away)\s*4/,/(?:left|lower|colder|smaller|more negative).{0,45}(?:4|drop|decreas)/,/(?:drop|decreas).{0,45}(?:left|lower|colder|smaller|more negative)/,/(?:drop|decreas|fall).{0,20}\b4\b.{0,12}(?:less|lower)/,/-\s*2\s*-\s*4\s*=\s*-\s*6/]);
        const detail=has(t,[/-\s*2.{0,35}-\s*6/,/-\s*6.{0,25}(?:colder|lower|smaller|left)/,/(?:move|go).{0,15}left\s*4/]);
        return [core,detail];
      },
      contradiction:t=>/\b(?:move|go)\s*right\b/.test(t)||/\bgets?\s*warmer\b/.test(t)
    },
    FP:{
      anchors:["Running time is 0 at 0 laps, so its graph passes through (0, 0).","The gym has a $4 starting fee at 0 visits, so its graph misses the origin."],
      detect(t) {
        const run=has(t,[/(?:run|laps?|time).{0,45}\b0\b.{0,25}\b0\b/,/\b0\s*laps?\b.{0,30}\b0\s*(?:minutes?|time)\b/,/(?:run|laps?).{0,50}(?:origin|no\s*start(?:ing)?\s*fee)/]);
        const gym=has(t,[/(?:gym|visit|fee).{0,50}\b4\b.{0,35}(?:start|initial|fee|0|origin)/,/(?:gym|fee).{0,40}(?:start|initial|base|fixed|nonzero).{0,30}(?:origin|0|visit)/,/(?:gym|fee).{0,40}(?:not|doesn't|miss).{0,25}origin/,/\bgym\b.{0,30}(?:y\s*=\s*4|intercept\s*(?:is|=)\s*4)/]);
        return [run,gym];
      },
      contradiction:t=>/\bgym\s+(?:also\s+)?(?:passes|goes)\s+through\s+(?:the\s+)?origin\b/.test(t)
    },
    FE:{
      anchors:["The 4 must multiply both terms, including the 2 in parentheses.","4 × 2 = 8, so the constant is 8 in 4x + 8 = 20."],
      detect(t) {
        const core=has(t,[
          /(?:distribut|multiply|multiplied|times|appl).{0,50}(?:both|each|every|inside|parenthes|2|second|constant)/,
          /\b4\b.{0,30}(?:multiply|times|\*).{0,20}\b2\b/,
          /\b2\b.{0,30}(?:multiply|times|\*).{0,20}\b4\b/,
          /\b4\s*\(?\s*2\s*\)?\s*=\s*8\b/
        ]);
        const detail=has(t,[/\b2\b.{0,30}\b8\b/,/\b8\b.{0,30}\b2\b/,/\b4x\s*\+\s*8\b/]);
        return [core,detail];
      },
      contradiction:t=>/\b4x\s*\+\s*2\s*(?:=\s*20)?\s*(?:is|was)\s*(?:correct|right)\b/.test(t)
    },
    FG:{
      anchors:["Line A rises 6 over a run of 2, giving slope 3.","Plan B's coefficient of x is 2; compare 3 and 2, not the starting values."],
      detect(t) {
        const a=has(t,[/\ba\b.{0,45}(?:slope|rate|per|each).{0,16}\b3\b/,/\ba\b.{0,45}\b3\b.{0,16}(?:slope|rate|per|each)/,/\b(?:7\s*-\s*1|6)\s*\/\s*2\s*=\s*3\b/,/\(\s*7\s*-\s*1\s*\)\s*\/\s*\(\s*2\s*-\s*0\s*\)\s*=\s*3/,/\ba\b.{0,45}(?:rise|increas|goes? up).{0,20}\b6\b.{0,30}\b2\b/]);
        const b=has(t,[/\bb\b.{0,50}(?:slope|rate|coefficient|per|each).{0,15}\b2\b/,/\bb\b.{0,45}\b2\b.{0,18}(?:slope|rate|coefficient|per|each)/,/\bb'?s?\s+(?:is|=)\s*2\b/,/\by\s*=\s*2x\s*\+\s*5\b.{0,50}(?:rate|slope|coefficient|2)/,/\b3\s*(?:>|greater\s*than|more\s*than)\s*2\b/]);
        return [a,b];
      },
      contradiction:t=>/\bb\s+(?:is\s+)?(?:faster|steeper|greater)\b/.test(t)&&!/\bb\s+is\s+not\s+(?:faster|steeper|greater)\b/.test(t)
    }
  };
  function evaluate(id,text,objectiveCorrect=true) {
    const rubric=rubrics[id];if(!rubric)return null;
    const t=normalized(text);
    const flags=rubric.detect(t);
    const coreItems={C4:2,C6:0,C9:0,C10:-1,FN:0,FP:2,FE:0,FG:2};
    let points;
    if(flags.every(Boolean))points=2;
    else if(coreItems[id]===0&&flags[0])points=2; // the central mechanism alone earns full credit
    else if(coreItems[id]===-1&&flags.some(Boolean))points=2; // either clear reading of (0, 12) is the core meaning
    else if(flags.some(Boolean))points=1;
    else points=null; // no automatic zero for wording we did not anticipate
    const contradicted=rubric.contradiction(t);
    const needsReview=points===null||contradicted||!objectiveCorrect;
    return {points,max:2,status:needsReview?"Needs review":"Provisional credit",
      matched:flags.map((v,i)=>v?rubric.anchors[i]:null).filter(Boolean),
      anchors:rubric.anchors,contradicted,objectiveConflict:!objectiveCorrect};
  }
  window.AA01Rubrics={evaluate,anchors:id=>rubrics[id]?.anchors??[],ids:Object.keys(rubrics)};
})();
