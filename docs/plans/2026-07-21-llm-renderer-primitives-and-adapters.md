---
title: LLM Renderer Primitives and Adapter Consolidation
status: done
created: 2026-07-21T00:00:00+07:00
updated: 2026-07-21T01:00:00+07:00
author: Codex
task: "consolidate repeated LLM renderer props, MDX adapters, semantic visual tokens, controls, connectors, and charts while preserving lesson behavior and reviewing visual changes at explicit checkpoints"
supersedes:
  - docs/plans/2026-07-20-refactor-llm-domain-renderers.md
---

# Goal

Continue the LLM domain cleanup after splitting the renderer monolith. Reduce
repeated adapter, theme, visual-primitive, animation-control, and diagram code
without changing authored lesson content, MDX names, navigation, or intended
interactions.

Success means new LLM visual components can be added through small typed APIs,
domain colors and states have semantic ownership, repeated measurement/playback
infrastructure has one implementation, and visual equivalence is confirmed at
explicit requester checkpoints.

# Lineage

Supersedes [Refactor LLM Domain Renderers](./2026-07-20-refactor-llm-domain-renderers.md),
which established the tokenizer, language-model, and concept renderer families
plus their stable compatibility barrel.

# Context read

- `mdxComponents.tsx` repeats the same lesson/theme hook and Vietnamese-fallback
  adapter pattern for most content renderers, frequently ending in `as never`.
- Renderer functions repeat the `content`, `language`, and `themeClasses` prop
  contract.
- Token chips, token-ID badges, information callouts, neutral surfaces, and
  secondary playback buttons repeat semantic light/dark styling.
- Two animated renderers repeat Previous, Play/Pause, Next, and Reset controls
  while retaining slightly different state-transition rules.
- Three diagrams repeat `requestAnimationFrame`, `ResizeObserver`, resize
  listener cleanup, DOM-relative anchor measurement, SVG marker, and path-layer
  markup.
- The loss calculation contains two structurally equivalent SVG curve charts.
- Existing `src/components/learning/theme.ts` owns shared Learning Lab themes;
  LLM-only palette semantics should remain inside the LLM domain package.

# Decisions (locked)

- Keep all changes inside the LLM domain package except narrow tests, this plan,
  and updates to the existing Learning Lab wiki.
- Preserve `llmMdxComponents`, `LLM_MDX_COMPONENT_NAMES`, authored MDX props,
  lesson content, catalog identity, routes, and locale fallback behavior.
- Prefer typed semantic primitives over CSS classes named after raw colors.
- Keep LLM-only tokens local; do not expand the shared Learning Lab theme with
  domain-specific token/model/vocabulary colors.
- Extract only primitives with multiple real consumers and one semantic role.
- Preserve specialized animation state rules; share the control presentation
  before considering a shared state hook.
- Share connector lifecycle/measurement and SVG presentation while keeping each
  diagram's routing formula beside that diagram.
- Add no chart, graph, animation, or CSS dependency.
- Retain direct accessibility control over buttons, SVG roles/labels,
  `aria-live`, keyboard focus rings, and reduced-motion behavior.
- Pause at every visual checkpoint listed below and wait for requester feedback
  before proceeding to the next visual phase.

# Phases

## Phase 0 — Approval checkpoint

- Store this draft as the first task write.
- Wait for explicit requester approval.
- After approval, advance the plan through `approved` and `executing` before
  modifying source files.

## Phase 1 — Typed contracts and MDX adapter factory

- Add shared renderer aliases such as `LlmRendererTheme`,
  `LlmContentRendererProps<T>`, and `LlmExtraRendererProps<T>` to
  `rendererTypes.ts`.
- Replace repeated inline renderer prop declarations where the alias improves
  readability.
- Add a typed MDX content-renderer factory that owns theme/lesson lookup and
  Vietnamese fallback materialization.
- Replace eligible one-off wrappers in `mdxComponents.tsx`; retain custom
  wrappers whose props or `ExtraFrame` behavior differ.
- Remove `as never` casts where the typed adapter can prove the content shape.
- Run typecheck and focused MDX/component-wiring tests.
- No requester visual checkpoint: this phase must preserve generated markup.

## Phase 2 — Semantic tokens and repeated visual primitives

- Add an LLM-domain theme module containing semantic roles for connector,
  surface, callout, token chip, token ID, code/output, and playback-control
  states that are genuinely repeated.
- Add narrowly scoped primitives for repeated tokenizer visual units, starting
  with `TokenChip`, `TokenIdBadge`, and token/ID pairing only where three or
  more consumers share the same semantics.
- Add an information callout primitive for repeated icon/body layout and tone.
- Preserve current dimensions, typography, borders, colors, dark-mode values,
  and responsive behavior during substitution.
- Run focused verification and provide a lesson/page checklist for review.

### Visual checkpoint A — requester review required

Check light and dark mode for:

- Token IDs and vocabulary pages;
- raw-text-to-token-ID walkthrough;
- tokenizer comparison and regex/BPE callouts; and
- any changed token/ID chips or information callouts.

Do not proceed to Phase 3 until the requester confirms or supplies corrections.

## Phase 3 — Shared playback controls

- Extract the Previous, Play/Pause, Next, and Reset presentation into a typed
  `StepPlaybackControls` component.
- Keep timer/effect/state-transition logic inside each feature renderer unless
  both behaviors are proven identical after extraction.
- Preserve labels, disabled rules, focus rings, icon sizes, keyboard behavior,
  and play/replay semantics.
