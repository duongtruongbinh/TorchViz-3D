---
title: "MLOps Domain — Curriculum Init & Shared-UI Refactor"
status: completed
created: 2026-08-20
updated: 2026-08-20
author: Antigravity
supersedes: ["2026-08-20-mlops-448-question-bank-enhancement.md"]
---

# Summary

Initialised the `mlops-llmops-production-systems` Learning Lab domain (8 chapters,
16 topics, 48 triplet lessons) based on Made-With-ML, with Vietnamese
localisation. Followed up with shared-UI refactors:

- **InteractiveStepper rewrite**: stop-at-end (no infinite loop), `loop` prop,
  `prefers-reduced-motion`, `labels` prop (English defaults), dot overflow
  guard (MAX_DOTS = 12), `setInterval` → `setTimeout`.
- **Dead-code removal**: deleted `MathStepperControls` proxy and
  `StepPlaybackControls` (70 LoC), migrated 5 call sites to shared stepper.
- **Rename `diagramPrimitives` → `probabilityCharts`** (domain-local); diagram
  utilities extracted to `primitives/diagramPrimitives` (shared).
- **448-question-bank enhancement** scope (tool-independence, cross-cutting
  architecture, failure-scenario quizzes) folded into curriculum commits.

# Verification

`npm run verify` — pass (tsc + build).
