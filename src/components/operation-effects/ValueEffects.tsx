import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getVisualKind } from '../../lib/visualKind';
import {
  DEMO_CLASS_SCORES,
  DEMO_LINEAR_INPUT_VECTOR,
  DEMO_RELU_INPUT_MATRIX,
  DEMO_TARGET_CLASS,
} from './effectData';
import {
  getActiveCellFromFlatIndex,
  getRevealCount,
  reluDemoMatrix,
} from './effectMath';
import {
  DemoArrow,
  DemoText,
  FeatureMapGrid,
  getGridCellCenter,
  getUnitCenter,
  getVectorCellCenter,
  UnitColumn,
  VectorStrip,
} from './EffectPrimitives';
import {
  FunctionGraph,
  gelu,
  getActiveIndex,
  isOpType,
  MiniVector,
  OperationPanelFrame,
  shapeLabel,
  sigmoid,
  softmax,
} from './shared';
import type { OperationEffectProps } from './types';
import { CIFAR_CLASS_NAMES } from '../mnist-demo/cifarSamples';

export const ActivationEffect: React.FC<OperationEffectProps> = ({ node, segmentProgress, t }) => {
  const kind = getVisualKind(node.op_type);
  const input = [-2.4, -1.1, 0.0, 0.65, 1.45, 2.35];
  const graphFn = kind === 'Activation_Sigmoid' ? sigmoid
    : kind === 'Activation_Tanh' ? Math.tanh
      : kind === 'Activation_GELU' ? gelu
        : kind === 'Activation_SiLU' ? (x: number) => x * sigmoid(x)
          : (x: number) => x;
  const output = input.map((value) => {
    const raw = graphFn(value);
    if (kind === 'Activation_Sigmoid') return raw;
    if (kind === 'Activation_Tanh') return raw;
    return raw / 2.6;
  });
  const activeIndex = getActiveIndex(segmentProgress, input.length);
  const title = kind === 'Activation_Sigmoid' ? t.sigmoidCaption
    : kind === 'Activation_Tanh' ? t.tanhCaption
      : kind === 'Activation_GELU' ? t.geluCaption
        : kind === 'Activation_SiLU' ? t.siluCaption
          : t.activationCaption;
  const formula = kind === 'Activation_Sigmoid' ? '1 / (1 + e^-x)'
    : kind === 'Activation_Tanh' ? 'tanh(x)'
      : kind === 'Activation_GELU' ? 'x · Φ(x)'
        : kind === 'Activation_SiLU' ? 'x · σ(x)'
          : 'f(x)';
  const yRange: [number, number] = kind === 'Activation_Sigmoid'
    ? [-0.1, 1.1]
    : kind === 'Activation_Tanh'
      ? [-1.15, 1.15]
      : [-0.7, 3.0];
  const guides = kind === 'Activation_Sigmoid'
    ? [0, 0.5, 1]
    : kind === 'Activation_Tanh'
      ? [-1, 0, 1]
      : [0];
  const inputPos: [number, number, number] = [-2.55, 0.02, 0];
  const outputPos: [number, number, number] = [2.55, 0.02, 0];
  const vectorCellWidth = 0.28;
  const vectorWidth = input.length * vectorCellWidth;
  const vectorCellX = -vectorWidth / 2 + vectorCellWidth / 2 + activeIndex * vectorCellWidth;
  const source = new THREE.Vector3(inputPos[0] + vectorCellX, inputPos[1] + 0.12, 0.15);
  const target = new THREE.Vector3(outputPos[0] + vectorCellX, outputPos[1] + 0.12, 0.15);
  const graphPos: [number, number, number] = [0, 0.24, 0];
  const graphWidth = 1.92;
  const graphHeight = 1.32;
  const [graphYMin, graphYMax] = yRange;
  const activeX = input[activeIndex];
  const activeY = graphFn(activeX);
  const graphPoint = new THREE.Vector3(
    graphPos[0] + (activeX / 6) * graphWidth,
    graphPos[1] + ((THREE.MathUtils.clamp(activeY, graphYMin, graphYMax) - graphYMin) / (graphYMax - graphYMin) - 0.5) * graphHeight,
    0.16,
  );

  return (
    <OperationPanelFrame node={node} width={7.35} height={3.24} title={title}>
      <MiniVector values={input.map((value) => value / 2.6)} position={inputPos} label={t.inputX} signed cellWidth={vectorCellWidth} activeIndex={activeIndex} />
      <FunctionGraph
        fn={graphFn}
        position={graphPos}
        width={graphWidth}
        height={graphHeight}
        yRange={yRange}
        progress={1}
        color={kind === 'Activation_GELU' ? '#a78bfa' : kind === 'Activation_SiLU' ? '#5eead4' : '#67e8f9'}
        guides={guides}
        activeX={activeX}
        markerColor="#fde68a"
      />
      <DemoText position={[0, -0.76, 0.08]} fontSize={0.20} color="#fde68a">{formula}</DemoText>
      <MiniVector values={output} position={outputPos} label={shapeLabel(node.out_shape)} progress={segmentProgress} signed={kind === 'Activation_Tanh' || kind === 'Activation_GELU' || kind === 'Activation_SiLU'} cellWidth={vectorCellWidth} activeIndex={activeIndex} />
      <DemoArrow points={[source, graphPoint]} color="#fde68a" opacity={0.72} lineWidth={0.9} />
      <DemoArrow points={[graphPoint, target]} color="#fde68a" opacity={0.72} lineWidth={0.9} />
    </OperationPanelFrame>
  );
};

