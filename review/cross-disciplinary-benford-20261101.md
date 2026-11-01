# Cross-disciplinary projects: first digits and Benford's law · 2026-11-01

The Cross-disciplinary Projects section has a third project, "Why do so many numbers start with 1?", in English and Spanish at `cross-disciplinary/?project=cross-p03`. It starts from the first digits of the powers of 2 and ends with a statistical test and its limits. It draws on Statistics, Algebra II, Pre-calculus and Number Theory.

## The project

Among the powers 2¹ to 2¹⁰⁰, 30 start with 1 and only 5 start with 9. The project finds the exact pattern, Benford's law P(d) = log₁₀(1 + 1/d), proves why the powers of 2 follow it, shows why a change of units cannot break it, and tests when a data set should and should not follow it.

| Step | What the learner finds | Courses | Lab |
| --- | --- | --- | --- |
| 1 · Count the first digits | 3 of 2¹ to 2¹⁰ start with 1. Of 2¹ to 2¹⁰⁰, 30 start with 1 and 5 with 9. The first power that starts with 7 is 2⁴⁶. | Statistics | Powers of 2 are added one or ten at a time, and a bar chart tallies their first digits against the level of equal shares. The newest power is shown exactly, or as m × 10ᵏ once it is long. |
| 2 · The first digit on a log scale | A number starts with d exactly when its mantissa, the fractional part of log₁₀, lies between log₁₀ d and log₁₀(d + 1). The stretch for 1 has length 0.301, the stretch for 9 has length 0.046, and the mantissa of 1024 is 0.010. | Algebra II, Pre-calculus | A ruler from 1 to 10 on a log scale, or with equal steps, split into one stretch per first digit. Each press doubles the number; on the log scale the marker moves the same distance every time. |
| 3 · Benford's formula | If the mantissas are spread evenly, P(d) = log₁₀(1 + 1/d), and the nine shares telescope to 1. P(1) + P(2) + P(3) ≈ 0.602, P(1)/P(9) ≈ 6.6, and about 301 of 1,000 numbers start with 1. | Statistics, Algebra II | The nine shares as bars or laid end to end, with the shares among 2¹ to 2¹⁰⁰⁰ on request. |
| 4 · Why the powers of 2 obey the law | log₁₀ 2 is irrational by unique factorization, so no two powers of 2 share a mantissa. Weyl's theorem, used without proof, gives the even spread. The first power that starts with 9 is 2⁵³; every power of 10 starts with 1. | Number Theory, Pre-calculus | The mantissas of 2¹, 2², … placed on a circle of circumference 1, split into nine arcs, a turn of 0.301 at a time. A second view shows the powers of 10, all at 0. |
| 5 · Changing units cannot break it | Multiplying by c turns every mantissa by the same amount, so an even spread stays even. 2x starts with 1 exactly when x starts with 5 to 9, a share of log₁₀ 2 = P(1). The whole numbers 1 to 999 give 555 numbers starting with 1 once doubled. | Statistics, Algebra II | Two tables, 2¹ to 2¹⁰⁰⁰ and 1 to 999, multiplied by 2 or 3 up to six times, with the counts that Benford's law predicts. |
| 6 · Testing data, and when the law fails | χ² ≈ 0.22 for 2¹ to 2¹⁰⁰, far below 15.51, and χ² ≈ 401.3 for 1 to 999. Adult heights should not follow the law. A failed test is not proof of fraud. | Statistics, Algebra II | The chi-square test on the powers 3¹ to 3¹⁰⁰, the first 100 Fibonacci numbers and the heights 150 to 199 cm, with each digit's part of χ². |

As in the other projects, a lab shows a result only after the learner acts, and its text does not state a field's answer or a step of a proof. The test lab uses other data than the step asks about, so the two χ² values in step 6 are the learner's own calculation.

Eight answers are decimals of irrational numbers. Each is stored to 15 places and accepted when rounded correctly to at least the stated number of places: for log₁₀ 2 to three places, 0.301, 0.3010 and 0.30103 are accepted, and 0.30 and 0.302 are not.

