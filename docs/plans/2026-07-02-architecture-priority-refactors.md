---
title: Architecture Priority Refactors
status: done
created: 2026-07-02T08:34:34+07:00
updated: 2026-07-14T13:14:00+07:00
author: nmkhiem
task: "Implement the highest-leverage correctness and architecture refactors from the project architecture review."
supersedes:
  - docs/plans/2026-06-21-docs-sync-audit-fixes.md
---

# Architecture Priority Refactors Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> `superpowers:executing-plans` to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the highest-impact correctness issues found in the project review
and split the workspace bundle boundary without changing visible product intent.

**Architecture:** Keep the existing
`EditorPane -> store -> WorkerService -> Pyodide worker + torchstub -> IRGraph -> computeLayout -> Canvas3D`
pipeline. Add small pure helpers where they reduce duplicated renderer/export
decisions, but avoid broad registries or framework changes. Ship the work as
separate reviewable tasks with tests before implementation.

**Tech Stack:** React 18, Vite 6, Zustand, React Three Fiber, Pyodide,
Node's built-in test runner, TypeScript.

---

# Approval Checkpoint

Do not modify runtime source files until this plan is approved in chat. The plan
file is the first write for this implementation task, as required by
`AGENTS.md` and `docs/WORKFLOW.md`.

# Scope

Implement Phase 1 from the architecture review:

- torchstub tuple correctness for Conv2d and 2D pooling
- shared node visual color resolution for SVG export and renderer-sensitive
  batching
- instanced canvas batching that preserves error/active/selected/highlighted
  visual states
- worker initialization timeout separated from Python execution timeout
- Learning Lab filtering that does not rewrite the route during search/filter
- lazy workspace route boundary to reduce initial Landing bundle load
- small cleanup tied directly to touched files

# Out Of Scope

- Moving torchstub into real `.py` source files. That is a justified larger
  follow-up, but it should be its own migration plan.
- Learning catalog indexing. Current catalog size does not require that change
  inside this correctness pass.
- Removing stale Learning Lab shell components. That is safe cleanup, but it is
  independent of the runtime bugs in this plan.
- UI redesign, new dependencies, routing feature changes, or new product
  behavior.

# File Structure

- Modify `src/lib/python_sources.ts` for tuple-safe Conv2d/Pool2d math.
- Modify `src/lib/torchstubCore.test.ts` for Python-level tuple regression
  coverage.
- Create `src/lib/nodeVisualStyle.ts` for shared layout-node base color
  resolution.
- Modify `src/lib/svgExport.ts` to use layout-resolved colors.
- Create `src/lib/svgExport.test.ts` for SVG color/error/container coverage.
- Create `src/lib/leafBatching.ts` for pure instancing partition logic.
- Modify `src/components/canvas/SceneBlocks.tsx` to use the partition helper.
- Create `src/lib/leafBatching.test.ts` for renderer batching behavior.
- Modify `src/lib/workerService.ts` and `src/workers/pyodideWorker.ts` for
  ready/init-timeout handling.
- Modify `src/lib/workerService.test.ts` for ready/init/run timeout coverage.
- Create `src/core/learning/visibleLesson.ts` for route-safe lesson selection.
- Modify `src/components/learning/LearningLabView.tsx` to use the helper and
  remove filter-driven navigation.
- Create `src/lib/learningVisibleLesson.test.ts` for selection behavior.
- Create `src/components/workspace/TorchVizWorkspace.tsx` by moving the current
  workspace component body out of `App.tsx`.
- Modify `App.tsx` to lazy-load `TorchVizWorkspace`.
- Modify `src/components/BottomTabs.tsx` only if it remains touched by the move,
  passing or reading the current language instead of hardcoding English.

# Task 1: torchstub Tuple Correctness

**Files:**

- Modify: `src/lib/torchstubCore.test.ts`
- Modify: `src/lib/python_sources.ts`

- [x] **Step 1: Add failing tuple regression tests**

Add this test to `src/lib/torchstubCore.test.ts`:

```ts
test('supports tuple Conv2d and Pool2d spatial parameters', () => {
  const out = runPython(`
from torchstub import Tensor, nn
x = Tensor((1, 3, 32, 28))
assert nn.Conv2d(3, 8, (3, 5), stride=(2, 1), padding=(1, 2))(x).shape == (1, 8, 16, 28)
assert nn.MaxPool2d((2, 4), stride=(2, 3), padding=(0, 1))(x).shape == (1, 3, 16, 9)
assert nn.AvgPool2d((4, 2), stride=(4, 2), padding=(0, 0))(x).shape == (1, 3, 8, 14)
print("ok")
`);
  assert.equal(out, 'ok');
});
```

