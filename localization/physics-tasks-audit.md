# Physics task Spanish translation audit

Assigned rows: 855. Translated rows: 729. Intentionally unchanged technical rows: 126.

## Translation and self-review

- Neutral Spanish for students in the United States. Technical notation, decimal points and source thousands separators retained.
- Velocity is velocidad (signed); speed is rapidez. Momentum is cantidad de movimiento; torque is momento de fuerza; angular momentum is momento angular. Gauge pressure is presión manométrica; buoyant force is fuerza de flotación.
- Reviewed numerical solutions, signs, time intervals, units, source assumptions, negation and intentional incorrect multiple-choice options. The incorrect options retain their errors so the answer count is unchanged.
- All numeric tokens, signed numbers and exponent tokens match source order under a punctuation-aware comparison. No numbers or signs were altered.
- Preserved full mathematical expressions in prompts and solutions. Readouts with mixed SVG/HTML preserve their markup; only visible labels/aria text are translated.
- Source newlines are normalized to spaces in the TSV to keep one physical line per entry (row 5548), consistently with catalog normalization.
- Field IDs are not labels: skipped stable IDs were checked against task-builder uses (n/w field constructors, controls/defaults). points and edges are drawing schema keys; dashed is an SVG line-style flag.

## Context and concerns

- Row 2618 is appended to a lowercased skill name by onMismatch. Translation starts with its comma and preserves the append boundary.
- Rows 3773–3775, 3784–3785, 3793–3794 and 4545–4550 are dynamic fragments; retained boundary spacing/punctuation intent.
- Row 4552 contains the human-facing aria-label inside an SVG template fragment. Rows 4565, 4569, 4570, 4571, 4573, 4575 and 4577 contain visible text within HTML fragments. These must be applied as literal replacements rather than token/code rewrites.
- Do not modify numeric examples to local decimal commas: these activities use the existing US decimal parser and English mathematical notation.
- This is a self-review, not an independent native-speaker certification. Root review should spot-check terms and long multi-step prompts before release.

## Exact unchanged rows

