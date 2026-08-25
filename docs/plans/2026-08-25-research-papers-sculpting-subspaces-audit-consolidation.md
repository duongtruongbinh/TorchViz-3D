---
title: "Research Papers: Sculpting Subspaces Curriculum, Review, Quiz & Consolidation"
status: done
created: 2026-08-25T17:15:00+07:00
updated: 2026-08-25T19:22:00+07:00
author: nmkhiem
task: "Consolidate the audited Sculpting Subspaces curriculum, review fixes, mixed quiz, verification history, and final branch commit"
supersedes: []
---

# Goal

Deliver an exhaustive, publication-grade academic review module for **"Sculpting Subspaces: Constrained Full Fine-Tuning in LLMs for Continual Learning"** (ICLR 2026) across 6 structured lessons, verify and reconcile all mathematical derivations and empirical metrics directly against the official paper (`docs/reference/osft_paper.md`), refactor ad-hoc visual components into shared Learning Lab primitives, and optimize media assets.

# Context & Key Findings

1. **Paper Orientation:**
   - Authors: Nikhil Shivakumar Nayak et al. (Red Hat AI Innovation, IBM Research, IIT Bombay, MIT-IBM Watson AI Lab).
   - Core Idea: Orthogonal Subspace Fine-Tuning (OSFT) leverages adaptive SVD to separate high-rank subspaces (critical knowledge) from low-rank subspaces (plastic capacity), updating exclusively within the low-rank orthogonal complement via reparameterization ($W = W_{\text{high}} + W_{\text{low}}$) and gradient hooks with $O(1)$ parameter footprint.
   - Code Base: `https://github.com/Red-Hat-AI-Innovation-Team/mini_trainer`.

2. **Deep-Audit Reconciliation:**
   - **T5-Large Benchmarks (Table 1):** Corrected all 6 task order sequences (5-Task avg: 75.9%, 15-Task avg: 71.3%, SeqFT: 28.5%/7.4%, SeqLoRA: 43.7%/1.6%, O-LoRA: 75.8%/69.6%).
   - **TRACE Benchmark (Table 2):** Reconciled Average Accuracy (OSFT 48.4% vs O-LoRA 41.3%, +7.1%) and Backward Transfer (-7.1% vs -6.2%) on LLaMA-2-7B-Chat, removing hallucinated per-task synthetic columns.
   - **General Capabilities (Table 3):** Standardized against official benchmarks (`MMLU 47.7, GSM 7.7, BBH 34.2, TydiQA 35.8, BoolQA 76.6, PIQA 77.6`), highlighting the authentic degradation on chain-of-thought math (GSM dropped -18.4 points).
   - **Safety & Instruction Following (Table 4):** Validated exact GPT-4 judge win/tie/lose distributions (Safety: 18%/78%/4% = 96% retention; Instruction: 24%/56%/20% = 80% retention).
   - **Ablation Studies (Tables 8 & 9):** Reconciled sensitivity to hyperparameters ($mrr=0.10, trr=0.80 \to 79.6\%$; halved ratios $\to 51.5\%$; no projection $\to 31.2\%$).

# Curriculum Architecture (7 Published Nodes)

- `1.2.1-sculpting-subspaces-abstract.vi.mdx`: Executive summary, ICLR 2026 credentials, Pareto frontier analysis (Figure 1), key metric bars, and 6 initial inquiry questions.
- `1.2.2-sculpting-subspaces-introduction.vi.mdx`: Continual learning dilemma, 3 architectural paradigms (PEFT, SVD Subspaces, Full Fine-Tuning), activation vs weight SVD comparison (GPM/SGP vs OSFT), and Figure 2 methodology overview.
- `1.2.3-sculpting-subspaces-method.vi.mdx`: Formal problem setup, SVD decomposition, input-output cosine layer importance ($I^{(l)}$), adaptive rank allocation formula ($k^{(l)}$), gradient projection equations, reparameterization & gradient hooks, and Granite 8B singular activation norm validation (Figure 6).
- `1.2.4-sculpting-subspaces-experiments.vi.mdx`: Standard 5/15-task benchmarks (T5-Large), TRACE instruction-tuning (LLaMA-2 7B), general capabilities, safety alignment, Figures 7–14 singular value spectra & heatmap, and engineering checklist.
- `1.2.5-sculpting-subspaces-conclusion.vi.mdx`: 3 open research challenges, comparative philosophy (Sculpting Subspaces vs SDC-LoRA vs O-LoRA), production decision tree, 7B–70B theoretical subspace capacity analysis, and future multimodal/distributed directions.
- `1.2.6-sculpting-subspaces-debate.vi.mdx`: Academic debates (single model vs multi-adapter), engineering nondeterminism in GPU execution, metric inconsistencies in BWT definitions, and evolution from old unconstrained prototype to ICLR 2026 final with negative cosine clipping.
- `1.2.7-sculpting-subspaces-quiz.vi.mdx`: Comprehensive 16-page assessment covering OSFT design, Adaptive SVD, rank allocation, gradient projection, empirical interpretation, limitations, and production judgment.

