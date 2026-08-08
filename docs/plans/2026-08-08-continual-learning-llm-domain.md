---
title: Add Continual Learning of LLM Domain to Learning Lab
status: done
created: 2026-08-08T10:35:00+07:00
updated: 2026-08-08T13:01:00+07:00
author: Antigravity
task: "Add Continual Learning of LLM domain immediately after the LLM domain in Learning Lab"
supersedes: []
---

# Goal

Add a new Learning Lab domain titled **Continual Learning of LLM** (`continual-learning-llm`) positioned immediately after the existing LLM domain (`llm-ai-engineering`) in the curriculum hierarchy.

# Lineage

Genesis plan — no predecessor.

# Decisions (locked)

1. **Domain ID & Slug**: `continual-learning-llm`.
2. **Placement**: Placed right after `llm-ai-engineering` (and before `mlops-llmops-production-systems`) in `src/content/learning/index.ts`.
3. **Core Types**: Update `LearningDomainId` in `src/core/learning/types.ts` to include `'continual-learning-llm'`.
4. **Presentation**: Add `'continual-learning-llm'` entry in `src/components/learning/domainPresentation.ts` with icon (`Repeat` / `RefreshCw`) and a distinct card color palette.
5. **Content Curriculum**:
   - Create `src/content/learning/continual-learning-llm/table-of-contents.ts`.
   - Structure into structured chapters covering:
     - 1.1 Fundamentals & Catastrophic Forgetting
     - 1.2 Continual Pre-training & Domain Adaptation
     - 1.3 Continual Instruction Tuning & Alignment
     - 1.4 Replay & Memory-Based Methods
     - 1.5 Regularization & Parameter-Efficient Continual Learning (PEFT-CL)
     - 1.6 Evaluation, Benchmarks & Safety in Continual LLMs
6. **Testing & Validation**: Update `src/lib/learningCatalog.test.ts` expected domain/track count assertions and verify via `npm test`.

# Phases

## Phase 1 — Type Definitions & Catalog Content
- Add `'continual-learning-llm'` to `LearningDomainId` in `src/core/learning/types.ts`.
- Create `src/content/learning/continual-learning-llm/table-of-contents.ts`.
- Export and insert the new domain in `src/content/learning/index.ts` right after `llm-ai-engineering`.

## Phase 2 — Presentation & UI Palette
- Add icon and palette styling for `continual-learning-llm` in `src/components/learning/domainPresentation.ts`.

## Phase 3 — Verification & Tests
- Update domain/track/lesson count assertions in `src/lib/learningCatalog.test.ts`.
- Run `npm test` and `npm run verify` to validate typescript compilation and catalog tests.

## Phase 4 — MDX Lesson Authoring (Chapter 1.1)
- Author 5 published MDX lessons for Chapter 1.1 Fundamentals:
  - 1.1.1-continual-learning-llm-overview.vi.mdx
  - 1.1.2-continual-learning-llm-overview-quiz.vi.mdx (6 quiz questions)
  - 1.1.3-catastrophic-forgetting-in-llms.vi.mdx (2 images via LessonImage)
  - 1.1.4-catastrophic-forgetting-in-llms-quiz.vi.mdx (4 quiz questions)
  - 1.1.5-catastrophic-forgetting-code-lab.vi.mdx (7 pages, full Python lab)

## Phase 5 — Image Migration & LessonImage Component
- Add LessonImage MDX component to SHARED_LEARNING_MDX_COMPONENT_NAMES in mdxContract.ts.
- Implement LessonImage with LESSON_IMAGE_ASSETS map in learningMdxComponents.tsx (Vite new URL pattern).
- Migrate 4 PNG images from public/assets/ to src/assets/learning/continual-learning-llm/.
- Update MDX lessons to use LessonImage component instead of Markdown images.

# Out of scope
- Authoring full MDX lesson pages for all lessons in this turn (lessons will be initialized with canonical catalog seeds, matching other partial/active domains).

# Execution log
- 2026-08-08 10:35 — Initial draft created.
- 2026-08-08 10:38 — Added 'continual-learning-llm' to LearningDomainId in src/core/learning/types.ts.
- 2026-08-08 10:38 — Created src/content/learning/continual-learning-llm/table-of-contents.ts with 6 tracks and 24 lessons.
- 2026-08-08 10:38 — Registered domain in src/content/learning/index.ts right after llm-ai-engineering.
- 2026-08-08 10:38 — Added RefreshCw icon & card palette in src/components/learning/domainPresentation.ts.
- 2026-08-08 10:38 — Updated catalog tests in src/lib/learningCatalog.test.ts. Ran npm run verify (pass).
- 2026-08-08 12:00-13:00 — Authored 5 MDX lessons (1.1.1-1.1.5). Lab code lab structured into 7 pages with sample data tables, LessonNote callouts, code block breakdowns, and Base evaluation results page.
- 2026-08-08 13:00 — Added LessonImage component; migrated 4 PNG images to src/assets/learning/continual-learning-llm/; removed public/assets/; deleted untracked .ipynb file.
- 2026-08-08 13:00 — Committed: feat(continual-learning-llm) (17 files, 1023 insertions) + fix(test). All 75 tests pass, build clean.
