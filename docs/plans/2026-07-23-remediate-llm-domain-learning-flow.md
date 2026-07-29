---
title: Remediate the LLM Domain Learning Flow
status: done
created: 2026-07-23T22:48:26+07:00
updated: 2026-07-24T00:33:03+07:00
author: nmkhiem
task: "review and reorganize all 177 published llm-ai-engineering nodes into theory, immediate quiz, calculation or code, application quiz, and production handoff units"
supersedes:
  - 2026-07-23-complete-llm-ai-engineering-domain.md
  - 2026-07-23-llm-course-audit-remediation.md
  - 2026-07-23-fill-llm-from-scratch-nodes.md
  - 2026-07-23-expand-llm-learning-lab-course.md
  - 2026-07-23-complete-llm-text-data-pipeline.md
---

# Goal

Remediate the published `llm-ai-engineering` domain so every substantive theory
node has exactly one adjacent recap `Quiz`, no quiz tests untaught material, and
each unit proceeds through a traceable calculation or runnable code application
before its production handoff.

The proposed target is:

```text
177 existing canonical nodes, all preserved
+ 23 new adjacent-theory Quiz nodes
= 200 canonical nodes
```

The runtime architecture remains:

```text
typed TOC
  -> React-free catalog
  -> selectors/routes
  -> locale MDX
  -> validated authored registry
  -> lesson UI
```

# Lineage

This plan serves as the durable implementation record for the complete 200-node
LLM course. It absorbs the five predecessor 2026-07-23 iteration plans:

- `2026-07-23-fill-llm-from-scratch-nodes.md`: Published fifteen missing nodes; fixed Quiz browser crash by requiring renderable options.
- `2026-07-23-expand-llm-learning-lab-course.md`: Reached 45-node/209-page milestone, added 16 nodes, removed remote images, and strengthened Quiz/code contracts.
- `2026-07-23-llm-course-audit-remediation.md`: Captured valid first-time-reader findings; its proposed 47-node draft was replaced by this complete 200-node remediation.
- `2026-07-23-complete-llm-text-data-pipeline.md`: Defined 17-node text-to-tensor sequence with shared `V=6, B=2, T=3, C=3` trace.
- `2026-07-23-complete-llm-ai-engineering-domain.md`: Added 94 lessons/298 pages to reach the preserved 177 baseline, modernized provider coverage, and enforced zero parallel registries.

The broader content architecture continues from:

- [Polish the Intro Chapter to align with the AI Landscape](./2026-07-21-llm-ai-landscape-intro-polish.md)
- [Approved LLM Lessons MDX Migration](./2026-07-14-approved-llm-lessons-mdx-migration.md)
- [Learning Lab Refactor](./2026-06-21-learning-lab-refactor.md)

# Worktree Safety

The audit used the current worktree on `feat/llm-domain-edits-v6`, including
modified and untracked MDX, TOC, validator, test, wiki, and predecessor-plan
files. Those changes belong to the requester and must be preserved.

This draft plan is the first and only write for this task. No lesson, TOC,
renderer, validator, test, catalog, localization, wiki, or execution-log file
may change until the requester explicitly approves this plan and its status is
advanced through `approved` to `executing`.

# Context and Read-Only Evidence

The audit covered:

- `AGENTS.md`, `CLAUDE.md`, `docs/WORKFLOW.md`, all lineage plans above, and
  `wiki/concepts/learning-lab.md`;
- the complete typed TOC and all 177 Vietnamese LLM MDX sources;
- the React-free catalog, selectors/routes, MDX validator and discovery code,
  authored registry, renderer/quiz UI, and focused catalog/MDX tests;
- exact quiz payloads, page counts, question and option IDs, code fences,
  headings, prerequisite order, official-source notes, and repeated code
  templates.

The read-only baseline check passed:

```text
node --test src/lib/learningCatalog.test.ts src/lib/learningMdxContent.test.ts
2 test files passed
```

Those tests currently lock the 177-node count and exact order. They enforce the
4–5 single-choice/one-correct contract only for part of the domain and do not
enforce theory-to-Quiz adjacency or quiz-before-teaching.

# Audit Conventions

- `Adjacent` means the next canonical node.
- A current `hybrid` is theory-bearing when it introduces a new contract before
  an example. Merely containing a code fence does not make it a code node. In
  the target state, `hybrid` is allowed only when its theory component has the
  required adjacent Quiz; otherwise the node must be narrowed to `code`,
  `calculation`, or `production-pattern`.
- A target `code` or `calculation` node may carry a short prerequisite recap,
  but may not introduce a separate theory scope that would itself require
  another adjacent Quiz.
- An application checkpoint may be embedded in a code/calculation node. A
  standalone application Quiz is retained where an existing route can reinforce
  the whole unit.
- `Keep` never means “leave prose untouched”; it means preserve route, target
  role, and relative position unless the action says otherwise.

# Coverage Audit — All 177 Current Nodes

## 1.1 Overview

| Order | Track | Canonical ID | Display title | Current type | Target type | Immediate prerequisite | Quiz coverage | Code/calculation coverage | Action |
|---:|---:|---|---|---|---|---|---|---|---|
| 1 | 1.1 | `minimal-llm-project-skeleton` | Yêu cầu chuẩn bị | production-pattern | production-pattern | none | n/a | none | Keep; pin dependencies and remove mutable remote install |
| 2 | 1.1 | `llm-from-scratch-roadmap` | Bức tranh tổng quan về AI | theory | theory | order 1 | Adjacent order 3; only 3 questions and one ordering task | none | Keep; add objective/state/pitfall and qualify hiring taxonomy |
| 3 | 1.1 | `llm-component-checkpoint-quiz` | Quiz | quiz | quiz | order 2 | 3 questions: order + single; rote-heavy | none | Rewrite as 4–5 single-choice scenarios |
| 4 | 1.1 | `llm-system-components` | Các thành phần của hệ thống LLM | theory | theory | order 2 | Adjacent order 5; 3 questions, no single-choice | none | Keep; add worked decision and consistent component names |
| 5 | 1.1 | `llm-system-components-quiz` | Quiz | quiz | quiz | order 4 | categorize + two multi-select; rote | none | Rewrite as 4–5 single production decisions |
| 6 | 1.1 | `language-modeling-next-token` | Mô hình ngôn ngữ và dự đoán token tiếp theo | theory | theory | order 4 | Adjacent order 7; one categorize item | Embedded chain-rule trace | Keep; standardize example and tensor/state contract |
| 7 | 1.1 | `language-modeling-next-token-quiz` | Quiz | quiz | quiz | order 6 | 5 questions; one categorize | Includes probability trace | Convert categorization to single-choice misconception |
| 8 | 1.1 | `ar-language-model-inference-pipeline` | Quy trình sinh token của AR Language Model | theory | theory | order 6 | Adjacent order 9; one ordering item | Embedded generation trace | Correct forward/logits/softmax contract; add shapes/error path |
| 9 | 1.1 | `ar-language-model-inference-pipeline-quiz` | Quiz | quiz | quiz | order 8 | 5 questions; one ordering item | Applied trace | Convert ordering task to single-choice pipeline/error scenario |
| 10 | 1.1 | `llm-output-head-and-loss` | Output head của Language Model | theory | theory | order 8 | Adjacent compliant order 11 | Order 12 applies probabilities to loss | Distinguish training `(B,T,V)` from inference `(B,V)` |
| 11 | 1.1 | `llm-output-head-and-loss-quiz` | Quiz | quiz | quiz | order 10 | 4 single-choice questions | Shape/concept checks | Keep; strengthen one numeric trace |
| 12 | 1.1 | `llm-next-token-loss` | Loss function khi training Language Model | hybrid | hybrid | order 10 | Adjacent order 13; 7 questions, two multi-select | Embedded NLL derivation | Add batched reduction contract and production pitfall |
| 13 | 1.1 | `llm-next-token-loss-quiz` | Quiz | quiz | quiz | order 12 | 7 questions, two multi-select | Strong loss calculation | Reduce to 4–5 single-choice traces |
| 14 | 1.1 | `llm-scale-and-development` | Quy mô và sự phát triển của LLM | theory | theory | order 12 | Adjacent order 15; only 3 questions, two multi-select | none | Add dated sources, worked decision, and pitfall |
| 15 | 1.1 | `llm-scale-and-development-quiz` | Quiz | quiz | quiz | order 14 | 3 questions; recall-heavy | none | Rewrite as 4–5 production trade-off scenarios |

## 1.2 Text Data & Tokenization

| Order | Track | Canonical ID | Display title | Current type | Target type | Immediate prerequisite | Quiz coverage | Code/calculation coverage | Action |
|---:|---:|---|---|---|---|---|---|---|---|
| 16 | 1.2 | `text-embeddings-overview` | Từ raw text đến embeddings | theory | theory | 1.1 token/output concepts | Delayed/shared in order 18 after another theory | Applied at order 31 | Add adjacent `text-embeddings-overview-quiz` |
| 17 | 1.2 | `tokenization-why-it-matters` | Tại sao dùng token thay vì chỉ dùng word? | theory | theory | order 16 + new Quiz | Adjacent order 18 currently also assesses order 16 | Order 19 applies split rules | Keep; rescope order 18 to this theory only |
| 18 | 1.2 | `tokenization-why-it-matters-quiz` | Quiz | quiz | quiz | order 17 | 4 single-choice questions across two theories | Leads to regex code | Replace embedding questions with tokenization scenarios |
| 19 | 1.2 | `tokenizer-regex-from-scratch` | Code: Xây tokenizer regex đơn giản | code | code | order 17/18 | Adjacent application Quiz order 20 | Progressive regex code | Make imports/definitions self-contained and executable |
| 20 | 1.2 | `tokenizer-regex-from-scratch-quiz` | Quiz | quiz | quiz | order 19 | Compliant 5-question application Quiz | Tests tokenizer behavior | Keep |
| 21 | 1.2 | `tokenization-bpe-tiktoken` | Huấn luyện tokenizer bằng BPE | theory | theory | regex tokenizer contrast | Adjacent compliant order 22 | Hand merge trace | Clarify generic BPE versus `tiktoken` |
| 22 | 1.2 | `tokenization-bpe-tiktoken-quiz` | Quiz | quiz | quiz | order 21 | 4 single-choice scenarios | Merge/training distinctions | Keep |
| 23 | 1.2 | `tokenization-token-ids-vocabulary` | Token IDs và vocabulary | theory | theory | order 21/22 | Adjacent compliant order 24 | Order 25 applies encode/decode | Keep |
| 24 | 1.2 | `tokenization-token-ids-vocabulary-quiz` | Quiz | quiz | quiz | order 23 | 4 single-choice questions | Encode/decode trace | Keep |
| 25 | 1.2 | `tokenization-raw-text-to-token-ids` | Worked example: Từ raw text đến token IDs | hybrid | calculation | fixed vocabulary | No post-calculation Quiz | Manual and `tiktoken` trace | Narrow to calculation; add local definitions/assertions |
| 26 | 1.2 | `tokenization-special-tokens` | Special tokens | theory | theory | order 25 | Adjacent compliant order 27 | Order 28 consumes boundary/PAD | Keep |
| 27 | 1.2 | `tokenization-special-tokens-quiz` | Quiz | quiz | quiz | order 26 | 4 single-choice scenarios | Boundary/EOS/PAD checks | Keep |
| 28 | 1.2 | `sliding-window-and-embedding-calculation` | Tính sliding window và batch shape | calculation | calculation | order 26/27 | Adjacent application Quiz order 29 | Strong `(B,T)` hand trace | Keep |
| 29 | 1.2 | `token-counting-hand-quiz` | Quiz | quiz | quiz | order 28 | Compliant 5-question application Quiz | Leakage/shape calculation | Keep |
| 30 | 1.2 | `tokenizer-and-dataloader-code` | Code tokenizer và dataloader | code | code | orders 28–29 | No standalone post-code Quiz | Dataset/DataLoader assertions | Keep; add invalid-input/error assertions |
| 31 | 1.2 | `tokenization-data-pipeline` | Token embedding và positional embedding | theory | theory | batched IDs from order 30 | Adjacent compliant order 32 | Embedded lookup/addition code | Keep |
| 32 | 1.2 | `tokenization-embedding-input-quiz` | Quiz | quiz | quiz | order 31 | Compliant 5-question shape Quiz | `(B,T) -> (B,T,C)` application | Keep |

