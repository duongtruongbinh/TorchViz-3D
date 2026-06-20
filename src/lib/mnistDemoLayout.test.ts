import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {
  getDataPacketRoute,
  getMatrixCenter,
  getPanelPosition,
  getDemoInputPose,
  getPatchCenter,
  getSamplePlaneRotation,
  type DemoStop,
  type SegmentState,
} from '../components/operation-effects/effectMath.ts';
import type { LayoutEdge, LayoutNode } from './irTypes.ts';

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

test('keeps operation panel near the active node horizontally', () => {
  const active = node();
  const position = getPanelPosition(active);

  assert.ok(position.x > active.x);
  assert.ok(position.x - active.x <= 16);
});

test('keeps early operation panels clear of compact controls', () => {
  const active = node({ x: 0 });
  const position = getPanelPosition(active);

  assert.ok(position.x - active.x >= 22);
});

function stop(id: string, position: THREE.Vector3): DemoStop {
  return {
    node: node({ id, name: id }),
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

test('does not create a data packet route before a stop is active', () => {
  assert.equal(getDataPacketRoute([], segment({}), []), null);
});

test('does not create a data packet route without a real graph edge', () => {
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

test('getDemoInputPose positions input tile correctly in world space', () => {
  const firstStop = stop('conv', new THREE.Vector3(10, 2, 4));
  firstStop.node.width = 4;
  firstStop.node.x = 10;
  firstStop.node.y = 2;
  firstStop.node.z = 4;

  const pose = getDemoInputPose([firstStop]);

  // input is before first block on X (10 - (4 * 0.2)/2 - 2.5 = 7.1)
  assert.equal(pose.position.x, 7.1);
  // shares aligned Y/Z convention
  assert.equal(pose.position.y, 2);
  assert.equal(pose.position.z, 4);
  // uses fixed rotation [0, PI/2, 0]
  assert.deepEqual(pose.rotation, [0, Math.PI / 2, 0]);
});

test('getDataPacketRoute supports virtual first route (input -> first block)', () => {
  const first = stop('conv', new THREE.Vector3(10, 0, 3));
  const inputPos = new THREE.Vector3(4, 0, 3);
  const route = getDataPacketRoute([first], segment({
    inputPosition: inputPos,
    activeStopIndex: 0,
    activeStop: first,
    segmentProgress: 0.5,
  }), []);

  assert.ok(route);
  assert.deepEqual(route.points.map(p => p.toArray()), [
    [4, 0, 3],
    [10, 0, 3],
  ]);
  // Position is at midpoint (7, 0, 3)
  assert.equal(route.position.x, 7);
  assert.equal(route.position.y, 0);
  assert.equal(route.position.z, 3);
});


test('getMatrixCenter returns the geometric center of a centered matrix visual', () => {
  const center = getMatrixCenter([1.25, -0.5, 0.02]);

  assert.deepEqual(center.toArray().map((value) => Number(value.toFixed(3))), [1.25, -0.5, 0.14]);
});

test('getPatchCenter returns pool/kernel patch center independent of patch size', () => {
  const center = getPatchCenter([0, 0.3, 0.02], 0.98);

  assert.deepEqual(center.toArray().map((value) => Number(value.toFixed(3))), [0, 0.3, 0.14]);
});
