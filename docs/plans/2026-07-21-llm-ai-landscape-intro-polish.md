---
title: LLM AI Landscape Intro Polish
status: done
created: 2026-07-21T13:44:25+07:00
updated: 2026-07-22T00:00:00+07:00
author: Codex
task: "Redesign and extend the Vietnamese AI landscape lesson, its scope convention, and its checkpoint quiz."
supersedes:
  - docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md
---

# Goal

Make “Bức tranh tổng quan về AI” easier to scan and explore while giving
readers a practical, non-absolute convention for discussing AI, ML, DL, CV,
NLP, LLM, common data domains, and related job titles.

# Lineage

Continues [Learning Lab Content Architecture and LLM Course](./2026-07-14-approved-llm-lessons-mdx-migration.md).

# Decisions

- Keep the authored Vietnamese explanation and split its ideas clearly beside
  the existing illustration.
- Use a full-width nested scope visual: AI contains ML, ML contains DL, DL
  branches into CV and NLP, and NLP contains the highlighted LLM target.
- Make every scope keyword interactive. Selecting a keyword promotes it into
  the title bar, replaces the nested diagram with explanatory copy, and uses a
  left-arrow affordance to return to the overview.
- Treat the hierarchy as a course communication convention, not an absolute
  taxonomy. Explain that CV and NLP predate modern deep learning and retain
  traditional image-processing, rule-based, and statistical methods.
- Compare ML, CV, and LLM as compact horizontal lanes organized by common
  problems, tools/models, and work skills.
- Use role labels as scope-setting hints rather than rigid boundaries: AI
  Engineer commonly suggests unstructured CV/NLP work, while Data Scientist
  commonly suggests tabular/time-series work, without preventing cross-domain
  practice.
- Keep authored content in locale MDX and domain-specific presentation in the
  existing LLM renderer package and MDX component registry.
- Use full-width lesson prose and a global 16px/28px Learning Lab reading size;
  reserve smaller type for labels, captions, and metadata.
- Use Be Vietnam Pro across the Learning Lab shell and authored content while
  preserving monospace typography for code-specific surfaces.
- Soften Learning Lab light-mode typography from near-black to a navy-ink
  hierarchy while preserving code surfaces, overlays, domain colors, and the
  light-only runtime mode.
- Use one blue treatment for unfinished lesson markers and titles, keep
  completion green, and show a question icon inside unfinished Quiz markers
  instead of numbering Quiz nodes or adding a separate icon column.
- Extend the Token IDs lesson with a Vietnamese ambiguity example showing that
  lookup IDs do not encode contextual meaning; defer context-sensitive semantic
  representations to the later Transformer stage.
- Present the ambiguity page as a full-width two-context comparison that makes
  the shared token ID and later Transformer interpretation visually immediate.
- Add LLM Evaluation & Safety as chapter 2.2 after LLM Fundamentals so learners
  establish measurement, risk, and comparison practices before prompt
  engineering and API work; preserve existing chapter IDs while shifting their
  visible numbering.
- Publish the selected Evaluation & Safety source material as plain authored
  Vietnamese MDX across the chapter nodes before introducing custom visuals or
  interactive renderers. Each node should remain focused, full-width, and own
  its content inside the locale-MDX boundary.
- Reuse the existing `loss-perplexity-hand-calculation` node for a three-page
  content-first lesson connecting perplexity to pre-training evaluation and
  contrasting it with open-ended post-training evaluation.
- Do not show source-attribution lines inside lesson content unless the user
  explicitly requests citations for that lesson.
- When a lesson makes a concrete quantitative claim, attach the requested
  primary-source reference directly to that claim rather than restoring a
  generic source footer.

# Execution log

- 2026-07-21 — Reworked the opening copy flow and implemented responsive,
  light/dark nested scope boxes with an amber LLM focal state.
- 2026-07-21 — Removed superseded layout iterations and retained only the final
  renderer/content changes.
- 2026-07-21 — Added click-to-focus AI/ML/DL/CV/NLP/LLM explanations with
  staggered copy reveal, Escape support, disclosure chevrons, and a title-bar
  back affordance.
- 2026-07-21 — Expanded the scope descriptions with data types, representative
  applications, role expectations, and the distinction between traditional ML
  and deep learning.
- 2026-07-21 — Redesigned the second page as compact ML/CV/LLM comparison lanes
  with bullet-based problem, tooling, and skill columns.
- 2026-07-21 — Added a third page explaining the course's domain-plus-method
  convention, including traditional CV and NLP methods and a responsive visual
  equation.
- 2026-07-21 — Expanded the checkpoint quiz to cover the course convention,
  problem-domain selection, and the non-absolute relationship between role
  titles and data domains; removed repeated title, prompt, and feedback copy.
- 2026-07-21 — Removed local prose-width constraints across Learning Lab lesson
  copy and standardized reading paragraphs, list items, and blockquotes at
  16px/28px with Be Vietnam Pro.
- 2026-07-21 — Removed the redundant “Những thành phần chính khi training LLMs”
  heading from the fourth node while preserving its lead and five components.
- 2026-07-22 — Approved a focused light-mode color trial: replace near-black
  Learning Lab text with role-based navy title, body, and muted tones without
  changing layout, authored content, or Workspace styling.
- 2026-07-22 — Applied the navy-ink hierarchy across shared light-mode theme
  surfaces, prose, controls, quiz and pager disabled states, input text, and the
  LLM concept interaction; retained dark code surfaces and overlays unchanged.
- 2026-07-22 — Approved a sidebar follow-up to strengthen the inactive Home and
  domain navigation color without changing active, hover, layout, or icon logic.
- 2026-07-22 — Darkened inactive left-sidebar Home and domain navigation from
  slate `#475569` to navy `#263B5B`; retained the active `#123B68` state.
- 2026-07-22 — Approved a lesson-node palette trial that preserves Theory and
  completion colors while replacing gray, bright violet, and orange markers.
- 2026-07-22 — Removed the unfinished-node neutral marker layer, retained gray
  only for connectors, and changed Quiz to subdued indigo and Code to muted
  terracotta across marker, title, selected, hover, and dormant dark variants.
- 2026-07-22 — Approved replacing the indigo/terracotta palette trial with a
  unified blue marker/title treatment and a dedicated lesson-kind icon column.
- 2026-07-22 — Unified unfinished lesson markers and titles in blue, added
  BookOpen/CircleHelp/Code2 icons between the marker and title, and preserved
  green completion checks plus gray progress connectors.
- 2026-07-22 — Approved removing the dedicated lesson-kind icon column and
  placing a question icon directly inside unfinished Quiz markers instead of a
  lesson number.
- 2026-07-22 — Restored the compact two-column lesson row and replaced only
  unfinished Quiz marker numbers with CircleHelp icons; Theory/Code numbering
  and completed green checks remain unchanged.
- 2026-07-22 — Approved removing the outer marker border, background, and
  shadow from unfinished Quiz icons while preserving their rail alignment.
- 2026-07-22 — Rendered unfinished Quiz markers as standalone blue CircleHelp
  icons with no outer border, background, or shadow, including a visible blue
  selected state; completed Quiz nodes still use the green check marker.
- 2026-07-22 — Approved enlarging the standalone Quiz icon without changing
  the marker column or surrounding lesson-row spacing.
- 2026-07-22 — Increased unfinished Quiz icons from 16px to 20px while keeping
  the existing 28px marker footprint and rail alignment.
- 2026-07-22 — Approved excluding Quiz nodes from visible lesson numbering so
  numbered nodes remain sequential, and enlarging Quiz icons to 24px.
- 2026-07-22 — Changed chapter-visible numbering to count only non-Quiz nodes,
  producing the `1, 2, ?, 3, ?, 4…` rail rhythm without changing route or
  traversal order, and increased standalone Quiz icons from 20px to 24px.
- 2026-07-22 — Approved dimming unfinished Quiz icons and titles while they are
  not selected, with full emphasis restored on hover or selection.
- 2026-07-22 — Dimmed unselected unfinished Quiz icons and titles to 45%, with
  full opacity on hover/selection; left completed checks and connectors intact.
- 2026-07-22 — Approved applying Be Vietnam Pro to the full Learning Lab UI,
  including its shell, sidebar, rail, controls, lesson content, and quizzes.
- 2026-07-22 — Applied Be Vietnam Pro at the Learning Lab root, loaded weights
  400–900, and retained monospace overrides for code-specific content.
- 2026-07-22 — Approved a selected lesson-row trial with a solid blue surface
  and white title, marker text, and Quiz icon.
- 2026-07-22 — Highlighted selected light-mode lesson rows with solid blue and
  white foreground text/icons while retaining green completed markers.
