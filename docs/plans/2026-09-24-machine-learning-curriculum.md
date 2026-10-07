---
title: Machine Learning domain curriculum design, restructuring, and roadmap
status: done
created: 2026-09-21
updated: 2026-10-07
author: Antigravity
task: "Consolidate Machine Learning domain curriculum design, prerequisites, missing algorithms, uncertainty modeling, code lab placeholders, and branch integration"
supersedes:
  - docs/plans/2026-09-21-machine-learning-main-merge.md
  - docs/plans/2026-09-22-machine-learning-linear-algebra-prerequisites.md
  - docs/plans/2026-09-23-machine-learning-value-flow.md
  - docs/plans/2026-09-23-machine-learning-regression-classification.md
  - docs/plans/2026-09-23-machine-learning-missing-algorithms.md
  - docs/plans/2026-09-23-machine-learning-uncertainty.md
  - docs/plans/2026-09-23-machine-learning-code-labs.md
  - docs/plans/2026-09-24-machine-learning-main-merge.md
---

# Goal & Executive Summary

Establish the complete, canonical curriculum for the **Machine Learning** (`fundamentals`) domain in TorchViz-3D Learning Lab. The course structure transitions learners from mathematical foundations into practical Machine Learning workflows, spanning 7 chapters and 46 theory/quiz pairs plus 3 standalone lessons (95 lesson nodes) structured across tabular modeling, evaluation, ensembles, unsupervised learning, hyperparameter tuning, and Scikit-Learn architecture.

This document consolidates and supersedes all intermediate branch plans (requests 1 through 8 and main merges) into a single authoritative record.

---

# Architecture & Pedagogical Decisions

### 1. Externalize Tensor & Shape Prerequisites to Linear Algebra
- Scalar/vector/matrix/tensor representations, dimension contracts, and matrix multiplication are externalized to the existing `linear-algebra` domain (`linear-algebra-for-ai-overview`, `matrix-operations`, `elementwise-vs-matrix-product`).
- The redundant opening `tensor-shape-fundamentals` track and `shape-basics` lesson/quiz were retired, retaining clean route aliases (`tensor-shape-fundamentals` -> `linear-regression-foundations`, `shape-basics` -> `linear-activation`).
- `linear-activation` introduces a concise reminder of sample/feature/batch conventions and links to Linear Algebra prerequisites before focusing on affine transforms and activation mechanics.

### 2. Value Flow Sequencing
- `linear-activation` (affine transformation, nonlinear composition, ReLU/tanh/sigmoid saturation, and softmax decision boundaries) is placed immediately following `logistic-regression`.
- Legacy `value-flow` bookmarks resolve seamlessly via route aliases.

### 3. Integrate Core ML Concepts into Problem-Driven Chapters
- Rather than teaching generic concepts in isolation, core workflow foundations are integrated directly into the modeling narrative:
  - Chapter 1: Problem framing, train/val/test splits, regression loss functions, underfitting/overfitting, bias-variance tradeoff, L1/L2 regularization, K-fold cross-validation, and regression evaluation metrics.
  - Chapter 2: Logistic classification, decision boundaries, multi-class strategies (One-vs-Rest), distance and probabilistic baselines, and classification evaluation metrics.

### 4. Separate Evaluation Metrics by Task
- Mixed metric lessons were replaced with task-specific theory and quiz pairs:
  - `regression-metrics`: MAE, MSE, RMSE, R², MAPE, residual analysis, baseline models.
  - `classification-metrics`: Confusion matrix, Precision, Recall, F1, ROC-AUC vs PR-AUC, macro/micro averaging, threshold selection.
- Clear separation between training loss (differentiable optimization surrogate) and evaluation metrics (interpretable business criteria).

### 5. Add Core Missing Algorithms
- Supervised classification: Added `k-nearest-neighbors`, `naive-bayes`, and `support-vector-machines` before classification evaluation, with discussions of regression variants (k-NN regression, SVR).
- Unsupervised learning: Added `gaussian-mixture-models` (soft clustering, covariance types, EM algorithm) immediately following `k-means-clustering`.

### 6. Uncertainty, Variability & Interval Estimation
- Three adjacent theory and assessment pairs inserted between cross-validation and evaluation metrics:
  - `variability-splits-seeds`: Demonstrates score variance across data splits, random seeds, and dependent CV folds.
  - `bootstrap-confidence-intervals`: Estimator uncertainty via non-parametric bootstrap resampling for fixed models.
  - `prediction-intervals`: Distinguishes confidence intervals for the conditional mean from prediction intervals for new individual observations.

