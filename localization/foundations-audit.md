# Spanish foundations translation audit

Translated 891 of 995 assigned rows. The remaining 104 rows are technical keys, graph-kind identifiers, or schema/storage identifiers, listed below. No human-facing prose was intentionally omitted.

## Review decisions

- Neutral Latin American Spanish suitable for US students; direct singular tú instructions, without regional voseo. Decimal points remain unchanged, and sin notation remains sin as in the English source and US math notation.
- Foundation → fundamentos; linear map → transformación lineal; vector components → componentes; sample standard deviation → desviación estándar muestral.
- Game-theory action Defect → No cooperar, consistently paired with Cooperar. This denotes the same game action and avoids the misleading literal defect/defecto. Strict versus weak dominance, pure versus mixed strategies, and profitable versus indifferent deviations stay distinct.
- Rows 2361, 2379, and 2385 preserve source TL/TR/BL/BR abbreviations for coordinates in payoff tables; these stand for the original Top/Bottom and Left/Right positions. Parent reviewer may prefer expanded localized cell names if abbreviations are not defined in the interface.
- Row 2445 uses valor de la función for source absolute value, since the initial-condition context contrasts a function’s full value with accumulated change, not the absolute-value operation |F(x)|. Verify this interpretation in unified review.
- Incorrect answer choices are translated as incorrect choices, not corrected. This includes 5268 (domain incorrectly includes 2), 5207–5208 (sampling distractors), and 5223–5224 (random assignment distractors).
- Row 2033 retains the original provenance disclaimer without asserting independent clearance.

## Validation

- TSV has one physical line per ID, exactly one tab per row, no duplicate IDs, and no IDs outside the assignment.
- Numeric-token multiplicities match the source for every translated row.
- All ≤, ≥, ≠, <, >, −, ×, ÷, ², ³, ⁵, √, and ∫ symbol multiplicities match the source for every translated row.
- Manually checked included/excluded boundaries, both-side operations, zero-vector necessity versus sufficiency, reversing inequalities, conditional probability denominators, causal versus generalization claims, and finite secants versus exact derivatives.
- Each excluded string was confirmed present as a quoted literal in its supplied source reference. Mathematical display labels (sin θ, cos 120°, etc.) are retained as human-facing rows even when their translation is identical.

## Excluded technical rows

