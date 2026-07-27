---
title: Improve ordering exercise drag interaction
status: done
created: 2026-07-28T12:00:00+07:00
updated: 2026-07-28T12:00:00+07:00
author: Codex
task: "Replace native HTML5 Drag & Drop in the ordering exercise (QuizBlock.tsx mode: 'order') with @dnd-kit for smoother, touch-friendly, and accessible drag reordering."
supersedes: []
---

# Goal

Make the ordering exercise (`mode: 'order'` in `QuizBlock.tsx`) dramatically
easier to drag — instant drag activation, smooth reorder animations, native
touch/mobile support, a polished drag overlay, and keyboard accessibility.

# Context

The ordering exercise renders a vertical list of options. Users reorder them
by dragging rows. The current implementation uses the native HTML5 Drag and Drop
API, which has several problems:

1. **Delayed activation** — many browsers require a click-and-hold before
   dragging starts, making the interaction feel sluggish.
2. **No touch support** — HTML5 DnD does not work on mobile/tablet.
3. **Browser drag ghost** — the default semi-transparent clone is ugly and
   provides poor feedback.
4. **No animations** — reordering is instantaneous with no smooth transition.
5. **Finicky drop zones** — drop target detection uses `event.clientY` vs row
   midpoint, which can be imprecise.
6. **Small visual affordance** — the `GripVertical` icon is only 16×16px.

# Solution

Replace the native DnD with **`@dnd-kit`** (`core` + `sortable`), the
industry-standard React drag-and-drop library. It provides:

- **Pointer sensor** — drag activates on pointer-down + move (no hold delay).
- **Touch sensor** — built-in touch/mobile support.
- **Keyboard sensor** — accessible reordering via keyboard.
- **Smooth CSS-transform animations** — items animate into position during drag.
- **DragOverlay** — polished drag preview that follows the cursor.
- **Collision detection** — precise drop target calculation.
- **`arrayMove` utility** — safe reorder logic.

# Files to modify

| File | Changes |
|---|---|
| `package.json` | Add `@dnd-kit/core` and `@dnd-kit/sortable` dependencies |
| `src/components/learning/lesson/QuizBlock.tsx` | Replace native DnD event handlers with `DndContext`, `SortableContext`, `useSortable`, `DragOverlay` |

No other files need changes — the `QuizQuestionState`, `checked` flow, `reset`,
and `checkAnswer` logic remain identical.

# Implementation plan

## 1. Install dependencies

```bash
npm install @dnd-kit/core@6.3.1 @dnd-kit/sortable@10.0.0
```

## 2. Refactor the order-mode rendering in QuizBlock.tsx

### a) Add imports

```tsx
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
```

### b) Create a SortableOrderRow component

Extract each order row into a `SortableOrderRow` component that uses the
`useSortable` hook. This provides:
- `setNodeRef` / `listeners` / `attributes` for drag activation
- `transform` / `transition` for smooth animations
- `isDragging` state for visual styling

### c) Wrap the order list in DndContext + SortableContext

Replace the current `<div className="mt-5 grid gap-1">` with:

```tsx
<DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragStart={handleDragStart}
  onDragEnd={handleDragEnd}
>
  <SortableContext items={orderIds} strategy={verticalListSortingStrategy}>
    {/* SortableOrderRow for each item */}
  </SortableContext>
  <DragOverlay>
    {activeId ? <OrderRowOverlay id={activeId} ... /> : null}
  </DragOverlay>
</DndContext>
```

### d) Replace moveOrderOption with arrayMove

The existing `moveOrderOption(fromIndex, targetIndex)` is replaced by
`arrayMove(orderIds, oldIndex, newIndex)` inside the `onDragEnd` handler,
which is the standard @dnd-kit pattern.

### e) Remove native DnD state + handlers

Remove `draggedOrderIndex`, `dropTargetIndex`, `clearOrderDragState`,
`updateDropTargetIndex`, and all native `onDragStart`/`onDragOver`/`onDrop`/
`onDragEnd` handlers. The drop line indicator is replaced by @dnd-kit's
built-in `isOver` + `isDragging` feedback.

### f) Use sensors with configuration

```tsx
const sensors = useSensors(
  useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
  useSensor(KeyboardSensor),
);
```

This gives instant activation on desktop (after 8px movement to avoid
accidental drags) and a short delay on touch to distinguish scroll from drag.

## 3. Visual polish

- The drag overlay shows a clean clone of the dragged row with a slight shadow
  elevation.
- The original position shows a subtle "placeholder" style while dragging.
- Drop indicators are handled naturally by @dnd-kit's collision detection +
  animation — items shift apart to make room.

# Acceptance criteria

- Drag activates immediately on pointer-down + move (no hold delay).
- Items animate smoothly into their new positions during drag.
- Touch/mobile drag works natively.
- Keyboard users can reorder via Tab + Space/ arrows.
- `checkAnswer`, `reset`, and `feedback` flows are unchanged.
- Existing `selectedIds`, `categoryAssignments`, and `feedback` state shape
  is preserved.
- `npm run verify` passes (typecheck, tests, build).

# Out of scope

- Changing the categorize mode (it uses native DnD with TokenChip; if that also
  needs improvement it should be a separate plan).
- Changing the non-order quiz modes (single/multi select).
- Changing the Learning Lab shell, theme, or routing.
- Changing the authored content (MDX files).

# Execution log

- 2026-07-28T12:00:00+07:00 — Plan written, status set to `approved`.
- 2026-07-28T12:00:00+07:00 — Status advanced to `executing`; user approved via
  conversation.
- 2026-07-28T12:00:00+07:00 — Installed `@dnd-kit/core@6.3.1` and
  `@dnd-kit/sortable@10.0.0` (5 new packages).
- 2026-07-28T12:00:00+07:00 — Refactored `src/components/learning/lesson/QuizBlock.tsx`:
  - Removed native DnD state (`draggedOrderIndex`, `dropTargetIndex`) and
    handlers (`moveOrderOption`, `updateDropTargetIndex`, `clearOrderDragState`).
  - Added `@dnd-kit` imports: `DndContext`, `DragOverlay`, `SortableContext`,
    `useSortable`, `verticalListSortingStrategy`, `arrayMove`, sensors, and CSS
    transform utilities.
  - Added `activeId` state for `DragOverlay` tracking.
  - Added `handleDragStart` / `handleDragEnd` callbacks using `arrayMove`.
  - Added sensors: `PointerSensor` (8px distance threshold), `TouchSensor`
    (150ms delay, 8px tolerance), `KeyboardSensor`.
  - Replaced order-mode JSX with `DndContext` → `SortableContext` →
    `SortableOrderRow` components, plus `DragOverlay`.
  - Added `SortableOrderRow` component using `useSortable` hook with CSS
    transform animation.
  - Added `OrderRowOverlay` component for the drag preview with `scale(1.02)`
    and elevated shadow.
  - All existing quiz state, `selectedIds`, `categoryAssignments`, `feedback`,
    `checkAnswer`, `reset`, and non-order modes preserved unchanged.
- 2026-07-28T12:00:00+07:00 — Verification passed: `npm run typecheck` clean,
  all 68 tests pass, `npm run build` succeeds. The only build warning is the
  pre-existing Three.js vendor chunk size advisory.
- 2026-07-28T12:00:00+07:00 — Plan marked done. No doc update needed beyond
  this log (the change is a component-level implementation detail with no new
  architectural convention).