## 1.3 Attention & Transformers From Scratch

| Order | Track | Canonical ID | Display title | Current type | Target type | Immediate prerequisite | Quiz coverage | Code/calculation coverage | Action |
|---:|---:|---|---|---|---|---|---|---|---|
| 33 | 1.3 | `causal-self-attention-theory` | Lý thuyết causal self-attention | theory | theory | embedding input | Delayed order 35 after calculation | Order 34 hand calculation | Move/rescope order 35 immediately after theory |
| 34 | 1.3 | `attention-score-shape-calculation` | Tính score và shape attention | calculation | calculation | order 33 + moved Quiz | Current order 35 follows it | Strong QK/mask/context trace | Place after mandatory theory Quiz |
| 35 | 1.3 | `attention-mechanism-checkpoint-quiz` | Quiz | quiz | quiz | currently orders 33–34 | 5 questions; two ask future MHA knowledge | Mixed causal/MHA calculation | Move after order 33; replace future-MHA items |
| 36 | 1.3 | `multi-head-attention-theory` | Lý thuyết multi-head attention | theory | theory | order 34 | none | Order 37 applies theory | Add adjacent `multi-head-attention-theory-quiz` |
| 37 | 1.3 | `multi-head-attention-code` | Code multi-head attention | code | code | order 36 + new Quiz | Embedded reinforcement only | Standalone module and shape assertions | Add causality and invalid-shape paths |

## 1.4 Building a GPT Model

| Order | Track | Canonical ID | Display title | Current type | Target type | Immediate prerequisite | Quiz coverage | Code/calculation coverage | Action |
|---:|---:|---|---|---|---|---|---|---|---|
| 38 | 1.4 | `gpt-block-theory` | Lý thuyết GPT block | theory | theory | MHA code | Delayed order 40 after calculation | Order 39 calculates shape/parameters | Move/rescope order 40 immediately after theory |
| 39 | 1.4 | `gpt-parameter-shape-calculation` | Tính parameter và shape của GPT | calculation | calculation | order 38 + moved Quiz | Current order 40 follows it | Exact parameter audit | Place after mandatory theory Quiz |
| 40 | 1.4 | `gpt-block-checkpoint-quiz` | Quiz | quiz | quiz | currently orders 38–39 | 5 questions; one depends on calculation | Mixed theory/calculation | Move after order 38; replace calculation-only item |
| 41 | 1.4 | `gpt-module-code` | Code module GPT | code | code | orders 38–39 | Embedded reinforcement only | Runnable GPT module | Reconcile bias assumptions; add error path |

## 1.5 Pretraining & Generation

| Order | Track | Canonical ID | Display title | Current type | Target type | Immediate prerequisite | Quiz coverage | Code/calculation coverage | Action |
|---:|---:|---|---|---|---|---|---|---|---|
| 42 | 1.5 | `llm-data-pipeline-overview` | Tổng quan quy trình huấn luyện và sinh token | theory | theory | GPT module | Adjacent compliant order 43 | Downstream pretraining code | Keep |
| 43 | 1.5 | `llm-data-pipeline-checkpoint-quiz` | Quiz | quiz | quiz | order 42 | 5 single-choice state questions | Pipeline checks | Keep |
| 44 | 1.5 | `next-token-pretraining-theory` | Lý thuyết pretraining next-token | theory | theory | order 42/43 | Delayed order 46 after calculation | Orders 45 and 48 apply theory | Add adjacent `next-token-pretraining-theory-quiz` |
| 45 | 1.5 | `loss-perplexity-hand-calculation` | Perplexity và đánh giá LLM | hybrid | calculation | order 44 + new Quiz | Adjacent application Quiz order 46 | Strong NLL/PPL trace | Narrow to calculation; remove universal PPL ranges |
| 46 | 1.5 | `benchmark-likelihood-quiz` | Quiz | quiz | quiz | order 45 | Compliant 5-question PPL application | Calculation trace | Keep |
| 47 | 1.5 | `evaluation-beyond-perplexity` | Beyond Perplexity | theory | theory | PPL unit | none; followed by unrelated training code | Harness appears much later in 2.2 | Move order 48 before it; add adjacent evaluation Quiz |
| 48 | 1.5 | `training-loop-and-generation-code` | Code training loop và checkpoint | code | code | orders 44–46 | Embedded reinforcement only | Training/eval/checkpoint code | Move before order 47; harden checkpoint/error paths |
| 49 | 1.5 | `generation-decoding-theory` | Lý thuyết generation và decoding | theory | theory | trained checkpoint | Delayed order 51 after calculation | Orders 50 and 52 apply theory | Move order 51 immediately after theory |
| 50 | 1.5 | `generation-sampling-calculation` | Tính temperature và top-k | calculation | calculation | order 49 + moved Quiz | Current order 51 follows it | Strong numeric trace | Place after mandatory theory Quiz |
| 51 | 1.5 | `generation-strategies-quiz` | Quiz | quiz | quiz | currently orders 49–50 | 5 single-choice questions; theory already sufficient | Theory/application mix | Move immediately after order 49 |
| 52 | 1.5 | `generation-strategies-code` | Code generation strategies | code | code | orders 49–50 | Embedded reinforcement only | Generation loop/smoke test | Fix imports, EOS state, mode restoration, errors |

## 1.6 Fine-Tuning

| Order | Track | Canonical ID | Display title | Current type | Target type | Immediate prerequisite | Quiz coverage | Code/calculation coverage | Action |
|---:|---:|---|---|---|---|---|---|---|---|
| 53 | 1.6 | `finetuning-objectives-theory` | Lý thuyết objective fine-tuning | theory | theory | pretraining/evaluation | none; followed by another theory | Branch calculations later | Add adjacent `finetuning-objectives-theory-quiz` |
| 54 | 1.6 | `classification-finetuning-theory` | Lý thuyết classification fine-tuning | theory | theory | order 53 + new Quiz | Delayed order 56 after calculation | Orders 55 and 57 apply theory | Move order 56 immediately after theory |
| 55 | 1.6 | `classification-head-calculation` | Tính classification head và loss | calculation | calculation | order 54 + moved Quiz | Current order 56 follows it | Head/loss/accuracy trace | Place after mandatory theory Quiz |
| 56 | 1.6 | `classification-finetuning-quiz` | Quiz | quiz | quiz | currently orders 54–55 | 5 single-choice questions | Theory/application checks | Move after order 54; strengthen error scenarios |
| 57 | 1.6 | `classification-finetuning-code` | Code classification fine-tuning | code | code | orders 54–55 | Embedded reinforcement only | Toy classifier smoke test | Fix import/device/empty-mask paths |
| 58 | 1.6 | `instruction-finetuning-theory` | Lý thuyết instruction fine-tuning | theory | theory | objective/classification branch | Delayed order 60 after calculation | Orders 59 and 61 apply theory | Move order 60 immediately after theory |
| 59 | 1.6 | `instruction-batch-mask-calculation` | Tính instruction batch và response mask | calculation | calculation | order 58 + moved Quiz | Current order 60 follows it | Alignment/mask trace | Place after mandatory theory Quiz |
| 60 | 1.6 | `instruction-data-quality-quiz` | Quiz | quiz | quiz | currently orders 58–59 | 5 questions; one rote padding fact | Concept/application checks | Move after order 58; strengthen error scenarios |
| 61 | 1.6 | `classification-and-instruction-finetune-code` | Code instruction fine-tuning | code | code | orders 58–59 | Embedded reinforcement only | Collate/masked-loss smoke test | Fix EOS/PAD contradiction and all-ignore path |
| 62 | 1.6 | `lora-finetuning-theory` | Lý thuyết fine-tuning với LoRA | theory | theory | order 53 unit | none | Order 63 applies theory | Add adjacent `lora-finetuning-theory-quiz` |
| 63 | 1.6 | `lora-minimal-code` | Code LoRA tối thiểu | code | code | order 62 + new Quiz | Embedded reinforcement only | Adapter/gradient/parameter assertions | Add imports and invalid-rank path |

## 2.1 LLM Fundamentals

| Order | Track | Canonical ID | Display title | Current type | Target type | Immediate prerequisite | Quiz coverage | Code/calculation coverage | Action |
|---:|---:|---|---|---|---|---|---|---|---|
| 64 | 2.1 | `transformer-at-scale` | Transformer ở quy mô lớn | theory | theory | GPT/pretraining | Delayed, only one item in order 68 | 16 MiB activation trace | Expand objectives; add adjacent Quiz |
| 65 | 2.1 | `context-window-limits` | Giới hạn context window | calculation | calculation | order 64 + new Quiz | Delayed one item in order 68 | 5,368-token budget trace | Keep |
| 66 | 2.1 | `kv-cache-inference` | KV cache trong inference | hybrid | calculation | MHA/context budget | Delayed in order 68 | 512 MiB trace; generic fixture | Narrow to cache/state calculation and assertions |
| 67 | 2.1 | `tokenization-at-scale` | Tokenization ở quy mô lớn | hybrid | production-pattern | chapter 1.2 tokenizer | Adjacent order 68 but shared across four nodes | 2.4× trace; generic fixture | Rescope corpus/tokenizer production handoff |
| 68 | 2.1 | `llm-pretraining` | Quiz | quiz | quiz | orders 64–67 | 4 application questions; grouped | none | Keep as application Quiz; improve feedback |
| 69 | 2.1 | `llm-positional-encodings` | Positional encoding cho LLM | hybrid | theory | causal attention | Delayed in order 74 | RoPE shape/rotation trace | Focus theory; add adjacent Quiz |
| 70 | 2.1 | `flash-attention` | FlashAttention và IO-aware attention | hybrid | theory | dense attention | Delayed in order 74 | 1 GiB score-matrix trace | Focus theory; add adjacent Quiz |
| 71 | 2.1 | `grouped-query-attention` | Grouped-query attention | calculation | calculation | KV cache/MHA | Delayed in order 74 | 4× KV reduction trace | Keep |
| 72 | 2.1 | `sliding-window-attention` | Sliding-window attention | hybrid | code | causal mask | none | Qualitative trace; generic fixture | Narrow to real mask/receptive-field code with embedded checks |
| 73 | 2.1 | `scaling-laws` | Scaling laws và compute-optimal training | hybrid | calculation | scale-cost anatomy | Adjacent order 74 but shared | Formula only; generic fixture | Convert to exact run-table calculation |
| 74 | 2.1 | `instruction-tuning` | Quiz | quiz | quiz | orders 69–73 | 4 questions; omits sliding window, recall-heavy | none | Keep application role; rewrite as five decisions |
| 75 | 2.1 | `rlhf` | RLHF: từ preference đến policy | hybrid | theory | SFT objectives | Delayed in order 77 | Toy objective trace | Consolidate alignment distinctions; add adjacent Quiz |
| 76 | 2.1 | `constitutional-ai` | Constitutional AI và preference learning | hybrid | production-pattern | order 75 + new Quiz | Order 77 asks under-taught DPO | Critique/revision trace | Expand CAI/DPO governance application |
| 77 | 2.1 | `direct-preference-optimization` | Quiz | quiz | quiz | orders 75–76 | 4 questions; Q1/Q4 premature | none | Keep application role; teach DPO fully first |

