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

Establish a repeatable review approach for content-heavy PRs and complete a
bounded first cleanup of Deep Learning diagrams and shared Learning runtime
helpers. Preserve visible design, authored lessons, routes, quiz payloads,
formulas, example values, and existing interaction behavior.

The first-batch scope is a proposal based on the latest merged PR, #99
(`bba3c92a`), rather than a claim that the entire repository has been audited.

# Lineage

Builds on:

- [Learning UI ownership and reuse](./2026-08-19-learning-lab-ui-refactor.md).
- [Evolutionary Algorithms branch audit](./2026-09-05-evolutionary-algorithms-branch-audit.md).
- [Deep Learning domain initialization](./2026-11-15-deep-learning-domain-init.md).

These completed records remain historical references. This plan governs the
new cleanup only. Current AGENTS.md light-only rules take precedence over
historical plans that retained dark variants.

# Review findings

| Finding | Evidence | Consequence and proposed action |
| --- | --- | --- |
| Duplicated lazy component machinery | `domains/linear-algebra/mdxComponents.tsx:6–35` and `domains/evolutionary-algorithms/mdxComponents.tsx:6–34` repeat the same skeleton and `lazyNamed` implementation; only the accessible loading label differs. | Extract one typed helper with an explicit loading label, retaining the exact current loading markup/classes and module factories. |
| Repeated SVG marker definitions and fixed IDs | Deep Learning diagrams repeat `<marker>`/`<path>` blocks. Examples: `BackpropCycleDiagram.tsx:21`, `LossFunctionDiagram.tsx:33`, `FullyConnectedDiagram.tsx:678`. Several summary variants all declare `summary-arrow`; `GradientDescentDirectionDiagram.tsx:121` derives IDs only from preset keys. | Shared marker markup can eliminate real duplication. Instance-scoped IDs prevent collisions when diagrams repeat. This is a reuse hazard identified by source inspection; no visual failure has been reproduced. |
| Pending timer survives unmount | `domains/deep-learning/primitives.tsx:15–30`: `useCodeHighlightPulse` clears the previous timeout on another pulse but has no unmount cleanup. Used by Activation, Loss, and Fully Connected explorers. | Add cleanup while retaining the 500 ms default and restart-on-pulse behavior. |
| Declared palette entries are unused | `DL_PALETTE.border` and `.tint` have no external property references in the inspected repository; their literal colors are repeated in classes. | Confirm all access forms before editing. Either use these entries at existing equivalent SVG/style call sites or remove genuinely unused entries. Do not replace existing utility classes with dynamic strings merely to consume a token. |
| Deep Learning adapter loads every diagram module together | `domains/deep-learning/mdxComponents.tsx:3–22` statically imports all renderers behind the domain-level dynamic import in `learningMdxRegistry.tsx`. | Potential later optimization. This is not a cold Learning Home eager-loading bug. Defer changing the loading strategy from this first batch to preserve current loading behavior. |

# Decisions

1. Review shared ownership before adding abstractions. Reuse only when semantics
   and behavior match; retain meaningful domain-specific components.
2. Keep all existing MDX, TOCs, catalog identity, lesson text, formulas, fixtures,
   and visual coordinates unchanged in this batch.
3. Preserve exact SVG geometry, path data, marker dimensions, orientation,
   colors, classes, and accessible labels at each migrated call site. A shared
   arrow marker must support existing differences rather than impose one style.
4. Extend `src/components/learning/primitives/diagramPrimitives.tsx` for a small
   domain-neutral SVG marker primitive. Keep neural-network node/edge semantics
   in Deep Learning `primitives.tsx`.
5. Use React `useId` in component bodies for instance-scoped IDs; connect every
   matching `markerStart`/`markerEnd` to the same generated ID. Use an
   instance prefix for preset-specific markers. Preserve explicit
   `DiagramConnectorLayer.markerId` compatibility and give omitted IDs a unique
   default.
6. Consolidate the two existing lazy wrappers in one small shared React helper
   (proposed `src/components/learning/lazyLearningVisual.tsx`). Keep adapters
   declarative, preserve component prop inference, and avoid expanding casts or
   introducing an untyped component registry. Existing domain loading labels
   remain explicit inputs.
7. Avoid unrelated normalization of buttons/cards. In particular, an editable
   `NumberStepper` is not equivalent to display-only `DlStepControl`; differing
   shells are not automatically duplicates.
8. Treat illustrative datasets, fixed SVG coordinates, pedagogical presets,
   and algorithm constants as legitimate authored implementation inputs.
   Remove hardcoding when it duplicates an existing source of truth or couples
   instances, not solely because a literal exists.
9. Delete code only after checking imports, re-exports, MDX component allowlists,
   registry keys, and dynamic loading. TypeScript's unused-local checks alone do
   not establish that a public export is dead.
10. Update existing canonical documentation. No separate cleanup guide or
    additional dependency is needed.

# Phases

## Phase 0 — Store the plan and obtain approval

