import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  RoundedBox,
  Html,
  Text,
  Billboard,
  CubicBezierLine,
  Line,
  Edges,
  ContactShadows,
} from '@react-three/drei';
import * as THREE from 'three';
import { LayoutData, LayoutNode, LayoutEdge } from '../lib/irTypes';
import { ERROR_COLOR, EDGE_COLOR_STD, EDGE_COLOR_RESIDUAL, EDGE_EDGES_OPAQUE, EDGE_EDGES_GLASS } from '../lib/constants';
import { getVisualMeta, getVisualKind, getActivationSubKind, type VisualKind } from '../lib/visualKind';
import { getLayerInsight } from '../lib/layerInsights';
import { getStrings } from '../lib/localization';
import { getPlaybackProgress, shouldSyncAnimationState } from '../lib/mnistAnimation';
import { useStore } from '../store/useStore';
import {
  DataFlowDemo,
  DemoControls,
  DEMO_PLAY_SPEED,
  useMnistTexture,
} from './mnist-demo/MnistFlowDemo';
import {
  collectDemoStopNodes,
  collectDemoStops,
  isMnistDemoCompatible,
} from './mnist-demo/demoStops';
import { getSegmentState } from './operation-effects/effectMath';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      instancedMesh: any;
      meshPhysicalMaterial: any;
      meshBasicMaterial: any;
      lineBasicMaterial: any;
      boxGeometry: any;
      planeGeometry: any;
      ringGeometry: any;
      sphereGeometry: any;
      ambientLight: any;
      directionalLight: any;
      gridHelper: any;
      circleGeometry: any;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      instancedMesh: any;
      meshPhysicalMaterial: any;
      meshBasicMaterial: any;
      lineBasicMaterial: any;
      boxGeometry: any;
      planeGeometry: any;
      ringGeometry: any;
      sphereGeometry: any;
      ambientLight: any;
      directionalLight: any;
      gridHelper: any;
      circleGeometry: any;
    }
  }
}

interface Canvas3DProps {
  layout: LayoutData | null;
  loading: boolean;
  error?: { message?: string; lineno?: number; hint?: string } | null;
  highlightNodeId?: string | null;
  onToggleCollapse?: (nodeId: string) => void;
  onHoverNode?: (lineno: number | null) => void;
  onClickNode?: (nodeId: string) => void;
  onOpenLayerInsight?: (node: LayoutNode) => void;
  resetViewToken?: number;
  resetViewDisabled?: boolean;
  demoModeEnabled?: boolean;
}

const HEADER_BAR_HEIGHT = 0.6;
const INSTANCED_BATCH_MIN = 3;
const DEFAULT_CAMERA_OFFSET = new THREE.Vector3(50, 40, 50);
const DEFAULT_CAMERA_ZOOM = 42;
const DEFAULT_MIN_ZOOM = 6;
const DEFAULT_VIEW_PADDING = 0.8;
const HOVER_PANEL_ESTIMATED_WIDTH = 272;
const HOVER_PANEL_ESTIMATED_HEIGHT = 170;
const HOVER_PANEL_EDGE_PADDING = 12;
const HOVER_PANEL_BELOW_X_OFFSET = 72;

const FONT_URL = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff';
const TEXT_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{};\':",./<>? ×áàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬĐÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ';

const getExpandCollapseButtonPosition = (node: LayoutNode): [number, number, number] => [
  node.width / 2,
  node.height / 2,
  -node.depth / 2,
];

const EXPAND_COLLAPSE_BUTTON_Z_INDEX = 5;

const ExpandCollapseButton: React.FC<{
  position: [number, number, number];
  icon: string;
  title: string;
  nodeLabel: string;
  expanded: boolean;
  onToggle: () => void;
}> = ({ position, icon, title, nodeLabel, expanded, onToggle }) => {
  const [hovered, setHovered] = useState(false);
  const ariaLabel = `${title}: ${nodeLabel}`;

  useEffect(() => () => {
    document.body.style.cursor = '';
  }, []);

  return (
    <group position={position}>
      <Html center zIndexRange={[EXPAND_COLLAPSE_BUTTON_Z_INDEX, 0]}>
        <button
          type="button"
          title={title}
          aria-label={ariaLabel}
          aria-expanded={expanded}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            document.body.style.cursor = '';
            onToggle();
          }}
          onPointerEnter={() => {
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerLeave={() => {
            setHovered(false);
            document.body.style.cursor = '';
          }}
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            border: `2px solid ${hovered ? '#a1a1aa' : '#52525b'}`,
            background: hovered ? '#3f3f46' : '#27272a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
            lineHeight: 1,
            fontWeight: 400,
            padding: 0,
            boxShadow: '0 1px 5px rgba(0, 0, 0, 0.45)',
            pointerEvents: 'auto',
            userSelect: 'none',
          }}
        >
          {icon}
        </button>
      </Html>
    </group>
  );
};

