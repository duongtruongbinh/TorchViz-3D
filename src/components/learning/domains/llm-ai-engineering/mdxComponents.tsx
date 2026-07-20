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
  LlmArInferencePipeline,
  LlmAcademiaIndustryComparison,
  LlmProbabilityDefinition,
  LlmAutoregressiveDefinition,
  LlmConceptInteraction,
  LlmConceptPanelBlock,
  LlmNextTokenLoss,
  LlmLossHandCalculation,
  LlmLossDerivation,
  LlmOutputProjection,
  LlmTrainingComponents,
  LlmVocabularyOutputVector,
  LlmTrainingLifecyclePanel,
  LlmTokenizerMemory,
  LlmTokenizerCodeStructure,
  LlmTokenizerBoundaryMismatch,
  LlmTokenizerFreeDirection,
  LlmTokenizerVocabularyLookup,
  LlmTokenizerIdMisconceptions,
  LlmTokenizerCodeToIds,
  LlmTokenizerOutputComparison,
  LlmTokenizerIdRoundTrip,
  LlmTokenizerMergeTraining,
  LlmTokenizerSequenceLength,
  LlmTokenizerRegexWalkthrough,
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

function TrainingComponents({ content }: { content: RoadmapContent }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmTrainingComponents content={materializeVietnameseFallback(content) as never} language={language} themeClasses={themeClasses} />;
}

function AcademiaIndustryComparison({ content, perspective }: { content: RoadmapContent; perspective: 'academia' | 'industry' }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmAcademiaIndustryComparison content={materializeVietnameseFallback(content) as never} perspective={perspective} language={language} themeClasses={themeClasses} />;
}

function ProbabilityDefinition({ content }: { content: RoadmapContent }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmProbabilityDefinition content={materializeVietnameseFallback(content) as never} language={language} themeClasses={themeClasses} />;
}

function AutoregressiveDefinition({ content }: { content: RoadmapContent }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmAutoregressiveDefinition content={materializeVietnameseFallback(content) as never} language={language} themeClasses={themeClasses} />;
}

function ArInferencePipeline({ content, step }: { content: RoadmapContent; step?: number }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmArInferencePipeline content={materializeVietnameseFallback(content) as never} step={step} language={language} themeClasses={themeClasses} />;
}

function VocabularyOutputVector({ content }: { content: RoadmapContent }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmVocabularyOutputVector content={materializeVietnameseFallback(content) as never} language={language} themeClasses={themeClasses} />;
}

function OutputProjection({ content, focus }: { content: RoadmapContent; focus?: 'overview' | 'context-input' | 'context-vector' | 'linear' | 'logits' | 'distribution' }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmOutputProjection content={materializeVietnameseFallback(content) as never} focus={focus} language={language} themeClasses={themeClasses} />;
}

function NextTokenLoss({ content, position, animated }: { content: RoadmapContent; position?: number; animated?: boolean }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmNextTokenLoss content={materializeVietnameseFallback(content) as never} position={position} animated={animated} language={language} themeClasses={themeClasses} />;
}

function LossHandCalculation({ content }: { content: RoadmapContent }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmLossHandCalculation content={materializeVietnameseFallback(content) as never} language={language} themeClasses={themeClasses} />;
}

function LossDerivation({ content }: { content: RoadmapContent }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmLossDerivation content={materializeVietnameseFallback(content) as never} language={language} themeClasses={themeClasses} />;
}

function TokenizerMemory({ content }: { content: RoadmapContent }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmTokenizerMemory content={materializeVietnameseFallback(content) as never} language={language} themeClasses={themeClasses} />;
}

function TokenizerCodeStructure({ content }: { content: RoadmapContent }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmTokenizerCodeStructure content={materializeVietnameseFallback(content) as never} language={language} themeClasses={themeClasses} />;
}

function TokenizerBoundaryMismatch({ content }: { content: RoadmapContent }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmTokenizerBoundaryMismatch content={materializeVietnameseFallback(content) as never} language={language} themeClasses={themeClasses} />;
}

function TokenizerFreeDirection({ content }: { content: RoadmapContent }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmTokenizerFreeDirection content={materializeVietnameseFallback(content) as never} language={language} themeClasses={themeClasses} />;
}

function TokenizerVocabularyLookup({ content }: { content: RoadmapContent }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmTokenizerVocabularyLookup content={materializeVietnameseFallback(content) as never} language={language} themeClasses={themeClasses} />;
}

function TokenizerIdMisconceptions({ content }: { content: RoadmapContent }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmTokenizerIdMisconceptions content={materializeVietnameseFallback(content) as never} language={language} themeClasses={themeClasses} />;
}

function TokenizerCodeToIds({ content }: { content: RoadmapContent }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmTokenizerCodeToIds content={materializeVietnameseFallback(content) as never} language={language} themeClasses={themeClasses} />;
}

function TokenizerOutputComparison({ content }: { content: RoadmapContent }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmTokenizerOutputComparison content={materializeVietnameseFallback(content) as never} language={language} themeClasses={themeClasses} />;
}

function TokenizerIdRoundTrip({ content }: { content: RoadmapContent }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmTokenizerIdRoundTrip content={materializeVietnameseFallback(content) as never} language={language} themeClasses={themeClasses} />;
}

function TokenizerMergeTraining({ content }: { content: RoadmapContent }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmTokenizerMergeTraining content={materializeVietnameseFallback(content) as never} language={language} themeClasses={themeClasses} />;
}

function TokenizerSequenceLength({ content }: { content: RoadmapContent }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmTokenizerSequenceLength content={materializeVietnameseFallback(content) as never} language={language} themeClasses={themeClasses} />;
}

function TokenizerRegexWalkthrough({ content }: { content: RoadmapContent }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmTokenizerRegexWalkthrough content={materializeVietnameseFallback(content) as never} language={language} themeClasses={themeClasses} />;
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
  AcademiaIndustryComparison,
  LlmProbabilityDefinition: ProbabilityDefinition,
  LlmAutoregressiveDefinition: AutoregressiveDefinition,
  LlmArInferencePipeline: ArInferencePipeline,
  LlmVocabularyOutputVector: VocabularyOutputVector,
  LlmOutputProjection: OutputProjection,
  LlmNextTokenLoss: NextTokenLoss,
  LlmLossHandCalculation: LossHandCalculation,
  LlmLossDerivation: LossDerivation,
  LlmTrainingComponents: TrainingComponents,
  DomainComparison,
  LlmOverview,
  TokenizationExample,
  TokenizerMemory,
  TokenizerCodeStructure,
  TokenizerBoundaryMismatch,
  TokenizerFreeDirection,
  TokenizerVocabularyLookup,
  TokenizerIdMisconceptions,
  TokenizerCodeToIds,
  TokenizerOutputComparison,
  TokenizerIdRoundTrip,
  TokenizerMergeTraining,
  TokenizerSequenceLength,
  TokenizerRegexWalkthrough,
  NextTokenExercise,
  ScaleFactors,
  ScaleComparison,
  LlmPopularity,
} satisfies Record<typeof LLM_MDX_COMPONENT_NAMES[number], LearningMdxComponent>;
