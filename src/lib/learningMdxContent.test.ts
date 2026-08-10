import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { discoverLearningMdxFiles, inspectLearningMdx, validateLearningMdxFiles, validateLearningMdxSource } from '../../scripts/learningContentMdx.ts';
import { learningCatalog } from '../content/learning/index.ts';
import { continualLearningLessonPairs } from '../content/learning/continual-learning-llm/table-of-contents.ts';
import { getLearningMdxComponentNames, parseLearningMdxPath } from '../core/learning/mdxContract.ts';
import { getAllowedLearningMdxComponentNames } from '../content/learning/mdxComponents.ts';
import type { LearningCatalog } from '../core/learning/types.ts';

const lessonFiles = discoverLearningMdxFiles('src/content/learning');
const publishedLessonIds = learningCatalog.lessons
  .filter((lesson) => lesson.contentStatus === 'published')
  .map((lesson) => lesson.id);
const expectedPageCounts: Record<string, number> = {
  'minimal-llm-project-skeleton': 1,
  'llm-from-scratch-roadmap': 3,
  'llm-component-checkpoint-quiz': 3,
  'llm-system-components': 3,
  'llm-system-components-quiz': 3,
  'language-modeling-next-token': 5,
  'language-modeling-next-token-quiz': 5,
  'ar-language-model-inference-pipeline': 6,
  'ar-language-model-inference-pipeline-quiz': 5,
  'llm-output-head-and-loss': 6,
  'llm-output-head-and-loss-quiz': 4,
  'llm-next-token-loss': 3,
  'llm-next-token-loss-quiz': 7,
  'llm-scale-and-development': 4,
  'llm-scale-and-development-quiz': 3,
  'llm-data-pipeline-overview': 9,
  'llm-data-pipeline-checkpoint-quiz': 9,
  'loss-perplexity-hand-calculation': 4,
  'benchmark-likelihood-quiz': 8,
  'evaluation-beyond-perplexity': 2,
  'tokenization-why-it-matters': 2,
  'tokenization-why-it-matters-quiz': 4,
  'tokenizer-regex-from-scratch': 6,
  'tokenizer-regex-from-scratch-quiz': 5,
  'tokenization-bpe-tiktoken': 4,
  'tokenization-bpe-tiktoken-quiz': 4,
  'tokenization-token-ids-vocabulary': 4,
  'tokenization-raw-text-to-token-ids': 5,
  'tokenization-token-ids-vocabulary-quiz': 4,
  'llm-evaluation-foundations': 1,
  'evaluation-dataset-design': 1,
  'deterministic-and-reference-metrics': 1,
  'human-evaluation-rubrics': 1,
  'inter-rater-agreement': 1,
  'pointwise-and-pairwise-evaluation': 1,
  'llm-as-a-judge': 1,
  'llm-judge-biases': 1,
  'benchmark-selection-and-contamination': 1,
  'hallucination-and-factuality-evaluation': 1,
  'rag-evaluation': 1,
  'llm-safety-foundations': 1,
  'refusal-calibration': 1,
  'toxicity-bias-and-privacy': 1,
  'jailbreak-and-prompt-injection': 1,
  'guardrails-for-llm-applications': 1,
  'llm-red-teaming': 1,
  'production-regression-evals': 1,
  'evaluation-ab-testing': 1,
  'evaluation-harness-code': 1,
  'conv2d-shape-exercise': 1,
  'conv2d-value-exercise': 1,
  'pooling-shape-exercise': 1,
  'pooling-value-exercise': 1,
  'vectors-intuition': 6,
  'vector-operations': 6,
  'dot-product': 6,
  'vector-norms': 6,
  'unit-vectors-normalization': 5,
  'cosine-similarity': 5,
  'orthogonality': 5,
  'matrix-operations': 6,
  'elementwise-vs-matrix-product': 6,
  'systems-of-linear-equations': 6,
  'gaussian-elimination': 6,
  'lu-decomposition': 6,
  'identity-inverse-matrix': 6,
  'continual-learning-llm-overview': 4,
  'stability-plasticity-dilemma': 2,
  'cl-settings-til-dil-cil': 4,
  'continual-learning-llm-overview-quiz': 7,
  'catastrophic-forgetting-in-llms': 1,
  'catastrophic-forgetting-in-llms-quiz': 4,
  'catastrophic-forgetting-code-lab': 7,
  'catastrophic-forgetting-code-lab-quiz': 4,
  'cl-methods-taxonomy-and-replay': 1,
  'cl-methods-taxonomy-and-replay-quiz': 3,
  'replay-introduction': 2,
  'replay-introduction-quiz': 3,
  'replay-experience-code-lab': 15,
  'replay-experience-code-lab-quiz': 15,
};
const expectedQuizQuestionIds: Record<string, string[]> = {
  'catastrophic-forgetting-code-lab-quiz': ['code-lab-forgetting-phenomenon', 'code-lab-cause-of-forgetting', 'code-lab-metric-sensitivity', 'code-lab-solutions-forward'],
  'catastrophic-forgetting-in-llms-quiz': ['catastrophic-forgetting-definition', 'why-new-task-causes-forgetting', 'llm-cl-unique-challenges', 'pattern-and-accuracy-behavior'],
  'continual-learning-llm-overview-quiz': ['statically-pretrained-nature', 'why-static-llm-insufficient', 'why-not-retrain-from-scratch', 'cl-core-goal', 'cl-core-challenge', 'lifelong-learning-analogy', 'method-choice'],
  'cl-methods-taxonomy-and-replay-quiz': ['cl-method-families', 'optimization-based-cl', 'representation-based-cl'],
  'replay-introduction-quiz': ['replay-training-objective', 'replay-constraints', 'replay-bound-tradeoff'],
  'replay-experience-code-lab-quiz': ['replay-lab-comparison', 'replay-lab-environment-config', 'replay-lab-data-separation', 'replay-lab-tokenization-pipeline', 'replay-lab-evaluation-metrics', 'replay-lab-training-helper', 'replay-lab-naive-result', 'replay-lab-buffer-composition', 'replay-lab-retention-result', 'replay-lab-spurious-forgetting-nuance', 'replay-lab-operational-takeaway', 'replay-lab-multiseed-design', 'replay-lab-threshold-evidence', 'replay-lab-paper-mapping', 'replay-lab-paper-scope'],
  'llm-component-checkpoint-quiz': ['ai-hierarchy-order', 'choose-problem-domain', 'role-domain-convention'],
  'llm-system-components-quiz': ['classify-system-components', 'academia-focus', 'industry-focus'],
  'language-modeling-next-token-quiz': ['technical-understanding', 'language-modeling-definition', 'llm-learning-objective', 'valid-token-examples', 'chain-rule-result'],
  'ar-language-model-inference-pipeline-quiz': ['ar-inference-order', 'sampling-role', 'corpus-vocabulary', 'output-vector-length', 'probability-sum'],
  'llm-output-head-and-loss-quiz': ['context-vector-role', 'projection-shape', 'logits-properties', 'softmax-role'],
  'llm-next-token-loss-quiz': ['shifted-target', 'one-hot-target', 'loss-behavior', 'manual-loss', 'why-log', 'negative-sign', 'sequence-loss'],
  'llm-scale-and-development-quiz': ['why-large', 'scale-comparison', 'popularity-factors'],
  'llm-data-pipeline-checkpoint-quiz': ['pretraining-facts', 'finetuning-facts', 'training-stage-task-match', 'transformer-main-blocks', 'encoder-input-prep-order', 'why-position-embedding', 'encoder-context', 'decoder-input-prep', 'decoder-generation-loop'],
  'tokenization-why-it-matters-quiz': ['word-level-limitations', 'two-extremes', 'subword-benefit', 'sequence-length-cost'],
  'tokenizer-regex-from-scratch-quiz': ['capturing-whitespace', 'punctuation-split-output', 'cleanup-comprehension', 'tokenize-function', 'regex-limitations'],
  'tokenization-bpe-tiktoken-quiz': ['bpe-initialization', 'bpe-training-loop', 'merge-rank-inference', 'tokenization-limitations'],
  'tokenization-token-ids-vocabulary-quiz': ['vocabulary-lookup', 'token-id-meaning', 'token-id-context', 'text-id-round-trip'],
  'benchmark-likelihood-quiz': ['nll-and-ppl', 'ground-truth-probability', 'length-normalization', 'interpret-ppl-four', 'ppl-dependencies', 'valid-ppl-comparison', 'ppl-versus-reasoning', 'ppl-current-role'],
};

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