export const ReluEffect: React.FC<OperationEffectProps> = ({ node, segmentProgress, t }) => {
  const outputMatrix = useMemo(() => reluDemoMatrix(DEMO_RELU_INPUT_MATRIX), []);
  const total = DEMO_RELU_INPUT_MATRIX.length * DEMO_RELU_INPUT_MATRIX[0].length;
  const revealed = getRevealCount(segmentProgress, total);
  const activeIndex = getActiveIndex(segmentProgress, total);
  const activeCell = getActiveCellFromFlatIndex(activeIndex, DEMO_RELU_INPUT_MATRIX[0].length);
  const activeX = DEMO_RELU_INPUT_MATRIX[activeCell.row][activeCell.col] * 3;
  const inputPos: [number, number, number] = [-2.35, -0.05, 0];
  const outputPos: [number, number, number] = [2.35, -0.05, 0];
  const graphPos: [number, number, number] = [0, 0.24, 0];
  const graphWidth = 1.86;
  const graphHeight = 1.30;
  const graphYMin = -0.35;
  const graphYMax = 3;
  const graphPoint = new THREE.Vector3(
    graphPos[0] + (activeX / 6) * graphWidth,
    graphPos[1] + ((Math.max(0, activeX) - graphYMin) / (graphYMax - graphYMin) - 0.5) * graphHeight,
    0.16,
  );
  const source = getGridCellCenter(inputPos, 1.62, DEMO_RELU_INPUT_MATRIX.length, DEMO_RELU_INPUT_MATRIX[0].length, activeCell.row, activeCell.col);
  const target = getGridCellCenter(outputPos, 1.62, outputMatrix.length, outputMatrix[0].length, activeCell.row, activeCell.col);

  return (
    <OperationPanelFrame node={node} width={7.20} height={3.24} title={t.reluCaption}>
      <FeatureMapGrid matrix={DEMO_RELU_INPUT_MATRIX} size={1.62} position={inputPos} label={t.activations} activeCell={activeCell} signed />
      <FunctionGraph
        fn={(x) => Math.max(0, x)}
        position={graphPos}
        width={graphWidth}
        height={graphHeight}
        yRange={[-0.35, 3]}
        progress={1}
        color="#22d3ee"
        guides={[0]}
        activeX={activeX}
        markerColor="#fde68a"
      />
      <DemoText position={[0, -0.76, 0.08]} fontSize={0.20} color="#fde68a">ReLU(x) = max(0, x)</DemoText>
      <FeatureMapGrid
        matrix={outputMatrix}
        size={1.62}
        position={outputPos}
        label={t.reluOutput}
        activeCell={activeCell}
        revealedCells={revealed}
        dimUnrevealed
      />
      <DemoArrow points={[source, graphPoint]} opacity={0.72} color="#fde68a" lineWidth={0.9} />
      <DemoArrow points={[graphPoint, target]} opacity={0.72} color="#fde68a" lineWidth={0.9} />
    </OperationPanelFrame>
  );
};

