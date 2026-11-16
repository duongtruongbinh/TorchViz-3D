import { useId, type SVGProps } from 'react';

export type DiagramAnchor = {
  bottom: number;
  centerX: number;
  centerY: number;
  left: number;
  right: number;
  top: number;
};

export function getDiagramAnchor(element: HTMLElement, canvasRect: DOMRect): DiagramAnchor {
  const rect = element.getBoundingClientRect();
  return {
    bottom: rect.bottom - canvasRect.top,
    centerX: rect.left + rect.width / 2 - canvasRect.left,
    centerY: rect.top + rect.height / 2 - canvasRect.top,
    left: rect.left - canvasRect.left,
    right: rect.right - canvasRect.left,
    top: rect.top - canvasRect.top,
  };
}

export function observeDiagramLayout(canvas: HTMLElement, elements: HTMLElement[], update: () => void) {
  const frameId = window.requestAnimationFrame(update);
  const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
  [canvas, ...elements].forEach((element) => {
    observer?.observe(element);
  });
  window.addEventListener('resize', update);
  return () => {
    window.cancelAnimationFrame(frameId);
    observer?.disconnect();
    window.removeEventListener('resize', update);
  };
}

export type DiagramConnectorPath = {
  className?: string;
  d: string;
  markerEnd?: boolean;
  stroke?: string;
  strokeDasharray?: string;
  strokeWidth?: number;
};

export function SvgArrowMarker({
  color,
  path = 'M 0 1 L 10 5 L 0 9 z',
  points,
  ...markerProps
}: Omit<SVGProps<SVGMarkerElement>, 'children' | 'color'> & {
  id: string;
  color: string;
  path?: string;
  points?: string;
}) {
  return (
    <marker {...markerProps}>
      {points ? <polygon points={points} fill={color} /> : <path d={path} fill={color} />}
    </marker>
  );
}

export function DiagramConnectorLayer({
  color = '#6366f1',
  markerId,
  paths,
}: {
  color?: string;
  markerId?: string;
  paths: DiagramConnectorPath[];
}) {
  const instanceId = useId();
  const resolvedMarkerId = markerId ?? instanceId;

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <SvgArrowMarker id={resolvedMarkerId} color={color} path="M 0 0 L 10 5 L 0 10 z" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse" />
      </defs>
      {paths.map((path, index) => (
        <path
          key={`${index}-${path.d}`}
          d={path.d}
          fill="none"
          stroke={path.stroke ?? color}
          strokeWidth={path.strokeWidth ?? 2}
          strokeDasharray={path.strokeDasharray}
          markerEnd={path.markerEnd === false ? undefined : `url(#${resolvedMarkerId})`}
          className={path.className}
        />
      ))}
    </svg>
  );
}