- This draft is the first and only write before explicit approval.
- Wait for approval under `docs/WORKFLOW.md` before runtime or documentation
  changes. Approval covers this bounded implementation and verification.
- On approval, update status and create `refactor/learning-shared-reuse` before
  implementation. Do not commit or push to `main`.

## Phase 1 — Capture the baseline

- Confirm the working tree and inspect the affected call sites in full.
- Run `npm run verify` with Node >=24, as required by `package.json`.
  The inspected shell currently exposes Node 22.22.2; resolve the runtime before
  treating verification as representative. Record unrelated baseline failures.
- Capture representative existing diagrams and loading skeletons if browser
  tooling is available, for comparison after refactoring.

## Phase 2 — Extract proven shared code

- Extract the common lazy wrapper/skeleton and migrate only Linear Algebra and
  Evolutionary Algorithms. Preserve dynamic import boundaries and loading copy.
- Add the shared SVG marker primitive to the existing diagram primitives file.
- Migrate repeated Deep Learning marker blocks and scope their IDs per instance;
  also use the primitive in `DiagramConnectorLayer` while retaining its API.
- Keep related renderers in their current feature files. Do not split panels
  into numerous new files.

## Phase 3 — Finish the bounded cleanup

- Add timer cleanup to `useCodeHighlightPulse`.
- Recheck palette/export consumers and remove only confirmed unused code in the
  touched scope. Preserve all public MDX component names and signatures.
- Review the diff for changes to classes, copy, path geometry, numeric outputs,
  control limits, and state reset behavior; revert unintended changes.

## Phase 4 — Verify, document, and report

- Run `npm run verify` and `git diff --check`.
- Use existing MDX/catalog and on-demand-boundary tests. Extend boundary coverage
  only where needed to verify the extraction retains actual import isolation.
- Where tooling permits, mount repeated diagrams to check unique IDs and matching
  SVG references; compare representative diagrams, tab/step controls, and loading
  skeletons with the baseline. Check repeated pulses and unmount during a pulse.
  Report any browser validation that could not be performed.
- Do not add tests that merely assert source spelling or mirror trivial markup.
- Update `wiki/concepts/learning-lab.md` with the helper ownership/file map and a
  concise content-PR review checklist: reuse, dead-code evidence, legitimate
  constants versus duplicated truth, lazy boundaries, and design/content parity.
- Add an entry to `wiki/log.md`; record actual modifications and verification in
  this plan. Update `CLAUDE.md` only if its existing orientation becomes stale.
- Report findings fixed, deferred items, verification results, and limitations.
  Do not claim a repository-wide clean bill of health.

# Out of scope

- Redesign, lesson editing, translations, changing pedagogy, or reauthoring
  diagram inputs into MDX.
- Changing the Deep Learning adapter's loading strategy in this batch.
- Theme-system overhaul, including removal of legacy branches outside touched
  code. New shared code must remain light-only.
- Workspace/worker/torchstub/layout refactors, new lint frameworks, automated
  mass deletion, or a repository-wide abstraction framework.
- Publishing, opening a PR, committing, or pushing unless requested later.

# Execution log

- 2026-11-16 — Read repository workflow/orientation and Learning Lab ownership
  history; inspected latest merged PR, shared adapters, and Deep Learning
  primitives. Working tree was clean on `main`. Stored draft plan; runtime and
  existing documentation remain unchanged. Awaiting explicit approval.
- 2026-11-16 — User approved implementation ("Thực hiện") after requesting a
  separate branch. Branch `refactor/learning-shared-reuse` is checked out;
  implementation and baseline verification are authorized.
- 2026-11-16 — Baseline `npm run verify` completed with Node 24.14.1. Captured
  30 browser-rendered diagram/control examples through a temporary Vite harness
  outside tracked source before runtime edits.
- 2026-11-16 — Added `lazyLearningVisual.tsx` and migrated the Linear Algebra
  and Evolutionary Algorithms wrappers. Their dynamic factories, prop inference,
  accessible loading labels, and skeleton classes are preserved. Deep Learning
  adapter loading remains unchanged as planned.
- 2026-11-16 — Added `SvgArrowMarker` to the existing diagram primitives file;
  migrated 19 marker declarations across nine Deep Learning renderer files,
  preserving all path/polygon geometry and marker attributes. Replaced fixed
  IDs with `useId`, including per-preset IDs under an instance prefix. The
  shared connector now generates an ID by default while accepting explicit IDs.
- 2026-11-16 — Added unmount cleanup to `useCodeHighlightPulse`, retaining its
  500 ms default and pulse restart behavior. Removed the unused `border` and
  `tint` palette entries after inspecting all palette uses (no indirect access
  or destructuring consumers).
- 2026-11-16 — The first post-refactor verification exposed a structural test
  that required a local `lazyNamed` declaration/skeleton in the adapter. Removed
  that duplicate test from `mathSegmentedControl.test.ts`; the canonical
  `learningOnDemandBoundaries.test.ts` still checks all nine Linear Algebra
  module imports and now also checks Evolutionary Algorithms and shared-helper
  isolation. The focused nine-test run passed. The suite count decreases from
  177 to 176 due to this consolidation, not removal of runtime coverage.
