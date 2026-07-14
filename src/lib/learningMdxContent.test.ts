import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { discoverLearningMdxFiles, inspectLearningMdx, validateLearningMdxFiles, validateLearningMdxSource } from '../../scripts/learningContentMdx.ts';
import { learningCatalog } from '../core/learning/content/index.ts';
import { getLearningMdxComponentNames, parseLearningMdxPath } from '../core/learning/content/mdxContract.ts';
import { getAllowedLearningMdxComponentNames } from '../core/learning/content/mdxDomains.ts';
import type { LearningCatalog } from '../core/learning/types.ts';

const lessonFiles = discoverLearningMdxFiles('src/content/learning');
const publishedLessonIds = learningCatalog.lessons
  .filter((lesson) => lesson.contentStatus === 'published')
  .map((lesson) => lesson.id);
const expectedPageCounts: Record<string, number> = {
  'minimal-llm-project-skeleton': 1,
  'llm-from-scratch-roadmap': 11,
  'llm-component-checkpoint-quiz': 5,
  'llm-data-pipeline-overview': 9,
  'llm-data-pipeline-checkpoint-quiz': 6,
  'conv2d-shape-exercise': 1,
  'conv2d-value-exercise': 1,
  'pooling-shape-exercise': 1,
  'pooling-value-exercise': 1,
};
const expectedQuizQuestionIds: Record<string, string[]> = {
  'llm-component-checkpoint-quiz': ['ai-hierarchy-order', 'llm-learning-objective', 'valid-token-examples', 'why-large', 'pattern-learning-fill'],
  'llm-data-pipeline-checkpoint-quiz': ['pretraining-facts', 'finetuning-facts', 'training-stage-task-match', 'transformer-main-blocks', 'encoder-input-prep-order', 'why-position-embedding'],
};

test('every Learning Lab MDX file follows the generic catalog, locale, metadata, and component contract', async () => {
  assert.equal(lessonFiles.length, 9);
  assert.ok(lessonFiles.every((file) => file.endsWith('.vi.mdx')));
  assert.deepEqual(lessonFiles.map((file) => parseLearningMdxPath(file)?.lessonId).sort(), publishedLessonIds.sort());
  const documents = await validateLearningMdxFiles(lessonFiles, learningCatalog);
  assert.equal(documents.length, 9);
  for (const lessonFile of lessonFiles) {
    const source = readFileSync(lessonFile, 'utf8');
    const parsed = parseLearningMdxPath(lessonFile);
    assert.ok(parsed, `Invalid Learning Lab MDX filename: ${lessonFile}`);
    const inspection = await inspectLearningMdx(source, lessonFile);
    assert.equal(inspection.metadata.domainId, parsed.domainId);
    assert.equal(inspection.metadata.id, parsed.lessonId);
    assert.equal(inspection.metadata.locale, parsed.locale);
    assert.equal(Number(inspection.metadata.pageCount ?? 1), expectedPageCounts[parsed.lessonId]);
    if (expectedPageCounts[parsed.lessonId] > 1 && !inspection.quizQuestionIds.length) {
      assert.deepEqual(inspection.pageIndexes, Array.from({ length: expectedPageCounts[parsed.lessonId] }, (_, index) => index));
    }
    if (expectedQuizQuestionIds[parsed.lessonId]) assert.deepEqual(inspection.quizQuestionIds, expectedQuizQuestionIds[parsed.lessonId]);
    if (parsed.domainId === 'cv') assert.equal(inspection.cvExerciseFixtures.length, 1);
    const allowedComponents = new Set(getAllowedLearningMdxComponentNames(parsed.domainId));
    for (const componentName of getLearningMdxComponentNames(source)) assert.ok(allowedComponents.has(componentName), `Unexpected Learning Lab MDX component: ${componentName}`);
  }
  const requirements = documents.find((document) => document.lessonId === 'minimal-llm-project-skeleton')?.text ?? '';
  for (const requirement of ['Google Colab', 'Python', 'uv', 'VSCode']) assert.match(requirements, new RegExp(requirement));
});

test('generic MDX contract rejects imports, executable expressions, and unknown components', async () => {
  const metadata = "{ domainId: 'cv', id: 'x', locale: 'vi', title: 'x', headings: ['x'], keywords: ['x'] }";
  await assert.rejects(() => inspectLearningMdx(`import X from './x'\n\nexport const lessonMetadata = ${metadata}\n\n<X />`, 'fixture.mdx', 'cv'), /imports|unexpected|parse import/i);
  await assert.rejects(() => inspectLearningMdx("export const lessonMetadata = { domainId: 'cv', id: 'x', locale: 'vi', title: run(), headings: ['x'], keywords: ['x'] }", 'fixture.mdx', 'cv'), /executable|unsupported/i);
  await assert.rejects(() => inspectLearningMdx(`export const lessonMetadata = ${metadata};\n\n<Unknown />`, 'fixture.mdx', 'cv'), /unexpected MDX component/i);
});