| ID | Source string | Reason |
| --- | --- | --- |
| 1539 | `game` | Graph/render-kind identifier |
| 1547 | `plot` | Graph/render-kind identifier |
| 1557 | `greater` | Field, answer-option, or state identifier; display label is translated separately |
| 1559 | `decimal` | Field, answer-option, or state identifier; display label is translated separately |
| 1560 | `same` | Field, answer-option, or state identifier; display label is translated separately |
| 1567 | `value` | Field, answer-option, or state identifier; display label is translated separately |
| 1572 | `numberline` | Graph/render-kind identifier |
| 1583 | `five` | Field, answer-option, or state identifier; display label is translated separately |
| 1590 | `proportional` | Field, answer-option, or state identifier; display label is translated separately |
| 1598 | `percent` | Field, answer-option, or state identifier; display label is translated separately |
| 1605 | `expression` | Field, answer-option, or state identifier; display label is translated separately |
| 1607 | `both` | Field, answer-option, or state identifier; display label is translated separately |
| 1608 | `first` | Field, answer-option, or state identifier; display label is translated separately |
| 1618 | `range` | Field, answer-option, or state identifier; display label is translated separately |
| 1636 | `line` | Graph/render-kind identifier |
| 1648 | `rule` | Field, answer-option, or state identifier; display label is translated separately |
| 1650 | `fixed` | Field, answer-option, or state identifier; display label is translated separately |
| 1651 | `repeat` | Field, answer-option, or state identifier; display label is translated separately |
| 1652 | `switch` | Field, answer-option, or state identifier; display label is translated separately |
| 1663 | `area-strip` | Graph/render-kind identifier |
| 1667 | `visits` | Field, answer-option, or state identifier; display label is translated separately |
| 1708 | `reachable` | Field, answer-option, or state identifier; display label is translated separately |
| 1715 | `plane` | Field, answer-option, or state identifier; display label is translated separately |
| 1722 | `rows` | Field, answer-option, or state identifier; display label is translated separately |
| 1724 | `cols` | Field, answer-option, or state identifier; display label is translated separately |
| 1758 | `linear` | Field, answer-option, or state identifier; display label is translated separately |
| 1770 | `image` | Field, answer-option, or state identifier; display label is translated separately |
| 1813 | `row` | Field, answer-option, or state identifier; display label is translated separately |
| 1815 | `top` | Field, answer-option, or state identifier; display label is translated separately |
| 1816 | `bottom` | Field, answer-option, or state identifier; display label is translated separately |
| 1822 | `col` | Field, answer-option, or state identifier; display label is translated separately |
| 1824 | `right` | Field, answer-option, or state identifier; display label is translated separately |
| 1836 | `dominant` | Field, answer-option, or state identifier; display label is translated separately |
| 1844 | `type` | Field, answer-option, or state identifier; display label is translated separately |
| 1846 | `strict` | Field, answer-option, or state identifier; display label is translated separately |
| 1848 | `weak` | Field, answer-option, or state identifier; display label is translated separately |
| 1861 | `mutual` | Field, answer-option, or state identifier; display label is translated separately |
| 1863 | `coop` | Field, answer-option, or state identifier; display label is translated separately |
| 1865 | `defect` | Field, answer-option, or state identifier; display label is translated separately |
| 1873 | `gain` | Field, answer-option, or state identifier; display label is translated separately |
| 1880 | `why` | Field, answer-option, or state identifier; display label is translated separately |
| 1882 | `incentive` | Field, answer-option, or state identifier; display label is translated separately |
| 1885 | `fair` | Field, answer-option, or state identifier; display label is translated separately |
| 1892 | `cells` | Field, answer-option, or state identifier; display label is translated separately |
| 1903 | `pure` | Field, answer-option, or state identifier; display label is translated separately |
| 1910 | `tie` | Field, answer-option, or state identifier; display label is translated separately |
| 1924 | `limit` | Field, answer-option, or state identifier; display label is translated separately |
| 1929 | `hole` | Graph/render-kind identifier |
| 1933 | `exists` | Field, answer-option, or state identifier; display label is translated separately |
| 1955 | `nine` | Field, answer-option, or state identifier; display label is translated separately |
| 1965 | `absolute` | Graph/render-kind identifier |
| 1976 | `meaning` | Field, answer-option, or state identifier; display label is translated separately |
| 1978 | `velocity` | Field, answer-option, or state identifier; display label is translated separately |
| 2000 | `closer` | Field, answer-option, or state identifier; display label is translated separately |
| 2009 | `integral` | Field, answer-option, or state identifier; display label is translated separately |
| 2034 | `cluevera-foundations-1` | Schema/storage identifier |
| 2200 | `cups` | Field, answer-option, or state identifier; display label is translated separately |
| 2222 | `raised` | Field, answer-option, or state identifier; display label is translated separately |
| 2225 | `returns` | Field, answer-option, or state identifier; display label is translated separately |
| 2244 | `minus4` | Field, answer-option, or state identifier; display label is translated separately |
| 2254 | `count` | Field, answer-option, or state identifier; display label is translated separately |
| 2267 | `abRows` | Field, answer-option, or state identifier; display label is translated separately |
| 2269 | `abCols` | Field, answer-option, or state identifier; display label is translated separately |
| 2272 | `baRows` | Field, answer-option, or state identifier; display label is translated separately |
| 2274 | `baCols` | Field, answer-option, or state identifier; display label is translated separately |
| 2281 | `defined` | Field, answer-option, or state identifier; display label is translated separately |
| 2284 | `output` | Field, answer-option, or state identifier; display label is translated separately |
| 2291 | `hsX` | Field, answer-option, or state identifier; display label is translated separately |
| 2293 | `hsY` | Field, answer-option, or state identifier; display label is translated separately |
| 2295 | `shX` | Field, answer-option, or state identifier; display label is translated separately |
| 2297 | `shY` | Field, answer-option, or state identifier; display label is translated separately |
| 2304 | `zeroX` | Field, answer-option, or state identifier; display label is translated separately |
| 2305 | `zeroY` | Field, answer-option, or state identifier; display label is translated separately |
| 2306 | `scaled` | Field, answer-option, or state identifier; display label is translated separately |
| 2313 | `independent` | Field, answer-option, or state identifier; display label is translated separately |
| 2374 | `nash` | Field, answer-option, or state identifier; display label is translated separately |
| 2376 | `better` | Field, answer-option, or state identifier; display label is translated separately |
| 2406 | `local` | Field, answer-option, or state identifier; display label is translated separately |
| 2408 | `wide` | Field, answer-option, or state identifier; display label is translated separately |
| 2415 | `width` | Field, answer-option, or state identifier; display label is translated separately |
| 2417 | `heights` | Field, answer-option, or state identifier; display label is translated separately |
| 2427 | `under` | Field, answer-option, or state identifier; display label is translated separately |
| 2442 | `constant` | Field, answer-option, or state identifier; display label is translated separately |
| 2451 | `cluevera-foundation-followups-1` | Schema/storage identifier |
| 5134 | `variable` | Field, answer-option, or state identifier; display label is translated separately |
| 5137 | `color` | Field, answer-option, or state identifier; display label is translated separately |
| 5155 | `triple` | Field, answer-option, or state identifier; display label is translated separately |
| 5164 | `median` | Field, answer-option, or state identifier; display label is translated separately |
| 5202 | `problem` | Field, answer-option, or state identifier; display label is translated separately |
| 5204 | `selection` | Field, answer-option, or state identifier; display label is translated separately |
| 5206 | `size` | Field, answer-option, or state identifier; display label is translated separately |
| 5221 | `careful` | Field, answer-option, or state identifier; display label is translated separately |
| 5230 | `joint` | Field, answer-option, or state identifier; display label is translated separately |
| 5238 | `reverse` | Field, answer-option, or state identifier; display label is translated separately |
| 5246 | `union` | Field, answer-option, or state identifier; display label is translated separately |
| 5266 | `plus` | Field, answer-option, or state identifier; display label is translated separately |
| 5267 | `minus` | Field, answer-option, or state identifier; display label is translated separately |
| 5275 | `set` | Field, answer-option, or state identifier; display label is translated separately |
| 5276 | `less` | Field, answer-option, or state identifier; display label is translated separately |
| 5282 | `domain` | Field, answer-option, or state identifier; display label is translated separately |
| 5295 | `wrong` | Field, answer-option, or state identifier; display label is translated separately |
| 5328 | `cos` | Field, answer-option, or state identifier; display label is translated separately |
| 5332 | `sin` | Field, answer-option, or state identifier; display label is translated separately |
| 5357 | `log` | Field, answer-option, or state identifier; display label is translated separately |