- 2026-11-16 — Chromium comparison: 30/30 screenshots are pixel-identical to
  baseline; 30/30 DOM captures match after normalizing generated IDs. Browser
  checks passed for 20 repeated-instance cases with unique IDs and local marker
  references, both delayed lazy-loading skeletons and their requested renderer
  modules, explicit connector IDs, pulse restart/unmount cleanup, Fully Connected
  input bounds/bias/code synchronization, Loss tabs/steps, and independent
  learning-rate explorer colors. No page errors. Temporary harness/results are
  under `/tmp/torchviz-reuse-*`; no browser dependency or harness enters the repo.
- 2026-11-16 — Updated the existing Learning Lab ownership/reuse documentation
  and wiki change log. Content, TOCs, catalog contracts, public MDX component
  names, and Deep Learning adapter imports are untouched. `CLAUDE.md` continues
  to point to the canonical wiki and needs no update.
- 2026-11-16 — Final `npm run verify` passed with Node 24.14.1: TypeScript
  typecheck, 176/176 tests, and production build (27.33 s). Biome passed for
  all touched code/test files; `git diff --check` and 26 local documentation
  links passed. Stopped the temporary review server. Work remains uncommitted
  on `refactor/learning-shared-reuse`; no push or PR was performed.

# Verification scope and deferred findings

- Browser visual comparison used Chromium at a 1050 × 1000 viewport with
  reduced motion. This is a focused component/lifecycle audit, not a full
  mobile or every-lesson end-to-end audit.
- Deep Learning per-module lazy loading remains a future optimization;
  domain-level lazy loading and current loading behavior are preserved.
- Explicit `DiagramConnectorLayer.markerId` callers retain responsibility for
  uniqueness, as documented. No unrelated caller APIs were changed.

# Approved continuation — remaining domains and PR publication

The user explicitly requested: "Thực hiện và triển khai tiếp các domain còn
lại trên branch này đi". This authorizes continuing the same review/refactor
on `refactor/learning-shared-reuse`, committing, pushing, and opening one PR.
No additional approval is needed for the implementation below. Keep the PR
open for review; merging is outside this continuation while work is on this
branch.

## Grounded findings and scope

- LLM has three explicit fixed connector IDs in `languageModelRenderers.tsx`
  and `tokenizerRenderers.tsx`; remove those overrides to reuse the shared
  connector's instance-safe default.
- Evolutionary Algorithms defines fixed `blueAreaGradient` and `blueZeroGrad`
  IDs; scope those definitions and their fill references with React `useId`.
- Linear Algebra's domain theme still selects a dark palette, and renderers
  repeatedly map `themeClasses.isLight` to a theme name. LLM's theme helper and
  renderer modules similarly retain unused dark branches. CV maps the Learning
  theme back to a dark/light exercise prop. Current runtime is light-only, as
  required by AGENTS.md. Replace domain-only theme selection with canonical
  light values, preserving every current light string/color and leaving the
  Workspace theme system intact.
- Repository-wide symbol checks identify `matVec` in Linear Algebra geometry
  and the LLM type aliases `LlmExtraRendererProps` and
  `LlmRendererSemanticTheme` as having no consumers. Confirm indirect access,
  exports, authored allowlists, and tests before removing them. Retain useful
  public prop types and domain-specific fixtures.
- AI Projects contains an always-empty August 2022 leading-calendar-slot
  branch (`leadingBlanks = 0`), which can be removed without affecting output.
  Research Papers, Continual Learning, Fundamentals, and shared-only domains
  require an ownership/dead-code review; change them only for a concrete,
  verified issue. Do not force cross-domain matrix/stepper abstractions.

## Execution phases

1. Commit the verified first batch separately on the current branch. Capture
   the current domain component baseline before further runtime edits, using
   the existing temporary browser harness and authored/static fixtures.
2. Audit every current catalog domain's adapter/shared-only ownership; record
   coverage and justified no-change decisions. Implement the confirmed issues
   above and remove newly unneeded theme-only parameters/imports locally.
   Preserve MDX, TOCs, formulas, datasets, layout geometry, controls, and the
   current domain loading boundaries. Deep Learning module-level loading
   optimization remains deferred.
3. Compare representative affected visuals before/after at desktop and compact
   widths; check repeated connector/gradient instances and existing interaction
   state. Verify all static light theme values remain identical. Run focused
   tests, Biome on touched files, `npm run verify` with Node 24, and
   `git diff --check`. Record limitations honestly.
4. Update the existing ownership/wiki log and this plan with actual domain
   coverage and validation. Commit the continuation separately, push the same
   branch, and create or update a PR describing the final scope and evidence.
   Do not merge, edit authored content, or create a separate cleanup guide.

## Continuation execution log

- 2026-11-16 — User authorized the continuation and PR workflow. Inspected all
  nine domain adapter packages, shared theme/connector ownership, exported
  symbol consumers, and interval cleanup. Stored this approved addendum before
  any continuation runtime edits.
