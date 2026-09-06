import {
  REFERENCE_AUTHORED_MDX_COMPONENT_NAMES,
  SHARED_LEARNING_MDX_COMPONENT_NAMES,
} from '../../core/learning/mdxContract.ts';

export const CV_MDX_COMPONENT_NAMES = ['CvExercise'] as const;

export const CONTINUAL_LEARNING_LLM_MDX_COMPONENT_NAMES = ['StageContinuityMap'] as const;

export const LINEAR_ALGEBRA_MDX_COMPONENT_NAMES = [
  'AiDataRepresentationDemo',
  'BasisIndependenceExplorer',
  'ColumnCombinationExplorer',
  'ColumnNullSpaceExplorer',
  'CoordinateRepresentationDiagram',
  'CosineAngleExplorer',
  'CosineMotivationDiagram',
  'DeterminantAreaExplorer',
  'DeterminantRowOpsExplorer',
  'DiagonalizationExplorer',
  'DistancePlane',
  'DotProductAngleExplorer',
  'DotProductPlane',
  'EigenvectorExplorer',
  'EmbeddingCosineDiagram',
  'GaussianEliminationStepper',
  'GaussJordanInverseStepper',
  'GramSchmidtExplorer',
  'HadamardProductGrid',
  'L2NormTriangle',
  'LeastSquaresExplorer',
  'LinearSystemCasesExplorer',
  'LinearTransformationExplorer',
  'LUFactorizationExplorer',
  'MatrixExplorer',
  'MatrixProductExplorer',
  'MatrixTransposeExplorer',
  'MatrixVectorProductExplorer',
  'NormUnitBallDiagram',
  'NormalizationPlane',
  'NormalizationProcess',
  'OrthogonalityExplorer',
  'OuterProductExplorer',
  'PCAProjectionExplorer',
  'ProductOverview',
  'ProjectionExplorer',
  'RankPivotExplorer',
  'ScalarVectorPlane',
  'SubspaceClosureExplorer',
  'SVDGeometryExplorer',
  'TraceEigenvalueLink',
  'TruncatedSVDExplorer',
  'UnitVectorPlane',
  'VectorAdditionPlane',
  'VectorNormPlane',
  'VectorPlane',
  'VectorSubtractionPlane',
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

export const EVOLUTIONARY_ALGORITHMS_MDX_COMPONENT_NAMES = [
  'LocalMinimaTrapExplorer',
  'GradientFailureModesVisualizer',
  'ZeroOrderSamplingVisualizer',
  'BlackBoxFunctionVisualizer',
  'LossToFitnessVisualizer',
] as const;

export const AI_PROJECTS_MDX_COMPONENT_NAMES = [
  'ForecastHorizonCalendar',
  'LagFeatureVisualizer',
  'MovingAverageVisualizer',
  'CogsLeakageVisualizer',
] as const;

const domainMdxComponentNames = {
  cv: CV_MDX_COMPONENT_NAMES,
  'continual-learning-llm': CONTINUAL_LEARNING_LLM_MDX_COMPONENT_NAMES,
  'llm-ai-engineering': LLM_MDX_COMPONENT_NAMES,
  'linear-algebra': LINEAR_ALGEBRA_MDX_COMPONENT_NAMES,
  'evolutionary-algorithms': EVOLUTIONARY_ALGORITHMS_MDX_COMPONENT_NAMES,
  'ai-projects': AI_PROJECTS_MDX_COMPONENT_NAMES,
} as const;

export function getLearningDomainMdxComponentNames(domainId: string): readonly string[] {
  return domainMdxComponentNames[domainId as keyof typeof domainMdxComponentNames] ?? [];
}

export function getAllowedLearningMdxComponentNames(domainId: string): readonly string[] {
  const domainNames = getLearningDomainMdxComponentNames(domainId);
  const referenceNames = domainId === 'continual-learning-llm' ? REFERENCE_AUTHORED_MDX_COMPONENT_NAMES : [];
  return [...SHARED_LEARNING_MDX_COMPONENT_NAMES, ...referenceNames, ...domainNames];
}
