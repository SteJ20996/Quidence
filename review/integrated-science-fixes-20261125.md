# Integrated Science 6–10: independent review and four rounds of fixes · 2026-11-25

The repository owner said the middle-school science course still needed work. A reviewer who had not written the course read all 24 lessons. The reviewer ran every model at the settings each step asks for, and checked the understanding problems, the foundation items and the activity drawings. This note records what the review found, what each of four rounds fixed, and what remains.

## What the review found

**Content.**
- About 80 numbers and claims were checked and found correct. Among them:
  - van Helmont's willow;
  - the island fox counts, Mc1r and the Moritz resurvey;
  - bond energies and grams of CO₂ per megajoule;
  - molecular speeds, Arrhenius factors, seawater carbonate chemistry and the magnetic polarity time scale.
- Apart from lesson 22, every model reproduces the numbers its text quotes.

**Weaknesses.** The weaknesses are in teaching and assessment, not in content. They are, in order of importance:
1. **Predictions answered above the question.** In about half of the 96 steps, the paragraph above a prediction already gives the answer. For example, lesson 22 says "10 °C more roughly doubles the rate", then asks how much faster a reaction is at 35 °C. Several explain prompts also state the result.
2. **Checks that repeat the lessons.** At least 15 of the 48 "new situation" questions repeat a step's prompt or a worked example.
3. **Answer length gives the key away.** In 49 of 72 questions the right option is the longest, and many wrong options are implausible.
4. **A thin understanding check.** The understanding check covers 5 of the 24 lessons, and none from grades 7 or 8.
5. **One model error.** Lesson 22's lab compared each activation energy with itself at 25 °C. So a lower barrier, which is what a catalyst gives, looked *slower*.

The first two points were checked here directly. Lesson 22's `rate()` divided by each barrier's own rate at 25 °C. The lesson 22 text and prediction quoted above appear as described.

## Round 1: errors and misleading setups (this change)

| Lesson | Problem | Fix |
| --- | --- | --- |
| 22 Reaction rates | The graph and readout implied that all barriers share one reference, so lowering the barrier seemed to slow the reaction | The graph now compares each reaction with itself ("× its own rate at 25 °C"). A new readout compares barriers at the same temperature, for example "40 kJ/mol is 49.6 times as fast as 50 kJ/mol". Step 3 asks the learner to read it. At 25 °C, 40 kJ/mol is about 1.0 × 10⁷ times as fast as 80 kJ/mol. |
| 3 and 18 | Lesson 3 uses 10 °C per km and lesson 18 uses 6.5 °C per km, with no explanation | Lesson 18 now explains the difference. A rising bubble of cloud-free air cools about 10 °C per km. Rising air that forms clouds cools more slowly, so the air around a mountain averages about 6.5 °C per km. |
| 2 Heating ice | The energy slider stopped at 800 kJ, but boiling away 500 g takes 1,525 kJ. After step 1 (500 g), step 2's "whole range" cut off the boiling plateau. | The slider goes to 1,600 kJ and the axis scales with the mass. Step 1 still uses 500 g, because only then does warming the ice span 20 kJ. |
| 9 Speed and crashes | The prompt asked about a graph of "energy against mass" that does not exist | It now refers to the energy graph and its 1,000 kg comparison line |
| 16 Inheritance | One fixed sample per size, so a learner could not see small samples vary | A "Sample" slider draws 10 different samples. Sample 1 is the earlier fixed sample. Three of the ten samples of 4 have no white offspring, close to the expected (3/4)⁴ ≈ 32%. |
| 20 Heat flow | Step 4 compared the energy from water and iron, but they cooled by different amounts | The readout gives energy for each degree cooled: 0.84 kJ for water and 0.09 kJ for iron, the ratio of their specific heats |
| 24 Ocean acidification | A model value (a drop of 0.14 at 420 ppm) was stated as fact | Now said to be the model's value, with a note that estimates from measured seawater are a little smaller |
| 12, 18, 6 | Lesson 12: an untestable "travels farther" prompt. Lesson 18: step 3's settings never reached the summit. Lesson 6: "atomic masses come in high school", though lesson 5 taught them. | Reworded; lesson 18 step 3 starts the band at 3 km |
| 19, 20 | Lesson 19 sent learners forward to lesson 20 for Q = m × c × ΔT, which lesson 2 already taught | Both now refer back to lesson 2 |
| 2, 23, 24 | Terms that were never defined: kJ, albedo, IPCC, upwelling, µmol/kg | Each is defined where it first appears |
| 1, 2, 5, 6 | Uneven safety notes | Added where missing:<br>• cheek-cell hygiene;<br>• goggles and a heat-proof beaker;<br>• an adult to pour 60 °C water;<br>• eye protection, and opening a capped bottle slowly |
| All | Every science question said a reviewer "should judge the mathematics" | Science questions now say "the science" |

