import test from 'node:test';
import assert from 'node:assert/strict';
import { getAdaptiveGridSpec, getLayoutWorldBounds, getRenderableNodeBox } from './renderBounds.ts';
import type { LayoutData, LayoutNode } from './irTypes.ts';

function node(overrides: Partial<LayoutNode>): LayoutNode {
  return {
    id: 'n',
    name: 'n',
    op_type: 'Linear',
    in_shape: [],
    out_shape: [],
    params: 0,
    x: 10,
    y: 2,
    z: -3,
    width: 4,
    height: 10,
    depth: 6,
    color: '#fff',
    ...overrides,
  };
}

test('getRenderableNodeBox applies visual dimensions for leaves', () => {
  const box = getRenderableNodeBox(node({ op_type: 'Linear' }));

  assert.equal(box.width, 1.6);
  assert.equal(box.height, 13);
  assert.equal(box.depth, 6);
  assert.equal(box.minX, 9.2);
  assert.equal(box.maxX, 10.8);
  assert.equal(box.minY, -4.5);
  assert.equal(box.maxY, 8.5);
});

test('getRenderableNodeBox keeps container dimensions authoritative', () => {
  const box = getRenderableNodeBox(node({
    is_container: true,
    children: [],
    width: 8,
    height: 6,
    depth: 4,
  }));

  assert.equal(box.width, 8);
  assert.equal(box.height, 6);
  assert.equal(box.depth, 4);
  assert.equal(box.minX, 6);
  assert.equal(box.maxX, 14);
});

test('getLayoutWorldBounds includes renderable nodes and edge points', () => {
  const layout: LayoutData = {
    nodes: [
      node({ id: 'a', x: 0, y: 0, z: 0, width: 2, height: 2, depth: 2, op_type: 'Conv' }),
      node({ id: 'b', x: 10, y: 0, z: 0, width: 2, height: 2, depth: 2, op_type: 'Linear' }),
    ],
    edges: [{
      from: 'a',
      to: 'b',
      kind: 'residual',
      points: [
        { x: 1, y: 0, z: 0 },
        { x: 5, y: 12, z: -9 },
        { x: 9, y: 0, z: 0 },
      ],
    }],
    bounds: { minX: 0, maxX: 0, minY: 0, maxY: 0, minZ: 0, maxZ: 0 },
  };

  const bounds = getLayoutWorldBounds(layout, { includeEdges: true });

  assert.equal(bounds.minX, -1);
  assert.equal(bounds.maxX, 10.4);
  assert.equal(bounds.maxY, 12);
  assert.equal(bounds.minZ, -9);
});

test('getAdaptiveGridSpec centers below bounds and snaps size', () => {
  const grid = getAdaptiveGridSpec({
    minX: -8,
    maxX: 31,
    minY: -4,
    maxY: 10,
    minZ: -12,
    maxZ: 9,
  });

  assert.deepEqual(grid.center, [11.5, -4.35, -1.5]);
  assert.equal(grid.size, 80);
  assert.equal(grid.divisions, 40);
});
