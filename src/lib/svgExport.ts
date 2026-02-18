import { LayoutData, LayoutNode, LayoutEdge } from './irTypes';

interface SvgOptions {
  scale?: number;
  legend?: boolean;
  lightBackground?: boolean;
}

interface Point2D { x: number; y: number }

const COS30 = Math.cos(Math.PI / 6);
const SIN30 = 0.5;

function isoProject(x: number, y: number, z: number, s: number): Point2D {
  return {
    x: (x - z) * COS30 * s,
    y: -(y + (x + z) * SIN30) * s,
  };
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return '#' + [clamp(r), clamp(g), clamp(b)].map(v => v.toString(16).padStart(2, '0')).join('');
}

function adjustColor(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r + amount, g + amount, b + amount);
}

function fmt(n: number): string {
  return n.toFixed(1);
}

function pts(arr: Point2D[]): string {
  return arr.map(p => `${fmt(p.x)},${fmt(p.y)}`).join(' ');
}

/** Collect all drawable nodes (leaves + collapsed containers + expanded containers) recursively. */
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

/** Isometric depth for painter's algorithm — further nodes drawn first. */
function isoDepth(n: LayoutNode): number {
  return n.x + n.y + n.z;
}

function renderCube(
  n: LayoutNode,
  s: number,
  color: string,
  opacity: number,
  dashed: boolean,
  lightBg: boolean,
): string {
  const hw = n.width / 2;
  const hh = n.height / 2;
  const hd = n.depth / 2;
  const cx = n.x, cy = n.y, cz = n.z;

  const blf = isoProject(cx - hw, cy - hh, cz + hd, s);
  const brf = isoProject(cx + hw, cy - hh, cz + hd, s);
  const trf = isoProject(cx + hw, cy + hh, cz + hd, s);
  const tlf = isoProject(cx - hw, cy + hh, cz + hd, s);
  const tlb = isoProject(cx - hw, cy + hh, cz - hd, s);
  const trb = isoProject(cx + hw, cy + hh, cz - hd, s);
  const brb = isoProject(cx + hw, cy - hh, cz - hd, s);

  const topColor = adjustColor(color, lightBg ? -15 : 25);
  const sideColor = adjustColor(color, lightBg ? -35 : -25);
  const strokeColor = lightBg ? '#374151' : '#4b5563';
  const strokeW = dashed ? 0.6 : 0.4;
  const strokeDash = dashed ? ' stroke-dasharray="5 3"' : '';
  const fillOpacity = opacity < 1 ? ` fill-opacity="${opacity}"` : '';

  const top = `<polygon points="${pts([tlf, trf, trb, tlb])}" fill="${topColor}"${fillOpacity} stroke="${strokeColor}" stroke-width="${strokeW}"${strokeDash}/>`;
  const front = `<polygon points="${pts([blf, brf, trf, tlf])}" fill="${color}"${fillOpacity} stroke="${strokeColor}" stroke-width="${strokeW}"${strokeDash}/>`;
  const side = `<polygon points="${pts([brf, brb, trb, trf])}" fill="${sideColor}"${fillOpacity} stroke="${strokeColor}" stroke-width="${strokeW}"${strokeDash}/>`;

  const labelPos = isoProject(cx, cy + hh + 0.5, cz, s);
  const labelFill = lightBg ? '#1f2937' : '#e5e7eb';
  const label = `<text x="${fmt(labelPos.x)}" y="${fmt(labelPos.y)}" text-anchor="middle" font-size="10" fill="${labelFill}" font-weight="600">${escapeXml(n.op_type)}</text>`;

  let shapeLabel = '';
  if (n.out_shape && n.out_shape.length > 1 && !n.is_container) {
    const shapePos = isoProject(cx, cy - hh - 0.6, cz, s);
    const shapeFill = lightBg ? '#6b7280' : '#9ca3af';
    shapeLabel = `<text x="${fmt(shapePos.x)}" y="${fmt(shapePos.y)}" text-anchor="middle" font-size="8" fill="${shapeFill}">${n.out_shape.slice(1).join('×')}</text>`;
  }

  return `<g id="node-${escapeXml(n.id)}">${top}${front}${side}${label}${shapeLabel}</g>`;
}

