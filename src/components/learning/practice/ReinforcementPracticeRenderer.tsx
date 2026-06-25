import type { ReinforcementPracticeRef } from '../../../core/learning/types';
import type { LocalizedStrings } from '../../../lib/localization';
import GridWorldExercise from '../../exercises/GridWorldExercise';
import RLShapeExercise from '../../exercises/RLShapeExercise';
import RLValueExercise from '../../exercises/RLValueExercise';
import { getRLPracticeFixture, isRLPracticeApproved } from './adapters/reinforcementPracticeAdapter';

type ReinforcementPracticeRendererProps = {
  practice: ReinforcementPracticeRef;
  title: string;
  targetConcept: string;
  text: LocalizedStrings['reinforcementLearning']['exercise'];
  unavailableText: string;
};

export default function ReinforcementPracticeRenderer({
  practice,
  title,
  targetConcept,
  text,
  unavailableText,
}: ReinforcementPracticeRendererProps) {
  const fixture = getRLPracticeFixture(practice);
  const isAvailable = isRLPracticeApproved(practice) && Boolean(fixture);

  return (
    <section className="rounded-xl border border-sky-100 bg-white p-4 shadow-sm shadow-sky-100/70">
      <div className="text-[11px] font-black uppercase tracking-wide text-slate-400">{practice.kind}</div>
      <h3 className="mt-1 text-base font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-xs leading-5 text-slate-500">{targetConcept}</p>
      {isAvailable && fixture?.type === 'mdp' && <RLShapeExercise fixture={fixture} text={text} />}
      {isAvailable && fixture?.type === 'bellman' && <RLValueExercise fixture={fixture} text={text} />}
      {isAvailable && fixture?.type === 'gridworld' && <GridWorldExercise fixture={fixture} text={text} />}
      {!isAvailable && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-center text-sm font-black text-slate-500">
          {unavailableText}
        </div>
      )}
    </section>
  );
}