**Saved work.** Lesson 16 gains a lab setting. A record saved before it opens with the new setting at its default. Every saved answer and setting is kept, and a test checks this. The same rule now applies to any course whose lab gains a control.

**Checks.** New tests cover:
- the barrier comparison, including that a lower barrier is faster at every temperature;
- that the heating axis and slider reach the end of boiling for every mass;
- the energy per degree;
- the ten samples of lesson 16;
- the upgrade of an older record;
- the safety notes.

## Round 2: ask before telling (this change)

**How each step works now.** Each step opens with its prediction. Only the step's title and its question show, and the model panel says it will open after the prediction.
- The learner either writes a prediction (up to 500 characters) or chooses "I'm not sure yet". The step's text, its activity and the model then appear.
- The saved prediction stays above the text and is never replaced. The activity list no longer asks for it again.
- A step counts as opened only after this. So the fresh questions, which need all four steps opened, come after four predictions or four "not sure" answers.
- The lesson's feedback page lists the step predictions, and so does the Markdown report. The JSON export holds them with the rest of the record.

**Scope.** This applies only to courses that set `predictFirst`, which is only Integrated Science.

**Saved work.** Predictions are stored per lesson as four entries, each empty or `{text, unsure, at}`, and are validated when a record opens. A record saved before this change has no step predictions and still opens: every answer is kept, and its steps ask for predictions only if they have not been opened yet.

**Prompts that gave the answer away.** 33 of the 96 "explain" prompts stated the result the step's own prediction asks for. Examples:
- "Explain why a full moon rises at sunset" followed "About what time does a full moon rise?"
- "Explain why doubling the efficiency gives eight times as much energy" followed a question asking how many times as much.

Each one now asks the learner to explain what they read in the model: "Use the view from above to explain the rising time you found."

**What this does not fix.**
- **"Not sure" at every step.** A learner can still choose "not sure" at every step. That is deliberate: forcing a guess can turn a prediction into noise.
- **Effort.** Nothing checks whether a prediction was thought through.
- **The text still gives the answer.** Once shown, the step text still answers the prediction. That is now the intended order: the guess first, then the evidence, then the explanation.
- **No evidence for this course.** The research on predicting first (Crouch et al., 2004) comes from university physics demonstrations, with a teacher in the room. Whether a written prediction does the same for 11–16-year-olds working alone has not been tested here.

## Round 3: new questions, with every earlier answer kept (this change)

All 72 lesson questions are revised: each lesson's question before the lesson and its two fresh questions after it.
- **Fresh questions use new situations.** They put the lesson's idea into a context and with numbers that appear nowhere in the lesson. Examples:
  - a potato cut into cubes (lesson 1);
  - Santa Ana winds (lesson 3);
  - an echo sounder in Monterey Bay (lesson 12);
  - a sealed globe ecosystem (lesson 13);
  - magnesium nitride (lesson 21).

  No question shares a run of more than 7 words with its lesson's text, predictions, tests or prompts.
- **Wrong options are known misconceptions or typical errors.** Examples:
  - "warm water lowers the energy a reaction needs";
  - 10 °C per km instead of 6.5 °C per km;
  - adding growth factors instead of multiplying them;
  - "humans evolved from today's chimpanzees";
  - "the next seed is due to be white".

  Many such ideas are documented in studies of students' thinking, among them:
  - Driver, Squires, Rushworth and Wood-Robinson (1994);
  - Bishop and Anderson (1990) on natural selection;
  - Baxter (1989) on Moon phases;
  - Hestenes, Wells and Swackhamer (1992) on forces;
  - Boyes and Stanisstreet (1993) on the greenhouse effect and the ozone layer.
- **Option lengths are balanced.** The right answer is now the longest option in 17 of 72 questions (24%), down from 49. In every question the longest option is at most 1.25 times the shortest.
- **Numbers are checked.** Every number comes from the course's own models, and the lab can be set to every setting a question names. Real-world facts were checked:
  - the October 2023 eclipses;
  - Venus and Mercury;
  - mustard plants flowering earlier after drought (Franks, Sim & Weis, 2007);
  - trout removal and frog recovery in Sierra lakes (Vredenburg, 2004).

