---
title: Continual Learning Claim-Level Citation Remediation
status: done
created: 2026-08-13T20:10:00+07:00
updated: 2026-08-13T20:35:06+07:00
author: Codex
task: "Remediate the Continual Learning citation audit so primary papers support claims directly and reference pages stay relevant"
supersedes:
  - docs/plans/2026-08-13-continual-learning-citations.md
  - docs/plans/2026-08-13-continual-learning-reference-page.md
---

# Goal

Close the gap between bibliography completeness and claim-level evidence in the
Vietnamese Continual Learning domain. Important papers must appear beside the
claims they support, quantitative or paper-specific findings must carry useful
locators, and each node's dedicated reference page must remain comprehensive
without inheriting unrelated citations from a broad survey section.

# Lineage

This plan supersedes [Continual Learning Citations and Paper Knowledge Layer](./2026-08-13-continual-learning-citations.md)
and [Continual Learning Dedicated Reference Page](./2026-08-13-continual-learning-reference-page.md).
Those plans established the paper registry, structured citation components,
survey-derived coverage, and a dedicated final reference page. This remediation
keeps those surfaces but replaces section-level coverage as the final authority
with reviewable claim-level mappings.

# Audit baseline

- The registry contains 228 reachable records and all current IDs resolve.
- The 39 non-Quiz lessons all have a reference relationship or an explicit
  course-analysis exception.
- Ten featured-paper relationships are not represented by an inline `Cite` or
  `PaperSummary` in the corresponding lesson.
- Fifteen lessons cite only the survey in authored prose, and two synthesis/map
  lessons have no authored citation component.
- Only 5 of 115 direct-paper `Cite` occurrences include an evidence locator.
- Nine nodes currently expose more than 30 papers; the largest exposes 70.
- Survey §1 contributes 65 direct references, causing the overview and synthesis
  reference pages to include many model-background papers unrelated to their
  taught claims.
- Seventy-four generated records fall back to a Google Scholar search URL and
  two records have no year.
- Only one lesson currently uses `PaperSummary`.

# Decisions (locked)

## Evidence model

1. Replace lesson-to-section union as the final coverage model with explicit
   claim rows. Each row records a stable claim ID, lesson ID, survey locator,
   primary/secondary/further-reading paper IDs, evidence role, and where the
   evidence is exposed.
2. Keep generated survey section maps as an intake and reconciliation source;
   do not render their complete union automatically unless a node explicitly
   represents a whole table or literature landscape.
3. Every featured paper must be either cited beside a matching claim, analyzed
   with `PaperSummary`, or explicitly classified as further-reading-only with a
   reason. A paper cannot silently be "featured" only because it appears on the
   final reference page.
4. Survey citations remain appropriate for taxonomy, counts derived from survey
   tables, synthesis, and the survey authors' framing. Method-specific,
   experimental, and historical claims cite the original paper.
5. Require locators for quantitative claims and paper-specific empirical
   findings. Simple paper-name examples may omit a locator when the entire work
   is the referent rather than one result.

## Reader experience

1. Preserve the dedicated final `Nguồn và bản đồ paper` page for every covered
   non-Quiz node.
2. Keep the prose readable: cite the pivotal source inline and expose additional
   relevant evidence in grouped reference-page sections.
3. Do not impose an arbitrary maximum paper count. Large lists are valid for
   explicit landscape/table nodes, but overview and synthesis nodes must not
   inherit unrelated section-wide references.
4. Add `PaperSummary` only when setup, finding, limitation, and relevance are
   needed to interpret a pivotal paper; do not turn every citation into a card.

## Metadata quality

1. Prefer DOI, publisher/proceedings, OpenReview, ACL Anthology, or official
   arXiv pages over Google Scholar search URLs.
2. Metadata improvements must be reproducible: add generator overrides or source
   parsing improvements rather than hand-editing `papers.generated.ts`.
3. Preserve survey bibliography keys as stable registry IDs in this pass, even
   when their capitalization is inconsistent, to avoid unnecessary MDX churn.

# Phases

## Phase 0 — Approval checkpoint

- Store this plan as the first write for the remediation task.
- Pause for explicit approval before changing registry, generator, tests,
  authored lessons, or documentation.

## Phase 1 — Strengthen the contract and tests

- Introduce typed claim-level coverage and evidence-role records.
- Retain section maps for intake while deriving rendered lesson references from
  reviewed claim rows.
- Add tests that reject unknown/duplicate claim IDs, unresolved paper IDs,
  featured evidence with no exposure decision, quantitative claim rows without
  locators, and accidental oversized broad-section inheritance.
- Preserve theory/Quiz concept equality and the dedicated reference-page runtime
  contract.

Checkpoint: contract tests pass before lesson migration.

## Phase 2 — Repair foundational and structural lessons

- Add primary citations beside the claims in Stability–Plasticity,
  Catastrophic Forgetting, TIL/DIL/CIL, Vertical/Horizontal continuity, replay,
  and the Chapter 4 bridge.
- Reconcile the ten currently unexposed featured-paper relationships.
- Keep foundational historical evidence distinct from evidence specifically
  established on LLMs.

Checkpoint: Chapters 1–3 have no featured-only reference relationship.

