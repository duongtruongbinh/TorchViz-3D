import * as THREE from 'three';
import type { LayoutEdge, LayoutNode } from '../../lib/irTypes';
import { getEasedSegmentProgress } from '../../lib/mnistAnimation.ts';
import { getVisualMeta } from '../../lib/visualKind.ts';
import {
  DEMO_INPUT_TILE_SIZE,
  DEMO_KERNEL_SIZE,
  DEMO_POOL_SIZE,
  DEMO_POOL_STRIDE,
  DEMO_SAMPLE_SIZE,
} from './effectData.ts';

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

export type DataPacketRoute = {
  position: THREE.Vector3;
  points: THREE.Vector3[];
  easedProgress: number;
  pulse: number;
};

// --- Single Pose API ---

export function getSamplePlaneRotation(): [number, number, number] {
  // Rotate plane normal [0, 0, 1] to [1, 0, 0] so it faces along +X (aligned with network block Y-Z face)
  return [0, Math.PI / 2, 0];
}

export function getNodeDemoPose(node: LayoutNode) {
  const meta = getVisualMeta(node.op_type);
  const w = node.depth * meta.depthMul;
  const h = node.height * meta.heightMul;
  return {
    position: new THREE.Vector3(node.x, node.y, node.z),
    rotation: getSamplePlaneRotation(),
    size: [w, h] as [number, number],
  };
}

export function getDemoInputPose(stops: DemoStop[]) {
  const first = stops[0]?.node;
  const gap = 2.5; // NODE_GAP
  if (!first) {
    return {
      position: new THREE.Vector3(-4, 0, 0),
      rotation: getSamplePlaneRotation(),
      size: [DEMO_INPUT_TILE_SIZE, DEMO_INPUT_TILE_SIZE] as [number, number],
    };
  }
  const firstMeta = getVisualMeta(first.op_type);
  const firstWidth = first.width * firstMeta.widthMul;
  return {
    position: new THREE.Vector3(
      first.x - firstWidth / 2 - gap,
      first.y,
      first.z,
    ),
    rotation: getSamplePlaneRotation(),
    size: [DEMO_INPUT_TILE_SIZE, DEMO_INPUT_TILE_SIZE] as [number, number],
  };
}

// Deprecated positions (keep for backward compatibility or intermediate conversions)
export function getNodeDemoPosition(node: LayoutNode): THREE.Vector3 {
  // New aligned position using getNodeDemoPose
  return getNodeDemoPose(node).position;
}

export function getDemoInputPosition(stops: DemoStop[]): THREE.Vector3 {
  // New aligned position using getDemoInputPose
  return getDemoInputPose(stops).position;
}

export function getSegmentState(stops: DemoStop[], progress: number, precomputedInputPos?: THREE.Vector3): SegmentState {
  const inputPosition = precomputedInputPos || getDemoInputPosition(stops);
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

function toVector3(point: LayoutEdge['points'][number]): THREE.Vector3 {
  return new THREE.Vector3(point.x, point.y, point.z);
}

function getCubicBezierPoint(points: THREE.Vector3[], progress: number): THREE.Vector3 {
  const [start, c1, c2, end] = points;
  const t = progress;
  const oneMinusT = 1 - t;
  return new THREE.Vector3(
    oneMinusT ** 3 * start.x + 3 * oneMinusT ** 2 * t * c1.x + 3 * oneMinusT * t ** 2 * c2.x + t ** 3 * end.x,
    oneMinusT ** 3 * start.y + 3 * oneMinusT ** 2 * t * c1.y + 3 * oneMinusT * t ** 2 * c2.y + t ** 3 * end.y,
    oneMinusT ** 3 * start.z + 3 * oneMinusT ** 2 * t * c1.z + 3 * oneMinusT * t ** 2 * c2.z + t ** 3 * end.z,
  );
}

function getPolylinePoint(points: THREE.Vector3[], progress: number): THREE.Vector3 {
  if (points.length === 1) return points[0].clone();

  const segmentLengths = points.slice(0, -1).map((point, index) => point.distanceTo(points[index + 1]));
  const totalLength = segmentLengths.reduce((total, length) => total + length, 0);
  if (totalLength <= 0.001) return points[0].clone();

  let remaining = totalLength * progress;
  for (let index = 0; index < segmentLengths.length; index++) {
    const length = segmentLengths[index];
    if (remaining <= length) {
      const localProgress = length <= 0.001 ? 0 : remaining / length;
      return new THREE.Vector3().lerpVectors(points[index], points[index + 1], localProgress);
    }
    remaining -= length;
  }

  return points[points.length - 1].clone();
}

function getEdgePoint(points: THREE.Vector3[], progress: number): THREE.Vector3 {
  if (points.length === 4) return getCubicBezierPoint(points, progress);
  return getPolylinePoint(points, progress);
}

export function getDataPacketRoute(stops: DemoStop[], segment: SegmentState, edges: LayoutEdge[]): DataPacketRoute | null {
  if (!segment.activeStop || segment.activeStopIndex < 0) return null;

  const easedProgress = getEasedSegmentProgress(segment.segmentProgress);
  const pulse = 0.55 + 0.45 * Math.sin(easedProgress * Math.PI);

  if (segment.activeStopIndex === 0) {
    // Virtual first route from input tile to the first block
    const start = segment.inputPosition;
    const end = segment.activeStop.position;
    const points = [start, end];
    const position = new THREE.Vector3().lerpVectors(start, end, easedProgress);
    return {
      position,
      points,
      easedProgress,
      pulse,
    };
  }

  const previousStop = stops[segment.activeStopIndex - 1];
  if (!previousStop) return null;

  const edge = edges.find((candidate) => (
    candidate.from === previousStop.node.id && candidate.to === segment.activeStop!.node.id
  ));
  if (!edge || edge.points.length < 2) return null;

  const points = edge.points.map(toVector3);
  const position = getEdgePoint(points, easedProgress);

  return {
    position,
    points,
    easedProgress,
    pulse,
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
  const horizontalOffset = node.x < 16
    ? Math.max(node.width / 2 + 22.0, 24.0)
    : Math.max(node.width / 2 + 10.0, 12.0);
  position.x += horizontalOffset;
  position.y += Math.max(node.height / 2 + 9.0, 10.5);
  position.z += 2.4;
  return position;
}

export function getPanelScale(node: LayoutNode): number {
  return Math.max(2.25, Math.min(3.25, node.height / 3 + 1.7));
}
