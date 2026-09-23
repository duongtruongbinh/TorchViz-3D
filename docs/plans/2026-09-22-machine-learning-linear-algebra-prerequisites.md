---
title: Replace duplicated Machine Learning tensor lessons with Linear Algebra prerequisites
status: done
created: 2026-09-22
updated: 2026-09-22
author: Codex
task: "Review the full Machine Learning curriculum and remove repeated tensor-shape teaching in favor of a brief Linear Algebra prerequisite reference"
supersedes:
  - docs/plans/2026-09-21-machine-learning-main-merge.md
---

# Goal
The Machine Learning theory path assumes the learner has independently studied basic scalar/vector/matrix/tensor representations and shapes in Linear Algebra. It should briefly point to that material, then progress coherently into Machine Learning without repeating a six-page tensor lesson and its quiz.

# Lineage
Content follow-up to [Machine Learning main integration](./2026-09-21-machine-learning-main-merge.md). This plan changes authored curriculum scope, not the Workspace interface or the Learning Lab architecture.

# Context reviewed across the curriculum
Surveyed all 61 MDX files through page structure, teaching introductions and conclusions, and quiz prompts/feedback; inspected the complete TOC and searched every lesson for shape, tensor, batch, prerequisite and prior-lesson references. Read the complete opening theory/quiz pairs, regression lessons and synthesis where the prerequisite change has direct consequences.

The current course has these nine tracks:
- Tensor shape fundamentals: six theory pages and three quiz questions covering representations, batch/features, Linear dimensions, image flattening and debugging.
- Value flow: Linear weights/bias and activation functions; its introduction explicitly assumes the preceding tensor lesson.
- Core ML Concepts: learning paradigms, train/validation/test, generalization, bias/variance, cross-validation and metrics.
- Linear & Logistic Regression: continuous targets, logits/probabilities, losses, regularization and multiclass decisions. Shape examples are applications of prerequisites and remain useful.
- Decision Trees & Ensembles: splitting, bagging, boosting and feature importance. These do not depend on image flattening.
- Unsupervised Learning: K-Means, DBSCAN, PCA and embedding visualization; retain the applied interpretation and evaluation focus.
- Hyperparameter Tuning: search, Bayesian optimization, training controls and early stopping. Batch size is already introduced in its training context.
- ML with Scikit-Learn: pipelines, preprocessing, model selection, persistence and API contracts. Feature schema consistency, not tensor manipulation, is the continuing thread.
- Course Synthesis: connects input representation with problem framing, evaluation and deployable workflows; needs to distinguish the external mathematical prerequisite from ML content.

Linear Algebra already owns `linear-algebra-for-ai-overview` (scalar/vector/matrix/tensor and tabular/RGB representations), `matrix-operations` (shape, rows/columns and sample/feature convention), and `elementwise-vs-matrix-product` (matrix multiplication prerequisites). Refer to these existing lessons; do not recreate them or claim that they teach PyTorch Flatten.

Existing user edits: preserve the revised Vietnamese title for `supervised-unsupervised-rl` in both MDX and TOC. Preserve all three uncommitted Workspace files. Current branch at inspection: `pr-88`.

# Approved decisions
1. Remove the Tensor shape fundamentals track and its `shape-basics` theory/quiz from the active ML curriculum, including their two MDX files. Do not replace the quiz with another prerequisite assessment.
2. Add one short prerequisite paragraph at the start of Linear Activation, linking to the existing Linear Algebra lessons. State that these foundations are assumed; keep only a brief sample/feature/batch convention needed to understand this lesson.
3. Replace the stale "Trong bai truoc" dependency with a self-contained transition. Keep Linear/activation applications, regression shape examples, and later model-specific mathematics; these explain ML behavior rather than reteaching tensors.
4. Update the synthesis's input-representation sentence to make the Linear Algebra prerequisite explicit and preserve the data -> model -> evaluation -> pipeline narrative.
5. Keep stable routes for all remaining lessons. Use the existing typed TOC alias mechanism for retired opening routes to resolve to the remaining ML entrance; no new routing system or UI components.
6. Synchronize affected catalog test expectations, generated stats and canonical wiki prose. Expected net change: one fewer track and two fewer published lesson nodes (fundamentals: 59 lessons; global: 103 tracks, 806 lessons, 368 published, 438 placeholders), subject to recomputing from the actual catalog.

