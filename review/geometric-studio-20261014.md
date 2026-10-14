# Geometric Studio implementation

Implemented from the approved Geometric Subject Explorer reference, on top of
the merged Classic card alignment (PR #40).

## Design

- Warm light surfaces, rounded Nunito headings, dark blue-green actions, mint
  accents and a coral Geometry card.
- Four-column desktop subject grid, three/two columns at intermediate widths,
  and single-column phone cards. All/School/Further/Science filters remain.
- Twelve original native SVG illustrations with soft shaded geometry. Geometry
  contains a closed cube, sphere and pyramid; Physics 1 shows equal-length
  pendulum positions and Physics 2 shows a positive-to-negative field direction.
- A geometric hero decoration, compact subject actions, and the existing full
  descriptions and activity links in the expandable card section.
- A horizontal mint learning-request area and a Qidolab link at the lower right.
  The original form nodes and report opt-in are retained, with sharing controls
  available under More options & sharing.
- All three approved knowledge maps retain their original nodes, routes and
  destinations, using matching rounded surfaces and typography.
- Shared Studio typography, surfaces and buttons apply to all 24 public pages.
  Appearance position and desktop width stay under the shared final stylesheet.

The default for new visitors remains Studio. Existing theme preferences, exact
input, course destinations, reports and Classic layout are preserved. The
existing compact-layout helper is extended to Studio rather than cloning form
inputs. The request heading moves back to its original position in other themes.

## Validation

- `npm test`: passed; `build:static`: 212 public files.
- `test:themes:browser`: 192 page layouts, 40 Appearance alignment cases,
  10 Classic card alignment cases, 192 logo checks; passed.
- `test:studio:browser`: 20 English/Spanish responsive layouts, 80 category
  checks, maps, six theme round trips, unique IDs, original form-node identity,
  unchanged course links and exact saved-input bytes; passed.
- Paper Explorer and Learning Atlas browser suites: passed.
- Illustrated maps and Number Theory/Physics foundations: 18 layouts,
  72 map views and 45 complete questions; passed with no missing translations.
- Actual browser captures reviewed for desktop, phone, all three maps and a
  course page. Decorative SVG assets require no external image services.
- Full activity regression: 88 pages, 48 saved drafts, four completed report
  flows and real stale-cache upgrades passed. The test opens More options
  before interacting with the report opt-in, matching the new default layout.
- Bilingual regression: 96 layouts, 72 tasks and 20 reports passed with no
  English residue. Brand regression: 192 layouts and two offline reports
  passed; the Studio phone logo keeps the existing 180px/44px minimum.

## Captures

- [Desktop](geometric-studio-desktop.jpg)
- [Phone](geometric-studio-mobile.jpg)
- [School Mathematics map](geometric-studio-map-school.jpg)
- [Further Mathematics map](geometric-studio-map-further.jpg)
- [Science map](geometric-studio-map-science.jpg)
- [Game Theory page](geometric-studio-game-theory.jpg)

Game Theory projects and case studies are a subsequent content-design task;
this release does not change questions, scoring or the source ledger.
