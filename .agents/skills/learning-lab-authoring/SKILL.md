---
name: learning-lab-authoring
description: >-
  Universal guide and standards for authoring Learning Lab lessons, blog posts, and deep-dives across all domains:
  pedagogical structure, terminology and wording rules, formula presentation, typography constraints,
  and illustration asset selection and generation.
---

# Learning Lab Universal Lesson & Content Authoring Guide

This skill defines universal authoring standards, technical deep-dive guidelines, terminology/wording conventions, mathematical formula formatting, and illustration selection/generation rules applied across **all domains** in TorchViz-3D Learning Lab (Linear Algebra, Deep Learning, Computer Vision, NLP, LLM & AI Engineering, MLOps/LLMOps, Continual Learning, AI System Design, Reinforcement Learning, Research Papers, etc.).

---

## 1. Pedagogical Architecture & Pacing

Each lesson must deliver an intuitive learning curve, following the progression: **Intuition / Phenomenon $\to$ Underlying Mechanism $\to$ Mathematical Formulation & Empirical Verification**. Depending on the topic domain, adhere to the standard frameworks below:

### A. Model Architecture & Advanced Mechanisms (Model Architecture / Mechanism / Research Papers)
- **Part 1: Context & The Paradox / Problem:**
  - Begin with problem intuition and the baseline architecture.
  - Highlight the core engineering paradox (e.g., why tiny low-rank adapters still induce catastrophic forgetting, why deep networks encounter vanishing gradients, why standard attention scales as $O(N^2)$).
  - Conclude with a **leading question** directing the reader to the latent representation subspace.
- **Part 2: Representation & Theoretical Motivation:**
  - Dissect how information and gradients are compressed and propagated through latent space (manifolds, feature subspaces, energy concentration).
  - Establish the necessary conservation / optimization principles.
- **Part 3: Mathematical Solution, Intervention Mechanism & Empirical Validation:**
  - Present core formulas alongside geometric decomposition.
  - Provide concrete numerical examples with real numbers showing clear before-and-after transformations.
  - Include quantitative multi-benchmark comparison tables (measuring trade-offs, accuracy, latency, forgetting mitigation).

### B. Mathematical & Analytical Foundations (Linear Algebra / Deep Learning Foundations)
- **Geometric Intuition First:** Always open with 2D/3D spatial meaning (transformations, axis rotation, coordinate stretching, variance distribution).
- **Algebraic Formulation:** Present matrices and vectors cleanly, explicitly defining each variable and shape.
- **Machine Learning Significance:** Explain why this mathematical concept dictates modern AI model success or failure.

### C. Systems & Engineering Workflows (MLOps, LLMOps, AI System Design)
- **Real-World Production Needs:** Production environment challenges (data drift, scale, latency, pipeline reliability).
- **Architectural Flow Design:** Component block diagrams and sequential stages.
- **Trade-offs & Best Practices:** Pros/cons analysis across solutions with production deployment standards.

### D. Section Structure & Heading Pacing (No Stacked Headings)
- **No Consecutive Section and Subsection Headers:** At the beginning of each page or section, never place a section heading (`## Heading`) immediately followed by an ochre/orange subsection (`### Subheading`, rendered in `#7A5A32`) without breathing room or introductory prose.
- **Mandatory Lead-in Narrative:** Every page and major heading must open with introductory context, intuitive framing, or a motivating question before branching into granular subsections. Stacking headings creates visual crowding and jarring double accent jumps.

---

## 2. Terminology & Phrasing Standards

### A. Typography, Bold Usage & Callout Cleanliness
- **Minimize italics (*italics*):** Italics reduce scannability and legibility in technical reading. Use regular text or selective bolding instead.
- **Selective and Concise Bold (**bold**):**
  - Only bold core technical terms, key concepts, or critical scannable anchors upon first introduction.
  - Bold phrases must be **concise (1–4 words)**; never bold entire sentences or long paragraphs.
- **Critical Scrutiny Before Bolding Labels or Standalone Phrases:**
  - Before creating any bold line or label (e.g., `**Cơ chế Đột biến Lật bit trên chuỗi 6 đặc trưng:**`, `**Đặc trưng Phenotype:**`), deliberately ask:
    1. Is this bold line truly necessary?
    2. Will the reader naturally understand the content without it?
    3. Has the section title, subsection title, or surrounding text already stated this information?
  - If redundant or self-evident, eliminate the bold line completely.
