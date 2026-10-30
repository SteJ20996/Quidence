# Discrete Mathematics Intuition Lab activity · 2026-10-30

Intuition Lab has a fourteenth activity, "It doubles each time. Every time?", in English and Spanish. It is the third and last part of Discrete Mathematics. With it, the Discrete Mathematics card has every activity the other cards have, and its "not available yet" note is gone.

## The activity

| Step | What happens |
| --- | --- |
| Predict | n points on a circle are joined by every chord, with no three chords meeting at one point. With 1 to 5 points the disc has 1, 2, 4, 8 and 16 regions. The learner predicts the count for 6 points and gives a reason that is not scored. The options are 32 (it doubles again), fewer than 32, more than 32, or not sure. |
| Explore | A slider sets n from 1 to 8. The picture draws every chord, and the readouts show n, the number of regions R and the doubling guess 2ⁿ⁻¹. From n = 6 on, the picture marks R ≠ 2ⁿ⁻¹. |
| Check | The explanation adds the chords one at a time: a chord that crosses k earlier chords adds k + 1 regions. Each crossing comes from 4 points, and any 4 points give exactly one crossing, so the disc has 1 + C(n, 2) + C(n, 4) regions: 31 for 6 points. The transfer question asks for 7 points (57, where doubling would predict 64). |
| Revisit | The learner's first reason is shown next to what the model showed, as in the other activities. |

This is Moser's circle problem, a standard example of a pattern that looks proved after five cases and then fails. It fits the course's theme that a pattern is a starting point and a proof says why. It also uses C(n, k), which the course teaches in the City routes project.

## The picture matches the count

The count 1 + C(n, 2) + C(n, 4) holds only when no three chords meet at one point. Evenly spaced points break that: a regular hexagon's three long diagonals meet at the center, which leaves 30 regions. The lab therefore places the points at fixed uneven angles (102°, 224°, 339°, 159°, 33°, 276°, 71° and 189°, using the first n). These were chosen by a search that keeps every crossing well apart, at least 0.055 of the radius, for every n up to 8.

`tests/intuition.test.cjs` reads those angles from the lab's source, so the test and the picture cannot drift apart. For each n from 1 to 8 it then:
- computes every chord crossing;
- checks that no two crossings coincide;
- counts vertices and edges and applies Euler's formula, V − E + F = 2;
- checks that the resulting number of regions equals each readout.

It also checks the transfer answer, 57. This is a consistency check written in this project, not independent certification.

## Where it appears

- **Intuition Lab:** the homepage view and the lab page list it with Further Mathematics, after Number Theory. Each appearance uses the existing Discrete Mathematics art. The counts now read 14 subjects, as does the search description.
- **Homepage card:** shows "Test your intuition". There is no "not available yet" note any more.
- **Course page:** the shared Intuition Lab panel links to the activity.
- **Source ledger:** lists the activity under Discrete Mathematics.

The lab page's subtitle said "12 subjects" although there were already 13 activities. It now says 14, like the homepage view.

## Language

Like the other Intuition Lab activities, it has no voice recognition or AI analysis, so it uses English and Spanish. The Spanish follows the course's terms ("cuerda", "regiones", "C(n, k)"). The dictation button in the reason fields stays in English, as the language policy requires. Learner answers and reasons are never translated or rewritten.

## Validation

Local runs used Node 22; CI uses the pinned 24.19. Browser suites ran with the CI font configuration (DejaVu Sans).

- `npm test`: 353 of 353 Node tests pass, including the new region-count test.
- Screenshots: the activity in English at 1280px and in Spanish at 375px, the homepage Intuition view in all four appearances, and the Classic subject card at 960px. They show no clipped or overlapping content and no page errors.
- Not checked: Safari and real devices.
