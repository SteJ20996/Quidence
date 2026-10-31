# Readable header text in every appearance · 2026-10-31

In Classic, the Math Voice Lab header showed an empty pill where "Teaching demo" should be. The "Math Voice Lab" name beside the logo was missing too. A search of every released page found a second case of the same problem.

## Cause

Each appearance repaints the page headers.
- In Classic, `assets/color-review.css` gives `.site-header` a dark teal background with white text.
- The Math Voice Lab replaces that background with the appearance's paper color in `assets/math-voice.css`. It left the white text in place.
- The controls that set their own color stayed visible. Everything that inherited the header's color became white on white.

The second case is the reverse. On Discrete Mathematics, Number Theory and Cross-disciplinary Projects, the header line "Online learning foundations, charts and reports" is a light gray chosen for the dark Classic header. In Paper Explorer, Learning Atlas and Geometric Studio the header is light, so the line had a contrast of about 1.6:1.

## Fix

- **Math Voice Lab header:** it takes the appearance's ink color along with its paper background (`assets/math-voice.css`). In Classic, "Teaching demo" and "Math Voice Lab" are now dark ink on white, at about 12:1. The other appearances already used their ink color and do not change.
- **Header subtitle:** in the illustrated appearances, it takes the appearance's muted ink color (`assets/themes.css`), at about 6:1. Classic keeps its dark header and light gray text.

The Math Voice Lab stays English-only; only its colors changed.

## Checking

`scripts/header-contrast-audit.cjs` finds text in headers, course navigation strips, top bars and toolbars that has less than 4.5:1 contrast with its background, the WCAG AA level for normal text. It exempts disabled controls, as WCAG does: for example "My report" before a report exists. `npm run test:themes:browser` now runs it on every released page:
- in every appearance;
- at 320 px in Spanish and at 1440 px in English.

On the live site before this fix, the audit reports the Math Voice Lab header in Classic and the header subtitle in the three illustrated appearances. With the fix, it reports nothing.
