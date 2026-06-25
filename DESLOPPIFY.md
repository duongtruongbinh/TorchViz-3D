# Desloppify Backlog

Status: complete
Created: 2026-06-26

This file is the running cleanup backlog from a project-wide desloppify scan.
Items are grouped by priority and are meant to be selected one at a time.

## Critical Issues

### C1 - Production HTML still loads third-party CDN assets

- **Where:** `index.html`
- **Why it matters:** The product positions itself as browser-local, but the
  page loads Google Fonts, `cdn.tailwindcss.com`, and an importmap that points
  React/Three/Monaco packages at `esm.sh`. Even if Vite bundles most imports,
  the CDN script/font requests still leave the machine, produce production
  console warnings, and make offline/local privacy claims harder to defend.
- **Recommendation:** Move Tailwind into the Vite/PostCSS build, self-host or
  system-font fallback the fonts, and remove the stale CDN importmap unless a
  measured runtime path still needs it.
- **Timing:** Safe to fix now. It is isolated but should get a short browser
  smoke test and `npm run verify`.

### C2 - Pyodide runtime still depends on public CDNs at execution time

- **Where:** `src/workers/pyodideWorker.ts`
- **Why it matters:** The worker loads Pyodide from jsDelivr/unpkg/iodide CDN
  URLs and then points `indexURL` at those hosts for WASM/package assets. That
  breaks offline/local-first behavior, adds supply-chain risk, and contradicts
  the "no code or data leaves the machine" positioning. The fallback includes a
  much older Pyodide `0.15.0` URL, which increases compatibility uncertainty.
- **Recommendation:** Bundle or self-host a single pinned Pyodide runtime asset
  path through Vite/public assets, remove mixed-version CDN fallbacks, remove
  the `micropip` package load if it is still unused, and make the worker error
  message explicit when local runtime assets are missing.
- **Timing:** Safe to fix now, but treat it as a focused infrastructure task
  because it affects first-run loading and build/deploy assets.

### C3 - User Python execution has no timeout or recovery path

- **Where:** `src/workers/pyodideWorker.ts`, `src/lib/workerService.ts`
- **Why it matters:** `py.runPython(wrappedCode)` is synchronous inside the
  worker. If user code contains an infinite loop or very expensive shape logic,
  the worker can be pinned indefinitely. The UI can remain in `loading` with no
  cancel/restart action, and stale request filtering does not help because the
  worker never posts back.
- **Recommendation:** Add a run timeout in `WorkerService` that terminates and
  recreates the worker, clears loading, and surfaces a useful error. A later
  improvement can use Pyodide interrupt buffers, but terminate/recreate is the
  simplest robust fix.
- **Timing:** Safe to fix now. It touches runtime control flow, so cover with a
  small unit test around `WorkerService` behavior if practical plus browser
  smoke testing.

## Medium Cleanup Items

### M1 - Dead code is not enforced by verification

- **Where:** `tsconfig.json`, `vite.config.ts`,
  `src/components/operation-effects/effectMath.ts`, `src/lib/stats.ts`,
  `src/lib/svgExport.ts`, `src/lib/mnistDemoLayout.test.ts`
- **Why it matters:** `npm run verify` passes, but `npx tsc --noEmit
  --noUnusedLocals --noUnusedParameters --pretty false` reports unused symbols
  in production and test code. This lets small stale fragments accumulate after
  refactors.
- **Recommendation:** Remove the current unused symbols, then enable
  `noUnusedLocals` and `noUnusedParameters` or add a separate `lint:unused`
  script if the team wants a softer rollout.
- **Timing:** Safe to fix now. It is mostly mechanical, but should be done in a
  small PR because enabling the flags can surface more issues over time.

### M2 - Learning Lab domain metadata is split across core and UI code

- **Where:** `src/core/learning/types.ts`,
  `src/core/learning/content/*`, `src/components/learning/LearningLabView.tsx`,
  `src/components/learning/learningText.ts`
- **Why it matters:** Adding a domain currently requires touching the domain id
  union, content files, the `DOMAIN_IDS` constant in the view, and hand-written
  title/description maps in UI. This makes the new domain architecture easy to
  drift even though the catalog is supposed to be the source of truth.
- **Recommendation:** Move stable display metadata keys or localized title
  fields into the catalog/content layer, derive valid domain ids from
  `learningCatalog.domains`, and keep UI helpers as pure localization/adapters
  instead of a second registry.
- **Timing:** Safe to fix now. It is directly related to the recent Learning
  Lab refactor and would reduce friction before more domains/content are added.

### M3 - Learning Lab dark theme only partially themes the page

- **Where:** `src/components/learning/LearningLabView.tsx`,
  `src/components/learning/shell/*`,
  `src/components/learning/lesson/*`,
  `src/components/learning/practice/*`
