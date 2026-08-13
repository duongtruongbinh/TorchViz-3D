---
title: Continual Learning Citation Evidence Preview
status: executing
created: 2026-08-13T16:19:31+07:00
updated: 2026-08-13T16:36:47+07:00
author: Codex
task: "Plan a verified paper-excerpt preview for claim-level citations in the Continual Learning lessons"
supersedes:
  - docs/plans/2026-08-13-continual-learning-citation-audit-remediation.md
  - docs/plans/2026-08-13-continual-learning-inline-claim-citations.md
---

# Goal

Let a reader inspect the exact paper evidence behind an inline claim without
losing their place in the lesson. Hovering or focusing an authored `<Cite>`
should reveal a short, reviewed excerpt from the cited paper. From that preview,
the reader can open the closest verifiable source position or copy a stable text
fragment and find it in the paper.

This is an evidence-provenance feature, not a live paper viewer. It must never
fetch or parse a paper at hover time, invent an excerpt, or imply that a broad
paper section proves a narrower claim than the source supports.

# Lineage

This plan extends [Continual Learning Claim-Level Citation Remediation](./2026-08-13-continual-learning-citation-audit-remediation.md)
and [Continual Learning Inline Claim Citations](./2026-08-13-continual-learning-inline-claim-citations.md).
Those plans established stable paper IDs, claim-adjacent citations, locators,
and the dedicated final reference page. This plan adds a verifiable evidence
layer to the inline citations only.

# Confirmed reader flow

1. The reader encounters a citation immediately beside a theoretical claim.
2. Hover, keyboard focus, or touch reveals the source excerpt relevant to that
   exact claim.
3. The reader can open the paper at an HTML anchor, a PDF page, or the canonical
   paper page, in that priority order.
4. When a source cannot deep-link to the exact paragraph, the preview offers a
   copy action for a short exact search fragment so the reader can use
   `Ctrl/Cmd+F` in the paper.
5. Citations in the final `Nguồn và bản đồ paper` page remain ordinary paper
   links and do not instantiate evidence previews.

# Repository baseline

- `Cite` is a shared MDX component in
  `src/components/learning/learningMdxComponents.tsx`. It currently resolves a
  paper from lesson context and renders a direct external link.
- `learningMdxRegistry.tsx` already filters and injects lesson paper metadata.
  It is the correct boundary for injecting only the evidence needed by the
  current lesson.
- The Continual Learning domain currently contains 175 authored `<Cite>`
  occurrences across 39 non-Quiz MDX files, covering 93 unique papers and 129
  unique paper/locator pairs.
- Sixty-three occurrences have a locator and 112 do not. Paper ID plus locator
  is therefore not a sufficiently precise or complete evidence key.
- The final reference page is rendered by `LessonReferences` and
  `ReferencePaperList`, not authored `<Cite>` components, so it can remain
  preview-free by construction.
- The project has no floating-positioning dependency. The lesson surfaces use
  scroll/overflow containers, so an absolutely positioned child would be
  vulnerable to clipping.
- arXiv HTML exposes stable paragraph and section IDs for the pinned survey,
  for example `S4.SS2` and `S4.SS2.p1`; PDF sources can usually provide only a
  page-level fragment.

# Decisions (locked)

## Evidence identity and ownership

1. Add an occurrence-level `evidence` prop to authored citations:
   `<Cite paper="..." evidence="..." />`. A paper may support several claims,
   and each claim may require a different excerpt and verification target.
2. Keep evidence in a handwritten, React-free domain registry rather than in
   `papers.generated.ts` or inside MDX prose. Generated bibliography metadata
   owns paper identity; reviewed evidence owns claim-specific excerpts.
3. Every evidence record must include:
   - stable evidence ID;
   - lesson ID and claim ID;
   - paper ID;
   - exact source-language excerpt;
   - short exact `searchText` contained in the excerpt;
   - human-readable locator;
   - explicit verification URL and target precision;
   - source version/retrieval metadata;
   - review status and review date;
   - quotation basis: reviewed short quotation or an explicitly recorded
     redistributable source license.
4. Excerpts render as plain text. They cannot contain MDX, HTML, executable
   content, or remote markup.
5. The excerpt is evidence, not explanation. Vietnamese interpretation remains
   in the surrounding lesson claim; the preview preserves the paper's source
   language so the copied text can be found verbatim.

Proposed contract:

```ts
type CitationEvidence = {
  id: string;
  lessonId: string;
  claimId: string;
  paperId: string;
  excerpt: string;
  searchText: string;
  locator: string;
  verificationUrl: string;
  targetPrecision: 'html-anchor' | 'pdf-page' | 'landing-page';
  sourceVersion?: string;
  retrievedAt: string;
  review: {
    status: 'verified';
    verifiedAt: string;
  };
  quotation: {
    basis: 'short-quotation' | 'redistributable-license';
    licenseUrl?: string;
  };
};
```

