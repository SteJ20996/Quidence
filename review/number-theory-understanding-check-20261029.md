# Number Theory understanding check · 2026-10-29

Number Theory now has a four-problem "Test your understanding" check at `diagnostics/?module=number-theory`. It joins the existing diagnostic page and report flow. The homepage card, the course page's top bar, the knowledge map and the diagnostics subject menu all link to it.

## Problems

| Id | Group | Difficulty | What it checks |
| --- | --- | --- | --- |
| `nt-c01` | Divisibility and factorization | medium | gcd by the Euclidean algorithm, which totals a linear combination can reach, and one Bézout pair by back-substitution |
| `nt-c02` | Divisibility and factorization | challenging | divisor counting from prime exponents: all divisors, odd divisors, divisor pairs as rectangles, and square divisors |
| `nt-c03` | Congruences and powers | medium | a modular inverse, solving with it, and counting solutions of `ax ≡ c (mod n)` from `gcd(a, n)` |
| `nt-c04` | Congruences and powers | challenging | the order of 2 modulo 11, reducing an exponent with that cycle, repeating last digits, and which primes always divide `n⁵ − n` |

Each problem has four answer fields (16 in total), a written explanation, a worked solution and a follow-up question. Answers in later fields that depend on an earlier wrong value are marked "recheck after", not as a separate weakness. The written explanation is saved and exported but not scored.

The check assumes the Number Theory foundation check's content: division with remainder, prime factorization, gcd and lcm, and modular addition and multiplication. Complete written proofs, induction, the Chinese remainder theorem with several moduli, quadratic residues and analytic number theory are listed as not checked.

## Versioning

Published diagnostic tasks are never edited in place. The previous bank is frozen as `assets/challenge-bank-v6.js`, and `assets/challenge-bank.js` is now `quidence-challenges-7`. It adds the `number-theory` module from `assets/number-theory-challenge-bank.js`. All eleven earlier modules are identical to version 6. Reports saved with version 6 keep opening under their own definitions, and new Number Theory sessions use version 7. A regression test covers this in `tests/challenges.test.cjs`. The pre-rename fixture in `tests/brand-compat.test.cjs` now also gets an empty Number Theory module when migrated.

## Mathematics

`scripts/audit-challenges.py` recomputes the 16 answers by brute force: it enumerates the divisors of 360, residues modulo 10 and 26, and powers modulo 11. It checks `n⁵ − n` for n from −60 to 60. It does not read the authored answer keys. The audit now covers 62 tasks and 243 answer components. Both implementations were written in this project, so this is a consistency check, not independent human certification.

## Language

The check follows the existing diagnostics languages, English and Spanish. It is not a voice or AI activity, so the English-only policy does not apply. `localization/number-theory-diagnostic-extra-es.json` holds 67 Spanish strings: scope, groups, titles, prompts, field labels, skills, feedback, solutions and follow-ups. They use the foundation check's terms "mcd" and "(mód n)". Learner explanations are never translated or rewritten.

One gap is shared with the other modules. The "Recheck after <field>. This result may follow from an earlier value…" sentence is assembled at run time and only its first words are in the Spanish catalog.

## Other changes

- The diagnostics page offers no "Field projects" link for Number Theory. Its proof projects are on the course page, which "Start learning" already opens. `projects/?module=number-theory` stays out of search indexing; the check itself is indexable.
- The homepage scope line now counts 56 diagnostic problems (English and Spanish).
- The Number Theory card no longer shows "Understanding check: not available yet".

## Validation

Local runs used Node 22; CI uses the pinned 24.19.

- `npm test`: 332 of 332 Node tests pass. This includes the 62-task math audit, the bank 6 → 7 compatibility test and the source ledger check.
- All 14 browser suites in `checks.yml` pass in Chromium.
  - Activity suite: 92 pages and 50 drafts across four widths, including the Number Theory check, with no page errors or failed requests.
  - Spanish suite: 76 tasks and 21 reports with no English residue.
  - Themes suite: the Classic card row alignment and the card-height rule still hold.
- Screenshots in all four appearances at 1440px and 320px show no horizontal overflow in English or Spanish. At 320px the course page's two top-bar links stack, adding 31px to the bar.
- Not checked: Safari and real devices.
