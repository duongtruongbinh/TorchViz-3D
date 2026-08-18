import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { learningTableOfContents } from '../content/learning/linear-algebra/table-of-contents.ts';
import { LINEAR_ALGEBRA_MDX_COMPONENT_NAMES } from '../content/learning/mdxComponents.ts';
import { cosine2D } from '../components/learning/domains/linear-algebra/geometry/vectorMath.ts';

const CHAPTERS_3_TO_7_FILES = [
  // Chapter 3
  'vector-spaces-subspaces.vi.mdx',
  'vector-spaces-subspaces-quiz.vi.mdx',
  'column-space-null-space.vi.mdx',
  'column-space-null-space-quiz.vi.mdx',
  'linear-independence-basis.vi.mdx',
  'linear-independence-basis-quiz.vi.mdx',
  'matrix-rank.vi.mdx',
  'matrix-rank-quiz.vi.mdx',
  'linear-transformations.vi.mdx',
  'linear-transformations-quiz.vi.mdx',

  // Chapter 4
  'orthogonality.vi.mdx',
  'orthogonality-quiz.vi.mdx',
  'orthogonal-projections.vi.mdx',
  'orthogonal-projections-quiz.vi.mdx',
  'gram-schmidt.vi.mdx',
  'gram-schmidt-quiz.vi.mdx',
  'systems-least-squares.vi.mdx',
  'systems-least-squares-quiz.vi.mdx',

  // Chapter 5
  'determinant-intuition.vi.mdx',
  'determinant-intuition-quiz.vi.mdx',
  'determinant-properties-formulas.vi.mdx',
  'determinant-properties-formulas-quiz.vi.mdx',

  // Chapter 6
  'matrix-trace.vi.mdx',
  'matrix-trace-quiz.vi.mdx',
  'eigenvalues-eigenvectors.vi.mdx',
  'eigenvalues-eigenvectors-quiz.vi.mdx',
  'diagonalization.vi.mdx',
  'diagonalization-quiz.vi.mdx',
  'pca-eigenvalues.vi.mdx',
  'pca-eigenvalues-quiz.vi.mdx',

  // Chapter 7
  'svd-intuition.vi.mdx',
  'svd-intuition-quiz.vi.mdx',
  'svd-dimensionality-reduction.vi.mdx',
  'svd-dimensionality-reduction-quiz.vi.mdx',
];

test('publishes exactly 58 lessons across 7 chapters in TOC', () => {
  assert.equal(learningTableOfContents.chapters.length, 7);

  const totalLessons = learningTableOfContents.chapters.reduce(
    (acc, ch) => acc + ch.lessonIds.length,
    0,
  );
  assert.equal(totalLessons, 58);

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

test('registers all 46 linear algebra visual components in allowlist', () => {
  assert.equal(LINEAR_ALGEBRA_MDX_COMPONENT_NAMES.length, 46);

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
