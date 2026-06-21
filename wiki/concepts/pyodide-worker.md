---
title: Pyodide Worker
type: Subsystem
source: src/workers/pyodideWorker.ts
updated: 2026-06-21
---

# Pyodide Worker

The worker is where the user's Python actually runs. `createWorker()` builds a
Web Worker from an **inlined source string** wrapped in a `Blob` URL — the
`torchstub` sources are `JSON.stringify`'d into the worker code so nothing has to
cross `postMessage` as a complex object.

Source: `src/workers/pyodideWorker.ts`. Driven by
[WorkerService](../concepts/state-store.md#workerservice) on the main thread.

## Boot sequence (`setupPyodide`)

1. **Load Pyodide from a CDN, with fallback.** `cdnSources` lists three CDNs
   (jsDelivr → unpkg → iodide); `loadPyodideScript()` tries each via
   `importScripts` until `loadPyodide` is defined. The chosen `indexURL` is
   passed to `loadPyodide` so it can find the `.wasm` files.
2. **Write the `torchstub` package** into the virtual FS:
   `torchstub/__init__.py`, `tensor.py`, `ops.py`, `recorder.py`,
   `nn/__init__.py`, and `nn/functional.py` (= `from ..ops import *`).
3. **`loadPackage(['micropip'])`** and cache the `pyodide` instance.

If no CDN loads, `setupPyodide` throws a clear "could not load Pyodide" error
that surfaces as a critical error in the UI.

## Per-run sequence (`self.onmessage`)

Each message is `{ code, inputShape, requestId }`. The worker:

1. Resets the recorder (`get_recorder().reset()`).
2. Builds **wrapped code**: `USER_CODE_PREAMBLE` + the user code + an epilogue
   that instantiates the model and traces it.
3. Runs it, extracts the IR (`extractionCode` → `rec.to_dict()` as JSON),
   adjusts line numbers, and posts back `success` | `partial` | `error`.

### The preamble

```python
import torchstub
import torchstub.nn as nn
import torchstub.nn.functional as F
from torchstub import Tensor
import math
```

So user code uses `nn` / `F` as with real PyTorch — no `import torch` needed.

### Model entry-point resolution

The epilogue finds the model to trace:

- uses `model` if defined, else
- instantiates `Net()` if a `Net` class exists, else
- calls `build_model()` if defined, else
- raises `"Code must define 'model = ...' or class Net or function build_model()"`.

Then it builds `x = Tensor(input_dims)` and calls `model(x)`, capturing any
exception into `recorder.execution_error` with a best-effort `lineno`.

## Line-number mapping (important)

Python tracebacks reference lines in the *wrapped* code, but the editor shows the
*user's* code. The worker translates with `WRAPPER_LINE_OFFSET`:

```
toUserLineno(wrappedLine) = max(1, wrappedLine - WRAPPER_LINE_OFFSET)
```

**`WRAPPER_LINE_OFFSET` is auto-derived**, not a magic number:

```ts
const USER_CODE_PREAMBLE_LINE_COUNT = countPythonPreambleLines(USER_CODE_PREAMBLE);
// ... WRAPPER_LINE_OFFSET = USER_CODE_PREAMBLE_LINE_COUNT
```

`countPythonPreambleLines` (`src/lib/workerLineMapping.ts`) returns
`preamble.split('\n').length - 1`. Both `parseErrorLineno` (regex on
`File "<exec>", line N`) and `adjustNodeLinenos` (walks the node tree) subtract
this offset.

> Editing the preamble no longer needs a manual constant bump because the code
> derives the offset — but keep `USER_CODE_PREAMBLE` and
> `countPythonPreambleLines` honest. See
> [reference/gotchas](../reference/gotchas.md).

## Result message types

- **`success`** — clean graph, no error.
- **`partial`** — graph **plus** an error (e.g. a shape mismatch mid-model); the
  diagram renders what traced and flags the failure.
- **`error`** — no graph could be produced at all.

Each carries the originating `requestId`; the main thread uses it to drop stale
responses (see [ir-contract](../concepts/ir-contract.md) and
[state-store](../concepts/state-store.md#workerservice)).

## Related

- [torchstub](../concepts/torchstub.md) — the package this worker writes and runs.
- [ir-contract](../concepts/ir-contract.md) — the JSON the worker emits.
- [reference/gotchas](../reference/gotchas.md) — CDN dependence, line offset.
