import { LayoutData, LayoutNode, LayoutEdge } from './irTypes';
import { OP_COLORS } from './constants';

interface SvgOptions {
  scale?: number;
  legend?: boolean;
  lightBackground?: boolean;
  transparentBackground?: boolean;
}

function fmt(n: number): string {
  return n.toFixed(1);
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// math
const OBLIQUE_ANGLE = Math.PI / 6; // 30 degrees
const COS_A = Math.cos(OBLIQUE_ANGLE);
const SIN_A = Math.sin(OBLIQUE_ANGLE);

// Transform 3D (x, y, z) into 2.5D Oblique Projection (px, py)
function to25D(x: number, y: number, z: number, s: number): { x: number; y: number } {
  // Classic LeNet paper style:
  // - Sequence flows rightwards horizontally (+X)
  // - Spatial Height is vertical (+Y goes up)
  // - Spatial Width is diagonal depth (+Z goes Left & Down)
  // So negative Z (the background) goes Right and Up.
  return {
    x: (x - z * COS_A) * s,
    y: (-y + z * SIN_A) * s,
  };
}

// Lighten/Darken Hex colors for 3D Faces
function adjustColor(color: string, amount: number): string {
  if (color === 'transparent') return color;
  let r = 0, g = 0, b = 0;
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length >= 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }
  } else if (color.startsWith('rgb')) {
    const coords = color.match(/\d+/g);
    if (coords && coords.length >= 3) {
      r = parseInt(coords[0], 10);
      g = parseInt(coords[1], 10);
      b = parseInt(coords[2], 10);
    }
  }

  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
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

function renderCuboid(
  n: LayoutNode,
  s: number,
  lightBg: boolean,
): string {
  const isExpandedContainer = n.is_container && n.children && !n.collapsed;
  if (isExpandedContainer) {
    // Render Expanded Container as a dashed flat footprint below the nodes
    // Using z = minZ to stick it to the floor.
    const hw = n.width / 2;
    const hd = n.depth / 2;
    const cX = n.x;
    const cZ = n.z;
    const bottomY = n.y - n.height / 2;

    const p1 = to25D(cX - hw, bottomY, cZ - hd, s);
    const p2 = to25D(cX + hw, bottomY, cZ - hd, s);
    const p3 = to25D(cX + hw, bottomY, cZ + hd, s);
    const p4 = to25D(cX - hw, bottomY, cZ + hd, s);

    const fill = lightBg ? '#f3f4f6' : '#18181b';
    const stroke = lightBg ? '#9ca3af' : '#52525b';
    const labelFill = lightBg ? '#1f2937' : '#d4d4d8';
    const center = to25D(cX, bottomY, cZ + hd + 0.5, s); // Label slightly forward

    let svg = `<polygon points="${fmt(p1.x)},${fmt(p1.y)} ${fmt(p2.x)},${fmt(p2.y)} ${fmt(p3.x)},${fmt(p3.y)} ${fmt(p4.x)},${fmt(p4.y)}" fill="${fill}" fill-opacity="${n.opacity ?? 0.3}" stroke="${stroke}" stroke-width="1.5" stroke-dasharray="6 4"/>`;
    svg += `<text x="${fmt(center.x)}" y="${fmt(center.y)}" text-anchor="middle" font-size="12" fill="${labelFill}" font-weight="700">${escapeXml(n.op_type)}</text>`;
    return svg;
  }

  // 3D Cuboid for Blocks
  // The 'Right' face (x=x1) is the main visible spatial card.
  // The 'Top' face (y=y1) and 'Front' face (z=z1) are the edge thicknesses.
  const baseColor = n.color || '#3b82f6';
  const frontColor = adjustColor(baseColor, -20);
  const topColor = adjustColor(baseColor, 20);
  const strokeColor = lightBg ? '#1e293b' : '#27272a';

  const w = n.width;   // Channels (sequence thickness)
  const h = n.height;  // Spatial H
  const d = n.depth;   // Spatial W

  const x0 = n.x - w / 2;
  const x1 = n.x + w / 2;
  const y0 = n.y - h / 2;
  const y1 = n.y + h / 2;
  const z0 = n.z - d / 2;
  const z1 = n.z + d / 2;

  // Right Face (x=x1) -> Main Card Surface
  const r1 = to25D(x1, y1, z0, s); // Top-Back
  const r2 = to25D(x1, y1, z1, s); // Top-Front
  const r3 = to25D(x1, y0, z1, s); // Bottom-Front
  const r4 = to25D(x1, y0, z0, s); // Bottom-Back

  // Top Face (y=y1) -> Top edge thickness
  const t1 = to25D(x0, y1, z0, s);
  const t2 = to25D(x1, y1, z0, s);
  const t3 = to25D(x1, y1, z1, s);
  const t4 = to25D(x0, y1, z1, s);

  // Front Face (z=z1) -> Left/Front edge thickness
  const f1 = to25D(x0, y1, z1, s);
  const f2 = to25D(x1, y1, z1, s);
  const f3 = to25D(x1, y0, z1, s);
  const f4 = to25D(x0, y0, z1, s);

  let svg = ``;
  svg += `<polygon points="${fmt(t1.x)},${fmt(t1.y)} ${fmt(t2.x)},${fmt(t2.y)} ${fmt(t3.x)},${fmt(t3.y)} ${fmt(t4.x)},${fmt(t4.y)}" fill="${topColor}" stroke="${strokeColor}" stroke-width="0.75" stroke-linejoin="round"/>`;
  svg += `<polygon points="${fmt(f1.x)},${fmt(f1.y)} ${fmt(f2.x)},${fmt(f2.y)} ${fmt(f3.x)},${fmt(f3.y)} ${fmt(f4.x)},${fmt(f4.y)}" fill="${frontColor}" stroke="${strokeColor}" stroke-width="0.75" stroke-linejoin="round"/>`;
  svg += `<polygon points="${fmt(r1.x)},${fmt(r1.y)} ${fmt(r2.x)},${fmt(r2.y)} ${fmt(r3.x)},${fmt(r3.y)} ${fmt(r4.x)},${fmt(r4.y)}" fill="${baseColor}" stroke="${strokeColor}" stroke-width="0.75" stroke-linejoin="round"/>`;

  // Label explicitly strictly centered on the Right Face
  const center = to25D(x1, n.y, n.z, s);

  const textFill = lightBg ? '#ffffff' : '#f8fafc';
  svg += `<text x="${fmt(center.x)}" y="${fmt(center.y + 2)}" text-anchor="middle" font-size="9" fill="${textFill}" font-weight="600">${escapeXml(n.op_type)}</text>`;

  if (n.out_shape && n.out_shape.length > 1) {
    const shapeStr = n.out_shape.slice(1).join('×');
    svg += `<text x="${fmt(center.x)}" y="${fmt(center.y + 12)}" text-anchor="middle" font-size="7" fill="${lightBg ? '#e2e8f0' : '#d4d4d8'}" font-family="monospace">${escapeXml(shapeStr)}</text>`;
  }

  return svg;
}

