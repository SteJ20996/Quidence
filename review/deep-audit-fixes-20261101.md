# Deep audit fixes · 2026-11-01

An outside deep audit of commit `335beb2` recomputed the published questions independently. It found no wrong answer key, proof or translation of meaning. It did confirm problems in how answers are checked, in input formats and in some wording. Each finding below was checked against the source before it was changed. All were confirmed, and every fix has a test that fails on the code before the fix.

## Checking answers

1. **A correct unit from the field label was refused (47 fields).** The page says an optional unit must match the field label, but the engine recognised only a short list of units. "68 cm²", "4.8 L", "3 km", "36 kW" and "50 $" could not be saved. Bare numbers always worked, and no saved result was wrong.
   - **Fix:** the engine now recognises every unit that labels request, in their final parentheses:
     - currency and percent: $ and %;
     - L, km, km/h, min, min², kW, kWh and cm²;
     - word units: litres, hours, degrees, units², grid units², items/100 m and cm per minute.
   - It also accepts the forms shown on the Spanish page, such as litros, horas, grados and objetos/100 m, and a dollar sign written in front ($50, −$2).
   - Final parentheses that are notation are not treated as units: f(3), W(4), (mod 10), P(… | …).
   - Prefixes are still not converted, so 60000 cm² does not match an answer in m².
   - **Saved work:** no stored answer had a unit the old rule refused, because those answers could not be saved. Saved submissions therefore re-check exactly as before.
   - **Test:** all 244 unit-labelled number fields, current and historical, accept `answer unit` and the bare number, and reject a different unit.
2. **Linear Algebra accepted 2.004 for 2 in three more places.** The 2026-11-01 site-audit fix made the vector diagnostic exact but missed three places: the learning engine, the lesson checkpoint and the Matrix Explorer prediction. All three still accepted a 0.005 tolerance, and the report then gave positive advice. All answers there are exact, so all three now require an exact match.
3. **Matrix Explorer called a tiny invertible matrix singular.** It used an absolute determinant threshold of 10⁻¹⁰ and accepted any entry from −3 to 3, although the inputs declare steps of 0.5. Both entry routes now require steps of 0.5: the input field and the page tool.
   - Every preset already uses steps of 0.5.
   - With such entries the determinant is computed exactly, so rank is decided with no tolerance.
4. **The Coordinate Geometry project accepted 50.09 for a distance of 50.** The page asks for distances rounded to two decimal places, but the check allowed 0.06 or 0.1.
   - A distance must now be within half a hundredth of the exact value.
   - Points come from a half-unit grid or typed coordinates, so "equal distances" and "on the road" are now exact. A typed point such as (6.01, 5.01), which made the two walks unequal, is no longer called fair.
5. **MathVoice accepted 27.01 for 27.** It allowed ±0.02 while telling learners that two decimal places are enough. A number now matches when it rounds correctly to two places. The fix is in the source and in the published mirror. The activity stays English-only.

## Wording, translation and the report viewer

6. **Follow-up count:** the Linear Algebra materials said "up to 3 optional follow-ups", but the diagnostic serves up to 4. The text now says 4. The engine is unchanged, so saved sessions keep their follow-ups.
7. **Untranslated choice:** the Algebra II option "x < −1 or x > 3" is now translated: "x < −1 o x > 3".
8. **Saved reports draw the given material.**
   - The viewer now draws each question's table, matrix or graph from the task definitions saved in the snapshot.
   - The earlier site-audit note wrongly said snapshots lacked these definitions; it has been corrected.
   - No published definition contains < or >. A snapshot whose given material does is not drawn, and its Markdown still holds the material as text.
9. **Benford.**
   - Step 1 no longer says the uneven count is "much more than chance would explain": the powers of 2 are a fixed list, not a sample.
   - Step 6 now presents χ² ≈ 0.22 as a distance, and says the 15.51 cutoff is set for random samples.
10. **Smaller wording fixes:**
    - The Intuition Lab chord problem says no three chords meet at one point *inside the circle*.
    - Number Theory nt-p09 says the largest impossible size 7b − 5 holds for b = 1 to 4.
    - nt-p03 speaks of swapping two *different* symbols.

## Not changed

- **Foundation question bl-f10.** "Children under 12 ride free" is a sufficient condition, while the key reads it as the whole fare rule. The foundation bank has no version history, so changing the question text would change what earlier records show. This should be done together with versioning for foundation questions, in a later change. The project rule with the same issue (bl-p01) was already revised under a new project-bank version.
- **Partial uncertainty.** Marking one part of a two-part question as uncertain marks the whole question. This is a design choice, not a grading error, and changing it affects every check's records.
- **Fractions in Intuition Lab.** The activity does not accept fractions such as 3/4, though 0.75 works. The activity asks only for a finite number, so this is a possible enhancement.
