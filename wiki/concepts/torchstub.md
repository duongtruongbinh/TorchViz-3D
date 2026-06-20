---
title: torchstub — shape-only fake torch.nn
type: Subsystem
source: src/lib/python_sources.ts
updated: 2026-06-21
---

# torchstub

`torchstub` is the fake `torch.nn` that TorchViz-3D traces instead of running
real PyTorch. It does **shape inference only** — no tensor math. Its entire
source lives in `src/lib/python_sources.ts` as **Python-in-TypeScript strings**;
the worker writes them into Pyodide's virtual filesystem at boot (there is no
`.py` file on disk to edit).

## Why a stub

Real PyTorch is far too large for the browser, and to *draw* a network we only
need each layer's **output shape** and **parameter count**. So the stub mimics
the `nn` API surface but every layer just does arithmetic on shapes.

## Module layout (the `PY_*` constants)

The worker assembles the package from these exported string constants:

| Constant | Written to | Role |
|---|---|---|
| `PY_INIT` | `torchstub/__init__.py` | Package root; re-exports `Tensor`, etc. |
| `PY_TENSOR` | `torchstub/tensor.py` | `Tensor` — carries a `shape` tuple + `id`, never data. |
| `PY_OPS` | `torchstub/ops.py` | Functional ops; also aliased as `nn.functional`. |
| `PY_RECORDER` | `torchstub/recorder.py` | `GraphRecorder` + `_record`; builds the IR. |
| `PY_NN_INIT` | `torchstub/nn/__init__.py` | The `nn` namespace — **joined** from sub-parts (below). |

`PY_NN_INIT` is a `.join('\n')` of, in order:
`PY_NN_IMPORTS`, `PY_NN_MODULE`, `PY_NN_CONV`, `PY_NN_LINEAR`, `PY_NN_POOL`,
`PY_NN_NORM_ACT`, `PY_NN_EXTRA`, `PY_NN_LEAF_TYPES`.

`torchstub/nn/functional.py` is just `from ..ops import *` (written directly by
the worker), which is what makes `import torchstub.nn.functional as F` work.

## How tracing works

### Tensor

`Tensor` (`PY_TENSOR`) holds a `shape` tuple and a unique `id`. It carries **no
values**. Layers read `.shape`, derive an output shape, and return a new
`Tensor`.

### `_record` — the emit primitive

Every layer ends by calling `_record` (in `PY_RECORDER`):

```python
def _record(op_type, inputs, out_shape, params=0, meta=None, error=None) -> Tensor
```

It allocates a `node_{n}` id, draws edges from each input tensor's producing
node, and appends the node to the current scope's children. If `error` is set,
the node is flagged and `error_node_id` is recorded.

### Leaf vs container — `Module.__call__`

`Module.__call__` (`PY_NN_MODULE`) is patched to trace:

- **Container** (any module whose `type(self)` is **not** in
  `Module._leaf_types`): calls `recorder.push_scope(...)` before `forward()` and
  `pop_scope(...)` after, building a nested subtree that mirrors the model
  hierarchy.
- **Leaf** (a type listed in `Module._leaf_types`): records a single node and
  does not recurse.

The leaf set (`PY_NN_LEAF_TYPES`) currently is:

```
Conv2d, Linear, MaxPool2d, AvgPool2d, AdaptiveAvgPool2d, ConvTranspose2d,
BatchNorm2d, LayerNorm, GroupNorm, InstanceNorm2d, Identity, ReLU, GELU, SiLU,
LeakyReLU, ELU, Hardswish, Sigmoid, Tanh, Softmax, Dropout, Dropout2d, Flatten,
MultiheadAttention, Embedding, RNN, LSTM, GRU, PixelShuffle, Upsample
```

> **#1 mistake when extending:** forgetting to add a new leaf class to
> `_leaf_types`. An unregistered layer recurses into its own `forward` as if it
> were a container, producing a wrong/empty subtree.

### GraphRecorder and edge kinds

`GraphRecorder` (`PY_RECORDER`) accumulates nodes and edges and serializes via
`to_dict()` → the `IRGraph`. It tags each edge by the producing `op_type`:

- `op_type == "Add"` → `residual`
- `op_type == "Concat"` → `concat`
- everything else → `main`

It also captures `lineno` per node (via `_get_lineno`, scanning the stack for
`<exec>`/`pyodide_kernel` frames) for editor highlighting, and stores any
top-level `execution_error` on the dict as `error`.

## Errors are inline, by design

A shape problem (e.g. a `Linear` fed the wrong dimension) is returned through
`_record(..., error="…")` as an `error` string on the node, so the diagram
highlights the exact broken layer instead of throwing an opaque exception.

## Consequence — partial coverage by design

Only stubbed layers exist. An unstubbed `nn.*` layer, or exotic control flow,
fails to trace. **Adding coverage is the most common contribution** — see the
[add-a-layer playbook](../guides/add-a-layer.md) and the narrative
[docs/TORCHSTUB.md](../../docs/TORCHSTUB.md).

## Related

- [pyodide-worker](../concepts/pyodide-worker.md) — who writes and runs this stub.
- [ir-contract](../concepts/ir-contract.md) — the shape of what `to_dict()` emits.
- [reference/gotchas](../reference/gotchas.md) — line-offset and coverage gotchas.
