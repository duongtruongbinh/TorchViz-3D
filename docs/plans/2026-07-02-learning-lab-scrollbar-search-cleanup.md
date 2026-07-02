---
title: Learning Lab Scrollbar and Search UI Cleanup
status: approved
created: 2026-07-02T12:00:00+07:00
updated: 2026-07-02T12:00:00+07:00
author: GitHub Copilot
task: "Create a plan for unifying Learning Lab scrollbar style, removing the Learning Lab search UI, and updating branch/git state"
supersedes: []
---

# Goal

Document the requested Learning Lab UI cleanup work in a workflow-compliant plan, including the requested scrollbar unification and search bar removal.

# Lineage
Genesis plan — no predecessor.

# Decisions (locked)

- Keep `custom-scrollbar` as the shared scrollbar style and preserve `learning-lab-scrollbar` where JS lookups depend on it.
- Remove the disabled Learning Lab header search bar from `src/components/learning/LearningLabHeader.tsx`.
- Apply the shared gray scrollbar style to the Learning Lab sidebar nav and lesson content viewport.
- Use `feat/` branch-prefixed workflow with a commit capturing the UI changes.

# Phases

## Phase 0 — Store this plan

- Create this plan file in `docs/plans/` with draft status.

## Phase 1 — Confirm scope and existing artifacts

- Verify which Learning Lab scrollbar classes and components are in use.
- Ensure no runtime scripts break when consolidating scrollbar classes.

## Phase 2 — Execute UI cleanup

- Remove the placeholder search UI from `src/components/learning/LearningLabHeader.tsx`.
- Update `src/index.css` to unify scrollbar styling with the existing gray theme.
- Apply `custom-scrollbar` to the sidebar nav in `src/components/learning/LearningLabView.tsx`.
- Keep `learning-lab-scrollbar` where `closest('.learning-lab-scrollbar')` is required.

## Phase 3 — Git housekeeping

- Rename the branch to the `feat/` prefix format.
- Stage and commit the relevant files with an appropriate message.

# Out of scope

- Any Learning Lab feature redesign beyond scrollbar/style cleanup.
- Changes to the underlying learning content structure.
- Introducing new scrollbar themes or platform-specific scrollbar behavior.

# Execution log

- 2026-07-02T12:00:00+07:00 — Plan created.
