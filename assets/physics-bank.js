(function (root) {
  'use strict';
  const VERSION = 'physics-items-1';
  const provenance = 'Composed for Quidence using invented scenario data; source clearance has not been independently verified.';
  const n = (id, label, answer, skill, dependsOn = [], absoluteTolerance = 1e-8) => ({id, label, kind: 'number', answer, skill, dependsOn, absoluteTolerance, onMismatch: 'Recheck ' + skill.toLowerCase() + ', including units and the stated model. Keep any valid method you used.'});
  const w = (id, label, reviewCriteria, followup) => ({id, label, kind: 'reason', skill: label, reviewCriteria, followup, onMismatch: 'Review the physical meaning of the original reasoning. A formula or diagram can be sufficient.'});
  const table = (headers, rows) => ({table: {headers, rows}});
  const common = {module: 'physics', provenance, version: VERSION};
  const diagnostic = (id, group, title, prompt, fields, reason, solution, next, standards, extra = {}) => ({...common, id, group, groupName: ['Motion and force evidence', 'Momentum and energy', 'Power and waves'][group], difficulty: 'medium', title, prompt, fields, reason, solution, next, standards, ...extra});
  const CHALLENGES = {
    title: 'Physics', course: '../courses/physics/', checkTitle: 'Introductory physics check',
    scope: 'Six introductory checks on motion, net force, momentum, energy, power, and waves',
    prerequisite: 'Signed numbers, ratios, simple equations, and reading tables. Needed physical relationships are supplied.',
    groups: ['Motion and force evidence', 'Momentum and energy', 'Power and waves'],
    suppliedInformation: [{task: 'ph-c01', note: 'Linear interpolation between readings is supplied; the calculated distance depends on it.'}, {task: 'ph-c04', note: 'Use the stipulated classroom value g=10 m/s² and the stated energy transfers.'}, {task: 'ph-c06', note: 'Formulas and wave speeds are supplied. These tasks check use and interpretation rather than formula recall.'}],
    notChecked: ['Two-dimensional dynamics, circular motion, electric and magnetic fields, circuits, thermal investigations, and Earth/space-science integration', 'Practical laboratory performance, independently designed experiments, and the full California high-school science expectations'],
    tasks: [
      diagnostic('ph-c01', 0, 'The runner returns partway', 'A fictional California school-track exercise gives the positions in the table, with east positive. Position changes linearly between consecutive readings. Find displacement, total distance, average velocity, average speed over the full 8 s, and velocity from 6 to 8 s. Use average velocity = displacement/time and average speed = distance/time.', [
        n('displacement', 'Displacement (m)', 8, 'Final minus initial position'),
        n('distance', 'Total distance (m)', 16, 'Adding the lengths of every segment'),
        n('velocity', 'Average velocity over 8 s (m/s)', 1, 'Signed displacement divided by time', ['displacement']),
        n('speed', 'Average speed over 8 s (m/s)', 2, 'Total distance divided by time', ['distance']),
        n('lastVelocity', 'Velocity from 6 to 8 s (m/s)', -2, 'Direction from a signed position change')
      ], 'Show the signed changes or annotate a position–time sketch. Explain why the two averages differ and what happened from 4 to 6 s.', 'Segment changes are +6,+6,0,−4 m. Displacement is 8−0=8 m; distance is 6+6+0+4=16 m. Average velocity is 8/8=+1 m/s and average speed is 16/8=2 m/s. The last velocity is (8−12)/(8−6)=−2 m/s. From 4 to 6 s position stays at 12 m, so the runner is stationary in this model.', 'Use a new piecewise position table with a different turning point. Check distance separately from displacement.', ['HS-PS2-1'], table(['Time (s)', 'Position east (m)'], [[0,0],[2,6],[4,12],[6,12],[8,8]])),
      diagnostic('ph-c02', 0, 'Does the data support the force model?', 'Three invented cart trials are shown. Use Fnet = ma. A new 3 kg cart has an eastward motor force of 9 N and a westward opposing force of 3 N. Find its net force and acceleration. In a separate trial, a cart initially travels at +5 m/s and has zero net force for 2 s. Find its final velocity. Choose east as positive.', [
        n('net', 'New cart net force (N)', 6, 'Combining signed forces on one object'),
        n('acceleration', 'New cart acceleration (m/s²)', 2, 'Using net force rather than motor force', ['net']),
        n('coast', 'Final velocity in the zero-net-force trial (m/s)', 5, 'Balanced forces and constant velocity')
      ], 'Use two appropriate trial comparisons to discuss how force and mass affect acceleration. Explain why zero net force does not force the separate moving cart to stop.', 'Trials A and B hold mass fixed: doubling net force doubles acceleration. Trials B and C hold force fixed: doubling mass halves acceleration. For the new cart Fnet=9−3=+6 N and a=6/3=+2 m/s². In the separate zero-force trial acceleration is zero, so velocity remains +5 m/s.', 'Identify a fair comparison in new data before making a claim about force or mass.', ['HS-PS2-1'], table(['Trial','Mass (kg)','Net eastward force (N)','Acceleration (m/s²)'], [['A',2,2,1],['B',2,4,2],['C',4,4,1]])),
      diagnostic('ph-c03', 1, 'Two carts join; not everything is conserved', 'On an ideal horizontal track, a 2 kg cart moving east at 3 m/s joins a stationary 1 kg cart. They latch and move together. Net external horizontal impulse during joining is negligible. Use momentum p=mv, conservation of total momentum, and kinetic energy K=mv²/2. Find initial total momentum, common final velocity, initial kinetic energy, and final kinetic energy.', [
        n('momentum', 'Initial total momentum (kg·m/s)', 6, 'Total signed momentum'),
        n('finalVelocity', 'Common final velocity (m/s)', 2, 'Momentum shared by the combined mass', ['momentum']),
        n('initialEnergy', 'Initial kinetic energy (J)', 9, 'Kinetic energy before joining'),
        n('finalEnergy', 'Final kinetic energy (J)', 6, 'Kinetic energy of both joined carts', ['finalVelocity'])
      ], 'Explain which total quantity is conserved under the assumption. Account for the kinetic-energy difference without claiming that energy is destroyed.', 'Initial momentum is 2×3+1×0=6 kg·m/s. Combined mass is 3 kg, so final velocity is +2 m/s. Initial K=2×3²/2=9 J; final K=3×2²/2=6 J. Kinetic energy decreases by 3 J, transferred into deformation, thermal energy, and/or sound. Total momentum is conserved under the negligible-external-impulse assumption; kinetic energy need not be.', 'Try a fresh one-dimensional collision with signed initial velocities, and define the system before applying conservation.', ['HS-PS2-2','HS-PS3-2']),
      diagnostic('ph-c04', 1, 'A rolling model with an energy transfer', 'An idealized 2 kg object is released from rest at a vertical height 3 m above its final level. Use g=10 m/s² for this classroom model. Its initial gravitational potential energy is U=mgh. Exactly 24 J is transferred into thermal energy of the object and track by the time it reaches the final level. No other energy transfers or rotation occur. Use K=mv²/2. Find initial U, final K, and final speed.', [
        n('potential', 'Initial potential energy relative to final level (J)', 60, 'A gravitational energy model with a reference level'),
        n('kinetic', 'Final kinetic energy (J)', 36, 'Accounting for the stated thermal energy', ['potential']),
        n('speed', 'Final speed (m/s)', 6, 'Solving the kinetic-energy relationship', ['kinetic'])
      ], 'Write an energy balance including the thermal term. Explain why adding the 24 J to kinetic energy or claiming that it vanished would be inconsistent.', 'U=2×10×3=60 J. The energy balance is 60=K+24, so K=36 J. With K=(2/2)v², v²=36; speed is 6 m/s. Including the object, Earth, and track in the model accounts for gravitational, kinetic, and thermal energy.', 'Compare two fresh energy balances and identify the system boundary and reference level.', ['HS-PS3-2']),
      diagnostic('ph-c05', 2, 'Watts are not watt-hours', 'For an invented school event, a source supplies constant usable electrical power 120 W for 15 min and stores all of that energy without further loss. Later, a 20 W lamp uses only this stored energy at constant power. Use E=Pt, 1 min=60 s and 1 Wh=3,600 J. Find collected energy in J and Wh, and the lamp runtime in hours. If the source supplied only 60 W for the same 15 min, find the new runtime.', [
        n('joules', 'Collected energy (J)', 108000, 'Minutes converted to seconds in E=Pt'),
        n('wattHours', 'Collected energy (Wh)', 30, 'Energy rather than instantaneous power', ['joules']),
        n('runtime', 'Lamp runtime (h)', 1.5, 'Stored energy divided by load power', ['wattHours']),
        n('cloudRuntime', 'Runtime with 60 W collection (h)', 0.75, 'Scaling energy at a fixed collection duration')
      ], 'Show a unit-consistent route and explain why 120 W is not the amount of stored energy. Identify an ideal assumption you would check for a real system.', '15 min=900 s=0.25 h. Energy is 120×900=108,000 J=120×0.25=30 Wh. Runtime is 30 Wh/20 W=1.5 h. At 60 W the energy is 15 Wh and runtime is 0.75 h. Constant power and ideal storage are assumptions, not measurements of a real event.', 'Use a changing-power table and add the energy transferred in each constant-power interval.', ['HS-PS3-1']),
      diagnostic('ph-c06', 2, 'One wave, two kinds of distance', 'In an ideal nondispersive medium, a transverse wave travels at 12 m/s with source frequency 3 Hz. Use v=fλ and T=1/f. Find wavelength and period. If frequency changes to 6 Hz while speed stays fixed, find the new wavelength. Separately, sound travels at 340 m/s and its echo returns after 1 s. Find the one-way distance to the reflector. Numerical periods may be given as a fraction or rounded to at least two decimal places.', [
        n('wavelength', 'Initial wavelength (m)', 4, 'Wave speed divided by source frequency'),
        n('period', 'Initial period (s)', 1/3, 'Seconds per cycle rather than cycles per second', [], 0.00006),
        n('newWavelength', 'Wavelength at 6 Hz (m)', 2, 'Frequency–wavelength relation at fixed speed'),
        n('echoDistance', 'One-way distance to reflector (m)', 170, 'An echo includes two travel legs')
      ], 'Explain why changing frequency here does not double speed. Show the two legs of the echo path in words, equations, or a simple sketch.', 'λ=12/3=4 m and T=1/3 s≈0.3333 s. At 6 Hz with the same speed, λ=12/6=2 m. The echo travels a total 340×1=340 m; one-way reflector distance is 170 m. Speed depends on the stated medium/model, while echo distance is a separate round-trip calculation.', 'Distinguish a position snapshot from a time trace, then compare waves in two media.', ['HS-PS4-1'])
    ]
  };
  const stage = (title, prompt, fields) => ({title, prompt, fields});
  const project = (id, title, prompt, stages, solution, next, standards, extra = {}) => ({
    ...common, id, title, prompt, group: 0, groupName: 'Model, check, and revise', difficulty: 'project',
    steps: stages.map(s => ({...s, fields: s.fields.map(f => f.id)})), fields: stages.flatMap(s => s.fields),
    reason: 'Summarize your decision, show another check, or say what still needs evidence. Equations, diagrams, and short everyday explanations are welcome.',
    solution, next, standards, ...extra
  });
  const PROJECTS = {
    title: 'Physics', course: '../courses/physics/',
    prerequisite: 'Ratios, signed change, simple equations, and squaring a speed. All physical formulas needed for the model are supplied.',
    scope: 'Two introductory California-inspired projects: a campus model cart and a solar-powered school event',
    groups: ['Model, check, and revise'],
    suppliedInformation: [{task: 'ph-p01', note: 'The constant force, controller delay, and velocity relationships are supplied; real stopping performance is not verified.'}, {task: 'ph-p02', note: 'Power, efficiency, capacity, and reserve are supplied. Design conclusions apply only to this invented energy model.'}],
    notChecked: ['Real vehicle safety, electrical installation, experimental calibration, and full engineering design validation', 'Complete California high-school Physics, laboratory skills, fields, circuits, and integrated Earth/space science'],
    tasks: [
      project('ph-p01', 'Can the campus model cart stop in the marked zone?', 'A fictional California school club models a 2 kg unmanned cart on a level track. East is positive. It travels at +4 m/s when a stop signal arrives, coasts at the same velocity for a controller delay of 0.5 s, then has a constant net westward braking force of 4 N until its first stop. Vertical forces balance. Ignore other horizontal forces. Use a=Fnet/m, tstop=(0−v₀)/a and braking distance=(v₀+0)tstop/2. The marked distance limit is 8 m from the signal position. Synthetic trial data are provided for the braking phase only.', [
        stage('1 · Separate delay from braking', 'Find signed braking acceleration, delay distance, braking time, and total signal-to-stop distance. Explain how the table supports the model at fixed mass.', [
          n('acceleration','Braking acceleration (m/s²)',-2,'Direction of net force and acceleration'),
          n('delayDistance','Distance during delay (m)',2,'Constant-velocity travel before braking'),
          n('stopTime','Braking time only (s)',2,'Velocity change under constant acceleration',['acceleration']),
          n('totalDistance','Total signal-to-stop distance (m)',6,'Adding separate delay and braking distances',['delayDistance','stopTime']),
          w('dataReason','Evidence from the braking trials',['Compare equal mass and initial speed while net braking force changes.','Use measured velocity change over time to calculate acceleration; do not count controller delay as braking time.'],'What data would you need if the braking force varied over time?')
        ]),
        stage('2 · Change the speed, keep the model', 'Now the signal arrives at +6 m/s, with the same mass, delay, and 4 N braking force. Find total stopping distance. Keeping the 0.5 s delay, find the minimum constant net braking-force magnitude that would meet the 8 m limit at +6 m/s. Treat the force magnitude as continuously adjustable.', [
          n('fastDistance','Total distance at +6 m/s with 4 N braking (m)',12,'Separate linear delay and quadratic braking dependence'),
          n('minimumForce','Minimum braking-force magnitude at +6 m/s (N)',7.2,'Solving a distance constraint with a positive force'),
          w('speedReason','Explain the speed comparison',['Account for both delay distance and braking distance.','Explain why scaling the whole original stopping distance by 6/4 is invalid.','Identify assumptions needed for the 8 m conclusion.'],'What changes if the controller delay doubles instead of the initial speed?')
        ]),
        stage('3 · Propose and check a revision', 'Check a proposed 8 N net braking force at +6 m/s with the original delay: find total stopping distance. Give your own revised force/delay proposal, verify the 8 m limit with a calculation, and name a measurement needed before trusting a real cart. More than one proposal can work.', [
          n('revisedDistance','Total distance at +6 m/s with 8 N braking (m)',7.5,'Verifying a changed model against a constraint'),
          w('proposal','Your revision and evidence',['Specify a force and/or controller delay and verify the full distance calculation.','Compare with the distance limit, including the delay.','Name a relevant uncertainty or measurement; do not claim a model proves real safety.'],'Could reducing delay work without increasing the braking force?')
        ])
      ], 'Initial a=−4/2=−2 m/s². Delay distance is 4×0.5=2 m. Braking time is 2 s and braking distance is 4 m, totaling 6 m. The trials give acceleration −2 and −4 m/s², consistent with Fnet=ma at the same mass. At 6 m/s, delay distance is 3 m, braking time 3 s, braking distance 9 m, total 12 m. For force magnitude B>0, braking distance is mv₀²/(2B)=36/B, so 3+36/B≤8 requires B≥7.2 N. At B=8 N, braking distance is 4.5 m, total 7.5 m. Alternatively, B=7.2 N meets the boundary exactly; many larger forces or sufficiently changed combinations can work within this ideal model. A measured delay, force variation, traction, or repeated stopping trial could test a real cart.', 'Try new mass, delay, and speed values. Compare a velocity–time area calculation with the constant-acceleration route.', ['HS-PS2-1'], table(['Trial','Mass (kg)','Initial v (m/s)','Final v (m/s)','Braking time (s)','Net westward force (N)'], [['A',2,4,0,2,4],['B',2,4,0,1,8]])),
      project('ph-p02', 'Can the school event keep its lights on?', 'A fictional California school event uses a 20 W light, 30 W speaker, and 10 W controller for 3 h. A battery initially stores 40 Wh of usable energy and must retain at least 20 Wh after the event. Before the event, an idealized panel delivers constant electrical output 100 W for 2 h; 80% of that energy becomes usable stored energy. All other losses are ignored and usable storage capacity is 250 Wh. The battery can meet the stated device power. Use E(Wh)=P(W)×t(h). These values are invented, not a wiring or equipment-selection guide.', [
        stage('1 · Balance the energy', 'Find total event power, event energy, usable collected energy, and final battery energy. Explain the role of the 80% factor and the 20 Wh reserve.', [
          n('load','Total event power (W)',60,'Adding simultaneous load powers'),
          n('eventEnergy','Event energy (Wh)',180,'Power multiplied by event duration',['load']),
          n('collected','Usable collected energy (Wh)',160,'Efficiency applied once to collected energy'),
          n('final','Final usable battery energy (Wh)',20,'Initial storage plus collection minus use',['eventEnergy','collected']),
          w('balance','Your energy balance',['Use initial storage + usable collection − event use.','Apply 80% to the panel energy, not repeatedly to the usable battery energy.','Check the reserve and the storage-capacity assumption.'],'Where does the nonstored share of panel energy go?')
        ]),
        stage('2 · Test a cloudy scenario', 'Suppose panel output is only 50 W for the same 2 h with the same efficiency. Find usable collected energy and the additional usable energy needed to run all devices for 3 h while keeping the 20 Wh reserve. Find the maximum total constant event power for 3 h under this cloudy scenario. Give an exact fraction or round the final answer to at least two decimal places.', [
          n('cloudCollected','Cloudy usable collection (Wh)',80,'Changing generation rather than load power'),
          n('shortfall','Extra usable energy required (Wh)',80,'The reserve is part of the energy requirement',['cloudCollected']),
          n('maxLoad','Maximum total event power in cloudy case (W)',100/3,'An energy constraint solved for power',['cloudCollected'],0.00006),
          w('cloudReason','Explain the cloudy-case limit',['Include the initial storage and final reserve.','A negative predicted final energy means the full event cannot run, not that a battery physically stores negative energy.','Distinguish a power limit from an energy requirement.'],'If the event lasts 2 h instead, how does the allowed power change?')
        ]),
        stage('3 · Design a plan and a test', 'With cloudy collection and the original 60 W load, find the longest possible event duration while preserving the reserve. Then propose a revised event plan (duration, loads, or usable generation), calculate its final battery energy, and state what data you would collect to test the model. Give a reusable energy-balance formula or a small spreadsheet/table plan; a verbal description of the calculation is also acceptable.', [
          n('duration','Longest event duration at 60 W (h)',5/3,'Available usable energy divided by constant load',[],0.00006),
          w('revision','Your revised plan and test',['Specify quantities and units and verify reserve and capacity constraints.','Provide a reusable initial + collected − used relationship, a table/spreadsheet plan, or equivalent reasoning.','Name a relevant measurement and compare its evidence with the constant-power/efficiency assumptions.'],'Which measurements separate insufficient generation from an unexpectedly large load?')
        ])
      ], 'Total load is 20+30+10=60 W; event energy is 60×3=180 Wh. Useful collection is 100×2×0.8=160 Wh. Stored energy before the event is 200 Wh, below capacity; final energy is 40+160−180=20 Wh, exactly the reserve. At 50 W, collection is 80 Wh. Required extra usable energy is 180+20−40−80=80 Wh. Maximum three-hour power is (40+80−20)/3=100/3 W≈33.3333 W. At 60 W the longest duration is 100/60=5/3 h≈1.6667 h. One revised three-hour plan uses 30 W total: final energy is 40+80−90=30 Wh. Other justified changes can work. A reusable model is final usable energy = initial usable energy + efficiency×panel power×collection hours − load power×event hours, subject to capacity and reserve. Actual power traces and usable storage measurements could test the assumptions.', 'Use measured or newly invented power intervals and build a table that updates stored energy over time.', ['HS-PS3-1','HS-PS3-3'])
    ]
  };
  const api = {VERSION, CHALLENGES, PROJECTS};
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.QuidencePhysicsBank = api;
})(typeof window === 'undefined' ? globalThis : window);
