import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { discoverLearningMdxFiles, inspectLearningMdx, validateLearningMdxFiles, validateLearningMdxSource } from '../../scripts/learningContentMdx.ts';
import { learningCatalog } from '../content/learning/index.ts';
import { parseLearningMdxPath } from '../core/learning/mdxContract.ts';
import { getAllowedLearningMdxComponentNames } from '../content/learning/mdxComponents.ts';
import type { LearningCatalog } from '../core/learning/types.ts';

const lessonFiles = discoverLearningMdxFiles('src/content/learning');
const publishedLessonIds = learningCatalog.lessons
  .filter((lesson) => lesson.contentStatus === 'published')
  .map((lesson) => lesson.id);
const llmLessonIds = new Set(
  learningCatalog.lessons
    .filter((lesson) => lesson.domainId === 'llm-ai-engineering')
    .map((lesson) => lesson.id),
);
const lessonPageCaps = new Map([
  ['ar-language-model-inference-pipeline', 7],
  ['llm-training-data', 7],
]);

test('Learning Lab MDX paths support optional chapter-and-node prefixes', () => {
  assert.deepEqual(
    parseLearningMdxPath('src/content/learning/llm-ai-engineering/1.1.6-language-modeling-next-token.vi.mdx'),
    { domainId: 'llm-ai-engineering', lessonId: 'language-modeling-next-token', locale: 'vi' },
  );
  assert.deepEqual(
    parseLearningMdxPath('src/content/learning/cv/conv2d-shape-exercise.vi.mdx'),
    { domainId: 'cv', lessonId: 'conv2d-shape-exercise', locale: 'vi' },
  );
});

