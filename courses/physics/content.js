(function (root) {
  'use strict';
  const step = (title, text, tryIt) => ({title, text, try: tryIt});
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
        step('Choose a reference and a direction.', 'Position tells where an object is relative to a chosen origin. Here the positive direction is east and time is in seconds. The height of a position graph is not the height of the ground.', 'Change the starting position without changing velocity. What changes on the graph?'),
        step('Compare changes, not just positions.', 'For constant velocity, x = x₀ + vt. Velocity is the signed change in position divided by elapsed time. A negative slope means westward motion, even when position is positive.', 'Set velocity to −2 m/s. Compare the positions at 1 s and 3 s.'),
        step('Separate distance from displacement.', 'Displacement is final position minus initial position. Distance counts the whole route and cannot be negative. For one constant-velocity segment, distance = |v|t. A trip that turns around needs the distances of all segments.', 'At −2 m/s for 4 s, compare displacement with distance.'),
        step('Acceleration is a change in velocity.', 'A constant nonzero velocity has zero acceleration. In a position graph, a straight line means constant velocity; a changing slope indicates changing velocity. Average acceleration is Δv/Δt.', 'Set velocity to 0. Explain the horizontal graph and compare it with motion at a constant 3 m/s.')
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
        step('Add forces on the same object.', 'Choose east as positive. An eastward applied force of 6 N and a westward force of 2 N give a net force of +4 N. Fnet = ma uses this total, not just the largest force.', 'Set the two force magnitudes equal. What happens to the net force?'),
        step('Connect net force with acceleration.', 'For a 2 kg cart, +4 N gives a = 4/2 = +2 m/s². The sign describes acceleration, not necessarily the current direction of motion.', 'Double mass while keeping both forces fixed. How does acceleration change?'),
        step('Balanced forces do not require rest.', 'A zero net force means zero acceleration in this model. A cart can then remain at rest or continue at a constant velocity. You need its initial velocity to predict which.', 'Make net force zero and explain why the force diagram alone cannot tell you the cart’s velocity.'),
        step('Test a relationship fairly.', 'To test how force affects acceleration, keep mass fixed and vary net force. To test the effect of mass, keep net force fixed. Changing both can hide the relationship.', 'Find two settings with the same net force but different masses. Compare their accelerations.')
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
        step('Power measures an energy rate.', 'Energy is measured in joules (J). Power is measured in watts (W), with 1 W = 1 J/s. At constant power, transferred energy E = Pt, with time in seconds if the result is in joules.', 'Compare 100 W for 10 min with 200 W for 5 min. Do they transfer the same energy?'),
        step('Keep the unit conversion visible.', 'Ten minutes is 600 seconds. At 100 W, E = 100×600 = 60,000 J. Alternatively, 100 W for 1/6 hour is 16⅔ Wh. One watt-hour is 3,600 J.', 'Change duration and check the energy in both J and Wh.'),
        step('Useful output is part of the energy balance.', 'At 80% useful conversion, 60,000 J of input supplies 48,000 J of useful output. The other 12,000 J is transferred into other forms, such as thermal energy; it is not destroyed.', 'Keep input energy fixed and change efficiency. What must happen to the other output?'),
        step('A model needs a system and assumptions.', 'This example assumes constant input power and efficiency, no storage change, and two output categories. Real devices can have variable power and efficiency. To check a real claim, measure those quantities instead of assuming the model is exact.', 'Name one observation that would make you revise the constant-power assumption.')
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
        step('Read the axes before reading a wave.', 'This picture is displacement versus position at one instant for an ideal transverse wave. Wavelength λ is the distance between neighboring crests. This spatial picture alone does not show frequency.', 'Read the horizontal axis. Explain why its unit is meters rather than seconds.'),
        step('Frequency counts cycles in time.', 'Frequency f is cycles per second, measured in hertz (Hz). Period T = 1/f is seconds per cycle. At 2 Hz, each cycle takes 0.5 s.', 'Double frequency. Compare the period with its original value.'),
        step('Use v = fλ with a stated medium.', 'In this ideal model v = fλ. Holding speed fixed, doubling frequency halves wavelength. A different medium can change speed, so do not assume every wave has the same speed.', 'Keep speed at 8 m/s and compare wavelengths at 1, 2, and 4 Hz.'),
        step('Signals travel; the picture is a model.', 'A vibrating source can send a signal through a medium. For an echo, sound travels to a reflector and back, so elapsed time includes both legs. Our transverse sketch is not a picture of air particles moving up and down in a sound wave.', 'With sound speed 340 m/s, explain the travel distance for an echo returning after 1 s.')
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
    scope: 'Four starting units connected to selected California high-school NGSS expectations. This is a supplementary introduction, not a complete Physics or Physics of the Universe course. Numerical examples are invented models.',
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