# Phases
1. Store this draft and obtain explicit approval before content edits, as required by docs/WORKFLOW.md.
2. Apply narrowly scoped TOC/MDX edits and existing-route compatibility while preserving user work.
3. Check prerequisite links against actual canonical routes; validate TOC/MDX metadata and inspect all affected transitions.
4. Run npm run verify and npm run check:catalog-stats; run lint on affected code as appropriate and check the diff for unwanted Workspace changes. Add focused route regression coverage if retiring aliases changes navigation behavior.
5. Update this execution log and existing wiki documentation. Present changed files and verification results; do not commit or push this new content task unless requested.

# Out of scope
Rewriting the whole ML course, changing Linear Algebra lessons, changing Workspace, adding illustration assets, changing lesson UI, fixing unrelated content issues or altering the user's existing title correction.

# Execution log
- 2026-09-22: Completed curriculum-wide survey and dependency review; confirmed the duplicated prerequisites are already taught in Linear Algebra. Stored the concrete proposal; no content files changed.

# Eight-request roadmap (only request 01 authorized for execution now)
The user explicitly instructed implementation of request 01 on 2026-09-22 after reviewing the proposal. Requests 02-08 inform sequencing only:
1. Externalize tensor/shape prerequisites to existing Linear Algebra lessons (this change).
2. Move Value flow after Logistic Regression and expand activation explanations there.
3. Integrate Core ML Concepts into the Linear Regression narrative instead of a separate chapter.
4. Place regression metrics after regression and classification metrics after classification; coordinate with step 3 before moving lessons.
5. Retain the user's corrected learning-paradigms title already present in both TOC and MDX.
6. Add k-Nearest Neighbors, Naive Bayes, Support Vector Machine and Gaussian Mixture Models in their appropriate supervised/unsupervised sequences.
7. Integrate bootstrap confidence intervals, variability across splits/seeds and prediction intervals with evaluation; distinguish estimator uncertainty from individual prediction uncertainty.
8. Plan six linked labs: leakage detection; formula-to-Scikit-Learn linear regression; mixed-preprocessing classification; Logistic Regression/Random Forest/Gradient Boosting comparison; unlabeled clustering evaluation; nested CV/tuning with untouched test data. Select a shared dataset/schema and end-to-end library pipeline before authoring these future units, so the earlier theory examples and splits align. No dataset decision or lab authoring in request 01.

Execution sequence for future planning: first agree the shared dataset/tasks and chapter map; then coordinate requests 02-04, place missing algorithms (06) and uncertainty topics (07), and thread the labs (08) through the matching chapters. Each later implementation needs its own scoped approval. Value flow remains in place for this step; its prerequisite paragraph can move with it later.

- 2026-09-22: Request 01 approved by explicit instruction to begin; expanding scope to requests 02-08 is not authorized. Existing Vietnamese title correction and Workspace changes remain user-owned.

- 2026-09-22: Completed request 01. Removed the tensor theory/quiz MDX and TOC track; added three existing TOC aliases; introduced a concise Linear Algebra prerequisite paragraph and updated the synthesis transition. Preserved existing title correction and Workspace WIP. Regenerated catalog stats (103 tracks, 806 lessons, 368 published, 438 placeholders; fundamentals 59 published).
- Verification: npm run verify passed (typecheck, 163 tests, production build); check:catalog-stats passed; all four internal prerequisite links resolve to canonical published lessons. Targeted lint passed with one pre-existing regex-spacing warning in the evolutionary-algorithms quiz test. git diff --check passed. Added route regression coverage for full and one-domain catalogs. No commit or push performed. Requests 02-08 remain planned only.

- 2026-09-22: User-requested wording refinement: open Linear Activation with the question of how features become predictions; move the Linear Algebra reminder after learning objectives and reduce it to one contextual reference. Reviewed the text diff; no metadata, routes or code changed.
