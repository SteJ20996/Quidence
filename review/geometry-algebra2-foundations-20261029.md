# Geometry and Algebra II foundation checks · 2026-10-29

Geometry and Algebra II each have a 15-question foundation check in English and Spanish. They were the last two cards with a "Foundation check: not available yet" note. Every subject card now has a foundation check.

## What they check

Each check covers what its course assumes, not what it teaches. Like the other checks, it has five groups of three questions with one to three parts each, and most items target a common mistake.

| Geometry group | Questions | Common mistake targeted |
| --- | --- | --- |
| Turns and shares | a clock hand's turn, angles in the ratio 2 : 3 : 4, an equation from a stated 180° total | stopping at x instead of finding the angle |
| Ratio and scale | x/6 = 10/15 and whether 4 : 6 equals 6 : 8, a map scale used both ways, enlarging a photo | adding the same amount instead of multiplying |
| Perimeter, area and units | equal areas with different perimeters, an L-shape, square metres to square centimetres | assuming 1 m² = 100 cm², or that cutting a corner shortens the perimeter |
| Equations and formulas | a length from an area, (x + 4)/3 = 5 and 2x/5 = 6, sides from a perimeter | undoing operations in the wrong order |
| Squares and square roots | √144 and √(9 + 16), √50 between 7 and 8, (3 + 4)² against 3² + 4² | √(9 + 16) = 3 + 4, and (a + b)² = a² + b² |

| Algebra II group | Questions | Common mistake targeted |
| --- | --- | --- |
| Exponents and powers | 2³ × 2⁴ and (3²)³, 5⁰ and 2⁻³, (−2)⁴ and −2⁴ | multiplying exponents when they should be added, and treating a negative exponent as a negative number |
| Expanding and factoring | (x + 3)(x − 5), x² − 7x + 12, x² − 49 and 101² − 99² | dropping the middle term |
| Quadratic equations | (2x − 3)(x + 4) = 0, x² = 5x, how many real solutions | dividing by x and losing x = 0 |
| Functions and their inputs | f(−2) for f(x) = 2x² − 3x, inputs a rule cannot use, a minimum from a table | squaring −2 without brackets |
| Percents, lines and systems | a 15% discount and a $40 → $50 increase, 3x + 2y = 12 as y = mx + b, a 2 × 2 system | dividing by the new price instead of the original |

What the courses teach is listed as not checked:
- **Geometry:** angle relationships, the Pythagorean relationship, similarity, triangle area and volume.
- **Algebra II:** polynomial roots and multiplicity, rational expressions, exponential models and logarithms.

Three Geometry questions give the angle total (360° or 180°). The report says so, because the course teaches when those totals apply.

## Answer checks

`tests/additional-foundations.test.cjs` recomputes every new answer from the question's conditions, without reading the stored key.
- **Choice answers:** each option is evaluated over a grid of inputs, and only the expression equal to the original everywhere is accepted.
- **Equation answers:** solutions are found by searching a grid of inputs.

The test also confirms that each correct answer is matched and that changing a number by 1 is not. It now covers 151 answers across six newer checks. Both sides were written in this project, so this is a consistency check, not independent certification.

## Saved work

Saved foundation records are accepted only when their subjects match a set the site has published. The engine now lists the ten-subject set from before this change, so existing records still open. A new test opens a ten-subject record, checks that it is unchanged, and checks that it gains empty Geometry and Algebra II modules. An eleven-subject set was never published and is still rejected.

## Where the checks appear

- **Homepage card:** both cards show "Check foundations · 15 questions" in place of the note. Every card in the row keeps the same height.
- **Course pages:** the Geometry and Algebra II course pages link to their checks.
- **Foundation page:** the subject list includes Geometry and Algebra II.
- **Scope line:** the homepage scope line counts twelve foundation tracks.
- **Search:** like Coordinate Geometry's, the new checks are not in the indexed foundation list.

## Language

The checks are in English and Spanish, like the site's other foundation checks. They contain no Chinese text.
