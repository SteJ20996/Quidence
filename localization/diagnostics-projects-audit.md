# Spanish diagnostics and field-project translation audit

Assigned rows: 1233. Translated rows: 972. Skipped technical or formula-only rows: 261.

All prompts, titles, mathematical skill labels, reference solutions, next steps, written-reasoning criteria, scope statements and human-facing captions from the assignment are translated. IDs below are deliberately retained in English as program identifiers, enum values, filenames, or language-independent expressions.

Review performed: every translated row compared against its source. Numeric-token sequences match exactly for every translation. Preserved real-number domains, open/closed endpoints, strict/non-strict inequalities, no/only/every qualifiers, solution counts, clockwise/counterclockwise directions, fictional-model limitations, time conversions, sample versus population distinction, pairing assumptions, fixed confidence-interval interpretation, residual sign and weighted versus unweighted objectives. Mathematical expressions retain original sin/cos notation. Decimal points remain as in US source. Proper names Main Beach, Pocket Beach, Longshore and Cove are preserved consistently across prompts and table labels.

Glossary: rango; nulidad; espacio nulo; mínimos cuadrados; derivable; rapidez (scalar speed), velocidad (signed/vector velocity); residuo = observado menos ajustado; revisión is not a certification of mastery.

Source clarification: actual assets/challenge-bank-v1.js and assets/project-bank-v1.js show lowercase skipped values are field IDs, answer enums, kind flags and dependencies, alongside separately translated captions. Version markers and asset filenames are metadata. det(A) and det(T) are formula-only labels.

Known source versions: older and newer rewritten questions are translated separately; do not substitute the older 108 m²/L≥2x courtyard conditions for latest 100 m²/L≥3x. Likewise, q=(−2,6) and q=(−4,2) are preserved as distinct source versions.

Remaining concerns: application integration must ensure every rendered source key uses these translations, including assembled mismatch feedback and table headers. This audit does not claim empirical assessment validation or legal source clearance.

## Deliberate skipped rows

