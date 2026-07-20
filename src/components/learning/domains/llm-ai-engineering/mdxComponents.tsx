import type { ComponentType } from 'react';
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
import type {
  LlmAcademiaIndustryComparisonContent,
  LlmArInferencePipelineContent,
  LlmContentRendererProps,
  LlmNextTokenLossContent,
  LlmOutputProjectionContent,
  LlmOutputProjectionFocus,
} from './rendererTypes';

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

function createContentRenderer<TContent>(Renderer: ComponentType<LlmContentRendererProps<TContent>>) {
  return function ContentRenderer({ content }: { content: RoadmapContent }) {
    const themeClasses = useLearningMdxTheme();
    const { language } = useLearningMdxLesson();
    const localizedContent = materializeVietnameseFallback(content) as TContent;
    return <Renderer content={localizedContent} language={language} themeClasses={themeClasses} />;
  };
}

function AiHierarchy({ content }: { content: RoadmapContent }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmAiHierarchy extra={materializeRoadmapExtra(content, 'llm-roadmap-motivation', 'motivation')} language={language} themeClasses={themeClasses} />;
}

const TrainingComponents = createContentRenderer(LlmTrainingComponents);

function AcademiaIndustryComparison({ content, perspective }: { content: RoadmapContent; perspective: 'academia' | 'industry' }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmAcademiaIndustryComparison content={materializeVietnameseFallback(content) as LlmAcademiaIndustryComparisonContent} perspective={perspective} language={language} themeClasses={themeClasses} />;
}

const ProbabilityDefinition = createContentRenderer(LlmProbabilityDefinition);
const AutoregressiveDefinition = createContentRenderer(LlmAutoregressiveDefinition);

function ArInferencePipeline({ content, step }: { content: RoadmapContent; step?: number }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmArInferencePipeline content={materializeVietnameseFallback(content) as LlmArInferencePipelineContent} step={step} language={language} themeClasses={themeClasses} />;
}

const VocabularyOutputVector = createContentRenderer(LlmVocabularyOutputVector);

function OutputProjection({ content, focus }: { content: RoadmapContent; focus?: LlmOutputProjectionFocus }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmOutputProjection content={materializeVietnameseFallback(content) as LlmOutputProjectionContent} focus={focus} language={language} themeClasses={themeClasses} />;
}

function NextTokenLoss({ content, position, animated }: { content: RoadmapContent; position?: number; animated?: boolean }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmNextTokenLoss content={materializeVietnameseFallback(content) as LlmNextTokenLossContent} position={position} animated={animated} language={language} themeClasses={themeClasses} />;
}

const LossHandCalculation = createContentRenderer(LlmLossHandCalculation);
const LossDerivation = createContentRenderer(LlmLossDerivation);
const TokenizerMemory = createContentRenderer(LlmTokenizerMemory);
const TokenizerCodeStructure = createContentRenderer(LlmTokenizerCodeStructure);
const TokenizerBoundaryMismatch = createContentRenderer(LlmTokenizerBoundaryMismatch);
const TokenizerFreeDirection = createContentRenderer(LlmTokenizerFreeDirection);
const TokenizerVocabularyLookup = createContentRenderer(LlmTokenizerVocabularyLookup);
const TokenizerIdMisconceptions = createContentRenderer(LlmTokenizerIdMisconceptions);
const TokenizerCodeToIds = createContentRenderer(LlmTokenizerCodeToIds);
const TokenizerOutputComparison = createContentRenderer(LlmTokenizerOutputComparison);
const TokenizerIdRoundTrip = createContentRenderer(LlmTokenizerIdRoundTrip);
const TokenizerMergeTraining = createContentRenderer(LlmTokenizerMergeTraining);
const TokenizerSequenceLength = createContentRenderer(LlmTokenizerSequenceLength);
const TokenizerRegexWalkthrough = createContentRenderer(LlmTokenizerRegexWalkthrough);

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
