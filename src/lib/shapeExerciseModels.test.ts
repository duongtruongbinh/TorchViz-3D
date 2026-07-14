import test from 'node:test';
import assert from 'node:assert/strict';
import type { LayoutNode } from './irTypes.ts';
import { buildShapeExerciseModel } from './shapeExerciseModels.ts';

function node(opType: string, inShape: number[] = [], outShape: number[] = inShape): LayoutNode {
  return {
    id: `${opType}_1`,
    name: `${opType}_1`,
    op_type: opType,
    in_shape: inShape,
    out_shape: outShape,
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

test('builds deterministic BatchNorm and attention shape exercises', () => {
  const model = buildShapeExerciseModel(node('BatchNorm', [4, 16, 28, 28]));

  assert.deepEqual(model?.expectedShape, [4, 16, 28, 28]);
  assert.deepEqual(model?.configRows, ['num_features=16', 'keeps [N, C, H, W]']);
  assert.match(model?.hintLines?.join(' ') ?? '', /channel C/i);

  const attention = buildShapeExerciseModel(node('MultiheadAttention'), 'attention-shape');
  assert.deepEqual(attention?.expectedShape, [2, 4, 10]);
  assert.deepEqual(attention?.configRows, ['Q=[2, 4, 8]', 'K=[2, 6, 8]', 'V=[2, 6, 10]']);
  assert.match(attention?.hintLines?.join(' ') ?? '', /score.*\[B, T, S\]/i);
});