test('continual-learning MDX filenames mirror chapter and TOC order', () => {
  const tracks = learningCatalog.tracks.filter((track) => track.domainId === 'continual-learning-llm');
  const expectedFilenames = tracks.flatMap((track, chapterIndex) => (
    track.lessonIds.map((lessonId, nodeIndex) => `${chapterIndex + 1}.1.${nodeIndex + 1}-${lessonId}.vi.mdx`)
  ));
  const actualFilenames = lessonFiles
    .filter((file) => parseLearningMdxPath(file)?.domainId === 'continual-learning-llm')
    .map((file) => file.replaceAll('\\', '/').split('/').at(-1));

  assert.deepEqual(actualFilenames.sort(), expectedFilenames.sort());
});

test('every Learning Lab MDX file follows the generic catalog, locale, metadata, and component contract', async () => {
  assert.equal(lessonFiles.length, 143);
  assert.ok(lessonFiles.every((file) => file.endsWith('.vi.mdx')));
  assert.deepEqual(lessonFiles.map((file) => parseLearningMdxPath(file)?.lessonId).sort(), publishedLessonIds.sort());
  const documents = await validateLearningMdxFiles(lessonFiles, learningCatalog);
  assert.equal(documents.length, 143);
  for (const lessonFile of lessonFiles) {
    const source = readFileSync(lessonFile, 'utf8');
    const parsed = parseLearningMdxPath(lessonFile);
    assert.ok(parsed, `Invalid Learning Lab MDX filename: ${lessonFile}`);
    const inspection = await inspectLearningMdx(source, lessonFile);
    assert.equal(inspection.metadata.domainId, parsed.domainId);
    assert.equal(inspection.metadata.id, parsed.lessonId);
    assert.equal(inspection.metadata.locale, parsed.locale);
    const expectedPageCount = expectedPageCounts[parsed.lessonId] ?? Number(inspection.metadata.pageCount ?? 1);
    assert.equal(Number(inspection.metadata.pageCount ?? 1), expectedPageCount);
    if (expectedPageCount > 1 && !inspection.quizQuestionIds.length) {
      assert.deepEqual(inspection.pageIndexes, Array.from({ length: expectedPageCount }, (_, index) => index));
    }
    if (expectedQuizQuestionIds[parsed.lessonId]) assert.deepEqual(inspection.quizQuestionIds, expectedQuizQuestionIds[parsed.lessonId]);
    if (parsed.domainId === 'cv') assert.equal(inspection.cvExerciseFixtures.length, 1);
    const allowedComponents = new Set(getAllowedLearningMdxComponentNames(parsed.domainId));
    for (const componentName of getLearningMdxComponentNames(source)) assert.ok(allowedComponents.has(componentName), `Unexpected Learning Lab MDX component: ${componentName}`);
  }
  const requirements = documents.find((document) => document.lessonId === 'minimal-llm-project-skeleton')?.text ?? '';
  for (const requirement of ['Google Colab', 'Python', 'uv', 'VSCode']) assert.match(requirements, new RegExp(requirement));
});

