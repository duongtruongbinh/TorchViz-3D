import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {
  getDataPacketRoute,
  getDataPacketRoutes,
  getMatrixCenter,
  getPanelPosition,
  getDemoInputPose,
  getPatchCenter,
  getVirtualInputRoutePoints,
  type DemoStop,
  type SegmentState,
} from '../components/operation-effects/effectMath.ts';
import type { LayoutEdge, LayoutNode } from './irTypes.ts';
import { getRenderableNodeBox } from './renderBounds.ts';

function node(overrides: Partial<LayoutNode> = {}): LayoutNode {
  return {
    id: 'node_1',
    name: 'node_1',
    op_type: 'ReLU',
    in_shape: [],
    out_shape: [],
    params: 0,
    x: 30,
    y: 0,
    z: 0,
    width: 4,
    height: 3,
    depth: 2,
    color: '#ffffff',
    is_container: false,
    collapsed: false,
    children: [],
    ...overrides,
  };
}

test('positions operation panels beside both early and later nodes', () => {
  const active = node();
  const position = getPanelPosition(active);

  assert.ok(position.x > active.x);
  assert.ok(position.x - active.x <= 16);
  const early = node({ x: 0 });
  const earlyPosition = getPanelPosition(early);

  assert.ok(earlyPosition.x - early.x >= 22);
});

function stop(id: string, position: THREE.Vector3, op_type = 'ReLU'): DemoStop {
  return {
    node: node({ id, name: id, op_type }),
    label: id,
    position,
  };
}

function segment(overrides: Partial<SegmentState>): SegmentState {
  return {
    inputPosition: new THREE.Vector3(0, 0, 2),
    activeStopIndex: -1,
    activeStop: null,
    segmentProgress: 0,
    ...overrides,
  };
}

test('omits data packet routes before activation or without a real edge', () => {
  assert.equal(getDataPacketRoute([], segment({}), []), null);
  // activeStopIndex: 1 represents routing from stop 0 to stop 1, which requires a real edge.
  const first = stop('conv', new THREE.Vector3(10, 0, 3));
  const second = stop('relu', new THREE.Vector3(20, 0, 3));
  const route = getDataPacketRoute([first, second], segment({
    activeStopIndex: 1,
    activeStop: second,
    segmentProgress: 0.5,
  }), []);

  assert.equal(route, null);
});

function edge(from: string, to: string, points: LayoutEdge['points']): LayoutEdge {
  return { from, to, kind: 'main', points };
}

function residualEdge(from: string, to: string, points: LayoutEdge['points']): LayoutEdge {
  return { from, to, kind: 'residual', points };
}

test('routes later data packets on the matching visual edge path', () => {
  const firstPosition = new THREE.Vector3(10, 0, 3);
  const secondPosition = new THREE.Vector3(22, 4, 4);
  const first = stop('conv', firstPosition.clone());
  const second = stop('relu', secondPosition.clone());
  const visualEdge = edge('conv', 'relu', [
    { x: 10, y: 0, z: 3 },
    { x: 14, y: 0, z: 3 },
    { x: 18, y: 4, z: 4 },
    { x: 22, y: 4, z: 4 },
  ]);
  const route = getDataPacketRoute([first, second], segment({
    activeStopIndex: 1,
    activeStop: second,
    segmentProgress: 0.5,
  }), [visualEdge]);

  assert.ok(route);
  assert.deepEqual(route.points.map((point) => point.toArray()), [
    [10, 0, 3],
    [14, 0, 3],
    [18, 4, 4],
    [22, 4, 4],
  ]);
  assert.equal(Number(route.position.x.toFixed(3)), 16);
  assert.equal(Number(route.position.y.toFixed(3)), 2);
  assert.equal(Number(route.position.z.toFixed(3)), 3.5);
  assert.deepEqual(first.position.toArray(), firstPosition.toArray());
  assert.deepEqual(second.position.toArray(), secondPosition.toArray());
});

