import test from 'node:test';
import assert from 'node:assert/strict';
import { collectCollapsibleContainerIds, type IRGraph, type IRNode } from './irTypes.ts';

function container(id: string, children: IRNode[]): IRNode {
  return {
    id,
    name: id,
    op_type: id,
    in_shape: [],
    out_shape: [],
    params: 0,
    is_container: true,
    children,
  };
}

function leaf(id: string): IRNode {
  return {
    id,
    name: id,
    op_type: 'Linear',
    in_shape: [1],
    out_shape: [1],
    params: 1,
  };
}

test('collectCollapsibleContainerIds includes nested containers and excludes top-level roots', () => {
  const ir: IRGraph = {
    nodes: [
      container('root', [
        container('stage', [
          container('block', [leaf('layer')]),
        ]),
        container('empty', []),
      ]),
      container('second-root', [
        container('second-stage', [leaf('second-layer')]),
      ]),
    ],
    edges: [],
    stats: { total_params: 2, approx_memory_mb: 0 },
  };

  assert.deepEqual(
    [...collectCollapsibleContainerIds(ir)].sort(),
    ['block', 'second-stage', 'stage'],
  );
});
