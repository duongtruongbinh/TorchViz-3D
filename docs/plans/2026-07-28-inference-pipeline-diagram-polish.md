---
title: Inference Pipeline Diagram Polish — container block, alignment, connectors
status: executed
created: 2026-07-28
updated: 2026-07-28
author: hienlong
approved-by: user (direct prompt)
task: diagram
supersedes: null
---

# Inference Pipeline Diagram Polish

## Task

In `src/content/learning/llm-ai-engineering/ar-language-model-inference-pipeline.vi.mdx`
(pages 0–4 via `LlmArInferencePipeline`):

1. **Wrap a visual container block** around the Sample → Detokenize section to
   make the "decoding / inference pipeline" stage visually distinct.
2. **Add SVG connector paths** for Distribution → Sample (vertical) and
   Sample → Detokenize (horizontal) — currently neither has a dynamic SVG path.
3. **Align entities**: ensure Sample and Detokenize positions are vertically
   level and the arrow between them is properly centered.
4. **Add a feedback-loop indicator** (optional but recommended) from Detokenize
   output back to the input text to illustrate the autoregressive loop.

## Analysis of current state

The `LlmArInferencePipeline` component in
`src/components/learning/domains/llm-ai-engineering/renderers.tsx` renders a
30 rem × 64 rem canvas with absolutely‑positioned elements.

**Current connector coverage:**

| From → To             | Has SVG path? | Notes                              |
|-----------------------|:-------------:|-------------------------------------|
| Tokenizer → Token IDs | ✅            | Horizontal line                     |
| Token IDs → Model     | ✅            | Elbow (horizontal → vertical → horizontal) |
| Model → Distribution  | ✅            | Horizontal line                     |
| Distribution → Sample | ❌            | Missing — Sample is manually placed |
| Sample → Detokenize   | ❌            | Only a static `<ArrowRight>` icon   |

**Layout issues:**
- Sample and Detokenize sit at `top-[20.5rem]` but the arrow between them is at
  `top-[22.25rem]` — mismatched vertical centers.
- No visual grouping distinguishes the decoding stage (Sample + Detokenize) from
  the earlier stages.
- The autoregressive feedback loop (sampled token appended to input) has no
  visual representation.

## Executed changes

### 1. Container block (new)

Replace the three separate absolutely‑positioned elements (Sample, ArrowRight,
Detokenize) with a single absolutely‑positioned container div:

```
┌─ Inference Pipeline ──────────────────────┐
│                                            │
│   Sample          →      Detokenize         │
│ ┌──────────┐           ┌─────────────────┐ │
│ │   dogs   │           │ She likely      │ │
│ │    5     │           │ prefers dogs    │ │
│ └──────────┘           └─────────────────┘ │
└────────────────────────────────────────────┘
```

- `border-2 border-dashed` with subtle background tint
- A label "Inference Pipeline" in the top‑left
- Use flex/grid inside to align Sample (left) → Arrow (center) → Detokenize (right)

### 2. SVG connector paths (new)

Add `sampleRef` and `detokenizeRef` refs. Inside the existing `useEffect`:

- **Path 3 → Path 4**: Shift existing indices: current paths 0–2 remain, new
  paths 3–4 are:
  - Path 3: Distribution bottom → Sample top (vertical arrow)
  - Path 4: Sample right → Detokenize left (horizontal arrow)

The `anchor()` helper already supports `'top'` and `'bottom'` for vertical
connectors. Add those.

### 3. Alignment fix

- Vertically center the Sample and Detokenize within the container block.
- The Arrow between them uses the same vertical center as both panels.
- The container is positioned so a clean vertical arrow can drop from
  Distribution (right‑top) into the container (right‑bottom).

### 4. Feedback‑loop arrow (optional)

A curved SVG path from the Detokenize output text back to the Input text area
(bottom‑left), with a label "Autoregressive loop" or "Lặp lại" to illustrate
that the generated token is appended and the process repeats.

