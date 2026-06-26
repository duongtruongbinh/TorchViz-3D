import { useMemo } from 'react';

import type { TensorPracticeRef } from '../../../core/learning/types';
import type { Language } from '../../../lib/localization';
import { getStrings } from '../../../lib/localization';
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
  isSelected?: boolean;
};

export default function TensorPracticeRenderer({
  practice,
  title,
  theme,
  language,
  unavailableText,
  isSelected = false,
}: TensorPracticeRendererProps) {
  const strings = getStrings(language);
  const node = useMemo(() => createTensorPracticeNode(practice), [practice]);
  const isAvailable = isTensorPracticeApproved(practice) && Boolean(node);
  const exerciseId = practice.exerciseId;
  const isShapeExercise = isShapeExerciseId(exerciseId);
  const isConvValueExercise = isConvValueExerciseId(exerciseId);
  const isStandardValueExercise = isValueExerciseId(exerciseId);
  const themeClasses = getLearningLabTheme(theme);

  return (
    <section
      id={`practice-${practice.id}`}
      className={cx(
        'scroll-mt-6 border p-4 shadow-sm',
        themeClasses.radius.card,
        isSelected ? 'border-emerald-300/70 ring-2 ring-emerald-300/20' : themeClasses.surface.card,
      )}
    >
      <div className={cx('text-[11px] font-black uppercase tracking-wide', themeClasses.mutedText)}>{practice.kind}</div>
      <h3 className={cx('mt-1 text-base font-black', themeClasses.titleText)}>{title}</h3>
      <p className={cx('mt-2 text-xs leading-5', themeClasses.mutedText)}>{practice.targetOperation}</p>
      {!isAvailable ? (
        <div className={cx('mt-4 border px-4 py-2 text-center text-sm font-black', themeClasses.radius.button, themeClasses.surface.unavailable)}>
          {unavailableText}
        </div>
      ) : (
        <div className="mt-4">
          {isShapeExercise ? (
            <ShapeExercise
              isOpen
              displayMode="inline"
              exerciseId={exerciseId}
              node={node}
              t={strings.canvas.demo}
              language={language}
              theme={theme}
            />
          ) : null}
          {isConvValueExercise ? (
            <ConvExerciseModal
              isOpen
              displayMode="inline"
              t={strings.canvas.demo}
            />
          ) : null}
          {isStandardValueExercise ? (
            <ValueExercise
              isOpen
              displayMode="inline"
              exerciseId={exerciseId}
              node={node}
              t={strings.canvas.demo}
              language={language}
              theme={theme}
            />
          ) : null}
        </div>
      )}
    </section>
  );
}
