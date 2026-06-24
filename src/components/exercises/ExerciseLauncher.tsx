import React from 'react';
import type { ExerciseDefinition, ExerciseId } from './types';
import type { getStrings } from '../../lib/localization';
import { getExerciseSurface } from './exerciseRegistry';

type DemoLabels = ReturnType<typeof getStrings>['canvas']['demo'];

export const ExerciseLauncher: React.FC<{
  exercises: ExerciseDefinition[];
  activeOperation: string;
  t: DemoLabels;
  onOpenExercise: (id: ExerciseId) => void;
}> = React.memo(({ exercises, activeOperation, t, onOpenExercise }) => {
  if (!exercises.length) return null;

  return (
    <div className="min-w-0 h-full flex flex-col justify-between">
      <div className="mb-1 truncate px-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-500">
        {t.exercises}
      </div>
      <select
        className="h-8 w-full min-w-0 rounded-md border border-zinc-600/70 bg-zinc-950/80 px-2 text-xs text-zinc-200 outline-none focus:border-emerald-300"
        value=""
        title={t.exercisePanelTitle(activeOperation)}
        aria-label={t.exercisePanelTitle(activeOperation)}
        onChange={(event) => {
          const id = event.currentTarget.value as ExerciseId;
          if (id) onOpenExercise(id);
        }}
      >
        <option value="" disabled>{t.chooseExercise}</option>
        {exercises.map((exercise) => (
          <option key={exercise.id} value={exercise.id}>
            {getExerciseOptionLabel(exercise.id, t)}
          </option>
        ))}
      </select>
    </div>
  );
});

function getExerciseOptionLabel(id: ExerciseId, t: DemoLabels): string {
  const surface = getExerciseSurface(id);
  if (surface === 'shape') return t.exerciseShape;
  if (surface === 'conv-value') return t.exerciseConvValue;
  return t.exerciseValue;
}
