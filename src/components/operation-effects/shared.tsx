import React from 'react';
import * as THREE from 'three';
import type { LayoutNode } from '../../lib/irTypes';
import {
  DemoArrow,
  DemoText,
  PanelShell,
} from './EffectPrimitives';
import {
  getPanelPosition,
  getPanelScale,
} from './effectMath';

export const OperationPanelFrame: React.FC<{
  node: LayoutNode;
  width: number;
  height: number;
  title: string;
  children: React.ReactNode;
}> = ({ node, width, height, title, children }) => {
  const panelPosition = getPanelPosition(node);
  const panelScale = getPanelScale(node);

  return (
    <group>
      <PanelShell
        position={panelPosition}
        scale={panelScale}
        width={width}
        height={height}
        title={title}
      >
        {children}
      </PanelShell>
    </group>
  );
};

export function sliceRegion(matrix: number[][], row: number, col: number, rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, (_, r) => (
    Array.from({ length: cols }, (_, c) => matrix[row + r][col + c])
  ));
}

export function getActiveIndex(progress: number, total: number): number {
  return Math.min(total - 1, Math.floor(THREE.MathUtils.clamp(progress, 0, 1) * total));
}

export function shapeLabel(shape: number[] | undefined, fallback = 'same shape'): string {
  return shape?.length ? shape.join(' x ') : fallback;
}

export function isOpType(opType: string, pattern: RegExp): boolean {
  return pattern.test(opType);
}

export function sigmoid(value: number): number {
  return 1 / (1 + Math.exp(-value));
}

export function gelu(value: number): number {
  const inner = Math.sqrt(2 / Math.PI) * (value + 0.044715 * value ** 3);
  return 0.5 * value * (1 + Math.tanh(inner));
}

export function softmax(values: number[]): number[] {
  const max = Math.max(...values);
  const exps = values.map((value) => Math.exp(value - max));
  const sum = exps.reduce((total, value) => total + value, 0);
  return exps.map((value) => value / sum);
}

function valueColor(value: number, signed = false): string {
  if (signed && value < 0) return '#64748b';
  const amount = THREE.MathUtils.clamp(Math.abs(value), 0, 1);
  return new THREE.Color('#0ea5e9').lerp(new THREE.Color('#6ee7b7'), amount).getStyle();
}

export const MiniVector: React.FC<{
  values: number[];
  position: [number, number, number];
  label: string;
  progress?: number;
  signed?: boolean;
  activeIndex?: number;
  dropped?: Set<number>;
  cellWidth?: number;
}> = ({ values, position, label, progress = 1, signed = false, activeIndex, dropped, cellWidth = 0.34 }) => {
  const width = values.length * cellWidth;
  const startX = -width / 2 + cellWidth / 2;
  const visible = Math.max(1, Math.ceil(THREE.MathUtils.clamp(progress, 0, 1) * values.length));

  return (
    <group position={position}>
      <mesh position={[0, 0, -0.035]}>
        <planeGeometry args={[width + 0.22, 0.58]} />
        <meshBasicMaterial color="#020617" transparent opacity={0.88} toneMapped={false} />
      </mesh>
      {values.map((value, index) => {
        const isVisible = index < visible;
        const isDropped = dropped?.has(index) ?? false;
        const active = index === activeIndex;
        const height = 0.14 + THREE.MathUtils.clamp(Math.abs(value), 0, 1.2) * 0.32;
        return (
          <group key={index} position={[startX + index * cellWidth, 0, active ? 0.04 : 0]}>
            <mesh position={[0, signed && value < 0 ? -height / 2 : height / 2, 0]}>
              <planeGeometry args={[cellWidth * 0.72, height]} />
              <meshBasicMaterial
                color={isDropped ? '#475569' : active ? '#fde68a' : valueColor(value, signed)}
                transparent
                opacity={isVisible ? isDropped ? 0.26 : 0.88 : 0.12}
                toneMapped={false}
              />
            </mesh>
            {isDropped && (
              <mesh position={[0, 0, 0.05]}>
                <ringGeometry args={[0.095, 0.12, 20]} />
                <meshBasicMaterial color="#fb7185" transparent opacity={0.8} toneMapped={false} />
              </mesh>
            )}
          </group>
        );
      })}
      <DemoText position={[0, -0.54, 0]} fontSize={0.18}>{label}</DemoText>
    </group>
  );
};

