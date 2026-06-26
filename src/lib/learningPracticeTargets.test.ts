import test from 'node:test';
import assert from 'node:assert/strict';

import { learningCatalog } from '../core/learning/content/index.ts';
import { resolveTensorPracticeTarget } from '../core/learning/selectors.ts';

test('resolves Conv2d shape and value exercises to the CV convolution lesson', () => {
  assert.deepEqual(
    resolveTensorPracticeTarget(learningCatalog, { exerciseId: 'shape-output', operation: 'Conv2d' }),
    {
      domainId: 'cv',
      trackId: 'cnn-shape-value',
      lessonId: 'conv2d-output',
      practiceId: 'conv2d-shape-output',
    },
  );

  assert.deepEqual(
    resolveTensorPracticeTarget(learningCatalog, { exerciseId: 'conv-value', operation: 'Conv2d' }),
    {
      domainId: 'cv',
      trackId: 'cnn-shape-value',
      lessonId: 'conv2d-output',
      practiceId: 'conv2d-value-window',
    },
  );
});

test('resolves pooling shape and value exercises to the CV pooling lesson', () => {
  assert.deepEqual(
    resolveTensorPracticeTarget(learningCatalog, { exerciseId: 'shape-output', operation: 'MaxPool2d' }),
    {
      domainId: 'cv',
      trackId: 'cnn-shape-value',
      lessonId: 'pooling-output',
      practiceId: 'pool-shape-output',
    },
  );

  assert.deepEqual(
    resolveTensorPracticeTarget(learningCatalog, { exerciseId: 'pool-value', operation: 'AvgPool2d' }),
    {
      domainId: 'cv',
      trackId: 'cnn-shape-value',
      lessonId: 'pooling-output',
      practiceId: 'pool-value-window',
    },
  );
});

test('resolves approved ReLU value practice and ignores unavailable Linear practice', () => {
  assert.deepEqual(
    resolveTensorPracticeTarget(learningCatalog, { exerciseId: 'activation-value', operation: 'ReLU' }),
    {
      domainId: 'fundamentals',
      trackId: 'value-flow',
      lessonId: 'linear-activation',
      practiceId: 'activation-value-pass',
    },
  );

  assert.equal(
    resolveTensorPracticeTarget(learningCatalog, { exerciseId: 'linear-value', operation: 'Linear' }),
    null,
  );
});
