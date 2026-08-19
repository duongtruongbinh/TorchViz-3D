import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { learningCatalog } from '../content/learning/index.ts';
import { LINEAR_ALGEBRA_MDX_COMPONENT_NAMES } from '../content/learning/mdxComponents.ts';
import { getLearningMdxComponentNames } from '../core/learning/mdxContract.ts';

const EXPECTED_CHAPTER_1_LESSONS = [
  'vectors-intuition',
  'vectors-intuition-quiz',
  'vector-operations',
  'vector-operations-quiz',
  'vector-norms',
  'vector-norms-quiz',
  'unit-vectors-normalization',
  'unit-vectors-normalization-quiz',
  'dot-product',
  'dot-product-quiz',
  'cosine-similarity',
  'cosine-similarity-quiz',
  'matrix-operations',
  'matrix-operations-quiz',
  'elementwise-vs-matrix-product',
  'elementwise-vs-matrix-product-quiz',
] as const;

const EXPECTED_SHA256_MAP: Record<string, string> = {
  '1.1.12-cosine-similarity-quiz.vi.mdx': '72fbc623435594a9caa22587e1560e26133943fd51a13807b6509a61980934e8',
  '1.1.11-cosine-similarity.vi.mdx': 'ae52f431191f7b2aa1ec2a69d015e1afb176488006e9997bf71217326ca222a1',
  '1.1.10-dot-product-quiz.vi.mdx': 'b1644e6baca27c79507fa8c3deb0173c481f5949fdce5d44a70c51eec560d86a',
  '1.1.9-dot-product.vi.mdx': '55ad0c3dca7601293816dd159d9477fcb9743b2610d0e351253310f3cc651366',
  '1.1.16-elementwise-vs-matrix-product-quiz.vi.mdx': '08df3024ccef80bf6db59c1b132da29f1721ab8d8e795badbdabdc0185d35242',
  '1.1.15-elementwise-vs-matrix-product.vi.mdx': '3d0bba4d8b5fb09dd669a685bd549ef7269f7ccd342a94ffe1e1c5cff7a8b9e1',
  '1.1.14-matrix-operations-quiz.vi.mdx': 'b5ffdaf837ac5cccdfda6b81e30a57bc0173c9b8830c7f926207fdfd0f6f6c0e',
  '1.1.13-matrix-operations.vi.mdx': '2d1f0960962e91ecc360b8983f9efea0b40edf9f9aeddcde96529b34c40ad7e5',
  '1.1.8-unit-vectors-normalization-quiz.vi.mdx': '9facda9f8e10c1cd34a3dcd2349b230dd7e2c082f2130d018d2281901066b6e4',
  '1.1.7-unit-vectors-normalization.vi.mdx': '2b3832c06351b662de42bbc5d8a6bc90e89bb45c731fb79ba581f9663c7184a7',
  '1.1.6-vector-norms-quiz.vi.mdx': 'efccae2419c3e6d2788ec01796b3ac0e9c3532cf3af3cc9c30660111950ef49f',
  '1.1.5-vector-norms.vi.mdx': 'c0866a96331f1690560bbcdf32156484d2e03b86a7148a780e59945243c07901',
  '1.1.4-vector-operations-quiz.vi.mdx': 'de0159a6d343f89f71e09f2b67dbd401f1f73442235bd0e5e79bec42cb1435ce',
  '1.1.3-vector-operations.vi.mdx': 'a7a9cac4a9b0cf899f78f01e0dd77486cf74582a55d424f07e3283cbedc93d1d',
  '1.1.2-vectors-intuition-quiz.vi.mdx': '586302dcfb2860695678c7d95d1a0c4be9e274f67fa6c2a9176e3299715f6239',
  '1.1.1-vectors-intuition.vi.mdx': '8eef4b70076467818b7e4b19b3e87940c2395183c832410c6e02906ec0a4ebbf',
};


test('Linear Algebra Chapter 1 contains exactly 16 published lessons in alternating theory-quiz order', () => {
  const chapter1Track = learningCatalog.tracks.find(
    (track) => track.domainId === 'linear-algebra' && track.id === 'vectors-matrices',
  );
  assert.ok(chapter1Track, 'Chapter 1 track exists');
  assert.deepEqual(chapter1Track.lessonIds, EXPECTED_CHAPTER_1_LESSONS);

  for (const lessonId of EXPECTED_CHAPTER_1_LESSONS) {
    const lesson = learningCatalog.lessons.find(
      (item) => item.domainId === 'linear-algebra' && item.id === lessonId,
    );
    assert.ok(lesson, `Lesson ${lessonId} exists in catalog`);
    assert.equal(lesson.contentStatus, 'published', `Lesson ${lessonId} is published`);
  }
});

