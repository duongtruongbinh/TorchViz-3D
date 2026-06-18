# Extending `torchstub`

`torchstub` is the fake `torch.nn` that TorchViz-3D traces instead of running real PyTorch.
It does **shape inference only** — see [ARCHITECTURE.md](./ARCHITECTURE.md#the-central-idea-torchstub)
for the why. This guide covers the most common contribution: **adding support for a new
layer** so models that use it can be visualized.

All `torchstub` source lives in **`src/lib/python_sources.ts`** as Python-in-TypeScript
strings (the worker writes them into Pyodide's virtual filesystem — there is no `.py` file to
edit).

---

## How a layer is traced

Every layer is a `Module` subclass. Its `forward()` receives a `Tensor` (which carries only a
`.shape`), computes the **output shape** and **parameter count**, and calls `_record(...)` to
emit a node into the graph:

```python
def _record(op_type, inputs, out_shape, params=0, meta=None, error=None) -> Tensor
```

- `op_type` — the string shown on the block and used for coloring (see step 3).
- `inputs` — list of input `Tensor`s; used to draw edges.
- `out_shape` — the tuple your layer produces.
- `params` — trainable parameter count (drives the stats panel + block size).
- `meta` — optional dict of extras surfaced in the Inspector (e.g. `{"kernel": (3, 3)}`).
- `error` — a string; if set, the node is flagged red and tracing stops with a `GraphError`.

---

## Adding a leaf layer — step by step

Suppose you want to add `nn.ConvTranspose2d`.

### 1. Define the class

Add it to the appropriate section constant in `python_sources.ts` (e.g. `PY_NN_CONV` for
conv-family layers, or `PY_NN_EXTRA` for misc). Compute params in `__init__`, shape in
`forward`:

```python
class ConvTranspose2d(Module):
    def __init__(self, in_channels, out_channels, kernel_size, stride=1, padding=0):
        super().__init__()
        self.out_channels = out_channels
        self.kernel_size = kernel_size if isinstance(kernel_size, tuple) else (kernel_size, kernel_size)
        self.stride = stride
        self.padding = padding
        k = self.kernel_size
        self.params = (k[0] * k[1] * out_channels + 1) * in_channels

    def forward(self, x):
        if len(x.shape) < 4:
            return _record("ConvTranspose2d", [x], x.shape, self.params,
                error=f"Shape Mismatch: ConvTranspose2d expects 4D input, got {len(x.shape)}D")
        k, s, p = self.kernel_size, self.stride, self.padding
        h_out = (x.shape[2] - 1) * s - 2 * p + k[0]
        w_out = (x.shape[3] - 1) * s - 2 * p + k[1]
        out_shape = (x.shape[0], self.out_channels, h_out, w_out)
        return _record("ConvTranspose2d", [x], out_shape, self.params,
                       {"kernel": self.kernel_size, "stride": s})
```

**Always validate input rank** and return a node with an `error` string rather than letting
Python throw — that produces a clean in-diagram error instead of an opaque crash.

### 2. Register it as a leaf type

A module is treated as a single block (a "leaf") **only if it is listed in
`Module._leaf_types`** (`PY_NN_LEAF_TYPES`). Anything not listed is treated as a *container*
that recurses into its `forward`. Add your class:

```python
Module._leaf_types = {Conv2d, ConvTranspose2d, Linear, MaxPool2d, ...}
```

> Forgetting this is the #1 mistake: an unregistered layer will try to recurse into its own
> `forward` as if it were a container, producing a wrong/empty subtree.

### 3. Give it a color

Colors are matched by regex on `op_type` in **`src/lib/constants.ts`** (`OP_MATCHERS`). If an
existing pattern already covers your op name you're done; otherwise add a matcher and a legend
entry in `OP_COLORS`:

```ts
[/conv/i, '#60a5fa'],   // already matches "ConvTranspose2d" — nothing to add
```

Unmatched ops fall back to the gray `Default` color.

### 4. (Optional) expose it under `F`

`torchstub.nn.functional` is just `from ..ops import *` (see the worker's
`functional.py` write). If you also want a functional form (`F.conv_transpose2d`), add a
function to `PY_OPS` that calls `_record(...)` the same way.

### 5. Test it

Add a tiny model using the new layer to a template in `src/templates/`, or paste it into the
running app, and confirm:
- the block appears with the right output shape,
- the parameter count looks right (compare against real PyTorch if unsure),
- a deliberately wrong input shape shows the red error node, not a crash.

Then run the suite:

```bash
npm test
```

---

## Adding a container module

If your module is meant to *contain* sub-layers (like `Sequential` or a custom block), **do
not** add it to `_leaf_types`. Just give it a `forward` that calls its children; the patched
`Module.__call__` will automatically `push_scope`/`pop_scope` around it and build the nested
subtree. `Sequential` (in `PY_NN_EXTRA`) is the reference example.

---

## Conventions & gotchas

- **Shape only, never data.** `Tensor` has no values. Never index into data; only read/derive
  `.shape`.
- **Param formulas must match real PyTorch** (the stats panel and `ParamFormulaPopup` are
  treated as accurate). Include the `+1` bias terms where PyTorch does.
- **Return via `_record`**, even on the error path — that's what registers the node and edges.
- **`meta` is free-form** and surfaced in the Inspector; use it for kernel/stride/heads/etc.
- **Don't reach for `inspect`/line numbers** in your layer — `GraphRecorder._get_lineno()`
  already captures source lines for editor highlighting.
- After editing the **wrapper preamble** in `pyodideWorker.ts` (not normally needed for a new
  layer), update `WRAPPER_LINE_OFFSET` — see ARCHITECTURE.md gotchas.
