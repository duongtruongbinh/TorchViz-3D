import { SHARED_LEARNING_MDX_COMPONENT_NAMES } from '../../core/learning/mdxContract.ts';

export const CV_MDX_COMPONENT_NAMES = ['CvExercise'] as const;

export const STATISTICS_MDX_COMPONENT_NAMES = [
  'HistogramBinComparison',
  'HistogramBinExplorer',
  'HistogramConstructionVisual',
  'HistogramReadingInteraction',
  'HistogramRulesVisual',
  'HistogramShapeVisual',
  'NormalDistributionVisual',
  'NormalParameterExplorer',
  'PopulationSampleObservationOverview',
  'ProbabilityChapterVisual',
  'ProbabilitySourceImage',
  'StatisticalQuestionAtlas',
  'StatisticsBranchesOverview',
  'VarianceConceptVisual',
  'VarianceEstimatorComparison',
  'VariancePointExplorer',
] as const;

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
  statistics: STATISTICS_MDX_COMPONENT_NAMES,
  'llm-ai-engineering': LLM_MDX_COMPONENT_NAMES,
} as const;

export function getAllowedLearningMdxComponentNames(domainId: string): readonly string[] {
  const domainNames = domainMdxComponentNames[domainId as keyof typeof domainMdxComponentNames] ?? [];
  return [...SHARED_LEARNING_MDX_COMPONENT_NAMES, ...domainNames];
}
