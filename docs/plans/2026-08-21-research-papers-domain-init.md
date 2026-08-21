---
title: "Research Papers Domain Init & SDC-LoRA Curriculum Structure"
status: done
created: 2026-08-21T10:25:00+07:00
updated: 2026-08-21T10:35:00+07:00
author: Antigravity
task: "Tạo domain mới về Research Papers và khởi tạo cấu trúc chương / node cho bài SDC-LoRA"
supersedes: []
---

# Goal

Khởi tạo Learning Lab domain mới `research-papers` ("Research Papers" / "Paper Nghiên cứu") trên nhánh `feat/research-papers-domain`, tích hợp vào type system, catalog metadata, domain presentation (icon/palette), và định nghĩa cấu trúc chương / node đầu tiên cho paper **SDC-LoRA: Singular-Subspace Drift Controlled LoRA to Mitigate Knowledge Forgetting** (ACL 2026).

# Lineage

Genesis plan — no predecessor (`supersedes: []`).

# Decisions (locked)

1. **Domain ID**: `research-papers` (nhất quán với các domain hiện có như `continual-learning-llm`, `deep-learning`, `llm-ai-engineering`).
2. **Domain Presentation**:
   - Icon: `GraduationCap` từ `lucide-react`.
   - Card Palette: Slate/Indigo (`#C2D1E8`, `#5376A8`) cho Research Papers.
3. **Cấu trúc SDC-LoRA (Chapter 1)**:
   - Track ID: `sdc-lora-paper`
   - Áp dụng pattern bài học chuẩn (Theory + Quiz pair) gồm 6 cặp bài học (12 node):
     1. `sdc-lora-motivation-and-context` / `sdc-lora-motivation-and-context-quiz`: Bối cảnh LoRA & Thách thức Catastrophic Forgetting trong PEFT.
     2. `sdc-lora-singular-subspace-analysis` / `sdc-lora-singular-subspace-analysis-quiz`: Phân rã không gian con kỳ dị ($W_0 = U \Sigma V^T$), Principal Subspace vs Minor Subspace.
     3. `sdc-lora-drift-phenomenon` / `sdc-lora-drift-phenomenon-quiz`: Hiện tượng Singular-Subspace Drift (SD) trong quá trình fine-tuning.
     4. `sdc-lora-mathematical-formulation` / `sdc-lora-mathematical-formulation-quiz`: Cơ chế kiểm soát năng lượng Principal Subspace & Hệ số chuẩn hóa phổ ($\gamma_{sc}$).
     5. `sdc-lora-algorithm-and-implementation` / `sdc-lora-algorithm-and-implementation-quiz`: Thuật toán SDC-LoRA, tính toán SVD offline và độ phức tạp runtime.
     6. `sdc-lora-empirical-results-and-takeaways` / `sdc-lora-empirical-results-and-takeaways-quiz`: Kết quả thực nghiệm (LLaMA-3.1, Qwen2.5, MMLU, GSM8K), so sánh ablation và bài học cốt lõi.

# Phases

## Phase 1 — Type System & Core Catalog Registration
- Cập nhật `src/core/learning/types.ts`: Thêm `'research-papers'` vào `LearningDomainId`.
- Cập nhật `src/components/learning/domainPresentation.ts`: Bổ sung icon và bảng màu card cho `research-papers`.

## Phase 2 — Table of Contents & TOC Index Registration
- Tạo `src/content/learning/research-papers/table-of-contents.ts`: Định nghĩa metadata domain, track `sdc-lora-paper` cùng 6 cặp theory/quiz nodes.
- Cập nhật `src/content/learning/index.ts`: Import và đăng ký `researchPapersToc` vào `learningTableOfContents`.

## Phase 3 — Verification & Documentation
- Chạy `npm run verify` (kiểm tra typecheck TypeScript, test suite và build production).
- Cập nhật `src/lib/learningCatalog.test.ts` và `wiki/concepts/learning-lab.md` để ghi nhận domain thứ 14.

# Out of scope
- Soạn thảo chi tiết toàn bộ nội dung file `.mdx` của từng bài học trong phase init này (sẽ triển khai theo từng bài mdx chuyên sâu tiếp theo).

# Execution log
- 2026-08-21 — Tạo branch `feat/research-papers-domain` và viết genesis plan.
- 2026-08-21 — Khởi tạo domain `research-papers`, định nghĩa 6 cặp theory/quiz cho paper SDC-LoRA (ACL 2026), cấu hình icon/palette, cập nhật test suite và wiki documentation. `npm run verify` pass 100%.