## 2.2 LLM Evaluation & Safety

| Order | Track | Canonical ID | Display title | Current type | Target type | Immediate prerequisite | Quiz coverage | Code/calculation coverage | Action |
|---:|---:|---|---|---|---|---|---|---|---|
| 78 | 2.2 | `llm-evaluation-foundations` | Vì sao đánh giá LLM khó? | theory | theory | chapter 1.5 evaluation | none | No typed case/trace | Expand eval-spec theory; add adjacent Quiz |
| 79 | 2.2 | `evaluation-dataset-design` | Thiết kế evaluation dataset | production-pattern | quiz | expanded foundation + metrics | none | Checklist only | Reorder after order 80; reuse as application Quiz |
| 80 | 2.2 | `deterministic-and-reference-metrics` | Deterministic checks và reference metrics | theory | calculation | foundation Quiz | none | No EM/F1 calculation | Add deterministic metric calculation |
| 81 | 2.2 | `human-evaluation-rubrics` | Human evaluation và rubric | production-pattern | theory | eval specification | none | No scored rubric | Expand rubric/judge theory; add adjacent Quiz |
| 82 | 2.2 | `inter-rater-agreement` | Độ đồng thuận giữa người chấm | theory | calculation | rubric Quiz | none | Names κ/α but computes none | Add confusion table and agreement calculation |
| 83 | 2.2 | `pointwise-and-pairwise-evaluation` | Pointwise và pairwise evaluation | theory | calculation | order 82 | none | No win-rate trace | Add pairwise matrix calculation |
| 84 | 2.2 | `llm-as-a-judge` | LLM-as-a-Judge | theory | code | rubric/agreement | none | No adapter/parser/calibration | Build deterministic judge adapter |
| 85 | 2.2 | `llm-judge-biases` | Các bias của LLM judge | production-pattern | quiz | orders 81–84 | none | Qualitative list | Reuse as application Quiz |
| 86 | 2.2 | `benchmark-selection-and-contamination` | Chọn benchmark và contamination | production-pattern | theory | evaluation foundations | none | No selection trace | Expand benchmark/RAG theory; add adjacent Quiz |
| 87 | 2.2 | `hallucination-and-factuality-evaluation` | Đánh giá hallucination và factuality | theory | calculation | benchmark Quiz | none | No claim-evidence score | Add claim-level calculation |
| 88 | 2.2 | `rag-evaluation` | Đánh giá hệ thống RAG | production-pattern | quiz | orders 86–87 | none | Metric list; unsafe raw logging advice | Reuse as application Quiz; add redaction |
| 89 | 2.2 | `llm-safety-foundations` | Nền tảng LLM safety | theory | theory | eval specification | none | No concrete threat trace | Expand safety theory; add adjacent Quiz |
| 90 | 2.2 | `refusal-calibration` | Hiệu chỉnh hành vi từ chối | production-pattern | calculation | safety Quiz | none | No calibration matrix | Add unsafe-compliance/overrefusal calculation |
| 91 | 2.2 | `toxicity-bias-and-privacy` | Toxicity, bias và privacy | theory | quiz | orders 89–90 | none | No subgroup calculation | Reuse as application Quiz |
| 92 | 2.2 | `jailbreak-and-prompt-injection` | Jailbreak và prompt injection | theory | theory | trust/threat model | none | No attack trace | Expand attack/defense theory; add adjacent Quiz |
| 93 | 2.2 | `guardrails-for-llm-applications` | Guardrails cho ứng dụng LLM | production-pattern | code | injection Quiz | none | Checklist only | Implement layered validation/authorization fixture |
| 94 | 2.2 | `llm-red-teaming` | Red teaming hệ thống LLM | production-pattern | quiz | order 93 | none | Workflow only; unsafe raw trace advice | Reuse as application Quiz |
| 95 | 2.2 | `production-regression-evals` | Regression evaluation trong production | production-pattern | theory | prior eval/safety units | none | No release-gate trace | Expand regression theory; add adjacent Quiz |
| 96 | 2.2 | `evaluation-ab-testing` | A/B testing cho hệ thống LLM | production-pattern | calculation | regression Quiz | none | No effect/CI calculation | Add exact effect and guardrail calculation |
| 97 | 2.2 | `evaluation-harness-code` | Code: Xây evaluation harness | production-pattern | code | order 96 | none | Contains no code; promises code later | Build standalone harness + embedded application checkpoint |

## 2.3 Prompt Engineering

| Order | Track | Canonical ID | Display title | Current type | Target type | Immediate prerequisite | Quiz coverage | Code/calculation coverage | Action |
|---:|---:|---|---|---|---|---|---|---|---|
| 98 | 2.3 | `system-prompt` | System instruction và trust boundary | theory | theory | application policy | Delayed order 101 | Good support/refund trace | Expand role-authority objectives; add adjacent Quiz |
| 99 | 2.3 | `user-prompt` | User input như dữ liệu không tin cậy | hybrid | code | order 98 + new Quiz | Delayed in order 101 | Generic string validator | Implement typed validation/ownership/error paths |
| 100 | 2.3 | `assistant-turn-history` | Assistant history và state nhiều lượt | calculation | calculation | trusted/untrusted messages | Delayed in order 101 | 1,360-token sum | Add capacity/remaining-budget assertion |
| 101 | 2.3 | `role-prompting` | Quiz | quiz | quiz | orders 98–100 | 4 strong grouped scenarios | none | Keep application Quiz |
| 102 | 2.3 | `zero-shot-prompting` | Zero-shot với contract tối thiểu | hybrid | theory | typed-output baseline | Delayed order 104 | Generic string fixture | Focus theory; add adjacent Quiz |
| 103 | 2.3 | `few-shot-examples` | Few-shot examples có chủ đích | hybrid | calculation | order 102 + new Quiz | Order 104 Q2–Q4 | 340-token trace; generic fixture | Add deterministic example-selection calculation |
| 104 | 2.3 | `one-shot-few-shot-prompting` | Quiz | quiz | quiz | orders 102–103 | 4 application questions | none | Keep; improve feedback |
| 105 | 2.3 | `clear-instruction-format-boundaries` | Instruction, data và format boundaries | hybrid | theory | role/trust unit | Delayed order 107 | Generic fixture | Focus theory; add adjacent Quiz |
| 106 | 2.3 | `examples-output-constraints` | Examples và output constraints | hybrid | code | order 105 + new Quiz | Order 107 Q3/Q4 | Generic fixture; no schema parser | Implement parser and refusal/error assertions |
| 107 | 2.3 | `prompt-negative-instructions` | Quiz | quiz | quiz | orders 105–106 | Q2 tests untaught rewrite rule | none | Teach rule first; retain application role |
| 108 | 2.3 | `structured-output-prompting` | Structured output: prompt, JSON mode và schema | hybrid | theory | output-contract unit | none directly | Generic fixture | Focus theory; add adjacent Quiz |
| 109 | 2.3 | `chain-of-thought` | Lập luận có thể kiểm chứng, không yêu cầu hidden CoT | hybrid | calculation | order 108 + new Quiz | Delayed order 112 Q1 | Refund trace; no verifier | Add deterministic verifier; retain no-hidden-CoT policy |
| 110 | 2.3 | `self-consistency` | Multi-sample verification và self-consistency | hybrid | calculation | order 109 | Delayed order 112 Q2 | 3/5 vote; generic fixture | Add normalization/vote/error assertions |
| 111 | 2.3 | `react-prompting` | Vòng lặp tool use theo mẫu ReAct | hybrid | code | structured tool contract | Adjacent order 112 Q3 | Generic fixture; no state machine | Implement propose/authorize/execute/result loop |
| 112 | 2.3 | `tree-of-thought` | Quiz | quiz | quiz | orders 108–111 | Q4 asks untaught bounded tree search | none | Teach bounded search first; retain application role |
| 113 | 2.3 | `prompt-chaining` | Prompt chaining với typed stages | hybrid | theory | typed output/tool units | none | Generic fixture | Focus lifecycle theory; add adjacent Quiz |
| 114 | 2.3 | `prompt-compression` | Prompt compression có kiểm chứng | hybrid | calculation | order 113 + new Quiz | none | 40% saving; generic fixture | Add invariant/regression calculation |
| 115 | 2.3 | `prompt-versioning-changelogs` | Versioning và changelog cho prompt | hybrid | production-pattern | versioned artifacts | Order 119 Q3 only | Generic fixture | Rescope immutable rollout/rollback |
| 116 | 2.3 | `prompt-ab-testing` | A/B testing prompt trong production | hybrid | calculation | versioned variants | none | 3-point uplift only | Add uncertainty/guardrail calculation |
| 117 | 2.3 | `prompt-injection-defense` | Prompt injection defense-in-depth | hybrid | production-pattern | trust/tool loop | none | Generic fixture | Replace with layered-control trace |
| 118 | 2.3 | `langsmith-observability` | Observability cho prompt và workflow | hybrid | production-pattern | version/security lifecycle | Adjacent order 119 but shared | Generic fixture | Keep vendor-neutral trace/redaction contract |
| 119 | 2.3 | `promptlayer-tracking` | Quiz | quiz | quiz | currently orders 113–118 | 4 grouped questions before console applications | none | Move after orders 120–121; broaden application coverage |
| 120 | 2.3 | `openai-playground` | Thí nghiệm tái lập trong OpenAI Playground | code | code | versioned experiment | none | Generic fixture | Implement exported reproducible artifact |
| 121 | 2.3 | `anthropic-console` | Thí nghiệm tái lập trong Anthropic Console | code | code | common experiment contract | none | Generic fixture | Implement comparable provider artifact/error path |

## 2.4 Working with AI APIs

