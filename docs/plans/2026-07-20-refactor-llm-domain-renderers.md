---
title: Refactor LLM Domain Renderers
status: done
created: 2026-07-20T00:00:00+07:00
updated: 2026-07-20T00:30:00+07:00
author: Codex
task: "refactor the LLM domain renderer package into smaller cohesive internal modules without changing UI, behavior, content, or the MDX API"
supersedes:
  - docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md
  - docs/plans/2026-07-20-token-id-vocabulary-visual-split.md
---

# Goal

Reduce the maintenance cost of
`src/components/learning/domains/llm-ai-engineering/renderers.tsx`, currently
3,495 lines, by separating its independent renderer families and consolidating
domain-local contracts and helpers.

Success means the LLM domain has clear internal ownership boundaries while its
rendered UI, state transitions, authored lesson content, localization fallback,
component allowlist, and public MDX component map remain unchanged.

# Lineage

This structural follow-up continues the locale-MDX/domain-renderer boundary
established by [Learning Lab Content Architecture and LLM Course](./2026-07-14-approved-llm-lessons-mdx-migration.md)
and the latest renderer additions recorded in [Token IDs, Vocabulary, and
Tokenizer Walkthrough](./2026-07-20-token-id-vocabulary-visual-split.md).

# Context read

- `renderers.tsx` contains 3,495 lines, 23 exported renderers, their private
  subcomponents, 19 content/focus types, asset lookup, palettes, formula
  rendering, and interaction state.
- The file contains three cohesive feature families:
  - tokenizer renderers, approximately lines 320-1,210;
  - language-model, output-head, and loss renderers, approximately lines
    1,252-2,018;
  - roadmap, concept, transformer, scale, and lifecycle renderers,
    approximately lines 268-319 and 2,019-3,495.
- `mdxComponents.tsx` is the only runtime importer of renderer exports. It owns
  the stable mapping required by `LLM_MDX_COMPONENT_NAMES`.
- Authored MDX refers to the adapter names, not to renderer source-file paths.
- Existing source-inspection tests directly read `renderers.tsx`; those tests
  must follow the new domain module boundary without weakening their intent.
- The shared Learning Lab scroll helper is already reused and must remain the
  single implementation.

# Decisions (locked)

- Keep this change entirely inside the `llm-ai-engineering` package, plus the
  narrow tests and existing Learning Lab documentation that describe it.
- Preserve `mdxComponents.tsx`, `llmMdxComponents`,
  `LLM_MDX_COMPONENT_NAMES`, authored MDX tags/props, renderer export names,
  and all runtime output and interactions.
- Keep `renderers.tsx` as a small compatibility barrel so callers retain one
  stable import surface.
- Split implementation by subject, not by one file per component:
  - `tokenizerRenderers.tsx` for tokenizer concepts, code walkthroughs,
    comparisons, round trip, regex, sequence length, and merge training;
  - `languageModelRenderers.tsx` for probability, autoregression, inference,
    vocabulary output, projection, and loss visuals;
  - `conceptRenderers.tsx` for hierarchy, generic concept interactions/panels,
    transformer translation, training lifecycle/components, and scale panels.
- Consolidate domain-local content contracts and common renderer prop aliases
  in `rendererTypes.ts`. These types remain implementation details and do not
  move into the shared `authoredTypes.ts` contract.
- Consolidate only genuinely cross-family domain helpers in `rendererUtils.tsx`
  (theme/prop aliases, asset lookup, or repeated rendering helpers proven
  identical during extraction). Keep feature-specific palettes and helpers
  beside their consumers.
- Do not introduce a new shared Learning Lab abstraction, dependency, visual
  redesign, content rewrite, route change, or MDX schema change.
- Avoid speculative generic components. A helper is extracted only when it has
  multiple real consumers and preserves the existing markup and class strings.
- Preserve module-level KaTeX CSS loading exactly once within the LLM renderer
  dependency graph.

# Phases

## Phase 0 — Approval checkpoint

- Store this draft as the first task write.
- Stop for explicit requester approval.
- After approval, advance the plan through `approved` and `executing` before
  modifying source files.

## Phase 1 — Establish internal contracts and dependency boundaries

