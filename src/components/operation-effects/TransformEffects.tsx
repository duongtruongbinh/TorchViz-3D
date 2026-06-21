import React, { useMemo } from 'react';
import * as THREE from 'three';
import {
  DEMO_FLATTEN_SOURCE_MATRIX,
  DEMO_POOL_INPUT_MATRIX,
} from './effectData';
import {
  flattenMatrix,
  getActiveCellFromFlatIndex,
  getRevealCount,
} from './effectMath';
import {
  DemoArrow,
  DemoText,
  FeatureMapGrid,
  getGridCellCenter,
  getVectorCellCenter,
  VectorStrip,
} from './EffectPrimitives';
import {
  AxisBadge,
  getActiveIndex,
  isOpType,
  OperationPanelFrame,
  shapeLabel,
} from './shared';
import type { OperationEffectProps } from './types';

export const FlattenEffect: React.FC<OperationEffectProps> = ({ node, segmentProgress, t }) => {
  const vector = useMemo(() => flattenMatrix(DEMO_FLATTEN_SOURCE_MATRIX), []);
  const total = vector.length;
  const revealed = getRevealCount(segmentProgress, total);
  const activeIndex = getActiveIndex(segmentProgress, total);
  const activeCell = getActiveCellFromFlatIndex(activeIndex, DEMO_FLATTEN_SOURCE_MATRIX[0].length);
  const inputPos: [number, number, number] = [-1.85, -0.05, 0];
  const vectorPos: [number, number, number] = [1.35, -0.05, 0];
  const source = getGridCellCenter(inputPos, 1.72, DEMO_FLATTEN_SOURCE_MATRIX.length, DEMO_FLATTEN_SOURCE_MATRIX[0].length, activeCell.row, activeCell.col);
  const target = getVectorCellCenter(vectorPos, vector.length, 0.26, activeIndex, 0.12, 'vertical', 0.10);

  return (
    <OperationPanelFrame node={node} width={5.80} height={3.18} title={t.flattenCaption}>
      <FeatureMapGrid matrix={DEMO_FLATTEN_SOURCE_MATRIX} size={1.72} position={inputPos} label={t.inputMap} activeCell={activeCell} />
      <VectorStrip
        values={vector}
        position={vectorPos}
        label={t.flattenVector}
        cellWidth={0.26}
        cellHeight={0.10}
        revealedCells={revealed}
        activeIndex={activeIndex}
        orientation="vertical"
      />
      <DemoArrow points={[source, target]} opacity={0.82} />
    </OperationPanelFrame>
  );
};

export const ReshapeEffect: React.FC<OperationEffectProps> = ({ node, segmentProgress, t }) => {
  const vector = useMemo(() => flattenMatrix(DEMO_FLATTEN_SOURCE_MATRIX), []);
  const activeIndex = getActiveIndex(segmentProgress, vector.length);
  const activeCell = getActiveCellFromFlatIndex(activeIndex, DEMO_FLATTEN_SOURCE_MATRIX[0].length);
  const source = getGridCellCenter([-2.15, 0.02, 0], 1.54, 4, 5, activeCell.row, activeCell.col);
  const target = getVectorCellCenter([1.85, 0.02, 0], vector.length, 0.24, activeIndex, 0.12, 'vertical', 0.10);

  return (
    <OperationPanelFrame node={node} width={6.35} height={3.16} title={t.reshapeCaption}>
      <FeatureMapGrid matrix={DEMO_FLATTEN_SOURCE_MATRIX} size={1.54} position={[-2.15, 0.02, 0]} label={shapeLabel(node.in_shape)} activeCell={activeCell} />
      <DemoText position={[0, 0.34, 0.04]} fontSize={0.18} color="#fde68a">{t.orderPreserved}</DemoText>
      <VectorStrip values={vector} position={[1.85, 0.02, 0]} label={shapeLabel(node.out_shape)} cellWidth={0.24} cellHeight={0.10} revealedCells={getRevealCount(segmentProgress, vector.length)} activeIndex={activeIndex} orientation="vertical" />
      <DemoArrow points={[source, new THREE.Vector3(-0.1, 0.24, 0.12), target]} color="#f59e0b" />
    </OperationPanelFrame>
  );
};

