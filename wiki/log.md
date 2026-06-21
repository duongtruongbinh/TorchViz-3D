# Wiki change log

A chronological record of changes to the OKF knowledge bundle. (Reserved file —
no `type` frontmatter required.)

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
