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
import { cx, getLearningLabTheme } from '../theme';
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
  const themeClasses = getLearningLabTheme(theme);

  return (
    <section className={cx('border p-4 shadow-sm', themeClasses.radius.card, themeClasses.surface.card)}>
      <div className={cx('text-[11px] font-black uppercase tracking-wide', themeClasses.mutedText)}>{practice.kind}</div>
      <h3 className={cx('mt-1 text-base font-black', themeClasses.titleText)}>{title}</h3>
      <p className={cx('mt-2 text-xs leading-5', themeClasses.mutedText)}>{practice.targetOperation}</p>
      {isAvailable ? (
        <button
          type="button"
          onClick={() => {
            if (node) setActivePractice({ practice, node });
          }}
          className={cx('mt-4 w-full px-4 py-2 text-sm', themeClasses.radius.button, themeClasses.button.primary)}
        >
          {startText}
        </button>
      ) : (
        <div className={cx('mt-4 border px-4 py-2 text-center text-sm font-black', themeClasses.radius.button, themeClasses.surface.unavailable)}>
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
