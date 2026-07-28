import type { LearningLocalizedText } from '../../../../core/learning/types';
import type { Language } from '../../../../lib/localization';
import type { getLearningLabTheme } from '../../theme';

export type LlmRendererTheme = ReturnType<typeof getLearningLabTheme>;

export type LlmContentRendererProps<TContent> = {
  content: TContent;
  language: Language;
  themeClasses: LlmRendererTheme;
};

export type LlmExtraRendererProps<TExtra> = {
  extra: TExtra;
  language: Language;
  themeClasses: LlmRendererTheme;
};

export type LlmTrainingComponentsContent = {
  body: LearningLocalizedText;
  cards: Array<{ title: LearningLocalizedText; description: LearningLocalizedText }>;
};

export type LlmRawTextModelInputContent = {
  lead: LearningLocalizedText;
  rawText: string;
  tokenIds: number[];
  embeddingRows: string[][];
  rawTextNote: LearningLocalizedText;
  tokenIdsNote: LearningLocalizedText;
  embeddingNote: LearningLocalizedText;
};

export type LlmPretrainingDatasetCardsContent = {
  lead: LearningLocalizedText;
  image?: 'dataset-evolution';
  datasets: Array<{
    id: 'c4' | 'pile' | 'dolma' | 'fineweb';
    name: string;
    scale: string;
    brief: LearningLocalizedText;
    href: string;
  }>;
  note: LearningLocalizedText;
};

export type LlmAcademiaIndustryComparisonContent = Omit<LlmTrainingComponentsContent, 'body'> & {
  academia: LearningLocalizedText;
  industry: LearningLocalizedText;
};

export type LlmTokenizerGranularityContent = {
  lead: LearningLocalizedText;
  whitespaceNote: LearningLocalizedText;
  misconception: LearningLocalizedText;
};

export type LlmTokenizerContractContent = {
  lead: LearningLocalizedText;
  decisions: Array<{
    id: 'vocabulary' | 'ids' | 'length' | 'roundtrip';
    title: LearningLocalizedText;
    value: string;
    meaning: LearningLocalizedText;
  }>;
  checkpoint: LearningLocalizedText;
  misconception: LearningLocalizedText;
};

export type LlmTokenizerCodeStructureContent = {
  lead: LearningLocalizedText;
  code: string[];
  challenge: { title: LearningLocalizedText; body: LearningLocalizedText; signals: string[] };
  improvement: { title: LearningLocalizedText; body: LearningLocalizedText; signals: string[] };
  takeaway: LearningLocalizedText;
};

export type LlmTokenizerBoundaryMismatchContent = {
  lead: LearningLocalizedText;
  examples: Array<{
    id: 'number' | 'code';
    source: string;
    humanLabel: LearningLocalizedText;
    humanMeaning: LearningLocalizedText;
    tokenizations: string[][];
    tokenizerMeaning: LearningLocalizedText;
  }>;
  takeaway: LearningLocalizedText;
};

export type LlmTokenizerFreeDirectionContent = {
  lead: LearningLocalizedText;
  subword: {
    title: LearningLocalizedText;
    sequence: string[];
    strength: LearningLocalizedText;
    constraint: LearningLocalizedText;
  };
  direct: {
    title: LearningLocalizedText;
    sequence: string[];
    strength: LearningLocalizedText;
    constraint: LearningLocalizedText;
  };
  takeaway: LearningLocalizedText;
};

export type LlmTokenizerVocabularyLookupContent = {
  lead: LearningLocalizedText;
  entries: Array<{ token: string; id: number }>;
};

export type LlmTokenizerIdMisconceptionsContent = {
  lead: LearningLocalizedText;
  entries: Array<{ token: string; id: number }>;
  nonMeanings: Array<LearningLocalizedText>;
  takeaway: LearningLocalizedText;
};

export type LlmTokenizerContextAmbiguityContent = {
  token: string;
  examples: Array<{
    id: 'road' | 'sugar';
    before: string;
    after: string;
    meaning: LearningLocalizedText;
    tokenIds: number[];
    highlightedTokenIndex: number;
  }>;
  explanation: LearningLocalizedText;
};

