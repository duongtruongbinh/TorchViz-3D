import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {
  getDataPacketRoute,
  getPanelPosition,
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
  const first = stop('conv', new THREE.Vector3(10, 0, 3));
  const route = getDataPacketRoute([first], segment({
    activeStopIndex: 0,
    activeStop: first,
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
