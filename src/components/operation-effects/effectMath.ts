import * as THREE from 'three';
import type { LayoutNode } from '../../lib/irTypes';
import {
  DEMO_INPUT_TILE_SIZE,
  DEMO_KERNEL_SIZE,
  DEMO_POOL_SIZE,
  DEMO_POOL_STRIDE,
  DEMO_SAMPLE_SIZE,
} from './effectData';

export type DemoStop = {
  node: LayoutNode;
  label: string;
  position: THREE.Vector3;
};

export type GridRegion = {
  row: number;
  col: number;
  rows: number;
  cols: number;
};

export type SlidingWindowFrame = {
  outputRows: number;
  outputCols: number;
  totalSteps: number;
  step: number;
  completed: number;
  outputRow: number;
  outputCol: number;
  region: GridRegion;
};

export type SegmentState = {
  inputPosition: THREE.Vector3;
  activeStopIndex: number;
  activeStop: DemoStop | null;
  segmentProgress: number;
};

export function getNodeDemoPosition(node: LayoutNode): THREE.Vector3 {
  return new THREE.Vector3(
    node.x,
    node.y,
    node.z + node.depth / 2 + DEMO_SAMPLE_SIZE * 0.65,
  );
}

export function getDemoInputPosition(stops: DemoStop[]): THREE.Vector3 {
  const first = stops[0]?.node;
  if (!first) return new THREE.Vector3(-4, 0, 1.5);
  return new THREE.Vector3(
    first.x - first.width / 2 - DEMO_INPUT_TILE_SIZE * 0.9,
    first.y,
    first.z + first.depth / 2 + DEMO_SAMPLE_SIZE * 0.65,
  );
}

export function getSegmentState(stops: DemoStop[], progress: number): SegmentState {
  const inputPosition = getDemoInputPosition(stops);
  const activeStopIndex = progress <= 0 ? -1 : Math.min(stops.length - 1, Math.ceil(progress) - 1);
  const activeStop = activeStopIndex >= 0 ? stops[activeStopIndex] : null;
  const fractional = progress - Math.floor(progress);
  const segmentProgress = progress <= 0
    ? 0
    : progress >= stops.length
      ? 1
      : Math.abs(fractional) < 0.000001
        ? 1
        : THREE.MathUtils.clamp(fractional, 0, 1);

  return {
    inputPosition,
    activeStopIndex,
    activeStop,
    segmentProgress,
  };
}

export function normalizeMatrix(matrix: number[][]): number[][] {
  const flat = matrix.flat();
  const min = Math.min(...flat);
  const max = Math.max(...flat);
  const range = Math.max(max - min, 0.001);
  return matrix.map((row) => row.map((value) => (value - min) / range));
}

export function convolveDemoMatrix(input: number[][], kernel: number[][]): number[][] {
  const outputSize = input.length - kernel.length + 1;
  const raw = Array.from({ length: outputSize }, (_, row) => (
    Array.from({ length: outputSize }, (_, col) => {
      let sum = 0;
      for (let kr = 0; kr < kernel.length; kr++) {
        for (let kc = 0; kc < kernel[kr].length; kc++) {
          sum += input[row + kr][col + kc] * kernel[kr][kc];
        }
      }
      return sum;
    })
  ));
  return normalizeMatrix(raw);
}

export function maxPoolDemoMatrix(input: number[][], poolSize = DEMO_POOL_SIZE, stride = DEMO_POOL_STRIDE): number[][] {
  const outputRows = Math.floor((input.length - poolSize) / stride) + 1;
  const outputCols = Math.floor((input[0].length - poolSize) / stride) + 1;

  return Array.from({ length: outputRows }, (_, row) => (
    Array.from({ length: outputCols }, (_, col) => {
      let max = -Infinity;
      for (let pr = 0; pr < poolSize; pr++) {
        for (let pc = 0; pc < poolSize; pc++) {
          max = Math.max(max, input[row * stride + pr][col * stride + pc]);
        }
      }
      return max;
    })
  ));
}

export function avgPoolDemoMatrix(input: number[][], poolSize = DEMO_POOL_SIZE, stride = DEMO_POOL_STRIDE): number[][] {
  const outputRows = Math.floor((input.length - poolSize) / stride) + 1;
  const outputCols = Math.floor((input[0].length - poolSize) / stride) + 1;

  return Array.from({ length: outputRows }, (_, row) => (
    Array.from({ length: outputCols }, (_, col) => {
      let sum = 0;
      for (let pr = 0; pr < poolSize; pr++) {
        for (let pc = 0; pc < poolSize; pc++) {
          sum += input[row * stride + pr][col * stride + pc];
        }
      }
      return sum / (poolSize * poolSize);
    })
  ));
}

export function reluDemoMatrix(input: number[][]): number[][] {
  return input.map((row) => row.map((value) => Math.max(0, value)));
}

export function flattenMatrix(matrix: number[][]): number[] {
  return matrix.flat();
}

export function getSlidingWindowFrame(
  progress: number,
  inputRows: number,
  inputCols: number,
  windowRows: number,
  windowCols = windowRows,
  stride = 1,
): SlidingWindowFrame {
  const outputRows = Math.floor((inputRows - windowRows) / stride) + 1;
  const outputCols = Math.floor((inputCols - windowCols) / stride) + 1;
  const totalSteps = outputRows * outputCols;
  const clamped = THREE.MathUtils.clamp(progress, 0, 1);
  const step = Math.min(totalSteps - 1, Math.floor(clamped * totalSteps));
  const completed = Math.min(totalSteps, Math.floor(clamped * totalSteps));
  const outputRow = Math.floor(step / outputCols);
  const outputCol = step % outputCols;

  return {
    outputRows,
    outputCols,
    totalSteps,
    step,
    completed,
    outputRow,
    outputCol,
    region: {
      row: outputRow * stride,
      col: outputCol * stride,
      rows: windowRows,
      cols: windowCols,
    },
  };
}

export function getConvFrame(progress: number, inputSize: number): SlidingWindowFrame {
  return getSlidingWindowFrame(progress, inputSize, inputSize, DEMO_KERNEL_SIZE);
}

export function getPoolFrame(progress: number, inputRows: number, inputCols: number): SlidingWindowFrame {
  return getSlidingWindowFrame(progress, inputRows, inputCols, DEMO_POOL_SIZE, DEMO_POOL_SIZE, DEMO_POOL_STRIDE);
}

export function getRevealCount(progress: number, total: number): number {
  return Math.min(total, Math.floor(THREE.MathUtils.clamp(progress, 0, 1) * total));
}

export function getActiveCellFromFlatIndex(flatIndex: number, cols: number): { row: number; col: number } {
  return {
    row: Math.floor(flatIndex / cols),
    col: flatIndex % cols,
  };
}

export function getPanelPosition(node: LayoutNode): THREE.Vector3 {
  const position = getNodeDemoPosition(node);
  position.x += Math.max(node.width / 2 + 22.0, 24.0);
  position.y += Math.max(node.height / 2 + 9.0, 10.5);
  position.z += 2.4;
  return position;
}

export function getPanelScale(node: LayoutNode): number {
  return Math.max(2.25, Math.min(3.25, node.height / 3 + 1.7));
}