test('published continual-learning pairs map theory concepts to quiz questions exactly', async () => {
  const domainFiles = lessonFiles.filter((file) => parseLearningMdxPath(file)?.domainId === 'continual-learning-llm');
  const inspectionByLessonId = new Map<string, Awaited<ReturnType<typeof inspectLearningMdx>>>();

  for (const file of domainFiles) {
    const parsed = parseLearningMdxPath(file);
    assert.ok(parsed);
    inspectionByLessonId.set(parsed.lessonId, await inspectLearningMdx(readFileSync(file, 'utf8'), file));
  }

  for (const pair of continualLearningLessonPairs) {
    const theory = learningCatalog.lessons.find((lesson) => lesson.domainId === 'continual-learning-llm' && lesson.id === pair.theory.id);
    const quiz = learningCatalog.lessons.find((lesson) => lesson.domainId === 'continual-learning-llm' && lesson.id === pair.quiz.id);
    assert.ok(theory);
    assert.ok(quiz);
    if (theory.contentStatus !== 'published') continue;

    const theoryInspection = inspectionByLessonId.get(pair.theory.id);
    const quizInspection = inspectionByLessonId.get(pair.quiz.id);
    assert.ok(theoryInspection, `published theory ${pair.theory.id} needs an MDX file`);
    assert.ok(quizInspection, `published quiz ${pair.quiz.id} needs an MDX file`);
    const theoryConceptIds = theoryInspection.metadata.conceptIds;
    assert.ok(Array.isArray(theoryConceptIds) && theoryConceptIds.length, `${pair.theory.id} needs conceptIds`);
    assert.deepEqual(quizInspection.metadata.conceptIds, theoryConceptIds);
    assert.deepEqual(quizInspection.quizQuestionIds, theoryConceptIds);
  }
});

