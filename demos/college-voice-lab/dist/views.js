import {fmt} from './core.js?v=six-subjects-1';
const tx=(x,y,t,size=12,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" ${extra}>${t}</text>`;
const line=(x1,y1,x2,y2,color='#dce5dd',extra='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" ${extra}/>`;
const svg=(body,label)=>`<svg viewBox="0 0 600 380" role="img" aria-label="${label}">${body}</svg>`;
const range=(key,prop,label,value,min,max,step,suffix='')=>`<label class="control-label" for="${key}"><span>${label}</span><output data-output="${prop}" data-suffix="${suffix}">${value}${suffix}</output></label><input id="${key}" data-model-prop="${prop}" type="range" min="${min}" max="${max}" step="${step}" value="${value}">`;
const select=(key,prop,label,value,options,disabled=false)=>`<label class="confidence-choice" for="${key}">${label}<select id="${key}" data-model-prop="${prop}"${disabled?' disabled':''}>${options.map(([n,t])=>`<option value="${n}"${value===n?' selected':''}>${t}</option>`).join('')}</select></label>`;
function wavePlot(m){
 const X=x=>48+x*510/360,unit=m.amplitude===3?42:104,Y=y=>190-y*unit;let b='';
 for(let x=0;x<=360;x+=90)b+=line(X(x),45,X(x),326)+tx(X(x),350,x+'°',12,'text-anchor="middle"');
 for(let y=-m.amplitude;y<=m.amplitude;y++)b+=line(42,Y(y),558,Y(y))+tx(35,Y(y)+4,y,11,'text-anchor="end"');
 b+=line(42,190,568,190,'#8da69e');
 const curve=(a,k,color,width)=>{const pts=[];for(let x=0;x<=360;x+=1.5)pts.push(X(x)+','+Y(a*Math.sin(k*x*Math.PI/180)));return `<polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="${width}"/>`;};
 b+=curve(1,1,'#b6a5ce',2)+curve(m.amplitude,m.b,'#15565b',3);
 b+=line(X(m.theta),45,X(m.theta),326,'#cc937d','stroke-dasharray="4 5"')+`<circle cx="${X(m.theta)}" cy="${Y(m.value)}" r="5" fill="#dc8e75"/>`;
 b+=tx(48,26,'Purple: sin(x) · Teal: '+(m.amplitude===1?'':m.amplitude+' ')+'sin('+m.b+'x)',13)+tx(302,376,'x in degrees · the vertical scales match',11,'text-anchor="middle"');
 return svg(b,'A sine wave and the highlighted transformed wave, shown over 0 to 360 degrees with a shared vertical scale.');
}
function rectanglePlot(m){
 const k=24,w=m.w*k,h=m.h*k,X=300-w/2,Y=180-h/2;let b='';
 for(let x=48;x<=552;x+=24)b+=line(x,35,x,325,'#e4e9df');for(let y=36;y<=324;y+=24)b+=line(45,y,555,y,'#e4e9df');
 b+=`<rect x="${X}" y="${Y}" width="${w}" height="${h}" rx="2" fill="#dcece3" stroke="#15565b" stroke-width="3"/>`;
 b+=tx(300,Y-14,'width = '+m.w,14,'text-anchor="middle"')+tx(X+w+15,184,'h = '+m.h,13)+tx(300,182,fmt(m.area)+' square units',15,'text-anchor="middle"');
 b+=tx(300,354,'Perimeter = 2('+m.w+' + '+m.h+') = '+m.perimeter,13,'text-anchor="middle"')+tx(300,376,'One grid square is 1 × 1 unit.',11,'text-anchor="middle"');
 return svg(b,'A rectangle with width '+m.w+' and height '+m.h+'. Its perimeter is '+m.perimeter+' and its area is '+m.area+'.');
}
function growthPlot(m){
 const maxX=5,maxY=m.start*m.b**maxX,X=x=>55+x*96,Y=y=>315-y*250/maxY;let b='';
 for(let i=0;i<=4;i++){const y=maxY*i/4;b+=line(55,Y(y),546,Y(y))+tx(46,Y(y)+4,fmt(y,1),11,'text-anchor="end"');}
 for(let x=0;x<=5;x++)b+=line(X(x),315,X(x),322,'#8da69e')+tx(X(x),343,x,12,'text-anchor="middle"');
 b+=line(55,315,546,315,'#8da69e')+line(55,55,55,322,'#8da69e');const pts=[];for(let i=0;i<=100;i++){const x=i/20;pts.push(X(x)+','+Y(m.start*m.b**x));}b+=`<polyline points="${pts.join(' ')}" fill="none" stroke="#a89abf" stroke-width="3"/>`;
 for(let x=0;x<=5;x++)b+=`<circle cx="${X(x)}" cy="${Y(m.start*m.b**x)}" r="4" fill="#a89abf"/>`;
 b+=`<path d="M${X(m.x)},${Y(m.value)} H${X(m.x+1)} V${Y(m.next)}" fill="none" stroke="#15565b" stroke-width="3" stroke-dasharray="5 4"/><circle cx="${X(m.x)}" cy="${Y(m.value)}" r="6" fill="#15565b"/><circle cx="${X(m.x+1)}" cy="${Y(m.next)}" r="6" fill="#15565b"/>`;
 b+=tx(55,29,'Teal: the selected one-step increase',13)+tx(302,375,'x · equally spaced steps on a linear y-axis',11,'text-anchor="middle"');
 return svg(b,'An exponential curve on linear axes. The highlighted step goes from x = '+m.x+' to '+(m.x+1)+'.');
}
function gameTable(m,transfer){
 const labels=transfer?['Risky','Safe']:['Cooperate','Compete'],matrix=transfer?[[[4,4],[0,3]],[[3,0],[2,2]]]:[[[3,3],[0,5]],[[5,0],[1,1]]];
 return `<div class="payoff-wrap"><p class="payoff-key">Each pair: <span>Your payoff</span>, other player’s payoff</p><table class="payoff-table"><caption>Other player’s move</caption><thead><tr><th scope="col">Your move</th>${labels.map(t=>`<th scope="col">${t}</th>`).join('')}</tr></thead><tbody>${matrix.map((row,a)=>`<tr><th scope="row">${labels[a]}</th>${row.map((v,b)=>`<td${m.a===a&&m.b===b?' class="chosen" aria-label="Selected outcome: your payoff '+v[0]+', other player payoff '+v[1]+'"':''}><span>${v[0]}</span><span>, ${v[1]}</span>${m.a===a&&m.b===b?'<small>Selected</small>':''}</td>`).join('')}</tr>`).join('')}</tbody></table><div class="deviation"><span>If only you switch:</span><strong>${m.own} → ${m.switchOwn}</strong><span>Your payoff change: ${m.gainOwn>0?'+':''}${m.gainOwn}</span></div></div>`;
}
export function extraView(id,m,s,transfer){
 const fixed='<p class="hint">This new case is fixed. Your earlier settings and answers remain in the notes.</p>';
 switch(id){
 case 'precalculus':return {title:'Same height. A different rhythm.',tag:'y = '+(m.amplitude===1?'':m.amplitude+' ')+'sin('+m.b+'x)',description:'At x = '+m.theta+'°, the highlighted curve has y = '+fmt(m.value,3)+'.',plot:wavePlot(m),note:'Purple: sin(x). Teal: the transformed curve. Angles are in degrees; both curves share the same vertical scale.',controls:transfer?fixed:range('wave-b','b','Inside multiplier b',s.model.b,1,4,1)+range('wave-angle','theta','Move along the curve',s.model.theta,0,360,15,'°'),metrics:[['Amplitude',m.amplitude],['Period',fmt(m.period)+'°'],['Cycles in 360°',m.cycles]],conditions:'Angles are in degrees. For y = A sin(bx), amplitude is |A| and the period is 360°/|b| when b is nonzero. The displayed multiplier is positive. The purple reference is sin(x).'};
 case 'geometry':return {title:'One boundary. Different interiors.',tag:'P = '+m.perimeter+' units',description:'Width '+m.w+' × height '+m.h+' · area = width × height',plot:rectanglePlot(m),note:'The side lengths and area are drawn to a shared unit scale. Perimeter is measured in units; area is measured in square units.',controls:transfer?fixed:range('rect-width','w','Width',s.model.w,1,11,1)+'<div class="range-ends"><span>1 unit</span><span>11 units</span></div>',metrics:[['Perimeter',m.perimeter],['Area',m.area],['Largest area at this P',m.maxArea]],conditions:'Rectangles have positive side lengths. With perimeter '+m.perimeter+', height = '+m.perimeter/2+' − width and area = '+m.maxArea+' − (width − '+m.perimeter/4+')². The square maximizes the area among these rectangles. A fixed perimeter does not force a fixed area.'};
 case 'algebra2':return {title:'Same multiplier. A new increase.',tag:(transfer?'g':'f')+'(x) = '+m.start+' × '+m.b+'ˣ',description:(transfer?'g':'f')+'('+m.x+') = '+fmt(m.value)+' → '+(transfer?'g':'f')+'('+(m.x+1)+') = '+fmt(m.next),plot:growthPlot(m),note:'Teal points show consecutive values. The vertical axis is linear and rescales when the multiplier changes; compare the numerical differences and ratios.',controls:transfer?fixed:range('growth-x','x','Start of the selected step: x',s.model.x,0,4,1)+select('growth-base','b','Multiplier',s.model.b,[[1.25,'1.25'],[1.5,'1.5'],[2,'2']],s.phase===0),metrics:[['Current value',fmt(m.value)],['Added amount',fmt(m.delta)],['One-step ratio',m.ratio]],conditions:'This is a mathematical exponential model, not a financial forecast. x advances in equal one-unit steps. For f(x) = A bˣ, the ratio f(x+1)/f(x) is b and the added amount is A bˣ(b − 1).'};
 case 'game-theory':return {title:transfer?'A new table. New incentives.':'A total is not an incentive.',tag:transfer?'Coordination game':'Two players · one round',description:transfer?'A new game: both players currently choose Risky.':'Choose a profile, then hold one player’s move fixed.',plot:gameTable(m,transfer),note:'The first number belongs to you. The second belongs to the other player. A selected cell is an outcome, not a recommendation.',controls:transfer?fixed:select('game-you','a','Your move',s.model.a,[[0,'Cooperate'],[1,'Compete']])+select('game-other','b','Other player’s move',s.model.b,[[0,'Cooperate'],[1,'Compete']]),metrics:[['Your payoff',m.own],['Other payoff',m.other],['Combined payoff',m.total]],conditions:transfer?'A one-shot coordination game with known payoffs. Both Risky and both Safe are pure Nash equilibria. At both Risky, switching alone changes your payoff from 4 to 3. This demo examines pure-strategy deviations; it does not analyze mixed equilibria.':'A one-shot, simultaneous game with known payoffs. Each player maximizes their own payoff. Compete strictly dominates Cooperate, so both competing is the unique Nash equilibrium, although both cooperating has a higher combined payoff. Real repeated interactions can have different incentives.'};
 default:throw Error('Missing model view');
 }
}
export function sampleLabel(id,s){const m=s.result;switch(id){case 'precalculus':return 'b '+m.b+' · period '+fmt(m.period)+'°';case 'geometry':return m.w+' × '+m.h+' · area '+m.area;case 'algebra2':return 'x '+m.x+' · adds '+fmt(m.delta);case 'game-theory':return (m.a===0?'Cooperate':'Compete')+' / '+(m.b===0?'Cooperate':'Compete');}}