| ID | Original string | Reason |
| --- | --- | --- |
| 2616 | `physics-items-1` | Stable model/course/version identifier or prefix |
| 2634 | `displacement` | Stable task field/control identifier, not a human-facing label |
| 2640 | `speed` | Stable task field/control identifier, not a human-facing label |
| 2643 | `lastVelocity` | Stable task field/control identifier, not a human-facing label |
| 2655 | `acceleration` | Stable task field/control identifier, not a human-facing label |
| 2658 | `coast` | Stable task field/control identifier, not a human-facing label |
| 2670 | `momentum` | Stable task field/control identifier, not a human-facing label |
| 2673 | `finalVelocity` | Stable task field/control identifier, not a human-facing label |
| 2676 | `initialEnergy` | Stable task field/control identifier, not a human-facing label |
| 2679 | `finalEnergy` | Stable task field/control identifier, not a human-facing label |
| 2687 | `potential` | Stable task field/control identifier, not a human-facing label |
| 2690 | `kinetic` | Stable task field/control identifier, not a human-facing label |
| 2699 | `joules` | Stable task field/control identifier, not a human-facing label |
| 2702 | `wattHours` | Stable task field/control identifier, not a human-facing label |
| 2705 | `runtime` | Stable task field/control identifier, not a human-facing label |
| 2708 | `cloudRuntime` | Stable task field/control identifier, not a human-facing label |
| 2716 | `wavelength` | Stable task field/control identifier, not a human-facing label |
| 2721 | `newWavelength` | Stable task field/control identifier, not a human-facing label |
| 2724 | `echoDistance` | Stable task field/control identifier, not a human-facing label |
| 2744 | `delayDistance` | Stable task field/control identifier, not a human-facing label |
| 2747 | `stopTime` | Stable task field/control identifier, not a human-facing label |
| 2750 | `totalDistance` | Stable task field/control identifier, not a human-facing label |
| 2753 | `dataReason` | Stable task field/control identifier, not a human-facing label |
| 2760 | `fastDistance` | Stable task field/control identifier, not a human-facing label |
| 2763 | `minimumForce` | Stable task field/control identifier, not a human-facing label |
| 2766 | `speedReason` | Stable task field/control identifier, not a human-facing label |
| 2774 | `revisedDistance` | Stable task field/control identifier, not a human-facing label |
| 2777 | `proposal` | Stable task field/control identifier, not a human-facing label |
| 2793 | `load` | Stable task field/control identifier, not a human-facing label |
| 2796 | `eventEnergy` | Stable task field/control identifier, not a human-facing label |
| 2799 | `collected` | Stable task field/control identifier, not a human-facing label |
| 2804 | `balance` | Stable task field/control identifier, not a human-facing label |
| 2812 | `cloudCollected` | Stable task field/control identifier, not a human-facing label |
| 2815 | `shortfall` | Stable task field/control identifier, not a human-facing label |
| 2818 | `maxLoad` | Stable task field/control identifier, not a human-facing label |
| 2821 | `cloudReason` | Stable task field/control identifier, not a human-facing label |
| 2829 | `duration` | Stable task field/control identifier, not a human-facing label |
| 2832 | `revision` | Stable task field/control identifier, not a human-facing label |
| 2840 | `physics-foundation-items-1` | Stable model/course/version identifier or prefix |
| 2856 | `force` | Stable task field/control identifier, not a human-facing label |
| 2873 | `initial` | Stable task field/control identifier, not a human-facing label |
| 2875 | `decrease` | Stable task field/control identifier, not a human-facing label |
| 2887 | `power` | Stable task field/control identifier, not a human-facing label |
| 2895 | `inertia` | Stable task field/control identifier, not a human-facing label |
| 2898 | `torque` | Stable task field/control identifier, not a human-facing label |
| 2903 | `omega` | Stable task field/control identifier, not a human-facing label |
| 2912 | `energy` | Stable task field/control identifier, not a human-facing label |
| 2915 | `newEnergy` | Stable task field/control identifier, not a human-facing label |
| 2918 | `mass` | Stable task field/control identifier, not a human-facing label |
| 2926 | `pressure` | Stable task field/control identifier, not a human-facing label |
| 2929 | `buoyancy` | Stable task field/control identifier, not a human-facing label |
| 2932 | `weight` | Stable task field/control identifier, not a human-facing label |
| 2935 | `support` | Stable task field/control identifier, not a human-facing label |
| 2943 | `heat` | Stable task field/control identifier, not a human-facing label |
| 2946 | `kelvin` | Stable task field/control identifier, not a human-facing label |
| 2949 | `internal` | Stable task field/control identifier, not a human-facing label |
| 2957 | `field` | Stable task field/control identifier, not a human-facing label |
| 2971 | `seriesR` | Stable task field/control identifier, not a human-facing label |
| 2974 | `seriesI` | Stable task field/control identifier, not a human-facing label |
| 2977 | `parallelR` | Stable task field/control identifier, not a human-facing label |
| 2980 | `parallelI` | Stable task field/control identifier, not a human-facing label |
| 2983 | `branch` | Stable task field/control identifier, not a human-facing label |
| 2993 | `flux` | Stable task field/control identifier, not a human-facing label |
| 2996 | `emf` | Stable task field/control identifier, not a human-facing label |
| 3006 | `magnification` | Stable task field/control identifier, not a human-facing label |
| 3009 | `height` | Stable task field/control identifier, not a human-facing label |
| 3014 | `echo` | Stable task field/control identifier, not a human-facing label |
| 3022 | `photon` | Stable task field/control identifier, not a human-facing label |
| 3027 | `threshold` | Stable task field/control identifier, not a human-facing label |
| 3030 | `brighter` | Stable task field/control identifier, not a human-facing label |
| 3050 | `phases` | Stable task field/control identifier, not a human-facing label |
| 3057 | `faster` | Stable task field/control identifier, not a human-facing label |
| 3062 | `constraint` | Stable task field/control identifier, not a human-facing label |
| 3069 | `joined` | Stable task field/control identifier, not a human-facing label |
| 3072 | `transfer` | Stable task field/control identifier, not a human-facing label |
| 3075 | `limits` | Stable task field/control identifier, not a human-facing label |
| 3088 | `full` | Stable task field/control identifier, not a human-facing label |
| 3091 | `floating` | Stable task field/control identifier, not a human-facing label |
| 3094 | `floatReason` | Stable task field/control identifier, not a human-facing label |
| 3101 | `payload` | Stable task field/control identifier, not a human-facing label |
| 3104 | `maximum` | Stable task field/control identifier, not a human-facing label |
| 3109 | `boundary` | Stable task field/control identifier, not a human-facing label |
| 3118 | `gauge` | Stable task field/control identifier, not a human-facing label |
| 3123 | `data` | Stable task field/control identifier, not a human-facing label |
| 3134 | `budget` | Stable task field/control identifier, not a human-facing label |
| 3137 | `leak` | Stable task field/control identifier, not a human-facing label |
| 3140 | `temperature` | Stable task field/control identifier, not a human-facing label |
| 3143 | `trial` | Stable task field/control identifier, not a human-facing label |
| 3152 | `minutes` | Stable task field/control identifier, not a human-facing label |
| 3155 | `improved` | Stable task field/control identifier, not a human-facing label |
| 3158 | `interpret` | Stable task field/control identifier, not a human-facing label |
| 3167 | `charge` | Stable task field/control identifier, not a human-facing label |
| 3172 | `powerReason` | Stable task field/control identifier, not a human-facing label |
| 3189 | `resistance` | Stable task field/control identifier, not a human-facing label |
| 3194 | `expanded` | Stable task field/control identifier, not a human-facing label |
| 3197 | `circuit` | Stable task field/control identifier, not a human-facing label |
| 3210 | `nearer` | Stable task field/control identifier, not a human-facing label |
| 3213 | `optics` | Stable task field/control identifier, not a human-facing label |
| 3232 | `physics-foundation-items-2` | Stable model/course/version identifier or prefix |
| 3765 | `6" fill="none" stroke="` | Nonlinguistic SVG/HTML template or attribute fragment |
| 3766 | `" stroke-width="3"/><text x="260" y="` | Nonlinguistic SVG/HTML template or attribute fragment |
| 3767 | `" text-anchor="middle" class="axis-label">` | Nonlinguistic SVG/HTML template or attribute fragment |
| 4540 | `points` | Stable drawing schema key, not a visible label |
| 4541 | `edges` | Stable drawing schema key, not a visible label |
| 4551 | `<svg xmlns="http://www.w3.org/2000/svg" data-project-board="` | Nonlinguistic SVG/HTML template or attribute fragment |
| 4554 | `" stroke="#e4eaf0"/><text x="` | Nonlinguistic SVG/HTML template or attribute fragment |
| 4555 | `" text-anchor="middle" font-size="16" fill="#52647b">` | Nonlinguistic SVG/HTML template or attribute fragment |
| 4556 | `" stroke="#e4eaf0"/><text x="25" y="` | Nonlinguistic SVG/HTML template or attribute fragment |
| 4557 | `" text-anchor="end" font-size="16" fill="#52647b">` | Nonlinguistic SVG/HTML template or attribute fragment |
| 4558 | `dashed` | SVG style flag, not a visible label |
| 4559 | `" fill="none" stroke="#8794a6" stroke-width="2"/>` | Nonlinguistic SVG/HTML template or attribute fragment |
| 4560 | `" r="5" fill="` | Nonlinguistic SVG/HTML template or attribute fragment |
| 4561 | `" fill="` | Nonlinguistic SVG/HTML template or attribute fragment |
| 4562 | `" font-size="20" stroke="#fff" stroke-width="4" paint-order="stroke">` | Nonlinguistic SVG/HTML template or attribute fragment |
| 4563 | `<div class="project-board" data-project-field="` | Nonlinguistic SVG/HTML template or attribute fragment |
| 4566 | `x<input data-project-x type="text" maxlength="80"` | Invariant coordinate symbol and input markup (x/y) |
| 4567 | `y<input data-project-y type="text" maxlength="80"` | Invariant coordinate symbol and input markup (x/y) |
| 4568 | `<button type="button" data-project-action="place"` | Nonlinguistic SVG/HTML template or attribute fragment |
| 4572 | `<button type="button" data-project-action="connect"` | Nonlinguistic SVG/HTML template or attribute fragment |
| 4574 | `<button type="button" data-project-action="undo"` | Nonlinguistic SVG/HTML template or attribute fragment |
| 4576 | `<button type="button" data-project-action="clear"` | Nonlinguistic SVG/HTML template or attribute fragment |
| 4579 | `Quidence_Drawing_` | Stable filename prefix; Quidence branding retained |
| 5439 | `push` | Stable task field/control identifier, not a human-facing label |
| 5478 | `efficiency` | Stable task field/control identifier, not a human-facing label |
| 5546 | `physics-intro-1` | Stable model/course/version identifier or prefix |
| 5553 | `physics-lesson-` | Stable model/course/version identifier or prefix |