## Source and quotation policy

1. Prefer a versioned publisher/proceedings HTML paragraph or versioned arXiv
   HTML anchor. Next prefer a canonical PDF with `#page=N`; otherwise use the
   canonical landing page.
2. Never automatically choose a paragraph using semantic similarity and publish
   it without review. Automation may locate candidates and verify exact text,
   but a human-reviewed manifest decides which excerpt supports the claim.
3. Never paraphrase text and present it as a paper quotation. If an exact
   excerpt cannot be reviewed or responsibly redistributed, that citation stays
   link-only and receives a documented coverage exception until resolved.
4. Keep quotations minimal: enough surrounding text to establish the claim, no
   abstract-sized or multi-paragraph copies. A short exact `searchText` must be
   sufficient for browser/PDF search even when the displayed excerpt is longer
   under an explicitly redistributable license.
5. Pin arXiv evidence to the reviewed version. A later paper version is treated
   as source drift requiring re-verification, not silently substituted.

## Verification-target policy

1. `html-anchor`: open the reviewed version and exact section/paragraph anchor;
   label the action `Mở đúng đoạn`.
2. `pdf-page`: open the canonical PDF with a page fragment; label it
   `Mở trang chứa đoạn`.
3. `landing-page`: open the canonical paper page; label it `Mở paper`, and make
   `Sao chép đoạn để tìm` the primary verification aid.
4. The UI never claims exact deep-link precision when only a page or landing
   page is available.

## Interaction model

The control is an interactive citation preview, not a non-interactive ARIA
tooltip.

- Fine pointer: open after a short hover-intent delay; keep the panel open while
  the pointer moves between citation and panel; close with a short grace period.
- Keyboard: visible focus opens the preview; `Escape` closes it; tab order can
  enter the preview actions and return naturally to lesson prose.
- Citation activation with mouse or keyboard preserves the current direct-link
  behavior and opens the verification URL in a new tab.
- Touch: the first tap opens/pins the preview rather than navigating. The
  explicit action inside the preview opens the verification target.
- Outside press, page change, lesson change, and a second citation opening close
  the current preview. Only one citation preview may be open at a time.
- Copy changes to `Đã sao chép` briefly and announces success through a polite
  live region. Copy failure exposes a concise retry state.
- Motion is a 150–200 ms opacity/translate state transition and becomes an
  instant or crossfade-only transition under reduced motion.

## UI direction

The surface stays in the existing restrained Learning Lab register: a focused
reader at a desk in a light environment needs evidence without losing reading
position. The panel reuses the current white/ice surface, deep-blue link/focus
tokens, Be Vietnam Pro typography, and 12–16 px radii.

The preview contains only the paper title plus author/year, the exact excerpt in
readable quotation styling, and two actions. `Sao chép đoạn để tìm` stays on the
left and `Mở đúng đoạn`/`Mở trang chứa đoạn`/`Mở paper` stays on the right.
Locator, version, review, and quotation-basis metadata remain in the evidence
registry and audit trail but are not repeated in the compact reader UI.

Use a 22–28 rem collision-aware panel on desktop and a viewport-constrained
anchored panel on compact screens. Render through a portal so lesson overflow
containers cannot clip it. Do not use a modal, embedded PDF, iframe, screenshot,
decorative glass effect, or nested card treatment.

Implementation should use `@floating-ui/react` rather than custom geometry.
Its official primitives cover hover/focus/dismiss interactions, collision
middleware, safe pointer traversal, focus management, and a body portal. The
dependency and Learning Lab bundle delta must be measured during verification.

## Runtime and data boundaries

1. No network request occurs on hover, focus, or tap.
2. The registry passes only evidence records referenced by the selected lesson
   into `LearningMdxLessonProvider`.
3. The shared `Cite` component stays domain-agnostic: it consumes evidence from
   context when available and remains a normal citation link for other domains.
4. The popover portal mounts only while open. Closed citations must not create
   hidden portal trees.
5. External URLs must be canonical HTTP(S) targets and open with
   `noopener`/`noreferrer`. Excerpt and metadata values render as text nodes.

# Phases

## Phase 0 — Approval checkpoint

- Store this plan as the only write for the task.
- Pause for explicit user approval.
- On approval, mark the plan `approved`, then `executing`, before implementation.

## Phase 1 — Evidence contract and offline validation

