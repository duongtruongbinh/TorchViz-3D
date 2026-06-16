import test from 'node:test';
import assert from 'node:assert/strict';
import { formatShape, getLayerInsight } from './layerInsights.ts';
import type { IRNode } from './irTypes.ts';

function node(overrides: Partial<IRNode>): IRNode {
  return {
    id: 'node_1',
    name: 'Layer_1',
    op_type: 'Unknown',
    in_shape: [],
    out_shape: [],
    params: 0,
    meta: {},
    ...overrides,
  };
}

test('formats tensor shapes for primary hover content', () => {
  assert.equal(formatShape([1, 3, 224, 224]), '1 x 3 x 224 x 224');
  assert.equal(formatShape([]), '-');
});

test('explains Conv2d parameter formula from shape and kernel metadata', () => {
  const insight = getLayerInsight(node({
    op_type: 'Conv2d',
    in_shape: [1, 3, 32, 32],
    out_shape: [1, 16, 30, 30],
    params: 448,
    meta: { kernel: [3, 3] },
  }));

  assert.equal(insight.paramFormula?.title, 'Conv2d parameters');
  assert.equal(insight.paramFormula?.formula, '(kernel_h x kernel_w x in_channels + bias) x out_channels');
  assert.equal(insight.paramFormula?.calculation, '(3 x 3 x 3 + 1) x 16 = 448');
});

test('explains Linear parameter formula from shape data', () => {
  const insight = getLayerInsight(node({
    op_type: 'Linear',
    in_shape: [1, 128],
    out_shape: [1, 10],
    params: 1290,
  }));

  assert.equal(insight.paramFormula?.formula, '(in_features + bias) x out_features');
  assert.equal(insight.paramFormula?.calculation, '(128 + 1) x 10 = 1,290');
});

test('keeps zero-parameter layers useful without inventing formulas', () => {
  const insight = getLayerInsight(node({
    op_type: 'MaxPool',
    in_shape: [1, 16, 30, 30],
    out_shape: [1, 16, 15, 15],
    params: 0,
  }));

  assert.equal(insight.paramFormula?.calculation, '0 trainable parameters');
  assert.match(insight.why, /reduces spatial/i);
});
