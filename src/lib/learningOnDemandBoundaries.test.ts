import test from 'node:test';
import assert from 'node:assert/strict';

import { getLearningMdxRuntimeCapabilities } from '../../scripts/learningContentMdx.ts';
import { isLearningTableOfContentsFile } from '../../scripts/learningHomeCatalog.ts';
import { getRetryableCachedPromise } from '../core/learning/retryablePromiseCache.ts';
import { getLearningLessonIdentity } from '../core/learning/lessonIdentity.ts';

test('retryable promise cache deduplicates in flight work and evicts failures', async () => {
  const cache = new Map<string, Promise<string>>();
  let attempts = 0;
  const load = () => {
    attempts += 1;
    return attempts === 1 ? Promise.reject(new Error('transient')) : Promise.resolve('ready');
  };

  const failed = getRetryableCachedPromise(cache, 'lesson', load);
  assert.equal(getRetryableCachedPromise(cache, 'lesson', load), failed);
  await assert.rejects(failed, /transient/);
  assert.equal(cache.has('lesson'), false);

  const retried = getRetryableCachedPromise(cache, 'lesson', load);
  assert.equal(await retried, 'ready');
  assert.equal(attempts, 2);
  assert.equal(getRetryableCachedPromise(cache, 'lesson', load), retried);
});

test('MDX runtime capabilities follow authored component use and canonical reference coverage', () => {
  const references = new Set(['continual-learning-llm/theory']);

  assert.deepEqual(
    getLearningMdxRuntimeCapabilities('<MdxQuiz question="Q" options={[]} />', 'linear-algebra', 'vectors', references),
    { needsDomainAdapter: true, needsReferenceRuntime: false },
  );
  assert.deepEqual(
    getLearningMdxRuntimeCapabilities('<LessonNote>Body</LessonNote>', 'cv', 'convolution', references),
    { needsDomainAdapter: false, needsReferenceRuntime: false },
  );
  assert.deepEqual(
    getLearningMdxRuntimeCapabilities('<CvExercise fixture={{}} />', 'cv', 'convolution-exercise', references),
    { needsDomainAdapter: true, needsReferenceRuntime: false },
  );
  assert.deepEqual(
    getLearningMdxRuntimeCapabilities('<MdxQuiz questions={[]} />', 'continual-learning-llm', 'theory-quiz', references),
    { needsDomainAdapter: false, needsReferenceRuntime: false },
  );
  assert.deepEqual(
    getLearningMdxRuntimeCapabilities('<LessonNote>Body</LessonNote>', 'continual-learning-llm', 'theory', references),
    { needsDomainAdapter: false, needsReferenceRuntime: true },
  );
  assert.deepEqual(
    getLearningMdxRuntimeCapabilities('<LlmTrainingComponents content={{}} />', 'llm-ai-engineering', 'training', references),
    { needsDomainAdapter: true, needsReferenceRuntime: false },
  );
});

test('TOC dev invalidation is limited to canonical table-of-contents files', () => {
  const root = '/repo/src/content/learning';
  assert.equal(isLearningTableOfContentsFile('/repo/src/content/learning/cv/table-of-contents.ts', root), true);
  assert.equal(isLearningTableOfContentsFile('/repo/src/content/learning/cv/lesson.vi.mdx', root), false);
  assert.equal(isLearningTableOfContentsFile('/repo/other/table-of-contents.ts', root), false);
});

test('lesson UI identity includes the domain and cannot collide across catalogs', () => {
  assert.notEqual(
    getLearningLessonIdentity({ domainId: 'cv', id: 'introduction' }),
    getLearningLessonIdentity({ domainId: 'linear-algebra', id: 'introduction' }),
  );
});
