import { useState } from 'react';
import { ShapeExercise } from '../../exercises/ShapeExercise';
import { ValueExercise } from '../../exercises/ValueExercise';
import {
  createLearningPracticeNode,
  isLearningPracticeApproved,
} from '../../exercises/learningPracticeAdapter';
import {
  isConvValueExerciseId,
  isShapeExerciseId,
  isValueExerciseId,
} from '../../exercises/exerciseRegistry';
import { ConvExerciseModal } from '../../mnist-demo/ConvExerciseModal';
import type { LearningPracticeRef } from '../../../core/types';
import { getLearningPracticeText, getStrings } from '../../../lib/localization';
import type { LayoutNode } from '../../../lib/irTypes';
import { useStore } from '../../../store/useStore';

type PracticeSectionProps = {
  theme?: 'dark' | 'light';
  practice: LearningPracticeRef[];
};

type ActivePractice = {
  practice: LearningPracticeRef;
  node: LayoutNode;
};

export default function PracticeSection({ theme = 'dark', practice }: PracticeSectionProps) {
  const language = useStore((s) => s.language);
  const t = getStrings(language);
  const labText = t.learningLab;
  const [activePractice, setActivePractice] = useState<ActivePractice | null>(null);
  const activeExerciseId = activePractice?.practice.exerciseId;
  const isShapeExercise = isShapeExerciseId(activeExerciseId);
  const isConvValueExercise = isConvValueExerciseId(activeExerciseId);
  const isStandardValueExercise = isValueExerciseId(activeExerciseId);

  if (!practice.length) return null;

  return (
    <div className="mt-5">
      <div className="grid gap-3 md:grid-cols-2">
        {practice.map((item) => {
          const node = createLearningPracticeNode(item);
          const practiceText = getLearningPracticeText(labText, item);
          const isAvailable = isLearningPracticeApproved(item) && Boolean(node);

          return (
            <section key={item.id} className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
              <div className="text-[11px] font-black uppercase text-zinc-500">{item.kind}</div>
              <h3 className="mt-1 text-base font-bold text-zinc-100">{practiceText.title}</h3>
              <p className="mt-2 text-xs leading-5 text-zinc-500">{item.targetOperation}</p>
              {isAvailable ? (
                <button
                  type="button"
                  onClick={() => {
                    if (node) setActivePractice({ practice: item, node });
                  }}
                  className="learning-lab-primary-action mt-4 w-full rounded-md border border-teal-200/50 bg-teal-400/15 px-5 py-2 text-sm font-bold text-teal-50 transition-colors hover:bg-teal-400/25 focus:outline-none focus:ring-2 focus:ring-teal-300/40"
                >
                  {labText.startExercise}
                </button>
              ) : (
                <div className="mt-4 rounded-md border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-center text-sm font-bold text-zinc-400">
                  {labText.unavailablePractice}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <ShapeExercise
        isOpen={Boolean(activePractice && isShapeExercise)}
        exerciseId={isShapeExercise ? activeExerciseId : undefined}
        node={activePractice?.node}
        t={t.canvas.demo}
        language={language}
        theme={theme}
        onClose={() => setActivePractice(null)}
      />
      <ConvExerciseModal
        isOpen={Boolean(activePractice && isConvValueExercise)}
        t={t.canvas.demo}
        onClose={() => setActivePractice(null)}
      />
      <ValueExercise
        isOpen={Boolean(activePractice && isStandardValueExercise)}
        exerciseId={isStandardValueExercise ? activeExerciseId : null}
        node={activePractice?.node}
        t={t.canvas.demo}
        language={language}
        theme={theme}
        onClose={() => setActivePractice(null)}
      />
    </div>
  );
}
