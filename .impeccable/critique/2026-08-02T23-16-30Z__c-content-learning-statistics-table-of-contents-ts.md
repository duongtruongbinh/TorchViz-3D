---
target: toàn bộ Chương 1 Xác suất và Chương 2 Thống kê
total_score: 35
max_score: 40
na_heuristics: ""
p0_count: 0
p1_count: 0
timestamp: 2026-08-02T23-16-30Z
slug: c-content-learning-statistics-table-of-contents-ts
---
# Impeccable critique — Probability & Statistics Chapters 1–2

Assessment provenance: dual-agent review. Assessment A inspected wording, hierarchy, page focus, visual meaning, and teaching flow before seeing detector output. Assessment B independently ran the deterministic detector and performed a source-level accessibility audit. Browser automation was unavailable, so responsive and visual-state judgments use renderer source, MDX structure, and automated build evidence.

## Design-specificity verdict

The lesson sequence now feels specific to a beginner probability/statistics product: each page advances one mathematical question, examples persist across adjacent pages, and the interaction sequence follows the learner's calculation order. The strongest signature is the restrained blue/neutral instructional system paired with semantic green, amber, and red states. The main remaining generic element is the sourced historical photograph in 1.7; it could be replaced later by one locally generated, simple probability-history doodle.

## Nielsen heuristics

| Heuristic | Score | Evidence |
| --- | ---: | --- |
| 1. Visibility of system status | 4/4 | The frequency simulation starts paused and exposes Start, Pause, Replay, progress, and a polite status message. |
| 2. Match with the real world | 4/4 | Dice, deliveries, students, sampling, email, and study-design examples use direct beginner language. |
| 3. User control and freedom | 4/4 | Stateful activities can pause, replay, reset, and revise answers without losing lesson position. |
| 4. Consistency and standards | 3/4 | Semantic colors and takeaway pages are consistent; some inherited English glosses remain more prominent than necessary. |
| 5. Error prevention | 3/4 | Quiz feedback and input error states identify common denominator, conditioning, and causal-inference mistakes; not every older quiz distractor is equally diagnostic. |
| 6. Recognition rather than recall | 3/4 | Examples and formulas are adjacent to most tasks; the email calculation still asks learners to remember the preceding dataset page. |
| 7. Flexibility and efficiency | 3/4 | Keyboard navigation, touch targets, responsive pager, and semantic scroll regions are supported; there is no compact formula reference inside exercises. |
| 8. Aesthetic and minimalist design | 4/4 | Overloaded Chapter 2 pages were split, duplicated visuals removed, and arbitrary purple/green decoration normalized. |
| 9. Help users recover from errors | 4/4 | Quiz and practice feedback explains the misconception and points to the correct comparison or denominator. |
| 10. Help and documentation | 3/4 | Every theory node has a standalone takeaway and code pages state what output to observe; a few advanced English terms remain. |

**Total: 35/40**

## Cognitive-load assessment

- Each theory page now carries one primary focus and no more than two teaching claims.
- Chapter 2's former single-page population/sample/study-design wall is now five pages with one interaction per practice page.
- The Bayes hand calculation separates learner attempt from answer disclosure.
- The Chapter 2 quiz appears after all three theory nodes and tests application rather than pandas syntax.
- Remaining load risk: 1.9 probability-entry pages refer back to a dataset on the preceding page.

## Emotional journey

The chapters now start with familiar concrete situations, build confidence through small calculations, and end with concise takeaways and applied quizzes. The main former valleys—formula walls in 1.8, the dense seven-domain atlas, and the advanced assumptions/remedies wall—have been removed. The completion state is now visually positive without sacrificing text contrast.

## Strengths

1. Strong concept sequencing: outcome → event → probability → conditioning → total probability → Bayes.
2. Visuals now earn their place by showing set relations, convergence, sampling bias, causal evidence, or truncated axes.
3. Accessibility is materially improved through semantic tables, visible focus, 44px controls, pressed/error/status states, and non-hijacked interaction keys.

## Priority issues

- **P2 — History visual cohesion:** the remaining sourced photograph in 1.7 is stylistically less consistent than the code-native lesson visuals. Consider a single cute, simple doodle showing de Méré's question → 1654 letters → formal probability, with three short labels and no portrait pair.
- **P2 — Exercise memory bridge:** keep a compact, non-answer-revealing representation of the eight-email dataset visible on the prior/likelihood page, or provide an explicit “Xem lại dữ liệu” disclosure.
- **P2 — Terminology polish:** progressively replace decorative italic English glosses with plain parenthetical glosses only where the English term is useful later.

## Persona red flags

- A first-time learner may still interpret Naive Bayes score as a normalized probability; feedback should continue to state that score comparison does not require normalization.
- A keyboard-only learner needs every future custom visualization to follow the same button/state conventions introduced here.
- A mobile learner may need an explicit visual hint that wide data tables can scroll horizontally.

## Minor observations

- The retained truncated-axis image provides a real comparison insight and should not be replaced by decoration.
- The probability-history image should be replaced only when a locally generated asset is materially clearer and its source status is explicit.
- The legacy Statistics renderer remains large; broader decomposition is outside this review's scope.

## Provocative questions

1. Could the learner explain why observational evidence is not automatically causal without recalling a definition word-for-word?
2. If every color were removed, would labels, icons, and structure still communicate correct, warning, and error states?
3. Does every animation end on one sentence the learner can say back in their own words?
