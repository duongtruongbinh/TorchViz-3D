# CLAUDE.md

Guidance for AI agents (and a fast orientation for humans) working in this repo.

## Mandatory workflow

This project has a **mandatory task workflow**. Follow it for every non-trivial
task. The full definition is in [docs/WORKFLOW.md](docs/WORKFLOW.md); the short
form:

```
prompt → grep context → specify task (one question per turn)
  → write & store a plan (docs/plans/) → get approval
    → execute → record the modifications → update docs
```

**Hard rule: do not modify any file before an approved, stored plan exists.**
The plan file in `docs/plans/` is the first allowed write. Plans are named
`YYYY-MM-DD-<slug>.md`, carry frontmatter (`title, status, created, updated,
author, task, supersedes`), and **cite their predecessor** via `supersedes:` +
a `# Lineage` section. See [docs/WORKFLOW.md](docs/WORKFLOW.md) for the template.

Trivial fixes (typos, one-line doc edits) are exempt. When in doubt, write the plan.

### Branch constraints
Before making any commits or pushing code, you **MUST** ensure you are not on the main/base branch. You must check out a separate feature branch.
- **Branch Naming:** The branch name must follow the pattern `feat/`, `fix/`, or `refactor/` (e.g. `feat/some-feature`).
- **Commit & Push Restriction:** Direct commits and pushes to the main/base branch are strictly prohibited. Always create a branch first.

## What this project is

TorchViz-3D renders PyTorch `nn.Module` source as interactive 3D isometric block
diagrams, **entirely in the browser**. No code or data leaves the machine.

## Architecture in one screen

```
EditorPane (Monaco) → zustand store → WorkerService
  → Web Worker (Pyodide / Python on WASM) + torchstub
  → IRGraph JSON → computeLayout → LayoutData → Canvas3D (R3F/three.js)
```

The non-obvious core: we do **not** run real PyTorch. A fake `torch.nn` called
**`torchstub`** (`src/lib/python_sources.ts`) does **shape inference only** — no
tensor math — and traces module calls into an `IRGraph`. To draw a network you
only need each layer's output shape and parameter count.

Read [wiki/architecture.md](wiki/architecture.md) for the full pipeline, and the
[wiki/](wiki/index.md) OKF knowledge bundle for per-subsystem detail.

## Key files

| Path | Role |
|---|---|
| `src/lib/python_sources.ts` | `torchstub` — the fake, shape-only `torch.nn`. |
| `src/workers/pyodideWorker.ts` | Boots Pyodide; runs user code; emits IR. |
| `src/lib/irTypes.ts` | IR + Layout types (the worker↔renderer contract). |
| `src/lib/layout.ts` | Pure IR → 3D `LayoutData` engine. |
| `src/lib/constants.ts` | Non-op theme constants — container, edge, text, and UI colors. |
| `src/store/useStore.ts` | zustand state + built-in templates. |
| `src/components/canvas/Canvas3D.tsx` | React Three Fiber scene. |
| `src/content/learning/*/table-of-contents.ts` | Typed Learning Lab navigation metadata. |
| `src/content/learning/*/*.mdx` | Locale-authored Learning Lab lessons. |
| `src/core/learning/*` | React-free catalog contracts, materialization, and selectors. |
| `wiki/concepts/learning-lab.md` | Canonical Learning Lab UI ownership, component reuse rules, and file map. |

For Learning Lab UI/component ownership and reuse rules, consult [wiki/concepts/learning-lab.md](wiki/concepts/learning-lab.md) and [docs/plans/2026-08-19-learning-lab-ui-refactor.md](docs/plans/2026-08-19-learning-lab-ui-refactor.md) before adding or modifying visual primitives.

## Gotchas

See [wiki/reference/gotchas.md](wiki/reference/gotchas.md). The big ones:
`WRAPPER_LINE_OFFSET` in the worker is auto-derived from the injected preamble
(`countPythonPreambleLines`), not hardcoded; the layout axis convention is
intentionally swapped; op color lives in `visualKind.ts` (not `constants.ts`);
and Vite owns module resolution plus local Pyodide asset delivery. The Workspace
is desktop-oriented; Landing and Learning Lab remain responsive.

## Common commands

```bash
npm run dev      # local dev server (http://localhost:3000)
npm test         # node --test on src/lib/*.test.ts
npm run build    # production build to dist/
npm run verify   # typecheck + tests + production build
```

## Documentation surfaces

- `wiki/` — OKF knowledge bundle (structured, agent-readable). Start here.
- `docs/ARCHITECTURE.md`, `docs/TORCHSTUB.md` — long-form prose deep-dives.
- `docs/plans/` — compacted history of *why* changes were made.
- `docs/WORKFLOW.md` — the mandatory process above.
