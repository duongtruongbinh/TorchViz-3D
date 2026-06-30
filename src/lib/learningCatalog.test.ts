import test from 'node:test';
import assert from 'node:assert/strict';

import { learningCatalog } from '../core/learning/content/index.ts';
import {
  getLearningDomain,
  getLearningLessonsForTrack,
  getLearningPracticeForDomain,
  getLearningTrack,
  resolveLearningLessonRoute,
} from '../core/learning/selectors.ts';
import { getLearningLessonText, getStrings } from './localization.ts';

test('learning catalog exposes reinforcement learning as a Learning Lab domain', () => {
  const rlDomain = getLearningDomain(learningCatalog, 'reinforcement-learning');
  const robotDomain = getLearningDomain(learningCatalog, 'robot-learning');

  assert.equal(rlDomain?.status, 'active');
  assert.equal(robotDomain?.status, 'partial');
  assert.ok(learningCatalog.domains.some((domain) => domain.id === 'fundamentals'));
  assert.ok(learningCatalog.domains.some((domain) => domain.id === 'cv'));
  assert.ok(learningCatalog.domains.some((domain) => domain.id === 'nlp'));
});

test('learning catalog owns display text keys for domains and tracks', () => {
  assert.ok(learningCatalog.domains.every((domain) => domain.textKey.length > 0));
  assert.ok(learningCatalog.tracks.every((track) => track.textKey.length > 0));
  assert.equal(getLearningDomain(learningCatalog, 'reinforcement-learning')?.textKey, 'reinforcementLearning');
  assert.equal(getLearningTrack(learningCatalog, 'reinforcement-learning', 'rl-fundamentals')?.textKey, 'rlFundamentals');
});

test('reinforcement learning roadmap keeps existing practice on canonical lessons', () => {
  const fundamentalsTrack = getLearningTrack(learningCatalog, 'reinforcement-learning', 'rl-fundamentals');
  const valueTrack = getLearningTrack(learningCatalog, 'reinforcement-learning', 'value-based-methods');
  const fundamentalsLessons = fundamentalsTrack ? getLearningLessonsForTrack(learningCatalog, fundamentalsTrack) : [];
  const valueLessons = valueTrack ? getLearningLessonsForTrack(learningCatalog, valueTrack) : [];
  const practice = getLearningPracticeForDomain(learningCatalog, 'reinforcement-learning');

  assert.deepEqual(fundamentalsLessons.slice(0, 4).map((lesson) => lesson.id), [
    'markov-decision-processes',
    'agent-environment-state-action-reward',
    'policy-state-action-mapping',
    'value-function',
  ]);
  assert.deepEqual(valueLessons.slice(0, 2).map((lesson) => lesson.id), ['q-learning', 'sarsa-on-policy-td']);
  assert.deepEqual(
    practice.map((item) => item.id),
    [
      'rl-mdp-components-gridworld',
      'rl-bellman-q-table-value',
      'rl-q-learning-gridworld-step',
      'rl-sarsa-gridworld-step',
    ],
  );
});

test('learning route aliases resolve old RL and NLP ids to canonical roadmap lessons', () => {
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

  for (const lesson of learningCatalog.lessons) {
    for (const section of lesson.sections.filter((item) => item.kind === 'practice')) {
      assert.ok(
        lesson.practice.some((practice) => practice.id === section.refId),
        `practice section ${lesson.id}/${section.refId} has no matching practice ref`,
      );
    }
  }
});
