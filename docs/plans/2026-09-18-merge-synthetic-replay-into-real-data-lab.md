---
title: Merge the Synthetic Replay Demo into the Real-Data Replay Lab
status: done
created: 2026-09-18T02:25:00+07:00
updated: 2026-09-18T03:10:00+07:00
author: Codex
task: "Consolidate the synthetic sequential-forgetting demo and the real-data sequential Replay baseline into one canonical Experience Replay lab"
supersedes:
  - docs/plans/2026-09-12-continual-learning-domain-curriculum-and-labs.md
  - docs/plans/2026-09-18-harden-ewc-si-hypothesis-lab.md
---

# Goal

Replace the two overlapping Replay code-lab pairs with one canonical
`replay-experience-code-lab` pair. The surviving lesson will briefly establish
the A → B catastrophic-forgetting intuition, then run the substantive SeqFT
versus Replay experiment on DBpedia, Amazon Polarity, Yahoo Answers, and AG
News. The standalone synthetic implementation and its duplicate quiz will be
removed from the curriculum.

# Lineage

This plan refines the Chapter 2 curriculum introduced by
[Continual Learning Curriculum, Interactive Labs, and Learning Lab Framework Refinements](./2026-09-12-continual-learning-domain-curriculum-and-labs.md).
It also renumbers the canonical MDX source maintained by the still-active
[Harden EWC and SI Hypothesis Lab for Full Runs](./2026-09-18-harden-ewc-si-hypothesis-lab.md),
without changing the external notebook or its experiment contract.

# Decisions (locked)

- Keep the public lesson IDs `replay-experience-code-lab` and
  `replay-experience-code-lab-quiz`; remove
  `sequential-cl-baseline-lab` and its quiz from the catalog.
- Use the current four-real-dataset SeqFT/Replay implementation as the sole
  executable lab. Preserve its experiment contract, code, results discussion,
  and downstream artifact role.
- Carry over only the synthetic lesson's pedagogical sequence: first establish
  a learned Task A checkpoint, then show A degrading after Task B, then compare
  against Replay. Do not retain a second synthetic dataset generator, training
  stack, threshold sweep, or paper-specific detour.
- Retitle and edit the surviving lesson as an Experience Replay lab, while
  keeping SeqFT as the necessary naive baseline inside that lab.
- Replace the two quizzes with one quiz grounded in the real-data protocol and
  its catastrophic-forgetting → Replay reasoning chain.
- Consolidate paper coverage and citation evidence under the surviving Replay
  lesson ID. Remove coverage that only justified claims from the deleted
  synthetic fixture.
- Keep Chapter 2 filenames contiguous and aligned with TOC order. After the
  duplicate pair is removed, shift all later Chapter 2 files down by two:
  `2.1.7–2.1.16` become `2.1.5–2.1.14`.
- Preserve all existing uncommitted user edits while moving files, especially
  the real-data baseline lesson and the hardened EWC/SI lesson.
- Do not change `/home/khiem/ewc_si_hypothesis_lab.ipynb`; only its canonical
  MDX filename changes from `2.1.11` to `2.1.9`.
- Do not add redirects, compatibility lesson IDs, duplicate routes, or hidden
  fallback content.

# Phases

## Phase 1 — Form the single Replay lesson

- Move the real-data lab content into the canonical
  `2.1.3-replay-experience-code-lab.vi.mdx` position.
- Rewrite its opening and metadata so the learner sees the sequence
  phenomenon → measured forgetting → Replay intervention before entering the
  four-task implementation.
- Remove synthetic-only code, outputs, multi-seed threshold analysis, and
  claims that no longer belong to the surviving lab.

## Phase 2 — Consolidate assessment and evidence

- Replace `2.1.4` with the real-data quiz, rename its lesson/quiz identity, and
  align its concepts with the merged lesson.
- Update `papers.ts` and `citationEvidence.ts` so O-LoRA protocol evidence is
  owned by `replay-experience-code-lab`; delete the obsolete sequential lesson
  coverage and synthetic-only evidence mapping.
- Update catalog assertions that explicitly list both old lesson pairs.

## Phase 3 — Remove duplicate topology and renumber

- Remove the `sequential-cl-baseline-lab` pair from
  `table-of-contents.ts`.
- Delete the superseded synthetic pair by replacing its canonical slots with
  the merged real-data lesson and quiz, then remove the old `2.1.5/2.1.6`
  identities.
- Rename every downstream Chapter 2 MDX file by two positions, preserving file
  contents and metadata IDs.
- Update live documentation or active plans whose canonical file links would
  otherwise point to a removed path. Historical descriptions remain historical
  unless they create a broken live reference.

## Phase 4 — Verification

- Confirm there is exactly one Replay code-lab pair and no remaining catalog,
  evidence, quiz, or test reference to `sequential-cl-baseline-lab`.
- Confirm Chapter 2 filenames mirror TOC order and every metadata title,
  heading list, concept ID, citation, and quiz contract resolves.
- Run focused Learning Lab tests, `git diff --check`, and `npm run verify`.
- Record the exact moves and verification results in this plan before marking
  it done.

# Out of scope

- Changing the four-dataset experiment mathematics, training budget, model, or
  generated result values.
- Reworking EWC/SI notebook behavior or running its GPU smoke gate.
- Keeping the synthetic lab available through an alternate route.
- Redesigning shared Learning Lab components or navigation UI.

# Acceptance criteria

- The curriculum exposes one Experience Replay lab and one associated quiz.
- The lab begins with a concise catastrophic-forgetting observation and then
  uses the four real datasets to compare SeqFT with Replay.
- No synthetic training implementation or duplicate Replay lesson remains.
- No `sequential-cl-baseline-lab` catalog/evidence/test references remain.
- Chapter 2 MDX numbering is contiguous and matches catalog order.
- The current real-data and EWC/SI user edits survive the file moves.
- `npm run verify` and `git diff --check` pass.

# Execution log

- 2026-09-18 — Inspected both lab/quiz pairs, the Chapter 2 TOC, catalog tests,
  paper coverage, citation evidence, and downstream filename topology. Stored
  this draft before modifying curriculum source files.
- 2026-09-18 — User approved the stored plan; execution started.
- 2026-09-18 — Replaced the synthetic `2.1.3/2.1.4` pair with the existing
  four-dataset SeqFT/Replay lab and quiz. The surviving lesson now opens with
  the A → B forgetting observation, then measures the same phenomenon through
  the four-task evaluation matrix before introducing Replay.
- 2026-09-18 — Consolidated lesson IDs, concept IDs, O-LoRA coverage, and
  reviewed citation evidence under `replay-experience-code-lab`. Removed the
  `sequential-cl-baseline-lab` pair from the TOC and catalog assertions.
- 2026-09-18 — Shifted the remaining Chapter 2 MDX files from `2.1.7–2.1.16`
  to `2.1.5–2.1.14`. Byte comparisons confirmed nine unchanged downstream
  files were preserved exactly; the pre-existing modified EWC/SI source also
  retained its exact pre-move SHA-256.
- 2026-09-18 — Updated the active EWC/SI plan's canonical MDX path and
  regenerated catalog statistics: 777 total lessons, 309 published, and 85
  published Continual Learning lessons.
- 2026-09-18 — Focused catalog/MDX tests, citation evidence resolution for the
  new Replay evidence ID, catalog stats checks, `git diff --check`, and the full
  `npm run verify` pipeline passed. Verification completed with 160 tests
  passing and a successful production build.
