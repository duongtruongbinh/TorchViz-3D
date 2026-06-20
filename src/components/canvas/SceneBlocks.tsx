import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { RoundedBox, Html, Text, Billboard, Edges } from '@react-three/drei';
import * as THREE from 'three';
import { LayoutNode, LayoutData } from '../../lib/irTypes';
import { useStore } from '../../store/useStore';
import { getStrings } from '../../lib/localization';
import { getVisualMeta, getVisualKind, getActivationSubKind, type VisualKind } from '../../lib/visualKind';
import { shouldRenderLeafCaption, type LabelMode } from '../../lib/labelMode';
import { collectDemoStopNodes } from '../mnist-demo/demoStops';
import { useHoverHold, HoverPanelHtml } from './HoverPanels';
import {
  ERROR_COLOR,
  EDGE_COLOR_STD,
  EDGE_EDGES_OPAQUE,
  EDGE_EDGES_GLASS,
  TEXT_BASE_PROPS,
  RENDER_ORDER_CAPTION_BILLBOARD,
  RENDER_ORDER_CAPTION_TEXT,
  RENDER_ORDER_ERROR_LABEL,
  Z_INDEX_EXPAND_COLLAPSE_BUTTON,
} from '../../lib/constants';

const HEADER_BAR_HEIGHT = 0.6;
const INSTANCED_BATCH_MIN = 3;

const getExpandCollapseButtonPosition = (node: LayoutNode): [number, number, number] => [
  node.width / 2,
  node.height / 2,
  -node.depth / 2,
];

