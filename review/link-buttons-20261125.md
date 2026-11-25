# Every clickable control looks like a button · 2026-11-25

The repository owner asked that every clickable link on the site be marked as a button, in any style. An earlier change ([CURRENT_STATUS](../CURRENT_STATUS.md), "Link-styled controls → appearance buttons") covered standalone links only: links inside sentences and footers, tabs, steppers, lesson lists and map places were exempt. This change removes those exemptions.

## How the plain controls were found

A census script visited:
- all 38 pages;
- the homepage's four views;
- every lesson of every course;
- all 19 Intuition Lab activities;
- the four cross-disciplinary projects, three game-theory projects and 16 algorithms.

That is 158 page states, each checked in the four appearances at 1440 px and 390 px. Every visible link, button, show-more toggle (`summary`) and tab was tested with the site's existing rule. A control passes if it has a border on at least three sides, or a fill, and no underline.

**Before the change, at 1440 px.** About 5,000 controls were visible in each appearance, and 1,829 to 1,876 of them looked like plain text or underlined links.

| Kind | Where | How many (Classic) |
| --- | --- | --- |
| Lesson, project and activity lists, and map places | the lesson list of every course, the project lists of Discrete Math, Number Theory and Probability, the activity list of Pre-Algebra, and the Classic knowledge map | 1,015 |
| Diagram nodes drawn in SVG | algorithm flowcharts | 256 |
| Links inside sentences | mostly "Save or delete records" in the banner on every page | 193 |
| The logo | every page | 158 |
| Tabs and steppers | the homepage views, Intuition Lab steps, the Math Voice Lab steps, the Linear Algebra module tabs, the check view controls | 98 |
| Show-more toggles and breadcrumbs | "See the full proof", "How to think about it", the Intuition Lab breadcrumbs and others | 85 |
| Footer links | the Math Voice Lab, the homepage, Coordinate Geometry | 19 |
| Number-line points | Pre-Algebra | 5 |

## What changed

All styles are in `assets/appearance-layout.css`. They use each appearance's corner shape, and borders take the control's own text color, so they stay visible on light and dark headers.

| Kind | Look |
| --- | --- |
| Links inside sentences, notes, breadcrumbs and footers | An outlined chip with a light tint that stays in the line of text and keeps the link's color. It wraps cleanly across lines. |
| Show-more toggles | A compact outlined button with its arrow |
| Tabs and steppers | Each choice is outlined; the current one keeps its fill |
| Lesson, project and activity lists, and map places | Each item is outlined; the current one keeps its own style |
| Number-line points | A soft fill, because an outline would be cut by the line |
| Coordinate Geometry's "← All projects" | The standard link button |

**Exempt.** Two kinds stay exempt:
- **The logo.** It links home on every page, as on most sites, and an outline would change the brand mark.
- **Controls drawn in a diagram.** A flowchart box or a map circle is already the shape of the button.

The owner asked for "all", so the logo exemption is a judgement. It can be revisited.

**One unrelated fix.** In Classic, the homepage subject picker split "Quantitative Reasoning" and "Discrete Mathematics" mid-word ("Quantitativ / e"). These two now take a full row, as Integrated Science already did.

## How it is checked

- `scripts/link-button-audit.cjs` is now strict: only the logo and drawn diagram shapes are exempt.
- `npm run test:themes:browser` already ran the audit on all 38 pages at 320 px and 1440 px in the four appearances: 308 checks. It now also checks 9 page states in each appearance, 36 checks in all:
  - an Intuition Lab activity, a cross-disciplinary project, an algorithm and a game-theory project;
  - the homepage map and Intuition Lab views;
  - lessons with photo credits, with the gambling notice, and with proofs.
- The full census of 158 states passes in the four appearances at both widths.

## Why outlines, and what the evidence leaves open

**Flat links cost attention.** In an eye-tracking study, Nielsen Norman Group found that flat interface elements with weak signs of being clickable drew less attention and took people longer to find than elements with strong signs (Moran, 2017). The study tested web pages for adults, not learning sites for teenagers. It supports giving clickable things a clear sign, not any particular style.

**Links without underlines.** WCAG 2.1 (success criterion 1.4.1) does not allow color alone to mark a link inside text. The chips are marked by a border and a tint, not only by color, so removing the underline keeps that requirement.

**Gaps**
- **The reverse is not checked.** Some things that are not clickable also have outlines, such as the "Teaching demo" label, the "Pre-Algebra · 5–10 min" tag and the formula tag "T(x, y) = (2x, y)". A learner could take them for buttons. The audit finds clickable things that look plain; it does not find plain things that look clickable.
- **Inline chips are small targets.** WCAG 2.2's minimum target size (2.5.8) exempts links inside sentences. The chips are no larger than the text, so they are harder to tap than real buttons.
- **The census sees what it visits.** States reached only after answering questions, such as finished checks and reports with saved work, were not visited. They are built from the same parts, but no test covers them.
- **No learners were asked.** Whether the outlines make the site easier to use was not tested with people.

## Sources

- Moran, K. (2017). *Flat UI elements attract less attention and cause uncertainty*. Nielsen Norman Group.
- W3C (2018). *Web Content Accessibility Guidelines (WCAG) 2.1*, success criterion 1.4.1, Use of Color.
- W3C (2023). *Web Content Accessibility Guidelines (WCAG) 2.2*, success criterion 2.5.8, Target Size (Minimum).