### 7. Code Labs Structured as Placeholders
- 6 hands-on Code Labs define the applied practical spine across the chapters:
  1. `leakage-code-lab` (Data leakage detection in preprocessing)
  2. `linear-regression-code-lab` (From analytic OLS to Scikit-Learn)
  3. `mixed-classification-code-lab` (ColumnTransformer & classification pipeline)
  4. `model-comparison-code-lab` (Benchmarking Logistic Regression, Random Forest, Gradient Boosting)
  5. `clustering-code-lab` (Unlabeled clustering and silhouette evaluation)
  6. `nested-cv-code-lab` (Nested cross-validation without test leakage)
- In this milestone, the 6 code lab theory nodes are registered in the TOC as placeholders (`status: 'locked'`, `contentStatus: 'missing'`), deferring the full runnable notebook/script packages to a subsequent release milestone.
- The 6 corresponding lab quizzes remain active and published (`status: 'available'`, `contentStatus: 'published'`) to evaluate practical workflow understanding (data hygiene, leakage traps, model comparison caveats, and evaluation integrity).

---

# Curriculum Map (7 Chapters, 95 Nodes)

| Chapter | Track ID | Published Nodes | Placeholder Nodes | Total Nodes |
|---|---|---|---|---|
| **1. Linear Regression** | `linear-regression-foundations` | 26 nodes (12 theory + 14 quizzes) | 2 lab nodes (`leakage`, `linear-regression`) | 28 nodes |
| **2. Logistic & Classification** | `logistic-classification` | 22 nodes (10 theory + 10 quizzes + 2 exercises) | 1 lab node (`mixed-classification`) + SVM (4) quiz | 24 nodes |
| **3. Decision Trees & Ensembles** | `decision-trees-ensembles` | 9 nodes (4 theory + 5 quizzes) | 1 lab node (`model-comparison`) | 10 nodes |
| **4. Unsupervised Learning** | `unsupervised-learning` | 11 nodes (5 theory + 6 quizzes) | 1 lab node (`clustering`) | 12 nodes |
| **5. Hyperparameter Tuning** | `hyperparameter-tuning` | 9 nodes (4 theory + 5 quizzes) | 1 lab node (`nested-cv`) | 10 nodes |
| **6. ML with Scikit-Learn** | `ml-with-scikit-learn` | 10 nodes (5 pairs) | — | 10 nodes |
| **7. Course Synthesis** | `ml-llm-synthesis` | 1 standalone synthesis node | — | 1 node |
| **Total** | | **88 published nodes** | **7 placeholder nodes** | **95 nodes** |

---

# Verification & Test Coverage (earlier curriculum merge)

- **TOC Invariants**: Every track retains canonical alternating theory-quiz pairs.
- **Route Aliases**: Legacy bookmarks (`tensor-shape-fundamentals`, `value-flow`, `core-ml-concepts`, `linear-logistic-regression`, `evaluation-metrics`) resolve deterministically in both multi-domain and single-domain catalog modes.
- **Catalog Totals**:
  - Global Catalog after the main rebase: 17 domains, 110 tracks, 921 lessons, 473 published, 448 placeholders / missing, 15 route aliases.
  - Domain `fundamentals`: 7 tracks, 87 lessons (81 published, 6 placeholders).
- **Automated Test Suite**: Full test pass via `npm test` and `npm run verify` (typecheck, tests, production build).

# Follow-up: SVM after Trees (2026-10-04)

Status: abandoned — user cancelled the move on 2026-10-04. Earlier completed work remains done.

## Goal and proposed decisions

Move the existing SVM theory/quiz pair after the complete Trees & Ensembles
sequence so learners study intuitive tree models before margin and kernel methods.
Place the pair at the end of chapter 3, after the model-comparison lab pair and
before chapter 4 (Unsupervised Learning). Rename chapter 3 to
"Decision Trees, Ensembles & SVM" in both locales; keep its existing track ID.

Preserve SVM lesson IDs, MDX filenames, published status, and the typed-TOC /
locale-MDX boundary. Keep Classification Metrics in chapter 2. Add aliases for
existing chapter-2 SVM lesson bookmarks if required by route resolution.