export const ExpandCollapseButton: React.FC<{
  position: [number, number, number];
  icon: string;
  title: string;
  nodeLabel: string;
  expanded: boolean;
  onToggle: () => void;
}> = React.memo(({ position, icon, title, nodeLabel, expanded, onToggle }) => {
  const [hovered, setHovered] = useState(false);
  const ariaLabel = `${title}: ${nodeLabel}`;

  useEffect(() => () => {
    document.body.style.cursor = '';
  }, []);

  return (
    <group position={position}>
      <Html center zIndexRange={[Z_INDEX_EXPAND_COLLAPSE_BUTTON, 0]}>
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
});

export const NodeCaption: React.FC<{
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
}> = React.memo(({
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
    <Billboard position={position} renderOrder={RENDER_ORDER_CAPTION_BILLBOARD}>
      <group scale={scaleOnHover ? 1 : 0.95}>
        <Text
          {...TEXT_BASE_PROPS}
          fontSize={fontSize}
          color={color}
          outlineColor={outlineColor ?? TEXT_BASE_PROPS.outlineColor}
          outlineWidth={outlineWidth}
          renderOrder={RENDER_ORDER_CAPTION_TEXT}
        >
          {label}
        </Text>
        {!!params && params > 0 && (
          <Text
            {...TEXT_BASE_PROPS}
            fontSize={paramFontSize}
            color="#9ca3af"
            position={[0, paramOffsetY, 0]}
            anchorY="top"
            renderOrder={RENDER_ORDER_CAPTION_TEXT}
          >
            {params.toLocaleString()} {t.inspector.params}
          </Text>
        )}
      </group>
    </Billboard>
  );
});

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
    if (meta.specialGeometry) {
      const arr = map.get(`__special_${n.id}`) ?? [];
      arr.push(n);
      map.set(`__special_${n.id}`, arr);
      continue;
    }
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

export const InstancedLeafGroup: React.FC<{
  nodes: LayoutNode[];
  selectedNodeId: string | null;
  activeNodeId: string | null;
  labelMode: LabelMode;
  leafCount: number;
  onHover: (lineno: number | null) => void;
  onClickNode: (nodeId: string) => void;
  onOpenLayerInsight: (node: LayoutNode) => void;
}> = React.memo(({ nodes, selectedNodeId, activeNodeId, labelMode, leafCount, onHover, onClickNode, onOpenLayerInsight }) => {
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
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      pos.set(node.x, node.y, node.z);
      matrix.compose(pos, quaternion, scale);
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
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          const i = e.instanceId ?? 0;
          const node = nodes[i];
          if (!node) return;
          onClickNode(node.id);
          onOpenLayerInsight(node);
        }}
        onPointerOver={(e: ThreeEvent<MouseEvent>) => {
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
      {nodes.map((nd, index) => {
        const shouldRenderCaption = shouldRenderLeafCaption({
          labelMode,
          leafCount,
          nodeId: nd.id,
          hoveredNodeId: hovered.value === index ? nd.id : null,
          selectedNodeId,
          activeNodeId,
        });
        if (!shouldRenderCaption) return null;
        return (
          <NodeCaption
            key={nd.id}
            label={meta.labelOverride ?? nd.op_type}
            position={[
              nd.x,
              nd.y - (nd.height * meta.heightMul) / 2 - 0.9,
              nd.z + (nd.depth * meta.depthMul) / 2 + 0.15,
            ]}
          />
        );
      })}
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
});

function useErrorPulse(hasError: boolean): number {
  const ref = useRef(0);
  useFrame((_, delta) => {
    if (hasError) ref.current += delta * 3;
  });
  if (!hasError) return 0;
  return 0.5 + Math.sin(ref.current) * 0.4;
}

const ActivationBlock: React.FC<{ w: number; h: number; d: number; color: string; isActive: boolean; hasError: boolean; errorPulse: number }> = React.memo(({ w, h, d, color, isActive, hasError, errorPulse }) => (
  <group>
    <RoundedBox args={[w, h, d]} radius={0.01} smoothness={2}>
      <meshPhysicalMaterial color={color} metalness={0.1} roughness={0.2} emissive={hasError ? ERROR_COLOR : color} emissiveIntensity={hasError ? errorPulse : isActive ? 0.4 : 0.15} transmission={0.2} thickness={0.5} />
    </RoundedBox>
    <Edges threshold={15} color={isActive ? '#ffffff' : hasError ? ERROR_COLOR : EDGE_COLOR_STD} scale={1.001} renderOrder={1}>
      <lineBasicMaterial transparent opacity={isActive ? 0.9 : 0.4} />
    </Edges>
  </group>
));

const DiamondBlock: React.FC<{ w: number; h: number; d: number; color: string; isActive: boolean; hasError: boolean; errorPulse: number }> = React.memo(({ w, h, d, color, isActive, hasError, errorPulse }) => {
  const plusSize = Math.min(h, d) * 0.2;
  return (
    <group>
      <RoundedBox args={[w, h, d]} radius={0.02} smoothness={2}>
        <meshPhysicalMaterial color={color} metalness={0.05} roughness={0.5} emissive={hasError ? ERROR_COLOR : color} emissiveIntensity={hasError ? errorPulse : isActive ? 0.25 : 0} />
      </RoundedBox>
      <Edges threshold={15} color={isActive ? '#ffffff' : hasError ? ERROR_COLOR : EDGE_COLOR_STD} scale={1.001} renderOrder={1}>
        <lineBasicMaterial transparent opacity={isActive ? 0.9 : 0.4} />
      </Edges>
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
});

const AttentionBlock: React.FC<{ w: number; h: number; d: number; color: string; isActive: boolean; hasError: boolean; errorPulse: number }> = React.memo(({ w, h, d, color, isActive, hasError, errorPulse }) => {
  const stripeCount = 3;
  const stripeW = d / (stripeCount * 2 + 1);
  return (
    <group>
      <RoundedBox args={[w, h, d]} radius={0.02} smoothness={2}>
        <meshPhysicalMaterial color={color} metalness={0.05} roughness={0.5} emissive={hasError ? ERROR_COLOR : color} emissiveIntensity={hasError ? errorPulse : isActive ? 0.25 : 0} />
      </RoundedBox>
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
});

const UpsampleBlock: React.FC<{ w: number; h: number; d: number; color: string; isActive: boolean; hasError: boolean; errorPulse: number }> = React.memo(({ w, h, d, color, isActive, hasError, errorPulse }) => {
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
});

const TransformBlock: React.FC<{ w: number; h: number; d: number; color: string; isActive: boolean; hasError: boolean; errorPulse: number }> = React.memo(({ w, h, d, color, isActive, hasError, errorPulse }) => (
  <group>
    <RoundedBox args={[w, h, d]} radius={0.005} smoothness={1}>
      <meshPhysicalMaterial color={color} metalness={0.05} roughness={0.5} emissive={hasError ? ERROR_COLOR : color} emissiveIntensity={hasError ? errorPulse : isActive ? 0.25 : 0} />
    </RoundedBox>
    <Edges threshold={15} color={isActive ? '#ffffff' : hasError ? ERROR_COLOR : EDGE_COLOR_STD} scale={1.001} renderOrder={1}>
      <lineBasicMaterial transparent opacity={isActive ? 0.9 : 0.4} />
    </Edges>
  </group>
));

export const KindShape: React.FC<{
  kind: VisualKind; w: number; h: number; d: number; color: string;
  cornerRadius: number; isActive: boolean; hasError: boolean; errorPulse: number;
}> = React.memo(({ kind, w, h, d, color, cornerRadius, isActive, hasError, errorPulse }) => {
  const activationSub = getActivationSubKind(kind);
  if (activationSub !== null) return <ActivationBlock w={w} h={h} d={d} color={color} isActive={isActive} hasError={hasError} errorPulse={errorPulse} />;
  if (kind === 'AddConcat') return <DiamondBlock w={w} h={h} d={d} color={color} isActive={isActive} hasError={hasError} errorPulse={errorPulse} />;
  if (kind === 'Attention') return <AttentionBlock w={w} h={h} d={d} color={color} isActive={isActive} hasError={hasError} errorPulse={errorPulse} />;
  if (kind === 'Upsample') return <UpsampleBlock w={w} h={h} d={d} color={color} isActive={isActive} hasError={hasError} errorPulse={errorPulse} />;
  if (kind === 'Flatten' || kind === 'Reshape' || kind === 'Permute' || kind === 'Slice') return <TransformBlock w={w} h={h} d={d} color={color} isActive={isActive} hasError={hasError} errorPulse={errorPulse} />;

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
});

export const NodeBlock: React.FC<{
  node: LayoutNode;
  highlighted: boolean;
  selectedNodeId: string | null;
  activeNodeId: string | null;
  labelMode: LabelMode;
  leafCount: number;
  onHover: (lineno: number | null) => void;
  onClickNode: (nodeId: string) => void;
  onOpenLayerInsight: (node: LayoutNode) => void;
}> = React.memo(({ node, highlighted, selectedNodeId, activeNodeId, labelMode, leafCount, onHover, onClickNode, onOpenLayerInsight }) => {
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
  const shouldRenderCaption = shouldRenderLeafCaption({
    labelMode,
    leafCount,
    nodeId: node.id,
    hoveredNodeId: hovered.value ? node.id : null,
    selectedNodeId,
    activeNodeId,
  });

  return (
    <group position={[node.x, node.y, node.z]}>
      <group
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onClickNode(node.id);
          onOpenLayerInsight(node);
        }}
        onPointerOver={(e: ThreeEvent<MouseEvent>) => {
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

      {hasError && (
        <Billboard position={[0, h / 2 + 1.2, 0]} renderOrder={RENDER_ORDER_ERROR_LABEL}>
          <Text {...TEXT_BASE_PROPS} fontSize={0.4} color="#fecaca" anchorY="middle" maxWidth={3.5}>
            {node.error}
          </Text>
        </Billboard>
      )}

      {hovered.value && !hasError && (
        <HoverPanelHtml
          position={[w / 2 + 0.35, h / 2 + 0.6, 0]}
          node={node}
          onOpenLayerInsight={onOpenLayerInsight}
          onPointerEnter={hovered.hold}
          onPointerLeave={hovered.release}
        />
      )}

      {shouldRenderCaption && !hasError && (
        <NodeCaption
          label={displayLabel}
          position={[0, -h / 2 - 0.9, d / 2 + 0.15]}
        />
      )}
    </group>
  );
});

export const ContainerBlock: React.FC<{
  node: LayoutNode;
  isRoot?: boolean;
  highlightNodeId: string | null;
  selectedNodeId: string | null;
  activeNodeId: string | null;
  labelMode: LabelMode;
  leafCount: number;
  skipLeaves?: boolean;
  onToggle: (id: string) => void;
  onHover: (lineno: number | null) => void;
  onClickNode: (nodeId: string) => void;
  onOpenLayerInsight: (node: LayoutNode) => void;
}> = React.memo(({ node, isRoot, highlightNodeId, selectedNodeId, activeNodeId, labelMode, leafCount, skipLeaves, onToggle, onHover, onClickNode, onOpenLayerInsight }) => {
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

  if (isRoot && !node.collapsed) {
    return (
      <group>
        {node.children?.map((child) => (
          <SceneNode
            key={child.id}
            node={child}
            highlightNodeId={highlightNodeId}
            selectedNodeId={selectedNodeId}
            activeNodeId={activeNodeId}
            labelMode={labelMode}
            leafCount={leafCount}
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

  if (node.collapsed) {
    return (
      <group position={[node.x, node.y, node.z]}>
        <RoundedBox
          args={args}
          radius={0.03}
          smoothness={2}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            onClickNode(node.id);
            onOpenLayerInsight(node);
          }}
          onPointerOver={(e: ThreeEvent<MouseEvent>) => {
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

  const headerArgs: [number, number, number] = [
    node.width,
    HEADER_BAR_HEIGHT,
    node.depth,
  ];

  return (
    <group>
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

        <ExpandCollapseButton
          position={getExpandCollapseButtonPosition(node)}
          icon="−"
          title={t.inspector.collapse}
          nodeLabel={node.op_type}
          expanded
          onToggle={() => onToggle(node.id)}
        />

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

      {node.children?.map((child) => (
        <SceneNode
          key={child.id}
          node={child}
          highlightNodeId={highlightNodeId}
          selectedNodeId={selectedNodeId}
          activeNodeId={activeNodeId}
          labelMode={labelMode}
          leafCount={leafCount}
          skipLeaves={skipLeaves}
          onToggle={onToggle}
          onHover={onHover}
          onClickNode={onClickNode}
          onOpenLayerInsight={onOpenLayerInsight}
        />
      ))}
    </group>
  );
});

export const SceneNode: React.FC<{
  node: LayoutNode;
  isRoot?: boolean;
  highlightNodeId: string | null;
  selectedNodeId: string | null;
  activeNodeId: string | null;
  labelMode: LabelMode;
  leafCount: number;
  skipLeaves?: boolean;
  onToggle: (id: string) => void;
  onHover: (lineno: number | null) => void;
  onClickNode: (nodeId: string) => void;
  onOpenLayerInsight: (node: LayoutNode) => void;
}> = React.memo(({ node, isRoot, highlightNodeId, selectedNodeId, activeNodeId, labelMode, leafCount, skipLeaves, onToggle, onHover, onClickNode, onOpenLayerInsight }) => {
  if (node.is_container) {
    return (
      <ContainerBlock
        node={node}
        isRoot={isRoot}
        highlightNodeId={highlightNodeId}
        selectedNodeId={selectedNodeId}
        activeNodeId={activeNodeId}
        labelMode={labelMode}
        leafCount={leafCount}
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
      selectedNodeId={selectedNodeId}
      activeNodeId={activeNodeId}
      labelMode={labelMode}
      leafCount={leafCount}
      onHover={onHover}
      onClickNode={onClickNode}
      onOpenLayerInsight={onOpenLayerInsight}
    />
  );
});

export const SceneWithInstancing: React.FC<{
  layout: LayoutData;
  highlightNodeId: string | null;
  selectedNodeId?: string | null;
  activeNodeId?: string | null;
  labelMode?: LabelMode;
  visibleNodeIds?: Set<string>;
  onToggle: (id: string) => void;
  onHover: (lineno: number | null) => void;
  onClickNode: (nodeId: string) => void;
  onOpenLayerInsight: (node: LayoutNode) => void;
}> = React.memo(({ layout, highlightNodeId, selectedNodeId = null, activeNodeId = null, labelMode = 'auto', visibleNodeIds, onToggle, onHover, onClickNode, onOpenLayerInsight }) => {
  const { batches, singles, visibleContainers, leafCount } = useMemo(() => {
    if (visibleNodeIds) {
      const visibleStopNodes = collectDemoStopNodes(layout.nodes)
        .filter((node) => visibleNodeIds.has(node.id));
      const leaves = visibleStopNodes.filter((node) => !node.is_container);
      const grouped = groupLeavesByIdentity(leaves);
      return {
        ...grouped,
        leafCount: leaves.length,
        visibleContainers: visibleStopNodes.filter((node) => node.is_container),
      };
    }

    const leaves = flattenLeaves(layout.nodes);
    return {
      ...groupLeavesByIdentity(leaves),
      leafCount: leaves.length,
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
            selectedNodeId={selectedNodeId}
            activeNodeId={activeNodeId}
            labelMode={labelMode}
            leafCount={leafCount}
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
          selectedNodeId={selectedNodeId}
          activeNodeId={activeNodeId}
          labelMode={labelMode}
          leafCount={leafCount}
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
          selectedNodeId={selectedNodeId}
          activeNodeId={activeNodeId}
          labelMode={labelMode}
          leafCount={leafCount}
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
          selectedNodeId={selectedNodeId}
          activeNodeId={activeNodeId}
          labelMode={labelMode}
          leafCount={leafCount}
          onHover={onHover}
          onClickNode={onClickNode}
          onOpenLayerInsight={onOpenLayerInsight}
        />
      ))}
    </group>
  );
});
