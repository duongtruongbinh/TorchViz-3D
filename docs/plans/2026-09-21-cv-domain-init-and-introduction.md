---
title: "Computer Vision Domain, Chapter 1 History, and Deep Learning Basics"
status: done
created: 2026-09-21T00:00:00+07:00
updated: 2026-09-22T05:20:00+07:00
author: nmkhiem
task: "Launch the Computer Vision Learning Lab domain, split its beginner history into navigable nodes and quizzes, preserve dual-track chronology, add responsible-use coverage, and open Deep Learning Basics with Image Classification."
supersedes: []
---

# Goal

Establish Computer Vision as an authored Learning Lab domain with a concise,
beginner-first Chapter 1 and a concrete opening to Deep Learning Basics. The
curriculum explains why visual intelligence matters, follows Classical Vision
and Neural Networks as parallel historical threads, assesses each concept close
to where it is taught, addresses benefits and harms, and introduces Image
Classification through a Linear Classifier before convolution.

This is the single canonical implementation record for the CV work completed
on 2026-09-21 and 2026-09-22. It consolidates the earlier incremental plans for
domain initialization, intro expansion, quizzes, historical timelines, AI
Winters, node splitting, beginner simplification, image work, per-page timeline
behavior, and dual-track restoration.

# Final curriculum

## Chapter 1 — Computer Vision Foundations & History

1. `computer-vision-intro` — visual intelligence, spatial image structure, and
   the inverse problem.
2. `computer-vision-intro-quiz` — foundation review.
3. `classical-computer-vision-timeline` — Hubel–Wiesel, Roberts, 1970s Edge
   Detection, Marr, Cognitive AI, SIFT, and Viola–Jones.
4. `classical-computer-vision-timeline-quiz` — Thread 1 review.
5. `deep-learning-computer-vision-timeline` — Perceptron, Neocognitron,
   Backpropagation, LeNet-5, ImageNet, and AlexNet.
6. `deep-learning-computer-vision-timeline-quiz` — Thread 2 review.
7. `computer-vision-dual-use` — benefits, bias, privacy, safeguards, and human
   accountability.
8. `computer-vision-future-and-learning-path` — Spatial Intelligence, Embodied
   AI, course roadmap, and references.

Chapter 1 is intentionally an overview for first-time learners. It explains
what problem each milestone addressed, what idea changed, and why it mattered.
Calculus, tensor shapes, architecture internals, and implementation mechanics
belong in Chapter 2 and later lessons.

## Chapter 2 — Deep Learning Basics

The chapter now begins with:

1. `image-classification-linear-classifier`
2. `image-classification-linear-classifier-quiz`

The lesson follows `32 × 32 × 3 → 3,072 → 10 class scores → cat`, distinguishes
a Linear Classifier / Softmax Regression from continuous Linear Regression,
and uses flattening's loss of explicit spatial structure to motivate CNNs. The
existing convolution, pooling, classifier-head, normalization, and augmentation
lessons remain after this opening pair.

# Authored-content decisions

- Keep prose and quizzes in locale MDX and navigation metadata in the typed CV
  table of contents.
- Keep adjacent assessment nodes titled `Quiz` in the rail.
- Avoid mechanism-heavy detours in Chapter 1, including Backpropagation
  derivatives in prose, exact LeNet shapes, detailed AlexNet configuration,
  SIFT descriptor construction, and integral-image complexity.
- Use the shared `LessonNote` design only when explicitly requested. The intro
  fact callout uses `tone="fact"`; Markdown `[!NOTE]` syntax is not used.
- Treat AI bias as a socio-technical failure involving data, labels,
  measurement, objectives, thresholds, deployment context, and accountability.
- Keep Learning Lab strictly Light Mode.

# Timeline behavior

`Timeline.tsx` is a shared authored-MDX component registered through the
React-free MDX contract. It supports single-track and dual-track layouts, an
active milestone with automatic alignment, horizontal scrolling and arrow
controls, natural content height with vertical overflow hidden, and an
automatic dual-track legend.

All five Thread 1 pages repeat the complete Classical Vision timeline. The
active milestone advances in order: 1959, 1963, 1982, 1990s, and 2001. The
1970s Edge Detection milestone remains visible between Roberts and Marr.

All six Thread 2 pages repeat the complete parallel history on one shared axis:

- upper track: Hubel–Wiesel 1959, Roberts 1963, Edge Detection 1970s, Marr 1982,
  Cognitive AI 1990s, SIFT 1999, and Viola–Jones 2001;
- lower track: Perceptron 1958, Minsky & Papert 1969, Neocognitron 1980,
  Backpropagation 1986, LeNet-5 1998, ImageNet 2009, and AlexNet 2012.