export type LlmTokenizerCodeToIdsContent = {
  lead: LearningLocalizedText;
  note?: LearningLocalizedText;
  tokenizerName: string;
  tokenizerDescription: LearningLocalizedText;
  rawText: string;
  entries: Array<{ token: string; id: number }>;
  stages: Array<{
    id: 'load' | 'input' | 'encode' | 'inspect' | 'count';
    title: LearningLocalizedText;
    code: string[];
    answerCode?: string[];
    output?: string[];
  }>;
  takeaway: LearningLocalizedText;
};

export type LlmTokenizerOutputComparisonContent = {
  lead: LearningLocalizedText;
  rawText: string;
  examples: Array<{
    id: 'general' | 'vietnamese';
    name: string;
    description: LearningLocalizedText;
    tokens: string[];
    ids: number[];
  }>;
  markerNote: LearningLocalizedText;
  takeaway: LearningLocalizedText;
};

export type LlmTokenizerIdRoundTripContent = {
  lead: LearningLocalizedText;
  sourceText: string;
  tokens: string[];
  ids: number[];
  modelLabel: LearningLocalizedText;
  sampledToken: string;
  sampledTokenId: number;
  outputText: string;
};

export type LlmTokenIdTensorShapeContent = {
  lead: LearningLocalizedText;
  ids: number[];
  batchSize: number;
  sequenceLength: number;
  dtype: string;
  stages: Array<{
    label: LearningLocalizedText;
    value: string;
    contract: string;
  }>;
  takeaway: LearningLocalizedText;
  misconception: LearningLocalizedText;
};

export type LlmSpecialTokenRolesContent = {
  lead: LearningLocalizedText;
  tokens: Array<{
    id: 'bos' | 'eos' | 'pad' | 'unk' | 'boundary';
    token: string;
    title: string;
    role: LearningLocalizedText;
  }>;
  contract: LearningLocalizedText;
  misconception: LearningLocalizedText;
};

export type LlmPaddingMaskContent = {
  lead: LearningLocalizedText;
  rows: Array<{
    label: string;
    tokens: string[];
    valid: number[];
  }>;
  padMeaning: LearningLocalizedText;
  maskMeaning: LearningLocalizedText;
  windowNote: LearningLocalizedText;
  misconception: LearningLocalizedText;
};

export type LlmSlidingWindowWorkedExampleContent =
  | {
      view: 'chunk';
      lead: LearningLocalizedText;
      corpus: number[];
      chunk: number[];
      contextLength: number;
      stride: number;
      inputContract: LearningLocalizedText;
      outputContract: LearningLocalizedText;
      misconception: LearningLocalizedText;
    }
  | {
      view: 'shift';
      lead: LearningLocalizedText;
      input: number[];
      target: number[];
      invariant: string;
      misconception: LearningLocalizedText;
    }
  | {
      view: 'stride';
      lead: LearningLocalizedText;
      corpusLength: number;
      contextLength: number;
      stride: number;
      starts: number[];
      samples: Array<{ input: number[]; target: number[] }>;
      invalidStart: number;
      explanation: LearningLocalizedText;
      misconception: LearningLocalizedText;
    }
  | {
      view: 'batch';
      lead: LearningLocalizedText;
      inputs: number[][];
      targets: number[][];
      batchSize: number;
      contextLength: number;
      explanation: LearningLocalizedText;
      misconception: LearningLocalizedText;
    }
  | {
      view: 'leakage';
      lead: LearningLocalizedText;
      wrong: LearningLocalizedText[];
      right: LearningLocalizedText[];
      explanation: LearningLocalizedText;
      misconception: LearningLocalizedText;
    };

export type LlmEmbeddingPipelineVisualContent = {
  view: 'lookup' | 'batch' | 'position' | 'addition' | 'audit';
  layout?: 'filter-pipeline' | 'mixture-board' | 'scale-dashboard' | 'scale-risks';
  image?: 'common-crawl-pipeline' | 'filtering-pipeline' | 'scale-risks';
  lead: LearningLocalizedText;
  scaleNote?: LearningLocalizedText;
  code: string[];
  output?: string[];
  steps?: Array<{
    label: LearningLocalizedText;
    shape: string;
    detail: LearningLocalizedText;
    examples?: LearningLocalizedText[];
    beforeCount?: number;
    afterCount?: number;
  }>;
  comparisons?: Array<{
    title: string;
    shape: string;
    href?: string;
    detail: LearningLocalizedText;
  }>;
  takeaway?: LearningLocalizedText;
  misconception?: LearningLocalizedText;
};