- **Why it matters:** The root/sidebar/header can switch dark, but most content
  cards remain hard-coded `bg-white`, `text-slate-950`, and `border-sky-100`.
  The result is not a coherent theme and future UI changes will have to repeat
  conditional classes everywhere.
- **Recommendation:** Introduce a small Learning Lab theme class/token layer or
  shared card primitives, then make shell/lesson/practice cards consume it.
  Avoid building a full design system; start with container/card/text/action
  tokens only.
- **Timing:** Safe to fix now. It is mostly UI class cleanup and will prevent
  the newly merged RL style from fragmenting again.

### M4 - Reserved `uiStore` stub is dead and now confusing

- **Where:** `src/store/uiStore.ts`, `docs/ARCHITECTURE.md`,
  `wiki/architecture.md`, `wiki/concepts/learning-lab-refactor.md`
- **Why it matters:** `src/store/uiStore.ts` exports an empty Zustand store and
  docs still describe it as reserved. After the Learning Lab refactor, active UI
  state is local/component-owned, so this stub reads like an unfinished
  architecture decision.
- **Recommendation:** Either remove the stub and update docs, or create a
  concrete plan for what UI state belongs there. Do not leave it as an inert
  placeholder.
- **Timing:** Safe to fix now as docs/code cleanup if no near-term store work
  is planned.

### M5 - Exercise modals repeat lifecycle and state-control logic

- **Where:** `src/components/exercises/ShapeExercise.tsx`,
  `src/components/exercises/ValueExercise.tsx`,
  `src/components/mnist-demo/ConvExerciseModal.tsx`
- **Why it matters:** These files are large and each owns similar modal
  concerns: portal rendering, Escape handling, initial focus, reset/check/hint
  state, numeric parsing, and mobile sizing. Duplication makes small UX fixes
  risky because every modal must be remembered separately.
- **Recommendation:** Extract only the repeated shell concerns first:
  `ExerciseModalFrame` and a small `useExerciseModalLifecycle` hook. Leave the
  math/model-specific UI in place.
- **Timing:** Safe to fix now if kept narrow. Do not combine with exercise
  content changes.

### M6 - Dead scaffold files remain after feature direction changed

- **Where:** `src/core/answerCheck.ts`,
  `src/components/exercises/LearningDrawer.tsx`, plus docs that still list
  reserved scaffold files
- **Why it matters:** `answerCheck.ts` only exports `{}` and `LearningDrawer`
  is not imported anywhere. These files were useful placeholders during earlier
  plans, but now make the architecture look larger than it is.
- **Recommendation:** Delete unused scaffold files or move them into an
  explicit future plan only. Update docs/wiki so "reserved" does not masquerade
  as active architecture.
- **Timing:** Safe to fix now. Low behavioral risk because the files are not
  referenced at runtime.

### M7 - Input shape validation is inconsistent and can silently fallback

- **Where:** `src/components/Header.tsx`, `src/components/EditorPane.tsx`,
  `src/lib/workerService.ts`
- **Why it matters:** The Visualize button disables when `shapeInput` is
  invalid, but the editor shortcut still calls `workerService.run()`. The
  service then falls back to the active template shape when parsing fails, so a
  user can run an invalid shape and get a graph for a different shape without an
  explicit error. There is also no upper bound/rank policy for extreme but
  syntactically valid shapes.
- **Recommendation:** Make `WorkerService.run()` the validation authority:
  reject invalid shape input with a surfaced `AppError`, remove silent fallback,
  and optionally enforce rank/maximum dimension limits with clear messages.
- **Timing:** Safe to fix now. It is a correctness/UX fix and can be covered by
  focused tests for `parseShape`/run validation plus one shortcut smoke test.

### M8 - Localization is drifting after the Learning Lab/RL merge

- **Where:** `src/lib/localization.ts`,
  `src/components/learning/LearningLabView.tsx`,
  `src/components/learning/LearningLabHeader.tsx`,
  `src/components/learning/shell/DomainCatalog.tsx`,
  `src/components/exercises/ShapeExercise.tsx`
- **Why it matters:** The app supports English/Vietnamese, but new Learning Lab
  labels and exercise hint controls are hard-coded in components. Meanwhile
  `localization.ts` still contains stale RL landing-card keys and older
  role-based Learning Lab copy. This creates uncertainty about which copy is
  active and makes future domain additions more manual.
- **Recommendation:** Remove unused localization keys, add missing Learning Lab
  shell/domain/exercise-control strings, and route component copy through
  `getStrings` or a domain text adapter. Keep this as copy cleanup, not a full
  i18n rewrite.
- **Timing:** Safe to fix now. It is low-risk but should include a quick EN/VI
  browser smoke check.

### M9 - Route/UI behavior is mostly verified manually

- **Where:** `package.json`, `src/components/AppShell.tsx`,
  `src/components/landing/*`, `src/components/learning/*`
