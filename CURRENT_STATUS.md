## 2026-11-25 · Random spot-check of the whole site

- **Method.** `scripts/spot-check-browser.cjs` draws seeded random samples: a page state, an appearance and a width from 320 to 1920 px, then 0–3 random clicks. It runs automated checks and saves screenshots.
  - Five rounds took 256 samples and made about 480 internal link checks. No link was broken and no script error occurred.
  - An independent reviewer read the 64 screenshots of round 2.
- **Fixed.**
  - **Linear Algebra.** Matrices use square brackets; single bars mean a determinant. The third worked product no longer breaks or loses its bracket.
  - **Algorithms.**
    - The builder menus fit the card on phones.
    - The flowchart and route map say they scroll when they are wider than the screen.
    - The workbench stacks below 1100 px, so flowchart text is not shrunk to about 9 px.
    - Diagram labels are drawn above lines and boxes.
    - Index numbers keep clear of the row above.
    - Steps do not break inside expressions.
  - **Colors.** Inline links and check-page subject chips use the appearance's colors, not browser-default blue, and so do native radio buttons and checkboxes.
  - **Chips.** A chip wraps whole instead of splitting.
  - **Contrast.** Footer grey and Atlas eyebrows reach 4.5:1.
  - **Target sizes.** Breadcrumbs, the Studio records note and chips in small notes are at least 24 px tall.
  - **Dialogs.** The Math Voice Lab dialog's "×" is an outlined round button.
  - **Atlas homepage.** The subtitle no longer runs into the picture.
- **Left.** The note lists what was not changed and why. That includes:
  - the inactive "My report" tab, which WCAG exempts;
  - small chart text on phones, which needs a layout for each chart.
- **Tests.** The themes suite now opens dialogs and checks their controls. All 23 browser suites and `npm test` pass.

See [the spot-check note](review/spot-check-20261125.md).

## 2026-11-25 · Every clickable control looks like a button

- **Request.** The owner asked that every clickable link be marked as a button, in any style. The earlier change covered standalone links only; links inside sentences and footers, tabs, steppers, lesson lists and map places were exempt.
- **Census.** A script visited 38 pages and 158 page states: every lesson, Intuition Lab activity, project and algorithm. It ran in the four appearances. Before the change, 1,829 to 1,876 of about 5,000 visible controls per appearance looked plain at 1440 px.
- **Styles** (`assets/appearance-layout.css`), each in its appearance's corner shape:
  - links inside sentences, notes, breadcrumbs and footers become outlined chips that stay in the line;
  - show-more toggles become compact outlined buttons;
  - tabs and steppers are outlined, and the current one keeps its fill;
  - lesson, project and activity lists and map places are outlined;
  - number-line points get a soft fill.
- **Exempt.** The logo, and controls drawn as shapes in diagrams. The logo exemption is a judgement and can be revisited.
- **Also fixed.** In Classic, the homepage subject picker no longer splits "Quantitative Reasoning" and "Discrete Mathematics" mid-word.
- **Tests.**
  - `scripts/link-button-audit.cjs` is strict.
  - The themes suite checks all pages at two widths in four appearances: 308 checks. It also checks 11 page states in each appearance, dialogs open included: 44 checks.
  - The full census of 158 states passes at both widths.
- **Gaps.**
  - Some labels that are not clickable are also outlined.
  - Inline chips are small targets.
  - States reached only after answering questions were not visited.
  - No learners have tried the change.

See [the button note](review/link-buttons-20261125.md).

## 2026-11-17 · Quantitative Reasoning: gambling-harm notes and its place on the maps

- **Gambling-harm notes** in the course's key places:
  - **Course page.** An "About gambling" box follows the introduction, with a button to the helpline's online chat. It says:
    - gambling for money has a negative expected value;
    - near misses and the illusion of control make it hard to stop, and knowing the odds is not enough to protect anyone;
    - gambling is illegal for minors in most places;
    - the US National Problem Gambling Helpline is 1-800-MY-RESET (1-800-697-3738).
  - **Lessons 9 and 10.** Each carries a paragraph of its own. Against the odds, the best choice is not to play. The Kelly share is for a known edge in your favor, so for casino games, sports betting and lotteries the right stake is zero.
  - **Quick rounds.** One line before a round: stakes are points, never money.
  - The helpline number was checked on the NCPG website on 2026-11-17; the older 1-800-GAMBLER is no longer listed there.
- **Maps.** The course is shown as a branch of applied mathematics.
  - **Knowledge map, University Maths.** The layer "Computing and Probability" is now "Applied Mathematics". It holds a new "Quantitative reasoning" node bound to the course.
  - **Learning map, Further Mathematics.** A new course card follows Statistics and links to the branch card, renamed "Applied mathematics". The group counts 8 course entrances.
- **Tests.** They check:
  - the notice text and the helpline number;
  - that only lessons 9 and 10 have a notice;
  - the layer label, the node, its binding and its links.
- **Limits.** The note records these:
  - static notices and mathematics teaching change knowledge more than behaviour;
  - only the US helpline is given;
  - the published understanding problem `qr-c04` cannot be edited in place, so it has no notice.
- **Quick-round templates.** More will come later, so the memorization gap stays open for now.

See [the gambling and map note](review/quantitative-gambling-map-20261117.md).

## 2026-11-17 · Quantitative Reasoning, part 4: checks and an Intuition Lab activity

- **Foundation check.** 15 questions with 30 parts on what the course assumes: percents and ratios, powers and roots, rounding and estimating, chance and counting, and averages and odds.
- **Understanding check.** 4 problems with 16 parts that apply the course's shortcuts to new numbers:
  - Fermi bounds and the rule of 72;
  - the square-root law and "at least one";
  - indicators, symmetry and Bayes in counts;
  - ruin, the Kelly share, waiting times and Penney's game.

  The bank becomes `quidence-challenges-14`; version 13 stays frozen, so earlier reports still open.
- **Intuition Lab activity: "HH or HT: which comes sooner?"** The learner moves n and sees the exact chance that each pattern has appeared by flip n. HT takes 4 flips on average and HH takes 6, yet a race between them is even.
- **Saved work.** A foundation record saved with the seventeen earlier subjects is a published layout, with a test.
- **Homepage.** The card links to the checks, and its "not yet available" note is gone. The homepage line now counts 84 diagnostic problems and eighteen foundation tracks.
- **Checks.**
  - The 30 foundation parts are recomputed in the tests.
  - The 16 understanding parts are recomputed in exact fractions by `scripts/audit-challenges.py`, with linear solves for waiting times and races.
  - The activity is checked against every sequence of up to 14 flips.
- **Independent read.** It found no wrong key. Its main point: 6 understanding parts reused the lessons' own numbers, so they tested recall. All six now use new numbers, and its other fixes are recorded in the note.

See [the checks note](review/quantitative-checks-20261117.md).

## 2026-11-17 · Quantitative Reasoning, part 3: decisions under uncertainty

- **Four lessons complete the course**, now twelve lessons. Everything is in points, never money.
  9. **Expected value and ruin.** The chance of reaching 20 points before 0, betting 1 point a round or boldly, at 40–60% a round. When the odds are against you, the lesson says the best choice is not to play.
  10. **How much to stake.** Long-run growth for every share staked, and the Kelly share. After 100 rounds it shows the typical and average results and the chance of ending below the start. It also covers why half the Kelly share is common, and that the Kelly share is 0 for casino games and lotteries.
  11. **Waiting for patterns.** Why HH takes 6 flips on average and HT takes 4, races between patterns, and Penney's game.
  12. **Quoting a price.** Buying and selling prices when some traders know more, the break-even spread, and why a trade is information.
- **Quick rounds.** Six new templates. Rounds saved before Part 3 are still rebuilt exactly.
- **Saved progress.** Course records from Part 1 or Part 2 gain the new lessons and keep every answer.
- **Homepage.** The card now says all three parts are open, and keeps the height of its row.
- **Checks.** The models are checked by:
  - a direct linear solve;
  - convolution, one round at a time;
  - a numerical search for the Kelly share;
  - Conway's rule for every race;
  - direct integration for quoting.
- **Independent review.** It found no errors, and 5 items to fix and 6 minor items, all fixed. The most important was safety: lesson 9 now says that when the odds are against you, every plan loses points on average and not playing is best.

See [the Part 3 note](review/quantitative-part3-20261117.md).

## 2026-11-17 · Integrated Science 6–10: new card illustrations

- **Why.** The old cards put a cell, a mountain, a cloud over the peak, rain on the slope, an unexplained arrow and an unlabeled curve side by side. The pieces overlapped and did not read as one idea.
- **Classic.** Two labeled diagrams, in the style of the Physics cards:
  - a rain shadow, with wind pushing air up the windward slope, the cloud and rain on that side, and the slopes labeled "wet" and "dry";
  - a heating curve for water, with flat stretches at 0 °C and 100 °C. Its description says it is not to scale.
- **Paper Explorer, Learning Atlas and Geometric Studio.** One scene in each appearance's own style:
  - wind, a cloud raining on the windward slope, a snow-capped mountain, a tree on the wet side, and the sun over the dry side;
  - nothing overlaps the mountain, and the shapes fill the card like the neighboring Physics art.

## 2026-11-17 · Quantitative Reasoning, part 2: probability shortcuts

- **Four new lessons.** Each has an exact model.
  5. **Indicators and expectation.** Name matching and the number of different dice faces. Each exact distribution is shown beside the indicator sum.
  6. **Symmetry.** Positions in a shuffle, the average position (N + 1) ÷ (K + 1) of the first special card, and the edge of the player who draws first.
  7. **First-step analysis.** Waiting for a success, taking turns with 2–6 players, and collecting every outcome in stages.
  8. **Bayes in counts.** A natural-frequency tree for 100,000 people, a second test, and the odds form.
- **Quick rounds.** Seven new question templates. A round saved before Part 2 is still rebuilt exactly.
- **Saved progress.** A course record saved with Part 1 alone gains the new lessons and keeps every answer.
- **Homepage.** The card now says Parts 1 and 2 of 3 are open, with eight lessons, and keeps the height of its row.
- **Checks.** The models are checked against enumeration of every arrangement or roll, long sums and a backward recursion.
- **Independent review.** It found 1 error, 6 items to fix and 8 minor items. All are fixed except one minor item, a tolerance kept for the reason given in the note. The error was a step asking for a 99% detection rate when the control moved in steps of 5. A test now checks that every setting a lesson asks for can be set.

See [the Part 2 note](review/quantitative-part2-20261117.md).

## 2026-11-17 · Quantitative Reasoning, part 1: fast estimates and quick rounds

