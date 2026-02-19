import { LayoutData, LayoutNode, LayoutEdge } from './irTypes';
import { OP_COLORS } from './constants';

interface SvgOptions {
  scale?: number;
  legend?: boolean;
  lightBackground?: boolean;
}

interface Point2D {
  x: number;
  y: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

const COS30 = Math.cos(Math.PI / 6);
const SIN30 = 0.5;

/** Isometric projection: x right, y up, z into screen. */
function isoProject(x: number, y: number, z: number, s: number): Point2D {
  return {
    x: (x - z) * COS30 * s,
    y: -(y + (x + z) * SIN30) * s,
  };
}

/** Depth for painter's algorithm — larger = further back, drawn first. */
function isoDepth(p: Point3D): number {
  return p.x + p.y + p.z;
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
  return '#' + [clamp(r), clamp(g), clamp(b)].map((v) => v.toString(16).padStart(2, '0')).join('');
}

/** Darken hex by a percentage (0–100). */
function darken(hex: string, pct: number): string {
  const [r, g, b] = hexToRgb(hex);
  const f = 1 - pct / 100;
  return rgbToHex(r * f, g * f, b * f);
}

function fmt(n: number): string {
  return n.toFixed(1);
}

function pts(arr: Point2D[]): string {
  return arr.map((p) => `${fmt(p.x)},${fmt(p.y)}`).join(' ');
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Renderable primitive for depth sorting. */
type RenderPrimitive =
  | { type: 'face'; depth: number; svg: string }
  | { type: 'edge'; depth: number; svg: string }
  | { type: 'label'; depth: number; svg: string };

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

function renderNodePrimitives(
  n: LayoutNode,
  s: number,
  color: string,
  opacity: number,
  dashed: boolean,
  lightBg: boolean,
  strokeColor: string,
  strokeW: number,
  strokeDash: string,
  fillOpacity: string,
): RenderPrimitive[] {
  const hw = n.width / 2;
  const hh = n.height / 2;
  const hd = n.depth / 2;
  const cx = n.x;
  const cy = n.y;
  const cz = n.z;

  const blf: Point3D = { x: cx - hw, y: cy - hh, z: cz + hd };
  const brf: Point3D = { x: cx + hw, y: cy - hh, z: cz + hd };
  const trf: Point3D = { x: cx + hw, y: cy + hh, z: cz + hd };
  const tlf: Point3D = { x: cx - hw, y: cy + hh, z: cz + hd };
  const tlb: Point3D = { x: cx - hw, y: cy + hh, z: cz - hd };
  const trb: Point3D = { x: cx + hw, y: cy + hh, z: cz - hd };
  const brb: Point3D = { x: cx + hw, y: cy - hh, z: cz - hd };

  const topColor = color;
  const frontColor = darken(color, 10);
  const sideColor = darken(color, 20);

  const top2D = [isoProject(tlf.x, tlf.y, tlf.z, s), isoProject(trf.x, trf.y, trf.z, s), isoProject(trb.x, trb.y, trb.z, s), isoProject(tlb.x, tlb.y, tlb.z, s)];
  const front2D = [isoProject(blf.x, blf.y, blf.z, s), isoProject(brf.x, brf.y, brf.z, s), isoProject(trf.x, trf.y, trf.z, s), isoProject(tlf.x, tlf.y, tlf.z, s)];
  const side2D = [isoProject(brf.x, brf.y, brf.z, s), isoProject(brb.x, brb.y, brb.z, s), isoProject(trb.x, trb.y, trb.z, s), isoProject(trf.x, trf.y, trf.z, s)];

  const topCenter: Point3D = { x: cx, y: cy + hh, z: cz };
  const frontCenter: Point3D = { x: cx, y: cy, z: cz + hd };
  const sideCenter: Point3D = { x: cx + hw, y: cy, z: cz };

  const primitives: RenderPrimitive[] = [
    { type: 'face', depth: isoDepth(topCenter), svg: `<polygon points="${pts(top2D)}" fill="${topColor}"${fillOpacity} stroke="${strokeColor}" stroke-width="${strokeW}"${strokeDash}/>` },
    { type: 'face', depth: isoDepth(frontCenter), svg: `<polygon points="${pts(front2D)}" fill="${frontColor}"${fillOpacity} stroke="${strokeColor}" stroke-width="${strokeW}"${strokeDash}/>` },
    { type: 'face', depth: isoDepth(sideCenter), svg: `<polygon points="${pts(side2D)}" fill="${sideColor}"${fillOpacity} stroke="${strokeColor}" stroke-width="${strokeW}"${strokeDash}/>` },
  ];

  const labelPos = isoProject(cx, cy + hh + 0.5, cz, s);
  const labelFill = lightBg ? '#1f2937' : '#e5e7eb';
  const labelDepth = isoDepth({ x: cx, y: cy + hh + 0.5, z: cz });
  primitives.push({
    type: 'label',
    depth: labelDepth,
    svg: `<text x="${fmt(labelPos.x)}" y="${fmt(labelPos.y)}" text-anchor="middle" font-size="10" fill="${labelFill}" font-weight="600">${escapeXml(n.op_type)}</text>`,
  });

  if (n.out_shape && n.out_shape.length > 1 && !n.is_container) {
    const shapePos = isoProject(cx, cy - hh - 0.6, cz, s);
    const shapeFill = lightBg ? '#6b7280' : '#9ca3af';
    const shapeDepth = isoDepth({ x: cx, y: cy - hh - 0.6, z: cz });
    primitives.push({
      type: 'label',
      depth: shapeDepth,
      svg: `<text x="${fmt(shapePos.x)}" y="${fmt(shapePos.y)}" text-anchor="middle" font-size="8" fill="${shapeFill}">${n.out_shape.slice(1).join('×')}</text>`,
    });
  }

  return primitives;
}

function renderEdgePrimitives(edge: LayoutEdge, s: number, lightBg: boolean): RenderPrimitive[] {
  const p = edge.points;
  if (p.length < 2) return [];

  const color = lightBg
    ? edge.kind === 'residual'
      ? '#6b7280'
      : '#4b5563'
    : edge.kind === 'residual'
      ? '#9ca3af'
      : '#6b7280';
  const dash = edge.kind === 'residual' ? ' stroke-dasharray="6 4"' : '';
  const width = edge.kind === 'residual' ? 0.8 : 1.2;

  const proj = p.map((pt) => isoProject(pt.x, pt.y, pt.z, s));
  const midIdx = Math.floor(p.length / 2);
  const midPoint = p[midIdx];
  const depth = isoDepth(midPoint);

  let d: string;
  if (p.length === 4) {
    d = `M${fmt(proj[0].x)},${fmt(proj[0].y)} C${fmt(proj[1].x)},${fmt(proj[1].y)} ${fmt(proj[2].x)},${fmt(proj[2].y)} ${fmt(proj[3].x)},${fmt(proj[3].y)}`;
  } else {
    d = proj.map((pt, i) => (i === 0 ? `M${fmt(pt.x)},${fmt(pt.y)}` : `L${fmt(pt.x)},${fmt(pt.y)}`)).join(' ');
  }

  return [
    {
      type: 'edge',
      depth,
      svg: `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}"${dash} stroke-linecap="round"/>`,
    },
  ];
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
  const strokeColor = lightBg ? '#374151' : '#4b5563';

  const primitives: RenderPrimitive[] = [];

  for (const n of allNodes) {
    const isExpandedContainer = n.is_container && n.children && !n.collapsed;
    const opacity = n.opacity ?? (isExpandedContainer ? 0.22 : 1);
    const strokeW = isExpandedContainer ? 0.6 : 0.4;
    const strokeDash = isExpandedContainer ? ' stroke-dasharray="5 3"' : '';
    const fillOpacity = opacity < 1 ? ` fill-opacity="${opacity}"` : '';

    primitives.push(
      ...renderNodePrimitives(n, S, n.color, opacity, isExpandedContainer, lightBg, strokeColor, strokeW, strokeDash, fillOpacity),
    );
  }

  for (const edge of layout.edges) {
    primitives.push(...renderEdgePrimitives(edge, S, lightBg));
  }

  primitives.sort((a, b) => a.depth - b.depth);

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
    const hw = n.width / 2;
    const hh = n.height / 2;
    const hd = n.depth / 2;
    const corners: [number, number, number][] = [
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

  const bgFill = lightBg ? '#ffffff' : '#09090b';
  const legend = options.legend !== false ? renderLegend(vbX + 12, vbY + 12, lightBg) : '';

  const contentSvg = primitives.map((p) => p.svg).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${fmt(vbX)} ${fmt(vbY)} ${fmt(vbW)} ${fmt(vbH)}" width="${Math.round(vbW)}" height="${Math.round(vbH)}">
<defs>
<style>text { font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; }</style>
</defs>
<rect x="${fmt(vbX)}" y="${fmt(vbY)}" width="${fmt(vbW)}" height="${fmt(vbH)}" fill="${bgFill}"/>
<g>
${contentSvg}
</g>
${legend}
</svg>`;
}
