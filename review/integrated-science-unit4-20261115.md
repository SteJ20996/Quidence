# Integrated Science 6–10, Unit 4 (grade 9, Living Earth) · 2026-11-15

This adds the fourth unit of *Integrated Science 6–10*: six lessons, one for each instructional segment of *Living Earth*, the grade 9 course of California's high school Three-Course Model (framework chapter 7). Earlier units are described in the unit 1–3 notes, and the plan is in [integrated-science-plan-20261115.md](integrated-science-plan-20261115.md).

## The six lessons

| # | Lesson | Model | Builds toward |
| --- | --- | --- | --- |
| 13 | Energy in food chains: why are there so few top predators? | Energy passed up 2–5 levels, with 5–20% passed on at each step | HS-LS2-4, LS2-1 |
| 14 | The breathing planet: why does the air's carbon dioxide rise and fall each year? | A yearly cycle on a rising trend at Mauna Loa, Utqiaġvik and the South Pole, for the 1–10 years before 2026 | HS-LS2-5, LS1-5 |
| 15 | Common ancestry: who is related to whom? | Two 1,000-letter DNA sequences changing from a shared ancestor, a molecular clock with saturation | HS-LS4-1 |
| 16 | Inheritance: why can a trait skip a generation? | Punnett squares for pea flower color, with fixed samples of 4–1,000 offspring | HS-LS3-3, LS3-1, LS3-2 |
| 17 | Homeostasis: how does the body hold its temperature? | Core temperature over two hours in 0–45 °C air with no, weak, normal or strong negative feedback | HS-LS1-3, LS1-2 |
| 18 | Moving uphill: where will a species live as the climate warms? | A species' band of elevations moving up a cone-shaped mountain at 6.5 °C per km | HS-LS4-5, LS2-6 |

## Alignment

Each segment's PE box was read from framework chapter 7, up to the start of its narrative, and the unit test checks that every listed PE is in its segment's box. The first plan also listed HS-LS2-2, LS1-7, LS4-2 and ESS3-5; the lessons do not teach them well enough to claim them, so they were dropped. The unit's label in the lesson menu is "Grade 9 · Living Earth".

## Checking

`tests/integrated-science.test.cjs` recomputes the new models independently:
- **Food chain.** energy × share^k over the whole grid; 10 units at the fourth level from 10,000 at 10%; eight times as much with 20%.
- **Carbon dioxide.** With the trend removed, each station's cycle spans exactly its stated swing, and the peak and low fall at the stated times. The trend rises 2.5 ppm a year. The window ends at the start of 2026, with no future years drawn as data.
- **DNA.** Differences are counted directly. They start at zero, track 2 × rate × time while small (1.2% at 6 million years and 1%), and fall behind it when large.
- **Crosses.** Expected shares for all nine crosses; counts add up; large samples come close; PP × PP gives no white.
- **Feedback.** The recurrence for every setting. Without feedback the steady state is the air plus 12 °C, and strong feedback beats normal, which beats weak.
- **Moving uphill.** The shift is warming ÷ 6.5 km, the cone's area formula holds, area shrinks with warming, a taller mountain leaves more, and a band starting above the summit is reported.

## Independent review

