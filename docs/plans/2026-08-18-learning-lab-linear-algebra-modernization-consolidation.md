---
title: "Learning Lab & Linear Algebra Modernization, Shared Math Subsystem, Dependency Upgrades & Consolidation"
status: completed
created: 2026-08-18
updated: 2026-08-18
author: Antigravity
task: "Comprehensive modernization pass: shared math subsystem, inline vs display math typography, Mafs/MathCanvas consolidation, matrix primitive deduplication, safe dependency upgrades (TS 6, Vite 8, React 19, R3F v9, Tailwind v4, KaTeX 0.18), Pyodide audit, and verification"
supersedes:
  - docs/plans/2026-08-18-linear-algebra-full-curriculum-and-refinement.md
---

# Lineage

This plan builds directly on [2026-08-18-linear-algebra-full-curriculum-and-refinement.md](./2026-08-18-linear-algebra-full-curriculum-and-refinement.md) (which completed the 7-chapter, 58-lesson Linear Algebra curriculum v1). It defines the comprehensive modernization pass to elevate technical foundations, extract shared Learning math infrastructure, polish mathematical typography, consolidate visual primitives, safely upgrade dependencies to modern LTS/stable lines, and clean up dead code.

---

# 1. Baseline Inventory & Measurements

| Metric / Item | Baseline Value | Target Modernized Value |
|---|---|---|
| **Node Version** | `v24.18.0` | `v24.18.0` (active LTS in CI & local) |
| **Test Suite** | 139 passing tests (0 failures) | $\ge 139$ passing tests |
| **TypeScript** | `5.8.3` | `6.0.3` (MDX-compatible TypeScript 6 line) |
| **Vite** | `6.4.3` | `8.2.1` with `@vitejs/plugin-react` |
| **React / React-DOM** | `18.2.0` | `19.2.8` (via 18.3 deprecation pass) |
| **Three / R3F / Drei** | `0.160.0` / `8.15.12` / `9.122.0` | `0.185.1` / `9.7.0` / `10.7.8` (React 19 compatible) |
| **Tailwind CSS** | `3.4.17` (PostCSS) | `4.3.3` (`@tailwindcss/vite` modern pipeline) |
| **KaTeX** | `0.17.0` | `0.18.4` (centralized math subsystem) |
| **Zustand / Lucide / Shiki** | `5.0.11` / `1.21.0` / `4.3.1` | `5.0.15` / `1.31.0` / `4.4.3` |
| **Pyodide** | `0.25.1` | Audit: retain pinned `0.25.1` with documented ESM/module worker analysis or migrate safely |
| **Linear Algebra Lazy Chunk** | ~128.38 kB (gzip ~35.04 kB) | Maintained lazy domain boundary |
| **Mafs Isolation** | Strictly lazy behind Linear Algebra | Preserved lazy domain boundary |

---

# 2. Main Goals & Scope

1. **Shared Math Subsystem (`src/components/learning/math/`)**:
   - Extract math rendering from `learningMdxComponents.tsx` into a dedicated subsystem:
     - `MathInline.tsx` (`<InlineMath />`): Clean inline formulas matching text line-height and color.
     - `MathDisplay.tsx` (`<BlockMath />`): Unboxed, centered, overflow-x-auto display math without heavy card styling.
     - `EquationCallout.tsx` (`<EquationCallout />`): Dedicated card for key theorems and chapter-defining equations.
     - `renderMath.ts`: Centralized KaTeX rendering options (`trust: false`, error-resilient runtime).
     - `index.ts` & `types.ts`.
   - Keep public MDX component names (`InlineMath`, `BlockMath`) 100% backward-compatible.

2. **Mathematical Typography Refinement (29 Theory Lessons)**:
   - Audit all 29 `src/content/learning/linear-algebra/*.vi.mdx` theory lessons.
   - Convert grammatical sentence formulas from `BlockMath` to `InlineMath` (e.g. `Nếu <InlineMath formula="\det(A)=0" />, ...`).
   - Preserve display math for matrices, systems of equations, multi-step derivations, summations, large fractions, and central theorems.
   - Ensure clean Vietnamese terminology (`vector`, `ma trận`, `tổ hợp tuyến tính`, `không gian con`, `độc lập tuyến tính`, `cơ sở`, `hạng`, `trực giao`, `định thức`, `vết`, `trị riêng`, `SVD`).

3. **Linear Algebra Visual Primitive Consolidation**:
   - **MathPlane Elimination**: Migrate all remaining `MathPlane` callers in `vectorRenderers.tsx` and `systemRenderers.tsx` to `MathVisualCard` + `MathCanvas`. Delete `MathPlane.tsx` once 0 callers remain.
   - **Raw Figure Replacement**: Migrate hand-written `<figure>` shells in `matrixRenderers.tsx` and `systemRenderers.tsx` to `MathVisualCard`.
   - **Range & Segmented Control Standardization**: Replace raw `<input type="range">` with `MathRangeControl`. Ensure `MathSegmentedControl` implements proper keyboard radiogroup navigation.
   - **Matrix Primitives Deduplication**: Consolidate `MatrixGrid` and `AugmentedMatrixGrid` shared internals (`MatrixBracket`, `MatrixCell`, `MatrixDivider`, `MatrixFrame`).
   - **Pure Demo Math**: Verify all `demoMath.ts` exports have active call sites and invariant tests.

