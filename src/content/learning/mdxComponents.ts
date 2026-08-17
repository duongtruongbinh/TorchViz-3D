import { SHARED_LEARNING_MDX_COMPONENT_NAMES } from '../../core/learning/mdxContract.ts';

export const CV_MDX_COMPONENT_NAMES = ['CvExercise'] as const;

const LINEAR_ALGEBRA_MDX_COMPONENT_NAMES = ['MdxQuiz'] as const;

export const LLM_MDX_COMPONENT_NAMES = [
  'TrainingLifecycle',
  'TransformerTranslationStep',
  'AiHierarchy',
  'DomainComparison',
  'ScopeConvention',
  'AcademiaIndustryComparison',
  'LlmBenchmarkLikelihood',
  'LlmHuggingFaceBenchmarks',
  'LlmProbabilityDefinition',
  'LlmPerplexityGoodRange',
  'LlmPerplexityInterpretation',
  'LlmPerplexitySequenceExample',
  'LlmPostTrainingEvaluation',
  'LlmAutoregressiveDefinition',
  'LlmArInferencePipeline',
  'LlmVocabularyOutputVector',
  'LlmOutputProjection',
  'LlmNextTokenLoss',
  'LlmLossHandCalculation',
  'LlmLossDerivation',
  'LlmTrainingComponents',
  'LlmOverview',
  'TokenizationExample',
  'TokenizerMemory',
  'TokenizerCodeStructure',
  'TokenizerBoundaryMismatch',
  'TokenizerFreeDirection',
  'TokenizerVocabularyLookup',
  'TokenizerIdMisconceptions',
  'TokenizerContextAmbiguity',
  'TokenizerCodeToIds',
  'TokenizerOutputComparison',
  'TokenizerIdRoundTrip',
  'TokenizerMergeTraining',
  'TokenizerSequenceLength',
  'TokenizerRegexWalkthrough',
  'NextTokenExercise',
  'ScaleFactors',
  'ScaleComparison',
  'LlmPopularity',
] as const;

const domainMdxComponentNames = {
  cv: CV_MDX_COMPONENT_NAMES,
  'llm-ai-engineering': LLM_MDX_COMPONENT_NAMES,
  'linear-algebra': LINEAR_ALGEBRA_MDX_COMPONENT_NAMES,
} as const;

export function getLearningDomainMdxComponentNames(domainId: string): readonly string[] {
  return domainMdxComponentNames[domainId as keyof typeof domainMdxComponentNames] ?? [];
}

export function getAllowedLearningMdxComponentNames(domainId: string): readonly string[] {
  const domainNames = getLearningDomainMdxComponentNames(domainId);
  return [...SHARED_LEARNING_MDX_COMPONENT_NAMES, ...domainNames];
}