test('continual-learning quizzes vary correct positions and keep one defensible answer shape', async () => {
  const quizInspections = await Promise.all(continualLearningLessonPairs.map(async (pair) => {
    const file = lessonFiles.find((candidate) => parseLearningMdxPath(candidate)?.lessonId === pair.quiz.id);
    assert.ok(file, `missing quiz MDX for ${pair.quiz.id}`);
    return inspectLearningMdx(readFileSync(file, 'utf8'), file);
  }));
  const questions = quizInspections.flatMap((inspection) => inspection.quizQuestions);
  const singleQuestions = questions.filter((question) => question.mode === 'single');
  const multiQuestions = questions.filter((question) => question.mode === 'multi');

  assert.equal(questions.length, 150);
  assert.equal(singleQuestions.length, 149);
  assert.equal(multiQuestions.length, 1);
  assert.equal(multiQuestions[0]?.id, 'replay-constraints');
  assert.ok(questions.every((question) => question.optionCount === 4));
  assert.ok(singleQuestions.every((question) => question.correctOptionIndexes.length === 1));
  assert.equal(multiQuestions[0]?.correctOptionIndexes.length, 2);

  for (const inspection of quizInspections) {
    const usedPositions = new Set(inspection.quizQuestions.flatMap((question) => question.correctOptionIndexes));
    assert.equal(
      usedPositions.size,
      Math.min(inspection.quizQuestions.length, 4),
      `${String(inspection.metadata.id)} should vary correct answers across A–D`,
    );

    const singlePositions = inspection.quizQuestions.map((question) => (
      question.correctOptionIndexes.length === 1 ? question.correctOptionIndexes[0] : null
    ));
    for (let index = 0; index + 2 < singlePositions.length; index += 1) {
      const window = singlePositions.slice(index, index + 3);
      if (window.some((position) => position === null)) continue;
      const [first, second, third] = window as [number, number, number];
      const firstStep = (second - first + 4) % 4;
      const secondStep = (third - second + 4) % 4;
      assert.ok(
        !(firstStep === secondStep && (firstStep === 1 || firstStep === 3)),
        `${String(inspection.metadata.id)} should not expose a cyclic three-answer pattern`,
      );
    }
  }

  const singlePositionCounts = [0, 0, 0, 0];
  const allCorrectFlagCounts = [0, 0, 0, 0];
  for (const question of questions) {
    for (const index of question.correctOptionIndexes) {
      allCorrectFlagCounts[index] += 1;
      if (question.mode === 'single') singlePositionCounts[index] += 1;
    }
  }
  assert.deepEqual([...singlePositionCounts].sort((a, b) => a - b), [37, 37, 37, 38]);
  assert.deepEqual([...allCorrectFlagCounts].sort((a, b) => a - b), [37, 38, 38, 38]);

  const sequenceCounts = new Map<string, number>();
  for (const inspection of quizInspections) {
    const sequence = inspection.quizQuestions
      .map((question) => question.correctOptionIndexes.join(''))
      .join('|');
    sequenceCounts.set(sequence, (sequenceCounts.get(sequence) ?? 0) + 1);
  }
  assert.ok(Math.max(...sequenceCounts.values()) <= 3, 'quiz files should not restart one predictable answer sequence');
});

test('generic MDX contract rejects imports, executable expressions, and unknown components', async () => {
  const metadata = "{ domainId: 'cv', id: 'x', locale: 'vi', title: 'x', headings: ['x'], keywords: ['x'] }";
  await assert.rejects(() => inspectLearningMdx(`import X from './x'\n\nexport const lessonMetadata = ${metadata}\n\n<X />`, 'fixture.mdx', 'cv'), /imports|unexpected|parse import/i);
  await assert.rejects(() => inspectLearningMdx("export const lessonMetadata = { domainId: 'cv', id: 'x', locale: 'vi', title: run(), headings: ['x'], keywords: ['x'] }", 'fixture.mdx', 'cv'), /executable|unsupported/i);
  await assert.rejects(() => inspectLearningMdx(`export const lessonMetadata = ${metadata};\n\n<Unknown />`, 'fixture.mdx', 'cv'), /unexpected MDX component/i);
});

