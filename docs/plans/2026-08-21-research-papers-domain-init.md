---
title: "Research Papers Domain & SDC-LoRA Paper Review"
status: done
created: 2026-08-21T10:25:00+07:00
updated: 2026-08-23T21:15:00+07:00
author: nmkhiem
task: "Initialize Research Papers domain, integrate in-depth paper review for SDC-LoRA (ACL 2026) alongside Flowchart and Mermaid diagram components"
supersedes: []
---

# Goal

Initialize the Learning Lab domain `research-papers` ("Random Research Paper") and deliver a comprehensive deep-dive module on **SDC-LoRA: Singular-Subspace Drift Controlled LoRA to Mitigate Knowledge Forgetting** (ACL 2026), covering SVD mathematical foundations, empirical results, in-depth representation mechanisms, academic debates & limitations, and a 10-question evaluation quiz.

# Key Deliverables

1. **Domain & Catalog Registration:**
   - Registered `research-papers` in `LearningDomainId`, configured Slate/Indigo palette (`#C2D1E8`, `#5376A8`) and `GraduationCap` icon.
   - Organized curriculum structure into hierarchical domain directories (`research-papers/llm/continual-learning/sdc-lora/`).
   - Synchronized TOC and test suite assertions (`learningCatalog.test.ts`).

2. **SDC-LoRA Curriculum (5 nodes):**
   - `sdc-lora`: LoRA foundations, Singular-Subspace Drift (SD) phenomenon, and Spectral Calibration ($\gamma_{\text{sc}}$) mechanism.
   - `sdc-lora-experiments`: Comprehensive benchmark results (LLaMA-3.1, Qwen2.5, GSM8K, MMLU), loss convergence curves, and learning rate trade-off elimination.
   - `sdc-lora-insights`: In-depth analysis of unconstrained gradients causing subspace rotation angles $\theta_U, \theta_V$ and contrast energy ratio ($R_t$) dynamics.
   - `sdc-lora-debate`: Academic debates (offline SVD computation cost, scaling laws, compatibility with quantization/DoRA/QLoRA) and future research horizons.
   - `sdc-lora-quiz`: 10 comprehensive assessment questions covering mathematical invariants and empirical findings.

3. **Visual & Runtime Components:**
   - Added `MermaidDiagram` supporting embedded KaTeX formulas within diagram nodes.
   - Added `Flowchart` for sequential pipeline visual representation.
   - Supported `TemplateLiteral` expressions in MDX static AST analyzer (`learningContentMdx.ts`).

# Verification

- `npm run verify` (TypeScript typecheck, 152 unit/contract tests, Vite production build) passing 100%.