- Add the React-free evidence types, registry, and lesson/evidence selectors.
- Extend MDX inspection to collect `evidence` IDs from `<Cite>`.
- Add offline tests for unique IDs, known lesson/claim/paper relationships,
  paper-ID agreement, locator agreement, exact `searchText` containment,
  approved target schemes, version metadata, review status, quotation basis,
  and unused evidence records.
- Keep `evidence` optional in the shared component contract so other Learning
  Lab domains are unaffected; require it progressively through Continual
  Learning coverage gates.

Checkpoint: contracts and tests pass before rendering any preview.

## Phase 2 — Reproducible evidence intake and audit tooling

- Add a networked maintainer script that accepts a reviewed evidence manifest,
  downloads the declared HTML/source, verifies the exact search fragment, and
  reports source drift or broken deep links.
- Support versioned arXiv HTML first, then canonical HTML/proceedings sources,
  then PDF page verification. Candidate extraction may assist review but cannot
  write approved evidence automatically.
- Keep the normal test/build path offline and deterministic; the network audit
  is an explicit maintenance command.
- Document the manual fallback for sources that block automated access.

Checkpoint: the pinned survey evidence can be revalidated against arXiv v3 and
drift is reported without rewriting reviewed content.

## Phase 3 — Interaction component and Overview pilot

- Add `@floating-ui/react` and build a domain-agnostic citation-preview
  primitive with hover intent, focus, touch pinning, dismiss behavior, portal,
  collision handling, and non-modal focus management.
- Extend `LearningMdxLessonProvider` and registry assembly with lesson-filtered
  evidence.
- Pilot the feature on the Overview citations for survey §1, §4.2, §4.3.4 and
  the McCloskey/Cohen claim. These cover repeated paper IDs, multiple locators,
  a versioned arXiv HTML source, and an older non-arXiv source.
- Verify that direct activation still opens the correct target and the copy
  fallback finds the reviewed excerpt.

User checkpoint: review evidence fidelity, panel density, hover delay,
keyboard flow, and compact/touch behavior before domain-wide migration.

## Phase 4 — Domain evidence migration

Migrate in reviewable batches rather than generating 175 unreviewed previews:

1. Chapters 1–3: foundations, settings, methods, and continuity.
2. Chapter 4: CPT, DAP, CFT, refinement, alignment, and multimodal evidence.
3. Chapters 5–7 and code-lab interpretation claims.

For each batch:

- assign occurrence-level evidence IDs;
- resolve missing locators against the primary source;
- choose the minimal exact excerpt supporting the local claim;
- set target precision honestly;
- record link-only exceptions with a reason;
- run the network audit and offline contract tests;
- manually spot-check copy/search against representative HTML, PDF, and
  landing-page targets.

Do not mark migration complete based only on paper/locator pair counts: repeated
citations may support different local claims and require different evidence.

## Phase 5 — Coverage guardrails and accessibility verification

- Require every Continual Learning `<Cite>` in a non-Quiz authored page to have
  either a verified evidence ID or an explicit, documented link-only exception.
- Assert that final reference-page links never receive preview evidence.
- Add pure tests for target-label selection, URL construction, copy text, and
  state decisions that do not require a browser.
- Run a browser verification matrix:
  - mouse hover and safe pointer travel;
  - keyboard focus, tab order, Enter, and Escape;
  - screen-reader name/description relationships;
  - touch first-tap behavior;
  - 320 px compact layout and desktop collision edges;
  - zoom at 200%;
  - reduced motion;
  - clipboard success and failure;
  - route/page changes while a preview is open.

## Phase 6 — Performance, docs, and completion

- Measure Learning Lab bundle delta and confirm there are no hover-time network
  requests or layout overflow regressions.
- Update `wiki/concepts/learning-lab.md` with the evidence schema, authoring
  syntax, source-review workflow, deep-link precision, quotation policy, and
  maintenance audit command.
- Record actual coverage counts, exceptions, bundle delta, browser matrix, and
  source-drift results in this plan's execution log.
- Run focused MDX/evidence tests, `npm run verify`, and `git diff --check`.

# Acceptance criteria

- Inline theory citations expose evidence for their exact local claim; final
  reference-page links do not.
- No preview content is fetched at interaction time or selected by an unreviewed
  semantic match.
- Every displayed excerpt is exact source text backed by locator,
  version/provenance, review metadata, and a searchable exact fragment in the
  evidence registry.
- Clicking can verify at the closest honest target precision, and copy/search
  works when exact deep linking is unavailable.
- Hover, focus, keyboard, touch, dismiss, zoom, compact layout, and reduced
  motion behavior are usable and documented.
- Missing or inaccessible evidence is explicit and test-enforced rather than
  silently showing an empty or fabricated preview.
