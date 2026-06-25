import type { LearningPracticeRef } from '../../../core/learning/types';
import { getStrings, type Language } from '../../../lib/localization';
import { getUnifiedPracticeText } from '../learningText';
import ReinforcementPracticeRenderer from './ReinforcementPracticeRenderer';
import TensorPracticeRenderer from './TensorPracticeRenderer';

type PracticeSectionProps = {
  practice: LearningPracticeRef[];
  theme: 'dark' | 'light';
  language: Language;
};

export default function PracticeSection({ practice, theme, language }: PracticeSectionProps) {
  const strings = getStrings(language);
  if (!practice.length) return null;

  return (
    <div className="mt-5 grid gap-3 xl:grid-cols-2">
      {practice.map((item) => {
        const title = getUnifiedPracticeText(language, item).title;

        if (item.family === 'tensor') {
          return (
            <TensorPracticeRenderer
              key={item.id}
              practice={item}
              title={title}
              theme={theme}
              language={language}
              unavailableText={strings.learningLab.unavailablePractice}
              startText={strings.learningLab.startExercise}
            />
          );
        }

        if (item.family === 'reinforcement-learning') {
          return (
            <ReinforcementPracticeRenderer
              key={item.id}
              practice={item}
              title={title}
              targetConcept={item.targetConcept}
              text={strings.reinforcementLearning.exercise}
              unavailableText={strings.reinforcementLearning.unavailablePractice}
            />
          );
        }

        return (
          <section key={item.id} className="rounded-xl border border-sky-100 bg-white p-4 text-sm font-black text-slate-500 shadow-sm shadow-sky-100/70">
            {strings.learningLab.unavailablePractice}
          </section>
        );
      })}
    </div>
  );
}
