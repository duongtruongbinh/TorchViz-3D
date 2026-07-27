---
title: Compact LLM Domain Documentation and Audit Branch Cleanup
status: done
created: 2026-07-17T19:30:00+07:00
updated: 2026-07-17T20:35:00+07:00
author: nmkhiem
task: "compact the plans and documentation introduced by the two LLM-domain commits, then remove only branch code proven redundant without changing Learning Lab behavior or lesson content"
supersedes:
  - docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md
---

# Goal

Leave the two-commit branch with compact, walkable documentation and no proven
dead branch code while preserving the current Learning Lab content pipeline,
routes, authored lesson behavior, and quiz interactions.

Success means:

- durable architecture decisions, lesson lineage, execution outcomes, catalog
  totals, and verification history from the sixteen small plans are retained in
  the existing 2026-07-14 owning plan and Learning Lab wiki;
- redundant plan files are removed only after their unique information is
  absorbed into that owning documentation;
- the untracked rebase plan is not added as a separate long-lived plan, but its
  unique rebase result and `QuizBlock` conflict-resolution decision are recorded
  in this plan's execution history;
- imports, helpers, components, types, compatibility code, MDX registrations,
  and post-rebase remnants are removed only when repository usage, catalog/MDX
  contracts, tests, and Git history jointly show that removal is safe;
- sortable `@dnd-kit` quiz behavior and inline-code rendering for quiz prompts,
  options, and feedback both remain intact; and
- `npm run verify` and `git diff --check` pass.

# Lineage

This plan continues and compacts [Learning Lab Content Architecture and LLM
Course](./2026-07-14-approved-llm-lessons-mdx-migration.md). It absorbs the
sixteen branch-added follow-up plans named in the owning plan's compacted
history, preserving their
durable decisions and outcomes in the existing owning plan rather than keeping
one plan per small content or visual iteration.

The untracked `2026-07-17-rebase-main-into-llm-domain-edits-v2.md` is an
already-completed operational checkpoint, not a distinct long-lived subsystem
plan. Its unique evidence will be recorded here before that untracked file is
removed: the branch was rebased onto `origin/main` at `6837bd5`; the sole
conflict was `QuizBlock.tsx`; resolution intentionally retained both dnd-kit
sorting and inline-code rendering; the post-rebase verification passed with 70
tests; and no push or force-push occurred.

# Context and inventory

The branch is `feat/llm-domain-edits-v2` at `dd6bd09`, with `d9e85d6` and
`dd6bd09` above `origin/main` at `6837bd5`. Before this plan was stored, the
worktree contained only the untracked rebase plan.

Compared with `origin/main`, the branch adds sixteen completed plan files and
changes 38 runtime/content/test/wiki paths: typed-TOC ordering and totals,
optional hierarchical MDX filename prefixes, seven authored tokenization
lesson/quiz files, LLM renderers and registrations, static MDX validation,
chapter-local rail numbering, quiz inline-code rendering, CSS, tests, and the
existing Learning Lab wiki.

The plan duplication is real but falls into five coherent histories:

1. MDX filename prefixes, moving the broad pipeline pair to chapter 1.5, and
   chapter-local visible numbering.
2. BPE code readability, theory expansion, page splitting, quiz deepening, and
   distractor rebalance.
3. Publishing the token-ID/vocabulary lesson and refining its AR round-trip
   visual into a connected chart.
4. Publishing the regex-tokenizer walkthrough, adding its input/token diagram,
   pacing the final pages, and adding the aligned quiz.
5. Correcting static negative-number handling in the generic MDX validator.

Initial usage search confirms that all ten newly registered tokenizer MDX
component names currently map through the shared allowlist and domain registry;
nine are referenced by authored MDX and `TokenizerModelContract` requires a
deeper audit because it is registered but was not found in the branch-authored
MDX search. This is a candidate, not an approved deletion. The chapter-local
index map is actively passed from `LearningLabView` to `LessonRail`. The
optional filename-prefix parser is required by the renamed authored files and
has regression coverage. The negative-literal validator change is exercised by
lesson data and focused tests.

# Decisions (locked)

- Update the existing 2026-07-14 plan and `wiki/concepts/learning-lab.md`; do
  not create another reference page.
- Compact the sixteen small completed plans into a concise absorbed-history
  table grouped by the five histories above. Preserve scope-changing decisions,
  corrections, lineage, actual outcomes, and verification evidence; omit
  repeated workflow boilerplate and superseded implementation descriptions.
- Remove the sixteen absorbed plan files only after the owning plan contains
  their unique durable information and repository references have been checked.
- Do not track the untracked rebase-only plan as another plan page. Preserve its
  unique evidence in this plan's execution log, then remove the untracked file.
- Treat a file or symbol as removable only with positive evidence: no runtime,
  MDX, test, catalog, dynamic-registry, CSS-selector, or documented contract
  consumer; no required side effect; and no active role revealed by the two
  commits or the rebase conflict history.
- Registration symmetry alone is not duplication: an authored MDX component
  normally needs an allowlist entry, a domain adapter, and a renderer. Remove
  the complete chain only when the component has no authored or runtime use.
- Preserve lesson text, page order, routes, TOC status, catalog identity,
  renderer output, interactions, and localization fallback unless a mechanical
  cleanup is behavior-equivalent.
- Preserve both dnd-kit sortable quiz behavior and `renderInlineCode` behavior
  in `QuizBlock.tsx`.
- Do not push or force-push.

# Phases

## Phase 0 — Approval checkpoint

