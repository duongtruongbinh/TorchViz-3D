---
title: Add a torchstub layer
type: Playbook
updated: 2026-06-21
---

# Playbook: add a `torchstub` layer

Adding shape-inference support for a new `nn.*` layer so models using it can be
visualized. The narrative version is [docs/TORCHSTUB.md](../../docs/TORCHSTUB.md);
this is the checklist. Background: [concepts/torchstub](../concepts/torchstub.md).

All `torchstub` source is Python-in-TypeScript strings in
`src/lib/python_sources.ts` — there is no `.py` file.

## Steps

### 1. Define the class

Add it to the appropriate `PY_NN_*` section constant (e.g. `PY_NN_CONV` for
conv-family, `PY_NN_EXTRA` for misc). Compute `self.params` in `__init__` and the
output shape in `forward`, then return through `_record`:

```python
class ConvTranspose2d(Module):
    def __init__(self, in_channels, out_channels, kernel_size, stride=1, padding=0):
        super().__init__()
        self.out_channels = out_channels
        self.kernel_size = kernel_size if isinstance(kernel_size, tuple) else (kernel_size, kernel_size)
        self.stride, self.padding = stride, padding
        k = self.kernel_size
        self.params = (k[0] * k[1] * in_channels + 1) * out_channels

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

**Always validate input rank** and return a node with an `error` string rather
than letting Python throw — that yields a clean in-diagram error instead of a
crash. See the [IR contract](../concepts/ir-contract.md) for the node fields.

### 2. Register it as a leaf type

A module is drawn as a single block **only if** it is in `Module._leaf_types`
(`PY_NN_LEAF_TYPES`). Add your class to that set:

```python
Module._leaf_types = {Conv2d, ConvTranspose2d, Linear, MaxPool2d, ...}
```

> **#1 mistake:** forgetting this. An unregistered layer recurses into its own
> `forward` as a container, producing a wrong/empty subtree.

If your module is meant to *contain* sub-layers (like `Sequential`), do **not**
add it to `_leaf_types`; give it a `forward` that calls its children and the
patched `Module.__call__` builds the subtree automatically.

### 3. Give it a color

Colors are matched by `op_type` in **`src/lib/visualKind.ts`** — the ordered
`KIND_RULES` regex table → a `VisualKind` → `META_MAP` color. If an existing
rule already covers the name (e.g. `/conv/i` matches `ConvTranspose2d`), you're
done. Otherwise add a `KIND_RULES` entry (mind ordering: specific before
generic) and, if it's a new category, a `META_MAP` entry.

> Note: color is **not** in `constants.ts` (the prose docs are stale on this).

### 4. (Optional) expose it under `F`

`torchstub.nn.functional` is `from ..ops import *`. For a functional form
(`F.conv_transpose2d`), add a function to `PY_OPS` that calls `_record` the same
way.

### 5. Test it

Add a tiny model using the layer to a [template](../reference/templates.md) or
paste it into the running app, and confirm: the block appears with the right
output shape; the param count matches real PyTorch; a deliberately wrong input
shape shows a red error node, not a crash. Then:

```bash
npm test    # node --test on src/lib/*.test.ts
```

## Conventions

- **Shape only, never data** — `Tensor` has no values; only read/derive `.shape`.
- **Param formulas must match real PyTorch**, including `+1` bias terms.
- **Return via `_record`**, even on the error path — that's what registers the
  node and edges.
- **`meta` is free-form**, surfaced in the Inspector (kernel/stride/heads/…).
- **Don't reach for `inspect`/line numbers** in your layer —
  `GraphRecorder._get_lineno()` already captures source lines.
- Editing the worker **preamble** is not normally needed for a new layer; if you
  do, `WRAPPER_LINE_OFFSET` is auto-derived from it (see
  [pyodide-worker](../concepts/pyodide-worker.md)), so no manual constant bump.

## Related

- [concepts/torchstub](../concepts/torchstub.md)
- [concepts/ir-contract](../concepts/ir-contract.md)
- [reference/gotchas](../reference/gotchas.md)
