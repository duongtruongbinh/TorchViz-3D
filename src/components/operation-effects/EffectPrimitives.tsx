import React from 'react';
import { Billboard, Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { GridRegion } from './effectMath';

const FONT_URL = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff';

const textBaseProps = {
  font: FONT_URL,
  anchorX: 'center' as const,
  anchorY: 'middle' as const,
  outlineWidth: 0.018,
  outlineColor: '#000000',
  outlineBlur: 0,
  maxWidth: 5,
  onSync: (t: { material: { depthTest: boolean; depthWrite: boolean } }) => {
    t.material.depthTest = false;
    t.material.depthWrite = false;
  },
};

function totalCells(matrix: number[][]): number {
  return matrix.length * (matrix[0]?.length ?? 0);
}

function normalizeValue(value: number): number {
  return Math.max(0, Math.min(value, 1));
}

function getCellColor(value: number, signed = false): THREE.Color {
  if (signed && value < 0) {
    const amount = Math.min(Math.abs(value), 1);
    return new THREE.Color('#0f172a').lerp(new THREE.Color('#64748b'), 0.25 + amount * 0.45);
  }
  const intensity = normalizeValue(value);
  return new THREE.Color().setRGB(
    0.03 + intensity * 0.70,
    0.06 + intensity * 0.82,
    0.10 + intensity * 0.92,
  );
}

export function getGridCellCenter(
  gridPosition: [number, number, number],
  size: number,
  rows: number,
  cols: number,
  row: number,
  col: number,
  z = 0.12,
): THREE.Vector3 {
  const cellW = size / cols;
  const cellH = size / rows;
  return new THREE.Vector3(
    gridPosition[0] - size / 2 + cellW / 2 + col * cellW,
    gridPosition[1] + size / 2 - cellH / 2 - row * cellH,
    gridPosition[2] + z,
  );
}

export function getGridRegionCenter(
  gridPosition: [number, number, number],
  size: number,
  rows: number,
  cols: number,
  region: GridRegion,
  z = 0.12,
): THREE.Vector3 {
  const cellW = size / cols;
  const cellH = size / rows;
  return new THREE.Vector3(
    gridPosition[0] - size / 2 + cellW * (region.col + region.cols / 2),
    gridPosition[1] + size / 2 - cellH * (region.row + region.rows / 2),
    gridPosition[2] + z,
  );
}

export const PanelShell: React.FC<{
  position: THREE.Vector3;
  scale: number;
  width: number;
  height: number;
  title: string;
  children: React.ReactNode;
}> = ({ position, scale, width, height, title, children }) => (
  <Billboard position={position.toArray()} renderOrder={2300}>
    <group scale={scale}>
      <mesh position={[0, 0, -0.14]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#020617" transparent opacity={0.70} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.13]}>
        <planeGeometry args={[width - 0.10, height - 0.10]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.18} wireframe toneMapped={false} />
      </mesh>
      <Text
        {...textBaseProps}
        fontSize={title.length > 38 ? 0.18 : title.length > 28 ? 0.21 : 0.24}
        color="#bfdbfe"
        outlineWidth={0.014}
        maxWidth={width - 0.45}
        position={[0, height / 2 - 0.34, 0]}
        renderOrder={2301}
      >
        {title}
      </Text>
      {children}
    </group>
  </Billboard>
);

export const DemoText: React.FC<{
  children: React.ReactNode;
  position: [number, number, number];
  fontSize?: number;
  color?: string;
  maxWidth?: number;
}> = ({ children, position, fontSize = 0.18, color = '#dbeafe', maxWidth = 4.8 }) => (
  <Text
    {...textBaseProps}
    fontSize={fontSize}
    color={color}
    outlineWidth={0.012}
    maxWidth={maxWidth}
    position={position}
    renderOrder={2302}
  >
    {children}
  </Text>
);

export const FeatureMapGrid: React.FC<{
  matrix: number[][];
  size: number;
  position: [number, number, number];
  label: string;
  highlightRegion?: GridRegion;
  activeCell?: { row: number; col: number };
  revealedCells?: number;
  dimUnrevealed?: boolean;
  signed?: boolean;
}> = ({
  matrix,
  size,
  position,
  label,
  highlightRegion,
  activeCell,
  revealedCells = totalCells(matrix),
  dimUnrevealed = false,
  signed = false,
}) => {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 1;
  const cellW = size / cols;
  const cellH = size / rows;
  const offsetX = -size / 2 + cellW / 2;
  const offsetY = size / 2 - cellH / 2;

  return (
    <group position={position}>
      <mesh position={[0, 0, -0.035]}>
        <planeGeometry args={[size + 0.26, size + 0.26]} />
        <meshBasicMaterial color="#020617" transparent opacity={0.92} toneMapped={false} />
      </mesh>
      {matrix.map((row, rowIndex) => row.map((value, colIndex) => {
        const flatIndex = rowIndex * cols + colIndex;
        const revealed = flatIndex < revealedCells;
        const inRegion = !!highlightRegion
          && rowIndex >= highlightRegion.row
          && rowIndex < highlightRegion.row + highlightRegion.rows
          && colIndex >= highlightRegion.col
          && colIndex < highlightRegion.col + highlightRegion.cols;
        const isActive = activeCell?.row === rowIndex && activeCell?.col === colIndex;
        const visibleValue = dimUnrevealed && !revealed ? 0 : value;
        const isZeroOutput = !signed && visibleValue <= 0.001;
        const color = getCellColor(visibleValue, signed);

        return (
          <mesh
            key={`${rowIndex}-${colIndex}`}
            position={[
              offsetX + colIndex * cellW,
              offsetY - rowIndex * cellH,
              inRegion || isActive ? 0.025 : 0,
            ]}
          >
            <planeGeometry args={[cellW * 0.88, cellH * 0.88]} />
            <meshBasicMaterial
              color={isActive ? '#6ee7b7' : inRegion ? '#38bdf8' : color}
              transparent
              opacity={
                dimUnrevealed && !revealed
                  ? 0.12
                  : inRegion || isActive
                    ? 0.95
                    : isZeroOutput
                      ? 0.22
                      : 0.78
              }
              toneMapped={false}
            />
          </mesh>
        );
      }))}
      {highlightRegion && (
        <mesh
          position={[
            -size / 2 + cellW * (highlightRegion.col + highlightRegion.cols / 2),
            size / 2 - cellH * (highlightRegion.row + highlightRegion.rows / 2),
            0.06,
          ]}
        >
          <planeGeometry args={[cellW * highlightRegion.cols, cellH * highlightRegion.rows]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.26} wireframe toneMapped={false} />
        </mesh>
      )}
      <Text
        {...textBaseProps}
        fontSize={0.22}
        color="#dbeafe"
        outlineWidth={0.014}
        position={[0, -size / 2 - 0.32, 0]}
        renderOrder={2301}
      >
        {label}
      </Text>
    </group>
  );
};

export const MatrixPatch: React.FC<{
  matrix: number[][];
  size: number;
  position: [number, number, number];
  label: string;
  active?: boolean;
}> = ({ matrix, size, position, label, active = false }) => {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 1;
  const cellW = size / cols;
  const cellH = size / rows;
  const offsetX = -size / 2 + cellW / 2;
  const offsetY = size / 2 - cellH / 2;

  return (
    <group position={position}>
      <mesh position={[0, 0, -0.035]}>
        <planeGeometry args={[size + 0.18, size + 0.18]} />
        <meshBasicMaterial color="#111827" transparent opacity={0.95} toneMapped={false} />
      </mesh>
      {matrix.map((row, rowIndex) => row.map((value, colIndex) => {
        const positive = value > 0;
        const neutral = value === 0;
        return (
          <mesh
            key={`${rowIndex}-${colIndex}`}
            position={[
              offsetX + colIndex * cellW,
              offsetY - rowIndex * cellH,
              active ? 0.02 : 0,
            ]}
          >
            <planeGeometry args={[cellW * 0.86, cellH * 0.86]} />
            <meshBasicMaterial
              color={neutral ? '#334155' : positive ? '#fbbf24' : '#60a5fa'}
              transparent
              opacity={neutral ? 0.35 : active ? 0.95 : 0.82}
              toneMapped={false}
            />
          </mesh>
        );
      }))}
      <Text
        {...textBaseProps}
        fontSize={0.2}
        color="#fde68a"
        outlineWidth={0.014}
        position={[0, -size / 2 - 0.28, 0]}
        renderOrder={2301}
      >
        {label}
      </Text>
    </group>
  );
};

export const VectorStrip: React.FC<{
  values: number[];
  position: [number, number, number];
  label: string;
  cellWidth?: number;
  cellHeight?: number;
  revealedCells?: number;
  activeIndex?: number;
  orientation?: 'horizontal' | 'vertical';
}> = ({
  values,
  position,
  label,
  cellWidth = 0.18,
  cellHeight = 0.38,
  revealedCells = values.length,
  activeIndex,
  orientation = 'horizontal',
}) => {
  const horizontal = orientation === 'horizontal';
  const width = horizontal ? values.length * cellWidth : cellWidth;
  const height = horizontal ? cellHeight : values.length * cellHeight;
  const startX = -width / 2 + cellWidth / 2;
  const startY = height / 2 - cellHeight / 2;

  return (
    <group position={position}>
      <mesh position={[0, 0, -0.035]}>
        <planeGeometry args={[width + 0.20, height + 0.20]} />
        <meshBasicMaterial color="#020617" transparent opacity={0.90} toneMapped={false} />
      </mesh>
      {values.map((value, index) => {
        const revealed = index < revealedCells;
        const active = index === activeIndex;
        const color = getCellColor(revealed ? value : 0);
        return (
          <mesh
            key={index}
            position={[
              horizontal ? startX + index * cellWidth : 0,
              horizontal ? 0 : startY - index * cellHeight,
              active ? 0.035 : 0,
            ]}
          >
            <planeGeometry args={[cellWidth * 0.82, cellHeight]} />
            <meshBasicMaterial
              color={active ? '#6ee7b7' : color}
              transparent
              opacity={revealed ? active ? 0.98 : 0.82 : 0.13}
              toneMapped={false}
            />
          </mesh>
        );
      })}
      <Text
        {...textBaseProps}
        fontSize={0.2}
        color="#dbeafe"
        outlineWidth={0.014}
        position={[0, -height / 2 - 0.28, 0]}
        renderOrder={2301}
      >
        {label}
      </Text>
    </group>
  );
};

export function getVectorCellCenter(
  position: [number, number, number],
  valuesLength: number,
  cellWidth = 0.18,
  index: number,
  z = 0.12,
  orientation: 'horizontal' | 'vertical' = 'horizontal',
  cellHeight = 0.38,
): THREE.Vector3 {
  const width = valuesLength * cellWidth;
  const height = valuesLength * cellHeight;
  return new THREE.Vector3(
    orientation === 'horizontal'
      ? position[0] - width / 2 + cellWidth / 2 + index * cellWidth
      : position[0],
    orientation === 'horizontal'
      ? position[1]
      : position[1] + height / 2 - cellHeight / 2 - index * cellHeight,
    position[2] + z,
  );
}

export const UnitColumn: React.FC<{
  values: number[];
  position: [number, number, number];
  label: string;
  revealedUnits?: number;
  activeIndex?: number;
  activeLabel?: string;
}> = ({ values, position, label, revealedUnits = values.length, activeIndex, activeLabel }) => {
  const spacing = 0.33;
  const startY = ((values.length - 1) * spacing) / 2;

  return (
    <group position={position}>
      {values.map((value, index) => {
        const revealed = index < revealedUnits;
        const active = index === activeIndex;
        const y = startY - index * spacing;
        return (
          <group key={index} position={[0, y, active ? 0.04 : 0]}>
            <mesh>
              <circleGeometry args={[0.12, 28]} />
              <meshBasicMaterial
                color={active ? '#6ee7b7' : getCellColor(revealed ? value : 0)}
                transparent
                opacity={revealed ? active ? 0.98 : 0.80 : 0.18}
                toneMapped={false}
              />
            </mesh>
            <Text
              {...textBaseProps}
              fontSize={0.13}
              color={active ? '#022c22' : '#e0f2fe'}
              outlineWidth={0.006}
              position={[0, 0, 0.02]}
              renderOrder={2302}
            >
              {index}
            </Text>
            {active && activeLabel && (
              <Text
                {...textBaseProps}
                fontSize={0.18}
                color="#6ee7b7"
                outlineWidth={0.014}
                maxWidth={1.15}
                anchorX="left"
                position={[0.22, 0, 0.04]}
                renderOrder={2303}
              >
                {activeLabel}
              </Text>
            )}
          </group>
        );
      })}
      <Text
        {...textBaseProps}
        fontSize={0.2}
        color="#dbeafe"
        outlineWidth={0.014}
        position={[0, -startY - 0.34, 0]}
        renderOrder={2301}
      >
        {label}
      </Text>
    </group>
  );
};

export function getUnitCenter(
  position: [number, number, number],
  unitCount: number,
  index: number,
  z = 0.12,
): THREE.Vector3 {
  const spacing = 0.33;
  const startY = ((unitCount - 1) * spacing) / 2;
  return new THREE.Vector3(position[0], position[1] + startY - index * spacing, position[2] + z);
}

export const DemoArrow: React.FC<{
  points: THREE.Vector3[];
  color?: string;
  opacity?: number;
  lineWidth?: number;
}> = ({ points, color = '#7dd3fc', opacity = 0.9, lineWidth = 1.8 }) => (
  <Line
    points={points.map((point) => point.toArray() as [number, number, number])}
    color={color}
    lineWidth={lineWidth}
    transparent
    opacity={opacity}
  />
);
