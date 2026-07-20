import type { LearningLocalizedText } from '../../../../core/learning/types';

export type LlmTrainingComponentsContent = {
  title: LearningLocalizedText;
  body: LearningLocalizedText;
  cards: Array<{ title: LearningLocalizedText; description: LearningLocalizedText }>;
};

export type LlmAcademiaIndustryComparisonContent = Omit<LlmTrainingComponentsContent, 'title' | 'body'> & {
  academia: LearningLocalizedText;
  industry: LearningLocalizedText;
};

export type LlmTokenizerMemoryContent = {
  cards: Array<{
    id: 'flexible' | 'robust' | 'efficient';
    cue: LearningLocalizedText;
    title: LearningLocalizedText;
    description: LearningLocalizedText;
    example: string;
  }>;
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

export type LlmTokenizerMergeTrainingContent = {
  example: string;
  merges: Array<{ sourceIndexes: number[]; result: string }>;
  initialTokens: string[];
  result: LearningLocalizedText;
  playgroundUrl: string;
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
  title: LearningLocalizedText;
  lead?: LearningLocalizedText;
  steps: Array<{ label: LearningLocalizedText; formula: string; explanation: LearningLocalizedText }>;
  conclusion?: LearningLocalizedText;
};
