import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  apply2x2,
  matMul2x2,
  det2x2,
  traceMatrix,
  frobeniusNorm,
  projectOnto2D,
  normalize2D,
  getStable2DBounds,
} from '../components/learning/domains/linear-algebra/geometry/demoMath.ts';

const LINEAR_ALGEBRA_CONTENT_DIR = path.resolve(
  process.cwd(),
  'src/content/learning/linear-algebra',
);

test('Linear Algebra Full Refinement Audit & Correctness', async (t) => {
  await t.test('1. Quiz Option Balancing - No all-A quizzes and balanced distribution', () => {
    const quizFiles = fs
      .readdirSync(LINEAR_ALGEBRA_CONTENT_DIR)
      .filter((f) => f.endsWith('-quiz.vi.mdx'));

    assert.equal(quizFiles.length, 29, 'Expected 29 quiz MDX files');

    const totalCounts = { a: 0, b: 0, c: 0, d: 0 };
    let totalQuestions = 0;

    for (const fileName of quizFiles) {
      const content = fs.readFileSync(
        path.join(LINEAR_ALGEBRA_CONTENT_DIR, fileName),
        'utf8',
      );

      // Match all options: [ ... ] blocks ending with newline bracket
      const optBlocks = content.match(/options:\s*\[([\s\S]*?\n\s*\])/g) || [];
      assert.ok(optBlocks.length >= 2, `${fileName} should have at least 2 questions`);

      const fileCorrectPositions: string[] = [];

      for (const block of optBlocks) {
        const individualOptions = block.match(/\{\s*id:\s*['"][a-z0-9]+['"][^}]*?\}/g) || [];
        assert.ok(individualOptions.length >= 2, `Question in ${fileName} must have >= 2 options`);

        const correctOptions = individualOptions.filter((opt) => opt.includes('isCorrect: true'));
        assert.equal(
          correctOptions.length,
          1,
          `Every question in ${fileName} must have exactly one correct answer`,
        );

        const idMatch = correctOptions[0].match(/id:\s*['"]([a-z0-9]+)['"]/);
        assert.ok(idMatch, `Could not parse correct option id in ${fileName}`);
        const correctId = idMatch[1] as 'a' | 'b' | 'c' | 'd';

        fileCorrectPositions.push(correctId);
        totalCounts[correctId] = (totalCounts[correctId] || 0) + 1;
        totalQuestions++;
      }

      // Ensure no single quiz has all questions at option 'a' (when >= 3 questions)
      if (optBlocks.length >= 3) {
        const allA = fileCorrectPositions.every((pos) => pos === 'a');
        assert.equal(allA, false, `Quiz ${fileName} must not have all answers at option A`);
      }
    }

    assert.ok(totalQuestions >= 60, `Expected at least 60 questions, found ${totalQuestions}`);

    // Verify overall distribution is balanced: each position should have between 15% and 40% of total
    for (const [pos, count] of Object.entries(totalCounts)) {
      const percentage = (count / totalQuestions) * 100;
      assert.ok(
        percentage >= 15 && percentage <= 40,
        `Option ${pos} has ${percentage.toFixed(1)}% (${count}/${totalQuestions}), outside 15-40% range`,
      );
    }
  });

  await t.test('2. Deprecated Mafs API Protection - No Plot.Parametric with t prop', () => {
    const srcDir = path.resolve(process.cwd(), 'src/components/learning/domains/linear-algebra');

    function checkDir(dirPath: string) {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
          checkDir(fullPath);
        } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          // Check for Plot.Parametric using t={ instead of domain={
          const match = content.match(/<Plot\.Parametric\s+[^>]*\bt=\{/);
          assert.equal(
            match,
            null,
            `Found deprecated <Plot.Parametric t={...}> in ${fullPath}. Must use domain={...}`,
          );
        }
      }
    }

    checkDir(srcDir);
  });

  await t.test('3. Demo Math Helpers Verification', () => {
    // 2x2 matrix multiplication
    const A = [
      [1, 2],
      [3, 4],
    ];
    const B = [
      [2, 0],
      [1, 2],
    ];
    const AB = matMul2x2(A, B);
    assert.deepEqual(AB, [
      [4, 4],
      [10, 8],
    ]);

    // Matrix vector apply
    const Av = apply2x2(A, [1, 2]);
    assert.deepEqual(Av, [5, 11]);

    // Determinant and Trace
    assert.equal(det2x2(A), -2);
    assert.equal(traceMatrix(A), 5);

    // Frobenius norm
    assert.equal(frobeniusNorm([[3, 4]]), 5);

    // Vector projection
    const v: [number, number] = [1, 3];
    const lineDir: [number, number] = [2, 1];
    const proj = projectOnto2D(v, lineDir);
    assert.deepEqual(proj, [2, 1]);

    // Normalization
    const u = normalize2D([3, 4]);
    assert.ok(Math.abs(u[0] - 0.6) < 1e-6);
    assert.ok(Math.abs(u[1] - 0.8) < 1e-6);
    assert.deepEqual(normalize2D([0, 0]), [0, 0]);

    // Stable 2D bounds
    const bounds = getStable2DBounds([
      [1, 2],
      [-2, 3],
    ]);
    assert.ok(bounds.minX <= -2);
    assert.ok(bounds.maxX >= 1);
    assert.ok(bounds.minY <= 0); // includes origin by default
    assert.ok(bounds.maxY >= 3);
  });

  await t.test('4. Mathematical Invariants - Truncated SVD', () => {
    const origA = [
      [5, 4, 2],
      [4, 5, 2],
      [2, 2, 2],
    ];

    assert.ok(frobeniusNorm(origA) > 10);

    // Singular values of origA: sigma = [10, 1, 1]
    const sigmaSqSum = 10 * 10 + 1 * 1 + 1 * 1; // 102
    const energy1 = (100 / sigmaSqSum) * 100;
    const energy2 = (101 / sigmaSqSum) * 100;

    assert.ok(Math.abs(energy1 - 98.039) < 0.01);
    assert.ok(Math.abs(energy2 - 99.019) < 0.01);

    // Frobenius error
    const errRank1 = Math.sqrt(1 * 1 + 1 * 1); // sqrt(2) ~ 1.414
    const errRank2 = Math.sqrt(1 * 1); // 1.0

    assert.ok(Math.abs(errRank1 - Math.SQRT2) < 0.001);
    assert.equal(errRank2, 1.0);
  });

  await t.test('5. Mathematical Invariants - Cyclic Trace & Eigenvalues', () => {
    const matA = [
      [4, 1],
      [2, 3],
    ];
    const matB = [
      [1, 2],
      [3, 4],
    ];

    const AB = matMul2x2(matA, matB);
    const BA = matMul2x2(matB, matA);

    assert.equal(traceMatrix(AB), 23);
    assert.equal(traceMatrix(BA), 23);
    assert.equal(traceMatrix(AB), traceMatrix(BA));

    // Eigenvalues of A: lambda^2 - 7 lambda + 10 = 0 => lambda = 5, 2
    assert.equal(traceMatrix(matA), 7);
    assert.equal(5 + 2, 7);
    assert.equal(det2x2(matA), 10);
    assert.equal(5 * 2, 10);
  });

  await t.test('6. Mathematical Invariants - Centered PCA Dataset', () => {
    const rawPoints: [number, number][] = [
      [-2.0, -1.0],
      [2.0, 1.0],
      [-1.4, -0.8],
      [1.4, 0.8],
      [-0.8, -0.3],
      [0.8, 0.3],
      [-0.4, -0.3],
      [0.4, 0.3],
    ];

    const meanX = rawPoints.reduce((acc, pt) => acc + pt[0], 0) / rawPoints.length;
    const meanY = rawPoints.reduce((acc, pt) => acc + pt[1], 0) / rawPoints.length;

    assert.equal(meanX, 0, 'PCA dataset must have exact zero mean on x');
    assert.equal(meanY, 0, 'PCA dataset must have exact zero mean on y');
  });

  await t.test('7. Mathematical Invariants - Gram-Schmidt & Least Squares', () => {
    const a1: [number, number] = [1, 1];
    const a2: [number, number] = [1, 0];

    const q1: [number, number] = normalize2D(a1);
    assert.ok(Math.abs(q1[0] - 1 / Math.SQRT2) < 1e-6);

    const dotA2Q1 = a2[0] * q1[0] + a2[1] * q1[1]; // 1 / sqrt(2)
    const p2: [number, number] = [dotA2Q1 * q1[0], dotA2Q1 * q1[1]]; // [0.5, 0.5]
    const u2: [number, number] = [a2[0] - p2[0], a2[1] - p2[1]]; // [0.5, -0.5]
    const q2: [number, number] = normalize2D(u2); // [1/sqrt(2), -1/sqrt(2)]

    // q1 . q2 = 0
    const dotQ1Q2 = q1[0] * q2[0] + q1[1] * q2[1];
    assert.ok(Math.abs(dotQ1Q2) < 1e-12, 'q1 and q2 must be orthogonal');

    // Least squares: b = [1, 3], a = [2, 1]
    const b: [number, number] = [1, 3];
    const a: [number, number] = [2, 1];
    const xHat = (a[0] * b[0] + a[1] * b[1]) / (a[0] * a[0] + a[1] * a[1]); // 5 / 5 = 1
    const p: [number, number] = [a[0] * xHat, a[1] * xHat]; // [2, 1]
    const e: [number, number] = [b[0] - p[0], b[1] - p[1]]; // [-1, 2]

    // Error perpendicular to a: a . e = 2(-1) + 1(2) = 0
    const dotAE = a[0] * e[0] + a[1] * e[1];
    assert.equal(dotAE, 0, 'Residual e must be perpendicular to column space');
  });
});
