import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

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
    getLearningMdxRuntimeCapabilities('<OrthogonalityExplorer ariaLabel="orthogonality" />', 'linear-algebra', 'orthogonality', references),
    { needsDomainAdapter: true, needsReferenceRuntime: false },
  );
  assert.deepEqual(
    getLearningMdxRuntimeCapabilities('<MdxQuiz questions={[]} />', 'linear-algebra', 'vectors-intuition-quiz', references),
    { needsDomainAdapter: false, needsReferenceRuntime: false },
  );
  assert.deepEqual(
    getLearningMdxRuntimeCapabilities('<VectorPlane x={3} y={2} />', 'linear-algebra', 'vectors-intuition', references),
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
    getLearningMdxRuntimeCapabilities('<StageContinuityMap items={[]} ariaLabel="Stages" />', 'continual-learning-llm', 'continuity-stages', new Set()),
    { needsDomainAdapter: true, needsReferenceRuntime: false },
  );
  assert.deepEqual(
    getLearningMdxRuntimeCapabilities('<Cite paper="lora" />', 'continual-learning-llm', 'lora-analysis', new Set()),
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

test('learningMdxRegistry enforces lazy boundaries for references and domain adapters', () => {
  const registrySource = readFileSync('src/components/learning/learningMdxRegistry.tsx', 'utf8');

  // No static eager import of learningMdxReferences or Mafs
  assert.doesNotMatch(registrySource, /^import .* from '\.\/learningMdxReferences';/m);
  assert.doesNotMatch(registrySource, /^import .* from 'mafs';/m);

  // Reference components and continual learning adapter are dynamically imported
  assert.match(registrySource, /import\('\.\/learningMdxReferences'\)/);
  assert.match(registrySource, /import\('\.\/domains\/continual-learning-llm\/mdxComponents'\)/);
});

test('linear-algebra mdxComponents enforces module-level lazy boundaries without static renderers', () => {
  const adapterSource = readFileSync('src/components/learning/domains/linear-algebra/mdxComponents.tsx', 'utf8');

  // No static eager import of individual renderer modules
  assert.doesNotMatch(adapterSource, /^import .* from '\.\/(vector|matrix|system|space|orthogonality|determinant|eigen|svd|overview)Renderers';/m);
  assert.doesNotMatch(adapterSource, /^import .* from 'mafs';/m);

  // All 9 modules are loaded via dynamic import
  assert.match(adapterSource, /import\('\.\/vectorRenderers'\)/);
  assert.match(adapterSource, /import\('\.\/matrixRenderers'\)/);
  assert.match(adapterSource, /import\('\.\/systemRenderers'\)/);
  assert.match(adapterSource, /import\('\.\/spaceRenderers'\)/);
  assert.match(adapterSource, /import\('\.\/orthogonalityRenderers'\)/);
  assert.match(adapterSource, /import\('\.\/determinantRenderers'\)/);
  assert.match(adapterSource, /import\('\.\/eigenRenderers'\)/);
  assert.match(adapterSource, /import\('\.\/svdRenderers'\)/);
  assert.match(adapterSource, /import\('\.\/overviewRenderers'\)/);
});
