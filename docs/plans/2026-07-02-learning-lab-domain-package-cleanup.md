---
title: Learning Lab Domain Package Cleanup
status: done
created: 2026-07-02T05:57:43+07:00
updated: 2026-07-02T05:57:43+07:00
author: Codex
task: "Remove premature Learning Lab domain-package abstractions without changing current visible Learning Lab behavior."
supersedes:
  - docs/plans/2026-07-02-learning-lab-domain-package-refactor.md
---

# Goal

Keep the approved LLM roadmap content and current visible Learning Lab output,
while deleting or simplifying branch-introduced abstractions that do not buy
current extensibility.

# Lineage

Supersedes
[2026-07-02-learning-lab-domain-package-refactor](./2026-07-02-learning-lab-domain-package-refactor.md)
for the first domain-package initialization pass.

# Decisions

- Preserve current visible output for the approved `llm-from-scratch-roadmap`
  lesson.
- Keep Learning Lab light-theme-only.
- Keep the approved LLM roadmap content.
- Prefer deletion and direct rendering over registries until multiple domains or
  keyed custom renderers exist.
- Keep runtime assets under `src/assets/learning/...`, but make ids
  lesson-scoped enough for future domains.
- Tighten docs so they describe current approval-gated runtime support.

# Phases

1. Store this approved plan.
2. Remove unapproved lesson extras and the renderer/dependency support that only
   served those invisible extras.
3. Replace the single-entry custom renderer registry with direct handling for
   the currently visible custom LLM extras.
4. Simplify lesson approval gating to a local approved-id set/string until
   lesson approval metadata is used by UI or selectors.
5. Scope asset ids and simplify unused helper props/wrappers.
6. Update existing wiki/plan docs to reflect the lighter current behavior.
7. Run narrow verification.

# Out Of Scope

- No behavior changes.
- No route changes.
- No visual redesign.
- No dark-theme work.
- No changes to the approved LLM roadmap content.

# Execution Log

- 2026-07-02T05:57:43+07:00 - Plan stored from the approved cleanup review.
- 2026-07-02T05:57:43+07:00 - Trimmed LLM extras to the approved
  `llm-from-scratch-roadmap` payload, simplified approval gating to a local id
  set, and removed unused lesson approval metadata from shared learning types.
- 2026-07-02T05:57:43+07:00 - Removed the custom extra renderer registry,
  dormant diagram/formula/exercise/code-contract renderers, KaTeX dependencies,
  the compatibility `LessonExtras` wrapper, and the hidden `ExtraFrame` icon
  prop.
- 2026-07-02T05:57:43+07:00 - Scoped the two LLM roadmap asset ids and updated
  the Learning Lab wiki to describe current approval-gated runtime support.
- 2026-07-02T05:57:43+07:00 - Ran `npm run verify`; typecheck, 78 tests, and
  production build passed.
