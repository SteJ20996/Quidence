# School, mathematics, and physics Spanish translation audit

Translated 1,092 human-facing entries: 1,089 assigned inventory rows in `es-school-models.tsv`, plus the repaired full sentence and two standalone visible labels in `school-extra-es.json`. All human-facing prose, controls, captions, table headings, scope statements, next steps, option captions, feedback and graph labels in this assignment are covered. The other 130 rows are technical identifiers or HTML/SVG construction fragments, enumerated below.

## Review performed

- Neutral Spanish for US students; familiar imperative forms, not literal English syntax.
- Preserved exact digits, decimal points, equation variables, signs, inequalities, physical units and reference-frame directions. An automated per-row numeric-token comparison found zero differences in the 1,089 TSV rows and three extra JSON mappings; duplicate IDs, unknown IDs, extra tabs and multiline TSV rows were also checked.
- Mathematical review retained original rational-domain exclusions after cancellation; both real square roots; distinct roots versus multiplicity; equal reference wholes; area versus length factors; logarithmic argument positivity; and percentage factors versus fixed increments.
- Physics review distinguished signed velocity from speed, momentum from kinetic energy, conservation assumptions from energy transfer, torque from angular acceleration and angular momentum, and linear-spring amplitude from period. Preserved negligible external impulse, zero external torque and independent-model limitations.
- Preserved gauge versus atmospheric pressure, displaced versus object volume, floating versus full submersion, heat versus temperature, absolute kelvin conversion, work sign convention, test-charge dependence versus source field, branch versus source current, magnetic-force direction versus work, constant flux versus induction, real/virtual image boundaries and photon threshold conditions.
- Kept initial predictions and later responses separate; preserved the human-review requirement and explicitly limited inferences about mastery, behavior, effort and AI use.
- Terms: cantidad de movimiento, momento angular, momento de fuerza, campo eléctrico, fuerza neta, fundamentos, revisión. Geometry uses ángulos opuestos por el vértice, catetos, hipotenusa and semejanza.

## Integration concerns requiring root review

1. ID 3567 was truncated by inventory extraction at an unescaped `<` in `u<f`. The malformed partial row is excluded from TSV; `school-extra-es.json` supplies a full exact English-to-Spanish mapping. The actual source in `assets/physics-foundation-content.js:83` is:

   `At u=f, the thin-lens model has no finite image distance. For u<f a virtual-image case requires a different interpretation; the control deliberately stays at u>f.`

   Full replacement Spanish: `En u=f, el modelo de lente delgada no tiene una distancia de imagen finita. Para u<f, el caso de imagen virtual requiere una interpretación diferente; el control se mantiene deliberadamente en u>f.`

   Do not leave the remaining sentence in English or silently omit its virtual-image restriction. Add a full source-string mapping or repair extraction, and ensure `<` remains safe when rendered.

2. IDs 3741 and 3742 include structural HTML prefixes followed by visible labels `Object` and `Image`. Their mixed HTML fragments are excluded from TSV. `school-extra-es.json` provides standalone visible-text mappings to `Objeto` and `Imagen`; mathematical geometry and markup are unchanged.

3. ID 1123 (`down`) is both an internal-looking token and a visible direction in the parabola readout. It is mapped to `hacia abajo` only for visible output; do not change model enum values. Correspondingly, ID 1125 clarifies the axis as `Eje de simetría x =`, preserving the original equation.

4. Inventory strings whose English source contains a line break (course/track slogans) use spaces in the TSV so every mapping remains one physical line. UI can retain the original presentation line break independently.

5. The numeric-token check protects written digits, not all semantics. The meaning checks above are a separate manual review; this audit does not claim certified native-speaker review.

## Intentionally skipped rows

