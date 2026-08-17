---
title: Learning Lab on-demand initial-load optimization
status: done
created: 2026-08-17T09:43:37+07:00
updated: 2026-08-17T11:29:31+07:00
author: Codex
task: "Keep Learning Home, domain navigation, lessons, search, and optional authored runtime behind the narrowest canonical on-demand boundary."
supersedes:
  - docs/plans/2026-08-15-continual-learning-branch-history.md
---

# Goal

Make Learning Lab load only what the current interaction needs while preserving
its typed-TOC -> React-free catalog -> route/selector flow and locale-MDX
authored-content boundary. A bare domain route opens its first lesson by product
default; this intentionally loads that lesson, but never sibling or foreign
content.

# Lineage

This work follows
[Continual Learning Branch Completion](./2026-08-15-continual-learning-branch-history.md).
This record consolidates the branch's initial optimization, catalog/store split,
domain/lesson split, comprehensive review, and review fixes. The absorbed files
were:

- `2026-08-17-learning-home-catalog-store-boundaries.md`
- `2026-08-17-learning-domain-on-demand-boundaries.md`
- `2026-08-17-learning-home-initial-load-review.md`
- `2026-08-17-learning-on-demand-review-fixes.md`

# Final decisions

- Learning Home renders a build-derived projection of the canonical catalog.
  It must not import Workspace templates, concrete TOCs, authored MDX, search
  payloads, adapters, references, or lesson images.
- Global language lives in a small preferences store. Workspace keeps template,
  editor, IR, layout, worker, and canvas state behind the Workspace route.
- Path loads and materializes one canonical domain TOC. Review alone may load
  the complete catalog and all TOCs.
- `/learning/:domainId` resolves and canonicalizes to the domain's first lesson.
  Direct URLs and aliases retain their canonical behavior.
- The lesson registry indexes non-eager Vite loaders and imports one selected or
  fallback-locale MDX module. Published lessons missing MDX fail explicitly;
  unpublished lessons retain the normal placeholder path.
- Vite derives adapter/reference capabilities from authored component use and
  canonical reference coverage. Optional adapters and Continual Learning
  paper/evidence data load only when the selected module needs them.
- Authored search is split by domain and requested only after a non-empty query.
  Catalog title filtering remains available while search content loads or fails.
- Lazy promise caches deduplicate work and evict rejected entries. Catalog,
  lesson, search, and image states provide finite localized retry behavior.
- Lesson paging, completion, focus, and quiz reset use domain-qualified lesson
  identity. Async effects reject stale route, locale, mode, and query results.
- Lesson images use non-eager URL loaders, a stable aspect-ratio box, meaningful
  alt text, lazy decoding, reduced-motion-safe loading, and an error fallback.
- MDX changes invalidate the owning domain's generated search module. Typed-TOC
  changes restart Vite so Node-derived Home/catalog data cannot remain stale.
- No parallel hand-maintained catalog, route map, lesson manifest, search text,
  capability registry, or image manifest is introduced.

# Implementation record

| Boundary | Final implementation |
|---|---|
| Home | `virtual:learning-home-catalog` contains canonical domain summaries only. |
| Preferences | `usePreferencesStore` owns language without importing Workspace state. |
| Path catalog | A cached non-eager TOC loader materializes the active domain only. |
| Review | A retryable dynamic import owns the full catalog/all-domain boundary. |
| Lesson | `LessonDetail` is lazy; the registry imports one selected locale MDX. |
| Optional runtime | Generated MDX capabilities gate domain adapters and reference data. |
| Search | One virtual payload per domain, requested on the first non-empty query. |
| Recovery | Shared retryable promise caching plus explicit catalog/lesson/search/image errors. |
| Dev correctness | Domain-scoped MDX invalidation and deterministic TOC restart. |

# Verification

The final isolated Vite request matrix established:

- Cold Home: zero Workspace templates, TOCs, full catalog, MDX, authored-search
  payloads, adapters, paper/evidence modules, or lesson images.