| Order | Track | Canonical ID | Display title | Current type | Target type | Immediate prerequisite | Quiz coverage | Code/calculation coverage | Action |
|---:|---:|---|---|---|---|---|---|---|---|
| 122 | 2.4 | `chat-completions-api` | Responses API và lộ trình từ Chat Completions | hybrid | theory | roles/trust/server credential | none | Generic `parseFixture`; erases typed output | Keep scope; add adjacent Quiz and real adapter trace |
| 123 | 2.4 | `function-calling-tool-use` | Function calling và tool-use contract | hybrid | code | order 122 + new Quiz | Only indirect provider questions | Generic fixture; no schema/auth/call-ID loop | Implement deterministic tool loop |
| 124 | 2.4 | `json-mode-structured-outputs` | Structured Outputs so với JSON mode | hybrid | code | typed result/refusal contract | Delayed in orders 131/144 | Generic fixture; no schema/refusal checks | Implement validator/refusal/incomplete paths |
| 125 | 2.4 | `streaming-responses-sse` | Streaming response qua SSE | hybrid | code | typed event union | none | Generic fixture; no SSE/UTF-8/abort | Implement parser/state machine |
| 126 | 2.4 | `embeddings-api` | Embeddings API và vector contract | hybrid | calculation | embedding basics | none | Prose `(2,3)` only | Add `(N,D)`/cosine assertions |
| 127 | 2.4 | `vision-api-gpt4v` | Multimodal inputs: vision | hybrid | production-pattern | media-part contract | none | Generic fixture; no media checks | Rescope media ownership/MIME boundary |
| 128 | 2.4 | `assistants-api-file-search` | File Search trên Responses API; migrate từ Assistants | hybrid | production-pattern | retrieval/resource lifecycle | none | Generic fixture; no lifecycle/citations | Make sunset migration operational |
| 129 | 2.4 | `batch-api` | Batch API và reconciliation | hybrid | calculation | offline request contract | Order 131 Q2 | Generic fixture; no reconciliation | Add JSONL/custom-ID calculation |
| 130 | 2.4 | `token-counting-tiktoken` | Token counting cho request envelope | hybrid | calculation | tokenizer/request envelope | Order 131 Q3 | Prose sum; generic fixture | Implement budget/reconciliation |
| 131 | 2.4 | `rate-limits-quotas` | Quiz | quiz | quiz | orders 124/129/130 | Q4 asks untaught retry algorithm | none | Keep application role; replace Q4 |
| 132 | 2.4 | `anthropic-messages-api` | Anthropic Messages API | hybrid | theory | common provider adapter | Delayed order 137 Q1 | Generic fixture; no blocks/stop reason | Move order 137 after it and rescope Quiz |
| 133 | 2.4 | `anthropic-system-prompts` | System instruction trong Anthropic Messages | hybrid | code | order 132 + moved Quiz | Order 137 Q2 | Generic fixture | Implement provider adapter snapshot |
| 134 | 2.4 | `anthropic-long-context` | Long-context budgeting với Anthropic | hybrid | calculation | Messages/token budget | Order 137 Q4 | Prose percentages only | Add exact budget calculation |
| 135 | 2.4 | `anthropic-vision-support` | Vision content blocks với Anthropic | hybrid | code | media/Message blocks | none | Generic fixture | Implement encode/validate adapter |
| 136 | 2.4 | `anthropic-tool-use` | Tool use với Anthropic | hybrid | code | common tool loop/Messages | Order 137 Q3 | Generic fixture | Implement buffered tool-use/result loop |
| 137 | 2.4 | `anthropic-streaming` | Quiz | quiz | quiz | currently orders 132–136 | 4-question cluster, not immediate recap | none | Move after order 132; assess Messages theory only |
| 138 | 2.4 | `gemini-models` | Gemini Interactions API và model catalog | hybrid | production-pattern | common adapter/storage policy | none | Generic fixture | Correct default storage; provider delta |
| 139 | 2.4 | `gemini-multimodal-inputs` | Gemini multimodal inputs | hybrid | code | common media contract | none | Generic fixture | Implement ordered-parts/upload lifecycle |
| 140 | 2.4 | `gemini-search-grounding` | Grounding với Google Search | hybrid | production-pattern | evidence/trust boundary | none | Generic fixture | Add citation/no-grounding decision pattern |
| 141 | 2.4 | `gemini-context-caching` | Gemini context caching | hybrid | calculation | token/tenant policy | none | Prose multiplication only | Add break-even/invalidation calculation |
| 142 | 2.4 | `mistral-models` | Mistral Conversations API và model catalog | hybrid | theory | common adapter/capability matrix | Delayed order 144 Q1 | Generic fixture | Correct API naming; move order 144 after theory |
| 143 | 2.4 | `mistral-function-calling` | Function calling với Mistral | hybrid | code | Mistral theory/tool loop | Order 144 Q2/Q4 | Generic fixture | Place after recap Quiz; implement provider loop |
| 144 | 2.4 | `mistral-json-mode` | Quiz | quiz | quiz | generic JSON; Mistral scope under-taught | 4 questions; route scope gap | none | Move after order 142; rescope provider recap |
| 145 | 2.4 | `ollama-open-source-models` | Chọn model mở cho Ollama | hybrid | theory | model/weights/runtime distinction | Delayed order 148 | Generic fixture | Expand model/license/quantization theory; move Quiz |
| 146 | 2.4 | `llama-3-models-api` | Llama: model card, license và serving contract | hybrid | production-pattern | order 145 + moved Quiz | Order 148 Q2 | Generic fixture | Add serving-manifest conformance |
| 147 | 2.4 | `ollama-local-llama` | Local inference với Ollama | hybrid | code | model manifest/runtime | Order 148 Q1 | Generic fixture | Implement local mock adapter/abort/error |
| 148 | 2.4 | `peft-finetuning-llama` | Quiz | quiz | quiz | orders 145–147 + chapter 1.6 | 4-question cluster | none | Move immediately after order 145; retain declared prerequisites |
| 149 | 2.4 | `cohere-provider` | Cohere provider capability delta | hybrid | production-pattern | common chat/embed/rerank | none | Generic fixture | Add capability/conformance matrix |
| 150 | 2.4 | `nvidia-nim` | NVIDIA NIM inference và management contract | hybrid | production-pattern | serving/readiness | none | Generic fixture | Add readiness/models/metrics trace |
| 151 | 2.4 | `groq-inference` | Groq inference và compatibility gaps | hybrid | production-pattern | Responses feature matrix | none | Generic fixture | Add unsupported-field conformance checks |
| 152 | 2.4 | `together-ai-hosting` | Together AI hosting patterns | hybrid | production-pattern | hosting/batch/SLO | none | Generic fixture | Add route/capability/canary decision |
| 153 | 2.4 | `replicate-hosting` | Replicate prediction lifecycle | hybrid | production-pattern | async job/webhook lifecycle | none | Generic fixture | Add state/webhook/idempotency trace |

## 2.5 API Integration Patterns

| Order | Track | Canonical ID | Display title | Current type | Target type | Immediate prerequisite | Quiz coverage | Code/calculation coverage | Action |
|---:|---:|---|---|---|---|---|---|---|---|
| 154 | 2.5 | `count-tokens-before-sending` | Đếm token trước khi gửi request | hybrid | calculation | 2.4 request envelope | Delayed order 158 | Generic `runFixture`; prose sum only | Reorder after context Quiz; implement allocator |
| 155 | 2.5 | `truncation-strategies` | Truncation strategies có chủ đích | hybrid | calculation | context budget | Delayed order 158 | Generic fixture | Reorder; implement priority/provenance selection |
| 156 | 2.5 | `context-window-management` | Context-window management | hybrid | theory | request-envelope concepts | Order 158 after order 157 | Generic fixture; no allocator | Move to unit start; theory + immediate Quiz |
| 157 | 2.5 | `conversation-summarization` | Conversation summarization có provenance | hybrid | production-pattern | typed history/provenance | Adjacent order 158 Q2 | Generic fixture | Move after calculations; add contradiction/version checks |
| 158 | 2.5 | `prompt-compression-cost-control` | Quiz | quiz | quiz | currently orders 154–157 | 4-question cluster | none | Move after order 156; rescope immediate recap |
| 159 | 2.5 | `sse-streaming-chunks` | Chuẩn hóa SSE chunks giữa providers | hybrid | code | 2.4 streaming contract | Delayed order 162 Q1 | Generic fixture | Move after streaming Quiz; implement adapter |
| 160 | 2.5 | `partial-response-handling` | Xử lý partial response | hybrid | theory | normalized stream | Order 162 after order 161 | Generic fixture; no state machine | Move to unit start; immediate Quiz |
| 161 | 2.5 | `client-stream-rendering` | Rendering stream an toàn trên client | hybrid | code | partial-response state | Order 162 Q3; Q4 untaught | Generic fixture | Move after Quiz; implement reducer/sanitize/cancel |
| 162 | 2.5 | `perceived-latency` | Quiz | quiz | quiz | currently orders 159–161 | Q4 introduces new metric | none | Move after order 160; rescope and teach metric first |
| 163 | 2.5 | `exponential-backoff-jitter` | Exponential backoff với jitter | hybrid | calculation | error/deadline classification | Delayed order 171 Q1 | Generic fixture | Reorder after resilience Quiz; fake-clock calculation |
| 164 | 2.5 | `provider-quota-management` | Quản lý provider quota | hybrid | calculation | token estimate/provider headers | Indirect order 171 Q2 | Generic fixture | Add RPM/TPM reservation calculation |
| 165 | 2.5 | `queue-request-management` | Queue và backpressure | hybrid | production-pattern | admission/quota | none direct | Generic fixture | Add bounded-queue/deadline pattern |
| 166 | 2.5 | `circuit-breaker-pattern` | Circuit breaker cho provider | hybrid | calculation | retry/health | Order 171 Q2 | Generic fixture | Add closed/open/half-open trace |
| 167 | 2.5 | `token-usage-logging` | Token usage và cost observability an toàn | hybrid | production-pattern | usage/redaction | none direct | Generic fixture | Add safe low-cardinality schema |
| 168 | 2.5 | `model-routing-by-complexity` | Model routing theo capability và risk | hybrid | theory | eval/quota/breaker | Delayed order 171 | Generic fixture | Move to resilience-unit start; immediate Quiz |
| 169 | 2.5 | `sha256-response-caching` | SHA-256 response caching đúng scope | hybrid | calculation | normalized request/tenant | Order 171 Q3 | Generic fixture | Add canonicalization/hash/invalidation calculation |
| 170 | 2.5 | `async-pipelines` | Async LLM pipelines | hybrid | code | queue/idempotency/webhooks | Adjacent order 171 Q4 | Generic fixture | Move to final application; implement job state machine |
| 171 | 2.5 | `api-error-fallbacks` | Quiz | quiz | quiz | currently orders 163–170 | 4-question cluster | none | Move after order 168; rescope routing/fallback recap |

## 2.6 Secure API Integration

