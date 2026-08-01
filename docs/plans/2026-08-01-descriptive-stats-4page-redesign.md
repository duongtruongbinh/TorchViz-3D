---
title: Bài 3.1 Descriptive Statistics và Quiz ôn tập
status: done
created: 2026-08-01T00:05:00+07:00
updated: 2026-08-01T14:20:00+07:00
author: nmkhiem
task: "Hoàn thiện bài 3.1 về Mean, Median, Mode, histogram và một Quiz tính tay/đọc code"
supersedes: []
---

# Goal

Xây dựng bài 3.1 theo luồng học từ tính tay sang Python, trực quan hóa quan hệ Mean–Median–Mode và thêm một node Quiz ngắn để learner đọc code, kiểm tra output, nhận xét histogram và suy luận theo ngưỡng giả định.

# Lineage

Genesis plan — no predecessor. Các follow-up trong cùng phiên được compact vào tài liệu này để nhánh chỉ có một plan canonical.

# Final scope

## Bài 3.1 — 6 trang

1. Giới thiệu và dataset ví dụ.
2. Mean: tính tay, Python và ảnh hưởng của outlier.
3. Median: sắp xếp, tính tay và Python.
4. Mode: đếm tần số, tính tay và Python.
5. Histogram của dataset với ba mốc `Mode = 12`, `Median = 16.5`, `Mean = 18`; kèm nhận xét lệch phải và biểu đồ phân phối chuẩn lý tưởng có `Mean = Median = Mode` tại tâm.
6. Bảng tổng kết so sánh độ nhạy outlier và trường hợp sử dụng của Mean, Median, Mode.

## Quiz — 8 trang

1. Tính Mean bằng tay.
2. Tìm Median và Mode.
3. Nhận xét ảnh hưởng của outlier.
4. Chọn lệnh in năm dòng đầu của Wine DataFrame.
5. Chạy code và chọn đúng output Mean, Median, Mode.
6. Tìm lệnh pandas tạo bảng thống kê mô tả từ comment tìm kiếm.
7. Vẽ histogram và chọn nhận xét đúng về `Mode < Median < Mean`.
8. Với giả định nội bộ `malic_acid ≤ 3.0` là an toàn, chọn tất cả suy luận đúng từ Median, Mean và Max. Đây là giả định của bài tập, không phải tiêu chuẩn ngành.

# Decisions

- Giữ layout hai cột tính tay/code của bốn trang nền tảng và các component MDX dùng chung đã có.
- Dùng visual code-native trong adapter Statistics cho histogram và đường cong chuẩn; không thêm asset hay thư viện biểu đồ.
- Thêm node `descriptive-data-analysis-quiz` ngay sau bài 3.1 trong typed TOC; giữ route/content theo kiến trúc Learning Lab canonical.
- Quiz dùng `sklearn.datasets.load_wine(as_frame=True).frame`, phân tích Series `malic_acid` với 178 quan sát: Mean `2.336348`, Median `1.865`, Mode `1.73`.
- Mở rộng `AuthoredQuizPreview` bằng `codeBlock` và cho phép preview code-only; renderer tái sử dụng shared `CodeBlock` để đồng nhất syntax highlighting, Copy và typography với phần lý thuyết.
- Không đưa sẵn lời giải ở câu `head()` hoặc `describe()`; code block chỉ chuẩn bị dataset hoặc cung cấp từ khóa tìm kiếm.
- Bỏ badge, bảng hoặc lệnh `print()` khi chúng lặp lại thông tin ngay trong cùng trang.
- Câu histogram chỉ kiểm tra nhận xét; câu cuối là multi-select kiểm tra ý nghĩa riêng của Median, Mean và Max dưới một ngưỡng giả định rõ ràng.

# Implementation summary

