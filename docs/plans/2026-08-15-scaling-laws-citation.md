---
title: Bổ sung Citation Scaling Laws cho lý do không huấn luyện lại từ đầu
status: done
created: 2026-08-15T18:46:00+07:00
updated: 2026-08-15T18:51:30+07:00
author: Antigravity
task: "Bổ sung citation về Scaling Laws (Kaplan et al., 2020 và Chinchilla - Hoffmann et al., 2022) vào bài học Continual Learning LLM Overview"
supersedes: []
---

# Goal
Bổ sung đầy đủ trích dẫn học thuật có bằng chứng đối soát (`citationEvidence`) cho các khẳng định về chi phí compute, số lượng tham số và khối lượng dữ liệu pre-training (Scaling Laws) trong bài học `1.1.1-continual-learning-llm-overview.vi.mdx` (Trang 1: "Vì sao không huấn luyện lại từ đầu?").

# Lineage
Genesis plan — no predecessor.

# Decisions (locked)
1. **Nguồn trích dẫn chuẩn xác**:
   - `kaplan2020scaling`: *Scaling Laws for Neural Language Models* (Kaplan et al., 2020, arXiv:2001.08361).
   - `hoffmann2022chinchilla`: *Training Compute-Optimal Large Language Models* (Hoffmann et al., 2022, arXiv:2203.15556).
2. **Cơ chế Evidence đối soát**:
   - Đăng ký metadata của 2 paper vào `additionalPapers` trong `src/content/learning/continual-learning-llm/papers.ts`.
   - Bổ sung snippet trích đoạn chính xác (excerpt, searchText, locator, arXiv URL) vào `src/content/learning/continual-learning-llm/citationEvidence.ts`.
   - Cập nhật cấu hình coverage của claim trong `papers.ts`.
3. **Cập nhật nội dung MDX**:
   - Bổ sung thẻ `<Cite>` tại trang 1 của bài `1.1.1-continual-learning-llm-overview.vi.mdx` để chứng minh lý do chi phí compute và token tăng vọt khi pre-training từ đầu.
4. **Kiểm thử & Verification**:
   - Chạy `node scripts/auditContinualLearningCitationEvidence.mjs` đảm bảo cả 2 citation mới đều `verified`.
   - Chạy `npm test` và `npm run verify` để đảm bảo không gãy test hay build.

# Phases
## Phase 1 — Khai báo Paper Metadata & Evidence Snippets
- Cập nhật `src/content/learning/continual-learning-llm/papers.ts`.
- Cập nhật `src/content/learning/continual-learning-llm/citationEvidence.ts`.

## Phase 2 — Cập nhật nội dung bài học MDX
- Chỉnh sửa `src/content/learning/continual-learning-llm/1.1.1-continual-learning-llm-overview.vi.mdx` trang 1.

## Phase 3 — Verification
- Chạy `node scripts/auditContinualLearningCitationEvidence.mjs`.
- Chạy `npm test` / `npm run verify`.

# Out of scope
- Thay đổi cấu trúc các bài học khác.
- Thay đổi logic render component UI.

# Execution log
- 2026-08-15 — Khởi tạo kế hoạch bổ sung Scaling Laws citation.
- 2026-08-15 — Đã bổ sung `kaplan2020scaling` và `hoffmann2022chinchilla` vào `papers.ts`.
- 2026-08-15 — Đã bổ sung 2 evidence snippets và lesson occurrence reviews vào `citationEvidence.ts`.
- 2026-08-15 — Đã cập nhật MDX bài học `1.1.1-continual-learning-llm-overview.vi.mdx` tại trang 1.
- 2026-08-15 — Đã audit thành công toàn bộ 184/184 citations với `auditContinualLearningCitationEvidence.mjs`.
- 2026-08-15 — Đã chạy `npm run verify` (typecheck, 90 tests, vite build) thành công 100%.