**How saved answers are kept.** A saved answer is stored by question id and option, so changing a question in place would attach old answers to wording the learner never saw.
- **New ids.** Each revised question has a new id ending in `-r2` and names the version-1 question it replaces.
- **Frozen wording.** The version-1 wordings are kept frozen in the course content, and a test fails if they change.
- **Upgrade.** A record saved under version 5 opens under version 6 with every answer unchanged, and an event notes the revision.
- **Finished lessons stay finished.** A lesson counts as done when each question, or its earlier wording, has been answered. Learners who finished are not asked again.
- **Unfinished lessons.** A half-finished lesson asks only the questions still unanswered, in their new wording.
- **Display.** The feedback page, the summary and the reports show each answer with the wording it answered, and say so when that wording is an earlier one. The JSON export includes the retired definitions.
- **Scope.** The engine change works for any course that later revises questions; only Integrated Science uses it so far.

**Gaps.**
- **No item statistics.** No learner has answered the new items, so their difficulty and how well they separate understanding from guessing are unknown.
- **Transfer varies.** A few questions are near transfer, using the lesson's model with new numbers (3.1, 7.1, 15.1, 20.1). Item 13.2, the sealed globe, is close to step 4's idea.
- **Difficulty varies.** Some items ask more than the grade usually does: the √2 speed ratio in grade 7 (5.2), and multiplying rate factors (22.1).
- **Unchecked citations.** The drafts named other studies for some misconceptions. Only the sources above were checked, and only those are cited here.

## Round 4: understanding problems for grades 7 and 8 (this change)

Before this round, the understanding check had four problems, on lessons 2, 16, 19, 23 and 24. None came from grades 7 or 8. Four problems are added, each on two lessons of those grades.

| Problem | Lessons | Numbers asked | Choice, and the error each wrong option stands for |
| --- | --- | --- | --- |
| is-c05 Fast molecules, rearranged atoms | 5, 6 | A hydrogen molecule moves 4 times as fast as an oxygen molecule at one temperature. By the ratio of molecular masses, 90 g of glucose uses 96 g of oxygen in respiration and makes 186 g of carbon dioxide and water. | Where the glucose's atoms go. Wrong: "changed into energy" (matter turned into energy); "breathing out removes only air". |
| is-c06 Rates on the seafloor and on an island | 7, 8 | One side of a ridge moves 2.5 cm a year; two points on opposite sides move 50 cm apart in 10 years. In the course's fox model, eagles taking 10% a year hold the foxes at 1,000. | Why the foxes level off below 1,500. Wrong: "the island has less food" (a predator's toll read as a shortage of resources); "the foxes learn to hide". |
| is-c07 Energy, stopping and echoes | 9, 12 | 240 kJ for 1,200 kg at 20 m/s. Braking from twice the speed takes 4 times as far: 50 m. An echo after 0.6 s in seawater means 450 m of water. | How a crumple zone protects. Wrong: "a shorter stop"; "a lighter car". |
| is-c08 A spreading color and the Moon's clock | 11, 10 | A ratio of 1 dark mouse to 8 light ones, doubling every 15 generations, reaches half after 45 generations and 80% after 75. A full moon rises about 6 hours later than a first-quarter moon. | Naming a thin Moon seen before sunrise, lit on the left. Wrong: waxing for waning; "a new moon". |

**How the problems were built.**
- **Every value is stated.** A problem gives each number and rule it needs, such as the fox model's growth rule or the doubling time of the ratio, so a match checks reasoning, not recall.
- **The numbers agree with the course's models.** At the problems' settings:
  - the fox model levels off at 1,000.1 foxes by year 40;
  - the seafloor model dates rock 150 km out at 6 million years;
  - the crash model gives 240 kJ, and 12.5 m and 50 m of braking on a wet road from 10 and 20 m/s;
  - the Moon model rises 150 minutes later three days after full moon.
- **Distractors and lengths.** As in round 3, each wrong option is a typical error. The right option is never longer than 1.1 times the shortest, and in three of the four it is the shortest. A test checks the length limit.
- **Answers are recomputed separately.** `scripts/audit-challenges.py` recomputes every answer with exact fractions:
  - it balances the respiration equation atom by atom;
  - it runs the fox model year by year until it settles;
  - it doubles the mouse ratio block by block.