- 2026-07-22 — Approved flattening selected markers into the row highlight and
  letting the selected surface visually cover its connector segment.
- 2026-07-22 — Removed selected marker background, border, and shadow so its
  number/icon/check renders directly in white, and hid the selected row's own
  connector segment beneath the solid highlight.
- 2026-07-22 — Approved adding a white border around the selected lesson-row
  highlight while keeping its internal marker borderless.
- 2026-07-22 — Changed the selected lesson-row border from transparent to solid
  white; retained the blue fill and borderless internal marker.
- 2026-07-22 — Approved softening the selected-row white border and shadow so
  the highlight remains connected to the timeline rather than reading as a card.
- 2026-07-22 — Reduced the selected-row border to 50% white and tightened its
  blue shadow from 8px/18px at 22% to 4px/10px at 14% opacity.
- 2026-07-22 — After the user's local undo, identified connector bleed through
  the translucent Quiz icon and approved an opaque icon-interior mask without
  restoring an outer marker border.
- 2026-07-22 — Moved Quiz dimming from wrapper opacity to translucent stroke
  color and added an opaque rail-colored circular mask behind the icon, stopping
  connector bleed while retaining the borderless appearance and hover emphasis.
- 2026-07-22 — Approved reducing emphasis on inactive lesson-filter labels so
  the selected All/Ready/Locked state reads immediately, with hover restoration.
- 2026-07-22 — Reduced inactive rail-filter text from 58% to 34% navy opacity
  and restored full navy plus a light surface on hover or keyboard focus.
- 2026-07-22 — Diagnosed the invisible filter change: the direct-child CSS
  selector did not match the nested LessonRail aside, and `/34` was not a
  reliable generated Tailwind opacity utility.
- 2026-07-22 — Corrected the filter selectors to match descendant asides and
  replaced the uncertain opacity utility with explicit 30% navy RGBA, retaining
  full-color hover and keyboard-focus states.
- 2026-07-22 — Approved one global 50% Learning Lab muted-opacity token based
  on the lesson-search placeholder, shared by inactive filters, Quiz labels and
  icons, and other intentionally quiet lesson-node text.
- 2026-07-22 — Added `--learning-lab-muted-opacity: 0.5` plus a shared muted
  utility, aligned the search placeholder, inactive filters, Quiz icon/title,
  and quiet lesson text to it, and retained full opacity on hover/focus.
- 2026-07-22 — Approved a fourth Token IDs lesson page using the Vietnamese word
  “đường” to distinguish tokenizer lookup identity from Transformer-contextual
  meaning.
- 2026-07-22 — Added “Một ID chưa đủ để hiểu nghĩa” as page 3/4 of the Token IDs
  lesson, contrasting “con đường” with “thêm đường” under the same illustrative
  ID and bridging explicitly to context-sensitive Transformer representations;
  moved the existing round-trip page to 4/4 and updated its page-count fixture.
- 2026-07-22 — Approved redesigning the new semantic-limit page as a dedicated
  full-width LLM-domain visual while preserving MDX content ownership.
- 2026-07-22 — Replaced the semantic-limit prose with a full-width comparison
  visual: one shared token/ID pair, two sentence contexts for “đường”, an
  explicit identity-versus-meaning contrast, and a final Transformer bridge.
- 2026-07-22 — Approved a second visual direction for the semantic-limit page:
  replace the paired-card layout with one quieter editorial comparison surface
  that keeps the shared token ID visually fixed across both sentence contexts.
- 2026-07-22 — Reworked the page into one editorial comparison table with a
  fixed tokenizer-output header, two scannable sentence rows, compact meaning
  labels, and a high-contrast Transformer conclusion band.
- 2026-07-22 — Approved reducing copy further and replacing the comparison
  table with a visual convergence diagram: two contexts flow into one shared
  token ID, followed by one concise Transformer takeaway.
- 2026-07-22 — Replaced the table with a low-copy convergence diagram: two
  example sentences and short meanings point to one shared `đường → 2048`
  node, ending with a single Transformer-context pill.
- 2026-07-22 — Approved promoting “Hai ngữ cảnh, cùng một token ID” to the page
  title and replacing the shared center node with a token-ID sequence beneath
  each sentence, highlighting the `đường` ID in both sequences.
- 2026-07-22 — Promoted the comparison phrase to the authored page heading,
  added a distinct ID sequence below each context arrow, highlighted ID `2048`
  at the matching `đường` position, and removed the redundant shared-ID node.
- 2026-07-22 — Approved removing the inline ID/meaning labels and Transformer
  pill, replacing them with one full-width explanatory paragraph below the
  two-sequence visual.
- 2026-07-22 — Removed the two inline conclusion labels and Transformer pill;
  the visual now ends after the ID sequences and hands off to one full-width
  authored paragraph explaining token identity versus contextual meaning.
- 2026-07-22 — Approved preserving the explanatory copy verbatim while giving
  it a distinct, lightweight callout treatment below the visual.
- 2026-07-22 — Restyled the unchanged explanatory paragraph as a full-width,
  accent-tone information callout with a slim leading edge and compact icon.
- 2026-07-22 — Approved adding the token-ID-versus-context distinction to the
  adjacent Token IDs checkpoint quiz as a new authored question.
- 2026-07-22 — Added the `token-id-context` quiz question using the two meanings
  of “đường”, expanded the quiz to four pages, and updated its expected question
  IDs and page-count fixture.
- 2026-07-22 — Approved rewriting the new context question's answer choices so
  they read naturally and the distractors remain plausible without changing the
  tested concept.
- 2026-07-22 — Rewrote all four `token-id-context` options with shorter,
  parallel explanations; the correct answer now states that ID `2048`
  identifies the token while the model learns its specific meaning from context.
- 2026-07-22 — Approved a global QuizBlock presentation change: hide each
  question's authored title and promote only its prompt in the Learning Lab blue.
- 2026-07-22 — Updated the shared QuizBlock renderer so all quizzes display only
  the question prompt, using semibold Learning Lab blue; authored titles remain
  in MDX data to preserve the content contract but are no longer rendered.
- 2026-07-22 — Approved treating text inside Vietnamese curly quotation marks
  as inline-code emphasis across shared quiz prompts, options, and feedback.
- 2026-07-22 — Extended the shared quiz inline-code renderer to recognize both
  backtick spans and curly-quoted examples, so quoted tokens and phrases receive
  the same code-chip treatment without per-question MDX edits.
- 2026-07-22 — Approved replacing the shared source-code header's braces icon
  and Python label with macOS-style red, yellow, and green window controls while
  preserving output headers and all code-block behavior.
- 2026-07-22 — Replaced the shared source-code header label with accessible
  macOS traffic-light controls; retained the terminal-labelled Output variant,
  copy button, header actions, highlighting, and code behavior unchanged.
- 2026-07-22 — Approved reducing the macOS traffic-light controls from 12px to
  10px and restoring the Python label beside them without the braces icon.
- 2026-07-22 — Reduced the traffic-light controls to 10px, tightened their
  spacing, and restored the code block's Python label beside the dots.
- 2026-07-22 — Confirmed the macOS chrome is owned by the shared Learning Lab
  `CodeBlock` template: every current source/output code surface imports this
  component, and no parallel fenced-MDX or duplicated code-block UI exists.
- 2026-07-22 — Approved softening the traffic-light chrome after visual review:
  reduce the dots further, remove inset shadows, mute their colors, and relax
  the uppercase Python label.
- 2026-07-22 — Reduced the shared traffic-light dots to 8px, replaced the vivid
  macOS primaries with muted red/amber/green, removed their inset shadows, and
  restyled the Python label in sentence case.
- 2026-07-22 — Approved removing the visible Python label from the shared code
  header while retaining it in the accessible code-window label.
- 2026-07-22 — Removed the visible Python label from the global code template;
  the source header now shows only the three muted traffic-light dots.
- 2026-07-22 — Approved adding a typed-TOC `2.2 LLM Evaluation` chapter between
  LLM Fundamentals and Prompt Engineering, then shifting later visible chapter
  numbers without changing their stable IDs.
- 2026-07-22 — Added typed-TOC chapter `llm-evaluation` with 15 planned nodes
  spanning datasets, metrics, human/model judges, contamination, safety,
  hallucination, RAG, production regression, A/B tests, and an evaluation
  harness; renumbered the following chapter labels to 2.3–2.6 and added
  evaluation to the domain summary without changing existing IDs.
- 2026-07-22 — Reviewed the Notion source “LLM Series: Evaluation & Safety” and
  approved selectively expanding chapter 2.2 with inter-rater agreement, judge
  bias, refusal calibration, prompt attacks, guardrails, and red teaming rather
  than mirroring the source article one-to-one.
