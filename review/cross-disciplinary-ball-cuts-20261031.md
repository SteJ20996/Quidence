# Cross-disciplinary projects: cutting a ball · 2026-10-31

The homepage has a new section, **Cross-disciplinary Projects**, after the School, Further Mathematics and Science courses. Its first project, "How many pieces can n cuts make?", is in English and Spanish at `cross-disciplinary/`. It uses four courses: Geometry, Algebra II, Discrete Mathematics and Basic Logic.

## The project

A solid ball is cut with n flat cuts, and the pieces stay in place. With 0 to 3 cuts the most pieces are 1, 2, 4 and 8, so the count seems to double. The project finds the real count by starting lower, with a stick and then a pizza. In every dimension it asks the same question: what does one new cut add?

| Step | What the learner finds | Courses | Lab |
| --- | --- | --- | --- |
| 1 · A stick | L(3) = 4 and L(10) = 11; a cut on an earlier cut adds 0 | Discrete Mathematics | A knife comes down and the piece it lands in lights up and splits. One button cuts on an earlier cut instead. |
| 2 · A pizza | The 4th cut crosses 3 cuts and has 4 segments, so P(4) = 11. Three cuts through one point make only 6. | Geometry, Discrete Mathematics | The knife crosses the pizza; each segment's piece lights up and splits with "+1", and the segments are numbered. A second view puts three cuts through one point. |
| 3 · A formula for the pizza | P(10) = 56, C(10, 2) = 45 crossings, P(n) = (n² + n + 2)/2, and an explanation of the sum | Algebra II, Discrete Mathematics | A staircase of the new pieces. A second, upside-down copy fills an n by (n + 1) rectangle. A second view counts cuts and crossings on the pizza. |
| 4 · A ball | The face of the 4th cut shows 3 lines and 7 pieces, so B(4) = 15. The learner explains why a cut adds as many pieces as its face has. | Geometry, Discrete Mathematics | The ball turns to a clear angle, a new plane slides in, and its face turns toward the viewer. The face's pieces light up one at a time on the ball and on the flat face. A slider turns the ball. |
| 5 · The doubling trap | B(5) = 26, B(6) = 42; 1 of the 16 addresses has no piece; stacking pieces would give 16; what four matching cases show | Basic Logic, Discrete Mathematics | B(n) against 2ⁿ as bars (5 and 6 cuts appear only when the learner grows them). Addresses on a pizza, like rows of a truth table, and 15 of 16 addresses in the ball. A tower of stacked pieces cut down the middle. |
| 6 · One pattern | C(10, 3) = 120, B(10) = 176, every third difference is 1, and a proof by induction | Algebra II, Discrete Mathematics, Basic Logic | A difference table built one entry at a time: ball, then pizza, then stick counts, then 1s. Pascal's triangle with the first 2, 3 or 4 numbers of a row added. |

Each step has a reference proof. The last step's follow-up goes to four dimensions (5 cuts, 31 pieces) and links to the Discrete Mathematics Intuition Lab activity, whose chord regions also begin 1, 2, 4, 8, 16, 31.

The labs show a result only after the learner acts, so they do not answer a step in advance. For example, the bars for 5 and 6 cuts appear only when the learner grows them.

## Checking the answers

`tests/cross-disciplinary.test.cjs` recomputes all 25 answers without using the formulas from the proofs or the labs' drawing code:
- **Pizza and ball counts.** It generates random cuts in general position, with every corner inside. Every piece touches a corner where 2 cuts (pizza) or 3 cuts (ball) meet. The test collects the side patterns of the points just around each corner. This gives 1, 2, 4, 7, 11, …, 56 for the pizza and 1, 2, 4, 8, 15, 26, 42, 64, 93, 130, 176 for the ball.
- **Face of the 4th cut.** It counts the face's pieces the same way, in the plane of the cut.
- **Missing address.** With 4 cuts, the address that has no piece is the opposite of the bounded tetrahedron's.
- **Three cuts through one point.** A fine grid finds 6 pieces. The other two options give 7.
- **The formula choice.** Only the keyed formula matches every count.
- **Third differences.** They come from the recomputed counts.
- **The labs' arrangements.** The test checks that they are in general position and give the counts the labs show.

Both the test and the content were written in this project, so this is a consistency check, not independent certification.

## Where it appears

- **Homepage:**
  - Classic shows a fourth section after College Level.
  - Paper Explorer, Learning Atlas and Geometric Studio add a "Cross-disciplinary" category.
  - Each appearance has its own card art: a cut stick, a cut pizza and a cut ball.
  - The card lists the four courses and links to the related Intuition Lab activity.
  - The scope line counts one cross-disciplinary project.
- **Project page:**
  - Every step names the courses it uses and links to them.
  - On screens 1000 px wide or narrower, the lab moves into the step, right after its question.
- **Saved work:**
  - Responses are kept in this browser under `quidence:cross-disciplinary:v1` and listed on the records page.
  - They can be exported like the Discrete Mathematics notebook.
- **Search engines:** `/cross-disciplinary/` is in the sitemap in both languages.

## Language

The project is not a voice or AI activity, so it is in English and Spanish, like the other projects. The project text is written side by side in `content/cross-disciplinary/projects.cjs`. The page and lab text is in `localization/cross-disciplinary-ui-extra-es.json`, and sentences with numbers use quantity templates. The Spanish uses the courses' terms: «proposición», «contraejemplo», «conjetura», «tabla de verdad», «recurrencia», «coeficientes binomiales». The dictation button stays English-only, as the language policy requires. Learner answers are never translated or rewritten.

## Validation

Local runs used Node 22; CI uses the pinned 24.19. Browser suites ran with the CI font configuration (DejaVu Sans).

- `npm test`: all Node tests pass, including the five new cross-disciplinary tests.
- `npm run test:cross-disciplinary:browser` (new, in CI):
  - walks the six steps and proofs, and runs every lab to the counts the project proves, in English and Spanish;
  - checks answers, saved explanations, export, an unreadable saved record and a failed save;
  - checks layouts from 320 to 1920 px, and the homepage card in all four appearances.
- Not checked: Safari and real devices.
