import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import type { getStrings } from '../../lib/localization';
import { getExerciseSurface } from './exerciseRegistry';
import type { ExerciseDefinition, ExerciseId } from './types';

type DemoLabels = ReturnType<typeof getStrings>['canvas']['demo'];

export function ExerciseLauncher({ exercises, t, onSelectExercise }: {
  exercises: ExerciseDefinition[];
  t: DemoLabels;
  onSelectExercise: (exerciseId: ExerciseId) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('pointerdown', close);
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.removeEventListener('pointerdown', close);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  if (!exercises.length) return null;

  return (
    <div ref={rootRef} className="relative min-w-0 rounded-md border border-zinc-700/60 bg-zinc-950/55 p-1.5">
      <span className="block px-0.5 pb-1 text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-500">{t.exercises}</span>
      <button
        type="button"
        className="flex h-8 w-full items-center justify-between gap-2 rounded-md border border-zinc-600/70 bg-zinc-950/80 px-2 text-left text-xs text-zinc-200 outline-none transition-colors hover:border-emerald-300/70 focus:border-emerald-300"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span className="truncate">{t.learningExerciseMenu}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
      </button>
      {isOpen ? (
        <div className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-[150] grid gap-1 rounded-md border border-zinc-700/80 bg-zinc-950/95 p-1 shadow-2xl backdrop-blur-md" role="listbox" aria-label={t.learningExerciseMenu}>
          {exercises.map((exercise) => (
            <button
              key={exercise.id}
              type="button"
              role="option"
              aria-selected={false}
              className="flex min-h-8 items-center justify-between gap-2 rounded-md px-2 text-left text-xs text-zinc-200 outline-none transition-colors hover:bg-emerald-400/12 hover:text-emerald-100 focus:bg-emerald-400/12 focus:text-emerald-100"
              onClick={() => {
                onSelectExercise(exercise.id);
                setIsOpen(false);
              }}
            >
              <span className="truncate">{getExerciseOptionLabel(exercise.id, t)}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function getExerciseOptionLabel(id: ExerciseId, t: DemoLabels): string {
  const surface = getExerciseSurface(id);
  if (surface === 'shape') return t.exerciseShape;
  if (surface === 'conv-value') return t.exerciseConvValue;
  return t.exerciseValue;
}