- Store this draft plan as the only permitted pre-approval write.
- Stop and wait for explicit requester approval.
- On approval, update `status` to `approved`, then `executing`, and record the
  transitions before changing other files.

## Phase 1 — Compact documentation without losing history

- Build a unique-information matrix for all sixteen small plans: decisions,
  corrections, outcomes, verification, and lineage.
- Fold that matrix into the existing 2026-07-14 plan as compact grouped history
  and bring its final metrics/current-state language in sync with the branch.
- Keep the Learning Lab wiki focused on current durable architecture and
  behavior; remove repetition already owned by the plan, but retain current
  catalog totals, authored lesson inventory, runtime boundaries, and invariants.
- Search all repository references to the sixteen plans, repair any affected
  lineage or links, then remove the absorbed files.
- Record the completed rebase evidence in this plan and remove the untracked
  rebase plan rather than adding it to the documentation surface.

## Phase 2 — Evidence-based branch code audit

- Inspect the full `origin/main...HEAD` diff and both commit diffs, with special
  attention to `renderers.tsx`, MDX adapters/allowlists, TOC and authored files,
  validator/parser compatibility, CSS, tests, and `QuizBlock.tsx`.
- Use `rg` across TypeScript, TSX, MDX, tests, scripts, CSS, and docs to trace
  every branch-added export, helper, type, import, component name, selector,
  class, and route/catalog ID.
- Check dynamic component registration and MDX validation contracts so string-
  referenced components are not mistaken for unused TypeScript exports.
- Compare suspicious code with `origin/main`, `d9e85d6`, and `dd6bd09` to
  distinguish deliberate compatibility support from rebase residue.
- Remove or consolidate only candidates that satisfy the evidence gate. If no
  candidate is proven redundant, make no code deletion and document that
  result rather than forcing cleanup.
- Explicitly re-inspect `QuizBlock.tsx` after cleanup to confirm dnd-kit imports,
  sortable/order rendering, drag overlay, and inline-code rendering all remain.

## Phase 3 — Synchronize tests and durable docs

- Update existing tests only when a proven mechanical cleanup changes an
  implementation surface or when compacted current-state metrics need matching
  expectations; do not weaken behavioral assertions.
- Update the 2026-07-14 plan, this plan's execution log, and the existing wiki
  with what actually changed and which suspected candidates were retained.
- Do not add a new docs/wiki page.

## Phase 4 — Verification

- Run targeted checks useful during cleanup.
- Run `npm run verify` after all changes.
- Run `git diff --check` and inspect final `git status`, branch diff, plan/wiki
  links, MDX registration symmetry, catalog totals, and the `QuizBlock` diff.
- Record exact verification results in this plan.

# Out of scope

- Learning Lab behavior changes, redesign, or architecture migration.
- Lesson prose, quiz pedagogy, page sequencing, or visual/content changes beyond
  behavior-equivalent cleanup.
- Removing shared exercise engines or active compatibility required by existing
  canonical routes, aliases, locale fallback, MDX filenames, or catalog data.
- Rewriting commit history, committing, pushing, or force-pushing.

# Execution log

- 2026-07-17 — Read `AGENTS.md`, `docs/WORKFLOW.md`, `CLAUDE.md`, the required
  Landing/Learning plans, the Learning Lab wiki, the untracked rebase plan, the
  branch status/history, both commit summaries, and the complete branch path
  inventory. Stored this draft as the first write; no other file was modified.
- 2026-07-17 — Requester approved the plan with “Bắt đầu”. Status advanced
  through approved to executing; documentation compaction and code audit began.
- 2026-07-17 — Folded the sixteen short plans into the existing 2026-07-14
  content-architecture plan as five coherent histories; updated its durable
  decisions, final catalog metrics, and execution log, then removed the
  absorbed files. Updated the Learning Lab wiki and architecture overview to
  the current 630-node, 28-published, 24-LLM, 602-placeholder state.
- 2026-07-17 — Preserved the completed rebase result here and removed the
  untracked operational plan: rebased onto `6837bd5`, sole conflict in
  `QuizBlock.tsx`, both dnd-kit sorting and inline-code rendering retained,
  post-rebase verification passed with 70 tests, and nothing was pushed.
- 2026-07-17 — Usage and history audit proved one dead MDX chain:
  `TokenizerModelContract` had an allowlist entry, adapter, DTO, and renderer,
  but no MDX/runtime/test consumer after the token-ID lesson's final two-page
  design superseded its third page. Removed the complete chain. Also removed
  the unreferenced `.learning-bpe-source-token` animation while retaining the
  actively used merged-token animation. Typecheck and `git diff --check` passed
  after the code cleanup.
- 2026-07-17 — Retained all nine remaining tokenizer renderer/adapter/allowlist
  chains because each has an authored MDX consumer. Retained filename-prefix
  parsing, negative-literal handling, chapter-local rail indexes, and both quiz
  inline-code/sortable paths because each has direct runtime or regression-test
  evidence. Kept the two small inline-code helpers local because they serve
  different renderer/theme contexts; consolidating them would expand scope
  without removing an obsolete layer.
- 2026-07-17 — Final `npm run verify` passed: TypeScript passed, all 70 Node
  tests passed, MDX/catalog validation passed, and the production build
  completed with 2,524 transformed modules. `git diff --check` passed. Final
  inspection confirmed `DndContext`, `SortableContext`, `useSortable`, and
  `DragOverlay` remain alongside inline-code rendering for quiz prompts,
  options, and feedback. No push or force-push was performed.
