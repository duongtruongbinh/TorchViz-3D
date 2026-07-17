---
title: Redesign Token ID Round Trip as a Connected Chart
status: done
created: 2026-07-17T15:00:00+07:00
updated: 2026-07-17T15:12:00+07:00
author: Codex
task: "redo the token-ID encode/decode visual as a connected chart"
supersedes:
  - docs/plans/2026-07-17-token-id-ar-pipeline-connection.md
---

# Goal

Replace the card-row implementation on the Encode/Decode page with a real
node-and-connector chart matching the visual language of the AR inference
pipeline.

# Lineage

Corrects [Connect Token IDs to the AR Model Pipeline](./2026-07-17-token-id-ar-pipeline-connection.md), whose card-based implementation did not match the requested chart visualization.

# Decisions (locked)

- Use one fixed chart canvas with positioned nodes and SVG arrow connectors.
- Show the complete path: input text → Tokenizer → input token IDs → AR model →
  selected token ID → Detokenizer → output text.
- Visually connect Tokenizer and Detokenizer to one shared Vocabulary node so
  the page teaches that encode and decode use the same mapping.
- Reuse the existing AR pipeline palette and node shapes where appropriate.
- Remove the card sequence added in the superseded implementation; preserve the
  authored example, labels, warning, theme support, and horizontal overflow for
  compact screens.

# Phases

## Phase 0 — Store and approve the correction

- Record the corrected chart specification and wait for explicit approval.

## Phase 1 — Build the chart

- Replace the current round-trip card rows with a positioned chart canvas.
- Measure node anchors and render responsive SVG connector paths using the same
  pattern as the existing AR inference chart.

## Phase 2 — Preserve lesson semantics

- Keep token IDs as the central visual focus.
- Show the shared Vocabulary connection distinctly from the main generation
  flow.

## Phase 3 — Verify and record

- Run the focused MDX test, type check, and diff check.
- Record the correction here; no separate documentation page is needed.

# Out of scope

- Editing the original AR inference lesson or its progressive states.
- Changing routes, catalog metadata, quizzes, dependencies, or assets.
- Expanding the change beyond this one page renderer.

# Execution log

- 2026-07-17 — User rejected the card-based visualization and clarified that
  the result must be a chart.
- 2026-07-17 — Inspected the AR inference renderer's positioned canvas,
  measured anchors, SVG paths, palette, and overflow behavior for reuse.
- 2026-07-17 — Plan created; awaiting approval.
- 2026-07-17 — Approved by requester; execution started.
- 2026-07-17 — Replaced the card sequence with a fixed node-and-connector
  canvas following the AR inference chart pattern. The main path now runs input
  text → Tokenizer → token IDs → AR model → selected ID → Detokenizer → output
  text.
- 2026-07-17 — Added dashed measured SVG connections from both Tokenizer and
  Detokenizer to one Shared Vocabulary node, separating the shared mapping from
  the main generation flow.
- 2026-07-17 — Preserved horizontal overflow for compact screens, light/dark
  palette behavior, authored MDX data, encode/decode labels, shape label, and
  mismatch warning.
- 2026-07-17 — `node --test src/lib/learningMdxContent.test.ts` passed (9/9),
  `npm run typecheck` passed, and `git diff --check` passed. Production build
  intentionally not run for this single-renderer polish.
