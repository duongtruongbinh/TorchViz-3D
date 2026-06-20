---
title: Glossary
type: Glossary
updated: 2026-06-21
---

# Glossary

Project-specific terms used throughout this bundle and the codebase.

- **torchstub** — The fake `torch.nn` package (`src/lib/python_sources.ts`,
  Python-as-TypeScript-strings). Does shape inference only; no tensor math. See
  [concepts/torchstub](concepts/torchstub.md).
- **Shape inference** — Computing a layer's *output shape* and *parameter count*
  from its input shape and config, without performing the actual computation.
- **IR / IRGraph** — The intermediate representation: a JSON graph of nodes and
  edges emitted by the worker and consumed by the renderer. See
  [concepts/ir-contract](concepts/ir-contract.md).
- **IRNode** — One traced operation (a layer). Carries `op_type`, `in_shape`,
  `out_shape`, `params`, optional `children`, `lineno`, `meta`, `error`.
- **IREdge** — A directed connection between nodes, tagged `main`, `residual`
  (from `Add`), or `concat` (from `Concat`).
- **Leaf** — A module drawn as a single block. A module is a leaf **iff** it is
  listed in `Module._leaf_types` (`PY_NN_LEAF_TYPES`).
- **Container** — A module *not* in `_leaf_types`; its `__call__` is traced with
  `push_scope`/`pop_scope`, producing a nested subtree (e.g. `Sequential`, a
  `ResidualBlock`).
- **Collapse / expand** — UI toggle: a collapsed container draws as one block
  (descendants remapped to its id); an expanded one draws as a translucent box
  wrapping its children. Defaults chosen by `initCollapsedIds`.
- **LayoutData** — The output of `computeLayout`: positioned `LayoutNode`s
  (x/y/z, width/height/depth, color) and routed `LayoutEdge`s.
- **Axis swap** — The deliberate convention in `leafSize()`: visual `width`
  encodes channel/feature depth; `height`/`depth` encode spatial dims.
- **Visual kind** — A coarse op category (`Conv`, `Pool`, `Attention`, …) from
  `src/lib/visualKind.ts`, mapping `op_type` → color, geometry, and SVG style.
- **WRAPPER_LINE_OFFSET** — The line count of the Python preamble injected before
  user code, used to translate tracebacks back to editor lines. **Auto-derived**
  via `countPythonPreambleLines` (not hardcoded). See [reference/gotchas](reference/gotchas.md).
- **requestId** — Monotonic id stamped on each worker request; `WorkerService`
  drops responses that aren't the latest, preventing stale renders.
- **Template** — A built-in model (LeNet-5, Mini-ResNet, …) in `src/templates/`,
  registered in `TEMPLATES`. See [reference/templates](reference/templates.md).
- **OKF** — The Open Knowledge Format this bundle conforms to (v0.1): per-page
  `type` frontmatter, bundle-relative (`/...`) links.