| Order | Track | Canonical ID | Display title | Current type | Target type | Immediate prerequisite | Quiz coverage | Code/calculation coverage | Action |
|---:|---:|---|---|---|---|---|---|---|---|
| 172 | 2.6 | `no-frontend-api-keys` | Không đặt provider API key ở frontend | theory | theory | browser/server trust boundary | Delayed order 177 Q1 | Good boundary trace; no code | Add adjacent `no-frontend-api-keys-quiz` |
| 173 | 2.6 | `env-files-secret-manager` | Environment variables và secret managers | production-pattern | production-pattern | order 172 + new Quiz | Indirect order 177 | Scenario only | Add access/audit/incident detail |
| 174 | 2.6 | `backend-proxy-pattern` | Backend proxy an toàn cho LLM | hybrid | code | authn/authz + secret manager | Order 177 Q1/Q2 | Shallow happy path only | Implement deny/error/redaction assertions |
| 175 | 2.6 | `redis-per-user-rate-limits` | Rate limit theo user với Redis | hybrid | calculation | authenticated scoped subject | Order 177 Q3 | Unrelated proxy fixture | Replace with atomic token-bucket calculation |
| 176 | 2.6 | `api-key-rotation` | API key rotation không downtime | production-pattern | production-pattern | secret versions/health | Adjacent order 177 Q4 | Routine overlap only | Add compromised-key rapid-revoke branch |
| 177 | 2.6 | `logging-monitoring` | Quiz | quiz | quiz | orders 172–176 + 2.5 usage | 4-question cluster; monitoring under-taught | none | Keep final application Quiz; teach alerts/SLO/retention first |

# Current Learning-Flow Violations

## Theory-bearing node without one adjacent recap Quiz

There are 83 current adjacency failures under the audit convention above:

- tracks 1.1–1.6: 11;
- track 2.1: 4;
- track 2.2: 19;
- track 2.3: 9;
- track 2.4: 24;
- track 2.5: 12;
- track 2.6: 4.

Exact failures:

- 1.2: `text-embeddings-overview -> tokenization-why-it-matters`.
- 1.3: `causal-self-attention-theory -> attention-score-shape-calculation`;
  `multi-head-attention-theory -> multi-head-attention-code`.
- 1.4: `gpt-block-theory -> gpt-parameter-shape-calculation`.
- 1.5: `next-token-pretraining-theory -> loss-perplexity-hand-calculation`;
  `evaluation-beyond-perplexity -> training-loop-and-generation-code`;
  `generation-decoding-theory -> generation-sampling-calculation`.
- 1.6: `finetuning-objectives-theory -> classification-finetuning-theory`;
  `classification-finetuning-theory -> classification-head-calculation`;
  `instruction-finetuning-theory -> instruction-batch-mask-calculation`;
  `lora-finetuning-theory -> lora-minimal-code`.
- 2.1: `transformer-at-scale -> context-window-limits`;
  `llm-positional-encodings -> flash-attention`;
  `flash-attention -> grouped-query-attention`;
  `rlhf -> constitutional-ai`.
- 2.2: every transition from order 78 through order 97 before the nominal
  harness is theory-bearing prose without a Quiz boundary.
- 2.3: `system-prompt -> user-prompt`;
  `user-prompt -> assistant-turn-history`;
  `zero-shot-prompting -> few-shot-examples`;
  `clear-instruction-format-boundaries -> examples-output-constraints`;
  `structured-output-prompting -> chain-of-thought`;
  `chain-of-thought -> self-consistency`;
  `prompt-chaining -> prompt-compression`;
  `prompt-versioning-changelogs -> prompt-ab-testing`;
  `prompt-injection-defense -> langsmith-observability`.
- 2.4: orders 122–130 are one uninterrupted theory-bearing run; orders
  132–136, 138–143, 145–147, and 149–153 have no immediate recap boundary.
- 2.5: orders 154–157, 159–161, and 163–170 are theory-bearing runs.
- 2.6: orders 172–176 are one theory-bearing run.

Existing grouped quizzes do not satisfy the immediate recap contract when they
assess several preceding theories: `llm-pretraining`, `instruction-tuning`,
`direct-preference-optimization`, `role-prompting`,
`one-shot-few-shot-prompting`, `tree-of-thought`, `promptlayer-tracking`,
`rate-limits-quotas`, `anthropic-streaming`, `mistral-json-mode`,
`peft-finetuning-llama`, `prompt-compression-cost-control`,
`perceived-latency`, `api-error-fallbacks`, and `logging-monitoring`.

## Quiz-before-teaching

Eight exact question-level failures were found:

1. `attention-mechanism-checkpoint-quiz`: `(B,H,T,T)` is asked before
   multi-head splitting is taught.
2. `attention-mechanism-checkpoint-quiz`: head split/merge and
   `d_head=d_model/n_heads` are asked before MHA theory.
3. `direct-preference-optimization` Q1: DPO record/reference-policy contract is
   not taught sufficiently.
4. `direct-preference-optimization` Q4: DPO selection/decision boundary is not
   taught sufficiently.
5. `prompt-negative-instructions` Q2: positive measurable replacement is first
   introduced by the question.
6. `tree-of-thought` Q4: bounded search, branching, scoring, and termination
   budget are first introduced by the question.
7. `rate-limits-quotas` Q4: retry classification, capped backoff, jitter, and
   deadline are first introduced by the question.
8. `perceived-latency` Q4: `time-to-first-meaningful-content` first appears in
   the question.

Four route-level scope gaps also require correction:

- `anthropic-streaming` has no preceding Anthropic event-sequence theory;
- `mistral-json-mode` lacks preceding Mistral-specific JSON/schema teaching;
- `logging-monitoring` lacks preceding alerts/SLO/retention/incident teaching;
- `rate-limits-quotas` lacks explicit RPM/TPM/header/headroom teaching.

## Quiz quality and contract

- Six of seven 1.1 quizzes violate the 4–5 single-choice contract. Only
  `llm-output-head-and-loss-quiz` is structurally compliant.
- The 64 current questions across the 16 quizzes in tracks 2.1–2.6 all place
  the correct option first. The renderer preserves that order.
- Their feedback usually repeats the correct answer instead of explaining the
  trace or misconception.
- Rote-heavy clusters include the AI/hiring taxonomy, system component labels,
  scale/popularity facts, provider names/roles, and several JSON/tool/API
  definitions.
- Existing stable question and option IDs must remain where the semantic
  question survives; revised/new items receive stable IDs before publication.

## Code and calculation reinforcement

- The 28 non-Quiz API lessons in 2.4 share one generic `parseFixture` that only
  validates status and a non-empty string.
- Fifteen non-Quiz integration lessons in 2.5 share one generic `runFixture`
  that only validates a boolean and a non-empty string.
- Eighteen additional 2.1/2.3 lessons use equivalent non-empty-string fixtures
  disconnected from their topic.
- `evaluation-harness-code` contains no code and explicitly defers it.
- `redis-per-user-rate-limits` contains an unrelated proxy-validation fixture.
- From-scratch code has local runnable defects: definitions/imports appear
  after use, invalid inputs are not asserted, generation state is not restored,
  finished EOS rows are not tracked, device indexing can mismatch, and
  EOS/PAD masking is contradictory.

The remediation must replace concept-disconnected fixtures with deterministic
topic-specific calculations, parsers, state machines, adapters, or production
decision tables. Removing a fake code fence is preferable to presenting it as
an implementation.

# Proposed Canonical Order by Track

`NEW` marks the 23 proposed canonical additions. Existing IDs are never renamed
or deleted.

## 1.1

Unchanged order; rewrite six noncompliant quizzes and strengthen theory/code
contracts in place.

## 1.2

`text-embeddings-overview` -> **NEW `text-embeddings-overview-quiz`** ->
`tokenization-why-it-matters` -> `tokenization-why-it-matters-quiz` ->
`tokenizer-regex-from-scratch` -> `tokenizer-regex-from-scratch-quiz` ->
`tokenization-bpe-tiktoken` -> `tokenization-bpe-tiktoken-quiz` ->
`tokenization-token-ids-vocabulary` ->
`tokenization-token-ids-vocabulary-quiz` ->
`tokenization-raw-text-to-token-ids` -> `tokenization-special-tokens` ->
`tokenization-special-tokens-quiz` ->
`sliding-window-and-embedding-calculation` -> `token-counting-hand-quiz` ->
`tokenizer-and-dataloader-code` -> `tokenization-data-pipeline` ->
`tokenization-embedding-input-quiz`.

## 1.3

`causal-self-attention-theory` -> `attention-mechanism-checkpoint-quiz` ->
`attention-score-shape-calculation` -> `multi-head-attention-theory` ->
**NEW `multi-head-attention-theory-quiz`** -> `multi-head-attention-code`.

## 1.4

`gpt-block-theory` -> `gpt-block-checkpoint-quiz` ->
`gpt-parameter-shape-calculation` -> `gpt-module-code`.

## 1.5

`llm-data-pipeline-overview` -> `llm-data-pipeline-checkpoint-quiz` ->
`next-token-pretraining-theory` ->
**NEW `next-token-pretraining-theory-quiz`** ->
`loss-perplexity-hand-calculation` -> `benchmark-likelihood-quiz` ->
`training-loop-and-generation-code` -> `evaluation-beyond-perplexity` ->
**NEW `evaluation-beyond-perplexity-quiz`** ->
`generation-decoding-theory` -> `generation-strategies-quiz` ->
`generation-sampling-calculation` -> `generation-strategies-code`.

## 1.6

`finetuning-objectives-theory` ->
**NEW `finetuning-objectives-theory-quiz`** ->
`classification-finetuning-theory` -> `classification-finetuning-quiz` ->
`classification-head-calculation` -> `classification-finetuning-code` ->
`instruction-finetuning-theory` -> `instruction-data-quality-quiz` ->
`instruction-batch-mask-calculation` ->
`classification-and-instruction-finetune-code` -> `lora-finetuning-theory` ->
**NEW `lora-finetuning-theory-quiz`** -> `lora-minimal-code`.

## 2.1

`transformer-at-scale` -> **NEW `transformer-at-scale-quiz`** ->
`context-window-limits` -> `kv-cache-inference` -> `tokenization-at-scale` ->
`llm-pretraining` -> `llm-positional-encodings` ->
**NEW `llm-positional-encodings-quiz`** -> `flash-attention` ->
**NEW `flash-attention-quiz`** -> `grouped-query-attention` ->
`sliding-window-attention` -> `scaling-laws` -> `instruction-tuning` ->
`rlhf` -> **NEW `rlhf-quiz`** -> `constitutional-ai` ->
`direct-preference-optimization`.

## 2.2

