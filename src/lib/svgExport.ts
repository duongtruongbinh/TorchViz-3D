import { LayoutData, LayoutNode, LayoutEdge } from './irTypes';
import { OP_COLORS } from './constants';

interface SvgOptions {
  scale?: number;
  legend?: boolean;
  lightBackground?: boolean;
}

function fmt(n: number): string {
  return n.toFixed(1);
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Orthographic 2D: SVG_X = x * scale, SVG_Y = -y * scale (SVG y increases downward). */
function toSvg(x: number, y: number, s: number): { x: number; y: number } {
  return { x: x * s, y: -y * s };
}

/** Collect all drawable nodes recursively. */
function collectNodes(nodes: LayoutNode[]): LayoutNode[] {
  const result: LayoutNode[] = [];
  for (const n of nodes) {
    result.push(n);
    if (n.children && !n.collapsed) {
      result.push(...collectNodes(n.children));
    }
  }
  return result;
}

function renderNodeRect(
  n: LayoutNode,
  s: number,
  lightBg: boolean,
): string {
  const isExpandedContainer = n.is_container && n.children && !n.collapsed;
  const opacity = n.opacity ?? (isExpandedContainer ? 0.25 : 1);
  const fillOpacity = opacity < 1 ? ` fill-opacity="${opacity}"` : '';
  const stroke = lightBg ? '#374151' : '#3f3f46';
  const strokeDash = isExpandedContainer ? ' stroke-dasharray="6 4"' : '';

  const w = n.depth * s;
  const h = n.height * s;
  const { x: cx, y: cy } = toSvg(n.x, n.y, s);
  const x = cx - w / 2;
  const y = cy - h / 2;

  let svg = `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" rx="4" fill="${n.color}"${fillOpacity} stroke="${stroke}" stroke-width="0.5"${strokeDash}/>`;

  const labelFill = lightBg ? '#1f2937' : '#e5e7eb';
  const labelY = cy + h / 2 + 12;
  svg += `<text x="${fmt(cx)}" y="${fmt(labelY)}" text-anchor="middle" font-size="10" fill="${labelFill}" font-weight="600">${escapeXml(n.op_type)}</text>`;

  if (n.out_shape && n.out_shape.length > 1 && !n.is_container) {
    const shapeY = cy - h / 2 - 6;
    const shapeFill = lightBg ? '#6b7280' : '#9ca3af';
    svg += `<text x="${fmt(cx)}" y="${fmt(shapeY)}" text-anchor="middle" font-size="8" fill="${shapeFill}">${n.out_shape.slice(1).join('×')}</text>`;
  }

  return svg;
}

function renderEdgePath(edge: LayoutEdge, s: number, lightBg: boolean): string {
  const p = edge.points;
  if (p.length < 2) return '';

  const color = lightBg
    ? edge.kind === 'residual'
      ? '#6b7280'
      : '#4b5563'
    : edge.kind === 'residual'
      ? '#9ca3af'
      : '#6b7280';
  const dash = edge.kind === 'residual' ? ' stroke-dasharray="6 4"' : '';
  const width = edge.kind === 'residual' ? 0.8 : 1.2;

  const pts = p.map((pt) => toSvg(pt.x, pt.y, s));
  let d: string;
  if (p.length === 4) {
    d = `M${fmt(pts[0].x)},${fmt(pts[0].y)} C${fmt(pts[1].x)},${fmt(pts[1].y)} ${fmt(pts[2].x)},${fmt(pts[2].y)} ${fmt(pts[3].x)},${fmt(pts[3].y)}`;
  } else {
    d = pts.map((pt, i) => (i === 0 ? `M${fmt(pt.x)},${fmt(pt.y)}` : `L${fmt(pt.x)},${fmt(pt.y)}`)).join(' ');
  }
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}"${dash} stroke-linecap="round"/>`;
}

function renderLegend(x: number, y: number, lightBg: boolean): string {
  const items = OP_COLORS;
  const rowH = 16;
  const w = 130;
  const h = items.length * rowH + 12;
  const bgFill = lightBg ? '#f9fafb' : '#18181b';
  const stroke = lightBg ? '#d1d5db' : '#3f3f46';
  const textFill = lightBg ? '#4b5563' : '#9ca3af';

  let rows = '';
  items.forEach(([label, color], i) => {
    const ry = 8 + i * rowH;
    rows += `<rect x="8" y="${ry}" width="9" height="9" rx="2" fill="${color}"/>`;
    rows += `<text x="22" y="${ry + 8}" font-size="9" fill="${textFill}">${label}</text>`;
  });

  return `<g transform="translate(${fmt(x)},${fmt(y)})"><rect width="${w}" height="${h}" rx="4" fill="${bgFill}" stroke="${stroke}" stroke-width="0.5"/>${rows}</g>`;
}

export function generateSVG(layout: LayoutData, options: SvgOptions): string {
  const lightBg = options.lightBackground ?? true;
  const allNodes = collectNodes(layout.nodes);
  const S = options.scale ?? 32;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const updateBounds = (px: number, py: number) => {
    minX = Math.min(minX, px);
    minY = Math.min(minY, py);
    maxX = Math.max(maxX, px);
    maxY = Math.max(maxY, py);
  };

  for (const n of allNodes) {
    const w = n.depth * S;
    const h = n.height * S;
    const { x: cx, y: cy } = toSvg(n.x, n.y, S);
    updateBounds(cx - w / 2, cy - h / 2);
    updateBounds(cx + w / 2, cy + h / 2);
    updateBounds(cx, cy + h / 2 + 14);
    updateBounds(cx, cy - h / 2 - 10);
  }

  for (const edge of layout.edges) {
    for (const pt of edge.points) {
      const p = toSvg(pt.x, pt.y, S);
      updateBounds(p.x, p.y);
    }
  }

  const pad = 55;
  if (minX === Infinity) {
    minX = 0;
    minY = 0;
    maxX = 400;
    maxY = 300;
  }
  const vbX = minX - pad;
  const vbY = minY - pad;
  const vbW = maxX - minX + pad * 2;
  const vbH = maxY - minY + pad * 2;

  const edgesSvg = layout.edges.map((e) => renderEdgePath(e, S, lightBg)).join('\n');
  const nodesSvg = allNodes.map((n) => renderNodeRect(n, S, lightBg)).join('\n');
  const bgFill = lightBg ? '#ffffff' : '#09090b';
  const legend = options.legend !== false ? renderLegend(vbX + 12, vbY + 12, lightBg) : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${fmt(vbX)} ${fmt(vbY)} ${fmt(vbW)} ${fmt(vbH)}" width="${Math.round(vbW)}" height="${Math.round(vbH)}">
<defs>
<style>text { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; }</style>
</defs>
<rect x="${fmt(vbX)}" y="${fmt(vbY)}" width="${fmt(vbW)}" height="${fmt(vbH)}" fill="${bgFill}"/>
<g>
${edgesSvg}
${nodesSvg}
</g>
${legend}
</svg>`;
}