test('Legacy orthogonality lesson is moved to Chapter 4 (orthogonality-least-squares) as published', () => {
  const chapter4Track = learningCatalog.tracks.find(
    (track) => track.domainId === 'linear-algebra' && track.id === 'orthogonality-least-squares',
  );
  assert.ok(chapter4Track, 'Chapter 4 track exists');
  assert.equal(chapter4Track.lessonIds[0], 'orthogonality', 'orthogonality is first lesson in Chapter 4');

  const orthogonalityLesson = learningCatalog.lessons.find(
    (item) => item.domainId === 'linear-algebra' && item.id === 'orthogonality',
  );
  assert.ok(orthogonalityLesson);
  assert.equal(orthogonalityLesson.contentStatus, 'published');
  assert.equal(orthogonalityLesson.trackId, 'orthogonality-least-squares');
});

test('Chapter 1 MDX files have valid structure and substantive content', async () => {
  const contentDir = path.resolve(process.cwd(), 'src/content/learning/linear-algebra');

  for (const filename of Object.keys(EXPECTED_SHA256_MAP)) {
    const filePath = path.join(contentDir, filename);
    const content = await readFile(filePath, 'utf8');
    assert.ok(content.length > 300, `File ${filename} must contain substantive content`);
    assert.ok(content.includes('lessonMetadata'), `File ${filename} must declare lessonMetadata`);
  }
});

test('All 8 Chapter 1 quiz files resolve canonical MdxQuiz with questions array', async () => {
  const contentDir = path.resolve(process.cwd(), 'src/content/learning/linear-algebra');

  for (const lessonId of EXPECTED_CHAPTER_1_LESSONS) {
    if (!lessonId.endsWith('-quiz')) continue;
    const nodeIndex = EXPECTED_CHAPTER_1_LESSONS.indexOf(lessonId) + 1;
    const filePath = path.join(contentDir, `1.1.${nodeIndex}-${lessonId}.vi.mdx`);
    const source = await readFile(filePath, 'utf8');
    const componentNames = getLearningMdxComponentNames(source);

    assert.ok(
      componentNames.includes('MdxQuiz'),
      `${lessonId} must use canonical MdxQuiz`,
    );
    assert.ok(
      !componentNames.includes('LegacyMathQuiz'),
      `${lessonId} must not use LegacyMathQuiz`,
    );
  }
});

test('LegacyMathQuiz has been completely replaced with MdxQuiz and removed from allowlist', () => {
  assert.equal(
    (LINEAR_ALGEBRA_MDX_COMPONENT_NAMES as readonly string[]).includes('LegacyMathQuiz'),
    false,
    'Allowlist must not include LegacyMathQuiz',
  );
});

test('Linear Algebra component allowlist includes all required Chapter 1 visual components', () => {
  const expectedComponents = [
    'ColumnCombinationExplorer',
    'CoordinateRepresentationDiagram',
    'CosineAngleExplorer',
    'CosineMotivationDiagram',
    'DistancePlane',
    'DotProductAngleExplorer',
    'DotProductPlane',
    'EmbeddingCosineDiagram',
    'GaussianEliminationStepper',
    'GaussJordanInverseStepper',
    'HadamardProductGrid',
    'L2NormTriangle',
    'LinearSystemCasesExplorer',
    'LUFactorizationExplorer',
    'MatrixExplorer',
    'MatrixProductExplorer',
    'MatrixTransposeExplorer',
    'MatrixVectorProductExplorer',
    'NormUnitBallDiagram',
    'NormalizationPlane',
    'NormalizationProcess',
    'OuterProductExplorer',
    'ProductOverview',
    'ScalarVectorPlane',
    'UnitVectorPlane',
    'VectorAdditionPlane',
    'VectorNormPlane',
    'VectorPlane',
    'VectorSubtractionPlane',
  ];

  assert.equal(LINEAR_ALGEBRA_MDX_COMPONENT_NAMES.length, 47);
  for (const name of expectedComponents) {
    assert.ok(
      LINEAR_ALGEBRA_MDX_COMPONENT_NAMES.includes(name as any),
      `Allowlist must include ${name}`,
    );
  }
});

test('Regression: Linear Algebra Cartesian renderers must use Mafs without custom SVG coordinate markers', async () => {
  const vectorRenderersPath = path.resolve(
    process.cwd(),
    'src/components/learning/domains/linear-algebra/vectorRenderers.tsx',
  );
  const source = await readFile(vectorRenderersPath, 'utf8');

  // Prohibited custom SVG coordinate markers and old engine calls
  assert.ok(!source.includes('<marker'), 'Must not declare custom SVG <marker');
  assert.ok(!source.includes('getScreenCTM'), 'Must not use getScreenCTM manual pointer mapping');
  assert.ok(!source.includes('createCartesianTransform'), 'Must not call createCartesianTransform');
  assert.ok(!source.includes('toSvgPoint'), 'Must not call toSvgPoint');
  assert.ok(!source.includes('fromSvgPoint'), 'Must not call fromSvgPoint');
  assert.ok(!source.includes('VectorPlane2D'), 'Must not import or reference VectorPlane2D');
});
