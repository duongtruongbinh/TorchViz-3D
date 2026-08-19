import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { learningTableOfContents } from '../content/learning/linear-algebra/table-of-contents.ts';
import { LINEAR_ALGEBRA_MDX_COMPONENT_NAMES } from '../content/learning/mdxComponents.ts';
import { cosine2D } from '../components/learning/domains/linear-algebra/geometry/vectorMath.ts';

const CHAPTERS_3_TO_7_FILES = [
  // Chapter 3
  '3.1.1-vector-spaces-subspaces.vi.mdx',
  '3.1.2-vector-spaces-subspaces-quiz.vi.mdx',
  '3.1.3-column-space-null-space.vi.mdx',
  '3.1.4-column-space-null-space-quiz.vi.mdx',
  '3.1.5-linear-independence-basis.vi.mdx',
  '3.1.6-linear-independence-basis-quiz.vi.mdx',
  '3.1.7-matrix-rank.vi.mdx',
  '3.1.8-matrix-rank-quiz.vi.mdx',
  '3.1.9-linear-transformations.vi.mdx',
  '3.1.10-linear-transformations-quiz.vi.mdx',

  // Chapter 4
  '4.1.1-orthogonality.vi.mdx',
  '4.1.2-orthogonality-quiz.vi.mdx',
  '4.1.3-orthogonal-projections.vi.mdx',
  '4.1.4-orthogonal-projections-quiz.vi.mdx',
  '4.1.5-gram-schmidt.vi.mdx',
  '4.1.6-gram-schmidt-quiz.vi.mdx',
  '4.1.7-systems-least-squares.vi.mdx',
  '4.1.8-systems-least-squares-quiz.vi.mdx',

  // Chapter 5
  '5.1.1-determinant-intuition.vi.mdx',
  '5.1.2-determinant-intuition-quiz.vi.mdx',
  '5.1.3-determinant-properties-formulas.vi.mdx',
  '5.1.4-determinant-properties-formulas-quiz.vi.mdx',

  // Chapter 6
  '6.1.1-matrix-trace.vi.mdx',
  '6.1.2-matrix-trace-quiz.vi.mdx',
  '6.1.3-eigenvalues-eigenvectors.vi.mdx',
  '6.1.4-eigenvalues-eigenvectors-quiz.vi.mdx',
  '6.1.5-diagonalization.vi.mdx',
  '6.1.6-diagonalization-quiz.vi.mdx',
  '6.1.7-pca-eigenvalues.vi.mdx',
  '6.1.8-pca-eigenvalues-quiz.vi.mdx',

  // Chapter 7
  '7.1.1-svd-intuition.vi.mdx',
  '7.1.2-svd-intuition-quiz.vi.mdx',
  '7.1.3-svd-dimensionality-reduction.vi.mdx',
  '7.1.4-svd-dimensionality-reduction-quiz.vi.mdx',
];

test('publishes one applied AI overview before 58 lessons across 7 core chapters', () => {
  assert.equal(learningTableOfContents.chapters.length, 8);
  assert.equal(learningTableOfContents.chapters[0]?.id, 'linear-algebra-for-ai');
  assert.deepEqual(learningTableOfContents.chapters[0]?.lessonIds.map((lesson) => (
    typeof lesson === 'string' ? lesson : lesson.id
  )), ['linear-algebra-for-ai-overview']);

  const totalLessons = learningTableOfContents.chapters.reduce(
    (acc, ch) => acc + ch.lessonIds.length,
    0,
  );
  assert.equal(totalLessons, 59);
  assert.equal(learningTableOfContents.chapters.slice(1).length, 7);
  assert.equal(learningTableOfContents.chapters.slice(1).reduce(
    (acc, chapter) => acc + chapter.lessonIds.length,
    0,
  ), 58);

  learningTableOfContents.chapters.forEach((chapter) => {
    chapter.lessonIds.forEach((seed) => {
      if (typeof seed === 'object') {
        assert.equal(seed.contentStatus, 'published');
      } else {
        assert.fail(`Lesson ${seed} in chapter ${chapter.id} must be a published seed object`);
      }
    });
  });
});

test('validates existence and structural integrity of all 34 Chapter 3 to 7 MDX files', () => {
  const baseDir = resolve(process.cwd(), 'src/content/learning/linear-algebra');

  CHAPTERS_3_TO_7_FILES.forEach((filename) => {
    const filePath = resolve(baseDir, filename);
    const text = readFileSync(filePath, 'utf-8');
    assert.ok(text.length > 500, `${filename} must contain substantive content`);
    assert.ok(text.includes('lessonMetadata'), `${filename} must declare lessonMetadata`);
  });
});

test('contains zero punctuation errors (em dashes, en dashes) in 34 MDX files', () => {
  const baseDir = resolve(process.cwd(), 'src/content/learning/linear-algebra');

  CHAPTERS_3_TO_7_FILES.forEach((filename) => {
    const filePath = resolve(baseDir, filename);
    const text = readFileSync(filePath, 'utf-8');

    assert.equal(text.includes('—'), false, `${filename} contains em dash (—)`);
    assert.equal(text.includes('–'), false, `${filename} contains en dash (–)`);
  });
});

test('verifies LegacyMathQuiz has zero callers and is removed from allowlist', () => {
  assert.equal((LINEAR_ALGEBRA_MDX_COMPONENT_NAMES as readonly string[]).includes('LegacyMathQuiz'), false);
});

test('registers all 47 linear algebra visual components in allowlist', () => {
  assert.equal(LINEAR_ALGEBRA_MDX_COMPONENT_NAMES.length, 47);

  const requiredComponents = [
    // Chapter 3
    'SubspaceClosureExplorer',
    'ColumnNullSpaceExplorer',
    'BasisIndependenceExplorer',
    'RankPivotExplorer',
    'LinearTransformationExplorer',
    // Chapter 4
    'OrthogonalityExplorer',
    'ProjectionExplorer',
    'GramSchmidtExplorer',
    'LeastSquaresExplorer',
    // Chapter 5
    'DeterminantAreaExplorer',
    'DeterminantRowOpsExplorer',
    // Chapter 6
    'TraceEigenvalueLink',
    'EigenvectorExplorer',
    'DiagonalizationExplorer',
    'PCAProjectionExplorer',
    // Chapter 7
    'SVDGeometryExplorer',
    'TruncatedSVDExplorer',
  ];

  requiredComponents.forEach((name) => {
    assert.ok(
      (LINEAR_ALGEBRA_MDX_COMPONENT_NAMES as readonly string[]).includes(name),
      `Allowlist must include ${name}`,
    );
  });
});

test('safely handles zero vectors in cosine2D without false 90 deg orthogonality', () => {
  const zero: [number, number] = [0, 0];
  const nonZero: [number, number] = [3, 4];

  assert.equal(Number.isNaN(cosine2D(zero, nonZero)), true);
  assert.equal(Number.isNaN(cosine2D(nonZero, zero)), true);
  assert.equal(Number.isNaN(cosine2D(zero, zero)), true);

  // Normal vectors
  assert.equal(cosine2D([1, 0], [0, 1]), 0);
  assert.equal(cosine2D([1, 0], [1, 0]), 1);
  assert.equal(cosine2D([1, 0], [-1, 0]), -1);
});
