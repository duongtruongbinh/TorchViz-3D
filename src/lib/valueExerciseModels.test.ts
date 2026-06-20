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

test('builds deterministic MaxPool and AvgPool value exercises', () => {
  const maxPool = buildValueExerciseModel('pool-value', node('MaxPool'));
  const avgPool = buildValueExerciseModel('pool-value', node('AvgPool2d'));

  assert.equal(maxPool?.seed, 'pool-value:max');
  assert.deepEqual(maxPool?.expectedAnswers, [5]);
  assert.equal(avgPool?.seed, 'pool-value:avg');
  assert.deepEqual(avgPool?.expectedAnswers, [5]);
});

test('builds deterministic Linear dot-product exercise', () => {
  const model = buildValueExerciseModel('linear-value', node('Linear'));

  assert.equal(model?.seed, 'linear-value:dot');
  assert.deepEqual(model?.expectedAnswers, [4]);
  assert.match(model?.hintLines.join(' ') ?? '', /bias/);
});

test('builds deterministic ReLU vector exercise', () => {
  const model = buildValueExerciseModel('activation-value', node('ReLU'));

  assert.equal(model?.seed, 'activation-value:relu');
  assert.deepEqual(model?.inputValues, [-2, 0, 3, -0.5, 1]);
  assert.deepEqual(model?.expectedAnswers, [0, 0, 3, 0, 1]);
});

test('checks numeric answers per dimension with tolerance', () => {
  assert.deepEqual(checkNumericAnswers(['4.00'], [4]), [true]);
  assert.deepEqual(checkNumericAnswers(['4.02'], [4]), [false]);
  assert.deepEqual(checkNumericAnswers(['0', '', '3'], [0, 0, 3]), [true, false, true]);
});
