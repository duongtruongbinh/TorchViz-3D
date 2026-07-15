---
title: LLM Preparation Course Card Alignment
status: done
created: 2026-07-14T18:06:59+07:00
updated: 2026-07-15T17:21:54+07:00
author: Codex
task: "Align the LLM node-1 preparation cards with the Learning Home course-card color and size conventions."
supersedes:
  - docs/plans/2026-07-14-learning-home-course-card-grid.md
  - docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md
---

# Goal

Make the prerequisite cards in LLM lesson node 1, “Yêu cầu chuẩn bị,” the five
cards in page 4 of “Roadmap LLM from Scratch,” “Ví dụ về Tokenization,” and a
new Roadmap page on the five components of LLM training visually read as the
same course-card family as Learning Home: portrait cards with an intentional
150px visual band, consistent desktop height, and distinct soft color
  identities. Add one comparison page that distinguishes the academic focus on
  Architecture and Training/Loss from the industry emphasis on Data, Evaluation,
  and Systems Design.

# Lineage

Supersedes [Learning Home Course Card Grid](./2026-07-14-learning-home-course-card-grid.md)
for the course-card visual convention, and [Learning Lab Content Architecture
Migration](./2026-07-14-approved-llm-lessons-mdx-migration.md) for the authored
LLM node and MDX component boundary.

# Decisions (locked)

- Scope is only the reusable `RequirementsGrid` and `RequirementCard` rendering
  the first LLM lesson’s four cards: Google Colab, Python, uv, and VSCode.
- Preserve the MDX lesson copy, links, icons, layout breakpoints, theme context,
  and all catalog/route/content contracts.
- Use the Learning Home `DomainCard` as the reference: fixed 150px visual band,
  portrait-card minimum height of 410px, and restrained visual accent plus
  neutral body surface.
- Give the four prerequisite cards deterministic, distinct soft palettes based
  on their existing icon keys, without adding images, dependencies, or a new
  public MDX API.
- Retain readable light and dark-theme body surfaces; color remains a visual
  identity accent rather than the sole carrier of meaning.
- Apply the same locked dimensions to the existing tokenization cards while
  preserving their five token categories, chips, focus/hover state, and
  responsive grid.
- Insert a new page immediately after “Vì sao cần chia như vậy?” that presents
  Architecture, Training algorithm/loss, Data, Evaluation, and Systems as five
  course cards. The page will use concise explanatory copy and the same card
  convention; later Roadmap page indexes and `pageCount` will shift by one.
- Insert one page after the five-component overview, using a clear Academia vs
  Industry comparison and course-card emphasis without implying that either
  group ignores the other components.
- Make the comparison interactive: selecting/focusing the Academia statement
  emphasizes Architecture and Training/Loss while muting Data, Evaluation, and
  Systems; selecting/focusing the Industry statement reverses that emphasis.
  The inactive cards remain readable and the state is available by click and
  keyboard focus, not hover alone.
- Replace the single interactive comparison with two duplicate-style Roadmap
  pages: the Academia page shows all five cards with Architecture and
  Training/Loss emphasized, while the Industry page shows all five cards with
  Data, Evaluation, and Systems Design emphasized.
- Add one formula-led Roadmap page directly after “Large Language Model là gì?”
  that defines a language model as a distribution over token sequences and uses
  the approved Vietnamese syntax/semantics examples.
- Add KaTeX as the rendered display-math implementation for the new
  probability-definition page, including its required stylesheet and a narrow
  domain renderer integration.
- Add one Roadmap page after “Ví dụ về Tokenization” that introduces
  autoregressive language models and displays the chain-rule factorization of a
  token-sequence probability with KaTeX.
- Split the 14-page Roadmap lesson into four focused lessons, each immediately
  followed by its own short `Quiz` node: AI overview, LLM system components,
  language modeling/next-token prediction, and LLM scale/development. Preserve
  the existing Roadmap route id for the first lesson and keep all authored
  content inside locale MDX.
- Add a one-page interactive AR inference-pipeline lesson after the language
  modeling quiz, followed by its own quiz. Selecting or focusing each authored
  step reveals the corresponding tokenize, forward, probability, sampling, or
  detokenization block while retaining the surrounding pipeline context.