`llm-evaluation-foundations` ->
**NEW `llm-evaluation-foundations-quiz`** ->
`deterministic-and-reference-metrics` -> `evaluation-dataset-design` ->
`human-evaluation-rubrics` ->
**NEW `human-evaluation-rubrics-quiz`** -> `inter-rater-agreement` ->
`pointwise-and-pairwise-evaluation` -> `llm-as-a-judge` ->
`llm-judge-biases` -> `benchmark-selection-and-contamination` ->
**NEW `benchmark-selection-and-contamination-quiz`** ->
`hallucination-and-factuality-evaluation` -> `rag-evaluation` ->
`llm-safety-foundations` -> **NEW `llm-safety-foundations-quiz`** ->
`refusal-calibration` -> `toxicity-bias-and-privacy` ->
`jailbreak-and-prompt-injection` ->
**NEW `jailbreak-and-prompt-injection-quiz`** ->
`guardrails-for-llm-applications` -> `llm-red-teaming` ->
`production-regression-evals` ->
**NEW `production-regression-evals-quiz`** -> `evaluation-ab-testing` ->
`evaluation-harness-code`.

## 2.3

`system-prompt` -> **NEW `system-prompt-quiz`** -> `user-prompt` ->
`assistant-turn-history` -> `role-prompting` -> `zero-shot-prompting` ->
**NEW `zero-shot-prompting-quiz`** -> `few-shot-examples` ->
`one-shot-few-shot-prompting` -> `clear-instruction-format-boundaries` ->
**NEW `clear-instruction-format-boundaries-quiz`** ->
`examples-output-constraints` -> `prompt-negative-instructions` ->
`structured-output-prompting` ->
**NEW `structured-output-prompting-quiz`** -> `chain-of-thought` ->
`self-consistency` -> `react-prompting` -> `tree-of-thought` ->
`prompt-chaining` -> **NEW `prompt-chaining-quiz`** ->
`prompt-compression` -> `prompt-versioning-changelogs` ->
`prompt-ab-testing` -> `prompt-injection-defense` ->
`langsmith-observability` -> `openai-playground` -> `anthropic-console` ->
`promptlayer-tracking`.

## 2.4

`chat-completions-api` -> **NEW `chat-completions-api-quiz`** ->
`function-calling-tool-use` -> `json-mode-structured-outputs` ->
`streaming-responses-sse` -> `embeddings-api` -> `batch-api` ->
`token-counting-tiktoken` -> `rate-limits-quotas` -> `vision-api-gpt4v` ->
`assistants-api-file-search` -> `anthropic-messages-api` ->
`anthropic-streaming` -> `anthropic-system-prompts` ->
`anthropic-long-context` -> `anthropic-vision-support` ->
`anthropic-tool-use` -> `gemini-models` -> `gemini-multimodal-inputs` ->
`gemini-search-grounding` -> `gemini-context-caching` -> `mistral-models` ->
`mistral-json-mode` -> `mistral-function-calling` ->
`ollama-open-source-models` -> `peft-finetuning-llama` ->
`llama-3-models-api` -> `ollama-local-llama` -> `cohere-provider` ->
`nvidia-nim` -> `groq-inference` -> `together-ai-hosting` ->
`replicate-hosting`.

## 2.5

`context-window-management` -> `prompt-compression-cost-control` ->
`count-tokens-before-sending` -> `truncation-strategies` ->
`conversation-summarization` -> `partial-response-handling` ->
`perceived-latency` -> `sse-streaming-chunks` ->
`client-stream-rendering` -> `model-routing-by-complexity` ->
`api-error-fallbacks` -> `exponential-backoff-jitter` ->
`provider-quota-management` -> `queue-request-management` ->
`circuit-breaker-pattern` -> `token-usage-logging` ->
`sha256-response-caching` -> `async-pipelines`.

## 2.6

`no-frontend-api-keys` -> **NEW `no-frontend-api-keys-quiz`** ->
`env-files-secret-manager` -> `backend-proxy-pattern` ->
`redis-per-user-rate-limits` -> `api-key-rotation` -> `logging-monitoring`.

# Theory -> Quiz -> Application Matrix

| Unit | Theory | Immediate Quiz | Calculation/code | Application Quiz or embedded check | Production handoff |
|---|---|---|---|---|---|
| AI landscape | `llm-from-scratch-roadmap` | existing component Quiz | embedded state trace | rewritten scenarios | project requirements |
| LLM system | `llm-system-components` | existing system Quiz | worked architecture decision | rewritten production decisions | language-model objective |
| Language model | `language-modeling-next-token` | existing next-token Quiz | chain-rule trace | same Quiz | AR loop |
| AR inference | `ar-language-model-inference-pipeline` | existing pipeline Quiz | token-state trace | same Quiz | output head |
| Output/loss | `llm-output-head-and-loss` | existing output Quiz | `llm-next-token-loss` | loss Quiz | scale |
| Embedding scope | `text-embeddings-overview` | NEW overview Quiz | later embedding lookup | embedding-input Quiz | tokenization |
| Token units | `tokenization-why-it-matters` | existing token Quiz | regex code | regex Quiz | BPE |
| BPE | `tokenization-bpe-tiktoken` | existing BPE Quiz | embedded merge trace | same Quiz | IDs/vocabulary |
| IDs/special tokens | ID and special-token theories | their existing Quizzes | raw-text/window calculations + dataloader | token-counting Quiz/embedded assertions | embedding input |
| Causal attention | causal theory | moved attention Quiz | score/mask calculation | embedded invariants | MHA |
| Multi-head attention | MHA theory | NEW MHA Quiz | MHA code | embedded causality/error checks | GPT |
| GPT block | GPT theory | moved GPT Quiz | parameter calculation + code | embedded parameter/error checks | pretraining |
| Pretraining | pretraining theory | NEW pretraining Quiz | PPL + training/checkpoint code | benchmark Quiz | evaluation |
| Evaluation breadth | beyond-PPL theory | NEW evaluation Quiz | later 2.2 harness | protocol decisions | generation/eval handoff |
| Generation | decoding theory | moved generation Quiz | sampling calculation + code | embedded EOS/state checks | fine-tuning |
| Fine-tune objectives | objective theory | NEW objective Quiz | classification/instruction branches | branch decisions | task adaptation |
| Classification SFT | classification theory | moved classification Quiz | head calculation + code | device/mask checks | instruction SFT |
| Instruction SFT | instruction theory | moved instruction Quiz | mask calculation + code | EOS/PAD/all-ignore checks | LoRA |
| LoRA | LoRA theory | NEW LoRA Quiz | LoRA code | parameter/gradient/error checks | deployment |
| Scale/resource | `transformer-at-scale` | NEW scale Quiz | context/KV/tokenization | `llm-pretraining` | resource controls |
| Position/attention efficiency | positional and Flash theories | two NEW Quizzes | RoPE/GQA/window/scaling traces | `instruction-tuning` | kernel/quality choice |
| Alignment | RLHF theory | NEW RLHF Quiz | CAI/DPO trace | DPO route Quiz | governance/reward hacking |
| Eval specification | evaluation foundations | NEW foundations Quiz | deterministic metrics | dataset-design route Quiz | versioned eval set |
| Human/judge evaluation | rubric theory | NEW rubric Quiz | agreement/pairwise/judge code | judge-biases route Quiz | calibration/escalation |
| Benchmark/RAG | benchmark theory | NEW benchmark Quiz | factuality calculation | RAG route Quiz | private-set debugging |
| Safety | safety theory | NEW safety Quiz | refusal calibration | toxicity/bias/privacy route Quiz | subgroup/privacy controls |
| Injection | jailbreak/injection theory | NEW injection Quiz | guardrail code | red-team route Quiz | regression suite |
| Regression evaluation | regression theory | NEW regression Quiz | A/B calculation + harness | embedded harness checkpoint | CI/release gate |
| Roles/trust | `system-prompt` | NEW system Quiz | user validation + history budget | role-prompting Quiz | backend authority |
| Shot selection | zero-shot theory | NEW zero-shot Quiz | few-shot selection calculation | one/few-shot Quiz | eval-driven examples |
| Format boundaries | boundary theory | NEW boundary Quiz | schema/example parser | negative-instruction Quiz | validation/injection |
| Verifiable reasoning/tools | structured-output theory | NEW structured-output Quiz | verifier/vote/tool-loop code | tree-of-thought Quiz | bounded authorization |
| Prompt lifecycle | prompt-chaining theory | NEW chaining Quiz | compression/A-B/console artifacts | PromptLayer Quiz | version/security/observability |
| Common API contract | Responses/Chat theory | NEW API Quiz | tool/schema/SSE code + budgets | rate-limit Quiz | provider adapters |
| Anthropic adapter | Messages theory | moved Anthropic Quiz | blocks/budget/vision/tool code | embedded tool application | provider lifecycle |
| Mistral adapter | Mistral theory | moved Mistral Quiz | function-call code | embedded code questions | provider capability |
| Open/local models | Ollama model theory | moved local-model Quiz | manifest + local adapter | embedded adapter checks | hosting |
| Context allocation | context-management theory | moved compression Quiz | token/truncation calculations | embedded summarization checks | provenance/cost |
| Streaming integrity | partial-response theory | moved latency Quiz | SSE adapter + client reducer | embedded reducer checks | cancellation/UX |
| Resilience/routing | routing theory | moved fallback Quiz | retry/quota/queue/breaker/cache/async | embedded async checks | SLO/observability |
| Secret boundary | no-frontend-key theory | NEW security Quiz | proxy code + Redis calculation | final logging Quiz | rotation/incident response |

# Keep, Reorder, Rescope, and Add

## Keep

- Preserve all 177 existing canonical IDs/routes.
- Preserve the current typed-TOC -> React-free catalog -> route/selector ->
  locale-MDX -> registry -> UI ownership chain.
- Preserve all 37 existing Quiz routes. Their display title remains `Quiz`.
- Preserve valid option/question IDs where the question remains semantically
  valid.
- Preserve strong invariants already present: JSON mode is not schema
  adherence; a model tool call is a proposal, not authorization or execution;
  system instructions are not a security boundary; hidden chain-of-thought is
  neither requested nor logged; prompt injection requires defense in depth.

## Reorder existing nodes

- `attention-mechanism-checkpoint-quiz`
- `gpt-block-checkpoint-quiz`
- `training-loop-and-generation-code`
- `generation-strategies-quiz`
- `classification-finetuning-quiz`
- `instruction-data-quality-quiz`
- `evaluation-dataset-design`
- `promptlayer-tracking`
- `anthropic-streaming`
- `mistral-json-mode`
- `peft-finetuning-llama`
- the three complete 2.5 units, in the exact order specified above.

## Reuse existing routes as application Quiz nodes

- `evaluation-dataset-design`
- `llm-judge-biases`
- `rag-evaluation`
- `toxicity-bias-and-privacy`
- `llm-red-teaming`

These conversions are allowed only after the immediately preceding theory is
expanded to teach the concept named by the canonical ID. Their display title
becomes `Quiz`; the canonical ID and route remain stable.

## Rescope without route changes

- Rewrite six structurally noncompliant 1.1 quizzes.
- Rescope shared/grouped quizzes to the immediately preceding theory; retain
  later application questions only when all prerequisites are explicitly
  declared and taught.
- Narrow `tokenization-raw-text-to-token-ids` and
  `loss-perplexity-hand-calculation` from hybrid to calculation.
- Convert the 2.2 calculation/code targets identified in the 177-row audit.
- Replace all generic `parseFixture`/`runFixture` examples with topic-specific
  implementations or remove misleading code fences.
