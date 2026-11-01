# Number Theory project 11: fractions that force whole numbers · 2026-11-01

Number Theory has an eleventh project, "Fractions that force whole numbers" (`nt-p11`), in English and Spanish. It starts from a word problem that gives one equation for two unknowns: 88 books are shared between two classes, exactly 2/9 of Class A's books are math books, and exactly 13/16 of Class B's books are literature books. Because the books are whole objects, each fraction becomes a divisibility condition, and divisibility settles the answer. The project then generalizes to every equation ax + by = c in whole numbers.

## Where it sits

- **Route:** fourth, after Tickets & thresholds (`nt-p09`). It uses Bézout's identity from Two jugs, one idea (`nt-p02`), and its next check returns to the threshold result of `nt-p09`. The other projects keep their content; their route numbers after the third move up by one.
- **Level:** High-school foundation, medium.
- **Size:** 5 steps and 17 answer fields: 11 numbers, 1 choice and 5 written explanations. The course now has 11 projects, 48 steps and 137 fields.

## The project

| Step | What the learner finds | Lab |
| --- | --- | --- |
| 1 · Books for two classes | gcd(2, 9) = 1 makes Class A's books a multiple of 9, and gcd(13, 16) = 1 makes Class B's a multiple of 16. Reducing 9x + 16y = 88 modulo 8 gives 8 \| x, so Class A receives 72 books, Class B 16, and there are 19 math books. | Class A's 9x books stand in stacks of 9 and Class B's remaining books in stacks of 16, colored by kind. Books that do not fill a stack are dashed; only x = 8 leaves none. A toggle shows x modulo 8. |
| 2 · A remainder that is not zero | 100 marbles, 3/7 and 5/12 red. 7x ≡ 4 (mod 12), the inverse of 7 modulo 12 is 7, so Bag A holds 28 marbles and 42 are red. | Multiples of 7 are marked on a 12-hour clock, one press at a time. A dashed ring marks remainder 4, the one the step needs. After 12 presses, every remainder has appeared once. |
| 3 · The hundred fowls | The puzzle from Zhang Qiujian's Mathematical Manual leads to 7x + 4y = 100, then x = 4t, y = 25 − 7t, z = 75 + 3t. With at least one bird of each kind there are 3 solutions, with at most 12 roosters. | The whole-number points of 7x + 4y = 100 appear one press at a time, from t = 0 to t = 4. Points that break a condition, with no roosters or with −3 hens, are hollow. |
| 4 · Every solution at once | Every integer solution is x₀ + (b/d)t, y₀ − (a/d)t. 3x + 7y = 100 has 5 solutions in positive whole numbers, and the smallest x is 3. | Starting at (31, 1), "t − 1" and "t + 1" move along 3x + 7y = 100, from t = −5 to t = 1. The region x, y ≥ 1 is shaded. Only the points the learner has visited are drawn. |
| 5 · When the fractions make it impossible | With 13/15 instead of 13/16, 9x + 15y is a multiple of 3 and 88 is not, so the books cannot be shared. ax + by = c has an integer solution exactly when gcd(a, b) divides c. | The squares 0 to 99 with the multiples of 3 shaded and 88 outlined. A button marks every total 9x + 15y with a dot. |

**Next check:** 144 is the largest c for which 9x + 16y = c has no solution in positive whole numbers. Shifting x and y by 1 turns it into the threshold of `nt-p09`: 9 × 16 − 9 − 16 + 25 = 144.

A lab lets the learner try values, as the other Number Theory labs do, but its text does not state a field's answer or a step of a proof. New stacks, points and lines grow in briefly. With reduced motion, they appear without animation.

## Sources

