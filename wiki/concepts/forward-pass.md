---
title: Forward-pass animation
type: Subsystem
source: src/components/mnist-demo/*, src/components/operation-effects/*, src/lib/mnistCompatibility.ts
updated: 2026-06-21
---

# Forward-pass animation

The forward-pass animation (toggled by the **Forward pass** switch in the
header — historically "Demo Mode") animates an input flowing through the
network: it topologically orders the layers into *stops*, reveals them
progressively, slides a data packet along the graph edges, highlights the active
layer, and plays a per-operation effect (conv sliding window, pooling, linear,
softmax…) for each stop. Play/pause/step/speed controls live in `DemoControls`.

It runs **entirely off the existing `LayoutData`** — it does no tensor math
(consistent with [torchstub](torchstub.md)); the per-op effects are illustrative.

## Key files

| Path | Role |
|---|---|
| `src/lib/mnistCompatibility.ts` | The availability gate (`getForwardPassCompatibility`). |
| `src/components/mnist-demo/demoStops.ts` | Topologically orders layout nodes into ordered stops. |
| `src/components/mnist-demo/useMnistDemoState.ts` | Playback state (progress, reveal, active node). |
| `src/components/mnist-demo/cifarSamples.ts` | The CIFAR-10-style input packet (rotating set). |
| `src/components/mnist-demo/MnistFlowDemo.tsx` | `useForwardPassInput`, the input tile, `DataFlowDemo`, controls. |
| `src/components/operation-effects/*` | Per-op illustrative effects + their sample data. |

> Note: the directory and several files are still named `mnist-demo` / `mnist*`
> for historical reasons; the feature itself is no longer MNIST-specific.

## Compatibility (generalized)

Originally the gate was **MNIST/LeNet-only**: it required an input of exactly
`[N, 1, 32, 32]` **and** a 10-class `Linear` head, so only LeNet-5 animated.

`getForwardPassCompatibility` now accepts **any** graph with at least one leaf
stop that has a known `in_shape`. The remaining failure reasons only describe
"nothing to animate yet" states: `loading | no-layout | no-stops`. All seven
built-in templates — and arbitrary user models — animate.

## Input packet (CIFAR-10)

The flowing input is a small **rotating set** of procedurally-rendered
CIFAR-10-class colour scenes (`cifarSamples.ts`: Ship / Airplane / Horse /
Automobile). Real CIFAR binaries are **not** bundled (offline constraint), so the
scenes are drawn on a canvas. One sample is picked deterministically per
`${template}:${layoutKey}`.

- `useForwardPassInput(rotationKey, channels)` builds the tile texture and
  returns `{ texture, dataUrl, sampleMatrix, label }`.
- **1-channel models** (LeNet `[N,1,32,32]`) get a grayscaled sample.
- Large-resolution models (224²/128²) show the 32²-class tile scaled — it is a
  *representative* packet, not the literal tensor.
- `sampleMatrix` is an 8×8 grayscale derived from the rendered tile and threaded
  through `OperationEffectProps` so the `Conv2dEffect` input-map matches the
  image flowing in. Effects fall back to `DEMO_SAMPLE_MATRIX` when absent.

See [docs/plans/2026-06-21-forward-pass-all-architectures.md](../../docs/plans/2026-06-21-forward-pass-all-architectures.md)
for the rationale.