- Thêm `DescriptiveCenterHistogramVisual` và `IdealNormalCenterVisual` vào `src/components/learning/domains/statistics/mdxComponents.tsx`.
- Mở rộng bài `3.1-descriptive-data-analysis.vi.mdx` từ 4 lên 6 trang.
- Thêm `3.1.1-descriptive-data-analysis-quiz.vi.mdx` và catalog node tương ứng.
- Cập nhật `AuthoredQuizPreview`, `QuizPreview`, catalog/content invariants và wiki counts.
- Trước addendum Chương 2: toàn catalog có 720 nodes; Statistics có 118 nodes, 104 published Vietnamese lessons và 357 ordered pages.

# Sync and cleanup

- Loại bỏ code lặp cuối cùng ở câu histogram: badge Series và ba lệnh `print()` đã có dữ liệu tương ứng trong bảng.
- Stash toàn bộ tracked/untracked changes, fetch `origin`, xác nhận `feat/add-statistics-domain` bằng upstream (`0 ahead / 0 behind`), rồi áp lại stash thành công.
- Không phát sinh conflict, unmerged path hoặc conflict marker; stash đã được drop sau khi áp thành công.

# Verification

- `git diff --check` pass.
- `npm run verify` pass: typecheck, 77/77 tests và production build thành công.
- Build chỉ còn cảnh báo chunk-size hiện hữu.

# Execution log

- 2026-08-01 — Plan gốc được phê duyệt; hoàn thành redesign bốn trang với layout tính tay/code.
- 2026-08-01 — Mở rộng thành sáu trang, thêm histogram, biểu đồ phân phối chuẩn lý tưởng và bảng tổng kết riêng.
- 2026-08-01 — Thêm node Quiz Wine dataset, shared code-block preview và tám nhiệm vụ theo luồng tính tay → đọc code → trực quan hóa → insight.
- 2026-08-01 — Thực hiện các vòng polish theo phản hồi: bỏ nội dung lặp, không tiết lộ đáp án, rút gọn prompt và chuyển câu cuối sang multi-select theo ngưỡng giả định.
- 2026-08-01 — Đồng bộ catalog tests/wiki counts và xác minh toàn bộ suite.
- 2026-08-01 — Compact toàn bộ follow-up vào một plan canonical duy nhất trước khi commit.

# Chapter 2 addendum — Một số phê phán về thống kê

## Goal and final decisions

- Thêm node published `statistics-criticism` sau Quiz bài 2.1, gồm ba trang theo thứ tự: điều kiện áp dụng; sai lầm khó nhận ra; đọc thống kê có trách nhiệm.
- Trang 1 giữ prose sát tài liệu tham khảo và dùng ví dụ Linear Regression dự đoán giá nhà để minh họa bốn giả thiết A–D cùng các hướng xử lý khi vi phạm.
- Trang 2 tập trung vào câu nói về “ba kiểu nói dối” và khẳng định trực tiếp nguy cơ số liệu bị lựa chọn, trình bày, diễn giải để dẫn dắt kết luận; không giữ phần p-value riêng.
- Trang 3 dùng hình WebP cắt trục được cung cấp, ghi nguồn, giới thiệu *How to Lie with Statistics* và checklist năm bước không dùng card/border lặp.
- Các visual mới đi qua `ProbabilityChapterVisual`, responsive và hỗ trợ light/dark mode; không thêm route đặc biệt, dependency hoặc Quiz.
- Đồng bộ catalog/content invariants và wiki: toàn catalog 721 nodes/171 authored files; Statistics có 119 nodes, 105 published lessons và 362 ordered pages sau khi merge upstream; missing-node count giữ nguyên.

## Addendum execution log

- 2026-08-01 — Thêm lesson, TOC node, asset cục bộ, asset map và ba visual Statistics; polish wording/hierarchy theo review và giữ một plan canonical duy nhất.
- 2026-08-01 — Cập nhật catalog/MDX tests và Learning Lab wiki theo counts cuối.
- 2026-08-01 — `git diff --check` và dead-code audit pass; `npm run verify` pass với typecheck, 77/77 tests và production build.