## Phase 3 — Repair empirical and quantitative lessons

- Audit CPT, DAP, CFT, evaluation, and discussion lesson claims against their
  primary papers and survey tables.
- Add precise section/table/figure locators to quantitative and paper-specific
  findings, including the DAP corpus/mixing figures and survey-derived DAP/CFT
  study counts found by the audit.
- Add a small number of high-value `PaperSummary` analyses for pivotal papers
  where the prose currently states a result without enough setup or limitation.

Checkpoint: every audited quantitative claim has a local evidence link and
locator; paper-specific conclusions no longer rely only on a page-final survey
citation.

## Phase 4 — Curate reference pages

- Build each final reference page from claim rows plus explicit further-reading
  groups.
- Remove unrelated §1/model-background spillover from overview and synthesis.
- Preserve complete survey-table evidence for genuine landscape nodes such as
  DAP by domain, but group it by the claims/domains taught.
- Review every node with more than 30 references and record why the larger set is
  necessary or narrow it to materially relevant evidence.

Checkpoint: reference-page membership is explainable claim by claim.

## Phase 5 — Improve metadata and documentation

- Replace recoverable Scholar fallbacks with canonical primary URLs and restore
  missing years through reproducible generator logic or reviewed overrides.
- Report any sources that cannot be resolved reliably instead of guessing.
- Update the existing Learning Lab wiki with the claim-row authoring workflow,
  evidence roles, locator rules, and paper-intake procedure.
- Record actual counts and exceptions in this execution log.

## Phase 6 — Verification

- Run focused registry, MDX, coverage, and reference-page tests after each phase.
- Run raw academic URL searches, unused-paper audits, duplicate identity checks,
  `npm run verify`, and `git diff --check`.
- Mark this plan done only after implementation, content, tests, build, and wiki
  documentation agree.

# Acceptance criteria

- Every taught claim has an explicit evidence decision: primary, secondary,
  further reading, or course analysis.
- Every featured paper is cited/analyzed in authored prose or has a documented
  further-reading-only reason enforced by tests.
- All quantitative and paper-specific empirical claims have useful evidence
  locators.
- Overview and synthesis no longer expose unrelated broad-section references.
- Large landscape reference pages remain complete for the exact table/topic
  taught and are grouped into understandable evidence roles.
- Generated metadata has no missing year unless documented as genuinely
  unavailable, and every recoverable Scholar fallback uses a canonical source.
- Quiz nodes, other Learning Lab domains, routes, locale fallback, authored MDX
  page counts, and the dedicated final reference-page behavior remain unchanged.
- `npm run verify` and `git diff --check` pass.

# Out of scope

- Adding new lesson topics or changing the Continual Learning TOC.
- Translating the domain into another locale.
- Downloading or bundling PDFs.
- Building a standalone cross-domain paper-library route.
- Treating every survey bibliography entry as relevant without a claim-level
  inclusion decision.

# Execution log

- 2026-08-13 — Completed a read-only domain audit and stored this remediation
  plan. No registry, generator, test, lesson, component, or wiki file was changed
  before the approval checkpoint.
- 2026-08-13 — User approved the remediation plan; contract and test work began.
- 2026-08-13 — Replaced automatic lesson-to-section unions with 40 reviewed
  claim rows across all 39 non-Quiz lessons. The rows resolve 399 evidence
  relationships: 149 inline, 3 `PaperSummary`, and 247 reasoned final-page
  relationships. Featured evidence is now required to appear in authored MDX.
- 2026-08-13 — Added or repaired foundational primary citations for catastrophic
  interference, stability–plasticity, TIL/DIL/CIL, vertical/horizontal
  continuity, replay, EWC, and the Chapter 4 bridge. Historical connectionist
  evidence is explicitly separated from LLM-specific evidence.
- 2026-08-13 — Audited the quantitative CPT, DAP, and CFT claims. Counts and
  paper-specific results now point to the applicable survey table or original
  paper section/figure; the DAP review also corrected the provenance of the
  Lawyer LLaMA 10B-token figure and the DSIR publication year.
- 2026-08-13 — Added high-value analyses for EWC, Lifelong Pretraining, and
  Spurious Forgetting. Authored prose now has 177 structured citations, 65 with
  explicit locators, compared with the 5-locator audit baseline. The citation
  renderer was fixed so a locator remains visible when a custom label is used.
- 2026-08-13 — Curated final reference membership from claim rows. Only the DAP
  domain landscape (70 sources from Table 2) and CFT overview (47 sources from
  Table 3/§§4.3.1–4.3.2) remain above 30 sources by design. Overview and
  synthesis are capped by regression tests and no longer inherit survey §1.
- 2026-08-13 — Regenerated 225 survey records and retained three reviewed
  external records. All 228 records have years; all 192 records exposed by a
  lesson have canonical primary URLs. The one remaining Scholar discovery URL
  is the unused `kandel2000principles` record, whose cited 2000 book edition has
  no stable open primary landing page in the survey metadata.
- 2026-08-13 — Updated the Learning Lab wiki with claim authoring, evidence
  exposure, locator, paper-intake, and metadata rules. Focused tests, TypeScript,
  `git diff --check`, and `npm run verify` all passed; the full verification ran
  88 tests and a production build.
