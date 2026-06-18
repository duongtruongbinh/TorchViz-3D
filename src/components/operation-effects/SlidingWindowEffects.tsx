import React, { useMemo } from 'react';
import * as THREE from 'three';
import {
  DEMO_EDGE_KERNEL,
  DEMO_MNIST_MATRIX,
  DEMO_POOL_INPUT_MATRIX,
} from './effectData';
import {
  avgPoolDemoMatrix,
  convolveDemoMatrix,
  getConvFrame,
  getPoolFrame,
  maxPoolDemoMatrix,
} from './effectMath';
import {
  DemoArrow,
  DemoText,
  FeatureMapGrid,
  getGridCellCenter,
  getGridRegionCenter,
  MatrixPatch,
} from './EffectPrimitives';
import {
  getActiveIndex,
  OperationPanelFrame,
  shapeLabel,
  sliceRegion,
} from './shared';
import type { OperationEffectProps } from './types';

export const Conv2dEffect: React.FC<OperationEffectProps> = ({ node, segmentProgress, t }) => {
  const outputMatrix = useMemo(() => convolveDemoMatrix(DEMO_MNIST_MATRIX, DEMO_EDGE_KERNEL), []);
  const frame = getConvFrame(segmentProgress, DEMO_MNIST_MATRIX.length);
  const inputPos: [number, number, number] = [-2.8, -0.05, 0];
  const kernelPos: [number, number, number] = [0, 0.32, 0.02];
  const outputPos: [number, number, number] = [2.8, -0.05, 0];
  const outputRows = outputMatrix.length;
  const outputCols = outputMatrix[0].length;
  const inputWindowCenter = getGridRegionCenter(inputPos, 2.05, DEMO_MNIST_MATRIX.length, DEMO_MNIST_MATRIX[0].length, frame.region);
  const outputCellCenter = getGridCellCenter(outputPos, 1.74, outputRows, outputCols, frame.outputRow, frame.outputCol);

  return (
    <OperationPanelFrame node={node} width={7.45} height={3.08} title={t.convCaption}>
      <FeatureMapGrid matrix={DEMO_MNIST_MATRIX} size={2.05} position={inputPos} label={t.inputMap} highlightRegion={frame.region} />
      <MatrixPatch matrix={DEMO_EDGE_KERNEL} size={1.08} position={kernelPos} label={t.kernel} active />
      <FeatureMapGrid
        matrix={outputMatrix}
        size={1.74}
        position={outputPos}
        label={t.outputMap}
        activeCell={{ row: frame.outputRow, col: frame.outputCol }}
        revealedCells={frame.completed}
        dimUnrevealed
      />
      <DemoArrow points={[inputWindowCenter, new THREE.Vector3(-0.68, 0.32, 0.12), outputCellCenter]} />
    </OperationPanelFrame>
  );
};

export const MaxPoolEffect: React.FC<OperationEffectProps> = ({ node, segmentProgress, t }) => {
  const outputMatrix = useMemo(() => maxPoolDemoMatrix(DEMO_POOL_INPUT_MATRIX), []);
  const frame = getPoolFrame(segmentProgress, DEMO_POOL_INPUT_MATRIX.length, DEMO_POOL_INPUT_MATRIX[0].length);
  const poolPatch = sliceRegion(DEMO_POOL_INPUT_MATRIX, frame.region.row, frame.region.col, frame.region.rows, frame.region.cols);
  const inputPos: [number, number, number] = [-2.75, -0.05, 0];
  const windowPos: [number, number, number] = [0, 0.30, 0.02];
  const outputPos: [number, number, number] = [2.75, -0.05, 0];
  const inputWindowCenter = getGridRegionCenter(inputPos, 2.05, DEMO_POOL_INPUT_MATRIX.length, DEMO_POOL_INPUT_MATRIX[0].length, frame.region);
  const outputCellCenter = getGridCellCenter(outputPos, 1.58, outputMatrix.length, outputMatrix[0].length, frame.outputRow, frame.outputCol);

  return (
    <OperationPanelFrame node={node} width={7.25} height={3.02} title={t.poolCaption}>
      <FeatureMapGrid matrix={DEMO_POOL_INPUT_MATRIX} size={2.05} position={inputPos} label={t.inputMap} highlightRegion={frame.region} />
      <MatrixPatch matrix={poolPatch} size={0.98} position={windowPos} label={t.poolWindow} active />
      <FeatureMapGrid
        matrix={outputMatrix}
        size={1.58}
        position={outputPos}
        label={t.pooledOutput}
        activeCell={{ row: frame.outputRow, col: frame.outputCol }}
        revealedCells={frame.completed}
        dimUnrevealed
      />
      <DemoArrow points={[inputWindowCenter, new THREE.Vector3(-0.62, 0.30, 0.12), outputCellCenter]} />
    </OperationPanelFrame>
  );
};

