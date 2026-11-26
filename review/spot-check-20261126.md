# Second random spot-check of the whole site · 2026-11-26

The repository owner asked for another random spot-check of the whole site, to find what is still not done well enough. The [first spot-check](spot-check-20261125.md) was a day earlier. Since then, the site gained:
- Integrated Science's predict-first steps and revised questions;
- the fox model's chance of dying out;
- an understanding check taken in two parts.

This note records how the samples were drawn, what they found, what was fixed and what was left.

## How the samples were drawn

`scripts/spot-check-browser.cjs` draws seeded random samples:
```
node scripts/spot-check-browser.cjs <seed> <samples> <folder>
```
**What a sample is.** As before, a sample is one page state in a random appearance and width (320 to 1920 px), after 0–3 random safe clicks. Each sample is checked automatically and screenshotted. This round adds two kinds of state the first round rarely reached:
- **Checks.** The foundation and understanding checks of six subjects, including Integrated Science's two-part check.
- **Walks into lessons.** For nine courses, the sampler:
  - opens a random lesson and answers its first question;
  - opens up to four steps;
  - moves every lab slider and menu to a random allowed value.

| Seed | Samples | Walks into lessons | Check pages | Links checked | Broken links | Script errors |
| --- | --- | --- | --- | --- | --- | --- |
| 1126 | 48 | 5 | 5 | 94 | 0 | 0 |
| 2026 | 48 | 4 | 5 | 105 | 0 | 0 |
| 777 | 48 | 5 | 5 | 94 | 0 | 0 |
| 31337 | 48 | 3 | 13 | 98 | 0 | 0 |
| 424242 | 48 | 5 | 8 | 96 | 0 | 0 |

**What the automated checks found.** Across 240 samples, there was no page overflow, cut-off text, small target, broken image or low-contrast text. They flagged seven overlaps and two plain-looking controls:
- **Six overlaps came from the checker, not the site.** Five were controls behind an open modal dialog. One was a link scrolled out of view inside the homepage's sticky side panel. The checker now skips controls behind a modal dialog and controls clipped out of view by a scrolling box. Rerun on seed 2026 with the fixed checker, it reports no flags.
- **The two plain controls were real.** They are the Algebra I project's "Connect the graph" and "Challenge the claim" tabs. The first button census never reached that step.

**Independent read.** Two reviewers who had not built the pages each looked at about half of 111 screenshots:
- all 46 walks and check pages;
- every third of the other samples.

They reported problems a learner or parent would notice. Each point fixed below was first confirmed with a new screenshot or by reading the code.

## What was fixed

