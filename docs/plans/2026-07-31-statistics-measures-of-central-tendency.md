---
title: Measures of Central Tendency in Descriptive Data Analysis
status: done
created: 2026-07-31T23:50:00+07:00
updated: 2026-07-31T23:54:00+07:00
author: nmkhiem
task: "Add Measures of Central Tendency lesson under 3.1"
---

# Plan - Measures of Central Tendency in Descriptive Data Analysis

We will add a new lesson for 3.1: **Phân tích dữ liệu mô tả** (`descriptive-data-analysis`) covering **Các thước đo trung tâm** (Measures of Central Tendency).

## User Review Required

> [!IMPORTANT]
> The new lesson will contain 2 pages written in Vietnamese, introducing measures of central tendency (mean, median, mode) using a concrete dataset (e.g., model inference latencies). It will feature step-by-step manual calculations and programmatic examples using numpy and pandas.

## Open Questions

None. The requirements are clear and align with the existing classical statistics module format.

## Proposed Changes

### Statistics Content

#### [MODIFY] [table-of-contents.ts](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/table-of-contents.ts)
- Change `contentStatus` of `descriptive-data-analysis` from `'missing'` to `'published'`.

#### [NEW] [3.1-descriptive-data-analysis.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/3.1-descriptive-data-analysis.vi.mdx)
- Create the MDX content file containing:
  - **Page 0**: Concept introduction, a sample dataset of 10 model inference latencies (in milliseconds), questions, and step-by-step hand calculation of Mean, Median, and Mode.
  - **Page 1**: Code implementations using numpy and pandas to calculate these metrics, followed by a comparison table highlighting when to use which metric (robustness to outliers).

## Verification Plan

### Automated Tests
- Run `npm run verify` to check type safety, compile MDX content, and execute unit tests.

## Execution Log
- 2026-07-31 — Plan created and auto-approved. Created the lesson `3.1-descriptive-data-analysis.vi.mdx`, modified `table-of-contents.ts`, updated test cases, and ran full verification successfully.

