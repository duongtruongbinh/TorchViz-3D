import type { LearningTableOfContents, LearningTocTrackSeed } from '../../../core/learning/types.ts';

const chapters: LearningTocTrackSeed[] = [
  {
    id: 'deep-learning-history',
    text: {
      title: {
        en: '0. History & Landscape of Deep Learning',
        vi: '0. Lịch sử & Bức tranh Toàn cảnh Deep Learning',
      },
      description: {
        en: 'How Deep Learning differs from traditional ML via automatic feature extraction, key historical breakthroughs, and real-world applications from smartphones to supercomputers.',
        vi: 'Khác biệt giữa Deep Learning và Machine Learning truyền thống qua trích xuất đặc trưng tự động, các cột mốc lịch sử và ứng dụng từ điện thoại đến siêu máy tính.',
      },
    },
    lessonIds: [
      {
        id: 'why-deep-learning',
        title: {
          en: 'Why Deep Learning?',
          vi: 'Vì sao Học Deep Learning?',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'deep-learning-applications-landscape',
        title: {
          en: 'Real-World Applications',
          vi: 'Ứng dụng Thực tế',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'deep-learning-vs-traditional-ml',
        title: {
          en: 'DL vs Traditional ML',
          vi: 'DL vs ML Truyền thống',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'deep-learning-history-timeline',
        title: {
          en: 'History of Deep Learning',
          vi: 'Lịch sử Deep Learning',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'deep-learning-pioneers',
        title: {
          en: 'Pioneers of Deep Learning',
          vi: 'Những Người Đặt Nền móng',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'deep-learning-history-quiz',
        title: { en: 'Quiz', vi: 'Quiz' },
        status: 'available',
        contentStatus: 'published',
      },
    ],
  },
  {
    id: 'neural-network',
    text: {
      title: { en: '1.1 Neural Network', vi: '1.1 Neural Network' },
      description: {
        en: 'Perceptrons, MLPs, activation functions, loss functions, backpropagation, and gradient-based optimization.',
        vi: 'Perceptron, MLP, hàm kích hoạt, hàm mất mát, backpropagation và tối ưu hóa dựa trên gradient.',
      },
    },
    lessonIds: [
      {
        id: 'perceptron-and-mlp',
        title: { en: 'Perceptron and MLP', vi: 'Perceptron và MLP' },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'fully-connected-layers',
        title: { en: 'Fully Connected Layers', vi: 'Tầng Fully Connected (Linear)' },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'mlp-and-deep-architectures',
        title: {
          en: 'MLP (Part 2): Neural Nets & Network Depth',
          vi: 'MLP (Phần 2): Neural Net & Độ sâu của Mạng',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'neural-network-basics-quiz',
        title: { en: 'Quiz', vi: 'Quiz' },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'activation-functions',
        title: {
          en: 'Activation Functions',
          vi: 'Hàm Kích hoạt (Activation Functions)',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'loss-functions-and-forward-pass',
        title: {
          en: 'Loss Functions & Forward Pass',
          vi: 'Hàm Mất mát & Forward Pass (Loss Functions)',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'backpropagation-and-chain-rule',
        title: {
          en: 'Backpropagation & Chain Rule',
          vi: 'Backpropagation & Chain Rule',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'optimization-and-gradient-descent',
        title: {
          en: 'Optimization & Gradient Descent',
          vi: 'Tối ưu hóa & Gradient Descent',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'mlp-activation-code-lab',
        title: {
          en: 'Code Lab',
          vi: 'Code Lab',
        },
        status: 'available',
        contentStatus: 'published',
      },
    ],
  },
  {
    id: 'convolutional-neural-networks',
    text: {
      title: { en: '1.2 Convolutional Neural Networks (CNNs)', vi: '1.2 Convolutional Neural Networks (CNNs)' },
      description: {
        en: 'Convolutions, padding, stride, receptive fields, pooling, classic CNN architectures, U-Net segmentation, and hands-on PyTorch implementation.',
        vi: 'Phép tích chập, padding, stride, receptive field, pooling, các kiến trúc CNN kinh điển, phân đoạn ảnh với U-Net và thực hành PyTorch.',
      },
    },
    lessonIds: [
      {
        id: 'convolution-operation',
        title: {
          en: 'Why CNNs & The Convolution Operation',
          vi: 'Tại sao cần CNN & Phép Tích chập (Convolution)',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'padding-stride-receptive-field',
        title: {
          en: 'Padding, Stride & Receptive Field',
          vi: 'Padding, Stride & Receptive Field',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'pooling-and-feature-maps',
        title: {
          en: 'Pooling, Batch Norm & Parameter Counting',
          vi: 'Pooling, Batch Norm & Đếm Tham số CNN',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'cnn-foundations-quiz',
        title: { en: 'Quiz', vi: 'Quiz' },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'classic-cnn-architectures',
        title: {
          en: 'Classic CNNs (Part 1): LeNet-5, AlexNet & VGG-16',
          vi: 'Các Kiến trúc CNN (Phần 1): LeNet-5, AlexNet & VGG-16',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'modern-cnn-inception-resnet',
        title: {
          en: 'Classic CNNs (Part 2): Inception & ResNet',
          vi: 'Các Kiến trúc CNN (Phần 2): Inception & ResNet',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'cnn-architectures-quiz',
        title: { en: 'Quiz', vi: 'Quiz' },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'unet-semantic-segmentation',
        title: {
          en: 'U-Net & Semantic Segmentation',
          vi: 'Kiến trúc U-Net & Semantic Segmentation',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'unet-and-segmentation-quiz',
        title: { en: 'Quiz', vi: 'Quiz' },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'cnn-code-lab',
        title: { en: 'Code Lab', vi: 'Code Lab' },
        status: 'available',
        contentStatus: 'published',
      },
    ],
  },
  {
    id: 'recurrent-neural-networks',
    text: {
      title: { en: '1.3 Recurrent Neural Networks (RNNs)', vi: '1.3 Recurrent Neural Networks (RNNs)' },
      description: {
        en: 'Sequence modeling, backpropagation through time, vanishing gradients, LSTM, GRU, bidirectional RNNs, and seq2seq.',
        vi: 'Mô hình hóa chuỗi, backpropagation theo thời gian, vanishing gradient, LSTM, GRU, RNN hai chiều và seq2seq.',
      },
    },
    lessonIds: [
      {
        id: 'sequence-modeling-vanilla-rnn',
        title: { en: 'Sequence Modeling & Vanilla RNN', vi: 'Mô hình hóa chuỗi & Vanilla RNN' },
      },
      {
        id: 'bptt-and-vanishing-gradients',
        title: { en: 'BPTT and Vanishing Gradients', vi: 'BPTT và Vanishing Gradients' },
      },
      {
        id: 'lstm-gated-memory',
        title: { en: 'LSTM Gated Memory', vi: 'Bộ nhớ cổng LSTM' },
      },
      {
        id: 'gru-and-bidirectional-rnns',
        title: { en: 'GRU and Bidirectional RNNs', vi: 'GRU và RNN hai chiều' },
      },
      {
        id: 'seq2seq-encoder-decoder',
        title: { en: 'Seq2Seq Encoder-Decoder', vi: 'Seq2Seq Encoder-Decoder' },
      },
    ],
  },
  {
    id: 'deep-learning-tips',
    text: {
      title: { en: '1.4 Deep Learning Tips', vi: '1.4 Deep Learning Tips' },
      description: {
        en: 'Weight initialization, normalization, regularization, residual connections, gradient clipping, and training diagnostics.',
        vi: 'Khởi tạo trọng số, normalization, regularization, residual connection, gradient clipping và chẩn đoán quá trình huấn luyện.',
      },
    },
    lessonIds: [
      'weight-initialization',
      'batch-and-layer-normalization',
      'regularization-and-dropout',
      'residual-connections-and-clipping',
      {
        id: 'lr-schedules-and-diagnostics',
        title: { en: 'LR Schedules and Diagnostics', vi: 'LR Schedules và chẩn đoán' },
      },
    ],
  },
  {
    id: 'self-attention-and-transformer',
    text: {
      title: { en: '1.5 Self-Attention and Transformer', vi: '1.5 Self-Attention and Transformer' },
      description: {
        en: 'Soft alignment, scaled dot-product self-attention, multi-head attention, positional encoding, and Transformer architectures.',
        vi: 'Soft alignment, scaled dot-product self-attention, multi-head attention, positional encoding và kiến trúc Transformer.',
      },
    },
    lessonIds: [
      'attention-soft-alignment',
      'scaled-dot-product-self-attention',
      'multi-head-attention-positional-encoding',
      'transformer-architecture',
      'modern-transformer-variants',
    ],
  },
  {
    id: 'autoencoders-vae-unet',
    text: {
      title: { en: '1.6 Autoencoders, VAE & U-Net', vi: '1.6 Autoencoders, VAE & U-Net' },
      description: {
        en: 'Latent bottlenecks, denoising and sparse autoencoders, variational autoencoders (ELBO), reparameterization, and U-Net skip connections.',
        vi: 'Nút thắt tiềm ẩn, denoising/sparse autoencoder, variational autoencoder (ELBO), reparameterization và U-Net skip connection.',
      },
    },
    lessonIds: [
      'autoencoder-and-latent-bottleneck',
      'denoising-and-sparse-autoencoders',
      {
        id: 'variational-autoencoder-elbo',
        title: { en: 'Variational Autoencoder (VAE) & ELBO', vi: 'Variational Autoencoder (VAE) & ELBO' },
      },
      'reparameterization-trick-latent-space',
      {
        id: 'unet-architecture-skip-connections',
        title: { en: 'U-Net Architecture & Skip Connections', vi: 'Kiến trúc U-Net & Skip Connections' },
      },
    ],
  },
  {
    id: 'gans-and-diffusion-models',
    text: {
      title: {
        en: '1.7 Generative Adversarial Networks (GANs) and Diffusion Models (DMs)',
        vi: '1.7 Generative Adversarial Networks (GANs) and Diffusion Models (DMs)',
      },
      description: {
        en: 'Adversarial training, generator-discriminator dynamics, WGAN stability, forward/reverse diffusion, DDPM, and latent diffusion.',
        vi: 'Huấn luyện đối kháng, động lực generator-discriminator, ổn định WGAN, quá trình diffusion thuận/nghịch, DDPM và latent diffusion.',
      },
    },
    lessonIds: [
      'generative-modeling-overview',
      {
        id: 'gans-generator-discriminator',
        title: { en: 'GANs: Generator & Discriminator', vi: 'GANs: Generator & Discriminator' },
      },
      {
        id: 'gan-training-stability-wgan',
        title: { en: 'GAN Training Stability & WGAN', vi: 'Ổn định huấn luyện GAN & WGAN' },
      },
      'diffusion-forward-reverse-process',
      {
        id: 'ddpm-and-latent-diffusion',
        title: { en: 'DDPM and Latent Diffusion', vi: 'DDPM và Latent Diffusion' },
      },
    ],
  },
  {
    id: 'neural-network-compression',
    text: {
      title: { en: '1.8 Neural Network Compression', vi: '1.8 Neural Network Compression' },
      description: {
        en: 'Pruning, post-training and quantization-aware quantization, knowledge distillation, low-rank factorization, and compact architectures.',
        vi: 'Pruning, lượng tử hóa PTQ/QAT, knowledge distillation, phân rã hạng thấp và các kiến trúc gọn nhẹ.',
      },
    },
    lessonIds: [
      'why-model-compression-matters',
      'neural-network-pruning',
      {
        id: 'quantization-ptq-qat',
        title: { en: 'Quantization: PTQ & QAT', vi: 'Lượng tử hóa: PTQ & QAT' },
      },
      'knowledge-distillation',
      'low-rank-and-compact-architectures',
    ],
  },
  {
    id: 'transfer-learning',
    text: {
      title: { en: '1.9 Transfer Learning', vi: '1.9 Transfer Learning' },
      description: {
        en: 'Pretraining, feature extraction vs fine-tuning, layer freezing, parameter-efficient fine-tuning, and foundation models.',
        vi: 'Pretraining, feature extraction vs fine-tuning, đóng băng layer, tinh chỉnh hiệu quả tham số (PEFT) và foundation models.',
      },
    },
    lessonIds: [
      'pretraining-representation-reuse',
      'feature-extraction-vs-fine-tuning',
      {
        id: 'freezing-and-discriminative-lr',
        title: { en: 'Layer Freezing & Discriminative LR', vi: 'Đóng băng layer & Discriminative LR' },
      },
      'parameter-efficient-fine-tuning',
      'foundation-models-ecosystem',
    ],
  },
];

export const learningTableOfContents = {
  id: 'deep-learning',
  text: {
    title: { en: 'Deep Learning', vi: 'Deep Learning' },
    description: {
      en: 'Core neural network architectures and training practices: MLPs, CNNs, RNNs, training tips, Transformers, Autoencoders/VAE/U-Net, GANs & Diffusion, compression, and transfer learning.',
      vi: 'Các kiến trúc mạng neural và kỹ thuật huấn luyện cốt lõi: MLP, CNN, RNN, mẹo huấn luyện, Transformer, Autoencoder/VAE/U-Net, GAN & Diffusion, nén mô hình và transfer learning.',
    },
  },
  status: 'partial',
  fallbackLocales: ['vi'],
  chapters,
  sectionKinds: ['theory', 'code'],
} satisfies LearningTableOfContents;
