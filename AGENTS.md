# AGENTS.md

Codex reads this file automatically when working in this repository.

## Required Workflow

Follow [docs/WORKFLOW.md](docs/WORKFLOW.md) for every non-trivial task:

```text
prompt -> grep context -> specify task -> write & store a plan
  -> get approval -> execute -> record modifications -> update docs
```

Do not modify files before an approved, stored plan exists. The plan file under
`docs/plans/` is the first allowed write for non-trivial work.

## Repo Orientation

Read [CLAUDE.md](CLAUDE.md) for the current architecture orientation, key files,
commands, and gotchas. Treat it as the shared repo briefing for AI agents and
humans.

The short architecture shape is:

```text
EditorPane -> zustand store -> WorkerService -> Pyodide worker + torchstub
  -> IRGraph -> computeLayout -> Canvas3D
```

## Learning Lab Work

For Landing Page or Learning Lab work, read these before editing:

- [docs/plans/2026-08-19-learning-lab-ui-refactor.md](docs/plans/2026-08-19-learning-lab-ui-refactor.md)
- [docs/plans/2026-08-18-linear-algebra-full-curriculum-and-refinement.md](docs/plans/2026-08-18-linear-algebra-full-curriculum-and-refinement.md)
- [docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md](docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md)
- [docs/plans/2026-06-21-learning-lab-refactor.md](docs/plans/2026-06-21-learning-lab-refactor.md)
- [wiki/concepts/learning-lab.md](wiki/concepts/learning-lab.md)

Before adding or duplicating Learning Lab UI, consult the Learning UI Ownership
and Component Reuse section in the canonical Learning Lab wiki
([wiki/concepts/learning-lab.md](wiki/concepts/learning-lab.md)).

Learning Lab is active runtime behavior. Preserve its typed-TOC -> React-free
catalog -> route/selector flow and locale-MDX authored-content boundary. Do not
reintroduce catalog metadata into `localization.ts`, parallel practice payloads,
or non-canonical lesson routes unless the current approved plan explicitly
requires an architecture change.

Learning Lab is strictly locked to Light Mode only. All shared and domain-specific
Learning Lab UI components must adhere directly to the Light Mode palette (#205089,
#B8C8DA, #EFF3F8, etc.); never introduce dark-mode variants, `dark:` classes, or
theme branching.

Do not create a new docs page when an existing relevant page already owns the
topic. Update the existing page instead. Create a new page only when the work is
substantially different in scope or needs its own long-lived reference surface.

## Learning Lab Content Authoring & Image Generation

- When authoring lessons, blog posts, or deep-dives for Learning Lab, always follow the universal guidelines defined in [.agents/rules/learning-lab-authoring.md](.agents/rules/learning-lab-authoring.md) (or skill [.agents/skills/learning-lab-authoring/SKILL.md](.agents/skills/learning-lab-authoring/SKILL.md)): minimize italics, selective and concise bold keywords (1–4 words), standard English terms, explicit formula shapes with concrete numbers, 3-tier pedagogical pacing, and catalog sync.
- When asked to generate illustration assets for Learning Lab lessons, always follow the canonical educational doodle template defined in [.agents/rules/learning-lab-image-generation.md](.agents/rules/learning-lab-image-generation.md). Use 16:9 landscape aspect ratio with 1–4 side-by-side rounded cards, bold black outlines, pastel header accents, minimal text, and visual metaphors.

## Verification

Use the narrowest verification that matches the change. For code or behavior
changes, prefer:

```bash
npm run verify
```

For docs-only changes, inspect links and run a broader verification only when
the change can affect TypeScript, tests, or build output.
