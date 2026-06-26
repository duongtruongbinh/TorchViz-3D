import type { ReinforcementPracticeRef } from '../../../core/learning/types';
import type { LocalizedStrings } from '../../../lib/localization';
import GridWorldExercise from '../../exercises/GridWorldExercise';
import RLShapeExercise from '../../exercises/RLShapeExercise';
import RLValueExercise from '../../exercises/RLValueExercise';
import { cx, getLearningLabTheme, type LearningLabTheme } from '../theme';
import { getRLPracticeFixture, isRLPracticeApproved } from './adapters/reinforcementPracticeAdapter';

type ReinforcementPracticeRendererProps = {
  practice: ReinforcementPracticeRef;
  title: string;
  targetConcept: string;
  theme: LearningLabTheme;
  text: LocalizedStrings['reinforcementLearning']['exercise'];
  unavailableText: string;
};

export default function ReinforcementPracticeRenderer({
  practice,
  title,
  targetConcept,
  theme,
  text,
  unavailableText,
}: ReinforcementPracticeRendererProps) {
  const fixture = getRLPracticeFixture(practice);
  const isAvailable = isRLPracticeApproved(practice) && Boolean(fixture);
  const themeClasses = getLearningLabTheme(theme);

  return (
    <section className={cx('rounded-xl border p-4 shadow-sm', themeClasses.card)}>
      <div className={cx('text-[11px] font-black uppercase tracking-wide', themeClasses.mutedText)}>{practice.kind}</div>
      <h3 className={cx('mt-1 text-base font-black', themeClasses.titleText)}>{title}</h3>
      <p className={cx('mt-2 text-xs leading-5', themeClasses.mutedText)}>{targetConcept}</p>
      {isAvailable && fixture?.type === 'mdp' && <RLShapeExercise fixture={fixture} text={text} />}
      {isAvailable && fixture?.type === 'bellman' && <RLValueExercise fixture={fixture} text={text} />}
      {isAvailable && fixture?.type === 'gridworld' && <GridWorldExercise fixture={fixture} text={text} />}
      {!isAvailable && (
        <div className={cx('mt-4 rounded-lg border px-4 py-2 text-center text-sm font-black', themeClasses.unavailable)}>
          {unavailableText}
        </div>
      )}
    </section>
  );
}
