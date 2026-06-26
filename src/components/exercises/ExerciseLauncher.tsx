import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ExerciseDefinition, ExerciseId } from './types';
import type { getStrings } from '../../lib/localization';
import { getExerciseSurface } from './exerciseRegistry';

type DemoLabels = ReturnType<typeof getStrings>['canvas']['demo'];

export const ExerciseLauncher: React.FC<{
  exercises: ExerciseDefinition[];
  activeOperation: string;
  t: DemoLabels;
  onPreviewExercise: (id: ExerciseId, anchor: DOMRect) => void;
  onSelectExercise: (id: ExerciseId, anchor: DOMRect) => void;
}> = React.memo(({ exercises, activeOperation, t, onPreviewExercise, onSelectExercise }) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!exercises.length) return null;

  return (
    <div ref={rootRef} className="relative min-w-0 h-full flex flex-col justify-between">
      <div className="mb-1 truncate px-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-500">
        {t.exercises}
      </div>
      <button
        type="button"
        className="flex h-8 w-full min-w-0 items-center justify-between gap-2 rounded-md border border-zinc-600/70 bg-zinc-950/80 px-2 text-left text-xs text-zinc-200 outline-none transition-colors hover:border-emerald-300/70 focus:border-emerald-300"
        title={t.exercisePanelTitle(activeOperation)}
        aria-label={t.exercisePanelTitle(activeOperation)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="min-w-0 truncate">{t.chooseExercise}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" strokeWidth={1.8} aria-hidden="true" />
      </button>
      {isOpen ? (
        <div
          className="absolute left-0 right-0 top-[calc(100%+0.25rem)] z-[150] grid min-w-0 gap-1 rounded-md border border-zinc-700/80 bg-zinc-950/95 p-1 shadow-2xl backdrop-blur-md"
          role="listbox"
          aria-label={t.exercisePanelTitle(activeOperation)}
        >
          {exercises.map((exercise) => (
            <button
              key={exercise.id}
              type="button"
              role="option"
              aria-selected={false}
              className="flex h-8 min-w-0 items-center justify-between gap-2 rounded-md px-2 text-left text-xs text-zinc-200 outline-none transition-colors hover:bg-emerald-400/12 hover:text-emerald-100 focus:bg-emerald-400/12 focus:text-emerald-100"
              onMouseEnter={(event) => onPreviewExercise(exercise.id, event.currentTarget.getBoundingClientRect())}
              onFocus={(event) => onPreviewExercise(exercise.id, event.currentTarget.getBoundingClientRect())}
              onClick={(event) => {
                onSelectExercise(exercise.id, event.currentTarget.getBoundingClientRect());
                setIsOpen(false);
              }}
            >
              <span className="min-w-0 truncate">{getExerciseOptionLabel(exercise.id, t)}</span>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
});

export function getExerciseOptionLabel(id: ExerciseId, t: DemoLabels): string {
  const surface = getExerciseSurface(id);
  if (surface === 'shape') return t.exerciseShape;
  if (surface === 'conv-value') return t.exerciseConvValue;
  return t.exerciseValue;
}