- **New course.** *Quantitative Reasoning* is in the Further Mathematics group, after Probability. It is for high school to early university. Part 1 of 3 is open: four lessons on fast estimates.
  1. **Fermi estimates.** Why a product of rough factors is usually closer than its parts. A seeded simulation of 4,000 estimates shows how the factors' errors partly cancel. Its note says when they do not: when two factors share an error.
  2. **Mental approximations.** Doubling times against the rule of 72 and 69.3 ÷ rate; 2¹⁰ ≈ 10³; why percent changes multiply.
  3. **The square-root law.** Exact binomial probabilities for 10 to 10,000 fair tosses, beside 68–95–99.7.
  4. **Quick bounds.** The complement rule, the union bound n × p, 1 − e^(−np), and the rule of three.
- **Quick rounds.** Five short questions mixed across the lessons:
  - The learner answers, says how sure they are, and only then sees the check.
  - Number questions show the rule for counting as right before the learner answers. They offer confidence ratings from 10%; the two-option question starts at 50%.
  - Each round reports accuracy, average confidence and a Brier score. A table shows the last eight rounds.
  - Calibration is judged only on the last 20 answers across rounds: five answers are too few.
  - A timer is optional and only counts up.
  - Rounds are saved in the browser under their own key, and sync like other records. A saved record that cannot be read is kept as it is, and nothing is saved over it.
- **Shown everywhere.** The course appears in all four appearances, the knowledge map (beside Probability), records, SEO data and the static release.
- **Not yet available.** The homepage card lists the foundation check, the understanding check and the Intuition Lab activity as not yet available. Parts 2 and 3 and those checks follow in three more pull requests.
- **Checks.**
  - Unit tests recompute every lesson model independently: an exact binomial sum, enumeration for the bounds, and the simulation's spread.
  - Over 400 seeds, they check every quick-round answer against a value recomputed from the question's own wording.
  - The tests also check that each lesson's own shortcut is accepted wherever the bank asks for it, such as the rule of 72 and 1 − e^(−np), and that common wrong methods are not.
  - A browser suite plays a full round in two appearances, at desktop and phone widths, and reloads it. It also checks the announcements and where focus moves.
- **Independent review.** It found 2 errors, 10 items to fix and 6 minor items, all now fixed. The 2 errors were an activity asking for 300 tries when the control stops at 50, and a tolerance that marked the lesson's own approximation wrong. The note lists every item and the gaps that remain.

See [the plan](review/quantitative-plan-20261117.md) and [the Part 1 note](review/quantitative-part1-20261117.md).

## 2026-11-16 · Integrated Science 6–10: public-domain photographs and NOAA's measured carbon dioxide

- **Images.** Three U.S. Government works, each credit checked on its own source page:
  - an island fox (NPS / Jessica Weinberg McClosky), lesson 8;
  - four Moon phases (NASA Goddard renderings from Lunar Reconnaissance Orbiter data, not photographs), lesson 10;
  - an American pika (NPS / Devin Stucki), lesson 18.
- **How they are shown.**
  - The images are self-hosted as WebP in `assets/photos/`.
  - Each is shown with a caption, credit, licence and source link.
  - `THIRD_PARTY_NOTICES.md` lists them with "No claim to original U.S. Government works".
- **Not added.** Lesson 11 has no photograph: no acceptable image of a dark rock pocket mouse was found. The rejected candidates are recorded.
- **Lesson 14.**
  - The Mauna Loa view draws NOAA's measured monthly means for 2016–2025.
  - They exposed an error: the model's trend used 2020's annual mean as its value at the start of 2020, 1.3 ppm too high. It now uses the least-squares value, 412.9 ppm.
  - The model is within 0.68 ppm root mean square of the measurements.
- **Checks.** Tests check:
  - the image files, their declared sizes and the credit shown on the page;
  - the fit, the seasonal cycle and the agreement with the data.

See [the note](review/integrated-science-photos-20261116.md).

## 2026-11-16 · Learning Atlas: every course card the same size

- **Columns.** Every group uses the same columns as School Mathematics: four on wide screens, three from 1,001 to 1,280 px, two on phones. Science spans the full width, so its three courses share one row.
- **Size.** All cards have the same width and height, with buttons along the bottom.
- **Checks.** The atlas browser suite checks this at four widths.

## 2026-11-16 · Integrated Science 6–10, part 6: checks and an Intuition Lab activity

- **Foundation check.** 15 questions with 30 parts, on the grade 5 science and grade 5–6 mathematics the course assumes:
  - metric units;
  - rates, means and powers of ten;
  - tables, graphs and fair tests;
  - matter and energy, including where a plant's mass comes from;
  - food chains, Earth's water and the Sun in the sky.
- **Understanding check.** 4 problems with 16 parts in bank `quidence-challenges-13`, built on the course's own models:
  - a heating curve;
  - moles in burning methane;
  - Punnett squares;
  - a feedback series and the pH scale.
- **Intuition Lab.** "Steady heat. Steady warming?": steady heating stalls at 0 °C while ice melts and at 100 °C while water boils.
- **Site.**
  - The card, the course navigation and the check menus link to the checks, and the course page shows the activity.
  - The homepage summary now counts three science courses, 80 diagnostic problems and seventeen foundation tracks. Integrated Science had been missing from the science count.
  - Card heights match in DejaVu Sans and Inter.
- **Checks.**
  - Tests recompute all 30 foundation parts from their conditions.
  - `audit-challenges.py` recomputes the 16 understanding parts with exact fractions.
  - The activity's plateaus are checked second by second.
  - An independent read found no wrong key. It led to these changes:
    - a USGS-consistent fresh-water item;
    - a physically plausible cooling table;
    - new values for `is-c01`, which the activity had given away;
    - a limit question for the feedback total;
    - a note that boiling takes far longer than melting;
    - accurate dependencies;
    - a percent field that accepts "50%".
- **Not yet done.**
  - No learner data.
  - The cited misconception studies are older and local.
  - The checks do not assess planning or carrying out investigations.

See [the note](review/integrated-science-checks-20261116.md).

## 2026-11-16 · Integrated Science 6–10, part 5: grade 10, Chemistry in the Earth System

Six lessons, one for each instructional segment of *Chemistry in the Earth System* (framework chapter 7). All 24 planned lessons are now open.
- **Lessons.**
  19. Combustion: moles, mass conservation and bond energies for methane, octane and ethanol.
  20. Heat flow: mixing in an insulated cup, specific heat, and the ocean as Earth's heat store.
  21. Ions and charge: valence electrons, ion charges and formulas, with minerals.
  22. Reaction rates: concentration, temperature and activation energy.
  23. Climate feedbacks: water vapor, ice and clouds turning about 1.2 °C into about 3 °C, with NSIDC albedo and sea-ice data.
  24. Ocean acidification: seawater carbonate chemistry, pH and carbonate ions, with sodium carbonate added as an oyster hatchery does.
- **Drawings.** Each lesson's hands-on investigation has a drawing to scale.
- **Alignment.** PEs checked against the chapter 7 segment boxes; HS-PS3-2 was dropped.
- **Site.**
  - The course is version 5; records saved with 4, 8, 12 or 18 lessons upgrade with every answer kept.
  - The card, map and SEO lines are updated.
  - The card text stays four lines in both DejaVu Sans and Inter, so every card in its row is the same height.
- **Checks.**
  - A unit test recomputes every model, including the alkalinity balance of the seawater model and the numbers written on the drawings.
  - An independent review found two errors, both fixed. The seawater note had the effect of temperature backwards: cold water loses more pH, not less. And the lesson treated a 0.1 fall in pH, the figure for about 2000, as today's; at 420 ppm the fall is nearer 0.14.
  - It also led to these changes:
    - a tea light instead of an alcohol burner;
    - 50 °C instead of 60 °C water;
    - an octet misconception corrected;
    - ethanol's carbon dioxide explained;
    - a sodium carbonate control, so HS-PS1-6 can be practised;
    - sea-ice and albedo data for HS-ESS2-2;
    - safety notes for each activity.
- **Not yet done.**
  - HS-PS3-1 is covered in part.
  - The feedback model gives only the eventual warming.
  - The investigations show example readings.
  - No students or teachers have tried the lessons.

See [the review note](review/integrated-science-unit5-20261116.md).

## 2026-11-15 · Integrated Science 6–10: drawings for the classroom investigations

Ten of the eighteen lessons end with a hands-on investigation; each now has an SVG drawing of the setup, shown with "A useful next step" in the lesson's feedback.
- **To scale.**
  - Each drawing uses typical real sizes, with a scale bar or axes in real units.
  - The heating curve and the Moon's place in the sky (34° N, one hour after sunset) are computed.
  - Only the air particles and the Moon's disc are enlarged, and the drawings say so.
  - Drawing to scale showed that a sealed zip-top bag swells and reads lighter from the air's buoyancy. Lesson 6 now uses a capped soda bottle and says why.
- **Drawn here, not copied.** The drawings are in `assets/science-investigations.js`. Outside pictures were not used, for three reasons:
  - the site's Content Security Policy allows only its own images;
  - the repository's IP process keeps graphics in code;
  - many free pictures are not licensed for commercial use.
- **Rules for any future photographs.** The review note records the rules for public-domain federal works and each Creative Commons license, with sources. It also lists candidate photographs, none of them downloaded or checked yet.
- **Checks.** A unit test confirms which lessons have drawings, that each has a title and description, that none uses outside resources, and that every label fits even in a wide typeface. Screenshots were checked in three appearances and at phone width.

See [the note](review/integrated-science-illustrations-20261115.md).

## 2026-11-15 · Integrated Science 6–10, part 4: grade 9, Living Earth

Six lessons, one for each instructional segment of *Living Earth* (framework chapter 7).
- **Lessons.**
  13. Energy in food chains: why top predators are few.
  14. The breathing planet: the yearly cycle and long-term rise of carbon dioxide at three stations.
  15. Common ancestry: a molecular clock with DNA, fossils and anatomy.
  16. Inheritance: Punnett squares for pea flower color, with samples of 4 to 1,000 offspring.
  17. Homeostasis: core temperature with negative feedback.
  18. Moving uphill: a species' band of elevations on a warming mountain, with the Yosemite resurvey.
- **Alignment.** PEs checked against the chapter 7 segment boxes; four planned PEs the lessons do not teach were dropped.
- **Site.**
  - The course is version 4; records saved with 4, 8 or 12 lessons upgrade with every answer kept.
  - The card, map and SEO lines are updated.
- **Checks.**
  - A unit test recomputes every model and the values the steps and questions use.
  - An independent review found four errors, all fixed: the no-feedback temperature, a slider step too coarse for its test, a 32% outcome called "likely", and a mutation claim.
  - It also led to these changes:
    - a typical fixed sample of offspring;
    - a slower body model;
    - no future years on the carbon dioxide graph;
    - fuller coverage of LS2-4, LS2-1, LS1-2 and LS3-3.
