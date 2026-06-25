import type { RLLearningPracticeRef } from '../../core/rlTypes';
import { getStrings, getReinforcementPracticeText } from '../../lib/localization';
import { useStore } from '../../store/useStore';
import GridWorldExercise from '../exercises/GridWorldExercise';
import RLShapeExercise from '../exercises/RLShapeExercise';
import RLValueExercise from '../exercises/RLValueExercise';
import { getRLPracticeFixture, isRLPracticeApproved } from '../exercises/rlPracticeAdapter';

type PracticeSectionProps = {
  practice: RLLearningPracticeRef[];
};

export default function PracticeSection({ practice }: PracticeSectionProps) {
  const language = useStore((s) => s.language);
  const t = getStrings(language).reinforcementLearning;

  if (!practice.length) return null;

  return (
    <div className="mt-5 grid gap-3">
      {practice.map((item) => {
        const fixture = getRLPracticeFixture(item);
        const practiceText = getReinforcementPracticeText(t, item);
        const isAvailable = isRLPracticeApproved(item) && Boolean(fixture);

        return (
          <section key={item.id} className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
            <div className="text-[11px] font-black uppercase text-zinc-500">{item.kind}</div>
            <h3 className="mt-1 text-base font-bold text-zinc-100">{practiceText.title}</h3>
            <p className="mt-2 text-xs leading-5 text-zinc-500">{item.targetConcept}</p>
            {isAvailable && fixture?.type === 'mdp' && <RLShapeExercise fixture={fixture} text={t.exercise} />}
            {isAvailable && fixture?.type === 'bellman' && <RLValueExercise fixture={fixture} text={t.exercise} />}
            {isAvailable && fixture?.type === 'gridworld' && <GridWorldExercise fixture={fixture} text={t.exercise} />}
            {!isAvailable && (
              <div className="mt-4 rounded-md border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-center text-sm font-bold text-zinc-400">
                {t.unavailablePractice}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
