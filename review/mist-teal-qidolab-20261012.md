# Mist violet, deep teal and Qidolab navigation · 2026-10-12

The user approved the independent Quidence preview and requested its integration into GitHub. This update retains the foundational SEO changes already present in PR #26 and adds the approved interface across all 23 public HTML pages.

- Very light mist violet (`#F3F1F7`) backgrounds, white reading surfaces, deep teal actions, mint secondary controls and limited coral emphasis. Existing chart colors, feedback meanings, original Quidence artwork and achievement colors remain in their existing source files.
- The footer uses the original outlined Qidolab lockup with its smaller Quidence mark and a new SVG illustration of the actual seven/four-liter water-jug puzzle. The full panel opens `https://qidolab.com/`.
- A separate card below the subject picker stays with the desktop sticky rail and uses a native `#qidolab` anchor. Narrow layouts place it in the normal document flow. Smooth scrolling is limited to the homepage and respects reduced motion; the destination has a visible outline. Both Qidolab links are hidden in print.
- The course-page generator now includes the theme. The existing region-based homepage generator preserves both links. Reproducible Spanish source captions and asset fingerprints retain the changes through future rebuilds.

## Verification

The ordered resources and authored body of every public page match the user-approved preview after normalizing cache query parameters. Theme CSS, both Qidolab SVG assets and report style code match that preview byte-for-byte. Existing Spanish entries and structured translation rules are retained; the three new navigation/footer captions are supplied from `localization/qidolab-extra-es.json`.

`npm test` and the static build passed locally. The build contains 167 whitelisted public source files plus generated security headers, and excludes source drafts, review files, test fixtures, account clients and databases. SEO generation and activity fingerprints pass their current checks. The 33 representative contrast pairs in `mist-teal-color-contrast-20261012.json` pass their stated thresholds.

The report executable code and manual-print script remain unchanged outside the CSS literal. Questions, grading rules, original responses, saved histories, backups and account restrictions are unchanged. GitHub CI runs the existing Chromium layout, language, report, cache and mathematics regressions on the updated branch. Native Safari/iPad behavior and the previously reported macOS PDF freeze still require real-device verification.

GitHub source integration does not change Cloudflare DNS or verify Search Console. Deployment to the official domain remains a separate operation.
