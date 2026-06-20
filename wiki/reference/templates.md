---
title: Built-in Templates
type: Reference
source: src/store/useStore.ts, src/templates/
updated: 2026-06-21
---

# Built-in Templates

The app ships seven built-in models, registered in `TEMPLATES`
(`src/store/useStore.ts`) and sourced from `src/templates/`. The active template
seeds the editor `code` and the default `shapeInput`. The initial template on
load is **LeNet-5**.

| id | name | source file | default input shape | notes |
|---|---|---|---|---|
| `lenet` | LeNet-5 | `src/templates/lenet5.ts` | `[1, 1, 32, 32]` | Classic small CNN; grayscale input. |
| `resnet` | Mini-ResNet | `src/templates/mini_resnet.ts` | `[1, 3, 32, 32]` | Exercises **residual** (`Add`) edges. |
| `vit` | Mini-ViT | `src/templates/mini_vit.ts` | `[1, 3, 32, 32]` | Patch embedding + attention; 3D/2D shapes. |
| `alexnet` | AlexNet | `src/templates/alexnet.ts` | `[1, 3, 224, 224]` | Deeper conv stack. |
| `vgg16` | VGG-16 | `src/templates/vgg16.ts` | `[1, 3, 224, 224]` | Large param count; tests log-scale sizing. |
| `mobilenet` | MobileNetV2 | `src/templates/mobilenet_v2.ts` | `[1, 3, 224, 224]` | Nested blocks; collapse/expand. |
| `unet` | UNet | `src/templates/unet.ts` | `[1, 3, 128, 128]` | Exercises **concat** (skip) edges + upsampling. |

## Shape format

Input shapes are JSON arrays of positive integers (`parseShape` in
`src/lib/workerService.ts`). A `[N, C, H, W]` 4D shape is the common case; ViT
produces 3D/2D shapes downstream. An invalid shape string falls back to the
active template's default.

## Adding a template

1. Add a source file under `src/templates/` exporting the model code string.
2. Import it in `src/store/useStore.ts` and add an entry to `TEMPLATES` with a
   `name` and a valid default `shape`.
3. The model must define `model = ...`, a `Net` class, or a `build_model()`
   function (see [pyodide-worker](../concepts/pyodide-worker.md#model-entry-point-resolution)).
4. Every layer it uses must be a stubbed `torchstub` leaf — otherwise
   [add it first](../guides/add-a-layer.md).

## Related

- [state-store](../concepts/state-store.md) — `TEMPLATES` and how a template loads.
- [guides/add-a-layer](../guides/add-a-layer.md) — supporting new layers.