- Bare Linear Algebra: its one TOC, canonical first Vietnamese MDX, and required
  Linear Algebra adapter only. A second lesson adds only its own MDX.
- Linear Algebra search: one payload containing exactly 13 domain documents and
  no foreign document; generation took about 553 ms in the final measured run.
- Continual Learning quiz without references: one quiz MDX and neither papers
  nor citation evidence. A theory lesson with canonical coverage loads its
  reference runtime and visible page image.
- Review: the full catalog and all 13 TOCs, with no eager lesson or search module.
- Production output preserves separate TOC, MDX, search, adapter, reference, and
  image chunks. Emitted dynamic targets are not treated as requested modules.

Representative production measurements:

- Initial eager Learning payload baseline: 2,547.88 kB raw / 672.35 kB gzip.
- Final Learning shell: about 70.30 kB raw / 20.60 kB gzip.
- Linear Algebra TOC: 5.86 kB / 2.12 kB gzip.
- Linear Algebra search: 42.39 kB / 12.87 kB gzip.
- Deferred `LessonDetail`: about 733.90 kB / 211.51 kB gzip.
- The remaining >1 MB build advisory is the pre-existing deferred Three.js
  vendor chunk, not the cold Learning Home path.

Final verification passed TypeScript, all 100 Node tests, complete MDX
validation, the 2,832-module production build, and
`git diff --check origin/main`. Browser automation was unavailable, so request
evidence came from isolated Vite development graphs and the production import /
preload graph rather than a browser HAR.

# Acceptance criteria

- Cold Home and Landing stay independent from Workspace and authored Learning
  payloads.
- Bare domains open the first node while requesting only their TOC, first MDX,
  and genuinely required optional runtime.
- Lesson, locale, search, Review, alias, placeholder, quiz, citation, reference,
  CV exercise, image, paging, completion, and Workspace handoff behavior remains
  valid.
- Transient loader failures remain retryable and rapid transitions cannot commit
  stale data.
- Development edits cannot silently leave generated Home/search data stale.
- `npm run verify` and `git diff --check origin/main` pass.

# Out of scope

- Replacing Vite, typed TOCs, the MDX authoring contract, or canonical routes.
- Rewriting lesson content or redesigning Learning Lab visuals.
- Splitting common React, Three.js, KaTeX, or shared UI primitives.
- Committing directly to `main`, pushing, or opening a pull request.

# Execution log

- 2026-08-17T09:43:37+07:00 - Stored the initial plan after tracing the eager
  Learning dependency graph. No runtime file changed before approval.
- 2026-08-17T09:45:22+07:00 - Requester approved implementation on
  `fix/learning-home-initial-load`.
- 2026-08-17 - Completed the lazy detail/search split, preference/catalog split,
  and one-domain/one-lesson boundaries through separately approved checkpoints.
- 2026-08-17T10:40:27+07:00 - Requester approved a comprehensive read-only
  review. It confirmed the architecture and identified localized recovery,
  capability, identity, image, HMR, and behavioral-test gaps.
- 2026-08-17T10:55:02+07:00 - Requester approved all review fixes.
- 2026-08-17T11:07:37+07:00 - Requester clarified that bare domains must open
  the first node automatically; route behavior and regression coverage were
  aligned with that product default.
- 2026-08-17T11:13:32+07:00 - Completed the fixes, documentation, request-graph
  measurements, and full verification.
- 2026-08-17T11:25:16+07:00 - Requester approved final cleanup and commit.
  Removed redundant rail-resolution output and duplicate cache logic, kept the
  domain capability constant private, and consolidated five branch plans into
  this canonical record.
- 2026-08-17T11:29:31+07:00 - Post-cleanup `npm run verify` passed TypeScript,
  all 100 tests, complete MDX validation, and the 2,832-module production build;
  `git diff --check origin/main` also passed.
