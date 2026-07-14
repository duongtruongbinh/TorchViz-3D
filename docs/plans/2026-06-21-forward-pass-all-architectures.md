---
title: Generalize the forward-pass animation to all architectures
status: done
created: 2026-06-21T00:00:00Z
updated: 2026-07-14T13:14:00+07:00
author: hienlong
task: "Create the forward propagation (animated forward pass) for each architecture, not just LeNet/MNIST."
supersedes: []
---

# Goal

Make the animated **forward pass** ("Demo Mode") run for **every** template
(LeNet-5, Mini-ResNet, Mini-ViT, AlexNet, VGG-16, MobileNetV2, UNet) and for
arbitrary user-authored `nn.Module`s — not only the MNIST/LeNet special case.

Success looks like: toggling forward-pass mode on any of the seven built-in
templates reveals the layers progressively, flows a **generic input data
packet** through the graph along its edges, highlights the active layer, and
plays the existing per-operation effects (conv window, pooling, linear, etc.)
through to the model's final layer — with play/pause/speed controls working.

# Lineage

Genesis plan — no predecessor.

# Background (grounded in the code)

The forward-pass animation already exists as **Demo Mode**. The engine is solid
and architecture-agnostic *except* for a hard gate and an MNIST-specific input:

- `src/lib/mnistCompatibility.ts` → `getMnistDemoCompatibility()` rejects the
  graph unless the input shape is **exactly `[N, 1, 32, 32]`** (`input-shape`
  reason) **and** there is a **10-class `Linear` head** (`missing-head` reason).
  Only LeNet-5 satisfies both. This is the primary blocker.
- `src/components/mnist-demo/MnistFlowDemo.tsx` renders a hardcoded 8×8 MNIST
  digit (`DEMO_MNIST_MATRIX`, `createMnistCanvasFromMatrix`, `useMnistTexture`)
  as the input tile that flows into the first block.
- Ordering, reveal, packet routing, per-op effects, and controls
  (`demoStops.ts`, `useMnistDemoState.ts`, `effectMath.ts`,
  `operation-effects/*`, `DataFlowDemo`, `DemoControls`) are already generic
  over the IR/Layout graph and need no structural change.

So the work is: (1) relax the gate, (2) replace the MNIST digit with a generic
tensor packet, (3) neutralize the digit-shaped sample data used by effects, and
(4) update user-facing "MNIST" labels to "Forward pass".

# Decisions (locked)

1. **Scope** = all 7 templates + arbitrary models, with a **generic input
   packet** (per user). No keeping the MNIST digit for LeNet.
2. **Compatibility** is relaxed, not removed. New predicate accepts a graph that
   has ≥1 ordered stop and a first leaf with a non-empty `in_shape`, and is not
   loading / has no fatal layout error. The `input-shape` and `missing-head`
   gates are dropped. Keep a single `reason` enum for the disabled-toggle
   tooltip (`loading`, `no-layout`, `no-stops`).
3. **No big rename of files/dirs.** The `mnist-demo/` directory and `mnist*`
   filenames stay (renaming them is churn with merge risk). We rename the
   *compatibility function* semantics and the *user-facing strings* only.
   `getMnistDemoCompatibility` is renamed to `getForwardPassCompatibility` with
   a thin back-compat re-export to avoid a sprawling diff; deeper file renames
   are an explicit follow-up, out of scope here.
4. **Input visual = CIFAR-10 sample (rotating set).** Replace the MNIST digit
   tile with a **small rotating set (~3-4) of 32×32 RGB CIFAR-10-class samples**
   (e.g. ship, horse, airplane, frog), one picked per run. Rationale: real
   3-channel natural images match 5/7 templates, exactly match ResNet/ViT's
   `[1,3,32,32]`, and give structured conv/pool effects. Data is **embedded**
   (hardcoded matrices) — nothing fetched, stays fully offline. Handling:
   - **1-channel inputs (LeNet `[1,1,32,32]`)**: grayscale the sample.
   - **Large-resolution models (224²/128²)**: show the 32×32 tile scaled — it is
     a *representative* input packet, not the literal tensor.
   - Reuse the existing input-pose/sizing logic from `getDemoInputPose`.
   - Source note: if real CIFAR binaries aren't available offline, embed compact
     hand-authored class-representative 32×32 RGB samples (decided at execution).
