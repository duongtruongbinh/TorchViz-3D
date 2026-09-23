---
title: Add Linear Regression lesson to Machine Learning
status: done
created: 2026-09-23T05:15:00+07:00
updated: 2026-09-23T08:58:00+07:00
author: Copilot
task: "Convert the uploaded Linear Regression lesson and images into the Machine Learning 1.2 Linear & Logistic Regression track."
supersedes: [
  "docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md"
]
---

# Goal

Publish the uploaded Vietnamese Linear Regression lesson under the existing
Machine Learning domain and its `1.2 Linear & Logistic Regression` track, using
the existing `linear-regression` lesson ID and the repository's locale-MDX
content contract.

# Lineage

Builds on the content migration and canonical locale-MDX boundary established
by [2026-07-14-approved-llm-lessons-mdx-migration](./2026-07-14-approved-llm-lessons-mdx-migration.md).

# Decisions (locked)

- Use `src/content/learning/fundamentals/`, not `linear-algebra/`.
- Preserve the existing TOC lesson ID `linear-regression`; only add or update
  metadata if the catalog contract requires it.
- Convert the uploaded Markdown to the Vietnamese lesson format used by the
  current MDX loader, preserving the authored explanation and equations while
  correcting incompatible image references and Markdown/MDX details.
- Copy both uploaded images into a lesson-local asset directory and reference
  them with stable relative paths.
- Keep Logistic Regression and the remaining track lessons unchanged.
- Do not introduce new Learning Lab UI components or alter the shared catalog
  architecture.

# Phases

## Phase 0 — Store and approve this plan

Create this plan, pause for explicit approval, then mark it `approved`.

## Phase 1 — Inspect the content contract

Confirm the expected frontmatter/metadata shape, locale filename convention,
image handling, and catalog validation requirements from existing authored
lessons and loader code.

## Phase 2 — Add the lesson content

Create the Vietnamese MDX lesson for `linear-regression`, add the two uploaded
images under the lesson's asset location, and register any required published
metadata without changing unrelated tracks.

## Phase 3 — Record and verify

Update this plan's execution log and the existing Learning Lab documentation
only if the new authored lesson changes documented catalog status. Run the
narrowest relevant catalog/content checks, then `npm run verify` if the
content pipeline requires full validation.

## Phase 4 — Restore supplied lesson images

Restore the two supplied assets referenced by the existing lesson:
`linear-regression-house-prices.png` and
`linear-regression-homoscedasticity.png`. Store them in the repository-backed
public Learning Lab asset tree expected by `LessonImage`, preserve the current
MDX references and content, validate local/production asset resolution, commit
with the Copilot co-author trailer, and push the PR head branch.

# Out of scope

- Adding or editing Logistic Regression.
- Moving the lesson into Linear Algebra.
- Rewriting the lesson's mathematical scope beyond compatibility and clear
  formatting corrections.
- Adding new visual components or changing Learning Lab routing.

# Execution log

- 2026-09-23 — Plan created in draft after confirming the existing
  `fundamentals` Machine Learning track and `linear-regression` lesson ID.
- 2026-09-23 — Plan approved by requester.
- 2026-09-23 — Added the five-page Vietnamese MDX lesson, published the
  existing `linear-regression` catalog node, copied the two uploaded images to
  the local R2 sync source, and synchronized catalog documentation.
- 2026-09-23 — Verified with `npm run build`, `npm run typecheck`,
  `npm run check:catalog-stats`, the affected catalog test file, the lesson
  route returning HTTP 200, and `git diff --check`. The full test command still
  has two unrelated pre-existing failures: a Windows path-separator assumption
  in the NCA content test and a tuple Conv2d/Pool2d torchstub test.
- 2026-09-23 — Fixed all remaining inline math in the lesson by using
  `<InlineMath />`. Added a Vite-development-only local image route and
  fallback so the uploaded images render without an R2 environment; production
  continues to use the configured CDN.
- 2026-09-23 — Replaced the abbreviated lesson with an 8-page transcription
  faithful to the supplied P2 PDF/source Markdown, preserving the original
  section order, explanations, expectation derivation, Homoscedasticity table,
  insights, summary, and next-lesson transition. Only MDX-safe math/image
  syntax was changed.
- 2026-09-23 — Follow-up restoration requested after the two lesson images were
  removed as unavailable; plan returned to draft pending explicit approval and
  supplied asset binaries.
- 2026-09-23 — Restoration approved by the supplied follow-up request; source
  ZIP located in the parent session attachment area and image mapping confirmed
  from the source Markdown.
- 2026-09-23 — Restored both PNGs under `public/assets/learning/fundamentals/`,
  reinstated the two existing `LessonImage` references, synchronized catalog
  stats, and passed typecheck, catalog-stat validation, production build, and
  diff checks.
- 2026-09-23 — Request changed to remove the image integration to avoid R2
  asset failures; removed only the two image references and their repository
  files, leaving the authored lesson and runtime image handling unchanged.
