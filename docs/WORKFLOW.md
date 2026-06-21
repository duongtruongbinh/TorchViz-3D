# Project Workflow (mandatory)

This document defines the **mandatory task workflow** for the TorchViz-3D
project. It applies to **everyone** — human contributors and AI agents alike.
It is binding by convention: there is no CI gate enforcing it (yet), so honoring
it is a shared responsibility.

If you are an AI agent, `CLAUDE.md` points you here; follow this flow for every
non-trivial task.

---

## The flow

```
prompt
  → grep the context
    → specify the task        (one question per turn)
      → write & store a plan   (docs/plans/)
        → get approval
          → execute
            → record the modifications
              → update docs
```

1. **Prompt** — Start from the request.
2. **Grep the context** — Read the relevant code/docs first. Do not plan from
   assumptions; ground the plan in what the repo actually contains.
3. **Specify the task** — Resolve ambiguity by asking the requester, **one
   question per turn**, until the task is unambiguous.
4. **Write & store a plan** — Write a plan file under `docs/plans/` (see below).
   This is a checkpoint artifact, not a throwaway.
5. **Get approval** — Wait for the requester to approve the stored plan.
   Approval is an **explicit signal** from the requester in the conversation
   (e.g. "approved", "go ahead", "looks good"). An AI agent must not self-approve
   or assume silence means yes; if approval is unclear, ask. On approval, bump
   the plan's `status` to `approved` and `updated`, then proceed.
6. **Execute** — Carry out the plan, in the phases it defines.
7. **Record the modifications** — Update the plan's execution log and any
   relevant `log.md`; note what actually changed (which may differ from the plan).
8. **Update docs** — Reflect the change in `README.md`, `docs/`, and/or the
   `wiki/` knowledge bundle so documentation stays current.

### The hard rule

> **No file is modified before an approved, stored plan exists.**

The plan file itself (in `docs/plans/`) is the **first allowed write** of any
task. Everything else waits for approval of that plan.

The one pragmatic exception: trivial, self-evident changes (a typo fix, a
one-line doc correction) do not require a formal plan. When in doubt, write the
plan.

---

## Plans (`docs/plans/`)

Every task of non-trivial scope gets one plan file.

### Filename

```
docs/plans/YYYY-MM-DD-<slug>.md
```

- `YYYY-MM-DD` is the **creation** date. It is **immutable** — when a plan's
  status changes, bump the `updated` frontmatter field; **never rename** the
  file. (Same convention as Architecture Decision Records.)
- `<slug>` is a short kebab-case description, e.g. `llm-wiki-okf-plan`.

### Frontmatter

```yaml
---
title: <Human-readable plan title>
status: draft            # draft | approved | executing | done | abandoned
created: <ISO 8601 datetime>
updated: <ISO 8601 datetime>
author: <name or git handle>
task: "<one-line restatement of the request>"
supersedes: []           # paths to predecessor plan(s); [] for a genesis plan
---
```

`status` lifecycle: `draft` → `approved` → `executing` → `done` (or
`abandoned`). Update `updated` on every status change.

### Lineage

A new plan that continues, replaces, or builds on earlier work **MUST cite its
predecessor(s)**, both:

- in the `supersedes:` frontmatter list (machine-walkable), and
- in a `# Lineage` body section with a markdown link (human-readable).

This forms a back-linked chain so the project's decision history can be walked
from any plan. A plan with no predecessor is a *genesis* plan (`supersedes: []`).

### Body structure

No rigid schema, but a good plan contains:

- `# Goal` — what success looks like.
- `# Lineage` — predecessor plans (or "genesis").
- `# Decisions` — choices made and locked, with rationale.
- `# Phases` — the execution broken into ordered, reviewable steps. Mark
  checkpoints where execution pauses for review.
- `# Out of scope` — explicit non-goals.
- `# Execution log` — appended during/after execution: what actually changed.

### Template

```markdown
---
title: <title>
status: draft
created: <ISO 8601>
updated: <ISO 8601>
author: <you>
task: "<request in one line>"
supersedes: []
---

# Goal

# Lineage
Genesis plan — no predecessor.
<!-- or: Supersedes [YYYY-MM-DD-prev-slug](./YYYY-MM-DD-prev-slug.md). -->

# Decisions (locked)

# Phases
## Phase 0 — Store this plan
...

# Out of scope

# Execution log
- <date> — Plan created.
```

---

## Documentation surfaces

When step 8 (update docs) applies, keep these in sync:

| Surface | What lives there |
|---|---|
| `README.md` | User-facing overview, install, top-level pointers. |
| `docs/ARCHITECTURE.md`, `docs/TORCHSTUB.md` | Long-form prose deep-dives. |
| `wiki/` | The OKF knowledge bundle — structured, agent-readable concepts. |
| `docs/plans/` | The history of *why* changes were made. |

See [the OKF knowledge bundle](../wiki/index.md) for the structured wiki and
its authoring rules.

### Prefer updating existing pages

Do not create a new documentation page when an existing relevant page can be
updated clearly. New pages are appropriate for a genuinely new subsystem,
long-lived reference surface, or decision record with a distinct scope. For
small UI, copy, layout, or follow-up changes, update the existing plan/wiki/doc
that already owns the topic and add a concise execution-log entry instead.
