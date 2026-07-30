---
title: Learning Lab Python syntax highlighting (Shiki v4) + reusable CodeBlock
status: done
created: 2026-07-21T00:00:00+07:00
updated: 2026-07-21T02:30:00+07:00
author: duongtruongbinh
task: "Add Shiki v4 Python syntax highlighting to Learning Lab renderer code, via a reusable theme-aware CodeBlock, and refactor the hand-written Python <pre><code> in tokenizerRenderers.tsx onto it."
supersedes:
  - docs/plans/2026-07-20-refactor-llm-domain-renderers.md
---

# Goal

Highlight every Python snippet in Learning Lab lessons (keyword / string /
number / function / comment / operator) via one reusable `CodeBlock`, and move
the three hand-written Python `<pre><code>` blocks in `tokenizerRenderers.tsx`
onto it — without changing lesson content, quiz behavior, the answer toggle, or
Monaco.

# Lineage

Continues [2026-07-20-refactor-llm-domain-renderers](./2026-07-20-refactor-llm-domain-renderers.md)
(renderer-module split). Touches only the rendering shell of three tokenizer
code blocks, not their content or the MDX API.

# Decisions (locked)

1. **Shiki v4 fine-grained core** (`createHighlighterCore` from `shiki/core`),
   not full/web bundle. Only **python** grammar + **github-dark** theme + JS
   regex engine (`shiki/engine/javascript`, pure JS — no Oniguruma wasm fetch).
   Subpaths verified against the 4.3.1 tarball + `exports` map after install:
   `shiki/langs/python.mjs`, `shiki/themes/github-dark.mjs` exist.
2. **Always-dark surface for now** (per approval). Token colors = github-dark;
   `github-light` deferred until we go theme-following.
3. **Singleton highlighter + async `highlightPython(code): Promise<ThemedToken[][]>`**
   with a module-level `Map` cache keyed by source. No `highlightAll()`, no DOM
   mutation.
4. **`codeToTokens` → manual `<span style={{color}}>`** render (not
   `codeToHtml`) for full layout control.
5. **Shared location** `src/components/learning/code/` (`pythonHighlighter.ts` +
   `CodeBlock.tsx`), not domain-local.
6. **No `language` prop** (only python is bundled). Props: `code: string|string[]`,
   `label`, `variant: 'code'|'output'`, `showLineNumbers?`, `showWhitespace?`,
   `headerTrailing?`, `copyable?`, `themeClasses`.
7. **Whitespace markers in a separate gutter** (`→` indent count + trailing `↵`),
   only via `showWhitespace`. Token content never modified; leading-space tokens
   kept so indentation stays correct.
8. **Stale-result guard** in `usePythonTokens`: `cancelled` flag + source
   compare before `setState` — old resolves dropped on unmount / `code` change.
9. **`manualChunks` not added** — measured, not assumed (see Execution log).

# Changes

- `package.json` — add `shiki@^4.3.1`.
- `src/components/learning/code/pythonHighlighter.ts` (new) — singleton +
  async cache.
- `src/components/learning/code/CodeBlock.tsx` (new) — reusable component
  (code/output variants, line numbers, whitespace gutters, copy button, dark
  surface, stale-safe hook).
- `src/components/learning/domains/llm-ai-engineering/tokenizerRenderers.tsx` —
  refactor 3 Python blocks (`LlmTokenizerCodeStructure` w/ whitespace,
  `LlmTokenizerCodeToIds` w/ answer toggle, `LlmTokenizerRegexWalkthrough`) +
  2 output panels onto `CodeBlock`. Comment-green heuristic removed (Shiki
  colors comments). All lucide imports still used; no `<pre>` left.

# Out of scope

Non-Python snippets (none exist), MDX fenced code (none), Monaco, lesson text,
quiz content, answer-toggle behavior, localization, other renderers.

# Execution log

- 2026-07-21 — Plan created on `feat/learning-lab-python-shiki`; round-2
  refinements folded in (shared location, verified Shiki subpaths, async
  `highlightPython`, stale guard, separate whitespace gutter, no `language`
  prop, measure-first manualChunks).
- 2026-07-21 — **Executed.** Approved with "keep dark surface".
  - `npm install shiki@^4.3.1` (16 packages). Subpaths verified present.
  - Wrote `pythonHighlighter.ts` + `CodeBlock.tsx`; refactored
    `tokenizerRenderers.tsx` (3 code blocks + 2 output panels).
  - **Checks:** `npm run typecheck` clean; `npm test` 75/75 pass; `npm run
    build` ok.
  - **Bundle (before → after):** `LearningLabView` 731.85 kB → **982.48 kB**
    (+250.6 kB / +68.5 kB gzip). Still **under** the 1000 kB limit → no new
    chunk warning; only the pre-existing `three-vendor` 1,116 kB warns. Per
    Decision 9, **no `manualChunks` added**. (Close to the limit — if
    LearningLabView grows past 1000 kB later, isolate `shiki` into its own
    chunk then.)
  - **Not manually browser-verified** (no interactive dev-server run). Render
    correctness inferred from typecheck + build + token-render logic.
- 2026-07-21 — Plan shortened per request; status → done.
