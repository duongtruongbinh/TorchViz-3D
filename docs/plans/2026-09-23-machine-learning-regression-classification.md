---
title: Integrate core ML concepts and separate evaluation by task
status: done
created: 2026-09-23
updated: 2026-09-23
author: Codex
task: "Implement leader requests 3 and 4; preserve the user's request 5 title correction"
supersedes:
  - docs/plans/2026-09-23-machine-learning-value-flow.md
---

# Lineage
Continues [Value flow sequencing](./2026-09-23-machine-learning-value-flow.md).
The user explicitly requested completion of requests 3 and 4 in this turn.

# Decisions
Replace the separate Core ML Concepts and combined regression chapter with:
1. Linear Regression: problem framing, linear model, splits, regression loss,
   under/overfitting, bias/variance, L1/L2, CV, regression evaluation.
2. Logistic Regression & Classification: logistic model, activation, OvR,
   classification evaluation.
Retain existing non-metric lesson IDs and titles, including the user's corrected
learning-paradigms title. Use the housing example across the first chapter;
retain independently addressable concept lessons as steps of that workflow.
Split the mixed metric theory/quiz into two explicit pairs. Keep useful existing
material, add numerical examples and task-specific questions with matching
conceptIds. Remove the mixed nodes and alias their old IDs to regression metrics.
Move classification loss detail out of regression loss (it exists in Logistic,
activation and the new classification assessment). Fix all affected transitions.
Preserve old track bookmarks via aliases; no selector or UI implementation changes.

# Scope and verification
Do not implement requests 6-8, modify Workspace, commit or push. Preserve existing
uncommitted edits. Verify ordering, aliases in full/domain-only catalogs, paired
metadata and metric separation. Run npm run verify, catalog stats check and
diff check. Update canonical wiki, generated stats and this execution log.

# Execution log
- Read the TOC, regression, core concept, activation and metric lessons/quizzes.
  Current catalog: 102 tracks, 806 lessons, 368 published. Expected after split:
  102 tracks, 808 lessons, 370 published; fundamentals: 61 lesson nodes.
- Implemented two chapters and legacy aliases. Kept existing non-metric lesson
  IDs, filenames and titles; especially preserved the user's request 5 wording.
  Existing numeric filename prefixes are historical; the TOC controls order.
- Reworked the regression narrative using housing examples through splits,
  loss, generalization, bias/variance, L1/L2 and CV. Clarified direct OLS versus
  iterative optimization, train-only preprocessing and the squared-error scope
  of bias/variance decomposition. Updated related quiz prompts and transitions.
- Replaced mixed evaluation MDX with four new files: regression theory (4 pages)
  and quiz (4 questions), classification theory (5 pages) and quiz (5 questions).
  Added numerical MAE/RMSE/R2/confusion-matrix examples, baseline caveats,
  macro/micro averaging, AP versus trapezoidal PR-AUC, and validation-only
  threshold selection. Theory/quiz conceptIds match; all new questions map to
  their concepts. Removed classification loss from the regression loss lesson
  and assessed the loss/metric distinction with an additional question.
- Verification: typecheck, all 166 tests and production build passed; catalog
  statistics check passed (102 tracks, 808 lessons, 370 published). All four new
  KaTeX formulas rendered. The final extra regression-loss quiz question was
  separately inspected and compiled as MDX after the full run. No browser
  visual inspection performed. No commit or push; Workspace WIP preserved.