5. **Effect sample data**: per-op effect math (conv/pool/relu/linear) stays
   conceptual, but `DEMO_MNIST_MATRIX` is reframed as `DEMO_SAMPLE_MATRIX`
   derived from a **grayscale crop of the active CIFAR sample**, so what the
   viewer sees enter the network matches what the conv window operates on. Math
   is unchanged.
6. **Labels**: "MNIST demo / MNIST flow" → "Forward pass" across `localization.ts`
   (`en` + `vi`), Header tooltips, onboarding tour, and exercise copy that
   references the digit. No behavior tied to the rename.

# Phases

## Phase 0 — Store this plan
Write this file. (Done by creating it.) **Checkpoint: get approval before Phase 1.**

## Phase 1 — Relax the compatibility gate
- Rewrite `src/lib/mnistCompatibility.ts`:
  - New `getForwardPassCompatibility(stops, { loading })` with reasons
    `loading | no-layout | no-stops`.
  - Keep `getMnistDemoCompatibility` as a deprecated alias → new function so
    existing imports keep compiling; migrate call sites incrementally.
- Update call sites: `useMnistDemoState.ts`, `demoStops.ts`, `Header.tsx`,
  `Canvas3D.tsx` (compatibility text/branches).
- Update/extend `src/lib/*compatibility*.test.ts` (or add one) to assert all
  seven templates' representative stop sets now pass, and that empty/loading
  still fail.
**Checkpoint: `npm test` green; demo toggle enabled on all 7 templates.**

## Phase 2 — CIFAR-10 input packet (rotating set)
- Add embedded CIFAR-10 sample data: ~3-4 32×32 RGB matrices in `effectData.ts`
  (e.g. `DEMO_CIFAR_SAMPLES`), one selected per run (rotate on layout/template
  change).
- In `MnistFlowDemo.tsx`: replace `createMnistCanvasFromMatrix` digit rendering
  with a CIFAR-tile renderer (RGB). Grayscale when the first leaf's `in_shape`
  is 1-channel; scale-as-tile for large-resolution models. Keep
  `useMnistTexture`'s pose/size API.
- Verify the packet still routes from the input tile through edges to the head
  for a 3-channel model (e.g. AlexNet) and a no-Linear model (UNet).

## Phase 3 — Sample data from CIFAR + cover all op kinds
- Replace `DEMO_MNIST_MATRIX` → `DEMO_SAMPLE_MATRIX`, derived as a grayscale 8×8
  crop of the active CIFAR sample; update `effectData.ts` consumers and remove
  `DEMO_TARGET_DIGIT` (digit-specific) usage.
- Audit `operation-effects/index.tsx` `EFFECT_BY_KIND` vs. the op kinds present
  in ViT (Attention, LayerNorm, GELU, Permute) and UNet (Upsample, AddConcat):
  ensure every stop either has an effect or degrades gracefully to a plain
  active-highlight (no crash, no empty render). Add minimal passthrough effects
  only where a stop currently renders nothing meaningful.

## Phase 4 — Rename user-facing labels
- `src/lib/localization.ts`: "MNIST demo/flow/input" → "Forward pass" (`en`+`vi`),
  including the disabled tooltip, onboarding tour items, and exercise copy.
- `Header.tsx` `demoUnavailableTitle` strings → forward-pass wording matching the
  new reasons.

## Phase 5 — Tests, docs, log
- `npm test` + `npm run build` clean.
- Update docs: `wiki/` subsystem page for the demo/forward-pass flow,
  `README.md` feature blurb, and this plan's Execution log. Note the deferred
  file/dir rename as a follow-up.

# Out of scope
- Renaming the `mnist-demo/` directory or `mnist*` source files.
- Real numerical forward propagation (we keep shape-only + illustrative effects;
  no tensor math, consistent with `torchstub`).