- [x] **Step 2: Run the targeted test and confirm it fails**

Run:

```bash
npm test -- src/lib/torchstubCore.test.ts
```

Expected before implementation: FAIL with tuple arithmetic errors in Conv2d or
Pool2d.

- [x] **Step 3: Normalize all 2D params in torchstub**

Update `PY_NN_CONV` and `PY_NN_POOL` in `src/lib/python_sources.ts` so Conv2d,
MaxPool2d, and AvgPool2d store tuple params and compute height/width with
separate values:

```py
self.kernel_size = _pair(kernel_size)
self.stride = _pair(stride)
self.padding = _pair(padding)

kh, kw = self.kernel_size
sh, sw = self.stride
ph, pw = self.padding
h_out = math.floor((x.shape[2] + 2 * ph - kh) / sh + 1)
w_out = math.floor((x.shape[3] + 2 * pw - kw) / sw + 1)
```

For Pool2d, preserve PyTorch's `stride=None` behavior:

```py
self.kernel_size = _pair(kernel_size)
self.stride = _pair(stride if stride is not None else kernel_size)
self.padding = _pair(padding)
```

- [x] **Step 4: Verify**

Run:

```bash
npm test -- src/lib/torchstubCore.test.ts
```

Expected: PASS.

# Task 2: Shared Node Visual Style and SVG Correctness

**Files:**

- Create: `src/lib/nodeVisualStyle.ts`
- Modify: `src/lib/svgExport.ts`
- Create: `src/lib/svgExport.test.ts`

- [x] **Step 1: Add SVG regression tests**

Create `src/lib/svgExport.test.ts`:

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { ERROR_COLOR } from './constants.ts';
import type { LayoutData, LayoutNode } from './irTypes.ts';
import { generateSVG } from './svgExport.ts';

function node(overrides: Partial<LayoutNode>): LayoutNode {
  return {
    id: 'n',
    name: 'n',
    op_type: 'Linear',
    in_shape: [],
    out_shape: [1, 4],
    params: 0,
    x: 0,
    y: 0,
    z: 0,
    width: 4,
    height: 3,
    depth: 2,
    color: '#22c55e',
    ...overrides,
  };
}

function layout(nodes: LayoutNode[]): LayoutData {
  return {
    nodes,
    edges: [],
    bounds: { minX: -2, maxX: 2, minY: -2, maxY: 2, minZ: -2, maxZ: 2 },
  };
}

test('SVG export uses error color from layout nodes', () => {
  const svg = generateSVG(layout([node({ error: 'bad shape' })]), {
    lightBackground: true,
    legend: false,
  });
  assert.match(svg, new RegExp(ERROR_COLOR.replace('#', '#')));
});