- Extend the AR inference lesson with a second page explaining that the model’s
  next-token output vector has one position per vocabulary token (the
  vocabulary is built from the corpus), and that softmax assigns a probability
  to every position.
- Add a separate lesson/quiz pair after the AR inference pipeline for the
  output head and training bridge: context vector `h` projected from dimension
  `d` to vocabulary-sized logits, softmax probabilities, and a concise
  cross-entropy loss explanation without expanding into backpropagation.
- Expand the output-head overview into a fixed-topology progressive-highlight
  sequence: overview, embeddings into the network, network to context vector,
  context vector to linear layer, linear layer to logits, and logits through
  softmax to the next-token distribution. Keep the loss page last.

# Phases

1. Update the shared requirement-card palette and dimensions in
   `src/components/learning/learningMdxComponents.tsx` to follow the locked
   Learning Home course-card reference.
2. Confirm the four-card grid remains one column on compact widths, two at
   `sm`, and four at `xl`, without horizontal overflow or changed MDX content.
3. Run narrow type/content checks and `npm run verify` if the shared component
   change affects the application build.
4. Record the actual changes and verification result in this plan, then update
   the existing Learning Lab wiki convention only if the reusable visual rule
   changes materially.
5. Reuse the same course-card dimensions and palette discipline for
   `TokenExampleGroup`, which renders page 4 of Roadmap LLM from Scratch.
6. Add a dedicated, domain-scoped MDX component and its five-card renderer for
   the new Roadmap page, then update the MDX component allowlist, Roadmap
   metadata, and subsequent page indexes together.
7. Add the Academia/Industry comparison page, advance the Roadmap page count,
   and shift every later page index together.
8. Replace that comparison page with sequential Academia and Industry pages
   whose fixed card emphasis communicates the contrast without a toggle.
9. Add the language-model probability-definition page, register its domain MDX
   renderer, then shift subsequent Roadmap page indexes and page count together.
10. Install and integrate KaTeX for display math in the language-model
   probability-definition renderer without changing other authored content.
11. Add the autoregressive language-model page and chain-rule formula, then
    shift subsequent Roadmap page indexes and page count together.
12. Split the Roadmap MDX and its broad checkpoint quiz into four adjacent
    lesson/quiz pairs, update the typed LLM TOC, and redistribute existing quiz
    questions without duplicating authored payloads.
13. Add the domain-scoped interactive AR inference pipeline, register its MDX
    component, insert the lesson/quiz pair in the typed TOC, and update the
    existing Learning Lab documentation counts.
14. Add a vocabulary-to-output-vector page to the AR inference lesson and one
    corresponding quiz question, keeping the explanation and example vector in
    locale MDX.
15. Add the domain-scoped output-projection/softmax and next-token-loss pages,
    their adjacent quiz, typed TOC entries, and current Learning Lab docs.
16. Duplicate the projection figure across authored MDX pages and add a
    domain-scoped focus prop so each page emphasizes exactly one block/connector
    transition without changing diagram geometry.

# Out of scope

- Other LLM lesson nodes, authored prose, quizzes, catalog metadata, routes,
  and sidebar/lesson navigation beyond the specified page-4 tokenization cards.
- The Learning Home `DomainCard` implementation or its domain palette mapping.
- New assets, design-system dependencies, or dark-mode redesign.

# Execution log

- 2026-07-14T18:06:59+07:00 — Read the mandatory workflow, repository briefing,
  required Learning Lab plans/wiki, active LLM MDX node, shared requirement-card
  component, and the Learning Home `DomainCard` reference. Stored draft plan;
  no runtime files changed.
- 2026-07-14T18:08:00+07:00 — User approved the plan; status advanced through
  `approved` to `executing` before runtime implementation.
- 2026-07-14T18:09:25+07:00 — Updated `RequirementCard` with four deterministic
  soft visual palettes, a 150px top band, a 64px icon tile, and a 410px minimum
  height matching the Learning Home `DomainCard` convention. The existing
  1/2/4-column responsive `RequirementsGrid`, MDX copy, links, and theme-aware
  readable body surfaces remain unchanged.