export type LlmTokenizerMergeTrainingContent = {
  example: string;
  merges: Array<{ sourceIndexes: number[]; result: string }>;
  initialTokens: string[];
  result: LearningLocalizedText;
  playgroundUrl: string;
};

export type LlmBpeFallbackContent = {
  lead: LearningLocalizedText;
  examples: Array<{
    source: string;
    tokens: string[];
    explanation: LearningLocalizedText;
  }>;
  fallback: LearningLocalizedText;
  misconception: LearningLocalizedText;
};

export type LlmTokenizerSequenceLengthContent = {
  characterTokens: string[];
  subwordTokens: string[];
  characterCount: string;
  subwordCount: string;
  takeaway: LearningLocalizedText;
};

export type LlmTokenizerRegexWalkthroughContent = {
  lead: LearningLocalizedText;
  diagram?: { inputText: string; outputLabel: LearningLocalizedText; tokens: string[] };
  code: string[];
  output: string[];
  takeaway: LearningLocalizedText;
};

export type LlmProbabilityDefinitionContent = {
  title: LearningLocalizedText;
  definition: LearningLocalizedText;
  formula: string;
  examples: Array<{ formula: string; explanation: LearningLocalizedText }>;
};

export type LlmPerplexitySequenceExampleContent = {
  brief: LearningLocalizedText;
  contrast: Array<{ label: LearningLocalizedText; role: LearningLocalizedText; bestValue: string }>;
  note: LearningLocalizedText;
  formula: string;
  transition: LearningLocalizedText;
  walkthroughFormula: { left: string; mutedMiddle: string; right: string };
  label: LearningLocalizedText;
  tokens: string[];
  takeaway: LearningLocalizedText;
};

export type LlmPerplexityInterpretationContent = {
  lead: LearningLocalizedText;
  calculator: {
    title: LearningLocalizedText;
    groundTruthLabel: LearningLocalizedText;
    totalLabel: LearningLocalizedText;
    addTokenLabel: LearningLocalizedText;
    presets: Array<{
      id: string;
      label: LearningLocalizedText;
      groundTruthIndex: number;
      candidates: Array<{ token: string; probability: number }>;
    }>;
  };
  trend: {
    startYear: string;
    startValue: string;
    endYear: string;
    endValue: string;
    explanation: LearningLocalizedText;
    reference: { label: string; href: string };
  };
};

export type LlmPerplexityGoodRangeContent = {
  view: 'factors';
  lead: LearningLocalizedText;
  factors: Array<{
    id: 'data' | 'tokenizer' | 'language' | 'evaluation';
    title: LearningLocalizedText;
    description: LearningLocalizedText;
  }>;
  reasoningExample: {
    title: LearningLocalizedText;
    facts: [LearningLocalizedText, LearningLocalizedText];
    question: LearningLocalizedText;
    answer: LearningLocalizedText;
    explanation: LearningLocalizedText;
  };
} | {
  view: 'ranges';
  lead: LearningLocalizedText;
  ranges: Array<{
    range: string;
    label: LearningLocalizedText;
    description: LearningLocalizedText;
    tone: 'strong' | 'acceptable' | 'warning';
  }>;
  takeaway: LearningLocalizedText;
  currentRole: LearningLocalizedText;
};

export type LlmBenchmarkLikelihoodContent = {
  lead: LearningLocalizedText;
  benchmark: { name: string; description: LearningLocalizedText };
  labels: {
    question: LearningLocalizedText;
    likelihood: LearningLocalizedText;
    result: LearningLocalizedText;
  };
  question: LearningLocalizedText;
  answers: Array<{
    id: string;
    text: LearningLocalizedText;
    score: number;
  }>;
  formula: string;
  contamination: { title: LearningLocalizedText; body: LearningLocalizedText };
};

