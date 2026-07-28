import type { ComponentType } from 'react';
import type { LearningLessonExtra } from '../../authoredTypes';
import { LLM_MDX_COMPONENT_NAMES } from '../../../../content/learning/mdxComponents';
import {
  useLearningMdxLesson,
  useLearningMdxTheme,
  type LearningMdxComponent,
} from '../../learningMdxComponents';
import {
  LlmAiHierarchy,
  LlmArInferencePipeline,
  LlmAcademiaIndustryComparison,
  LlmProbabilityDefinition,
  LlmPerplexityGoodRange,
  LlmPerplexityInterpretation,
  LlmPerplexitySequenceExample,
  LlmAutoregressiveDefinition,
  LlmConceptInteraction,
  LlmConceptPanelBlock,
  LlmNextTokenLoss,
  LlmLossHandCalculation,
  LlmLossDerivation,
  LlmOutputProjection,
  LlmPretrainingDatasetCards,
  LlmTrainingComponents,
  LlmVocabularyOutputVector,
  LlmEmbeddingPipelineVisual,
  LlmRawTextModelInput,
  LlmPaddingMask,
  LlmSpecialTokenRoles,
  LlmSlidingWindowWorkedExample,
  LlmTransformerArchitectureOverview,
  LlmTokenizerMemory,
  LlmTokenizerContract,
  LlmTokenizerGranularity,
  LlmTokenizerVocabularyLookup,
  LlmTokenizerIdMisconceptions,
  LlmTokenIdTensorShape,
  LlmBpeFallback,
  LlmBpeInferenceFlow,
  LlmTokenizerMergeTraining,
  LlmTokenizerSequenceLength,
  LlmTokenizerRegexWalkthrough,
  LlmVocabularyTradeoff,
  CodeLessonFrame,
} from './renderers';
import type {
  LlmAcademiaIndustryComparisonContent,
  LlmArInferencePipelineContent,
  LlmContentRendererProps,
  LlmNextTokenLossContent,
  LlmOutputProjectionContent,
  LlmOutputProjectionFocus,
} from './rendererTypes';

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
const PerplexityGoodRange = createContentRenderer(LlmPerplexityGoodRange);
const PerplexityInterpretation = createContentRenderer(LlmPerplexityInterpretation);
const PerplexitySequenceExample = createContentRenderer(LlmPerplexitySequenceExample);
const AutoregressiveDefinition = createContentRenderer(LlmAutoregressiveDefinition);

