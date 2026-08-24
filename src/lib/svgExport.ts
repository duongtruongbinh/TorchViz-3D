import type { LayoutData, LayoutNode, LayoutEdge } from './irTypes.ts';
import { getVisualMeta, getActivationSubKind, getLegendItems, computeFontSize } from './visualKind.ts';
import { collectRenderableNodes, getRenderableNodeBox, getRenderableNodeSize } from './renderBounds.ts';
import { getLayoutNodeBaseColor } from './nodeVisualStyle.ts';

export interface SvgOptions {
  scale?: number;
  textScale?: number;
  strokeScale?: number;
  padding?: number;
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

function to25D(x: number, y: number, z: number, s: number): { x: number; y: number } {
  return {
    x: (x - z * COS_A) * s,
    y: (-y + z * SIN_A) * s,
  };
}

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

// ── Per-kind SVG block renderers ──────────────────────────────────

interface BlockCtx {
  n: LayoutNode;
  s: number;
  lightBg: boolean;
  textScale: number;
  strokeScale: number;
  meta: ReturnType<typeof getVisualMeta>;
}

/** Get the adjusted dimensions for a node based on its visual meta */
function getAdjustedDims(n: LayoutNode) {
  const { width, height, depth } = getRenderableNodeSize(n);
  return { w: width, h: height, d: depth };
}

/** Standard cuboid faces (right, top, front) with stroke */
function cuboidFaces(
  cx: number, cy: number, cz: number,
  w: number, h: number, d: number,
  baseColor: string, s: number, lightBg: boolean, strokeScale: number,
): string {
  const frontColor = adjustColor(baseColor, -20);
  const topColor = adjustColor(baseColor, 20);
  const strokeColor = lightBg ? '#1e293b' : '#27272a';
  const sw = 0.75 * strokeScale;

  const x0 = cx - w / 2, x1 = cx + w / 2;
  const y0 = cy - h / 2, y1 = cy + h / 2;
  const z0 = cz - d / 2, z1 = cz + d / 2;

  // Right Face
  const r1 = to25D(x1, y1, z0, s), r2 = to25D(x1, y1, z1, s);
  const r3 = to25D(x1, y0, z1, s), r4 = to25D(x1, y0, z0, s);
  // Top Face
  const t1 = to25D(x0, y1, z0, s), t2 = to25D(x1, y1, z0, s);
  const t3 = to25D(x1, y1, z1, s), t4 = to25D(x0, y1, z1, s);
  // Front Face
  const f1 = to25D(x0, y1, z1, s), f2 = to25D(x1, y1, z1, s);
  const f3 = to25D(x1, y0, z1, s), f4 = to25D(x0, y0, z1, s);

  let svg = '';
  svg += `<polygon points="${fmt(t1.x)},${fmt(t1.y)} ${fmt(t2.x)},${fmt(t2.y)} ${fmt(t3.x)},${fmt(t3.y)} ${fmt(t4.x)},${fmt(t4.y)}" fill="${topColor}" stroke="${strokeColor}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  svg += `<polygon points="${fmt(f1.x)},${fmt(f1.y)} ${fmt(f2.x)},${fmt(f2.y)} ${fmt(f3.x)},${fmt(f3.y)} ${fmt(f4.x)},${fmt(f4.y)}" fill="${frontColor}" stroke="${strokeColor}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  svg += `<polygon points="${fmt(r1.x)},${fmt(r1.y)} ${fmt(r2.x)},${fmt(r2.y)} ${fmt(r3.x)},${fmt(r3.y)} ${fmt(r4.x)},${fmt(r4.y)}" fill="${baseColor}" stroke="${strokeColor}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  return svg;
}

/** Render label centered on the right face */
function blockLabel(
  cx: number, cy: number, cz: number,
  w: number, h: number,
  opType: string, outShape: number[] | undefined,
  s: number, lightBg: boolean, textScale: number,
  meta: ReturnType<typeof getVisualMeta>,
): string {
  const x1 = cx + w / 2;
  const center = to25D(x1, cy, cz, s);
  const textFill = lightBg ? '#ffffff' : '#f8fafc';

  // Scale-aware font sizes
  const opFontSize = computeFontSize(h, s, { factor: 0.18, min: 8, max: 24 }) * textScale;
  const shapeFontSize = Math.max(6, opFontSize * 0.7);

  const label = meta.labelOverride ?? opType;
  const lineSpacing = opFontSize * 1.4;

  let svg = `<text x="${fmt(center.x)}" y="${fmt(center.y)}" text-anchor="middle" font-size="${fmt(opFontSize)}" fill="${textFill}" font-weight="600">${escapeXml(label)}</text>`;

  if (outShape && outShape.length > 1) {
    const shapeStr = outShape.slice(1).join('×');
    svg += `<text x="${fmt(center.x)}" y="${fmt(center.y + lineSpacing)}" text-anchor="middle" font-size="${fmt(shapeFontSize)}" fill="${lightBg ? '#e2e8f0' : '#d4d4d8'}" font-family="monospace">${escapeXml(shapeStr)}</text>`;
  }
  return svg;
}

/** Standard cuboid block (Conv, Linear, Norm, Embedding, RNN, Default, etc.) */
function renderStandardBlock(ctx: BlockCtx): string {
  const { n, s, lightBg, textScale, strokeScale, meta } = ctx;
  const { w, h, d } = getAdjustedDims(n);
  const baseColor = getLayoutNodeBaseColor(n);

  let svg = cuboidFaces(n.x, n.y, n.z, w, h, d, baseColor, s, lightBg, strokeScale);

  // Add per-kind visual decorations on right face
  if (meta.kind === 'Norm') {
    // Horizontal stripe bands
    const x1 = n.x + w / 2;
    const stripeCount = 3;
    for (let i = 0; i < stripeCount; i++) {
      const yPos = n.y - h / 2 + h * (i + 1) / (stripeCount + 1);
      const p1 = to25D(x1, yPos, n.z - d / 2 * 0.8, s);
      const p2 = to25D(x1, yPos, n.z + d / 2 * 0.8, s);
      svg += `<line x1="${fmt(p1.x)}" y1="${fmt(p1.y)}" x2="${fmt(p2.x)}" y2="${fmt(p2.y)}" stroke="${adjustColor(baseColor, 40)}" stroke-width="${1.0 * strokeScale}" stroke-opacity="0.6"/>`;
    }
  }

  svg += blockLabel(n.x, n.y, n.z, w, h, n.op_type, n.out_shape, s, lightBg, textScale, meta);
  return svg;
}



/** Activation (ReLU, etc): thin block with bright glow inset */
function renderActivationBlock(ctx: BlockCtx): string {
  const { n, s, lightBg, textScale, strokeScale, meta } = ctx;
  const { w, h, d } = getAdjustedDims(n);
  const baseColor = getLayoutNodeBaseColor(n);

  let svg = cuboidFaces(n.x, n.y, n.z, w, h, d, baseColor, s, lightBg, strokeScale);

  // Subtle glowing core line
  const x1 = n.x + w / 2;
  const coreTop = to25D(x1 + 0.01, n.y + h * 0.35, n.z, s);
  const coreBot = to25D(x1 + 0.01, n.y - h * 0.35, n.z, s);
  svg += `<line x1="${fmt(coreTop.x)}" y1="${fmt(coreTop.y)}" x2="${fmt(coreBot.x)}" y2="${fmt(coreBot.y)}" stroke="#ffffff" stroke-width="${2 * strokeScale}" stroke-opacity="0.6" stroke-linecap="round"/>`;

  svg += blockLabel(n.x, n.y, n.z, w, h, n.op_type, n.out_shape, s, lightBg, textScale, meta);
  return svg;
}

/** Flatten/Reshape/Permute/Slice: thin plate */
function renderTransformBlock(ctx: BlockCtx): string {
  const { n, s, lightBg, textScale, strokeScale, meta } = ctx;
  const { w, h, d } = getAdjustedDims(n);
  const baseColor = getLayoutNodeBaseColor(n);

  let svg = cuboidFaces(n.x, n.y, n.z, w, h, d, baseColor, s, lightBg, strokeScale);
  svg += blockLabel(n.x, n.y, n.z, w, h, n.op_type, n.out_shape, s, lightBg, textScale, meta);
  return svg;
}

/** Add/Concat: diamond-shaped block */
function renderAddConcatBlock(ctx: BlockCtx): string {
  const { n, s, lightBg, textScale, strokeScale, meta } = ctx;
  const { w, h, d } = getAdjustedDims(n);
  const baseColor = getLayoutNodeBaseColor(n);

  const x1 = n.x + w / 2;

  // Standard cuboid base
  let svg = cuboidFaces(n.x, n.y, n.z, w, h, d, baseColor, s, lightBg, strokeScale);

  // "+" symbol for Add glowing inset
  const plusCenter = to25D(x1 + 0.01, n.y, n.z, s);
  const plusSize = Math.min(h, d) * 0.2 * s;
  svg += `<line x1="${fmt(plusCenter.x - plusSize)}" y1="${fmt(plusCenter.y)}" x2="${fmt(plusCenter.x + plusSize)}" y2="${fmt(plusCenter.y)}" stroke="#ffffff" stroke-width="${2 * strokeScale}" stroke-opacity="0.8" stroke-linecap="round"/>`;
  svg += `<line x1="${fmt(plusCenter.x)}" y1="${fmt(plusCenter.y - plusSize)}" x2="${fmt(plusCenter.x)}" y2="${fmt(plusCenter.y + plusSize)}" stroke="#ffffff" stroke-width="${2 * strokeScale}" stroke-opacity="0.8" stroke-linecap="round"/>`;

  svg += blockLabel(n.x, n.y, n.z, w, h, n.op_type, n.out_shape, s, lightBg, textScale, meta);
  return svg;
}

/** Attention: striped multi-head block */
function renderAttentionBlock(ctx: BlockCtx): string {
  const { n, s, lightBg, textScale, strokeScale, meta } = ctx;
  const { w, h, d } = getAdjustedDims(n);
  const baseColor = getLayoutNodeBaseColor(n);
  const x1 = n.x + w / 2;

  let svg = cuboidFaces(n.x, n.y, n.z, w, h, d, baseColor, s, lightBg, strokeScale);

  // Vertical stripe hatching on right face
  const stripeCount = 5;
  for (let i = 0; i < stripeCount; i++) {
    const zFrac = (i + 1) / (stripeCount + 1);
    const zPos = n.z - d / 2 + d * zFrac;
    const p1 = to25D(x1 + 0.01, n.y + h * 0.38, zPos, s);
    const p2 = to25D(x1 + 0.01, n.y - h * 0.38, zPos, s);
    svg += `<line x1="${fmt(p1.x)}" y1="${fmt(p1.y)}" x2="${fmt(p2.x)}" y2="${fmt(p2.y)}" stroke="#ffffff" stroke-width="${0.8 * strokeScale}" stroke-opacity="0.3"/>`;
  }

  svg += blockLabel(n.x, n.y, n.z, w, h, n.op_type, n.out_shape, s, lightBg, textScale, meta);
  return svg;
}

/** Upsample: expanding trapezoid indicator */
function renderUpsampleBlock(ctx: BlockCtx): string {
  const { n, s, lightBg, textScale, strokeScale, meta } = ctx;
  const { w, h, d } = getAdjustedDims(n);
  const baseColor = getLayoutNodeBaseColor(n);
  const x1 = n.x + w / 2;

  let svg = cuboidFaces(n.x, n.y, n.z, w, h, d, baseColor, s, lightBg, strokeScale);

  // Expanding arrows on right face
  const arrowCenter = to25D(x1 + 0.01, n.y, n.z, s);
  const arrowSize = Math.min(h, d) * 0.2 * s;
  // Up arrow
  svg += `<polygon points="${fmt(arrowCenter.x)},${fmt(arrowCenter.y - arrowSize * 1.5)} ${fmt(arrowCenter.x - arrowSize * 0.5)},${fmt(arrowCenter.y - arrowSize * 0.5)} ${fmt(arrowCenter.x + arrowSize * 0.5)},${fmt(arrowCenter.y - arrowSize * 0.5)}" fill="#ffffff" fill-opacity="0.35"/>`;
  // Down arrow
  svg += `<polygon points="${fmt(arrowCenter.x)},${fmt(arrowCenter.y + arrowSize * 1.5)} ${fmt(arrowCenter.x - arrowSize * 0.5)},${fmt(arrowCenter.y + arrowSize * 0.5)} ${fmt(arrowCenter.x + arrowSize * 0.5)},${fmt(arrowCenter.y + arrowSize * 0.5)}" fill="#ffffff" fill-opacity="0.35"/>`;

  svg += blockLabel(n.x, n.y, n.z, w, h, n.op_type, n.out_shape, s, lightBg, textScale, meta);
  return svg;
}

/** Dispatch to the right renderer based on VisualKind */
function renderBlock(n: LayoutNode, s: number, lightBg: boolean, textScale: number, strokeScale: number): string {
  const isExpandedContainer = n.is_container && n.children && !n.collapsed;
  if (isExpandedContainer) {
    // Render Expanded Container as a dashed flat footprint
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
    const center = to25D(cX, bottomY, cZ + hd + 0.5, s);

    const fontSize = computeFontSize(n.height, s, { factor: 0.1, min: 10, max: 18 }) * textScale;

    let svg = `<polygon points="${fmt(p1.x)},${fmt(p1.y)} ${fmt(p2.x)},${fmt(p2.y)} ${fmt(p3.x)},${fmt(p3.y)} ${fmt(p4.x)},${fmt(p4.y)}" fill="${fill}" fill-opacity="${n.opacity ?? 0.3}" stroke="${stroke}" stroke-width="${1.5 * strokeScale}" stroke-dasharray="6 4"/>`;
    svg += `<text x="${fmt(center.x)}" y="${fmt(center.y)}" text-anchor="middle" font-size="${fmt(fontSize)}" fill="${labelFill}" font-weight="700">${escapeXml(n.op_type)}</text>`;
    return svg;
  }

  const meta = getVisualMeta(n.op_type);
  const ctx: BlockCtx = { n, s, lightBg, textScale, strokeScale, meta };

  const activationSub = getActivationSubKind(meta.kind);
  if (activationSub !== null) return renderActivationBlock(ctx);
  if (meta.kind === 'Flatten' || meta.kind === 'Reshape' || meta.kind === 'Permute' || meta.kind === 'Slice') return renderTransformBlock(ctx);
  if (meta.kind === 'AddConcat') return renderAddConcatBlock(ctx);
  if (meta.kind === 'Attention') return renderAttentionBlock(ctx);
  if (meta.kind === 'Upsample') return renderUpsampleBlock(ctx);

  return renderStandardBlock(ctx);
}

function renderEdgePath(edge: LayoutEdge, s: number, lightBg: boolean, strokeScale: number): string {
  const p = edge.points;
  if (p.length < 2) return '';

  const color = lightBg
    ? edge.kind === 'residual' ? '#94a3b8' : '#475569'
    : edge.kind === 'residual' ? '#71717a' : '#a1a1aa';

  const dash = edge.kind === 'residual' ? ' stroke-dasharray="6 4"' : '';
  const width = (edge.kind === 'residual' ? 1.5 : 2) * strokeScale;

  const pts = p.map((pt) => to25D(pt.x, pt.y, pt.z, s));
  let d: string;
  if (pts.length === 4) {
    d = `M${fmt(pts[0].x)},${fmt(pts[0].y)} C${fmt(pts[1].x)},${fmt(pts[1].y)} ${fmt(pts[2].x)},${fmt(pts[2].y)} ${fmt(pts[3].x)},${fmt(pts[3].y)}`;
  } else {
    d = pts.map((pt, i) => (i === 0 ? `M${fmt(pt.x)},${fmt(pt.y)}` : `L${fmt(pt.x)},${fmt(pt.y)}`)).join(' ');
  }

  const markerRef = `url(#arrow-${lightBg ? 'light' : 'dark'})`;
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}"${dash} stroke-linecap="round" stroke-linejoin="round" marker-end="${markerRef}"/>`;
}