- **No Callout Notes (`<LessonNote>`) Unless Explicitly Requested:**
  - **Mandatory Rule:** ONLY use callout notes (`<LessonNote>`) when the user explicitly requests them in the prompt. By default, never use callout notes.
  - Present all notes, warnings, key takeaways, and insights as clean regular markdown prose (e.g. standard paragraphs or bullet lists) instead of callouts.
  - If a callout note is explicitly requested by the user, keep all text inside `<LessonNote>` in clean, regular font weight with ZERO bolding (no bold inside callouts). Do not bold arbitrarily across regular paragraphs.

### B. Retain Standard Technical English Terms
Keep foundational terms in standard English across titles and prose for academic precision and global reference:
- *Linear Algebra & Spectral Theory:* `Eigenvalues & Eigenvectors`, `Singular Value Decomposition (SVD)`, `Low-Dimensional Manifold and Representation Directions`, `Principal Subspace`, `Minor Subspace`, `Orthogonal Basis`, `Rank Deficiency`.
- *Model Architecture & Training:* `Self-Attention`, `Feed-Forward / MLP`, `Residual Connection`, `Batch Normalization`, `Layer Normalization`, `Down-projection`, `Up-projection`, `Linear Bottleneck`, `Gradient Flow`, `Backpropagation`.
- *PEFT & Continual Learning:* `Low-Rank Adaptation (LoRA)`, `Singular-Subspace Drift (SD)`, `Spectral Calibration`, `Catastrophic Forgetting`, `Zero Inference Overhead`.
- *MLOps & Systems:* `Feature Store`, `Data Versioning`, `Model Registry`, `Continuous Training (CT)`, `Inference Latency`, `Throughput`.

### C. Technical Accuracy in Phrasing
- **Explicit Parameter Scale Distinction:**
  - Entire models contain *billions of parameters* (7B, 70B parameters).
  - Individual weight matrices $W_0$ contain *tens of millions of parameters* (~16.7M parameters).
  - Low-rank adapters contain *tens of thousands of parameters* (~65K parameters).
- **Avoid Repetitive Verbs:** Do not repeat identical descriptive verbs across adjacent sentences.
- **Precise Technical Terminology:**
  - *Instead of:* "adding weights to the model"
  - *Prefer:* "modifying weight matrices via an additive delta $\Delta W$"
  - *Instead of:* "performing SVD on the whole model"
  - *Prefer:* "computing SVD on the pretrained weight matrix $W_0$"

---

## 3. Mathematical Pedagogy & Formatting

While general algebraic formulas ensure rigor, **always assume abstract formulas create cognitive friction for readers**. Therefore, mandate one of the two pedagogical flows below:

### A. Two Pedagogical Approaches
1. **Bottom-Up (Simple Example $\to$ Intuition $\to$ General Formulation):**
   - **Use when:** Introducing a novel, abstract, or complex mathematical concept (e.g., SVD, Singular Subspaces, Orthogonal Projections, Eigenvalues, Convolution).
   - **Flow:**
     1. Present a simple arithmetic 2D numerical example (e.g., a $2 \times 2$ matrix).
     2. Highlight geometric intuition (axis rotation, angular deviation $\theta$, energy compression).
     3. Generalize to $d \times k$ shapes or $N$-dimensional space.

2. **Top-Down (General Formulation $\to$ Concrete Values $\to$ Quantitative Comparison):**
   - **Use when:** Recapping an established architecture or presenting a top-level overview before component breakdown (e.g., LoRA adapter architecture, LayerNorm, Loss functions).
   - **Flow:**
     1. State general formula with explicit tensor shapes.
     2. Substitute concrete values from real-world models (e.g., LLaMA 7B/8B).
     3. Draw direct quantitative conclusions (e.g., $256\times$ parameter reduction).

### B. Formula Formatting Rules
1. **Isolated Display Lines (BlockMath):** Never cram complex multi-term equations into inline prose.
2. **Explicit Dimension Annotations (Shapes):** Use `\underbrace` to annotate tensor dimensions:
   ```mdx
   <BlockMath formula="\Delta W \in \mathbb{R}^{d \times k} = \underbrace{B}_{\mathbb{R}^{d \times r}} \cdot \underbrace{A}_{\mathbb{R}^{r \times k}}" />
   ```
3. **Concrete Numerical Substitutions:** Provide real model dimension examples (e.g., LLaMA 7B/8B with $d=4096, k=4096, r=8$):
   ```mdx
   <BlockMath formula="\Delta W \in \mathbb{R}^{4096 \times 4096} = \underbrace{B}_{4096 \times 8} \cdot \underbrace{A}_{8 \times 4096}" />
   ```
