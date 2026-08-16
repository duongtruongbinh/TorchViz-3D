---
title: Learning Lab UI/UX Review and Polish
status: done
created: 2026-07-12T23:25:00+07:00
updated: 2026-07-14T13:14:00+07:00
author: duongtruongbinh
task: "Review, standardize, and improve the Learning Lab website UI/UX across its main user flows."
supersedes:
  - docs/plans/2026-06-21-learning-lab-refactor.md
  - docs/plans/2026-06-21-landing-ui-iteration.md
---

# Goal

Make Learning Lab feel like one coherent, polished learning product rather than
a collection of separately styled screens. Success means the home catalog,
domain/course surface, lesson rail, lesson detail, review mode, and shared shell
have consistent hierarchy and interaction patterns, while remaining usable on
desktop, tablet, and mobile widths.

# Lineage

This visual and interaction pass follows the active Learning Lab and Landing
foundations:

- [2026-06-21-learning-lab-refactor](./2026-06-21-learning-lab-refactor.md)
- [2026-06-21-landing-ui-iteration](./2026-06-21-landing-ui-iteration.md)

It preserves the catalog/domain architecture documented by the earlier Learning
Lab refactor plans and the conventions in
`wiki/concepts/learning-lab.md`.

# Context and audit findings

- At 390px, the always-on 300px application sidebar leaves the content column
  unusably narrow. The shell needs a responsive navigation model instead of a
  scaled-down desktop grid.
- Desktop navigation is dense: the domain sidebar and a large lesson rail can
  compete with the lesson itself. Responsive breakpoints and clearer collapse
  behavior should keep lesson content primary.
- Home, course, lesson, and review surfaces use related colors but inconsistent
  card framing, spacing, typography, borders, shadows, and CTA treatment.
- Several Learning Lab components still contain one-off color/radius classes
  even though `src/components/learning/theme.ts` is the documented styling
  contract.
- The home catalog is scannable but visually repetitive; metadata, status,
  preview tracks, and CTA compete for attention.
- The lesson rail exposes large catalogs well but expands every chapter by
  default, producing excessive visual length and weak location awareness.
- Semantic structure is mostly sound, but the shell brand uses a clickable
  non-button wrapper and focus/pressed/expanded semantics need a targeted pass.
- Chromium showed no runtime warnings or errors during the initial audit.

# Decisions (locked)

- Treat this as a UI/UX system pass, not a learning-content rewrite.
- Preserve HashRouter routes, catalog selectors, lesson/practice behavior,
  language state, and the current light Learning Lab theme.
- Keep the left sidebar shallow: Home plus top-level domains only.
- Use the existing theme helper as the single default source for Learning Lab
  colors, radii, focus states, surfaces, and controls. Add semantic tokens there
  when the current contract is insufficient.
- Use `lucide-react` for ordinary UI icons.
- Implement responsive behavior with the existing React/Tailwind/CSS stack; add
  no new UI dependency.
- On compact screens, navigation becomes an overlay/drawer with an explicit
  open/close control and content gets the full viewport width.
- On compact lesson screens, the lesson rail becomes a dismissible navigation
  surface rather than a full document block above the lesson.
- Do not label placeholder-only content as fully available if the existing
  catalog metadata can express its real status. Any status adjustment must be
  catalog-driven, not a visual-only hardcode.
- Respect `prefers-reduced-motion`; decorative motion must never be required to
  understand state.

# Phases

## Phase 0 — Approval checkpoint

- Store this draft plan.
- Wait for explicit user approval.
- On approval, change status to `approved`, then `executing`, before editing
  runtime files.

## Phase 1 — Establish a consistent Learning Lab design system

- Audit `theme.ts` and Learning Lab component classes for duplicated one-off
  colors, radii, shadows, focus rings, and button states.
- Extend semantic theme tokens for shell, navigation, content width, cards,
  badges, and responsive overlays where needed.
- Normalize typography scale, vertical rhythm, borders, elevation, interactive
  states, and disabled states without changing the product's current blue-gray
  visual identity.

## Phase 2 — Fix shell and navigation responsiveness

- Refactor the fixed desktop grid into desktop sidebar plus compact drawer
  behavior.
- Make the header coherent at desktop and compact widths, with visible access
  to navigation, Path/Review, and language controls.
- Add overlay dismissal, escape-key behavior, sensible focus handling, and
  scroll containment for the compact navigation.
- Preserve the logo as the return-to-Landing affordance.

## Phase 3 — Improve Home and domain/course discovery

- Tighten the Home introduction so the syllabus becomes visible sooner.
- Redesign syllabus rows/cards for stronger title/status/description/metadata
  hierarchy and less repeated visual weight.
