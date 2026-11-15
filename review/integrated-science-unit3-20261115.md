# Integrated Science 6–10, Unit 3 (grade 8) · 2026-11-15

This adds the third unit of *Integrated Science 6–10*: four lessons, one for each instructional segment of California's integrated grade 8. Units 1 and 2 are described in [integrated-science-unit1-20261115.md](integrated-science-unit1-20261115.md) and [integrated-science-unit2-20261115.md](integrated-science-unit2-20261115.md); the plan is in [integrated-science-plan-20261115.md](integrated-science-plan-20261115.md).

## The four lessons

| # | Lesson | Model | Builds toward |
| --- | --- | --- | --- |
| 9 | Speed and crashes: why does speed matter so much in a crash? | Kinetic energy, reaction and braking distances and braking force against mass (800–3,000 kg), speed (10–130 km/h) and road; a graph of either stopping distances or kinetic energy | MS-PS3-1, PS2-2, PS2-1 |
| 10 | Moon phases: why does the Moon change shape? | The Sun, Earth and Moon seen from above the North Pole, the phase seen from the Northern Hemisphere, and the rising time, for each half day of the cycle | MS-ESS1-1, PS2-4 |
| 11 | Natural selection: how does a rare trait become common? | Rock pocket mice: the share of dark mice over 200 generations on dark lava or pale rock, for an advantage of 0–20% and a starting share of 0–50% | MS-LS4-4, LS4-6, LS3-1 |
| 12 | Listening with waves: how do scientists listen to whales? | A sound wave in air, seawater or steel: frequency, wavelength, amplitude and energy, with optional digital samples | MS-PS4-1, PS4-2, PS4-3 |

## Alignment

The PE lists were checked by hand against the grade 8 segment boxes in framework chapter 5, and the unit test checks that each PE is in its segment's box. Lesson 10 claims MS-PS2-4 (gravity depends on mass) through its last step, but not MS-ESS1-2 (gravity across the solar system and galaxies), which it does not teach.

## Course changes

The course is version 3. Records saved with four or eight lessons open with the new lessons added and every answer kept; the unit test checks both. The homepage card, map and SEO lines name the grade 8 topics.

## Checking

`tests/integrated-science.test.cjs` recomputes the new models independently:
- **Crash.** ½mv², 1.5 s × v, v²/2a and m × a over the whole control grid. It checks the values in the steps and questions: four times the energy and braking distance at twice the speed; 14 m and 55 m; the same distance for 1,000 and 3,000 kg; a longer distance on a wet road.
- **Moon.** The lit fraction (1 − cos θ)/2 on every half day, and the eight phase names in order. Rising times come out near 6 a.m., noon, 6 p.m. and midnight at the four main phases. The drawing was checked by eye for every phase: waxing lit on the right, first quarter at the bottom of the top view.
- **Selection.** The generation-by-generation recurrence for both grounds. The odds of dark fur change by the advantage each generation. Half is passed in generation 95 at a 5% advantage from 1%, never within 200 generations at 1%, and never from 0%.
- **Waves.** Wavelength = speed ÷ frequency and energy = amplitude² for every setting: 75 m and 50 m in seawater at 20 and 30 Hz, and the first six digital samples of a 20 Hz call.
- **Saved records.** A record saved part-way through grade 7, at version 2, upgrades with its view and answers unchanged.

## Independent review

A reviewer checked every statement and number against sources, tried every step's settings, and checked the answer keys, the drawings and the PE claims. All twelve answer keys and the Moon drawing for every phase were correct. Its findings and what changed:

| Finding | Change |
| --- | --- |
| Lesson 9's last step asked which vehicle feels the larger force, but its test compared kinetic energies, and the lab has no collision. | The test now uses the braking force: imagine the 3,000 kg force on a 1,000 kg car and compare how much each changes speed. |
| MS-PS3-1 is about graphs of kinetic energy against mass and speed; the lab graphed only stopping distance. | A graph control shows kinetic energy against speed for the chosen mass, with 1,000 kg for comparison. |
| The framework says MS-PS2-2 does not require a mathematical understanding of acceleration, but step 3 used acceleration = force ÷ mass. kJ, kN and m/s² were undefined. | Step 3 is qualitative; the formula appears only in the lab's formula line, marked as a high school idea. The units are defined. |
| "Every car … needs the same braking distance" could be read as trucks stopping as fast as cars. | The step says real heavy trucks need farther to stop (FMCSA), and that friction, not "the road pushing back", is the grip. |
| "The Moon pulls back on Earth just as hard, raising the ocean tides" gave the wrong cause: tides come from the difference in the Moon's pull across Earth. | Rewritten in step 4 and in question 3's explanation. |
| The eclipse sentence was unclear about the 5° tilt and said "lines up exactly". | "Tilted about 5° to the plane of Earth's orbit around the Sun"; "lines up closely". The test now says the top view cannot show the tilt. |
| With a 50% start, the selection readout said "more than half from the start", even as dark mice fell to 0% on pale rock. | Half is now strictly more than half; on pale rock the readout says dark fur becomes rarer. |
| Step 4 asked about a population with no dark-fur mutation, but the start could not go below 1%. | The start now begins at 0%. |
| Lesson 12's last test did not test its question or prompt, and "analog" was never defined. | The lab can show digital samples, drawn as a staircase with their numbers in the readout; the step defines analog recording. |
| Smaller points: "at full speed"; helmets "inside" a car; 4 × 14 ≈ 55; "moving people"; crescent and gibbous undefined; 29.5 against 29.53 days; Earth also wobbles; evening observing must start after new moon; "1 in 99" should be a ratio "1 to 99"; the 1% test has no answer within 200 generations; northern Mexico; owl predation is inferred, not measured; New Mexico's dark mice use other genes; blue whale calls are about 15–45 Hz; the hydrophone is about 900 m deep at the edge of the bay and samples about 256,000 times a second; the readout's "0.01 s" at 150 Hz and "1 waves". | All fixed. |

## Sources, and where they stop

- **Stopping.** A 1.5 s reaction time is the figure commonly cited from NHTSA for crash reconstruction; 7 and 4 m/s² are typical dry and wet braking rates (AASHTO stopping sight distance uses a more cautious 3.4 m/s² for design). FMCSA notes that loaded trucks need much farther to stop.
- **Moon.** The synodic month (29.53 days), the 5.1° tilt of the lunar orbit, the Earth–Moon distance (about 30 Earth diameters) and the Sun's distance (about 389 times the Moon's) are standard values (NASA). Tides from NOAA.
- **Mice.** Nachman, Hoekstra and D'Agostino (2003), *PNAS* 100: 5268: Mc1r mutations in dark mice from the Pinacate lava flow in Arizona, and none in dark mice from New Mexico. The model's advantages are illustrations, not measured selection strengths.
- **Sound.** Sound speeds are typical values. Blue whale call frequencies come from DOSITS. The hydrophone's depth, connection and sampling rate (about 256,000 samples a second) come from MBARI.

## Gaps

- **PS2-1 and PS2-4.** Neither lesson asks for a design (PS2-1) or an argument from evidence (PS2-4); the lab shows no collision and no gravity.
- **PS4-2.** Its emphasis includes light as well as mechanical waves; the lesson treats sound only, and reflection appears in the text, not the lab.
- **ESS1-1.** Seasons are left out, as the framework assesses them in segment 4.
- **Selection.** The model is one trait with a fixed advantage, without dominance, migration or chance.
- **No students or science teachers** have tried the lessons.
