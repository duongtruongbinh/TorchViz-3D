import type { LearningDomain, LearningLesson, LearningTrack } from '../types.ts';
import { buildPlaceholderContent, type LearningChapterSeed } from './seed.ts';

const chapters: LearningChapterSeed[] = [
  {
    id: 'tensor-shape-fundamentals',
    textKey: 'tensorShapeFundamentals',
    lessonIds: ['shape-basics'],
  },
  {
    id: 'value-flow',
    textKey: 'valueFlow',
    lessonIds: [{ id: 'linear-activation', status: 'next' }],
  },
  {
    id: 'core-ml-concepts',
    textKey: 'coreMlConcepts',
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
    textKey: 'linearLogisticRegression',
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
    textKey: 'decisionTreesEnsembles',
    lessonIds: [
      'decision-tree-splitting',
      'random-forests',
      'gradient-boosting',
      'feature-importance',
    ],
  },
  {
    id: 'unsupervised-learning',
    textKey: 'unsupervisedLearning',
    lessonIds: [
      'k-means-clustering',
      'dbscan-clustering',
      'pca-dimensionality-reduction',
      'tsne-umap-visualization',
    ],
  },
  {
    id: 'hyperparameter-tuning',
    textKey: 'hyperparameterTuning',
    lessonIds: [
      'grid-random-search',
      'bayesian-optimization',
      'training-hyperparameters',
      'early-stopping',
    ],
  },
  {
    id: 'ml-with-scikit-learn',
    textKey: 'mlWithScikitLearn',
    lessonIds: [
      'sklearn-pipelines',
      'sklearn-preprocessors',
      'sklearn-model-selection',
      'sklearn-saving-models',
      'sklearn-api-pattern',
    ],
  },
];

const fundamentalsContent = buildPlaceholderContent({
  domainId: 'fundamentals',
  domainTextKey: 'fundamentals',
  domainStatus: 'active',
  chapters,
  sectionKinds: ['theory', 'code'],
});

export const fundamentalsDomain: LearningDomain = fundamentalsContent.domain;
export const fundamentalsTracks: LearningTrack[] = fundamentalsContent.tracks;
export const fundamentalsLessons: LearningLesson[] = fundamentalsContent.lessons.map((lesson) => {
  if (lesson.id === 'shape-basics') {
    return {
      ...lesson,
      sections: [{ kind: 'theory', refId: 'shape-basics' }, { kind: 'practice', refId: 'shape-basics-output' }],
      practice: [
        {
          family: 'tensor',
          id: 'shape-basics-output',
          kind: 'shape',
          exerciseId: 'shape-output',
          targetOperation: 'Conv2d / Pooling / BatchNorm',
          approval: { status: 'approved', implementedBy: 'nmkhiem' },
          reuseStatus: 'embedded',
        },
      ],
    };
  }

  if (lesson.id === 'linear-activation') {
    return {
      ...lesson,
      sections: [
        { kind: 'theory', refId: 'linear-activation' },
        { kind: 'practice', refId: 'linear-value-score' },
        { kind: 'practice', refId: 'activation-value-pass' },
      ],
      practice: [
        {
          family: 'tensor',
          id: 'linear-value-score',
          kind: 'value',
          exerciseId: 'linear-value',
          targetOperation: 'Linear',
          approval: { status: 'unavailable' },
          reuseStatus: 'embedded',
        },
        {
          family: 'tensor',
          id: 'activation-value-pass',
          kind: 'value',
          exerciseId: 'activation-value',
          targetOperation: 'ReLU',
          approval: { status: 'approved', implementedBy: 'nmkhiem' },
          reuseStatus: 'embedded',
        },
      ],
    };
  }

  return lesson;
});