const textBaseProps = {
  font: FONT_URL,
  characters: TEXT_CHARS,
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

function useHoverHold<T>(emptyValue: T, delay = 120, showDelay = 160) {
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

function flattenLeaves(nodes: LayoutNode[], out: LayoutNode[] = []): LayoutNode[] {
  for (const n of nodes) {
    if (!n.is_container) {
      out.push(n);
    } else if (n.children?.length) {
      flattenLeaves(n.children, out);
    }
  }
  return out;
}

function groupLeavesByIdentity(leaves: LayoutNode[]): { batches: LayoutNode[][]; singles: LayoutNode[] } {
  const map = new Map<string, LayoutNode[]>();
  for (const n of leaves) {
    const kind = getVisualKind(n.op_type);
    const meta = getVisualMeta(n.op_type);
    // Only batch simple geometries (non-special shapes)
    if (meta.specialGeometry) {
      // Special shapes always go to singles for per-node rendering
      const arr = map.get(`__special_${n.id}`) ?? [];
      arr.push(n);
      map.set(`__special_${n.id}`, arr);
      continue;
    }
    // Apply visual dimension multipliers to the key
    const w = n.width * meta.widthMul;
    const h = n.height * meta.heightMul;
    const d = n.depth * meta.depthMul;
    const key = `${kind}_${w.toFixed(2)}_${h.toFixed(2)}_${d.toFixed(2)}_${meta.color}`;
    const arr = map.get(key) ?? [];
    arr.push(n);
    map.set(key, arr);
  }
  const batches: LayoutNode[][] = [];
  const singles: LayoutNode[] = [];
  for (const arr of map.values()) {
    if (arr.length >= INSTANCED_BATCH_MIN) {
      batches.push(arr);
    } else {
      singles.push(...arr);
    }
  }
  return { batches, singles };
}

const NodeHoverPanel: React.FC<{
  node: LayoutNode;
  onOpenLayerInsight: (node: LayoutNode) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}> = ({ node, onOpenLayerInsight, onPointerEnter, onPointerLeave }) => {
  const language = useStore((s) => s.language);
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
};

const HoverPanelHtml: React.FC<{
  position: [number, number, number];
  node: LayoutNode;
  onOpenLayerInsight: (node: LayoutNode) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}> = ({ position, node, onOpenLayerInsight, onPointerEnter, onPointerLeave }) => {
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
    <Html position={position} zIndexRange={[100, 0]} className="pointer-events-auto" calculatePosition={calculateHoverPanelPosition}>
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
};

const NodeCaption: React.FC<{
  label: string;
  params?: number;
  position: [number, number, number];
  scaleOnHover?: boolean;
  outlineColor?: string;
  fontSize?: number;
  color?: string;
  outlineWidth?: number;
  paramFontSize?: number;
  paramOffsetY?: number;
}> = ({
  label,
  params,
  position,
  scaleOnHover = false,
  outlineColor,
  fontSize = 0.5,
  color = '#e5e7eb',
  outlineWidth = 0.025,
  paramFontSize = 0.4,
  paramOffsetY = -0.36,
}) => {
  const language = useStore((s) => s.language);
  const t = getStrings(language);

  return (
    <Billboard position={position} renderOrder={2000}>
      <group scale={scaleOnHover ? 1 : 0.95}>
        <Text
          {...textBaseProps}
          fontSize={fontSize}
          color={color}
          outlineColor={outlineColor ?? textBaseProps.outlineColor}
          outlineWidth={outlineWidth}
          renderOrder={2001}
        >
          {label}
        </Text>
        {!!params && params > 0 && (
          <Text
            {...textBaseProps}
            fontSize={paramFontSize}
            color="#9ca3af"
            position={[0, paramOffsetY, 0]}
            anchorY="top"
            renderOrder={2001}
          >
            {params.toLocaleString()} {t.inspector.params}
          </Text>
        )}
      </group>
    </Billboard>
  );
};

/* ─── Instanced leaf blocks (performance: 3+ identical blocks) ─── */
const InstancedLeafGroup: React.FC<{
  nodes: LayoutNode[];
  highlightNodeId: string | null;
  onHover: (lineno: number | null) => void;
  onClickNode: (nodeId: string) => void;
  onOpenLayerInsight: (node: LayoutNode) => void;
}> = ({ nodes, highlightNodeId, onHover, onClickNode, onOpenLayerInsight }) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const hovered = useHoverHold<number | null>(null);
  const n = nodes[0];
  const meta = useMemo(() => getVisualMeta(n.op_type), [n.op_type]);
  const args = useMemo(
    () => [n.width * meta.widthMul, n.height * meta.heightMul, n.depth * meta.depthMul] as [number, number, number],
    [n.width, n.height, n.depth, meta],
  );

  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const matrix = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      pos.set(node.x, node.y, node.z);
      matrix.compose(pos, new THREE.Quaternion(), new THREE.Vector3(1, 1, 1));
      mesh.setMatrixAt(i, matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [nodes]);

  const baseColor = n.error ? ERROR_COLOR : meta.color;

  return (
    <group>
      <instancedMesh
        ref={ref}
        args={[undefined as any, undefined as any, nodes.length]}
        onClick={(e: any) => {
          e.stopPropagation();
          const i = e.instanceId ?? 0;
          const node = nodes[i];
          if (!node) return;
          onClickNode(node.id);
          onOpenLayerInsight(node);
        }}
        onPointerOver={(e: any) => {
          e.stopPropagation();
          const i = e.instanceId ?? 0;
          hovered.show(i);
          onHover(nodes[i]?.lineno ?? null);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          hovered.hide();
          onHover(null);
          document.body.style.cursor = '';
        }}
      >
        <boxGeometry args={args} />
        <meshPhysicalMaterial
          color={baseColor}
          metalness={0.05}
          roughness={0.5}
          emissive={baseColor}
          emissiveIntensity={0}
        />
      </instancedMesh>
      {nodes.map((nd) => (
        <NodeCaption
          key={nd.id}
          label={meta.labelOverride ?? nd.op_type}
          position={[
            nd.x,
            nd.y - (nd.height * meta.heightMul) / 2 - 0.9,
            nd.z + (nd.depth * meta.depthMul) / 2 + 0.15,
          ]}
        />
      ))}
      {hovered.value !== null && nodes[hovered.value] && (
        <HoverPanelHtml
          position={[
            nodes[hovered.value].x + (nodes[hovered.value].width * meta.widthMul) / 2 + 0.35,
            nodes[hovered.value].y + (nodes[hovered.value].height * meta.heightMul) / 2 + 0.6,
            nodes[hovered.value].z,
          ]}
          node={nodes[hovered.value]}
          onOpenLayerInsight={onOpenLayerInsight}
          onPointerEnter={hovered.hold}
          onPointerLeave={hovered.release}
        />
      )}
    </group>
  );
};

/* ─── Pulsing emissive intensity for error nodes ─── */
function useErrorPulse(hasError: boolean): number {
  const ref = useRef(0);
  useFrame((_, delta) => {
    if (hasError) ref.current += delta * 3;
  });
  if (!hasError) return 0;
  return 0.5 + Math.sin(ref.current) * 0.4;
}



/* ─── Per-kind: Thin floating plate for Activation (ReLU/Sigmoid) ─── */
const ActivationBlock: React.FC<{ w: number; h: number; d: number; color: string; isActive: boolean; hasError: boolean; errorPulse: number }> = ({ w, h, d, color, isActive, hasError, errorPulse }) => {
  return (
    <group>
      {/* Very thin, glowing plate */}
      <RoundedBox args={[w, h, d]} radius={0.01} smoothness={2}>
        <meshPhysicalMaterial color={color} metalness={0.1} roughness={0.2} emissive={hasError ? ERROR_COLOR : color} emissiveIntensity={hasError ? errorPulse : isActive ? 0.4 : 0.15} transmission={0.2} thickness={0.5} />
      </RoundedBox>
      <Edges threshold={15} color={isActive ? '#ffffff' : hasError ? ERROR_COLOR : EDGE_COLOR_STD} scale={1.001} renderOrder={1}>
        <lineBasicMaterial transparent opacity={isActive ? 0.9 : 0.4} />
      </Edges>
    </group>
  );
};

/* ─── Per-kind: Clean box with glowing '+' for Add/Concat ─── */
const DiamondBlock: React.FC<{ w: number; h: number; d: number; color: string; isActive: boolean; hasError: boolean; errorPulse: number }> = ({ w, h, d, color, isActive, hasError, errorPulse }) => {
  const plusSize = Math.min(h, d) * 0.2;
  return (
    <group>
      <RoundedBox args={[w, h, d]} radius={0.02} smoothness={2}>
        <meshPhysicalMaterial color={color} metalness={0.05} roughness={0.5} emissive={hasError ? ERROR_COLOR : color} emissiveIntensity={hasError ? errorPulse : isActive ? 0.25 : 0} />
      </RoundedBox>
      <Edges threshold={15} color={isActive ? '#ffffff' : hasError ? ERROR_COLOR : EDGE_COLOR_STD} scale={1.001} renderOrder={1}>
        <lineBasicMaterial transparent opacity={isActive ? 0.9 : 0.4} />
      </Edges>
      {/* Bright '+' icon on the side */}
      <group position={[w / 2 + 0.01, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[plusSize * 2, plusSize * 0.4, 0.02]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
        <mesh>
          <boxGeometry args={[plusSize * 0.4, plusSize * 2, 0.02]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
      </group>
    </group>
  );
};

/* ─── Per-kind: Clean striped block for Attention ─── */
const AttentionBlock: React.FC<{ w: number; h: number; d: number; color: string; isActive: boolean; hasError: boolean; errorPulse: number }> = ({ w, h, d, color, isActive, hasError, errorPulse }) => {
  const stripeCount = 3;
  const stripeW = d / (stripeCount * 2 + 1);
  return (
    <group>
      <RoundedBox args={[w, h, d]} radius={0.02} smoothness={2}>
        <meshPhysicalMaterial color={color} metalness={0.05} roughness={0.5} emissive={hasError ? ERROR_COLOR : color} emissiveIntensity={hasError ? errorPulse : isActive ? 0.25 : 0} />
      </RoundedBox>
      {/* Heatsink-style subtle vertical inset stripes */}
      {Array.from({ length: stripeCount }, (_, i) => (
        <mesh key={i} position={[w / 2 + 0.01, 0, -d / 2 + stripeW * (2 * i + 1.5)]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[stripeW * 0.6, h * 0.7, 0.02]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
        </mesh>
      ))}
      <Edges threshold={15} color={isActive ? '#ffffff' : hasError ? ERROR_COLOR : EDGE_COLOR_STD} scale={1.001} renderOrder={1}>
        <lineBasicMaterial transparent opacity={isActive ? 0.9 : 0.4} />
      </Edges>
    </group>
  );
};

/* ─── Per-kind: Box with up-arrows for Upsample ─── */
const UpsampleBlock: React.FC<{ w: number; h: number; d: number; color: string; isActive: boolean; hasError: boolean; errorPulse: number }> = ({ w, h, d, color, isActive, hasError, errorPulse }) => {
  const arrowSize = Math.min(h, d) * 0.15;
  const geo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, arrowSize);
    shape.lineTo(arrowSize, -arrowSize);
    shape.lineTo(-arrowSize, -arrowSize);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, [arrowSize]);

  return (
    <group>
      <RoundedBox args={[w, h, d]} radius={0.015} smoothness={2}>
        <meshPhysicalMaterial color={color} metalness={0.05} roughness={0.5} emissive={hasError ? ERROR_COLOR : color} emissiveIntensity={hasError ? errorPulse : isActive ? 0.25 : 0} />
      </RoundedBox>
      <Edges threshold={15} color={isActive ? '#ffffff' : hasError ? ERROR_COLOR : EDGE_COLOR_STD} scale={1.001} renderOrder={1}>
        <lineBasicMaterial transparent opacity={isActive ? 0.9 : 0.4} />
      </Edges>
      <group position={[w / 2 + 0.01, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh geometry={geo} position={[0, arrowSize, 0]}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
        <mesh geometry={geo} position={[0, -arrowSize, 0]}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
};

/* ─── Per-kind: Thin plate for Transform/Flatten ─── */
const TransformBlock: React.FC<{ w: number; h: number; d: number; color: string; isActive: boolean; hasError: boolean; errorPulse: number }> = ({ w, h, d, color, isActive, hasError, errorPulse }) => {
  return (
    <group>
      <RoundedBox args={[w, h, d]} radius={0.005} smoothness={1}>
        <meshPhysicalMaterial color={color} metalness={0.05} roughness={0.5} emissive={hasError ? ERROR_COLOR : color} emissiveIntensity={hasError ? errorPulse : isActive ? 0.25 : 0} />
      </RoundedBox>
      <Edges threshold={15} color={isActive ? '#ffffff' : hasError ? ERROR_COLOR : EDGE_COLOR_STD} scale={1.001} renderOrder={1}>
        <lineBasicMaterial transparent opacity={isActive ? 0.9 : 0.4} />
      </Edges>
    </group>
  );
};

/* ─── Shape Dispatcher: renders the right 3D shape for a given visual kind ─── */
const KindShape: React.FC<{
  kind: VisualKind; w: number; h: number; d: number; color: string;
  cornerRadius: number; isActive: boolean; hasError: boolean; errorPulse: number;
}> = ({ kind, w, h, d, color, cornerRadius, isActive, hasError, errorPulse }) => {
  const activationSub = getActivationSubKind(kind);
  if (activationSub !== null) return <ActivationBlock w={w} h={h} d={d} color={color} isActive={isActive} hasError={hasError} errorPulse={errorPulse} />;
  if (kind === 'AddConcat') return <DiamondBlock w={w} h={h} d={d} color={color} isActive={isActive} hasError={hasError} errorPulse={errorPulse} />;
  if (kind === 'Attention') return <AttentionBlock w={w} h={h} d={d} color={color} isActive={isActive} hasError={hasError} errorPulse={errorPulse} />;
  if (kind === 'Upsample') return <UpsampleBlock w={w} h={h} d={d} color={color} isActive={isActive} hasError={hasError} errorPulse={errorPulse} />;
  if (kind === 'Flatten' || kind === 'Reshape' || kind === 'Permute' || kind === 'Slice') return <TransformBlock w={w} h={h} d={d} color={color} isActive={isActive} hasError={hasError} errorPulse={errorPulse} />;

  // Default: RoundedBox
  return (
    <>
      <RoundedBox args={[w, h, d]} radius={cornerRadius} smoothness={2}>
        <meshPhysicalMaterial
          color={color}
          metalness={0.05}
          roughness={0.5}
          clearcoat={0}
          emissive={hasError ? ERROR_COLOR : color}
          emissiveIntensity={hasError ? errorPulse : isActive ? 0.25 : 0.0}
        />
      </RoundedBox>
      <Edges threshold={15} color={isActive ? '#ffffff' : hasError ? ERROR_COLOR : EDGE_COLOR_STD} scale={1.001} renderOrder={1}>
        <lineBasicMaterial transparent opacity={isActive ? 0.9 : hasError ? 0.6 : 0.4} />
      </Edges>
    </>
  );
};

/* ─── Leaf Node Block ─── */
const NodeBlock: React.FC<{
  node: LayoutNode;
  highlighted: boolean;
  onHover: (lineno: number | null) => void;
  onClickNode: (nodeId: string) => void;
  onOpenLayerInsight: (node: LayoutNode) => void;
}> = ({ node, highlighted, onHover, onClickNode, onOpenLayerInsight }) => {
  const hovered = useHoverHold(false);
  const meta = useMemo(() => getVisualMeta(node.op_type), [node.op_type]);
  const w = node.width * meta.widthMul;
  const h = node.height * meta.heightMul;
  const d = node.depth * meta.depthMul;

  const hasError = !!node.error;
  const baseColor = hasError ? ERROR_COLOR : meta.color;
  const isActive = hovered.value || highlighted;
  const errorPulse = useErrorPulse(hasError);
  const displayLabel = meta.labelOverride ?? node.op_type;

  return (
    <group position={[node.x, node.y, node.z]}>
      <group
        onClick={(e: any) => {
          e.stopPropagation();
          onClickNode(node.id);
          onOpenLayerInsight(node);
        }}
        onPointerOver={(e: any) => {
          e.stopPropagation();
          hovered.show(true);
          onHover(node.lineno ?? null);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          hovered.hide();
          onHover(null);
          document.body.style.cursor = '';
        }}
      >
        <KindShape kind={meta.kind} w={w} h={h} d={d} color={baseColor} cornerRadius={meta.cornerRadius} isActive={isActive} hasError={hasError} errorPulse={errorPulse} />
      </group>

      {/* Error floating label */}
      {hasError && (
        <Billboard position={[0, h / 2 + 1.2, 0]} renderOrder={100}>
          <Text {...textBaseProps} fontSize={0.4} color="#fecaca" anchorY="middle" maxWidth={3.5}>
            {node.error}
          </Text>
        </Billboard>
      )}

      {/* Hover tooltip */}
      {hovered.value && !hasError && (
        <HoverPanelHtml
          position={[w / 2 + 0.35, h / 2 + 0.6, 0]}
          node={node}
          onOpenLayerInsight={onOpenLayerInsight}
          onPointerEnter={hovered.hold}
          onPointerLeave={hovered.release}
        />
      )}

      {/* Static label (when not hovered) */}
      {!hovered.value && !hasError && (
        <NodeCaption
          label={displayLabel}
          position={[0, -h / 2 - 0.9, d / 2 + 0.15]}
        />
      )}

    </group>
  );
};

/* ─── Container Block ─── */
const ContainerBlock: React.FC<{
  node: LayoutNode;
  isRoot?: boolean;
  highlightNodeId: string | null;
  skipLeaves?: boolean;
  onToggle: (id: string) => void;
  onHover: (lineno: number | null) => void;
  onClickNode: (nodeId: string) => void;
  onOpenLayerInsight: (node: LayoutNode) => void;
}> = ({ node, isRoot, highlightNodeId, skipLeaves, onToggle, onHover, onClickNode, onOpenLayerInsight }) => {
  const language = useStore((s) => s.language);
  const t = getStrings(language);
  const hovered = useHoverHold(false);
  const args = useMemo(
    () => [node.width, node.height, node.depth] as [number, number, number],
    [node.width, node.height, node.depth],
  );
  const hasError = !!node.has_error;
  const borderColor = hasError ? ERROR_COLOR : node.color;
  const opacity = node.opacity ?? 0.15;
  const isOpaque = opacity >= 0.99;
  const isActive = hovered.value || node.id === highlightNodeId;

  // Root container: skip visual chrome when expanded; when collapsed show the block
  if (isRoot && !node.collapsed) {
    return (
      <group>
        {node.children?.map((child) => (
          <SceneNode
            key={child.id}
            node={child}
            highlightNodeId={highlightNodeId}
            skipLeaves={skipLeaves}
            onToggle={onToggle}
            onHover={onHover}
            onClickNode={onClickNode}
            onOpenLayerInsight={onOpenLayerInsight}
          />
        ))}
      </group>
    );
  }

  // ── Collapsed state ──
  // Block click = select. Hover-only expand button (DOM) = toggle.
  if (node.collapsed) {
    return (
      <group position={[node.x, node.y, node.z]}>
        <RoundedBox
          args={args}
          radius={0.03}
          smoothness={2}
          onClick={(e: any) => {
            e.stopPropagation();
            onClickNode(node.id);
            onOpenLayerInsight(node);
          }}
          onPointerOver={(e: any) => {
            e.stopPropagation();
            hovered.show(true);
            onHover(node.lineno ?? null);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            hovered.hide();
            onHover(null);
            document.body.style.cursor = '';
          }}
        >
          <meshPhysicalMaterial
            color={borderColor}
            metalness={0.05}
            roughness={0.5}
            emissive={borderColor}
            emissiveIntensity={isActive ? 0.2 : 0.05}
          />
        </RoundedBox>

        <Edges threshold={15} color={isOpaque ? EDGE_EDGES_OPAQUE : EDGE_EDGES_GLASS} scale={1.001} renderOrder={1}>
          <lineBasicMaterial transparent opacity={isOpaque ? 0.6 : 0.4} />
        </Edges>

        {/* Label — below block, same as leaf blocks */}
        <NodeCaption
          label={node.op_type}
          params={node.params}
          position={[0, -node.height / 2 - 0.9, node.depth / 2 + 0.15]}
          scaleOnHover={isActive}
          outlineColor={borderColor}
          fontSize={0.65}
          color="#ffffff"
          outlineWidth={0.02}
          paramFontSize={0.45}
          paramOffsetY={-0.4}
        />

        {/* Expand button — DOM Overlay */}
        <ExpandCollapseButton
          position={getExpandCollapseButtonPosition(node)}
          icon="+"
          title={t.inspector.expand}
          nodeLabel={node.op_type}
          expanded={false}
          onToggle={() => onToggle(node.id)}
        />

        {hovered.value && (
          <HoverPanelHtml
            position={[node.width / 2 + 0.35, node.height / 2 + 0.6, 0]}
            node={node}
            onOpenLayerInsight={onOpenLayerInsight}
            onPointerEnter={hovered.hold}
            onPointerLeave={hovered.release}
          />
        )}
      </group>
    );
  }

  // ── Expanded container ──
  // Main volume is NOT clickable so children are accessible.
  // A thin header-bar at the top is the collapse trigger.
  const headerArgs: [number, number, number] = [
    node.width,
    HEADER_BAR_HEIGHT,
    node.depth,
  ];

  return (
    <group>
      {/* Boundary box (visual only — no raycast) */}
      <group position={[node.x, node.y, node.z]}>
        <RoundedBox args={args} radius={0.03} smoothness={2} raycast={() => { }}>
          <meshPhysicalMaterial
            color={borderColor}
            transparent
            transmission={0}
            opacity={opacity}
            metalness={0.8}
            roughness={0.1}
            depthWrite={false}
          />
        </RoundedBox>

        <Edges threshold={15} color={EDGE_EDGES_GLASS} scale={1.002} renderOrder={1}>
          <lineBasicMaterial transparent opacity={0.4} />
        </Edges>

        {/* Label — below container, identical to collapsed state to prevent jumping */}
        <NodeCaption
          label={node.op_type}
          params={node.params}
          position={[0, -node.height / 2 - 0.9, node.depth / 2 + 0.15]}
          scaleOnHover={hovered.value}
          outlineColor={borderColor}
          fontSize={0.65}
          color="#ffffff"
          outlineWidth={0.02}
          paramFontSize={0.45}
          paramOffsetY={-0.4}
        />

        {/* Collapse button — DOM Overlay */}
        <ExpandCollapseButton
          position={getExpandCollapseButtonPosition(node)}
          icon="−"
          title={t.inspector.collapse}
          nodeLabel={node.op_type}
          expanded
          onToggle={() => onToggle(node.id)}
        />

        {/* Header hit area — click = select container. Hover tooltip stays with child blocks. */}
        <mesh
          position={[0, node.height / 2 - HEADER_BAR_HEIGHT / 2, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onClickNode(node.id);
            onOpenLayerInsight(node);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = '';
          }}
        >
          <boxGeometry args={headerArgs} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>

      {/* Render children recursively */}
      {node.children?.map((child) => (
        <SceneNode
          key={child.id}
          node={child}
          highlightNodeId={highlightNodeId}
          skipLeaves={skipLeaves}
          onToggle={onToggle}
          onHover={onHover}
          onClickNode={onClickNode}
          onOpenLayerInsight={onOpenLayerInsight}
        />
      ))}

    </group>
  );
};

/* ─── Scene with instanced leaf batching ─── */
const SceneWithInstancing: React.FC<{
  layout: LayoutData;
  highlightNodeId: string | null;
  visibleNodeIds?: Set<string>;
  onToggle: (id: string) => void;
  onHover: (lineno: number | null) => void;
  onClickNode: (nodeId: string) => void;
  onOpenLayerInsight: (node: LayoutNode) => void;
}> = ({ layout, highlightNodeId, visibleNodeIds, onToggle, onHover, onClickNode, onOpenLayerInsight }) => {
  const { batches, singles, visibleContainers } = useMemo(() => {
    if (visibleNodeIds) {
      const visibleStopNodes = collectDemoStopNodes(layout.nodes)
        .filter((node) => visibleNodeIds.has(node.id));
      const leaves = visibleStopNodes.filter((node) => !node.is_container);
      const grouped = groupLeavesByIdentity(leaves);
      return {
        ...grouped,
        visibleContainers: visibleStopNodes.filter((node) => node.is_container),
      };
    }

    return {
      ...groupLeavesByIdentity(flattenLeaves(layout.nodes)),
      visibleContainers: [],
    };
  }, [layout, visibleNodeIds]);

  return (
    <group>
      {!visibleNodeIds && layout.nodes.map((n) => {
        const isRoot = !n.parentId && n.is_container && layout.nodes.length === 1;
        return (
          <SceneNode
            key={n.id}
            node={n}
            isRoot={isRoot}
            highlightNodeId={highlightNodeId}
            skipLeaves={true}
            onToggle={onToggle}
            onHover={onHover}
            onClickNode={onClickNode}
            onOpenLayerInsight={onOpenLayerInsight}
          />
        );
      })}
      {visibleNodeIds && visibleContainers.map((node) => (
        <SceneNode
          key={node.id}
          node={node}
          highlightNodeId={highlightNodeId}
          onToggle={onToggle}
          onHover={onHover}
          onClickNode={onClickNode}
          onOpenLayerInsight={onOpenLayerInsight}
        />
      ))}
      {batches.map((nodes, index) => (
        <InstancedLeafGroup
          key={nodes[0]?.id ? `inst-${nodes[0].id}` : `inst-fallback-${index}`}
          nodes={nodes}
          highlightNodeId={highlightNodeId}
          onHover={onHover}
          onClickNode={onClickNode}
          onOpenLayerInsight={onOpenLayerInsight}
        />
      ))}
      {singles.map((node) => (
        <NodeBlock
          key={node.id}
          node={node}
          highlighted={node.id === highlightNodeId}
          onHover={onHover}
          onClickNode={onClickNode}
          onOpenLayerInsight={onOpenLayerInsight}
        />
      ))}
    </group>
  );
};

/* ─── Recursive scene node dispatcher ─── */
const SceneNode: React.FC<{
  node: LayoutNode;
  isRoot?: boolean;
  highlightNodeId: string | null;
  skipLeaves?: boolean;
  onToggle: (id: string) => void;
  onHover: (lineno: number | null) => void;
  onClickNode: (nodeId: string) => void;
  onOpenLayerInsight: (node: LayoutNode) => void;
}> = ({ node, isRoot, highlightNodeId, skipLeaves, onToggle, onHover, onClickNode, onOpenLayerInsight }) => {
  if (node.is_container) {
    return (
      <ContainerBlock
        node={node}
        isRoot={isRoot}
        highlightNodeId={highlightNodeId}
        skipLeaves={skipLeaves}
        onToggle={onToggle}
        onHover={onHover}
        onClickNode={onClickNode}
        onOpenLayerInsight={onOpenLayerInsight}
      />
    );
  }
  if (skipLeaves) return null;
  return (
    <NodeBlock
      node={node}
      highlighted={node.id === highlightNodeId}
      onHover={onHover}
      onClickNode={onClickNode}
      onOpenLayerInsight={onOpenLayerInsight}
    />
  );
};

/* ─── Edge Line: Bezier for standard edges, polyline for residual/skip ─── */
const EdgeLine: React.FC<{ edge: LayoutEdge }> = ({ edge }) => {
  const { points, kind } = edge;
  const color = kind === 'residual' ? EDGE_COLOR_RESIDUAL : EDGE_COLOR_STD;

  if (points.length === 4) {
    const start = new THREE.Vector3(points[0].x, points[0].y, points[0].z);
    const c1 = new THREE.Vector3(points[1].x, points[1].y, points[1].z);
    const c2 = new THREE.Vector3(points[2].x, points[2].y, points[2].z);
    const end = new THREE.Vector3(points[3].x, points[3].y, points[3].z);
    return (
      <CubicBezierLine
        start={start}
        midA={c1}
        midB={c2}
        end={end}
        color={color}
        lineWidth={2}
      />
    );
  }

  if (points.length >= 5) {
    const linePoints = points.map((p) => [p.x, p.y, p.z] as [number, number, number]);
    return (
      <Line
        points={linePoints}
        color={color}
        lineWidth={kind === 'residual' ? 1 : 2}
        dashed={kind === 'residual'}
        dashScale={2}
      />
    );
  }

  return null;
};

function collectLayoutNodes(nodes: LayoutNode[], out: LayoutNode[] = []): LayoutNode[] {
  for (const node of nodes) {
    out.push(node);
    if (node.children?.length) collectLayoutNodes(node.children, out);
  }
  return out;
}

function getLayoutView(layout: LayoutData, viewport: { width: number; height: number }) {
  const nodes = collectLayoutNodes(layout.nodes);
  if (!nodes.length) {
    return { target: new THREE.Vector3(), zoom: DEFAULT_CAMERA_ZOOM };
  }

  const box = new THREE.Box3();
  for (const node of nodes) {
    box.expandByPoint(new THREE.Vector3(node.x - node.width / 2, node.y - node.height / 2, node.z - node.depth / 2));
    box.expandByPoint(new THREE.Vector3(node.x + node.width / 2, node.y + node.height / 2, node.z + node.depth / 2));
  }

  const size = box.getSize(new THREE.Vector3());
  const projectedWidth = Math.max(size.x + size.z * 0.7, 1);
  const projectedHeight = Math.max(size.y + size.z * 0.45, 1);
  const zoom = Math.max(
    DEFAULT_MIN_ZOOM,
    Math.min(
      DEFAULT_CAMERA_ZOOM,
      viewport.width / (projectedWidth * DEFAULT_VIEW_PADDING),
      viewport.height / (projectedHeight * DEFAULT_VIEW_PADDING),
    ),
  );

  return { target: box.getCenter(new THREE.Vector3()), zoom };
}

type CameraControls = {
  target?: THREE.Vector3;
  update?: () => void;
};

function applyDefaultView(
  camera: THREE.Camera,
  controls: CameraControls | undefined,
  layout: LayoutData,
  viewport: { width: number; height: number },
) {
  const { target, zoom } = getLayoutView(layout, viewport);
  camera.position.copy(target).add(DEFAULT_CAMERA_OFFSET);
  if (camera instanceof THREE.OrthographicCamera || camera instanceof THREE.PerspectiveCamera) {
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
  }
  controls?.target?.copy(target);
  controls?.update?.();
}

/* ─── Set an overview camera when layout changes ─── */
const BoundsAutoFit: React.FC<{ layout: LayoutData; layoutKey: string; onFit: (layoutKey: string) => void }> = ({ layout, layoutKey, onFit }) => {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls) as CameraControls | undefined;
  const size = useThree((state) => state.size);
  const prevKey = useRef('');
  useEffect(() => {
    const viewKey = `${layoutKey}:${controls ? 'ready' : 'pending'}`;
    if (!layoutKey || !controls || viewKey === prevKey.current) return;
    prevKey.current = viewKey;
    applyDefaultView(camera, controls, layout, size);
    onFit(layoutKey);
  }, [layout, layoutKey, camera, controls, size, onFit]);
  return null;
};

const ViewResetEffect: React.FC<{ layout: LayoutData; resetViewToken: number }> = ({ layout, resetViewToken }) => {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls) as CameraControls | undefined;
  const size = useThree((state) => state.size);
  const prevToken = useRef(resetViewToken);

  useEffect(() => {
    if (!controls || resetViewToken === prevToken.current) return;
    prevToken.current = resetViewToken;
    applyDefaultView(camera, controls, layout, size);
  }, [layout, resetViewToken, camera, controls, size]);

  return null;
};

/* ─── Reset view button (lives inside Canvas to access camera controls) ─── */
const RecenterButton: React.FC<{ layout: LayoutData }> = ({ layout }) => {
  const language = useStore((s) => s.language);
  const t = getStrings(language);
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls) as CameraControls | undefined;
  const size = useThree((state) => state.size);

  const resetView = () => {
    applyDefaultView(camera, controls, layout, size);
  };

  return (
    <Html
      position={[0, 0, 0]}
      style={{ pointerEvents: 'auto' }}
      zIndexRange={[50, 0]}
      calculatePosition={(_, __, { width }) => [width - 48, 16]}
    >
      <div
        data-tour="reset-view"
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/15 bg-black/10"
      >
        <button
          className="w-8 h-8 flex items-center justify-center bg-zinc-900/55 hover:bg-zinc-800/75 border border-zinc-600/60 text-zinc-300 rounded-md shadow-md backdrop-blur-sm transition-all hover:text-white select-none"
          onClick={resetView}
          title={t.inspector.resetCameraView}
          aria-label={t.inspector.resetCameraView}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <path d="M3 12a9 9 0 0 1 15.3-6.4" />
            <path d="M18 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-15.3 6.4" />
            <path d="M6 21v-5h5" />
          </svg>
        </button>
      </div>
    </Html>
  );
};

/* ─── Main Canvas Component ─── */
const Canvas3D: React.FC<Canvas3DProps> = ({
  layout,
  loading,
  error = null,
  highlightNodeId = null,
  onToggleCollapse,
  onHoverNode,
  onClickNode,
  onOpenLayerInsight,
  resetViewToken = 0,
  resetViewDisabled = false,
  demoModeEnabled = false,
}) => {
  const language = useStore((s) => s.language);
  const t = getStrings(language);
  const handleToggle = useCallback(
    (id: string) => onToggleCollapse?.(id),
    [onToggleCollapse],
  );
  const handleHover = useCallback(
    (lineno: number | null) => onHoverNode?.(lineno),
    [onHoverNode],
  );
  const handleClick = useCallback(
    (nodeId: string) => onClickNode?.(nodeId),
    [onClickNode],
  );
  const handleOpenLayerInsight = useCallback(
    (node: LayoutNode) => onOpenLayerInsight?.(node),
    [onOpenLayerInsight],
  );
  const [fittedLayoutKey, setFittedLayoutKey] = useState('');
  const [demoProgress, setDemoProgress] = useState(0);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const [demoAnimationSpeed, setDemoAnimationSpeed] = useState(DEMO_PLAY_SPEED);
  const demoProgressRef = useRef(0);
  const demoLastSyncRef = useRef(0);
  const mnist = useMnistTexture();

  // Stable key that changes when the graph structure changes
  const layoutKey = useMemo(() => {
    if (!layout) return '';
    const nodeKey = collectLayoutNodes(layout.nodes)
      .map((n) => [
        n.id,
        n.collapsed,
        n.x,
        n.y,
        n.z,
        n.width,
        n.height,
        n.depth,
      ].join(':'))
      .join(',');
    const edgeKey = layout.edges
      .map((e) => `${e.from}:${e.to}:${e.kind ?? ''}`)
      .join(',');
    return `${nodeKey}|${edgeKey}`;
  }, [layout]);
  const viewReady = !!layout && fittedLayoutKey === layoutKey;
  const showLoadingOverlay = loading || (!!layout && !viewReady);
  const demoStops = useMemo(() => (layout ? collectDemoStops(layout) : []), [layoutKey, layout]);
  const maxDemoProgress = demoStops.length;
  const demoCompatible = useMemo(() => isMnistDemoCompatible(demoStops), [demoStops]);
  const useOperationBlocks = demoModeEnabled && !loading && demoCompatible && maxDemoProgress > 0;
  const demoSegmentState = useMemo(() => getSegmentState(demoStops, demoProgress), [demoProgress, demoStops]);
  const activeDemoNodeId = useOperationBlocks ? demoSegmentState.activeStop?.node.id ?? null : null;
  const progressiveDemoNodeIds = useMemo(() => {
    if (!useOperationBlocks || demoSegmentState.activeStopIndex < 0) return new Set<string>();
    return new Set(demoStops.slice(0, demoSegmentState.activeStopIndex + 1).map((stop) => stop.node.id));
  }, [demoSegmentState.activeStopIndex, demoStops, useOperationBlocks]);
  const progressiveDemoEdges = useMemo(() => {
    if (!layout || !useOperationBlocks || progressiveDemoNodeIds.size < 2) return [];
    return layout.edges.filter((edge) => (
      progressiveDemoNodeIds.has(edge.from) && progressiveDemoNodeIds.has(edge.to)
    ));
  }, [layout, progressiveDemoNodeIds, useOperationBlocks]);
  const effectiveHighlightNodeId = activeDemoNodeId ?? highlightNodeId;

  const handleDemoProgressChange = useCallback((nextProgress: number) => {
    const clampedProgress = THREE.MathUtils.clamp(nextProgress, 0, maxDemoProgress);
    demoProgressRef.current = clampedProgress;
    demoLastSyncRef.current = performance.now();
    setDemoProgress(clampedProgress);
  }, [maxDemoProgress]);

  useEffect(() => {
    demoProgressRef.current = demoProgress;
  }, [demoProgress]);

  useEffect(() => {
    demoProgressRef.current = 0;
    demoLastSyncRef.current = 0;
    setDemoProgress(0);
    setDemoPlaying(false);
  }, [layoutKey]);

  useEffect(() => {
    if (!demoModeEnabled || loading) setDemoPlaying(false);
  }, [demoModeEnabled, loading]);

  useEffect(() => {
    if (!demoModeEnabled || !demoPlaying || maxDemoProgress <= 0) return;
    let frameId = 0;
    let prevTime = performance.now();
    demoLastSyncRef.current = 0;

    const tick = (time: number) => {
      const deltaMs = time - prevTime;
      prevTime = time;
      const nextProgress = getPlaybackProgress(
        demoProgressRef.current,
        deltaMs,
        demoAnimationSpeed,
        maxDemoProgress,
      );
      demoProgressRef.current = nextProgress;
      if (shouldSyncAnimationState(time, demoLastSyncRef.current) || nextProgress >= maxDemoProgress) {
        demoLastSyncRef.current = time;
        setDemoProgress(nextProgress);
      }
      if (nextProgress >= maxDemoProgress) {
        setDemoPlaying(false);
        return;
      }
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [demoAnimationSpeed, demoModeEnabled, demoPlaying, maxDemoProgress]);

  return (
    <div className="w-full h-full relative" style={{ background: 'var(--canvas-bg, radial-gradient(circle at center, #18181b 0%, #09090b 100%))' }}>
      {layout && viewReady && demoModeEnabled && !loading && demoCompatible && (
        <>
          <DemoControls
            stops={demoStops}
            progress={demoProgress}
            playing={demoPlaying}
            dataUrl={mnist?.dataUrl}
            animationSpeed={demoAnimationSpeed}
            t={t.canvas.demo}
            onProgressChange={handleDemoProgressChange}
            onPlayingChange={setDemoPlaying}
            onAnimationSpeedChange={setDemoAnimationSpeed}
          />
        </>
      )}

      {showLoadingOverlay && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-zinc-950/70 backdrop-blur-sm transition-all duration-300">
          <div className="flex flex-col items-center gap-5 p-8 bg-zinc-900/95 rounded-2xl border border-zinc-700/60 shadow-2xl">
            <div className="relative">
              <div className="w-11 h-11 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin" />
            </div>
            <span className="text-zinc-200 font-mono text-sm tracking-wider animate-pulse">
              {t.canvas.runningTorchScript}
            </span>
          </div>
        </div>
      )}

      {/* Compilation Failed overlay */}
      {!layout && !loading && error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none select-none">
          <div className="text-center p-10 max-w-md border border-red-700/50 bg-red-950/50 rounded-2xl backdrop-blur-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-red-900 to-red-950 rounded-2xl mx-auto flex items-center justify-center mb-5 border border-red-600/50 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-red-400">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-red-200 font-semibold text-base mb-3 tracking-wide">
              {t.canvas.compilationFailed}
            </h3>
            <p className="text-red-300/90 text-sm leading-relaxed font-mono break-words max-h-36 overflow-auto">
              {error.message || t.canvas.unknownError}
            </p>
            {error.hint && (
              <p className="text-zinc-500 text-xs mt-3">{error.hint}</p>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!layout && !loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none select-none">
          <div className="text-center p-10 max-w-md border border-zinc-700/50 bg-zinc-900/40 rounded-2xl backdrop-blur-sm">
            <div className="w-20 h-20 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl mx-auto flex items-center justify-center mb-5 border border-zinc-600/50 shadow-inner">
              <span className="text-4xl opacity-40 grayscale">🧊</span>
            </div>
            <h3 className="text-zinc-100 font-semibold text-base mb-3 tracking-wide">
              {t.canvas.readyToVisualize}
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-5">
              {t.canvas.emptyBefore}
              <span className="text-blue-400 font-bold ml-1">{t.header.visualize}</span>{t.canvas.emptyAfter}
            </p>
            <div className="flex items-center justify-center gap-5 text-xs text-zinc-500">
              <span className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-lg bg-zinc-800/90 border border-zinc-600/50 text-zinc-300 font-medium">{t.canvas.left}</span>
                {t.canvas.pan}
              </span>
              <span className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-lg bg-zinc-800/90 border border-zinc-600/50 text-zinc-300 font-medium">{t.canvas.right}</span>
                {t.canvas.rotate}
              </span>
              <span className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-lg bg-zinc-800/90 border border-zinc-600/50 text-zinc-300 font-medium">{t.help.scroll}</span>
                {t.canvas.zoom}
              </span>
            </div>
          </div>
        </div>
      )}

      <Canvas
        orthographic
        camera={{ zoom: DEFAULT_CAMERA_ZOOM, position: DEFAULT_CAMERA_OFFSET.toArray(), near: -1000, far: 2000 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        resize={{ scroll: false, debounce: 50 }}
      >
        <ambientLight intensity={0.85} color="#ffffff" />
        <directionalLight position={[30, 40, 30]} intensity={0.7} color="#ffffff" />
        <directionalLight position={[-20, 20, -30]} intensity={0.4} color="#e0e7ff" />

        <ContactShadows
          opacity={0.4}
          scale={40}
          blur={2}
          far={10}
          resolution={256}
          color="#000000"
        />

        {layout && (
          <>
            <BoundsAutoFit layout={layout} layoutKey={layoutKey} onFit={setFittedLayoutKey} />
            <ViewResetEffect layout={layout} resetViewToken={resetViewToken} />
            {viewReady && (
              <>
                {!resetViewDisabled && <RecenterButton layout={layout} />}
                <SceneWithInstancing
                  layout={layout}
                  highlightNodeId={effectiveHighlightNodeId}
                  visibleNodeIds={useOperationBlocks ? progressiveDemoNodeIds : undefined}
                  onToggle={handleToggle}
                  onHover={handleHover}
                  onClickNode={handleClick}
                  onOpenLayerInsight={handleOpenLayerInsight}
                />
                {useOperationBlocks && (
                  <group>
                    {progressiveDemoEdges.map((e, i) => (
                      <EdgeLine key={`${e.from}-${e.to}-${i}`} edge={e} />
                    ))}
                  </group>
                )}
                {mnist && useOperationBlocks && (
                  <DataFlowDemo
                    stops={demoStops}
                    edges={progressiveDemoEdges}
                    progress={demoProgress}
                    texture={mnist.texture}
                    t={t.canvas.demo}
                  />
                )}
                {!useOperationBlocks && (
                  <group>
                    {layout.edges.map((e, i) => (
                      <EdgeLine key={`${e.from}-${e.to}-${i}`} edge={e} />
                    ))}
                  </group>
                )}
                <gridHelper args={[400, 80, 0x3f3f46, 0x18181b]} position={[0, -5, 0]} />
              </>
            )}
          </>
        )}

        <OrbitControls
          makeDefault
          minZoom={DEFAULT_MIN_ZOOM}
          maxZoom={150}
          enableDamping
          dampingFactor={0.1}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={0}
          mouseButtons={{
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE,
          }}
        />
      </Canvas>
    </div>
  );
};

export default Canvas3D;
