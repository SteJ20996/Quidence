# Integrated Science 6–10: illustrations for the classroom investigations · 2026-11-15

The repository owner asked for pictures in the experiment parts of the science lessons, and for a decision on whether to use pictures from outside sources or draw them, with commercial use in mind.

## What was added

Ten of the eighteen lessons end with a hands-on investigation for a class ("A useful next step"). Each now has a drawing of the setup and what to look for, shown under the suggestion once the lesson's questions are done:

| Lesson | Investigation | Drawing |
| --- | --- | --- |
| 1 Cells as systems | Onion skin cells under a microscope | Microscope, the field of view with cells, and three steps to estimate cell size |
| 2 Heating ice | Heating crushed ice on a hot plate | Beaker, thermometer and stirrer, the expected flat part at 0 °C, and a safety line |
| 5 Particles in motion | A balloon on a bottle in hot and ice water | Full and limp balloons, with particle arrows long and short |
| 6 Atoms in living things | An antacid tablet in a zip-top bag on a scale | Sealed bag: same mass; open bag: lighter (readings marked as examples) |
| 9 Speed and crashes | A toy car down a ramp into a cup | Ramp at three heights, the cup and a ruler |
| 10 Moon phases | Watching the evening Moon | The southern sky at the same time on five evenings, the Moon fuller and farther east each evening |
| 11 Natural selection | Picking paper dots off dark and light sheets | The dots left on each sheet, and two steps |
| 12 Listening with waves | Copying a recording | Analog copies getting noisier; digital copies holding the same numbers |
| 16 Inheritance | Tossing coins for alleles | Two coins per parent and a tally of 40 tosses |
| 17 Homeostasis | Pulse after exercise | Fingers on the wrist, a stopwatch, and the pulse falling back to rest |

The other eight lessons end with a data, map or reading task rather than an experiment, so they have no drawing.

Each drawing is SVG written in `assets/science-investigations.js`. It has a title and a description for screen readers, and a caption that repeats the description. It contains no image files, links or outside resources, and the unit test checks this. It also checks that every label fits inside the drawing even in a wide typeface, because the four appearances use different fonts; Atlas's wider font cut off a label during development.

## Draw or use outside pictures?

**Decision: draw them here.** Outside photographs are not used for now. The reasons:

1. **The site cannot show linked pictures.** Its Content Security Policy allows images only from the site itself (`img-src 'self' data: blob:`, in `backend/security.cjs`), so a picture linked from another site would not load. Any outside picture would have to be copied into the repository and kept with its credit and license.
2. **The repository's policy.** `IP_REVIEW_2026-10-07.md` records that the build uses no image libraries and that graphics are drawn by the project's code, and that any outside asset must have its terms recorded. The root `LICENSE` keeps educational illustrations outside its ownership claim, pending provenance review. Drawing in code keeps these illustrations inside the existing process: their source is this repository, and their history is in Git.
3. **The pictures are of setups, not of real specimens.** A beaker, a ramp or a coin toss gains little from a photograph. A drawing can also show what to look for (a flat part on a graph, an arrow, a tally), which a photo cannot.
4. **Commercial use.** Quidence may be sold or licensed to schools. Most freely available pictures are not cleared for that:

| Kind of source | Commercial use | What it would require here |
| --- | --- | --- |
| Our own drawings | Yes | Nothing beyond the project's own records |
| US federal works (NASA, NOAA, USGS, most NPS, USFWS) | Generally yes: works of federal employees are not under US copyright | Check each picture's credit line: pictures credited to anyone else, or with ©, are not public domain. NASA forbids implied endorsement and its logos, and recognizable people need permission. USGS and NPS ask for credit. Outside the US, protection can differ. |
| CC0 | Yes | Nothing required; credit is good practice |
| CC BY | Yes | Credit (author, title, source, license) shown with the picture |
| CC BY-SA | Yes | Credit, and any adapted version under the same license |
| CC BY-ND | Yes, unchanged only | Even cropping may count as a change |
| CC BY-NC, BY-NC-SA, BY-NC-ND | **No** | Not usable on a commercial site |
| "All rights reserved", stock photos, journal figures, Google Images | **No** without a written license | — |

Sources for these rules: [NASA images and media guidelines](https://nasa.gov/nasa-brand-center/images-and-media); [NPS photo galleries](https://www.nps.gov/grte/photosmultimedia/photogallery.htm) (pictures credited to NPS without © are public domain; others are not); [Crediting USGS](https://www.usgs.gov/information-policies-and-instructions/crediting-usgs); [Creative Commons license types](https://creativecommons.org/share-your-work/cclicenses/). These are summaries of public guidance, not legal advice; a lawyer should review before a paid or school release, as `IP_REVIEW_2026-10-07.md` already says.

## Where real photographs could help later

Some lessons show real things that a photograph would make vivid. If the owner wants them, each must pass the rules above, picture by picture, and be stored in the repository with a visible credit line and a record of its source and license:

| Lesson | Picture | Likely source and check |
| --- | --- | --- |
| 8 Recovering a population | An island fox | Channel Islands National Park photos; use only those credited to NPS without © |
| 10 Moon phases | The Moon through a month | NASA Scientific Visualization Studio; public domain, no NASA logo |
| 11 Natural selection | Dark and light rock pocket mice | Most published photos belong to researchers or journals; needs CC BY/CC0 or written permission |
| 14 The breathing planet | A real carbon dioxide record | Draw from NOAA GML data, which is public domain, rather than copy the Scripps Keeling Curve image, which is not |
| 18 Moving uphill | An American pika | NPS photos credited to NPS without © |

None of these photographs has been downloaded or checked yet.

## Gaps

- The drawings are schematic, not to scale. They were checked by eye in three appearances and at phone width, but not by a teacher.
- The safety guidance is one line (lesson 2). A school should apply its own lab-safety rules.
