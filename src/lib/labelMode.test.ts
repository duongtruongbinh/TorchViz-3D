import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getEffectiveLabelMode,
  shouldRenderLeafCaption,
  LARGE_GRAPH_LABEL_THRESHOLD,
} from './labelMode.ts';

test('auto keeps all labels for small graphs', () => {
  assert.equal(getEffectiveLabelMode('auto', LARGE_GRAPH_LABEL_THRESHOLD), 'all');
});

test('auto switches to selected labels for large graphs', () => {
  assert.equal(getEffectiveLabelMode('auto', LARGE_GRAPH_LABEL_THRESHOLD + 1), 'selected');
});

test('selected labels include hovered, selected, and active demo nodes', () => {
  assert.equal(shouldRenderLeafCaption({
    labelMode: 'selected',
    leafCount: 200,
    nodeId: 'hovered',
    hoveredNodeId: 'hovered',
    selectedNodeId: null,
    activeNodeId: null,
  }), true);
  assert.equal(shouldRenderLeafCaption({
    labelMode: 'selected',
    leafCount: 200,
    nodeId: 'selected',
    hoveredNodeId: null,
    selectedNodeId: 'selected',
    activeNodeId: null,
  }), true);
  assert.equal(shouldRenderLeafCaption({
    labelMode: 'selected',
    leafCount: 200,
    nodeId: 'active',
    hoveredNodeId: null,
    selectedNodeId: null,
    activeNodeId: 'active',
  }), true);
  assert.equal(shouldRenderLeafCaption({
    labelMode: 'selected',
    leafCount: 200,
    nodeId: 'other',
    hoveredNodeId: null,
    selectedNodeId: 'selected',
    activeNodeId: 'active',
  }), false);
});
