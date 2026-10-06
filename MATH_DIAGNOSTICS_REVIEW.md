# Mathematics diagnostics review

This update focuses the product on eight mathematics subjects, retains Statistics, and retires Microeconomics, Macroeconomics, and Game Theory. It adds 40 original intermediate/challenging problems, including 12 in Linear Algebra, with 156 answer components. Introductory work remains available for review; diagnostic work has an independent entry and record space.

## Review performed

- Prompts checked for domains, intervals, ordering, units, rounding requirements, and sufficient information. Every number/choice component is matched against a separate exact-arithmetic oracle.
- The independent Python verifier does not import the authored answer keys. It uses rational arithmetic, Gaussian elimination, polynomial products, exact polynomial integrals, interval checks, centered regression identities, and geometric relationships. All 40 cases and 156 components match.
- Each solution explains the required conditions and checks the original problem. Explanations remain for teacher/tutor review; concise equivalent reasoning is not automatically penalized.
- Multiple-selection choices include non-answer alternatives and complete answer sets. Exact radicals use explicit symbolic choices; ordinary numeric inputs accept signed decimals and fractions. No hidden rounding convention is required.
- Four coordinate figures are checked at 240, 320, 520, and 620px widths. Geometry uses equal horizontal and vertical unit lengths. Vertices, polygon edges, piecewise segments, line intercepts/slopes, labels, clipping, legend colors, and axis units are verified. The review sheet renders 320px and 520px variants for visual inspection. Three additional matrix/table stimuli were checked against the stated data.
- Eight complete DOM journeys verify required explanations, readiness controls, precise draft restoration, unchanged earlier submissions, saved reports, and export of original prompts/answers. Each reference answer is accepted; perturbing any one component preserves all matching companions.

## What feedback means

A report names the particular component and skill to recheck. Downstream incorrect answers with failed upstream values are explicitly flagged as potentially dependent; they are not separate demonstrated weaknesses. Not-studied responses are readiness information and distinct from uncertain responses. Support and written reasoning stay attached to the original attempts. Matching components do not certify a proof or complete mastery.

Difficulty labels are author-design targets: 20 medium and 20 challenging problems relative to each subject and its stated prerequisites. No student trial has calibrated difficulty, reliability, diagnostic sensitivity, or the breadth of a full curriculum. In particular, the Linear Algebra problems go beyond the prior vector/matrix introductory activities; prerequisites are explicit before the check.

## Per-question review

Each row has a checked prompt, independent answer calculations, a reference solution, and component-level feedback. The full expected values are retained in `review/challenge-math-audit.json`; student wording remains in `assets/challenge-bank.js`.