| Problem | Where | Fix |
| --- | --- | --- |
| After "Save my answer", a missing or unreadable number was reported only at the top of the page, far above the button | Every foundation and understanding check | The message also appears beside the button, and the field it names is marked and focused. Typing clears it. |
| The tangent line crossed the curve, the area bars rose above it, and the label was cut off ("change + accumula") | Calculus home illustration | Redrawn from the curve's equation: the line touches the curve at the dot and stays below it, the bars sit under the curve, and the label fits |
| The summary paragraph sat between the cross-disciplinary cards, splitting them into two groups | Homepage in Paper, Atlas and Studio | The cards are numbered 0 to 22, but the paragraph had position 20, so the last two projects fell after it. It now follows every card. |
| "More activities & scope": text against the right border, 10–11 px | Every homepage card | Padding inside the outline, 12 px text |
| Plain-text tabs | Algebra I project, "Explore" step | Outlined like the other tabs; the current one keeps its underline |
| The paragraph under "Explain your thinking" was larger than the question, up to 10 lines on a phone | Every lesson question and check | Shortened to three sentences in small, muted type |
| Physics questions asked the reviewer to judge "the mathematics" | Physics 1 and 2 lessons and checks | "the physics" |
| Lesson buttons at 11 px with 2 px gaps on phones | Every course page built on the shared course engine | 13 px with 6 px gaps |
| Disabled "← Back" buttons looked ready to press | Number Theory, Probability, Discrete Mathematics and other pages | Disabled buttons are faded in every appearance |
| "Start learning ↗" and "Field projects ↗" looked disabled | The tab row of every check page | Dark text, like the other buttons |
| A multiple-choice question showed the rules for typed numbers (rounding, units, e notation) | Checks | The rules appear only when the question has a number field |
| "Divide and merge" was crossed by the arrow from Insertion sort | Algorithms route map | The label sits left of its arrow |
| "n +" / "1" | Number Theory and Discrete Mathematics header badges | Kept on one line |
| "For / A / =" squeezed into narrow columns, and "e₂ = (0, 1)" hidden under a step badge | Matrix Explorer at 320 px | The formula wraps between its parts; e₂ is labelled left of the axis |
| "Try shorter diagnostic problems" broke across lines with a clipped border | Projects page on phones | The link stays one box |
| "5 Responses saved" above entries all marked "Draft response" | Session panels of Number Theory, Probability, Discrete Mathematics and the cross-disciplinary projects | "Responses written" |
| "19 subjects" shown above a filter showing one | Intuition Lab view on the homepage | The count follows the filter |
| "Predict your choice and the other club's choice" above a single choice | Game Theory, shared printer project | The choice is yours; the other club's goes in the explanation |
| "The foundation check follows your selected site language" | Game Theory course page | Removed: the site is English only |
| The footer described the site as "Mathematics, statistics, and introductory physics" | Homepage | "Mathematics, science and computer science" |
| Wording and empty states | Checks and Algebra I | <ul><li>"1 questions" and "1 parts" are singular.</li><li>"Saved checks (0)" says there are none yet.</li><li>"Earlier checks have been kept" and "available below" appear only when there are earlier checks.</li><li>"Predictions: 0 of 0 matched" reads "none made yet".</li></ul> |

## What was left, and why

- **Small text in charts on phones.** The coordinate planes, number lines and some diagrams in the Algebra I, Pre-Algebra, Number Theory and Linear Algebra labs are drawn to scale. At 320–390 px their labels shrink to 5–9 px. The first spot-check left this too: each chart needs its own phone layout.
- **Flowcharts and route maps scroll sideways on phones.** A line says so, but the step a learner needs can start off screen. Redrawing them for narrow screens is a separate piece of work.
- **The knowledge map.** In Classic at 1920 px:
  - some edges run through node labels;
  - stray "↗" and "·" marks sit between its tabs;
  - the route numbering is out of order (10, 6, 7 …).
- **Layout points of lower severity:**
  - uneven card heights at some widths;
  - three different left edges for the banner, navigation and content on course pages;
  - empty space beside long lists;
  - the Classic homepage at 768 px puts the subject picker and request form above the page heading;
  - outlined labels that are not buttons ("MATRIX EXPLORER");
  - the red "Copy my learning request" button in the Classic palette.
- **Content points to check with the course authors:**
  - The Algebra I slope inputs show a "+" prefix and positive placeholders, which may nudge learners toward positive slopes.
  - The Probability project's formula box shows the project's main question during step 1.
  - Hyphens are used for minus signs in the Pre-Algebra signed-number readouts.
  - One check problem joins two lessons in a long paragraph.

## Gaps

- **Coverage.** 240 samples, 22 of them walks into lessons, cover a small share of the site's page, appearance, width and click combinations. States behind deleting, exporting or recording were not visited, nor were finished checks with reports.
- **Two readers.** The visual read is two reviewers' judgement of 111 screenshots. They agreed on the most important points, such as the boilerplate size, the small lesson buttons and the tabs that looked disabled. What counts as polish is partly taste.
- **The checker's limits.** The automated checks are heuristics. This round removed two kinds of false flag; others may remain, and some real problems need a person to see them. For example, the wrong tangent line passed every automated check.
- **No learners.** Nothing here shows whether learners find the site easier or harder to use.
