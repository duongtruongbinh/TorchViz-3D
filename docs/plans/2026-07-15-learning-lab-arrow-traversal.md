---
title: Learning Lab arrow-button lesson traversal
status: done
created: 2026-07-15T09:00:00+07:00
updated: 2026-07-15T09:45:00+07:00
author: hienlong
task: "add arrow-button lesson traversal in Learning Lab: on-screen prev/next lesson arrows, Left/Right keyboard navigation, and Enter-to-submit quiz answers"
supersedes:
  - docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md
---

# Goal

Add an explicit arrow-button traversing method to the Learning Lab:

1. **On-screen lesson arrows** — `↑ Previous lesson` / `Next lesson ↓` buttons (up/down icons) in the lesson footer.
2. **Keyboard** — Up/Down arrow keys step between lessons; Left/Right arrow keys traverse section pages within a lesson.
3. **Enter-to-submit** — pressing Enter anywhere in a quiz question submits (checks) the answer.

Success means a user can traverse lessons with arrow buttons and arrow keys without touching the rail, and submit quiz answers with Enter, while the existing section pager and the green complete-and-continue button keep working.

# Lineage

Supersedes [2026-07-14-approved-llm-lessons-mdx-migration](./2026-07-14-approved-llm-lessons-mdx-migration.md), which owns the active Learning Lab runtime contract. This plan adds a UI traversing method on top of that stable runtime; it does not change catalog, routes, MDX, Review, or Workspace handoff.

# Decisions (locked)

- **Footer layout.** `LessonDetail` keeps the existing section pager (`← Back` / step count / `Next →`, or green `Too easy!` on the last section).
- **Lesson arrows are pure traversal.** They navigate to the sibling lesson and do **not** mark the current lesson complete. The green `Too easy!` button remains the only completion action (it marks complete and continues). Both coexist intentionally: arrow = neutral navigation, green = complete + continue.
- **Keyboard scope.** Up/Down arrow keys navigate to the previous/next lesson; Left/Right arrow keys traverse section pages within the current lesson. The lesson handler lives in `LearningLabView`; the section handler lives in `LessonDetail` (where the section page state lives). Both are `window` keydown listeners guarded by a shared `isTypingTarget` helper so they never fire when the focused element is an `INPUT`/`TEXTAREA`/`SELECT`, `contentEditable`, or inside a quiz region (`[data-quiz]`). This keeps typing in the lesson search, quiz options, and drag interactions unaffected.
- **Enter-to-submit.** In `QuizBlock`, each quiz question container gets `data-quiz` and an `onKeyDown` that calls `checkAnswer()` on Enter when the answer `canCheck`. Space (and click) still toggle options; Enter no longer toggles an option button (it submits), matching the requested behavior.
- **Localization.** Add `lessonPreviousLesson` and `lessonNextLesson` (en/vi) to `learningLab`; reuse the existing `check`/`reset` strings for the quiz.
- **Theme.** Reuse `getLearningLabTheme` helpers; add `getLessonArrowButtonClass` styled consistently with the existing `getLessonPagerButtonClass`. No new colors.

# Phases

## Phase 0 — Store this plan
Write `docs/plans/2026-07-15-learning-lab-arrow-traversal.md`. Wait for explicit approval before any source/documentation change.

## Phase 1 — Localization strings
In `src/lib/localization.ts`, add under `learningLab`:
- `lessonPreviousLesson: { en: 'Previous lesson', vi: 'Bài trước' }`
- `lessonNextLesson: { en: 'Next lesson', vi: 'Bài tiếp theo' }`

## Phase 2 — LessonDetail footer + props
In `src/components/learning/lesson/LessonDetail.tsx`:
- Add props `hasPreviousLesson?: boolean` and `onSelectPreviousLesson?: () => void` (keep existing `hasNextLesson` / `onSelectNextLesson`).
- Render the footer when `sectionPages.length > 1 || hasPreviousLesson || hasNextLesson`.
- Add a lesson-arrow row (`← Previous lesson` / `Next lesson →`, icon always, label shown `sm:` and up, tooltips/aria via the new strings) when `hasPreviousLesson || hasNextLesson`.
- Keep the existing section pager row, shown when `sectionPages.length > 1`, separated by a top divider.
- Add `getLessonArrowButtonClass(themeClasses, isEnabled)` (icon + label) reusing the pager styling language.

