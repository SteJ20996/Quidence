# Independent course entries and economics expansion

## Delivered scope

The homepage provides three groups and eleven course links. Ten entries open introductory activities; Macroeconomics opens a planned outline only. The optional learning request remains above the direct course starts. No filter panel has been reintroduced.

| New course | Four introductory lessons | Questions | Storage key |
| --- | --- | --- | --- |
| Pre-Algebra | Signed numbers; fractions; ratios and unit rates; expressions | 4 initial predictions + 8 fresh questions | `pre-algebra_beta01_session_v1` |
| Algebra I | Linear equations; linear functions; systems; quadratic roots | 4 + 8 | `algebra-1_beta01_session_v1` |
| Geometry | Angles; triangles; similarity; measurement | 4 + 8 | `geometry_beta01_session_v1` |
| Algebra II | Polynomial factors; rational restrictions; exponential models; logarithms | 4 + 8 | `algebra-2_beta01_session_v1` |
| Microeconomics | Opportunity cost; supply and demand; midpoint elasticity; discrete marginal choices | 4 + 8 | `microeconomics_beta01_session_v1` |

Each course has a separate URL under `courses/`, distinct questions, and its own progress. The shared engine and visual tools do not combine the course records. Each question requires a choice and a written reason; “not sure” remains separate from a mismatched choice. Explanations are retained for review, not automatically awarded points for containing text. Option positions rotate across questions. Initial predictions do not display a worked-answer graph; interactive models appear after the first response. Fresh questions use changed situations. These are deliberately short original tasks, not copied school or university problems.

The original AA01 activity, foundation sampler, and stored records remain accessible. Pre-Algebra and Algebra I offer a supplementary link to that activity without claiming it is an independent course-specific diagnostic. New courses do not yet have separate 15-question foundation checks. The course selector offers only available activities; Macroeconomics has a clearly marked outline card and no fake assessment controls.

The homepage goal previously saved as `aa01` is mapped to Algebra I while preserving request text. Reports from the original sampler can still be attached to either school algebra request; their actual report title and scope remain unchanged.

## Curriculum limits

These introductions are not full-year courses, AP courses, or university syllabi. Each course page lists remaining coverage gaps. Geometry still needs formal proof, transformations, circles, and coordinate geometry. Algebra II still needs complex-number methods, sequences, and full function analysis. Microeconomics still needs consumer theory, market structure, welfare, and externalities. Macroeconomics is planned around output, prices, employment, and policy models; it contains no assessment or progress tracking yet. AP Calculus AB/BC and AP Statistics remain future routes.

Course names and scope were checked against the California mathematics standards / framework and MIT Economics course descriptions. These sources inform organization, not a claim of comprehensive alignment:

- https://www.cde.ca.gov/be/st/Ss/documents/ccssmathstandardaug2013.pdf
- https://www.cde.ca.gov/Ci/ma/cf/mathfwfaqs.asp
- https://catalog.mit.edu/schools/humanities-arts-social-sciences/economics/
- https://ocw.mit.edu/courses/14-01-principles-of-microeconomics-fall-2023/

Microeconomic labs explicitly state the simplified assumptions. Elasticity uses midpoint percentage changes rather than raw slope. Revenue stays separate from profit. The marginal-choice example enumerates discrete outputs; it does not assert a universal continuous optimum condition. Game Theory remains an independent course with economics and other applications.

## Rebuild and validate

- `node scripts/build-course-pages.cjs`: course shells and the macroeconomics outline.
- `node scripts/build-course-home.cjs`: homepage choices and cards from the course catalogue; repeatable.
- `node scripts/build-hub-illustrations.cjs` then `node scripts/build-course-illustrations.cjs`: original and new mathematical covers.
- `node scripts/test-all.cjs`: full repository regression, including `tests/course-catalog.test.cjs`.
- `node scripts/audit-graphics.cjs /absolute/output/path`: 351 SVG fixtures, including new covers and new graphical model boundaries. HTML tables are checked through the content and DOM flows.

New coverage verifies full completion/export for all five courses, exact unfinished-draft restoration, revision history, legacy record isolation, separate report archiving, manual detached printing, storage denial/corruption recovery, local link resolution, controls and saved settings, original task separation, and independent calculations for equilibrium, elasticity, area scaling, rational restrictions, and marginal profit.

Static raster inspection and DOM tests do not reproduce native macOS Safari/Chrome layout or PDF behavior. No native macOS verification is claimed. Previously reviewed graphics repairs remain part of this change.