function renderLegend(vbX: number, vbY: number, lightBg: boolean, textScale: number, strokeScale: number): string {
  const items = getLegendItems();
  const baseFontSize = 11 * textScale;
  const swatchSize = Math.max(10, 12 * textScale);
  const rowH = swatchSize + 8;
  const legW = Math.max(140, 160 * textScale);
  const legH = items.length * rowH + 20;
  const legBg = lightBg ? '#f8fafc' : '#18181b';
  const legStroke = lightBg ? '#e2e8f0' : '#3f3f46';
  const legText = lightBg ? '#475569' : '#a1a1aa';

  let rows = '';
  items.forEach(({ label, color }, i) => {
    const ry = 14 + i * rowH;
    rows += `<rect x="16" y="${ry}" width="${fmt(swatchSize)}" height="${fmt(swatchSize)}" rx="4" fill="${color}"/>`;
    rows += `<text x="${16 + swatchSize + 10}" y="${ry + swatchSize - 3}" font-size="${fmt(baseFontSize)}" font-weight="600" fill="${legText}">${label}</text>`;
  });

  return `<g transform="translate(${fmt(vbX + 30)},${fmt(vbY + 30)})">
      <rect width="${legW}" height="${legH}" rx="10" fill="${legBg}" stroke="${legStroke}" stroke-width="${1.5 * strokeScale}" opacity="0.95" />
      ${rows}
    </g>`;
}