# Refactoring & Cleanup

1. **Component Deduplication:**
   - Refactored ad-hoc `LayerCosineFlow` out of `src/components/learning/learningMdxComponents.tsx` and `src/core/learning/mdxContract.ts` into shared `ConceptHierarchy` and standard math blocks.
2. **Asset Optimization:**
   - Removed 3 unused `.svg` asset duplicates in `src/assets/learning/research-papers/llm/continual-learning/sculpting-subspaces/` to minimize bundle size.
3. **Table of Contents Sync:**
   - Updated track title and metadata in `src/content/learning/research-papers/table-of-contents.ts` to `(ICLR 2026) Sculpting Subspaces`.

# Verification

- `npm run verify` (TypeScript, Node test suite, and Vite production build)
  completed with exit code 0.

# Absorbed Follow-up Outcomes

This canonical plan absorbs the durable outcomes of the former follow-up plans
`2026-08-25-sculpting-subspaces-review-fixes.md`,
`2026-08-25-sculpting-subspaces-comprehensive-quiz.md`, and
`2026-08-25-sculpting-subspaces-quiz-assessment-redesign.md`.

## Review fixes and shared-component simplification

- Synchronized all six lesson heading arrays and enabled opt-in exact heading
  validation.
- Repaired unsupported hierarchy tones and Vietnamese-in-KaTeX labels without
  changing paper metrics.
- Consolidated top-level and nested `ConceptHierarchy` connection rendering
  through shared typed helpers, retained the established default density, and
  added an explicit compact density for dense paper taxonomies.
- Extended generic MDX validation for heading drift and hierarchy semantics.
- Updated the canonical Learning Lab wiki to 14 domains, 92 tracks, 697 lessons,
  268 published lessons, and 429 placeholders.

## Comprehensive mixed assessment

- Added `sculpting-subspaces-quiz` as the final published track node while
  preserving the typed-TOC -> React-free catalog -> locale-MDX pipeline.
- Kept 16 concepts/pages and redesigned the quiz as 7 `single`, 4 `multi`,
  2 `order`, and 3 `categorize` interactions.
- Replaced recall-heavy prompts with method comparison, algorithm sequencing,
  joint AA/BWT interpretation, evidence-versus-overclaim classification,
  limitation analysis, and production decision making.
- Removed answer-length leakage: single-choice options have bounded length
  spread, no correct answer is uniquely longest, and correct positions vary
  without a cyclic pattern.
- Extended generic MDX inspection with option-label lengths and added focused
  regression coverage for the mixed-mode and anti-leakage contract.

# Final Verification Evidence

- Review-fix checkpoint: `git diff --check`; `npm run verify` with 154 tests,
  clean TypeScript, and a successful production build.
- Quiz checkpoint: focused MDX/catalog/quiz tests passed.
- Final mixed-assessment checkpoint: `git diff --check`; `npm run verify` with
  155 tests, clean TypeScript, and a successful production build.

# Compaction and Commit Addendum

## Decisions

- Keep this file as the single canonical plan for the complete Sculpting
  Subspaces branch outcome.
- Remove the three absorbed untracked follow-up plan files after their durable
  decisions and execution evidence are preserved above.
- Preserve all current source/content changes in the working tree and stage them
  together; do not drop or rewrite unrelated user work.
- Commit the complete staged branch change with message:
  `feat(learning): refine Sculpting Subspaces paper curriculum`.

## Phases

1. Store this addendum and wait for explicit approval.
2. Remove the three absorbed follow-up plan files and verify no live references
   depend on them.
3. Run `git diff --check`, inspect the final working-tree diff, and reuse the
   immediately preceding successful `npm run verify` evidence because the only
   post-verification edits are plan documentation.
4. Stage all branch changes with `git add --all`, inspect the staged summary,
   create the commit, and report its hash.

## Execution log

- 2026-08-25 — Compaction audit found one tracked 49-line owning plan and three
  untracked follow-up plans totaling 403 lines. Added this draft consolidation
  checkpoint before deletion, staging, or commit.
- 2026-08-25 — Requester approved compaction, staging, and commit; execution
  started.
- 2026-08-25 — Absorbed and removed the three untracked follow-up plans. The
  owning plan now preserves their decisions, final architecture, quiz design,
  catalog metrics, and verification evidence without broken links.
- 2026-08-25 — Final pre-commit `git diff --check` passed. The immediately
  preceding full `npm run verify` remains valid because subsequent changes were
  plan-document compaction only. Prepared the complete branch diff for staging
  and commit as `feat(learning): refine Sculpting Subspaces paper curriculum`.
