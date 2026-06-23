import test from 'node:test';
import assert from 'node:assert/strict';
import type { LayoutNode } from './irTypes.ts';
import {
  getForwardPassCompatibility,
  type ForwardPassCompatibility,
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

function reason(result: ForwardPassCompatibility): string | undefined {
  if (result.ok === false) {
    return result.reason;
  }
  return undefined;
}

test('reports no-layout before any stops exist', () => {
  assert.deepEqual(getForwardPassCompatibility(null), {
    ok: false,
    reason: 'no-layout',
  });
  assert.deepEqual(getForwardPassCompatibility([]), {
    ok: false,
    reason: 'no-layout',
  });
});

test('reports loading reason while the graph is computing', () => {
  assert.deepEqual(getForwardPassCompatibility([stop()], { loading: true }), {
    ok: false,
    reason: 'loading',
  });
});

test('reports no-stops when no leaf carries an input shape', () => {
  const result = getForwardPassCompatibility([
    stop({ is_container: true, in_shape: [] }),
  ]);
  assert.equal(result.ok, false);
  assert.equal(reason(result), 'no-stops');
});

test('accepts MNIST/LeNet-style graph (1-channel, 10-class head)', () => {
  assert.deepEqual(getForwardPassCompatibility([
    stop(),
    stop({ id: 'fc', op_type: 'Linear', out_shape: [1, 10] }),
  ]), { ok: true });
});

test('accepts 3-channel CIFAR-style input regardless of head size', () => {
  // ResNet / ViT use [1,3,32,32]; AlexNet/VGG/MobileNet use 1000-class heads.
  assert.deepEqual(getForwardPassCompatibility([
    stop({ in_shape: [1, 3, 32, 32] }),
    stop({ id: 'fc', op_type: 'Linear', out_shape: [1, 1000] }),
  ]), { ok: true });
});

test('accepts a segmentation graph with no Linear head (UNet)', () => {
  assert.deepEqual(getForwardPassCompatibility([
    stop({ in_shape: [1, 3, 128, 128] }),
    stop({ id: 'out', op_type: 'Conv2d', out_shape: [1, 2, 128, 128] }),
  ]), { ok: true });
});
