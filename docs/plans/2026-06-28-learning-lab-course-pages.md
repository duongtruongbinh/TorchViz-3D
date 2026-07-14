---
title: Learning Lab Course Pages
status: done
created: 2026-06-28T11:00:22+07:00
updated: 2026-06-28T13:10:00+07:00
author: Codex
task: "consolidated course-style Learning Lab domain landing pages"
---

# Summary

Learning Lab domain landing pages now share one course-style layout instead of
using separate RL-only plans and generic track-list pages.

Routes covered:

- `/#/learning/fundamentals`
- `/#/learning/cv`
- `/#/learning/nlp`
- `/#/learning/reinforcement-learning`
- `/#/learning/robot-learning`

# Final Decisions

- Use `DomainCoursePage` as the shared domain landing component.
- Keep the existing Learning Lab shell, sidebar, header, theme toggle, language
  state, review mode, track lesson pages, workspace, canvas, and worker unchanged.
- Domain pages show: dark hero, breadcrumb links, metadata, bordered
  "What you'll learn", course content accordions, requirements, description, and
  a simple `Future HMI` footer.
- Course content track headers are true toggles and default closed.
- Lesson rows navigate to the existing track page with `?lesson=<lessonId>`.
- Empty domains/tracks show existing track rows only; no fake lesson content is
  invented.
- Styling follows Learning Lab theme helpers and avoids Udemy commerce behavior,
  pricing, cart, cookie settings, or language controls in the footer.

# Key Changes

- Added `src/components/learning/shell/DomainCoursePage.tsx`.
- Updated `src/components/learning/LearningLabView.tsx` to render
  `DomainCoursePage` for every `activeDomain && !activeTrack` route.
- Updated `wiki/concepts/learning-lab.md` to document the shared
  course-style domain landing behavior.
- Updated `index.html` favicon to use `docs/assets/Future-HMIip.webp`.

# Verification

- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm run verify`: not used as final verification because its `npm test` step is
  known to fail by running `.ts` tests directly with `node --test`, producing
  `ERR_UNKNOWN_FILE_EXTENSION`.

# Consolidated History

- Started with an RL-only Udemy-inspired course detail page.
- Recolored it to match the Learning Lab theme.
- Simplified it based on user feedback:
  - removed preview/action card, premium strip, instructor panel, and extra track
    cards;
  - fixed hero typography, breadcrumb links, background mismatch, bottom gutter,
    alignment, spacing, and default-closed accordions;
  - added a simple themed footer.
- Generalized the final RL pattern into `DomainCoursePage` and applied it to all
  Learning Lab domain landing pages.
