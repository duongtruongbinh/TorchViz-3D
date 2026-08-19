---
title: "MLOps Domain Curriculum — Made-With-ML Reference Ingestion, Vietnamese Localization, Micro-Paging & Triplet Node Architecture"
status: proposed
created: 2026-08-20
updated: 2026-08-20
author: Antigravity
task: "Ingest GokuMohandas/Made-With-ML curriculum, localize to Vietnamese, break into micro-pages (1-2 points per page), and author paired Theory, Quiz, and Code Lab nodes for the MLOps Learning Lab domain"
supersedes: []
---

# Lineage

This is the initial plan for ingesting, structuring, localizing, and implementing the MLOps domain in Learning Lab (`mlops-llmops-production-systems`), utilizing `GokuMohandas/Made-With-ML` as the primary reference foundation.

---

# Executive Summary

The `mlops-llmops-production-systems` domain in Learning Lab is designed to provide an end-to-end curriculum on productionizing machine learning systems. Based on the open-source industry standard course *Made With ML* by Goku Mohandas, the curriculum is structured into an 8-chapter lifecycle from System & Product Design to Production Monitoring and Continuous Retraining.

Each major topic is structured as a **Triplet Node Unit**:
1. **Theory Node** (`[topic-id]`): Explaining first principles with micro-pages (`<MdxPage>`), visual cards, diagrams, notes, and callouts. Each page strictly focuses on 1–2 specific concepts.
2. **Quiz Node** (`[topic-id]-quiz`): High-quality multiple choice questions (`<MdxQuiz>`) testing comprehension and nuance with detailed feedback explanations.
3. **Code Lab Node** (`[topic-id]-code-lab`): Hands-on, practical code walkthroughs, terminal commands, clean Python scripts, testing harnesses, and configuration files.

All content is authored in natural, idiomatic Vietnamese tailored for ML engineers.

---

# Curriculum Map (8 Chapters, 16 Topics, 48 Triplet Lessons)

```text
Chapter 1: Thiết kế Hệ thống & Sản phẩm AI (System & Product Design)
  1.1 product-design / product-design-quiz / product-design-code-lab
  1.2 system-design / system-design-quiz / system-design-code-lab

Chapter 2: Kỹ thuật & Xử lý Dữ liệu (Data Engineering & Preprocessing)
  2.1 data-preparation-eda / data-preparation-eda-quiz / data-preparation-eda-code-lab
  2.2 preprocessing-distributed-data / preprocessing-distributed-data-quiz / preprocessing-distributed-data-code-lab

Chapter 3: Huấn luyện, Quản lý Thử nghiệm & Đánh giá (Training, Tracking & Evaluation)
  3.1 distributed-training / distributed-training-quiz / distributed-training-code-lab
  3.2 experiment-tracking / experiment-tracking-quiz / experiment-tracking-code-lab
  3.3 tuning-evaluation / tuning-evaluation-quiz / tuning-evaluation-code-lab

Chapter 4: Kiểm thử Hệ thống ML Toàn diện (Testing: Code, Data & Models)
  4.1 code-testing / code-testing-quiz / code-testing-code-lab
  4.2 data-validation / data-validation-quiz / data-validation-code-lab
  4.3 model-behavioral-testing / model-behavioral-testing-quiz / model-behavioral-testing-code-lab

Chapter 5: Quản lý Phiên bản & Chuẩn hóa Code (Reproducibility & Versioning)
  5.1 data-model-versioning / data-model-versioning-quiz / data-model-versioning-code-lab
  5.2 code-quality-precommit / code-quality-precommit-quiz / code-quality-precommit-code-lab

Chapter 6: Triển khai & Phục vụ Mô hình (Deployment & Serving)
  6.1 model-serving-fastapi-ray / model-serving-fastapi-ray-quiz / model-serving-fastapi-ray-code-lab
  6.2 containerization-release / containerization-release-quiz / containerization-release-code-lab

Chapter 7: CI/CD & Tự động hóa Pipeline (CI/CD Workflows for ML)
  7.1 ml-cicd-github-actions / ml-cicd-github-actions-quiz / ml-cicd-github-actions-code-lab

Chapter 8: Giám sát, Drift & Vòng lặp Huấn luyện lại (Monitoring & Retraining)
  8.1 monitoring-drift-detection / monitoring-drift-detection-quiz / monitoring-drift-detection-code-lab
  8.2 feedback-loops-retraining / feedback-loops-retraining-quiz / feedback-loops-retraining-code-lab
```

---

# Verification Strategy

- Typecheck verification: `npm run typecheck`
- Unit tests: `npm test`
- Build verification: `npm run build`
- Full suite verification: `npm run verify`
