import type { LearningDomainId, LearningLessonExtra } from '../../../../core/learning/types';
import type { Language } from '../../../../lib/localization';
import { isLlmAiEngineeringCustomConceptPanel, renderLlmAiEngineeringExtra } from '../../domains/llm-ai-engineering/renderers';
import { getLearningLabTheme } from '../../theme';
import ConceptPanelBlock from './ConceptPanelBlock';
import QuizBlock, { type QuizQuestionState } from './QuizBlock';

export type { QuizQuestionState } from './QuizBlock';

type LessonExtraRendererProps = {
  domainId: LearningDomainId;
  extra: LearningLessonExtra;
  language: Language;
  quizQuestionStates?: Record<string, QuizQuestionState>;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
  onQuizQuestionStateChange?: (questionId: string, state: QuizQuestionState) => void;
};

export default function LessonExtraRenderer({
  domainId,
  extra,
  language,
  quizQuestionStates,
  themeClasses,
  onQuizQuestionStateChange,
}: LessonExtraRendererProps) {
  if (domainId === 'llm-ai-engineering' && shouldUseLlmRenderer(extra)) {
    const renderedExtra = renderLlmAiEngineeringExtra({ extra, language, themeClasses });
    if (!renderedExtra) {
      throw new Error(`Missing LLM Learning Lab renderer for extra "${extra.id}".`);
    }
    return renderedExtra;
  }

  if (extra.kind === 'conceptPanel') {
    return <ConceptPanelBlock extra={extra} language={language} themeClasses={themeClasses} />;
  }

  if (extra.kind === 'quiz') {
    return (
      <QuizBlock
        extra={extra}
        language={language}
        quizQuestionStates={quizQuestionStates}
        themeClasses={themeClasses}
        onQuizQuestionStateChange={onQuizQuestionStateChange}
      />
    );
  }

  return null;
}

function shouldUseLlmRenderer(extra: LearningLessonExtra): boolean {
  return extra.kind === 'motivation'
    || extra.kind === 'conceptInteraction'
    || isLlmAiEngineeringCustomConceptPanel(extra);
}
