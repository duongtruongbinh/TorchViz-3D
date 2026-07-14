import test from 'node:test';
import assert from 'node:assert/strict';
import { ERROR_COLOR } from './constants.ts';
import type { LayoutData, LayoutNode } from './irTypes.ts';
import { generateSVG } from './svgExport.ts';

function node(overrides: Partial<LayoutNode>): LayoutNode {
  return {
    id: 'n',
    name: 'n',
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

function layout(nodes: LayoutNode[]): LayoutData {
  return {
    nodes,
    edges: [],
    bounds: { minX: -2, maxX: 2, minY: -2, maxY: 2, minZ: -2, maxZ: 2 },
  };
}

test('SVG export preserves error and collapsed-container layout colors', () => {
  const svg = generateSVG(layout([node({ error: 'bad shape' })]), {
    lightBackground: true,
    legend: false,
  });

  assert.match(svg, new RegExp(ERROR_COLOR.replace('#', '#')));
  const containerSvg = generateSVG(layout([node({
    id: 'container',
    name: 'container',
    op_type: 'Sequential',
    is_container: true,
    collapsed: true,
    children: [],
    color: '#123456',
  })]), {
    lightBackground: true,
    legend: false,
  });

  assert.match(containerSvg, /#123456/i);
});
