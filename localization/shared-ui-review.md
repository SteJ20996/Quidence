# Shared UI Spanish review

Reviewed all prioritized IDs against source-inventory.json and skimmed mathematical, report, saved-record, and uncertainty strings across the shared TSV. No reversal of negation, mastery claim, or weakened significant-figure/decimal-place requirement was found in the prioritized rows.

## Recommended exact replacements

These are terminology or clarity improvements, not discovered changes in mathematical answers. Apply the following full replacement rows if accepted:

```tsv
1360	Usa valores exactos o fracciones, o redondea correctamente las respuestas finales a al menos 3 cifras significativas. Se acepta la notación científica, como 4.83e14 o 4.83×10^14. No redondees a cero los valores pequeños distintos de cero.
1361	Usa números exactos o fracciones, o decimales correctamente redondeados con al menos 2 decimales y 2 cifras significativas. No redondees a cero los valores pequeños distintos de cero; redondea solo las respuestas finales. Las respuestas enteras deben ser exactas.
2048	Para respuestas numéricas irracionales, redondea las respuestas numéricas finales a al menos dos decimales.
2082	El enunciado de razonamiento proporciona la prueba del vector cero. Comprueba la aplicación de esta condición necesaria a una traslación, no la elección independiente de una prueba ni la demostración de linealidad de una transformación arbitraria.
2084	Se proporciona la pendiente de la tangente. Esto comprueba el significado de la notación de derivada, no el cálculo independiente de la pendiente de una tangente.
2086	Se proporcionan la media y la suma de las desviaciones al cuadrado. Esto comprueba el divisor muestral, la raíz cuadrada y las unidades; construir las desviaciones requiere otra tarea.
2087	Se proporciona la forma del cociente de diferencias. Esto comprueba el cálculo y la interpretación de la pendiente de una secante, no la elección independiente del método.
4600	Cualquier crédito automático anterior por la explicación es una sugerencia no validada de un detector, no una etiqueta de comprensión. Revisa de forma independiente la pregunta, las condiciones, el razonamiento exacto y la justificación. Antes de compartir, elimina nombres, escuela, datos de contacto y otra información personal. Usa únicamente herramientas que tengas permitido utilizar; los estudiantes más jóvenes deben trabajar con un padre, madre o profesor. Lee las preguntas, respuestas, explicaciones, contexto de apoyo y revisiones reales de este informe. Sugiere una o dos prioridades de aprendizaje con evidencia específica. Haz una pregunta de seguimiento si el razonamiento es ambiguo. Distingue la falta de evidencia de las respuestas incorrectas y el cálculo de la explicación conceptual. No infieras dominio, esfuerzo ni uso de IA a partir de esta actividad breve. Enseña una idea como siguiente paso, ofrece una pregunta con números distintos y adapta la enseñanza a la respuesta del estudiante.
```

## Reasons

| ID | Reason |
| --- | --- |
| 1360 | Clarity: explicitly avoid rounding nonzero values to zero; no altered threshold. |
| 1361 | Same clarity correction; retain both decimal-place and significant-figure conditions. |
| 2048 | Use the standard mathematical term irracionales rather than the literal no racionales. |
| 2082 | Use transformación consistently with the subject translation rather than aplicación; current wording is mathematically valid. |
| 2084 | Use standard pendiente de la tangente phrasing. |
| 2086 | Use standard desviaciones al cuadrado phrasing; the original translation is understandable but less natural. |
| 2087 | Use standard pendiente de una secante phrasing. |
| 4600 | Fix the unnatural una siguiente idea wording; preserve all report/handoff safeguards. |

## Prioritized rows with no correction required

- 1427/1443: matching fixed components are correctly distinguished from verified explanation or mastery.
- 1458/1459: alternate valid methods, no grammar/keyword/length scoring, review uncertainty, and the local 0–2 rubric remain intact.
- 2049: only final rounding, at least two decimal places AND two significant figures remain intact.
- 2081/2083/2085: supplied-information limits and need for new independent evidence remain intact.
- 2144: at most three examples, selection priority order, question-order tie handling, unreviewed fallback, and no ability ranking remain intact.
- 4600: automated earlier explanation credit remains an unvalidated detector suggestion; missing evidence stays distinct from incorrect answers; mastery/effort/AI-use inference is prohibited. The recommended replacement only improves the final teaching sentence.
- 1303/1304: the apparent fragment mismatch is deliberate Spanish word-order reassembly; together they produce Puedes empezar directamente estos [proyectos/diagnósticos] de varios pasos. Do not restore a literal directly in 1304 without also changing 1303.

## Extractor truncation scan

Read-only AST scan of all JavaScript files in the static-release source whitelist found one prose literal truncated by interpreting a mathematical less-than expression as an HTML tag. The complete literal is provided in foundations-extra-es.json. All other suspicious tag matches were actual HTML/SVG markup (caption, pattern, line, aside).

Physics source: assets/physics-foundation-content.js. The extractor mistakenly removes <f ... u> inside the thin-lens paragraph. Keep u=f, u<f, and u>f exactly; the virtual-image interpretation is not equivalent to the finite real-image case.
