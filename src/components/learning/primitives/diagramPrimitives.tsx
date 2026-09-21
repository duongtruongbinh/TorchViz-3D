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

export function DiagramConnectorLayer({
  color = '#6366f1',
  markerId = 'diagram-arrow',
  paths,
}: {
  color?: string;
  markerId?: string;
  paths: DiagramConnectorPath[];
}) {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
      {paths.map((path, index) => (
        <path
          key={`${index}-${path.d}`}
          d={path.d}
          fill="none"
          stroke={path.stroke ?? color}
          strokeWidth={path.strokeWidth ?? 2}
          strokeDasharray={path.strokeDasharray}
          markerEnd={path.markerEnd === false ? undefined : `url(#${markerId})`}
          className={path.className}
        />
      ))}
    </svg>
  );
}
