---
title: Place detailed Value flow after Logistic Regression
status: done
created: 2026-09-23
updated: 2026-09-23
author: Codex
task: "Verify leader request 1, then implement request 2"
supersedes:
  - docs/plans/2026-09-22-machine-learning-linear-algebra-prerequisites.md
---

# Goal
Keep tensor foundations in Linear Algebra and teach the detailed value/activation
flow immediately after Logistic Regression, with its assessment adjacent.

# Lineage
Continues [the prerequisite change](./2026-09-22-machine-learning-linear-algebra-prerequisites.md).
The user explicitly authorized checking request 1 and implementing request 2 in
this conversation. Requests 3-8 are context for future work, not this execution.

# Decisions
Request 1 is present: retired theory/quiz files and track are removed, canonical
Linear Algebra links exist, and old bookmarks have aliases. Keep that boundary.
Move the existing linear-activation pair into linear-logistic-regression directly
after the Logistic Regression pair. Retain lesson IDs, titles, and existing MDX
filenames; filename prefixes are historical and do not control navigation.
Replace the retired value-flow track with aliases so old bookmarks keep working.
Expand the theory through concrete affine value flow, nonlinear composition,
ReLU/tanh, sigmoid saturation, softmax and output/loss contracts. Update the quiz
with varied question modes and matching conceptIds. Keep paragraphs as the default.
Update Logistic Regression's transition, catalog regression checks, stats and wiki.

# Verification
Check old/new routes in both full and one-domain catalogs, adjacency and counts.
Run npm run verify and check:catalog-stats. No commit or push.

# Execution log
- Inspected current pr-88 working tree. Preserve pre-existing Workspace and
  curriculum edits. Request 1 review passed at source level; recheck via tests.
- Moved the existing pair directly after Logistic Regression's quiz. Removed
  the separate value-flow track, added its track alias, and retargeted retired
  tensor lesson aliases. Existing lesson bookmarks keep their selected lessons;
  bare retired track URLs use the regression chapter's first lesson, following
  the existing resolver behavior. No routing implementation changed.
- Expanded theory to seven pages, quiz to six questions (single, multi,
  categorize), with identical theory/quiz conceptIds. Preserved lesson titles
  and IDs; added the transition from Logistic Regression. No unrelated topic
  from requests 3-8 implemented.
- Updated catalog tests, canonical wiki and generated stats: 102 tracks,
  806 lesson nodes, 368 published; Machine Learning retains 59 lesson nodes.
- Verification passed: npm run verify (typecheck, 164 tests, production build),
  check:catalog-stats, git diff --check, and direct KaTeX rendering of all six
  new formulas. No browser visual inspection performed. No commit or push.
