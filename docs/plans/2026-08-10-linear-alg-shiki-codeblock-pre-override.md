---
title: Enable Shiki Python highlighting for fenced code blocks in Linear Algebra lessons via `pre` component override
status: done
created: 2026-08-10T00:00:00+07:00
updated: 2026-08-10T00:02:00+07:00
author: Codex
task: "Convert fenced Python code blocks in linear algebra MDX lessons to use the Shiki-powered CodeBlock component"
supersedes:
  - docs/plans/2026-07-21-learning-lab-python-shiki-codeblock.md
  - docs/plans/2026-07-29-linear-algebra-latex-formulas.md
---

# Goal

Every ` ```python ` fenced code block in the 7 linear algebra lesson files
renders with Shiki v4 syntax highlighting (keywords, strings, numbers, comments,
operators colored), using the existing `CodeBlock` component — without changing
any MDX lesson content.

# Lineage

Continues [2026-07-21-learning-lab-python-shiki-codeblock](./2026-07-21-learning-lab-python-shiki-codeblock.md)
(which created `CodeBlock` + `pythonHighlighter`) and
[2026-07-29-linear-algebra-latex-formulas](./2026-07-29-linear-algebra-latex-formulas.md)
(which migrated the linear algebra lesson formulas to KaTeX but left the
fenced Python blocks as default `<pre><code>`).

# Context

The 7 published linear algebra lessons under `src/content/learning/math-statistics-ai/`
contain Python fenced code blocks:

| File | Lines of Python |
|---|---|
| `vectors-intuition.vi.mdx` | 1 (inline) |
| `vector-operations.vi.mdx` | 9 |
| `dot-product.vi.mdx` | 8 |
| `vector-norms.vi.mdx` | 10 |
| `unit-vectors-normalization.vi.mdx` | 9 |
| `cosine-similarity.vi.mdx` | 13 |
| `orthogonality.vi.mdx` | 9 |

These currently render as default unstyled `<pre><code>` via the MDX pipeline.
The `CodeBlock` component (`src/components/learning/code/CodeBlock.tsx`) and
`pythonHighlighter` singleton (`src/components/learning/code/pythonHighlighter.ts`)
already exist from the earlier Shiki plan and are used in `tokenizerRenderers.tsx`
(LLM domain). No shared MDX component override connects them to fenced code
blocks yet.

# Decisions (locked)

1. **Override `pre`, not `code`, not `CodeBlock` in MDX content.**
   - Overriding `code` would affect both inline code and fenced blocks, creating
     an awkward split. Overriding `pre` cleanly catches only fenced blocks.
   - Not changing any `.mdx` file — no new imports, no JSX in lesson content.
     The override lives entirely in the shared MDX component registry.

2. **Live in `sharedLearningMdxComponents` (not domain-local).**
   - The `pre` override is language-agnostic in its check. It only delegates to
     `CodeBlock` for Python; everything else gets the default `<pre>` fallback.
     This means LLM-domain lessons with `<CodeBlock>` usages already in
     renderers are unaffected.

3. **`MdxPre` detects Python via `children` React element inspection.**
   - `children` is a single React element: `<code className="language-python">`.
     Extract `className`, check for `language-python` or `language-py`, extract
     `children` as code text, render `CodeBlock`. For any other case, render a
     plain `<pre>{children}</pre>`.

4. **All existing `CodeBlock` defaults are used.** No `showLineNumbers`,
   `showWhitespace`, or custom `label`. Copy button is on by default.

5. **No change to the inline ` ``` ` (no-language) block in `vectors-intuition`**
   — it's a single line of plaintext that looks like Python variable assignment
   but has no language tag. The `pre` component will not match it and will fall
   back to default `<pre>` rendering, preserving today's appearance.

# Phases

## Phase 1 — Store this plan

## Phase 2 — Add `MdxPre` to `learningMdxComponents.tsx`
- Import `CodeBlock` from `./code/CodeBlock`
- Import `isValidElement` and `type ReactElement` from `react`
- Define `MdxPre` component with `children` prop
- Register `pre: MdxPre` in `sharedLearningMdxComponents`

## Phase 3 — Verify
Run `npm run verify` (typecheck + tests + build).

# Out of scope
- Adding Shiki languages beyond Python (only `python` grammar is bundled)
- Changing inline code rendering (single backticks)
- Altering the `vectors-intuition` plaintext code block
- Modifying lesson content files
- Light-theme CodeBlock variant (deferred per earlier plan Decision 5)

# Execution log
- 2026-08-10 — Plan created.
- 2026-08-10 — Executed:
  - Added `isValidElement`, `ReactElement` to React imports in `learningMdxComponents.tsx`.
  - Added `CodeBlock` import from `./code/CodeBlock`.
  - Added `MdxPre` component: catches children of `<pre>`, detects Python fenced
    code blocks via `className` regex, renders `CodeBlock` for matches and
    default `<pre>` for everything else.
  - Registered `pre: MdxPre` in `sharedLearningMdxComponents`.
  - **Verification:** `npm run verify` — typecheck clean, 75/75 tests pass,
    production build succeeds. No `.mdx` lesson files were modified.
