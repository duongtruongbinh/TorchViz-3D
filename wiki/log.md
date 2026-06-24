# Wiki change log

A chronological record of changes to the OKF knowledge bundle. (Reserved file —
no `type` frontmatter required.)

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
  hints. Practice cards reuse existing shape/value model builders with static
  representative node fixtures.