- 2026-07-22 — Renamed the visible chapter to `2.2 LLM Evaluation & Safety` and
  refined it into 20 planned nodes: consolidated automatic metrics, human and
  pairwise evaluation, agreement and judge bias, benchmark/factuality/RAG eval,
  safety and refusal behavior, privacy and prompt attacks, guardrails, red
  teaming, production regression/A-B testing, and a code evaluation harness.
- 2026-07-22 — Approved the content-first phase: transfer and adapt the Notion
  source into the chapter's authored MDX nodes now, explicitly deferring visual
  design and custom renderer work to a later review.
- 2026-07-22 — Adapted the Notion Evaluation & Safety source into twenty
  Vietnamese-first, one-page authored MDX lessons. Published all twenty through
  typed TOC seeds, retained source trace links, updated the MDX count/page-count
  fixture, and synchronized the Learning Lab wiki to 82 tracks, 652 nodes, and
  50 authored lessons. No custom renderer or visual design was introduced.
- 2026-07-22 — Approved removing all visible `Nguồn nội dung` lines and
  strengthening the opening lesson with a quantitative production-risk hook,
  without adding citations until explicitly requested.
- 2026-07-22 — Removed the repeated source-attribution line from all twenty
  Evaluation & Safety lessons. Reworked the opening around 3 million reviews,
  90 AI applications, and roughly 20,000 hallucination-related candidate
  reviews before contrasting leaderboard performance with production trust.
- 2026-07-22 — Approved adding a direct primary-paper reference to the opening
  3-million/90-app/20,000-candidate-review statistic while keeping generic
  source footers removed.
- 2026-07-22 — Linked the quantitative hook directly to the Scientific Reports
  paper and clarified that the 20,000 items were heuristic candidate reviews,
  not 20,000 manually confirmed hallucination reports.
- 2026-07-22 — Approved changing the opening paper link to a numeric inline
  citation placed at the end of the supported sentence.
- 2026-07-22 — Replaced the linked claim text with a compact clickable `[1]`
  citation at the end of the quantitative sentence.
- 2026-07-22 — Approved a shared MDX-link distinction so numeric citations use
  a lightweight superscript treatment instead of the normal document-link pill.
- 2026-07-22 — Updated the shared MDX link primitive to detect `[number]`
  citations and render them as compact blue superscript links; ordinary links
  retain the existing bordered document-button treatment.
- 2026-07-22 — After visual review, approved moving numeric citations back to
  the text baseline and reducing their weight so they remain attached to the
  sentence instead of floating above it.
- 2026-07-22 — Removed superscript alignment from numeric citations, increased
  them slightly to 0.8em, and reduced the weight from black to bold.
- 2026-07-22 — Approved making numeric citations inherit the surrounding text's
  size, weight, line height, and baseline, with color as the only resting cue.
- 2026-07-22 — Removed all citation-specific typography; `[1]` now inherits the
  paragraph exactly and differs only by blue link color plus hover underline.
- 2026-07-22 — Approved publishing the existing Perplexity placeholder from the
  supplied Yann Dubois lecture notes, split into core perplexity, pre-training
  benchmarks, and post-training judge-based evaluation; visual design remains
  deferred.
- 2026-07-22 — Published `loss-perplexity-hand-calculation` as the three-page
  “Perplexity và đánh giá LLM” lesson: loss-to-perplexity interpretation and
  tokenizer comparability, MMLU-style likelihood evaluation and contamination,
  then post-alignment human/judge evaluation with AlpacaEval and verbosity bias.
  Updated the page-count fixture and Learning Lab authored-content counts; no
  custom renderer or visual design was added.
- 2026-07-22 — Approved expanding the first Perplexity page with the full
  sequence-level formula from total negative log-likelihood, a component-by-
  component explanation, and a short numerical interpretation. Reuse the
  existing KaTeX loss-derivation surface; keep the change local to authored
  lesson content.
- 2026-07-22 — Expanded the first Perplexity page with the base-2 sequence
  formula, explicit definitions for the sequence, context, conditional token
  probability, total NLL, product, and length-normalizing exponent, plus the
  equivalent natural-log form and a four-token numerical example. Reused the
  existing `LlmLossDerivation` renderer without changing the MDX contract.
- 2026-07-22 — Approved adding a concrete next-token example to the Perplexity
  introduction so “the probability assigned to every correct token” is clear
  before the learner reaches the formal definition.
- 2026-07-22 — Added the short sequence `Tôi thích học AI` to the introduction,
  walking through the expanding left context and connecting its four correct
  next-token predictions directly to the aggregate Perplexity score.
- 2026-07-22 — Approved removing the redundant page heading “Perplexity trong
  pre-training” and rendering the mathematical symbols inside the sequence-
  notation explanation with inline KaTeX instead of Unicode/plain text.
- 2026-07-22 — Removed the page-level heading and added opt-in inline KaTeX
  handling to `LlmLossDerivation` explanations. The sequence explanation now
  renders `x_{1:L}`, `L`, `x_i`, `i`, and `x_{1:i-1}` as mathematics while
  leaving ordinary explanation text unchanged.
- 2026-07-22 — Approved replacing the dense `Tôi thích học AI` example
  paragraph with a compact prediction flow that separates each left context
  from its correct next token and keeps the Perplexity takeaway secondary.
- 2026-07-22 — Replaced the example paragraph with a responsive four-step
  sequence surface: each row pairs the growing left context with its blue
  target-token chip, while the aggregate Perplexity explanation remains a
  single quiet line below. Registered the local renderer through the existing
  typed domain-MDX component boundary.
- 2026-07-22 — Approved extending each Perplexity example step through the
  model, the probability assigned to the correct target, and its token loss,
  then aggregating average loss into the final Perplexity value.
- 2026-07-22 — Extended the four example positions into `context → Model`, then
  `p(correct token) → token loss`. Added coherent sample probabilities, derived
  base-2 losses in the renderer, and summarized their average as `PPL ≈ 1.84`,
  matching the base-2 definition presented immediately below.
- 2026-07-22 — Approved restructuring the entire teaching sequence so concepts
  are introduced before calculation: brief motivation, example sentence,
  sequence notation, correct-token probability, numeric substitution, total
  sequence loss, numeric loss, product/length normalization, then the complete
  general formula. Remove premature loss/PPL results from the example visual.
- 2026-07-22 — Reordered the Perplexity derivation to the approved progressive
  flow. The example surface now shows only the four-token sentence; the lesson
  then maps it to `x_{1:4}`, introduces conditional probability, substitutes
  four model probabilities, derives total and average base-2 loss, evaluates
  the normalized probability product as `PPL ≈ 1.84`, and ends with the general
  sequence-level formula.
- 2026-07-22 — Approved removing the intermediate derivation heading and lead
  so the example flows directly into the first “Chuỗi và vị trí” stage.
- 2026-07-22 — Removed both lines from the authored Perplexity content and made
  the existing derivation renderer's title optional, preserving titled use in
  other lessons while allowing this flow to begin directly with its first step.
- 2026-07-22 — Approved removing the explanatory sentence below the numeric
  probability substitution while retaining the formula and step label.
- 2026-07-22 — Removed the sentence and made derivation-step explanations
  optional, so the numeric substitution card ends cleanly at its formula while
  all other explanatory copy remains unchanged.
- 2026-07-22 — Approved rewriting the correct-token probability explanation to
  distinguish the model's full next-token distribution from the single
  probability read by the evaluator.
- 2026-07-22 — Rewrote the explanation in two sentences: first the model creates
  a next-token probability distribution from the left context; then evaluation
  reads the probability assigned to the token that actually appears, `x_i`.
- 2026-07-22 — Approved reusing the existing loss-derivation card treatment for
  “Loss của cả chuỗi” and adding an opt-in minus-sign toggle. With the sign on,
  negative log-probability becomes non-negative loss; with it off, the learner
  sees the negative sequence log-likelihood before the loss transformation.
- 2026-07-22 — Extended the existing `LlmLossDerivation` step contract with an
  optional alternate formula/explanation and accessible switch. The sequence-
  loss step now toggles between `Σ log₂ p ≤ 0` and `−Σ log₂ p = loss ≥ 0`, while
  every derivation step without alternate content retains its prior rendering.
- 2026-07-22 — Corrected the intended reuse scope after visual review: the loss
  step must also reuse the running probability-curve interaction from
  `LlmLossHandCalculation`, not only its derivation-card styling. Add a slider
  and a single graph that flips between `log₂(p)` and `−log₂(p)` with the sign
  toggle.
