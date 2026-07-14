import test from 'node:test';
import assert from 'node:assert/strict';
import type { LayoutNode } from './irTypes.ts';
import {
  buildValueExerciseModel,
  checkNumericAnswers,
} from './valueExerciseModels.ts';

function node(opType: string): LayoutNode {
  return {
    id: `${opType}_1`,
    name: `${opType}_1`,
    op_type: opType,
    in_shape: [],
    out_shape: [],
    params: 0,
    x: 0,
    y: 0,
    z: 0,
    width: 1,
    height: 1,
    depth: 1,
    color: '#ffffff',
  };
}

test('builds deterministic pooling, Linear, and ReLU value exercises', () => {
  const maxPool = buildValueExerciseModel('pool-value', node('MaxPool'));
  const avgPool = buildValueExerciseModel('pool-value', node('AvgPool2d'));

  assert.equal(maxPool?.seed, 'pool-value:max');
  assert.deepEqual(maxPool?.expectedAnswers, [5]);
  assert.equal(avgPool?.seed, 'pool-value:avg');
  assert.deepEqual(avgPool?.expectedAnswers, [5]);

  const linear = buildValueExerciseModel('linear-value', node('Linear'));
  assert.equal(linear?.seed, 'linear-value:dot');
  assert.deepEqual(linear?.expectedAnswers, [4]);
  assert.match(linear?.hintLines.join(' ') ?? '', /bias/);

  const relu = buildValueExerciseModel('activation-value', node('ReLU'));
  assert.equal(relu?.seed, 'activation-value:relu');
  assert.deepEqual(relu?.inputValues, [-2, 0, 3, -0.5, 1]);
  assert.deepEqual(relu?.expectedAnswers, [0, 0, 3, 0, 1]);
});

test('checks numeric answers per dimension with tolerance', () => {
  assert.deepEqual(checkNumericAnswers(['4.00'], [4]), [true]);
  assert.deepEqual(checkNumericAnswers(['4.02'], [4]), [false]);
  assert.deepEqual(checkNumericAnswers(['0', '', '3'], [0, 0, 3]), [true, false, true]);
});