- Standardize domain course hero, requirements, learning outcomes, accordion
  rows, lesson metadata, and footer with the same shell tokens.
- Keep every domain accessible and all current navigation destinations intact.

## Phase 4 — Improve lesson and review flows

- Make lesson content the dominant surface and reduce navigation competition.
- Improve lesson rail defaults, chapter location cues, filters, empty states,
  current/completed states, and compact-screen presentation.
- Standardize lesson header, section spacing, pager/actions, practice cards,
  and review cards.
- Preserve section paging, next-lesson behavior, practice deep links, search,
  and catalog filtering.

## Phase 5 — Accessibility and interaction quality

- Replace non-semantic clickable wrappers with buttons/links where appropriate.
- Review focus visibility, hit targets, `aria-current`, `aria-expanded`, dialog
  semantics, escape dismissal, heading order, and icon-only labels.
- Check contrast in the active light palette and reduced-motion behavior.

## Phase 6 — Verification and documentation

- Run focused type/tests while iterating, then `npm run verify`.
- Audit the main flows with Playwright at representative widths (desktop,
  tablet, and 390px compact), in Vietnamese and English where text length can
  affect layout.
- Check Home, one dense domain (LLMs), one practice-heavy domain, Review mode,
  sidebar/drawer states, lesson rail, and lesson paging.
- Record actual files and verification results in this plan's execution log.
- Update `wiki/concepts/learning-lab.md` with the final responsive and
  UI convention changes; do not create another long-lived docs page.

# Acceptance criteria

- Learning Lab is usable without horizontal clipping or word-by-word text
  wrapping at 390px.
- Desktop users retain a stable sidebar and can collapse navigation surfaces.
- Compact users can open and dismiss domain and lesson navigation without
  losing their current route.
- Home, domain, lesson, practice, and review screens visibly share the same
  spacing, type, surface, radius, focus, and action conventions.
- Keyboard users can reach, identify, operate, and dismiss all navigation and
  major controls.
- Existing routes, localization, lesson selection, filters, practice deep links,
  and completion/next behavior remain functional.
- No new runtime dependency is added.
- `npm run verify` passes and browser console checks show no errors.

# Out of scope

- Rewriting lesson/course content or completing placeholder lessons.
- Adding authentication, persistence, progress sync, or backend services.
- Changing the Workspace, Canvas3D, Pyodide worker, torchstub, IR, or layout
  engine.
- Adding a dark-theme switch or redesigning Landing Page.
- Replacing HashRouter or introducing a new component library.

# Execution log

- 2026-07-12T23:25:00+07:00 — Read the required workflow, architecture briefing,
  Learning Lab scaffold/iteration plans, active wiki conventions, Learning Lab
  shell/theme/home/course/lesson code, and related CSS.
- 2026-07-12T23:25:00+07:00 — Audited the active app with Chromium at 1440x1000
  and 390x844. Confirmed the compact-width shell failure and reviewed Home and
  the dense LLM lesson flow. Browser console reported no errors or warnings.
- 2026-07-12T23:25:00+07:00 — Draft plan stored; no runtime files modified.
- 2026-07-12T23:32:00+07:00 — User approved the plan in conversation. Status
  advanced through `approved` to `executing`; runtime implementation started.
- 2026-07-12T23:39:00+07:00 — Reworked `LearningLabView` into a responsive
  shell: persistent/collapsible desktop navigation, compact overlay domain
  drawer, backdrop and Escape dismissal, breakpoint synchronization, and a
  compact lesson-table-of-contents drawer.
- 2026-07-12T23:39:00+07:00 — Updated `LearningLabHeader` with a compact menu
  affordance and responsive control sizing while preserving Path/Review and the
  direct language toggle.
- 2026-07-12T23:39:00+07:00 — Reduced Home visual density, aligned principle
  and syllabus surfaces with shared theme primitives, tightened compact
  spacing, and gave Review mode a standardized introductory panel.
- 2026-07-12T23:39:00+07:00 — Changed dense lesson catalogs to initially expand
  only the current chapter. Replaced the clickable logo wrapper with a semantic
  button and ensured closed compact navigation is hidden from interaction and
  the accessibility tree.
- 2026-07-12T23:39:00+07:00 — Audited Home and the 118-lesson LLM route at
  1440x1000 and 390x844 in Vietnamese and English. Verified domain and lesson
  drawers, overlay dismissal, Escape dismissal, breakpoint changes, language
  switching, and collapsed chapter state. Browser console reported no errors
  or warnings.
- 2026-07-12T23:39:00+07:00 — `npm run verify` passed: TypeScript passed, all
  92 tests passed, and the production build completed. The existing Vite large
  Three.js chunk advisory remains unchanged and is outside this UI pass.