function renderEdge(edge: LayoutEdge, s: number, lightBg: boolean): string {
  const p = edge.points;
  if (p.length < 2) return '';

  const color = lightBg
    ? (edge.kind === 'residual' ? '#6b7280' : '#4b5563')
    : (edge.kind === 'residual' ? '#9ca3af' : '#6b7280');
  const dash = edge.kind === 'residual' ? ' stroke-dasharray="6 4"' : '';
  const width = edge.kind === 'residual' ? 0.8 : 1.2;

  const proj = p.map((pt) => isoProject(pt.x, pt.y, pt.z, s));
  let d: string;
  if (p.length === 4) {
    d = `M${fmt(proj[0].x)},${fmt(proj[0].y)} C${fmt(proj[1].x)},${fmt(proj[1].y)} ${fmt(proj[2].x)},${fmt(proj[2].y)} ${fmt(proj[3].x)},${fmt(proj[3].y)}`;
  } else {
    d = proj.map((pt, i) => (i === 0 ? `M${fmt(pt.x)},${fmt(pt.y)}` : `L${fmt(pt.x)},${fmt(pt.y)}`)).join(' ');
  }
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}"${dash} stroke-linecap="round"/>`;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderLegend(x: number, y: number, lightBg: boolean): string {
  const items: [string, string][] = [
    ['Conv', '#60a5fa'],
    ['Linear', '#34d399'],
    ['Pool', '#fbbf24'],
    ['Norm', '#f472b6'],
    ['Activation', '#22d3ee'],
    ['Attention', '#a78bfa'],
  ];
  const rowH = 16;
  const w = 115;
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

  const sorted = [...allNodes].sort((a, b) => isoDepth(a) - isoDepth(b));

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const updateBounds = (px: number, py: number) => {
    minX = Math.min(minX, px); minY = Math.min(minY, py);
    maxX = Math.max(maxX, px); maxY = Math.max(maxY, py);
  };

  const S = options.scale ?? 32;

  for (const n of allNodes) {
    const hw = n.width / 2, hh = n.height / 2, hd = n.depth / 2;
    const corners = [
      [n.x - hw, n.y - hh, n.z + hd],
      [n.x + hw, n.y - hh, n.z + hd],
      [n.x + hw, n.y + hh, n.z + hd],
      [n.x - hw, n.y + hh, n.z + hd],
      [n.x - hw, n.y + hh, n.z - hd],
      [n.x + hw, n.y + hh, n.z - hd],
      [n.x + hw, n.y - hh, n.z - hd],
      [n.x - hw, n.y - hh, n.z - hd],
    ];
    for (const [cx, cy, cz] of corners) {
      const p = isoProject(cx, cy, cz, S);
      updateBounds(p.x, p.y);
    }
  }

  for (const edge of layout.edges) {
    for (const pt of edge.points) {
      const p = isoProject(pt.x, pt.y, pt.z, S);
      updateBounds(p.x, p.y);
    }
  }

  const pad = 55;
  const edgesSvg = layout.edges.map(e => renderEdge(e, S, lightBg)).join('\n');

  const nodesSvg = sorted.map(n => {
    const isExpandedContainer = n.is_container && n.children && !n.collapsed;
    const opacity = n.opacity ?? (isExpandedContainer ? 0.22 : 1);
    return renderCube(n, S, n.color, opacity, isExpandedContainer, lightBg);
  }).join('\n');

  if (minX === Infinity) { minX = 0; minY = 0; maxX = 400; maxY = 300; }
  const vbX = minX - pad;
  const vbY = minY - pad;
  const vbW = maxX - minX + pad * 2;
  const vbH = maxY - minY + pad * 2;

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