export const FunctionGraph: React.FC<{
  fn: (x: number) => number;
  position: [number, number, number];
  width: number;
  height: number;
  xRange?: [number, number];
  yRange: [number, number];
  progress: number;
  color?: string;
  label?: string;
  guides?: number[];
  activeX?: number;
  markerColor?: string;
}> = ({
  fn,
  position,
  width,
  height,
  xRange = [-3, 3],
  yRange,
  progress,
  color = '#67e8f9',
  label,
  guides = [],
  activeX,
  markerColor = '#fde68a',
}) => {
  const sampleCount = 72;
  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;
  const toPoint = (x: number, y: number) => new THREE.Vector3(
    ((x - xMin) / (xMax - xMin) - 0.5) * width,
    ((THREE.MathUtils.clamp(y, yMin, yMax) - yMin) / (yMax - yMin) - 0.5) * height,
    0.08,
  );
  const curve = Array.from({ length: sampleCount }, (_, index) => {
    const pct = index / (sampleCount - 1);
    const x = xMin + pct * (xMax - xMin);
    return toPoint(x, fn(x));
  });
  const revealed = Math.max(2, Math.ceil(THREE.MathUtils.clamp(progress, 0, 1) * curve.length));
  const activeY = activeX === undefined ? undefined : fn(activeX);
  const activePoint = activeX === undefined || activeY === undefined ? null : toPoint(activeX, activeY);
  const activeXPoint = activeX === undefined ? null : toPoint(activeX, 0);
  const activeYPoint = activeY === undefined ? null : toPoint(0, activeY);

  return (
    <group position={position}>
      <mesh position={[0, 0, -0.035]}>
        <planeGeometry args={[width + 0.28, height + 0.32]} />
        <meshBasicMaterial color="#020617" transparent opacity={0.88} toneMapped={false} />
      </mesh>
      <DemoArrow
        points={[toPoint(xMin, 0), toPoint(xMax, 0)]}
        color="#64748b"
        opacity={0.62}
        lineWidth={1.1}
      />
      <DemoArrow
        points={[toPoint(0, yMin), toPoint(0, yMax)]}
        color="#64748b"
        opacity={0.62}
        lineWidth={1.1}
      />
      {guides.map((guide) => (
        <DemoArrow
          key={guide}
          points={[toPoint(xMin, guide), toPoint(xMax, guide)]}
          color="#334155"
          opacity={0.45}
          lineWidth={0.8}
        />
      ))}
      <DemoArrow points={curve.slice(0, revealed)} color={color} opacity={0.96} lineWidth={2.5} />
      {activePoint && activeXPoint && activeYPoint && (
        <>
          <DemoArrow points={[activeXPoint, activePoint]} color={markerColor} opacity={0.62} lineWidth={0.75} />
          <DemoArrow points={[activeYPoint, activePoint]} color={markerColor} opacity={0.30} lineWidth={0.65} />
          <mesh position={activePoint.toArray()}>
            <circleGeometry args={[0.055, 24]} />
            <meshBasicMaterial color={markerColor} transparent opacity={0.96} toneMapped={false} />
          </mesh>
          <mesh position={[activePoint.x, activePoint.y, activePoint.z - 0.01]}>
            <ringGeometry args={[0.078, 0.103, 24]} />
            <meshBasicMaterial color={markerColor} transparent opacity={0.42 + 0.25 * Math.sin(progress * Math.PI * 10)} toneMapped={false} />
          </mesh>
        </>
      )}
      {label && <DemoText position={[0, -height / 2 - 0.24, 0.05]} fontSize={0.15} color="#cbd5e1">{label}</DemoText>}
    </group>
  );
};

export const AxisBadge: React.FC<{
  label: string;
  position: [number, number, number];
  color: string;
  angle?: number;
}> = ({ label, position, color, angle = 0 }) => (
  <group position={position} rotation={[0, 0, angle]}>
    <DemoArrow
      points={[new THREE.Vector3(-0.34, 0, 0.03), new THREE.Vector3(0.34, 0, 0.03)]}
      color={color}
      opacity={0.86}
      lineWidth={2.4}
    />
    <DemoText position={[0.48, 0, 0.04]} fontSize={0.16} color={color}>{label}</DemoText>
  </group>
);