export const SoftmaxEffect: React.FC<OperationEffectProps> = ({ node, segmentProgress, t }) => {
  const logits = [-0.2, 0.4, 1.3, 0.1, -0.5, 0.7];
  const probs = softmax(logits);
  const active = getActiveIndex(segmentProgress, logits.length);

  return (
    <OperationPanelFrame node={node} width={6.45} height={2.85} title={t.softmaxCaption}>
      <MiniVector values={logits} position={[-2.1, 0.02, 0]} label={t.logits} signed activeIndex={active} />
      <DemoText position={[0, 0.18, 0.04]} fontSize={0.18} color="#fde68a">exp(x) / Σ exp(x)</DemoText>
      <mesh position={[0, -0.13, 0.03]}>
        <ringGeometry args={[0.32, 0.39, 32]} />
        <meshBasicMaterial color="#fde68a" transparent opacity={0.72} toneMapped={false} />
      </mesh>
      <MiniVector values={probs.map((value) => value * 2.6)} position={[2.1, 0.02, 0]} label={t.probabilities} progress={segmentProgress} activeIndex={active} />
      <DemoArrow points={[new THREE.Vector3(-1.0, 0.03, 0.1), new THREE.Vector3(1.0, 0.03, 0.1)]} color="#fde68a" />
    </OperationPanelFrame>
  );
};

export const DropoutEffect: React.FC<OperationEffectProps> = ({ node, segmentProgress, t }) => {
  const input = [0.20, 0.72, 0.44, 0.88, 0.36, 0.64, 0.52, 0.78];
  const dropped = new Set([1, 4, 6]);
  const output = input.map((value, index) => dropped.has(index) ? 0 : Math.min(value * 1.4, 1));

  return (
    <OperationPanelFrame node={node} width={6.45} height={2.72} title={t.dropoutCaption}>
      <MiniVector values={input} position={[-2.1, 0.02, 0]} label={t.activations} />
      <mesh position={[0, 0.05, 0.06]}>
        <planeGeometry args={[1.0, 0.74]} />
        <meshBasicMaterial color="#fb7185" transparent opacity={0.18 + segmentProgress * 0.28} toneMapped={false} />
      </mesh>
      <DemoText position={[0, -0.58, 0]} fontSize={0.17} color="#fecdd3">{t.dropoutFormula}</DemoText>
      <MiniVector values={output} position={[2.1, 0.02, 0]} label={shapeLabel(node.out_shape)} progress={segmentProgress} dropped={dropped} />
      <DemoArrow points={[new THREE.Vector3(-1.02, 0.03, 0.1), new THREE.Vector3(1.02, 0.03, 0.1)]} color="#fb7185" />
    </OperationPanelFrame>
  );
};

