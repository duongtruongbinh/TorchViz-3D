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

test('reports each unavailable forward-pass state', () => {
  const cases: Array<{ label: string; result: ForwardPassCompatibility; expectedReason: string }> = [
    { label: 'missing layout', result: getForwardPassCompatibility(null), expectedReason: 'no-layout' },
    { label: 'empty stops', result: getForwardPassCompatibility([]), expectedReason: 'no-layout' },
    { label: 'loading', result: getForwardPassCompatibility([stop()], { loading: true }), expectedReason: 'loading' },
    {
      label: 'no input-bearing leaf',
      result: getForwardPassCompatibility([stop({ is_container: true, in_shape: [] })]),
      expectedReason: 'no-stops',
    },
  ];
  for (const scenario of cases) {
    assert.equal(scenario.result.ok, false, scenario.label);
    assert.equal(reason(scenario.result), scenario.expectedReason, scenario.label);
  }
});

test('accepts classification and segmentation graph families', () => {
  const graphFamilies = [
    {
      label: 'MNIST/LeNet',
      stops: [stop(), stop({ id: 'fc', op_type: 'Linear', out_shape: [1, 10] })],
    },
    {
      label: 'CIFAR classifier',
      stops: [stop({ in_shape: [1, 3, 32, 32] }), stop({ id: 'fc', op_type: 'Linear', out_shape: [1, 1000] })],
    },
    {
      label: 'UNet segmentation',
      stops: [stop({ in_shape: [1, 3, 128, 128] }), stop({ id: 'out', op_type: 'Conv2d', out_shape: [1, 2, 128, 128] })],
    },
  ];
  for (const scenario of graphFamilies) {
    assert.deepEqual(getForwardPassCompatibility(scenario.stops), { ok: true }, scenario.label);
  }
});