- **Why it matters:** The current `npm test` script only runs
  `src/lib/*.test.ts`. Core math/layout has good unit coverage, but critical
  user flows such as Landing -> Learning Lab, legacy RL redirects, language
  toggles, and exercise modal opening are not automated. Recent refactors rely
  on manual Playwright smoke checks.
- **Recommendation:** Add one narrow browser smoke script or Playwright test
  file for the top-level flows. Keep it small: landing renders, workspace route
  loads, `/learning/reinforcement-learning` loads, old RL route redirects.
- **Timing:** Safe to fix now if the team accepts a browser-test dependency or
  CLI smoke script. Otherwise wait until the next UI-routing change.

## Nice-To-Have Polish

### N1 - Mobile/accessibility constraints are intentionally rough but too broad

- **Where:** `index.html`, `App.tsx`
- **Why it matters:** The viewport disables user scaling
  (`maximum-scale=1.0, user-scalable=no`) and the workspace enforces
  `min-w-[1024px]`. Desktop-only is documented, but disabling zoom hurts
  accessibility even on desktop/tablet browsers and makes Learning Lab inherit a
  site-level constraint it may not need.
- **Recommendation:** Revisit viewport settings first. Keep the workspace
  desktop-oriented if needed, but avoid disabling browser zoom globally.
- **Timing:** Safe to fix now, but can wait if mobile/tablet is not a target.

### N2 - Type looseness remains in editor, JSX, localization, and instancing

- **Where:** `src/three-jsx.d.ts`, `src/components/EditorPane.tsx`,
  `src/lib/localization.ts`, `src/lib/irTypes.ts`,
  `src/components/canvas/SceneBlocks.tsx`
- **Why it matters:** Broad `any` types and `undefined as any` make strict mode
  less useful in the places most likely to break during library upgrades:
  Monaco, React Three Fiber JSX, localization shape transforms, and instanced
  mesh args.
- **Recommendation:** Replace the easiest `any` usages with Monaco/editor
  types and a typed localization recursive helper. Leave the R3F JSX shim until
  there is a clean library-supported type path.
- **Timing:** Safe to fix opportunistically. Not urgent unless upgrading
  Monaco/R3F/React.

### N3 - Canvas always preserves the drawing buffer

- **Where:** `src/components/canvas/Canvas3D.tsx`
- **Why it matters:** `preserveDrawingBuffer: true` helps export flows, but it
  can reduce WebGL performance and memory efficiency during normal
  interaction. The cost is paid all the time, even when the user never exports.
- **Recommendation:** Verify whether SVG export actually needs the WebGL
  drawing buffer. If not, disable it. If screenshot export needs it later, turn
  it on only for that path or document the tradeoff.
- **Timing:** Should wait until export behavior is checked visually.

### N4 - Application entrypoints live outside `src/`

- **Where:** `App.tsx`, `index.tsx`, `src/components/AppShell.tsx`,
  `vite.config.ts`
- **Why it matters:** The repo has root-level app entrypoints importing
  `./src/...`, while most code lives under `src/`. This is workable, but it
  makes source ownership less obvious and can surprise new tooling or
  contributors expecting the conventional `src/main.tsx` and `src/App.tsx`
  shape.
- **Recommendation:** Either document this as intentional in architecture docs
  or move entrypoints under `src/` in a small import-path-only cleanup.
- **Timing:** Should wait unless touching Vite/app boot anyway.

## Scan Log

- 2026-06-26 - Created backlog skeleton before analysis, per request.
- 2026-06-26 - Config/HTML pass found the first critical production hygiene
  issue around CDN-loaded assets.
- 2026-06-26 - Static TypeScript hygiene pass found unused code that current
  verification does not catch.
- 2026-06-26 - Runtime/architecture pass found Pyodide CDN dependency, split
  Learning Lab metadata, partial theme coverage, and a stale `uiStore` stub.
- 2026-06-26 - Worker reliability pass found missing timeout/recovery for
  long-running user Python.
- 2026-06-26 - Exercise pass found repeated modal/lifecycle implementation in
  the largest interactive exercise files.
- 2026-06-26 - Dead scaffold pass found unused `answerCheck.ts` and
  `LearningDrawer.tsx`.
- 2026-06-26 - Validation pass found a mismatch between disabled Visualize
  button behavior and editor shortcut/service fallback behavior.
- 2026-06-26 - i18n pass found hard-coded Learning Lab/exercise strings and
  stale localization keys from removed RL/role-based surfaces.
- 2026-06-26 - Test/polish pass found missing route/UI automation, broad mobile
  zoom constraints, loose types, and an always-on WebGL export tradeoff.
- 2026-06-26 - Repo-shape pass noted root-level app entrypoints as a minor
  orientation issue.
- 2026-06-26 - Scan completed. Backlog is ready for task selection.
