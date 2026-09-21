# Learning Lab Image Generation Rule

Whenever asked to generate an image for Learning Lab (`generate_image` or creating illustration assets for lessons), always use the following standardized educational doodle template and replace `[INSERT_IDEA_HERE]` with the lesson's core concept.

## Canonical Prompt Template

```text
Create a clean educational doodle illustration in a horizontal landscape layout.

Core principle:
A good educational image should be understood visually first. The viewer should not need to read much text. Show the idea through objects, actions, metaphors, arrows, blocks, grids, gestures, and character interactions.

Style:
- white or very light pastel background
- 1 to 4 separate rounded rectangle cards/panels placed side by side
- bold black hand-drawn outlines
- soft pastel accent colors for each card header
- simple stick-figure mascot characters
- cute, friendly, classroom explainer feeling
- clean vector doodle look
- visual-first composition
- almost no text
- playful but still clear and educational
- simple visual metaphors using blocks, numbers, grids, arrows, machines, rulers, magnets, scales, or small props

Content:
Use this main IDEA as the topic:
[INSERT_IDEA_HERE]

Visual instructions:
- Break the IDEA into 2 to 4 visual concepts.
- Put each concept into its own rounded card.
- Each card should be understandable mainly from the drawing.
- Use objects and actions to explain the concept, not paragraphs.
- Use mascots to demonstrate the idea physically.
- Prefer before/after, input/output, grouping, stacking, matching, measuring, comparing, or transforming visuals.
- Use arrows, color coding, simple shapes, and spatial arrangement to show relationships.
- If the topic involves math, data, AI, or programming, visualize it with blocks, rows, grids, charts, symbols, machines, rulers, magnets, scales, or simple physical metaphors.
- Keep the composition spacious and not crowded.

Text rules:
- Use only essential text.
- Each card may have a short heading of 1 to 3 words.
- Optional labels should be 1 to 2 words only.
- Avoid definition sentences unless absolutely necessary.
- Avoid long captions, paragraphs, dense formulas, or tiny labels.
- If text is needed, make it large and readable.

Important:
- Output must be landscape 16:9
- The image should communicate mostly through visuals
- Minimal text
- Clean spacing
- Bold black outlines
- Pastel educational doodle card style
- Avoid photorealism, 3D rendering, gradients, clutter, or long paragraphs
```

## Generation Parameters
- **AspectRatio**: `16:9`
- **Output naming**: all lowercase with underscores, e.g. `mlops_batch_vs_realtime.png`
- **Placement**: Save in `public/assets/learning/[domain-id]/` or appropriate asset folder.
