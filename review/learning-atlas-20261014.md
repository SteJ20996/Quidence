# Learning Atlas implementation review — 2026-10-14

Learning Atlas now follows the approved illustrated learning atlas reference: an ivory field-guide page, dark teal serif typography, an observatory landscape, grouped subject illustrations, a compass-led question panel, and a books-and-botany still life.

## Implemented behavior

- Home shows School Mathematics (4 courses), Further Mathematics (6), and Science (2), with the existing All / School / Further / Science filters.
- The original course cards and form controls move between layouts. They are not cloned or recreated; original links, input values, assistance options, and browser learning records remain intact.
- The knowledge-map teaser opens the existing interactive map. Its decorative network is not a prerequisite graph. The three existing group maps retain their course destinations.
- Shared Atlas typography, colors, paper surfaces, and controls apply across all 24 published pages. Native mathematical diagrams and question content remain unchanged.
- The selected appearance still persists in this browser; a first-time visitor still gets Geometric Studio. Paper Explorer, Classic, and Studio keep their own layouts.
- English and Spanish labels are included. Desktop has a static right question column; tablet/mobile flow the panel below the course groups and use readable two-column cards.
- The existing Geometry card remains a closed cube, pyramid, and sphere illustration; Atlas has its own native SVG rendering.

## Review images

Actual Chromium screenshots of the implemented page, not generated mockups:

- [Desktop](learning-atlas-desktop.jpg)
- [Mobile](learning-atlas-mobile.jpg)

## Validation before opening the PR

- `npm test` passed all configured Node test suites.
- `npm run test:atlas:browser`: 18 language/viewport layouts, 72 category changes, 72 map views, 6 theme round trips; no page errors or failed requests.
- `npm run test:paper:browser`: 18 layouts, 72 category changes, 6 theme round trips; no page errors or failed requests.
- `npm run test:themes:browser`: 192 layouts across 24 pages and all four themes; no errors or failures.
- `npm run test:cartoon:browser`: 18 layouts, 72 map views, 45 questions; no errors, failed requests, or missing content.
- Visually inspected the final desktop/mobile home, foundation-check overview, and interactive map.
- Static release build passed with 208 public files. Source/review files remain outside the public build; the font license is included.
- `git diff --check` passed.

The final mobile navigation sizing adjustment is included in the PR CI rerun of these browser checks. The new Atlas test also verifies original Unicode input preservation, per-course link equality, Classic row restoration, saved Atlas reloads, translated deep links, map navigation, and asset availability.

## Asset provenance and reproduction

Execution mode: built-in image-generation tool, with the user-provided “Quidence’s illustrated learning atlas-2.png” as a style reference; transparent background enabled. Two decorative illustrations were generated separately. The generated PNGs were converted to WebP at their original dimensions (quality 84, method 6), without visual edits.

- `assets/atlas-observatory.webp` — 2172 × 724, decorative panorama.
- `assets/atlas-books.webp` — 1536 × 1024, decorative still life.
- `assets/atlas-art.js` — original code-native SVG subject illustrations, compass and decorative map route. These do not replace lesson diagrams.

Observatory prompt:

> Use case: illustration-story. Asset type: transparent decorative panorama for the existing Quidence Learning Atlas website. Input image is a style and composition reference, not an edit target. Recreate only its upper-right landscape illustration: a small cream stone classical observatory with a blue-gray dome on a low hill, winding pale footpath, tall evergreen trees, distant lavender-gray mountains, quiet sage meadow and scattered rocks. Match the reference's refined watercolor and fine engraved pencil linework, muted sage, blue-gray and warm ivory palette, thoughtful illustrated field-guide mood. Wide shallow panoramic composition about 3:1, observatory toward the right, mountains toward the left. All landscape edges softly dissipate into genuine transparency so it can blend onto an ivory page. Keep the entire scene inside the canvas. No text, labels, letters, UI, cards, frame, logo, compass, people or background paper. This is one decorative web asset, not a website mockup.

Books prompt:

> Use case: illustration-story. Asset type: transparent decorative still life for the existing Quidence Learning Atlas website. Input image is a style reference. Recreate only the lower-right illustration: a stack of three old clothbound books, top book slate blue, middle sage green, bottom warm cream, with delicate gold edge rules but completely blank covers and spines; natural gray rocks and small leafy botanical sprigs around the stack. Match the reference's delicate watercolor, subtle fine pencil hatching, muted natural palette and elegant illustrated field-guide feeling. Horizontal composition about 3:2, books filling right two-thirds, low rocks left and in front, botanical sprigs behind. Feathered watercolor edges fading into genuine transparency. Keep objects fully in frame. No words, letters, numbers, logos, UI, borders, website or background paper. It will sit at the bottom of a narrow webpage sidebar.

Typography uses self-hosted Source Serif 4, downloaded from Google Fonts and converted from TTF to WOFF with fontTools. No runtime font-provider requests are needed.

- `assets/fonts/source-serif-4-400.woff`
- `assets/fonts/source-serif-4-700.woff`
- `assets/fonts/SourceSerif4-OFL.txt` — SIL Open Font License 1.1, from https://github.com/google/fonts/blob/main/ofl/sourceserif4/OFL.txt