- New per-architecture bespoke animations beyond making existing effects apply.
- Per-architecture *distinct* inputs — one shared rotating CIFAR-10 set is used
  for all models (grayscaled for 1-channel inputs).

# Execution log
- 2026-06-21 — Plan created (draft).
- 2026-06-21 — Approved; CIFAR-10 rotating-set input decision added (Decisions 4-5).
- 2026-06-21 — **Phase 1 done.** Relaxed `src/lib/mnistCompatibility.ts`:
  `getForwardPassCompatibility` (reasons `loading | no-layout | no-stops`),
  dropped `input-shape`/`missing-head` gates; kept `getMnistDemoCompatibility`
  +`getMnistDemoLayoutAvailability` as deprecated aliases. Migrated call sites
  (`demoStops.ts` → `getForwardPass*` fns, `useMnistDemoState.ts`, `Header.tsx`
  tooltip wording). Rewrote `mnistCompatibility.test.ts` to cover LeNet (1-ch),
  CIFAR-style 3-ch + 1000-class head, and UNet (no Linear head). `npm test`
  57/57 green; `npm run build` clean. Checkpoint reached.
- 2026-06-21 — **Phases 2-4 done.** Input packet is now a CIFAR-10-style colour
  image (rotating set). New `src/components/mnist-demo/cifarSamples.ts`:
  procedurally-rendered Ship/Airplane/Horse/Automobile RGB scenes (real CIFAR
  binaries aren't bundled — offline), `pickCifarSampleIndex` (rotation by
  template/layout key), `renderCifarSampleCanvas` (grayscale for 1-ch inputs),
  `deriveSampleMatrix` (8×8 grayscale derived from the rendered tile).
  `useMnistTexture` → `useForwardPassInput(rotationKey, channels)` returning
  `{ texture, dataUrl, sampleMatrix, label }`. Threaded `sampleMatrix` through
  `DataFlowDemo` → `OperationEffectProps` → `Conv2dEffect` so the conv input-map
  matches the flowing image. Renamed `DEMO_MNIST_MATRIX` → `DEMO_SAMPLE_MATRIX`
  (fallback) and `DEMO_TARGET_DIGIT` → `DEMO_TARGET_CLASS`. Canvas3D computes
  input channels from the first leaf's `in_shape` and a `${template}:${layoutKey}`
  rotation key. Labels renamed "MNIST demo/flow" → "Forward pass" /
  "Input image" across `localization.ts` (en+vi: canvas demo block, help
  `mnistItems`, onboarding tour). Internal `mnist-demo*` filenames and
  `data-tour="mnist-demo-*"` IDs kept (not user-facing). `npm test` 57/57 green;
  `npm run build` clean.
- 2026-06-21 — **Phase 5 done.** Added wiki subsystem page
  `wiki/concepts/forward-pass.md` and linked it from `wiki/index.md` +
  `wiki/concepts/index.md`; updated the stale "MNIST demo" mention in
  `learning-lab-refactor.md`. README has no demo references (nothing to change).
  Plan marked **done**. Deferred follow-up: rename the `mnist-demo/` dir,
  `mnist*` files, and `data-tour="mnist-demo-*"` IDs to forward-pass naming.
- 2026-06-21 — **Follow-up (input as 3D volume).** Per user, `DemoInputTile`
  now renders the input as a stacked C×H×W volume instead of a flat plane:
  3-channel inputs show 3 image slices tinted R/G/B with additive blending
  (they recombine into the colour image while the depth offset exposes them as
  channel slices); 1-channel inputs show a single slice; a `<edgesGeometry>`
  frame reads as a tensor box. Threaded `channels` (from the first leaf's
  `in_shape[1]`) Canvas3D → `DataFlowDemo` → `DemoInputTile`. `npm run build`
  clean.