- 2026-07-14T18:09:25+07:00 — `npm run verify` passed: TypeScript, 68 Node
  tests, and the 2,499-module Vite production build passed. `git diff --check`
  also passed. No wiki update was needed because the existing Learning Lab page
  already documents the course-card convention; this plan records its scoped
  reuse in node 1.
- 2026-07-14T18:10:00+07:00 — Removed the closing GPT-mini/OOP project note
  from the node-1 Vietnamese MDX at user request. No verification/build was run
  because this was a content-only deletion and the user requested that routine
  verification be skipped unless explicitly requested.
- 2026-07-14T18:12:00+07:00 — User requested the same course-card treatment for
  page 4, “Ví dụ về Tokenization,” in Roadmap LLM from Scratch. Reopened this
  existing plan and extended its scoped reusable-card decision; routine
  verification/build remains skipped per the user’s standing instruction.
- 2026-07-14T18:13:00+07:00 — Updated `TokenExampleGroup` in the LLM renderer:
  its five existing tokenization cards now use a 150px visual band, 64px icon
  tile, and 410px minimum portrait height. Preserved their individual palettes,
  token chips, descriptions, focus/hover behavior, and responsive grid. No
  verification/build was run per the user’s standing instruction.
- 2026-07-14T18:14:00+07:00 — Removed the three context/next-token/loop cards
  above the tokenization example at user request. The heading and five
  tokenization course cards remain. No verification/build was run per the
  user’s standing instruction.
- 2026-07-14T18:15:00+07:00 — Updated the tokenization course-card grid to use
  five columns at the `xl` breakpoint, keeping its compact 1/2-column fallback
  to avoid horizontal overflow. No verification/build was run per the user’s
  standing instruction.
- 2026-07-14T18:16:00+07:00 — Styled “Ví dụ về Tokenization” as the content
  section title with the Learning Lab’s theme-aware blue accent and a clearer
  title size. No verification/build was run per the user’s standing instruction.
- 2026-07-14T18:17:00+07:00 — Added the requested follow-up sentence beneath
  the tokenization title as regular body text, with English fallback for the
  existing locale behavior. No verification/build was run per the user’s
  standing instruction.
- 2026-07-14T18:18:00+07:00 — Removed persistent active-state elevation from
  reusable Learning Lab focus panels. They now lift only on hover or keyboard
  focus, so resting course cards remain level and fully readable. No
  verification/build was run per the user’s standing instruction.
- 2026-07-14T18:20:00+07:00 — User requested a new Roadmap page after the
  second page, “Vì sao cần chia như vậy?”, covering the five main components of
  LLM training as course cards. Reopened and extended this existing plan; no
  runtime files changed while awaiting approval for the new page structure.
- 2026-07-14T18:21:00+07:00 — User approved the expanded plan; status advanced
  through `approved` to `executing` before runtime implementation.
- 2026-07-14T18:23:00+07:00 — Added the new Roadmap page after “Vì sao cần
  chia như vậy?” with five authored course cards: Architecture, Training
  algorithm/loss, Data, Evaluation, and Systems. Added the domain-scoped MDX
  component and renderer, registered its allowlist name, updated Roadmap
  metadata to 12 pages, and shifted the later MDX page indexes to 3–11.
  Confirmed the final page sequence is 0–11. No verification/build was run per
  the user’s standing instruction.
- 2026-07-15T09:00:00+07:00 — User requested a follow-up Roadmap comparison
  page: Academia foregrounds Architecture and Training/Loss, whereas Industry
  carries the larger operational burden of Data, Evaluation, and Systems
  Design. Reopened this existing plan; no runtime files changed while awaiting
  approval for the new page structure.
- 2026-07-15T09:02:00+07:00 — Clarified the comparison interaction: each
  Academia/Industry statement activates its corresponding card group and mutes
  the other group, with click and keyboard-focus parity. No runtime files
  changed while awaiting approval.
- 2026-07-15T09:03:00+07:00 — User approved implementation; status advanced
  through `approved` to `executing` before runtime changes.