- 2026-07-22 — Added the running graph to the sequence-loss step. Its probability
  slider moves the plotted point and numeric value; the existing sign switch now
  flips the same chart, axis, curve, formula value, and explanation between
  negative `log₂(p)` and positive `−log₂(p)`. Extended the shared curve primitive
  with an optional axis label while preserving its existing natural-log uses.
- 2026-07-22 — Approved refining the sign interaction: preserve the formula's
  layout and only dim the minus glyph when disabled. Replace the mode-swapping
  chart with one centered plot containing both `log₂(p)` and `−log₂(p)` curves;
  the active curve and point remain prominent while the other fades.
- 2026-07-22 — Reworked the interaction accordingly. The symbolic and numeric
  formulas reserve the minus sign's space and animate only its opacity. A new
  centered comparison chart keeps both mirrored curves and both probability
  points visible; the switch changes their emphasis instead of replacing the
  graph, while the shared slider moves both points together.
- 2026-07-22 — Approved correcting the minus-sign switch alignment after visual
  review; explicitly anchor the thumb inside its track instead of relying on
  the absolute element's static position.
- 2026-07-22 — Anchored the 16px thumb at a 2px left/top inset, constrained it
  inside the 36×20px track, and changed the on-state travel to exactly 16px.
- 2026-07-22 — Approved keeping the sequence-loss explanation identical across
  switch states and replacing the on/off copy with one mathematical motivation:
  negate non-positive log-probability so loss spans `[0, +∞)`, with zero as the
  best case.
- 2026-07-22 — Replaced the two state-dependent explanations with one fixed
  sentence covering the loss range and both limits; the switch now changes only
  visual emphasis and numeric sign, never the explanatory copy.
- 2026-07-22 — Approved adding a compact length-normalization example to the
  `1/L` step: compare two- and four-token sequences with identical per-token
  probability, show their raw products differ, then show their geometric means
  match. Keep the current sentence's `PPL ≈ 1.84` calculation in the same step.
- 2026-07-22 — Expanded the existing KaTeX block with the `0.5²` versus `0.5⁴`
  raw-product comparison, their matching geometric mean of `0.5`, the implied
  `PPL = 2`, and the original four-token sentence result of `PPL ≈ 1.84`; no
  additional chart or renderer surface was introduced.
- 2026-07-22 — Approved redesigning the dense aligned formula into a structured
  comparison: separate 2-token and 4-token rows, show raw product flowing to
  the length-normalized value, then isolate the current sentence result below.
- 2026-07-22 — Replaced the dense formula with an opt-in comparison layout in
  the existing derivation step: each peer row reads `token count → raw product
  → geometric mean`, both converge visibly on `0.5`, and the current sentence's
  `PPL ≈ 1.84` sits on a distinct summary strip below.
- 2026-07-22 — Approved changing the length-normalization comparison from a
  row-wise shortcut into a teaching sequence: raw product first, 2/4-token
  substitutions, one brief limitation, then introduce the `1/L` exponent and
  substitute the same values again. Keep the final explanation concise.
- 2026-07-22 — Rebuilt the block as the approved vertical flow: ordinary product
  formula, two raw-product examples, one-line length-bias limitation, downward
  transition to the `1/L` formula, the same two examples after normalization,
  then the current sentence's `PPL ≈ 1.84`. Reduced the closing copy to one
  sentence about length normalization and inversion.
- 2026-07-22 — Approved retaining the original product expression during the
  second substitution: show `(0.5²)¹ᐟ²` and `(0.5⁴)¹ᐟ⁴` instead of replacing the
  inner products with their decimal results before applying `1/L`.
- 2026-07-22 — Updated both normalized examples to keep the probability product
  visible inside parentheses before applying the length exponent.
- 2026-07-22 — Approved removing the current-sentence result strip and the
  closing explanatory sentence from the length-normalization block, so it ends
  immediately after the two normalized substitutions.
- 2026-07-22 — Removed both surfaces and deleted the now-unused authored field
  and renderer branch; preserved the independently edited limitation copy in
  the same block.
- 2026-07-22 — Approved deriving the left-hand `2^{\mathcal L_2/L}` expression
  gradually from the already-understood probability product: insert base-2 log
  and its inverse, expand log of a product into a sum, then identify that sum as
  average sequence loss before presenting the full equality.
- 2026-07-22 — Replaced the single full-formula card with three derivation cards:
  `z = 2^{log₂ z}`, log-product expansion into `−(1/L)Σ log₂ p_i`, and recognition
  of `−Σ log₂ p_i` as total sequence loss, yielding `PPL = 2^{L₂/L}`.
- 2026-07-22 — Approved replacing the interleaved derivation with two complete,
  sequential paths. Finish `probabilities → product → geometric mean → inverse
  → PPL` first; only then introduce `sequence NLL → average NLL → exp → same
  PPL`. Remove the three `2^{log₂}` bridge cards and use `ln/exp` consistently
  with the earlier loss lesson and interactive graph.
- 2026-07-22 — Reordered the lesson accordingly. The probability path now ends
  at the inverse geometric mean before the loss graph appears. The loss path
  uses natural-log NLL (`2.449` total, `0.612` average) and finishes with
  `exp(0.612) ≈ 1.84`. Converted the dual-curve graph and live numeric display
  from base-2 log to `ln`, and retained log₂ only as a brief equivalent note.
- 2026-07-22 — Approved replacing the abstract “geometric mean closer to one”
  explanation with concrete inverse examples that directly show why a better
  token probability produces a lower Perplexity.
- 2026-07-22 — Rewrote the inverse explanation around `0.5 → PPL 2` and
  `0.8 → PPL 1.25`, making the probability-up/Perplexity-down relationship
  explicit without relying on “direction” terminology.
- 2026-07-22 — Approved rebuilding the page opening before the worked example:
  distinguish training NLL loss (best `0`) from the derived evaluation metric
  Perplexity (best `1`), defer the deeper evaluation motivation, present the
  complete `ln/exp` formula once, then transition into a step-by-step reading.
- 2026-07-22 — Rebuilt the opening in that order. Added a compact loss/metric
  contrast, stated that Perplexity is derived rather than a new training loss,
  displayed the full `exp(average NLL) = inverse geometric mean` formula, and
  placed an explicit transition before the existing four-token example.
- 2026-07-22 — Approved spelling out Negative Log-Likelihood everywhere in the
  visible Perplexity lesson instead of using the `NLL` abbreviation.
- 2026-07-22 — Replaced all four learner-facing `NLL` occurrences in the opening,
  comparison card, metric note, and numeric loss explanation with the full term.

# Verification

- The original opening-polish checkpoint passed `npm run verify`: TypeScript,
  75 tests, MDX validation, and the 2,610-module production build; the build
  retained its existing large-chunk warning.
- `npm test` passed after the finalized follow-up changes: all 75 tests passed,
  including MDX page-count, component-contract, and quiz-question validation.
- The test fixtures were updated for the three-page AI overview, three-page
  checkpoint quiz, and the new `role-domain-convention` question.
- No production build was run.
- The navy-ink follow-up passed `git diff --check`; tests and builds were not
  run by request.
- The sidebar color follow-up passed `git diff --check`; tests and builds were
  not run by request.
- The lesson-node palette follow-up passed `git diff --check`; tests and builds
  were not run by request.
- The icon-based lesson-kind follow-up passed `git diff --check`; tests and
  builds were not run by request.
- The Quiz-marker icon follow-up passed `git diff --check`; tests and builds
  were not run by request.
- The borderless Quiz-icon follow-up passed `git diff --check`; tests and builds
  were not run by request.
- The Quiz-icon size follow-up passed `git diff --check`; tests and builds were
  not run by request.
- The Quiz-excluded numbering follow-up passed `git diff --check`; tests and
  builds were not run by request.
- The unselected-Quiz dimming follow-up passed `git diff --check`; tests and
  builds were not run by request.
- The Learning Lab font unification passed `git diff --check`; tests and builds
  were not run by request.
- The selected-row highlight follow-up passed `git diff --check`; tests and
  builds were not run by request.
- The flattened selected-marker follow-up passed `git diff --check`; tests and
  builds were not run by request.
- The selected-row white-border follow-up passed `git diff --check`; tests and
  builds were not run by request.
- The softened selected-row treatment passed `git diff --check`; tests and
  builds were not run by request.
- The Quiz connector-mask follow-up passed `git diff --check`; tests and builds
  were not run by request.
- The inactive rail-filter emphasis follow-up passed `git diff --check`; tests
  and builds were not run by request.
- The corrected rail-filter selector follow-up passed `git diff --check`; tests
  and builds were not run by request.
- The global muted-opacity follow-up passed `git diff --check`; tests and builds
  were not run by request.
- The Token IDs semantic-limit page passed `git diff --check`; its MDX fixture
  now expects four pages. Tests and builds were not run by request.