- **Supplied information.** The check's notes list the values each problem supplies. What the check does not cover now includes two things: watching the real Moon, and the chance that a small population dies out by bad luck.

**Independent read.** A reviewer who had not written the problems recomputed all 12 numbers and found them correct. The reviewer also raised 13 points, all addressed. The main ones:
- **Moles.** is-c05 used moles, which the course first teaches in lesson 19 (grade 10). It now works from the ratio of molecular masses, as lesson 5 does.
- **A defensible distractor.** is-c06's "carrying capacity" option could be argued; see below. Its question now also says "above zero", since no foxes also balances.
- **Rounding.** is-c07 asked for 112.5 m, which invites a whole number; it now asks about twice the speed (50 m). is-c08's 6 hours now says "to the nearest hour", since the 50-minutes-a-day rule gives about 6.2.
- **Units.** is-c07 now says that kg and m/s give joules, and that 1 kJ = 1,000 J.
- **A wrong follow-up.** is-c08's follow-up placed a waxing gibbous moon high in the south at sunset, where lesson 10 places a first-quarter moon. It now asks about the Moon ten days after new moon.
- **Smaller fixes.** An echo sounder in the hull, not people on deck, hears the echo, because lesson 12 says sound in water barely crosses the surface. is-c08 now asks about the mice before the Moon, so its two Moon questions sit together. is-c05's follow-up no longer explains a helium balloon by speed alone, since the size of helium atoms matters as much.

**How saved work is kept.** Published problems are never edited in place, so this is a new bank version, 15.
- **The first four problems are carried over unchanged.** The new science module reuses the published task objects, and a test checks that they are identical.
- **Bank 14 is frozen** as `assets/challenge-bank-v14.js`, and bank 15 keeps it in its history.
- **A check started under bank 14 keeps its four problems and its answers.** A new check has eight problems, in lesson order.
- **The course page and the homepage count** say 8 problems for Integrated Science and 88 diagnostic problems in all.

**The prerequisites were understated.** The gap noted below for round 1 was still open. The course's prerequisite now names the mathematics the lessons use: squares and square roots, repeated doubling, powers of ten and scientific notation, and the pH scale.

**Evidence and its limits.**
- **Matter into energy.** Meerman and Brown (2014) asked 150 doctors, dietitians and personal trainers where body fat goes when people lose weight. More than half said it turns into energy or heat. Most of its mass is in fact breathed out as carbon dioxide. Their survey was of adults and about fat, not glucose. The error is the one is-c05's distractor names; how common it is among 13-year-olds is not shown there.
- **Moon phases.** Baxter (1989) found that children's explanations of phases often rely on Earth's shadow. The waxing–waning distinction tested here is a different, narrower skill, and no study of it was checked.
- **No source for some distractors.** No study was checked for the crumple-zone and food-shortage distractors. They come from the lessons' own contrasts (a longer stop lowers the force; a predator's toll is not a shortage of food), not from measured misconception rates.
- **Carrying capacity is defined two ways.** Lesson 8 defines it as the largest population the environment can support, while some textbooks count predation among the factors that set it. A wrong option saying "the carrying capacity fell" could therefore be defended, so the option names a shortage of food instead.

**Gaps.**
- **Coverage is still partial.** The check now covers 13 of the 24 lessons (2, 5–12, 16, 19, 23, 24). Lessons 1, 3 and 4 of grade 6 and lessons 13–15, 17, 18 and 20–22 of high school have no problem. Adding them to one check would make it about 14 problems long. A check per grade band would need the check page to offer parts, which it does not yet do.
- **Length.** Eight multi-part problems are long for one sitting. Progress is saved, but how many learners finish is unknown.
- **Difficulty.** is-c06 asks a grade 7 learner to solve 0.3 × (1 − n ÷ 1,500) = 0.1, which is algebra a grade 7 course may not yet have taught. It is marked challenging. No learner data confirm any problem's difficulty.
- **Idealized models.**
  - **Moonrise.** The 6-hour rule uses an average delay. At mid-latitudes the real daily delay varies with the season, from about half an hour to more than an hour (the "harvest moon" effect).
  - **Foxes.** The fox model had no chance events; see the lesson 8 section below.

## Lesson 8: a chance of dying out (later change)

**Why.** Lesson 8's model showed only averages. In it, captive breeding added just two years to the recovery and looked like a waste. The National Park Service, though, describes captive breeding as "insurance against the loss of foxes". At the low point in 1999, only about 15 foxes were left on San Miguel Island and about 15 on Santa Rosa Island (National Park Service, 2008). A model without chance cannot show what that insurance was for.

