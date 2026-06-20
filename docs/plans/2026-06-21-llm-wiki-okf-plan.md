---
title: LLM wiki — OKF bundle + codified workflow
status: approved
created: 2026-06-21T00:00:00Z
updated: 2026-06-21T00:00:00Z
author: hienlong
task: "set up llm-wiki (OKF bundle) and codify the task workflow as mandatory practice"
supersedes: []   # genesis plan — no predecessor
---

# Goal

Two deliverables, executed in order:

1. **Codify the project task workflow** as mandatory practice for both humans
   and AI agents (docs + `CLAUDE.md`, by convention — no mechanical gate).
2. **Build an OKF v0.1 knowledge bundle** under `wiki/` describing the
   TorchViz-3D codebase — and run that build as the *first task executed under
   the new workflow*.

# Lineage

Genesis plan — no predecessor. Future plans MUST cite the plan(s) they follow
both in the `supersedes:` frontmatter field and here. Example for the next plan:

> Supersedes [2026-06-21-llm-wiki-okf-plan](./2026-06-21-llm-wiki-okf-plan.md).

# The canonical workflow (the rule this codifies)

> prompt → grep context → specify task (one question per turn) → **write & store
> a plan** → approval → execute → record the modifications → update docs.
>
> **Hard rule: no file is modified before an approved, stored plan exists.** The
> plan file itself (in `docs/plans/`) is the first allowed write.

# Decisions (locked)

- Bundle location: `wiki/` at repo root.
- Keep existing `docs/ARCHITECTURE.md` + `docs/TORCHSTUB.md`; the wiki **cites**
  them rather than duplicating or replacing them.
- Enforcement: docs + `CLAUDE.md` convention only. No CI/hook gate (may revisit).
- Plan files live in `docs/plans/` named `YYYY-MM-DD-<slug>.md`. The filename
  date is the **creation** date and is immutable — on status change, bump the
  `updated` frontmatter field, never rename the file.
- Plan frontmatter: `title, status, created, updated, author, task, supersedes`.
- Plan lineage: a new plan MUST cite its predecessor(s) via `supersedes:` and a
  body citation, forming a walkable chain of decisions.
- Pacing: pause after Phase 0 and Phase 5 for review.
- No tooling/generator — hand-authored static bundle.

# Phases

## Phase 0 — Store this plan (DONE this step)
- `docs/plans/2026-06-21-llm-wiki-okf-plan.md` (this file). First and only
  write. Pause.

## Phase 1 — Define the workflow
- `docs/WORKFLOW.md`: the 7-step flow, the hard rule, the `docs/plans/`
  convention (filename + frontmatter + lineage), and the plan-file template.

## Phase 2 — Bind agents
- `CLAUDE.md`: embed the flow, link `docs/WORKFLOW.md`, plus a one-screen
  architecture orientation pointing into `wiki/`.

## Phase 3 — Bind humans
- `CONTRIBUTING.md`: reference the workflow.
- `.github/pull_request_template.md`: checklist (plan linked? changes recorded?
  docs updated?).

## Phase 4 — Build the OKF bundle
Conformant: every non-reserved `.md` has parseable YAML frontmatter with a
non-empty `type`; cross-links are bundle-relative (`/...`).

- `wiki/index.md` — root listing (`okf_version: "0.1"` frontmatter).
- `wiki/architecture.md` — `type: Architecture Overview`; pipeline + diagram.
- `wiki/glossary.md` — `type: Glossary`.
- `wiki/concepts/index.md` — listing.
- `wiki/concepts/torchstub.md` — `type: Subsystem`; shape-only fake torch.nn.
- `wiki/concepts/pyodide-worker.md` — `type: Subsystem`; worker, CDN, line offset.
- `wiki/concepts/ir-contract.md` — `type: Data Contract`; IRGraph/IRNode/IREdge.
- `wiki/concepts/layout-engine.md` — `type: Subsystem`; computeLayout, axis swap.
- `wiki/concepts/state-store.md` — `type: Subsystem`; zustand, templates.
- `wiki/concepts/rendering.md` — `type: Subsystem`; Canvas3D, Inspector, theme.
- `wiki/guides/index.md` — listing.
- `wiki/guides/add-a-layer.md` — `type: Playbook`.
- `wiki/reference/index.md` — listing.
- `wiki/reference/templates.md` — `type: Reference`; 7 built-in models + shapes.
- `wiki/reference/gotchas.md` — `type: Reference`; canonical fragile-spots list.

## Phase 5 — Record the modifications
- `wiki/log.md`: `2026-06-21` Initialization entry.
- Conformance pass: every non-reserved `.md` has `type`; bundle-relative links
  resolve. Pause for review.

## Phase 6 — Update docs
- `README.md`: add a "Knowledge bundle" pointer to `wiki/`.
- `docs/ARCHITECTURE.md`: cross-link to the wiki so the three doc sets reference
  each other.

# Out of scope
- No source-code behavior changes.
- No CI/hook enforcement in this pass.
- No automated bundle generator.

# Execution log
- 2026-06-21 — Plan created and approved (Phase 0). Renamed to date-prefixed
  filename; added lineage convention. Awaiting review before Phase 1.
