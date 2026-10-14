# Classic subject card alignment

The activity badge previously shared a line with short subject names, while
Physics 1 wrapped it onto a second line. Flex auto margins then moved Start and
the later activity links to different vertical positions.

Classic now uses the Physics 1 reading order: subject label, separate activity
badge, illustration, title, four-line introduction area, Start, foundations,
understanding check, projects, and the scope note. Desktop cards share nine grid
tracks (the first holds the two-line metadata). Existing action links retain
their destinations and occupy the appropriate track. No activities are added.

The 12 English desktop cards have equal heights and aligned content slots at
960, 1024, 1440, 1920 and 2560 pixels. Neighbouring Spanish cards also align;
longer translations can expand a shared row rather than being clipped. On
single-column phones, content keeps its natural height and the activity badge
still has its own line. Browsers without subgrid or `::details-content` retain
the normal flow layout with the stacked badge and without the Start auto margin.

Only Classic homepage CSS and its asset version change. The shared Appearance
alignment, logo variants, other themes, course content and saved records retain
their existing behavior. Geometric Studio development is paused.

## Validation

- `npm test` and `npm run build:static`: passed.
- `test:themes:browser`: 192 page layouts, 40 theme-switch alignment cases,
  10 Classic card alignment cases and 192 logo contrast checks; no errors.
- `test:paper:browser`: 18 layouts, 72 category checks, six theme round trips.
- `test:atlas:browser`: 18 layouts, 72 category checks, 72 map views, six theme
  round trips. Original course links and exact request bytes remain intact.
- Manual Chromium rendering in English and Spanish at 320, 375, 768, 960,
  1024, 1440, 1600 and 1920 pixels: no horizontal overflow.

Actual browser captures: [desktop](classic-cards-desktop.png) and
[mobile](classic-cards-mobile.png).
