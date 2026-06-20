import React, { useMemo } from 'react';
import {
  DEMO_EDGE_KERNEL,
  DEMO_MNIST_MATRIX,
  DEMO_POOL_INPUT_MATRIX,
} from './effectData';
import {
  avgPoolDemoMatrix,
  convolveDemoMatrix,
  getConvFrame,
  getMatrixCenter,
  getPatchCenter,
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

const CONV_INPUT_POS: [number, number, number] = [-2.8, -0.05, 0];
const CONV_KERNEL_POS: [number, number, number] = [0, 0.32, 0.02];
const CONV_OUTPUT_POS: [number, number, number] = [2.8, -0.05, 0];
const CONV_INPUT_SIZE = 2.05;
const CONV_KERNEL_SIZE = 1.08;
const CONV_OUTPUT_SIZE = 1.74;

const POOL_INPUT_POS: [number, number, number] = [-2.75, -0.05, 0];
const POOL_WINDOW_POS: [number, number, number] = [0, 0.30, 0.02];
const POOL_OUTPUT_POS: [number, number, number] = [2.75, -0.05, 0];
const POOL_INPUT_SIZE = 2.05;
const POOL_WINDOW_SIZE = 0.98;
const POOL_OUTPUT_SIZE = 1.58;
const AVG_POOL_MEAN_POS: [number, number, number] = [0, 0.25, 0.04];
const ADAPTIVE_POOL_LABEL_POS: [number, number, number] = [0, 0.32, 0.04];

export const Conv2dEffect: React.FC<OperationEffectProps> = ({ node, segmentProgress, t }) => {
  const outputMatrix = useMemo(() => convolveDemoMatrix(DEMO_MNIST_MATRIX, DEMO_EDGE_KERNEL), []);
  const frame = getConvFrame(segmentProgress, DEMO_MNIST_MATRIX.length);
  const outputRows = outputMatrix.length;
  const outputCols = outputMatrix[0].length;
  const inputWindowCenter = useMemo(() => getGridRegionCenter(
    CONV_INPUT_POS,
    CONV_INPUT_SIZE,
    DEMO_MNIST_MATRIX.length,
    DEMO_MNIST_MATRIX[0].length,
    frame.region,
  ), [frame.region.col, frame.region.cols, frame.region.row, frame.region.rows]);
  const kernelCenter = useMemo(() => getPatchCenter(CONV_KERNEL_POS, CONV_KERNEL_SIZE), []);
  const outputCellCenter = useMemo(() => getGridCellCenter(
    CONV_OUTPUT_POS,
    CONV_OUTPUT_SIZE,
    outputRows,
    outputCols,
    frame.outputRow,
    frame.outputCol,
  ), [frame.outputCol, frame.outputRow, outputCols, outputRows]);
  const arrowPoints = useMemo(
    () => [inputWindowCenter, kernelCenter, outputCellCenter],
    [inputWindowCenter, kernelCenter, outputCellCenter],
  );

  return (
    <OperationPanelFrame node={node} width={7.45} height={3.08} title={t.convCaption}>
      <FeatureMapGrid matrix={DEMO_MNIST_MATRIX} size={CONV_INPUT_SIZE} position={CONV_INPUT_POS} label={t.inputMap} highlightRegion={frame.region} />
      <MatrixPatch matrix={DEMO_EDGE_KERNEL} size={CONV_KERNEL_SIZE} position={CONV_KERNEL_POS} label={t.kernel} active />
      <FeatureMapGrid
        matrix={outputMatrix}
        size={CONV_OUTPUT_SIZE}
        position={CONV_OUTPUT_POS}
        label={t.outputMap}
        activeCell={{ row: frame.outputRow, col: frame.outputCol }}
        revealedCells={frame.completed}
        dimUnrevealed
      />
      <DemoArrow points={arrowPoints} />
    </OperationPanelFrame>
  );
};

export const MaxPoolEffect: React.FC<OperationEffectProps> = ({ node, segmentProgress, t }) => {
  const outputMatrix = useMemo(() => maxPoolDemoMatrix(DEMO_POOL_INPUT_MATRIX), []);
  const frame = getPoolFrame(segmentProgress, DEMO_POOL_INPUT_MATRIX.length, DEMO_POOL_INPUT_MATRIX[0].length);
  const poolPatch = useMemo(() => sliceRegion(
    DEMO_POOL_INPUT_MATRIX,
    frame.region.row,
    frame.region.col,
    frame.region.rows,
    frame.region.cols,
  ), [frame.region.col, frame.region.cols, frame.region.row, frame.region.rows]);
  const inputWindowCenter = useMemo(() => getGridRegionCenter(
    POOL_INPUT_POS,
    POOL_INPUT_SIZE,
    DEMO_POOL_INPUT_MATRIX.length,
    DEMO_POOL_INPUT_MATRIX[0].length,
    frame.region,
  ), [frame.region.col, frame.region.cols, frame.region.row, frame.region.rows]);
  const poolWindowCenter = useMemo(() => getPatchCenter(POOL_WINDOW_POS, POOL_WINDOW_SIZE), []);
  const outputCellCenter = useMemo(() => getGridCellCenter(
    POOL_OUTPUT_POS,
    POOL_OUTPUT_SIZE,
    outputMatrix.length,
    outputMatrix[0].length,
    frame.outputRow,
    frame.outputCol,
  ), [frame.outputCol, frame.outputRow, outputMatrix]);
  const arrowPoints = useMemo(
    () => [inputWindowCenter, poolWindowCenter, outputCellCenter],
    [inputWindowCenter, poolWindowCenter, outputCellCenter],
  );

  return (
    <OperationPanelFrame node={node} width={7.25} height={3.02} title={t.poolCaption}>
      <FeatureMapGrid matrix={DEMO_POOL_INPUT_MATRIX} size={POOL_INPUT_SIZE} position={POOL_INPUT_POS} label={t.inputMap} highlightRegion={frame.region} />
      <MatrixPatch matrix={poolPatch} size={POOL_WINDOW_SIZE} position={POOL_WINDOW_POS} label={t.poolWindow} active />
      <FeatureMapGrid
        matrix={outputMatrix}
        size={POOL_OUTPUT_SIZE}
        position={POOL_OUTPUT_POS}
        label={t.pooledOutput}
        activeCell={{ row: frame.outputRow, col: frame.outputCol }}
        revealedCells={frame.completed}
        dimUnrevealed
      />
      <DemoArrow points={arrowPoints} />
    </OperationPanelFrame>
  );
};

export const AvgPoolEffect: React.FC<OperationEffectProps> = ({ node, segmentProgress, t }) => {
  const outputMatrix = useMemo(() => avgPoolDemoMatrix(DEMO_POOL_INPUT_MATRIX), []);
  const frame = getPoolFrame(segmentProgress, DEMO_POOL_INPUT_MATRIX.length, DEMO_POOL_INPUT_MATRIX[0].length);
  const inputWindowCenter = useMemo(() => getGridRegionCenter(
    POOL_INPUT_POS,
    POOL_INPUT_SIZE,
    DEMO_POOL_INPUT_MATRIX.length,
    DEMO_POOL_INPUT_MATRIX[0].length,
    frame.region,
  ), [frame.region.col, frame.region.cols, frame.region.row, frame.region.rows]);
  const poolingSummaryCenter = useMemo(() => getMatrixCenter(AVG_POOL_MEAN_POS, 0.08), []);
  const outputCenter = useMemo(() => getGridCellCenter(
    POOL_OUTPUT_POS,
    POOL_OUTPUT_SIZE,
    outputMatrix.length,
    outputMatrix[0].length,
    frame.outputRow,
    frame.outputCol,
  ), [frame.outputCol, frame.outputRow, outputMatrix]);
  const arrowPoints = useMemo(
    () => [inputWindowCenter, poolingSummaryCenter, outputCenter],
    [inputWindowCenter, poolingSummaryCenter, outputCenter],
  );

  return (
    <OperationPanelFrame node={node} width={7.25} height={3.02} title={t.avgPoolCaption}>
      <FeatureMapGrid matrix={DEMO_POOL_INPUT_MATRIX} size={POOL_INPUT_SIZE} position={POOL_INPUT_POS} label={t.inputMap} highlightRegion={frame.region} />
      <DemoText position={AVG_POOL_MEAN_POS} fontSize={0.22} color="#fde68a">{t.meanWindow}</DemoText>
      <FeatureMapGrid
        matrix={outputMatrix}
        size={POOL_OUTPUT_SIZE}
        position={POOL_OUTPUT_POS}
        label={t.averagedOutput}
        activeCell={{ row: frame.outputRow, col: frame.outputCol }}
        revealedCells={frame.completed}
        dimUnrevealed
      />
      <DemoArrow points={arrowPoints} color="#fde68a" />
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
  const source = useMemo(() => getGridRegionCenter(POOL_INPUT_POS, POOL_INPUT_SIZE, 8, 8, region), [step]);
  const summaryCenter = useMemo(() => getMatrixCenter(ADAPTIVE_POOL_LABEL_POS, 0.08), []);
  const target = useMemo(() => getGridCellCenter(POOL_OUTPUT_POS, 1.35, 2, 2, Math.floor(step / 2), step % 2), [step]);
  const arrowPoints = useMemo(
    () => [source, summaryCenter, target],
    [source, summaryCenter, target],
  );

  return (
    <OperationPanelFrame node={node} width={7.25} height={3.02} title={t.adaptiveAvgPoolCaption}>
      <FeatureMapGrid matrix={DEMO_POOL_INPUT_MATRIX} size={POOL_INPUT_SIZE} position={POOL_INPUT_POS} label={shapeLabel(node.in_shape)} highlightRegion={region} />
      <DemoText position={ADAPTIVE_POOL_LABEL_POS} fontSize={0.2} color="#fde68a">{t.targetShape(shapeLabel(node.out_shape))}</DemoText>
      <FeatureMapGrid
        matrix={outputMatrix}
        size={1.35}
        position={POOL_OUTPUT_POS}
        label={t.fixedOutput}
        activeCell={{ row: Math.floor(step / 2), col: step % 2 }}
        revealedCells={Math.ceil(segmentProgress * 4)}
        dimUnrevealed
      />
      <DemoArrow points={arrowPoints} color="#fde68a" />
    </OperationPanelFrame>
  );
};