- **Not yet done.**
  - LS1-5 is text only.
  - LS4-5 leaves out speciation.
  - The feedback model is linear.
  - No students or teachers have tried the lessons.

See [the review note](review/integrated-science-unit4-20261115.md).

## 2026-11-15 · Integrated Science 6–10, part 3: grade 8

Four grade 8 lessons, one for each instructional segment of California's integrated grade 8.
- **Lessons.**
  9. Speed and crashes: kinetic energy, reaction and braking distances and braking force, with a kinetic energy graph and Newton's third law.
  10. Moon phases: the Sun, Earth and Moon from above, the phase seen from Earth, rising times, gravity and eclipses.
  11. Natural selection: rock pocket mice on dark lava or pale rock over 200 generations, and the Mc1r mutation.
  12. Listening with waves: frequency, wavelength, amplitude and energy of sound in air, seawater and steel, with digital samples.
- **Site.**
  - The course is version 3; records saved with four or eight lessons upgrade with every answer kept.
  - The card, map and SEO lines name the grade 8 topics.
- **Checks.**
  - A unit test recomputes each new model and checks both upgrades.
  - An independent review confirmed the answer keys and the Moon drawing, and led to these changes:
    - a kinetic energy graph;
    - qualitative force and mass in place of acceleration = force ÷ mass;
    - the cause of tides corrected;
    - an honest selection readout, with a 0% start;
    - digital samples and a definition of analog;
    - corrected whale and hydrophone facts.
- **Not yet done.**
  - No design or argument task for PS2-1 and PS2-4.
  - Sound only, for PS4-2.
  - A one-trait selection model.
  - No students or teachers have tried the lessons.

See [the review note](review/integrated-science-unit3-20261115.md).

## 2026-11-15 · Integrated Science 6–10, part 2: grade 7

Four grade 7 lessons, one for each instructional segment of California's integrated grade 7.
- **Lessons.**
  5. Particles in motion: the state, particle arrangement and typical speed of five substances from −250 °C to 150 °C, with a ball-and-stick drawing of each molecule.
  6. Atoms in living things: where a tree's mass comes from, counting atoms through photosynthesis, respiration and burning methane.
  7. Moving plates: seafloor magnetic stripes and ages give the spreading rate; plate processes place California's gold, geothermal heat and oil.
  8. Recovering a population: island foxes at carrying capacity, the arrival of golden eagles, and recovery plans compared against criteria.
- **Alignment.** PEs checked by hand against the grade 7 segment boxes. MS-LS2-1, planned for lesson 8, belongs to segment 3, so lesson 8 builds toward LS2-4 and LS2-5.
- **Site.**
  - The course is version 2. A record saved with only the grade 6 lessons opens with the grade 7 lessons added and every answer kept.
  - The menu shows two unit labels; lesson counts above seven are written in words; this course's summary heading reads "Connect the model to the world".
  - The card, map and SEO lines name the new topics.
- **Checks.**
  - A unit test recomputes each new model and the values each step and question uses, and checks the saved-record upgrade.
  - An independent review found no errors and confirmed all twelve answer keys. It led to these changes:
    - one arrow scale in the particle drawing for every state;
    - lesson 6 rests on atom counts, with masses labeled as beyond grade 7;
    - "respiration is photosynthesis backward" rewritten;
    - a fossil question for MS-ESS2-3;
    - the San Andreas step no longer uses the spreading lab;
    - real fox counts, biodiversity and constraints added to lesson 8.
- **Not yet done.**
  - Several parts go beyond grade 7 assessment boundaries, and each is labeled.
  - Extended structures are described but not modeled.
  - The fox model's rates are made up and it has no chance events.
  - No students or teachers have tried the lessons.

See [the review note](review/integrated-science-unit2-20261115.md).

## 2026-11-15 · New course: Integrated Science 6–10 (part 1: grade 6)

A new course, *Integrated Science 6–10* (`courses/integrated-science/`), aligned with California's science framework.
- **Plan.** It follows grades 6–8 of the 2016 *California Science Framework*'s Preferred Integrated Course Model, then *Living Earth* and *Chemistry in the Earth System*. It is one course, with one lesson per instructional segment: 24 lessons in five pull requests. See [the plan](review/integrated-science-plan-20261115.md).
- **This pull request: grade 6, four lessons.**
  1. Why are cells so small: surface area for each unit of volume of a cube and a flat cell, then tissues, organs and systems.
  2. Heating ice: a heating curve with the energy of each stage, and how the water cycle carries energy aloft.
  3. Rain shadows: air crossing the Sierra Nevada cools, forms cloud and rains out, and arrives warmer and drier.
  4. Global warming: the energy balance, about 3 °C and 3.9 W/m² for each doubling of carbon dioxide, and how natural causes were ruled out.
- **Alignment.** Each lesson page names its segment and the PEs it "builds toward". The PEs were checked by hand against the segment boxes in chapter 5. Three that the lessons do not teach (MS-PS3-3, MS-LS1-4, MS-ESS3-3) were dropped.
- **Site.**
  - The lesson menu groups lessons by unit.
  - A new card in Middle School and Science, before Physics 1, with art in all four appearances.
  - A third course start on the map's Physics node.
  - Records, sync, SEO (23 sitemap pages) and the static release.
  - The subject rail, now about 1,090 px tall, scrolls with the page at 1920 × 1080 and stays pinned at 1200 px and taller.
- **Checks.**
  - A new unit test recomputes every model and answer key and the settings each step asks for, and runs the course with save, reload and export.
  - An independent review found three errors, all fixed:
    - a rain-shadow step that contradicted the lab at its default settings;
    - a sentence implying most of today's carbon dioxide came from fuel;
    - an ice-warming stage too short to see on the slider.
  - It also led to these changes:
    - the rain-shadow note now says the model overstates the far-side warming;
    - the figures were updated to 2025 carbon dioxide (426 ppm) and 2015–2024 warming (about 1.2 °C);
    - the cell-shape comparison now uses cells of about the same volume.
- **Not yet done.**
  - Lesson 2 goes past grade 6 assessment boundaries on purpose, and lesson 4 teaches more mechanism than the framework expects in grade 6.
  - Models cannot replace investigations.
  - No students or teachers have tried the lessons.

See [the review note](review/integrated-science-unit1-20261115.md).

## 2026-11-10 · Cross-disciplinary project 4: Li Ye's round city

The Cross-disciplinary Projects section has a fourth project, "One round city, ten right triangles" (`cross-disciplinary/?project=cross-p04`).
- **Source.** It is built on the first ten problems of Li Ye's *Ceyuan haijing* (1248). Two people walk along two roads at right angles until each can just see the other past a round city wall. Each problem starts from a different place (a corner, a gate or the centre), and every answer is a city 240 bu across.
- **Steps.**
  1. The circle inside the triangle: pieces of height r from the centre give d = 2ab/(a + b + c).
  2. Centres on a side (problems 2–5): two pieces, or one, remain.
  3. Circles outside the triangle (problems 6–8): one piece is taken away.
  4. Half outside (problems 9–10), checked with the distance from a point to a line.
  5. Why the answers agree: nine of the ten lines of sight lie on one line, problem 1's hypotenuse, so those triangles are multiples of (8, 15, 17), the Nine Chapters' circle triangle; with 2ab = 240 for (8, 15, 17), the city forces each multiple to equal its rule's divisor. Problem 5 uses a second line, through the centre.
  6. Four diameters without dividing: (a + b + c)(a + b − c) = 2ab.
- **Courses.** Geometry, Algebra I, Coordinate Geometry and Number Theory. Chinese terms appear in pinyin only.
- **Labs.** Six labs start on a 5-12-13 triangle:
  - steps 1–3 join the centre to the corners, with outside pieces taken away;
  - step 4 slides a centre along an axis;
  - step 5 draws every problem's walks on one map of the city, and scales (8, 15, 17) around a circle 240 across;
  - step 6 takes the square on c out of the square on a + b.
