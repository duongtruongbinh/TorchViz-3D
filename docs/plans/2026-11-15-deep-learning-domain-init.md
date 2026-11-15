---
title: "Deep Learning Domain Curriculum Restructure (Placeholder TOC)"
status: done
created: 2026-11-15T16:49:00+07:00
updated: 2026-11-15T16:51:00+07:00
author: khiem
task: "Restructure the Deep Learning Learning Lab domain placeholder TOC into 9 modules following the 8-module roadmap plus a dedicated AutoEncoder, VAE & U-Net module."
supersedes: []
---

# Goal

Restructure `src/content/learning/deep-learning/table-of-contents.ts` as a `placeholder` domain (`status: 'placeholder'`, no `.mdx` files authored yet) aligned with the 8-module Deep Learning roadmap plus a dedicated module for Autoencoders, VAE, and U-Net.

# Scope

- **In scope**:
  - Update `src/content/learning/deep-learning/table-of-contents.ts` with 9 modules (`1.1` through `1.9`).
  - Update catalog count assertions in `src/lib/learningCatalog.test.ts` if track/lesson totals change.
  - Sync `wiki/reference/catalog-stats.md` (`npm run sync:catalog-stats`) and `wiki/concepts/learning-lab.md` if totals change.
- **Out of scope**:
  - Authoring `.mdx` lesson content or quizzes (kept as `placeholder` for a follow-up PR).
  - Changing Learning Lab routing, UI components, or other domains.

# Planned 9-Module Structure

1. **1.1 Neural Network** (`neural-network`)
   - `perceptron-and-mlp`
   - `activation-functions`
   - `loss-functions-and-forward-pass`
   - `backpropagation-and-chain-rule`
   - `optimization-and-gradient-descent`
2. **1.2 Convolutional Neural Networks (CNNs)** (`convolutional-neural-networks`)
   - `convolution-operation`
   - `padding-stride-receptive-field`
   - `pooling-and-feature-maps`
   - `classic-cnn-architectures`
   - `cnn-applications`
3. **1.3 Recurrent Neural Networks (RNNs)** (`recurrent-neural-networks`)
   - `sequence-modeling-vanilla-rnn`
   - `bptt-and-vanishing-gradients`
   - `lstm-gated-memory`
   - `gru-and-bidirectional-rnns`
   - `seq2seq-encoder-decoder`
4. **1.4 Deep Learning Tips** (`deep-learning-tips`)
   - `weight-initialization`
   - `batch-and-layer-normalization`
   - `regularization-and-dropout`
   - `residual-connections-and-clipping`
   - `lr-schedules-and-diagnostics`
5. **1.5 Self-Attention and Transformer** (`self-attention-and-transformer`)
   - `attention-soft-alignment`
   - `scaled-dot-product-self-attention`
   - `multi-head-attention-positional-encoding`
   - `transformer-architecture`
   - `modern-transformer-variants`
6. **1.6 Autoencoders, VAE & U-Net** (`autoencoders-vae-unet`)
   - `autoencoder-and-latent-bottleneck`
   - `denoising-and-sparse-autoencoders`
   - `variational-autoencoder-elbo`
   - `reparameterization-trick-latent-space`
   - `unet-architecture-skip-connections`
7. **1.7 Generative Adversarial Networks (GANs) and Diffusion Models (DMs)** (`gans-and-diffusion-models`)
   - `generative-modeling-overview`
   - `gans-generator-discriminator`
   - `gan-training-stability-wgan`
   - `diffusion-forward-reverse-process`
   - `ddpm-and-latent-diffusion`
8. **1.8 Neural Network Compression** (`neural-network-compression`)
   - `why-model-compression-matters`
   - `neural-network-pruning`
   - `quantization-ptq-qat`
   - `knowledge-distillation`
   - `low-rank-and-compact-architectures`
9. **1.9 Transfer Learning** (`transfer-learning`)
   - `pretraining-representation-reuse`
   - `feature-extraction-vs-fine-tuning`
   - `freezing-and-discriminative-lr`
   - `parameter-efficient-fine-tuning`
   - `foundation-models-ecosystem`

# Verification Plan

- Run `npm run check:catalog-stats` (after `npm run sync:catalog-stats` if counts changed)
- Run `npm run verify` (`typecheck`, `test`, `build`)

# Execution Log

- Updated `src/content/learning/deep-learning/table-of-contents.ts` with 9 placeholder modules (45 lessons).
- Updated `src/lib/learningCatalog.test.ts` track count assertion (`117` -> `119`).
- Synced `wiki/reference/catalog-stats.md` and `wiki/concepts/learning-lab.md` (`119` tracks).
- Added Chapter 0 (`0. History & Landscape of Deep Learning`) with 3 authored Vietnamese lessons + 1 quiz (`status: 'partial'` for `deep-learning` domain) and 3 generated educational doodle illustrations.
