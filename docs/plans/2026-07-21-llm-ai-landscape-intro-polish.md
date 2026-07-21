---
title: LLM AI Landscape Intro Polish
status: done
created: 2026-07-21T13:44:25+07:00
updated: 2026-07-21T15:34:35+07:00
author: Codex
task: "Redesign and extend the Vietnamese AI landscape lesson, its scope convention, and its checkpoint quiz."
supersedes:
  - docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md
---

# Goal

Make “Bức tranh tổng quan về AI” easier to scan and explore while giving
readers a practical, non-absolute convention for discussing AI, ML, DL, CV,
NLP, LLM, common data domains, and related job titles.

# Lineage

Continues [Learning Lab Content Architecture and LLM Course](./2026-07-14-approved-llm-lessons-mdx-migration.md).

# Decisions

- Keep the authored Vietnamese explanation and split its ideas clearly beside
  the existing illustration.
- Use a full-width nested scope visual: AI contains ML, ML contains DL, DL
  branches into CV and NLP, and NLP contains the highlighted LLM target.
- Make every scope keyword interactive. Selecting a keyword promotes it into
  the title bar, replaces the nested diagram with explanatory copy, and uses a
  left-arrow affordance to return to the overview.
- Treat the hierarchy as a course communication convention, not an absolute
  taxonomy. Explain that CV and NLP predate modern deep learning and retain
  traditional image-processing, rule-based, and statistical methods.
- Compare ML, CV, and LLM as compact horizontal lanes organized by common
  problems, tools/models, and work skills.
- Use role labels as scope-setting hints rather than rigid boundaries: AI
  Engineer commonly suggests unstructured CV/NLP work, while Data Scientist
  commonly suggests tabular/time-series work, without preventing cross-domain
  practice.
- Keep authored content in locale MDX and domain-specific presentation in the
  existing LLM renderer package and MDX component registry.
- Use full-width lesson prose and a global 16px/28px Learning Lab reading size;
  reserve smaller type for labels, captions, and metadata.

# Execution log

- 2026-07-21 — Reworked the opening copy flow and implemented responsive,
  light/dark nested scope boxes with an amber LLM focal state.
- 2026-07-21 — Removed superseded layout iterations and retained only the final
  renderer/content changes.
- 2026-07-21 — Added click-to-focus AI/ML/DL/CV/NLP/LLM explanations with
  staggered copy reveal, Escape support, disclosure chevrons, and a title-bar
  back affordance.
- 2026-07-21 — Expanded the scope descriptions with data types, representative
  applications, role expectations, and the distinction between traditional ML
  and deep learning.
- 2026-07-21 — Redesigned the second page as compact ML/CV/LLM comparison lanes
  with bullet-based problem, tooling, and skill columns.
- 2026-07-21 — Added a third page explaining the course's domain-plus-method
  convention, including traditional CV and NLP methods and a responsive visual
  equation.
- 2026-07-21 — Expanded the checkpoint quiz to cover the course convention,
  problem-domain selection, and the non-absolute relationship between role
  titles and data domains; removed repeated title, prompt, and feedback copy.
- 2026-07-21 — Removed local prose-width constraints across Learning Lab lesson
  copy and standardized reading paragraphs, list items, and blockquotes at
  16px/28px with Be Vietnam Pro.
- 2026-07-21 — Removed the redundant “Những thành phần chính khi training LLMs”
  heading from the fourth node while preserving its lead and five components.

# Verification

- The original opening-polish checkpoint passed `npm run verify`: TypeScript,
  75 tests, MDX validation, and the 2,610-module production build; the build
  retained its existing large-chunk warning.
- `npm test` passed after the finalized follow-up changes: all 75 tests passed,
  including MDX page-count, component-contract, and quiz-question validation.
- The test fixtures were updated for the three-page AI overview, three-page
  checkpoint quiz, and the new `role-domain-convention` question.
- No production build was run.
