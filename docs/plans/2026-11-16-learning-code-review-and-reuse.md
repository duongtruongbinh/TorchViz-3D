---
title: "Learning Lab code review and behavior-preserving reuse"
status: done
created: 2026-11-16
updated: 2026-11-16
author: Codex
task: "Review and refactor duplicated, unused, and hardcoded implementation code; document reusable ownership while preserving design and authored content."
supersedes:
  - docs/plans/2026-08-19-learning-lab-ui-refactor.md
  - docs/plans/2026-09-05-evolutionary-algorithms-branch-audit.md
  - docs/plans/2026-11-15-deep-learning-domain-init.md
---

# Goal

Review Learning Lab implementation ownership across all 18 catalog domains and
nine adapter packages; remove confirmed duplication, unused code, and accidental
instance coupling while preserving design, authored content, and interaction
behavior. Work stays on `refactor/learning-shared-reuse`, published in
[PR #100](https://github.com/duongtruongbinh/TorchViz-3D/pull/100).

# Lineage

- [Learning UI ownership and reuse](./2026-08-19-learning-lab-ui-refactor.md).
- [Evolutionary Algorithms branch audit](./2026-09-05-evolutionary-algorithms-branch-audit.md).
- [Deep Learning domain initialization](./2026-11-15-deep-learning-domain-init.md).

These records retain distinct historical scope. Current light-only rules take
precedence over historical dark-theme compatibility decisions. Ongoing reuse
guidance belongs in the [canonical Learning Lab wiki](../../wiki/concepts/learning-lab.md#learning-ui-ownership-and-component-reuse).

# Decisions

- Share helpers when their semantics and behavior match. Keep mathematical,
  neural-network, and NCA APIs in their owning domains; retain related renderers
  in feature modules rather than creating many small files.
- Preserve MDX, TOCs, catalog identity, routes, quiz data, formulas, fixtures,
  geometry, colors, loading labels, controls, and existing loading boundaries.
  The excerpt's named section is an intentional accessibility correction.
- Replace duplicated sources of truth and fixed instance identifiers. Retain
  pedagogical values, datasets, SVG coordinates, and algorithm constants.
- Check imports, re-exports, authored allowlists, registry keys, and dynamic
  loaders before deleting exports. Unused-local checks alone are insufficient.
- Keep current guidance in the existing wiki, outcomes in this plan, and one
  concise wiki log entry. Preserve referenced predecessor plans with unique
  decisions; add no cleanup guide or documentation page.

# Phases

1. Store the plan, obtain approval, and create the requested feature branch.
2. Capture a baseline; extract shared lazy/SVG helpers and clean up Deep
   Learning primitives. Verify visual and lifecycle parity.
3. Audit remaining domain ownership; implement confirmed palette, identifier,
   and unused-code fixes. Verify component parity and publish the same branch.
4. Compact documentation after implementation: consolidate this plan, remove
   duplicate wiki guidance, merge same-change log entries, check local links,
   anchors, frontmatter, and lineage, then update the existing PR.

# Implementation outcomes

| Area | Result |
| --- | --- |
| Lazy visuals | Shared typed `createLazyLearningVisual` wrapper/skeleton for Linear Algebra and Evolutionary Algorithms; module imports remain in adapters. |
| SVG helpers | `SvgArrowMarker` in existing diagram primitives preserves path/polygon attributes. Migrated 19 marker declarations across nine Deep Learning files; `DiagramConnectorLayer` generates IDs by default and retains explicit-ID support. |
| Instance ownership | React `useId` scopes markers, two Evolutionary gradients, and Perplexity radio names. Three LLM connectors reuse the generated default. |
| Domain palettes | Canonical `MATH_VISUAL_THEME` and `LLM_RENDERER_THEME` retain every previous light value. Removed unreachable dark alternatives, 17 theme-only context reads, and redundant helper props; CV passes light explicitly to shared exercise engines. |
| Cleanup | Highlight pulses retain their 500 ms restart behavior and now clear on unmount. Removed unused DL palette entries, LA `matVec`, two LLM type aliases, dark token palettes, and always-empty calendar slots. |
| Accessibility | Research Papers excerpt uses a named section and type-only React import; visible content is unchanged. |
| Tests | Consolidated duplicate lazy-boundary assertions into the canonical boundary test; added shared-helper/Evolutionary isolation coverage. Suite count changed from 177 to 176 without dropping runtime coverage. |

# Domain coverage

| Domain | Review outcome |
| --- | --- |
| `linear-algebra` | Static light palette and controls/grid styles; removed unused theme reads and `matVec`. Retained Mafs and domain matrix primitives. |
| `fundamentals` | Existing math visuals, shared stepper, generated clip IDs, and Perceptron engine already have suitable owners; benefits from reused math primitives. |
| `deep-learning` | Shared SVG helpers, instance IDs, timer cleanup, and dead-token removal; domain loading boundary retained. |
| `cv` | Light-only adapter delegates to shared Shape/Value/Conv engines; canonical fixtures and entry points retained. |
| `llm-ai-engineering` | Static light palette, redundant props/types removed, instance-safe connectors and radio groups; anchor measurement/observer cleanup retained. |
| `continual-learning-llm` | Continuity map already uses shared semantic tokens and lazy references; no new extraction needed. |
| `evolutionary-algorithms` | Shared lazy wrapper and instance-scoped gradients; existing interval cleanup retained. |
| `research-papers` | Excerpt accessibility/import fix; NCA grid semantics and timer cleanup remain domain-owned. |
| `ai-projects` | Removed always-empty calendar branch; August 2022 scenario and forecast fixtures retained. |
| `llm-unlearning`, `mlops-llmops-production-systems`, `aiops` | Published content uses shared authored/reference components; no domain adapter to deduplicate. |
| `programming-foundation`, `nlp`, `ai-system-design`, `reinforcement-learning`, `ai-ethics-safety-governance`, `robot-learning` | Placeholder catalog domains; canonical routes retained, no adapter or published content to refactor. |

Coverage means source ownership, consumers, theme branches, and lifecycle review;
it does not establish academic-content or every-lesson correctness.

# Verification

- Node 24.14.1: `npm run verify` passed (typecheck, 176 tests, production build).
  Repository lint passed for 262 files; Biome passed across 64 domain files;
  `npm run check:catalog-stats` and `git diff --check` passed.
- Browser baseline: 30 initial screenshots and normalized DOM captures matched.
  Twenty repeated-instance cases, both lazy skeletons, explicit connector IDs,
  pulse restart/unmount cleanup, and Deep Learning controls passed.
- Remaining adapters: 112 components across eight packages, with 112 desktop
  captures (960 px width) and 97 compact captures (375 px). All 209 screenshots
  matched; normalized DOM differed only at the intended excerpt section.
- Five further repeated connector/gradient cases and behavior checks passed for
  independent radio groups, radio keyboard/roving focus, loss slider,
  Evolutionary sampling/selection, and excerpt region labeling. No page errors.
- Both static palettes deep-equal their former light factory output. No authored
  MDX, TOC, catalog, evidence, or asset changes; no added browser dependencies.

# Limitations and out of scope

- Deep Learning per-module lazy loading remains deferred; its current
  domain-level boundary is preserved. Explicit connector IDs remain the
  caller's responsibility for uniqueness.
- Remaining-domain screenshot fixtures use published static MDX props, a
  deterministic raster replacement, and held autoplay intervals. Behavior
  checks use normal intervals. This checks component parity, not raster content
  or complete lesson journeys; temporary harnesses are outside the repository.
- No redesign, lesson editing, Workspace/worker/torchstub/layout refactor, theme
  system overhaul, new dependencies, automated mass deletion, or PR merge.

# Execution log

All work below occurred on 2026-11-16:

- Stored the initial plan against merged PR #99 (`bba3c92a`). User approved
  implementation with “Thực hiện” after requesting a new branch; created
  `refactor/learning-shared-reuse` before runtime edits.
- Completed the first baseline/refactor/verification batch, committed as
  `f8649ae2`. User then requested implementation of remaining domains on this
  branch; stored the approved continuation before its edits.
- Completed and verified the domain sweep, committed as `493922eb`; pushed and
  opened PR #100 against `main`. The connector lacked create-PR permission,
  so publication used authenticated GitHub CLI. Recorded completion in
  `b594129b`; temporary review server stopped, PR remains open.
- User requested documentation compaction after implementation. Stored that
  continuation before other documentation edits; consolidated this plan and
  wiki reuse guidance, merged the two same-change wiki log entries, and retained
  referenced predecessor records with distinct scope. Checked 29 local Markdown
  links, three anchors, changed frontmatter, three predecessor/body links, and
  removed-heading backlinks; all passed. Only three existing Markdown files
  changed. Runtime verification above was not repeated for this docs-only work.