**What changed.**
- **Two new controls.**
  - **The year the plan starts:** 10 to 20, default 10.
  - **Chance:** off (the default), "each fox's luck", or "each fox's luck and bad years".
- **Chance off is the earlier lab.** With chance off and the plan in year 10, the lab gives exactly the earlier numbers, so every step, question and saved setting keeps its meaning. A record saved before this change opens with the plan in year 10 and chance off.
- **Chance on runs 1,000 simulated islands.**
  - **Each fox's luck.** Each year, the number of wild foxes is a random whole number whose average is the model's value (a Poisson draw). Its spread is about the square root of that value: about ±4 around 15 foxes and about ±39 around 1,500. So luck that hardly matters to 1,500 foxes can end 15.
  - **Bad years.** Each year has a 1 in 10 chance of drought or disease, which halves the value. The other years are 1/18 better, so over many years the value averages out to the model's. Bad years change how much the numbers swing, not the average.
  - **A fair comparison.** Every plan faces the same bad years on each island.
  - **Captive breeding needs founders.** Captive-bred foxes come from foxes caught when the plan starts, so an island with fewer than 2 foxes left then gets no releases.
- **What the view shows.**
  - 20 of the islands, with a red dot for the year an island's wild foxes died out.
  - A close-up of 0 to 100 foxes after the plan starts.
  - A table for all four plans: islands whose wild foxes died out, islands with 30 or more foxes in year 40, and the typical (median) number in year 40.
  - How many islands lost their foxes before any plan could start.
- **Steps 3 and 4.**
  - **Step 3** adds the risk of dying out to the criteria. It asks the learner to start the plans in year 20, when fewer than 20 foxes are left, and to compare them with chance on.
  - **Step 4** says what really happened: foxes were taken into pens as insurance, San Miguel had more females than males, and 254 foxes had been released by 2008. Its activity first sets chance off and the plan back to year 10.
  - **The four prediction questions are unchanged.** A saved prediction is stored with its step, so changing a question would attach old predictions to new wording.

**What the model shows.** With eagles taking 50% and the plans starting in year 20, with luck and bad years:

| Plan | Islands whose wild foxes died out | Islands with 30 or more foxes in year 40 | Typical number in year 40 |
| --- | --- | --- | --- |
| No plan | 945 | 0 | 0 |
| Move the eagles away | 133 | 853 | 641 |
| Release captive-bred foxes | 237 | 16 | 5 |
| Both | 88 | 917 | 1,275 |

- **Some losses come before any plan.** 57 of these islands lost their wild foxes by year 20, under every plan.
- **Removing the cause is still needed.** Releases alone leave a dwindling population: a median of 5 foxes in year 40, and only 16 of 1,000 islands with 30 or more.
- **Removing the cause is not always enough once few animals are left.** After year 20, "Move the eagles away" loses 76 more islands; adding captive-bred foxes cuts that to 31.
- **Acting early matters most.**
  - With the plans in year 10, when about 190 foxes are left, no island loses its foxes under either plan that moves the eagles.
  - Starting in year 15 instead of 20 cuts the islands lost under "Move the eagles away" from 133 to 10.
- **Each fox's luck alone matters less here.** Without bad years, moving the eagles in year 20 loses 20 of 1,000 islands.

**How sensitive the numbers are.** The bad-year rule is made up, and with the plans in year 20 the results change a lot with it:

| Bad years | Lost, "Move the eagles away" | Lost, "Both" | 30 or more in year 40, "Move the eagles away" | 30 or more, "Both" |
| --- | --- | --- | --- | --- |
| 1 in 10, halving (the lab) | 133 | 88 | 853 | 917 |
| 1 in 20, halving | 67 | 39 | 928 | 963 |
| 1 in 10, cutting by 30% | 41 | 20 | 954 | 980 |
| 1 in 5, halving | 272 | 205 | 681 | 803 |

The same pattern holds in every row:
- "Both" loses fewer islands than "Move the eagles away" and leaves more with 30 or more foxes;
- releases alone fail;
- an earlier start loses fewer islands.

The pattern is what the lesson teaches. The numbers are not predictions, and the lab's note says so.

