---
title: Finish Machine Learning main merge and test verification
status: done
created: 2026-09-21
updated: 2026-09-22T00:07:45.3610817+07:00
author: Codex
task: "Continue the interrupted main merge, verify tests, restore Workspace changes, and prepare the Machine Learning branch for user push"
supersedes: []
---

# Goal
Complete the in-progress merge of origin/main into content/machine-learning-domain with passing verification and preserved Workspace work.

# Lineage
Genesis record for the interrupted merge described in the user-provided conversation; no stored predecessor plan for this merge was found.

# Decisions
- User explicitly authorized continuation after the remaining steps were explained ("tiep tuc hoan thanh di").
- Preserve the existing feature branch and its Machine Learning content.
- Retain main's current test logic and the existing Windows compatibility fixes.
- Keep Workspace WIP out of the merge commit; apply its named stash afterwards and retain the stash as a backup.
- Complete the local merge commit; leave pushing to the user as requested in the original task.

# Phases
1. Inspect the current merge, dependency installation, conflict resolutions, and stash.
2. Run npm run verify; repair only failures necessary for this integration.
3. Record results here and in wiki/log.md; stage explicit resolved/test/documentation paths and complete the merge.
4. Restore the named Workspace stash, resolve any overlapping integration changes, and inspect final Git state.

# Out of scope
Lesson authoring, UI redesign, unrelated refactors, remote publishing.

# Execution log
- 2026-09-21: Confirmed existing branch, pending merge of 851b826174000b3de81da01c1943c1c4138e7a55, two unmerged test entries with markers already removed, installed mafs, and named Workspace stash.
- 2026-09-21: Reviewed resolutions against origin/main: catalog totals are 104 tracks, 808 lessons, 438 missing; MDX count derives from published lessons; NCA path filtering normalizes Windows separators; Python override/platform selection remains intact.
- 2026-09-21: npm run verify passed (typecheck, 162/162 tests, production build). The Codex process PATH resolves python to a Microsoft Store alias; verification used the existing PYTHON override with the bundled Python 3.12.14 executable. No dependency or lockfile repair was needed.

- 2026-09-21: Completed the local merge and applied workspace-responsive-wip-before-ml-main-merge without conflicts. All three Workspace files remain unstaged and the stash is retained as backup. Header and TorchVizWorkspace match the stash exactly; CSS merged its 60 added lines onto main. Re-ran npm run verify after restoration: typecheck, 162/162 tests, and production build passed. origin/main is an ancestor of HEAD; pushing remains with the user.


# CI follow-up: catalog statistics
- 2026-09-22: Continue the authorized integration repair after the user reported the failed Catalog stats drift check. Regenerate wiki/reference/catalog-stats.md, reconcile the existing Learning Lab prose with the typed catalog, run check:catalog-stats and diff checks, then commit only documentation/plan changes. Preserve Workspace WIP and leave push to the user. No runtime or lesson changes required.


- 2026-09-22: Regenerated the per-domain statistics and synchronized Learning Lab headline totals, authored fundamentals coverage, placeholder search count, and domain file-map count. npm run check:catalog-stats passed; git diff --check passed. This is documentation-only; runtime verification from the integration remains applicable. CI also has lint and a secret-configured R2 CDN check outside npm run verify; no claim is made that remote CI has rerun.