## Phase 3 — LearningLabView wiring + keyboard
In `src/components/learning/LearningLabView.tsx`:
- Compute `previousLesson` from `domainLessons[detailLessonIndex - 1]` (mirror `nextLesson`).
- Pass `hasPreviousLesson={Boolean(previousLesson)}` and `onSelectPreviousLesson={() => previousLesson && selectLesson(previousLesson.id)}` into `LessonDetail`.
- Add a `useEffect` keydown handler (window) for `ArrowLeft`/`ArrowRight` that, guarded by `isTypingTarget(event.target)`, calls `selectLesson(previousLesson.id)` / `selectLesson(nextLesson.id)` and `preventDefault()`. Clean up on unmount and re-bind on dependency change.
- Add a module helper `isTypingTarget(target)` returning true for input/textarea/select/contentEditable/quiz-region.

## Phase 4 — QuizBlock Enter-to-submit
In `src/components/learning/lesson/QuizBlock.tsx`:
- Add `data-quiz` to the `QuizQuestion` root container.
- Add `onKeyDown` to that container: on `Enter` and `canCheck`, `event.preventDefault()` + `checkAnswer()`.

## Phase 5 — Verify
- `npm run verify` (typecheck + tests + build).
- Manual smoke on `npm run dev`: open a domain, use the new arrow buttons, Left/Right keys (confirm typing in the lesson search and quiz options is unaffected), and Enter to submit a quiz answer.

## Phase 6 — Docs
- Append an execution-log entry to this plan.
- Add a short note to `wiki/concepts/learning-lab.md` (UI Conventions) describing the arrow-button lesson traversal so the active surface stays documented. No new doc page.

# Out of scope

- Route or alias changes.
- Catalog, TOC, MDX, search, Review, or Workspace handoff changes.
- Touch/swipe gestures.
- Removing the green complete-and-continue button or the section pager.
- Any change under `src/core/learning/`.

# Execution log
- 2026-07-15 — Plan created after reading workflow, Learning Lab wiki, the 2026-07-14 migration plan, and the LessonDetail/LessonRail/LearningLabView/QuizBlock/theme/localization sources.
- 2026-07-15 — Plan approved by requester; execution started (Phase 1).
- 2026-07-15 — Phases 1-4 implemented: added `lessonPreviousLesson`/`lessonNextLesson` localization strings; added a `← Previous lesson` / `Next lesson →` arrow row to the `LessonDetail` footer, separated by a divider from the existing section pager; computed `previousLesson` and wired keyboard Left/Right lesson navigation (guarded by `isTypingTarget`) in `LearningLabView`; added Enter-to-submit in `QuizBlock` via `data-quiz` + `onKeyDown`.
- 2026-07-15 — `npm run verify` passed: typecheck clean, all Node tests passed, production build succeeded (2499 modules).
- 2026-07-15 — Updated `wiki/concepts/learning-lab.md` UI Conventions with the arrow-button lesson traversal note.
- 2026-07-15 — **Revision (requester):** swapped the arrow mapping. Lesson arrows now use up/down icons (`↑ Previous lesson` / `Next lesson ↓`); Up/Down keys navigate lessons (in `LearningLabView`) and Left/Right keys traverse section pages (in `LessonDetail`). Moved the shared `isTypingTarget` guard into `theme.ts` so both handlers reuse it. `npm run verify` passed again.
- 2026-07-15 — Updated `wiki/concepts/learning-lab.md` note to reflect Up/Down lessons / Left/Right pages.
- 2026-07-15 — **Final revision (requester):** removed the on-screen `↑ Previous lesson` / `Next lesson ↓` arrow buttons and reverted the `LessonDetail` footer to the original (section pager + green `Too easy!`). Kept the keyboard arrow feature (Up/Down = lessons in `LearningLabView`, Left/Right = section pages in `LessonDetail`) and Enter-to-submit. Removed the now-unused `lessonPreviousLesson`/`lessonNextLesson` strings and `getLessonArrowButtonClass`. `npm run verify` passed.
- 2026-07-15 — After Enter submits a quiz answer, focus returns to the lesson panel (`<article>`, made programmatically focusable) so Up/Down/Left/Right arrow-key navigation resumes instead of being trapped inside the quiz. `npm run verify` passed.
- 2026-07-15 — Added article-level `onKeyDown` handler so pressing Enter on the lesson panel (when on the last section with a next lesson) triggers `onSelectNextLesson` (same as clicking `Too easy!`). `npm run verify` passed.
- 2026-07-15 — Lesson panel auto-focuses when `lesson.id` changes (clicking a lesson in the rail, keyboard navigation, completing lesson). All keyboard actions work immediately. `npm run verify` passed.
