---
title: "MetaNCA Curriculum and Comprehensive Audit"
status: done
created: 2026-08-31T00:00:00+07:00
updated: 2026-08-31T01:00:00+07:00
author: Codex
task: "Publish, audit, and fact-check the seven MetaNCA Learning Lab lessons, then consolidate the branch plan history"
supersedes: []
---

# Goal

Publish one seven-node Vietnamese MetaNCA curriculum under
`src/content/learning/research-papers/nca/meta-nca/`, registered through the
typed Research Papers TOC and compliant with the canonical Learning Lab MDX,
Light Mode, heading, quiz, and asset contracts.

# Consolidation

This is the single owning plan for the branch. It absorbs the uncommitted
`2026-08-26-research-papers-meta-nca-review.md` implementation/remediation plan
and the approved 2026-08-31 follow-up audit. The absorbed plan was removed to
avoid parallel histories before the branch commit.

# Source authority

The requested `arXiv:2407.01460` does not match the MetaNCA title or authors.
The audit used the original LaTeX and figures for **Architecture Generalization
with MetaNCA**, `arXiv:2607.07743` (2026). The temporary repository reference
copy `docs/reference/MetaNCA.md` was removed at requester direction after the
audit.

# Durable decisions

- Preserve the seven canonical lesson IDs, Vietnamese titles, routes, and
  typed-TOC -> catalog -> locale-MDX runtime flow.
- Use only `LessonNote`, `LessonImage`, `MdxQuiz`, `MdxPage`,
  `ConceptHierarchy`, `BlockMath`, and `InlineMath` in this lesson set.
- Keep Learning Lab Light Mode only; no `dark:` classes, dark palettes, raw
  HTML wrappers, or domain-specific React component library.
- Apply `headingContract: 'exact'` to all six authored `MdxPage` theory files.
  The quiz remains the canonical `MdxQuiz` shape: its metadata headings mirror
  question titles and it has no authored Markdown `###` headings to validate.
- Distinguish sinusoidal absolute hidden-state initialization from the five
  positional RoPE heads applied to feature-mapped Query and Key.
- Distinguish task-weight generation without backpropagation from meta-training,
  which backpropagates through the task network and sampled unrolled updates.
- Treat plot annotations and paper captions as evidence; keep interpretation
  explicitly scoped and never invent intermediate measurements.

# Final factual contract

- Per-weight state is `[w || h]` with `h in R^16`.
- Position is `[l,u,v,k_x,k_y]`; the Weight Transformer uses
  `psi(x) = ELU(x) + 1` and produces
  `p_w = [w || h || a_f || a_b] in R^49`.
- Rollout uses `T=10` local update steps and a stochastic
  80% update mask; the paper does not ablate that percentage.
- Figure 3 sweeps both MLP hidden widths from 0 to 90. Five training
  architectures improve coverage; the central/right region is mostly 94%–96%,
  while some width-10/20 cells remain 84%–92%.
- Figure 4 sweeps kernels 3/4/5, `m=1.0...5.0` and `h=100...400`. The two training cells, kernel 3 at
  `(2.0, 200)` and kernel 5 at `(4.0, 300)`, reach 97%; held-out kernel 4 peaks
  at 66%.
- Figure 5 sweeps ResNet base channels 8–24. Training cells are 16 (29.3%, 83K
  parameters) and 20 (29.7%, 128K); test channel 18 reaches the figure maximum
  29.9%. The approximately 2M-parameter result belongs to the largest CNN, not
  these ResNets.
- Figure 6 compares the `50 x 50` matrix between the
  hidden layers of `[784,50,50,10]`. MetaNCA appears more symmetric/sparse and
  banded; Adam appears more granular. Both reach 97%, so the heatmap does not
  establish functional clusters, causation, or a better optimum.

# Implemented branch scope

- Added the MetaNCA typed TOC track, seven published MDX nodes, fourteen quiz
  questions, and twelve canonical lesson assets under `src/assets/learning/`.
- Updated catalog count assertions from 92/697 to 93/704 tracks/lessons.
- Retained the shared renderer and heading-style refinements developed with the
  curriculum: Mermaid line breaks/light styling, inline math in hierarchy
  strings, Mermaid code-fence rendering, safe MetricBars tone fallback, and
  authored heading hierarchy styles.
- Replaced `EvidenceCards` and `ComparisonMatrix`, removed repeated derivations
  and question walls, corrected the method equations, and aligned quiz feedback
  with the final evidence boundary.
- Removed the duplicate public copy of
  `07-meta-nca-linear-attention-pool.jpg`; the canonical asset remains under
  `src/assets/learning/research-papers/nca/meta-nca/`.

# Verification

- `node --test src/lib/learningMdxContent.test.ts`: 24/24 passed.
- `npm run verify`: typecheck passed, 155/155 tests passed, and the production
  build completed with 3,042 modules transformed in 22.18s.
- Static audit: only requested MDX components, no `dark:`, no dark palette
  utilities, no raw HTML wrappers, and exact theory heading parity.
- Build emitted pre-existing KaTeX Vietnamese-in-math warnings outside the
  MetaNCA lesson formulas; they do not fail verification.

# Execution log

- 2026-08-26 to 2026-08-30 — Initial curriculum, assets, TOC registration,
  shared renderer support, review remediation, and quiz were implemented.
- 2026-08-31 — Requester approved the comprehensive audit and requested plan
  consolidation, staging, and commit.
- 2026-08-31 — Corrected all seven lessons against the original paper, removed
  unsupported precision and causal claims, deleted the temporary reference and
  duplicate public asset, consolidated branch plans, and completed verification.
