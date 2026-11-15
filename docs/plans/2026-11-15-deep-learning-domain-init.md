---
title: "Deep Learning Domain Initialization (Chapters 0, 1.1, 1.2 & Light-Mode UI Primitives)"
status: done
created: 2026-11-15T16:49:00+07:00
updated: 2026-11-16T04:23:00+07:00
author: khiem
task: "Initialize the Deep Learning domain with a 10-track curriculum roadmap, author Vietnamese MDX lessons/quizzes/code labs for Chapters 0, 1.1, and 1.2 (MLP, CNN, classic/modern architectures, U-Net), and consolidate 18 interactive Light-Mode SVG diagrams."
supersedes: []
---

# Goal

Initialize the `deep-learning` domain in Learning Lab with a structured 10-track roadmap (`0` through `1.9`), fully author Chapters `0`, `1.1`, and `1.2` in Vietnamese (`.vi.mdx`), and provide clean, interactive Light-Mode visualizations consolidated on shared UI primitives.

# Scope & Curriculum Summary

- **Chapter 0 — History & Landscape of Deep Learning (`0.1`–`0.4`)**:
  - 3 theory lessons (`ai-ml-dl-hierarchy`, `representation-learning-evolution`, `modern-dl-landscape`) + 1 quiz, accompanied by 3 canonical 16:9 educational doodle illustrations.
- **Chapter 1.1 — Neural Network (`1.1.1`–`1.1.11`)**:
  - 7 theory lessons (`perceptron-and-linear-classifier`, `single-neuron-forward-and-backprop`, `mlp-and-deep-architectures`, `fully-connected-layers`, `activation-functions`, `loss-functions-and-forward-pass`, `backpropagation-and-chain-rule`, `optimization-and-gradient-descent`), 2 interleaved quizzes (`1.1.4`, `1.1.9`), and 1 PyTorch Iris Code Lab (`1.1.10`) + final quiz (`1.1.11`).
- **Chapter 1.2 — Convolutional Neural Networks (`1.2.1`–`1.2.10`)**:
  - 6 theory lessons (`convolution-operation`, `padding-stride-receptive-field`, `pooling-and-feature-maps`, `classic-cnn-architectures`, `modern-cnn-inception-resnet`, `unet-semantic-segmentation`), 3 interleaved quizzes (`1.2.4`, `1.2.7`, `1.2.9`), and 1 PyTorch CNN/U-Net Code Lab (`1.2.10`).
- **Chapters `1.3`–`1.9` (Placeholder Roadmap)**:
  - Structured TOC placeholders for RNNs (`1.3`), Deep Learning Tips (`1.4`), Self-Attention & Transformer (`1.5`), Autoencoders & VAE (`1.6`), GANs & Diffusion Models (`1.7`), Model Compression (`1.8`), and Transfer Learning (`1.9`).
- **Interactive Diagrams & Light-Mode Primitives (`src/components/learning/domains/deep-learning/`)**:
  - 18 registered MDX components sharing `primitives.tsx` (`DL_PALETTE` `#205089` / `#B8C8DA` / `#EFF3F8`, `DlCardShell`, `DlTabPillGroup`, `DlStepControl`, `useCodeHighlightPulse`) and typed with `satisfies Record<DeepLearningComponentName, LearningMdxComponent>`.

# Execution Log

- 2026-11-15 — Structured `src/content/learning/deep-learning/table-of-contents.ts` and authored Chapter `0` (`0.1`–`0.4`) and Chapter `1.1` (`1.1.1`–`1.1.11`).
- 2026-11-16 — Authored Chapter `1.2` (`1.2.1`–`1.2.10`) covering 2D Convolution, Padding/Stride/Multi-channel, Pooling & Parameter counting, LeNet/AlexNet/VGG/Inception/ResNet, and U-Net with interactive explorers and 29 referenced visual assets.
- 2026-11-16 — Consolidated Light-Mode diagram primitives in `primitives.tsx`, removed unused props/fields, verified 0 orphan assets, synced catalog stats (`987` total lessons, `535` published), and passed `biome check`, `tsc --noEmit`, `check:catalog-stats`, and MDX/catalog unit tests.
