import test from 'node:test';
import assert from 'node:assert/strict';
import type { LayoutNode } from './irTypes.ts';
import { partitionLeavesForInstancing } from './leafBatching.ts';

function leaf(id: string, overrides: Partial<LayoutNode> = {}): LayoutNode {
  return {
    id,
    name: id,
    op_type: 'Linear',
    in_shape: [],
    out_shape: [1, 4],
    params: 0,
    x: 0,
    y: 0,
    z: 0,
    width: 4,
    height: 3,
    depth: 2,
    color: '#22c55e',
    ...overrides,
  };
}

test('batches visually identical ordinary leaves', () => {
  const result = partitionLeavesForInstancing(
    [leaf('a'), leaf('b'), leaf('c')],
    { highlightedNodeId: null, selectedNodeId: null, activeNodeId: null },
    3,
  );

  assert.equal(result.batches.length, 1);
  assert.deepEqual(result.singles, []);
});

test('keeps error and interactive-state leaves out of instanced batches', () => {
  const result = partitionLeavesForInstancing(
    [
      leaf('a'),
      leaf('b'),
      leaf('c'),
      leaf('error', { error: 'bad shape' }),
      leaf('selected'),
      leaf('active'),
      leaf('highlighted'),
    ],
    { highlightedNodeId: 'highlighted', selectedNodeId: 'selected', activeNodeId: 'active' },
    3,
  );

  assert.equal(result.batches.length, 1);
  assert.deepEqual(result.batches[0].map((node) => node.id), ['a', 'b', 'c']);
  assert.deepEqual(result.singles.map((node) => node.id).sort(), ['active', 'error', 'highlighted', 'selected']);
});