test('every Learning Lab MDX file follows the generic catalog, locale, metadata, and component contract', async () => {
  assert.ok(lessonFiles.every((file) => file.endsWith('.mdx')));
  assert.deepEqual(lessonFiles.map((file) => parseLearningMdxPath(file)?.lessonId).sort(), publishedLessonIds.sort());
  const documents = await validateLearningMdxFiles(lessonFiles, learningCatalog);
  for (const lessonFile of lessonFiles) {
    const source = readFileSync(lessonFile, 'utf8');
    const parsed = parseLearningMdxPath(lessonFile);
    assert.ok(parsed, `Invalid Learning Lab MDX filename: ${lessonFile}`);
    const inspection = await inspectLearningMdx(source, lessonFile);
    assert.equal(inspection.metadata.domainId, parsed.domainId);
    assert.equal(inspection.metadata.id, parsed.lessonId);
    assert.equal(inspection.metadata.locale, parsed.locale);
    const pageCount = Number(inspection.metadata.pageCount ?? 1);
    const maxPageCount = lessonPageCaps.get(parsed.lessonId) ?? 6;
    assert.ok(pageCount >= 1 && pageCount <= maxPageCount, `${parsed.lessonId} pageCount out of bounds: ${pageCount}`);
    if (pageCount > 1 && inspection.quizComponents.length === 0) {
      assert.deepEqual(inspection.pageIndexes, Array.from({ length: pageCount }, (_, index) => index));
    }
    if (parsed.domainId === 'cv') assert.equal(inspection.cvExerciseFixtures.length, 1);
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

test('generic MDX validation rejects missing, empty, and split quiz payloads', async () => {
  const filePath = 'src/content/learning/llm-ai-engineering/token-counting-hand-quiz.vi.mdx';
  const metadata = "export const lessonMetadata = { domainId: 'llm-ai-engineering', id: 'token-counting-hand-quiz', locale: 'vi', title: 'Quiz', headings: ['Q1'], keywords: ['quiz'], pageCount: 1 }";

  await assert.rejects(
    () => validateLearningMdxSource(`${metadata}

<MdxPage page={0} />`, filePath, learningCatalog),
    /require exactly one MdxQuiz component/,
  );

  await assert.rejects(
    () => validateLearningMdxSource(`${metadata}

<MdxQuiz id="empty-quiz" questions={[]} />`, filePath, learningCatalog),
    /non-empty questions array/,
  );

  await assert.rejects(
    () => validateLearningMdxSource(`${metadata}

<MdxQuiz id="first-quiz" questions={[{ id: 'q1', title: 'Q1', prompt: 'Chọn', mode: 'single', options: [{ id: 'a', label: 'Đúng', isCorrect: true }, { id: 'b', label: 'Sai' }], success: 'Đúng', error: 'Sai' }]} />
<MdxQuiz id="second-quiz" questions={[{ id: 'q1', title: 'Q1', prompt: 'Chọn', mode: 'single', options: [{ id: 'i', label: 'Đúng', isCorrect: true }, { id: 'j', label: 'Sai' }], success: 'Đúng', error: 'Sai' }]} />`, filePath, learningCatalog),
    /require exactly one MdxQuiz component/,
  );
});

test('generic MDX validation rejects quiz options that cannot render', async () => {
  const source = `export const lessonMetadata = { domainId: 'llm-ai-engineering', id: 'token-counting-hand-quiz', locale: 'vi', title: 'Quiz', headings: ['Q1', 'Q2', 'Q3', 'Q4'], keywords: ['quiz'], pageCount: 4 }

<MdxQuiz id="invalid-quiz" questions={[
  { id: 'q1', title: 'Q1', prompt: 'Chọn', mode: 'single', options: ['A', 'B'], success: 'Đúng', error: 'Sai' },
  { id: 'q2', title: 'Q2', prompt: 'Chọn', mode: 'single', options: [{ id: 'q2-a', label: 'A', isCorrect: true }, { id: 'q2-b', label: 'B' }], success: 'Đúng', error: 'Sai' },
  { id: 'q3', title: 'Q3', prompt: 'Chọn', mode: 'single', options: [{ id: 'q3-a', label: 'A', isCorrect: true }, { id: 'q3-b', label: 'B' }], success: 'Đúng', error: 'Sai' },
  { id: 'q4', title: 'Q4', prompt: 'Chọn', mode: 'single', options: [{ id: 'q4-a', label: 'A', isCorrect: true }, { id: 'q4-b', label: 'B' }], success: 'Đúng', error: 'Sai' },
]} />`;
  await assert.rejects(
    () => validateLearningMdxSource(source, 'src/content/learning/llm-ai-engineering/token-counting-hand-quiz.vi.mdx', learningCatalog),
    /options must be objects/,
  );
});

test('generic MDX validation enforces the complete authored Quiz contract', async () => {
  const makeQuestions = () => Array.from({ length: 4 }, (_, index) => ({
    id: `q${index + 1}`,
    title: `Q${index + 1}`,
    prompt: 'Chọn đáp án đúng',
    mode: 'single',
    options: [
      { id: `q${index + 1}-correct`, label: 'Đúng', isCorrect: true },
      { id: `q${index + 1}-wrong`, label: 'Sai' },
    ],
    success: 'Đúng vì đáp án thỏa contract.',
    error: 'Chưa đúng vì đáp án vi phạm contract.',
  }));
  const sourceFor = (questions: unknown[]) => `export const lessonMetadata = { domainId: 'llm-ai-engineering', id: 'token-counting-hand-quiz', locale: 'vi', title: 'Quiz', headings: ${JSON.stringify(questions.map((_, index) => `Q${index + 1}`))}, keywords: ['quiz'], pageCount: ${questions.length} }

<MdxQuiz id="contract-quiz" questions={${JSON.stringify(questions)}} />`;
  const filePath = 'src/content/learning/llm-ai-engineering/token-counting-hand-quiz.vi.mdx';

  await assert.rejects(
    () => validateLearningMdxSource(sourceFor(makeQuestions().slice(0, 3)), filePath, learningCatalog),
    /require 4 or 5 questions/,
  );

  const wrongMode = makeQuestions();
  wrongMode[0].mode = 'multi';
  await assert.rejects(
    () => validateLearningMdxSource(sourceFor(wrongMode), filePath, learningCatalog),
    /single-choice mode/,
  );

  const noCorrect = makeQuestions();
  noCorrect[0].options[0].isCorrect = false;
  await assert.rejects(
    () => validateLearningMdxSource(sourceFor(noCorrect), filePath, learningCatalog),
    /exactly one correct option/,
  );

  const duplicateOptionId = makeQuestions();
  duplicateOptionId[1].options[0].id = duplicateOptionId[0].options[0].id;
  await assert.rejects(
    () => validateLearningMdxSource(sourceFor(duplicateOptionId), filePath, learningCatalog),
    /option ids must be unique within the lesson/,
  );

  const emptyFeedback = makeQuestions();
  emptyFeedback[0].error = '';
  await assert.rejects(
    () => validateLearningMdxSource(sourceFor(emptyFeedback), filePath, learningCatalog),
    /requires string error/,
  );
});

test('all LLM tracks enforce focused pages and local media contracts', async () => {
  const scopedFiles = lessonFiles.filter((file) => {
    const parsed = parseLearningMdxPath(file);
    return parsed?.domainId === 'llm-ai-engineering' && llmLessonIds.has(parsed.lessonId);
  });
  assert.equal(scopedFiles.length, 201);

  for (const file of scopedFiles) {
    const source = readFileSync(file, 'utf8');
    const parsed = parseLearningMdxPath(file);
    assert.ok(parsed);
    const inspection = await inspectLearningMdx(source, file, parsed.domainId);
    const pageCount = Number(inspection.metadata.pageCount ?? 1);
    const maxPageCount = lessonPageCaps.get(parsed.lessonId) ?? 6;
    assert.ok(pageCount <= maxPageCount, `${parsed.lessonId} exceeds its ${maxPageCount}-page lesson cap`);
    assert.doesNotMatch(source, /(?:"src"\s*:|src=)\s*["']https?:\/\//i, `${parsed.lessonId} uses a remote image`);
  }
});

test('generic MDX contract accepts negative numeric literals but rejects other unary expressions', async () => {
  const metadata = "{ domainId: 'cv', id: 'x', locale: 'vi', title: 'x', headings: ['x'], keywords: ['x'] }";
  const inspection = await inspectLearningMdx(`export const lessonMetadata = ${metadata}\n\n<MdxPage page={-1} />`, 'fixture.mdx', 'cv');
  assert.deepEqual(inspection.pageIndexes, [-1]);
  await assert.rejects(
    () => inspectLearningMdx(`export const lessonMetadata = { domainId: 'cv', id: 'x', locale: 'vi', title: +1, headings: ['x'], keywords: ['x'] }`, 'fixture.mdx', 'cv'),
    /executable|unsupported/i,
  );
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
  const contract = readFileSync('src/core/learning/mdxContract.ts', 'utf8');
  const tooling = readFileSync('scripts/learningContentMdx.ts', 'utf8');
  for (const source of [detail, rail, contract, tooling]) {
    assert.doesNotMatch(source, /llm-ai-engineering|renderLlm|virtual:llm/);
  }
});

test('migrated MDX lessons no longer have duplicate legacy extras or pilot renderer code', () => {
  const renderer = [
    'conceptRenderers.tsx',
    'languageModelRenderers.tsx',
    'tokenizerRenderers.tsx',
  ].map((fileName) => readFileSync(`src/components/learning/domains/llm-ai-engineering/${fileName}`, 'utf8')).join('\n');
  assert.equal(existsSync('src/content/learning/llm-ai-engineering/extras.ts'), false);
  assert.doesNotMatch(renderer, /colab-coding-requirements/);
});
