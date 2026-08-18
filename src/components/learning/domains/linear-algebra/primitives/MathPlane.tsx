import React from 'react';
import { Mafs, Coordinates } from 'mafs';
import 'mafs/core.css';
import { useLearningMdxTheme } from '../../../learningMdxComponents';
import { getMathVisualTheme } from '../theme';

export interface MathPlaneProps {
  ariaLabel: string;
  minX?: number;
  maxX?: number;
  minY?: number;
  maxY?: number;
  height?: number;
  children?: React.ReactNode;
  belowPlot?: React.ReactNode;
  showGrid?: boolean;
}

export function MathPlane({
  ariaLabel,
  minX = -3,
  maxX = 3,
  minY = -3,
  maxY = 3,
  height = 320,
  children,
  belowPlot,
  showGrid = true,
}: MathPlaneProps) {
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
    <figure
      className="my-6 flex flex-col items-center gap-2"
      aria-label={ariaLabel}
    >
      <div
        className={`w-full max-w-xl overflow-hidden rounded-xl border ${theme.cardBorder} p-3 sm:p-4 shadow-sm`}
        style={{ backgroundColor: theme.bg, ...mafsStyles }}
      >
        <div className="w-full flex justify-center">
          <Mafs
            viewBox={{ x: [minX, maxX], y: [minY, maxY] }}
            preserveAspectRatio="contain"
            pan={false}
            zoom={false}
            height={height}
          >
            {showGrid && (
              <Coordinates.Cartesian
                subdivisions={1}
              />
            )}
            {children}
          </Mafs>
        </div>

        {belowPlot}
      </div>
    </figure>
  );
}
