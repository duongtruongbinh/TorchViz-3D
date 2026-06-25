import { useMemo, useState } from 'react';

import type { TensorPracticeRef } from '../../../core/learning/types';
import type { Language } from '../../../lib/localization';
import { getStrings } from '../../../lib/localization';
import type { LayoutNode } from '../../../lib/irTypes';
import { ConvExerciseModal } from '../../mnist-demo/ConvExerciseModal';
import { ShapeExercise } from '../../exercises/ShapeExercise';
import { ValueExercise } from '../../exercises/ValueExercise';
import {
  isConvValueExerciseId,
  isShapeExerciseId,
  isValueExerciseId,
} from '../../exercises/exerciseRegistry';
import { createTensorPracticeNode, isTensorPracticeApproved } from './adapters/tensorPracticeAdapter';

type TensorPracticeRendererProps = {
  practice: TensorPracticeRef;
  title: string;
  theme: 'dark' | 'light';
  language: Language;
  unavailableText: string;
  startText: string;
};

type ActivePractice = {
  practice: TensorPracticeRef;
  node: LayoutNode;
};

export default function TensorPracticeRenderer({
  practice,
  title,
  theme,
  language,
  unavailableText,
  startText,
}: TensorPracticeRendererProps) {
  const strings = getStrings(language);
  const [activePractice, setActivePractice] = useState<ActivePractice | null>(null);
  const node = useMemo(() => createTensorPracticeNode(practice), [practice]);
  const isAvailable = isTensorPracticeApproved(practice) && Boolean(node);
  const activeExerciseId = activePractice?.practice.exerciseId;
  const isShapeExercise = isShapeExerciseId(activeExerciseId);
  const isConvValueExercise = isConvValueExerciseId(activeExerciseId);
  const isStandardValueExercise = isValueExerciseId(activeExerciseId);

  return (
    <section className="rounded-xl border border-sky-100 bg-white p-4 shadow-sm shadow-sky-100/70">
      <div className="text-[11px] font-black uppercase tracking-wide text-slate-400">{practice.kind}</div>
      <h3 className="mt-1 text-base font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-xs leading-5 text-slate-500">{practice.targetOperation}</p>
      {isAvailable ? (
        <button
          type="button"
          onClick={() => {
            if (node) setActivePractice({ practice, node });
          }}
          className="mt-4 w-full rounded-lg bg-sky-600 px-4 py-2 text-sm font-black text-white shadow-sm transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
        >
          {startText}
        </button>
      ) : (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-center text-sm font-black text-slate-500">
          {unavailableText}
        </div>
      )}

      <ShapeExercise
        isOpen={Boolean(activePractice && isShapeExercise)}
        exerciseId={isShapeExercise ? activeExerciseId : undefined}
        node={activePractice?.node}
        t={strings.canvas.demo}
        language={language}
        theme={theme}
        onClose={() => setActivePractice(null)}
      />
      <ConvExerciseModal
        isOpen={Boolean(activePractice && isConvValueExercise)}
        t={strings.canvas.demo}
        onClose={() => setActivePractice(null)}
      />
      <ValueExercise
        isOpen={Boolean(activePractice && isStandardValueExercise)}
        exerciseId={isStandardValueExercise ? activeExerciseId : null}
        node={activePractice?.node}
        t={strings.canvas.demo}
        language={language}
        theme={theme}
        onClose={() => setActivePractice(null)}
      />
    </section>
  );
}
