# Integrated Science 6–10, Unit 1 (grade 6) · 2026-11-15

This pull request adds a new course, *Integrated Science 6–10* (`courses/integrated-science/`), and its first unit: four lessons, one for each instructional segment of California's integrated grade 6. The plan for all five units is in [integrated-science-plan-20261115.md](integrated-science-plan-20261115.md).

## The four lessons

| # | Lesson | Model | Builds toward |
| --- | --- | --- | --- |
| 1 | Cells as systems: why are cells so small? | Surface area for each unit of volume: 6/s for a cube, 12/s for a slab a quarter as thick | MS-LS1-1, LS1-2, LS1-3 |
| 2 | Heating ice: where does the energy go? | A heating curve for 100–500 g of ice from −20 °C, with the energy of each stage in a table | MS-PS3-4, PS3-5, ESS2-4 |
| 3 | Rain shadows: why is one side of the mountains wetter? | Air crossing a range: 10 °C/km without cloud, a cloud base 125 m higher per degree of dew-point spread, 5 °C/km inside cloud | MS-ESS2-5, ESS2-6, LS1-5 |
| 4 | Global warming: why does more carbon dioxide warm the planet? | About 3 °C of eventual warming and 3.9 W/m² of extra energy kept for each doubling of carbon dioxide from 278 ppm | MS-ESS3-5, LS1-5 |

Each lesson follows the Physics Foundations pattern: a saved first prediction, a lab with sliders, four steps (predict, test, explain), two fresh questions with a written explanation, and a suggested next investigation for a class. The lesson page names its California segment and says it "builds toward" the listed PEs.

## What changed in the site

- **Course engine.** The lesson menu can group lessons by unit (one "Grade 6" label for now). A course without a bridge link no longer renders an empty paragraph. A lesson that names a California segment shows it under the goal. The Cartesian graph's legend accepts a per-series prefix, so a single line is not called "Solid".
- **Homepage.** A new card in the Middle School level and the Science group, before Physics 1, with art in all four appearances (a cell, a mountain with a cloud and rain, a heating curve). The card has no field projects or understanding check yet; they come with PR⑥. In the subject rail, Integrated Science takes a full row, like the Physics courses, so its name stays on one line.
- **Subject rail height.** With eighteen courses the rail is about 1,090 px tall. At 1920 × 1080 it no longer fits, so it now scrolls with the page instead of staying pinned, as the rail is designed to do when it does not fit; nothing in it is cut off. It stays pinned at 1200 px and taller. The home browser test now checks both cases. Making it fit again would mean smaller buttons (they are 44 px touch targets) or collapsible groups; neither was done here.
- **Knowledge map.** The course is a third start on the Physics node, after Physics 1 and 2, and the map shows its scope line instead of a report line.
- **Records, sync, SEO and the static release** list the new course. The sitemap has 23 pages.

## Checking

- `tests/integrated-science.test.cjs` recomputes every model from first principles: the cube and slab areas and volumes; each heating stage from specific and latent heats, and the temperature halfway through each stage for four masses; the rain-shadow crest and far-side temperatures over a grid of 21 × 21 × 8 settings; and the warming for each doubling. It also checks:
  - each question's answer key against the model where a number is involved, and the settings each step asks for (for example, that 0–20 kJ at 500 g is all ice warming, and that a 6 µm cube and a 10 µm slab hold about the same volume);
  - that every PE listed belongs to the lesson's segment box in framework chapter 5;
  - that every lab renders without NaN at every control extreme;
  - a full run through the course, with save, reload and export.
- The PE lists were re-checked by hand against the segment boxes in chapter 5. Three claims were dropped because the lesson does not teach them: MS-PS3-3 (design a device that controls thermal energy transfer) from lesson 2, MS-LS1-4 (behaviour and plant structures in reproduction) from lesson 3, and MS-ESS3-3 (design a way to monitor and reduce a human impact) from lesson 4.

## Independent review

A reviewer checked every statement and number against sources, tried every step's settings in the labs, and checked the answer keys and PE claims. All twelve answer keys were correct. Its findings and what changed:

