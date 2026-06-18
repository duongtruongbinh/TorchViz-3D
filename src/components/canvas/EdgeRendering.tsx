import React from 'react';
import { CubicBezierLine, Line } from '@react-three/drei';
import * as THREE from 'three';
import { LayoutEdge } from '../../lib/irTypes';
import { EDGE_COLOR_RESIDUAL, EDGE_COLOR_STD } from '../../lib/constants';

interface EdgeLineProps {
  edge: LayoutEdge & { vectorPoints?: THREE.Vector3[] };
}

export const EdgeLine: React.FC<EdgeLineProps> = React.memo(({ edge }) => {
  const { points, kind } = edge;
  const color = kind === 'residual' ? EDGE_COLOR_RESIDUAL : EDGE_COLOR_STD;

  // Use pre-computed Vector3s if available to avoid garbage collection overhead
  const pts = edge.vectorPoints || points.map(p => new THREE.Vector3(p.x, p.y, p.z));

  if (pts.length === 4) {
    return (
      <CubicBezierLine
        start={pts[0]}
        midA={pts[1]}
        midB={pts[2]}
        end={pts[3]}
        color={color}
        lineWidth={2}
      />
    );
  }

  if (pts.length >= 5) {
    return (
      <Line
        points={pts}
        color={color}
        lineWidth={kind === 'residual' ? 1 : 2}
        dashed={kind === 'residual'}
        dashScale={2}
      />
    );
  }

  return null;
});