- The redesigned Token IDs semantic-limit visual passed `git diff --check`;
  tests and builds were not run by request.
- The alternate editorial-table direction passed `git diff --check`; tests and
  builds were not run by request.
- The reduced-copy convergence direction passed `git diff --check`; tests and
  builds were not run by request.
- The per-context token-ID sequence direction passed `git diff --check`; tests
  and builds were not run by request.
- The simplified visual-plus-prose direction passed `git diff --check`; tests
  and builds were not run by request.
- The explanatory-callout polish passed `git diff --check`; tests and builds
  were not run by request.
- The Token ID context quiz addition passed `git diff --check`; tests and builds
  were not run by request.
- The revised context-question options passed `git diff --check`; tests and
  builds were not run by request.
- The global quiz prompt treatment passed `git diff --check`; tests and builds
  were not run by request.
- The global quoted-term quiz emphasis passed `git diff --check`; tests and
  builds were not run by request.
- The macOS code-window chrome passed `git diff --check`; tests and builds were
  not run by request.
- The compact traffic-light-plus-label treatment passed `git diff --check`;
  tests and builds were not run by request.
- The softened traffic-light chrome passed `git diff --check`; tests and builds
  were not run by request.
- The dots-only source header passed `git diff --check`; tests and builds were
  not run by request.
- The typed-TOC LLM Evaluation addition passed `git diff --check`; tests and
  builds were not run by request.
- The Notion-informed Evaluation & Safety refinement passed `git diff --check`;
  tests and builds were not run by request.
- The content-first Evaluation & Safety transfer passed `git diff --check` and
  static file-count checks (50 authored MDX files total, 20 in chapter 2.2).
  MDX tests, runtime tests, and builds were not run by request.
- The attribution cleanup and quantitative opening passed `git diff --check`;
  a chapter-wide search confirms no `Nguồn nội dung` line remains. Tests and
  builds were not run by request.
- The inline primary-paper reference and candidate-review clarification passed
  `git diff --check`; tests and builds were not run by request.
- The numeric citation formatting passed `git diff --check`; tests and builds
  were not run by request.
- The numeric-citation link polish passed `git diff --check`; tests and builds
  were not run by request.
- The baseline citation correction passed `git diff --check`; tests and builds
  were not run by request.
- The text-inherited citation treatment passed `git diff --check`; tests and
  builds were not run by request.
- The content-first Perplexity lesson passed `git diff --check`, static page
  index inspection (0–2), and the authored MDX file count is now 51. Tests and
  builds were not run by request.
- The expanded Perplexity formula and component explanation passed
  `git diff --check` and static inspection of the escaped KaTeX expressions.
  Tests and builds were not run by request.
- The concrete Perplexity introduction example passed `git diff --check` and
  static content inspection. Tests and builds were not run by request.
- The heading removal and inline-math correction passed `git diff --check` and
  static inspection of the escaped MDX delimiters. Tests and builds were not
  run by request.
- The Perplexity prediction-flow redesign passed `git diff --check` and static
  inspection of its typed MDX registration. Tests and builds were not run by
  request.
- The model-probability-loss extension passed `git diff --check`; its displayed
  losses and Perplexity are derived from the authored probabilities rather than
  duplicated constants. Tests and builds were not run by request.
- The progressive Perplexity derivation reorder passed `git diff --check` and
  static inspection of the seven KaTeX stages and their numeric consistency.
  Tests and builds were not run by request.
- The derivation-intro removal passed `git diff --check`; existing authored
  derivations retain their titles because the renderer only suppresses the
  intro wrapper when both optional fields are absent. Tests and builds were not
  run by request.
- The numeric-probability copy removal passed `git diff --check`; no empty
  paragraph is rendered for the explanation-free step. Tests and builds were
  not run by request.
- The correct-token probability copy refinement passed `git diff --check` and
  retains inline KaTeX for `x_i`. Tests and builds were not run by request.
- The interactive sequence-loss sign toggle passed `git diff --check` and
  static inspection of its opt-in renderer path, switch semantics, and escaped
  KaTeX formulas. Tests and builds were not run by request.
- The running base-2 loss graph passed `git diff --check` and static inspection
  of its slider range, sign-dependent curve geometry, point value, labels, and
  backward-compatible chart API. Tests and builds were not run by request.
- The fixed-formula/dual-curve refinement passed `git diff --check` and static
  inspection of sign opacity, centered positive/negative axes, paired curves,
  paired points, and active/inactive emphasis. Tests and builds were not run by
  request.
- The switch-alignment correction passed `git diff --check` and static geometry
  inspection. Tests and builds were not run by request.
- The fixed loss-motivation copy passed `git diff --check`, retains inline KaTeX
  for the sign, interval, and limits, and no longer has an alternate-copy path.
  Tests and builds were not run by request.
- The length-normalization example passed `git diff --check` and static numeric
  inspection of both raw products, roots, and retained sentence-level result.
  Tests and builds were not run by request.
- The structured length-comparison redesign passed `git diff --check` and
  static inspection of its typed authored data and responsive row layout.
  Tests and builds were not run by request.
- The staged product-to-exponent flow passed `git diff --check` and static
  inspection of its authored sequence, responsive paired examples, and concise
  final explanation. Tests and builds were not run by request.
- The normalized-example notation correction passed `git diff --check` and
  static numeric inspection. Tests and builds were not run by request.
- The result-strip and closing-copy removal passed `git diff --check`; a static
  search confirms the length-normalization result field is no longer present.
  Tests and builds were not run by request.
- The product-to-base-2 derivation passed `git diff --check` and static algebra
  inspection across all three KaTeX stages. Tests and builds were not run by
  request.
- The two-path Perplexity flow passed `git diff --check` and static inspection
  of step order, natural-log graph labels/geometry, NLL arithmetic, and the
  matching `PPL ≈ 1.84` result. Tests and builds were not run by request.
- The inverse-Perplexity copy refinement passed `git diff --check` and static
  numeric inspection. Tests and builds were not run by request.
- The Perplexity opening brief passed `git diff --check` and static inspection
  of its typed content fields, full-width formula, loss/metric ranges, and
  transition into the worked derivation. Tests and builds were not run by
  request.
- The Negative Log-Likelihood terminology expansion passed `git diff --check`;
  a lesson-local search confirms no visible `NLL` abbreviation remains. Tests
  and builds were not run by request.

## Approved follow-up: clarify the Perplexity range mapping

- Replace the repeated `0.5`/`0.8` comparison with the general mapping from a
  representative token probability in `(0, 1]` to Perplexity in `[1, +∞)`.
- State the two boundary behaviors explicitly: perfect prediction gives
  Perplexity `1`; probabilities approaching `0` send Perplexity toward `+∞`.

### Verification

- The range-mapping copy passed `git diff --check` and static inspection of
  the `(0, 1] → [1, +∞)` mapping and both boundary cases. Tests and builds were
  not run by request.

## Approved follow-up: separate logarithm from the negative sign

- Make step 6 apply the logarithm to the probability product, showing that the
  product becomes a sum of non-positive log-probabilities.
- Keep adding the negative sign as the following interactive step, before
  averaging over sequence length and applying the inverse exponential.

### Verification

- The reordered derivation passed `git diff --check` and static inspection:
  step 6 now converts the probability product into a log sum, while the next
  step alone introduces the negative sign. Tests and builds were not run by
  request.

## Approved follow-up: derive the loss path from the exponent

- Start step 6 by decomposing `-1/L` into the inverse factor `-1` and the
  length-normalization factor `1/L`.
- Carry both factors through the logarithm identity so the negative sign is
  visibly inherited from the Perplexity exponent rather than introduced later.

### Verification

- The exponent-led derivation passed `git diff --check` and static algebra
  inspection from `-1/L = (-1) × (1/L)` through the log-product identity,
  Negative Log-Likelihood, length averaging, and inverse exponential. Tests and
  builds were not run by request.

## Approved follow-up: mark the transition to Negative Log-Likelihood

- Spell out `Negative Log-Likelihood / L` in the opening Perplexity formula
  instead of using the abstract sequence-loss symbol.
- Insert a short transition before step 6 stating that steps 1–5 completed the
  direct probability form and the remaining steps derive its equivalent loss
  form.

### Verification

- The explicit opening formula and step-6 transition passed `git diff --check`
  and static inspection of the typed opt-in transition field, inline KaTeX,
  and full Negative Log-Likelihood label. Tests and builds were not run by
  request.

## Approved follow-up: repeat the formula with probability-side focus

- Repeat the full Perplexity identity immediately after the introductory
  transition sentence.
