# Cross-disciplinary projects: chords and four dimensions · 2026-10-31

The Cross-disciplinary Projects section has a second project, "Two puzzles, one sequence: chords of a circle and cuts in four dimensions", in English and Spanish at `cross-disciplinary/?project=cross-p02`. It continues the first project, "How many pieces can n cuts make?" (`review/cross-disciplinary-ball-cuts-20261031.md`), whose last step pointed one dimension higher. It uses Geometry, Discrete Mathematics, Algebra II and Basic Logic.

## The project

There are two puzzles:
- **Puzzle A:** n points on a circle with every chord drawn, where no three chords meet at one point inside. How many regions?
- **Puzzle B:** n flat cuts of a four-dimensional ball. What is the largest number of pieces?

Puzzle A gives 1, 2, 4, 8 and 16 for 1 to 5 points, and puzzle B gives the same numbers for 0 to 4 cuts. The project counts both, shows where the doubling stops, and proves that the two puzzles always agree.

| Step | What the learner finds | Courses | Lab |
| --- | --- | --- | --- |
| 1 · A pattern that breaks | 16 regions for 5 points. Doubling would give 32 for 6 points, but the drawing has 31. One counterexample refutes the rule. | Geometry, Basic Logic | Points are added one at a time. Each new chord crosses the circle, and the regions it passes light up and split with "+1". A second view uses six equally spaced points: three chords meet at the center, so there are only 30 regions. |
| 2 · Every chord adds 1 and 1 for each crossing | 15 chords and 15 crossings for 6 points. The learner explains why regions = 1 + chords + crossings. | Geometry, Discrete Mathematics | The chords of up to 7 points are drawn one at a time, with the running total 1 + chords + crossings. |
| 3 · Four points make one crossing | 1 of the 3 pairings of four points crosses, so there are C(n, 4) crossings. For 10 points this gives 210 crossings and 256 regions. 256 = 2⁸ is a power of 2, but not the 512 that doubling predicts. | Geometry, Discrete Mathematics | The three pairings of four points are drawn in turn, and one of them crosses. A second view marks each of the 15 crossings of six points with its four endpoints. |
| 4 · Cuts in four dimensions | The face of a new cut is a three-dimensional ball, so H(k + 1) = H(k) + B(k), giving H(5) = 31 and H(6) = 57. | Geometry, Discrete Mathematics | A table with one row per dimension (point, stick, pizza, ball, four dimensions) fills one column at a time. Each number is the number to its left plus the number above that one. |
| 5 · Two puzzles, one formula | R(7) = 57. Only a proof, not more cases, shows that R(n) = H(n − 1) for every n, and Pascal's rule gives that proof. | Discrete Mathematics, Algebra II, Basic Logic | Row n − 1 of Pascal's triangle is grouped by color into C(n − 1, 0), C(n − 1, 1) + C(n − 1, 2), and C(n − 1, 3) + C(n − 1, 4). Each group lights up its sum in row n. The numbers the sum leaves out explain why the doubling stops after 5 points. |
| 6 · A polynomial of degree 4 | The first differences are the ball counts, and every fourth difference is 1. R(12) = 562. The learner explains what the table says. | Algebra II, Discrete Mathematics | A difference table built one entry at a time: circle, ball, pizza, stick, then 1s. |

As in the first project, a lab shows a result only after the learner acts. For example, the four-dimensional row of the table fills only when the learner fills its columns.

## Checking the answers

`tests/cross-disciplinary.test.cjs` recomputes all 22 answers without using the formulas from the proofs:
- **Regions of random points on a circle.** Euler's formula counts them. The vertices are the points and the crossings, found by testing every two chords. The edges are the arcs and the pieces of chords. This gives 1, 2, 4, 8, 16, 31, 57, 99, 163, 256, 386, 562 for 1 to 12 points.
- **Crossings.** For 200 random sets of four points, exactly one of the three pairings crosses.
- **Equally spaced points.** A fine grid finds 30 regions for the regular hexagon.
- **Four dimensions.** Pieces are counted around the corners of random cuts in general position, where four cuts meet, giving 1, 2, 4, 8, 16, 31, 57, 99, 163, 256, 386. The test also checks the recurrence that links each dimension to the one below.
- **Both puzzles.** For 1 to 11 points, the regions equal the four-dimensional count one lower.
- **The lab's points.** They are in general position, and their counts match what the lab shows.

Both the test and the content were written in this project, so this is a consistency check, not independent certification.

## Where it appears

- **Homepage:** the Cross-disciplinary Projects section has a second card, with its own art in each appearance: a circle with all its chords and a four-dimensional cube. The scope line counts two cross-disciplinary projects.
- **Project page:** the picker lists both projects.
- **Saved work:** answers are saved in the same notebook as the first project's.

## Language

The project is not a voice or AI activity, so it is in English and Spanish, like the first project. The Spanish uses the courses' terms: «cuerda», «circunferencia» for the curve and «círculo» for the disc, «posición general», «contraejemplo», «regla de Pascal». The dictation button stays English-only, as the language policy requires. Learner answers are never translated or rewritten.

## Validation

Local runs used Node 22; CI uses the pinned 24.19. Browser suites ran with the CI font configuration (DejaVu Sans).

- `npm test`: all Node tests pass, including three new tests for this project.
- `npm run test:cross-disciplinary:browser` now covers both projects:
  - every step, proof and lab, in English and Spanish;
  - layouts from 320 to 1920 px;
  - both homepage cards in all four appearances.
- Not checked: Safari and real devices.