## Files to modify

| File | Change |
|---|---|
| `src/components/learning/domains/llm-ai-engineering/renderers.tsx` | Modify `LlmArInferencePipeline` — add refs, container block, connectors |
| `src/content/learning/llm-ai-engineering/ar-language-model-inference-pipeline.vi.mdx` | No changes needed (data content unchanged) |

## Verification

```bash
npm run verify
```

Also visually inspect the lesson pages:
- Browse to the lesson via the Learning Lab
- Step through pages 0–4 and confirm the container block appears, connectors are
  drawn, and alignment looks clean in both light and dark themes.

## Design constraints

- Keep the overall canvas size (`h-[30rem] min-w-[64rem]`)
- Do not break the step‑based opacity transitions (`stageTone` / `connectorTone`)
- Preserve all existing refs (`tokenizerRef`, `tokenIdsRef`, `modelRef`, `distributionRef`)
- The container block must work at all responsive widths (the canvas scrolls horizontally)
- Reuse existing color tokens (`themeClasses`)

## Modifications recorded

**File:** `src/components/learning/domains/llm-ai-engineering/renderers.tsx`

| # | Change | Lines affected |
|---|--------|----------------|
| 1 | Added `sampleRef`, `detokenizeRef`, `containerRef`, `inputRef` refs | After existing ref declarations |
| 2 | Extended `useEffect` elements array to include all new refs | Inside the effect |
| 3 | Updated `anchor()` helper to support `'top'` and `'bottom'` sides | Inside `updateConnectors` |
| 4 | Added connection calculations for distribution→container, sample→detokenize, and feedback loop path | Inside `updateConnectors` |
| 5 | Replaced standalone Sample div, ArrowRight icon, and Detokenize div with a single `border-dashed` container block labeled "Inference Pipeline" | Inside the canvas JSX |
| 6 | Added `ref={inputRef}` to the Input text element | Inside the canvas JSX |
| 7 | Updated SVG `<defs>` with a second marker (`#ar-loop-arrow`) for the dashed loop path | Inside the canvas SVG |
| 8 | Updated path rendering loop to apply `strokeDasharray`, thinner stroke, and separate marker for the last (loop) path | Inside the canvas SVG |
| 9 | Added "Autoregressive loop" label with bidirectional arrow indicators near the canvas bottom | After the container block |

**Connector path mapping:**
| Index | Origin → Destination | Shape | Tone stage |
|-------|---------------------|-------|------------|
| 0 | Tokenizer → Token IDs | Z‑shaped through `flowY` (model center) | 0 (Tokenize) |
| 1 | Token IDs → Model | Z‑shaped through `flowY` with elbow | 1 (Forward) |
| 2 | Model → Distribution | Horizontal at `flowY` then vertical | 2 (Predict) |
| 3 | Distribution → Container | Vertical straight down | 3 (Sample) |
| 4 | Detokenize → Input | Dashed bezier loop | 4 (Detokenize) |

**Alignment fix:** Repositioned entities so their vertical centers align at 11 rem:

| Element | Old top | New top | Height | Center |
|---------|---------|---------|--------|-------|
| Tokenizer | 15.15 rem | 9 rem | ~4.125 rem | 11.06 rem |
| Token IDs | 11.25 rem | 7 rem | 8 rem | 11 rem |
| Model | 4.5 rem | 5 rem | 12 rem | 11 rem |
| Distribution | 4 rem | 6.5 rem | ~9 rem | ~11 rem |

All connector paths 0–2 are now **straight horizontal lines** with no Z‑shapes or
elbows. Path 2 makes a single right‑angle drop at the end to reach the
distribution center. Connector 3 (Distribution → Container) remains vertical.

**File not modified:** The MDX lesson file (`ar-language-model-inference-pipeline.vi.mdx`) requires no changes — the content data is unchanged.