- 2026-07-12T23:39:00+07:00 — Updated the existing Learning Lab wiki page with
  the responsive shell, compact drawer, lesson rail, and accessibility
  conventions. Plan marked done.

# Desktop Learning Home Addendum

## Addendum status

Draft — this addendum reopens the current plan for a desktop-only Learning Home
visual and discovery pass. Runtime work must wait for explicit user approval.

## Desktop audit findings

- At both 1920x1080 and 1280x800, the Home surface reads more like a long
  documentation catalog than a purposeful learning dashboard.
- The first viewport lacks a clear hero-level heading, focal visual, primary
  learning action, and useful catalog summary. The current project label and
  goal sentence do not establish enough hierarchy.
- Three equal principle cards consume a large part of the first viewport but do
  not help the learner choose where to start.
- Syllabus rows repeat the same visual weight and CTA treatment twelve times.
  Available practice, domain scale, and recommended starting points are not
  easy to compare at a glance.
- Page, panel, principle cards, and syllabus cards use similar light values, so
  the interface lacks depth and a memorable product focal point.
- The content container feels narrow at 1920px and compressed at 1280px; the
  desktop composition needs intentional wide and standard-laptop layouts.
- The sidebar and header are already functional and should remain stable during
  this addendum.

## Addendum decisions (locked)

- Limit this pass to the desktop Home surface owned by
  `src/components/learning/shell/DomainCatalog.tsx`, plus shared localization or
  theme tokens only when required by the final composition.
- Preserve the responsive/mobile behavior completed earlier. Desktop-specific
  improvements begin at the existing desktop breakpoint and must not regress
  compact layouts.
- Preserve all catalog data, domain routes, sidebar behavior, Path/Review
  behavior, and the current light Learning Lab identity.
- Build the Home around three desktop priorities: understand the product,
  choose a starting direction, and scan the complete curriculum.
- Introduce one strong hero/focal surface rather than adding many decorative
  cards. Decorative graphics must be lightweight DOM/CSS and meaningful to the
  learning concept; no new image or UI dependency.
- Replace the three oversized principles with a more compact trust/value strip
  or supporting composition so useful learning choices appear earlier.
- Give catalog items differentiated hierarchy using existing catalog facts:
  lessons, practice count, status, and track previews. Do not invent progress,
  popularity, enrollment, ratings, or recommendation claims that the product
  cannot support.
- Avoid twelve repeated high-emphasis CTA buttons. The whole domain card may
  remain interactive, with one consistent directional affordance and visible
  keyboard focus.
- Keep Vietnamese and English copy balanced at 1280px and 1920px.
- Respect reduced motion and keep visual flourish secondary to scanning and
  navigation.

## Addendum phases

### Phase A — Approval checkpoint

- Store this addendum in the existing plan.
- Wait for explicit user approval before changing runtime files.
- On approval, move the plan through `approved` to `executing` and record the
  transition in the existing execution log.

### Phase B — Desktop Home information architecture

- Recompose the top of Home into a clear hero with a real page heading,
  concise product promise, catalog totals derived from current data, and a
  direct route into curriculum discovery.
- Convert the three principles into a compact supporting strip so the syllabus
  begins within or immediately after the first desktop viewport.
- Establish consistent max-width and desktop gutters for 1280px, 1440px, and
  1920px screens.

### Phase C — Curriculum discovery and visual hierarchy

- Replace the uniform syllabus stack with a more scannable desktop course
  directory that preserves every domain.
- Differentiate titles, descriptions, status, track previews, lesson/practice
  metrics, and the open affordance without relying on repeated primary buttons.
- Highlight domains with real practice through factual metadata rather than
  unsupported marketing labels.
- Keep cards readable, keyboard operable, and resilient to long Vietnamese and
  English domain names.

### Phase D — Visual polish and consistency

- Add controlled contrast between page background, hero, support strip, and
  curriculum surfaces using the existing blue-gray palette.
- Standardize type scale, line length, spacing rhythm, borders, elevation,
  hover/focus states, and icon treatment through existing theme conventions.
- Ensure the desktop Home feels related to Landing and the lesson experience
  without copying the dark Landing design or changing the global shell.

### Phase E — Verification and documentation

- Run `npm run verify`.
- Audit Home with Playwright at 1280x800, 1440x1000, and 1920x1080 in both
  Vietnamese and English.
- Check first-viewport hierarchy, long-title wrapping, hover/focus behavior,
  domain navigation, console output, and compact regression at 390px.
- Append actual modifications and verification results to this plan.
- Update the existing Learning Lab wiki page only if the final Home convention
  changes its documented ownership or design rules.

