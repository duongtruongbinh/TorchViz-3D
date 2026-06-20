import React from 'react';
import type { ExerciseDefinition, ExerciseId } from './types';
import type { getStrings } from '../../lib/localization';

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
      <div className="mb-1 truncate px-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-200/80">
        {t.exercises}
      </div>
      <div className={`grid min-w-0 ${exercises.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-1`}>
      {exercises.map((exercise) => (
        <ExerciseButton
          key={exercise.id}
          exercise={exercise}
          activeOperation={activeOperation}
          label={getExerciseButtonLabel(exercise.id, t)}
          onOpenExercise={onOpenExercise}
        />
      ))}
      </div>
    </div>
  );
});

const ExerciseButton: React.FC<{
  exercise: ExerciseDefinition;
  activeOperation: string;
  label: string;
  onOpenExercise: (id: ExerciseId) => void;
}> = ({ exercise, activeOperation, label, onOpenExercise }) => (
  <button
    type="button"
    className="h-8 min-w-0 rounded-md border border-emerald-300/45 bg-emerald-950/45 px-2 text-[10px] font-medium text-emerald-100 transition-colors hover:bg-emerald-900/60 focus:outline-none focus:border-emerald-300"
    title={`${label} · ${activeOperation}`}
    aria-label={`${label} · ${activeOperation}`}
    onClick={() => onOpenExercise(exercise.id)}
  >
    <span className="block truncate">{label}</span>
  </button>
);

function getExerciseButtonLabel(id: ExerciseId, t: DemoLabels): string {
  if (id === 'shape-output' || id === 'attention-shape') return t.exerciseShape;
  if (id === 'conv-value') return t.exerciseConvValue;
  return t.exerciseValue;
}