4. **Safe Phased Dependency Upgrades**:
   - **Phase A**: Patch/minor updates (`zustand`, `lucide-react`, `shiki`, `@fontsource/inter`, `@monaco-editor/react`, `monaco-editor`, `@floating-ui/react`).
   - **Phase B**: `typescript@6.0.3`, resolve tsconfig deprecations.
   - **Phase C**: `vite@8.2.1` + `@vitejs/plugin-react@6.0.5`, preserve virtual modules, search plugins, Pyodide/Monaco asset handlers.
   - **Phase D**: React 19 two-stage migration (React 18.3 deprecation check $\rightarrow$ `react@19.2.8`, `react-dom@19.2.8`, `@types/react@19.2.18`).
   - **Phase E**: 3D Stack (`three@0.185.1`, `@react-three/fiber@9.7.0`, `@react-three/drei@10.7.8`).
   - **Phase F**: Tailwind CSS 4.3 (`@tailwindcss/vite`, `@import "tailwindcss"`, migrate `src/index.css`, clean PostCSS config).
   - **Phase G**: `katex@0.18.4`, CSS font imports, strict KaTeX validation tests.
   - **Phase H**: MDX 3.1.1 compatibility check.
   - **Phase I**: Pyodide audit & worker compatibility.

5. **Dead-Code Cleanup & Architecture Polish**:
   - Remove unused files, obsolete wrappers, temporary audit markdown in content folders, and dead imports.
   - Maintain `npm ls`, `npm audit`, `npm dedupe`.

6. **Full Verification & QA**:
   - Run `npm run typecheck`, `npm test` ($\ge 139$ tests), `npm run build`, `npm run verify`, and `git diff --check`.
   - Visual inspection on Desktop (1440x900) and Mobile (390x844) across Light and Dark themes.

---

# 3. Step-by-Step Implementation Phases

### Phase 1: Shared Math Subsystem & Unboxed Display Math
- [ ] Create `src/components/learning/math/renderMath.ts` with centralized KaTeX rendering.
- [ ] Create `src/components/learning/math/MathInline.tsx` (`InlineMath`).
- [ ] Create `src/components/learning/math/MathDisplay.tsx` (`BlockMath` without heavy card borders/backgrounds).
- [ ] Create `src/components/learning/math/EquationCallout.tsx` (`EquationCallout` for emphasized theorems).
- [ ] Create `src/components/learning/math/index.ts` and `types.ts`.
- [ ] Re-export from `src/components/learning/learningMdxComponents.tsx` and register in `src/content/learning/mdxComponents.ts`.
- [ ] Update `src/index.css` to remove hardcoded `#123B68`, `text-black`, and heavy display math styling.

### Phase 2: Mathematical Typography Refinement (29 Theory Lessons)
- [ ] Audit each of the 29 `src/content/learning/linear-algebra/*.vi.mdx` theory lessons:
  - Convert sentence-embedded formulas to `<InlineMath />`.
  - Keep display `<BlockMath />` for matrices, systems, multi-line equations, summations, and standalone theorems.
  - Wrap chapter-defining identities in `<EquationCallout />` where pedagogically meaningful.
  - Polish Vietnamese terminology and remove any semicolons/em dashes.
- [ ] Run KaTeX strict validation test (`npm test`) to confirm zero invalid formulas.

### Phase 3: Visual Primitives & Code Consolidation
- [ ] Migrate all `MathPlane` usages in `vectorRenderers.tsx` and `systemRenderers.tsx` to `MathVisualCard` + `MathCanvas`.
- [ ] Delete `src/components/learning/domains/linear-algebra/primitives/MathPlane.tsx`.
- [ ] Replace raw `<figure>` tags in `matrixRenderers.tsx` and `systemRenderers.tsx` with `MathVisualCard`.
- [ ] Replace raw `<input type="range">` in `vectorRenderers.tsx` and `systemRenderers.tsx` with `MathRangeControl`.
- [ ] Deduplicate internal matrix components in `MatrixGrid.tsx` and `AugmentedMatrixGrid.tsx`.
- [ ] Audit `demoMath.ts` and ensure pure helper invariants remain tested.

### Phase 4: Phased Dependency Upgrades
- [ ] **Step 4A**: Upgrade low-risk dependencies (`zustand`, `lucide-react`, `shiki`, `@fontsource/inter`, `@monaco-editor/react`, `monaco-editor`, `@floating-ui/react`, `@types/node`). Run `npm test && npm run build`.
- [ ] **Step 4B**: Upgrade to `typescript@6.0.3`. Update `tsconfig.json`. Run `npm run typecheck`.
- [ ] **Step 4C**: Upgrade to `vite@8.2.1` and `@vitejs/plugin-react@6.0.5`. Audit `vite.config.ts`, verify virtual plugins, asset loaders, and dev server.
- [ ] **Step 4D**: Upgrade to `react@19.2.8`, `react-dom@19.2.8`, `@types/react@19.2.18`, `@types/react-dom@19.2.4`. Audit refs, types, and JSX runtime.
- [ ] **Step 4E**: Upgrade 3D stack (`three@0.185.1`, `@react-three/fiber@9.7.0`, `@react-three/drei@10.7.8`).
- [ ] **Step 4F**: Upgrade to Tailwind CSS 4.3 (`@tailwindcss/vite`, `@import "tailwindcss"` in `src/index.css`). Remove obsolete PostCSS config if not needed.
- [ ] **Step 4G**: Upgrade to `katex@0.18.4`. Run KaTeX test suite.
- [ ] **Step 4H**: Audit Pyodide runtime and document architecture findings.

### Phase 5: Dead-Code Cleanup & Verification
- [ ] Search and remove dead exports, unused types, and orphaned files.
- [ ] Run `npm run typecheck`, `npm test`, `npm run build`, `npm run verify`, and `git diff --check`.
- [ ] Perform browser QA across viewports (1440x900, 390x844) and themes (Light, Dark).
- [ ] Update `walkthrough.md` with complete metrics and before/after report.
