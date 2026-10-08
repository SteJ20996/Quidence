(function (root) {
  'use strict';
  const activity = (predict, test, explain, hint = '') => ({predict, test, explain, hint});
  const step = (title, text, investigation) => ({title, text, try: [investigation.predict, investigation.test, investigation.explain].join(' '), activity: investigation});
  const range = (name, label, min, max, step = 1) => ({name, label, min, max, step});
  const question = (id, prompt, labels, explanation, rotate) => {
    const options = labels.map((label, i) => ({id: String(i), label}));
    return {id, prompt, options: options.slice(rotate).concat(options.slice(0, rotate)), correct: ['0'], explanation};
  };
  const specs = [
    {
      short: 'Motion & graphs', title: 'A steep graph is not a steep trail.',
      goal: 'Read position, signed velocity, and acceleration as different quantities.',
      defaults: {velocity: 2, start: 4},
      controls: [range('velocity', 'Constant velocity (m/s)', -3, 3), range('start', 'Starting position (m)', 0, 8)],
      steps: [
        step('Choose a reference and a direction.', 'Position tells where an object is relative to a chosen origin. Here the positive direction is east and time is in seconds. The height of a position graph is not the height of the ground.', activity(
          'Keep velocity at +2 m/s. If the starting position changes from 0 m to 4 m, will the runner travel farther in 4 s?',
          'Compare those two settings. Check the line, the final position, and the distance readout.',
          'What changes, and what stays the same? Use the graph to support your prediction or revise it.')),
        step('Compare changes, not just positions.', 'For constant velocity, x = x₀ + vt. Velocity is the signed change in position divided by elapsed time. Its sign describes direction; position describes location.', activity(
          'Start at 8 m with velocity −2 m/s. Predict the positions at 1 s and 3 s. Can a runner be east of the origin while moving west?',
          'Set those controls and use two points on the line to check your predicted positions.',
          'Explain the difference between a positive position and a positive velocity. An equation or two marked points can be enough.')),
        step('Separate distance from displacement.', 'Displacement is final position minus initial position. Distance counts the whole route and cannot be negative. For one constant-velocity segment, distance = |v|t. A trip that turns around needs the distances of all segments.', activity(
          'Starting at 4 m, compare velocities +2 m/s and −2 m/s over 4 s. Predict which quantities will agree and which will differ.',
          'Check both settings. Then sketch a separate trip: 4 m east followed by 4 m west. The straight-line control cannot draw that turnaround.',
          'Compare distance and displacement for all three trips. What goes wrong with the claim that zero displacement means no travel?',
          'For the return trip, add both segment lengths for distance; compare the final and initial positions for displacement.')),
        step('Check what an end point can tell you.', 'A straight position–time line means constant velocity and zero acceleration in this model. Average acceleration is Δv/Δt. A final position alone does not tell you the earlier motion.', activity(
          'Can two different constant-velocity trips both finish at x = 8 m after 4 s?',
          'Find two settings with different starting positions and velocities that do this. Check their graphs and readouts.',
          'Show why they share an end point but not the same motion. What extra time-stamped position would distinguish them? Why is acceleration zero in both model trips?',
          'Use 8 = x₀ + 4v. Pick a starting position first, then solve for a velocity within the control range.'))
      ],
      questions: [
        ['A runner is 4 m east of an origin at t = 0 and 10 m east at t = 3 s. What is the average velocity?', ['+2 m/s', '+10/3 m/s', '+6 m/s'], '(10−4)/3 = +2 m/s. Subtract the starting position before dividing by time.'],
        ['A runner moves from x = 8 m to x = 2 m in 3 s at constant velocity. Which pair is correct?', ['Velocity −2 m/s; acceleration 0 m/s²', 'Velocity +2 m/s; acceleration −2 m/s²', 'Velocity −2 m/s; acceleration −2 m/s²'], 'Velocity = (2−8)/3 = −2 m/s. It stays constant, so acceleration is zero.'],
        ['A runner travels 12 m east, then 5 m west. What are distance and displacement?', ['Distance 17 m; displacement +7 m', 'Distance 7 m; displacement +17 m', 'Both are 17 m'], 'Distance adds lengths: 12+5=17 m. Signed displacement is 12−5=+7 m.']
      ], next: 'Use a new position table. State the direction and units before calculating a rate.'
    },
    {
      short: 'Forces & motion', title: 'What actually changes the motion?',
      goal: 'Use the net force and compare fair tests of Fnet = ma.',
      defaults: {push: 6, resistance: 2, mass: 2},
      controls: [range('push', 'Eastward applied force (N)', 0, 12), range('resistance', 'Westward opposing force (N)', 0, 6), range('mass', 'Mass (kg)', 1, 4)],
      steps: [
        step('Add forces on the same object.', 'Choose east as positive. Add the signed horizontal forces on this cart to find Fnet. Fnet = ma uses this total, not just the largest force. Vertical forces balance in this model.', activity(
          'Keep mass at 2 kg and the eastward force at 6 N. Predict the net force when the westward force is 2 N, then 6 N.',
          'Compare both settings and the acceleration readout.',
          'Why can the cart have two nonzero forces on it but zero acceleration?')),
        step('Connect net force with acceleration.', 'Use a = Fnet/m. The sign describes acceleration, not necessarily the current direction of motion. To investigate mass, keep both horizontal forces fixed.', activity(
          'Keep the eastward force at 6 N and westward force at 2 N. Predict how acceleration changes when mass goes from 2 kg to 4 kg.',
          'Check those settings, then calculate acceleration independently from net force and mass.',
          'Which variable did you change, and which did you hold fixed? Would this comparison tell you the cart’s current velocity?')),
        step('Balanced forces do not require rest.', 'Zero net force means zero acceleration. To predict velocity, you also need an initial velocity. For a constant acceleration, v = v₀ + at; a force diagram alone supplies no v₀.', activity(
          'With balanced forces, could one cart stay at rest while another keeps moving east?',
          'Set both forces to 4 N and mass to 2 kg. On paper, use v₀ = 0 m/s for one cart and +3 m/s for the other; predict each velocity after 2 s.',
          'Use the two cases to evaluate “balanced forces make every cart stop.” What information is missing from the force diagram?')),
        step('Build a comparison that can test a claim.', 'To test the effect of mass, hold net force fixed. A changed force can compensate for a changed mass, so equal accelerations do not by themselves prove that mass has no effect.', activity(
          'Can a 2 kg cart and a 4 kg cart have the same nonzero acceleration?',
          'Build two control settings that do this. Then repeat the comparison with the same net force on both carts.',
          'A friend uses your first pair to say “mass does not matter.” Which comparison tests that claim, and what evidence does it give?',
          'Start from a = Fnet/m. For the first pair, keep the ratio equal; for the fair test, change only mass.'))
      ],
      questions: [
        ['A 2 kg cart has 8 N eastward and 2 N westward forces. What is its acceleration?', ['+3 m/s²', '+4 m/s²', '+5 m/s²'], 'Fnet = 8−2 = +6 N; a = 6/2 = +3 m/s².'],
        ['A cart already moves east at 3 m/s. Its net force remains zero for 2 s. What is its velocity after 2 s in this model?', ['+3 m/s', '0 m/s', '+6 m/s'], 'Zero net force means velocity does not change; it does not mean velocity is zero.'],
        ['Which comparison tests the effect of mass while holding net force fixed?', ['2 kg at 6 N versus 4 kg at 6 N', '2 kg at 6 N versus 4 kg at 12 N', '2 kg at 6 N versus 2 kg at 12 N'], 'The first comparison changes only mass. Accelerations are 3 and 1.5 m/s².']
      ], next: 'Draw or describe all forces on one object, then calculate the signed net force.'
    },
    {
      short: 'Energy & power', title: 'Same energy. Different delivery rate.',
      goal: 'Keep energy, power, duration, and conversion efficiency distinct.',
      defaults: {power: 100, minutes: 10, efficiency: 80},
      controls: [range('power', 'Constant input power (W)', 50, 200, 25), range('minutes', 'Duration (min)', 5, 20, 5), range('efficiency', 'Useful conversion efficiency (%)', 50, 100, 10)],
      steps: [
        step('Power measures an energy rate.', 'Energy is measured in joules (J). Power is measured in watts (W), with 1 W = 1 J/s. At constant power, transferred energy E = Pt, with time in seconds if the result is in joules.', activity(
          'Keep duration at 10 min and efficiency at 80%. Predict how input energy changes if power rises from 100 W to 200 W.',
          'Compare both settings. Check the units as well as the numbers.',
          'Why are power and transferred energy different quantities even though one controls the other here?')),
        step('Different rates can deliver the same energy.', 'Use E = Pt with consistent units: seconds give J, hours give Wh. One watt-hour is 3,600 J. Neither the largest power nor the longest duration alone determines total energy.', activity(
          'Which transfers more input energy: 100 W for 10 min or 200 W for 5 min? Keep efficiency fixed and predict before checking.',
          'Compare the settings. Verify one case using seconds and J, then hours and Wh; use a calculator for the hour fraction if helpful.',
          'What does this comparison show about the claim “a higher-power device always uses more energy”?')),
        step('Account for every output.', 'Useful output = efficiency × input energy. With no stored-energy change, input = useful output + other output. The other output goes into forms such as thermal energy; it is not destroyed.', activity(
          'Keep power at 100 W and duration at 10 min. If efficiency drops from 80% to 50%, predict how both output categories change.',
          'Compare the settings and check that the two outputs add to the same input in each case.',
          'How much energy shifts between the categories? Use the balance to evaluate “the less efficient device loses energy from existence.”')),
        step('Design a fair efficiency comparison.', 'This model assumes constant power and efficiency, no storage change, and two output categories. Equal useful output does not by itself identify the input energy or efficiency. Measurements are needed to test a real device.', activity(
          'Could two devices deliver the same useful energy in 10 min but use different input energies?',
          'Keep duration at 10 min. Find two power/efficiency settings that do this; compare their useful, other, and input energies.',
          'Which model device is more efficient, and what numbers support that claim? What would you measure to check a real claim like this?',
          'Use useful energy = (efficiency/100) × power × time. Choose efficiencies of 100% and 50%, then look for suitable powers.'))
      ],
      questions: [
        ['A 50 W device operates at constant power for 4 min. How much energy does it transfer?', ['12,000 J', '200 J', '12,000 W'], '4 min = 240 s; E = 50×240 = 12,000 J.'],
        ['Two constant-power lamps run for 30 min: one at 20 W and one at 40 W. Which comparison is correct?', ['The 40 W lamp transfers twice the energy in the same time.', 'They transfer the same energy because the time is equal.', 'The 40 W lamp transfers half the energy.'], 'E = Pt; at the same time, doubling power doubles transferred energy.'],
        ['A converter receives 1,000 J and supplies 750 J of useful output, with no stored-energy change. What follows?', ['Efficiency 75%; 250 J goes to other output forms.', 'Efficiency 25%; 750 J is destroyed.', 'Efficiency 75%; the remaining energy disappears.'], '750/1000 = 75%. Energy conservation accounts for the other 250 J.']
      ], next: 'Write an energy balance and state whether time is in seconds or hours.'
    },
    {
      short: 'Waves & signals', title: 'More peaks do not automatically mean faster travel.',
      goal: 'Connect wavelength, frequency, and speed without needing trigonometry.',
      defaults: {speed: 8, frequency: 2},
      controls: [range('speed', 'Wave speed in the model medium (m/s)', 4, 12, 2), range('frequency', 'Source frequency (Hz)', 1, 4)],
      steps: [
        step('Read the axes before reading a wave.', 'This is displacement versus position at one instant for an ideal transverse wave. Wavelength λ is the distance between neighboring crests; the horizontal axis is not elapsed time.', activity(
          'Set speed to 8 m/s and frequency to 2 Hz. Which distance on the picture should you measure for wavelength: crest to trough or crest to next crest?',
          'Read two neighboring crest positions and subtract them. Compare with the wavelength readout.',
          'Why is wavelength measured horizontally in meters, rather than vertically in centimeters or in seconds?')),
        step('Frequency counts cycles in time.', 'Frequency f is cycles per second, measured in hertz (Hz). Period T = 1/f is seconds per cycle. Counting cycles at one fixed point uses time, unlike a spatial snapshot.', activity(
          'Keep speed at 8 m/s. Predict how the time for four cycles changes when frequency goes from 1 Hz to 2 Hz.',
          'Compare the period readouts and calculate four-cycle times as 4T. The static picture is not a timing measurement.',
          'Why does a higher frequency require less time for the same number of cycles? Show the relationship with numbers or an equation.')),
        step('Hold the medium fixed to test frequency.', 'In this ideal nondispersive model v = fλ. Holding medium speed fixed lets you investigate frequency and wavelength. Changing the medium can change speed, so state what stays fixed.', activity(
          'Keep speed at 8 m/s. If frequency rises from 2 Hz to 4 Hz, predict what happens to wavelength and wave speed.',
          'Check both settings, then use fλ to verify the speed in each case.',
          'Does seeing twice as many crests prove faster travel? Use the two settings as evidence.')),
        step('Challenge what one picture can prove.', 'A spatial snapshot alone does not determine frequency without timing or wave-speed information. Our transverse sketch is not a picture of sound particles moving up and down. An echo includes travel to a reflector and back, so its return time covers both legs.', activity(
          'Could waves in two different model media have the same wavelength but different frequencies?',
          'Find two speed/frequency settings with wavelength 4 m. Compare their pictures and period readouts.',
          'If you received only one of those pictures, what extra measurement would distinguish the two frequencies? Explain why the picture alone is insufficient.',
          'Use speed = 4 × frequency. Choose two frequencies for which the needed speed is within the control range.'))
      ],
      questions: [
        ['An ideal wave travels at 12 m/s with frequency 3 Hz. What is its wavelength?', ['4 m', '36 m', '0.25 m'], 'λ = v/f = 12/3 = 4 m.'],
        ['In the same nondispersive medium, frequency changes from 2 Hz to 4 Hz while wave speed stays fixed. What happens to wavelength?', ['It halves.', 'It doubles.', 'It stays the same.'], 'λ = v/f; at fixed speed, twice the frequency gives half the wavelength.'],
        ['An echo returns 2 s after a sound is emitted. Use sound speed 340 m/s. How far away is the reflector?', ['340 m', '680 m', '170 m'], 'The round trip is 340×2 = 680 m. The one-way distance is 340 m.']
      ], next: 'Compare a spatial wave snapshot with a time trace at one position.'
    }
  ];
  const content = {
    MODULE: 'physics', TITLE: 'Physics', VERSION: 'physics-intro-1',
    eyebrow: 'PHYSICS · INTRODUCTORY LESSONS', headline: 'Notice the motion.\nTest the model.',
    lead: 'Explore everyday physical systems with graphs, simple algebra, and evidence. Save a first thought, compare a model, then explain a new situation.',
    prerequisite: 'Designed for grades 9–10. Use ratios, signed numbers, and simple equations; no calculus needed.',
    scope: 'Four starting units connected to selected California high-school physical-science standards. This is a supplementary introduction, not a complete Physics or Physics of the Universe course. Numerical examples are invented models.',
    bridge: {href: '../../projects/?module=physics', label: 'Try two physics field projects →'},
    reportsHref: '../../reports/',
    LESSONS: specs.map((spec, i) => {
      const {questions, ...lesson} = spec;
      const tasks = questions.map((q, j) => question('physics-' + (i + 1) + '-' + j, ...q, (i + j) % 3));
      return {...lesson, id: 'physics-lesson-' + (i + 1), predict: tasks[0], checks: tasks.slice(1)};
    })
  };
  if (typeof module === 'object' && module.exports) module.exports = content;
  else root.QuidenceCourseContent = content;
})(typeof window === 'undefined' ? globalThis : window);