test('SVG export uses collapsed container layout color', () => {
  const svg = generateSVG(layout([node({
    id: 'container',
    name: 'container',
    op_type: 'Sequential',
    is_container: true,
    collapsed: true,
    children: [],
    color: '#123456',
  })]), {
    lightBackground: true,
    legend: false,
  });
  assert.match(svg, /#123456/i);
});
```

- [x] **Step 2: Run the targeted tests and confirm SVG failures**

Run:

```bash
npm test -- src/lib/svgExport.test.ts
```

Expected before implementation: FAIL because SVG export uses taxonomy color
instead of layout-resolved node color.

- [x] **Step 3: Add shared color helper**

Create `src/lib/nodeVisualStyle.ts`:

```ts
import type { LayoutNode } from './irTypes.ts';
import { ERROR_COLOR } from './constants.ts';

export function getLayoutNodeBaseColor(node: Pick<LayoutNode, 'color' | 'error'>): string {
  return node.error ? ERROR_COLOR : node.color;
}
```

- [x] **Step 4: Use the helper in SVG export**

In `src/lib/svgExport.ts`, import `getLayoutNodeBaseColor` and replace direct
`meta.color` base color usage in block renderers with:

```ts
const baseColor = getLayoutNodeBaseColor(n);
```

Keep expanded-container footprint colors unchanged because those are intentionally
surface/stroke colors, not cuboid block colors.

- [x] **Step 5: Verify**

Run:

```bash
npm test -- src/lib/svgExport.test.ts
```

Expected: PASS.

# Task 3: Instanced Canvas Batching Preserves Visual State

**Files:**

- Create: `src/lib/leafBatching.ts`
- Create: `src/lib/leafBatching.test.ts`
- Modify: `src/components/canvas/SceneBlocks.tsx`

- [x] **Step 1: Add batching regression tests**

Create `src/lib/leafBatching.test.ts`:

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import type { LayoutNode } from './irTypes.ts';
import { partitionLeavesForInstancing } from './leafBatching.ts';

function leaf(id: string, overrides: Partial<LayoutNode> = {}): LayoutNode {
  return {
    id,
    name: id,
    op_type: 'Linear',
    in_shape: [],
    out_shape: [1, 4],
    params: 0,
    x: 0,
    y: 0,
    z: 0,
    width: 4,
    height: 3,
    depth: 2,
    color: '#22c55e',
    ...overrides,
  };
}

test('batches visually identical ordinary leaves', () => {
  const result = partitionLeavesForInstancing(
    [leaf('a'), leaf('b'), leaf('c')],
    { highlightedNodeId: null, selectedNodeId: null, activeNodeId: null },
    3,
  );
  assert.equal(result.batches.length, 1);
  assert.deepEqual(result.singles, []);
});

test('keeps error and interactive-state leaves out of instanced batches', () => {
  const result = partitionLeavesForInstancing(
    [
      leaf('a'),
      leaf('b'),
      leaf('c'),
      leaf('error', { error: 'bad shape' }),
      leaf('selected'),
      leaf('active'),
      leaf('highlighted'),
    ],
    { highlightedNodeId: 'highlighted', selectedNodeId: 'selected', activeNodeId: 'active' },
    3,
  );
  assert.equal(result.batches.length, 1);
  assert.deepEqual(result.batches[0].map((node) => node.id), ['a', 'b', 'c']);
  assert.deepEqual(result.singles.map((node) => node.id).sort(), ['active', 'error', 'highlighted', 'selected']);
});
```

- [x] **Step 2: Run the targeted tests and confirm helper is missing**

Run:

```bash
npm test -- src/lib/leafBatching.test.ts
```

Expected before implementation: FAIL because `leafBatching.ts` does not exist.

- [x] **Step 3: Implement pure partition helper**

Create `src/lib/leafBatching.ts` with a helper that:

- sends `node.error`, highlighted, selected, active, and special-geometry leaves
  to `singles`
- groups only ordinary leaves by visual kind, renderable size, and color
- batches groups whose length is at least `minBatchSize`

Use this public signature:

```ts
export type LeafBatchingState = {
  highlightedNodeId: string | null;
  selectedNodeId: string | null;
  activeNodeId: string | null;
};

export function partitionLeavesForInstancing(
  leaves: LayoutNode[],
  state: LeafBatchingState,
  minBatchSize = 3,
): { batches: LayoutNode[][]; singles: LayoutNode[] };
```

- [x] **Step 4: Wire SceneBlocks to the helper**

In `src/components/canvas/SceneBlocks.tsx`, delete the local
`groupLeavesByIdentity` implementation and call:

```ts
const { batches, singles } = useMemo(
  () => partitionLeavesForInstancing(leaves, {
    highlightedNodeId: highlightNodeId,
    selectedNodeId,
    activeNodeId,
  }, INSTANCED_BATCH_MIN),
  [activeNodeId, highlightNodeId, leaves, selectedNodeId],
);
```

- [x] **Step 5: Verify**

Run:

```bash
npm test -- src/lib/leafBatching.test.ts
```

Expected: PASS.

# Task 4: Worker Ready State and Split Timeouts

**Files:**

- Modify: `src/workers/pyodideWorker.ts`
- Modify: `src/lib/workerService.ts`
- Modify: `src/lib/workerService.test.ts`

- [x] **Step 1: Add WorkerService lifecycle tests**

Update `FakeWorker` in `src/lib/workerService.test.ts` with a helper:

```ts
emit(message: unknown) {
  this.onmessage?.({ data: message } as MessageEvent);
}
```

Add tests for:

```ts
test('run timeout starts after worker ready when run is requested during init', async () => {
  resetStore('[1, 1, 32, 32]');
  const worker = new FakeWorker();
  const service = new WorkerService(() => worker as unknown as Worker, 10, 50);

  service.init();
  service.run();
  await delay(25);
  assert.equal(worker.terminated, false);
  assert.equal(useStore.getState().loading, true);

  worker.emit({ type: 'ready' });
  await delay(25);
  assert.equal(worker.terminated, true);
  assert.equal(useStore.getState().error?.message, 'Python execution timed out.');

  service.terminate();
});

test('init timeout reports runtime initialization failure before ready', async () => {
  resetStore('[1, 1, 32, 32]');
  const worker = new FakeWorker();
  const service = new WorkerService(() => worker as unknown as Worker, 50, 5);

  service.init();
  await delay(25);

  assert.equal(worker.terminated, true);
  assert.match(useStore.getState().criticalError ?? '', /Python Runtime Error/);

  service.terminate();
});
```

- [x] **Step 2: Run the targeted tests and confirm failures**

Run:

```bash
npm test -- src/lib/workerService.test.ts
```

Expected before implementation: FAIL because `WorkerService` has no ready/init
timeout handling.

- [x] **Step 3: Emit ready from worker after Pyodide setup**

In `src/workers/pyodideWorker.ts`, start setup once at worker creation:

```ts
const pyodideReady = setupPyodide().then((py) => {
  self.postMessage({ type: 'ready' });
  return py;
});
```

Then change message handling to:

```ts
const py = await pyodideReady;
```

- [x] **Step 4: Split init timeout from run timeout**

In `src/lib/workerService.ts`:

- add `DEFAULT_INIT_TIMEOUT_MS = 45000`
- add constructor parameter `initTimeoutMs`
- track `workerReady`, `activeRunWaitingForReady`, and `activeInitTimeout`
- on `type === 'ready'`, clear init timeout and start run timeout if a run is
  already active
- start run timeout immediately only when `workerReady` is true
- on init timeout, terminate worker, clear loading, and set critical runtime
  error

Keep existing public methods: `init()`, `run()`, `runWithCodeAndShape()`,
`terminate()`.

- [x] **Step 5: Verify**

Run:

```bash
npm test -- src/lib/workerService.test.ts
```

Expected: PASS.

# Task 5: Route-Safe Learning Lesson Selection

**Files:**

- Create: `src/core/learning/visibleLesson.ts`
- Create: `src/lib/learningVisibleLesson.test.ts`
- Modify: `src/components/learning/LearningLabView.tsx`

- [x] **Step 1: Add selection helper tests**

Create `src/lib/learningVisibleLesson.test.ts`:

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import type { LearningLesson } from '../core/learning/types.ts';
import { resolveVisibleLearningLesson } from '../core/learning/visibleLesson.ts';

function lesson(id: string): LearningLesson {
  return {
    id,
    domainId: 'cv',
    trackId: 'cnn-shape-value',
    titleKey: id,
    summaryKey: id,
    duration: '5 min',
    level: 'beginner',
    practice: [],
    sections: [],
  };
}

test('keeps route lesson as detail while rail filter points at first visible lesson', () => {
  const route = lesson('route');
  const firstFiltered = lesson('filtered');
  const result = resolveVisibleLearningLesson({
    routeSelectedLesson: route,
    firstFilteredLesson: firstFiltered,
    filteredLessonIds: new Set(['filtered']),
    isLessonRailFiltered: true,
    firstDomainLesson: lesson('first'),
  });

  assert.equal(result.detailLesson?.id, 'route');
  assert.equal(result.railLesson?.id, 'filtered');
  assert.equal(result.shouldNavigateToDetailLesson, false);
});

test('uses first domain lesson when route has no lesson', () => {
  const first = lesson('first');
  const result = resolveVisibleLearningLesson({
    routeSelectedLesson: null,
    firstFilteredLesson: null,
    filteredLessonIds: new Set(),
    isLessonRailFiltered: false,
    firstDomainLesson: first,
  });

  assert.equal(result.detailLesson?.id, 'first');
  assert.equal(result.railLesson?.id, 'first');
});
```

- [x] **Step 2: Run the targeted tests and confirm helper is missing**

Run:

```bash
npm test -- src/lib/learningVisibleLesson.test.ts
```

Expected before implementation: FAIL because the helper does not exist.

- [x] **Step 3: Implement selection helper**

Create `src/core/learning/visibleLesson.ts` with:

```ts
import type { LearningLesson } from './types.ts';

type ResolveVisibleLearningLessonArgs = {
  routeSelectedLesson: LearningLesson | null;
  firstFilteredLesson: LearningLesson | null;
  filteredLessonIds: Set<string>;
  isLessonRailFiltered: boolean;
  firstDomainLesson: LearningLesson | null;
};

export function resolveVisibleLearningLesson({
  routeSelectedLesson,
  firstFilteredLesson,
  filteredLessonIds,
  isLessonRailFiltered,
  firstDomainLesson,
}: ResolveVisibleLearningLessonArgs) {
  const detailLesson = routeSelectedLesson ?? firstFilteredLesson ?? firstDomainLesson;
  const railLesson = routeSelectedLesson
    && (!isLessonRailFiltered || filteredLessonIds.has(routeSelectedLesson.id))
    ? routeSelectedLesson
    : firstFilteredLesson ?? routeSelectedLesson ?? firstDomainLesson;

  return {
    detailLesson,
    railLesson,
    shouldNavigateToDetailLesson: false,
  };
}
```

- [x] **Step 4: Remove filter-driven navigation**

In `src/components/learning/LearningLabView.tsx`, replace the current
`selectedLesson`/`railSelectedLesson` calculation with the helper result and
delete the effect that navigates whenever filtered `selectedLesson` differs from
`routeSelectedLesson`. Keep the canonical alias correction effect intact.

- [x] **Step 5: Verify**

Run:

```bash
npm test -- src/lib/learningVisibleLesson.test.ts
```

Expected: PASS.

# Task 6: Lazy Workspace Bundle Boundary

**Files:**

- Create: `src/components/workspace/TorchVizWorkspace.tsx`
- Modify: `App.tsx`
- Modify: `src/components/BottomTabs.tsx` if needed for language wiring

- [x] **Step 1: Move workspace component without behavior changes**

Create `src/components/workspace/TorchVizWorkspace.tsx` and move these items out
of `App.tsx`:

- `CollapseSide`
- `PanelCollapseButton`
- `ResizablePanel`
- `TorchVizWorkspace`

Keep imports local to the moved file, including `Canvas3D`, `Inspector`,
`BottomTabs`, `ExportSvgModal`, `ParamFormulaPopup`, `Header`, `workerService`,
and store selectors.

- [x] **Step 2: Lazy-load workspace from App**

Reduce `App.tsx` to the shell boundary:

```tsx
import React, { Suspense } from 'react';
import AppShell from './src/components/AppShell';

const TorchVizWorkspace = React.lazy(() => import('./src/components/workspace/TorchVizWorkspace'));

export default function App() {
  return (
    <AppShell
      renderWorkspace={({ onBackToLanding }) => (
        <Suspense fallback={<div className="min-h-screen bg-[var(--surface)]" />}>
          <TorchVizWorkspace onBackToLanding={onBackToLanding} />
        </Suspense>
      )}
    />
  );
}
```

- [x] **Step 3: Preserve terminal localization**

If `BottomTabs` remains mounted from the workspace move, change it to receive
the active language or read it from `useStore`:

```ts
const language = useStore((s) => s.language);
const t = getStrings(language);
```

- [x] **Step 4: Verify build chunking**

Run:

```bash
npm run build
```

Expected: build succeeds and workspace-related Three/Monaco code is no longer
required by the initial Landing route module. The existing chunk-size warning
may remain for `three-vendor`; that warning alone does not fail this task.

# Task 7: Full Verification and Plan Update

**Files:**

- Modify: `docs/plans/2026-07-02-architecture-priority-refactors.md`

- [x] **Step 1: Run full verification**

Run:

```bash
npm run verify
```

Expected:

- `npm run typecheck` passes
- `npm test` passes
- `npm run build` passes

- [x] **Step 2: Update execution log**

Append exact verification results and changed-file summary to this plan's
Execution Log. Set frontmatter `status` to `done` only after verification passes.

# Execution Log

- 2026-07-02T08:34:34+07:00 - Draft implementation plan created from the
  project architecture code review. Awaiting approval before runtime source
  edits.
- 2026-07-02T08:38:04+07:00 - User approved execution in chat. Status moved to
  executing; runtime source edits may begin.
- 2026-07-02T08:49:37+07:00 - Implemented tuple-safe Conv2d/Pool2d torchstub
  shape math, SVG layout color resolution, state-safe canvas leaf batching,
  worker ready/init timeout handling, route-safe Learning Lab lesson selection,
  and lazy workspace route chunking. Ran `npm run verify`: typecheck passed,
  87 Node tests passed, and production build passed. Build still reports the
  known `three-vendor` chunk-size warning and empty `react-vendor` chunk.

# Absorbed Architecture Review

`2026-07-02-project-architecture-code-review.md` is absorbed into this
implementation record. The review identified six priority boundaries that this
plan then implemented or explicitly retained:

- tuple-safe convolution/pooling shape math;
- one visual-color source shared by Canvas and SVG export;
- safe leaf instancing that excludes error/interactive nodes;
- worker initialization/run timeout recovery;
- route/detail selection that does not silently replace requested lessons;
- lazy workspace loading to keep Landing and Learning bundles separated.

Lower-priority observations remained documented in the architecture/wiki rather
than becoming speculative framework work. The execution log above is the
authoritative outcome and verification record for the review.

- 2026-07-19 — Absorbed sub-plan `2026-07-19-canvas-flow-line-alignment.md`: Fixed canvas flow-line alignment, phased grid half a cell off the flow axis, removed grid center-line emphasis, aligned virtual input route to first rendered block face, and removed supplemental leaf edge wireframes for solid 3D block shading.

