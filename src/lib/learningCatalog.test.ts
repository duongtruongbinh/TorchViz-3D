import test from 'node:test';
import assert from 'node:assert/strict';

import { learningCatalog } from '../core/learning/content/index.ts';
import {
  getLearningDomain,
  getLearningLessonsForTrack,
  getLearningPracticeForDomain,
  getLearningTrack,
} from '../core/learning/selectors.ts';

test('learning catalog exposes reinforcement learning as a Learning Lab domain', () => {
  const rlDomain = getLearningDomain(learningCatalog, 'reinforcement-learning');
  const robotDomain = getLearningDomain(learningCatalog, 'robot-learning');

  assert.equal(rlDomain?.status, 'active');
  assert.equal(robotDomain?.status, 'placeholder');
  assert.ok(learningCatalog.domains.some((domain) => domain.id === 'fundamentals'));
  assert.ok(learningCatalog.domains.some((domain) => domain.id === 'cv'));
  assert.ok(learningCatalog.domains.some((domain) => domain.id === 'nlp'));
});

test('reinforcement learning tracks keep the existing lessons and practice', () => {
  const tabularTrack = getLearningTrack(learningCatalog, 'reinforcement-learning', 'tabular-control');
  const policyTrack = getLearningTrack(learningCatalog, 'reinforcement-learning', 'policy-behavior');
  const lessons = tabularTrack ? getLearningLessonsForTrack(learningCatalog, tabularTrack) : [];
  const practice = getLearningPracticeForDomain(learningCatalog, 'reinforcement-learning');

  assert.deepEqual(
    lessons.map((lesson) => lesson.id),
    ['rl-mdp-basics', 'rl-bellman', 'rl-q-learning', 'rl-sarsa'],
  );
  assert.deepEqual(policyTrack?.lessonIds, ['rl-mdp-basics', 'rl-q-learning', 'rl-sarsa']);
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
