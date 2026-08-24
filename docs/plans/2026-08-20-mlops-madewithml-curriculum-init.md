---
title: "MLOps Domain — Curriculum Init, Architecture Expansion & 3-Tier Catalog Readiness"
status: done
created: 2026-08-20T00:00:00+07:00
updated: 2026-08-24T00:00:00+07:00
author: Antigravity
supersedes: []
---

# Summary

Initialised and expanded the `mlops-llmops-production-systems` Learning Lab domain (8 chapters, 18 topics, 54 triplet lessons: theory + quiz + code lab) based on Made-With-ML with comprehensive Vietnamese localization, visual metaphors, and architectural decoupling principles:

> Note (2026-08-24): scope expanded after this plan shipped — the domain now
> carries 21 topics / 63 published lessons (v2 expansion, commit `e5882e9`).

- **Chapter 1 Architecture Breakdown & Modularization**:
  - Expanded generic system design into 6 specialized topic triplets:
    - 1.1 Product Design (`product-design`, `product-design-quiz`, `product-design-code-lab`)
    - 1.2 System Architecture Overview (`system-overview`, `system-overview-quiz`, `system-overview-code-lab`)
    - 1.3 Data Layer Design (`data-layer-design`, `data-layer-design-quiz`, `data-layer-design-code-lab`)
    - 1.4 Compute Layer Design (`compute-layer-design`, `compute-layer-design-quiz`, `compute-layer-design-code-lab`)
    - 1.5 Serving Layer Design (`serving-layer-design`, `serving-layer-design-quiz`, `serving-layer-design-code-lab`)
    - 1.6 Control Layer Design (`control-layer-design`, `control-layer-design-quiz`, `control-layer-design-code-lab`)
- **Visual Educational Metaphors & Assets**:
  - Generated and integrated 6 bespoke 16:9 illustration assets adhering to the educational doodle guidelines (rounded cards, pastel header accents, minimal clear labels):
    - `01-batch-prediction-pipeline-flow.jpg` (4-step closed-loop flow)
    - `02-decoupling-data-contracts.jpg` (3 decoupled architecture pillars)
    - `03-gpu-crash-case-study.jpg` (GPU preemption disaster vs. decoupled checkpointing)
    - `04-data-contract-case-study.jpg` (Frontend schema shift silent failure vs. contract shield)
    - `05-modular-hybrid-migration.jpg` (Cloud-first launch to self-hosted migration roadmap)
    - `06-environment-separation-dev-ci-prod.jpg` (Dev vs CI vs Prod dependency matrix)
- **Lesson Visual Formatting & Case Study Cards**:
  - Restructured `1.2.1-system-overview.vi.mdx` case study pages (pages 4, 5, 6) into 3-column `CourseCards` consistent with page 3 (Local storage trap, Silent contract failure, and Hybrid cost optimization).
- **3-Tier Domain Catalog Readiness Architecture**:
  - Defined explicit `LearningDomainReadinessState = 'ready' | 'updating' | 'unupdated'`.
  - Color-coded badges: Green for `ready` ("Sẵn sàng"), Amber for `updating` ("Đang cập nhật"), and Muted gray for `unupdated` ("Chưa cập nhật").
  - Configured MLOps domain (`mlops-llmops-production-systems`) as `status: 'partial'` (`updating`), placed immediately after ready domains on the home page catalog.
  - Ensured placeholder domains (`cv`, `robot-learning`, `programming-foundation`, etc.) render dimmed/faded cards with "Chưa cập nhật" status pills.
- **Shared UI & Interactive Primitives**:
  - `InteractiveStepper`: stop-at-end, `loop` prop, `prefers-reduced-motion`, `labels` prop, dot overflow guard (MAX_DOTS = 12).
  - Cleaned up redundant localization keys and dead code.

# Verification

- `npm run verify` — pass (tsc + 148/148 test suites + full Vite production build).

