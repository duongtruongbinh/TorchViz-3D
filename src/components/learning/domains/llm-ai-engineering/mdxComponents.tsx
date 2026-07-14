import type { LearningLessonExtra } from '../../authoredTypes';
import { LLM_MDX_COMPONENT_NAMES } from '../../../../content/learning/mdxComponents';
import {
  ExtraFrame,
  useLearningMdxLesson,
  useLearningMdxTheme,
  type LearningMdxComponent,
} from '../../learningMdxComponents';
import {
  LlmAiHierarchy,
  LlmConceptInteraction,
  LlmConceptPanelBlock,
  LlmTrainingLifecyclePanel,
  TransformerTranslationStepPanel,
} from './renderers';

const localized = (value: string) => ({ en: value, vi: value });

function authoredPanel(id: string, title: string, body: string[], links?: Array<{ label: string; href: string }>, highlights?: Array<{ shortName: string; fullName: string; description: string }>): Extract<LearningLessonExtra, { kind: 'conceptPanel' }> {
  return {
    kind: 'conceptPanel', id, sectionRefId: 'llm-data-pipeline-overview', title: localized(title),
    body: body.map(localized), links: links?.map((link) => ({ label: localized(link.label), href: link.href })),
    highlights: highlights?.map((item) => ({ shortName: localized(item.shortName), fullName: localized(item.fullName), description: localized(item.description) })),
  };
}

function TrainingLifecycle({ body, highlights, title }: { body: string[]; highlights: Array<{ shortName: string; fullName: string; description: string }>; title: string }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <ExtraFrame title={title} themeClasses={themeClasses}><LlmTrainingLifecyclePanel extra={authoredPanel('llm-training-lifecycle', title, body, undefined, highlights)} language={language} themeClasses={themeClasses} /></ExtraFrame>;
}

function TransformerTranslationStep({ body, links, step, title }: { body: string[]; links?: Array<{ label: string; href: string }>; step: number; title: string }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <ExtraFrame title={title} themeClasses={themeClasses}><TransformerTranslationStepPanel extra={authoredPanel(`transformer-translation-step-${step}`, title, body, links)} language={language} themeClasses={themeClasses} /></ExtraFrame>;
}

function materializeVietnameseFallback(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(materializeVietnameseFallback);
  if (!value || typeof value !== 'object') return value;
  const record = value as Record<string, unknown>;
  if (Object.keys(record).length === 1 && typeof record.vi === 'string') return { en: record.vi, vi: record.vi };
  return Object.fromEntries(Object.entries(record).map(([key, item]) => [key, materializeVietnameseFallback(item)]));
}

type RoadmapContent = Record<string, unknown>;

function materializeRoadmapExtra<T extends LearningLessonExtra['kind']>(content: RoadmapContent, id: string, kind: T): Extract<LearningLessonExtra, { kind: T }> {
  return materializeVietnameseFallback({ ...content, kind, id, sectionRefId: 'llm-from-scratch-roadmap' }) as Extract<LearningLessonExtra, { kind: T }>;
}

function AiHierarchy({ content }: { content: RoadmapContent }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmAiHierarchy extra={materializeRoadmapExtra(content, 'llm-roadmap-motivation', 'motivation')} language={language} themeClasses={themeClasses} />;
}

function interactionComponent(id: string) {
  return function Interaction({ content }: { content: RoadmapContent }) {
    const themeClasses = useLearningMdxTheme();
    const { language } = useLearningMdxLesson();
    return <LlmConceptInteraction extra={materializeRoadmapExtra(content, id, 'conceptInteraction')} language={language} themeClasses={themeClasses} />;
  };
}

function panelComponent(id: string) {
  return function Panel({ content }: { content: RoadmapContent }) {
    const themeClasses = useLearningMdxTheme();
    const { language } = useLearningMdxLesson();
    return <LlmConceptPanelBlock extra={materializeRoadmapExtra(content, id, 'conceptPanel')} language={language} themeClasses={themeClasses} />;
  };
}

const DomainComparison = panelComponent('why-split-ai-fields');
const LlmOverview = interactionComponent('what-is-llm');
const TokenizationExample = panelComponent('tokenization-example');
const NextTokenExercise = interactionComponent('what-is-llm-interactions');
const ScaleFactors = panelComponent('why-large');
const ScaleComparison = panelComponent('iris-scale-comparison-roadmap');
const LlmPopularity = panelComponent('why-llms-are-popular-now');

export const llmMdxComponents = {
  TrainingLifecycle,
  TransformerTranslationStep,
  AiHierarchy,
  DomainComparison,
  LlmOverview,
  TokenizationExample,
  NextTokenExercise,
  ScaleFactors,
  ScaleComparison,
  LlmPopularity,
} satisfies Record<typeof LLM_MDX_COMPONENT_NAMES[number], LearningMdxComponent>;
