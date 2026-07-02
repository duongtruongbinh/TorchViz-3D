---
title: Learning Lab Scrollbar and Search UI Cleanup
status: done
created: 2026-07-02T12:00:00+07:00
updated: 2026-07-02T21:14:20+07:00
author: GitHub Copilot
task: "Create a plan for unifying Learning Lab scrollbar style, removing the Learning Lab search UI, and updating branch/git state"
supersedes: []
---

# Goal

Document the requested Learning Lab UI cleanup work in a workflow-compliant plan, including the requested scrollbar unification and search bar removal.

# Lineage
Genesis plan — no predecessor.

# Decisions (locked)

- Keep `custom-scrollbar` as the shared scrollbar style and preserve `learning-lab-scrollbar` where JS lookups depend on it.
- Remove the disabled Learning Lab header search bar from `src/components/learning/LearningLabHeader.tsx`.
- Apply the shared gray scrollbar style to the Learning Lab sidebar nav and lesson content viewport.
- Use `feat/` branch-prefixed workflow with a commit capturing the UI changes.

# Phases

## Phase 0 — Store this plan

- Create this plan file in `docs/plans/` with draft status.

## Phase 1 — Confirm scope and existing artifacts

- Verify which Learning Lab scrollbar classes and components are in use.
- Ensure no runtime scripts break when consolidating scrollbar classes.

## Phase 2 — Execute UI cleanup

- Remove the placeholder search UI from `src/components/learning/LearningLabHeader.tsx`.
- Update `src/index.css` to unify scrollbar styling with the existing gray theme.
- Apply `custom-scrollbar` to the sidebar nav in `src/components/learning/LearningLabView.tsx`.
- Keep `learning-lab-scrollbar` where `closest('.learning-lab-scrollbar')` is required.

## Phase 3 — Git housekeeping

- Rename the branch to the `feat/` prefix format.
- Stage and commit the relevant files with an appropriate message.

# Out of scope

- Any Learning Lab feature redesign beyond scrollbar/style cleanup.
- Changes to the underlying learning content structure.
- Introducing new scrollbar themes or platform-specific scrollbar behavior.

# Follow-up branch cleanup addendum — approved

## Goal

Review the current branch diff around Learning Lab and make the smallest useful
cleanup pass: reduce duplicated code, remove avoidable hardcoded UI text, and
keep the existing lesson/quiz/rail behavior intact.

## Observed context

- The branch's Learning Lab diff is concentrated in `LearningLabView`,
  `LessonRail`, `LessonDetail`, `LessonExtraRenderer`, the LLM domain renderer,
  theme classes, content, and scrollbar CSS.
- `LessonExtraRenderer` and the LLM domain renderer duplicate the same
  `scrollLearningLabElementIntoView` helper.
- `LearningLabView` and `LessonRail` duplicate the lesson rail toggle button
  class helper.
- The desktop and mobile `LessonRail` instances in `LearningLabView` repeat
  nearly the same props.
- Some new Learning Lab controls still use inline language checks or hardcoded
  English labels even though `learningLab` localization already owns adjacent
  labels.

## Decisions for this cleanup

- Do not split large lesson/extras renderers just for file-size aesthetics; only
  extract code when it removes real duplication or centralizes a shared behavior.
- Keep the current one-domain custom renderer approach; do not add a registry
  abstraction until multiple domains need it.
- Preserve all lesson content, quiz state rules, rail completion behavior, route
  behavior, and scrollbar lookup behavior.
- Prefer moving small shared helpers into existing Learning Lab utility/theme
  surfaces over creating new abstractions.

## Follow-up phases

### Phase 4 — Focused baseline

- Inspect the branch diff against `main` and current Learning Lab docs.
- Run the narrowest useful baseline checks before source edits if behavior is
  touched.

### Phase 5 — Small cleanup pass

- Share the Learning Lab scroll-into-view helper between quiz and domain
  interaction renderers.
- Share the lesson rail toggle button class instead of duplicating it in
  `LearningLabView` and `LessonRail`.
- Reduce repeated `LessonRail` prop wiring in `LearningLabView` without hiding
  the desktop/mobile layout differences.
- Move the newly hardcoded Learning Lab UI labels into localization where that
  keeps behavior equivalent.

### Phase 6 — Verify and record

- Run `npm run verify`.
- Update this plan's execution log with the exact files changed and any
  verification result.

## Additional out of scope

- Rewriting `LessonDetail` pagination architecture.
- Splitting `LessonExtraRenderer` into many files unless a concrete duplication
  or testability issue requires it.
- Changing lesson copy, quiz answers, visual design direction, routing, or store
  behavior.

# Execution log

- 2026-07-02T12:00:00+07:00 — Plan created.
- 2026-07-02T20:32:18+07:00 — Added pending follow-up scope for branch-focused
  Learning Lab cleanup.
- 2026-07-02T21:09:55+07:00 — User approved the follow-up cleanup scope;
  execution started.
- 2026-07-02T21:14:20+07:00 — Completed the branch-focused Learning Lab
  cleanup: shared the feedback scroll helper via
  `src/components/learning/lesson/scrolling.ts`, moved lesson rail toggle
  styling into `theme.ts`, reused shared `LessonRail` props in
  `LearningLabView`, moved new Learning Lab labels into localization, and added
  source-level regression guards in `src/lib/componentWiring.test.ts`.
  Verification: `npm run verify` passed.