function ArInferencePipeline({ content, step, training }: { content: RoadmapContent; step?: number; training?: boolean }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  return <LlmArInferencePipeline content={materializeVietnameseFallback(content) as LlmArInferencePipelineContent} step={step} training={training} language={language} themeClasses={themeClasses} />;
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
const EmbeddingPipelineVisual = createContentRenderer(LlmEmbeddingPipelineVisual);
const AttentionConceptVisual = createContentRenderer(LlmEmbeddingPipelineVisual);
const GptConceptVisual = createContentRenderer(LlmEmbeddingPipelineVisual);
const TrainingConceptVisual = createContentRenderer(LlmEmbeddingPipelineVisual);
const EvaluationConceptVisual = createContentRenderer(LlmEmbeddingPipelineVisual);
const PromptConceptVisual = createContentRenderer(LlmEmbeddingPipelineVisual);
const PretrainingDatasetCards = createContentRenderer(LlmPretrainingDatasetCards);
const RawTextModelInput = createContentRenderer(LlmRawTextModelInput);
const PaddingMask = createContentRenderer(LlmPaddingMask);
const SpecialTokenRoles = createContentRenderer(LlmSpecialTokenRoles);
const SlidingWindowWorkedExample = createContentRenderer(LlmSlidingWindowWorkedExample);
const TokenizerContract = createContentRenderer(LlmTokenizerContract);
const TokenizerGranularity = createContentRenderer(LlmTokenizerGranularity);
const TokenizerMemory = createContentRenderer(LlmTokenizerMemory);
const TokenizerVocabularyLookup = createContentRenderer(LlmTokenizerVocabularyLookup);
const TokenizerIdMisconceptions = createContentRenderer(LlmTokenizerIdMisconceptions);
const TokenIdTensorShape = createContentRenderer(LlmTokenIdTensorShape);
const BpeFallback = createContentRenderer(LlmBpeFallback);
const BpeInferenceFlow = createContentRenderer(LlmBpeInferenceFlow);
const TokenizerMergeTraining = createContentRenderer(LlmTokenizerMergeTraining);
const TokenizerSequenceLength = createContentRenderer(LlmTokenizerSequenceLength);
const TokenizerCodeWalkthrough = createContentRenderer(LlmTokenizerRegexWalkthrough);
const TokenFallbackComparison = createContentRenderer(LlmBpeFallback);
const TokenizerRegexWalkthrough = createContentRenderer(LlmTokenizerRegexWalkthrough);
const VocabularyTradeoff = createContentRenderer(LlmVocabularyTradeoff);

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
const ScopeConvention = panelComponent('ai-scope-convention');
const LlmOverview = interactionComponent('what-is-llm');
const TokenizationExample = panelComponent('tokenization-example');
const NextTokenExercise = interactionComponent('what-is-llm-interactions');
const ScaleFactors = panelComponent('why-large');
const ScaleComparison = panelComponent('iris-scale-comparison-roadmap');
const LlmPopularity = panelComponent('why-llms-are-popular-now');

function TransformerArchitectureOverview({ focus }: { focus?: 'encoder-decoder' | 'input-embedding' }) {
  return <LlmTransformerArchitectureOverview focus={focus} themeClasses={useLearningMdxTheme()} />;
}

export const llmMdxComponents = {
  AiHierarchy,
  AcademiaIndustryComparison,
  LlmProbabilityDefinition: ProbabilityDefinition,
  LlmPerplexityGoodRange: PerplexityGoodRange,
  LlmPerplexityInterpretation: PerplexityInterpretation,
  LlmPerplexitySequenceExample: PerplexitySequenceExample,
  LlmAutoregressiveDefinition: AutoregressiveDefinition,
  LlmArInferencePipeline: ArInferencePipeline,
  LlmVocabularyOutputVector: VocabularyOutputVector,
  LlmOutputProjection: OutputProjection,
  LlmNextTokenLoss: NextTokenLoss,
  LlmLossHandCalculation: LossHandCalculation,
  LlmLossDerivation: LossDerivation,
  LlmTrainingComponents: TrainingComponents,
  EmbeddingPipelineVisual,
  AttentionConceptVisual,
  GptConceptVisual,
  TrainingConceptVisual,
  EvaluationConceptVisual,
  PromptConceptVisual,
  PretrainingDatasetCards,
  RawTextModelInput,
  PaddingMask,
  SpecialTokenRoles,
  SlidingWindowWorkedExample,
  TransformerArchitectureOverview,
  TokenizerContract,
  TokenizerGranularity,
  DomainComparison,
  ScopeConvention,
  LlmOverview,
  TokenizationExample,
  TokenizerMemory,
  TokenizerVocabularyLookup,
  TokenizerIdMisconceptions,
  TokenIdTensorShape,
  BpeFallback,
  BpeInferenceFlow,
  TokenizerMergeTraining,
  TokenizerSequenceLength,
  TokenizerCodeWalkthrough,
  TokenFallbackComparison,
  TokenizerRegexWalkthrough,
  VocabularyTradeoff,
  CodeLessonFrame,
  NextTokenExercise,
  ScaleFactors,
  ScaleComparison,
  LlmPopularity,
} satisfies Record<typeof LLM_MDX_COMPONENT_NAMES[number], LearningMdxComponent>;