- Keep the left label and right probability-product form prominent while
  visually muting only the middle exponential/Negative Log-Likelihood form.

### Verification

- The probability-focused duplicate formula passed `git diff --check` and
  static inspection of its typed three-part authored content, muted middle
  term, and horizontally scrollable layout. Tests and builds were not run by
  request.

## Approved follow-up: checkpoint the probability term after step 2

- Add an authored formula checkpoint immediately after step 2.
- Mute the surrounding identity and emphasize only
  `p(x_i | x_{1:i-1})` in the right-hand product so the reader can map the
  completed explanation back to the original formula.

### Verification

- The step-2 probability checkpoint passed `git diff --check` and static
  inspection of its typed opt-in formula parts, emphasized probability term,
  muted context, and horizontal overflow behavior. Tests and builds were not
  run by request.

## Approved follow-up: visualize the `±1/L` exponents at step 5

- Add a step-5 interactive comparison of the length-normalized probability
  `(∏p_i)^(1/L)` and its inverse `(∏p_i)^(-1/L)`.
- Keep both curves on one chart, driven by the same product-probability slider,
  so the negative exponent visibly maps the normalized value to Perplexity.

### Verification

- The step-5 exponent comparison passed `git diff --check` and static numeric
  inspection of the shared product slider, the `1/L` and `-1/L` curves, their
  paired points, and the typed opt-in renderer path. Tests and builds were not
  run by request.

## Approved follow-up: clean up exponent-chart notation

- Remove the two formula legends above the chart.
- Replace the remaining Unicode product/exponent labels in the control panel
  with KaTeX so the notation matches the lesson formulas.

### Verification

- The notation cleanup passed `git diff --check`; static inspection confirms
  both top legends are gone, control formulas use KaTeX, and the SVG axis uses
  a plain-language label instead of a Unicode product symbol. Tests and builds
  were not run by request.

## Approved follow-up: checkpoint the exponent after step 5

- Reuse the full-formula checkpoint after step 5.
- Mute the surrounding identity and emphasize only the right-hand exponent
  `-1/L`, marking the second completed component of the probability form.

### Verification

- The step-5 exponent checkpoint passed `git diff --check` and static
  inspection of the full muted identity with only `-1/L` emphasized. Tests and
  builds were not run by request.

## Approved follow-up: checkpoint the product after step 4

- Reuse the same full-formula checkpoint after step 4.
- Emphasize only the product operator and its bounds, `∏_{i=1}^{L}`, while
  muting the surrounding identity, probability term, and exponent.

### Verification

- The step-4 product checkpoint passed `git diff --check` and static inspection
  of the full muted identity with only `∏_{i=1}^{L}` emphasized. Tests and
  builds were not run by request.

## Approved follow-up: move post-derivation reading to the next page

- End the first page immediately after step 10.
- Move the log-base note and all prose currently below the derivation to a new
  page titled `Cách đọc Perplexity`, then shift the existing Benchmark and
  Post-training pages forward by one index.
- Update lesson metadata and the existing MDX page-count fixture from 3 to 4.

### Verification

- The page split passed `git diff --check` and static inspection of contiguous
  page indices `0–3`, four matching metadata headings, and the updated
  page-count fixture. Tests and builds were not run by request.

## Approved follow-up: redesign the Perplexity interpretation page

- Replace the prose-only second page with one typed, locale-authored visual
  explainer.
- Use concrete `PPL = 2` and `PPL = 4` equal-choice examples to explain
  effective branching factor, followed by a same-conditions model comparison.
- Make comparison requirements and the limits of Perplexity visually distinct,
  while retaining the short log-base note.

### Verification

- The redesigned interpretation page passed `git diff --check` and static
  inspection of the typed allowlist → component map → renderer path, localized
  authored content, equal-choice examples, model comparison, and comparison
  constraints. Tests and builds were not run by request.

## Approved follow-up: remove the log-base note

- Remove the final `ln/exp` versus `log₂/2ˣ` note from the Perplexity
  interpretation page and delete its now-unused typed renderer field.

### Verification

- The note removal passed `git diff --check`; a static search confirms neither
  the authored copy nor the `logNote` renderer field remains. Tests and builds
  were not run by request.

## Approved follow-up: remove the effective-choice caveat

- Remove the sentence beginning `Đây là cách diễn giải trực quan` and delete
  its now-unused typed renderer field.

### Verification

- The caveat removal passed `git diff --check`; a static search confirms the
  copy and `exampleNote` field are both gone. Tests and builds were not run by
  request.

## Approved follow-up: ground “surprise” and reasoning with examples

- Replace the abstract Model A/B comparison with the `Mặt trời mọc ở phía ___`
  example, explicitly marking `đông` as the ground-truth token and contrasting
  `99%` versus `40%` probability assigned to it.
- Expand the limitation callout with the Alice → Bob → Carol multi-step
  reasoning example, showing why lower Perplexity need not imply better logic.

### Verification

- The ground-truth and reasoning examples passed `git diff --check` and static
  numeric inspection (`0.99⁻¹ ≈ 1.01`, `0.40⁻¹ = 2.50`), with typed localized
  authored data for both visual blocks. Tests and builds were not run by
  request.

## Approved follow-up: turn the examples into a PPL calculator

- Replace the static equal-choice and sunrise blocks with one interactive
  single-position calculator.
- Provide four authored presets: equal 2-choice, equal 4-choice, sunrise 99/1,
  and sunrise 40/30/15/15.
- Allow readers to select the ground-truth token, edit token labels, adjust
  probabilities, and add or remove candidates; calculate `PPL = 1/p(true)` and
  expose whether the candidate probabilities sum to 100%.

### Verification

- The single-position PPL calculator passed `git diff --check` and static
  numeric inspection of all four presets (`2.00`, `4.00`, `1.01`, `2.50`).
  Its sliders preserve a 100% distribution while editing, adding, and removing
  candidates; ground-truth selection drives `PPL = 1/p(true)`. Tests and builds
  were not run by request.

## Approved follow-up: remove the sunrise presets

- Remove both `Mặt trời` calculator presets, retaining only the `PPL = 2` and
  `PPL = 4` starting configurations and all custom editing controls.

### Verification

- The preset cleanup passed `git diff --check`; a static search confirms only
  `ppl-2` and `ppl-4` remain. Tests and builds were not run by request.

## Approved follow-up: remove comparison-condition chips

- Remove the `Chỉ so sánh khi giữ nguyên` block and its four chips from this
  page, including their authored and typed renderer fields.

### Verification

- The comparison-condition removal passed `git diff --check`; a static search
  confirms the heading, four chips, and both renderer fields are gone. Tests
  and builds were not run by request.

## Approved follow-up: restore the two-column PPL setup cards

- Replace the compact preset pills with two equal-width cards for `PPL = 2`
  and `PPL = 4`, showing the corresponding `50–50` and four-way `25%`
  distributions.
- Keep each card clickable so it still loads its setup into the calculator.

### Verification

- The two-column setup cards passed `git diff --check`; static inspection
  confirms the `50% × 2` and `25% × 4` distributions remain authored once and
  also drive calculator preset loading. Tests and builds were not run by
  request.

## Approved follow-up: add a page on what counts as a good PPL

- Insert a new page immediately after the interpretation/calculator page and
  shift the existing Benchmark and Post-training pages forward.
- Present dataset type, tokenizer, language, and evaluation set as four
  equal-height course cards.
- Present `5–15`, `20–40`, and `hundreds` only as illustrative ranges, followed
  by a same-conditions comparison rule.
- Update lesson headings, page count, and the existing page-count fixture from
  4 to 5.

### Verification

- The new good-PPL page passed `git diff --check` and static inspection of the
  typed allowlist → component map → renderer path, four 2-column course cards,
  three explicitly illustrative range cards, contiguous page indices `0–4`,
  and the updated five-page fixture. Tests and builds were not run by request.

## Approved correction: use the established course-card anatomy

- Replace the compact 2×2 text cards with the Learning Lab portrait-card
  convention: fixed top visual/icon band, equal-height body area, and distinct
  palette per factor.
- Use two columns at medium widths and four columns when space permits.

### Verification

- The course-card correction passed `git diff --check` and static inspection
  against the existing Learning Lab card anatomy: 120px icon band, portrait
  body, equal minimum height, per-factor palette, and responsive 2→4 columns.
  Tests and builds were not run by request.

## Approved follow-up: make the illustrative ranges horizontal

- Stack the three illustrative PPL ranges as horizontal cards, with the range
  value in a fixed left column and its label/description on the right.

### Verification

- The range-card layout passed `git diff --check` and static responsive
  inspection: stacked on every viewport, with an 8rem value column from the
  small breakpoint upward. Tests and builds were not run by request.