- Make `evaluation-harness-code` a real self-contained harness.
- Separate 2.2 statistical A/B methodology from 2.3 prompt-version rollout.
- Make 2.2 guardrails/red-team content evaluation-focused and 2.3
  prompt-injection content implementation-focused.
- Normalize display titles/scopes while retaining canonical IDs.

## Add exactly 23 Quiz nodes

Tracks 1.1–1.6, six:

1. `text-embeddings-overview-quiz`
2. `multi-head-attention-theory-quiz`
3. `next-token-pretraining-theory-quiz`
4. `evaluation-beyond-perplexity-quiz`
5. `finetuning-objectives-theory-quiz`
6. `lora-finetuning-theory-quiz`

Tracks 2.1–2.3, fifteen:

7. `transformer-at-scale-quiz`
8. `llm-positional-encodings-quiz`
9. `flash-attention-quiz`
10. `rlhf-quiz`
11. `llm-evaluation-foundations-quiz`
12. `human-evaluation-rubrics-quiz`
13. `benchmark-selection-and-contamination-quiz`
14. `llm-safety-foundations-quiz`
15. `jailbreak-and-prompt-injection-quiz`
16. `production-regression-evals-quiz`
17. `system-prompt-quiz`
18. `zero-shot-prompting-quiz`
19. `clear-instruction-format-boundaries-quiz`
20. `structured-output-prompting-quiz`
21. `prompt-chaining-quiz`

Tracks 2.4–2.6, two:

22. `chat-completions-api-quiz`
23. `no-frontend-api-keys-quiz`

# Canonical Count Impact

| Scope | Current | Added | Target |
|---|---:|---:|---:|
| Tracks 1.1–1.6 | 63 | 6 | 69 |
| Tracks 2.1–2.3 | 58 | 15 | 73 |
| Tracks 2.4–2.6 | 56 | 2 | 58 |
| Whole domain | 177 | 23 | 200 |

Target role distribution:

| Target type | Count |
|---|---:|
| theory | 46 |
| quiz | 65 |
| calculation | 36 |
| code | 31 |
| production-pattern | 21 |
| hybrid | 1 |
| Total | 200 |

The denominator migration must be atomic: typed TOC, exact-order/count tests,
authored MDX discovery, registry validation, and documentation move from
177/177 to 200/200 in the same approved implementation.

# Source, Deprecation, and Consistency Risk Audit

Official documentation was checked on 2026-07-23. Provider claims remain
volatile and must carry a checked date in the lesson instead of hard-coding a
model alias, context limit, price, or quota as a timeless common contract.

| Severity | Risk | Required remediation |
|---|---|---|
| critical | OpenAI Assistants sunsets 2026-08-26; the current lesson is prose-only migration advice | Build an operational Responses/File Search resource-lifecycle migration; cite the official migration guide |
| critical | Gemini Interactions stores requests by default; current wording implies storage is opt-in | State the default and require an explicit `store=false`/retention decision |
| high | AR pipeline conflates forward/logits with probabilities | Use `hidden -> logits -> optional softmax/sample`; distinguish training and inference slices |
| high | Instruction theory protects real EOS when EOS=PAD, but code masks every `pad_id` | Make boundary-aware labels/masks and assert the collision case |
| high | Generation does not restore model mode or track rows that already emitted EOS | Preserve prior mode and maintain per-row finished state |
| high | Raw RAG/red-team query, prompt, response, chunks, identity, and tool traces are logged unconditionally in 2.2 | Adopt one redacted, sampled, access-controlled, retention-bound observability contract |
| high | Generic API adapter erases tool calls, refusals, usage, stop reason, and provider fields into `{ok,value}` | Define a discriminated internal result/event union and provider-specific mappings |
| high | Redis “atomic limiter” lesson contains unrelated proxy-validation code | Replace with atomic token-bucket/sliding-window calculation and concurrency invariant |
| major | GPT parameter calculation assumes bias-free projections while code enables default biases | Align implementation and exact parameter totals |
| major | `C` means hidden width in early tracks, context length in generation, and compute in scaling laws | Standardize `d_model`, `T`/`T_max`, and `C_compute`/FLOPs |
| major | “context vector” means both last hidden state and attention-weighted value sum | Use “last hidden state” for the output-head slice |
| major | Provider stream events use `text-delta/tool-delta` in one track and underscore forms in another | Define one internal event union and explicit provider mapping |
| major | Terminal states drift among `completed`, `succeeded`, and `done` | Define internal terminal/error/cancelled states and adapters |
| major | `Retry-After` is presented as a universal provider contract | Treat it as optional/provider-specific; use documented headers and local retry policy |
| major | Mistral “Conversations API” implies a universal endpoint name | Describe Chat Completions under the current Conversations documentation surface |
| major | Mistral function lesson risks saying output includes executed results | Explicitly separate model proposal, application authorization/execution, and returned tool result |
| major | Anthropic thinking-related blocks lack an explicit no-hidden-reasoning storage policy | Carry the course-wide no-request/no-log rule into the provider adapter |
| major | Plain hashing of low-entropy internal user IDs is linkable | Use keyed, scoped pseudonyms/HMAC with rotation and access policy |
| major | Key rotation covers routine overlap but not confirmed compromise | Add rapid revoke, degraded-mode, propagation, and incident branches |
| major | `logging-monitoring` quizzes alerts/SLOs without teaching them | Add monitoring, retention, detection, incident, and escalation prerequisites |
| major | 2.1/2.2/2.3 lack primary references for core papers, metrics, tools, and volatile consoles | Add primary papers/official docs plus checked dates; remove weak universal claims |
| major | `cl100k_base`, `torch.load(weights_only=True)`, and mutable GitHub installs are version-sensitive | Pin versions, document cache/runtime prerequisites, and remove mutable `main` installs |
| major | PPL “good ranges” and trend claims ignore tokenizer/dataset/protocol | Remove universal ranges or bind each number to a reproducible protocol |
| major | Cohere, Together, Replicate, and Gemini claims cite incomplete official surfaces | Cite the exact capability, webhook-verification, hosting, or media documentation |
| medium | 2.1 lacks one running system fixture and 2.2 lacks shared `EvalCase`/`EvalResult` schemas | Reuse a small support-order `A17` case and explicit typed eval schemas |
| medium | Usage names drift among `input/output`, `in/out`, authoritative usage, and billed usage | Standardize normalized usage and separate provider usage from pricing calculation |
| medium | A/B material is duplicated in 2.2 and 2.3 | Keep statistics/release inference in 2.2 and prompt artifact rollout in 2.3 |
| medium | Capitalized “Structured Outputs” can be mistaken for a universal provider term | Use generic “schema-constrained output” unless discussing OpenAI's named capability |

Verified-current claims to preserve with checked dates:

- OpenAI recommends Responses for new projects while Chat Completions remains
  supported; Chat Completions is not deprecated:
  <https://developers.openai.com/api/docs/guides/migrate-to-responses>.
- OpenAI JSON mode guarantees valid JSON while Structured Outputs adds schema
  adherence:
  <https://developers.openai.com/api/docs/guides/structured-outputs>.
- In function calling, the model emits a proposed call and the application
  executes it:
  <https://developers.openai.com/api/docs/guides/function-calling>.
- OpenAI Responses streaming uses SSE:
  <https://developers.openai.com/api/docs/guides/streaming-responses>.
- Gemini Interactions is GA/recommended for new projects while
  `generateContent` remains a supported legacy path:
  <https://ai.google.dev/gemini-api/docs/interactions-overview>.
- Anthropic distinguishes client tools from server tools and documents its
  stream lifecycle:
  <https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview> and
  <https://platform.claude.com/docs/en/build-with-claude/streaming>.
- Mistral's function-calling sequence explicitly assigns execution to the
  developer/application:
  <https://docs.mistral.ai/studio-api/conversations/function-calling>.
- Ollama implements only documented portions of OpenAI compatibility:
  <https://docs.ollama.com/api/openai-compatibility>.
- NVIDIA NIM separates OpenAI-compatible inference endpoints from NIM
  management/readiness endpoints:
  <https://docs.nvidia.com/nim/large-language-models/latest/api-reference.html>.

# Decisions Proposed for Approval

1. Preserve every existing route; add only the 23 listed adjacent-theory Quiz
   routes.
2. Use one typed manifest in test/support code to classify target role,
   immediate theory prerequisite, assessed objectives, and allowed
   prerequisites. Do not create a runtime catalog, route, registry, or practice
   payload in parallel.
3. Require every standalone Quiz to have display title `Quiz`, 4–5
   single-choice questions, one per page, one correct answer, stable IDs,
   misconception-based distractors, and reasoning feedback.
4. Require every theory node to state motivation, input/output, type/shape/state
   transition, hand trace, production pitfall, adjacent-Quiz objectives, and
   next application.
5. Require every code node to be self-contained and deterministic, with imports,
   definitions, output/shape/dtype/invariant/error assertions and relevant
   timeout/cancel/retry/cleanup behavior.
6. Use embedded application questions inside code/calculation nodes where a
   second standalone Quiz would add route count without improving the flow.
7. Keep provider wire contracts provider-specific and map them into one
   explicitly documented internal contract.
8. Record official-source verification dates and avoid volatile model aliases,
   limits, prices, or quotas as timeless facts.

# Phases After Approval

## Phase 0 — Approval and baseline capture

- Change this plan to `approved`, then `executing`, with updated timestamps.
- Capture the current dirty-worktree paths and preserve unrelated requester
  changes.
- Re-run focused catalog/MDX tests and record the 177/177 baseline.

Checkpoint: no content implementation begins unless the 23-route denominator
and reuse/rescope decisions above are explicitly approved.

## Phase 1 — Contract and test harness

- Add the target-role/prerequisite audit manifest to test support.
- Extend validation across all LLM Quiz nodes for title, page count, mode,
  exactly one correct option, stable unique question/option IDs, and non-empty
  reasoning feedback.
- Add exact-order and adjacency tests:
  - every target `theory` is followed by exactly one `quiz`;
  - every Quiz assesses only its immediate theory plus declared prerequisites;
  - no two target theory nodes are adjacent;
  - all 200 canonical routes are unique and resolvable.
- Add checks preventing React imports in core, remote images, and parallel
  registry/practice ownership.

Checkpoint: tests fail for the expected current-state reasons before content is
rewritten.

## Phase 2 — Tracks 1.1–1.6

- Implement six new Quiz routes and the exact reorder.
- Repair 1.1 Quiz contracts.
- Align running examples, shape symbols, output-head/training contracts,
  checkpoint interfaces, EOS/PAD masking, model mode, device state, and error
  paths.
- Run focused tests and `git diff --check`.

## Phase 3 — Tracks 2.1–2.3

- Implement fifteen new Quiz routes.
- Convert the five approved 2.2 routes into application Quizzes only after
  their named concepts move into the preceding theory.
- Build real scale calculators, `EvalCase`/`EvalResult` traces, judge/guardrail/
  harness code, prompt parsers, verifiers, tool state machines, and reproducible
  console artifacts.
- Normalize trust, budget, observability, and hidden-reasoning contracts.
- Run focused tests and `git diff --check`.

