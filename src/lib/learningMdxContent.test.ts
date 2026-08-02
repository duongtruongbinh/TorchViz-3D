import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { discoverLearningMdxFiles, inspectLearningMdx, validateLearningMdxFiles, validateLearningMdxSource } from '../../scripts/learningContentMdx.ts';
import { learningCatalog } from '../content/learning/index.ts';
import { getLearningMdxComponentNames, parseLearningMdxPath } from '../core/learning/mdxContract.ts';
import { getAllowedLearningMdxComponentNames } from '../content/learning/mdxComponents.ts';
import type { LearningCatalog } from '../core/learning/types.ts';

const lessonFiles = discoverLearningMdxFiles('src/content/learning');
const publishedLessonKeys = learningCatalog.lessons
  .filter((lesson) => lesson.contentStatus === 'published')
  .map((lesson) => `${lesson.domainId}/${lesson.id}`);
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
};
const expectedQuizQuestionIds: Record<string, string[]> = {
  'ch01-probability-origins-quiz': ['origins-random-trial', 'origins-hidden-coin', 'origins-large-number-frequency', 'origins-one-off-event', 'origins-ai-uncertainty'],
  'ch01-experiments-events-sample-space-quiz': [
    'foundational-concepts-match',
    'sample-space-recording-rule',
    'event-as-subset',
    'event-types-match',
  ],
  'ch01-event-relations-quiz': ['union-intersection-match', 'disjoint-events-die', 'exclusive-vs-complement'],
  'ch01-probability-definitions-properties-quiz': ['classical-probability-formula', 'probability-properties', 'complement-probability', 'addition-rule'],
  'ch01-empirical-probability-quiz': ['frequency-relative-frequency', 'finite-estimate-interpretation', 'relative-frequency-stability'],
  'ch01-conditional-probability-quiz': ['conditional-formula', 'multiplication-without-replacement', 'replacement-dependence', 'conditional-direction'],
  'ch01-total-probability-quiz': ['partition-requirements', 'total-probability-formula', 'total-probability-order'],
  'ch01-bayes-naive-bayes-quiz': ['bayes-term-match', 'naive-bayes-assumption', 'naive-bayes-stability'],
  'ch01-probability-exercises-quiz': ['queen-given-face-card', 'compare-naive-bayes-scores', 'laplace-denominator'],
  'ch02-classical-statistics-fundamentals-quiz': [
    'thinking-pandas-iris-shape',
    'thinking-pandas-iris-value-counts',
    'thinking-pandas-iris-groupby-center',
    'thinking-pandas-iris-std-ddof',
    'thinking-pandas-iris-filter-setosa',
    'thinking-pandas-iris-describe',
  ],
  'descriptive-data-analysis-quiz': [
    'descriptive-manual-mean',
    'descriptive-manual-median-mode',
    'descriptive-manual-outlier',
    'descriptive-wine-load-series',
    'descriptive-wine-direct-methods',
    'descriptive-wine-describe-output',
    'descriptive-wine-histogram-interpretation',
    'descriptive-wine-practical-insight',
  ],
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

test('every Learning Lab MDX file follows the generic catalog, locale, metadata, and component contract', async () => {
  assert.equal(lessonFiles.length, 174);
  const parsedLessonFiles = lessonFiles
    .map((file) => parseLearningMdxPath(file))
    .filter((file): file is NonNullable<typeof file> => file !== null);
  assert.equal(parsedLessonFiles.filter((file) => file.domainId === 'statistics' && file.locale === 'en').length, 0);
  assert.equal(parsedLessonFiles.filter((file) => file.domainId === 'statistics' && file.locale === 'vi').length, 108);
  assert.equal(parsedLessonFiles.filter((file) => file.domainId !== 'statistics' && file.locale === 'vi').length, 66);
  assert.deepEqual(
    [...new Set(parsedLessonFiles.map((file) => `${file.domainId}/${file.lessonId}`))].sort(),
    publishedLessonKeys.sort(),
  );
  const documents = await validateLearningMdxFiles(lessonFiles, learningCatalog);
  assert.equal(documents.length, 174);
  const statisticsDocuments = documents.filter((document) => document.domainId === 'statistics');
  assert.equal(statisticsDocuments.length, 108);
  assert.deepEqual([...new Set(statisticsDocuments.map((document) => document.locale))], ['vi']);
  assert.ok(statisticsDocuments.every((document) => document.text.length < 2_000));
  let statisticsPageCount = 0;
  const statisticsInspections = new Map<string, Awaited<ReturnType<typeof inspectLearningMdx>>>();
  const statisticsSources = new Map<string, string>();
  for (const lessonFile of lessonFiles) {
    const source = readFileSync(lessonFile, 'utf8');
    const parsed = parseLearningMdxPath(lessonFile);
    assert.ok(parsed, `Invalid Learning Lab MDX filename: ${lessonFile}`);
    const inspection = await inspectLearningMdx(source, lessonFile);
    assert.equal(inspection.metadata.domainId, parsed.domainId);
    assert.equal(inspection.metadata.id, parsed.lessonId);
    assert.equal(inspection.metadata.locale, parsed.locale);
    const pageCount = Number(inspection.metadata.pageCount ?? 1);
    if (parsed.domainId === 'statistics') {
      assert.ok(Number.isInteger(pageCount) && pageCount > 0);
      assert.equal(parsed.locale, 'vi');
      statisticsPageCount += pageCount;
      statisticsInspections.set(parsed.lessonId, inspection);
      statisticsSources.set(parsed.lessonId, source);
    } else {
      assert.equal(pageCount, expectedPageCounts[parsed.lessonId]);
    }
    if (pageCount > 1 && !inspection.quizQuestionIds.length) {
      assert.deepEqual(inspection.pageIndexes, Array.from({ length: pageCount }, (_, index) => index));
    }
    if (expectedQuizQuestionIds[parsed.lessonId]) assert.deepEqual(inspection.quizQuestionIds, expectedQuizQuestionIds[parsed.lessonId]);
    if (parsed.domainId === 'cv') assert.equal(inspection.cvExerciseFixtures.length, 1);
    const allowedComponents = new Set(getAllowedLearningMdxComponentNames(parsed.domainId));
    for (const componentName of getLearningMdxComponentNames(source)) assert.ok(allowedComponents.has(componentName), `Unexpected Learning Lab MDX component: ${componentName}`);
  }
  assert.equal(statisticsPageCount, 393);
  for (const lessonId of [
    'ch01-experiments-events-sample-space',
    'ch01-event-relations',
    'ch01-probability-definitions-properties',
    'ch01-empirical-probability',
    'ch01-conditional-probability',
    'ch01-total-probability',
    'ch01-bayes-naive-bayes',
    'ch01-probability-exercises',
  ]) {
    const source = statisticsSources.get(lessonId) ?? '';
    assert.match(source, /<MdxFormula\b/);
    assert.doesNotMatch(source, /<MdxCode\b/);
    assert.doesNotMatch(source, /\$\$|(?<!\\)\$(?!\{)/);
  }
  const statisticalThinking = statisticsInspections.get('ch02-classical-statistics-fundamentals');
  const statisticalThinkingSource = statisticsSources.get('ch02-classical-statistics-fundamentals') ?? '';
  assert.equal(statisticalThinking?.metadata.pageCount, 3);
  assert.deepEqual(statisticalThinking?.metadata.headings, [
    'Thống kê là gì?',
    'Câu hỏi nghiên cứu & kinh doanh',
    'Phân loại thống kê',
  ]);
  assert.match(statisticalThinkingSource, /<StatisticalQuestionAtlas groups=/);
  assert.match(statisticalThinkingSource, /<StatisticsBranchesOverview\b/);
  assert.doesNotMatch(statisticalThinkingSource, /Bản đồ câu hỏi → phương pháp → chương|Ứng dụng của Thống kê & AI\/ML\/DL/);
  const populationSampleObservation = statisticsInspections.get('ch02-populations-samples-observation');
  const populationSampleObservationSource = statisticsSources.get('ch02-populations-samples-observation') ?? '';
  assert.equal(populationSampleObservation?.metadata.pageCount, 1);
  assert.match(populationSampleObservationSource, /<PopulationSampleObservationOverview\b/);
  assert.doesNotMatch(populationSampleObservationSource, /<LessonNote label="Phương pháp thu thập dữ liệu"/);
  for (const kind of ['statistical-thinking-sampling', 'statistical-thinking-study-design']) {
    assert.match(populationSampleObservationSource, new RegExp(`<ProbabilityChapterVisual kind="${kind}"`));
  }
  const statisticalThinkingQuiz = statisticsInspections.get('ch02-classical-statistics-fundamentals-quiz');
  const statisticalThinkingQuizSource = statisticsSources.get('ch02-classical-statistics-fundamentals-quiz') ?? '';
  assert.equal(statisticalThinkingQuiz?.metadata.pageCount, 6);
  assert.equal(statisticalThinkingQuiz?.metadata.title, 'Quiz');
  assert.match(statisticalThinkingQuizSource, /<MdxQuiz id="ch02-classical-statistics-fundamentals-quiz"/);
  assert.match(statisticalThinkingQuizSource, /preview:\s*\{/);
  assert.match(statisticalThinkingQuizSource, /columns:\s*\[['"]sepal_length['"]/);
  const thinkingTrack = learningCatalog.tracks.find((track) => track.domainId === 'statistics' && track.id === 'statistical-thinking');
  assert.deepEqual(thinkingTrack?.lessonIds, [
    'ch02-classical-statistics-fundamentals',
    'ch02-populations-samples-observation',
    'ch02-classical-statistics-fundamentals-quiz',
    'statistics-criticism',
  ]);
  const thinkingQuizNode = learningCatalog.lessons.find((lesson) => lesson.domainId === 'statistics' && lesson.id === 'ch02-classical-statistics-fundamentals-quiz');
  assert.equal(thinkingQuizNode?.text?.title?.vi, 'Quiz');
  assert.equal(thinkingQuizNode?.contentStatus, 'published');
  const histogramFoundations = statisticsInspections.get('histogram-foundations');
  const histogramFoundationsSource = statisticsSources.get('histogram-foundations') ?? '';
  assert.equal(histogramFoundations?.metadata.pageCount, 17);
  assert.deepEqual(histogramFoundations?.metadata.headings, [
    'Thu thập dữ liệu',
    'Đặt dữ liệu lên một trục số',
    'Vấn đề: các điểm bị chồng lên nhau',
    'Chia trục số thành các bin',
    'Xếp chồng các điểm trong từng bin',
    'Từ các chồng điểm đến histogram',
    'Histogram cho ta biết điều gì?',
    'Điều gì xảy ra khi có quá ít bin?',
    'Điều gì xảy ra khi có quá nhiều bin?',
    'Cùng dữ liệu, histogram khác nhau',
    'Quy tắc căn bậc hai',
    'Không có một số bin đúng cho mọi dữ liệu',
    'Code Python: tạo histogram đầu tiên',
    'Code Python: nhìn thấy dữ liệu được chia bin như thế nào',
    'Code Python: quá ít, hợp lý và quá nhiều bin',
    'Code Python: so sánh các quy tắc chọn bin',
    'Tự chọn số bin',
  ]);
  for (const componentName of [
    'HistogramConstructionVisual',
    'HistogramShapeVisual',
    'HistogramBinComparison',
    'HistogramRulesVisual',
    'HistogramBinExplorer',
  ]) assert.match(histogramFoundationsSource, new RegExp(`<${componentName}\\b`));
  assert.match(histogramFoundationsSource, /k \\\\approx \\\\sqrt\{n\}/);
  assert.match(histogramFoundationsSource, /np\.histogram\(|plt\.hist\(/);
  const descriptiveTrack = learningCatalog.tracks.find((track) => track.domainId === 'statistics' && track.id === 'descriptive-statistics-estimation');
  assert.deepEqual(descriptiveTrack?.lessonIds.slice(0, 5), [
    'histogram-foundations',
    'descriptive-data-analysis',
    'descriptive-data-analysis-quiz',
    'normal-distribution',
    'point-estimation',
  ]);
  const normalDistribution = statisticsInspections.get('normal-distribution');
  const normalDistributionSource = statisticsSources.get('normal-distribution') ?? '';
  assert.equal(normalDistribution?.metadata.pageCount, 17);
  assert.equal(normalDistribution?.metadata.title, '3.3 Phân phối chuẩn (Normal Distribution)');
  const normalDistributionHeadings = normalDistribution?.metadata.headings;
  assert.ok(Array.isArray(normalDistributionHeadings));
  assert.equal(normalDistributionHeadings.length, 17);
  assert.match(normalDistributionSource, /<NormalDistributionVisual\b/);
  assert.match(normalDistributionSource, /kind="overview"/);
  assert.match(normalDistributionSource, /Điều này không có nghĩa mọi dữ liệu đều tuân theo phân phối chuẩn/);
  assert.match(normalDistributionSource, /<NormalParameterExplorer[\s\S]*mode="mean"/);
  assert.match(normalDistributionSource, /<NormalParameterExplorer[\s\S]*mode="variance"/);
  assert.match(normalDistributionSource, /<HistogramReadingInteraction\b/);
  assert.match(normalDistributionSource, /ariaLabel="Đường cong phân phối chuẩn ở trung tâm/);
  assert.match(normalDistributionSource, /feedback=\{\{/);
  assert.match(normalDistributionSource, /scenarios=\{\[/);
  assert.match(normalDistributionSource, /X \\\\sim \\\\mathcal\{N\}/);
  assert.match(normalDistributionSource, /z=\\\\frac\{x-\\\\mu\}\{\\\\sigma\}/);
  assert.match(normalDistributionSource, /Xác suất một giá trị nằm trong một khoảng được biểu diễn bằng \*\*diện tích dưới đường cong\*\*/);
  assert.match(normalDistributionSource, /rng = np\.random\.default_rng\(42\)/);
  assert.match(normalDistributionSource, /Thiếu bên nào thì lệch bên đó/);
  assert.equal(learningCatalog.lessons.find((lesson) => lesson.domainId === 'statistics' && lesson.id === 'point-estimation')?.text?.title.vi, '3.4 Ước lượng điểm');
  const criticism = statisticsInspections.get('statistics-criticism');
  const criticismSource = statisticsSources.get('statistics-criticism') ?? '';
  assert.equal(criticism?.metadata.pageCount, 3);
  assert.match(criticismSource, /asset="bush-tax-truncated-axis"/);
  for (const lesson of learningCatalog.lessons.filter((item) => item.domainId === 'statistics' && item.contentStatus === 'published')) {
    const vietnamese = statisticsInspections.get(lesson.id);
    assert.ok(vietnamese, `Missing Vietnamese Statistics content for ${lesson.id}`);
    assert.equal(vietnamese.metadata.locale, 'vi');
    const vietnameseSource = statisticsSources.get(lesson.id) ?? '';
    const vietnameseProse = vietnameseSource
      .slice(vietnameseSource.indexOf('<MdxPage'))
      .replace(/<MdxCode\b[\s\S]*?\/>/g, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`\n]+`/g, '');
    const commonEnglishWordCount = vietnameseProse.match(
      /(?<![\p{L}\p{N}_])(?:the|and|of|to|in|is|are|that|for|with|from|we|this|which|using|data|observations)(?![\p{L}\p{N}_])/giu,
    )?.length ?? 0;
    assert.ok(
      commonEnglishWordCount < 20,
      `${lesson.id}.vi still appears to contain untranslated English prose (${commonEnglishWordCount} common-word hits)`,
    );
  }
  const requirements = documents.find((document) => document.lessonId === 'minimal-llm-project-skeleton')?.text ?? '';
  for (const requirement of ['Google Colab', 'Python', 'uv', 'VSCode']) assert.match(requirements, new RegExp(requirement));
});

test('retained Statistics authored output preserves the locked catalog counts', () => {
  assert.equal(learningCatalog.tracks.filter((track) => track.domainId === 'statistics').length, 8);
  assert.equal(learningCatalog.lessons.filter((lesson) => lesson.domainId === 'statistics').length, 122);
  assert.equal(
    learningCatalog.lessons.filter((lesson) => lesson.domainId === 'statistics' && lesson.contentStatus === 'published').length,
    108,
  );
});

test('generic MDX contract rejects imports, executable expressions, and unknown components', async () => {
  const metadata = "{ domainId: 'cv', id: 'x', locale: 'vi', title: 'x', headings: ['x'], keywords: ['x'] }";
  await assert.rejects(() => inspectLearningMdx(`import X from './x'\n\nexport const lessonMetadata = ${metadata}\n\n<X />`, 'fixture.mdx', 'cv'), /imports|unexpected|parse import/i);
  await assert.rejects(() => inspectLearningMdx("export const lessonMetadata = { domainId: 'cv', id: 'x', locale: 'vi', title: run(), headings: ['x'], keywords: ['x'] }", 'fixture.mdx', 'cv'), /executable|unsupported/i);
  await assert.rejects(() => inspectLearningMdx(`export const lessonMetadata = ${metadata};\n\n<Unknown />`, 'fixture.mdx', 'cv'), /unexpected MDX component/i);
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
  assert.deepEqual(getAllowedLearningMdxComponentNames('cv'), ['LessonNote', 'MdxCode', 'MdxColumns', 'MdxConceptContrast', 'MdxFormula', 'MdxQuiz', 'MdxPage', 'MdxTable', 'RequirementCard', 'RequirementsGrid', 'InlineMath', 'BlockMath', 'div', 'CvExercise']);
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

test('compiled Learning Lab MDX modules load lazily with stale-result protection', () => {
  const registry = readFileSync('src/components/learning/learningMdxRegistry.tsx', 'utf8');
  assert.match(registry, /import\.meta\.glob<MdxModule>\('\.\.\/\.\.\/content\/learning\/\*\/\*\.mdx'\)/);
  assert.doesNotMatch(registry, /eager:\s*true/);
  assert.match(registry, /let cancelled = false/);
  assert.match(registry, /if \(cancelled\) return/);
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
