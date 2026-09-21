import type { LearningTableOfContents, LearningTocTrackSeed } from '../../../core/learning/types.ts';

const chapters: LearningTocTrackSeed[] = [
  {
    id: 'text-preprocessing',
    text: {
      title: { en: "1.1 Text Preprocessing", vi: "1.1 Text Preprocessing" },
      description: { en: "Tokenization, normalization, stopwords, stemming, sentence boundaries, special tokens, and Unicode.", vi: "Tokenization, normalization, stopword, stemming, tách câu, special token và Unicode." },
    },
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
    text: {
      title: { en: "1.2 Classical Text Representation", vi: "1.2 Classical Text Representation" },
      description: { en: "Bag of Words, TF-IDF, n-grams, one-hot encoding, and sparse versus dense representations.", vi: "Bag of Words, TF-IDF, n-gram, one-hot encoding và biểu diễn sparse/dense." },
    },
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
    text: {
      title: { en: "1.3 Word Embeddings", vi: "1.3 Word Embeddings" },
      description: { en: "Dense semantic vectors, Word2Vec, GloVe, FastText, similarity, analogies, and contextual embeddings.", vi: "Vector ngữ nghĩa dense, Word2Vec, GloVe, FastText, similarity, analogy và contextual embedding." },
    },
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
    text: {
      title: { en: "1.4 Subword Tokenization", vi: "1.4 Subword Tokenization" },
      description: { en: "BPE, WordPiece, SentencePiece, special tokens, token IDs, and vocabulary tradeoffs.", vi: "BPE, WordPiece, SentencePiece, special token, token ID và tradeoff vocabulary." },
    },
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
    text: {
      title: { en: "1.5 Transformer Architecture", vi: "1.5 Transformer Architecture" },
      description: { en: "Self-attention, QKV, multi-head attention, position, feed-forward blocks, normalization, and masks.", vi: "Self-attention, QKV, multi-head attention, vị trí, feed-forward, normalization và mask." },
    },
    lessonIds: [
      'transformer-rnn-replacement',
      'self-attention',
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
    text: {
      title: { en: "1.6 Language Modeling", vi: "1.6 Language Modeling" },
      description: { en: "Next-token probabilities, autoregressive and masked language modeling, perplexity, and decoding.", vi: "Xác suất next-token, autoregressive/masked language modeling, perplexity và decoding." },
    },
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
    text: {
      title: { en: "1.7 Key Pretrained Models", vi: "1.7 Key Pretrained Models" },
      description: { en: "BERT, GPT, Claude, Gemini, T5, LLaMA, Mistral, and Qwen model families.", vi: "Các họ model BERT, GPT, Claude, Gemini, T5, LLaMA, Mistral và Qwen." },
    },
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
    text: {
      title: { en: "1.8 NLP Evaluation Metrics", vi: "1.8 NLP Evaluation Metrics" },
      description: { en: "Classification metrics, BLEU, ROUGE, perplexity, BERTScore, human evaluation, and exact match.", vi: "Metric phân loại, BLEU, ROUGE, perplexity, BERTScore, human evaluation và exact match." },
    },
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
    text: {
      title: { en: "1.9 Key Python Libraries", vi: "1.9 Key Python Libraries" },
      description: { en: "NLTK, spaCy, HuggingFace transformers and datasets, sentence-transformers, tiktoken, and evaluate.", vi: "NLTK, spaCy, HuggingFace transformers/datasets, sentence-transformers, tiktoken và evaluate." },
    },
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

export const learningTableOfContents = {
  id: 'nlp',
  text: {
    title: { en: "NLP", vi: "NLP" },
    description: { en: "Build the language-model foundation before LLMs: text cleaning, tokenization, sparse and dense representations, embeddings, sequence shapes, attention, transformer blocks, decoding, and evaluation.", vi: "Xây nền tảng language model trước LLM: làm sạch text, tokenization, biểu diễn sparse/dense, embedding, shape sequence, attention, transformer block, decoding và evaluation." },
  },
  status: 'placeholder',
  chapters,
  sectionKinds: ['theory', 'code'],
  routeAliases: [{
    fromLessonId: 'attention-shape',
    toTrackId: 'transformer-architecture',
    toLessonId: 'self-attention',
  }],
} satisfies LearningTableOfContents;