| ID | Subject | Demand | Main evidence | Components | Stimulus |
| --- | --- | --- | --- | ---: | --- |
| la-c01 | Linear Algebra | medium | Singularity condition; Dependent equations versus contradiction; Elimination; Consistency of the right-hand side | 5 | Complete text data |
| la-c02 | Linear Algebra | challenging | Independent rows; Rank–nullity; Particular solution; Nullspace direction; Column-space compatibility | 7 | Checked matrix |
| la-c03 | Linear Algebra | medium | Matrix composition order; Inverse order | 5 | Complete text data |
| la-c04 | Linear Algebra | challenging | Basis coordinates; Output basis conversion; Images of basis vectors | 8 | Complete text data |
| la-c05 | Linear Algebra | medium | Projection normalization; Residual construction; Orthogonality check | 5 | Complete text data |
| la-c06 | Linear Algebra | challenging | Least-squares normal equations; Residual error; Exact solution versus approximation | 4 | Checked data table |
| la-c07 | Linear Algebra | challenging | A common eigenvalue for all coordinates; Eigenvalue computation; Powers on an eigenvector | 5 | Complete text data |
| la-c08 | Linear Algebra | medium | Signed determinant; Geometric area; Absolute determinant as area factor; Orientation versus positive area | 4 | Checked coordinate figure |
| la-c09 | Linear Algebra | challenging | Column-space compatibility; Projection onto column space; Nullspace and uniqueness | 4 | Complete text data |
| la-c10 | Linear Algebra | medium | Linearity and the origin; Additivity test | 3 | Complete text data |
| la-c11 | Linear Algebra | challenging | Determinant zero conditions; Rank after a pivot vanishes; Rank–nullity; Compatibility of nonindependent rows | 4 | Complete text data |
| la-c12 | Linear Algebra | challenging | Subspace closure conditions; Dimension of a homogeneous constraint; Dependence of spanning vectors | 3 | Complete text data |
| pa-c01 | Pre-Algebra | medium | A fraction of the full mixture; Uniform proportional removal; A new denominator after dilution | 3 | Complete text data |
| pa-c02 | Pre-Algebra | medium | Reverse percentage operations; The discount base; The tax base | 3 | Complete text data |
| pa-c03 | Pre-Algebra | challenging | Signed fraction rates; Reciprocal of a net rate; Rate multiplied by elapsed time | 3 | Complete text data |
| pa-c04 | Pre-Algebra | challenging | Unknown scale in a ratio; A common ratio scale; Updating actual counts | 3 | Complete text data |
| a1-c01 | Algebra I | medium | Parameter-dependent elimination; Solving a system; Identity versus contradiction | 4 | Complete text data |
| a1-c02 | Algebra I | medium | Two-sided absolute-value inequality; Closed inequality boundaries; Checking a proposed solution set | 4 | Complete text data |
| a1-c03 | Algebra I | challenging | Perimeter as a side-sum constraint; Area as a product constraint; Interpreting both roots | 4 | Complete text data |
| a1-c04 | Algebra I | medium | Intersection of linear models; Substituting the intersection; Budget inequality and integer restriction | 4 | Checked coordinate figure |
| ge-c01 | Geometry | medium | Coordinate base and height; Distance between midpoints; Area versus length scaling; Parallelism from coordinate directions | 4 | Checked coordinate figure |
| ge-c02 | Geometry | challenging | Similarity along a right-triangle altitude; Leg and hypotenuse-segment relation; Two equivalent triangle area formulas | 4 | Complete text data |
| ge-c03 | Geometry | challenging | Similarity of parallel cone sections; Cubic volume scale; Volume subtraction | 3 | Complete text data |
| ge-c04 | Geometry | medium | Radius perpendicular to a tangent; Near secant segment; Full secant segment; Tangent–secant relation | 4 | Complete text data |
| a2-c01 | Algebra II | medium | Rational equation after clearing denominators; Original domain restrictions | 3 | Complete text data |
| a2-c02 | Algebra II | medium | Logarithmic product and domain; Extraneous-root identification; Each log argument must be positive | 3 | Complete text data |
| a2-c03 | Algebra II | challenging | Complete factorization; Repeated roots; Sign chart and multiplicity | 3 | Complete text data |
| a2-c04 | Algebra II | challenging | Exponential substitution; Recovering the original variable; Preserving every equation term | 3 | Complete text data |
| pc-c01 | Pre-calculus | challenging | Combined radical and denominator restrictions; Sign analysis of a rational inequality; Boundary testing; Inner function domain; Outer denominator after composition | 5 | Complete text data |
| pc-c02 | Pre-calculus | medium | All quadrants after a trigonometric substitution | 1 | Complete text data |
| pc-c03 | Pre-calculus | medium | Cancelled factor and original domain; Limit at an excluded input; Uncancelled denominator zero; End behavior; Allowed numerator zero | 5 | Complete text data |
| pc-c04 | Pre-calculus | medium | Angular frequency and period; Phase and first interval solution; Midline and amplitude; Phase location of a minimum | 4 | Complete text data |
| ca-c01 | Calculus | medium | Matching one-sided derivatives; Continuity at a join; Derivative at the joined point | 3 | Complete text data |
| ca-c02 | Calculus | challenging | Derivative sign and endpoint comparisons; Value at the maximizing input; Product and chain rules | 3 | Complete text data |
| ca-c03 | Calculus | challenging | Signed integration; Integrating the absolute velocity; Initial value plus net change | 3 | Complete text data |
| ca-c04 | Calculus | challenging | Sign of the integrand and accumulation extrema; Signed geometric accumulation; Fundamental theorem of calculus | 5 | Checked coordinate figure |
| st-c01 | Statistics | medium | False-positive reference group; Joint counts across groups; Reversing a conditional probability | 3 | Complete text data |
| st-c02 | Statistics | challenging | Weighted aggregation; Conditional versus aggregate comparison; Confounding and study design | 4 | Checked data table |
| st-c03 | Statistics | medium | Constructing a sample center; Squared deviations and sample divisor; Affine transformation of a center; Squared scaling of variance | 4 | Complete text data |
| st-c04 | Statistics | challenging | Centered cross-products in regression; A fitted line through the sample means; Residual sign; Explained variation versus correlation | 4 | Complete text data |

## Compatibility and course retirement

- Existing entry/further checks and saved report definitions remain pinned to their prior versions. The new bank uses `cluevera-challenges-1` and its own `cluevera_challenge_portfolio_v1` storage key. The sync allowlist includes that key. Future changes to already-served questions require a new retained bank version.
- The shared foundation engine exposes a bank factory instead of copying another grading/storage implementation. Existing fixed answer history still hydrates under its previous definitions.
- All eight cards and their lesson pages link to the new diagnostics. The homepage has two groups: School Mathematics and Further Mathematics. Economics/Game Theory teaching sources are archived, active URLs show retirement pages, and active subject selectors exclude them. Historical reports and legacy progress keys are retained for export.
- A running course does not receive an in-place cloud overwrite; the prior account review/conflict behavior also protects the new diagnostic portfolio. The backend remains locally runnable and has not been deployed.

## Reproduction

Run `python3 scripts/audit-challenges.py`, `node scripts/render-challenge-graphics.cjs`, and `npm test`. Python uses only the standard library. The SVG review sheet is self-contained. The full current mathematics/state/DOM/graphics/backend regression suite passed. Native macOS browser layout, accessibility interaction, printing, and a deployed HTTPS environment were not tested here.

## Reference scope

Definitions and topic organization were cross-checked with primary educational sources, not copied questions: [MIT 18.06 syllabus](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/pages/syllabus/), [MIT projections and least squares](https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/pages/least-squares-determinants-and-eigenvalues/projection-matrices-and-least-squares/), and [OpenStax Precalculus exponential/logarithmic equations](https://openstax.org/books/precalculus-2e/pages/4-6-exponential-and-logarithmic-equations). Each problem and drawing was composed for this product; none of the source examination questions or diagrams was reused.
