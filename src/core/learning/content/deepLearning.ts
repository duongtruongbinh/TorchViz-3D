import type { LearningDomain, LearningLesson, LearningTrack } from '../types.ts';
import { buildPlaceholderContent, type LearningChapterSeed } from './seed.ts';

const chapters: LearningChapterSeed[] = [
  {
    id: 'neural-network-fundamentals',
    textKey: 'neuralNetworkFundamentals',
    lessonIds: [
      'neuron-perceptron-mlp',
      'activation-functions',
      'forward-pass-information-flow',
      'backpropagation-gradient-flow',
      'weight-initialization',
      'vanishing-exploding-gradients',
    ],
  },
  {
    id: 'training-techniques',
    textKey: 'trainingTechniques',
    lessonIds: [
      'batch-normalization',
      'layer-normalization',
      'dropout-stochastic-regularization',
      'residual-connections',
      'gradient-clipping',
    ],
  },
  {
    id: 'convolutional-neural-networks',
    textKey: 'convolutionalNeuralNetworks',
    lessonIds: [
      'convolution-operation',
      'pooling-layers',
      'cnn-architectures',
      'transfer-learning-cnns',
      'cnn-applications',
    ],
  },
  {
    id: 'recurrent-neural-networks',
    textKey: 'recurrentNeuralNetworks',
    lessonIds: [
      'rnn-sequence-processing',
      'hidden-state-memory',
      'vanishing-gradient-rnns',
      'lstm-gates',
      'gru-alternative',
      'bidirectional-rnns',
      'seq2seq-encoder-decoder',
      'beam-search-decoding',
    ],
  },
  {
    id: 'attention-mechanism',
    textKey: 'attentionMechanism',
    lessonIds: [
      'attention-soft-alignment',
      'additive-multiplicative-attention',
      'bahdanau-attention',
      'attention-bottleneck-solution',
    ],
  },
  {
    id: 'pytorch-mastery',
    textKey: 'pytorchMastery',
    lessonIds: [
      'pytorch-tensors-gpu',
      'torch-nn-module',
      'torch-optim',
      'custom-datasets',
      'dataloader-batching-shuffling',
      'training-loop',
      'eval-vs-train-mode',
      'saving-loading-pytorch',
      'moving-to-gpu',
      'gradient-computation',
      'custom-loss-functions',
      'learning-rate-schedulers',
    ],
  },
  {
    id: 'transfer-learning',
    textKey: 'transferLearning',
    lessonIds: [
      'pretraining-why-it-matters',
      'fine-tuning-vs-feature-extraction',
      'freezing-layers',
      'imagenet-moment-nlp',
      'huggingface-pretrained-models',
    ],
  },
];

const deepLearningContent = buildPlaceholderContent({
  domainId: 'deep-learning',
  domainTextKey: 'deepLearning',
  domainStatus: 'active',
  chapters,
  sectionKinds: ['theory', 'code'],
});

export const deepLearningDomain: LearningDomain = deepLearningContent.domain;
export const deepLearningTracks: LearningTrack[] = deepLearningContent.tracks;
export const deepLearningLessons: LearningLesson[] = deepLearningContent.lessons;
