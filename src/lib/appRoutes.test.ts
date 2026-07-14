import test from 'node:test';
import assert from 'node:assert/strict';

import {
  APP_ROUTES,
  getLearningDomainPath,
  getHashRouterUrl,
  getLearningLessonPath,
  getLearningTrackPath,
  getLegacyReinforcementLearningRedirectPath,
} from './appRoutes.ts';

test('app route helpers declare the top-level routes used by AppShell', () => {
  assert.equal(APP_ROUTES.landing, '/');
  assert.equal(APP_ROUTES.workspace, '/workspace');
  assert.equal(APP_ROUTES.learning, '/learning');
  assert.equal(APP_ROUTES.learningDomain, '/learning/:domainId');
  assert.equal(APP_ROUTES.learningTrack, '/learning/:domainId/:trackId');
  assert.equal(APP_ROUTES.legacyReinforcementLearning, '/reinforcement-learning');
  assert.equal(APP_ROUTES.legacyReinforcementLearningTrack, '/reinforcement-learning/roadmap/:trackId');
});

test('app route helpers build canonical and legacy Learning Lab URLs', () => {
  assert.equal(getLearningDomainPath('cv'), '/learning/cv');
  assert.equal(
    getLearningTrackPath('reinforcement-learning', 'tabular-control'),
    '/learning/reinforcement-learning/tabular-control',
  );
  assert.equal(
    getLearningLessonPath('cv', 'cnn-shape-value', 'conv2d-shape-exercise'),
    '/learning/cv/cnn-shape-value?lesson=conv2d-shape-exercise',
  );
  assert.equal(
    getHashRouterUrl('https://example.com/torchviz/#/workspace', '/learning/cv/cnn-shape-value?lesson=conv2d-shape-exercise'),
    'https://example.com/torchviz/#/learning/cv/cnn-shape-value?lesson=conv2d-shape-exercise',
  );
  const legacyCases: Array<[string | undefined, string]> = [
    [undefined, '/learning/reinforcement-learning/rl-fundamentals'],
    ['tabular-control', '/learning/reinforcement-learning/rl-fundamentals'],
    ['policy-behavior', '/learning/reinforcement-learning/value-based-methods'],
    ['reinforcement-learning', '/learning/reinforcement-learning'],
    ['robot-learning', '/learning/robot-learning'],
  ];
  for (const [trackId, expected] of legacyCases) {
    assert.equal(getLegacyReinforcementLearningRedirectPath(trackId), expected, `legacy route: ${trackId ?? 'default'}`);
  }
});