## Phases

1. Obtain approval for this stored follow-up before editing runtime or docs.
2. Move the SVM pair in the typed TOC and update chapter descriptions/title.
   Check route handling and preserve old SVM bookmarks.
3. Adjust SVM transition prose and course synthesis to reflect the new sequence;
   leave the taught mathematics and quiz questions unchanged.
4. Update existing catalog expectations, the canonical Learning Lab wiki, and
   this plan's curriculum map, decisions, and execution log.
5. Run `npm run verify` and `git diff --check`.

## Out of scope

New lessons, new chapters, new visuals, lab implementation, and broad UI changes.

## Execution log

- 2026-10-04 — Inspected TOC, existing SVM content, catalog expectations, and
  canonical documentation. Stored draft follow-up; implementation pending approval.
- 2026-10-04 — User chose to keep SVM in its current chapter-2 position.
  Follow-up abandoned; no runtime or lesson files changed.

# Follow-up: SVM motivation through a misplaced threshold (2026-10-04)

Status: done — user approved with “ok” on 2026-10-04; implementation and verification completed the same day.

## Goal

Replace the abstract opening of the existing SVM lesson with the agreed
one-dimensional classification motivation. Keep SVM at its current chapter-2
position and preserve the four-page lesson and existing quiz.

## Decisions

- Use illustrative component masses. Group A has values 2, 3, 4 grams;
  group B has values 8, 9, 10 grams.
- Reveal the story progressively on one number-line visualization:
  separated groups; threshold at 4.5; new unlabeled sample at 5 predicted B;
  distances 1 to the nearest A and 3 to the nearest B; threshold moved to 6
  with equal nearest-training-point distances of 2.
- Ask why a threshold that fits every training point makes a questionable
  prediction, then introduce margin and maximal margin. Do not reveal the
  resolution before the learner sees the contradictory prediction.
- Distinguish the sample's predicted class from its unknown true label.
  Present proximity as motivation, not a general guarantee about labels.
- Implement a responsive code-native SVG visualization owned by a new
  `fundamentals` domain adapter. Reuse the existing `InteractiveStepper`
  controls; do not duplicate the shared UI or borrow Linear Algebra-owned
  primitives. Disable autoplay and reveal stages on explicit learner input.
- Keep lesson narrative and stage text in locale MDX with static props.
  Reuse Learning Lab Light Mode tokens and accessible figure descriptions.
  Preserve the lazy domain boundary and React-free catalog.
- Follow `learning-lab-authoring` for prose and `impeccable` for the scoped
  visual refinement. No image generation or new third-party dependency.

## Phases

1. Store this proposal in the existing owning curriculum plan and obtain
   explicit approval as required by `docs/WORKFLOW.md`.
2. Add the domain-local visualization and adapter; register its lazy loader
   and MDX allowlist through the existing domain registration mechanism.
3. Rewrite page 0's opening around the visualization and bridge the numeric
   margin example to the existing linear score and geometric margin material.
   Preserve the remaining pages, lesson IDs, metadata contract, and quiz scope.
4. Verify meaningful rendering/MDX registration and reveal-state behavior,
   including reset, small-screen layout, and keyboard controls. Run
   `npm run verify` and `git diff --check`.
5. Update the canonical Learning Lab wiki's adapter ownership/file map,
   relevant wiki log, and this execution log with changes and verification.

## Out of scope

SVM relocation, full-course rewrites, new quizzes, soft-margin/kernel explorers,
global UI redesign, dependency updates, commits, and publishing.

## Execution log

- 2026-10-04 — User requested implementation of the agreed motivation.
  Inspected existing lesson, domain loader, UI ownership, and shared stepper.
  Stored concrete implementation plan; source edits await stored-plan approval.
- 2026-10-04 — User approved the stored motivation plan; implementation started.
- 2026-10-04 — Rewrote the first SVM page with the separated-group / misplaced
  threshold motivation and five authored reveal stages. Added
  `src/components/learning/domains/fundamentals/mdxComponents.tsx`, registered
  its lazy loader and domain allowlist, reused `InteractiveStepper`, and kept
  all narrative and stage labels in MDX. Other lesson pages, quiz, and TOC
  placement remain unchanged. Updated the canonical wiki and wiki log.