export const AvgPoolEffect: React.FC<OperationEffectProps> = ({ node, segmentProgress, t }) => {
  const outputMatrix = useMemo(() => avgPoolDemoMatrix(DEMO_POOL_INPUT_MATRIX), []);
  const frame = getPoolFrame(segmentProgress, DEMO_POOL_INPUT_MATRIX.length, DEMO_POOL_INPUT_MATRIX[0].length);
  const inputPos: [number, number, number] = [-2.75, -0.05, 0];
  const outputPos: [number, number, number] = [2.75, -0.05, 0];
  const windowCenter = getGridRegionCenter(inputPos, 2.05, DEMO_POOL_INPUT_MATRIX.length, DEMO_POOL_INPUT_MATRIX[0].length, frame.region);
  const outputCenter = getGridCellCenter(outputPos, 1.58, outputMatrix.length, outputMatrix[0].length, frame.outputRow, frame.outputCol);

  return (
    <OperationPanelFrame node={node} width={7.25} height={3.02} title={t.avgPoolCaption}>
      <FeatureMapGrid matrix={DEMO_POOL_INPUT_MATRIX} size={2.05} position={inputPos} label={t.inputMap} highlightRegion={frame.region} />
      <DemoText position={[0, 0.25, 0.04]} fontSize={0.22} color="#fde68a">{t.meanWindow}</DemoText>
      <FeatureMapGrid
        matrix={outputMatrix}
        size={1.58}
        position={outputPos}
        label={t.averagedOutput}
        activeCell={{ row: frame.outputRow, col: frame.outputCol }}
        revealedCells={frame.completed}
        dimUnrevealed
      />
      <DemoArrow points={[windowCenter, new THREE.Vector3(0, 0.10, 0.12), outputCenter]} color="#fde68a" />
    </OperationPanelFrame>
  );
};

export const AdaptiveAvgPoolEffect: React.FC<OperationEffectProps> = ({ node, segmentProgress, t }) => {
  const outputMatrix = [[0.34, 0.56], [0.42, 0.70]];
  const step = getActiveIndex(segmentProgress, 4);
  const region = [
    { row: 0, col: 0, rows: 4, cols: 4 },
    { row: 0, col: 4, rows: 4, cols: 4 },
    { row: 4, col: 0, rows: 4, cols: 4 },
    { row: 4, col: 4, rows: 4, cols: 4 },
  ][step];
  const inputPos: [number, number, number] = [-2.75, -0.05, 0];
  const outputPos: [number, number, number] = [2.75, -0.05, 0];
  const source = getGridRegionCenter(inputPos, 2.05, 8, 8, region);
  const target = getGridCellCenter(outputPos, 1.35, 2, 2, Math.floor(step / 2), step % 2);

  return (
    <OperationPanelFrame node={node} width={7.25} height={3.02} title={t.adaptiveAvgPoolCaption}>
      <FeatureMapGrid matrix={DEMO_POOL_INPUT_MATRIX} size={2.05} position={inputPos} label={shapeLabel(node.in_shape)} highlightRegion={region} />
      <DemoText position={[0, 0.32, 0.04]} fontSize={0.2} color="#fde68a">{t.targetShape(shapeLabel(node.out_shape))}</DemoText>
      <FeatureMapGrid
        matrix={outputMatrix}
        size={1.35}
        position={outputPos}
        label={t.fixedOutput}
        activeCell={{ row: Math.floor(step / 2), col: step % 2 }}
        revealedCells={Math.ceil(segmentProgress * 4)}
        dimUnrevealed
      />
      <DemoArrow points={[source, new THREE.Vector3(0, 0.08, 0.12), target]} color="#fde68a" />
    </OperationPanelFrame>
  );
};
