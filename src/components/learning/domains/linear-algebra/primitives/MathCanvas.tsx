import React from 'react';
import { Mafs, Coordinates } from 'mafs';
import 'mafs/core.css';
import { useLearningMdxTheme } from '../../../learningMdxComponents';
import { getMathVisualTheme } from '../theme';

export interface MathCanvasProps {
  ariaLabel?: string;
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
  height?: number;
  children?: React.ReactNode;
  showGrid?: boolean;
  className?: string;
}

export function MathCanvas({
  ariaLabel,
  minX = -3,
  maxX = 3,
  minY = -3,
  maxY = 3,
  height = 300,
  children,
  showGrid = true,
  className = '',
}: MathCanvasProps) {
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const mafsStyles = {
    '--mafs-bg': theme.bg,
    '--mafs-fg': theme.axisText,
    '--mafs-origin-color': theme.originDot,
    '--mafs-line-color': theme.axisLine,
    '--grid-line-subdivision-color': theme.gridLine,
  } as React.CSSProperties;

  return (
    <div
      className={`w-full flex justify-center items-center overflow-hidden rounded-lg ${className}`}
      style={{ backgroundColor: theme.bg, ...mafsStyles }}
      aria-label={ariaLabel}
    >
      <Mafs
        viewBox={{ x: [minX, maxX], y: [minY, maxY] }}
        preserveAspectRatio="contain"
        pan={false}
        zoom={false}
        height={height}
      >
        {showGrid && <Coordinates.Cartesian subdivisions={1} />}
        {children}
      </Mafs>
    </div>
  );
}