- **88 books.** A word problem from an image the site owner supplied. The usual solution tries every multiple of 9 up to 88. Step 1 asks for the modulo 8 argument instead, and its follow-up asks why gcd(2, 9) = 1 matters: with 3/9 of the books, Class A's books need only be a multiple of 3. The original did not say that each class receives at least one book. With 88 books this makes no difference, but the project states it.
- **The hundred fowls.** 張丘建算經 (Zhang Qiujian's Mathematical Manual, usually dated to the second half of the fifth century). The original gives three answers and the rule "add 4 roosters, take 7 hens, add 3 chicks". It does not say how to find the first answer or why there are no others; Step 3 asks the learner to prove both. Like the original, Step 3 counts only purchases with every kind of bird, and its follow-up asks what changes if roosters may be skipped.
- The design note `content/number-theory/nt-p11-notes.md` (Traditional Chinese, not published) records these sources, the teacher guide and the diagnostic points.

## Checking the answers

`scripts/test-number-theory.cjs` recomputes every answer by brute force rather than by the formulas in the proofs:
- (72, 16) is the only way to share the 88 books, giving 19 math books.
- (28, 72) is the only way to fill the bags, giving 42 red marbles. 7 is the only inverse of 7 from 1 to 11 modulo 12.
- The hundred fowls has 3 solutions with every kind of bird and 4 if roosters may be skipped. The largest number of roosters is 12.
- 3x + 7y = 100 has 5 solutions in positive whole numbers; the smallest x is 3.
- 9x + 15y = 88 has no integer solution.
- 144 is the largest c for which 9x + 16y = c has no solution in positive whole numbers.

It also rejects likely slips, such as 8 for Class A's books (x rather than 9x), 16 for the math books (Class A's only), −5 for the inverse, 4 hundred-fowls solutions, and 31 for the smallest x.

Both the test and the content were written in this project, so this is a consistency check, not independent certification.

`scripts/test-number-theory-browser.cjs` walks through the lab states in English and Spanish. It checks the status text, that Step 4 draws only visited points inside the picture, and that Step 5 does not state its conclusion.

## Pre-release review

A separate content review recomputed every answer, the next check and the Spanish numbers, and found no wrong answer key. These changes followed:
- **Answers given away by the labs.**
  - Step 1 no longer says "Both fractions give whole numbers" at x = 8. Its caption now says that trying shares shows what happens and that the remainders modulo 8 explain why.
  - Step 2 no longer says that remainder 4 solves 7x ≡ 4 or that 7 is its own inverse.
  - Step 3 no longer states the step "add 4 roosters, take away 7 hens, add 3 chicks" or that one more step would leave −3 hens. The learner can now go to t = 4 and see −3 hens.
  - Step 4 drew all eight points, with the five solutions filled, before any press. It now draws only the points the learner has visited.
  - Step 5 stated that 88 is not a multiple of 3 and gave the proof, 9x + 15y = 3(3x + 5y). It now outlines 88 and asks the learner to explain where the totals land.
- **Drawing.** Step 4 allowed t = −6, whose point lay outside the picture; the range is now −5 to 1. Labels near the right edge sit to the left of their points, and negative numbers use "−".
- **Proofs and references.**
  - Step 4 now proves that a/d and b/d have greatest common divisor 1, and its prompt says that a and b are positive.
  - Bézout's identity is cited as in An ancient remainder puzzle (`nt-p04`): from the extended Euclidean algorithm in `nt-p02`, assumed in general. `nt-p01` said it is assumed in general from `nt-p04` on; it now says from `nt-p11` on, in English and Spanish, because `nt-p11` comes first on the route.
  - The `uses` line adds Euclid's algorithm (`nt-p01`).
- **Prompts.** Step 2 asks how many marbles each bag holds, matching its field, rather than for x and y. Step 3 asks for the largest number of roosters.
- **Wording.** Class B's 7 books at x = 9 are "too few for a stack of 16".
- **Spanish.**
  - The title is «Fracciones que exigen números enteros».
  - «problemas con enunciado» translates "word problems".
  - «x y y» is used throughout, as in the other Number Theory files.
  - A lab caption that read as "moves the point (7, −3)" now says the point moves by (7, −3).

The interface was checked again at 1280 px in English (Learning Atlas) and 375 px in Spanish (Classic): no page errors, no horizontal scroll and no untranslated text.

## Where it appears

- **Number Theory page:** the picker lists the project fourth. The page counts 11 projects and 48 steps.
- **Homepage:** the Number Theory card says "Explore 11 proof projects →", and the scope line counts 11 Number Theory proof projects.
- **Course catalog and search descriptions:** "eleven projects" in English and «once proyectos» in Spanish.
- **Saved work:** answers are saved in the Number Theory notebook. Work saved in the other ten projects is unchanged.