export function generateSVG(layout: LayoutData, options: SvgOptions): string {
  const lightBg = options.lightBackground ?? true;
  const textScale = options.textScale ?? 1;
  const strokeScale = options.strokeScale ?? 1;
  const padding = options.padding ?? 80;
  const allNodes = collectRenderableNodes(layout.nodes);
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
    const box = getRenderableNodeBox(n);

    [
      to25D(box.minX, box.minY, box.minZ, S), to25D(box.maxX, box.minY, box.minZ, S),
      to25D(box.minX, box.maxY, box.minZ, S), to25D(box.maxX, box.maxY, box.minZ, S),
      to25D(box.minX, box.minY, box.maxZ, S), to25D(box.maxX, box.minY, box.maxZ, S),
      to25D(box.minX, box.maxY, box.maxZ, S), to25D(box.maxX, box.maxY, box.maxZ, S),
    ].forEach((p) => {
      updateBounds(p.x, p.y);
    });

    if (n.is_container) {
      const p = to25D(n.x, box.minY, box.maxZ + box.depth + 2, S);
      updateBounds(p.x, p.y);
    }
  }

  for (const edge of layout.edges) {
    for (const pt of edge.points) {
      const p = to25D(pt.x, pt.y, pt.z, S);
      updateBounds(p.x, p.y);
    }
  }

  if (minX === Infinity) {
    minX = 0; minY = 0; maxX = 400; maxY = 300;
  }
  const vbX = minX - padding;
  const vbY = minY - padding;
  const vbW = maxX - minX + padding * 2;
  const vbH = maxY - minY + padding * 2;
  const trueW = Math.max(800, Math.round(vbW));
  const trueH = Math.max(600, Math.round(vbH));

  // Sort nodes by painter's algorithm
  const sortedNodes = allNodes.slice().sort((a, b) => {
    const distA = a.x + a.y + a.z;
    const distB = b.x + b.y + b.z;
    return distA - distB;
  });

  const edgeSvgs = layout.edges.map((e) => renderEdgePath(e, S, lightBg, strokeScale));

  const containerSvgs = sortedNodes
    .filter(n => n.is_container && n.children && !n.collapsed)
    .map((n) => renderBlock(n, S, lightBg, textScale, strokeScale));
  const terminalSvgs = sortedNodes
    .filter(n => !(n.is_container && n.children && !n.collapsed))
    .map((n) => renderBlock(n, S, lightBg, textScale, strokeScale));

  const bgRect = options.transparentBackground ? '' : `<rect x="${fmt(vbX)}" y="${fmt(vbY)}" width="${fmt(vbW)}" height="${fmt(vbH)}" fill="${lightBg ? '#ffffff' : '#09090b'}"/>`;

  const actualLegendStr = options.legend !== false ? renderLegend(vbX, vbY, lightBg, textScale, strokeScale) : '';

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
