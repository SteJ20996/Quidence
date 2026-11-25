# Integrated Science 6–10 part 6: checks and an Intuition Lab activity · 2026-11-16

This note records the course's foundation check, understanding check and Intuition Lab activity: their design, how their answers were checked, what an independent read changed, and what remains unverified. It completes the plan in [integrated-science-plan-20261115.md](integrated-science-plan-20261115.md).

## What was added

| Item | Size | Where |
| --- | --- | --- |
| Foundation check | 15 questions, 30 parts, five groups | `assets/additional-foundations.js` (`is-f01` to `is-f15`) |
| Understanding check | 4 problems, 16 parts, two groups | `assets/science-challenge-bank.js` (`is-c01` to `is-c04`), bank `quidence-challenges-13` |
| Intuition Lab | 1 activity, "Steady heat. Steady warming?" | `intuition/data.js`, `intuition/math.js`, `intuition/lab.js` (`melt`) |

The homepage card, the course page's navigation and the check menus link to the checks. The course page shows the activity's banner. The homepage line now counts three science courses, 80 diagnostic problems and seventeen foundation tracks. It had not counted Integrated Science among the science courses.

## Design choices

- **The foundation check is what grade 6 assumes.** The course starts in grade 6, so the check covers grade 5 science (CA NGSS 5-PS1, 5-PS3-1, 5-LS1-1, 5-LS2-1, 5-ESS1-2 and 5-ESS2-2) and the grade 5–6 mathematics the lessons use. Its five groups:
  - metric units and weighing by difference;
  - rates, means and powers of ten;
  - tables, graphs and a fair test;
  - matter and energy: mass conserved when dissolving and melting, states of matter, and where a plant's energy and mass come from;
  - food chains, Earth's water and the Sun in the sky.
- **Known misconceptions are tested on purpose.** Two items rest on well-documented ones:
  - `is-f12` asks where a tree's mass comes from: mostly carbon dioxide from the air, not soil;
  - `is-f10` asks whether dissolved salt still has mass.
- **The understanding check uses the course's own models and states every value.** Each problem matches a lesson:
  - `is-c01` is the heating curve (lesson 2);
  - `is-c02` is burning methane with moles (lesson 19);
  - `is-c03` is Punnett squares (lesson 16);
  - `is-c04` is a feedback series and the pH scale (lessons 23–24).

  The heats, molar masses and equation are supplied. A match therefore checks using the model, not recalling constants, and the check says so.
- **The activity tests the commonest heating-curve misconception.** Many students expect steady heating to give a steady rise in temperature. The activity plots 100 g of ice from −10 °C at 150 J/s for 10 minutes: the temperature stays at 0 °C for about 223 seconds while the ice melts, and again at 100 °C while the water boils. Its transfer question asks how long a 50 g cube takes to melt at 100 J/s (167 s).

## How the answers were checked

- `tests/additional-foundations.test.cjs` recomputes all 30 foundation parts from each question's conditions:
  - unit changes, differences, products and rates;
  - the mean and range of the listed heights;
  - the drops in the cooling table, and whether they shrink;
  - the slope through the plotted points;
  - the conserved masses and the fresh-water share.
- `scripts/audit-challenges.py` recomputes the 16 understanding parts with exact fractions and without reading the bank:
  - the heating and melting energies, and a check that the melting time rounds as stated;
  - the methane equation, balanced atom by atom, with the mass in equal to the mass out;
  - every box of each Punnett square, listed;
  - the feedback series summed term by term, compared with first ÷ (1 − f);
  - hydrogen-ion concentrations from whole-number pH.
- `tests/intuition.test.cjs` checks the activity's model against the stated heats:
  - the plateaus at 0 °C and 100 °C, second by second;
  - the ice left while melting;
  - the water warming at half the rate of the ice;
  - the transfer value.

These checks were written in this project, so they show that the items agree with the stated conditions. They are not an independent proof.

## Independent read

A separate review recomputed every key from its prompt alone. It also ran the site's real answer matcher on edge cases. It found no wrong key. Its other findings, all addressed:

| Finding | Change |
| --- | --- |
| `is-f14` said 97% of Earth's water is in the ocean and keyed 30 L of fresh water in 1,000 L. USGS gives oceans 96.5%, other salt water about 1% and fresh water 2.5%, so a student who knew the real figure would write 25 and be marked wrong. | The prompt gives 2.5 of every 100 liters as fresh, and the key is 25 L. |
| The follow-up said lakes and rivers hold about 1% of fresh water; USGS gives about 0.27%. | It now says about 0.3%, which is about 75 mL of the 25 L. |
| The cooling table's drops (16, 12, 8, 4) shrank by equal steps. Continuing that pattern stops the cooling at 40 °C, which contradicts "closer to room temperature". | The room is given as 20 °C and the last reading is 37 °C, so the gap to the room shrinks by a near-constant factor, as Newton's law of cooling predicts. |
| The activity's explanation gave the answers to `is-c01`, which used the same 100 g, −10 °C and 150 J/s. | `is-c01` now uses 200 g at −15 °C and 250 J/s: 6,270 J, 267 s and 16,720 J. |
| "Total warming once the rounds add up" let a student who added rounds by hand get 2.99, which does not match 3. | The problem asks for the total the rounds approach if they continue without end. |
| The graph stops at 600 s, early in boiling. That makes boiling look shorter than melting, when it takes nearly seven times as long. | The explanation says so: boiling all the water takes about 25 minutes. A readout shows the water boiled away. |
| Some parts were linked to earlier ones they do not depend on, so a wrong earlier answer would have flagged them for a recheck. | Only real dependencies remain (moles before the masses in `is-c02`). |
| The percent field could not accept "50%". | Its label gives the unit (%), so "50%" is accepted. |
| Smaller points: "a tonne" for a 10-year-old; temperature as "average motion" (the average velocity of still water is zero); a pan that is not stirred; a "not checked" list that named particles, which grade 5 covers; "how a scale measures a liquid"; hydrogen ions "in the same volume". | All fixed. Temperature is described as the average energy of motion of the particles. |

## Gaps

- **No learner data.** The difficulty labels are design targets, and no student has tried the items.
- **The evidence for the chosen misconceptions comes from older or narrower studies.**
  - The plant-mass misconception is well documented. Driver et al. (1994) review it, and van Helmont's willow experiment is the classic counterexample.
  - The heating-curve misconception, that steady heating means a steady rise, is reported in studies of students' ideas about heat and temperature, such as Erickson and Tiberghien's chapter in Driver et al. (1985).

  These studies describe students in particular countries and decades. They do not show that a one-item check finds the misconception reliably, or that the activity changes it.
- **Exact matching only.** Number answers are matched at the precision the learner writes. Explanations are kept for review, not graded.
- **The check is not a lab practical.** Nothing here checks whether a student can plan or carry out an investigation, which is central to CA NGSS.

## Update · 2026-11-25

Bank 15 adds four understanding problems for grades 7 and 8 (is-c05 to is-c08), so the check now has eight problems. The four problems described here are carried over unchanged, and checks started earlier keep them as they were. See [the round 4 section of the review and fixes note](integrated-science-fixes-20261125.md#round-4-understanding-problems-for-grades-7-and-8-this-change).

## Update · 2026-11-25, later

Bank 16 adds six problems (is-c09 to is-c14) for the 11 lessons that had none, so the check covers all 24 lessons. The check now comes in two parts, each with its own report: grades 6–8 (7 problems) and high school (7 problems). The eight earlier problems are carried over unchanged. See [the review and fixes note](integrated-science-fixes-20261125.md#the-check-in-two-parts-covering-every-lesson-later-change).
