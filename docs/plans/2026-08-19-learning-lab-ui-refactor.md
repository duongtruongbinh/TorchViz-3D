---
title: Learning Lab Controlled UI Refactoring and Ownership Plan
status: done
created: 2026-08-19T13:00:00+07:00
updated: 2026-08-19T13:55:00+07:00
author: Antigravity
task: "Controlled refactor of Learning Lab shared UI, Linear Algebra / Continual Learning primitives, MDX contract, lazy loading, and documentation"
supersedes: [
  "docs/plans/2026-06-21-learning-lab-refactor.md",
  "docs/plans/2026-08-18-linear-algebra-full-curriculum-and-refinement.md"
]
---

# Goal

Execute a controlled, high-fidelity refactor of Learning Lab UI architecture to:
1. Reduce real code duplication across shared components and Linear Algebra / Continual Learning domains.
2. Standardize UI reuse while avoiding over-abstraction, unnecessary files, or framework complexity.
3. Establish clear ownership boundaries: Global Learning UI, Domain UI, and Optional Reference Capability.
4. Make Light theme canonical while preserving full Dark theme compatibility in the theme layer.
5. Make reference rendering runtime (`Cite`, `PaperSummary`, `@floating-ui/react`) truly lazy-loaded.
6. Make Linear Algebra renderer modules lazily loaded per existing feature module behind the domain adapter.
7. Deduplicate matrix internal rendering logic inside `matrixPrimitives.tsx`.
8. Improve `MathSegmentedControl` accessibility with standard WAI-ARIA roving focus.
9. Move domain-specific `StageContinuityMap` to a new Continual Learning domain adapter.
10. Update canonical documentation (`wiki/concepts/learning-lab.md`) with explicit reuse rules for future agents.

# Lineage

Supersedes:
- [docs/plans/2026-06-21-learning-lab-refactor.md](./2026-06-21-learning-lab-refactor.md)
- [docs/plans/2026-08-18-linear-algebra-full-curriculum-and-refinement.md](./2026-08-18-linear-algebra-full-curriculum-and-refinement.md)

# Decisions (locked)

1. **Light Theme Canonical**: Learning Lab targets Light theme directly; no dynamic theme switcher in this task. Dark theme tokens and compatibility remain in `theme.ts` and domain themes.
2. **Minimal Semantic Tone Extension**: Add a concise `semantic` object to `src/components/learning/theme.ts` (`primary`, `success`, `warning`, `danger`, `accent`, `neutral`) with only required properties (`surface`, `border`, `text`, `strongText`, `indicator`). No token engine or CSS-in-JS.
3. **Linear Algebra Primitives Stay in Domain**: Keep `MathVisualCard`, `MathCanvas`, `MathRangeControl`, `MathSegmentedControl`, `MathStepperControls`, `MatrixGrid`, `AugmentedMatrixGrid`, and `matrixPrimitives.tsx` in `src/components/learning/domains/linear-algebra/primitives/`. Math colors (vectorU, matrixPivot, etc.) stay in LA domain theme.
4. **Internal Matrix Deduplication in `matrixPrimitives.tsx`**: Do not create multiple small files (`MatrixCell.tsx`, `MatrixFrame.tsx`). Co-locate shared helpers (`MatrixCell`, `MatrixFrame`, `MatrixDivider`, `getMatrixCellClasses`) in `matrixPrimitives.tsx`.
5. **WAI-ARIA Roving Focus in `MathSegmentedControl`**: Support ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Home, End with active DOM focus and roving `tabIndex` (0 only on active item). Support optional per-option `colorScheme` to reuse in `LinearSystemCasesExplorer` and `LUFactorizationExplorer`.
6. **Reference Capability Extraction**: Move `Cite`, `PaperSummary`, `LessonReferences`, and Floating UI imports to `src/components/learning/learningMdxReferences.tsx`. Load this chunk dynamically only when `needsReferenceRuntime` is true. Remove `LessonReferences` from MDX authored allowlist.
7. **Continual Learning Domain Adapter**: Create `src/components/learning/domains/continual-learning-llm/mdxComponents.tsx` to host `StageContinuityMap`. Remove `StageContinuityMap` from global shared allowlist.
8. **LA Renderer Lazy Loading**: In `linear-algebra/mdxComponents.tsx`, lazy-load existing renderer modules (`vectorRenderers`, `systemRenderers`, `svdRenderers`, etc.) via a lightweight `lazyNamed` helper with a smooth Suspense skeleton.
9. **Single Source of Truth Documentation**: Update `wiki/concepts/learning-lab.md` with the "Learning UI ownership and reuse" table and 10 agent reuse rules.