- Inventory imports, private helpers, state/effect usage, and cross-references
  for every renderer family.
- Add `rendererTypes.ts` for the domain-local content shapes and shared prop
  aliases.
- Add the minimal `rendererUtils.tsx` surface justified by actual cross-family
  reuse; retain single-use helpers in their feature file.
- Keep import directions acyclic: types/utilities -> feature renderers ->
  compatibility barrel -> MDX adapter.

## Phase 2 — Extract cohesive renderer families

- Move tokenizer renderers and their private helpers without changing JSX,
  class names, state initialization, effects, keys, or event handling.
- Move language-model/output/loss renderers with the same behavior-preserving
  constraint.
- Move concept/roadmap/transformer/scale renderers and their private component
  trees.
- Replace the original implementation file with explicit re-exports from the
  three family modules.
- Keep `mdxComponents.tsx` consuming the same export names from `./renderers`.

## Phase 3 — Tests and documentation

- Update source-inspection tests that assume all implementation text lives in
  `renderers.tsx` so they inspect the relevant LLM domain modules and continue
  asserting the same architectural invariants.
- Add or strengthen a focused wiring assertion for the compatibility barrel and
  stable LLM MDX component map if the existing tests do not cover it.
- Update `wiki/concepts/learning-lab.md` in its existing Active File Map; do not
  create another documentation page.
- Record actual file ownership and any planned consolidation rejected during
  implementation in this plan's execution log.

## Phase 4 — Verification

- Run focused TypeScript and Learning MDX/component-wiring tests during the
  extraction.
- Run `npm run verify`.
- Run `git diff --check` and inspect the final diff for accidental JSX, class,
  MDX API, allowlist, content, or route changes.

# Acceptance criteria

- `renderers.tsx` is a small, explicit compatibility barrel rather than a
  feature implementation file.
- Each renderer has one clear feature-family home and no circular imports.
- Cross-family domain contracts/helpers have one implementation; single-use
  feature details remain local.
- `mdxComponents.tsx` and all authored `.mdx` files keep their existing public
  names and props.
- No UI, interaction, localized copy, lesson content, catalog, route, or
  allowlist behavior changes.
- Existing architectural tests retain meaningful coverage under the new file
  layout.
- `npm run verify` and `git diff --check` pass.

# Out of scope

- Extracting primitives for CV or other Learning Lab domains.
- Redesigning visuals or changing Tailwind classes.
- Rewriting lesson prose, MDX data, quiz content, TOC metadata, or localization.
- Changing shared Learning Lab component APIs or moving LLM content contracts
  into `src/core`.
- One-file-per-component fragmentation or a general-purpose renderer framework.
- Commits, pushes, or pull-request creation.

# Execution log

- 2026-07-20 — Read the mandatory workflow, repository orientation, Learning
  Lab plans/wiki, LLM adapter and renderer inventory, MDX allowlist, authored
  types, direct consumers, and source-inspection tests. Confirmed a clean
  worktree before storing this plan as the first write.
- 2026-07-20 — Requester approved the plan with “đồng ý”. Status advanced
  through approved to executing; source extraction began.
- 2026-07-20 — Split the 3,495-line implementation into tokenizer (919 lines),
  language-model/loss (785 lines), and concept/roadmap (1,602 lines) renderer
  families. Replaced `renderers.tsx` with a three-line compatibility barrel and
  retained all 28 original exported renderer functions.
- 2026-07-20 — Consolidated 23 domain-local content/focus contracts in
  `rendererTypes.ts`. Kept feature palettes and helpers local after the
  dependency audit found no identical cross-family helper worth a separate
  `rendererUtils.tsx`; this avoids a speculative utility dumping ground.
- 2026-07-20 — Updated the two source-inspection tests to read the renderer
  family boundary while preserving their original architectural assertions.
  Updated the existing Learning Lab Active File Map. No MDX source, adapter,
  allowlist, catalog, localization, route, or renderer markup was changed.
- 2026-07-20 — `npm run verify` passed TypeScript and all 75 tests. A separately
  observed production build completed with 2,529 transformed modules; the
  existing large-chunk advisory remained informational. `git diff --check`
  passed.