- 2026-10-04 — Browser verification passed all five stages, distance labels,
  prediction B-to-A change, previous/next boundaries, reset via Enter, direct
  stage selection, and arrow-key isolation from lesson navigation. Reviewed
  desktop and mobile screenshots. At 320/390/768px both training groups remain
  visible with no viewport overflow; reduced-motion mode and runtime-error
  checks passed. Adjusted the number-line viewBox after mobile review.
- 2026-10-04 — Final `npm run verify` passed: typecheck, 175 tests (zero
  failures), MDX validation, and production build (21.58s). `git diff --check`
  passed. No new dependencies, commits, or publishing.

# Follow-up: SVM lessons, quizzes, and Perceptron exercises (2026-10-07)

Status: done — requested content and code cleanup completed; local commit authorized by the user.

## Final scope and decisions

- Keep SVM in chapter 2. Split its curriculum into SVM (1) intuition,
  SVM (2) vectors/dot product/hyperplanes, SVM (3) margin optimization, and
  SVM (4) a one-page solver placeholder with deferred advanced topics.
- Publish Vietnamese quizzes for SVM (1), SVM (2) with 20 questions, and
  SVM (3) with 14 questions. Keep the SVM (4) quiz locked.
- Add two standalone Perceptron exercises after SVM (2), with worked guides,
  random-data practice, initial weights/bias inputs, and checked answers.
  The convergence guide focuses on Batch and reuses the preceding Stochastic
  example. Worked guides fix bias at zero; self-practice updates bias.
- Use KaTeX for math and reuse shared linear-algebra visual primitives.
  Keep illustrations in the lazy Fundamentals adapter and show one idea
  per stage, dimming contextual elements.
- Preserve typed-TOC/catalog/route ownership and light-only Learning Lab UI.
- The user waived new plan approval and full verify/build during this session,
  and explicitly requested updating this owning plan and committing the branch
  changes. Use narrow source, MDX, math, and existing catalog checks.

## Finalization

1. Remove unused illustration modes and props after replacing SVM (4).
2. Review the branch diff, compile changed MDX, and check affected catalog
   and exercise behavior without a production build.
3. Update the owning wiki and this execution log, stage branch changes, and
   commit locally. Publishing and pushing are outside this request.

## Execution log

- 2026-10-07 — Refined SVM (1) wording, margin/support-vector explanation,
  threshold question callout, and quiz; authored SVM (2), dot-product
  illustrations, hyperplane examples, and its 20-question quiz.
- 2026-10-07 — Added worked and interactive Perceptron update/convergence
  exercises with canonical catalog nodes and distinct exercise styling.
- 2026-10-07 — Rewrote SVM (3) to start at score boundaries `±c`, choose
  `c=1`, derive width `2c/||w||`, and formulate hard/soft margin objectives.
  Added staged margin/slack illustrations, automatic slack versus tunable
  `C`, overfit/underfit explanations, and the 14-question quiz.
- 2026-10-07 — Replaced advanced SVM (4) derivations with a one-page
  placeholder; listed Lagrangian, primal/dual, classifier recovery, KKT,
  soft-margin dual, kernels, and prediction for future explanation.
- 2026-10-07 — Removed unused optimization illustration modes (boundary,
  distance, projection, margin, soft, dual), their helpers/props, and unused
  coordinate/point overlays from the hyperplane illustration. Retained
  authored margin stages and the three slack cases.
- 2026-10-07 — Synced the final curriculum to 95 Fundamentals nodes
  (88 published, 7 missing) and global catalog to 963 nodes
  (501 published, 462 missing). Updated catalog assertions and generated
  stats. Earlier verification results above describe earlier milestones.
- 2026-10-07 — Final targeted checks passed: TypeScript typecheck, 23
  catalog/exercise-registry tests, compilation of all 9 SVM/Perceptron MDX
  files, 732 KaTeX expressions, quiz metadata, catalog stats, and diff
  whitespace. Full verify/production build and browser checks were skipped
  in this follow-up per the user's preference. Branch changes staged for
  the requested local commit; no push or deployment.
- 2026-10-07 — Fixed the GitHub lint failure by removing `aria-hidden`
  from the decorative SVG group in the SVM threshold illustration. The
  figure retains its accessible description. `npm run lint` now exits 0;
  two existing Research Papers `PaperExcerpt` warnings remain.