test('a Markdown-only CV lesson uses the generic contract without invoking its optional adapter', async () => {
  const cvLesson = learningCatalog.lessons.find((lesson) => lesson.domainId === 'cv');
  assert.ok(cvLesson);
  const source = `export const lessonMetadata = { domainId: 'cv', id: '${cvLesson.id}', locale: 'vi', title: 'Convolution', headings: ['Basics'], keywords: ['kernel'] }\n\n## Basics\n\nConvolution dùng một kernel trên ảnh.`;
  const fixtureCatalog: LearningCatalog = {
    domains: [learningCatalog.domains.find((domain) => domain.id === 'cv')!],
    tracks: learningCatalog.tracks.filter((track) => track.domainId === 'cv'),
    lessons: [{
      ...cvLesson,
      contentStatus: 'published',
      text: { title: { en: 'Convolution', vi: 'Convolution' }, theory: [] },
    }],
  };
  const document = await validateLearningMdxSource(source, `src/content/learning/cv/${cvLesson.id}.vi.mdx`, fixtureCatalog);
  assert.match(document.text, /Convolution dùng một kernel/);
  assert.deepEqual(getAllowedLearningMdxComponentNames('cv'), ['LessonNote', 'MdxQuiz', 'MdxPage', 'RequirementCard', 'RequirementsGrid', 'CvExercise']);
  await assert.rejects(
    () => inspectLearningMdx(`${source}\n\n<AiHierarchy content={{}} />`, `src/content/learning/cv/${cvLesson.id}.vi.mdx`, 'cv'),
    /unexpected MDX component AiHierarchy/,
  );
});

test('CV exercise validation requires one static fixture matching the catalog operation family', async () => {
  const lesson = learningCatalog.lessons.find((item) => item.id === 'conv2d-shape-exercise');
  assert.ok(lesson);
  const metadata = "{ domainId: 'cv', id: 'conv2d-shape-exercise', locale: 'vi', title: 'Bài tập output shape Conv2d', headings: ['Bài tập'], keywords: ['conv2d'] }";
  const path = 'src/content/learning/cv/conv2d-shape-exercise.vi.mdx';
  const catalog: LearningCatalog = {
    domains: [learningCatalog.domains.find((domain) => domain.id === 'cv')!],
    tracks: [learningCatalog.tracks.find((track) => track.id === 'cnn-shape-value')!],
    lessons: [lesson],
  };
  await assert.rejects(() => validateLearningMdxSource(`export const lessonMetadata = ${metadata}\n\n## Bài tập`, path, catalog), /one CvExercise fixture/);
  await assert.rejects(() => validateLearningMdxSource(`export const lessonMetadata = ${metadata}\n\n## Bài tập\n\n<CvExercise fixture={{ opType: 'MaxPool2d', inputShape: [1, 3, 8, 8], outputShape: [1, 3, 4, 4] }} />`, path, catalog), /operation does not match/);
});

test('generic validation rejects unknown catalog nodes, metadata drift, and duplicate locales', async () => {
  const validMetadata = "{ domainId: 'cv', id: 'convolution-basics', locale: 'vi', title: 'Convolution', headings: ['Basics'], keywords: ['kernel'] }";
  const catalogText = { title: { en: 'CV', vi: 'CV' }, description: { en: '', vi: '' } };
  const catalog: LearningCatalog = {
    domains: [{ id: 'cv', text: catalogText, status: 'active', trackIds: ['cv-basics'] }],
    tracks: [{ id: 'cv-basics', text: catalogText, domainId: 'cv', lessonIds: ['convolution-basics'], status: 'available' }],
    lessons: [{ id: 'convolution-basics', domainId: 'cv', trackId: 'cv-basics', status: 'available', contentStatus: 'published', tags: [], entryPoints: [], sections: [] }],
  };
  const filePath = 'src/content/learning/cv/convolution-basics.vi.mdx';
  await assert.doesNotReject(() => validateLearningMdxSource(`export const lessonMetadata = ${validMetadata}\n\n## Basics`, filePath, catalog));
  const titledCatalog: LearningCatalog = {
    ...catalog,
    lessons: [{ ...catalog.lessons[0], text: { title: { en: 'Convolution', vi: 'Tích chập' }, theory: [] } }],
  };
  await assert.rejects(
    () => validateLearningMdxSource(`export const lessonMetadata = ${validMetadata}\n\n## Basics`, filePath, titledCatalog),
    /title does not match the catalog/,
  );
  await assert.rejects(() => validateLearningMdxSource(`export const lessonMetadata = ${validMetadata}`, 'src/content/learning/unknown/convolution-basics.vi.mdx', catalog), /unknown Learning Lab domain/);
  await assert.rejects(() => validateLearningMdxSource(`export const lessonMetadata = ${validMetadata}`, 'src/content/learning/cv/missing.vi.mdx', catalog), /lesson does not exist/);
  await assert.rejects(() => validateLearningMdxSource(`export const lessonMetadata = ${validMetadata}`, 'src/content/learning/cv/convolution-basics.en.mdx', catalog), /metadata does not match/);
  await assert.rejects(() => validateLearningMdxFiles([lessonFiles[0], lessonFiles[0]], learningCatalog), /duplicate lesson locale/);
});

test('shared lesson assembly and search contain no LLM-specific branch or import', () => {
  const detail = readFileSync('src/components/learning/lesson/LessonDetail.tsx', 'utf8');
  const rail = readFileSync('src/components/learning/lesson/LessonRail.tsx', 'utf8');
  const contract = readFileSync('src/core/learning/content/mdxContract.ts', 'utf8');
  const tooling = readFileSync('scripts/learningContentMdx.ts', 'utf8');
  for (const source of [detail, rail, contract, tooling]) {
    assert.doesNotMatch(source, /llm-ai-engineering|renderLlm|virtual:llm/);
  }
});

test('migrated MDX lessons no longer have duplicate legacy extras or pilot renderer code', () => {
  const renderer = readFileSync('src/components/learning/domains/llm-ai-engineering/renderers.tsx', 'utf8');
  assert.equal(existsSync('src/core/learning/content/llm-ai-engineering/extras.ts'), false);
  assert.doesNotMatch(renderer, /colab-coding-requirements/);
});
