import test from 'node:test';
import assert from 'node:assert/strict';

import {
  APP_ROUTES,
  getLearningDomainPath,
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

test('app route helpers build Learning Lab domain and track paths', () => {
  assert.equal(getLearningDomainPath('cv'), '/learning/cv');
  assert.equal(
    getLearningTrackPath('reinforcement-learning', 'tabular-control'),
    '/learning/reinforcement-learning/tabular-control',
  );
});

test('legacy RL roadmap URLs map into Learning Lab domain routes', () => {
  assert.equal(getLegacyReinforcementLearningRedirectPath(), '/learning/reinforcement-learning/tabular-control');
  assert.equal(
    getLegacyReinforcementLearningRedirectPath('tabular-control'),
    '/learning/reinforcement-learning/tabular-control',
  );
  assert.equal(
    getLegacyReinforcementLearningRedirectPath('policy-behavior'),
    '/learning/reinforcement-learning/policy-behavior',
  );
  assert.equal(getLegacyReinforcementLearningRedirectPath('reinforcement-learning'), '/learning/reinforcement-learning');
  assert.equal(getLegacyReinforcementLearningRedirectPath('robot-learning'), '/learning/robot-learning');
});
