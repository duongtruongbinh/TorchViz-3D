---
title: State Store
type: Subsystem
source: src/store/useStore.ts
updated: 2026-06-24
---

# State Store

A single small **zustand** store (`src/store/useStore.ts`) holds all app state.
`WorkerService` (`src/lib/workerService.ts`) is the bridge between the store and
the [Pyodide worker](../concepts/pyodide-worker.md).

## State shape

The store holds: `language`, `activeTemplate`, `code`, `shapeInput`, the parsed
`ir`, `collapsedIds`, `loading`, `error`, `criticalError`, the editor↔diagram
sync ids (`highlightLine`, `highlightNodeId`, `selectedNodeId`), and the computed
`layout`.

Initial state seeds from the LeNet template: `code = TEMPLATES.lenet.code.trim()`,
`shapeInput = JSON.stringify(TEMPLATES.lenet.shape)`.

## Layout recomputation (synchronous, guarded)

Layout is recomputed **synchronously** on every IR change and every collapse
action, each wrapped in `try/catch`:

- **`setIrResult(ir, error)`** — computes `initCollapsedIds(ir)`, then
  `computeLayout(ir, collapsedIds)`. On success sets `{ ir, collapsedIds, error,
  layout }`; on throw, logs and sets `layout: null` (blank canvas, no crash).
- **`toggleCollapse(nodeId)`** — flips the id in a fresh `Set`, recomputes layout,
  and updates `{ collapsedIds, layout }` (or just `collapsedIds` on failure).
- **`expandAll()`** clears `collapsedIds` and recomputes layout once.
- **`collapseAll()`** collects every non-root container with children into
  `collapsedIds` and recomputes layout once. Top-level root wrappers stay
  expanded so the architecture remains visible instead of becoming one block.

`setActiveTemplate` resets `ir`, `error`, `selectedNodeId`, and `layout` to null
and loads the template's code + default shape.

## Templates

`TEMPLATES` maps id → `{ name, code, shape }` for the seven built-ins:

| id | name | default input shape |
|---|---|---|
| `lenet` | LeNet-5 | `[1, 1, 32, 32]` |
| `resnet` | Mini-ResNet | `[1, 3, 32, 32]` |
| `vit` | Mini-ViT | `[1, 3, 32, 32]` |
| `alexnet` | AlexNet | `[1, 3, 224, 224]` |
| `vgg16` | VGG-16 | `[1, 3, 224, 224]` |
| `mobilenet` | MobileNetV2 | `[1, 3, 224, 224]` |
| `unet` | UNet | `[1, 3, 128, 128]` |

Source files live in `src/templates/`. See
[reference/templates](../reference/templates.md).

## WorkerService

`workerService` (singleton) owns the worker lifecycle and **request-id guarding**:

- **`init()`** — creates the worker, wires `onmessage` (routes `success`/`partial`
  → `setIrResult` + `setLoading(false)`; else → `setError`) and `onerror`
  (→ `setCriticalError`).
- **`run()`** — reads `code` + `shapeInput` from the store, parses the shape
  (`parseShape`, falling back to the template's default), stamps a new
  `requestId`, sets loading, and posts to the worker.
- **`runWithCodeAndShape(code, shape)`** — same, for ad-hoc runs.
- **Stale-response guard:** `onmessage` ignores any message whose `requestId`
  isn't `activeRequestId`.

`parseShape(s)` accepts only a non-empty JSON array of positive integers; else
returns `null`.

## Related

- [pyodide-worker](../concepts/pyodide-worker.md) — what `run()` posts to.
- [layout-engine](../concepts/layout-engine.md) — `computeLayout`, called here.
- [ir-contract](../concepts/ir-contract.md) — `initCollapsedIds` and the IR type.
