import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { learningCatalog, learningTableOfContents } from '../content/learning/index.ts';
import { materializeLearningCatalog } from '../core/learning/materializeCatalog.ts';
import { continualLearningLessonPairs } from '../content/learning/continual-learning-llm/table-of-contents.ts';
import {
  getLearningDomain,
  getLearningDomainReadiness,
  getLearningHomeDomainSummaries,
  getLearningLessonsForTrack,
  getReviewableLearningLessons,
  getLearningTrack,
  resolveLearningExerciseLessonTarget,
  resolveLearningLessonRoute,
} from '../core/learning/selectors.ts';
import { getLearningLessonText, getStrings } from './localization.ts';

test('learning core remains independent from authored content and React UI', () => {
  for (const filePath of [
    'src/core/learning/materializeCatalog.ts',
    'src/core/learning/mdxContract.ts',
    'src/core/learning/selectors.ts',
    'src/core/learning/types.ts',
  ]) {
    const source = readFileSync(filePath, 'utf8');
    assert.doesNotMatch(source, /(?:content|components)\/learning|from ['"]react['"]/);
  }
});

test('typed catalog materializes domain metadata and content lifecycle counts', () => {
  const rlDomain = getLearningDomain(learningCatalog, 'reinforcement-learning');
  const robotDomain = getLearningDomain(learningCatalog, 'robot-learning');

  assert.equal(rlDomain?.status, 'placeholder');
  assert.equal(robotDomain?.status, 'placeholder');
  assert.ok(learningCatalog.domains.some((domain) => domain.id === 'fundamentals'));
  assert.ok(learningCatalog.domains.some((domain) => domain.id === 'cv'));
  assert.ok(learningCatalog.domains.some((domain) => domain.id === 'nlp'));
  assert.equal(learningTableOfContents.length, 17);
  assert.equal(learningCatalog.domains.length, 17);
  assert.equal(learningCatalog.tracks.length, 111);
  assert.equal(learningCatalog.lessons.length, 864);
  assert.equal(learningCatalog.routeAliases?.length, 7);
  const lifecycleCounts = Object.fromEntries(['available', 'next', 'locked'].map((status) => [
    status,
    learningCatalog.lessons.filter((lesson) => lesson.status === status).length,
  ]));
  assert.equal(
    lifecycleCounts.available + lifecycleCounts.next + lifecycleCounts.locked,
    learningCatalog.lessons.length,
  );
  assert.ok(lifecycleCounts.available > 0);
  assert.equal(
    learningCatalog.lessons.filter((lesson) => lesson.contentStatus === 'published').length +
      learningCatalog.lessons.filter((lesson) => lesson.contentStatus === 'missing').length,
    learningCatalog.lessons.length,
  );
  assert.ok(learningCatalog.domains.every((domain) => domain.text.title.en && domain.text.title.vi));
  assert.ok(learningCatalog.tracks.every((track) => track.text.title.en && track.text.title.vi));
  assert.equal(getLearningDomain(learningCatalog, 'reinforcement-learning')?.text.title.en, 'Reinforcement Learning');
  assert.equal(getLearningTrack(learningCatalog, 'reinforcement-learning', 'rl-fundamentals')?.text.title.en, '1.1 RL Fundamentals');
});

test('fully published and updating domains are prioritized without disturbing catalog order', () => {
  const prioritizedDomains = getLearningDomainReadiness(learningCatalog);

  assert.deepEqual(
    prioritizedDomains.filter((item) => item.readinessState === 'ready').map((item) => item.domain.id),
    ['linear-algebra', 'continual-learning-llm', 'research-papers'],
  );
  assert.deepEqual(
    prioritizedDomains.filter((item) => item.readinessState === 'updating').map((item) => item.domain.id),
    ['cv', 'llm-ai-engineering', 'llm-unlearning', 'mlops-llmops-production-systems', 'evolutionary-algorithms', 'ai-projects'],
  );
  assert.deepEqual(
    prioritizedDomains.map((item) => item.domain.id),
    [
      'linear-algebra',
      'continual-learning-llm',
      'research-papers',
      'cv',
      'llm-ai-engineering',
      'llm-unlearning',
      'mlops-llmops-production-systems',
      'evolutionary-algorithms',
      'ai-projects',
      'programming-foundation',
      'fundamentals',
      'deep-learning',
      'nlp',
      'ai-system-design',
      'reinforcement-learning',
      'ai-ethics-safety-governance',
      'robot-learning',
    ],
  );
  assert.deepEqual(getLearningDomain(learningCatalog, 'continual-learning-llm')?.text.title, {
    en: 'Continual Learning for LLMs',
    vi: 'Continual Learning cho LLMs',
  });
});

test('Learning Home summaries preserve canonical domain metadata, order, readiness, and counts', () => {
  const readiness = getLearningDomainReadiness(learningCatalog);
  const summaries = getLearningHomeDomainSummaries(learningCatalog);

  assert.equal(summaries.length, 17);
  assert.deepEqual(
    summaries.map(({ domain, isReady, readinessState }) => ({ domain, isReady, readinessState })),
    readiness,
  );
  assert.deepEqual(
    readiness.filter((item) => item.readinessState === 'ready').map((item) => item.domain.id),
    ['linear-algebra', 'continual-learning-llm', 'research-papers'],
  );
  assert.deepEqual(
    readiness.filter((item) => item.readinessState === 'updating').map((item) => item.domain.id),
    ['cv', 'llm-ai-engineering', 'llm-unlearning', 'mlops-llmops-production-systems', 'evolutionary-algorithms', 'ai-projects'],
  );
  assert.deepEqual(
    summaries.map(({ domain, lessonCount }) => [
      domain.id,
      lessonCount,
    ]),
    readiness.map(({ domain }) => [
      domain.id,
      learningCatalog.lessons.filter((lesson) => lesson.domainId === domain.id).length,
    ]),
  );
});

test('one-domain materialization preserves the canonical routes and lesson order', () => {
  for (const table of learningTableOfContents) {
    const domainCatalog = materializeLearningCatalog([table]);
    assert.deepEqual(domainCatalog.domains, learningCatalog.domains.filter((domain) => domain.id === table.id));
    assert.deepEqual(domainCatalog.tracks, learningCatalog.tracks.filter((track) => track.domainId === table.id));
    assert.deepEqual(domainCatalog.lessons, learningCatalog.lessons.filter((lesson) => lesson.domainId === table.id));
    assert.deepEqual(
      domainCatalog.routeAliases ?? [],
      (learningCatalog.routeAliases ?? []).filter((alias) => alias.domainId === table.id),
    );
  }
});

test('catalog lesson text is canonical', () => {
  const text = getLearningLessonText(getStrings('en').learningLab, {
    id: 'shape-basics',
    text: {
      title: { en: 'Catalog title', vi: 'Tiêu đề catalog' },
      theory: [{ en: 'Catalog theory', vi: 'Lý thuyết catalog' }],
    },
  }, 'en');
  assert.equal(text.title, 'Catalog title');
  assert.deepEqual(text.theory, ['Catalog theory']);
});

test('continual-learning lessons form adjacent pairs plus one standalone synthesis', () => {
  const domainLessons = learningCatalog.lessons.filter((lesson) => lesson.domainId === 'continual-learning-llm');
  const pairedLessonIds = continualLearningLessonPairs.flatMap((pair) => [pair.theory.id, pair.quiz.id]);
  const standaloneLessonIds = ['continual-llm-synthesis'];

  assert.equal(new Set(pairedLessonIds).size, pairedLessonIds.length, 'theory and quiz ids must be unique');
  assert.deepEqual(domainLessons.map((lesson) => lesson.id).sort(), [...pairedLessonIds, ...standaloneLessonIds].sort());

  for (const pair of continualLearningLessonPairs) {
    assert.equal(pair.quiz.id, `${pair.theory.id}-quiz`);
    assert.doesNotMatch(pair.theory.id, /-quiz$/);

    const track = getLearningTrack(learningCatalog, 'continual-learning-llm', pair.trackId);
    assert.ok(track, `missing continual-learning track ${pair.trackId}`);
    const theoryIndex = track.lessonIds.indexOf(pair.theory.id);
    assert.notEqual(theoryIndex, -1, `missing theory node ${pair.theory.id}`);
    assert.equal(track.lessonIds[theoryIndex + 1], pair.quiz.id, `${pair.quiz.id} must immediately follow its theory node`);

    const theory = domainLessons.find((lesson) => lesson.id === pair.theory.id);
    const quiz = domainLessons.find((lesson) => lesson.id === pair.quiz.id);
    assert.ok(theory);
    assert.ok(quiz);
    assert.equal(theory.trackId, pair.trackId);
    assert.equal(quiz.trackId, pair.trackId);
    assert.equal(quiz.status, theory.status, `${pair.theory.id} pair must share lesson status`);
    assert.equal(quiz.contentStatus, theory.contentStatus, `${pair.theory.id} pair must share content status`);
  }

  const synthesisTrack = getLearningTrack(learningCatalog, 'continual-learning-llm', 'cl-llm-synthesis');
  assert.deepEqual(synthesisTrack?.lessonIds, standaloneLessonIds);
  assert.ok(domainLessons.some((lesson) => lesson.id === 'continual-llm-synthesis'));
  assert.ok(!domainLessons.some((lesson) => lesson.id === 'continual-llm-synthesis-quiz'));
});

test('continual-learning fundamentals introduces and measures forgetting immediately after stability-plasticity', () => {
  const fundamentalsTrack = getLearningTrack(learningCatalog, 'continual-learning-llm', 'cl-llm-fundamentals');

  assert.deepEqual(fundamentalsTrack?.lessonIds.slice(0, 8), [
    'continual-learning-llm-overview',
    'continual-learning-llm-overview-quiz',
    'stability-plasticity-dilemma',
    'stability-plasticity-dilemma-quiz',
    'catastrophic-forgetting-in-llms',
    'catastrophic-forgetting-in-llms-quiz',
    'catastrophic-forgetting-code-lab',
    'catastrophic-forgetting-code-lab-quiz',
  ]);
  assert.deepEqual(fundamentalsTrack?.lessonIds.slice(-2), [
    'cl-methods-taxonomy-and-replay',
    'cl-methods-taxonomy-and-replay-quiz',
  ]);
});

test('continual-learning methods chapter covers replay, regularization overview/subnodes, and architecture in order', () => {
  const methodsTrack = getLearningTrack(learningCatalog, 'continual-learning-llm', 'cl-llm-methods');

  assert.deepEqual(methodsTrack?.lessonIds, [
    'replay-introduction',
    'replay-introduction-quiz',
    'replay-experience-code-lab',
    'replay-experience-code-lab-quiz',
    'regularization-overview',
    'regularization-overview-quiz',
    'parameter-regularization-ewc',
    'parameter-regularization-ewc-quiz',
    'ewc-si-code-lab',
    'ewc-si-code-lab-quiz',
    'distillation-for-retention',
    'distillation-for-retention-quiz',
    'architecture-expansion-isolation',
    'architecture-expansion-isolation-quiz',
  ]);
});

test('continual-learning uses six survey chapters and one synthesis chapter', () => {
  const domain = getLearningDomain(learningCatalog, 'continual-learning-llm');

  assert.deepEqual(domain?.trackIds, [
    'cl-llm-fundamentals',
    'cl-llm-methods',
    'cl-llm-continuity',
    'cl-llm-stages',
    'cl-llm-evaluation',
    'cl-llm-discussion',
    'cl-llm-synthesis',
  ]);

  const chapterTitles = domain?.trackIds.map(
    (trackId) => getLearningTrack(learningCatalog, 'continual-learning-llm', trackId)?.text.title.vi,
  );
  assert.deepEqual(chapterTitles, [
    '1. Nền tảng Continual Learning',
    '2. Các hướng tiếp cận chính',
    '3. Vertical & Horizontal Continual Learning',
    '4. Các giai đoạn học liên tục của LLM',
    '5. Metric và Benchmark đánh giá',
    '6. Discussion và hướng nghiên cứu',
    '7. Tổng hợp toàn khóa',
  ]);
});

test('continual-learning node titles stay compact and adjacent assessments are labeled Quiz', () => {
  for (const pair of continualLearningLessonPairs) {
    assert.ok(pair.theory.title);
    assert.deepEqual(pair.quiz.title, { en: 'Quiz', vi: 'Quiz' });
    assert.ok(pair.theory.title.en.length <= 32, `${pair.theory.id} English title is too long`);
    assert.ok(pair.theory.title.vi.length <= 32, `${pair.theory.id} Vietnamese title is too long`);
  }
});

test('reinforcement learning keeps canonical order and resolves legacy aliases', () => {
  const fundamentalsTrack = getLearningTrack(learningCatalog, 'reinforcement-learning', 'rl-fundamentals');
  const valueTrack = getLearningTrack(learningCatalog, 'reinforcement-learning', 'value-based-methods');
  const fundamentalsLessons = fundamentalsTrack ? getLearningLessonsForTrack(learningCatalog, fundamentalsTrack) : [];
  const valueLessons = valueTrack ? getLearningLessonsForTrack(learningCatalog, valueTrack) : [];

  assert.deepEqual(fundamentalsLessons.slice(0, 4).map((lesson) => lesson.id), [
    'markov-decision-processes',
    'agent-environment-state-action-reward',
    'policy-state-action-mapping',
    'value-function',
  ]);
  assert.deepEqual(valueLessons.slice(0, 2).map((lesson) => lesson.id), ['q-learning', 'sarsa-on-policy-td']);
  const rlRoute = resolveLearningLessonRoute(learningCatalog, {
    domainId: 'reinforcement-learning',
    trackId: 'tabular-control',
    lessonId: 'rl-q-learning',
  });
  assert.equal(rlRoute?.track.id, 'value-based-methods');
  assert.equal(rlRoute?.lesson.id, 'q-learning');

  const nlpRoute = resolveLearningLessonRoute(learningCatalog, {
    domainId: 'nlp',
    trackId: 'attention-shapes',
    lessonId: 'attention-shape',
  });
  assert.equal(nlpRoute?.track.id, 'transformer-architecture');
  assert.equal(nlpRoute?.lesson.id, 'self-attention');
});

test('retired tensor prerequisite bookmarks resolve without reintroducing tensor lessons', () => {
  const table = learningTableOfContents.find((item) => item.id === 'fundamentals');
  assert.ok(table);
  for (const catalog of [learningCatalog, materializeLearningCatalog([table])]) {
    assert.equal(getLearningTrack(catalog, 'fundamentals', 'tensor-shape-fundamentals'), null);
    assert.ok(!catalog.lessons.some((lesson) => (
      lesson.domainId === 'fundamentals' && ['shape-basics', 'shape-basics-quiz'].includes(lesson.id)
    )));
    for (const lessonId of [undefined, 'shape-basics', 'shape-basics-quiz']) {
      const route = resolveLearningLessonRoute(catalog, {
        domainId: 'fundamentals',
        trackId: 'tensor-shape-fundamentals',
        lessonId,
      });
      assert.equal(route?.track.id, lessonId ? 'logistic-classification' : 'linear-regression-foundations');
      assert.equal(route?.lesson.id, lessonId ? 'linear-activation' : 'supervised-unsupervised-rl');
      assert.equal(route?.isCanonical, false);
    }
    const canonical = resolveLearningLessonRoute(catalog, {
      domainId: 'fundamentals', trackId: 'logistic-classification', lessonId: 'linear-activation',
    });
    assert.equal(canonical?.isCanonical, true);
  }
});

test('value flow follows Logistic Regression with its quiz and preserves old bookmarks', () => {
  const table = learningTableOfContents.find((item) => item.id === 'fundamentals');
  assert.ok(table);
  for (const catalog of [learningCatalog, materializeLearningCatalog([table])]) {
    assert.equal(getLearningTrack(catalog, 'fundamentals', 'value-flow'), null);
    const track = getLearningTrack(catalog, 'fundamentals', 'logistic-classification');
    assert.ok(track);
    const start = track.lessonIds.indexOf('logistic-regression');
    assert.ok(start >= 0);
    assert.deepEqual(track.lessonIds.slice(start, start + 5), [
      'logistic-regression', 'logistic-regression-quiz',
      'linear-activation', 'linear-activation-quiz', 'one-vs-rest',
    ]);
    for (const lessonId of [undefined, 'linear-activation', 'linear-activation-quiz']) {
      const route = resolveLearningLessonRoute(catalog, {
        domainId: 'fundamentals', trackId: 'value-flow', lessonId,
      });
      assert.equal(route?.track.id, track.id);
      assert.equal(route?.lesson.id, lessonId ?? 'logistic-regression');
      assert.equal(route?.isCanonical, false);
    }
    const prerequisite = resolveLearningLessonRoute(learningCatalog, {
      domainId: 'linear-algebra', trackId: 'linear-algebra-for-ai',
      lessonId: 'linear-algebra-for-ai-overview',
    });
    assert.equal(prerequisite?.isCanonical, true);
    assert.equal(prerequisite?.lesson.contentStatus, 'published');
  }
});

test('Machine Learning integrates core concepts into regression and ends each model chapter with its metrics', () => {
  const table = learningTableOfContents.find((item) => item.id === 'fundamentals');
  assert.ok(table);
  const expected = {
    'linear-regression-foundations': [
      'supervised-unsupervised-rl', 'linear-regression', 'train-validation-test',
      'regression-cost-functions', 'overfitting-underfitting', 'bias-variance-tradeoff',
      'regularization-l1-l2', 'cross-validation-k-fold', 'variability-splits-seeds',
      'bootstrap-confidence-intervals', 'prediction-intervals',
      'leakage-code-lab', 'linear-regression-code-lab', 'regression-metrics',
    ],
    'logistic-classification': [
      'logistic-regression', 'linear-activation', 'one-vs-rest', 'k-nearest-neighbors',
      'naive-bayes', 'support-vector-machines', 'mixed-classification-code-lab',
      'classification-metrics',
    ],
    'decision-trees-ensembles': [
      'decision-tree-splitting', 'random-forests', 'gradient-boosting',
      'feature-importance', 'model-comparison-code-lab',
    ],
    'unsupervised-learning': [
      'k-means-clustering', 'gaussian-mixture-models', 'dbscan-clustering',
      'pca-dimensionality-reduction', 'tsne-umap-visualization', 'clustering-code-lab',
    ],
    'hyperparameter-tuning': [
      'grid-random-search', 'bayesian-optimization', 'training-hyperparameters',
      'early-stopping', 'nested-cv-code-lab',
    ],
  };
  for (const catalog of [learningCatalog, materializeLearningCatalog([table])]) {
    assert.equal(getLearningTrack(catalog, 'fundamentals', 'core-ml-concepts'), null);
    for (const [trackId, ids] of Object.entries(expected)) {
      assert.deepEqual(getLearningTrack(catalog, 'fundamentals', trackId)?.lessonIds,
        ids.flatMap((id) => [id, `${id}-quiz`]));
    }
    for (const [trackId, lessonId, newTrackId, newLessonId] of [
      ['core-ml-concepts', 'train-validation-test', 'linear-regression-foundations', 'train-validation-test'],
      ['core-ml-concepts', 'evaluation-metrics', 'linear-regression-foundations', 'regression-metrics'],
      ['core-ml-concepts', 'evaluation-metrics-quiz', 'linear-regression-foundations', 'regression-metrics-quiz'],
      ['linear-logistic-regression', 'linear-regression', 'linear-regression-foundations', 'linear-regression'],
      ['linear-logistic-regression', 'logistic-regression-quiz', 'logistic-classification', 'logistic-regression-quiz'],
    ]) {
      const route = resolveLearningLessonRoute(catalog, { domainId: 'fundamentals', trackId, lessonId });
      assert.equal(route?.track.id, newTrackId);
      assert.equal(route?.lesson.id, newLessonId);
      assert.equal(route?.isCanonical, false);
    }
    assert.ok(!catalog.lessons.some((lesson) => lesson.domainId === 'fundamentals' &&
      ['evaluation-metrics', 'evaluation-metrics-quiz'].includes(lesson.id)));
  }
});

test('a bare domain route resolves the first lesson by product default', () => {
  const route = resolveLearningLessonRoute(learningCatalog, {
    domainId: 'linear-algebra',
    trackId: null,
    lessonId: null,
  });
  assert.equal(route?.lesson.id, 'linear-algebra-for-ai-overview');
  assert.equal(route?.isCanonical, false);
});

test('learning catalog ids resolve and first-party lessons have display text', () => {
  const strings = getStrings('en').learningLab;

  for (const domain of learningCatalog.domains) {
    for (const trackId of domain.trackIds) {
      const track = getLearningTrack(learningCatalog, domain.id, trackId);
      assert.ok(track, `missing track ${domain.id}/${trackId}`);
      for (const lessonId of track.lessonIds) {
        const lesson = learningCatalog.lessons.find((item) => item.domainId === domain.id && item.id === lessonId);
        assert.ok(lesson, `missing lesson ${domain.id}/${track.id}/${lessonId}`);
        const lessonText = getLearningLessonText(strings, lesson, 'en');
        assert.notEqual(lessonText.title, lesson.id, `lesson ${domain.id}/${lesson.id} uses raw id as title`);
      }
    }
  }

});

test('only active authored domains and tagged CV exercise lessons carry authored content', () => {
  const missingLessons = learningCatalog.lessons.filter((lesson) => lesson.contentStatus === 'missing');
  assert.equal(missingLessons.length, 472);
  for (const lesson of missingLessons) {
    assert.deepEqual(lesson.text?.theory, []);
    assert.deepEqual(getLearningLessonText(getStrings('vi').learningLab, lesson, 'vi').theory, ['Nội dung đang hoàn thiện.']);
  }
  const publishedLessons = learningCatalog.lessons.filter((lesson) => lesson.contentStatus === 'published');
  assert.equal(publishedLessons.filter((lesson) => lesson.domainId === 'llm-ai-engineering').length, 49);
  assert.equal(publishedLessons.filter((lesson) => lesson.domainId === 'ai-projects').length, 8);
  assert.equal(publishedLessons.filter((lesson) => lesson.domainId === 'cv').length, 14);
  const researchPapersPublished = publishedLessons.filter((lesson) => lesson.domainId === 'research-papers');
  assert.equal(researchPapersPublished.length, 33);
  assert.equal(publishedLessons.filter((lesson) => lesson.domainId === 'llm-unlearning').length, 66);
  const salesForecastingTrack = getLearningTrack(learningCatalog, 'ai-projects', 'sales-forecasting-project');
  assert.ok(salesForecastingTrack);
  assert.deepEqual(
    getLearningLessonsForTrack(learningCatalog, salesForecastingTrack)
      .slice(-2)
      .map((lesson) => lesson.id),
    ['sales-forecasting-conformal-prediction-intervals-code-lab', 'sales-forecasting-quiz'],
  );
  assert.deepEqual(getReviewableLearningLessons(learningCatalog).map((lesson) => lesson.id), [
    'conv2d-shape-exercise',
    'conv2d-value-exercise',
    'pooling-shape-exercise',
    'pooling-value-exercise',
  ]);
});

test('evolutionary-algorithms single-choice quizzes avoid answer-position and length leakage', () => {
  const quizFiles = [
    '1.1.2-gradient-limits-blackbox-quiz.vi.mdx',
    '1.2.2-ml-to-ea-concept-mapping-quiz.vi.mdx',
    '1.3.2-fitness-landscapes-selection-quiz.vi.mdx',
    '1.4.2-genotype-phenotype-representation-quiz.vi.mdx',
    '1.5.2-crossover-mutation-operators-quiz.vi.mdx',
  ];
  const positions: number[] = [];

  for (const fileName of quizFiles) {
    const source = readFileSync(`src/content/learning/evolutionary-algorithms/${fileName}`, 'utf8');
    const singleQuestionBlocks = source.matchAll(/mode: 'single',[\s\S]*?options: \[([\s\S]*?)\n {4}\]/g);

    for (const [, optionBlock] of singleQuestionBlocks) {
      const options = [...optionBlock.matchAll(/label: '([^']*)'[^\n]*/g)].map((match) => ({
        label: match[1],
        isCorrect: match[0].includes('isCorrect: true'),
      }));
      const correctIndex = options.findIndex((option) => option.isCorrect);
      assert.ok(correctIndex >= 0 && correctIndex < 4, `${fileName} must have one correct A-D option`);
      assert.ok(
        options[correctIndex].label.length < Math.max(...options.map((option) => option.label.length)),
        `${fileName} correct answer must not be the longest option`,
      );
      positions.push(correctIndex);
    }
  }

  assert.deepEqual(
    [0, 1, 2, 3].map((position) => positions.filter((candidate) => candidate === position).length),
    [5, 6, 6, 6],
  );
  assert.ok(positions.every((position, index) => (
    index < 2 || position !== positions[index - 1] || position !== positions[index - 2]
  )));
});