**Independent read.** A reviewer who had not written the change ran the model and found the Poisson draw, the shared bad years and the counts correct. The reviewer found these problems, all fixed:
- **Bad years lowered the average.** In the first version, bad years only ever lowered the value, so even without eagles the islands averaged well below 1,500. The other years are now a little better, and a test checks that the average is unchanged.
- **The table favored releases alone.** A column counting islands with any fox at all made releases alone look better than moving the eagles, although its typical island had 3 foxes. The column now counts islands with 30 or more, the threshold Bakker, Doak and Ferrara (2021) used for San Nicolas Island foxes.
- **Captive foxes came from nowhere.** Releases could restore an island whose wild foxes had all died, though in reality the captive foxes were that island's own last foxes. Releases now need at least 2 foxes left when the plan starts.
- **Step 4 could not be done from step 3's settings.** Its activity now turns chance off and sets the plan back to year 10 first.
- **Smaller fixes.**
  - Losses before the plan are now reported separately.
  - Red dots mark die-outs, which a line hides while foxes are being released.
  - The 30-fox note no longer says real islands "count as lost" below 30, which contradicted their recovery from 15.
  - The note says the numbers are invented, so they are not read as real odds.
  - The captions no longer mention a plan year when there is no plan.

**Checked by tests.**
- The draw's mean and variance, for values from 3 to 1,500.
- Bad years average out.
- Chance off reproduces the earlier model.
- The same settings give the same islands every time.
- Founders are needed for releases.
- The comparisons above.
- A record saved before the change opens.

**Checked by hand.** At 390 and 1280 px the view has no page overflow, and the table fits a phone screen.

**Gaps.**
- **Not fitted to data.** The growth rate, the carrying capacity and the bad-year rule are not estimated from island fox data. Real viability analyses estimate survival and breeding from field counts, as Bakker, Doak and Ferrara (2021) did for San Nicolas Island foxes.
- **What it leaves out.**
  - inbreeding;
  - uneven numbers of males and females;
  - disease spreading from fox to fox;
  - chance within the captive breeding itself;
  - the time it took to move the eagles: the model treats it as instant.
- **Founders, simply.** Catching foxes for breeding does not remove them from the wild count in the model, and 2 foxes are enough to breed from. Real founders were few and uneven: San Miguel had more females than males.
- **A 40-year window.** Releases alone look less bad when they start late, because the simulation ends soon after they stop. The 30-or-more column and the median show the decline.
- **No technical terms.** "Each fox's luck" is what ecologists call demographic stochasticity, and "bad years" is environmental stochasticity. The lesson avoids the terms, so a learner who meets them later must make the link.

## The check in two parts, covering every lesson (later change)

**Why.** After round 4, the understanding check covered 13 of the 24 lessons. Adding the other 11 to one check would make it 14 multi-part problems, too long for one sitting.

**Parts, for any subject.** The check engine now lets a subject's check come in parts.
- **Each part is its own check.** It has its own session, its own report and its own export, so a learner can take the parts in any order and on different days.
- **The overview offers the parts.** The chosen part is marked, and the overview shows that part's scope and number of problems. Switching parts returns to the latest check of that part, so no draft is lost.
- **Checks saved earlier keep their problems.** A session without a part, from any earlier bank, opens with exactly its earlier problems. A saved part that does not exist is rejected when a record opens.
- **What each report covers.** The report, the scope note and the supplied-information notes cover only the part's problems.
- **Only Integrated Science uses parts so far.** Every other subject's check is unchanged.
- **Independent read of the code.** A reviewer who had not written the change found three problems, all fixed:
  - **Scope text.** Reports, exports and the overview showed the current whole-check scope. So a part's report claimed all 24 lessons, and a check saved under bank 15 claimed a two-part structure it never had. Each now shows the scope it was taken under: its part's, else its own bank's. An earlier check also says that it keeps its original questions.
  - **Re-clicking the chosen part.** Clicking the part already chosen threw away a new check that had just been started and reopened the finished one. It now does nothing.
  - **A future crash.** "Start a new check" would have thrown an error if a later bank renamed a part. It now falls back to the first part.
  - **Smaller fix.** Each part's downloads are now named after the part.

  The reviewer also checked:
  - that hydrate rejects bad parts;
  - that every report section stays within its part;
  - that switching parts loses no draft;
  - that further checks and projects are unaffected.

**Integrated Science in two parts.**

| Part | Problems | Lessons |
| --- | --- | --- |
| Grades 6–8 | 7 | 1–12 |
| High school | 7 | 13–24 |

**Six new problems** cover the 11 lessons that had none:

| Problem | Lessons | Numbers asked | Wrong choices stand for |
| --- | --- | --- | --- |
| is-c09 Why cells stay small | 1 | A 4 µm cube's surface ÷ volume (1.5 per µm); tripling the side multiplies the volume by 27; cutting a 12 µm cube into 4 µm cubes triples the surface | "an elephant has larger cells" |
| is-c10 Over the mountains, and a warmer planet | 3, 4 | The cloud base (1,000 m) and the far-side temperature (30 °C) for air crossing a 3 km range; warming from 278 to 1,112 ppm (6 °C, two doublings) | the ozone hole; heat from burning fuel |
| is-c11 Energy up a food chain, carbon in the air | 13, 14 | 200 units at the fourth level; 8 times as much at 20%; the May 2030 peak at 2.5 ppm a year (442 ppm) | less fuel burned in summer; warm seas taking up more |
| is-c12 DNA clocks and shrinking ranges | 15, 18 | 12 differences in 6 million years (two lineages); 30 differences mean 15 million years; 2.6 °C moves a band 400 m uphill | evolving to bear the heat within a few years; a cooling summit |
| is-c13 Heat flow and a steady body | 17, 20 | Mixed water at 35 °C; 37,620 J given off; with iron, about 22 °C | a raised set point; shivering |
| is-c14 Ions in balance, reactions in a hurry | 21, 22 | 3 sulfide ions for 2 aluminum ions; 8 times as fast from 20 °C to 50 °C with a doubling rule; 16 times with twice the concentration | "more frequent collisions are the main reason"; "heat breaks all the bonds" |

**How they were built.**
- **Every value is stated, and the numbers agree with the course's models.** For example, the rain-shadow model gives a 1,000 m cloud base and 30 °C on the far side; the mixing model gives 35 °C and 22.08 °C.
- **Where a stated rule and a model differ, the solution says so.** is-c14 states a doubling rule for temperature. The lesson's own model, with a 50 kJ/mol barrier, gives about 6.7 times from 20 °C to 50 °C, not 8.
- **Lengths.** As before, the right option is never more than 1.1 times the shortest.
- **Exact recomputation.** `scripts/audit-challenges.py` recomputes every answer exactly, by different routes:
  - counting the unit faces of cubes;
  - following the air over the range meter by meter;
  - halving 1,112 ppm until it reaches 278;
  - passing energy up the chain level by level;
  - cancelling charges by search.

**Independent read of the problems.** A reviewer who had not written them recomputed all 17 numbers with the course's models and found them correct. The reviewer raised these points, all fixed:
- **An unstated assumption.** is-c10's 30 °C needs the air to sink with no cloud left, which the prompt did not say. It now says so, and that the coast is at sea level.
- **A true but wrong-cause option.** is-c11's "people burn less fuel in summer" is true. The solution now says why it cannot be the cause: burning less still adds carbon dioxide, so the level cannot fall.
- **A distractor wrong for the wrong reason.** is-c12's "a thicker coat" is no help in warming, so it could be rejected without the idea it tests. It now reads "evolve to bear the heat within a few years".
- **An overstated sentence.** is-c12's solution said traits change "only if the variation already exists", which contradicts lesson 11's new mutations. It now says lasting change takes many generations and suitable inherited variation.
- **A second reading of a number.** is-c14's "twice the concentration" could mean both reactants (answer 32). It now names one reactant, A.
- **Smaller fixes.**
  - is-c13 uses 38 °C, a more natural exercise temperature than 37.4 °C.
  - is-c14's weak option now states the real error: "more frequent collisions are the main reason".
  - Several labels and sentences are clearer.

**How saved work is kept.**
- **Published problems are never edited.** This is bank 16; bank 15 is frozen as `assets/challenge-bank-v15.js`.
- **The eight earlier problems are carried over unchanged.** A test checks each one.
- **Earlier checks keep their problems.** A check started under bank 15 keeps its eight problems; one started under bank 14 keeps its four.
- **Counts.** The course page shows 14 problems, and the homepage counts 94 diagnostic problems.

**Gaps.**
- **No learner data.** Nobody has taken the new problems, so their difficulty is unknown.
- **Uneven difficulty.** Some problems ask more than their grade usually does, such as the two-lineage clock and the iron mixing.
- **One lesson per field.** Most problems join two lessons, so a learner who has studied only one can answer only part of the problem. "Not studied" can be marked per problem, not per field.
- **A part is not a unit test.** Each part spans 12 lessons and samples each lesson with one or two questions, so it cannot show mastery of any one lesson.