export const PermuteEffect: React.FC<OperationEffectProps> = ({ node, segmentProgress, t }) => {
  const turn = THREE.MathUtils.smoothstep(segmentProgress, 0.15, 0.85);

  return (
    <OperationPanelFrame node={node} width={5.85} height={2.9} title={t.permuteCaption}>
      <mesh position={[-1.55, 0.02, 0]}>
        <boxGeometry args={[1.25, 1.0, 0.12]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.82} toneMapped={false} />
      </mesh>
      <AxisBadge label="C" position={[-1.55, 0.78, 0.08]} color="#c084fc" angle={turn * Math.PI / 2} />
      <AxisBadge label="H" position={[-2.35 + turn * 1.6, -0.02, 0.08]} color="#60a5fa" angle={Math.PI / 2 - turn * Math.PI / 2} />
      <AxisBadge label="W" position={[-1.55, -0.72, 0.08]} color="#34d399" />
      <DemoText position={[0, -0.62, 0]} fontSize={0.18} color="#fde68a">{t.axisOrderChanges}</DemoText>
      <mesh position={[1.55, 0.02, 0]}>
        <boxGeometry args={[1.0 + turn * 0.35, 1.25 - turn * 0.2, 0.12]} />
        <meshBasicMaterial color="#111827" transparent opacity={0.84} toneMapped={false} />
      </mesh>
      <DemoText position={[-1.55, -1.06, 0]} fontSize={0.16}>{shapeLabel(node.in_shape)}</DemoText>
      <DemoText position={[1.55, -1.06, 0]} fontSize={0.16}>{shapeLabel(node.out_shape)}</DemoText>
      <DemoArrow points={[new THREE.Vector3(-0.68, 0.03, 0.1), new THREE.Vector3(0.68, 0.03, 0.1)]} color="#f59e0b" />
    </OperationPanelFrame>
  );
};

export const AddConcatEffect: React.FC<OperationEffectProps> = ({ node, segmentProgress, t }) => {
  const concat = isOpType(node.op_type, /concat|cat/i);
  const left: [number, number, number] = [-2.05, 0.42, 0];
  const right: [number, number, number] = [-2.05, -0.42, 0];
  const output: [number, number, number] = [1.85, 0, 0];
  const slide = THREE.MathUtils.smoothstep(segmentProgress, 0.2, 0.85);

  return (
    <OperationPanelFrame node={node} width={6.45} height={2.9} title={concat ? t.concatCaption : t.addResidualCaption}>
      <FeatureMapGrid matrix={DEMO_FLATTEN_SOURCE_MATRIX.slice(0, 3)} size={1.12} position={[left[0] + slide * 0.42, left[1], left[2]]} label="A" />
      <FeatureMapGrid matrix={DEMO_POOL_INPUT_MATRIX.slice(0, 3).map((row) => row.slice(0, 5))} size={1.12} position={[right[0] + slide * 0.42, right[1], right[2]]} label={concat ? 'B' : 'F(x)'} />
      <DemoText position={[0, 0, 0.06]} fontSize={0.28} color={concat ? '#fde68a' : '#fecaca'}>{concat ? t.concatAxisAdd : '+'}</DemoText>
      <mesh position={[output[0], output[1], 0]}>
        <planeGeometry args={concat ? [1.82, 1.08] : [1.08, 1.08]} />
        <meshBasicMaterial color={concat ? '#14b8a6' : '#22c55e'} transparent opacity={0.22 + slide * 0.48} toneMapped={false} />
      </mesh>
      <DemoText position={[output[0], -0.82, 0]} fontSize={0.17}>{shapeLabel(node.out_shape)}</DemoText>
      <DemoArrow points={[new THREE.Vector3(-1.2, 0.34, 0.1), new THREE.Vector3(0.92, 0.06, 0.1)]} color={concat ? '#2dd4bf' : '#f87171'} />
      <DemoArrow points={[new THREE.Vector3(-1.2, -0.34, 0.1), new THREE.Vector3(0.92, -0.06, 0.1)]} color={concat ? '#2dd4bf' : '#f87171'} />
    </OperationPanelFrame>
  );
};
