/** Centralized theme, layers, fonts, sizes, and rendering orders. */

import { configureTextBuilder } from 'troika-three-text';

// --- Fonts & Text styling ---
const ASSET_ORIGIN = typeof window === 'undefined' ? '' : window.location.origin;

function appAssetUrl(path: string): string {
  return `${ASSET_ORIGIN}${path}`;
}

export const FONT_URL = appAssetUrl('/fonts/inter-vietnamese-600-normal.woff');
export const UNICODE_FONTS_URL = appAssetUrl('/unicode-fonts');

configureTextBuilder({ unicodeFontsURL: UNICODE_FONTS_URL });

export const TEXT_BASE_PROPS = {
  font: FONT_URL,
  unicodeFontsURL: UNICODE_FONTS_URL,
  anchorX: 'center' as const,
  anchorY: 'middle' as const,
  outlineWidth: 0.02,
  outlineColor: '#000000',
  outlineBlur: 0,
  maxWidth: 4,
  onSync: (t: { material: { depthTest: boolean; depthWrite: boolean } }) => {
    t.material.depthTest = false;
    t.material.depthWrite = false;
  },
};

// --- Render Orders (higher = renders on top) ---
export const RENDER_ORDER_EDGES = 1;
export const RENDER_ORDER_ERROR_LABEL = 100;
export const RENDER_ORDER_CAPTION_BILLBOARD = 2000;
export const RENDER_ORDER_CAPTION_TEXT = 2001;
export const RENDER_ORDER_INPUT_TILE_BILLBOARD = 2100;
export const RENDER_ORDER_INPUT_TILE_TEXT = 2101;
export const RENDER_ORDER_DATA_PACKET = 2200;
export const RENDER_ORDER_PANEL_SHELL = 2300;
export const RENDER_ORDER_PANEL_TEXT = 2301;
export const RENDER_ORDER_PANEL_TEXT_FRONT = 2302;

// --- HTML zIndex overlays ---
export const Z_INDEX_EXPAND_COLLAPSE_BUTTON = 5;
export const Z_INDEX_RECENTER_BUTTON = 50;
export const Z_INDEX_HOVER_PANEL = 100;

// --- Colors ---
export const ERROR_COLOR = '#ef4444';
export const EDGE_COLOR_STD = '#52525b';
export const EDGE_COLOR_RESIDUAL = '#a1a1aa';
export const EDGE_EDGES_OPAQUE = '#94a3b8';
export const EDGE_EDGES_GLASS = '#bae6fd';

/** Collapsed container colors (distinct, no gray). */
export function getCollapsedContainerColor(opType: string): string {
  const lower = opType.toLowerCase();
  if (lower.includes('sequential') || lower.includes('modulelist')) return '#3b82f6';
  if (lower.includes('resnet') || lower.includes('block') || lower.includes('basic')) return '#60a5fa';
  if (lower.includes('transformer') || lower.includes('attn') || lower.includes('vit') || lower.includes('vision')) return '#a78bfa';
  if (lower.includes('mlp')) return '#34d399';
  if (lower.includes('embed') || lower.includes('patch')) return '#22d3ee';
  return '#6366f1';
}

/** Expanded container glass tint by depth. */
export function getExpandedContainerColor(_op: string, depth: number): string {
  if (depth === 0) return '#e0f2fe';
  if (depth === 1) return '#ccfbf1';
  if (depth === 2) return '#a5b4fc';
  if (depth >= 3) return '#818cf8';
  return '#a78bfa';
}

/** Expanded container opacity by depth. */
export function getExpandedContainerOpacity(depth: number): number {
  if (depth === 0) return 0.15;
  if (depth === 1) return 0.25;
  if (depth === 2) return 0.35;
  return 0.4;
}

/** Expand/Collapse button theme (zinc palette, matches dark UI). */
export const BTN_BG = '#27272a';
export const BTN_BG_HOVER = '#3f3f46';
export const BTN_BORDER = '#52525b';
export const BTN_ICON = '#e4e4e7';
