import test from 'node:test';
import assert from 'node:assert/strict';
import type { LayoutNode } from './irTypes.ts';
import {
  getMnistDemoCompatibility,
  type MnistDemoCompatibility,
} from './mnistCompatibility.ts';
import type { DemoStop } from '../components/operation-effects/effectMath.ts';

function node(overrides: Partial<LayoutNode> = {}): LayoutNode {
  return {
    id: 'node_1',
    name: 'node_1',
    op_type: 'Conv2d',
    in_shape: [1, 1, 32, 32],
    out_shape: [1, 6, 28, 28],
    params: 0,
    x: 0,
    y: 0,
    z: 0,
    width: 1,
    height: 1,
    depth: 1,
    color: '#ffffff',
    is_container: false,
    collapsed: false,
    children: [],
    ...overrides,
  };
}

function stop(overrides: Partial<LayoutNode> = {}): DemoStop {
  const n = node(overrides);
  return {
    node: n,
    label: n.op_type,
    position: { x: n.x, y: n.y, z: n.z } as DemoStop['position'],
  };
}

function reason(result: MnistDemoCompatibility): string | undefined {
  if (result.ok === false) {
    return result.reason;
  }
  return undefined;
}

test('reports no-layout compatibility reason before layout exists', () => {
  assert.deepEqual(getMnistDemoCompatibility(null), {
    ok: false,
    reason: 'no-layout',
  });
});

test('reports incompatible input shape separately from missing head', () => {
  const result = getMnistDemoCompatibility([
    stop({ in_shape: [1, 3, 32, 32] }),
    stop({ id: 'fc', op_type: 'Linear', out_shape: [1, 10] }),
  ]);

  assert.equal(result.ok, false);
  assert.equal(reason(result), 'input-shape');
});

test('reports missing 10-class Linear head after input shape is valid', () => {
  const result = getMnistDemoCompatibility([
    stop(),
    stop({ id: 'fc', op_type: 'Linear', out_shape: [1, 8] }),
  ]);

  assert.equal(result.ok, false);
  assert.equal(reason(result), 'missing-head');
});

test('accepts MNIST input with a 10-class Linear head', () => {
  assert.deepEqual(getMnistDemoCompatibility([
    stop(),
    stop({ id: 'fc', op_type: 'Linear', out_shape: [1, 10] }),
  ]), { ok: true });
});