| Finding | Change |
| --- | --- |
| **Error.** Lesson 3, step 3 said the air "arrives warmer and drier", but a 1 km range at the default settings forms no cloud, so the far side reads the coast temperature. The prediction had no single answer. | The step now says this happens *if a cloud formed*, fixes the coast at 20 °C with dew point 12 °C, and asks why the far side is warmer with a cloud and the same without. |
| **Error.** "About 420 ppm in 2023, mostly from burning coal, oil and gas" read as if most of the carbon dioxide came from fuel. | The rise of about 150 ppm comes mostly from fuel and partly from clearing forests. |
| **Error.** Lesson 2, step 1 asked the learner to watch the ice warm, but at 200 g that stage is 8.4 kJ of an 800 kJ axis: one slider position. | The step sets 500 g and reads 0–20 kJ in 5 kJ steps, all within the stage. |
| The rain-shadow model overstates the far-side warming (30 °C at the defaults, up to 44 °C at the extremes): it drops all the condensed water and puts the far side at sea level. | The learner-facing note now says so, and that the floor of Owens Valley is over 1 km high. |
| Lesson 4's log₂ formula and the unit W/m² were never explained to a grade 6 learner. | The formula leads with "3 °C for each doubling: 278 → 556 → 1,112 ppm"; step 2 says what W/m² means. |
| Dated numbers: 420 ppm (2023) and 1.1 °C (2011–2020). | 426 ppm, the 2025 global mean (NOAA GML; Mauna Loa 427.35 ppm), and about 1.2 °C averaged over 2015–2024 (Indicators of Global Climate Change 2024, Forster et al. 2025). |
| Lesson 4 claimed MS-ESS3-3 with one sentence and a recall question, and MS-ESS3-5's core, evidence for human against natural causes, was missing. | MS-ESS3-3 was dropped. Step 4 now says how natural causes were ruled out (the Sun's output has not risen since the 1950s; eruptions cool for a year or two). |
| Lesson 3 left out air masses and why the wind blows from the Pacific (MS-ESS2-5, ESS2-6), and its plant examples showed where plants live, not how they grow (MS-LS1-5). | Step 1 explains the westerlies and winter storms; step 4 adds that the same plant grows less in a dry year. |
| Lesson 1 covered MS-LS1-2 and LS1-3 thinly. | Step 1 names the nucleus, mitochondria, chloroplasts and cell wall; step 4 adds cells → tissues → organs → systems. |
| Lesson 1 compared a cube and a slab of the same width, but the slab has a quarter of the volume, so most of its higher ratio came from being smaller. | Step 4 compares a 6 µm cube (216 µm³) with a 10 µm slab (250 µm³). |
| Smaller points: the boiling hint said "the same energy" as evaporation; 2,450 J/g should be 2,440; Q3's range began at 2,300 J; step 4 of lesson 2 cut off the plateau at 400 g; gravity was missing from the water cycle; "millions" of air sacs (it is hundreds of millions); sequoias "only" on the western slopes (naturally, about 1,500–2,100 m); "leeward" and the meaning of a low dew point were not explained; British spellings on a US site. | All fixed. |

The reviewer also suggested 6 °C/km inside cloud, citing an NWS glossary value of 3.5 °F per 1,000 ft. The model keeps 5 °C/km: the moist rate depends strongly on temperature, NWS pages give values from about 5 to 6.4 °C/km, and a 10–30 °C coast sits at the warm end, where the rate is lowest. The note says the rate depends on temperature.

The reviewer pointed out one mismatch that is only partly fixed. The framework says that grade 6 students "are not expected to explain why the Earth is warming in much detail": in this segment they analyse temperature data, find patterns and ask about causes, and build causal models in high school. Lesson 4's model is that causal model. It now opens with the observed record (about 1.2 °C since the late 1800s, faster on land and fastest in the Arctic), and its next activity is to plot temperature and carbon dioxide data and ask what causes them, but its steps still teach the mechanism. That was kept because the course runs to grade 10, where lessons 14 and 23 build on it; it is beyond the grade 6 expectation.

## Sources, and where they stop

- **Water.** Specific heats (ice 2.09, water 4.18 J/(g·°C)) and latent heats (334 J/g to melt, 2,256 J/g to boil at 100 °C) are from OpenStax *College Physics* tables 14.1 and 14.2. Ice's specific heat varies with temperature; the model uses one value. The latent heat of evaporation at 25 °C, about 2,440 J/g, is from standard steam tables.
- **Rising air.** The dry rate (9.8 °C/km, rounded to 10), the dew-point fall of about 2 °C/km and the resulting "125 m per degree" cloud-base rule (Espy's rule) are standard in introductory meteorology (NOAA/NWS; university lab notes). The moist rate is discussed above. The model assumes all the condensed water rains out and the far side is at sea level; real rain-shadow winds also mix with surrounding air.
- **Carbon dioxide and warming.** IPCC AR6 WG1 chapter 7: an equilibrium climate sensitivity of 3 °C, likely 2.5–4 °C; an effective radiative forcing of 3.93 W/m² for a doubling; about 278 ppm in 1750. NOAA GML annual means for 2025: 425.62 ppm globally, 427.35 ppm at Mauna Loa. Forster et al. (2025), *Earth System Science Data* 17: 2641: observed warming of 1.24 °C for 2015–2024 compared with 1850–1900. The logarithmic rule is an approximation: AR6 uses a fitted formula that also accounts for overlap with nitrous oxide, and climate sensitivity may itself change as warming grows.
- **Biology.** Cell sizes and organelles from OpenStax *Biology 2e* §4.2; air sacs from §39.2. The giant sequoia's natural range (about 75 groves on the western slope of the Sierra Nevada, mostly 1,500–2,100 m) from the National Park Service and the USDA Forest Service *Silvics*.
- **The framework.** The *California Science Framework* (2016), chapter 5, grade 6 segments. Its PE boxes were read from the CDE PDF. That the framework is used in Southern California is supported by county office (San Diego County Office of Education) and district course documents, not by a survey of what classrooms teach.

## Gaps

- **Assessment boundaries.** MS-ESS2-4 says that "a quantitative understanding of the latent heats of vaporization and fusion is not assessed", and MS-PS3-4 that assessment does not include calculating the total thermal energy transferred. Lesson 2 shows the numbers, because the plateau lengths are the evidence, and question 2 asks for a doubled energy. This goes beyond grade 6 expectations on purpose; whether it helps or distracts a grade 6 learner is untested.
- **Mechanism before evidence.** Lesson 4 teaches more mechanism than the framework expects in grade 6 (see the review above).
- **Practices.** CA NGSS asks students to plan and carry out investigations. A slider model cannot do that: MS-LS1-1, for example, asks students to *conduct an investigation* showing that living things are made of cells. Each lesson's last line suggests the classroom investigation; the site cannot check that it happened.
- **One lesson per segment.** Each segment bundles four to seven PEs; a lesson builds toward two or three of them. The card and the course page say these are selected foundations, not a complete year.
- **No students or science teachers** have tried the lessons.