test('duplicates the data packet onto residual branches when Add is active', () => {
  const skip = stop('permute', new THREE.Vector3(10, 0, 3), 'Permute');
  const norm = stop('norm', new THREE.Vector3(18, 0, 3), 'LayerNorm');
  const attn = stop('attn', new THREE.Vector3(26, 0, 3), 'MultiHeadAttn');
  const add = stop('add', new THREE.Vector3(34, 0, 3), 'Add');
  const routes = getDataPacketRoutes([skip, norm, attn, add], segment({
    activeStopIndex: 3,
    activeStop: add,
    segmentProgress: 0.5,
  }), [
    edge('permute', 'norm', [{ x: 10, y: 0, z: 3 }, { x: 18, y: 0, z: 3 }]),
    edge('norm', 'attn', [{ x: 18, y: 0, z: 3 }, { x: 26, y: 0, z: 3 }]),
    residualEdge('attn', 'add', [{ x: 26, y: 0, z: 3 }, { x: 34, y: 0, z: 3 }]),
    residualEdge('permute', 'add', [
      { x: 10, y: 0, z: 3 },
      { x: 12, y: 0, z: 3 },
      { x: 12, y: 6, z: 3 },
      { x: 32, y: 6, z: 3 },
      { x: 32, y: 0, z: 3 },
      { x: 34, y: 0, z: 3 },
    ]),
  ]);

  assert.equal(routes.length, 2);
  assert.equal(routes[0].kind, 'main');
  assert.equal(routes[1].kind, 'residual');
  assert.deepEqual(routes[1].points.map((point) => point.toArray()), [
    [10, 0, 3],
    [12, 0, 3],
    [12, 6, 3],
    [32, 6, 3],
    [32, 0, 3],
    [34, 0, 3],
  ]);
  assert.equal(routes[1].position.y, 6);
});

test('positions the input tile and supports its virtual first packet route', () => {
  const firstStop = stop('conv', new THREE.Vector3(10, 2, 4));
  firstStop.node.width = 4;
  firstStop.node.x = 10;
  firstStop.node.y = 2;
  firstStop.node.z = 4;

  const pose = getDemoInputPose([firstStop]);

  // input is before first block on X (10 - (4 * 0.2)/2 - 3.6 = 6)
  assert.equal(pose.position.x, 6);
  // shares aligned Y/Z convention
  assert.equal(pose.position.y, 2);
  assert.equal(pose.position.z, 4);
  // uses fixed rotation [0, PI/2, 0]
  assert.deepEqual(pose.rotation, [0, Math.PI / 2, 0]);
  const first = stop('conv', new THREE.Vector3(10, 0, 3));
  first.node.x = 10;
  first.node.y = 0;
  first.node.z = 3;
  const inputPos = new THREE.Vector3(4, 0, 3);
  const virtualPoints = getVirtualInputRoutePoints([first], inputPos);
  const route = getDataPacketRoute([first], segment({
    inputPosition: inputPos,
    activeStopIndex: 0,
    activeStop: first,
    segmentProgress: 0.5,
  }), []);

  assert.ok(route);
  const firstFaceX = getRenderableNodeBox(first.node).minX;
  assert.deepEqual(virtualPoints.map(p => p.toArray()), [
    [4, 0, 3],
    [firstFaceX, first.node.y, first.node.z],
  ]);
  assert.deepEqual(route.points.map(p => p.toArray()), [
    [4, 0, 3],
    [firstFaceX, first.node.y, first.node.z],
  ]);
  assert.equal(route.position.x, (4 + firstFaceX) / 2);
  assert.equal(route.position.y, 0);
  assert.equal(route.position.z, 3);
});


test('matrix and patch helpers return centered visualization coordinates', () => {
  const center = getMatrixCenter([1.25, -0.5, 0.02]);

  assert.deepEqual(center.toArray().map((value) => Number(value.toFixed(3))), [1.25, -0.5, 0.14]);
  const patchCenter = getPatchCenter([0, 0.3, 0.02], 0.98);

  assert.deepEqual(patchCenter.toArray().map((value) => Number(value.toFixed(3))), [0, 0.3, 0.14]);
});