test('shared visual primitives accept static semantic data', async () => {
  const metadata = "{ domainId: 'cv', id: 'x', locale: 'vi', title: 'x', headings: ['x'], keywords: ['x'] }";
  const source = `export const lessonMetadata = ${metadata}

<ConceptFlow ariaLabel="Flow" items={[{ title: 'A', detail: 'B' }]} />
<ExperimentChecklist ariaLabel="Checklist" items={[{ title: 'A', action: 'B', check: 'C' }]} />
<ComparisonMatrix ariaLabel="Matrix" columns={['A']} rows={[{ label: 'B', values: ['C'], highlightedColumn: 0 }]} />
<DatasetComposition ariaLabel="Dataset" totalLabel="3 samples" segments={[{ label: 'A', value: 2, valueLabel: '2' }, { label: 'B', value: 1, valueLabel: '1', tone: 'accent' }]} />
<MetricBars ariaLabel="Metrics" items={[{ label: 'A', value: 75, valueLabel: '75%', tone: 'success' }]} />
<ConceptSpectrum ariaLabel="Spectrum" items={[{ label: 'A', detail: 'B' }]} />
<CourseCards ariaLabel="Cards" exampleLabel="Example" takeawayLabel="Impact" items={[{ title: 'A', example: 'B', takeaway: 'C' }]} />
<EvidenceCards ariaLabel="Evidence" items={[{ eyebrow: 'Experiment', value: '75%', label: 'Retention', insight: 'Replay helps.', tone: 'success' }]} />`;
  const inspection = await inspectLearningMdx(source, 'fixture.mdx', 'cv');
  assert.deepEqual(inspection.pageIndexes, []);
  assert.deepEqual(inspection.quizQuestionIds, []);
});

test('continual-learning visuals use global semantic primitives without shared domain leakage', () => {
  const sharedComponents = readFileSync('src/components/learning/learningMdxComponents.tsx', 'utf8');
  const continualSources = lessonFiles
    .filter((file) => parseLearningMdxPath(file)?.domainId === 'continual-learning-llm')
    .map((file) => readFileSync(file, 'utf8'))
    .join('\n');

  for (const componentName of ['ConceptFlow', 'ExperimentChecklist', 'ComparisonMatrix', 'DatasetComposition', 'MetricBars', 'ConceptSpectrum', 'CourseCards', 'EvidenceCards']) {
    assert.match(sharedComponents, new RegExp(`export function ${componentName}\\b`));
  }
  assert.match(sharedComponents, /aria-label=\{ariaLabel\}/);
  assert.match(sharedComponents, /<caption className="sr-only">\{ariaLabel\}<\/caption>/);
  assert.doesNotMatch(sharedComponents, /continual-learning-llm\./);
  assert.doesNotMatch(continualSources, /<RequirementsGrid|<RequirementCard|assetKey=/);
});

test('generic MDX contract rejects empty or duplicate concept ids', async () => {
  const metadata = "{ domainId: 'cv', id: 'x', locale: 'vi', title: 'x', headings: ['x'], keywords: ['x']";
  const catalogText = { title: { en: 'CV', vi: 'CV' }, description: { en: '', vi: '' } };
  const catalog: LearningCatalog = {
    domains: [{ id: 'cv', text: catalogText, status: 'active', trackIds: ['cv-basics'] }],
    tracks: [{ id: 'cv-basics', text: catalogText, domainId: 'cv', lessonIds: ['x'], status: 'available' }],
    lessons: [{ id: 'x', domainId: 'cv', trackId: 'cv-basics', status: 'available', contentStatus: 'published', tags: [], entryPoints: [], text: { title: { en: 'x', vi: 'x' }, theory: [] }, sections: [] }],
  };
  const filePath = 'src/content/learning/cv/x.vi.mdx';
  await assert.rejects(
    () => validateLearningMdxSource(`export const lessonMetadata = ${metadata}, conceptIds: [] }`, filePath, catalog),
    /conceptIds must be a non-empty string array/,
  );
  await assert.rejects(
    () => validateLearningMdxSource(`export const lessonMetadata = ${metadata}, conceptIds: ['same', 'same'] }`, filePath, catalog),
    /conceptIds must be unique/,
  );
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
  assert.deepEqual(getAllowedLearningMdxComponentNames('cv'), ['LessonNote', 'LessonImage', 'MdxQuiz', 'MdxPage', 'RequirementCard', 'RequirementsGrid', 'CourseCards', 'EvidenceCards', 'ConceptFlow', 'StageContinuityMap', 'ExperimentChecklist', 'SelfCheckList', 'ComparisonMatrix', 'PaperTradeoff', 'DatasetComposition', 'MetricBars', 'ConceptSpectrum', 'InlineMath', 'BlockMath', 'CvExercise']);
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