- 2026-06-21 — **Follow-up (output matches CIFAR class).** Each `CifarSample`
  now carries a `classIndex` into the new `CIFAR_CLASS_NAMES` (canonical
  CIFAR-10 order); Ship=8, Airplane=0, Horse=7, Automobile=1. `useForwardPassInput`
  returns `classIndex`; threaded as `targetClass` through `DataFlowDemo` →
  `OperationEffectProps` → `LinearEffect`. The class-scores demo now rotates its
  canned scores so the peak/highlight lands on the input's class and prints the
  predicted class name (`→ ship`). Falls back to `DEMO_TARGET_CLASS` when no
  sample. `npm test` 57/57 green; `npm run build` clean.
- 2026-06-21 — **Bugfix (block connections not showing).** Layout edges are
  remapped through collapsed containers and only exist where the IR traced
  them, so nested (Sequential) models' consecutive demo stops had no matching
  edge → the old `visibleEdges` filter (both endpoints in the revealed set)
  produced nothing, and the data packet had no route. Added
  `buildDemoFlowEdges(stops, layoutEdges)` in `demoStops.ts`: one edge per
  consecutive stop pair, reusing a real edge when its exact `(from,to)` exists,
  else synthesizing a 4-point bézier between the blocks' faces (with
  `vectorPoints`). `useMnistDemoState` now derives `visibleEdges` from this flow
  path (`flowEdges.slice(0, activeStopIndex)`), which also feeds the packet
  route. Connections + packet now render for every architecture. `npm test`
  57/57 green; `npm run build` clean.
- 2026-06-21 — **Follow-up (skip/residual branches).** `buildDemoFlowEdges` now
  returns `DemoFlowEdge[]` (`{ edge, revealIndex }`) and, after the linear main
  chain, adds every remaining real layout edge whose endpoints are both stops —
  the residual/skip (ResNet `Add`) and concat (UNet) branches — revealed once
  their later endpoint is reached. `useMnistDemoState` filters by `revealIndex`.
  These render with their real `kind` (residual = dashed arc); the packet still
  follows the main chain. `npm test` 57/57 green; `npm run build` clean.
- 2026-06-21 — **Follow-up (collapsed residual blocks: ViT/UNet/MobileNet).**
  Root cause: when a residual sub-block (MobileNet `InvertedResidual`, collapsed
  transformer block) is collapsed to one box, its internal `Add` is dropped by
  the collapse remap (self-referential), so the skip was invisible. Added a
  bypass pass to `buildDemoFlowEdges`: any collapsed container whose subtree
  contains an `Add` gets an explicit residual bézier arc drawn over the block.
  Verified the edge-building (expanded skip included, collapsed bypass drawn,
  no false positives) with a new `src/lib/demoFlowEdges.test.ts` (4 tests). To
  make it run under `node --test` (the suite globs `src/lib/*.test.ts`), added
  `.ts` extensions to `demoStops.ts`'s value imports, matching the rest of the
  testable chain. `npm test` 61/61 green; `npm run build` clean.

# Compacted Follow-up History

The following completed follow-ups are absorbed here because they refine the
same forward-pass pipeline and no longer need separate planning surfaces:

| Absorbed plan | Preserved decision and outcome |
|---|---|
| `2026-06-23-forward-pass-residual-remap.md` | Remap residual endpoints through expanded/collapsed descendants so skip edges stay attached to visible stops. Added regression coverage for expanded and collapsed residual graphs. |
| `2026-06-23-forward-pass-block-persistence.md` | Keep already revealed blocks visible while playback advances instead of replacing the visible set at every stop. |
| `2026-06-23-forward-pass-upsample-effect.md` | Add the Upsample operation panel and shape calculation without coupling the generic playback engine to one architecture. |
| `2026-06-23-linear-predicted-class-label.md` | Move predicted-class output into the Linear effect where classification semantics belong. |
| `2026-06-24-architecture-expand-collapse-all.md` | Add bulk expand/collapse controls while intentionally excluding top-level roots from collapsible ids. |

These changes preserve the architecture-agnostic stop/edge model established
by this plan. Their individual execution logs reported passing typecheck, tests,
and production builds at the time of implementation.
