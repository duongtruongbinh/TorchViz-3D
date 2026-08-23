---
title: "Research Papers Domain & SDC-LoRA Paper Review"
status: done
created: 2026-08-21T10:25:00+07:00
updated: 2026-08-23T21:15:00+07:00
author: nmkhiem
task: "Khởi tạo domain Research Papers, tích hợp bài review chuyên sâu paper SDC-LoRA (ACL 2026) cùng Flowchart/Mermaid components"
supersedes: []
---

# Goal

Khởi tạo Learning Lab domain `research-papers` ("Random Research Paper") và hoàn thiện module đánh giá chuyên sâu bài báo **SDC-LoRA: Singular-Subspace Drift Controlled LoRA to Mitigate Knowledge Forgetting** (ACL 2026), bao gồm lý thuyết toán học phân rã SVD, kết quả thực nghiệm, phân tích cơ chế chuyên sâu, tranh luận học thuật, và bài trắc nghiệm 10 câu hỏi.

# Key Deliverables

1. **Domain & Catalog Registration:**
   - Đăng ký `research-papers` vào `LearningDomainId`, palette Slate/Indigo (`#C2D1E8`, `#5376A8`), icon `GraduationCap`.
   - Cập nhật TOC và catalog test suite (`learningCatalog.test.ts`).

2. **SDC-LoRA Curriculum (5 nodes):**
   - `sdc-lora`: Bối cảnh LoRA, hiện tượng trôi dạt không gian con kỳ dị (Singular-Subspace Drift) và cơ chế Spectral Calibration ($\gamma_{\text{sc}}$).
   - `sdc-lora-experiments`: Kết quả thực nghiệm (LLaMA-3.1, Qwen2.5, GSM8K, MMLU), đường cong loss và phân tích phá vỡ trade-off learning rate.
   - `sdc-lora-insights`: Phân tích chuyên sâu gradient tự do gây trôi dạt góc $\theta_U, \theta_V$ và quy luật dâng cao năng lượng tương phản ($R_t$).
   - `sdc-lora-debate`: Tranh luận học thuật (SVD offline cost, scaling law, tương thích quantization/DoRA/QLoRA) và giới hạn nghiên cứu.
   - `sdc-lora-quiz`: 10 câu hỏi trắc nghiệm đánh giá kiến thức lý thuyết & thực nghiệm.

3. **Visual & Runtime Components:**
   - Bổ sung component `MermaidDiagram` hỗ trợ công thức KaTeX trong node đồ thị.
   - Bổ sung component `Flowchart` hỗ trợ lưu đồ quy trình từng bước.
   - Hỗ trợ `TemplateLiteral` trong MDX static analyzer (`learningContentMdx.ts`).

# Verification

- `npm run verify` (typecheck, 152 tests, production build) pass 100%.
