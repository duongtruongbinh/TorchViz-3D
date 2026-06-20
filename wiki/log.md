# Wiki change log

A chronological record of changes to the OKF knowledge bundle. (Reserved file —
no `type` frontmatter required.)

- **2026-06-21 — Initialization.** Created the OKF v0.1 bundle under `wiki/` as
  the first task executed under the new workflow
  ([docs/plans/2026-06-21-llm-wiki-okf-plan.md](../docs/plans/2026-06-21-llm-wiki-okf-plan.md),
  Phase 4). Pages: root `index.md`, `architecture.md`, `glossary.md`; concepts
  (`torchstub`, `pyodide-worker`, `ir-contract`, `layout-engine`, `state-store`,
  `rendering`); a guide (`add-a-layer`); reference (`templates`, `gotchas`); and
  the section `index.md` listings. Authored against the current code, with two
  corrections where the prose docs lag the implementation:
  `WRAPPER_LINE_OFFSET` is auto-derived (not a hardcoded `7`), and op coloring
  lives in `src/lib/visualKind.ts` (not `OP_MATCHERS`/`OP_COLORS` in
  `constants.ts`).
