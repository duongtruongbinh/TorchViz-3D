---
title: Move Linear Predicted Class Label
status: done
created: 2026-06-23T23:05:00+07:00
updated: 2026-06-23T23:14:00+07:00
author: Codex
task: "Show the predicted class name next to the highlighted class number in the Linear demo."
supersedes:
  - docs/plans/2026-06-23-forward-pass-residual-remap.md
---

# Goal

Make the Linear operation effect easier to read by placing the predicted class
name directly beside the active output class number once the prediction is
revealed.

# Lineage

Supersedes [2026-06-23-forward-pass-residual-remap](./2026-06-23-forward-pass-residual-remap.md) as a follow-up to the forward-pass demo polish work.

# Decisions

- Keep the existing score column layout and animation timing.
- Extend the class-score column primitive only as much as needed to support an
  optional label beside the active row.
- Remove the separate bottom prediction label from the Linear effect to avoid
  duplicate prediction text.

# Phases

## Phase 0 - Store this plan

Write this plan as the first allowed file modification.

## Phase 1 - Move the prediction label

- Add optional active-row label support to `UnitColumn`.
- Pass the active CIFAR class name from `LinearEffect` after the prediction is
  revealed.
- Position the label to the right of the highlighted class number with enough
  outline and max width for visibility.

## Phase 2 - Verify

- Run the narrowest useful check for the touched TypeScript/React files.
- Use broader verification only if the change affects build or types beyond the
  demo rendering surface.

## Phase 3 - Record

- Append the actual changes and verification result to this plan's execution
  log.
- Update broader docs only if the behavior needs a long-lived reference note.

# Out of scope

- Changing CIFAR class selection logic.
- Reworking the overall Linear demo layout, score values, or animation timing.
- Adding routing or store behavior.

# Execution log

- 2026-06-23 - Plan created.
- 2026-06-23 - Plan approved; execution started.
- 2026-06-23 - Added optional active-row side label support to
  `UnitColumn`, then wired `LinearEffect` to show the winning CIFAR class name
  beside the highlighted class number after the prediction reveal. Removed the
  separate bottom prediction label so the prediction is only shown next to the
  number.
- 2026-06-23 - Verified with `npm.cmd run build` (passes; existing Vite
  warning for the large `three-vendor` chunk remains). Started a local dev
  server on `http://127.0.0.1:4173/`, but screenshot verification was not
  available because the in-app browser execution tool was not exposed and the
  project does not have Playwright installed locally.