## What comes next

| Round | Work | Why |
| --- | --- | --- |
| 2 (done above) | Ask before telling. | Predicting before a demonstration improves learning over watching it. Crouch, Fagen, Callan and Mazur (2004) found that students who predicted the outcome of physics demonstrations understood them better afterwards than students who only watched. The predict–observe–explain sequence (White & Gunstone, 1992) depends on the prediction coming first. |
| 3 (done above) | Rewrite the checks as new situations, with wrong options drawn from known misconceptions and options of similar length | Item-writing guidelines ask for plausible distractors based on common errors, and options of similar length (Haladyna, Downing & Rodriguez, 2002) |
| 4 (done above) | Add understanding problems for grades 7 and 8, as a new bank version | Four problems covered 5 of the 24 lessons, none from grades 7 or 8 |
| Later (done above) | Problems for the 11 lessons still uncovered, as a check in parts | One check for all 24 lessons would be too long for one sitting |
| Later (done above) | Give lesson 8's fox model a chance of dying out | The model had no chance events, so captive breeding added only two years and looked like a waste. Yet keeping populations of about 15 foxes from dying out by chance was its real purpose. |

## Gaps

- **No learners have tried the course.** Readability scores (Flesch–Kincaid grade 6.3 to 10.9 by lesson) say nothing about whether learners understand it.
- **Round 1 changed no questions.** The length cue and the repeated checks remained until round 3, so results from questions answered before round 3 overstate understanding.
- **The lesson 22 readout is a contrast between two models.** It gives two reactions the same collision factor, which real reactions with and without a catalyst need not share. The note says so.
- **The mathematics behind the lessons is still understated.** The prerequisites the course page lists (whole numbers, decimals, ratios and simple formulas) leave out several things the lessons use:
  - logarithms (lessons 4 and 24);
  - square roots (lesson 5);
  - scientific notation (lesson 19);
  - an exponential (lesson 22).

  Round 4 adds them to the course's prerequisite.

## Sources
- Baxter, J. (1989). Children's understanding of familiar astronomical events. *International Journal of Science Education*, 11(5), 502–513.
- Bishop, B. A., & Anderson, C. W. (1990). Student conceptions of natural selection and its role in evolution. *Journal of Research in Science Teaching*, 27(5), 415–427.
- Boyes, E., & Stanisstreet, M. (1993). The "Greenhouse Effect": Children's perceptions of causes, consequences and cures. *International Journal of Science Education*, 15(5), 531–552.
- Driver, R., Squires, A., Rushworth, P., & Wood-Robinson, V. (1994). *Making Sense of Secondary Science: Research into Children's Ideas*. Routledge.
- Franks, S. J., Sim, S., & Weis, A. E. (2007). Rapid evolution of flowering time by an annual plant in response to a climate fluctuation. *PNAS*, 104(4), 1278–1282.
- Hestenes, D., Wells, M., & Swackhamer, G. (1992). Force Concept Inventory. *The Physics Teacher*, 30(3), 141–158.
- Vredenburg, V. T. (2004). Reversing introduced species effects: Experimental removal of introduced fish leads to rapid recovery of a declining frog. *PNAS*, 101(20), 7646–7650.

- Bakker, V. J., Doak, D. F., & Ferrara, F. J. (2021). Understanding extinction risk and resilience in an extremely small population facing climate and ecosystem change. *Ecosphere*, 12(8), e03724.
- National Park Service (2008). *Captive breeding program that prevented extinction of endangered island fox ends*. Channel Islands National Park news release.
- National Park Service (2016). *The restoration of the island fox*. Channel Islands National Park.
- Meerman, R., & Brown, A. J. (2014). When somebody loses weight, where does the fat go? *BMJ*, 349, g7257.
- Crouch, C. H., Fagen, A. P., Callan, J. P., & Mazur, E. (2004). Classroom demonstrations: Learning tools or entertainment? *American Journal of Physics*, 72(6), 835–838.
- Haladyna, T. M., Downing, S. M., & Rodriguez, M. C. (2002). A review of multiple-choice item-writing guidelines for classroom assessment. *Applied Measurement in Education*, 15(3), 309–333.
- White, R., & Gunstone, R. (1992). *Probing Understanding*. Falmer Press.
- U.S. Standard Atmosphere (1976). NOAA, NASA and USAF: a lapse rate of 6.5 K per km in the lower atmosphere.
