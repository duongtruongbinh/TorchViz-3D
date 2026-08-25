import type { LearningTableOfContents, LearningTocTrackSeed } from '../../../core/learning/types.ts';

const chapters: LearningTocTrackSeed[] = [
  {
    id: 'tensor-shape-fundamentals',
    text: {
      title: { en: "Tensor shape fundamentals", vi: "Tensor shape fundamentals" },
      description: { en: "Read and predict shapes through core layers.", vi: "Đọc và dự đoán shape qua các layer cơ bản." },
    },
    lessonIds: ['shape-basics'],
  },
  {
    id: 'value-flow',
    text: {
      title: { en: "Value flow", vi: "Value flow" },
      description: { en: "Follow values through Linear and activation operations.", vi: "Theo dõi giá trị qua Linear và activation." },
    },
    lessonIds: [{
      id: 'linear-activation',
      status: 'next',
    }],
  },
  {
    id: 'core-ml-concepts',
    text: {
      title: { en: "1.1 Core ML Concepts", vi: "1.1 Core ML Concepts" },
      description: { en: "Classic dataset splits, generalization, validation, and metrics.", vi: "Dataset split, generalization, validation và metrics nền tảng." },
    },
    lessonIds: [
      'supervised-unsupervised-rl',
      'train-validation-test',
      'overfitting-underfitting',
      'bias-variance-tradeoff',
      'cross-validation-k-fold',
      'evaluation-metrics',
    ],
  },
  {
    id: 'linear-logistic-regression',
    text: {
      title: { en: "1.2 Linear & Logistic Regression", vi: "1.2 Linear & Logistic Regression" },
      description: { en: "Regression, classification, costs, regularization, and one-vs-rest.", vi: "Regression, classification, cost, regularization và one-vs-rest." },
    },
    lessonIds: [
      'linear-regression',
      'logistic-regression',
      'regression-cost-functions',
      'regularization-l1-l2',
      'one-vs-rest',
    ],
  },
  {
    id: 'decision-trees-ensembles',
    text: {
      title: { en: "1.3 Decision Trees & Ensembles", vi: "1.3 Decision Trees & Ensembles" },
      description: { en: "Trees, forests, boosting, and feature importance.", vi: "Tree, forest, boosting và feature importance." },
    },
    lessonIds: [
      'decision-tree-splitting',
      'random-forests',
      'gradient-boosting',
      'feature-importance',
    ],
  },
  {
    id: 'unsupervised-learning',
    text: {
      title: { en: "1.4 Unsupervised Learning", vi: "1.4 Unsupervised Learning" },
      description: { en: "Clustering, dimensionality reduction, and embedding visualization.", vi: "Clustering, giảm chiều và trực quan hóa embedding." },
    },
    lessonIds: [
      'k-means-clustering',
      'dbscan-clustering',
      'pca-dimensionality-reduction',
      'tsne-umap-visualization',
    ],
  },
  {
    id: 'hyperparameter-tuning',
    text: {
      title: { en: "1.5 Hyperparameter Tuning", vi: "1.5 Hyperparameter Tuning" },
      description: { en: "Search strategies, training knobs, and early stopping.", vi: "Chiến lược search, tham số train và early stopping." },
    },
    lessonIds: [
      'grid-random-search',
      'bayesian-optimization',
      'training-hyperparameters',
      'early-stopping',
    ],
  },
  {
    id: 'ml-with-scikit-learn',
    text: {
      title: { en: "1.6 ML with Scikit-Learn", vi: "1.6 ML với Scikit-Learn" },
      description: { en: "Pipelines, preprocessors, model selection, persistence, and API patterns.", vi: "Pipeline, preprocessor, model selection, lưu model và pattern API." },
    },
    lessonIds: [
      'sklearn-pipelines',
      'sklearn-preprocessors',
      'sklearn-model-selection',
      'sklearn-saving-models',
      'sklearn-api-pattern',
    ],
  },
];

export const learningTableOfContents = {
  id: 'fundamentals',
  text: {
    title: { en: "Machine Learning", vi: "Machine Learning" },
    description: { en: "Move from data splits and evaluation into regression, classification, trees, ensembles, unsupervised learning, tuning, and practical Scikit-Learn workflows for baseline AI systems.", vi: "Đi từ chia dữ liệu và evaluation đến regression, classification, tree, ensemble, unsupervised learning, tuning và workflow Scikit-Learn thực tế cho hệ thống AI baseline." },
  },
  status: 'placeholder',
  chapters,
  sectionKinds: ['theory', 'code'],
} satisfies LearningTableOfContents;
