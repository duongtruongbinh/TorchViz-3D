---
title: "DINO-WM Research Paper Deep-Dive (Research Papers Domain)"
status: done
created: 2026-09-14T00:00:00+07:00
updated: 2026-09-14T23:45:00+07:00
author: hienlong
task: "Add the DINO-WM paper (ICML 2025) as a seven-lesson deep-dive track under the Random Research Paper domain"
supersedes:
  - docs/plans/2026-08-21-research-papers-domain-init.md
  - docs/plans/2026-09-07-nca-pre-pre-training-research-paper.md
---

# Goal

Add **DINO-WM: World Models on Pre-trained Visual Features enable Zero-shot
Planning** (Zhou, Pan, LeCun, Pinto — NYU Courant & Meta-FAIR, arXiv:2411.04983,
**ICML 2025 poster**) as a new seven-lesson track in the `research-papers`
("Random Research Paper") Learning Lab domain, following the established
seven-part paper curriculum (Abstract → Introduction → Method → Experiments →
Conclusion → Debate → Quiz), and keep the catalog, tests, images, stats, and
wiki in sync.

# Lineage

Builds on the Research Papers domain series:

- [2026-08-21-research-papers-domain-init.md](./2026-08-21-research-papers-domain-init.md) — domain init and the SDC-LoRA paper format.
- [2026-09-07-nca-pre-pre-training-research-paper.md](./2026-09-07-nca-pre-pre-training-research-paper.md) — the most recent seven-part paper addition and its quiz-leakage contract.

# Grounding facts (from the paper)

- **Authors/Affiliation:** Gaoyue Zhou, Hengkai Pan, Yann LeCun, Lerrel Pinto — Courant Institute, NYU; Meta-FAIR.
- **Venue:** ICML 2025 (poster). Camera-ready on OpenReview (`D5RNACOZEI`); arXiv 2411.04983; project site dino-wm.github.io; code gaoyuezhou/dino_wm.
- **Core claim:** A world model that (1) trains offline on pre-collected trajectories, (2) supports test-time behavior optimization, (3) is task-agnostic — by predicting future **frozen DINOv2 patch features** (not pixels, not task-learned latents) conditioned on action histories, then planning with MPC to reach goal patch features. Zero-shot on six environments with no expert demos, reward model, or pre-learned inverse model; outperforms prior SOTA on mazes, pushing, and multi-particle tasks.
- **Method skeleton for lesson 3:** frozen DINOv2 observation model → decoder-only ViT transition model (no tokenization layer, causal attention over patch-token history, proprioception + action conditioning, context length H, MSE loss on patch features) → CEM-based MPC matching goal patch features.

# Decisions (locked)

1. **Placement:** new chapter `dino-wm-paper` appended to
   `src/content/learning/research-papers/table-of-contents.ts`, hierarchical title
   `Computer Vision > World Models > (2025) DINO-WM` (mirrors
   `Computer Vision > Cellular Automata > (2026) MetaNCA`).
2. **Directory & numbering:** MDX files under
   `src/content/learning/research-papers/cv/world-models/dino-wm/`, numbered
   `1.5.1` … `1.5.7` (continuing the domain-wide 1.1–1.4 series; numbering is
   cosmetic — `parseLearningMdxPath` strips it).
3. **Lesson set (7 nodes, ids):** `dino-wm-abstract`, `dino-wm-introduction`,
   `dino-wm-method`, `dino-wm-experiments`, `dino-wm-conclusion`,
   `dino-wm-debate`, `dino-wm-quiz` — titles "Part 1: Abstract" … "Part 6:
   Academic Debates & Critical Analysis" + quiz, per the Sculpting/NCA format.
4. **Locale:** Vietnamese-first `.vi.mdx` only (domain `fallbackLocales: ['vi']`);
   English UI falls back to Vietnamese until an English MDX exists. Follow
   `.agents/rules/learning-lab-authoring.md` (minimal italics, concise bold,
   explicit formula shapes, no stacked headings, lead-in narrative per page).
5. **Quiz:** 16 questions, mixed modes pinned by a new test as
   `{ single: 7, multi: 4, order: 2, categorize: 3 }` (Sculpting Subspaces
   pattern). `conceptIds` in the quiz metadata must equal the ordered union of
   all theory-lesson `conceptIds`; quiz question ids must equal that set exactly.
   Enforce the anti-leakage contract: single-mode options close in length
   (longest ≤ 1.35 × shortest), correct answer never uniquely longest, all four
   answer positions used, no cyclic A→D three-answer pattern.
