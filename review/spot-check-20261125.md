# Random spot-check of the whole site · 2026-11-25

After the button pass ([link-buttons-20261125.md](link-buttons-20261125.md)), the repository owner asked for random spot-checks across the whole site, to find what is still not done well enough. This note records how the samples were drawn, what they found, what was fixed and what was left.

## How the samples were drawn

`scripts/spot-check-browser.cjs` draws seeded random samples:
```
node scripts/spot-check-browser.cjs <seed> <samples> <folder>
```
- **Each sample.** A sample is one page state, chosen from 38 pages, the homepage views, 19 Intuition Lab activities, the projects and 16 algorithms. Each gets a random appearance and a random width from 320 to 1920 px. Then 0–3 random clicks are made, with text typed into empty fields. Clicks never delete, export, copy, share or record, and never leave the site.
- **What it records.** Page overflow, cut-off text, overlapping controls, small targets, controls past the right edge, broken images, low text contrast, script errors and controls that do not look like buttons. It also saves a screenshot.
- **Links.** Internal links on the sampled pages are fetched once at the end.

| Round | Seed | Samples | Links checked | Broken links | Script errors |
| --- | --- | --- | --- | --- | --- |
| 1 | 20261125 | 48 | 90 | 0 | 0 |
| 2 | 4711 | 64 | 105 | 0 | 0 |
| 3 | 99 | 48 | 91 | 0 | 0 |
| 4 | 314159 | 48 | 99 | 0 | 0 |
| 5 | 8080 | 48 | 94 | 0 | 0 |

**Independent read.** A reviewer who had not built the pages looked at the 64 screenshots of round 2. The reviewer reported problems a learner or parent would notice.

## What was fixed

| Problem | Where | Fix |
| --- | --- | --- |
| Matrices drawn with single vertical bars, which is the notation for a determinant | Linear Algebra, every matrix | Square brackets |
| Third worked product broke after "=", then lost its last bracket at 1024 px | Matrix Explorer | The examples take two columns when three do not fit, and a product stays on one line |
| Builder menus ran past the card | Algorithms, "Faster on a sorted list", phones | The menus shrink to the card |
| Flowchart and route map cut off, with nothing saying they scroll | Algorithms, phones | A line says so, shown only when the diagram is wider than its box |
| Flowchart text about 9 px in the two-column layout | Algorithms, 900–1100 px | The workbench stacks below 1100 px |
| An arrow crossed "divide and merge", and the "yes" label was hidden behind the swap box | Algorithms route map; bubble-sort flowchart | Labels are drawn last, with a halo in the panel's color |
| Index numbers sat on the boxes of the row above | Algorithms data view, phones | Wider gap between rows |
| Steps broke inside expressions ("n −" / "1") | Algorithms steps list, phones | Short expressions stay on one line; the text itself is unchanged |
| Links in browser-default blue | The records banner and several check pages; the check-page subject chips | The appearance's colors |
| Chips split across two lines ("Physics / 1 Foundations") | Inline links, phones | A chip moves to the next line whole |
| Browser-default blue radio buttons | Intuition Lab "How sure are you?" | The appearance's color |
| Text below 4.5:1 contrast | Classic course and module footers (4.43); Atlas check and report eyebrows (4.44) | Darker grey and teal |
| Targets under 24 px | Intuition Lab breadcrumbs, the Studio records note, inline chips in small notes | At least 24 px; breadcrumbs 28 px |
| A plain "×" close button | Math Voice Lab dialog | An outlined round button. The themes suite now opens the dialogs on the Math Voice Lab and Think in Motion pages and checks them. |
| Subtitle ran into the landscape picture | Atlas homepage, 1024 px | The subtitle stops short of the picture |

## What the checker got wrong

Every automated flag was checked against its screenshot before anything changed. Some came from the checker, not the site:
- **Hidden text read as cut off.** Text hidden for screen readers, and the source text behind stacked fractions, looked like cut-off text.
- **Collapsed sections.** Chrome reports boxes for the content of collapsed sections. Controls inside them looked as if they overlapped what was on screen.
- **Wrapped chips.** The bounding boxes of chips that wrap across lines overlap, though the chips do not.
- **Mixed colors.** Colors written with `color-mix()` came back in a format the contrast estimate could not read.
- **The serif font.** Georgia is the intended font for the number banners in the projects. The test machine has no Georgia, so screenshots fell back to Times.

The script now skips collapsed content and unreadable colors. Its flags are still estimates, not verdicts.

## What was left, and why

- **Inactive "My report" tab, 3.6–3.8:1.** The tab opens once every answer is saved. WCAG 2.1 (1.4.3) exempts inactive controls from the contrast minimum.
- **Small text in charts on phones.** The melting curve and the Intuition Lab card pictures are drawn to scale, so their labels shrink to 7–9 px at 390 px. Fixing them needs a phone layout for each chart, not one rule.
- **Layout points of lower severity.** The reviewer reported these, and they were not changed in this pass:
  - empty space below the Atlas homepage sidebar;
  - uneven card heights in some rows at narrow widths;
  - a lone fourth card in "Think further" at 1920 px;
  - two touching buttons in Think in Motion;
  - a headline "0 of 0 predictions matched" before any prediction;
  - formulas in prose that break across lines;
  - the arrows between knowledge-map tabs, which now sit outside the outlined tabs;
  - Title Case on two knowledge-map buttons, which also appear as page titles.
- **Outlined labels that are not clickable.** Examples are "MATRIX EXPLORER" and "Teaching demo". A learner may try to click them.

## Gaps

- **Coverage.** The five rounds drew 256 samples from 84 starting states, so most combinations of page, appearance, width and click were never drawn. States behind actions the clicks avoid were not visited: deleting records, exporting, recording. Neither were states that need many answers, such as finished checks with reports.
- **One reader.** The visual read is one reviewer's judgement of 64 screenshots. What is "unpolished" is partly taste. Its high- and medium-severity points were confirmed here by new screenshots before fixing.
- **The test machine.** Fonts and native controls differ from learners' phones and laptops, so some rendering problems cannot appear here and some seen here do not occur there.
- **No learners.** Nothing here shows whether learners found the site harder or easier to use.