4. **Quantified Relative Ratios:** Calculate exact parameter counts / FLOPs and ratios (e.g., $65{,}536$ parameters — $256\times$ smaller than the $16.7\text{M}$ base matrix).

---

## 4. Visual-First & Illustration Standards

### A. Golden Rule: Visual Anchors for Long & Complex Sections
For any section containing extended theoretical prose, multi-step proofs, or abstract reasoning:
- **Mandate a Summary Illustration (Visual Anchor)** at the top of the section to crystallize the core mental model.
- **80/20 Rule:** The illustration must enable readers to grasp **80% of the underlying mechanism and narrative flow** at a glance. The accompanying text serves as concise supplementary commentary rather than repetitive prose.
- **Placement:** Position visual blocks (`<LessonImage ... />` or `<Flowchart />`) immediately after the high-level overview and before component breakdown — establishes a mental model before readers process granular formulas.

### B. Visual Replacement Matrix

| Information Type | Instead of Bullet Points / Prose | Transform into Visual Component / Illustration |
| :--- | :--- | :--- |
| **Key Metric / Number** | Long sentence with stats | **Stat Hero Card / Metric Badge:** Highlight large numerical values (`256×`, `0.1%`, `99%`) with 1–2 word labels and progress indicators. |
| **Core Concept / Keyword** | Lengthy definition text | **Spotlight Concept Card:** Pastel bordered card with bold keyword and a **visual metaphor** (Lock = Frozen Weights, Funnel = Bottleneck, Magnet = Attention). |
| **Taxonomy / Hierarchies** | Deep nested bullet lists | **Hierarchy Tree / Branching Cards (`<ConceptHierarchy />`):** Hierarchical tree. **Rules:** Root node has a **concise keyword**, Leaf nodes **must have ordered numbering in the keyword** (`1. ...`, `2. ...`) with crisp `detail` and distinct `tone` colors. |
| **Comparative Analysis** | Text table of pros/cons | **Dual Side-by-Side Panels:** Two parallel cards (*Before vs After*, *Standard vs Proposed*) with soft contrasting background tones. |
| **Workflow / Pipelines** | Step 1, Step 2, Step 3 text | **Sequential Conveyor / Pipeline Flow (`<Flowchart />`):** Horizontal process cards connected by flow arrows. |
| **Energy & Distribution** | Verbal percentages | **Stacked Energy Bar / Balance Scale:** Segmented bar charts ($99\%$ vs $1\%$) or balance scale depicting weight shifts. |
| **Cause & Effect** | Descriptive error text | **Cause-and-Effect Card / Mermaid:** Cause node $\xrightarrow{\text{triggers}}$ Effect node with visual flow. |

### C. Educational Doodle Style (16:9)
- **Aspect Ratio:** 16:9 Landscape.
- **Layout:** 2 to 4 side-by-side rounded panels on white or soft pastel backgrounds.
- **Drawing Style:** Bold black hand-drawn outlines, elegant pastel accent colors, friendly stick-figure mascot demonstrating actions.
- **Visual-First Principle:** Illustrations must explain the concept via objects, arrows, boxes, balance scales, and data streams with minimal text (1–3 word labels).

### D. Component Selection Logic
→ See **§6C** for the full trigger-question routing table and hard restraint rules.

---

## 5. Catalog Synchronization & Integrity

Each lesson MDX file must maintain strict system contract compliance:

1. **`lessonMetadata.title`:** Must match 100% character-by-character with the corresponding locale `title` in the domain's `table-of-contents.ts`.
2. **`lessonMetadata.headings`:** Must contain the exact list of `### Heading` sections present in the lesson content.
3. **Locale Consistency:** Ensure published content matches catalog registration and passes `npm run verify`.

---

## 6. Pedagogical Judgment Checklist

Before finalizing any section or lesson, run through these three live editorial checks. They surface judgment calls that no style rule can fully automate.

---

### A. Terminology Familiarity Audit

For every domain-specific or multi-syllable technical term introduced in a section, ask:

1. **Has this term appeared earlier in the curriculum?**
   - If yes → use it without explanation (trust the learner's memory from prior lessons).
   - If no → this is its **first-exposure point**: define it inline within 1–2 sentences immediately after first use.

2. **Is this term likely familiar to the target learner profile?**
   - *Beginner lesson* (Lesson 1–3 in a domain): Assume zero prior exposure. Provide a one-line plain-language definition AND a concrete analogy before using the term technically.
   - *Intermediate lesson* (Lesson 4–8): Define only if the term sits outside the domain's established prerequisite list.
   - *Advanced lesson / Research Paper deep-dive*: Assume familiarity with all core terms; introduce only newly coined or paper-specific terminology.

3. **Is the term an abbreviation or acronym?**
   - Always expand on first use within the lesson: `Singular Value Decomposition (SVD)`, `Low-Rank Adaptation (LoRA)`.
   - After expansion, the short form may be used freely within the same lesson.

4. **Escalation actions when a term feels too distant:**
   - Add a **1-sentence intuition bridge** (e.g., *"Think of this as…"*) — never exceed one sentence.
   - Add a **concrete real-world analogy** that doesn't require domain knowledge (e.g., compare gradient flow to water pressure in pipes).
   - If the gap is too large, consider splitting the content into a prerequisite sub-section or linking to the prerequisite lesson in the catalog.

---

### B. Concept Retention & Recall Audit

At every major section boundary, pause and ask: *"If a learner has read from the beginning of this lesson (or lesson series) up to this exact point, what do they reliably hold in working memory?"*

**Retention decay model — apply these heuristics:**

| Distance from Concept's First Introduction | Learner Retention Assumption | Action |
| :--- | :--- | :--- |
| Same paragraph or section | High — concept is still active | No reminder needed |
| Same lesson, 2+ sections away | Medium — may be fading | Drop a brief inline parenthetical: *(recall: SVD decomposes W into U Σ Vᵀ)* |
| Different lesson in the same domain | Low — likely forgotten | Add a 1–2 sentence recap at the top of the section where it re-appears |
| Cross-domain reference | Very low | Provide a self-contained micro-definition + link to the source lesson |

**Specific triggers that mandate a recap:**
- Reusing a formula introduced 3+ sections ago without restating what each variable means.
- Referencing a named result (e.g., *"the rank-deficiency property we established"*) without restating the property in 1 sentence.
- Chaining two abstractions (e.g., using eigenvalues inside a LoRA explanation) without restating what eigenvalues measure.

**Re-explanation variants (choose based on cognitive distance):**
- **Inline parenthetical** — for minor refreshers: *(where $\Sigma$ holds singular values — the "energy" of each direction)*.
- **One-sentence recap** — for medium distance: *"Recall that SVD expresses any matrix as three components: $U$, $\Sigma$, $V^T$."*
- **Mini review block** — for cross-domain references: a short unnumbered sub-section titled *"Quick Review: [Concept]"* with 2–3 bullet points restating the essentials.

---

### C. Design Component Selection Logic

Before placing any UI component, answer these decision questions. Use the table as a routing guide:

| Trigger Question | Best Component | Avoid |
| :--- | :--- | :--- |
| Is this a **sequential, step-by-step process** (pipeline, data flow, training loop)? | `<Flowchart />` (horizontal conveyor cards + arrows) | Numbered prose list |
| Is this a **taxonomy or multi-level classification** (architecture families, loss function types, PEFT variants)? | `<ConceptHierarchy />` (tree, root → branches → leaves) | Deep nested bullet lists |
| Is this a **navigational overview** of lessons or topic clusters within a domain? | `<CourseCards />` | Inline links or flat list |
| Does the content spotlight a **single concept with a visual metaphor** (one keyword + image)? | Spotlight Concept Card (pastel border, icon, 1-sentence definition) | Plain bold text heading |
| Is this a **key numerical result** (parameter count, speedup ratio, accuracy delta)? | `<MetricBars />` or Stat Hero Card | Inline sentence |
| Is there a **before-vs-after or standard-vs-proposed** contrast? | Dual Side-by-Side Panels | A prose paragraph with "whereas" constructions |
| Is the content a **narrative concept bridge** (abstract idea → concrete analogy)? | `<ConceptFlow />` (left card = abstract, right card = analogy, connector arrow) | A paragraph of metaphors |
| Is this a **long theory section** needing an upfront mental model? | `<LessonImage />` doodle (16:9, 2–4 panels) at section top | Opening the section with dense formula prose |

**Hard rules for component restraint:**
- Never place two `<ConceptHierarchy />` trees within the same lesson section — merge or flatten.
- `<CourseCards />` belongs at lesson-end or domain-overview pages only; never mid-lesson.
- `<ConceptFlow />` is for concept bridging (abstract → concrete), not for step sequences; use `<Flowchart />` for steps.
- If in doubt between two components, choose the simpler one. Complexity must earn its place.
- Always ask: *"Does adding this component replace a weaker prose explanation, or is it decorative?"* — only add if it replaces.
