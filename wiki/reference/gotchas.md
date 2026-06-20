---
title: Gotchas
type: Reference
updated: 2026-06-21
---

# Gotchas

The canonical list of fragile spots. Read before touching the worker, the
layout, or the build config.

## Worker / line mapping

- **`WRAPPER_LINE_OFFSET` is auto-derived — don't hardcode it.** In
  `src/workers/pyodideWorker.ts` it is computed from the injected preamble via
  `countPythonPreambleLines(USER_CODE_PREAMBLE)`
  (`src/lib/workerLineMapping.ts`), then used to translate Python tracebacks back
  to editor line numbers. Editing the preamble updates the offset automatically.
  Keep `USER_CODE_PREAMBLE` and `countPythonPreambleLines` consistent; don't
  reintroduce a magic constant.
  - ⚠️ **Stale prose:** [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md) and
    `CLAUDE.md` still describe this as a hardcoded `7`. The code has moved on.
- **Pyodide loads from a CDN.** `pyodideWorker.ts` tries jsDelivr → unpkg →
  iodide via `importScripts`. The app needs network access on first load; if all
  CDNs fail, the worker throws a clear error surfaced as a critical UI error.
- **The worker is an inlined Blob string.** Sources are `JSON.stringify`'d into
  the worker code; you can't `import` arbitrary modules into it. New `torchstub`
  parts must be threaded through the `pythonSources` object.

## torchstub

- **Register new leaf layers in `Module._leaf_types`** (`PY_NN_LEAF_TYPES`), or
  they recurse as containers and produce wrong/empty subtrees. This is the #1
  extension mistake. See [add-a-layer](../guides/add-a-layer.md).
- **Shape only, never data.** `Tensor` has no values; only `.shape`.
- **Return via `_record` even on errors** — set the `error` string instead of
  raising, so the diagram shows a red node, not a crash.
- **Partial coverage by design.** Unstubbed `nn.*` layers or exotic control flow
  won't trace.

## Layout

- **The axis swap is deliberate.** In `leafSize()`
  (`src/lib/layout.ts`), the returned `{ width: d, height: h, depth: w }` maps
  channel/feature depth to visual *width* and spatial dims to *height/depth*.
  Not a bug — don't "fix" it. See [layout-engine](../concepts/layout-engine.md).
- **Sizes are logarithmic** (`scaleDim = log2(val) * factor`); raw dims will
  blow up the scene.
- **Layout failures degrade to `layout: null`** (blank canvas), guarded by
  `try/catch` in the [store](../concepts/state-store.md). A blank canvas usually
  means a thrown layout error — check the console.

## Rendering / colors

- **Op color lives in `src/lib/visualKind.ts`** (`KIND_RULES` → `META_MAP`), the
  single source shared by Canvas3D and SVG export — **not** `constants.ts`.
  - ⚠️ **Stale prose:** [docs/TORCHSTUB.md](../../docs/TORCHSTUB.md) still references
    `OP_MATCHERS` / `OP_COLORS` in `constants.ts`.
- **`KIND_RULES` order matters** — first regex match wins; put specific patterns
  (e.g. `^relu$`) before generic ones.

## Build / environment

- **Dual module resolution.** `index.html` ships an importmap (esm.sh CDN) *and*
  Vite bundles the same deps. Vite is authoritative for dev/build; the importmap
  is the no-build-tool fallback. `zustand` is intentionally only in
  `package.json`. Don't "fix" one without understanding the other.
- **Desktop + online only.** The UI enforces a `min-width` and disables zoom;
  Pyodide, Tailwind, and Google Fonts load from CDNs at runtime.

## Stale renders

- **`requestId` guarding.** `WorkerService` drops any worker response whose
  `requestId` isn't the latest. If you add new worker round-trips, stamp and
  check the id or you'll render stale graphs.
