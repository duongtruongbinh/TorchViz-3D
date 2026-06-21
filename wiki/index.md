---
title: TorchViz-3D Knowledge Bundle
type: Index
okf_version: "0.1"
updated: 2026-06-21
---

# TorchViz-3D — OKF Knowledge Bundle

This is the **structured, agent-readable** knowledge base for the TorchViz-3D
codebase. It is hand-authored (no generator) and conforms to OKF v0.1: every
non-reserved page carries YAML frontmatter with a non-empty `type`. Cross-links
use **standard relative paths** (e.g. `concepts/torchstub.md`, `../glossary.md`)
so they open directly in editors and on GitHub.

Start with [the architecture overview](architecture.md), then drill into the
subsystem pages under [concepts](concepts/index.md).

## What TorchViz-3D is

A browser-only tool that renders PyTorch `nn.Module` source as interactive 3D
isometric block diagrams. **No real PyTorch runs** and **no code or data leaves
the machine** — a shape-only fake `torch.nn` (`torchstub`) traces the model into
an intermediate graph, which a pure layout engine turns into 3D geometry.

## Map of the bundle

| Section | Page | What it covers |
|---|---|---|
| Top | [architecture.md](architecture.md) | The end-to-end pipeline and the central `torchstub` idea. |
| Top | [glossary.md](glossary.md) | Project-specific terms (IR, leaf, container, OKF…). |
| Concepts | [torchstub](concepts/torchstub.md) | The shape-only fake `torch.nn`. |
| Concepts | [pyodide-worker](concepts/pyodide-worker.md) | The Web Worker that boots Pyodide and emits IR. |
| Concepts | [ir-contract](concepts/ir-contract.md) | The IRGraph/IRNode/IREdge worker↔renderer boundary. |
| Concepts | [layout-engine](concepts/layout-engine.md) | `computeLayout` — pure IR → 3D `LayoutData`. |
| Concepts | [state-store](concepts/state-store.md) | The zustand store and built-in templates. |
| Concepts | [rendering](concepts/rendering.md) | Canvas3D, the visual taxonomy, theme. |
| Concepts | [learning-lab-refactor](concepts/learning-lab-refactor.md) | Scaffold-only plan for future Landing Page and Learning Lab surfaces. |
| Guides | [add-a-layer](guides/add-a-layer.md) | Playbook: add a new `torchstub` layer. |
| Reference | [templates](reference/templates.md) | The 7 built-in models and their input shapes. |
| Reference | [gotchas](reference/gotchas.md) | Canonical list of fragile spots. |

## Relationship to the prose docs

The wiki **cites** the long-form prose docs rather than replacing them:

- [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) — narrative architecture deep-dive.
- [docs/TORCHSTUB.md](../docs/TORCHSTUB.md) — narrative torchstub-extension guide.
- [docs/WORKFLOW.md](../docs/WORKFLOW.md) — the mandatory task workflow.
- [docs/plans/](../docs/plans/) — the history of *why* changes were made.

> Where this bundle and the prose docs disagree, **the code wins** — and this
> bundle is authored against the current code (see [gotchas](reference/gotchas.md)
> for two places the prose docs lag the implementation).
