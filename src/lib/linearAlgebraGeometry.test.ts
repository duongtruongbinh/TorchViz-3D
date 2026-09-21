import test from 'node:test';
import assert from 'node:assert/strict';
import {
  vec,
  cosine2D,
  coordinatesInOrthonormalBasis,
  clampZero,
} from '../components/learning/domains/linear-algebra/geometry/vectorMath.ts';

function approxEqual(a: number, b: number, eps = 1e-4) {
  assert.ok(
    Math.abs(a - b) <= eps,
    `Expected ${a} to be approximately equal to ${b} (delta: ${Math.abs(a - b)})`,
  );
}

test('Linear Algebra Vector Math & Basis Helpers', async (t) => {
  await t.test('Mafs vec basic operations (add, sub, scale, mag, dot)', () => {
    const sum = vec.add([1, 2], [3, 4]);
    assert.deepEqual(sum, [4, 6]);

    const diff = vec.sub([1, 2], [3, 4]);
    assert.deepEqual(diff, [-2, -2]);

    const scaled = vec.scale([2, -4], 2.5);
    assert.deepEqual(scaled, [5, -10]);

    const length = vec.mag([3, 4]);
    approxEqual(length, 5);

    const dotProd = vec.dot([3, 4], [2, -1]);
    assert.equal(dotProd, 2);

    const normalized = vec.normalize([3, 4]);
    approxEqual(normalized[0], 0.6);
    approxEqual(normalized[1], 0.8);
    approxEqual(vec.mag(normalized), 1);
  });

  await t.test('Cosine similarity pure helper', () => {
    approxEqual(cosine2D([1, 0], [0, 1]), 0);
    approxEqual(cosine2D([2, 0], [5, 0]), 1);
    approxEqual(cosine2D([2, 0], [-5, 0]), -1);

    const a: [number, number] = [3.2, 1.2];
    const b: [number, number] = [3.0, 1.6];
    const cosAB = cosine2D(a, b);
    const expectedCos =
      (3.2 * 3.0 + 1.2 * 1.6) /
      (Math.hypot(3.2, 1.2) * Math.hypot(3.0, 1.6));
    approxEqual(cosAB, expectedCos);
  });

  await t.test('Rotated basis coordinates calculation (15 deg rotation)', () => {
    const v: [number, number] = [3, 2];
    const phi = (15 * Math.PI) / 180;
    const b1: [number, number] = [Math.cos(phi), Math.sin(phi)];
    const b2: [number, number] = [-Math.sin(phi), Math.cos(phi)];

    const coords = coordinatesInOrthonormalBasis(v, b1, b2);
    // Expected: 3*cos(15) + 2*sin(15) = 3.4154, -3*sin(15) + 2*cos(15) = 1.1554
    approxEqual(coords[0], 3.4154);
    approxEqual(coords[1], 1.1554);
  });

  await t.test('clampZero helper', () => {
    assert.equal(clampZero(1e-12), 0);
    assert.equal(clampZero(-1e-12), 0);
    assert.equal(clampZero(0.5), 0.5);
    assert.equal(clampZero(-0.5), -0.5);
  });
});
