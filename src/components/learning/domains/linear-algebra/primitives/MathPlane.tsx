import React from 'react';
import { MathCanvas, type MathCanvasProps } from './MathCanvas';
import { MathVisualCard } from './MathVisualCard';

export interface MathPlaneProps extends MathCanvasProps {
  ariaLabel: string;
  title?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  badge?: string | React.ReactNode;
  belowPlot?: React.ReactNode;
  bare?: boolean;
}

export function MathPlane({
  ariaLabel,
  title,
  subtitle,
  badge,
  minX = -3,
  maxX = 3,
  minY = -3,
  maxY = 3,
  height = 300,
  children,
  belowPlot,
  showGrid = true,
  bare = false,
  className = '',
}: MathPlaneProps) {
  const canvas = (
    <MathCanvas
      ariaLabel={ariaLabel}
      minX={minX}
      maxX={maxX}
      minY={minY}
      maxY={maxY}
      height={height}
      showGrid={showGrid}
      className={className}
    >
      {children}
    </MathCanvas>
  );

  if (bare || (!belowPlot && !title && !subtitle && !badge)) {
    return canvas;
  }

  return (
    <MathVisualCard
      ariaLabel={ariaLabel}
      title={title}
      subtitle={subtitle}
      badge={badge}
      footer={belowPlot}
    >
      {canvas}
    </MathVisualCard>
  );
}

export { MathCanvas };
