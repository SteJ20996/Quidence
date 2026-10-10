# Quidence homepage update — October 9, 2026

The homepage implements the selected top navigation composition at both 16:9 and 4:3. A larger existing Quidence logo sits on the left, Map / Subject Blocks controls occupy the header, and the site description and English / Español selection sit on the right. Desktop subject and request panels remain visible as the map scrolls. Smaller screens stack the panels without horizontal overflow.

The map is the default entry view. Its three connected chapters retain the approved organic layout and subtle routes. Available topics link to the existing ten courses and their diagnostics; exploratory advanced topics do not offer nonexistent course links. The alternate course view groups cards into Middle School, High School and College Level.

Map and sidebar selection share the existing subject state. Requests preserve the student's exact text, and changing subject requires a separate opt-in before including the request in that subject's final report. Saved reports, request recovery controls and the feedback email remain accessible. Course cards remain available when the map cannot initialize.

## Validation

- `npm test`: 225 tests passed, zero failures. The previous fixed-order homepage link assertion now checks complete course coverage, because the approved card view orders courses by school stage.
- `npm run test:home:browser`: 12 English/Spanish viewport combinations and 36 map states passed. Tested 1280×720, 1200×900, 1920×1080, 1024×768, 375×812 and 320×812. No horizontal overflow, overlapping node labels, clipped header elements, JavaScript errors or failed asset requests were observed.
- Homepage browser checks cover all ten learning/diagnostic routes, switching views, refreshing, request criteria, unavailable topics, corrupted stored requests and unavailable browser storage.
- With 100 saved reports, 200 subject changes, 20 view changes and six language changes, the existing report archive and exact request text were preserved. All 120 local requests at concurrency 40 succeeded.
- `npm run test:localization:browser`: 88 page layouts, 72 diagnostic/project tasks and 20 reports passed; zero browser errors and zero reviewed English residue.
- Asset version checks, whitespace checks and static release link validation passed. A final non-script fallback copy correction removes an inaccurate direction word; its English and Spanish versions were rebuilt together.

The request concurrency check targets a local server. These results establish functional regressions and local behavior; they do not measure Cloudflare's production capacity.

## Release

`Quidence_map_release_20261009.zip` contains a static deployment bundle, with `index.html`, `_headers` and asset folders at its root. No deployment or remote merge was performed during this update.

Evidence: `review/home-map-validation-20261009.json` and `review/screenshots/home-map-{1280-en,1200-es,375-es}.webp`.

## Foundation map proportions follow-up

The foundation chapter now uses the university chapter's 960px base height. Its previous 600px desktop override and shorter 770px chapter setting were removed. All three chapters share the same base height, with the same additional space for narrow screens and automatic label collision avoidance.

The homepage browser regression passed again: 12 viewport/language combinations, 36 map states, all course entries, storage recovery and repeated interactions. The six focused map/homepage tests passed. At a 1920px viewport, all three map canvases measured 1306×960px. Updated comparison screenshots are `review/screenshots/home-foundations-proportions-1920-en.webp` and `review/screenshots/home-university-proportions-1920-en.webp`.

`Quidence_map_proportions_20261009.zip` supersedes the earlier static deployment bundle. This follow-up was not pushed or deployed.

## Next content update: clarify map background regions

User request, October 9, 2026: change the two large, faint background regions shown behind Operations / Pre-algebra and Geometry. Their meaning is unclear. Include this work when the next reviewed learning content is added; this note does not implement a UI change or authorize publishing the pending content.

- Replace the unlabeled circular/elliptical fills with a clearer treatment. Prefer restrained, explicitly labeled knowledge regions where a grouping is useful; remove decorative fills that have no explainable meaning. Exact region boundaries and labels still need to follow the actual concept relationships.
- Keep background grouping visually distinct from selected nodes and highlighted connections. A region must not imply mastery, a required course order, or an unavailable course.
- Add matching English and Spanish wording if region labels are used. Verify that labels do not overlap nodes or routes at desktop and mobile sizes, including dark mode.
- Review this together with the next calculus, linear algebra or number theory content update, before preparing a new deployment bundle.

Reference: user screenshot `image(20261010-054913).png`; the large mint region below Pre-algebra and the pale blue-gray region behind Geometry, rather than the small course-node markers.

### Completed with the Number Theory update (2026-10-10)

Removed unlabeled background region fills; the existing legend and branch controls explain the map. English/Spanish desktop and phone checks passed. See `number-theory-release-20261010.md`.