## Sources and their limits

- **Newcomb (1881) and Benford (1938).** Simon Newcomb stated the law in two pages of the *American Journal of Mathematics*, without proof. Frank Benford collected 20 tables, about 20,000 numbers, in the *Proceedings of the American Philosophical Society*. His tables differ widely, and several do not follow the law on their own. The project mentions his tables as where the name comes from, not as evidence.
- **Pinkham (1961) and Hill (1995).** Pinkham argued that a first-digit law that does not change with units must be Benford's law; Hill gave a rigorous version. Step 5 proves only the forward direction and cites the converse. Scale invariance says what a universal law would look like, not why a given data set follows it.
- **Weyl (1916) and Diaconis (1977).** Weyl's equidistribution theorem, applied to first digits by Diaconis, completes the proof for the powers of 2. Step 4 proves what is within reach, irrationality and no repeated mantissas, and states that the theorem is used without proof. Its follow-up asks why "never repeats" is not enough.
- **Auditing and elections.** Auditors use the test to choose what to check more closely. Deckert, Myagkov and Ordeshook (*Political Analysis*, 2011) found that honest vote counts often fail it. Step 6 asks the learner to explain why a failed test is not proof of fraud.
- **What a very small χ² means.** The chi-square test assumes an independent random sample. For 2¹ to 2¹⁰⁰, χ² ≈ 0.22 is far below the average of 8 for random data. The proof points out that the powers of 2 are spread more evenly than chance, not that they "pass with distinction".

The design note `content/cross-disciplinary/benford-notes.md` (Traditional Chinese, not published) discusses these sources, the teaching choices and the diagnostic points.

## Checking the answers

`tests/cross-disciplinary.test.cjs` recomputes every answer from exact whole numbers (BigInt), without the formulas in the proofs or the lab code:
- **First digits.** The first digits of 2¹ to 2¹⁰⁰⁰ are read from their decimal digits: 30, 17, 13, 10, 7, 7, 6, 5, 5 for 2¹ to 2¹⁰⁰, and 301 starting with 1 for 2¹ to 2¹⁰⁰⁰. The first powers starting with 7 and 9 are 2⁴⁶ and 2⁵³.
- **Decimal answers.** Each is compared with its value, and its rounding rule is checked: the correctly rounded value is accepted, one unit more in the last place is rejected, and one place fewer is rejected.
- **Doubling.** For every x from 1 to 99,999, 2x starts with 1 exactly when x starts with 5 to 9. The whole numbers 1 to 999 have 111 numbers per first digit, and 555 start with 1 after doubling.
- **Units.** The powers 2¹ to 2¹⁰⁰⁰ multiplied by 2, 3, 6, 1024 or 729 stay within 5 of the counts Benford's law predicts for every digit.
- **Chi-square.** χ² for 2¹ to 2¹⁰⁰ and for 1 to 999 is recomputed from the counts. The powers 3¹ to 3¹⁰⁰⁰ pass, and heights from 140 to 200 cm almost all start with 1.
- **Labs.** The lab helpers give the same counts and χ² values.

Both the test and the content were written in this project, so this is a consistency check, not independent certification.

`scripts/test-cross-disciplinary-browser.cjs` walks through every step and lab of the third project in English and Spanish:
- It checks that the labs start empty or on other data.
- It checks the lab results: 2⁴⁶, 30 and 5 after 100 powers, 2⁵³, 555 after doubling, and χ² for the heights and the powers of 3.
- It checks the decimal grading in the page, the authored Spanish at 1440 and 375 px, and the homepage card in every appearance.

## Where it appears

- **Homepage:** the Cross-disciplinary Projects section has a third card, with its own art in each appearance: nine bars of Benford's shares, with the bar for 1 marked. The Classic card shows the formula P(d) = log₁₀(1 + 1/d) above the bars. The scope line counts three cross-disciplinary projects.
- **Project page:** the picker lists all three projects. The card's related Intuition Lab activity is the Statistics one.
- **Saved work:** answers are saved in the same notebook as the first two projects'.
