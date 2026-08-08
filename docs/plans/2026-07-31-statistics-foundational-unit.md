---
title: Add Foundational Classical Statistics Lesson to Chapter 2
status: done
created: 2026-07-31T01:21:00+07:00
updated: 2026-07-31T01:31:30+07:00
author: Antigravity
task: "Author a foundational classical statistics introduction lesson (2.0 Classical Statistics Fundamentals) in Chapter 2 of Statistics covering definitions, engineering variability, sampling/data collection, descriptive statistics, visual methods, parameter estimation, and hypothesis testing"
---

# Goal

Add a new foundational classical statistics introduction lesson (`ch02-classical-statistics-fundamentals` / `2.0 Khái niệm Thống kê Cổ điển`) to Chapter 2 (`statistical-learning`) in `src/content/learning/statistics/` right before `2.1 Học thống kê là gì?` (`ch02-what-is-statistical-learning`).

Success means:
- The Statistics curriculum includes explicit coverage of:
  1. **Definition of Statistics & Variability**: Science of data collection, presentation, analysis, and decision-making in the presence of physical/engineering variability.
  2. **Population (Census) vs. Sample & Data Collection**: Generalizing from samples, census constraints, and study types (retrospective studies, observational studies, designed experiments).
  3. **Descriptive Statistics**: Summarizing central tendency (sample mean) and dispersion (sample variance, standard deviation), along with visual tools (dot diagrams, histograms, stem-and-leaf diagrams, box plots, scatter diagrams).
  4. **Statistical Inference**: Parameter estimation (point estimates, confidence intervals such as 95%) and hypothesis testing framework.
- Content is formatted in valid MDX using the standard `MdxPage` structure (4 pages) and shared KaTeX `MdxFormula` components.
- The lesson is integrated into `src/content/learning/statistics/table-of-contents.ts` under Chapter 2 as `2.0 Classical Statistics Fundamentals` / `2.0 Nền tảng Thống kê Cổ điển`.
- All catalog, MDX, TypeScript, and test verifications pass cleanly (`npm run verify`).

# Context Read

- Chapter 2 (`statistical-learning`) currently starts with `2.1 What Is Statistical Learning?` (`ch02-what-is-statistical-learning`).
- Adding `2.0 Classical Statistics Fundamentals` (`ch02-classical-statistics-fundamentals`) establishes classical statistical concepts (sampling, retrospective/observational/experimental design, descriptive summaries, confidence intervals, hypothesis testing) before moving into the ISLR machine learning framework ($Y = f(X) + \epsilon$).
- Authored MDX lessons in Statistics use multi-page `MdxPage` blocks, KaTeX math formulas via `MdxFormula`, and localized titles/descriptions in `table-of-contents.ts`.

# Proposed Structure & Decisions

## Lesson Placement
Add lesson `2.0 Nền tảng Thống kê Cổ điển` / `2.0 Classical Statistics Fundamentals` (`ch02-classical-statistics-fundamentals`) as the entry lesson in Chapter 2 (`statistical-learning`).

## Page Breakdown (4 Pages)
1. **Trang 1: Thống kê là gì & Sự biến động (Variability)**
   - Khái niệm Thống kê: Khoa học về thu thập, trình bày, phân tích và xử lý dữ liệu để giải quyết vấn đề, thiết kế sản phẩm và đưa ra quyết định.
   - Vai trò trong kỹ thuật & hệ thống vật lý: Rút ra kết luận và đưa ra quyết định khách quan trước sự biến động (variability) tự nhiên.
2. **Trang 2: Quần thể (Population), Mẫu (Sample) & Phương pháp thu thập dữ liệu**
   - Quần thể (Population/Census) vs. Mẫu (Sample): Lý do hiếm khi đo lường toàn bộ quần thể (dân số/census) mà phải suy luận từ mẫu.
   - Các phương pháp thu thập dữ liệu: Nghiên cứu hồi cứu (retrospective studies), nghiên cứu quan sát (observational studies), và thực nghiệm được thiết kế (designed experiments).
3. **Trang 3: Thống kê Mô tả (Descriptive Statistics) & Trực quan hóa**
   - Tóm tắt số liệu: Xu hướng trung tâm (trung bình mẫu - sample mean $\bar{x}$) và độ phân tán/biến động (phương sai mẫu $s^2$, độ lệch chuẩn mẫu $s$).
   - Biểu đồ và kỹ thuật trực quan: Biểu đồ chấm (dot diagrams), biểu đồ tần số (histograms), biểu đồ thân-lá (stem-and-leaf diagrams), biểu đồ hộp (box plots), và biểu đồ tán xạ (scatter diagrams).
4. **Trang 4: Suy luận Thống kê (Statistical Inference: Estimation & Hypothesis Testing)**
   - Suy luận thống kê: Rút ra kết luận về quần thể dựa trên thông tin chứa trong mẫu.
   - Ước lượng tham số (Parameter Estimation): Ước lượng điểm (point estimate) và Khoảng tin cậy (confidence intervals, ví dụ 95% confidence).
   - Kiểm định giả thuyết (Hypothesis Testing): Quy trình đưa ra quyết định giữa hai giả thuyết đối lập về tham số quần thể.

# Execution Plan

## Phase 1 - TOC & Catalog Integration
- Update `src/content/learning/statistics/table-of-contents.ts` to insert `ch02-classical-statistics-fundamentals` before `ch02-what-is-statistical-learning` in Chapter 2.
- Add localized English and Vietnamese titles.

## Phase 2 - Authoring MDX Content
- Create `src/content/learning/statistics/2.0-ch02-classical-statistics-fundamentals.vi.mdx`.
- Write the 4 pages of rich instructional content covering the required concepts.
- Format math symbols and equations using KaTeX (`MdxFormula`).

## Phase 3 - Verification & Testing
- Run focused catalog and MDX tests.
- Execute `npm run verify` (TypeScript, unit tests, and production build check).
- Verify zero regression in TOC routing and page counts.

# Out of Scope
- Modifying existing downstream ML/statistical learning lessons (`2.1` to `2.4`, Chapters 3–13).
- Adding complex interactive canvas simulators.
