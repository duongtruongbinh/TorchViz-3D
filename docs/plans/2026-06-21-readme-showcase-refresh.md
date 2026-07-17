---
title: README showcase refresh
status: done
created: 2026-06-21T18:55:45+07:00
updated: 2026-06-21T19:05:00+07:00
author: dtbinh
task: "refresh README so GitHub readers quickly understand the website, features, UI flow, and architecture with a real screenshot and Mermaid diagram"
supersedes:
  - docs/plans/2026-06-21-docs-sync-audit-fixes.md
---

# Goal

Rewrite `README.md` into a concise, modern project showcase for GitHub readers.
The README should quickly answer:

- What is TorchViz-3D?
- What can it do?
- What does the UI look like?
- How does visualization flow from code to 3D architecture?
- How do developers run and verify it locally?

It should include a real screenshot captured from the current local app and a
clean Mermaid architecture diagram.

# Lineage

Supersedes [2026-06-21-docs-sync-audit-fixes](./2026-06-21-docs-sync-audit-fixes.md)
because this task builds on the freshly synchronized documentation and keeps the
same repo facts accurate.

# Decisions

- Use a **real app screenshot**, not generated art, so GitHub users see the
  actual interface.
- Store README media under `docs/assets/` to keep documentation assets separate
  from runtime source.
- Use a Mermaid `flowchart LR` diagram in README instead of a static generated
  architecture image so it stays editable and renders directly on GitHub.
- Keep README professional and direct: no long marketing copy, no feature bloat,
  no claims that the app does not currently support.
- Preserve the Learning Lab scaffold as planned/inert; do not market it as an
  active user feature.
- Do not change app source or behavior.

# Design

Recommended README structure:

1. Title, one-sentence value proposition, and compact badges-style metadata.
2. Hero screenshot using `docs/assets/torchviz-studio-screenshot.png`.
3. "What it does" feature bullets focused on current behavior:
   browser-only Pyodide tracing, Monaco editor, 3D canvas, nested modules,
   inline shape errors, templates, SVG/PNG export, MNIST/demo learning overlays
   where already present.
4. "How it works" Mermaid diagram:
   `EditorPane -> Zustand Store -> WorkerService -> Pyodide + torchstub ->
   IRGraph -> computeLayout -> Canvas3D/SVG export`.
5. "Try it locally" with prerequisites and short commands.
6. "Development" with test/build/verify commands.
7. "Docs" links to wiki, architecture, torchstub extension, and workflow.

# Phases

## Phase 0 - Store this plan

- Add this plan under `docs/plans/`.
- Wait for explicit approval before any other file changes for this task.

## Phase 1 - Capture the real screenshot

Files to create:

- `docs/assets/torchviz-studio-screenshot.png`

Steps:

- Start the Vite dev server on port 3000 or the next available port.
- Open the app with Playwright at a desktop viewport, preferably `1440x1000`.
- Run or trigger the default visualization if the canvas is empty.
- Capture a polished screenshot that shows the editor, 3D visualization, and
  side/bottom panels enough for a GitHub reader to understand the interface.
- Keep the image reasonably sized for repo use.

## Phase 2 - Rewrite README

File to modify:

- `README.md`

Required content:

- Clear one-line product description.
- Screenshot embedded near the top with alt text.
- Feature list grounded in current repo behavior.
- Mermaid architecture diagram grounded in current pipeline.
- Concise local setup and developer commands.
- Documentation links.
- No mention that Learning Lab is active runtime behavior.

## Phase 3 - Record execution

File to modify:

- `docs/plans/2026-06-21-readme-showcase-refresh.md`

Steps:

- Move status through `approved` / `executing` / `done` according to
  `docs/WORKFLOW.md`.
- Append execution log entries for screenshot creation, README rewrite, and
  verification.

# Out of scope

- No app UI changes.
- No routing or Learning Lab activation.
- No new marketing site.
- No deployment.
- No generated or stock hero art.

# Verification

- Check that `README.md` references an existing image path.
- Check that the Mermaid block is syntactically simple enough for GitHub:
  `flowchart LR`, quoted labels only where needed, no unsupported styling
  requirements.
- Run markdown relative-link check for real links, ignoring the known
  `docs/WORKFLOW.md` template placeholder.
- Run `git diff --check`.
- Do not run `npm run verify` unless executable source changes are made.

# Execution log

- 2026-06-21 - Plan created after user selected a real screenshot plus Mermaid
  diagram approach; waiting for approval.
- 2026-06-21 - User approved execution with "go"; status moved to executing.
- 2026-06-21 - Captured a real desktop screenshot from the local app after
  running the LeNet-5 visualization; saved it to
  `docs/assets/torchviz-studio-screenshot.png`.
- 2026-06-21 - Rewrote `README.md` as a concise GitHub showcase with badges,
  screenshot, feature bullets, Mermaid pipeline diagram, local setup,
  development commands, docs links, and current-scope notes.
- 2026-06-21 - Verification complete: README image path exists, Mermaid block
  uses a simple `flowchart LR`, markdown relative-link check found no missing
  real links, and `git diff --check` passed. Skipped `npm run verify` because
  no executable source changed for this task.
