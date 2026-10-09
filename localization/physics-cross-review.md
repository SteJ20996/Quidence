# Physics terminology and full-string cross-review

Reviewed `es-physics-tasks.tsv` together with the physics section of `es-school-models.tsv` (IDs 3233–3758), the corresponding English sources and the school extra mappings.

## Findings

No substantive mistranslation found in the physics concepts reviewed. Numeric solutions, signs, units and conditions are preserved. Terminology agrees across the two assignments:

| Distinction | Translation and review result |
| --- | --- |
| Speed / velocity | rapidez / velocidad. Signed velocity, constant velocity versus acceleration, path length versus displacement, and angular speed are distinct. |
| Force / momentum | fuerza / cantidad de movimiento. Net force is fuerza neta; negligible external horizontal impulse remains the conservation condition. |
| Work / energy / power | trabajo / energía / potencia. Kinetic energy can transfer to thermal/internal energy without being destroyed. Wout remains work performed by the system, so ΔU=Q−Wout retains its sign convention. |
| Torque / angular momentum | momento de fuerza / momento angular. Axis, lever arm and inertia are retained; conservation requires zero external torque and is not substituted for the applied-force model. |
| Electric field / potential / potential energy | campo eléctrico / potencial eléctrico / energía potencial. E and V depend on the source; F=qE and U=qV depend on test-charge sign. Zero probe charge does not eliminate the source field. |
| Lens images | imagen real / imagen virtual. Negative magnification indicates inversion. u>f controls real images; u=f has no finite image distance, and u<f needs a separate interpretation. |
| Pressure / buoyancy | presión manométrica / fuerza de flotación. Atmospheric reference, displaced volume, object mass and support-force boundaries remain distinct. |
| Magnetic force / induction | fuerza magnética / inducción. Perpendicular magnetic force does no direct work; induced emf requires a change in flux, not merely nonzero flux. |
| Photon frequency / brightness | frecuencia / brillo. Frequency sets energy per photon. Greater brightness does not defeat the single-photon threshold; negative computed kinetic energy represents no emission. |

Deliberately false answer choices remain false. No answer options or counts were changed. Introductory-model limitations, non-validation claims, independent experiment requirements and human-review requirements remain explicit.

## Minor wording suggestions for root review

These are clarity suggestions, not mathematical errors. Other agents’ TSV files were not edited.

- School row 3261 renders “joined speeds” as “velocidades después de unirse.” Both examples move in the positive direction, so there is no changed numerical result. For strict glossary consistency, use “rapideces después de unirse.”
- School row 3493 renders “charge use” as “consumo de carga.” The surrounding content correctly denies consumption of charge. The heading could avoid briefly suggesting it with “Distingue la corriente de la transferencia de carga.”
- “Promedio” and “media” are both acceptable for average emf, power and velocity; mathematical meaning is consistent.

## Full AST string check

Used Node’s bundled Acorn parser, without a third-party service or dependency install, to parse complete JavaScript string literals in physics banks, foundation content/models, legacy physics models/content and project drawing controls. Examined 2,553 literals and checked prose containing ASCII inequalities against the exact source inventory.

Only one full prose string was absent: the lens model-boundary sentence in `assets/physics-foundation-content.js:83`. It is already correctly represented, in full, by `school-extra-es.json`. Its u=f, u<f and u>f conditions were checked against the source. No duplicate mapping was added.

`physics-extra-es.json` is an empty object because there are no additional unrepresented physics strings in this check. Existing inequality prose in physics tasks (B>0; 3+36/B≤8; B≥7.2 N) and lens guidance remains complete in the TSV catalog.

## Integration correction

Updated my own row 5548 to use a space between its two sentences instead of a literal backslash-n, matching the build’s whitespace normalization and the school translation convention. Source text and presentation layout were not edited.

This is a careful cross-review, not an independent native-speaker certification or empirical validation of the educational models.
