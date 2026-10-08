(function(root){
'use strict';
const M=typeof module==='object'&&module.exports?require('./course-models.js'):root.QuidenceCourseModels;
const Old=typeof module==='object'&&module.exports?require('./physics-models.js'):root.QuidencePhysicsModels;
const fmt=n=>Number(n.toPrecision(5)).toString();
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
 if(track==='physics-1'&&index<2)return Old.model(index,s);
 if(track==='physics-2'&&index===5)return Old.model(3,s);
 const v=values(track,index,s);
 const table=(title,headers,rows,note,formula)=>{const displayed=rows.map(r=>r.map(x=>typeof x==='number'?fmt(x):x));return{graph:M.table(title,headers,displayed,note),readout:displayed.map(r=>r.join(': ')).join(' · '),formula,note};};
 if(track==='physics-1'){
  if(index===2)return table('Two carts latch on a horizontal track',['Quantity','Value'],[['Total momentum (kg·m/s)',v.momentum],['Joined velocity (m/s)',v.velocity],['Initial kinetic energy (J)',v.initial],['Final kinetic energy (J)',v.final],['Transferred to other forms (J)',v.other]],'East is positive. External horizontal impulse is negligible; both carts latch. Kinetic energy can transfer to internal energy.','p = m₁v₁ + m₂v₂; vf = p/(m₁+m₂); K = mv²/2.');
  if(index===3)return table('A point mass rotates about a fixed center',['Quantity','Value'],[['Moment of inertia (kg·m²)',v.inertia],['Perpendicular torque (N·m)',v.torque],['Angular acceleration (rad/s²)',v.alpha],['Angular momentum (kg·m²/s)',v.momentum]],'Ideal point mass and massless support; applied force is perpendicular to the radius. Counterclockwise values are positive.','I = mr²; τ = rF; α = τ/I; L = Iω. A torque requires an axis and a lever arm.');
  if(index===4)return{graph:M.cartesian('Position of an ideal horizontal spring oscillator',[{label:'x(t) = A cos(2πt/T)',fn:t=>s.amplitude*Math.cos(2*Math.PI*t/v.period)}],{xmin:0,xmax:8,ymin:-0.6,ymax:0.6,xlabel:'Time (s)',ylabel:'Displacement (m)',left:105,ylabelX:25}),readout:'Period '+fmt(v.period)+' s · Total mechanical energy '+fmt(v.energy)+' J',formula:'T = 2π√(m/k); E = kA²/2.',note:'An ideal linear spring with no damping. Released from rest at x=A. Changing amplitude changes energy but not period in this model.'};
  return table('Pressure and buoyancy in a resting liquid',['Quantity','Value'],[['Gauge pressure at depth (Pa)',v.pressure],['Buoyant force, fully submerged (N)',v.buoyancy]],'Uniform incompressible liquid, g=10 m/s². Gauge pressure excludes atmospheric pressure. The specified volume is displaced volume; the object stays fully submerged.','pgauge = ρgh; Fb = ρgV; 1 L = 0.001 m³. Floating requires a separate force balance.');
 }
 if(index===0)return table('Heating without a phase change',['Quantity','Value'],[['Heat transferred into sample (J)',v.heat],['Final temperature (°C)',v.final]],'Starts at 20°C. Constant specific heat, no phase change, no work and no heat lost to the surroundings.','Q = mcΔT. A change of 1°C equals a change of 1 K; absolute Celsius and kelvin temperatures differ.');
 if(index===1)return table('Field from a fixed positive point charge',['Quantity','Value'],[['Field, away from source (N/C)',v.field],['Potential relative to infinity (V)',v.potential],['Force on test charge (N)',v.force]],'Source charge +2 μC. Probe is to its right; right is positive. Test charge is small enough not to change the source. Negative force means left.','E = kQ/r²; V = kQ/r; F = qE; k = 9×10⁹ N·m²/C². Field and potential do not depend on the test charge.');
 if(index===2)return table('Two resistors and an ideal voltage source',['Quantity','Value'],[['Connection',s.arrangement],['Equivalent resistance (Ω)',v.resistance],['Source current (A)',v.current],['Current through R1 (A)',v.i1],['Current through R2 (A)',v.i2],['Total power (W)',v.power]],'Only two ohmic resistors, ideal wires and an ideal constant-voltage source. Changing connections changes the total resistance.','Series: Req = R1+R2; parallel: 1/Req = 1/R1+1/R2. I = V/Req; P = VI.');
 if(index===3)return table('Two distinct magnetic models',['Quantity','Value'],[['Magnetic-force magnitude (N)',v.force],['Flux through a perpendicular loop (Wb)',v.flux]],'Positive charge moves right; field is into the screen, so force is upward. Loop area is separately controlled. Flux is BA only because the field is uniform and perpendicular.','For perpendicular motion, F = qvB. A magnetic force turns the velocity and does no work on the ideal point charge. |Φ| = BA; induction depends on CHANGE in flux.');
 if(index===4){const scale=2,body='<path d="M90 160H450M260 65V240" fill="none" stroke="#8595ac"/><path d="M'+(260-s.object*scale)+' 160v-40l-5 8m5-8l5 8" fill="none" stroke="#6542c0" stroke-width="3"/><path d="M'+(260+v.image*scale)+' 160v'+(-v.height*20)+'" stroke="#087f76" stroke-width="3"/><circle cx="'+(260-s.focal*scale)+'" cy="160" r="3" fill="#a84324"/><circle cx="'+(260+s.focal*scale)+'" cy="160" r="3" fill="#a84324"/><text x="260" y="45" text-anchor="middle" class="axis-label">Converging lens</text><text x="'+(260-s.object*scale)+'" y="108" text-anchor="middle" class="tick">Object</text><text x="'+(260+v.image*scale)+'" y="'+(178-v.height*20)+'" text-anchor="middle" class="tick">Image</text><text x="260" y="282" text-anchor="middle" class="tick">Image is on the opposite side and inverted</text>';return{graph:M.graphic('Object and real image of a thin lens','Horizontal distances use 2 pixels per cm; heights use 20 pixels per cm. This is a schematic, not a ray construction. Object is outside the focal point.',body),readout:'Image distance '+fmt(v.image)+' cm · Magnification '+fmt(v.magnification)+' · Image height '+fmt(v.height)+' cm',formula:'1/f = 1/u + 1/v; m = −v/u; object height = +2 cm.',note:'Ideal thin converging lens with a real object at u>f. This control does not model virtual images. A negative image height indicates inversion.'};}
 return table('A photon and a photoelectric threshold',['Quantity','Value'],[['Photon energy (eV)',v.energy],['Threshold frequency (Hz)',v.threshold],['Emission',v.emits?'Possible':'No electrons emitted'],['Maximum electron kinetic energy if emitted (eV)',v.emits?v.kinetic:'Not applicable']], 'Ideal single-photon photoelectric model. Material work function is fixed for each chosen setting. Brightness changes photon number, not energy per photon at a fixed frequency.','Ephoton = hf; h = 4.14×10⁻¹⁵ eV·s; Kmax = hf − W when hf ≥ W.');
}
const api={values,model};if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidencePhysicsFoundationModels=api;
})(typeof window==='undefined'?globalThis:window);
