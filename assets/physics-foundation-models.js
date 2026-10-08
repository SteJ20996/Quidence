(function(root){
'use strict';
const M=typeof module==='object'&&module.exports?require('./course-models.js'):root.QuidenceCourseModels;
const Old=typeof module==='object'&&module.exports?require('./physics-models.js'):root.QuidencePhysicsModels;
const superscript=s=>String(s).replace(/[0-9+-]/g,c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'['0123456789'.indexOf(c)]||({'+':'⁺','-':'⁻'}[c]));
const fmt=n=>{if(n===0)return'0';if(Math.abs(Number(n.toPrecision(3)))>=1e3||Math.abs(n)<1e-3){const [a,b]=n.toExponential(2).split('e');return a+' × 10'+superscript(Number(b));}return n.toPrecision(3);};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=(x,y,s,color='#263c5b')=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="14" fill="${color}">${esc(s)}</text>`;
const line=(x,y,u,v,color='#6542c0')=>`<path d="M${x} ${y}L${u} ${v}" fill="none" stroke="${color}" stroke-width="3"/>`;
function arrow(x,y,u,v,color='#6542c0'){const d=Math.hypot(u-x,v-y);if(!d)return'';const a=(u-x)/d,b=(v-y)/d;return line(x,y,u,v,color)+`<path d="M${u-8*a+4*b} ${v-8*b-4*a}L${u} ${v}L${u-8*a-4*b} ${v-8*b+4*a}" fill="none" stroke="${color}" stroke-width="3"/>`;}
const box=(x,y,w,h,fill='#e6e0f5')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${fill}" stroke="#6542c0" stroke-width="2"/>`;
function diagram(track,index,s,v){
 let b='',title='',description='';
 if(track==='physics-1'&&index===2){
  title='Before and after two carts latch';description='Schematic positions, not a time simulation. East is right. Velocity arrows share a scale of 14 pixels per m/s; zero velocity has no arrow.';
  b=text(260,25,'Before latching · east →')+line(55,130,465,130,'#8391a5');
  for(const [x,m,speed,label]of [[140,s.massA,s.speedA,'A'],[375,s.massB,s.speedB,'B']])b+=box(x-35,95,70,35)+text(x,118,label+' · '+m+' kg')+arrow(x,75,x+14*speed,75)+text(x,52,speed+' m/s');
  b+=text(260,165,'After latching')+box(205,205,110,36)+text(260,229,(s.massA+s.massB)+' kg')+arrow(260,185,260+14*v.velocity,185,'#087f76')+text(260,275,'Joined velocity: '+fmt(v.velocity)+' m/s');
 }else if(track==='physics-1'&&index===3){
  title='Radius and perpendicular force about a fixed axis';description='Top view. Radius uses 105 pixels per m; force arrows use 8 pixels per N. A rightward radius and upward tangential force give counterclockwise torque.';
  const x=180+105*s.radius;
  b=text(260,25,'Counterclockwise torque is positive')+`<circle cx="180" cy="145" r="${105*s.radius}" fill="none" stroke="#c5cedb" stroke-dasharray="5 5"/>`+line(180,145,x,145,'#8391a5')+`<circle cx="180" cy="145" r="5" fill="#263c5b"/><circle cx="${x}" cy="145" r="10" fill="#6542c0"/>`+arrow(x,145,x,145-8*s.force,'#087f76')+text(x+65,110,'F = '+s.force+' N')+text((180+x)/2,175,'r = '+s.radius+' m')+text(180,222,'Fixed axis')+text(365,222,'m = '+s.mass+' kg')+text(260,266,'I = '+fmt(v.inertia)+' kg·m² · τ = '+fmt(v.torque)+' N·m');
 }else if(track==='physics-1'&&index===5){
  title='Pressure at depth and displaced liquid';description='Schematic, not to scale. The pressure probe and fully submerged object are separate; object depth is not controlled. No weight or net force is specified.';
  b=box(80,65,360,170,'#e0f1f4')+text(260,48,'Liquid surface')+`<circle cx="135" cy="${85+65*s.depth}" r="5" fill="#6542c0"/>`+line(135,65,135,85+65*s.depth,'#8391a5')+text(205,120,'Probe: h = '+s.depth+' m')+box(320,165,65,40)+arrow(352,165,352,130,'#087f76')+text(350,115,'Buoyancy ↑')+text(350,225,s.volume+' L displaced')+text(260,270,'ρ = '+s.density+' kg/m³ · Gauge pressure excludes air pressure');
 }else if(track==='physics-2'&&index===0){
  title='Heat transferred into a sample';description='Energy-flow schematic, not a temperature or geometry scale. Heat enters a sample with no phase change, work, or loss; all readouts describe this ideal model.';
  b=box(235,100,175,100)+text(322,137,'Sample: '+s.mass+' kg')+text(322,169,'20°C → '+fmt(v.final)+'°C')+arrow(80,148,228,148,'#a84324')+text(145,122,'Heat in: '+fmt(v.heat)+' J')+text(260,245,'c = '+s.capacity+' J/(kg·K) · ΔT = '+s.change+' K');
 }else if(track==='physics-2'&&index===1){
  title='Source field and force on a signed probe';description='Distance is drawn at 300 pixels per m. Direction arrows are schematic and not magnitude scales. The source is held fixed externally; probe response does not move it.';
  const x=100+300*s.distance;
  b=text(260,27,'Right is positive')+`<circle cx="100" cy="145" r="16" fill="#e6e0f5" stroke="#6542c0"/><circle cx="${x}" cy="145" r="12" fill="#d2ece8" stroke="#087f76"/>`+text(100,150,'+')+text(x,150,s.charge>0?'+':s.charge<0?'−':'0')+text(100,189,'Source: +2 μC')+text(x,214,'Probe: '+s.charge+' μC')+line(100,240,x,240,'#8391a5')+text((100+x)/2,265,'r = '+s.distance+' m')+arrow(x,65,x+65,65)+text(x+30,48,'E →')+(s.charge===0?text(x,110,'F = 0'):arrow(x,100,x+Math.sign(s.charge)*65,100,'#087f76')+text(x,125,s.charge>0?'Force →':'← Force'));
 }else if(track==='physics-2'&&index===2){
  title='Series or parallel circuit';description='Circuit symbols are schematic, not to scale. Connected ideal wires and a constant-voltage source form a closed circuit. Parallel branches share both nodes.';
  b=text(260,25,s.arrangement==='series'?'Series · same current in both resistors':'Parallel · same voltage across both branches')+line(80,105,80,140,'#8391a5')+line(80,160,80,215,'#8391a5')+line(62,140,98,140,'#263c5b')+line(69,160,91,160,'#263c5b')+text(45,118,'+')+text(42,187,s.voltage+' V');
  if(s.arrangement==='series')b+=line(80,105,185,105,'#8391a5')+box(185,92,70,26)+line(255,105,320,105,'#8391a5')+box(320,92,70,26)+line(390,105,440,105,'#8391a5')+line(440,105,440,215,'#8391a5')+line(440,215,80,215,'#8391a5')+text(220,78,'R₁ = '+s.r1+' Ω')+text(355,78,'R₂ = '+s.r2+' Ω')+text(260,264,'I₁ = I₂ = '+fmt(v.current)+' A');
  else b+=line(80,105,145,105,'#8391a5')+line(145,80,145,190,'#8391a5')+line(145,80,240,80,'#8391a5')+box(240,67,70,26)+line(310,80,430,80,'#8391a5')+line(145,190,240,190,'#8391a5')+box(240,177,70,26)+line(310,190,430,190,'#8391a5')+line(430,80,430,215,'#8391a5')+line(430,215,80,215,'#8391a5')+text(275,57,'R₁ = '+s.r1+' Ω')+text(275,166,'R₂ = '+s.r2+' Ω')+text(260,265,'I = I₁ + I₂ = '+fmt(v.current)+' A');
 }else if(track==='physics-2'&&index===3){
  title='Magnetic force and a separate flux loop';description='Two separate schematics, not to scale. Crosses indicate field into the screen. A positive charge moves right, with force upward. Loop flux is shown as magnitude; its field is perpendicular.';
  b=text(260,25,'Two distinct models · B = '+s.field+' T');
  for(const x of [85,145,205,310,370,430])for(const y of [90,160,230])b+=text(x,y,'×','#8391a5');
  b=`<path d="M260 55V250" stroke="#c5cedb"/>`+b+`<circle cx="145" cy="165" r="9" fill="#6542c0"/>`+arrow(145,165,220,165)+arrow(145,165,145,100,'#087f76')+text(205,145,'v →')+text(179,115,'F ↑')+box(305,110,130,85,'none')+text(370,215,'A = '+s.area+' m²')+text(140,277,'Positive charge: qvB')+text(380,277,'Separate loop: |Φ| = BA');
 }else if(track==='physics-2'&&index===6){
  title='Photon energy compared with a work-function barrier';description='Energy bars share a scale of 35 pixels per eV and start at zero. At threshold, emission is possible with zero maximum kinetic energy. This schematic does not show electron trajectories.';
  b=line(80,245,440,245,'#8391a5')+box(125,245-35*v.energy,70,35*v.energy)+box(320,245-35*s.work,70,35*s.work,'#d2ece8')+text(160,270,'Photon: '+fmt(v.energy)+' eV')+text(355,270,'Barrier: '+s.work+' eV')+text(260,25,v.emits?'Emission possible · Kmax = '+fmt(v.kinetic)+' eV':'Below threshold · no emission');
 }
 return title?M.graphic(title,description,b):'';
}

function values(track,index,s){
 if(track==='physics-1'){
  if(index<2)return Old.values(index,s);
  if(index===2){const momentum=s.massA*s.speedA+s.massB*s.speedB,velocity=momentum/(s.massA+s.massB),initial=(s.massA*s.speedA**2+s.massB*s.speedB**2)/2,final=(s.massA+s.massB)*velocity**2/2,other=s.massA*s.massB/(2*(s.massA+s.massB))*(s.speedA-s.speedB)**2;return{momentum,velocity,initial,final,other};}
  if(index===3){const inertia=s.mass*s.radius**2,torque=s.force*s.radius;return{inertia,torque,alpha:torque/inertia,momentum:inertia*s.omega};}
  if(index===4)return{period:2*Math.PI*Math.sqrt(s.mass/s.stiffness),energy:s.stiffness*s.amplitude**2/2};
  if(index===5)return{pressure:s.density*10*s.depth,buoyancy:s.density*10*s.volume/1000};
 }
 if(track==='physics-2'){
  if(index===0)return{heat:s.mass*s.capacity*s.change,final:20+s.change};
  if(index===1){const field=9000000000*0.000002/s.distance**2;return{field,potential:9000000000*0.000002/s.distance,force:s.charge*0.000001*field};}
  if(index===2){const resistance=s.arrangement==='series'?s.r1+s.r2:1/(1/s.r1+1/s.r2),current=s.voltage/resistance;return{resistance,current,power:s.voltage*current,i1:s.arrangement==='series'?current:s.voltage/s.r1,i2:s.arrangement==='series'?current:s.voltage/s.r2};}
  if(index===3)return{force:s.charge*0.000001*s.speed*s.field,flux:s.field*s.area};
  if(index===4){const image=s.focal*s.object/(s.object-s.focal);return{image,magnification:-image/s.object,height:-image/s.object*2};}
  if(index===5)return Old.values(3,s);
  if(index===6){const energy=4.14e-15*s.frequency*1e14;return{energy,threshold:s.work/4.14e-15,emits:energy>=s.work,kinetic:Math.max(0,energy-s.work)};}
 }
 throw Error('Unknown physics foundation model');
}
function model(track,index,s){
 if(track==='physics-1'&&index<2||track==='physics-2'&&index===5){
  const oldIndex=track==='physics-1'?index:3,r=Old.model(oldIndex,s),v=Old.values(oldIndex,s);
  r.readout=oldIndex===0?'At 4 s: position '+fmt(v.end)+' m · Displacement '+fmt(v.displacement)+' m · Distance '+fmt(v.distance)+' m':oldIndex===1?'Net force '+fmt(v.net)+' N · Acceleration '+fmt(v.acceleration)+' m/s²':'Wavelength '+fmt(v.wavelength)+' m · Period '+fmt(v.period)+' s';
  return r;
 }
 const v=values(track,index,s);
 const table=(title,headers,rows,note,formula)=>{const displayed=rows.map(r=>r.map(x=>typeof x==='number'?fmt(x):x));return{graph:diagram(track,index,s,v)+M.table(title,headers,displayed,''),readout:displayed.map(r=>r.join(': ')).join(' · '),formula,note};};
 if(track==='physics-1'){
  if(index===2)return table('Two carts latch on a horizontal track',['Quantity','Value'],[['Total momentum (kg·m/s)',v.momentum],['Joined velocity (m/s)',v.velocity],['Initial kinetic energy (J)',v.initial],['Final kinetic energy (J)',v.final],['Transferred to other forms (J)',v.other]],'East is positive. External horizontal impulse is negligible; both carts latch. Kinetic energy can transfer to internal energy.','p = m₁v₁ + m₂v₂; vf = p/(m₁+m₂); K = mv²/2.');
  if(index===3)return table('A point mass rotates about a fixed center',['Quantity','Value'],[['Moment of inertia (kg·m²)',v.inertia],['Perpendicular torque (N·m)',v.torque],['Angular acceleration (rad/s²)',v.alpha],['Angular momentum (kg·m²/s)',v.momentum]],'Ideal point mass and massless support; applied force is perpendicular to the radius. Counterclockwise values are positive.','I = mr²; τ = rF; α = τ/I; L = Iω. A torque requires an axis and a lever arm.');
  if(index===4)return{graph:M.cartesian('Position of an ideal horizontal spring oscillator',[{label:'x(t) = A cos(2πt/T)',fn:t=>s.amplitude*Math.cos(2*Math.PI*t/v.period)}],{xmin:0,xmax:8,ymin:-0.6,ymax:0.6,xlabel:'Time (s)',ylabel:'Displacement (m)',left:105,ylabelX:25}),readout:'Period '+fmt(v.period)+' s · Total mechanical energy '+fmt(v.energy)+' J',formula:'T = 2π√(m/k); E = kA²/2.',note:'An ideal linear spring with no damping. Released from rest at x=A. Changing amplitude changes energy but not period in this model.'};
  return table('Pressure and buoyancy in a resting liquid',['Quantity','Value'],[['Gauge pressure at depth (Pa)',v.pressure],['Buoyant force, fully submerged (N)',v.buoyancy]],'Uniform incompressible liquid, g=10 m/s². Gauge pressure excludes atmospheric pressure. The specified volume is displaced volume; the object stays fully submerged.','pgauge = ρgh; Fb = ρgV; 1 L = 0.001 m³. Floating requires a separate force balance.');
 }
 if(index===0)return table('Heating without a phase change',['Quantity','Value'],[['Heat transferred into sample (J)',v.heat],['Final temperature (°C)',v.final]],'Starts at 20°C. Constant specific heat, no phase change, no work and no heat lost to the surroundings.','Q = mcΔT. A change of 1°C equals a change of 1 K; absolute Celsius and kelvin temperatures differ.');
 if(index===1)return table('Field from a fixed positive point charge',['Quantity','Value'],[['Field, away from source (N/C)',v.field],['Potential relative to infinity (V)',v.potential],['Force on test charge (N)',v.force]],'Source charge +2 μC. Probe is to its right; right is positive. The source is held fixed by an external constraint; this ideal model does not calculate its motion in response to the probe. Negative force means left.','E = kQ/r²; V = kQ/r; F = qE; k = 9×10⁹ N·m²/C². Field and potential do not depend on the test charge.');
 if(index===2)return table('Two resistors and an ideal voltage source',['Quantity','Value'],[['Connection',s.arrangement],['Equivalent resistance (Ω)',v.resistance],['Source current (A)',v.current],['Current through R1 (A)',v.i1],['Current through R2 (A)',v.i2],['Total power (W)',v.power]],'Only two ohmic resistors, ideal wires and an ideal constant-voltage source. Changing connections changes the total resistance.','Series: Req = R1+R2; parallel: 1/Req = 1/R1+1/R2. I = V/Req; P = VI.');
 if(index===3)return table('Two distinct magnetic models',['Quantity','Value'],[['Magnetic-force magnitude (N)',v.force],['Flux through a perpendicular loop (Wb)',v.flux]],'Positive charge moves right; field is into the screen, so force is upward. Loop area is separately controlled. Flux is BA only because the field is uniform and perpendicular.','For perpendicular motion, F = qvB. A magnetic force turns the velocity and does no work on the ideal point charge. |Φ| = BA; induction depends on CHANGE in flux.');
 if(index===4){const scale=2,body='<path d="M90 160H450M260 65V240" fill="none" stroke="#8595ac"/><path d="M'+(260-s.object*scale)+' 160v-40l-5 8m5-8l5 8" fill="none" stroke="#6542c0" stroke-width="3"/><path d="M'+(260+v.image*scale)+' 160v'+(-v.height*20)+'" stroke="#087f76" stroke-width="3"/><circle cx="'+(260-s.focal*scale)+'" cy="160" r="3" fill="#a84324"/><circle cx="'+(260+s.focal*scale)+'" cy="160" r="3" fill="#a84324"/><text x="260" y="45" text-anchor="middle" class="axis-label">Converging lens</text><text x="'+(260-s.object*scale)+'" y="108" text-anchor="middle" class="tick">Object</text><text x="'+(260+v.image*scale)+'" y="'+(178-v.height*20)+'" text-anchor="middle" class="tick">Image</text><text x="260" y="282" text-anchor="middle" class="tick">Image is on the opposite side and inverted</text>';return{graph:M.graphic('Object and real image of a thin lens','Horizontal distances use 2 pixels per cm; heights use 20 pixels per cm. This is a schematic, not a ray construction. Object is outside the focal point.',body),readout:'Image distance '+fmt(v.image)+' cm · Magnification '+fmt(v.magnification)+' · Image height '+fmt(v.height)+' cm',formula:'1/f = 1/u + 1/v; m = −v/u; object height = +2 cm.',note:'Ideal thin converging lens with a real object at u>f. This control does not model virtual images. A negative image height indicates inversion.'};}
 return table('A photon and a photoelectric threshold',['Quantity','Value'],[['Photon energy (eV)',v.energy],['Threshold frequency (Hz)',v.threshold],['Emission',v.emits?'Possible':'No electrons emitted'],['Maximum electron kinetic energy if emitted (eV)',v.emits?v.kinetic:'Not applicable']], 'Ideal single-photon photoelectric model. Material work function is fixed for each chosen setting. Brightness changes photon number, not energy per photon at a fixed frequency.','Ephoton = hf; h = 4.14×10⁻¹⁵ eV·s; Kmax = hf − W when hf ≥ W.');
}
const api={values,model,format:fmt};if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidencePhysicsFoundationModels=api;
})(typeof window==='undefined'?globalThis:window);
