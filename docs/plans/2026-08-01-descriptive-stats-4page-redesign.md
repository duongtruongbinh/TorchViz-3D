---
title: Redesign bài 3.1 Descriptive Stats — 4 trang 2 cột
status: done
created: 2026-08-01T00:05:00+07:00
updated: 2026-08-01T00:41:00+07:00
author: nmkhiem
task: "Redesign 3.1-descriptive-data-analysis.vi.mdx thành 4 trang: (1) giới thiệu + dataset, (2) trung bình, (3) trung vị, (4) mode — mỗi trang chia 2 cột: tính tay | chạy code"
supersedes: []
---

# Goal

Redesign bài học `3.1-descriptive-data-analysis.vi.mdx` thành 4 trang với layout 2 cột song song (tính tay | chạy code) để học viên có thể đối chiếu trực quan giữa phương pháp thủ công và lập trình.

Cấu trúc 4 trang:
- **Trang 1** — Giới thiệu nội dung + bộ dữ liệu ví dụ (dataset)
- **Trang 2** — Trung bình (Mean): tính tay bên trái, code Python + Terminal Output bên phải + phân tích Outliers
- **Trang 3** — Trung vị (Median): tính tay bên trái, code Python + Terminal Output bên phải
- **Trang 4** — Yếu vị (Mode): tính tay bên trái, code Python + Terminal Output bên phải + bảng so sánh tổng kết

# Lineage
Genesis plan — no predecessor.

# Decisions (locked)

1. **`MdxColumns` & `MdxTable` Components** — Thêm reusable components cho 2 cột và bảng full-width với style băng xanh `#EAF1F7`.
2. **Dedicated Terminal Output Blocks** — Mở rộng `MdxPre` để hỗ trợ khối ` ```output ` hiển thị giao diện Terminal chuyên dụng.
3. **Container Whitelisting (`div`)** — Đăng ký `div` vào MDX contract để cho phép bọc cụm khối bên trong các cột mà không bị cắt xén hay giới hạn phần tử.
4. **Bố cục 2 cột phẳng & Tối giản** — Cột trái là thẻ thông tin với viền nhã nhặn, cột phải chứa trực tiếp khối Code Python và Terminal Output mà không cần bọc ô tiêu đề ngoài dư thừa.
5. **Định dạng LaTeX chống tràn** — Sử dụng môi trường `aligned` cho các công thức dài ($\sum x_i$ và $X_{\text{sorted}}$) cùng tính năng `max-w-full overflow-x-auto` trong `BlockMath`.
6. **`pageCount` tăng lên 4** — Cập nhật metadata và test suite.

# Phases

## Phase 0 — Store this plan ✓
Tạo file plan này.

## Phase 1 — Cập nhật `learningMdxComponents.tsx` & `mdxContract.ts` ✓
Thêm `'descriptive-data-analysis'` vào `REDESIGNED_PROBABILITY_LESSON_IDS`. Tạo và đăng ký `MdxColumns`, `MdxTable`, và `div` vào MDX contract.

## Phase 2 — Viết lại MDX 4 trang ✓
Viết lại hoàn toàn `3.1-descriptive-data-analysis.vi.mdx` với 4 trang, 2 cột tính tay/chạy code, bảng full-width và terminal output.

## Phase 3 — Verify ✓
Chạy `npm run verify` và `npm test` (77/77 tests pass).

# Execution log
- 2026-08-01 — Plan created and approved.
- 2026-08-01 — Phase 1 done: `descriptive-data-analysis` added to `REDESIGNED_PROBABILITY_LESSON_IDS` in `learningMdxComponents.tsx`.
- 2026-08-01 — Phase 2 done: MDX rewritten as 4 pages with `MdxColumns` component (tay | code).
- 2026-08-01 — `MdxColumns` and `MdxTable` components created in `learningMdxComponents.tsx` and registered in shared contract `mdxContract.ts`.
- 2026-08-01 — `MdxTable` styling updated to `!table w-full min-w-full` for full width display.
- 2026-08-01 — `MdxPre` updated to render dedicated `output` terminal code blocks.
- 2026-08-01 — Registered `div` component in MDX contract to allow full column element grouping.
- 2026-08-01 — Formatted long LaTeX equations into multi-line `aligned` blocks to prevent overflow.
- 2026-08-01 — Simplified `MdxColumns` to render clean 2-column cards without redundant outer header wrappers.
- 2026-08-01 — Phase 3: `npm run verify` executed. 77/77 unit tests passed cleanly.
