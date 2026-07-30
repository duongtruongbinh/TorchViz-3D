---
title: Linear Algebra Iteration - Phase 1 - Vector Foundations
status: active
created: 2026-07-14
author: Codex
task: "Author content for the first 7 lessons of the Linear Algebra track"
---

# Goal

Implement the "Vector Foundations" phase of the Linear Algebra curriculum. Each lesson will follow the rhythm: **Theory $\rightarrow$ Calculation/Quiz $\rightarrow$ Code**.

## Scope

The following lessons from `src/content/learning/math-statistics-ai/table-of-contents.ts` will be authored:

1.  `vectors-intuition`: Concept of vectors as points, arrows, and lists.
2.  `vector-operations`: Addition, subtraction, and scalar multiplication.
3.  `dot-product`: Geometric and algebraic definitions; projection.
4.  `vector-norms`: L1, L2, and Max norms.
5.  `unit-vectors-normalization`: The process of normalizing a vector to length 1.
6.  `cosine-similarity`: Measuring alignment using the dot product and norms.
7.  `orthogonality`: Perpendicularity and the dot product = 0 condition.

## Implementation Details

- **Language**: Vietnamese (`.vi.mdx`) to maintain consistency with existing authored LLM and CV content.
- **Format**:
    - **Prose**: Clear, intuition-first explanations.
    - **Calculation**: Interactive quizzes or hand-calculation steps.
    - **Code**: PyTorch snippets demonstrating the concept.
- **Location**: `src/content/learning/math-statistics-ai/`
- **Verification**: `npm run verify` to ensure MDX contract compliance and catalog parity.

## Execution Plan

- [ ] Author `vectors-intuition.vi.mdx`
- [ ] Author `vector-operations.vi.mdx`
- [ ] Author `dot-product.vi.mdx`
- [ ] Author `vector-norms.vi.mdx`
- [ ] Author `unit-vectors-normalization.vi.mdx`
- [ ] Author `cosine-similarity.vi.mdx`
- [ ] Author `orthogonality.vi.mdx`
- [ ] Run `npm run verify`