A reviewer checked every statement and number against sources (NOAA GML data, NPS, Moritz et al. 2008, Mendel's counts, the Chimpanzee Sequencing Consortium), tried every step's settings, and checked the answer keys and PE claims. Its findings and what changed:

| Finding | Change |
| --- | --- |
| **Error.** Homeostasis step 1 said a body without control settles at the air plus 15 °C; the model uses 12 °C, and it does not settle in two hours. | "Drifts toward the air temperature plus 12 °C." |
| **Error.** Common ancestry step 4 asked for 6 million years, but the slider moved in steps of 5. | The slider moves in steps of 1; 6 million years at 1% gives 1.2%. |
| **Error.** Inheritance question 2 called a 32% outcome "likely". | "Happens about a third of the time." |
| **Error.** Inheritance step 4 implied that a single mutation could make a white offspring of PP × PP parents. | A new p allele would first appear hidden in a purple Pp plant. |
| The Yosemite wording said "the region warmed by about 3 °C"; Moritz et al. measured nighttime minimum temperatures, and half of 28 species moved, a few downward. | Reworded to match the study. |
| "Warming is strongest at the top of mountains" is arguable (elevation-dependent warming), so it was a weak distractor. | "Air gets warmer as you go up a mountain." |
| The fixed 4-offspring sample of Pp × Pp showed 4 white, a 0.4% outcome, right before a question about 4 purple. | The sample's seed was chosen so the fixed samples look like typical real ones: 2 white of 4, 7 of 20, 28 of 100, 248 of 1,000. The code says so. |
| The feedback model ran far too fast: a body without control reached 47.5 °C in two hours. | The rates are five times slower, with the same steady states; without control the body drifts about 3 °C in two hours. |
| The carbon dioxide graph ran to 2030 as if it were data. | The window always ends at the start of 2026. |
| HS-LS2-4 is about matter and energy; the lesson never said where the atoms of respired food go. | Step 4 says most atoms leave as carbon dioxide and water, and energy leaves as heat. |
| HS-LS2-1 got one clause, and carrying capacity was undefined. | Carrying capacity is defined, with NPS figures: home ranges of about 370 km² for males and 130 km² for females, and freeways that hem the population in. |
| HS-LS1-2 is about levels of organization; the lesson only listed systems. | Step 4 adds smooth muscle tissue in vessel walls and sweat glands as organs of specialized cells. |
| HS-LS3-3 emphasizes environmental as well as genetic factors. | Step 3 adds that a pea plant's height depends on light and water. |
| Smaller points: station swings and offsets (Utqiaġvik 18 ppm, +1.2; South Pole −4, low in March); "several times" for a ratio of about 2.7; small food-chain shares rounded to 0%; "1000" without a comma; Mendel's "thousands … among 929"; "eggs and pollen"; "every offspring … except identical twins"; a band starting above the summit; "about 450 m" for 462 m; "north" for "toward the poles"; rabbits where lions eat deer; "differ at 1.2%" for single-letter differences; "set point" and "biosphere" undefined. | All fixed. |

## Sources, and where they stop

- **Food chains.** The 10% rule and its 5–20% range (OpenStax *Biology 2e* 46.2). Mountain lion home ranges in the Santa Monica Mountains come from the National Park Service.
- **Carbon dioxide.** NOAA Global Monitoring Laboratory monthly in-situ records for Mauna Loa, Utqiaġvik (Barrow) and the South Pole. The swings, timings and offsets are rounded from detrended data. Growth averaged about 2.5 ppm a year over 2016–2025. Land and ocean take up about half of emissions. The model's curve is smooth and built from these values; it is not the measured record.
- **DNA.** Human–chimpanzee single-letter differences of 1.23% come from the Chimpanzee Sequencing Consortium (2005); with insertions and deletions the figure is about 4%. The split of 6–7 million years comes from the fossil record.
- **Inheritance.** Mendel's flower-color counts (705 purple, 224 white).
- **Body temperature.** Thermoregulation as described in OpenStax *Biology 2e*. The model's rates are made up, chosen to drift at roughly a real body's pace.
- **Mountains.** A standard lapse rate of 6.5 °C per km. The Yosemite resurvey is Moritz et al. (2008), *Science* 322: 261.

## Gaps

- **HS-LS1-5** (photosynthesis stores light energy) is taught in the text only; the lab models carbon dioxide, not energy.
- **HS-LS4-5 and LS2-6** are covered in part. Lesson 18 covers range shifts, local loss and a changing community, and the stability of ecosystems in a steady climate in one sentence. It does not cover the emergence of new species or changes in the distribution of traits.
- **Homeostasis** is a straight-line model with no limits on sweating or shivering.
- **No students or science teachers** have tried the lessons.
