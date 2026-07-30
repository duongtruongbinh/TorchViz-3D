---
title: Convert Linear Algebra Plaintext Formulas to LaTeX/KaTeX
status: done
created: 2026-07-29
updated: 2026-07-29
author: hienlong
task: "Convert plaintext math formulas in linear algebra lessons to proper LaTeX rendering using KaTeX, and format inline math variables/expressions for completeness and consistency."
supersedes: []
---

# Goal

Replace plaintext math formulas (currently written inside backtick code blocks)
in the 7 linear algebra lesson files with proper LaTeX rendered via KaTeX, using
dedicated `<InlineMath>` and `<BlockMath>` MDX components, and format all inline
math variables, operations, and equations to use `<InlineMath>`.

# Lineage
Genesis plan — no predecessor.

# Decisions (locked)

1. **Component approach over remark plugin** — The project already uses custom
   MDX components (`LessonNote`, `MdxQuiz`, etc.) and has `katex` as a dependency.
   Adding `InlineMath`/`BlockMath` components is consistent with the existing
   architecture and avoids installing `remark-math`/`rehype-katex` (which would
   require changing the MDX pipeline in vite.config.ts).

2. **Two components**:
   - `<InlineMath formula="..." />` — for inline formulas (renders with `displayMode: false`)
   - `<BlockMath formula="..." />` — for display/block formulas (renders with `displayMode: true`)

3. **All 7 files get converted** — `vectors-intuition`, `vector-operations`,
   `dot-product`, `vector-norms`, `unit-vectors-normalization`, `cosine-similarity`,
   `orthogonality`.

# Phases

## Phase 1 — Create plan file
Write and store this plan.

## Phase 2 — Add InlineMath / BlockMath components
Add to `src/components/learning/learningMdxComponents.tsx`:
- Import `katex` and `katex/dist/katex.min.css`
- Define `InlineMath` and `BlockMath` components
- Register them in `sharedAuthoredMdxComponents`

## Phase 3 — Convert formulas in all 7 lesson files
Replace each backtick-enclosed formula with the appropriate component.

### Formulas to convert:

| File | Plaintext | LaTeX |
|---|---|---|
| `vectors-intuition` | (none) | — |
| `vector-operations` | `[a, b] + [c, d] = [a + c, b + d]` | `\begin{bmatrix}a\\b\end{bmatrix} + \begin{bmatrix}c\\d\end{bmatrix} = \begin{bmatrix}a+c\\b+d\end{bmatrix}` |
|  | `[a, b] - [c, d] = [a - c, b - d]` | `\begin{bmatrix}a\\b\end{bmatrix} - \begin{bmatrix}c\\d\end{bmatrix} = \begin{bmatrix}a-c\\b-d\end{bmatrix}` |
|  | `c * [a, b] = [c*a, c*b]` | `c \cdot \begin{bmatrix}a\\b\end{bmatrix} = \begin{bmatrix}c\cdot a\\c\cdot b\end{bmatrix}` |
| `dot-product` | `v . w = (v1 * w1) + (v2 * w2) + ... + (vn * wn)` | `\mathbf{v} \cdot \mathbf{w} = v_1 w_1 + v_2 w_2 + \dots + v_n w_n` |
|  | `v . w = \|\|v\|\| \|\|w\|\| cos(theta)` | `\mathbf{v} \cdot \mathbf{w} = \|\mathbf{v}\|_2 \|\mathbf{w}\|_2 \cos\theta` |
| `vector-norms` | `\|\|v\|\|_2 = sqrt(v1^2 + v2^2 + ... + vn^2)` | `\|\mathbf{v}\|_2 = \sqrt{v_1^2 + v_2^2 + \dots + v_n^2}` |
|  | `\|\|v\|\|_1 = \|v1\| + \|v2\| + ... + \|vn\|` | `\|\mathbf{v}\|_1 = \|v_1\| + \|v_2\| + \dots + \|v_n\|` |
|  | `\|\|v\|\|_inf = max(\|v1\|, \|v2\|, ..., \|vn\|)` | `\|\mathbf{v}\|_\infty = \max\{\|v_1\|, \|v_2\|, \dots, \|v_n\|\}` |
| `unit-vectors-normalization` | `\|\|u\|\|_2 = 1` | `\|\mathbf{u}\|_2 = 1` |
|  | `u = v / \|\|v\|\|_2` | `\mathbf{u} = \frac{\mathbf{v}}{\|\mathbf{v}\|_2}` |
| `cosine-similarity` | `similarity = cos(theta) = (v . w) / (\|\|v\|\|_2 * \|\|w\|\|_2)` | `\text{similarity} = \cos\theta = \frac{\mathbf{v} \cdot \mathbf{w}}{\|\mathbf{v}\|_2 \|\mathbf{w}\|_2}` |
| `orthogonality` | `v . w = 0` | `\mathbf{v} \cdot \mathbf{w} = 0` |

## Phase 4 — Verify
Run `npm run verify` to ensure typecheck, tests, and build pass.

## Phase 5 — Format and Polish LaTeX in Modified Files
Ensure all inline variables, coordinates, operations, and mathematical expressions in the modified lesson files are converted to properly formatted `<InlineMath>` components for a completely polished math experience.

## Phase 6 — Fix LaTeX Double-Escaping Rendering Bug
In MDX JSX string attributes, backslashes are parsed literally (not as markdown escapes). Using double backslashes like `\\mathbf{v}` at the MDX level results in double backslashes at runtime, causing KaTeX to render commands as plain text (e.g. `mathbfv`, `sqrt`). Convert all formulas to use single backslashes in MDX (e.g., `\mathbf{v}`, `\sqrt{...}`, `\\` inside matrix elements for a literal newline).

# Out of scope
- Adding `remark-math`/`rehype-katex` for `$...$` syntax (may revisit later)
- Converting formulas in non-linear-algebra lessons
- Changing any visual styling of formula display
- Adding formula animations or interactivity

# Execution log
- 2026-07-29 — Plan created.
- 2026-07-29 — Added `InlineMath` and `BlockMath` components to `src/components/learning/learningMdxComponents.tsx` and registered them in `SHARED_LEARNING_MDX_COMPONENT_NAMES` in `src/core/learning/mdxContract.ts`.
- 2026-07-29 — Converted 15 plaintext formulas to LaTeX across 7 linear algebra lesson files.
- 2026-07-29 — Fixed pre-existing type error (`quizPalette.title` → `quizPalette.prompt`) in `src/components/learning/domains/math-statistics-ai/mdxComponents.tsx`.
- 2026-07-29 — Updated test expectations in `src/lib/learningCatalog.test.ts` and `src/lib/learningMdxContent.test.ts` to reflect 7 new published lessons.
- 2026-07-29 — `npm run verify` passes (75 tests, typecheck, production build).
- 2026-07-29 — Plan updated to add Phase 5: Formatting/polishing inline math and variables.
- 2026-07-29 — Formatted plaintext math variables, coordinates, operations, and expressions using `InlineMath` across all 7 linear algebra lesson files.
- 2026-07-29 — `npm run verify` passed successfully after formatting changes.
- 2026-07-29 — Updated plan to add Phase 6: Fix LaTeX double-escaping rendering bug.
- 2026-07-29 — Converted all LaTeX formulas to single backslash syntax in MDX to fix the double-escaping rendering bug (which caused KaTeX to output plain text).
- 2026-07-29 — `npm run verify` passed successfully after fixes.