- Run focused interaction and type checks.

### Visual checkpoint B — requester review required

Check light and dark mode plus manual playback for:

- animated next-token loss; and
- tokenizer merge training.

Do not proceed to Phase 4 until the requester confirms or supplies corrections.

## Phase 4 — Diagram and curve infrastructure

- Add reusable DOM-relative anchor helpers and a connector-observation hook
  that owns animation-frame setup, `ResizeObserver`, window-resize handling,
  and cleanup.
- Add a `DiagramConnectorLayer` that owns SVG marker/path boilerplate while
  accepting explicit path tone, dash, opacity, and marker configuration.
- Migrate the AR inference pipeline, output projection, and tokenizer round-trip
  diagrams without changing their routing formulas or node layout.
- Extract one accessible curve-chart component for `ln(p)` and `-ln(p)` while
  preserving axes, ticks, colors, live point, labels, and `role="img"` text.
- Run focused resize/theme/interaction checks.

### Visual checkpoint C — requester review required

Check light and dark mode at desktop and horizontally scrolled compact widths:

- AR inference pipeline at every step;
- output projection at every focus state;
- tokenizer round-trip diagram; and
- both interactive loss curves at representative probabilities.

## Phase 5 — Final verification and documentation

- Apply corrections from visual checkpoints without expanding scope.
- Update source-inspection tests so architectural assertions follow the new
  primitive boundaries without weakening coverage.
- Update the existing Learning Lab Active File Map; create no new wiki page.
- Run `npm run verify`, `git diff --check`, and a final diff audit for accidental
  MDX/content/route/allowlist changes.
- Record actual reductions, retained exceptions, visual approvals, and exact
  verification results in this plan.

# Acceptance criteria

- Common renderer props and eligible MDX wrappers have one typed implementation.
- `mdxComponents.tsx` contains no avoidable `as never` casts.
- Repeated LLM palette roles are semantic and domain-local; raw color decisions
  are not duplicated across their migrated consumers.
- Token/ID units, callouts, and playback controls use focused reusable
  components without becoming a generic UI framework.
- Connector observation, relative anchors, SVG path layers, and duplicated loss
  charts have one reusable implementation at the appropriate level.
- All visual checkpoints are explicitly approved or corrected by the requester.
- No authored MDX, public MDX name/prop, catalog, route, or lesson copy changes.
- `npm run verify` and `git diff --check` pass.

# Out of scope

- Cross-domain component extraction.
- A general design-system rewrite or broad changes to `learning/theme.ts`.
- Replacing SVG with React Flow, Recharts, Visx, canvas, or raster images.
- Redesigning lesson visuals, changing colors intentionally, or altering content.
- Combining animation state machines that only look superficially similar.
- Commits, pushes, or pull-request creation unless separately requested.

# Execution log

- 2026-07-21 — Audited the split LLM renderer families, shared Learning Lab
  theme, repeated palette/state classes, token/ID units, callouts, playback
  controls, DOM measurement lifecycle, SVG connector layers, and loss curves.
  Stored this draft as the first task write; no source file was modified.
- 2026-07-21 — Requester approved the plan with “approved”. Status advanced
  through approved to executing; Phase 1 began.
- 2026-07-21 — Phase 1 added typed renderer prop aliases and replaced eighteen
  repeated MDX wrappers with one typed content-renderer factory. Removed all
  `as never` casts from the LLM package while retaining the four adapters with
  additional authored props. TypeScript and focused MDX/wiring tests passed.
- 2026-07-21 — Phase 2 added domain-local semantic renderer tokens plus focused
  `TokenChip`, `TokenIdBadge`, and `LlmCallout` primitives. Migrated the repeated
  token/ID units in the vocabulary and code walkthrough and the repeated
  information callouts in the misconceptions, tokenizer comparison, and regex
  walkthrough surfaces without changing their color values or dimensions.
  TypeScript, all sixteen focused MDX/wiring tests, and `git diff --check`
  passed. Execution paused for Visual checkpoint A.
- 2026-07-21 — Requester approved Visual checkpoint A with “ok triển khai phase
  tiếp”. Phase 3 extracted one typed `StepPlaybackControls` presentation while
  retaining each renderer's timer, step bounds, reset behavior, and play state.
  The shared controls now consistently own semantic colors, disabled styling,
  focus rings, icons, and accessible labels. TypeScript, all sixteen focused
  MDX/wiring tests, and `git diff --check` passed. Execution paused for Visual
  checkpoint B.
- 2026-07-21 — Requester directed execution to continue through Phase 4. Added
  shared DOM-relative anchor measurement, resize observation/cleanup, SVG
  connector rendering, and accessible probability-curve primitives. Migrated
  the AR inference, output projection, and tokenizer round-trip diagrams while
  retaining their local routing formulas; consolidated the two loss charts
  without changing their coordinate transforms, labels, or colors. TypeScript,
  all sixteen focused MDX/wiring tests, and `git diff --check` passed. Execution
  paused for Visual checkpoint C.
- 2026-07-21 — Requester asked to add and commit the completed work; treated as
  acceptance of Visual checkpoint C and authorization to finish Phase 5.
  Updated the existing Learning Lab Active File Map and began final full-repo
  verification before committing.
- 2026-07-21 — Final `npm run verify` passed TypeScript, all 75 Node tests,
  generic MDX validation, and the production build with 2,532 transformed
  modules. The existing large-chunk advisory remained informational;
  `git diff --check` passed.
