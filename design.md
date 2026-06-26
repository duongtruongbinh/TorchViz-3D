# Design System

This document defines the visual direction for TorchViz-3D product surfaces.
Use it for Landing, Learning Lab, cards, controls, and future UI work. The
desired feel is clean, modern, technical, and slightly futuristic.

## Palette

| Token | Hex | Role |
|---|---:|---|
| `mist` | `#CAD6E5` | Soft panels, muted cards, secondary surfaces |
| `ice` | `#EBEFF4` | Main background, page sections, large empty space |
| `deep-blue` | `#205089` | Primary brand color, strong buttons, active states |
| `ink` | `#030509` | Main text, dark surfaces, high-contrast UI |
| `action-blue` | `#517FCB` | CTA accents, links, focus rings, highlights |

Core mapping:

```text
#EBEFF4 = background
#CAD6E5 = soft surface
#205089 = primary action
#030509 = text / dark contrast
#517FCB = highlight / accent
```

## Direction

- Use clean white-blue backgrounds and strong alignment.
- Prefer spacious layouts, minimal text, and clear hierarchy.
- Use blue accents for interaction, focus, progress, and selected states.
- Use subtle depth through soft shadows, borders, and restrained gradients.
- Use futuristic geometric, tiled, or product-preview visuals when a hero or
  feature area needs imagery.
- Avoid noisy colors and one-off palette drift.

## CSS Tokens

```css
:root {
  --color-mist: #CAD6E5;
  --color-ice: #EBEFF4;
  --color-deep-blue: #205089;
  --color-ink: #030509;
  --color-action-blue: #517FCB;

  --color-background: var(--color-ice);
  --color-surface: var(--color-mist);
  --color-primary: var(--color-deep-blue);
  --color-text: var(--color-ink);
  --color-accent: var(--color-action-blue);

  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 24px;
  --radius-xl: 32px;

  --shadow-soft: 0 16px 40px rgba(3, 5, 9, 0.10);
  --shadow-card: 0 8px 24px rgba(32, 80, 137, 0.12);
}
```

Learning Lab semantic helpers live in `src/components/learning/theme.ts`.
Prefer those helpers inside Learning Lab before adding local class strings.

## Color Usage

- Page background: `ice`.
- Secondary panels and soft cards: `mist` with a low-opacity `deep-blue`
  border.
- Primary buttons, active tabs, and selected states: `deep-blue` with `ice`
  text.
- Main text: `ink`.
- Secondary text: `rgba(3, 5, 9, 0.68)`.
- Links, focus rings, hover accents, icon accents, and progress indicators:
  `action-blue`.

Avoid using `action-blue` as small body text on light backgrounds.

## Typography

Use a clean sans-serif stack:

```css
font-family:
  Inter,
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

| Element | Size | Weight | Color |
|---|---:|---:|---|
| Hero title | 56-72px | 700 | `#030509` |
| Page title | 36-48px | 700 | `#030509` |
| Section title | 24-32px | 650 | `#030509` |
| Body text | 16-18px | 400 | `rgba(3, 5, 9, 0.72)` |
| Caption | 12-14px | 500 | `rgba(3, 5, 9, 0.56)` |

Do not scale font size directly with viewport width. Use responsive layout
constraints instead.

## Layout

Use spacious layouts with clear container widths and stable component sizing.

```css
.page {
  background: #EBEFF4;
  color: #030509;
  min-height: 100vh;
}

.container {
  width: min(1120px, calc(100% - 48px));
  margin: 0 auto;
}
```

Recommended spacing:

| Use | Value |
|---|---:|
| Small gap | 8px |
| Card padding | 24px |
| Grid gap | 24px |
| Section padding | 72px |
| Hero padding | 96px |

Use stable dimensions for boards, toolbars, icon buttons, counters, tiles, and
fixed-format panels so labels and hover states do not shift the layout.

## Components

### Primary Button

```css
.button-primary {
  background: #205089;
  color: #EBEFF4;
  border: 1px solid rgba(235, 239, 244, 0.18);
  border-radius: 999px;
  padding: 12px 20px;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(32, 80, 137, 0.24);
}

.button-primary:hover {
  background: #517FCB;
}
```

### Secondary Button

```css
.button-secondary {
  background: rgba(202, 214, 229, 0.72);
  color: #030509;
  border: 1px solid rgba(32, 80, 137, 0.16);
  border-radius: 999px;
  padding: 12px 20px;
  font-weight: 600;
}
```

### Card

```css
.card {
  background: rgba(202, 214, 229, 0.72);
  border: 1px solid rgba(32, 80, 137, 0.12);
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(32, 80, 137, 0.12);
  padding: 24px;
}
```

### Dark Card

```css
.card-dark {
  background: #030509;
  color: #EBEFF4;
  border-radius: 24px;
  box-shadow: 0 16px 40px rgba(3, 5, 9, 0.20);
}
```

Use cards for repeated items, modals, and genuinely framed tools. Avoid nesting
cards inside cards.

## Hero Sections

Hero sections should combine editorial text with a blue technical visual.

```text
Left side:
- Small eyebrow label
- Large headline
- Short description
- Primary CTA
- Secondary link

Right side:
- Large visual card
- Geometric blue 3D, hex pattern, or product preview
```

## Interaction States

```css
.interactive {
  transition: all 180ms ease;
}

.interactive:focus-visible {
  outline: 3px solid rgba(81, 127, 203, 0.45);
  outline-offset: 3px;
}

.interactive:disabled {
  opacity: 0.48;
  cursor: not-allowed;
}
```

Use `action-blue` for hover and focus accents. Keep enough spacing around all
interactive controls.

## Gradients

Use gradients sparingly and only when they support hierarchy or product polish.

```css
/* Light surface */
background: linear-gradient(135deg, #EBEFF4 0%, #CAD6E5 100%);

/* Primary blue */
background: linear-gradient(135deg, #205089 0%, #517FCB 100%);

/* Dark technical */
background: linear-gradient(135deg, #030509 0%, #205089 100%);
```

## Icons

Use `lucide-react` for common UI action and status icons when a matching icon
exists. Keep icon-only controls familiar and add accessible labels or tooltips.

Current conventions:

- Language toggle: `Languages` icon only.
- Sidebar toggle: `PanelLeft`.
- Open/start/enter: `ArrowRight`.
- Back to landing: `ArrowLeftToLine`.
- Theme: `Sun` and `Moon`.
- Dropdowns: `ChevronDown` and `Check`.
- Demo playback: `Play`, `Pause`, `SkipBack`, `SkipForward`.

Custom SVGs are still appropriate for visual content, generated exports,
diagrams, charts, and canvas/Three.js geometry.

## Accessibility

- Use `#030509` text on `#EBEFF4` and `#CAD6E5`.
- Use `#EBEFF4` text on `#205089` or `#030509`.
- Do not rely on color alone for state.
- Preserve visible focus states.
- Keep touch targets and icon buttons comfortably sized.
- Make sure text does not overflow or overlap at mobile and desktop widths.