test('TorchViz exercise entry points resolve to canonical CV exercise lessons', () => {
  assert.deepEqual(resolveLearningExerciseLessonTarget(learningCatalog, { exerciseId: 'shape-output', operation: 'Conv2d' }), {
    domainId: 'cv', trackId: 'cnn-shape-value', lessonId: 'conv2d-shape-exercise',
  });
  assert.deepEqual(resolveLearningExerciseLessonTarget(learningCatalog, { exerciseId: 'conv-value', operation: 'Conv2d' }), {
    domainId: 'cv', trackId: 'cnn-shape-value', lessonId: 'conv2d-value-exercise',
  });
  assert.deepEqual(resolveLearningExerciseLessonTarget(learningCatalog, { exerciseId: 'shape-output', operation: 'MaxPool2d' }), {
    domainId: 'cv', trackId: 'cnn-shape-value', lessonId: 'pooling-shape-exercise',
  });
  assert.deepEqual(resolveLearningExerciseLessonTarget(learningCatalog, { exerciseId: 'pool-value', operation: 'AvgPool2d' }), {
    domainId: 'cv', trackId: 'cnn-shape-value', lessonId: 'pooling-value-exercise',
  });
  assert.equal(resolveLearningExerciseLessonTarget(learningCatalog, { exerciseId: 'activation-value', operation: 'ReLU' }), null);
});
