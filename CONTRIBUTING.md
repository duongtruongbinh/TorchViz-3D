# Contributing to TorchViz-3D

Thanks for contributing! This project follows a **mandatory task workflow** that
applies to everyone — human and AI contributors alike. Please read it before
opening a PR.

## The workflow (required)

Full definition: [docs/WORKFLOW.md](docs/WORKFLOW.md). Short form:

```
prompt → grep context → specify task → write & store a plan (docs/plans/)
  → get approval → execute → record the modifications → update docs
```

**Hard rule: don't modify files before an approved, stored plan exists.** For any
non-trivial change, your first commit should be a plan file under `docs/plans/`
named `YYYY-MM-DD-<slug>.md`. See the template and frontmatter rules in
[docs/WORKFLOW.md](docs/WORKFLOW.md). New plans must cite their predecessor via
the `supersedes:` field and a `# Lineage` section.

Trivial fixes (typos, one-line doc corrections) are exempt from the plan
requirement.

## Getting set up

```bash
npm install
npm run dev      # http://localhost:3000
```

Requirements: a current Node.js LTS (CI runs Node 24). The app is **desktop +
local-first** — Pyodide, Monaco, and fonts are bundled and served locally by
Vite; the only runtime CDN fetch is the on-demand Mermaid diagram loader.

## Before you open a PR

```bash
npm test         # unit tests (node --test on src/**/*.test.ts)
npm run build    # must succeed
```

- Link your plan file from the PR description.
- Update documentation: `README.md`, `docs/`, and/or the `wiki/` OKF bundle.
- If you added a layer to `torchstub`, follow
  [wiki/guides/add-a-layer.md](wiki/guides/add-a-layer.md).
- Keep `wiki/` conformant: every non-reserved `.md` needs YAML frontmatter with
  a non-empty `type`.

## Where things live

| Surface | Purpose |
|---|---|
| `src/` | Application source (see [CLAUDE.md](CLAUDE.md) for the file map). |
| `wiki/` | OKF knowledge bundle — structured, agent-readable docs. |
| `docs/` | Long-form prose docs, the workflow, and plan history. |
| `docs/plans/` | One plan per task; the record of *why* changes happened. |

## Code conventions

Match the surrounding code's style, naming, and comment density. Document
fragile spots where they live and cross-link them from
[wiki/reference/gotchas.md](wiki/reference/gotchas.md).
