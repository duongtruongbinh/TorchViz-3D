import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getEffectiveLabelMode,
  shouldRenderLeafCaption,
  LARGE_GRAPH_LABEL_THRESHOLD,
} from './labelMode.ts';

test('label policy covers automatic thresholds and selected-node visibility', () => {
  assert.equal(getEffectiveLabelMode('auto', LARGE_GRAPH_LABEL_THRESHOLD), 'all');
  assert.equal(getEffectiveLabelMode('auto', LARGE_GRAPH_LABEL_THRESHOLD + 1), 'selected');

  const cases = [
    { nodeId: 'hovered', hoveredNodeId: 'hovered', selectedNodeId: null, activeNodeId: null, expected: true },
    { nodeId: 'selected', hoveredNodeId: null, selectedNodeId: 'selected', activeNodeId: null, expected: true },
    { nodeId: 'active', hoveredNodeId: null, selectedNodeId: null, activeNodeId: 'active', expected: true },
    { nodeId: 'other', hoveredNodeId: null, selectedNodeId: 'selected', activeNodeId: 'active', expected: false },
  ];
  for (const scenario of cases) {
    const { expected, ...state } = scenario;
    assert.equal(shouldRenderLeafCaption({ labelMode: 'selected', leafCount: 200, ...state }), expected, scenario.nodeId);
  }
});