- Other Learning Lab domains, Quiz behavior, route/page counts, `PaperSummary`,
  and the dedicated reference page remain unchanged.
- `npm run verify` and `git diff --check` pass.

# Out of scope

- Rendering a live paper, PDF, iframe, screenshot, or full abstract in the
  preview.
- Adding previews to the final `Nguồn và bản đồ paper` page.
- Translating paper quotations and presenting the translation as source text.
- Runtime AI summarization, embeddings, semantic search, or remote excerpt
  generation.
- Automatically accepting a paragraph because it is textually similar to a
  lesson claim.
- Building a cross-domain paper-reader or annotation system.
- Tracking reader behavior or adding analytics in this pass.

# Risks and mitigations

- **Claim/excerpt mismatch:** occurrence IDs plus human review; no paper-level
  generic excerpt fallback.
- **Source drift:** version pinning, exact-fragment audit, and explicit review
  dates.
- **Copyright/licensing:** minimal quotations, quotation-basis metadata, license
  links where applicable, and link-only exceptions instead of copying uncertain
  text.
- **Broken deep links:** precision labels, copy/search fallback, and networked
  maintenance audit.
- **Popover clipping or viewport overflow:** body portal and Floating UI
  `flip`/`shift`/`size` middleware.
- **Hover-only exclusion:** focus, keyboard, touch, and explicit actions are
  first-class states.
- **Bundle growth:** lesson-filtered evidence, conditional portal mounting, and
  measured dependency/data deltas.
- **Migration scale:** chapter-based checkpoints and test-enforced exceptions;
  no bulk unreviewed generation.

# Execution log

- 2026-08-13 — Audited the current Cite renderer, registry boundary, MDX
  contract, design system, dependencies, source URLs, and authored citation
  counts. Confirmed 175 occurrences, 129 paper/locator pairs, 93 papers, and 112
  occurrences without locators.
- 2026-08-13 — Confirmed with the user that the feature shows a relevant paper
  excerpt rather than a live paper view; final reference-page links are excluded;
  HTML anchor → PDF page → landing page is the verification fallback, with a
  copy-to-find action when exact deep linking is unavailable.
- 2026-08-13 — Stored this draft plan. No dependency, runtime, content, evidence,
  test, or wiki file has been changed for this task.
- 2026-08-13 — User approved the plan; status advanced through approval to
  execution. Contract, validator, and Overview pilot work began.
- 2026-08-13 — Implemented the React-free evidence contract, eight reviewed
  Overview occurrence records, lesson-filtered registry injection, and optional
  `<Cite evidence="...">` authoring. The final reference page deliberately does
  not receive evidence data.
- 2026-08-13 — Added the Floating UI preview with hover intent, focus/Escape,
  safe pointer travel, first-tap touch pinning, collision-aware portal
  placement, exact-excerpt provenance, deep-link precision labels, and
  copy-to-find feedback. Existing citations without evidence remain direct
  links; unknown authored evidence renders an explicit error marker.
- 2026-08-13 — Corrected the Overview evidence placement: ClimateGPT directly
  supports RAG-as-external-context; survey §4.3.4 is now attached only to its
  narrower retrieval-based model-editing statement. ClimateGPT CPT, IFT, and
  RAG claims each have their own occurrence evidence.
- 2026-08-13 — Added an offline MDX/evidence coverage gate and the explicit
  `npm run audit:cl-citation-evidence` source-drift command. Seven versioned
  arXiv anchors passed the network audit. The McCloskey publisher target is a
  recorded manual exception because ScienceDirect returns HTTP 403 to automated
  maintenance requests; its publisher summary was reviewed in a browser.
- 2026-08-13 — Focused typecheck and all 88 tests passed. Production build
  passed with the existing large-chunk warning; the Learning Lab chunk is
  2,431.39 kB minified / 641.44 kB gzip. A conservative standalone upper-bound
  bundle of the complete Floating UI React entry is 91.61 kB minified / 32.58
  kB gzip; the application imports only the named, tree-shaken primitives.
- 2026-08-13 — Phase 3 Overview pilot reached the planned user checkpoint.
  Domain-wide migration remains intentionally unstarted pending review of
  evidence fidelity, panel density, hover delay, keyboard flow, and touch use.
- 2026-08-13 — Final `npm run verify`, the eight-record evidence audit, and
  `git diff --check` all passed at the checkpoint.
- 2026-08-13 — User approved the pilot with a compactness adjustment: removed
  the redundant preview heading, visible locator, and provenance line; placed
  copy on the left and source-open on the right. Maintenance provenance remains
  in the registry and validators.