export const NormEffect: React.FC<OperationEffectProps> = ({ node, segmentProgress, t }) => {
  const batch = isOpType(node.op_type, /batchnorm/i);
  const input = batch ? [0.18, 0.82, 0.44, 0.66, 0.30, 0.74] : [0.12, 0.60, 0.90, 0.38, 0.72, 0.24];
  const centered = input.map((value) => value - 0.52);
  const output = centered.map((value) => THREE.MathUtils.clamp(value * 1.7 + 0.5, 0, 1));
  const phase = segmentProgress < 0.38 ? 0 : segmentProgress < 0.70 ? 1 : 2;

  return (
    <OperationPanelFrame node={node} width={6.65} height={2.82} title={batch ? t.normBatchCaption : t.normLayerCaption}>
      <MiniVector values={input} position={[-2.15, 0.02, 0]} label={batch ? t.perChannelStats : t.perSampleFeatures} progress={1} activeIndex={getActiveIndex(segmentProgress, input.length)} />
      <mesh position={[0, 0.18, 0.03]}>
        <planeGeometry args={[0.08, 1.22]} />
        <meshBasicMaterial color="#fde68a" transparent opacity={0.78} toneMapped={false} />
      </mesh>
      <DemoText position={[0, -0.58, 0]} fontSize={0.17} color="#fde68a">μ, σ → γx + β</DemoText>
      <MiniVector values={phase === 0 ? centered : output} position={[2.15, 0.02, 0]} label={shapeLabel(node.out_shape)} progress={segmentProgress} signed={phase === 0} />
      <DemoArrow points={[new THREE.Vector3(-1.0, 0.04, 0.1), new THREE.Vector3(1.0, 0.04, 0.1)]} color={phase === 2 ? '#c084fc' : '#67e8f9'} />
    </OperationPanelFrame>
  );
};

export const LinearEffect: React.FC<OperationEffectProps> = ({ node, segmentProgress, targetClass, t }) => {
  const classCount = DEMO_CLASS_SCORES.length;
  const winningClass = (((targetClass ?? DEMO_TARGET_CLASS) % classCount) + classCount) % classCount;
  // Rotate the canned scores so their peak lands on the active sample's class,
  // making the highlighted output prediction match the CIFAR-10 input image.
  const classScores = useMemo(() => {
    const shift = winningClass - DEMO_TARGET_CLASS;
    return DEMO_CLASS_SCORES.map((_, i) => DEMO_CLASS_SCORES[(((i - shift) % classCount) + classCount) % classCount]);
  }, [winningClass, classCount]);

  const revealedUnits = Math.min(classCount, Math.max(1, Math.ceil(segmentProgress * classCount)));
  const scanIndex = getActiveIndex(segmentProgress, classCount);
  const activeUnit = segmentProgress > 0.82 ? winningClass : scanIndex;
  const activeInput = getActiveIndex((segmentProgress * 1.35) % 1, DEMO_LINEAR_INPUT_VECTOR.length);
  const vectorPos: [number, number, number] = [-1.65, 0, 0];
  const unitsPos: [number, number, number] = [2.35, 0, 0];
  const inputSamples = [0, 2, 5, 8, 11];

  return (
    <OperationPanelFrame node={node} width={6.45} height={4.12} title={t.linearCaption}>
      <VectorStrip values={DEMO_LINEAR_INPUT_VECTOR} position={vectorPos} label={t.inputVector} cellWidth={0.30} cellHeight={0.14} activeIndex={activeInput} orientation="vertical" />
      {classScores.map((_, unitIndex) => {
        const visible = unitIndex < revealedUnits || unitIndex === activeUnit;
        const unitCenter = getUnitCenter(unitsPos, classCount, unitIndex);
        const lineSamples = unitIndex === activeUnit ? inputSamples : inputSamples.filter((_, index) => index % 2 === unitIndex % 2).slice(0, 2);
        return lineSamples.map((inputIndex) => {
          const inputCenter = getVectorCellCenter(vectorPos, DEMO_LINEAR_INPUT_VECTOR.length, 0.30, inputIndex, 0.12, 'vertical', 0.14);
          const focus = unitIndex === activeUnit && (inputIndex === activeInput || segmentProgress > 0.82);
          return (
            <DemoArrow
              key={`${unitIndex}-${inputIndex}`}
              points={[inputCenter, unitCenter]}
              color={focus ? '#6ee7b7' : '#38bdf8'}
              opacity={visible ? focus ? 0.90 : 0.26 : 0.08}
              lineWidth={focus ? 2.2 : 1}
            />
          );
        });
      })}
      <UnitColumn
        values={classScores}
        position={unitsPos}
        label={t.classScores}
        revealedUnits={revealedUnits}
        activeIndex={activeUnit}
        activeLabel={segmentProgress > 0.82 ? CIFAR_CLASS_NAMES[winningClass] : undefined}
      />
    </OperationPanelFrame>
  );
};
