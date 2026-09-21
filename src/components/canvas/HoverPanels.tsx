import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { LayoutNode } from '../../lib/irTypes';
import { getStrings } from '../../lib/localization';
import { getLayerInsight } from '../../lib/layerInsights';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { Z_INDEX_HOVER_PANEL } from '../../lib/constants';

const HOVER_PANEL_ESTIMATED_WIDTH = 272;
const HOVER_PANEL_ESTIMATED_HEIGHT = 170;
const HOVER_PANEL_EDGE_PADDING = 12;
const HOVER_PANEL_BELOW_X_OFFSET = 72;

export function useHoverHold<T>(emptyValue: T, delay = 120, showDelay = 160) {
  const [value, setValue] = useState<T>(emptyValue);
  const hideTimer = useRef<number | null>(null);
  const showTimer = useRef<number | null>(null);
  const panelHovered = useRef(false);

  const clearHideTimer = useCallback(() => {
    if (!hideTimer.current) return;
    window.clearTimeout(hideTimer.current);
    hideTimer.current = null;
  }, []);

  const clearShowTimer = useCallback(() => {
    if (!showTimer.current) return;
    window.clearTimeout(showTimer.current);
    showTimer.current = null;
  }, []);

  const show = useCallback((nextValue: T) => {
    clearHideTimer();
    clearShowTimer();
    showTimer.current = window.setTimeout(() => {
      setValue(nextValue);
      showTimer.current = null;
    }, showDelay);
  }, [clearHideTimer, clearShowTimer, showDelay]);

  const hide = useCallback(() => {
    clearHideTimer();
    clearShowTimer();
    hideTimer.current = window.setTimeout(() => {
      if (panelHovered.current) {
        hideTimer.current = null;
        return;
      }
      setValue(emptyValue);
      hideTimer.current = null;
    }, delay);
  }, [clearHideTimer, clearShowTimer, delay, emptyValue]);

  const hold = useCallback(() => {
    panelHovered.current = true;
    clearHideTimer();
  }, [clearHideTimer]);

  const release = useCallback(() => {
    panelHovered.current = false;
    hide();
  }, [hide]);

  useEffect(() => () => {
    clearHideTimer();
    clearShowTimer();
  }, [clearHideTimer, clearShowTimer]);

  return { value, show, hide, hold, release };
}

export const NodeHoverPanel: React.FC<{
  node: LayoutNode;
  onOpenLayerInsight: (node: LayoutNode) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}> = React.memo(({ node, onOpenLayerInsight, onPointerEnter, onPointerLeave }) => {
  const language = usePreferencesStore((s) => s.language);
  const t = getStrings(language);
  const insight = getLayerInsight(node, t);

  return (
    <div
      data-layer-hover-panel="true"
      className="glass-panel flex flex-col gap-1.5 bg-[var(--surface-elevated)] border-[var(--border)] px-3 py-2.5 rounded-lg text-left shadow-2xl min-w-[13.5rem] max-w-[17rem] animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-auto"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[12px] font-bold text-[#7db2e8] uppercase leading-tight break-words">{insight.title}</span>
        <button
          type="button"
          className="text-[11px] font-mono font-semibold text-zinc-400 hover:text-zinc-100 underline decoration-dotted underline-offset-4 whitespace-nowrap"
          onClick={() => onOpenLayerInsight(node)}
          title={t.inspector.explainParameterFormula}
        >
          {insight.paramsLabel}
        </button>
      </div>
      <div className="grid grid-cols-[3.25rem_1fr] gap-x-3 gap-y-0.5 text-[11px]">
        <span className="text-[#93b7d8] uppercase tracking-wider font-semibold">{t.inspector.input}</span>
        <span className="font-mono text-[#d7e5f3] break-words">{insight.inputShape}</span>
        <span className="text-[#d8bd7a] uppercase tracking-wider font-semibold">{t.inspector.output}</span>
        <span className="font-mono text-[#f1dfb5] break-words">{insight.outputShape}</span>
      </div>
      <div className="border-t border-[var(--border-subtle)] pt-1.5">
        <p className="text-[11px] leading-snug text-[var(--text-muted)]">{insight.why}</p>
      </div>
    </div>
  );
});

export const HoverPanelHtml: React.FC<{
  position: [number, number, number];
  node: LayoutNode;
  onOpenLayerInsight: (node: LayoutNode) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}> = React.memo(({ position, node, onOpenLayerInsight, onPointerEnter, onPointerLeave }) => {
  const calculateHoverPanelPosition = useCallback((el: THREE.Object3D, camera: THREE.Camera, size: { width: number; height: number }) => {
    const projected = new THREE.Vector3().setFromMatrixPosition(el.matrixWorld);
    projected.project(camera);

    const anchorX = (projected.x * size.width) / 2 + size.width / 2;
    const anchorY = -(projected.y * size.height) / 2 + size.height / 2;
    const maxX = Math.max(HOVER_PANEL_EDGE_PADDING, size.width - HOVER_PANEL_ESTIMATED_WIDTH - HOVER_PANEL_EDGE_PADDING);
    const maxY = Math.max(HOVER_PANEL_EDGE_PADDING, size.height - HOVER_PANEL_ESTIMATED_HEIGHT - HOVER_PANEL_EDGE_PADDING);
    const aboveY = anchorY - HOVER_PANEL_ESTIMATED_HEIGHT - HOVER_PANEL_EDGE_PADDING;
    const placeBelow = aboveY < HOVER_PANEL_EDGE_PADDING;
    const xOffset = placeBelow ? HOVER_PANEL_BELOW_X_OFFSET : HOVER_PANEL_EDGE_PADDING;
    const x = Math.min(Math.max(anchorX + xOffset, HOVER_PANEL_EDGE_PADDING), maxX);
    const y = placeBelow
      ? Math.min(anchorY + HOVER_PANEL_EDGE_PADDING, maxY)
      : aboveY;

    return [x, Math.max(HOVER_PANEL_EDGE_PADDING, y)];
  }, []);

  return (
    <Html position={position} zIndexRange={[Z_INDEX_HOVER_PANEL, 0]} className="pointer-events-auto" calculatePosition={calculateHoverPanelPosition}>
      <div style={{ transformOrigin: 'top left' }}>
        <NodeHoverPanel
          node={node}
          onOpenLayerInsight={onOpenLayerInsight}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
        />
      </div>
    </Html>
  );
});