6. **Visuals:** reuse shared MDX components only (`ConceptHierarchy`,
   `ConceptFlow`, `ComparisonMatrix`, `PaperTradeoff`, `MetricBars`,
   `EvidenceCards`, `InlineMath`/`BlockMath`, `EquationCallout`, `LessonImage`,
   `MdxPage`, `MdxQuiz`). No new research-papers domain components; no changes
   to `mdxComponents.ts` registries.
7. **Images:** ~6–8 illustrations generated per the canonical doodle template
   (`.agents/rules/learning-lab-image-generation.md`, 16:9, rounded cards), named
   `01-…` … under asset path `research-papers/cv/world-models/dino-wm/…`,
   uploaded to R2 (`npm run sync:r2`) and verified with `npm run check:r2-assets`.
   Local staging: `src/assets/learning/research-papers/cv/world-models/dino-wm/`
   (git-ignored per the R2 migration; upload, don't commit binaries).
8. **Claim hygiene:** every number quoted in lessons comes from the
   camera-ready paper (six environments, DINOv2 patch features, ViT transition,
   CEM planning, zero-shot claims). Qualify extrapolations and causal claims as
   in the NCA audit precedent; link paper/project/code/dataset (OSF) in lesson 1.
9. **Branch:** `feat/add-dinowm-paper` (already checked out).

# Phases

## Phase 0 — Store this plan (this write) and get approval

Status: draft → approved on explicit user approval only.

## Phase 1 — Catalog registration

- Append the `dino-wm-paper` chapter (en/vi titles + descriptions, 7 `lessonIds`
  all `status: 'available'`, `contentStatus: 'published'`) to
  `src/content/learning/research-papers/table-of-contents.ts`.
- No changes needed to `src/content/learning/index.ts` (imports the TOC file) or
  `learningMdxRegistry` (glob-based).

## Phase 2 — Author the seven Vietnamese MDX lessons

Content outline (each lesson 5–7 `MdxPage`s, `headingContract: 'exact'`,
Vietnamese `title` matching the vi TOC title, `keywords`, theory lessons carry
`conceptIds`):

1. `1.5.1-dino-wm-abstract.vi.mdx` — the three desiderata (offline-trainable,
   test-time optimizable, task-agnostic); why predicting pixels or task-learned
   latents fails; the DINOv2 patch-feature bet; paper/author/code/dataset links;
   key numbers to remember; boundary of claims.
2. `1.5.2-dino-wm-introduction.vi.mdx` — related work: pixel-space world models
   (video diffusion cost), latent world models tied to reconstruction
   (Dreamer/TWM/IRIS), reward-prediction task-specificity, generative video
   world models; pre-trained visual representations (ResNet, I-JEPA, DINO v1/v2,
   V-JEPA, R3M, MVP); leading questions.
3. `1.5.3-dino-wm-method.vi.mdx` — frozen DINOv2 patch embeddings as observation
   model; decoder-only ViT transition model (no tokenization, causal attention,
   patch-level autoregression, proprioception/action conditioning, context
   length H, MSE on patch features); planning as goal-feature reaching via CEM
   MPC; no reward/inverse models.
4. `1.5.4-dino-wm-experiments.vi.mdx` — six environments (maze navigation,
   push manipulation, particle scenarios incl. multi-particle variants);
   baselines and metrics; success-rate tables transcribed from the paper with
   before/after framing; generalization to unseen maze configs / object shapes.
5. `1.5.5-dino-wm-conclusion.vi.mdx` — what frozen patch features buy
   (spatial/object-centric prior, generalization); limitations (offline data
   coverage, compute, camera sensitivity, low-res control); future directions.
6. `1.5.6-dino-wm-debate.vi.mdx` — zero-shot claims vs classical MPC;
   frozen-vs-learned representation debate; reconstruction-free world models and
   the JEPA line (LeCun); test-time compute; scrutiny of the task-agnostic claim.
7. `1.5.7-dino-wm-quiz.vi.mdx` — 16 questions per Decision 5; `pageCount: 16`;
   concept set exactly covering all theory `conceptIds` (target ~14–16 concepts).

## Phase 3 — Tests and contract updates

- `src/lib/learningCatalog.test.ts`: update pinned counts
  (`tracks 103 → 104`, `lessons 777 → 784`); inspect any other pinned
  research-papers assertions (readiness lists should be unchanged).
- `src/lib/learningMdxContent.test.ts`: add a
  "DINO-WM quiz covers the theory without answer-shape leakage" test mirroring
  the Sculpting Subspaces pattern (conceptIds equality, modeCounts, length
  balance, position coverage, cycle check).
- `src/lib/learningOnDemandBoundaries.test.ts`: inspect for pinned
  research-papers/lesson counts; adjust only what the new files change.

## Phase 4 — Illustrations and R2 upload

- Generate ~6–8 doodle-template images (one anchor visual per lesson minimum,
   e.g., problem triad, latent-vs-patch comparison, transition-model anatomy,
   planning loop, results bars, debate map).
- Stage under `src/assets/learning/research-papers/cv/world-models/dino-wm/`,
   upload via `npm run sync:r2`, then `npm run check:r2-assets` (requires
   `ASSETS_CDN_URL`/`R2_PUBLIC_URL` in `.env`).

## Phase 5 — Docs and stats sync

- `npm run sync:titles` → confirm MDX titles match catalog titles.
- `npm run sync:catalog-stats` → regenerate `wiki/reference/catalog-stats.md`
  (research-papers: 4/26/26 → 5/33/33; totals 104 tracks, 784 nodes, 316
  published, 468 placeholders).
- Update `wiki/concepts/learning-lab.md` headline counts and the research-papers
  prose (26 → 33 authored lessons).
- Append a line to `wiki/log.md` and fill this plan's Execution log.

## Phase 6 — Verify and commit

- `npm run verify` (typecheck + tests + production build) green.
- Commit on `feat/add-dinowm-paper` (never main). No push unless requested.

# Out of scope

- English (`en`) MDX variants for any research-papers lesson.
- New interactive components or research-papers domain adapters (e.g., no
  Dino-specific stepper; only shared components).
- TorchViz workspace/torchstub changes; Landing page changes; other domains.
- Re-auditing existing SDC-LoRA / Sculpting / NCA / MetaNCA lessons.

# Execution log

- 2026-09-14 — Plan created.
- 2026-09-14 — Approved by user ("proceed"); status → approved; execution started on `feat/add-dinowm-paper`.
- 2026-09-14 — Phase 1 done: `dino-wm-paper` chapter (7 lessons) appended to the research-papers TOC.
- 2026-09-14 — Phase 2 done: seven Vietnamese MDX lessons authored under `src/content/learning/research-papers/cv/world-models/dino-wm/` (1.5.1–1.5.7), grounded in arXiv 2411.04983v2 (ICML 2025). Fixed raw `$...$` math → `InlineMath`/`BlockMath formula=` components (MDX `{}` expression hazard), removed raw Greek letters (unrendered-math contract), aligned metadata headings exactly, consolidated theory conceptIds to 16.
- 2026-09-14 — Phase 3 done: catalog test counts updated (104 tracks / 784 lessons / 468 placeholders / 33 research-papers published); added "DINO-WM quiz covers the theory without answer-shape leakage" test with pinned mode mix {single 7, multi 4, order 2, categorize 3}; also normalized a pre-existing Windows path-separator bug in the NCA quiz test (`.includes('/research-papers/...')` never matched on Windows).
- 2026-09-14 — Phase 4 partial: six LessonImage slots authored with planned R2 asset paths under `research-papers/cv/world-models/dino-wm/`. Binary image generation and `npm run sync:r2` upload are NOT available in this session (no image tool; `@aws-sdk/client-s3` not installed; no `.env` credentials present). Assets must be generated per `.agents/rules/learning-lab-image-generation.md` and uploaded before deploying, otherwise the six images will render the localized load-error state.
- 2026-09-14 — Phase 5 done: `npm run sync:titles` clean; `npm run sync:catalog-stats` regenerated (104 tracks, 784 nodes, 316 published); `wiki/concepts/learning-lab.md` counts updated; `wiki/log.md` entry added.
- 2026-09-14 — Phase 6 done: `npm run verify` (typecheck + 161 tests + production build) green. Committed on `feat/add-dinowm-paper`.
