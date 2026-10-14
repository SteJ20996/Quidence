# Appearance alignment and Classic logo review — 2026-10-14

The user confirmed that Learning Atlas PR #38 was merged. GitHub main was verified at `1881617eac7aadff8ca949d1c27a85aba6336d71`, and its Cloudflare build succeeded. Live browser inspection confirmed the new Atlas interface and reproduced the reported desktop alignment and Classic logo issues.

## Changes

- A shared desktop shell centers all four home styles at the same maximum content width of 1480px, with a common 24px outer gutter. Their individual card, illustration and navigation designs stay available.
- Appearance uses the same system font, dimensions, margins and coordinates across themes. Its buttons stay under the pointer when switching styles. Paper's decorative frame follows the centered shell.
- Header logos choose between the existing original dark-ink and white-letter SVGs according to the actual header background. Classic's dark headers now use white lettering and mint accents; light headers retain dark lettering.
- Both logo URLs are versioned by the asset generator. No logo drawing or lesson diagrams are altered.
- Includes the pending Learning Atlas accessible-name correction from local commit `9d0b899`: the map teaser derives its accessible name and description from its visible translated text.

## Measured desktop results

All four themes now have identical Appearance label/button rectangles within each language and viewport.

| Viewport width | Content width, all four themes | Content left edge | Appearance label left edge |
| --- | --- | --- | --- |
| 1024px | 976px | 24px | 40px |
| 1440px | 1392px | 24px | 40px |
| 1920px | 1480px | 220px | 236px |

Before the fix, at 1920px, Classic content was 1880px wide while the illustrated themes were 1480px. The Paper Appearance label began at 43px, Atlas at 226px, and Studio at 234px.

Actual browser screenshots at the same 1920px viewport, after transitions and font loading settle:

- [Classic](appearance-classic-desktop.jpg)
- [Paper Explorer](appearance-paper-desktop.jpg)
- [Learning Atlas](appearance-atlas-desktop.jpg)
- [Geometric Studio](appearance-studio-desktop.jpg)

## Validation

- `npm test`: all configured Node suites passed.
- Theme browser checks: 192 layouts over 24 public pages; 40 additional desktop alignment checks across English/Spanish and 960, 1024, 1440, 1920 and 2560px; 192 logo contrast checks (at least 4.5:1). No page errors or failed requests.
- Paper browser regression: 18 layouts, 72 category changes, 6 theme round trips; no errors or failed requests.
- Atlas browser regression: 18 layouts, 72 category changes, 72 map views, 6 theme round trips; no errors or failed requests.
- Saved theme preferences, exact request input, existing reports and mathematics drafts remain covered by the theme regression.
- The pending accessible-name fix previously passed 96 localization layouts, 72 tasks and 20 reports. Full GitHub CI will rerun on this combined change before merge.
