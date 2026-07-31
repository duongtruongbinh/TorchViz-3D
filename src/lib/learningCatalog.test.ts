import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { learningCatalog, learningTableOfContents } from '../content/learning/index.ts';
import {
  getLearningDomain,
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
  const statisticsDomain = getLearningDomain(learningCatalog, 'statistics');

  assert.equal(rlDomain?.status, 'active');
  assert.equal(robotDomain?.status, 'partial');
  assert.equal(statisticsDomain?.status, 'active');
  assert.deepEqual(statisticsDomain?.mdx?.fallbackLocales, ['en']);
  assert.equal(statisticsDomain?.mdx?.searchTextMode, 'metadata');
  assert.ok(learningCatalog.domains.some((domain) => domain.id === 'fundamentals'));
  assert.ok(learningCatalog.domains.some((domain) => domain.id === 'cv'));
  assert.ok(learningCatalog.domains.some((domain) => domain.id === 'nlp'));
  assert.deepEqual(
    learningCatalog.domains.slice(0, 3).map((domain) => domain.id),
    ['programming-foundation', 'linear-algebra', 'statistics'],
  );
  assert.equal(learningTableOfContents.length, 13);
  assert.equal(learningCatalog.domains.length, 13);
  assert.equal(learningCatalog.tracks.length, 92);
  assert.equal(learningCatalog.lessons.length, 719);
  assert.equal(learningCatalog.routeAliases?.length, 29);
  assert.deepEqual(
    Object.fromEntries(['available', 'next', 'locked'].map((status) => [
      status,
      learningCatalog.lessons.filter((lesson) => lesson.status === status).length,
    ])),
    { available: 167, next: 1, locked: 551 },
  );
  assert.equal(learningCatalog.lessons.filter((lesson) => lesson.contentStatus === 'published').length, 169);
  assert.equal(learningCatalog.lessons.filter((lesson) => lesson.contentStatus === 'missing').length, 550);
  assert.ok(learningCatalog.domains.every((domain) => domain.text.title.en && domain.text.title.vi));
  assert.ok(learningCatalog.tracks.every((track) => track.text.title.en && track.text.title.vi));
  assert.equal(getLearningDomain(learningCatalog, 'reinforcement-learning')?.text.title.en, 'Reinforcement Learning');
  assert.equal(getLearningTrack(learningCatalog, 'reinforcement-learning', 'rl-fundamentals')?.text.title.en, '1.1 RL Fundamentals');
  assert.equal(getLearningDomain(learningCatalog, 'statistics')?.text.title.en, 'Probability & Statistics');
  assert.equal(getLearningDomain(learningCatalog, 'statistics')?.text.title.vi, 'Xác suất & Thống kê');
  assert.equal(getLearningTrack(learningCatalog, 'statistics', 'probability')?.text.title.vi, '1. Xác suất');
  assert.equal(getLearningTrack(learningCatalog, 'statistics', 'statistical-thinking')?.text.title.vi, '2. Nhập môn tư duy thống kê');
  assert.deepEqual(
    learningCatalog.tracks.filter((track) => track.domainId === 'statistics').slice(0, 2).map((track) => track.id),
    ['probability', 'statistical-thinking'],
  );
  assert.deepEqual(
    getLearningTrack(learningCatalog, 'statistics', 'probability')?.lessonIds,
    [
      'ch01-probability-origins',
      'ch01-probability-origins-quiz',
      'ch01-experiments-events-sample-space',
      'ch01-experiments-events-sample-space-quiz',
      'ch01-event-relations',
      'ch01-event-relations-quiz',
      'ch01-probability-definitions-properties',
      'ch01-probability-definitions-properties-quiz',
      'ch01-empirical-probability',
      'ch01-empirical-probability-quiz',
      'ch01-conditional-probability',
      'ch01-conditional-probability-quiz',
      'ch01-total-probability',
      'ch01-total-probability-quiz',
      'ch01-bayes-naive-bayes',
      'ch01-bayes-naive-bayes-quiz',
      'ch01-probability-exercises',
      'ch01-probability-exercises-quiz',
    ],
  );
  assert.equal(getLearningTrack(learningCatalog, 'statistics', 'statistical-learning-extensions')?.text.title.en, 'Extensions: Statistical Learning');
  assert.deepEqual(
    resolveLearningLessonRoute(learningCatalog, {
      domainId: 'statistics',
      trackId: 'introduction',
      lessonId: 'ch01-overview-statistical-learning',
    }),
    {
      track: getLearningTrack(learningCatalog, 'statistics', 'probability'),
      lesson: learningCatalog.lessons.find((lesson) => lesson.domainId === 'statistics' && lesson.id === 'ch01-probability-origins'),
      isCanonical: false,
    },
  );
  assert.deepEqual(
    resolveLearningLessonRoute(learningCatalog, {
      domainId: 'statistics',
      trackId: 'statistical-learning',
      lessonId: 'ch02-what-is-statistical-learning',
    })?.lesson.id,
    'ch02-what-is-statistical-learning',
  );
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

test('LLM, Statistics, and tagged CV exercise lessons carry authored content', () => {
  const missingLessons = learningCatalog.lessons.filter((lesson) => lesson.contentStatus === 'missing');
  assert.equal(missingLessons.length, 550);
  for (const lesson of missingLessons) {
    assert.deepEqual(lesson.text?.theory, []);
    assert.deepEqual(getLearningLessonText(getStrings('vi').learningLab, lesson, 'vi').theory, ['Nội dung đang hoàn thiện.']);
  }
  const publishedLessons = learningCatalog.lessons.filter((lesson) => lesson.contentStatus === 'published');
  assert.equal(publishedLessons.filter((lesson) => lesson.domainId === 'llm-ai-engineering').length, 49);
  assert.equal(publishedLessons.filter((lesson) => lesson.domainId === 'statistics').length, 103);
  assert.ok(publishedLessons.filter((lesson) => lesson.domainId === 'statistics').every((lesson) => lesson.status === 'available'));
  assert.deepEqual(getReviewableLearningLessons(learningCatalog).map((lesson) => lesson.id), [
    'conv2d-shape-exercise',
    'conv2d-value-exercise',
    'pooling-shape-exercise',
    'pooling-value-exercise',
  ]);
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
