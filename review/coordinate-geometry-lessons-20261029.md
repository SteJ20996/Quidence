# Coordinate Geometry lessons · 2026-10-29

The Coordinate Geometry course page now opens with four short lessons, in English, Traditional Chinese and Spanish. Stephen approved them from the demo. They come before the two projects and introduce what the projects use.

| Lesson | Idea | Graph | Quick check |
| --- | --- | --- | --- |
| 1 · Points and changes | coordinates as addresses; Δx and Δy as end minus start | drag A and B; signed change arrows | Δx and Δy from A(−2, 3) to B(4, −1) |
| 2 · Distance from the changes | Δx and Δy as the legs of a right triangle | the right triangle and AB = √(Δx² + Δy²) | two distances, 5 and 13 |
| 3 · Midpoint and slope | the midpoint as an average; slope as rise over run | the midpoint M, rise and run, and an exact slope | midpoint (1, 4) and slope 1/2 |
| 4 · Equations draw shapes | an equation as a test a point passes or fails | a line through A and B, or a circle through R, and a test point Q | two circle tests and one line value |

## How it works

- **Opening a lesson:** the overview lists the four lessons, and each card shows whether its quick check is done. A lesson opens at `#lesson-1` to `#lesson-4`, from a card, a link or the browser's back button. Lesson 4 ends with "Start Project 1".
- **Graphs:** points can be dragged with a mouse or finger, or selected with Tab and moved with the arrow keys. Keyboard focus shows a ring around the point. Readouts use exact fractions, for example y = (2/3)x − 1/3, and say whether Q satisfies the equation.
- **Quick checks:** answers accept the same forms as the projects (whole numbers, decimals, fractions and √). Each answer shows "Matches the reference" or "Not yet". The worked solution appears after checking.

## Saved work

- **What is saved:** only quick-check answers and whether each check was done. They go in an optional `lessons` field of the existing record; graph positions last for the visit.
- **Older records:** records saved before this change have no `lessons` field and still open unchanged.
- **Older cached pages:** an older cached page ignores the new field. Lessons are never stored as the saved view, so it never sees a view it does not recognize and never rejects the record as corrupt.
- **Notebook export:** includes each lesson's answers and whether its check is done.

## Elsewhere

- **Course page:** the badge reads "Lessons and guided projects", and "Your starting tools" says the lessons introduce coordinates, distance, slope and equations.
- **Homepage card:** "Lessons and guided projects", "Start Coordinate Geometry", and a note that only the Intuition Lab activity is not available yet. The card, its description and the scope line mention the lessons in English and Spanish.
- **Knowledge map, learning-request panel and search description:** mention the lessons.
- **Build:** `lessons.mjs` is fingerprinted with the course's other modules, versioned for reports, and listed in the Coordinate Geometry source ledger.

## Language

Lessons are ordinary lessons, so the policy allows all three of the course's languages. They have no voice or AI features. `tests/coordinate-lessons.test.mjs` checks that every lesson and lesson-interface string exists in all three languages. The browser suite also checks that no lesson page has untranslated text in English, Spanish or Traditional Chinese.
