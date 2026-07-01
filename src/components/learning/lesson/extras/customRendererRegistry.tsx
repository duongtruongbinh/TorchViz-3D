import type { ReactElement } from 'react';
import type { LearningLessonExtra } from '../../../../core/learning/types';
import type { Language } from '../../../../lib/localization';
import { getLearningLabTheme } from '../../theme';
import { renderLlmAiEngineeringExtra } from '../../domains/llm-ai-engineering/renderers';

export type CustomLearningExtraRendererProps = {
  extra: LearningLessonExtra;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
};

const customRenderers = [
  renderLlmAiEngineeringExtra,
];

export function renderCustomLearningExtra(props: CustomLearningExtraRendererProps): ReactElement | null {
  for (const render of customRenderers) {
    const rendered = render(props);
    if (rendered) return rendered;
  }
  return null;
}