## Approved follow-up: redesign Benchmark and likelihood

- Replace the prose-only page with a typed visual explainer centered on an
  MMLU-style multiple-choice example.
- Show the shared context, likelihood score for every candidate, and argmax
  selection instead of free-form generation/parsing.
- Retain test-contamination risk as a warning and convert reporting requirements
  into a compact checklist.

### Verification

- The Benchmark/likelihood redesign passed `git diff --check` and static
  inspection of the typed allowlist → component map → renderer path, the
  normalized four-answer scores, argmax selection, contamination warning, and
  reporting checklist. Tests and builds were not run by request.

## Approved follow-up: move the single-token PPL equation to the lead

- Move the live `PPL = 1 / p(token ground truth)` substitution directly below
  the interpretation-page opening copy and remove its duplicate from the end
  of the calculator.

### Verification

- The equation relocation passed `git diff --check`; a static search confirms
  one live formula remains, immediately after the lead copy. Tests and builds
  were not run by request.

## Approved follow-up: frame and fully typeset the special case

- End the lead with `Nghĩa là, trong trường hợp đặc biệt chỉ chấm một token:`.
- Render the complete live substitution as one display-mode LaTeX expression,
  including both fractions and the resulting PPL.

### Verification

- The special-case framing passed `git diff --check`; static inspection
  confirms the lead sentence precedes one display-mode KaTeX expression whose
  probability and result remain live. Tests and builds were not run by request.

## Approved follow-up: remove the benchmark reporting checklist

- Remove the `Một báo cáo evaluation cần nêu rõ` heading and all five chips,
  including their authored and typed renderer fields.

### Verification

- The checklist removal passed `git diff --check`; a static search confirms
  the heading, chips, and both renderer fields are gone. Tests and builds were
  not run by request.

## Approved follow-up: redesign post-alignment evaluation

- Replace the prose-only final page with a typed visual comparison of
  pre-training and post-training evaluation goals.
- Show why open-ended responses require multi-criterion rubrics, then compare
  Human evaluation with LLM-as-a-Judge.
- Retain AlpacaEval as a concrete framework example and isolate verbosity bias
  plus length control in a warning block.

### Verification

- The post-alignment redesign passed `git diff --check` and static inspection
  of the typed allowlist → component map → renderer path, stage comparison,
  rubric criteria, evaluator tradeoffs, AlpacaEval example, and isolated bias
  warning. Tests and builds were not run by request.

## Approved correction: one idea per post-alignment page

- Split the final page into three focused pages: metric shift, evaluator choice,
  and judge bias.
- Reuse one discriminated typed renderer with scoped authored payloads so each
  page receives only the content it displays.
- Add a concise-versus-verbose response pair to make verbosity bias concrete.
- Update headings, page count, and the existing fixture from 5 to 7.

### Verification

- The one-idea-per-page split passed `git diff --check` and static inspection
  of the discriminated `shift` / `evaluators` / `bias` payloads, contiguous
  page indices `0–6`, seven matching headings, and the updated fixture. Tests
  and builds were not run by request.

## Approved correction: keep post-alignment methods as a brief bridge

- Collapse the three detailed pages back into one concise overview page.
- Keep only the reason PPL is insufficient plus brief Human evaluation and
  LLM-as-a-Judge method cards; remove AlpacaEval, rubric details, and judge-bias
  teaching because chapter 2.2 owns those topics.
- End with an explicit pointer to chapter 2.2 and restore metadata/fixture from
  7 pages to 5.

### Verification

- The bridge-page correction passed `git diff --check` and static inspection:
  the lesson now has contiguous page indices `0–4`, five matching headings,
  the fixture expects five pages, and the post-alignment payload contains only
  the short Human evaluation / LLM-as-a-Judge overview plus the chapter 2.2
  pointer. Tests and builds were not run by request.

## Approved polish: method course cards

- Present Human evaluation and LLM-as-a-Judge as two equal-height course cards.
- Reuse the Learning Lab card anatomy: fixed visual band, restrained icon tile,
  concise title, and description beneath it.
- Keep the surrounding lead and chapter 2.2 pointer unchanged.

### Verification

- The two methods now use matching equal-height course cards with a fixed icon
  band and content area. `git diff --check` passed; tests and builds were not
  run by request.

## Approved polish: benchmark likelihood reading flow

- Replace the split two-column benchmark layout with one vertical three-step
  flow: read the question, compare answer likelihoods, select the maximum.
- Keep the MMLU context, formula, example scores, and contamination warning,
  while making the winning answer the visual conclusion instead of embedding
  it inside the score list.
- Keep all visible flow labels in the authored locale-MDX payload.

### Verification

- Static inspection confirms a single vertical `1 → 2 → 3` reading path,
  with the formula and four likelihood scores grouped in step 2 and the winning
  answer isolated in step 3. The new labels remain authored in locale MDX.
  `git diff --check` passed; tests and builds were not run by request.

## Approved follow-up: benchmark likelihood quiz

- Add a dedicated `Quiz` lesson immediately after Perplexity and LLM
  evaluation in the existing 1.5 TOC sequence.
- Use three focused single-choice questions covering argmax over likelihood,
  why likelihood scoring is preferred to free-form answer parsing, and test
  contamination.
- Register the authored locale-MDX quiz through the existing typed TOC/catalog
  path and extend the existing static fixtures; do not add a parallel payload.

### Verification

- Static inspection confirms the published `Quiz` node follows the Perplexity
  lesson in the typed TOC, its locale MDX contains three questions with the
  expected IDs, and the existing page-count/question-ID fixtures include it.
  `git diff --check` passed; tests and builds were not run by request.

## Approved correction: redistribute the final theory pages

- Keep page 3 focused only on why PPL depends on data and evaluation setup,
  using the four existing course cards.
- Move the illustrative PPL ranges and comparison takeaway to page 4 under the
  question “Có PPL bao nhiêu là tốt?”.
- Merge benchmark likelihood and the brief post-alignment overview into one
  concise final page, using compact variants of their existing typed renderers.
- Preserve five total pages and keep all authored copy in locale MDX.

### Verification

- Static inspection confirms page 3 contains only the setup-dependent lead and
  four course cards; page 4 contains only the illustrative ranges and takeaway;
  page 5 combines compact benchmark and post-alignment renderers. Metadata has
  five matching headings and contiguous indices `0–4`. `git diff --check`
  passed; tests and builds were not run by request.

## Approved correction: move the reasoning caveat forward

- Remove “Perplexity thấp không đồng nghĩa reasoning tốt” from the interactive
  PPL calculator page.
- Place the unchanged caveat after the four dependency course cards on the
  following page, so the limitation follows the discussion of PPL context.
- Preserve page count, page order, and the authored locale-MDX content.

### Verification

- Static inspection confirms the calculator payload no longer contains the
  reasoning example, while the factors payload and renderer place the unchanged
  caveat after the four course cards. `git diff --check` passed; tests and
  builds were not run by request.

## Approved copy polish: remove the range qualifier label

- Remove the standalone “Ví dụ minh họa — không phải ngưỡng cố định” label so
  the PPL range cards follow the lead directly.

### Verification

- The label and its renderer/type field are absent, and `git diff --check`
  passed. Tests and builds were not run by request.

## Approved redesign: theory-complete quiz

- Replace the benchmark-only three-question quiz with eleven questions that
  follow the five theory pages in order.
- Cover NLL versus PPL, token likelihood, length normalization, hand
  calculation, PPL interpretation, setup dependencies, valid comparisons,
  reasoning limits, benchmark likelihood, contamination, and post-alignment
  methods.
- Distribute correct options across positions using
  `B–D–A–C–B–D–A–C–B–D–A`; write distractors as plausible misconceptions
  rather than obviously unrelated statements.

### Verification

- Two read-only subagent audits independently identified the missing theory
  coverage and the former all-B answer pattern. Static inspection confirms the
  replacement quiz has eleven ordered question IDs, eleven matching headings,
  the intended answer-key distribution, and updated fixtures. `git diff
  --check` passed; tests and builds were not run by request.

## Approved follow-up: historical PPL trend and current role

- After the same-setup comparison takeaway, add a compact 2017 → 2023 visual
  showing the illustrative shift from roughly 70 to fewer than 10 “equally
  likely choices”.
- Clarify that Perplexity is no longer the primary academic benchmark metric,
  while remaining useful during model development.
- Keep the trend subordinate to the preceding same-tokenizer/same-data caveat.
- Extend the adjacent quiz with one matching question; use answer position C so
  the twelve-question key is balanced at three correct answers per position.

### Verification

