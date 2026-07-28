import { SHARED_LEARNING_MDX_COMPONENT_NAMES } from '../../core/learning/mdxContract.ts';

export const CV_MDX_COMPONENT_NAMES = ['CvExercise'] as const;

export const LLM_MDX_COMPONENT_NAMES = [
  'AiHierarchy',
  'DomainComparison',
  'ScopeConvention',
  'AcademiaIndustryComparison',
  'LlmProbabilityDefinition',
  'LlmPerplexityGoodRange',
  'LlmPerplexityInterpretation',
  'LlmPerplexitySequenceExample',
  'LlmAutoregressiveDefinition',
  'LlmArInferencePipeline',
  'LlmVocabularyOutputVector',
  'LlmOutputProjection',
  'LlmNextTokenLoss',
  'LlmLossHandCalculation',
  'LlmLossDerivation',
  'LlmTrainingComponents',
  'EmbeddingPipelineVisual',
  'AttentionConceptVisual',
  'GptConceptVisual',
  'TrainingConceptVisual',
  'EvaluationConceptVisual',
  'PromptConceptVisual',
  'PretrainingDatasetCards',
  'RawTextModelInput',
  'PaddingMask',
  'SpecialTokenRoles',
  'SlidingWindowWorkedExample',
  'TransformerArchitectureOverview',
  'TokenizerConceptVisual',
  'TokenizerContract',
  'TokenizerGranularity',
  'LlmOverview',
  'TokenizationExample',
  'TokenizerVocabularyLookup',
  'TokenizerIdMisconceptions',
  'TokenIdTensorShape',
  'TokenizerMergeTraining',
  'TokenizerSequenceLength',
  'TokenizerCodeWalkthrough',
  'TokenFallbackComparison',
  'TokenizerRegexWalkthrough',
  'CodeLessonFrame',
  'NextTokenExercise',
  'ScaleFactors',
  'ScaleComparison',
  'LlmPopularity',
] as const;

const domainMdxComponentNames = {
  cv: CV_MDX_COMPONENT_NAMES,
  'llm-ai-engineering': LLM_MDX_COMPONENT_NAMES,
} as const;

export function getAllowedLearningMdxComponentNames(domainId: string): readonly string[] {
  const domainNames = domainMdxComponentNames[domainId as keyof typeof domainMdxComponentNames] ?? [];
  return [...SHARED_LEARNING_MDX_COMPONENT_NAMES, ...domainNames];
}