- 2026-07-15T09:06:00+07:00 — Added the interactive Academia/Industry comparison
  page after the five-component overview. Its two accessible controls switch
  card emphasis between Architecture + Training/Loss and Data + Evaluation +
  Systems Design; muted cards remain readable. Registered the domain-scoped MDX
  component, updated Roadmap metadata to 13 pages, and shifted later pages to
  indexes 4–12. Confirmed the final page sequence is 0–12. No verification/build
  was run per the user’s standing instruction.
- 2026-07-15T09:07:00+07:00 — Removed the Academia/Industry comparison page
  title at user request; its lead text and interactive controls now start the
  page directly. No verification/build was run per the user’s standing
  instruction.
- 2026-07-15T09:08:00+07:00 — Removed the comparison lead text at user request;
  the page now starts directly with its Academia and Industry controls. Restored
  the separate five-component page title, which remains part of that page’s
  authored content. No verification/build was run per the user’s standing
  instruction.
- 2026-07-15T09:10:00+07:00 — User clarified the intended comparison structure:
  retain all five cards on each of two sequential pages, but fix emphasis to
  Architecture + Training/Loss for Academia and to Data + Evaluation + Systems
  Design for Industry. Reopened this existing plan; no runtime files changed
  while awaiting approval for the page-structure replacement.
- 2026-07-15T09:11:00+07:00 — User approved the replacement; status advanced
  through `approved` to `executing` before runtime changes.
- 2026-07-15T09:13:00+07:00 — Replaced the interactive comparison with two
  sequential fixed-perspective pages. Each retains all five cards: Academia
  emphasizes Architecture and Training/Loss; Industry emphasizes Data,
  Evaluation, and Systems Design. Each page retains only its own labelled
  explanatory block, not the former shared title or lead text. Updated Roadmap
  metadata to 14 pages and shifted later indexes to 5–13; confirmed the final
  page sequence is 0–13. No verification/build was run per the user’s standing
  instruction.
- 2026-07-15T09:14:00+07:00 — Fixed a runtime `ReferenceError` caused by the
  perspective label being declared in `LlmTrainingComponents` instead of the
  Academia/Industry renderer. Moved the declaration to its owner. No
  verification/build was run per the user’s standing instruction.
- 2026-07-15T09:15:00+07:00 — Kept both Academia and Industry explanatory
  panels on both fixed-perspective pages. The active page’s panel and card group
  are emphasized; the other panel and card group remain visible but muted. No
  verification/build was run per the user’s standing instruction.
- 2026-07-15T09:16:00+07:00 — Hid the Industry explanatory panel on the
  Academia page while retaining the two-column grid, so the Academia panel
  keeps its original half-row size. The Industry page continues to show both
  panels with Academia muted. No verification/build was run per the user’s
  standing instruction.
- 2026-07-15T09:17:00+07:00 — Reduced the Academia panel width on its page to
  two fifths of the desktop row, matching its two emphasized course cards;
  remaining columns stay empty. No verification/build was run per the user’s
  standing instruction.
- 2026-07-15T09:18:00+07:00 — Applied matching 2/5 and 3/5 desktop widths to
  Academia and Industry panels on the Industry page, aligned with their card
  groups. No verification/build was run per the user’s standing instruction.
- 2026-07-15T09:19:00+07:00 — Removed the two course-card groups and their
  connectors from “Vì sao LLM phổ biến đến vậy?”, retaining the two explanatory
  images and all surrounding prose. No verification/build was run per the
  user’s standing instruction.
- 2026-07-15T09:20:00+07:00 — Removed the “Roadmap domain LLM & AI Engineering”
  and “Bước tiếp theo” pages at user request. Kept “Nguồn tham khảo chính” as
  the final page, reduced Roadmap metadata to 12 pages, and removed the stale
  Roadmap heading. No verification/build was run per the user’s standing
  instruction.
- 2026-07-15T09:21:00+07:00 — Added the Stanford CS229 “Building Large Language
  Models (LLMs)” lecture to the final reference page. No verification/build was
  run per the user’s standing instruction.
- 2026-07-15T09:25:00+07:00 — User approved the Vietnamese examples for a new
  formula-led language-model definition page. Reopened this existing plan and
  advanced it to execution; routine verification/build remains skipped per the
  user’s standing instruction.