export type LlmHuggingFaceBenchmarksContent = {
  lead: {
    before: LearningLocalizedText;
    highlight: LearningLocalizedText;
  };
  brief: LearningLocalizedText;
  points: Array<{
    id: 'discover' | 'inspect' | 'compare';
    title: LearningLocalizedText;
    description: LearningLocalizedText;
  }>;
  image: {
    src: string;
    alt: LearningLocalizedText;
  };
  cta: { label: LearningLocalizedText; href: string };
  resourcesLabel: LearningLocalizedText;
  resources: Array<{
    id: 'helm' | 'open-llm-leaderboard';
    name: string;
    description: LearningLocalizedText;
    ctaLabel: LearningLocalizedText;
    href: string;
  }>;
};

export type LlmPostTrainingEvaluationContent = {
  lead: LearningLocalizedText;
  methods: Array<{
    id: 'human' | 'judge';
    title: LearningLocalizedText;
    description: LearningLocalizedText;
  }>;
  next: LearningLocalizedText;
};

export type LlmAutoregressiveDefinitionContent = {
  title: LearningLocalizedText;
  leadSubject: LearningLocalizedText;
  leadMiddle: LearningLocalizedText;
  leadEmphasis: LearningLocalizedText;
  formula: string;
  exampleLead: LearningLocalizedText;
  exampleSteps: string[];
  resultLead: LearningLocalizedText;
  resultFormula: string;
  note: LearningLocalizedText;
};

export type LlmArInferencePipelineContent = {
  title: LearningLocalizedText;
  body: LearningLocalizedText;
  steps: Array<{ label: LearningLocalizedText; description: LearningLocalizedText }>;
  inputText: string;
  tokens: string[];
  tokenIds: number[];
  modelLabel: LearningLocalizedText;
  candidates: Array<{ token: string; tokenId: number; probability: number }>;
  sampledToken: string;
  sampledTokenId: number;
  outputText: string;
};

export type LlmVocabularyOutputVectorContent = {
  lead: LearningLocalizedText;
  corpusDefinition: LearningLocalizedText;
  corpusLabel: LearningLocalizedText;
  vocabularyLabel: LearningLocalizedText;
  vectorLabel: LearningLocalizedText;
  entries: Array<{ token: string; tokenId: number; probability: number }>;
  note: LearningLocalizedText;
};

export type LlmOutputProjectionContent = {
  title: LearningLocalizedText;
  lead: LearningLocalizedText;
  leadFormula?: string;
  stages: Array<{ label: LearningLocalizedText; formula: string; description?: LearningLocalizedText }>;
  contextTokens: string[];
  probabilities: Array<{ token: string; probability: number }>;
};

export type LlmOutputProjectionFocus = 'overview' | 'context-input' | 'context-vector' | 'linear' | 'logits' | 'distribution';

export type LlmNextTokenLossContent = {
  title: LearningLocalizedText;
  lead: LearningLocalizedText;
  targetHint: LearningLocalizedText;
  predictionLabel: LearningLocalizedText;
  targetLabel: LearningLocalizedText;
  optimizationLabel: LearningLocalizedText;
  increaseLabel: LearningLocalizedText;
  decreaseLabel: LearningLocalizedText;
  sequence: string[];
  vocabulary: string[];
  distributions: number[][];
  updatedDistributions: number[][];
  formula: string;
  note: LearningLocalizedText;
};

export type LlmLossHandCalculationContent = {
  title: LearningLocalizedText;
  lead: LearningLocalizedText;
  conclusion: LearningLocalizedText;
  targetToken: string;
  sentence: string[];
  targetIndex: number;
  otherTokens: Array<{ token: string; weight: number }>;
};

export type LlmLossDerivationContent = {
  title?: LearningLocalizedText;
  lead?: LearningLocalizedText;
  steps: Array<{
    label: LearningLocalizedText;
    formula: string;
    transitionBefore?: LearningLocalizedText;
    formulaCheckpointAfter?: { before: string; focus: string; after: string };
    exponentComparison?: { length: number };
    explanation?: LearningLocalizedText;
    formulaBeforeSign?: string;
    formulaAfterSign?: string;
    toggleLabel?: LearningLocalizedText;
    lengthNormalizationExample?: {
      rows: Array<{ label: LearningLocalizedText; productFormula: string; normalizedFormula: string }>;
      limitation: LearningLocalizedText;
      normalizationFormula: string;
    };
  }>;
  conclusion?: LearningLocalizedText;
};
