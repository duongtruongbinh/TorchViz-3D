import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import type { LayoutData, LayoutNode, LayoutEdge } from './irTypes.ts';
import { getRenderableNodeBox, getRenderableNodeSize } from './renderBounds.ts';
import { collectDemoStops, buildDemoFlowEdges } from '../components/mnist-demo/demoStops.ts';

let counter = 0;
function leaf(op_type: string, overrides: Partial<LayoutNode> = {}): LayoutNode {
  counter += 1;
  return {
    id: overrides.id ?? `n${counter}`,
    name: op_type,
    op_type,
    in_shape: [1, 8, 8, 8],
    out_shape: [1, 8, 8, 8],
    params: 0,
    x: counter * 4,
    y: 0,
    z: 0,
    width: 2,
    height: 2,
    depth: 2,
    color: '#fff',
    is_container: false,
    ...overrides,
  };
}

function container(id: string, children: LayoutNode[], overrides: Partial<LayoutNode> = {}): LayoutNode {
  return {
    ...leaf('Block', { id }),
    is_container: true,
    collapsed: false,
    children,
    ...overrides,
  };
}

function edge(from: string, to: string, kind: LayoutEdge['kind'] = 'main'): LayoutEdge {
  return { from, to, kind, points: [{ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }] };
}

function withVectors(edges: LayoutEdge[]) {
  return edges.map((e) => ({ ...e, vectorPoints: e.points.map((p) => new THREE.Vector3(p.x, p.y, p.z)) }));
}

function hasEdge(flows: ReturnType<typeof buildDemoFlowEdges>, from: string, to: string): boolean {
  return flows.some((f) => f.edge.from === from && f.edge.to === to);
}

test('expanded transformer block: long residual skip is included', () => {
  const permute = leaf('Permute', { id: 'permute' });
  const norm1 = leaf('LayerNorm', { id: 'norm1' });
  const attn = leaf('MultiheadAttention', { id: 'attn' });
  const add1 = leaf('Add', { id: 'add1' });
  const root = container('vit', [permute, norm1, attn, add1]);
  const layout: LayoutData = {
    nodes: [root],
    edges: [
      edge('permute', 'norm1'),
      edge('norm1', 'attn'),
      edge('attn', 'add1', 'residual'),
      edge('permute', 'add1', 'residual'),
    ],
    bounds: { minX: 0, maxX: 1, minY: 0, maxY: 1, minZ: 0, maxZ: 1 },
  };
  const stops = collectDemoStops(layout);
  const flows = buildDemoFlowEdges(stops, withVectors(layout.edges), layout.nodes);
  assert.ok(hasEdge(flows, 'permute', 'add1'), 'expected the long residual skip permute -> add1');
});

test('expanded container output residual remaps to the last descendant stop', () => {
  const conv = leaf('Conv2d', { id: 'patch_conv' });
  const flatten = leaf('Flatten', { id: 'patch_flatten' });
  const permute = leaf('Permute', { id: 'patch_permute' });
  const patch = container('patch_embed', [conv, flatten, permute]);
  const norm1 = leaf('LayerNorm', { id: 'norm1' });
  const attn = leaf('MultiheadAttention', { id: 'attn' });
  const add1 = leaf('Add', { id: 'add1' });
  const root = container('vit', [patch, norm1, attn, add1]);
  const layout: LayoutData = {
    nodes: [root],
    edges: [
      edge('patch_conv', 'patch_flatten'),
      edge('patch_flatten', 'patch_permute'),
      edge('patch_embed', 'norm1'),
      edge('norm1', 'attn'),
      edge('attn', 'add1', 'residual'),
      edge('patch_embed', 'add1', 'residual'),
    ],
    bounds: { minX: 0, maxX: 1, minY: 0, maxY: 1, minZ: 0, maxZ: 1 },
  };
  const stops = collectDemoStops(layout);
  const flows = buildDemoFlowEdges(stops, withVectors(layout.edges), layout.nodes);
  const mainIntoAdd = flows.find((f) => f.edge.from === 'attn' && f.edge.to === 'add1');
  const residual = flows.find((f) => f.edge.from === 'patch_permute' && f.edge.to === 'add1');
  assert.ok(mainIntoAdd, 'expected the immediate previous stop to keep a main-chain edge into Add');
  assert.equal(mainIntoAdd!.edge.kind, 'main');
  assert.equal(mainIntoAdd!.edge.points.length, 4);
  assert.ok(residual, 'expected patch_embed -> add1 to render from visible patch_permute -> add1');
  assert.equal(residual!.edge.kind, 'residual');
  assert.equal(residual!.edge.points[0].x, permute.x + getRenderableNodeSize(permute).width / 2);
  assert.equal(residual!.edge.points.at(-1)!.x, add1.x - getRenderableNodeSize(add1).width / 2);
  assert.equal(residual!.edge.points[1].x, residual!.edge.points[2].x);
  assert.equal(residual!.edge.points[3].x, residual!.edge.points[4].x);
  assert.ok(
    residual!.edge.points[2].y > getRenderableNodeBox(attn).maxY,
    'remapped residual should lift above intervening attention block',
  );
});

test('collapsed residual block: draws an explicit bypass arc', () => {
  const conv = leaf('Conv2d', { id: 'ir_conv' });
  const add = leaf('Add', { id: 'ir_add' });
  const invres = container('invres', [conv, add], { collapsed: true });
  const prev = leaf('Conv2d', { id: 'prev' });
  const root = container('mobilenet', [prev, invres]);
  const layout: LayoutData = {
    nodes: [root],
    edges: [edge('prev', 'invres')],
    bounds: { minX: 0, maxX: 1, minY: 0, maxY: 1, minZ: 0, maxZ: 1 },
  };
  const stops = collectDemoStops(layout);
  const flows = buildDemoFlowEdges(stops, withVectors(layout.edges), layout.nodes);
  const bypass = flows.find((f) => f.edge.to === 'invres' && f.edge.kind === 'residual');
  assert.ok(bypass, 'expected a residual bypass arc over the collapsed block');
  assert.equal(bypass!.edge.points.length, 4, 'bypass should be a 4-point arc');
});