- 2026-07-15T09:27:00+07:00 — Added a formula-led language-model definition
  page after “Large Language Model là gì?”. The new domain MDX component renders
  the Vietnamese token-sequence definition, `p(x₁, …, xₗ)`, and the approved
  syntax/semantics probability examples. Registered its MDX allowlist name,
  increased Roadmap metadata to 13 pages, and shifted later pages to indexes
  7–12. Confirmed the final page sequence is 0–12. No verification/build was
  run per the user’s standing instruction.
- 2026-07-15T09:28:00+07:00 — Changed the final token index from lowercase `l`
  to uppercase `L` in the definition and formula at user request. No
  verification/build was run per the user’s standing instruction.
- 2026-07-15T09:30:00+07:00 — User requested rendered LaTeX. Reopened this
  existing plan to add the KaTeX dependency and a narrow formula-renderer
  integration; no runtime files changed while awaiting approval.
- 2026-07-15T09:31:00+07:00 — User approved the KaTeX integration; status
  advanced through `approved` to `executing` before dependency/runtime changes.
- 2026-07-15T09:33:00+07:00 — Installed `katex`, imported its local stylesheet,
  and rendered the probability formula with KaTeX in the narrow LLM domain
  renderer. Converted its authored formula source to `p(x_1, \ldots, x_L)`.
  No verification/build was run per the user’s standing instruction.
- 2026-07-15T09:34:00+07:00 — Rendered the token-sequence notation inline with
  KaTeX in the Vietnamese definition sentence as well as in the display formula.
  No verification/build was run per the user’s standing instruction.
- 2026-07-15T09:35:00+07:00 — Converted each probability example into a KaTeX
  `P(\ldots)=...` expression displayed before its explanatory sentence. No
  verification/build was run per the user’s standing instruction.
- 2026-07-15T09:36:00+07:00 — Centered each example’s KaTeX expression, kept
  its explanatory sentence left-aligned, and prefixed that sentence with an
  arrow marker. No verification/build was run per the user’s standing
  instruction.
- 2026-07-15T09:37:00+07:00 — Added the “Language Modeling là gì” title and
  replaced the definition lead with the approved English wording from the
  reference image. No verification/build was run per the user’s standing
  instruction.
- 2026-07-15T09:38:00+07:00 — Removed the redundant inline KaTeX notation from
  the definition lead; the display formula below remains the single formula
  presentation. No verification/build was run per the user’s standing
  instruction.
- 2026-07-15T09:40:00+07:00 — User requested an Autoregressive (AR) language
  model page after “Ví dụ về Tokenization,” with the pictured chain-rule
  formula. Reopened this existing plan; no runtime files changed while awaiting
  approval for the new page structure.
- 2026-07-15T09:41:00+07:00 — User approved the autoregressive page; status
  advanced through `approved` to `executing` before runtime changes.
- 2026-07-15T09:43:00+07:00 — Added the Autoregressive (AR) language-model page
  after “Ví dụ về Tokenization,” including the chain-rule probability formula
  rendered by KaTeX and the approved Vietnamese chain-rule note. Registered the
  domain MDX component, increased Roadmap metadata to 14 pages, and shifted
  later pages to indexes 9–13. Confirmed the final page sequence is 0–13. No
  verification/build was run per the user’s standing instruction.
- 2026-07-15T09:44:00+07:00 — Replaced the AR introduction with the requested
  next-token definition and rendered its subject and prediction clause in bold.
  No verification/build was run per the user’s standing instruction.
- 2026-07-15T09:45:00+07:00 — Added the requested “Tôi ăn cơm” conditional
  probability example and multiplication result to the AR page, all rendered
  with KaTeX, followed by the exact Chain Rule explanation. No verification/build
  was run per the user’s standing instruction.
- 2026-07-15T09:46:00+07:00 — Removed bold emphasis from the AR introduction,
  leaving the sentence at one text weight. No verification/build was run per
  the user’s standing instruction.
- 2026-07-15 — User approved splitting the 14-page Roadmap into four focused
  lesson/quiz pairs. Reopened this existing plan for execution; no new plan was
  created, and routine verification/build remains skipped per the user’s
  standing instruction.