The active lower-track milestone advances with each page: 1958, 1980, 1986,
1998, 2009, and 2012. This preserves the relationship between the two threads
even though their prose lives in separate lesson nodes.

# Shared UI and contract changes

- Added `active?: boolean` styling to shared `Flowchart` for the Chapter 2 Image
  Classification pipeline.
- Added the shared `Timeline` renderer and registered it in
  `learningMdxComponents.tsx` and `mdxContract.ts`.
- Preserved the typed TOC → React-free catalog → route/selector → locale-MDX
  architecture boundary.
- Updated catalog expectations for 16 domains, 104 tracks, 787 lessons, 319
  published lessons, and 14 published CV lessons.

# Illustration assets

Notable additions and replacements in `assets/learning/cv/`:

- `mark-i-perceptron-1958.png` — archival Mark I Perceptron diagram.
- `cv_dual_use_benefit_bias.png` — benefit/harm/safeguards doodle.
- `backpropagation_chain_rule_simple.png` — Forward / Backward network with the
  Chain Rule equation.
- `alexnet_imagenet_breakthrough.png` — Handcrafted → AlexNet 2012 → Deep CNN
  illustration with decreasing classification error.

The Backpropagation prompt required a sparse neural network, left-to-right blue
forward arrows, right-to-left coral gradients, and the exact equation
`∂L/∂w₁ = ∂L/∂ŷ · ∂ŷ/∂h₂ · ∂h₂/∂h₁ · ∂h₁/∂w₁`.

The AlexNet prompt used the old low-resolution chart only as a content
reference. It required three panels labeled `HANDCRAFTED`, `ALEXNET 2012`, and
`DEEP CNN`, plus `ERROR ↓`, without logos, tiny statistics, ticks, or footnotes.

# Cleanup

The final audit retained shared code with active consumers and removed four
unreferenced local CV assets:

- `04-hubel-wiesel-cat-cortex-v2.jpg`
- `06a-backpropagation-algorithm-1986.png`
- `07-alexnet-architecture-2012.png`
- `07-interdisciplinary-human-centered-ai-v2.jpg`

Their remote R2 keys were not deleted, so they remain recoverable if needed.
All previous CV plan documents were consolidated into this canonical record.

The shared Timeline renderer was also reduced to its active surface: unused
phase-layout state and rendering, the deprecated `badge` field, an unreachable
decade parser fallback, duplicate active-index lookup, and phase-only item refs
were removed. Horizontal navigation, active alignment, single-track rendering,
and dual-track rendering remain covered by typecheck and the production build.

# Documentation

- Updated `wiki/concepts/learning-lab.md` with the published CV structure and
  beginner-depth boundary.
- Updated `wiki/reference/catalog-stats.md` through the catalog statistics
  workflow.
- Kept no parallel CV plan documents.

# Verification

The final verification includes:

- five Thread 1 pages and six Thread 2 pages, each with one timeline and active
  milestone;
- seven top-track and seven bottom-track milestones on every Thread 2 page;
- `npm run sync:titles`;
- focused Learning Lab MDX/catalog tests;
- `npm run sync:r2` and `npm run check:r2-assets`;
- `npm run check:catalog-stats`;
- `npm run verify`;
- `git diff --check`.

# Execution log

- 2026-09-21 — Initialized the CV authored domain, expanded the introduction,
  added the first quiz, and introduced active Flowchart styling.
- 2026-09-22 — Built the two historical threads with AI Winter and feature-based
  vision context, then split Chapter 1 into focused theory/quiz nodes.
- 2026-09-22 — Added dual-use impact and future/learning-path nodes; renamed
  Chapter 2 and added the Linear Classifier opening pair.
- 2026-09-22 — Reduced Chapter 1 from roughly 12,700 to roughly 5,300 words and
  realigned its quizzes to beginner-level concepts.
- 2026-09-22 — Restored the timeline on every historical page, set
  natural-height/horizontal-only scrolling, and restored Thread 1 above Thread 2
  across all six Deep Learning pages.
- 2026-09-22 — Added the dual-use, Mark I Perceptron, Backpropagation, and
  AlexNet/ImageNet assets and synchronized authored keys to R2.
- 2026-09-22 — Removed four unreferenced local assets and consolidated all CV
  plan documents into this file.
- 2026-09-22 — Removed unused Timeline phase/badge code. Final audits passed:
  319 MDX titles synchronized; catalog statistics matched; 189/189 authored R2
  image references were reachable; all 162 tests, typecheck, production build,
  structural timeline audit, and `git diff --check` passed.
- 2026-09-22 — Fixed horizontal-scroll snapping in dual-track timelines. The
  chronologically sorted item list is now memoized, and automatic alignment is
  keyed to the active milestone rather than the array identity, so scroll-button
  state updates no longer pull the viewport back while the learner scrolls.