- Static inspection confirms the trend follows the same-setup takeaway, shows
  `2017 · ≈70 token → 2023 · <10 token`, and closes with PPL’s development role.
  The quiz and fixtures now contain twelve matching questions, with three
  correct answers in each A/B/C/D position. `git diff --check` passed; tests and
  builds were not run by request.

## Approved copy correction: explain the historical PPL values directly

- Replace the ambiguous “hesitating between N tokens” sentence with the
  reciprocal-probability interpretation: PPL ≈ 70 corresponds to typical
  ground-truth probability ≈ 1/70; PPL < 10 corresponds to probability > 1/10.
- Update the matching quiz option and feedback without changing its answer key.

### Verification

- Static inspection confirms the historical explanation and matching quiz now
  use the explicit `≈1/70 → >1/10` ground-truth probability relationship;
  `git diff --check` passed. Tests and builds were not run by request.

## Approved copy correction: state the improvement positively

- Describe the 2017 → 2023 PPL trend as stronger, more confident ground-truth
  token prediction and more natural generated text under the same setup.
- Phrase PPL’s current role positively around model development, while academic
  evaluation uses capability-specific benchmarks; keep the quiz synchronized.

### Verification

- The trend copy now leads with improved token prediction and naturalness, and
  the role copy describes development plus capability benchmarks without a
  negative construction. The quiz wording matches; `git diff --check` passed.
  Tests and builds were not run by request.

## Approved layout correction: move the trend to page 2

- Move the unchanged 2017 → 2023 PPL trend and current-role block from the
  threshold page to the end of page 2, immediately after the PPL calculator.
- Keep all five pages, quiz content, and authored copy unchanged.

### Verification

- Static inspection confirms the trend payload and visual now belong to the
  page-2 interpretation renderer after the calculator, and the threshold page
  ends at its same-setup takeaway. `git diff --check` passed; tests and builds
  were not run by request.

## Approved citation: historical PPL trend

- Add the supplied timestamped YouTube source as a plain inline `[1]` link at
  the end of the page-2 trend explanation.
- Keep the reference visually text-like, without a badge, background, or
  superscript treatment.

### Verification

- Static inspection confirms the authored timestamp URL renders as a plain
  inline `[1]` link after the trend sentence. `git diff --check` passed; tests
  and builds were not run by request.

## Approved correction: keep the limitation conclusion on page 4

- Keep the 2017 → 2023 trend and citation on page 2, but move the current-role
  conclusion back to page 4 after the same-setup takeaway.
- Rewrite it as a consequence of PPL’s dataset/tokenizer/calculation
  limitations, followed by its development use and capability benchmarks.

### Verification

- Static inspection confirms page 2 retains only the historical trend and
  citation, while page 4 ends with the rewritten limitation → development →
  capability-benchmark conclusion. `git diff --check` passed; tests and builds
  were not run by request.

## Approved architecture-preserving extraction: page 5 to lesson node

- Extract “Ngoài Perplexity” from page 5 into a standalone published locale-MDX
  lesson node immediately after the existing Quiz node.
- Reduce the original Perplexity lesson from five pages to four without
  changing those pages.
- Keep the pre-node quiz scoped to the four preceding Perplexity pages by
  removing benchmark, contamination, and post-alignment questions; retain the
  current-role question because that concept remains on page 4.
- Register the new lesson through the existing typed TOC/catalog path and
  update existing static fixtures only.

### Verification

- Static inspection confirms the original lesson now has four contiguous pages,
  the Quiz has nine theory-matched questions with answer positions spread as
  `B–D–A–C–B–D–A–C–B`, and the new one-page “Ngoài Perplexity” lesson follows
  it in the typed TOC. File/document/page/question fixtures were updated.
  `git diff --check` passed; tests and builds were not run by request.

## Approved title polish: extracted evaluation lesson

- Rename the visible node, metadata title, and page heading to
  “Beyond Perplexity · Đánh giá LLM toàn diện”.
- Keep the route ID and typed catalog structure unchanged.

### Verification

- TOC, lesson metadata, and page heading use the new title consistently;
  `git diff --check` passed. Tests and builds were not run by request.

## Approved title correction: node label only

- Shorten the visible node and lesson metadata label to “Beyond Perplexity”.
- Remove the authored internal page heading so the lesson opens directly with
  its content.

### Verification

- The typed TOC and lesson metadata use “Beyond Perplexity”, and the MDX page
  contains no internal `##` heading. `git diff --check` passed; tests and builds
  were not run by request.

## Approved follow-up: Hugging Face benchmark discovery intro

- Add a new first page to “Beyond Perplexity” explaining that evaluation can
  draw from many public benchmarks, with Hugging Face Hub as a place to discover
  benchmark datasets, dataset cards, evaluation results, and leaderboards.
- Use the official Hugging Face documentation image
  `evaluation-results/benchmark-preview.png` as the illustration and link back
  to the official evaluation-results documentation.
- Keep the existing benchmark/alignment content unchanged as page 2; update the
  typed renderer registration and existing page-count fixture.

### Verification

- Static inspection confirms the new typed component is present in the MDX
  allowlist and component map, page indices are contiguous `0–1`, metadata and
  the fixture expect two pages, and the image/CTA point to official Hugging Face
  documentation resources. `git diff --check` passed; tests and builds were not
  run by request.

## Approved typography polish: Hugging Face lead

- Render the opening sentence as normal body text.
- Split the authored lead so only “Hugging Face Hub” receives a restrained
  yellow text highlight.

### Verification

- Static inspection confirms the lead uses body typography and the authored
  “Hugging Face Hub” span alone receives the yellow highlight. `git diff
  --check` passed; tests and builds were not run by request.

## Approved interaction polish: single Hugging Face exit

- Remove navigation behavior from the benchmark preview image.
- Keep the CTA “Khám phá benchmark trên Hugging Face” as the only element that
  opens the external Hugging Face page.

### Verification

- The preview is now a non-interactive image and the authored CTA contains the
  only Hugging Face documentation href on the page. `git diff --check` passed;
  tests and builds were not run by request.

## Approved follow-up: two benchmark resources from the lecture

- Add HELM and Hugging Face Open LLM Leaderboard as two compact resource cards
  at the bottom of page 1 in “Beyond Perplexity”.
- Describe them as the two popular starting points introduced in the lecture,
  with concise guidance on what each resource helps the reader inspect.
- Link only each card's explicit CTA to its official resource; keep the cards
  themselves non-interactive and preserve the existing two-page lesson flow.

### Verification

- Static inspection confirms page 1 ends with two equal resource cards for
  Stanford HELM and Hugging Face Open LLM Leaderboard, each using an official
  destination and an explicit CTA as its only link. The lesson remains two
  pages. `git diff --check` passed; tests and builds were not run by request.

## Approved quiz correction: PPL and NLL ranges

- Replace the first quiz question about the NLL–PPL relationship and the
  `PPL = 1` best case with a dedicated question comparing their value ranges.
- Keep the question count, question ID, and correct-answer position unchanged.

### Verification

- Static inspection confirms the first question now asks only for the ranges
  `NLL ∈ [0, +∞)` and `PPL ∈ [1, +∞)`. The quiz still has nine questions and
  the correct answer remains in position B. `git diff --check` passed; tests
  and builds were not run by request.

## Approved correction: retain the original first quiz question

- Restore the first question about the relationship between Negative
  Log-Likelihood and Perplexity.
- Remove only the `best case = 1` detail from its correct answer and feedback;
  do not replace it with a value-range question or change the quiz length.

### Verification

- Static inspection confirms the original relationship question and its answer
  order are restored, while all `best case` wording is absent from that
  question. `git diff --check` passed; tests and builds were not run by request.

## Approved quiz reduction: remove the hand-calculation question

- Remove the question that calculates Perplexity from total Negative
  Log-Likelihood `2.449` and `L = 4`.
- Reduce the quiz metadata and static fixture from nine pages/questions to
  eight while preserving the order and content of the remaining questions.

### Verification

- Static inspection confirms the `hand-calculation` question and its `2.449`
  example are absent, with eight headings, eight fixture IDs, and `pageCount:
  8`. `git diff --check` passed; tests and builds were not run by request.

## Approved quiz fix: restore the first three visible prompts

- Add explicit prompts to the first three questions in the checkpoint quiz
  after “Tổng quan quy trình huấn luyện và sinh token”.
- Keep quiz titles hidden globally and move the learner-facing question or
  categorization instruction into the authored `prompt` field.
- Preserve all options, correct answers, question IDs, and page count.

### Verification

- Static inspection confirms the first three questions now render authored
  prompts for Pretraining, Fine-tuning, and stage categorization. Their IDs,
  modes, options, answers, and the nine-page quiz count are unchanged. `git
  diff --check` passed; tests and builds were not run by request.