## Addendum acceptance criteria

- The first desktop viewport clearly communicates what Learning Lab is and
  exposes a useful path into the curriculum.
- At least the beginning of the curriculum directory is visible at 1280x800
  without making the hero feel cramped.
- All twelve domains remain accessible and more quickly comparable by title,
  track preview, lesson count, practice availability, and status.
- Repeated domain cards no longer compete through twelve identical primary CTA
  buttons.
- The layout feels intentional at 1280px, 1440px, and 1920px, with no excessive
  empty margins or cramped copy.
- Vietnamese and English layouts remain stable, keyboard focus is visible, and
  domain navigation behavior is unchanged.
- Mobile and lesson-flow behavior from the completed first pass remains intact.
- No new runtime dependency is added and `npm run verify` passes.

## Addendum out of scope

- Sidebar/header redesign, mobile redesign, lesson rail, lesson detail, Review
  mode, course content, or domain route changes.
- New progress tracking, recommendations, personalization, authentication, or
  persistence.
- Landing Page redesign or dark theme support.

- 2026-07-12T23:46:00+07:00 — Audited the current Learning Home at 1920x1080
  and 1280x800 after the responsive pass, recorded the desktop hierarchy and
  discovery issues above, and added this desktop-only addendum to the existing
  plan. No new plan file or runtime modification was created for this addendum.
- 2026-07-12T23:51:00+07:00 — User approved the desktop Home addendum in
  conversation. The existing plan advanced through `approved` to `executing`;
  desktop Home runtime work started.
- 2026-07-12T23:59:00+07:00 — Rebuilt `DomainCatalog` around a high-contrast
  product hero, existing localized Home promise, and live catalog totals (12
  domains, 610 lessons, and 12 practice items at implementation time).
- 2026-07-12T23:59:00+07:00 — Replaced the three oversized principle cards
  with a compact value strip and converted the repeated single-column syllabus
  into a wide-screen two-column curriculum directory. Whole-card navigation,
  status, track previews, metrics, and focus behavior remain intact; repeated
  primary CTA buttons were replaced with quieter directional affordances.
- 2026-07-12T23:59:00+07:00 — Audited Vietnamese and English Home layouts at
  1280x800, 1440x1000, and 1920x1080. Confirmed first-viewport curriculum
  visibility, stable long-copy wrapping, full domain metadata, and no browser
  console errors or warnings. Rechecked the 390x844 compact layout for
  horizontal overflow and shell regressions.
- 2026-07-12T23:59:00+07:00 — `npm run verify` passed: TypeScript passed, all
  92 tests passed, and the production build completed. The existing Vite large
  Three.js chunk advisory remains unchanged and outside this UI scope.
- 2026-07-12T23:59:00+07:00 — Updated the existing Learning Lab wiki page with
  the desktop Home hero, live catalog metrics, value strip, and curriculum
  directory conventions. Desktop addendum marked done.

# Compacted UI History

The following completed UI plans are absorbed here because their durable
decisions now form the single Learning Lab visual convention:

| Absorbed plan | Preserved decision and outcome |
|---|---|
| `2026-06-26-learning-lab-design-palette.md` | Established the restrained blue-gray Learning Lab identity and semantic light/dark surface tokens. |
| `2026-06-26-ui-conventions-and-icons.md` | Standardized radii, interaction states, and `lucide-react` icons across Landing, Workspace, and Learning Lab. |
| `2026-07-02-learning-lab-scrollbar-search-cleanup.md` | Consolidated scrollbar styling, lesson search behavior, and compact rail controls. |
| `2026-07-04-learning-home-syllabus.md` | Added the catalog-derived Home curriculum index and whole-card domain navigation. |
| `2026-07-06-learning-home-module-descriptions.md` | Expanded domain descriptions and removed redundant track-count emphasis. |
| `2026-07-14-learning-home-course-card-grid.md` | Standardized course cards with 150px visual band, 410px min desktop height, soft palettes, and responsive grids. |
| `2026-07-14-sync-main-reapply-learning-home.md` | Reapplied Learning Home course card grid after main sync. |
| `2026-07-15-learning-lab-arrow-traversal.md` | Added previous/next arrow button lesson traversal in Learning Lab header/footer. |
| `2026-07-28-ordering-exercise-drag-improvement.md` | Improved ordering exercise drag interaction and visual feedback. |

The later responsive shell, desktop Home pass, and portrait course-card update
continue this same owner plan. Current UI rules live in
`wiki/concepts/learning-lab.md`; historical metrics mentioning practice items
describe the pre-MDX catalog and are not current runtime claims.

