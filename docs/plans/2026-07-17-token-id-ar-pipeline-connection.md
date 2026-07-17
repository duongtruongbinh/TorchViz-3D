---
title: Connect Token IDs to the AR Model Pipeline
status: done
created: 2026-07-17T14:40:00+07:00
updated: 2026-07-17T14:50:00+07:00
author: Codex
task: "connect the token-ID encode/decode lesson visual to the AR language-model pipeline"
supersedes:
  - docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md
---

# Goal

Make the Encode/Decode page of `tokenization-token-ids-vocabulary` show that
token IDs are the representation sent into an AR language model and that a
selected output token is decoded back into text.

# Lineage

Continues [Learning Lab Content Architecture and LLM Course](./2026-07-14-approved-llm-lessons-mdx-migration.md), which establishes locale MDX as the content layer and domain renderers as the visual layer.

# Decisions (locked)

- Preserve the existing `Tôi học AI` token/ID example and page identity.
- Extend the existing `TokenizerIdRoundTrip` renderer rather than duplicate or
  alter the progressive AR inference lesson.
- Add one compact AR model bridge after Token IDs and a decoded output-text
  result so the visible flow is `text → tokens → token IDs → AR model → token
  IDs/tokens → text`.
- Keep the current encode/decode labels, shared vocabulary explanation, theme,
  responsive behavior, and MDX static-data contract intact.

# Phases

## Phase 0 — Store and approve this plan

- Record the requested visual connection and wait for explicit approval.

## Phase 1 — Extend authored content and renderer DTO

- Add the minimal model/output labels and values to the page-two MDX payload.
- Extend the renderer DTO and component adapter only as needed for those
  authored values.

## Phase 2 — Polish the visual sequence

- Render the AR model bridge and decoded output as a clear continuation of the
  existing token-ID stages, with compact responsive stacking on narrow screens.
- Keep token IDs, not the example text, as the central visual focus.

## Phase 3 — Verify and record

- Run the focused Learning MDX test and a type check; inspect the diff for
  whitespace and scope.
- Record actual changes and results in this plan; no new documentation page is
  needed for this local lesson polish.

# Out of scope

- Changing the AR inference lesson, routing, catalog metadata, or quiz flow.
- Introducing a new MDX component, dependency, route, or image asset.
- Rewriting lesson prose outside the affected Encode/Decode page.

# Execution log

- 2026-07-17 — Inspected the existing `TokenizerIdRoundTrip` and
  `LlmArInferencePipeline` renderers. The round-trip view stops at Token IDs;
  the AR view already establishes Token IDs as the model input and decoded text
  as the endpoint.
- 2026-07-17 — Plan created; awaiting approval.
- 2026-07-17 — Approved by requester; execution started.
- 2026-07-17 — Extended the page-two MDX payload with the AR model label,
  selected `!` token (ID 13), and decoded `Tôi học AI!` output.
- 2026-07-17 — Extended `TokenizerIdRoundTrip` with a compact continuation:
  token-ID model input → AR Language Model → selected token → decoded text.
  The original encode/decode stages and labels remain intact.
- 2026-07-17 — `node --test src/lib/learningMdxContent.test.ts` passed (9/9),
  `npm run typecheck` passed, and `git diff --check` passed. Production build
  intentionally not run for this local Learning Lab polish.