- 2026-07-15T11:26:33+07:00 — Split the 14 Roadmap pages into four authored
  lessons containing 2, 3, 5, and 4 pages, each followed immediately by a
  dedicated `Quiz` node. Preserved `llm-from-scratch-roadmap` as the first
  lesson’s canonical route, redistributed the five existing checkpoint
  questions, and added focused questions for domain choice, LLM system
  components, Academia/Industry emphasis, and the chain-rule example. Updated
  the typed TOC and existing Learning Lab wiki counts/list. Static page/ID and
  whitespace checks passed; no verify/build was run per the user’s standing
  instruction.
- 2026-07-15 — User approved a one-page interactive AR inference pipeline with
  five selectable steps and a dedicated quiz node. Reopened this existing plan
  for execution; no new plan was created.
- 2026-07-15T11:48:27+07:00 — Added the authored “Quy trình sinh token của AR
  Language Model” lesson and its adjacent two-question quiz after the language
  modeling quiz. The one-page domain renderer exposes five click/focus steps;
  tokenize, forward, probability, sample, and detokenize blocks reveal their
  corresponding data while completed/future blocks retain visited/muted
  context. Registered the MDX component, updated the typed TOC and Learning Lab
  wiki counts/list. Static allowlist, ID/page, and whitespace checks passed; no
  verify/build was run per the user’s standing instruction.
- 2026-07-15T11:59:20+07:00 — Extended the AR inference lesson to two pages
  with a code-native `Corpus → Vocabulary → Output vector` explanation. The
  authored example uses `|V| = 8`, maps every vector position to a token ID and
  probability, and clarifies that real output-vector length equals vocabulary
  size rather than corpus or context length. Added the corresponding third quiz
  question and registered the new domain MDX renderer. Static component,
  page-count, page-index, and whitespace checks passed; no verify/build was run
  per the user’s standing instruction.
- 2026-07-15T16:25:47+07:00 — User approved a separate lesson after the AR
  inference pipeline for output projection, softmax, and a scoped
  cross-entropy-loss bridge, followed by its own quiz. Reopened this existing
  plan for execution; no new plan was created.
- 2026-07-15T16:27:36+07:00 — Added the two-page “Output head và loss của
  Language Model” lesson and adjacent two-question quiz after the AR inference
  pipeline quiz. The domain renderer visualizes `h ∈ R^d → Linear → logits ∈
  R^{|V|} → softmax`, then introduces training-only cross-entropy as `L = -log
  p(y)` with one numeric example. Registered both MDX components and updated
  the typed TOC plus current Learning Lab wiki counts/list. Static checks
  passed; no verify/build was run per the user’s standing instruction.
- 2026-07-15T16:33:45+07:00 — Replaced the projection page’s generic
  horizontal cards with a code-native technical overview matching the approved
  reference topology: input token embeddings feed a neural network, which
  produces context vector `h`; a `d → |V|` linear projection creates logits;
  softmax produces the next-token probability distribution. The authored MDX
  now supplies the running context and example probabilities. The diagram
  preserves its topology through horizontal overflow on compact screens rather
  than collapsing into unrelated cards. Static whitespace checks passed; no
  verify/build was run per the user’s standing instruction.
- 2026-07-15T16:47:53+07:00 — Replaced the projection diagram’s fixed SVG
  coordinates with DOM-anchor connectors. Each block exposes a measured ref;
  connector paths map actual right-center and left-center points, including an
  elbow path from context vector `h` up to the linear layer. A `ResizeObserver`
  recomputes paths when the canvas or any endpoint changes size, eliminating
  drift between CSS-positioned blocks and stretched SVG coordinates. Static
  whitespace checks passed; no verify/build was run per the user’s standing
  instruction.
- 2026-07-15 — User approved expanding the projection overview into
  progressive-highlight pages for every block through the final softmax
  distribution, with the existing loss page retained last. Reopened this plan
  for execution; no new plan was created.