# Final Review Follow-up & Residual Scope

Following initial implementation, a rigorous final review identified the following residual gaps to complete:
1. **Linear Algebra Theme Context & Tailwind `dark:` cleanup**:
   - Eliminate improper Tailwind `dark:` classes (`dark:text-*`, `dark:bg-*`, `dark:border-*`) in `MathRangeControl.tsx`, `MathSegmentedControl.tsx`, `MathStepperControls.tsx`, and `linear-algebra/mdxComponents.tsx` (VisualSkeleton) in favor of resolving via `useLearningMdxTheme()`.
   - Update `MathVisualCard.tsx` outer container to directly consume `themeClasses.semantic.neutral`.
2. **Dead `MathVisualTheme` Tokens**:
   - Audit and prune unused properties in `src/components/learning/domains/linear-algebra/theme.ts` (`isLight`, `cardBorder`, `vectorResult`, `vectorDim`, `vectorUnit`, `angleArc`, `projectionLine`, `rightAngle`, `matrixCellBg`, `matrixCellBorder`, `accentBadge`, `controlBg`, `controlText`) after confirming zero consumers via repo-wide grep.
3. **Complete Matrix Deduplication**:
   - Implement `getMatrixCellClasses` in `matrixPrimitives.tsx` to eliminate repeated default cell styling in `MatrixGrid.tsx` and `AugmentedMatrixGrid.tsx`.
   - Standardize `MatrixCell` focus to consume `themeClasses.focusRing`.
4. **Co-locate `MathInfoPanel` in `MathVisualCard.tsx`**:
   - Extract the recurring renderer info box pattern (`rounded-lg p-3 border border-slate-200 bg-white`) into `MathInfoPanel` without creating new files, and migrate renderers (`determinantRenderers`, `eigenRenderers`, `orthogonalityRenderers`, `spaceRenderers`, `svdRenderers`, `systemRenderers`).
5. **Renderer Outer Shell & Selector Refinements**:
   - Refactor `ProductOverview` in `matrixRenderers.tsx` to use `MathVisualCard`.
   - Migrate remaining one-of-N selectors (`MatrixTransposeExplorer`, `MatrixVectorProductExplorer`, `RankPivotExplorer`, `CoordinateRepresentationDiagram` basis selector) to `MathSegmentedControl`.
   - Audit generic UI focus across Linear Algebra to use `themeClasses.focusRing`.
6. **Documentation Synchronization Across All 5 Surfaces**:
   - Update `wiki/concepts/learning-lab.md` with accurate file map and nuanced reuse rules.
   - Refactor `docs/ARCHITECTURE.md` to remove brittle hardcoded numbers and reference canonical wiki documentation.
   - Update `AGENTS.md` and `CLAUDE.md` with pointers to canonical Learning UI wiki rules.
   - Add concise log entry to `wiki/log.md`.

# Out of scope

- Redesigning overall Learning Lab visual palette or layout.
- Adding a global theme switcher.
- Converting all domain controls into a single mega-component.
- Splitting existing LA renderer files into dozens of tiny component files.
- Modifying lesson text, quizzes, or authored prose.

# Execution log
- 2026-08-19 13:00 — Plan created in draft.
- 2026-08-19 13:02 — Initial refactor execution: theme semantic tones, reference extraction, CL domain adapter, matrix primitives, lazy boundaries.
- 2026-08-19 13:47 — Final review follow-up initiated to resolve residual theme-context, dead tokens, matrix dedup, info panel extraction, and 5-surface doc alignment.
- 2026-08-19 13:55 — Final review cleanup complete. Pruned dead MathVisualTheme tokens, migrated 17 info panel duplicates to co-located MathInfoPanel, extracted getMatrixCellClasses in matrixPrimitives, migrated one-of-N selectors to MathSegmentedControl, removed Tailwind dark: in LA domain, synchronized all 5 doc surfaces, and verified: 146/146 unit tests passed, tsc typecheck passed, vite build passed (6.41s), git diff --check clean.
