# Wiki change log

A chronological record of changes to the OKF knowledge bundle. (Reserved file —
no `type` frontmatter required.)

- **2026-07-02 — Learning lesson panel flattening.** Documented the Learning Lab
  convention that the main lesson detail surface should remain one flat panel,
  with section spacing/dividers and subtle left accents instead of nested cards.
- **2026-07-01 — LLM-from-scratch course content.** Updated the
  [Learning Lab refactor](concepts/learning-lab-refactor.md) page to document
  the Vietnamese-first LLM AI Engineering course path and its theory -> hand
  calculation/quiz -> code teaching rhythm.
- **2026-07-01 — LLM-from-scratch visuals and formulas.** Extended the
  [Learning Lab refactor](concepts/learning-lab-refactor.md) page for the
  LLM-from-scratch course's React-free visual/formula metadata, KaTeX rendering,
  concrete checkpoint exercises, and code-step contracts.
- **2026-07-02 — LLM-from-scratch gist reference alignment.** Downloaded the
  supplied "Building LLMs From Scratch" gist into `docs/reference/` and aligned
  the LLM course copy/checkpoints with source-grounded paraphrases plus explicit
  placeholders for out-of-scope extension labs.
- **2026-06-29 — Landing home redesign.** Refined the outer Landing page into a
  quieter dark technical composition with less glow, clearer Workspace/Learning
  cards, wider touch targets, reduced-motion support, and desktop-only route
  lines.
- **2026-06-29 — Learning Lab sidebar hierarchy.** Documented the shallow
  Learning Lab sidebar model: Home stays at the top, domains remain top-level,
  and track/lesson structure stays in the right-side main content instead of a
  sidebar tree. The TorchViz logo is now the Landing return affordance.
- **2026-06-29 — Learning Lab Home role.** Clarified that the `/learning` Home
  page is a text-focused TorchViz-3D project introduction, while domain
  navigation remains in the sidebar.
- **2026-06-24 — Architecture bulk collapse controls.** Updated the
  [state store](concepts/state-store.md) reference for the new `expandAll()` and
  `collapseAll()` actions, including the intentional top-level root exclusion.
- **2026-06-21 — Initialization.** Created the OKF v0.1 bundle under `wiki/` as
  the first task executed under the new workflow
  ([docs/plans/2026-06-21-llm-wiki-okf-plan.md](../docs/plans/2026-06-21-llm-wiki-okf-plan.md),
  Phase 4). Pages: root `index.md`, `architecture.md`, `glossary.md`; concepts
  (`torchstub`, `pyodide-worker`, `ir-contract`, `layout-engine`, `state-store`,
  `rendering`); a guide (`add-a-layer`); reference (`templates`, `gotchas`); and
  the section `index.md` listings. Authored against the code at the time, with
  two corrections where the prose docs then lagged the implementation:
  `WRAPPER_LINE_OFFSET` is auto-derived (not a hardcoded `7`), and op coloring
  lives in `src/lib/visualKind.ts` rather than the older constants-based color
  matcher names.
- **2026-06-21 — Learning Lab scaffold docs.** Added a planned subsystem page for
  the scaffold-only Landing Page and Learning Lab refactor
  ([wiki/concepts/learning-lab-refactor.md](concepts/learning-lab-refactor.md)),
  linked it from the wiki index and architecture pages, and added an embedded
  Codex init prompt derived from `CLAUDE.md`.
- **2026-06-21 — Landing/AppShell MVP docs.** Updated the Learning Lab scaffold
  docs after MVP 1 made `AppShell` and landing components active runtime
  behavior. Learning Lab, learning core helpers, and `uiStore` remain inert.
- **2026-06-21 — Landing bento UI docs.** Folded the finalized Landing hero
  summary into the existing
  [learning-lab-refactor](concepts/learning-lab-refactor.md) page instead of
  creating a separate Landing page. The docs now note the live graph preview,
  compact Workspace/Learning cards, anchor-based routes, and disabled Learning
  Lab state.
- **2026-06-21 — Landing docs consolidation.** Consolidated the separate
  Landing iteration plan pages into one Landing UI iteration page and clarified
  that small follow-up docs should update existing pages instead of creating
  new pages.
- **2026-06-24 — Learning Path activation.** Activated Learning Lab as a
  separate Path/Review surface from Landing and documented the first-pass
  exercise separation: Learning Lab references existing exercise IDs/concepts
  while the Workspace/Demo exercise flow remains unchanged.
- **2026-06-24 — Learning Lab embedded practice.** Updated Learning Lab from
  reference-only cards to inline exercises with answer checking, reset, and
  hints. Practice cards reuse existing shape/value model builders through a
  shared exercise adapter, keeping Learning Path content metadata-only.
- **2026-06-26 — Learning Lab domain refactor.** Merged Reinforcement Learning
  into Learning Lab as a domain, replaced the sibling RL surface route with
  Learning Lab domain routes, and documented the shared domain catalog/practice
  renderer boundary.
- **2026-06-26 — Desloppify cleanup batch.** Removed unused scaffold files
  (`answerCheck.ts`, `uiStore.ts`, and `LearningDrawer.tsx`), added worker
  timeout recovery, tightened input-shape validation, and enabled unused-symbol
  TypeScript checks.
- **2026-06-26 — Complete Desloppify backlog.** Finished the remaining
  cleanup backlog by self-hosting Tailwind, Pyodide, Monaco, and text font
  assets; moving Learning Lab display metadata through catalog/localization
  adapters; sharing Learning Lab theme tokens and exercise modal lifecycle;
  adding route smoke coverage; and documenting the root entrypoint convention.
