(function (root) {
  'use strict';
  const M = typeof module === 'object' && module.exports ? require('./course-models.js') : root.QuidenceCourseModels;
  const fmt = n => Number(n.toFixed(3)).toString();
  function values(index, s) {
    if (index === 0) return {end: s.start + 4 * s.velocity, displacement: 4 * s.velocity, distance: 4 * Math.abs(s.velocity), acceleration: 0};
    if (index === 1) return {net: s.push - s.resistance, acceleration: (s.push - s.resistance) / s.mass};
    if (index === 2) {
      const energy = s.power * s.minutes * 60, useful = energy * s.efficiency / 100;
      return {energy, wattHours: energy / 3600, useful, other: energy - useful};
    }
    if (index === 3) return {wavelength: s.speed / s.frequency, period: 1 / s.frequency};
    throw Error('Unknown physics model');
  }
  function model(index, s) {
    const v = values(index, s);
    if (index === 0) return {
      graph: M.cartesian('Position at constant velocity', [{label: 'x = ' + s.start + ' + (' + s.velocity + ')t', fn: t => s.start + s.velocity * t}], {xmin: 0, xmax: 4, ymin: -12, ymax: 20, xlabel: 'Time (s)', ylabel: 'Position (m)', left: 110, ylabelX: 30}),
      readout: 'At 4 s: position ' + v.end + ' m · Displacement ' + v.displacement + ' m · Distance ' + v.distance + ' m',
      formula: 'x = x₀ + vt; constant velocity ' + s.velocity + ' m/s gives a = 0 m/s².',
      note: 'A position–time graph, not a map of a hill. Only one constant-velocity segment is modeled.'
    };
    if (index === 1) {
      const center = 260, length = 13, arrow = (end, y, color, label) => {
        const direction = end < center ? -1 : 1;
        return '<path d="M' + center + ' ' + y + 'H' + end + 'm' + (-direction * 9) + ' -6L' + end + ' ' + y + 'l' + (-direction * 9) + ' 6" fill="none" stroke="' + color + '" stroke-width="3"/><text x="260" y="' + (y - 18) + '" text-anchor="middle" class="axis-label">' + label + '</text>';
      };
      let body = '<rect x="233" y="124" width="54" height="46" rx="5" fill="#f1edf9" stroke="#6542c0"/><text x="260" y="151" text-anchor="middle" class="axis-label">' + s.mass + ' kg</text>';
      if (s.push) body += arrow(center + s.push * length, 88, '#087f76', 'Applied force ' + s.push + ' N east');
      if (s.resistance) body += arrow(center - s.resistance * length, 216, '#a84324', 'Opposing force ' + s.resistance + ' N west');
      return {
        graph: M.graphic('Horizontal forces on one cart', 'Horizontal forces only. Arrow lengths use the same scale: ' + s.push + ' N east and ' + s.resistance + ' N west. Vertical forces balance and are omitted.', body),
        readout: 'Net force ' + v.net + ' N · Acceleration ' + fmt(v.acceleration) + ' m/s²',
        formula: 'Fnet = ' + s.push + ' − ' + s.resistance + ' = ' + v.net + ' N; a = Fnet/m.',
        note: 'Ideal independently controlled horizontal forces. The opposing force is specified, not automatically calculated as friction. East is positive; initial velocity is unspecified.'
      };
    }
    if (index === 2) return {
      graph: M.table('Energy balance for a converter', ['Quantity', 'Energy (J)'], [['Input', v.energy], ['Useful output', v.useful], ['Other output forms', v.other]], 'No stored-energy change. Input equals useful output plus other output forms.'),
      readout: 'Input ' + v.energy + ' J (' + fmt(v.wattHours) + ' Wh) · Useful ' + v.useful + ' J · Other ' + v.other + ' J',
      formula: 'E = P × (minutes × 60); useful output = efficiency × E.',
      note: 'Power and efficiency are constant in this example. “Other output” does not mean energy is destroyed.'
    };
    return {
      graph: M.cartesian('A spatial snapshot of an ideal transverse wave', [{label: 'Displacement at one instant', fn: x => Math.sin(2 * Math.PI * x / v.wavelength)}], {xmin: 0, xmax: 12, ymin: -1.5, ymax: 1.5, xlabel: 'Position along medium (m)', ylabel: 'Displacement (cm)', left: 110, ylabelX: 30}),
      readout: 'Speed ' + s.speed + ' m/s · Frequency ' + s.frequency + ' Hz · Wavelength ' + fmt(v.wavelength) + ' m · Period ' + fmt(v.period) + ' s',
      formula: 'v = fλ; λ = v/f; T = 1/f.',
      note: 'Ideal nondispersive model; amplitude is 1 cm. Frequency is supplied by the source, not inferred from a single spatial snapshot. No trigonometry is needed to answer the questions.'
    };
  }
  const api = {model, values};
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.QuidencePhysicsModels = api;
})(typeof window === 'undefined' ? globalThis : window);
