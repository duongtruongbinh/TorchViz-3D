# Architecture

TorchViz-3D turns PyTorch `nn.Module` source code into an interactive 3D isometric
block diagram — entirely in the browser. This document explains how the pieces fit
together so you can navigate and extend the codebase.

If you read only one section, read [The central idea: `torchstub`](#the-central-idea-torchstub).
It is the non-obvious trick the whole project is built on.

> For a structured, agent-readable map of the same material — per-subsystem concept pages,
> guides, and reference — see the [OKF knowledge bundle](../wiki/index.md). This prose doc and
> the wiki cite each other; where they disagree, the code wins.

---

## Data-flow pipeline

```
 ┌──────────────┐   code (string)      ┌──────────────────┐
 │  EditorPane  │ ───────────────────► │  WorkerService   │   src/lib/workerService.ts
 │  (Monaco)    │   setCode()          │  (singleton)     │
 └──────────────┘                      └────────┬─────────┘
        ▲                                        │ postMessage({code, inputShape, requestId})
        │ highlight / errors                     ▼
        │                              ┌──────────────────────────┐
 ┌──────┴───────┐                      │  Web Worker (Blob URL)   │   src/workers/pyodideWorker.ts
 │  zustand     │                      │  ┌────────────────────┐  │
 │  store       │ ◄─── IRGraph JSON ── │  │ Pyodide (Python on │  │
 │  useStore.ts │   (success/partial)  │  │ WASM, from CDN)    │  │
 └──────┬───────┘                      │  │  + torchstub       │  │   src/lib/python_sources.ts
        │ ir                           │  └────────────────────┘  │
        │ computeLayout(ir, collapsed) └──────────────────────────┘
        ▼
 ┌──────────────┐   LayoutData          ┌──────────────┐  ┌──────────────┐
 │   layout.ts  │ ────────────────────► │   Canvas3D   │  │  Inspector   │
 │ (pure func)  │  x/y/z, size, color   │  (R3F/three) │  │  BottomTabs  │
 └──────────────┘                       └──────────────┘  └──────────────┘
```

1. **Edit** — The user writes/pastes an `nn.Module` in the Monaco editor (`EditorPane`).
   Changes flow into the zustand store via `setCode`.
2. **Run** — `WorkerService.run()` reads the current code + input shape from the store and
   `postMessage`s them to the worker with a monotonically increasing `requestId`.
3. **Trace** — The worker boots Pyodide (Python compiled to WebAssembly), installs the
   `torchstub` fake-PyTorch package, executes the user's code against it, and serializes the
   recorded graph to an `IRGraph` JSON.
4. **Layout** — Back on the main thread, `setIrResult` calls the pure function
   `computeLayout(ir, collapsedIds)` to assign 3D coordinates, sizes, and colors, producing
   `LayoutData`.
5. **Render** — `Canvas3D` (React Three Fiber / three.js) draws the blocks and edges; the
   `Inspector` and `BottomTabs` show the layer tree, stats, and terminal output.

Everything runs locally. No code or data ever leaves the browser. Pyodide, Tailwind, and
fonts are fetched from CDNs at runtime (so the app needs network access on first load).

---

## The central idea: `torchstub`

We do **not** run real PyTorch. Real PyTorch is far too large for the browser and we don't
need it — to *draw* a network we only need each layer's **output shape** and **parameter
count**, not its actual numeric output.

So the worker writes a small fake package called `torchstub` into Pyodide's virtual
filesystem (its source lives in `src/lib/python_sources.ts`). Before running the user's code,
the worker injects a preamble (`pyodideWorker.ts`) that imports the stub under the usual
PyTorch aliases:

```python
import torchstub
import torchstub.nn as nn
import torchstub.nn.functional as F
from torchstub import Tensor
import math
```

So user code just uses `nn` / `F` as it would with real PyTorch — no `import torch` needed
(the built-in templates redeclare `import torchstub.nn as nn` for clarity, which is
harmlessly redundant). The worker derives `WRAPPER_LINE_OFFSET` from this preamble
with `countPythonPreambleLines(USER_CODE_PREAMBLE)`, then subtracts it from Python
traceback and node line numbers; see
[Fragile spots](#fragile-spots--gotchas).

`torchstub` mimics the `torch.nn` API but does **shape inference only**:

- **`Tensor`** (`PY_TENSOR`) carries a `shape` tuple and an `id` — never any data.
- **Each layer** (`Conv2d`, `Linear`, `MaxPool2d`, …) computes its output shape from the
  input shape and its own config, plus a parameter count. Example — `Conv2d`:
  - `params = (k·k·Cin + 1)·Cout`
  - `out = (N, Cout, floor((H+2p−k)/s + 1), floor((W+2p−k)/s + 1))`
  No convolution is performed; only arithmetic on the shape.
- **`Module.__call__`** is patched (`PY_NN_MODULE`) to *trace* execution:
  - A **container** module (anything not in `Module._leaf_types`) calls
    `recorder.push_scope()` before `forward()` and `pop_scope()` after — building a nested
    tree that mirrors the model hierarchy (e.g. a `ResidualBlock` wrapping its conv/bn/relu).
  - A **leaf** module records a single node via `_record(...)`.
- **`GraphRecorder`** (`PY_RECORDER`) accumulates nodes and edges. It tags edges by kind:
  `Add` → `residual`, `Concat` → `concat`, everything else → `main`. It serializes the whole
  thing to a dict via `to_dict()`, which becomes the `IRGraph` JSON.

The upshot: user code like `nn.Conv2d(3, 64, 3)(x)` traces into a graph node with the right
shape and param count, with **zero** tensor math, in a sandboxed WASM runtime.

Shape errors (e.g. a `Linear` fed the wrong dimension) are recorded *inline* on the node as
`error`, so the diagram can highlight the exact broken layer instead of just throwing.

> **Consequence — partial coverage by design.** Only layers stubbed in `python_sources.ts`
> exist. An unstubbed `nn.*` layer, or exotic control flow, will fail to trace. Adding
> coverage is the most common contribution — see
> [Extending torchstub](./TORCHSTUB.md).

---

## The IR contract

The `IRGraph` JSON is the boundary between the Python worker and the TypeScript renderer.
Its shape is defined in `src/lib/irTypes.ts`:

```ts
IRGraph {
  nodes: IRNode[]          // top-level (root) nodes; containers nest via `children`
  edges: IREdge[]          // { from, to, kind: 'main' | 'residual' | 'concat' }
  stats: { total_params, approx_memory_mb }
  error?: { message, lineno, hint }   // execution error, if any
  error_node_id?: string              // node that failed shape inference
}

IRNode {
  id, name, op_type
  in_shape, out_shape      // number[]
  params: number
  children?: IRNode[]      // present on containers
  is_container?, collapsed?
  lineno?                  // source line, for editor highlighting
  error?, has_error?       // shape-inference failures
  meta?                    // op-specific extras (kernel, stride, heads, …)
}
```

`worker → main thread` messages are typed `success` (clean), `partial` (graph + error, e.g. a
shape mismatch mid-model), or `error` (couldn't produce a graph at all). `WorkerService`
discards any response whose `requestId` is not the latest, preventing stale renders.

---

## Layout (`src/lib/layout.ts`)

`computeLayout(ir, collapsedIds)` is a **pure function** (easy to test, no React). It walks
the IR tree left-to-right and assigns each node a position and size, then routes the edges.

Key conventions worth knowing before you touch this file:

- **Coordinate axes are intentionally swapped relative to tensor dims.** A block's visual
  `width` encodes the tensor's *channel/feature depth*, while `height`/`depth` encode the
  *spatial* dims. See `leafSize()` — the returned `{ width: d, height: h, depth: w }` line is
  deliberate, not a bug.
- **Sizes are logarithmic.** `scaleDim(val) = log2(val) · factor` so a 512-channel layer
  isn't 256× bigger than a 2-channel one.
- **Containers** are either *collapsed* (drawn as one block, all descendants remapped to the
  container id via `collapsedRemap`) or *expanded* (drawn as a translucent box that wraps its
  laid-out children, with depth-based padding/opacity).
- **Edges** route as orthogonal "circuit-board" polylines. `residual` edges arc *over* any
  blocks between source and target (`maxBlockTopBetween`) so they read as skip connections.

Op colors come from `src/lib/visualKind.ts` (`getVisualMeta` → `KIND_RULES`/`META_MAP`) — the
single source of truth shared by the 3D canvas and SVG export; `src/lib/constants.ts` holds
container colors, the error color, and the rest of the theme.

---

## State (`src/store/useStore.ts`)

A single small zustand store holds: editor `code`, active template, `ir`, `collapsedIds`,
`layout`, hover/selection ids, and loading/error flags. Two things to note:

- **Layout is recomputed synchronously** on every IR change *and* every collapse toggle,
  each wrapped in `try/catch`. A layout bug degrades to `layout: null` (blank canvas) rather
  than crashing the app.
- **`TEMPLATES`** maps the built-in architectures (LeNet-5, Mini-ResNet, Mini-ViT, AlexNet,
  VGG-16, MobileNetV2, UNet) to their source + default input shape.

---

## Landing Page and Learning Lab

The scaffold in
[`docs/plans/2026-06-21-learning-lab-refactor.md`](plans/2026-06-21-learning-lab-refactor.md)
added UI surfaces for the Landing/AppShell path plus placeholder files for
Learning Lab work:

- `src/components/AppShell.tsx`
- `src/components/landing/*`
- `src/components/learning/*`
- `src/components/learning/shared/*`
- `src/core/types.ts`
- `src/core/answerCheck.ts`
- `src/store/uiStore.ts`

MVP 1 imports `AppShell` and `src/components/landing/*` from the root `App.tsx`.
The app opens on the Landing Page, then enters the existing editor/canvas/
inspector workspace through the active TorchViz-3D card.

The Learning Lab is now also reachable from Landing as a separate full-screen
view. It implements a lightweight Learning Path and Review mode backed by
React-free learning content in `src/core/learningContent.ts` and
`src/core/types.ts`. Learning Lab practice cards build representative
`LayoutNode` fixtures and feed them into the existing shape/value exercise model
builders, so users can answer exercises inline without leaving the lab. The
existing in-graph exercise launcher remains unchanged. `src/core/answerCheck.ts`
and `src/store/uiStore.ts` remain reserved for later phases.

The active Landing screen is a compact bento layout with top intro copy, a
left-side live graph preview, and right-side Workspace/Learning cards. The
preview's final classifier block draws anchor-based visual routes to the real
card anchors; Workspace opens the editor/canvas flow, and Learning Lab opens the
guided path/review flow.

Codex agents should use the repo orientation in `CLAUDE.md` as the source for
the initial system prompt, then read the OKF page
[`wiki/concepts/learning-lab-refactor.md`](../wiki/concepts/learning-lab-refactor.md)
for the scaffold map.

---

## Fragile spots / gotchas

- **`WRAPPER_LINE_OFFSET`** in `pyodideWorker.ts` is the line count of the wrapper preamble
  injected before the user's code, used to translate Python tracebacks back to editor line
  numbers. It is **auto-derived** from the preamble via `countPythonPreambleLines`
  (`src/lib/workerLineMapping.ts`) — not a hardcoded constant — so editing the preamble
  updates it automatically. Keep `USER_CODE_PREAMBLE` and `countPythonPreambleLines` honest.
- **Dual module resolution.** `index.html` ships an importmap (esm.sh CDN) *and* Vite bundles
  the same deps. Vite's bundling is authoritative for dev/build; the importmap is the
  no-build-tool fallback. `zustand` is intentionally only in `package.json`. Don't "fix" one
  without understanding the other.
- **Desktop / online only.** The workspace UI enforces `min-width: 1024px` and disables zoom; Pyodide,
  Tailwind, and Google Fonts load from CDNs at runtime.

---

## Directory map

| Path | Responsibility |
| --- | --- |
| `src/workers/pyodideWorker.ts` | Builds the Web Worker; boots Pyodide; runs user code; emits IR. |
| `src/lib/python_sources.ts` | The `torchstub` fake-PyTorch source (Python as TS strings). |
| `src/lib/irTypes.ts` | IR + Layout type definitions; tree helpers; smart-collapse defaults. |
| `src/lib/layout.ts` | Pure IR → 3D `LayoutData` engine + edge routing. |
| `src/lib/constants.ts` | Non-op theme constants — container, edge, text, and UI colors. |
| `src/lib/workerService.ts` | Worker lifecycle + request-id guarding. |
| `src/lib/svgExport.ts` | Publication-quality SVG/PNG export. |
| `src/store/useStore.ts` | zustand app state + built-in templates. |
| `src/components/canvas/Canvas3D.tsx` | React Three Fiber scene (blocks, edges, controls). |
| `src/components/Inspector.tsx` | Layer-tree explorer panel. |
| `src/components/EditorPane.tsx` | Monaco editor wrapper. |
| `src/components/operation-effects/` | Per-op animated effect overlays. |
| `src/templates/` | Built-in model source files. |
