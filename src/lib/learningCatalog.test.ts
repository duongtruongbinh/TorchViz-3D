import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { learningCatalog, learningTableOfContents } from '../content/learning/index.ts';
import { continualLearningLessonPairs } from '../content/learning/continual-learning-llm/table-of-contents.ts';
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

  assert.equal(rlDomain?.status, 'active');
  assert.equal(robotDomain?.status, 'partial');
  assert.ok(learningCatalog.domains.some((domain) => domain.id === 'fundamentals'));
  assert.ok(learningCatalog.domains.some((domain) => domain.id === 'cv'));
  assert.ok(learningCatalog.domains.some((domain) => domain.id === 'nlp'));
  assert.equal(learningTableOfContents.length, 13);
  assert.equal(learningCatalog.domains.length, 13);
  assert.equal(learningCatalog.tracks.length, 90);
  assert.equal(learningCatalog.lessons.length, 676);
  assert.equal(learningCatalog.routeAliases?.length, 7);
  assert.deepEqual(
    Object.fromEntries(['available', 'next', 'locked'].map((status) => [
      status,
      learningCatalog.lessons.filter((lesson) => lesson.status === status).length,
    ])),
    { available: 138, next: 1, locked: 537 },
  );
  assert.equal(learningCatalog.lessons.filter((lesson) => lesson.contentStatus === 'published').length, 140);
  assert.equal(learningCatalog.lessons.filter((lesson) => lesson.contentStatus === 'missing').length, 536);
  assert.ok(learningCatalog.domains.every((domain) => domain.text.title.en && domain.text.title.vi));
  assert.ok(learningCatalog.tracks.every((track) => track.text.title.en && track.text.title.vi));
  assert.equal(getLearningDomain(learningCatalog, 'reinforcement-learning')?.text.title.en, 'Reinforcement Learning');
  assert.equal(getLearningTrack(learningCatalog, 'reinforcement-learning', 'rl-fundamentals')?.text.title.en, '1.1 RL Fundamentals');
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

test('continual-learning lessons form complete adjacent theory and quiz pairs', () => {
  const domainLessons = learningCatalog.lessons.filter((lesson) => lesson.domainId === 'continual-learning-llm');
  const pairedLessonIds = continualLearningLessonPairs.flatMap((pair) => [pair.theory.id, pair.quiz.id]);

  assert.equal(new Set(pairedLessonIds).size, pairedLessonIds.length, 'theory and quiz ids must be unique');
  assert.deepEqual(domainLessons.map((lesson) => lesson.id).sort(), [...pairedLessonIds].sort());

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

test('continual-learning methods chapter starts with replay, its lab, regularization, and architecture', () => {
  const methodsTrack = getLearningTrack(learningCatalog, 'continual-learning-llm', 'cl-llm-methods');

  assert.deepEqual(methodsTrack?.lessonIds, [
    'replay-introduction',
    'replay-introduction-quiz',
    'replay-experience-code-lab',
    'replay-experience-code-lab-quiz',
    'parameter-regularization-ewc',
    'parameter-regularization-ewc-quiz',
    'architecture-expansion-isolation',
    'architecture-expansion-isolation-quiz',
  ]);
});

test('continual-learning uses six survey chapters numbered 1 through 6', () => {
  const domain = getLearningDomain(learningCatalog, 'continual-learning-llm');

  assert.deepEqual(domain?.trackIds, [
    'cl-llm-fundamentals',
    'cl-llm-methods',
    'cl-llm-continuity',
    'cl-llm-stages',
    'cl-llm-evaluation',
    'cl-llm-discussion',
  ]);

  const chapterTitles = domain?.trackIds.map(
    (trackId) => getLearningTrack(learningCatalog, 'continual-learning-llm', trackId)?.text.title.vi,
  );
  assert.deepEqual(chapterTitles, [
    '1. Nền tảng Continual Learning',
    '2. Replay, Regularization & Architecture',
    '3. Vertical & Horizontal Continual Learning',
    '4. Các giai đoạn học liên tục của LLM',
    '5. Metric và Benchmark đánh giá',
    '6. Discussion và hướng nghiên cứu',
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

test('only LLM and tagged CV exercise lessons carry authored content', () => {
  const missingLessons = learningCatalog.lessons.filter((lesson) => lesson.contentStatus === 'missing');
  assert.equal(missingLessons.length, 536);
  for (const lesson of missingLessons) {
    assert.deepEqual(lesson.text?.theory, []);
    assert.deepEqual(getLearningLessonText(getStrings('vi').learningLab, lesson, 'vi').theory, ['Nội dung đang hoàn thiện.']);
  }
  const publishedLessons = learningCatalog.lessons.filter((lesson) => lesson.contentStatus === 'published');
  assert.equal(publishedLessons.filter((lesson) => lesson.domainId === 'llm-ai-engineering').length, 49);
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