| ID | Source | Reason |
| --- | --- | --- |
| 999 | `_beta01_session_v1` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 1000 | `option-` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 1001 | `string` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 1002 | `boolean` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 1004 | `draft` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 1008 | `sqrt` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 1009 | `reciprocal` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 1010 | `exp` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 1011 | `course-plot-` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 1012 | `<svg class="calculus-graph" viewBox="0 0` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1013 | `" role="img" aria-labelledby="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1014 | `-title` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1015 | `-desc"><title id="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1016 | `-title">` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1017 | `<desc id="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1018 | `-desc">` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1020 | `<path d="M48` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1021 | `H493" stroke="#8595ac"/>` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1024 | `<path d="M` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1025 | `v5" stroke="#8595ac"/><text x="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1026 | `" y="246" text-anchor="middle" class="tick">` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1027 | `<circle cx="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1028 | `" r="7" fill="#276a9c"/>` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1032 | `square` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 1033 | `course-clip-` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 1034 | `<clipPath id="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1035 | `35V244" stroke="#e4e8ef"/><text x="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1036 | `" y="264" text-anchor="middle" class="tick">` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1037 | `<path d="M52` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1038 | `H494" stroke="#e4e8ef"/><text x="44" y="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1039 | `" text-anchor="end" class="tick">` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1040 | `H494" stroke="#8391a5"/>` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1041 | `35V244" stroke="#8391a5"/>` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1042 | `<path d="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1043 | `" clip-path="url(#` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1044 | `)" fill="none" stroke="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1045 | `" stroke-width="3"/>` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1046 | `" r="5" fill="#a84324"/>` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1047 | `" r="4" fill="#6542c0"/>` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1048 | `35V244" stroke="#a84324" stroke-dasharray="5 4"/>` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1053 | `<path d="M153 145L` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1054 | `" stroke="#6542c0" stroke-width="3"/><path d="M` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1055 | `H153" stroke="#087f76" fill="none" stroke-dasharray="4 4"/><circle cx="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1056 | `" r="6" fill="#a84324"/>` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1067 | `" fill="none" stroke="#087f76" stroke-width="3"/><circle cx="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1068 | `<text x="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1072 | `volunteer` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 1079 | `course-model` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 1080 | `dots` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 1081 | `table` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 1082 | `circle` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 1083 | `physics` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 1095 | `random` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 1098 | `assigned` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 1112 | `club` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 1138 | `model-` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 1139 | `<svg class="calculus-graph course-model-graph" viewBox="0 0 520 300" role="img" aria-labelledby="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1140 | `-d"><title id="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1141 | `th scope="row"` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1142 | `model-clip-` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 1143 | `"><rect x="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1144 | `" y="45" width="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1145 | `" height="195"/>` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1146 | `45V240" stroke="#e4e8ef"/><text x="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1147 | `" y="262" text-anchor="middle" class="tick">` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1148 | `H470" stroke="#e4e8ef"/><text x="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1149 | `45V240H470" fill="none" stroke="#8391a5"/>` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1150 | `<path data-zero-axis="y" d="M` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1151 | `H470" stroke="#8391a5"/>` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1152 | `<path data-zero-axis="x" d="M` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1153 | `45V240" stroke="#8391a5"/>` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1154 | `stroke-dasharray="7 4"` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1155 | `" stroke-width="3"` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1156 | `" y="145" transform="rotate(-90` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1157 | `145)" text-anchor="middle" class="axis-label">` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1161 | `149V161" stroke="#8391a5"/><text x="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1162 | `" y="182" text-anchor="middle" class="tick">` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1163 | `" stroke="#6542c0" stroke-width="4"/><circle cx="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1164 | `" cy="118" r="5" fill="#087f76"/><circle cx="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1165 | `" cy="118" r="6" fill="#a84324"/>` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1176 | `<rect x="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1177 | `" y="100" width="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1178 | `" height="70" fill="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1179 | `" stroke="#8595ac"/>` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1218 | `<path d="M65 215H455M260 215L` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1219 | `" stroke="#6542c0" stroke-width="3" fill="none"/>` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1226 | `<path d="M130 225V` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1227 | `225Z" fill="#f1edf9" stroke="#6542c0" stroke-width="3"/>` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1228 | `" y="250" text-anchor="middle" class="axis-label">` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1229 | `" y="162" class="axis-label">c` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1248 | `<rect x="110" y="80" width="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1249 | `" height="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1250 | `" fill="#dcd3f3" stroke="#6542c0" stroke-width="2"/><text x="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 1251 | `" y="185" text-anchor="middle" class="axis-label">` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 3236 | `massA` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 3238 | `speedA` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 3240 | `massB` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 3242 | `speedB` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 3319 | `stiffness` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 3321 | `amplitude` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 3359 | `density` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 3361 | `depth` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 3363 | `volume` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 3401 | `capacity` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 3469 | `series` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 3470 | `voltage` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 3474 | `arrangement` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 3548 | `focal` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 3585 | `frequency` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 3587 | `work` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 3622 | `-lesson-` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 3623 | `-foundations-1` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 3633 | `" text-anchor="middle" font-size="14" fill="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 3634 | `" rx="3" fill="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 3635 | `" stroke="#6542c0" stroke-width="2"/>` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 3644 | `<circle cx="180" cy="145" r="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 3645 | `" fill="none" stroke="#c5cedb" stroke-dasharray="5 5"/>` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 3646 | `" cy="145" r="10" fill="#6542c0"/>` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 3651 | `<circle cx="135" cy="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 3652 | `" r="5" fill="#6542c0"/>` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 3664 | `" cy="145" r="12" fill="#d2ece8" stroke="#087f76"/>` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 3736 | `160v-40l-5 8m5-8l5 8" fill="none" stroke="#6542c0" stroke-width="3"/><path d="M` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 3737 | `" stroke="#087f76" stroke-width="3"/><circle cx="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 3738 | `" cy="160" r="3" fill="#a84324"/><circle cx="` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 3739 | `" cy="160" r="3" fill="#a84324"/>` | HTML/SVG construction fragment or attribute; contains no human-facing prose. |
| 4730 | `numerator` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 4732 | `denominator` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 5058 | `factor` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 5080 | `base` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
| 5122 | `-beta-0.1` | Technical model/record key, enum, type name, or generated identifier; not visible prose. |
