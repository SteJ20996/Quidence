# Quantitative Reasoning, part 2: probability shortcuts · 2026-11-17

Part 2 adds four lessons and seven quick-round templates. The plan and its sources are in [quantitative-plan-20261117.md](quantitative-plan-20261117.md); Part 1 is in [quantitative-part1-20261117.md](quantitative-part1-20261117.md).

## The four lessons

| # | Lesson | Model | What the learner controls |
| --- | --- | --- | --- |
| 5 | Indicators and expectation | Exact distribution of the number of people who draw their own name, from the formula for matches. Exact distribution of the number of different faces on n dice, found by adding one die at a time. Each is shown beside the indicator sum. | What to count; 1–30 people or dice |
| 6 | Symmetry | Exact distribution of the position of the first special card in a shuffled pile. It shows the average (N + 1) ÷ (K + 1), the top and last cards counted from every arrangement, and the edge of the player who draws first. | Cards (10–60), special cards (1–8) |
| 7 | First-step analysis | Each player's exact chance of being first to succeed when k players take turns, beside a fair share. It also shows the expected wait and the time to collect every outcome. | Chance per try (1 in 2 to 1 in 20), players (2–6) |
| 8 | Bayes in counts | A natural-frequency tree for 100,000 people, with a bar comparing true and false positives, and the odds form | Base rate (0.1–50%), detection rate (50–100%), false-positive rate (1–20%) |

**Saved progress.** The course content is now version 2. A record saved with Part 1 alone gains empty places for the four new lessons. Its answers, drafts and history are kept exactly, and an event records the change.

## How the numbers were checked

The tests in `tests/quantitative.test.cjs` check each model by a different route:
- **Matches.** Every permutation of up to 7 names is enumerated.
- **Dice faces.** Every roll of up to 5 dice is enumerated.
- **First special card.** Every arrangement of piles of up to 12 cards is enumerated, including the chance that each position holds a special card.
- **Taking turns.** The chances are summed over 3,000 rounds.
- **Collecting.** The expected time comes from a backward recursion.
- **Bayes.** The counts are checked against Bayes' rule in probabilities and in odds, and must be whole numbers of people.

The independent reviewer recomputed every number in the lessons with exact fractions, enumeration and simulation, and found them correct. The numbers include:
- **Lesson 5:** 36.8%; 3.99 and 1.5% for six dice; 435 ÷ 365.
- **Lesson 6:** 10.6; 52.0% and 65.9%.
- **Lesson 7:** 6/11; 2/3; 57.1% and 35.1%; 14.7.
- **Lesson 8:** 9.2%, 52.6%, 50.3%, 47.6% and 18/67.

**Quick rounds.** The new templates are added after the Part 1 templates. A round saved before Part 2 is therefore rebuilt exactly: a test fingerprints 300 Part 1 rounds and checks them against the earlier version.

The tests accept these shortcuts from the lessons:
- n² ÷ 730 for birthday pairs;
- d(ln d + 0.577) for collecting;
- rounding 1,000 − b to 1,000 in Bayes.

They reject these common wrong methods:
- (n − 1) ÷ 2 for head-then-tail;
- n ÷ 365 for birthday pairs;
- N ÷ K for the first special card;
- 50% for taking turns;
- d rolls for collecting;
- the detection rate as the answer to a Bayes question.

## What the independent review found

The reviewer had not written the lessons. It reported 1 error, 6 items that should be fixed and 8 minor items. All were checked. All were fixed except one minor item, the collecting tolerance, which is kept for the reason given under the gaps below.

**Error.** Lesson 8, step 4 asked for a 99% detection rate, but the control moved in steps of 5. The control now moves in steps of 1. A test now checks that every setting a lesson asks for can be set.

**Should fix.**
- **Lesson 8, step 2.**
  - It switched from 1,000 people to 100,000 without saying so. It now stays with 1,000.
  - Its reason for why the chance does not rise 10 times was wrong. The new reason: the odds rise 11 times, but a chance is odds ÷ (1 + odds), which keeps pace with the odds only while they are small.
- **Lesson 8, step 3.** It now states both assumptions: a second test with the same rates, which errs independently among people with and without the condition. It adds that repeating the same test usually fails this, and that only a doctor can interpret a real result.
- **Lesson 6 lab, one special card.** The lab said the top card is the most likely position, which is false: every position is equally likely. The readout now says so. Step 3 explains that the first player then gains only from an odd number of cards: 6/11 with 11 cards.
- **Lesson 6, next activity.** Ten pooled tries cannot show that position 1 is the most common: the first positions are nearly tied. The activity now compares only the average, and expects it to be off by 2 or 3.
- **The first-card quick round.** It asked "at which position", which invited a whole number that the 5% tolerance could reject. It now asks for the average position and says a decimal is fine.
- **The Bayes quick round.** A fixed 3-point tolerance accepted half the right answer when the answer was near 4%. The tolerance is now 3 points, or a quarter of the answer if that is smaller. The rule shown to the learner states the actual value.

**Minor.**
- **Lesson 6.**
  - The lab now counts the chances for the top and last cards, which steps 1 and 4 ask the learner to read.
  - Marbles are now "drawn at random", which symmetry needs.
  - The answer to question 2 now reads "Position 10.6 on average".
- **Lesson 5.**
  - Step 4 notes that e^(−np) fits closely even though the draws are dependent.
  - The lab no longer says "chance 1/1" for one person.
- **Lesson 8.**
  - The explanation for question 3 says the test's two rates do not change with how common the condition is.
  - Step 4 limits its claim about cutting false positives to what a positive result means.
- **Lesson 7.** The lab says "both sides of a coin" for 1 in 2, instead of a 2-sided die.

## Gaps that remain

- **Collecting tolerance.** The quick round accepts within 10%. For d = 5 to 8, that also accepts skipping the first stage. A tighter tolerance would reject the common approximation d(ln d + 0.577) for a 3-sided die, so the looser one was kept.
- **Natural frequencies are not a cure.** Lesson 8 uses counts because they help (Gigerenzer & Hoffrage, 1995). A meta-analysis finds that most people still answer wrongly with counts (McDowell & Jacobs, 2017). The lesson therefore pairs the counts with a model, and does not claim that counts make Bayes easy.
- **Real medical tests.** The numbers in Lesson 8 are illustrative. Real tests have rates that depend on the group tested and on how the test is used, and repeated tests are rarely independent. The lesson says this, but it cannot teach how to read a real result.
- **Template memorization.** This gap carries over from Part 1. There are now 16 templates. That spreads repetition further, but recognising a template is still easier than transferring the method.