- 2026-07-15T17:21:54+07:00 — Expanded the output-head lesson from two to
  seven pages: one full overview, five fixed-geometry progressive-highlight
  pages, and the existing loss page last. Added a typed focus prop that mutes
  unrelated diagram blocks and highlights the active transition’s endpoints
  plus measured connector. Replaced the overview lead with the approved
  Vietnamese pipeline sentence and removed the former standalone linear/softmax
  note from MDX and renderer contracts. Static page-count, page-index, formula
  escaping, and whitespace checks passed; no verify/build was run per the
  user’s standing instruction.
- 2026-07-15T17:47:10+07:00 — Redrew the AR token-generation overview as a
  compact horizontal black-box pipeline: tokenize, model forward, next-token
  probabilities, sampling, and detokenization. Preserved the existing token
  IDs, candidate distribution, cumulative step emphasis, and horizontal
  overflow for compact screens so the following output-head lesson reads as a
  natural zoom into the model/probability black boxes. Whitespace checks passed;
  no verify/build was run per the user’s standing instruction.
- 2026-07-15T17:51:09+07:00 — Split the AR token-generation pipeline into five
  fixed-geometry progressive pages, one for each black-box step, and moved the
  vocabulary-output explanation to page 5. The lesson page now owns the active
  step through an MDX prop instead of renderer-local click state, matching the
  navigation and cumulative-highlight pattern of the output-head lesson while
  sharing one locale-authored content object across all five pages. Static
  page-count, page-index, and whitespace checks passed; no verify/build was run
  per the user’s standing instruction.
- 2026-07-15T17:55:44+07:00 — Replaced the AR token-generation lesson content
  wholesale with an exact duplicate of the seven-page output-head lesson,
  retaining only the AR lesson’s canonical ID and title. This resets both nodes
  to the same renderer, geometry, connectors, and progressive states before the
  AR copy is simplified into black boxes. A normalized file comparison confirmed
  that only `id` and `title` differ; whitespace checks passed, and no verify/build
  was run per the user’s standing instruction.
- 2026-07-15T18:00:51+07:00 — Corrected the temporary content-level duplicate:
  restored the AR lesson’s five inference steps plus vocabulary page while
  retaining the output-head diagram’s fixed canvas, major block coordinates,
  DOM-measured connectors, and cumulative highlighting. The AR renderer now
  presents tokenizer, token IDs, the AR model, next-token distribution, sampling,
  and detokenization as black boxes; the following output-head lesson expands the
  same visual map into context vector, projection, logits, and softmax. Static
  page-count, page-index, component-reference, and whitespace checks passed; no
  verify/build was run per the user’s standing instruction.
- 2026-07-15T18:07:23+07:00 — Replaced the output-head lesson’s simple loss
  card with a code-native training-example figure. The new page marks `cat` as
  the next-token target in `I saw a cat on a mat <eos>`, aligns the model’s
  predicted distribution with a one-hot target vector, renders `L = -log
  p(cat) → min` with KaTeX, and shows the optimization direction: increase the
  target probability while decreasing the remaining tokens. Updated the
  locale-MDX content contract and preserved responsive stacking without adding
  decorative borders. Formula-escaping and whitespace checks passed; no
  verify/build was run per the user’s standing instruction.
- 2026-07-15T18:19:51+07:00 — Split cross-entropy training into a dedicated
  authored lesson and quiz after the output-head lesson/quiz pair. The output
  head now contains six projection/softmax pages and one projection question.
  The new eight-page loss lesson advances the target through `I saw a cat on a
  mat <eos>`, updating the visible prefix, predicted distribution, one-hot
  target, KaTeX loss expression, and increase/decrease directions at every
  position; its adjacent quiz checks target shifting and loss behavior. Added
  both canonical IDs to the typed TOC and updated the existing Learning Lab wiki
  to 627 nodes, 21 authored lessons, 17 authored LLM lessons, and 606
  placeholders. Static metadata, title, page-index, component-reference,
  formula-escaping, and whitespace checks passed; no verify/build was run per
  the user’s standing instruction.