## Phase 4 — Tracks 2.4–2.6

- Implement two new Quiz routes and exact provider/integration reorders.
- Replace all generic fixtures with the target calculations, adapters, parsers,
  reducers, state machines, and production patterns in the coverage audit.
- Correct provider storage, status, endpoint, streaming, retry, usage, secret,
  and lifecycle claims.
- Run focused tests and `git diff --check`.

## Phase 5 — Source and consistency pass

- Recheck every provider/model/API/deprecation claim against primary or official
  documentation and stamp `checked 2026-07-23` or the actual execution date.
- Add primary references for foundational research and evaluation metrics.
- Replay shared schemas, examples, terms, symbols, event/state names, budget
  units, and trust boundaries across track seams.
- Verify no example logs sensitive prompt, response, identity, token, tool, or
  credential data unconditionally.

## Phase 6 — Domain verification

After each track:

```text
focused catalog/MDX tests
exact TOC order
theory -> Quiz adjacency
quiz-before-teaching manifest
page/question/option ID checks
one-correct-answer checks
code imports/definitions/assertions/error paths
canonical route checks
remote-image and React-free-core checks
git diff --check
```

At the end:

```bash
npm run verify
```

Then learner-replay all 200 nodes in canonical order and confirm:

- 200/200 published;
- no adjacent theory nodes;
- exactly one recap Quiz immediately after each theory;
- no Quiz asks material introduced later;
- calculation/code is distributed across every track;
- application checks cover outputs, invariants, errors, and production choices;
- terms, shapes, running examples, provider mappings, and trust boundaries are
  consistent.

## Phase 7 — Documentation and execution record

- Update the existing `wiki/concepts/learning-lab.md`; create no competing
  Learning Lab reference page.
- Update this plan's actual counts, deviations, verification evidence, and
  execution log.
- Record final modifications in the repository's existing log surface if the
  implementation touches one.
- Advance this plan to `done` only after verification and learner replay pass.

# Out of Scope

- Changing or deleting existing canonical IDs/routes.
- Introducing a second catalog, registry, practice payload, localization
  metadata source, or route system.
- Adding React to `src/core/learning`.
- Arbitrary MDX components, remote images, or a new renderer where Markdown,
  tables, code, KaTeX, and `LessonNote` suffice.
- Claiming provider examples were executed when they were only statically
  validated.
- Live provider calls, credentials, billing, or production deployment.

# Actual Results

- Preserved all 177 existing canonical routes and added exactly the 23 approved
  adjacent-theory Quiz routes, producing 200/200 published LLM nodes.
- The final authored surface contains 778 pages, 65 Quiz nodes, and 293 Quiz
  questions. Target roles are exactly 46 theory, 65 Quiz, 36 calculation, 31
  code, 21 production-pattern, and one retained hybrid.
- Reordered each track to the approved theory -> immediate Quiz -> calculation
  or code -> application Quiz -> production handoff flow. The exact order,
  role, theory prerequisite, assessed objectives, and allowed prerequisites are
  now executable regression data in `src/lib/learningLlmFlow.test.ts`.
- Strengthened the shared MDX validator so every Quiz requires the display
  title `Quiz`, four or five single-choice questions, one question per page,
  exactly one correct option, stable unique question and option IDs, and
  non-empty reasoning feedback.
- Replaced generic fixtures with topic-specific calculations, parsers,
  adapters, reducers, state machines, evaluation harnesses, guardrails, and
  production examples. Code checks cover imports, definitions, assertions,
  invalid inputs, and the relevant timeout, cancellation, retry, cleanup, or
  authorization path.
- Reconciled cross-track terminology, shapes, EOS/PAD behavior, checkpoint
  loading, hidden-reasoning policy, trust boundaries, sensitive logging, usage
  accounting, provider event/state mappings, and dated official-source claims.
- Kept runtime ownership unchanged: typed TOC -> React-free catalog ->
  selectors/routes -> locale MDX -> authored registry -> lesson UI.

# Verification

All required checks passed on 2026-07-24:

```text
MDX validation:             204/204 authored files
LLM canonical routes:       200/200 unique and resolvable
Focused flow/catalog/MDX:   3/3 test files
TypeScript code fences:     49 executed, 0 failures
Python code fences:         68 parsed, 0 syntax failures
2.2 Python code fences:     10 executed, 0 failures
Source/security scans:      0 prohibited matches
git diff --check:           passed
npm run verify:
  tsc --noEmit              passed
  node --test src/lib/*.test.ts
                            26/26 test files passed
  vite build                passed
```

The automated canonical-order replay confirmed every target theory has exactly
one immediate Quiz, no target theories are adjacent, every Quiz refers only to
declared earlier prerequisites, and all role/count/page/question invariants
match this plan.

# Deviations and Limitations

- The OpenAI documentation connector could not start because the requester's
  personal MCP configuration contains an unsupported `service_tier` value. No
  personal configuration was changed; current OpenAI claims were instead
  checked against official OpenAI documentation through the approved web
  fallback.
- The local Python environment does not provide `torch` or `tiktoken`.
  PyTorch- and tiktoken-dependent 1.x examples therefore received syntax,
  import/definition, invariant, and static contract review, but were not
  represented as locally runtime-executed. The dependency-free 2.2 Python
  examples were executed.
- Quiz pages remain strictly one question per page and four or five pages per
  Quiz. The general authored-page ceiling remains six because two valid 1.1
  theory lessons use six pages.
- Vite emitted its existing non-blocking large-chunk and empty
  `react-vendor` warnings; the production build completed successfully.

# Execution Log

- 2026-07-23 — Read-only whole-domain audit completed against the current
  177/177 worktree; focused baseline tests passed.
- 2026-07-23 — Draft plan stored as the first and only write. Awaiting explicit
  approval; no implementation file changed.
- 2026-07-23 — Requester explicitly approved the 200-node plan and its 23 new
  canonical Quiz routes.
- 2026-07-23 — Added the exact-order/role/prerequisite audit manifest, expanded
  the shared Quiz validator, and updated catalog and authored-content
  regression contracts for the atomic 200-node denominator.
- 2026-07-23 — Remediated tracks 1.1–1.6, added six adjacent-theory Quizzes,
  repaired legacy Quiz contracts, and hardened tokenization, attention, GPT,
  pretraining, generation, fine-tuning, checkpoint, and error-path examples.
- 2026-07-23 — Remediated tracks 2.1–2.3, added fifteen adjacent-theory
  Quizzes, converted the five approved evaluation/safety routes into
  application Quizzes, and replaced generic scale, evaluation, safety, prompt,
  and observability fixtures.
- 2026-07-23 — Remediated tracks 2.4–2.6, added two adjacent-theory Quizzes,
  implemented the approved provider/integration order, and normalized
  provider-specific streaming, tool, usage, retry, lifecycle, and secret
  boundaries against dated official sources.
- 2026-07-24 — Corrected the final Prompt Engineering console/observability
  order and the GPT module code-fence scope found by canonical replay and code
  execution.
- 2026-07-24 — Final MDX, route, Quiz, source/security, TypeScript-fence,
  Python syntax/runtime, and whitespace checks passed. `npm run verify` passed
  typecheck, all 26 Node test files, and the production build.
- 2026-07-24 — Updated the existing Learning Lab reference and repository
  change log; implementation closed at 200 nodes, 778 pages, 65 Quizzes, and
  293 questions.

---

# Review and Compaction (2026-07-24)

After the 200-node implementation closed, a second pass reviewed the branch for
correctness gaps, proven-redundant code/test ownership, scoped authored-content
duplication, and documentation overhead. The review was read-only over all 200
MDX files, 149 fenced blocks, the six 2026-07-23 plan files, and the full
test/validator surface.

## Correctness Findings Fixed

1. **MdxQuiz bypass vectors** — `scripts/learningContentMdx.ts` was deciding
   Quiz identity from a non-empty flattened question list; a `pageCount: 1` Quiz
   with no `MdxQuiz`, an empty `questions={[]}`, or two split components could
   slip through. Fixed to require exactly one `MdxQuiz` with a non-empty `id`,
   non-empty static `questions` array, question count equal to `pageCount`, and
   unique question IDs.
2. **Code-fence evidence** — the "code lesson smoke" check accepted prose
   containing `assert`, `expected output`, or `expected targets` without
   requiring a fenced block or parsing/executing code. Replaced with: fence
   presence required, every Python fence syntax-checked, every deterministic
   TypeScript fence transpiled.
3. **Redundant test snapshots** — removed the 204-entry page-count snapshot and
   65-entry quiz-question-ID snapshot from `learningMdxContent.test.ts`;
   structural invariants (contiguous indexes, six-page cap, remote-image ban)
   remain.
4. **Duplicate catalog-order tests** — two tests in `learningCatalog.test.ts`
   repeated the LLM track order already owned by `learningLlmFlow.test.ts`;
   removed.
5. **Assessed-objective prose** — `QuizAudit` entries stored objective prose
   checked only against their own non-empty strings; simplified to retain the
   pair tuple without self-validating prose.

## Authored-Content Duplication Removed

- `1.6.3-classification-and-instruction-finetune-code.vi.mdx` — replaced
  near-duplicate `collate_instruction` pre-masking copy with a concise
  tensor/state trace.
- `2.3.19-prompt-ab-testing.vi.mdx` — replaced repeated A/B statistical math
  (owned by `2.2.19-evaluation-ab-testing.vi.mdx`) with `evaluateRollout`
  consuming precomputed stats; added immutable variants, stable assignment,
  staged rollout, and rollback implementation.
- `2.2.13-refusal-calibration.vi.mdx` — removed trivial four-line Python fence
  that restated constants; matrix, hand calculation, result, and invariant
  retained.

## Documentation Compacted

Five superseded 2026-07-23 iteration plans (2,482 lines total) were absorbed
into this record and deleted:

| Absorbed file | Durable history |
|---|---|
| `2026-07-23-fill-llm-from-scratch-nodes.md` | Fifteen missing nodes published; Quiz browser-crash fix led to renderable-option validation. |
| `2026-07-23-expand-llm-learning-lab-course.md` | 45-node/209-page milestone, sixteen nodes added, remote-image removal, stronger Quiz/code contracts. |
| `2026-07-23-llm-course-audit-remediation.md` | Valid first-time-reader findings; its proposed 47-node draft was never approved. |
| `2026-07-23-complete-llm-text-data-pipeline.md` | Seventeen-node text-to-tensor sequence, shared `V=6, B=2, T=3, C=3` trace. |
| `2026-07-23-complete-llm-ai-engineering-domain.md` | Ninety-four lessons/298 pages added to reach the preserved 177 baseline, provider modernization, no parallel registry. |

`docs/ARCHITECTURE.md` corrected from 632/26/602 to 696 total / 204 authored
(200 LLM + 4 CV) / 492 placeholders. `README.md` and `wiki/log.md` updated.

## Final Verification (2026-07-24)

- `npm run verify`: typecheck clean, **85/85 tests pass**, production build ✅
- `git diff --check`: no whitespace errors ✅
- Markdown/backlink audit: no dead links to deleted files ✅

