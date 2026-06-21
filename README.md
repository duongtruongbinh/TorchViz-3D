# TorchViz-3D

**TorchViz-3D** is a client-side visualization tool designed to render PyTorch neural network architectures as immersive 3D isometric block diagrams. Built for researchers and developers to quickly prototype, visualize, and export model architectures for publications.

## ✨ Key Features

* **3D Isometric Visualization**: Render layers (Conv2d, Linear, Pooling, etc.) as interactive 3D blocks.
* **Client-Side Execution**: Runs entirely in your browser using **Pyodide**. Your code and data never leave your machine.
* **Live Editor**: Write or paste `nn.Module` code and see changes instantly.
* **Publication Ready**: Export visualizations as high-quality **SVG** (vector) or **PNG** for research papers.
* **Interactive Controls**: Rotate, zoom, pan, and expand/collapse nested layers (Sequential, Blocks) to explore complex architectures.

## 🛠️ Tech Stack

* **Core**: React, TypeScript, Vite
* **3D Engine**: Three.js, React Three Fiber
* **Python Runtime**: Pyodide (WebAssembly)
* **Editor**: Monaco Editor

## 🚀 Getting Started

### Prerequisites
* **Node.js 20 or higher** (CI builds on Node 24; Vite 6 requires a modern LTS).
* A **desktop browser** — the UI is laid out for screens ≥ 1024px wide.
* **Internet access** — Pyodide, Tailwind, and fonts load from CDNs at runtime.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/duongtruongbinh/TorchViz-3D.git
    cd TorchViz-3D
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run locally**
    ```bash
    npm run dev
    ```
    Open `http://localhost:3000` to view the app.

### Running tests

```bash
npm test
```

## 📦 Building for Production

To create a production-ready build:

```bash
npm run build
```

The output will be in the dist directory.

## 📚 Documentation

* [Knowledge bundle (`wiki/`)](wiki/index.md) — the structured, agent-readable OKF bundle: per-subsystem concept pages, guides, and reference. **Start here** for a navigable map of the codebase.
* [Architecture](docs/ARCHITECTURE.md) — data-flow pipeline, the `torchstub` shape-tracing core, the IR contract, and the layout engine.
* [Extending torchstub](docs/TORCHSTUB.md) — how to add support for a new layer.
* [Learning Lab refactor plan](docs/plans/2026-06-21-learning-lab-refactor.md) — scaffold-only plan for the planned Landing Page and Learning Lab surfaces.