- 2026-07-15T18:26:20+07:00 — Collapsed the loss lesson’s eight target pages
  into one animated page backed by a single locale-MDX sequence/distribution
  payload. The renderer auto-advances every 1.8 seconds from `I` through
  `<eos>`, stops at the final target, and exposes pause/play, previous, next,
  replay, and step-count controls; autoplay is disabled when reduced motion is
  requested. Updated the lesson metadata to one page and preserved its separate
  quiz node. Static MDX-export, page-count, component-prop, and whitespace
  checks passed; no verify/build was run per the user’s standing instruction.
- 2026-07-15T18:35:42+07:00 — Expanded the single-page loss animation from
  eight target states to sixteen predict/update phases. Each token first shows
  the model’s initial distribution and loss, then applies a locale-authored
  updated distribution that raises the target probability, lowers competing
  probabilities, and displays the corresponding loss decrease before advancing
  to the next token. Controls now traverse individual phases and label the
  current token plus `Dự đoán` or `Cập nhật`. All initial and updated
  distributions contain eight entries and sum to 1; whitespace checks passed,
  and no verify/build was run per the user’s standing instruction.
- 2026-07-15T18:39:51+07:00 — Added a second page to the loss lesson for
  interactive hand calculation of `L = -ln p(cat)`. A code-native slider updates
  the probability and KaTeX result directly, while selectable `p = 0.1`, `0.5`,
  and `0.9` examples expose the inverse probability/loss relationship and explain
  why probability mass assigned to wrong tokens lowers `p(cat)` and raises loss.
  Registered the domain MDX component and allowlist entry without adding Python
  or runtime dependencies. Static component-registration, page-index, and
  whitespace checks passed; no verify/build was run per the user’s standing
  instruction.
- 2026-07-15T18:46:21+07:00 — Extended the hand-calculation page with the full
  training sentence and an explicit `cat` target, a coupled five-token
  probability distribution, and a code-native `y = -ln(p)` curve. Moving the
  slider now reallocates the remaining `1 - p(cat)` mass across wrong tokens,
  keeps the distribution normalized, updates the KaTeX calculation, and moves a
  highlighted point along the loss curve. Checked the distribution at slider
  endpoints and midpoint; each sums to 1, and whitespace checks passed. No
  verify/build was run per the user’s standing instruction.
- 2026-07-15T19:01:25+07:00 — Added a third loss-lesson page that derives the
  mathematical training objective from sequence likelihood. Four KaTeX stages
  expand the autoregressive joint probability into a product of conditional
  token probabilities, apply log to obtain a sum, negate the log-likelihood to
  convert maximization into minimization, and present the mean token-level NLL.
  Registered the new locale-MDX renderer and connected each sequence term back
  to the per-position loss shown in the animation. Static component allowlist,
  page-index, formula-escaping, and whitespace checks passed; no verify/build was
  run per the user’s standing instruction.
- 2026-07-15T19:24:00+07:00 — Audited every published LLM lesson/quiz pair and
  aligned quiz coverage with the concepts actually taught. Kept the AI-landscape
  and system-component quizzes in place; expanded Language Modeling with its
  probability-distribution definition and the technical meaning of model
  “understanding”; expanded the AR pipeline with corpus/vocabulary and softmax
  normalization; expanded output head with context-vector, logits, and softmax
  checks; expanded loss with one-hot targets, hand calculation, log-likelihood,
  NLL, and sequence aggregation; completed encoder/decoder pipeline coverage;
  and replaced the ambiguous pattern-memorization question with scale and LLM
  popularity checks. Removed the untaught `teacher forcing` metadata keyword.
  Question counts now match every quiz `pageCount`; whitespace checks passed,
  and no verify/build was run per the user’s standing instruction.
- 2026-07-15T19:42:00+07:00 — Re-audited all published LLM quizzes with three
  parallel read-only reviews, then replaced giveaway distractors with plausible
  conceptual confusions and removed answer-position patterns. Single-choice
  correct answers now span A/B/C/D with a 4/7/8/5 distribution instead of being
  concentrated in A; multi-choice answers are interleaved rather than grouped
  at the top. Distractors now test nearby distinctions such as logits versus
  probabilities, raw versus contextualized embeddings, corpus versus
  vocabulary, likelihood versus loss, and encoder versus decoder roles.
  Question counts still match every quiz `pageCount`; whitespace checks passed,
  and no verify/build was run per the user’s standing instruction.
