import type { LearningTableOfContents, LearningTocTrackSeed } from '../../../core/learning/types.ts';

const chapters: LearningTocTrackSeed[] = [
  {
    id: 'neural-network-fundamentals',
    text: {
      title: { en: "1.1 Neural Network Fundamentals", vi: "1.1 Neural Network Fundamentals" },
      description: { en: "Neurons, activation, forward flow, gradients, initialization, and gradient stability.", vi: "Neuron, activation, forward flow, gradient, initialization và độ ổn định gradient." },
    },
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
    text: {
      title: { en: "1.2 Training Techniques", vi: "1.2 Training Techniques" },
      description: { en: "Normalization, dropout, residual connections, and clipping for stable training.", vi: "Normalization, dropout, residual connection và clipping để train ổn định." },
    },
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
    text: {
      title: { en: "1.3 Convolutional Neural Networks", vi: "1.3 Convolutional Neural Networks" },
      description: { en: "Convolutions, pooling, CNN architectures, transfer learning, and vision applications.", vi: "Convolution, pooling, kiến trúc CNN, transfer learning và ứng dụng vision." },
    },
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
    text: {
      title: { en: "1.4 Recurrent Neural Networks", vi: "1.4 Recurrent Neural Networks" },
      description: { en: "RNNs, hidden state, LSTM, GRU, bidirectionality, seq2seq, and decoding.", vi: "RNN, hidden state, LSTM, GRU, bidirectional, seq2seq và decoding." },
    },
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
    text: {
      title: { en: "1.5 Attention Mechanism", vi: "1.5 Attention Mechanism" },
      description: { en: "Pre-transformer attention as soft alignment for sequence models.", vi: "Attention trước transformer như soft alignment cho sequence models." },
    },
    lessonIds: [
      'attention-soft-alignment',
      'additive-multiplicative-attention',
      'bahdanau-attention',
      'attention-bottleneck-solution',
    ],
  },
  {
    id: 'pytorch-mastery',
    text: {
      title: { en: "1.6 PyTorch", vi: "1.6 PyTorch" },
      description: { en: "Tensors, modules, optimizers, datasets, loaders, training loops, GPU, and persistence.", vi: "Tensor, module, optimizer, dataset, loader, training loop, GPU và lưu/tải model." },
    },
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
    text: {
      title: { en: "1.7 Transfer Learning", vi: "1.7 Transfer Learning" },
      description: { en: "Pretraining, fine-tuning, feature extraction, freezing, and HuggingFace models.", vi: "Pretraining, fine-tuning, feature extraction, freezing và HuggingFace models." },
    },
    lessonIds: [
      'pretraining-why-it-matters',
      'fine-tuning-vs-feature-extraction',
      'freezing-layers',
      'imagenet-moment-nlp',
      'huggingface-pretrained-models',
    ],
  },
];

export const learningTableOfContents = {
  id: 'deep-learning',
  text: {
    title: { en: "Deep Learning", vi: "Deep Learning" },
    description: { en: "Understand how neural networks move tensors through layers: activations, gradients, normalization, residuals, CNNs, RNNs, attention, PyTorch modules, training loops, and transfer learning.", vi: "Hiểu cách neural network đưa tensor qua các layer: activation, gradient, normalization, residual, CNN, RNN, attention, PyTorch module, training loop và transfer learning." },
  },
  status: 'active',
  chapters,
  sectionKinds: ['theory', 'code'],
} satisfies LearningTableOfContents;