function renderEdgePath(edge: LayoutEdge, s: number, lightBg: boolean): string {
  const p = edge.points;
  if (p.length < 2) return '';

  const color = lightBg
    ? edge.kind === 'residual' ? '#94a3b8' : '#475569'
    : edge.kind === 'residual' ? '#71717a' : '#a1a1aa';

  const dash = edge.kind === 'residual' ? ' stroke-dasharray="6 4"' : '';
  const width = edge.kind === 'residual' ? 1.5 : 2;

  const pts = p.map((pt) => to25D(pt.x, pt.y, pt.z, s));
  let d: string;
  if (pts.length === 4) {
    d = `M${fmt(pts[0].x)},${fmt(pts[0].y)} C${fmt(pts[1].x)},${fmt(pts[1].y)} ${fmt(pts[2].x)},${fmt(pts[2].y)} ${fmt(pts[3].x)},${fmt(pts[3].y)}`;
  } else {
    d = pts.map((pt, i) => (i === 0 ? `M${fmt(pt.x)},${fmt(pt.y)}` : `L${fmt(pt.x)},${fmt(pt.y)}`)).join(' ');
  }

  // Use markers for arrows
  const markerRef = `url(#arrow-${lightBg ? 'light' : 'dark'})`;
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}"${dash} stroke-linecap="round" stroke-linejoin="round" marker-end="${markerRef}"/>`;
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

  return `<g transform="translate(${fmt(x)},${fmt(y)})"><rect width="${w}" height="${h}" rx="6" fill="${bgFill}" stroke="${stroke}" stroke-width="1" shadow="0 4 12 rgba(0,0,0,0.1)"/>${rows}</g>`;
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
    const w = n.width;
    const h = n.height;
    const d = n.depth;

    const x0 = n.x - w / 2;
    const x1 = n.x + w / 2;
    const y0 = n.y - h / 2;
    const y1 = n.y + h / 2;
    const z0 = n.z - d / 2;
    const z1 = n.z + d / 2;

    // Project all 8 corners of the bounding box
    [
      to25D(x0, y0, z0, S), to25D(x1, y0, z0, S),
      to25D(x0, y1, z0, S), to25D(x1, y1, z0, S),
      to25D(x0, y0, z1, S), to25D(x1, y0, z1, S),
      to25D(x0, y1, z1, S), to25D(x1, y1, z1, S),
    ].forEach(p => updateBounds(p.x, p.y));

    // Pad for container label footprint
    if (n.is_container) {
      const p = to25D(n.x, y0, z1 + d + 2, S);
      updateBounds(p.x, p.y);
    }
  }

  for (const edge of layout.edges) {
    for (const pt of edge.points) {
      const p = to25D(pt.x, pt.y, pt.z, S);
      updateBounds(p.x, p.y);
    }
  }

  const pad = 60;
  if (minX === Infinity) {
    minX = 0; minY = 0; maxX = 400; maxY = 300;
  }
  const vbX = minX - pad;
  const vbY = minY - pad;
  const vbW = maxX - minX + pad * 2;
  const vbH = maxY - minY + pad * 2;
  const trueW = Math.round(vbW);
  const trueH = Math.round(vbH);

  // Render elements
  // Sort nodes by Z-index painter's algorithm: (x + y + z) ascending (furthest from camera is drawn first)
  const sortedNodes = allNodes.slice().sort((a, b) => {
    const distA = a.x + a.y + a.z;
    const distB = b.x + b.y + b.z;
    return distA - distB;
  });

  const edgeSvgs = layout.edges.map((e) => renderEdgePath(e, S, lightBg));

  // Separate containers and terminals since containers should be drawn under terminals
  const containerSvgs = sortedNodes.filter(n => n.is_container && n.children && !n.collapsed).map((n) => renderCuboid(n, S, lightBg));
  const terminalSvgs = sortedNodes.filter(n => !(n.is_container && n.children && !n.collapsed)).map((n) => renderCuboid(n, S, lightBg));

  const bgRect = options.transparentBackground ? '' : `<rect x="${fmt(vbX)}" y="${fmt(vbY)}" width="${fmt(vbW)}" height="${fmt(vbH)}" fill="${lightBg ? '#ffffff' : '#09090b'}"/>`;

  const actualLegendStr = options.legend !== false ? (() => {
    const items = OP_COLORS;
    const rowH = 22;
    const legW = 150;
    const legH = items.length * rowH + 20;
    const legBg = lightBg ? '#f8fafc' : '#18181b';
    const legStroke = lightBg ? '#e2e8f0' : '#3f3f46';
    const legText = lightBg ? '#475569' : '#a1a1aa';

    let rows = '';
    items.forEach(([label, color], i) => {
      const ry = 14 + i * rowH;
      rows += `<rect x="16" y="${ry}" width="14" height="14" rx="4" fill="${color}"/>`;
      rows += `<text x="40" y="${ry + 11}" font-size="12" font-weight="600" fill="${legText}">${label}</text>`;
    });

    return `<g transform="translate(${fmt(vbX + 30)},${fmt(vbY + 30)})">
        <rect width="${legW}" height="${legH}" rx="10" fill="${legBg}" stroke="${legStroke}" stroke-width="1.5" opacity="0.95" />
        ${rows}
      </g>`;
  })() : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${fmt(vbX)} ${fmt(vbY)} ${fmt(vbW)} ${fmt(vbH)}" width="${trueW}" height="${trueH}">
<defs>
<style>text { font-family: 'Inter', '-apple-system', 'Segoe UI', system-ui, sans-serif; }</style>
<marker id="arrow-light" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
  <path d="M0,1 L8,5 L0,9 z" fill="#64748b"/>
</marker>
<marker id="arrow-dark" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
  <path d="M0,1 L8,5 L0,9 z" fill="#a1a1aa"/>
</marker>
</defs>
${bgRect}
<g>
${containerSvgs.join('\n')}
${edgeSvgs.join('\n')}
${terminalSvgs.join('\n')}
</g>
${actualLegendStr}
</svg>`;
}
