import type { LearningPracticeRef } from '../../../core/learning/types';
import { getStrings, type Language } from '../../../lib/localization';
import { getUnifiedPracticeText } from '../learningText';
import { cx, getLearningLabTheme } from '../theme';
import ReinforcementPracticeRenderer from './ReinforcementPracticeRenderer';
import TensorPracticeRenderer from './TensorPracticeRenderer';

type PracticeSectionProps = {
  practice: LearningPracticeRef[];
  theme: 'dark' | 'light';
  language: Language;
  selectedPracticeId?: string | null;
};

export default function PracticeSection({ practice, theme, language, selectedPracticeId = null }: PracticeSectionProps) {
  const strings = getStrings(language);
  const themeClasses = getLearningLabTheme(theme);
  if (!practice.length) return null;

  return (
    <div className="mt-5 grid gap-3">
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
              isSelected={selectedPracticeId === item.id}
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
              theme={theme}
              text={strings.reinforcementLearning.exercise}
              unavailableText={strings.reinforcementLearning.unavailablePractice}
            />
          );
        }

        return (
          <section key={item.id} className={cx('border p-4 text-sm font-black shadow-sm', themeClasses.radius.card, themeClasses.surface.card, themeClasses.mutedText)}>
            {strings.learningLab.unavailablePractice}
          </section>
        );
      })}
    </div>
  );
}
