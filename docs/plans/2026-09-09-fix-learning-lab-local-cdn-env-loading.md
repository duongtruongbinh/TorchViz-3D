---
title: Harden Learning Lab R2 image delivery
status: done
created: 2026-09-09T10:28:05+07:00
updated: 2026-09-09T10:41:19+07:00
author: Codex
task: "Fix R2 asset tooling, make Learning Lab images CDN-only, and migrate LLM AI Engineering image cards to the shared LessonImage component."
supersedes:
  - docs/plans/2026-09-08-cloudflare-r2-image-storage-sync.md
---

# Goal

Ensure Learning Lab images load exclusively through the configured Cloudflare
R2 CDN in both local Vite development and deployment builds. Migrate the LLM AI
Engineering renderer-owned image cards to the same shared `LessonImage`
contract used by authored MDX, and keep the supporting R2 checker lint-clean.

# Lineage

Corrects the environment-loading integration introduced by
[2026-09-08-cloudflare-r2-image-storage-sync](./2026-09-08-cloudflare-r2-image-storage-sync.md).

# Diagnosis

- `npm run lint` initially failed because `scripts/checkR2Assets.ts` assigned a
  regex match inside a `while` condition; the same script also retained an
  unused `statSync` import that later blocked TypeScript verification.
- The four LLM roadmap image objects exist on R2 and each returns HTTP 200.
- `.env` defines `ASSETS_CDN_URL`.
- `vite.config.ts` currently reads only `process.env.ASSETS_CDN_URL` at module
  evaluation time. Vite does not place values from `.env` into `process.env`
  before the config is evaluated, so local development injects an empty
  `__ASSETS_CDN_URL__` constant.
- The R2 checker scans MDX `<LessonImage>` references only, so it does not cover
  the four renderer-owned image paths in `conceptRenderers.tsx`.
- The shared `LessonImage` still maintains a Vite local-asset glob and local
  fallback even though `src/assets/learning/` is intentionally absent from Git.
- The LLM renderer duplicates CDN URL assembly and raw `<img>` loading instead
  of reusing the shared loading, retry, and error-state behavior.

# Decisions (locked)

- Keep the R2 checker behavior unchanged while expressing its regex iteration
  explicitly and removing the unused import.
- Use Vite's `loadEnv` API inside the mode-aware config callback.
- Preserve deployment precedence: an existing process environment value wins;
  the mode-specific `.env` value is the local fallback.
- Continue exposing only the public CDN base URL to client code; no R2
  credentials may enter the bundle.
- Remove the local asset glob and every local fallback branch from
  `LessonImage`; missing CDN configuration or failed CDN requests must enter its
  existing error state and retry flow.
- Replace the four raw LLM renderer `<img>` usages and renderer-local CDN URL
  helper with shared `LessonImage` calls backed by canonical relative asset
  paths.
- Preserve all unrelated parts of the requester's staged changes in
  `src/components/learning/domains/llm-ai-engineering/conceptRenderers.tsx`.

# Phases

## Phase 0 — Store and approve this plan

- Record the diagnosed cause and wait for explicit approval.

## Phase 1 — Repair the R2 checker

- Refactor the asset-path regex loop so assignment occurs outside its condition.
- Remove the unused filesystem import without changing network or parsing
  behavior.

## Phase 2 — Correct Vite environment resolution

- Refactor `vite.config.ts` to resolve `ASSETS_CDN_URL` from the deployment
  process environment or Vite's loaded environment for the active mode.
- Keep the existing trailing-slash normalization and compile-time constant.

## Phase 3 — Enforce the shared CDN-only image contract

- Simplify `LessonImage` to request CDN URLs only while retaining loading,
  failure, accessibility, caption, and retry behavior.
- Update the component-wiring regression test so it rejects reintroduction of
  local Learning Lab asset globs/fallbacks.
- Convert all four LLM AI Engineering raw image cards to `LessonImage` and
  remove their private CDN URL construction.

## Phase 4 — Verify and document

- Run `npm run verify`.
- Confirm a local-mode production build contains the configured public CDN base
  URL without exposing credentials.
- Run the R2 reachability check for existing MDX assets and directly verify the
  four renderer-owned LLM object URLs.
- Update the existing R2 reference and canonical Learning Lab wiki to state the
  CDN-only runtime contract, then record the actual changes and results here.

# Out of scope

- Uploading or replacing R2 objects.
- Redesigning Learning Lab image presentation.
- Modifying unrelated Learning Lab content or unrelated parts of the
  requester's staged renderer work.
- Expanding the R2 checker to parse arbitrary TypeScript renderer registries.

# Execution log

- 2026-09-09 — Initial R2 checker lint fix was separately planned and approved,
  then compacted into this document at the requester's direction. The regex
  loop now assigns matches outside the `while` condition, preserving extracted
  path order and values; `npm run lint` returned exit code 0.
- 2026-09-09 — Draft plan created after confirming all four affected R2 objects
  return HTTP 200 and tracing the empty local CDN constant to Vite config-time
  environment loading.
- 2026-09-09 — Scope expanded at the requester's direction: remove local image
  fallback globally and migrate renderer-owned LLM image cards to the shared
  `LessonImage` contract.
- 2026-09-09 — Updated plan approved by the requester; execution started.
- 2026-09-09 — Updated `vite.config.ts` to resolve `ASSETS_CDN_URL` through
  Vite `loadEnv` with process-environment precedence, then inject only the
  normalized public URL.
- 2026-09-09 — Removed the local asset glob and fallback branches from
  `LessonImage`; CDN configuration/request failures now use the shared error and
  retry state.
- 2026-09-09 — Migrated all four raw LLM roadmap images to `LessonImage` with
  canonical relative asset paths and added wiring regression coverage.
- 2026-09-09 — Updated the existing R2 reference and canonical Learning Lab
  wiki to document the CDN-only contract.
- 2026-09-09 — Removed the unused `statSync` import that blocked repository
  typechecking; no behavior changed.
- 2026-09-09 — Verification passed: `npm run verify`, `npm run lint`, targeted
  component-wiring tests (9/9), `npm run check:r2-assets` (169/169 reachable),
  and direct HTTP checks for the four renderer-owned LLM assets (all HTTP 200).
  The local build contains the configured public CDN URL once and contains none
  of the checked R2 credentials.
- 2026-09-09 — Compacted the former standalone R2 checker lint plan into this
  canonical plan so the related R2 work has one history document.
