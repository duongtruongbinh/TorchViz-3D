import type { LearningDomain, LearningLesson, LearningTrack } from '../types.ts';
import { buildPlaceholderContent, type LearningChapterSeed } from './seed.ts';

const chapters: LearningChapterSeed[] = [
  {
    id: 'text-preprocessing',
    textKey: 'textPreprocessing',
    lessonIds: [
      'tokenization-basics',
      'text-normalization',
      'stopword-removal',
      'stemming-vs-lemmatization',
      'sentence-segmentation',
      'special-token-handling',
      'unicode-encoding-issues',
    ],
  },
  {
    id: 'classical-text-representation',
    textKey: 'classicalTextRepresentation',
    lessonIds: [
      'bag-of-words',
      'tf-idf',
      'n-grams',
      'one-hot-encoding',
      'sparse-vs-dense-representations',
    ],
  },
  {
    id: 'word-embeddings',
    textKey: 'wordEmbeddings',
    lessonIds: [
      'why-embeddings',
      'word2vec-cbow-skipgram',
      'glove-embeddings',
      'fasttext-subword-embeddings',
      'embedding-cosine-similarity',
      'embedding-analogy-tasks',
      'static-vs-contextual-embeddings',
    ],
  },
  {
    id: 'subword-tokenization-modern',
    textKey: 'subwordTokenization',
    lessonIds: [
      'byte-pair-encoding',
      'wordpiece-tokenization',
      'sentencepiece-tokenization',
      'special-tokens-modern',
      'token-ids',
      'vocabulary-size-tradeoffs',
    ],
  },
  {
    id: 'transformer-architecture',
    textKey: 'transformerArchitecture',
    lessonIds: [
      'transformer-rnn-replacement',
      {
        id: 'self-attention',
        title: { en: 'Attention shape', vi: 'Shape của attention' },
        theory: [
          {
            en: 'Attention practice focuses on preserving the batch and token axes while projecting feature dimensions.',
            vi: 'Bài attention tập trung vào việc giữ trục batch và token trong khi chiếu đổi chiều đặc trưng.',
          },
          {
            en: 'The core habit is to track which axes stay stable as query, key, and value projections move through attention.',
            vi: 'Thói quen chính là theo dõi trục nào giữ ổn định khi query, key và value projection đi qua attention.',
          },
        ],
      },
      'query-key-value',
      'attention-score-formula',
      'multi-head-attention',
      'positional-encoding',
      'feed-forward-sublayer',
      'layernorm-residual-connections',
      'encoder-only-bert',
      'decoder-only-gpt',
      'encoder-decoder-t5',
      'causal-masking',
    ],
  },
  {
    id: 'language-modeling',
    textKey: 'languageModeling',
    lessonIds: [
      'next-token-probability',
      'autoregressive-language-modeling',
      'masked-language-modeling',
      'perplexity-evaluation',
      'sampling-temperature-topk-topp',
      'generation-decoding-strategies',
    ],
  },
  {
    id: 'key-pretrained-models',
    textKey: 'keyPretrainedModels',
    lessonIds: [
      'bert-model',
      'gpt-4-model',
      'claude-models',
      'gemini-model',
      't5-model',
      'llama-3-model',
      'mistral-7b-model',
      'qwen-2-5-model',
    ],
  },
  {
    id: 'nlp-evaluation-metrics',
    textKey: 'nlpEvaluationMetrics',
    lessonIds: [
      'classification-metrics',
      'bleu-metric',
      'rouge-metric',
      'perplexity-metric',
      'bertscore-metric',
      'human-evaluation',
      'exact-match-metric',
    ],
  },
  {
    id: 'key-python-libraries',
    textKey: 'keyPythonLibraries',
    lessonIds: [
      'nltk-library',
      'spacy-library',
      'huggingface-transformers',
      'huggingface-datasets',
      'sentence-transformers-library',
      'tiktoken-library',
      'evaluate-library',
    ],
  },
];

const nlpContent = buildPlaceholderContent({
  domainId: 'nlp',
  domainTextKey: 'nlp',
  domainStatus: 'active',
  chapters,
  sectionKinds: ['theory', 'code'],
});

export const nlpDomain: LearningDomain = nlpContent.domain;
export const nlpTracks: LearningTrack[] = nlpContent.tracks;
export const nlpLessons: LearningLesson[] = nlpContent.lessons.map((lesson) => (
  lesson.id === 'self-attention'
    ? {
      ...lesson,
      sections: [
        { kind: 'theory', refId: 'self-attention' },
        { kind: 'practice', refId: 'attention-shape-output' },
      ],
      practice: [
        {
          family: 'tensor',
          id: 'attention-shape-output',
          kind: 'shape',
          exerciseId: 'attention-shape',
          targetOperation: 'Attention',
          approval: { status: 'approved', implementedBy: 'nmkhiem' },
          reuseStatus: 'embedded',
        },
      ],
    }
    : lesson
));
