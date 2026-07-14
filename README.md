# TorchViz-3D

**TorchViz-3D turns PyTorch-style `nn.Module` code into interactive 3D neural
network architecture diagrams, entirely in the browser.**

[![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=111)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=fff)](https://vite.dev/)
[![Pyodide](https://img.shields.io/badge/Pyodide-WASM-2f6f9f)](https://pyodide.org/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-000?logo=threedotjs&logoColor=fff)](https://threejs.org/)

No backend. No model upload. No real PyTorch runtime. TorchViz-3D runs a
shape-only `torchstub` inside Pyodide, traces your model into an intermediate
graph, lays it out, and renders it as an explorable 3D scene.

![TorchViz-3D interface showing the editor, 3D architecture canvas, layer explorer, and build terminal](docs/assets/torchviz-studio-screenshot.png)

## What It Does

- **Visualize PyTorch-like models** from `nn.Module` source code in a Monaco editor.
- **Render architecture as 3D blocks** with channels, spatial sizes, nested modules, and skip/concat edges.
- **Trace safely in-browser** using Pyodide and a fake shape-only `torch.nn`; your code stays local.
- **Inspect model structure** through a layer tree, parameter counts, hover/select sync, and terminal output.
- **Catch shape problems inline** by highlighting the failed layer instead of only throwing a traceback.
- **Start from built-in templates** including LeNet-5, Mini-ResNet, Mini-ViT, AlexNet, VGG-16, MobileNetV2, and UNet.
- **Export diagrams** as publication-friendly SVG or screen PNG.
- **Explore compatible demos** with MNIST/data-flow overlays and focused learning exercises.

## How It Works

```mermaid
flowchart LR
  A["EditorPane<br/>Monaco source"] --> B["Zustand store<br/>code + input shape"]
  B --> C["WorkerService<br/>requestId guard"]
  C --> D["Web Worker<br/>Pyodide + torchstub"]
  D --> E["IRGraph JSON<br/>nodes, edges, stats"]
  E --> F["computeLayout<br/>3D positions + routes"]
  F --> G["Canvas3D<br/>React Three Fiber"]
  F --> H["SVG / PNG export"]
```

The core trick is `torchstub`: a small fake `torch.nn` package that computes
output shapes and parameter counts without tensor math. It is enough information
to draw the architecture, while staying light enough to run in a browser.

## Try It Locally

### Requirements

- Node.js 20 or newer.
- A desktop browser; the workspace is designed for screens at least 1024px wide.
- Internet access is optional for the app runtime; external lesson references
  still require a connection when opened.

### Run

```bash
git clone https://github.com/duongtruongbinh/TorchViz-3D.git
cd TorchViz-3D
npm install
npm run dev
```

Open `http://localhost:3000`, pick a template or edit the model, then click
**Visualize** or press `Ctrl/Cmd+Enter`.

## Development

```bash
npm test         # node --test on src/lib/*.test.ts
npm run build    # production build in dist/
npm run verify   # typecheck + tests + build
```

The main runtime pipeline is:

```text
EditorPane -> zustand store -> WorkerService -> Pyodide worker + torchstub
  -> IRGraph -> computeLayout -> Canvas3D
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md) - full data flow, IR contract, layout engine, and rendering notes.
- [Extending torchstub](docs/TORCHSTUB.md) - add support for more PyTorch layers.
- [Knowledge bundle](wiki/index.md) - structured subsystem docs, guides, and gotchas.
- [Workflow](docs/WORKFLOW.md) - required contribution workflow and plan format.
- [Learning Lab](wiki/concepts/learning-lab.md) - active typed-TOC, locale-MDX, routing, Review, and exercise architecture.
- [Learning Lab migration record](docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md) - current content-pipeline decisions and execution history.