| ID | Source | Reason |
|---|---|---|
| 13 | `number` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 15 | `choice` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 16 | `multi` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 17 | `yes` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 19 | `one` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 21 | `none` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 23 | `many` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 40 | `original` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 46 | `changed` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 55 | `rank` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 58 | `nullity` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 63 | `consistent` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 71 | `abx` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 74 | `aby` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 76 | `bax` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 78 | `bay` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 80 | `inverse` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 82 | `sum` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 92 | `out1` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 95 | `out2` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 113 | `dot` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 120 | `alpha` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 123 | `beta` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 125 | `sse` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 128 | `exact` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 140 | `lambda` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 151 | `det` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 152 | `det(A)` | Formula-only label; no natural-language translation required |
| 154 | `before` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 157 | `after` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 160 | `orientation` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 166 | `mapped` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 174 | `unique` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 184 | `sumInput` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 187 | `sumOutput` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 194 | `singular` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 196 | `minus2` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 197 | `minus1` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 198 | `zero` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 199 | `two` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 210 | `spaces` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 220 | `pre-algebra` | Internal bank version or course identifier |
| 231 | `left` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 234 | `final` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 244 | `discount` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 247 | `tax` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 255 | `rate` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 258 | `time` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 261 | `amount` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 269 | `boys` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 272 | `girls` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 275 | `total` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 281 | `algebra-1` | Internal bank version or course identifier |
| 300 | `lower` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 303 | `upper` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 305 | `closed` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 308 | `test` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 320 | `long` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 323 | `short` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 330 | `hours` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 333 | `cost` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 355 | `area` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 358 | `length` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 360 | `sqrt2` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 361 | `2sqrt2` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 362 | `4sqrt2` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 364 | `ratio` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 367 | `parallel` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 388 | `radius` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 391 | `fraction` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 401 | `tangent` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 403 | `near` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 405 | `far` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 407 | `product` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 412 | `algebra-2` | Internal bank version or course identifier |
| 421 | `small` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 424 | `large` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 426 | `excluded` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 428 | `three` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 435 | `solution` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 438 | `rejected` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 441 | `valid` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 449 | `zeros` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 451 | `minus3` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 453 | `multiplicity` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 456 | `positive` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 458 | `above3` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 459 | `between` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 460 | `outside` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 488 | `ends` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 490 | `openclosed` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 492 | `closedopen` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 494 | `bothclosed` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 496 | `bothopen` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 499 | `start` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 509 | `angles` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 511 | `one6` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 512 | `half` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 513 | `seven6` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 514 | `three2` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 515 | `eleven6` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 522 | `holeX` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 525 | `holeY` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 528 | `vertical` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 531 | `horizontal` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 541 | `period` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 544 | `middle` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 547 | `minimum` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 565 | `derivative` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 583 | `net` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 586 | `distance` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 589 | `position` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 597 | `maxX` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 600 | `max` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 603 | `minX` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 605 | `min` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 607 | `slope` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 612 | `piecewise` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 622 | `false` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 627 | `conditional` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 638 | `within` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 641 | `cause` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 656 | `mean` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 659 | `variance` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 662 | `newMean` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 665 | `newVariance` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 677 | `residual` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 685 | `cluevera-challenges-1` | Internal bank version or course identifier |
| 686 | `object` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 687 | `undefined` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 688 | `quidence-challenges-2` | Internal bank version or course identifier |
| 695 | `quidence-challenges-3` | Internal bank version or course identifier |
| 699 | `assets/challenge-bank.js` | Asset filename; internal loader metadata |
| 700 | `assets/challenge-bank-v1.js` | Asset filename; internal loader metadata |
| 701 | `assets/challenge-bank-v2.js` | Asset filename; internal loader metadata |
| 702 | `quidence-challenges-4` | Internal bank version or course identifier |
| 703 | `assets/challenge-bank-v3.js` | Asset filename; internal loader metadata |
| 704 | `assets/physics-bank.js` | Asset filename; internal loader metadata |
| 705 | `quidence-challenges-5` | Internal bank version or course identifier |
| 706 | `assets/challenge-bank-v4.js` | Asset filename; internal loader metadata |
| 707 | `assets/physics-foundation-bank-v1.js` | Asset filename; internal loader metadata |
| 708 | `quidence-challenges-6` | Internal bank version or course identifier |
| 709 | `assets/challenge-bank-v5.js` | Asset filename; internal loader metadata |
| 710 | `assets/physics-foundation-bank.js` | Asset filename; internal loader metadata |
| 3798 | `cluevera-projects-1` | Internal bank version or course identifier |
| 3810 | `concentrate` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3818 | `runners` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3821 | `needed` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3824 | `lossReason` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3831 | `prepared` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3834 | `extraConcentrate` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3837 | `extraWater` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3852 | `elevation` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3855 | `climb` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3858 | `heightReason` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3865 | `walking` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3868 | `elapsed` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3871 | `spare` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3876 | `newSpeed` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3879 | `decision` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3896 | `surplus` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3899 | `rounding` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3906 | `freeMinimum` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3909 | `freeReason` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3916 | `adults` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3919 | `students` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3924 | `comparison` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3941 | `root1` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3944 | `root2` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3951 | `low` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3957 | `designReason` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3977 | `map` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3983 | `gridArea` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3986 | `realArea` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3989 | `midline` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3992 | `smallArea` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 3997 | `similarity` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4002 | `centroid` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4013 | `route` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4019 | `walk` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4021 | `direct` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4025 | `shortcut` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4034 | `circleReason` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4049 | `model` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4056 | `early` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4059 | `late` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4061 | `peakTime` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4064 | `peakHeight` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4069 | `ground` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4074 | `hoop` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4087 | `multiplier` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4104 | `limitC` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4107 | `limitR` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4134 | `cross1` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4137 | `cross2` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4140 | `window` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4148 | `lowTime` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4151 | `shift` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4171 | `angle` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4176 | `bearing` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4184 | `rotatedX` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4187 | `rotatedY` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4189 | `verification` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4203 | `turn1` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4206 | `turn2` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4219 | `distanceReason` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4227 | `averageVelocity` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4230 | `averageSpeed` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4237 | `maxPosition` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4240 | `maxTime1` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4243 | `maxTime2` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4245 | `extrema` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4258 | `peakPower` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4261 | `endPower` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4264 | `peakReason` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4274 | `uncapped` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4277 | `average` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4282 | `clip1` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4285 | `clip2` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4287 | `exported` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4290 | `clipReason` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4298 | `sensitivity` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4300 | `sensitivityReason` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4318 | `pairs` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4330 | `interval` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4340 | `claim` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4355 | `mainMean` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4358 | `pocketMean` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4360 | `pooledMean` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4367 | `plastic` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4372 | `weights` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4380 | `plasticGivenPocket` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4383 | `pocketGivenPlastic` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4392 | `sampling` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4414 | `consistency` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4431 | `orthogonal` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4438 | `weightedX` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4441 | `weightedY` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4443 | `weightedError` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4464 | `order` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4471 | `inputX` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4474 | `inputY` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4476 | `det(T)` | Formula-only label; no natural-language translation required |
| 4479 | `areaReason` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4489 | `outC1` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4492 | `outC2` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4494 | `twiceX` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4497 | `twiceY` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4499 | `basisReason` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4510 | `quidence-projects-2` | Internal bank version or course identifier |
| 4518 | `quidence-projects-3` | Internal bank version or course identifier |
| 4529 | `cove` | Internal field ID, type, answer enum, or dependency token; human-facing caption is translated separately |
| 4530 | `assets/project-bank.js` | Asset filename; internal loader metadata |
| 4531 | `assets/project-bank-v1.js` | Asset filename; internal loader metadata |
| 4532 | `assets/project-bank-v2.js` | Asset filename; internal loader metadata |
| 4533 | `quidence-projects-4` | Internal bank version or course identifier |
| 4535 | `assets/project-bank-v3.js` | Asset filename; internal loader metadata |
| 4536 | `quidence-projects-5` | Internal bank version or course identifier |
| 4537 | `assets/project-bank-v4.js` | Asset filename; internal loader metadata |
| 4538 | `quidence-projects-6` | Internal bank version or course identifier |
| 4539 | `assets/project-bank-v5.js` | Asset filename; internal loader metadata |