- **Homepage.** A fourth card, with art in all four appearances: the city with problems 1, 7 and 8 drawn to scale. The catalogue line counts four cross-disciplinary projects.
- **Checks.**
  - The unit test recomputes each diameter from the story alone, by solving for the radius at which the line of sight touches the wall.
  - Problems 1 and 8 also admit a second circle (diameters 1600 and 36). The story alone does not exclude it; Li Ye's diagram does.
  - 300 random triangles check the ten circles' contacts and signed pieces.
  - The browser test walks every step and lab. It found a coordinate-lab tolerance error, which is fixed.
  - A second independent review found that nine lines of sight coincide (so step 5's "Li Ye chose" was wrong), and that the prompt and card announced the answer 240, which gave away nine fields. It also found that problem 5's line of sight is not a tangent, and that the Dongyuan sentence over-stated the preface. All are fixed.
- **Not yet done.**
  - The area method is a modern route; the text gives the rules without derivations.
  - Who or what "Dongyuan" was is uncertain.
  - No students or historians have reviewed the project.

See [the review note](review/cross-disciplinary-li-ye-20261110.md).

## 2026-11-10 · Calculus: kinds of integrals (lesson 5), and limits as numbers (lesson 1)

Calculus grows from four lessons to five. Lesson 5, "One symbol, four questions.", shows that the integral sign asks a different question depending on what is written at its ends.
- **The four kinds.**
  - ∫ₐᵇ f(x) dx is a number: the signed area from a to b (lesson 3).
  - ∫ₐˣ f(t) dt is a function of x: the accumulation function (lesson 4).
  - ∫ f(x) dx is a family of antiderivatives, F(x) + C.
  - ∫ₐ^∞ f(x) dx is defined by a limit: if ∫ₐᵇ f(x) dx has a limit as b grows without bound, the improper integral is that number; otherwise it diverges.
- **Symbol card.** The four symbols sit side by side, each with a small picture. The first two open lessons 3 and 4; the other two switch this lesson's graphs.
- **Learner-controlled graphs.**
  - *The constant C.* Dragging C slides x² + C up or down. The slope at x = 1 stays 2, and the graph of f(x) = 2x below does not move, so the derivative cannot recover C.
  - *Improper integrals.* Dragging b from 1 to 1,000 on a log scale shades the region and plots the area against b, with the other function's area in grey. For 1/x² the area 1 − 1/b stays below 1 and its limit is 1. For 1/x each tenfold step in b adds ln 10 ≈ 2.3 to ln b, so the area has no ceiling.
- **Prediction first.** Before the lesson: is the area of the endless region under y = 1/x² to the right of x = 1 finite? Two new questions follow: whether x² and x² + 5 are both antiderivatives of 2x, and which of ∫₁^∞ 1/x³ dx and ∫₁^∞ 1/x dx is finite.
- **Saved work.** A record saved with the four-lesson course opens with lesson 5 added in memory. Its answers, records and events are unchanged, and a `content_upgraded` event is added. A record that had reached the summary moves to lesson 5's prediction.
- **Lesson 1: a limit is a number, not a motion.** Lesson 1 said only that the moving point gets closer without landing, and lesson 3 that more rectangles illustrate convergence. Nothing said that the limit itself is one exact number, and lesson 5's slider repeats the moving picture. Lesson 1 now says it, with no new steps or questions:
  - Step 1: x never equals the target, but the limit is one fixed number, and outputs may equal it (f(x) = 5).
  - A new example, x·sin(1/x), is undefined at 0 and equals its limit 0 infinitely often near 0.
  - An optional error band narrows from ±1 to ±0.001 around the limit, and the page draws the window of x that keeps every output inside. At the jump no window works. Step 4 states this test in words as the idea behind ε–δ.
  - A new example, 0.9, 0.99, 0.999, …, uses the same test for 0.999… = 1: after n nines the gap is 10⁻ⁿ, and no positive gap survives every band. The algebraic tricks (times 3, 10x − x) are not used, because they already treat 0.999… as a number.
  - Lessons 3 and 5 each link back in one sentence: the integral is the limit itself, not the last approximation.
  - A second independent review found that the hole's window must exclude x = 1 itself, that "inside" must mean strictly inside, and that the 0.999… sentence mixed up a gap with a band. Step 1 also still opened with a motion definition, and step 4 had grown to 148 words. All are fixed.
- **Independent review.** A separate reviewer recomputed every number and found problems that are now fixed:
  - lesson 4's "continue" and the summary heading still assumed four lessons;
  - the feedback page printed `^∞` literally in three places;
  - some wording treated "a limit" as a fourth kind of answer, or suggested that a limit is never reached;
  - steps 3 and 4 used (−1/x)′ and (ln x)′ without stating them;
  - three graph descriptions did not match their drawings.
- **Not included.** Multivariable integrals (∬, ∭, ∮) are left for a later course.
- **Checks.**
  - The maths test compares 1 − 1/b and ln b with midpoint-rule integration, and checks the area 1/2 − 1/(2b²) behind the second question.
  - The flow test clicks the symbol cards, switches curves and moves the sliders through the real handlers. It also checks that finishing lesson 4 leads to lesson 5.
  - The session test opens a four-lesson record and finds every answer unchanged.
  - `npm test` and all 19 browser suites pass.
- **Not yet done.** The lesson was written for Quidence and read by an independent reviewer. No students have tried it. Research on limits (Williams, 1991) suggests that a dynamic picture of b moving towards ∞ may strengthen the belief that a limit is never reached; the review note discusses this. See [the review note](review/calculus-kinds-of-integrals-20261110.md).

## 2026-11-10 · Algorithms part 4: checks and an Intuition Lab activity

The Algorithms course now has the same three companions as the mathematics courses.
- **Foundation check: 15 questions, 30 parts.** It covers what the course assumes from middle school on:
  - ordering numbers and reading positions counted from 0;
  - division with remainders;
  - counting and sums;
  - powers of 2 and binary;
  - following assignments and loops exactly.
- **Understanding check: 4 problems, 16 parts.** Each follows the course's own pseudocode:
  - the numbers binary search looks at, round by round;
  - merging and insertion-sort comparisons, and the calls of a recursion;
  - a shortest route against the nearest-town walk and the cheapest network;
  - greedy change against the fewest coins, and the 1,048,576 subsets of 20 numbers.
- **Intuition Lab: "Ten times the data. Ten times the work?"** It asks how many rounds binary search can need when a sorted list grows from 100 to 1,000 names.
  - The slider runs from 10 names to a million.
  - One bar per round shows that each miss keeps at most half of the names.
  - The readouts set the most rounds, ⌊log₂ n⌋ + 1, beside checking the names one by one.
  - The transfer asks for 4,095 names (12).
- **Computer Science interface.**
  - The Intuition Lab and the homepage's Intuition Lab view have a Computer Science filter and group in all four appearances.
  - The course page has "Check foundations" and "Test your understanding" buttons and the activity's banner.
  - The homepage card lists both checks.
  - The catalogue line, which still said five algorithms, now counts 76 problems, 16 algorithms and sixteen foundation tracks.
- **Saved work.**
  - The bank becomes `quidence-challenges-12`, and version 11 stays frozen.
  - Fifteen-subject foundation records saved before Algorithms are a published layout, and a test opens one unchanged.
  - Saved reports name the subject.
- **Checks.**
  - A test recomputes every foundation part by running the steps it describes.
  - `scripts/audit-challenges.py` recomputes the 16 understanding parts. It runs the searches and sorts with counters, calls the recursion, and lists every simple route, every set of four roads, every coin combination and every subset.
  - The activity's model is checked against binary searches run for every target in sorted lists of up to 100,000 names.
- **Not yet done.** The items are composed for Quidence and their answers are recomputed by code. No students have tried them and no one outside the project has reviewed them.

See [the review note](review/algorithms-checks-20261110.md).

## 2026-11-10 · Quidence is English only

The repository owner limited Quidence to English, including future subjects. [AGENTS.md](AGENTS.md) records the policy.

- **Removed.**
  - The Spanish catalogues (`assets/i18n-es.js`, `assets/i18n-es/`), the whole `localization/` folder and the 22 Spanish illustrations (`*-es.svg`).
  - Every language menu, the language row in the appearance menu and the "English and Spanish" labels on course pages.
  - The second-language copy in the course, project, Intuition Lab, map, Game Theory project and Calculus check sources.
  - `?lang=` on links, hreflang alternates and the Spanish sitemap entries. The sitemap lists each of the 22 pages once.
  - The scripts that produced Spanish (`build-locales`, `extract-localization`, `number-theory-locales`) and `test:spanish:review`.
- **Kept on purpose.**
  - A `?lang=es` address or a Spanish site language saved by an earlier version opens the page in English. The saved preference stays in the browser, unchanged.
  - Answers, drafts and records saved while Spanish was offered are not rewritten. The course validators still accept their earlier language fields, so they open and export as before. Course pages ask for responses in English.
  - The foundation grader still reads the Spanish unit spellings (for example litros, horas) that earlier answers may contain, so earlier work is graded the same way. They are never shown.
  - Dates and numbers use an English format, whatever the browser's language.
- **Checks.**
  - `tests/english-only.test.cjs` scans every published file for language menus, Spanish catalogues, `?lang=es` and Spanish punctuation.
  - `npm run test:english:browser` replaces `test:localization:browser`. The browser is set to Mexican Spanish, every address carries `?lang=es` and a Spanish preference is saved. It opens every released page at four widths, follows every same-site link from the homepage (119 routes), checks each page is English with no language control, no Spanish and no failed load, and checks that original answers reach reports exactly as written.
  - A one-off audit, also with the browser set to Mexican Spanish, followed every same-site link from the homepage in all four appearances (119 routes each, 476 page loads). On every route in Classic, and on the homepage in the other three, it then clicked each control that does not delete, download, record or send data (1,435 clicks) and read the page again. It found no Spanish, no page error and no failed load.
  - A static scan of every released text file found Spanish only in the grader's unit spellings described above.
  - Before-and-after screenshots of all 36 pages, at two widths in two appearances, show no layout change apart from the removed menus. Two places needed a fix: an empty column in the Classic homepage header and a lost margin on the Calculus check page.
  - The other browser suites and unit tests lost their Spanish steps; their English checks are unchanged.

See [the review note](review/english-only-20261110.md).
## 2026-11-10 · A second tab no longer blocks saving

On the Number Theory, Probability, Discrete Mathematics and cross-disciplinary course pages, opening the same course in a second tab and then closing or leaving it without any edits made the first tab report "Saved work changed in another tab" and stop saving. The bug predates the English-only change.

- **Cause.**
  - Each tab rebuilds the saved record in project order, and closing or hiding a tab saved it even with no edits. The rewritten record had the same content with its keys in a different order.
  - The first tab compared the saved text, not its content, so it treated the reorder as another tab's change.
- **Fix, the same in all four courses.**
  - A conflict is now a change in content: both records are compared with their keys sorted.
  - Closing or hiding a tab saves only when it has unsaved edits, so an untouched tab never rewrites the record.
  - A real edit made in another tab still blocks the first tab, which then does not overwrite it.
- **Checks.** `npm run test:two-tabs:browser`, now run in CI, checks each course for four things:
  - a second tab that is opened, hidden and closed leaves the record byte for byte unchanged;
  - the same content written in another key order is not a conflict;
  - a real edit from another tab is detected and kept;
  - closing the blocked tab loses nothing.

  The check fails on the previous code at the first case.

## 2026-11-09 · Algorithms part 3: algorithms 12 to 16

The Algorithms course opens its university row, in English and Spanish, and the route is complete:
- 12 Quicksort, with the waiting ranges on an explicit stack
- 13 Dynamic programming: the fewest coins
- 14 Dijkstra’s shortest paths and 15 Kruskal’s spanning trees, on one six-town map whose road lengths learners choose
- 16 P versus NP, through subset sum and masks counted in binary

Each has the same three synchronized views, code listings, predictions, an idea card and three challenges as parts 1 and 2.

- **Why #14 does not use the mud maze.** In the maze a step costs what the entered cell costs, so the first distance a cell receives is already final and the update step never lowers one. On the road map the default lengths lower four distances.
- **Challenges.** For example:
  - a shuffled list that quicksort sorts with fewer comparisons than the same numbers sorted;
  - breaking the coin table on purpose, predicting the outcome first;
  - road lengths where always taking the nearest town is not the shortest route;
  - a triangle of roads 2, 2 and 3 where the cheapest network lengthens a trip;
  - {6, 5, 5} and target 10, where largest first misses the answer.
- **Improvements.** Each one is tested on 300 generated inputs: pivot choice, stopping Dijkstra’s method at the goal, stopping Kruskal’s method after n − 1 roads, and pruning the subset search.
- **Homepage.** The card, the page header and both knowledge maps say algorithms 1 to 16 are open. On the Classic map, Dynamic programming and Complexity lead to the course.
- **Checks.**
  - Traces are compared with independent references: Floyd–Warshall distances, every set of five roads, and reachable subset sums.
  - The Python listings are run, and the Java listings compiled and run.
  - Cost numbers are tested, such as 499,500 comparisons, 3,963 table comparisons and 142,511 ways to pay 1,000.
  - The browser test steps through all sixteen algorithms.

See [the review note](review/algorithms-university-20261109.md).

## 2026-11-09 · Algorithms part 2: algorithms 6 to 11

The Algorithms course opens its high-school row, in English and Spanish:
- 6 Binary search
- 7 Merge sort, taught bottom-up
- 8 Recursion: the Tower of Hanoi, with a call stack
- 9 Breadth-first search and 10 Depth-first search, on a 5 × 7 maze that learners can edit
- 11 Greedy change

Each has the same three synchronized views, code listings, predictions, an idea card and three challenges as part 1.

- **Challenges.** For example:
  - an unsorted list that defeats binary search;
  - a sorted list on which insertion sort beats merge sort;
  - breaking the Tower of Hanoi on purpose, predicting the outcome first;
  - mud cells that make the BFS path not the cheapest;
  - a maze where DFS takes a long way round;
  - coins 1, 3 and 4 for 6, where greedy change is not the fewest.
- **Improvements.** Each one is tested on 300 generated inputs.
- **Suggestions** after the BFS and greedy counterexamples point to #14 and #13 in the university part. The map marks those as planned and also offers an open algorithm.
- **Homepage.** The card, the page header and both knowledge maps say algorithms 1 to 11 are open. On the Classic map, Recursion and Graph algorithms lead to the course.
- **Checks.**
  - Traces are compared with reference results.
  - The Python listings are run, and the Java listings compiled and run.
  - Cost numbers are tested, such as 9,217 comparisons for 1,024 items and 2ⁿ − 1 moves.
  - The browser test steps through all eleven algorithms.

See [the review note](review/algorithms-high-school-20261109.md).

## 2026-11-09 · New course: Algorithms (part 1, algorithms 1 to 5)

The homepage has a new group, Computer Science, and its first course, Algorithms (`courses/algorithms/`), in English and Spanish. The course is one numbered route of 16 algorithms from middle school to university. This part opens the middle-school algorithms: 1 Find the maximum, 2 Linear search, 3 Bubble sort, 4 Insertion sort and 5 Euclid's algorithm.

- **Three synchronized views.** A flowchart, numbered steps and the data (pointers, the key set aside, a growing trace table) follow the same event. Python, Java and MATLAB listings highlight the matching lines, and a guide teaches the code line by line. Code is shown, not run.
- **Predictions.** On by default before each comparison. A section can skip them, and a single step can still be predicted on request. Predictions are counted, not scored.
- **Four observable behaviours, no ability score.** Each algorithm has an idea card, kept exactly as written and not scored, and three cards drawn from: find a counterexample (with a follow-up on why), find the bottleneck in the flowchart, propose an improvement and test it on hundreds of inputs, and predict the cost.
- **Suggested next algorithm.** Fixed, readable rules in `core.js` name the next number and list the evidence used. Every open algorithm stays reachable from the route map.
- **Records.** Saved under `quidence:algorithms:v1` with the same conflict, unreadable-record and export handling as the other project courses.
- **Checks.** Traces are compared with independent reference results, and each prediction's key with what the trace does next. The Python listings run under python3, and the Java listings are compiled and run. MATLAB is checked by pattern only.

- **Homepage.** Computer Science is a section in Classic and a category in the other three appearances. Each appearance draws the Algorithms card in its own style. Both knowledge maps gain a Computer Science chapter, and both are now titled "Knowledge Map". The card lists the foundation check, understanding check and Intuition Lab activity as not available yet.

Current inventory: 17 subject cards (6 School Mathematics, 8 Further Mathematics, 2 Science, 1 Computer Science) and 3 cross-disciplinary projects.

See [the review note](review/algorithms-middle-school-20261109.md).

## 2026-11-01 · Stacked fractions on screen

Fractions written with a slash are drawn stacked on every published page, in English and Spanish:
- numbers such as 2/3;
- expressions such as n/2, σ/√n, (n + 1)/(n + 2) and C(n, n/2) / 2ⁿ.

It is display-only. Content, translations, answer checking, learner answers, records and exports keep the slash. The page text keeps it too, so copying, search and screen readers get the slash form. Units (m/s, km/h, J/(kg·K)), words, labels, dates, counters, form fields, charts and learner text are not drawn. Translation passes restore the original text before translating and draw again afterwards. The parser was checked against all 25,495 catalog strings. See [the review note](review/stacked-fractions-20261101.md).

## 2026-11-01 · Probability part 4: Statistics lesson on sampling distributions

Statistics has a fifth lesson, "How much does a sample mean vary?", in English and Spanish. It finishes the Probability course plan.

- **The lesson.** A right-skewed spinner (μ = 2.2, σ = 1.4) shows that E(x̄) = μ, that the standard error is σ/√n, and that the distribution of x̄ approaches a normal curve while the data keep their skew. The chart shows the exact distribution of the mean for n = 1 to 16, with an optional normal curve.
- **Saved sessions.** A session saved with the four earlier lessons opens unchanged, with an empty place for lesson 5 and a `lessons_added` event. A finished session resumes at lesson 5, and the page says that a lesson was added.
- **Pointers to Probability.** The Benford "uses" line, the Discrete Mathematics hats project and the Game Theory shared-printer step 08 now point to the Probability course.
- **Checks.** The test computes the exact distribution with BigInt for every n, and builds a finished record with the earlier version's engine to check the upgrade.

See [the review note](review/statistics-sampling-20261101.md).

## 2026-11-01 · Probability part 3: Intuition Lab activity

Intuition Lab has a sixteenth activity, "More tosses. More often exactly half?", in English and Spanish. The Probability card now has every activity, and its "not available yet" note is gone.

- **The question.** Is exactly half heads more likely with 100 tosses than with 10? No: two more tosses multiply that probability by (n + 1)/(n + 2), so it falls from 0.246 to about 0.08.
- **What does settle.** The proportion of heads: P(0.4 ≤ heads/n ≤ 0.6) rises from about 0.656 to about 0.965, while the expected gap |heads − n/2| grows from about 1.23 to about 3.98.
- **Checks.** The test computes every readout exactly with BigInt and checks the ratio identity. It lists all 64 sequences of 6 tosses for the transfer answer (20) and checks each number the explanation states.

Current inventory: 16 subject cards, each with a foundation check, an understanding check and an Intuition Lab activity. See [the review note](review/probability-intuition-20261101.md).

## 2026-11-01 · Fixes from an outside deep audit

A deep audit recomputed the published questions independently. It found no wrong answer key, proof or translation of meaning. It did confirm grading, input and wording problems. All of these are now fixed, each with a test that fails on the previous code:

- **Units:** a matching unit from the field label is accepted in all 244 unit-labelled number fields, including Spanish unit words and $ written in front. Before, 47 fields refused units such as cm², L, km and kW.
- **Linear Algebra:** the learning engine, the lesson checkpoint and the Matrix Explorer prediction now require exact answers.
- **Matrix Explorer:** entries follow the declared steps of 0.5, so rank is exact and a tiny invertible matrix is no longer called singular.
- **Coordinate Geometry:** the project checks distances to two decimal places, and checks "equal distances" and "on the road" exactly.
- **MathVoice:** a number matches only when it rounds correctly to two places.
- **Saved reports:** they draw each question's given table, matrix and graph from the snapshot.
- **Wording and translation:**
  - Benford's step 1 and step 6 no longer speak of chance about a fixed list;
  - the Intuition Lab chord condition says "inside the circle";
  - two Number Theory sentences are now exact;
  - the Linear Algebra follow-up count reads 4;
  - one Algebra II option is now translated.

Foundation question bl-f10 needs a versioned foundation bank before its wording can change, so it is left for a later change. See [the review note](review/deep-audit-fixes-20261101.md).

## 2026-11-01 · Probability part 2: foundation and understanding checks

Probability now has a 15-question foundation check (30 parts) and a four-problem understanding check (16 parts), in English and Spanish. The course page, homepage card and check menus link to both.

- **Foundation check.** It covers fractions, decimals and percents, counting outcomes, powers of fractions, averages, inequalities, and reading "at least one", "and" and "or".
- **Understanding check.** It tests complements, Bayes' rule, linearity of expectation, waiting times, and the binomial distribution against Chebyshev's bound, each in a new setting.
- **Independent recomputation.** A separate test recomputes every foundation answer by listing outcomes, and `scripts/audit-challenges.py` recomputes every understanding answer the same way.
- **Saved records.** Records saved with the fourteen earlier foundation subjects still open. The understanding-check bank becomes `quidence-challenges-11`.

See [the review note](review/probability-checks-20261101.md).

Current inventory: 72 diagnostic problems, and foundation checks in fifteen tracks.

## 2026-11-01 · New course: Probability (part 1, ten proof projects)

Probability is now its own Further Mathematics course (`courses/probability/`), instead of the last lesson of Statistics. Ten projects of four steps each run from de Méré's dice, the problem of points and a positive screening test, through Bertrand's boxes and Monty Hall, shared birthdays, fixed points of a shuffle, waiting for a six and collecting stickers, to the Galton board and the law of large numbers. They are in English and Spanish.

- Numeric answers are exact fractions. Where a field says so, correctly rounded decimals are also accepted. Written proofs are saved for review.
- Each project has a seeded simulation lab, which shows counts only after the learner acts.
- A toolkit of four proofs supplies the rules the projects use.
- An independent content review found one blocker (a stated number of decimal places that did not match the grader) and twelve other fixes; all were made. See [the review note](review/probability-projects-20261101.md).
- Foundation and understanding checks, an Intuition Lab activity, and a Statistics lesson on sampling distributions come in later parts.

Current inventory: 16 subject cards (6 School Mathematics, 8 Further Mathematics, 2 Science) and 3 cross-disciplinary projects. Probability has 10 proof projects, 40 steps and 83 answer fields.

## 2026-11-01 · Fixes from an outside site audit

An outside audit listed seven problems, and all seven were confirmed in the source.

- A fraction written with decimals, such as 0.3/0.1, now matches an integer answer in the foundation checks, understanding checks and field projects. The new numeric policy is `written-precision-4`.
- A Linear Algebra vector component must match exactly; before, (3.009, −2.009) counted as (3, −2).
- In the Algebra module, an answer entered after the report showed the reference answer is recorded as `after_reference_answer`. It is no longer counted as independent first-try evidence.
- The on-page foundation report now shows each question's given table, matrix and graph.
- The cross-disciplinary page header now says 3 projects and 18 steps.
- The Basic Logic tool rule now says "exactly when". The project bank becomes `quidence-projects-8`, and records saved under bank 7 keep the original wording.
- The Benford test lab now states its 5% conclusion together with its random-sample premise.

Saved answers are not rewritten. Earlier results stay readable under the rule they were saved with. See [the review note](review/site-audit-20261101.md).

## 2026-11-01 · Two course descriptions corrected (probability)

The basics of probability, events, conditional probability and independence, are taught systematically only in the last Statistics lesson. No course teaches random variables, expected value or probability distributions; the Benford project introduces expected counts and the chi-square test for its own step 6, and the Game Theory and Discrete Mathematics projects use probability directly. The Benford project's `uses` line no longer credits Statistics with expected counts and the chi-square test. The knowledge map's Probability node now says what the Statistics lesson covers and that the Statistics course does not yet teach random variables, expected value or probability distributions. In Spanish, the map's related-course links now show the course name in Spanish, such as «Estadística», instead of the English title. A separate Probability course is planned. See [cross-disciplinary-benford-20261101.md](review/cross-disciplinary-benford-20261101.md).

## 2026-11-01 · Cross-disciplinary projects, part 3: Benford's law

The Cross-disciplinary Projects section has a third project, "Why do so many numbers start with 1?" (`cross-disciplinary/?project=cross-p03`), in English and Spanish. It counts the first digits of the powers of 2, derives Benford's law P(d) = log₁₀(1 + 1/d) from the mantissa on a log scale, proves that log₁₀ 2 is irrational, shows why a change of units keeps the law, and ends with the chi-square test and why a failed test is not proof of fraud. It draws on Statistics, Algebra II, Pre-calculus and Number Theory. See [cross-disciplinary-benford-20261101.md](review/cross-disciplinary-benford-20261101.md).

Current inventory: 15 subject cards (6 School Mathematics, 7 Further Mathematics, 2 Science) and 3 cross-disciplinary projects.

## 2026-11-01 · Logo requests are no longer cancelled by the swap

When `themes.js` switched a logo to its other version while the first image was still loading, Chrome cancelled that request. Visitors saw nothing wrong, but on a busy machine the activity and brand browser tests counted it as a failed request. A request still loading is now handed to a detached image, so it finishes. The themes browser test delays the first version and checks that no request fails. See [logo-load-20261101.md](review/logo-load-20261101.md).

## 2026-11-01 · Number Theory project 11: fractions that force whole numbers

Number Theory has an eleventh project, "Fractions that force whole numbers" (`nt-p11`), in English and Spanish, fourth on the route after Tickets & thresholds. It starts from a word problem: 88 books shared between two classes, with 2/9 of one class's books math books and 13/16 of the other's literature books. The fractions become divisibility conditions, and 9x + 16y = 88 is solved modulo 8. Later steps cover inverses modulo 12, the hundred fowls problem from Zhang Qiujian's Mathematical Manual, the general solution of ax + by = c, and the gcd condition. Each step has an animated lab. See [number-theory-fractions-20261101.md](review/number-theory-fractions-20261101.md).

Current inventory: Number Theory has 11 proof projects, 48 steps and 137 answer fields.

## 2026-11-01 · Logo follow-up for slow devices

On a busy machine, Chrome can paint a page before it runs the first animation frame, so Classic could still show the dark logo briefly. Logos are now hidden by CSS until themes.js settles their version, and they are settled as soon as they are parsed. With the CPU slowed six times, no wrong-color logo shows after paint, in any appearance. See [logo-load-20261101.md](review/logo-load-20261101.md).

## 2026-11-01 · A steady logo while pages load

The records banner, the appearance bar and the language row now go in before a page is painted. Before, they were added after it was painted and pushed it down. The logo's color is chosen before its first paint, so Classic no longer shows the dark logo on its dark headers first. The themes browser test fails if the logo is swapped after paint or, in English, moves after paint. Spanish pages still move once while they are translated. See [logo-load-20261101.md](review/logo-load-20261101.md).

## 2026-10-31 · Readable header text in every appearance

Header text is now readable in every appearance. In Classic, the Math Voice Lab header had white text on a white background. In the illustrated appearances, the header subtitle on Discrete Mathematics, Number Theory and Cross-disciplinary Projects was light gray on a light background. The themes browser test now fails when header or toolbar text has less than 4.5:1 contrast. See [header-contrast-20261031.md](review/header-contrast-20261031.md).

## 2026-10-31 · Standalone links become buttons

Standalone navigation links and actions now look like buttons in every appearance, on every released page. Before, some were underlined or plain text, such as the Cross-disciplinary Projects top bar and the course navigation strip on course pages. Links inside sentences and in page footers stay links. The themes browser test now fails if a standalone link or action looks like plain text. See [link-buttons-20261031.md](review/link-buttons-20261031.md).

## 2026-10-31 · Cross-disciplinary projects, part 2

The Cross-disciplinary Projects section has a second project, "Two puzzles, one sequence" (`cross-disciplinary/?project=cross-p02`), in English and Spanish. It counts the regions made by the chords of a circle and the pieces made by cuts of a four-dimensional ball, and proves that the two always agree. See [cross-disciplinary-chords-20261031.md](review/cross-disciplinary-chords-20261031.md).

Current inventory: 15 subject cards (6 School Mathematics, 7 Further Mathematics, 2 Science) and 2 cross-disciplinary projects.

## 2026-10-31 · Cross-disciplinary projects

The homepage has a Cross-disciplinary Projects section with its first project, "How many pieces can n cuts make?" (`cross-disciplinary/`), in English and Spanish. It has six steps with animated labs, from a stick to a pizza to a ball, and draws on Geometry, Algebra II, Discrete Mathematics and Basic Logic. See [cross-disciplinary-ball-cuts-20261031.md](review/cross-disciplinary-ball-cuts-20261031.md).

Current inventory: 15 subject cards (6 School Mathematics, 7 Further Mathematics, 2 Science) and 1 cross-disciplinary project.

## 2026-10-30 · Basic Logic, part 4

Intuition Lab has a fifteenth activity, "Which cards would you turn over?", the card-selection task for Basic Logic. Every subject card now has a foundation check, an understanding check and an Intuition Lab activity. See [basic-logic-intuition-20261030.md](review/basic-logic-intuition-20261030.md).

Current inventory: 15 subject cards (6 School Mathematics, 7 Further Mathematics, 2 Science). Every card has a foundation check, an understanding check and an Intuition Lab activity; Intuition Lab has 15 activities.

## 2026-10-30 · Basic Logic, part 3

Basic Logic has a 15-question foundation check and a four-problem understanding check, in English and Spanish. The diagnostic bank is now `quidence-challenges-10`, with 68 current problems; foundation records saved with thirteen subjects still open. A shared report sentence, "Recheck: …", now reads correctly and is translated on the Spanish site. The Intuition Lab activity is the only activity the card still lists as not available. See [basic-logic-checks-20261030.md](review/basic-logic-checks-20261030.md).

Current inventory: 15 subject cards. Every card has a foundation check and an understanding check; every card except Basic Logic has an Intuition Lab activity.

## 2026-10-30 · Basic Logic, part 2

Basic Logic has two bilingual field projects: a robotics club's rule (connectives, a conditional and its converse, and a rule with parentheses) and a farmers' market survey (a three-set Venn diagram, all/some claims, and bounds that premises force). The field-project bank is now `quidence-projects-7`; version 6 is frozen and its records still open. See [basic-logic-projects-20261030.md](review/basic-logic-projects-20261030.md).

Current inventory: 15 subject cards. Every card except Basic Logic has a foundation check, an understanding check and an Intuition Lab activity; Basic Logic has its lessons and field projects. The homepage counts 22 field projects.

## 2026-10-30 · Basic Logic, part 1

Basic Logic is a new School Mathematics course at the High School level, with four bilingual lessons: statements and truth tables, conditionals, valid arguments and fallacies, and quantifiers and syllogisms. Its models are truth tables and a three-set Venn diagram. The knowledge map has a new "Logic" node, and the illustrated map has a Basic Logic course node. Lesson work is saved under `basic-logic_beta01_session_v1`. Two field projects, the foundation and understanding checks, and an Intuition Lab activity are planned as later parts; the card lists them as not available yet. See [basic-logic-course-20261030.md](review/basic-logic-course-20261030.md).

Current inventory: 15 subject cards (6 School Mathematics, 7 Further Mathematics, 2 Science). Every card except Basic Logic has a foundation check, an understanding check and an Intuition Lab activity; Intuition Lab has 14 activities. The source inventory has 561 records, all still not-cleared.

## 2026-10-30 · Discrete Mathematics, part 3

Intuition Lab has a fourteenth activity, "It doubles each time. Every time?", the circle-regions problem for Discrete Mathematics. Every subject card now has a foundation check, an understanding check and an Intuition Lab activity. See [discrete-math-intuition-20261030.md](review/discrete-math-intuition-20261030.md).

## 2026-10-30 · Discrete Mathematics, part 2

Discrete Mathematics has a 15-question foundation check and a four-problem understanding check, in English and Spanish. The diagnostic bank is now `quidence-challenges-9`, with 64 current problems. The Intuition Lab activity is the only activity the card still lists as not available. See [discrete-math-checks-20261030.md](review/discrete-math-checks-20261030.md).

Current inventory: 14 subject cards. Every card has a foundation check and an understanding check; every card except Discrete Mathematics has an Intuition Lab activity.

## 2026-10-30 · Discrete Mathematics, part 1

Discrete Mathematics is a new Further Mathematics course with ten bilingual proof projects (40 steps, 90 answer fields). Its labs cover graph coloring, grid paths, pigeonholes, Hanoi, chessboard and tromino coverings, Königsberg, domino strips, derangements and Kruskal's algorithm. The knowledge map and illustrated map open it, and its records are kept under `quidence:discrete-math:v1`. The foundation check, the understanding check and an Intuition Lab activity are planned as later parts; the card lists them as not available yet. See [discrete-math-projects-20261030.md](review/discrete-math-projects-20261030.md).

Current inventory: 14 subject cards (5 School Mathematics, 7 Further Mathematics, 2 Science). Every card except Discrete Mathematics has a foundation check, an understanding check and an Intuition Lab activity. The source inventory has 529 records, all still not-cleared.

## 2026-10-29 · Status update

Changes since the 2026-10-14 entries, with their release notes:

- **Appearances:** Classic card rows follow the Physics 1 layout (#40), Geometric Studio is built from the approved reference (#41), the illustrated themes lose their outer frames (#43), and the desktop subject hub is wider in all four appearances (#44). The homepage interface from before the Intuition Lab view is restored, with a fixed Atlas Geometry pyramid and new Coordinate Geometry card art (#56). Cards note the activities a course does not have yet (#57). See [classic-card-rows-20261014.md](review/classic-card-rows-20261014.md) and [geometric-studio-20261014.md](review/geometric-studio-20261014.md).
- **Game Theory:** bilingual projects and decision cases (#42).
- **Knowledge map and Calculus:** map topics link to learning, Calculus has a dialogue route (#45) and a wider exploration interface (#47).
- **Intuition Lab:** a third homepage view (#48, #49) with one design per appearance (#56). It now has 13 activities, one per subject. See [intuition-lab-integration.md](review/intuition-lab-integration.md).
- **Voice:** voice dialogue activities stay in English without changing other language preferences (#46). The Math Voice Lab covers six subjects (#50–#52, #54), and reviewed English dictation is available in explanation fields (#53). See [AGENTS.md](AGENTS.md), [the Math Voice Lab README](demos/college-voice-lab/README.md) and [reviewed-dictation-20261026.md](review/reviewed-dictation-20261026.md).
- **Coordinate Geometry:** two guided projects (#55), then a foundation check and understanding check (#59, with a card layout fix in #60), four lessons (#61), an Intuition Lab activity (#62) and a homepage projects link (#63). See [coordinate-geometry-integration.md](review/coordinate-geometry-integration.md) and the four 2026-10-29 notes in `review/`.
- **Number Theory:** a four-problem understanding check (#58). See [number-theory-understanding-check-20261029.md](review/number-theory-understanding-check-20261029.md).

Current inventory: 13 subject cards (5 School Mathematics, 6 Further Mathematics, 2 Science). The diagnostic bank has 60 current problems and 236 answer parts; Game Theory's 15-question check is separate. Every card has a foundation check, an understanding check and an Intuition Lab activity; Geometry and Algebra II gained their foundation checks on 2026-10-29. The 目前狀態 section below still reflects the 2026-10-08 review, except for its inventory bullets, which are updated.

## 2026-10-14 · Remembered site-wide appearance

Paper, Atlas and Studio are available on all 24 public pages. The shared head initializer restores the browser preference before styles load; live changes preserve locale, activity inputs and saved records. Portable reports embed the selected style and print on white paper. Validation and scope: [themes-2026-10-14.md](review/themes-2026-10-14.md).

## 2026-10-14 · Corrected external review

Implemented scope, evidence and remaining conditions: [external-review-2026-10-14.md](review/external-review-2026-10-14.md). The source inventory contains 405 records (385 active, 20 historical-only), all still not-cleared.

## 2026-10-13 · 下拉控制項箭頭間距

- 語言按鈕的箭頭距右邊框 12px，右側預留 36px，避免文字與箭頭重疊。
- 全部公開頁面的單選下拉選單共用同一規則，涵蓋 Subject、報告版本/評分、課程實驗與作圖選點；深色語言按鈕用白色箭頭，淺色控制項用深色箭頭。
- 保留原生下拉選擇、鍵盤操作及高對比度模式；更新各頁面的資源指紋。
- 數論頁語言控制項加寬至 144px，為手機上 16px 字級的 Español 保留充足空間。

## 2026-10-12 · 與 Qidolab 統一頁面背景

- 頁面底色使用 Qidolab 的暖奶油色 #F8F5EC；980px 以上螢幕沿用相同的淡綠灰與暖橙放射狀漸層。
- 首頁、課程、基礎檢查、專題與報告頁面使用同一背景規則，閱讀卡片保持白色，列印報告使用白色紙面。

## 2026-10-12 · 已審核配色與 Qidolab 導覽

- 23 個公開頁面採用薄霧紫、白色閱讀卡片和深青綠操作色；報告匯出樣式同步。
- 首頁底部保留 Qidolab 正式組合 Logo 與水壺小遊戲配圖，左側卡片以原生錨點捲動到該區域；支援英／西語和減少動態效果。
- 課程產生器、翻譯來源及快取指紋均已納入，避免重新建置後回退。範圍和驗證見 [本輪整合紀錄](review/mist-teal-qidolab-20261012.md)；原有實體裝置列印和 Safari 複測待辦繼續保留。

## 2026-10-10 · Number Theory 與知識地圖發布

- 新增數論：10 個專題、43 個步驟、120 個答題欄位及完整證明；首頁、學科卡片和知識地圖均可進入。現有十門課與歷史紀錄保持相容。
- 數論題目、完整證明、選項、互動模型與匯出均提供英/西雙語；西語按墨西哥常用拉美用詞複核。證明回答僅儲存待審，不自動判成正確。
- 修復數論的跨分頁儲存衝突保護；加入裝置備份。移除地圖中含義不明的大圓，並保持既定地圖比例。
- 發布範圍與驗證：[數論發布紀錄](review/number-theory-release-20261010.md)。

## 2026-10-09 · Logo / 西語審核修復

- 入門課回饋中的學生解釋加上獨立原文保護；停用逐詞替換，只翻譯已複核的完整文案/格式。未知句子保持完整並記錄待補譯。
- 數值輸入明確使用小數點、不使用千分位。逗號輸入留在草稿，點號可能表示千分位時先展示實際讀取值，要求主動確認；儲存原始輸入和確認紀錄。既有數值精度規則及歷史判定保持原樣。
- Saved reports 深色頁首改用白字 logo；報告去重標題、日期改成明確月份，兩張西語封面修正文字版面。新增 PNG 主螢幕圖示及分享圖；英文啟動不載入西語詞庫。
- 擴大自動檢查到課程步驟、實驗讀數、介紹、紀錄列表、回饋、完整報告與匯出；品牌檢查增加實際背景對比度。範圍及後續 SEO/印刷計畫見 [審核修復紀錄](review/logo-spanish-followup.md)。
- 本次程式碼和 Cloudflare 更新包按完整迴歸結果交付；正式網域部署仍以實際上傳為準。

## 2026-10-09 · 使用者新向量 logo 與雙語發布

- 採用 Stephen 上傳的向量圖，原檔案儲存在 `design/brand/quidence-logo-source.svg`；保留全部前景路徑及字形，去除顯示版藍色背景與外部留白。深色頁首用白字/薄荷綠，淺色頁面和報告用深藍字/深青綠。
- 22 個公開頁面的所有品牌入口、課程產生範本、瀏覽器圖示與離線報告統一使用新標誌；移除舊首頁 PNG 及其濾鏡裁切。品牌資源帶內容指紋，避免舊資源混用。英文和西班牙語共享同一標誌。
- 西班牙語版 PR #21 已合併；補齊專題介紹的兩個片段譯文，評分規則和學生原文不變。
- 檢查：完整 `npm test` 通過；雙語瀏覽器檢查 88 組版面、72 項題目/專題、20 個報告通過；既有瀏覽器快取/草稿檢查 80 組版面、40 份草稿通過。新標誌核對英/西兩種語言、22 頁、四種寬度共 176 組版面及兩份離線報告，均無標誌遮擋、裁切、橫向溢出和資源載入失敗。
- 上傳 Cloudflare 使用本次新 logo + Spanish ZIP；GitHub 合併與正式環境上傳分別完成，網站上傳狀態以實際部署為準。

## 2026-10-09 · English / Spanish version

- 新增 English / Español 切換；首頁、課程、題目、專題、回饋、報告和 SVG 封面支援中性西班牙語。URL 與本機語言偏好可保留選擇。
- 翻譯分科完成後統一複核：7,079 條編號譯文、動態條件與目前版本派生文案；修正第二個方程式右端的譯法，並補全 u<f 光學限制。數字、單位、符號、否定和精度 AND/OR 條件已核對。
- 切換僅更新展示，不重新載入課程、不改答案值、原文、評分規則或歷史紀錄。學生解釋、學習請求和審核筆記保持原文；Markdown/PDF 採用在地化展示副本，JSON 原始證據保留。
- 驗證：383 項題目指紋未變；22 個公開頁面 × 4 寬度；52 診斷題、20 專題和 20 報告；切換前後輸入/存檔一致，頁面錯誤及目前題目英語殘留為 0。既有數學/儲存/安全測試通過；瀏覽器快取迴歸及 CI 結果以該 PR 檢查為準。
- 上傳 Cloudflare 使用新 Spanish ZIP；尚未替使用者部署正式網站。原有使命、教學方向及研究/驗證邊界繼續有效。

# Quidence 目前狀態

更新：2026-10-08。本文是目前狀態入口；帶日期的審核文件保留其當時的測試範圍，不把過去的完成事項誤作待辦。新建議的逐項取捨見 [整體建議整改紀錄](OVERALL_REVIEW_2026-10-07.md)。目前物理分課範圍見 [兩課設計與審核](PHYSICS_TRACKS_DESIGN_2026-10-08.md)，[原 Physics 試點](PHYSICS_COURSE_DESIGN_2026-10-08.md)保留歷史範圍。Claude 複查摘要見 [第二輪迴歸整改](REGRESSION_REVIEW_2026-10-08.md)，隨後收到的完整文件及物理建議見 [完整報告補充核對](FULL_REGRESSION_FOLLOWUP_2026-10-08.md)。物理第三輪回饋與驗收範圍見 [物理 v3 整改](PHYSICS_V3_REVIEW_2026-10-08.md)。最新專題/檢查入口介面改動見 [活動導覽審核](ACTIVITY_NAVIGATION_REVIEW_2026-10-08.md)。

## 已完成

- 十科專題和檢查入口共用分層導覽：白色頁首與正文對齊，學科選擇與 Overview / My report 獨立分組，學習、檢查、專題標明目前活動。舊基礎檢查頁同步外殼；跨活動連結隨所選學科更新並開啟新分頁。原導覽 PR #17 已合併；隨後收到的舊資源混用問題已追加資源指紋及入口版本，真實 Chromium 的四種寬度共 80 組版面、40 組草稿流程和舊快取升級迴歸通過，已加入 CI。追加修復 PR #18 已按使用者批准合併，GitHub Actions 通過；範圍及實際截圖見 [資源版本修復](ACTIVITY_ASSET_FIX_2026-10-08.md)；正式網域、Safari 和實體裝置體驗仍需核對。

- 首頁右上角已補 Science 大寫及線上學習/基礎檢查/報告說明；需求下加入預設關閉的報告參考選項，原文隨對應學科新報告儲存，歷史、JSON、Markdown、完整/摘要 PDF 和圖包讀取儲存的上下文。頁底增加 hello@quidence.com 的郵件回饋入口。PR #19 已合併；行為及檢查見 [首頁需求與回饋審核](HOME_REQUEST_REVIEW_2026-10-08.md)。
- 首頁左上角採用使用者提供的放大鏡 Quidence Logo，保留原 PNG，深色頁首用 CSS 顯示白色字標，點選返回首頁。1440、768、375、320px Chromium 版面及首頁連結檢查通過；這次 Logo 更新在獨立審核分支，正式 Cloudflare 發布仍待上傳。見 [Logo 更新審核](HOME_LOGO_REVIEW_2026-10-08.md)。

- 物理學習頁課數從實際內容讀取；八個原表格活動補上本專案繪製的 SVG，數值讀數統一三位有效數字。修正源電荷固定約束、運動圖等距刻度、導覽間距和專題新分頁行為。手機表格已調整，仍待真實瀏覽器與 Safari 驗收。

- 2026-10-29 更新：11 個數學學科和 2 個物理基礎課；診斷題庫 60 道現行題、236 個答案分量，賽局理論 15 題另計；20 個 field projects，另有數論 10 個、賽局理論 2 個加 1 個決策案例、解析幾何 2 個專題；Intuition Lab 13 個活動。賽局理論已恢復，經濟學不提供活動。
- Science 現拆成 Physics 1 Foundations 與 Physics 2 Foundations。分別有 6/7 個學習單元、24/28 個活動、18/21 個學習題，各有 6 道多分量檢查和 2 道專題。（10-08 時為八個數學學科加兩個物理基礎課，共 52 道診斷、20 個專題；目前數字見上一條。）不宣稱完整進階課、實驗課程或考試準備。
- 兩個物理基礎課分別關聯目前 Physics 1/2 的部分主題；Physics 2 包含熱學、電磁學、光學、波和光子。公開入口暫用中性名稱；AP 相關產品表述需要另行完成商標樣稿程序。原四單元 Physics、舊題和紀錄保留供歷史讀取，不自動遷入新科目。
- 新物理活動從單變數比較推進到反例、約束和模型邊界，均分開呈現預測、比較、解釋。新題採用本專案編寫的虛構情境；獨立複算與自動流程驗證已加入，仍需教師審題、學生試做和實體裝置體驗。分課版本及第三輪整改（PR #16）已按使用者要求合併，網域正式發布另行核對。
- 本機儲存，帳戶及雲端同步暫停；備份、還原預檢查、刪除紀錄、公用裝置提醒。
- 數值按分量檢查；精確數和分數可直接填寫，非整數最終小數須正確捨入，數學題並至少有兩位小數及兩位有效數字；Physics 1/2 新提交接受正確捨入到至少三位有效數字的結果，不要求大數保留兩位小數。很小的非零值不能四捨五入成零。支援有界科學記號及與欄位標籤一致的可選單位，不自動換算其他單位。新提交記錄精度規則版本；舊判定保留，規則導致的新舊差異單列待複核。
- 新題已修正重複題、秩的捷徑、沿用前題答案、約束邊界及最大值格式洩題；保留舊題版本供已有紀錄讀取。
- 學生解釋和開放作答不自動認定理解；簡潔公式、圖和不同合理方法交給意義複核，不按關鍵字、文法、字數或速度扣分。
- 專題不顯示未經校準的 6.5/10；該設計目標保留在內部資料，不改已有作答定義。
- 共用基礎/診斷/專題報告先展示簡短證據摘要，可單獨開啟摘要 PDF；完整報告保留問題、解釋及歷史。完整 PDF 的正文資料已補全；幾何專題 PDF 包含學生實際作圖，Markdown 可連 SVG 一起打包。
- 新報告採用短指紋；重複判斷比較實際儲存內容。共用檢查報告僅改變呈現、摘要或瀏覽事件時不新增版本；真實作答、提交或複核變化仍留版本。舊報告可手動優化簽名，不刪除歷史。紀錄頁展示本機文字佔用估計及備份提醒。已累積的快照仍佔空間，IndexedDB/備份合併尚未完成。
- 診斷三選一題的顯示位置按工作階段穩定重排，並在連續三題組中分散正確位置；學習課選項也按工作階段穩定重排，頁面值使用顯示位置；答案身份與評分不變。是非題內容中 No 的比例仍須審題，不能用換位置代替內容改造。
- 新幾何作圖儲存手輸分數座標原文；舊作圖缺失的原文不猜測恢復。Geometry C 標籤在窄圖中向三角形外偏移。表格實際溢出時增加右邊緣漸層/箭頭；真實手機和瀏覽器仍待實測。
- 完整複查文件補充審核分支：規範千分位輸入、學生摘要總體計數、LA O/U/V 頂點名、首頁不隸屬說明，以及只針對作者文案的句子/美式拼寫修正。共享課程僅瀏覽介紹頁不存空紀錄，開始學習後儲存，舊紀錄和明確確認的還原保留。學生原文與原始題目定義不替換；評估範圍說明保留在報告，答題頁改用學生能讀懂的提示。這批補充改動與已合併 PR #14 分開審核。
- 靜態發布採用檔案清單，排除內部文件、審核資料、測試資料、舊設計頁和帳戶用戶端；附帶靜態回應安全標頭。持續檢查設定隨程式碼提交，雲端執行結果需另行查看。
- 頁尾對比度提高；“Sign in to sync” 遺留文案移除；儲存庫首頁說明目前能力，教師/輔導者優先於外部 AI 提示。
- 首頁 Linear Algebra / Statistics 配圖改為矩陣特徵方向和迴歸殘差。2026-10-07 使用者審核修正版後決定替換原檔案；產生腳本同步更新，矩陣欄距、變換箭頭標註和統計刻度已校正。
- 使用者原始 162 頁 PDF 已取得、可抽取文字並渲染。Q11/P4 來源比對和權利證據仍未完成；清單沒有任何題因此自動獲得版權清除結論。

## 需要使用者審核

| 順序 | 審核內容 | 具體做法 | 通過標準 / 需要回覆 |
| --- | --- | --- | --- |
| P1 | 專題/檢查入口導覽 | 從首頁進入任意數學科目及 Physics 1/2 的兩個入口；桌面及手機查看學科選擇、活動醒目提示、Overview / My report；填寫草稿後切換學科再回來 | 控制項不擠壓、不橫向溢出；跨入口到正確科目並在新分頁開啟；原草稿可繼續 |
| P0 | macOS 輸出 PDF 後卡死 | 在基礎檢查、診斷、專題各開啟完整報告及摘要；在獨立報告頁儲存 PDF，也測試取消列印；關報告頁後回活動，捲動、點按鈕、改答案並重新整理 | 頁面正常回應，原紀錄和新草稿都在；失敗時給瀏覽器名稱/版本、科目、儲存或取消的步驟 |
| P0 | 線上介紹頁承諾 | 確認 `www.quidence.com` 介紹頁的發布儲存庫或託管專案；採用整體整改紀錄中的替換文案，圖註標成範例解法 | 實際網頁與 meta description 均不再把自動逐步檢查說成已實作；該頁面尚未由本次儲存庫合併發布 |
| P0 | 原件來源與 Q11/P4 | 標記原 PDF 的自編頁和外部摘錄；先給出 Q11/P4 開發時參考的頁、教材/試卷/網站出處及許可（如有） | 能對應到具體來源並留下審核結論；僅有原件、換數字或程式碼重寫不能替代這一步 |
| P1 | 數學推理及題目診斷價值 | 優先重做改過的參數系統/秩、複合變換反推、Calculus 最大值、Algebra I 約束專題和 Geometry 輔助線題 | 不憑題幹洩露或前題答案過關；合理的簡潔公式能供意義複核；給出容易猜中或無法區分理解的題 |
| P1 | 備份和報告優化體驗 | 先下載備份，在獨立瀏覽器資料夾還原；點 Optimize saved report copies，比較所有報告版本及原始解釋；再次匯出 | 不丟版本、時間戳、圖或原文；遇到衝突明確停下、不覆蓋另一份紀錄 |
| P1 | 手機/iPad 圖表與作圖 | 375px 左右寬度查看 Statistics 的 B attempts 欄，橫向滑動；實體裝置放點、輸入分數、連線、復原及列印圖 | 表格溢出時右側有提示，滑到底提示消失；觸控不誤操作，圖和標籤清楚；新分數座標原文在重新整理、報告及備份後保留 |
| P1 | 摘要是否有用 | 對比學生摘要與完整報告，核對每條摘要的具體題目和選擇規則 | 沒把解釋未審說成不會；沒有把相符分量說成掌握；學生能據此開始下一次討論 |
| 產品決定 | 第一批使用者 | 選擇“你自己的小範圍學生 / 自學高中生 / 學校教師”，並說明是否用於正式研究 | 用此決定後續試做、回饋模式和教師功能；目前不自動收集學生資料或開啟研究用途 |
| P1 | 兩個 Physics 基礎課的範圍與難度 | 試做 6/7 單元、各 6 道檢查和 2 道專題；按兩課設計表核對熱學、電磁、轉動、流體、光學的假設和英文負擔 | 對應部分基礎，不冒充完整課程；數值核算與 DOM 流程驗證不替代教師專業複核或實體裝置體驗 |
| P1 | Safari / Firefox 升級與容量 | 先匯出舊備份；升級後依次開啟所有舊報告，比較版本數、紀錄頁文字佔用和瀏覽器儲存 | 僅瀏覽報告不增加快照；一次真實複核或新提交產生新版本。紀錄頁估計不是實際瀏覽器剩餘容量 |

商標、Logo 仍由使用者處理。帳戶、AI 語意評分、班級彙總、研究匯出等保持暫緩。

## 下一輪順序

1. 完成 P0 實體裝置和線上文案核對；補 Q11/P4 來源證據。
2. 在專題/檢查入口 Chromium 迴歸的基礎上，繼續補完整作答、報告/摘要、備份還原及手機圖表；更新其他舊瀏覽器腳本的過時六科斷言。
3. 為持久紀錄設計 IndexedDB/可重新產生報告及遷移方案；備份合併先定義工作階段身份、草稿/提交/回饋歷史衝突規則。
4. 在確定首批使用者之後開展小範圍試做，收集範圍、授權、用途由使用者先確認。
5. 線性方程式步驟檢查做有限試點：明確解集合和定義域規則；不把等式變形的正確性當成理解認證。
6. 後續再考慮練習模式、跨科作圖及教師檢視；進一步審題處理是非題內容偏向。

不要以測試通過、來源指紋、原件可讀或本機儲存為依據聲稱全面數學診斷認證、智慧財產權清除或法律免責。

## 2026-10-12 · Restore Game Theory (AC01)

- Restored the original four English lessons, payoff-table explorer, eight fresh checks, and existing record schema from the archive.
- Added Game Theory to Further Mathematics subject choices, College Level cards, and the University Maths map, with links to discrete reasoning, linear algebra, and optimization.
- Re-enabled the existing 15-question foundation check and 6-question further check. The diagnostic and field-project inventories keep their current counts.
- Included the restored public files in the release and SEO policies. Original question definitions and archived snapshots remain unchanged.
- Added the required Cloudflare previews block.
