import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { RoundedBox, Html, Text, Billboard, Edges } from '@react-three/drei';
import * as THREE from 'three';
import type { LayoutNode, LayoutData } from '../../lib/irTypes';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { getStrings } from '../../lib/localization';
import { getVisualMeta, getActivationSubKind, type VisualKind } from '../../lib/visualKind';
import { shouldRenderLeafCaption, type LabelMode } from '../../lib/labelMode';
import { getRenderableNodeSize } from '../../lib/renderBounds';
import { partitionLeavesForInstancing } from '../../lib/leafBatching';
import { collectDemoStopNodes } from '../mnist-demo/demoStops';
import { useHoverHold, HoverPanelHtml } from './HoverPanels';
import {
  ERROR_COLOR,
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
  const language = usePreferencesStore((s) => s.language);
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

export const InstancedLeafGroup: React.FC<{
  nodes: LayoutNode[];
  selectedNodeId: string | null;
  activeNodeId: string | null;
  labelMode: LabelMode;
  leafCount: number;
  onHoverNodeId: (nodeId: string | null) => void;
  onHover: (lineno: number | null) => void;
  onClickNode: (nodeId: string) => void;
  onOpenLayerInsight: (node: LayoutNode) => void;
}> = React.memo(({ nodes, onHoverNodeId, onHover, onClickNode, onOpenLayerInsight }) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const hovered = useHoverHold<number | null>(null);
  const n = nodes[0];
  const meta = useMemo(() => getVisualMeta(n.op_type), [n.op_type]);
  const args = useMemo(
    () => {
      const { width, height, depth } = getRenderableNodeSize(n);
      return [width, height, depth] as [number, number, number];
    },
    [n],
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
          onHoverNodeId(nodes[i]?.id ?? null);
          onHover(nodes[i]?.lineno ?? null);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          hovered.hide();
          onHoverNodeId(null);
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
      {hovered.value !== null && nodes[hovered.value] && (
        <HoverPanelHtml
          position={[
            nodes[hovered.value].x + getRenderableNodeSize(nodes[hovered.value]).width / 2 + 0.35,
            nodes[hovered.value].y + getRenderableNodeSize(nodes[hovered.value]).height / 2 + 0.6,
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
  </group>
));

const DiamondBlock: React.FC<{ w: number; h: number; d: number; color: string; isActive: boolean; hasError: boolean; errorPulse: number }> = React.memo(({ w, h, d, color, isActive, hasError, errorPulse }) => {
  const plusSize = Math.min(h, d) * 0.2;
  return (
    <group>
      <RoundedBox args={[w, h, d]} radius={0.02} smoothness={2}>
        <meshPhysicalMaterial color={color} metalness={0.05} roughness={0.5} emissive={hasError ? ERROR_COLOR : color} emissiveIntensity={hasError ? errorPulse : isActive ? 0.25 : 0} />
      </RoundedBox>
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
  );
});

function sameNodeRenderFields(a: LayoutNode, b: LayoutNode): boolean {
  return (
    a.id === b.id &&
    a.op_type === b.op_type &&
    a.x === b.x &&
    a.y === b.y &&
    a.z === b.z &&
    a.width === b.width &&
    a.height === b.height &&
    a.depth === b.depth &&
    a.color === b.color &&
    a.opacity === b.opacity &&
    a.collapsed === b.collapsed &&
    a.error === b.error &&
    a.has_error === b.has_error &&
    a.params === b.params
  );
}

function nodeSubtreeHasId(node: LayoutNode, id: string | null | undefined): boolean {
  if (!id) return false;
  if (node.id === id) return true;
  return !!node.children?.some((child) => nodeSubtreeHasId(child, id));
}

type NodeBlockProps = {
  node: LayoutNode;
  highlighted: boolean;
  selectedNodeId: string | null;
  activeNodeId: string | null;
  labelMode: LabelMode;
  leafCount: number;
  onHoverNodeId: (nodeId: string | null) => void;
  onHover: (lineno: number | null) => void;
  onClickNode: (nodeId: string) => void;
  onOpenLayerInsight: (node: LayoutNode) => void;
};

function areNodeBlockPropsEqual(prev: NodeBlockProps, next: NodeBlockProps): boolean {
  return (
    sameNodeRenderFields(prev.node, next.node) &&
    prev.highlighted === next.highlighted &&
    prev.selectedNodeId === next.selectedNodeId &&
    prev.activeNodeId === next.activeNodeId &&
    prev.labelMode === next.labelMode &&
    prev.leafCount === next.leafCount &&
    prev.onHoverNodeId === next.onHoverNodeId &&
    prev.onHover === next.onHover &&
    prev.onClickNode === next.onClickNode &&
    prev.onOpenLayerInsight === next.onOpenLayerInsight
  );
}

const NodeBlockComponent: React.FC<NodeBlockProps> = ({ node, highlighted, onHoverNodeId, onHover, onClickNode, onOpenLayerInsight }) => {
  const hovered = useHoverHold(false);
  const meta = useMemo(() => getVisualMeta(node.op_type), [node.op_type]);
  const { width: w, height: h, depth: d } = getRenderableNodeSize(node);

  const hasError = !!node.error;
  const baseColor = hasError ? ERROR_COLOR : meta.color;
  const isActive = hovered.value || highlighted;
  const errorPulse = useErrorPulse(hasError);
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
          onHoverNodeId(node.id);
          onHover(node.lineno ?? null);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          hovered.hide();
          onHoverNodeId(null);
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
    </group>
  );
};

export const NodeBlock = React.memo(NodeBlockComponent, areNodeBlockPropsEqual);

type ContainerBlockProps = {
  node: LayoutNode;
  isRoot?: boolean;
  highlightNodeId: string | null;
  selectedNodeId: string | null;
  activeNodeId: string | null;
  labelMode: LabelMode;
  leafCount: number;
  skipLeaves?: boolean;
  onHoverNodeId: (nodeId: string | null) => void;
  onToggle: (id: string) => void;
  onHover: (lineno: number | null) => void;
  onClickNode: (nodeId: string) => void;
  onOpenLayerInsight: (node: LayoutNode) => void;
};

function subtreeIdChangeAffectsContainer(
  prev: ContainerBlockProps,
  next: ContainerBlockProps,
  getId: (props: ContainerBlockProps) => string | null,
): boolean {
  const prevId = getId(prev);
  const nextId = getId(next);
  if (prevId === nextId) return false;
  return nodeSubtreeHasId(prev.node, prevId) || nodeSubtreeHasId(prev.node, nextId);
}

function areContainerBlockPropsEqual(prev: ContainerBlockProps, next: ContainerBlockProps): boolean {
  return (
    sameNodeRenderFields(prev.node, next.node) &&
    prev.isRoot === next.isRoot &&
    prev.labelMode === next.labelMode &&
    prev.leafCount === next.leafCount &&
    prev.skipLeaves === next.skipLeaves &&
    prev.onHoverNodeId === next.onHoverNodeId &&
    prev.onToggle === next.onToggle &&
    prev.onHover === next.onHover &&
    prev.onClickNode === next.onClickNode &&
    prev.onOpenLayerInsight === next.onOpenLayerInsight &&
    !subtreeIdChangeAffectsContainer(prev, next, (props) => props.highlightNodeId) &&
    !subtreeIdChangeAffectsContainer(prev, next, (props) => props.selectedNodeId) &&
    !subtreeIdChangeAffectsContainer(prev, next, (props) => props.activeNodeId)
  );
}

const ContainerBlockComponent: React.FC<ContainerBlockProps> = ({ node, isRoot, highlightNodeId, selectedNodeId, activeNodeId, labelMode, leafCount, skipLeaves, onHoverNodeId, onToggle, onHover, onClickNode, onOpenLayerInsight }) => {
  const language = usePreferencesStore((s) => s.language);
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
            onHoverNodeId={onHoverNodeId}
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
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            onClickNode(node.id);
            onOpenLayerInsight(node);
          }}
          onPointerOver={(e: ThreeEvent<MouseEvent>) => {
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
          onHoverNodeId={onHoverNodeId}
          onToggle={onToggle}
          onHover={onHover}
          onClickNode={onClickNode}
          onOpenLayerInsight={onOpenLayerInsight}
        />
      ))}
    </group>
  );
};

export const ContainerBlock = React.memo(ContainerBlockComponent, areContainerBlockPropsEqual);

export const SceneNode: React.FC<{
  node: LayoutNode;
  isRoot?: boolean;
  highlightNodeId: string | null;
  selectedNodeId: string | null;
  activeNodeId: string | null;
  labelMode: LabelMode;
  leafCount: number;
  skipLeaves?: boolean;
  onHoverNodeId: (nodeId: string | null) => void;
  onToggle: (id: string) => void;
  onHover: (lineno: number | null) => void;
  onClickNode: (nodeId: string) => void;
  onOpenLayerInsight: (node: LayoutNode) => void;
}> = React.memo(({ node, isRoot, highlightNodeId, selectedNodeId, activeNodeId, labelMode, leafCount, skipLeaves, onHoverNodeId, onToggle, onHover, onClickNode, onOpenLayerInsight }) => {
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
        onHoverNodeId={onHoverNodeId}
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
      onHoverNodeId={onHoverNodeId}
      onHover={onHover}
      onClickNode={onClickNode}
      onOpenLayerInsight={onOpenLayerInsight}
    />
  );
});

const LeafCaptionsLayer: React.FC<{
  nodes: LayoutNode[];
  hoveredNodeId: string | null;
  selectedNodeId: string | null;
  activeNodeId: string | null;
  labelMode: LabelMode;
  leafCount: number;
}> = React.memo(({ nodes, hoveredNodeId, selectedNodeId, activeNodeId, labelMode, leafCount }) => (
  <group>
    {nodes.map((node) => {
      if (node.error) return null;
      const shouldRenderCaption = shouldRenderLeafCaption({
        labelMode,
        leafCount,
        nodeId: node.id,
        hoveredNodeId,
        selectedNodeId,
        activeNodeId,
      });
      if (!shouldRenderCaption) return null;

      const meta = getVisualMeta(node.op_type);
      const { height, depth } = getRenderableNodeSize(node);
      return (
        <NodeCaption
          key={node.id}
          label={meta.labelOverride ?? node.op_type}
          position={[
            node.x,
            node.y - height / 2 - 0.9,
            node.z + depth / 2 + 0.15,
          ]}
        />
      );
    })}
  </group>
));

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
  const [hoveredCaptionNodeId, setHoveredCaptionNodeId] = useState<string | null>(null);
  const { batches, singles, visibleContainers, captionNodes, leafCount } = useMemo(() => {
    if (visibleNodeIds) {
      const visibleStopNodes = collectDemoStopNodes(layout.nodes)
        .filter((node) => visibleNodeIds.has(node.id));
      const leaves = visibleStopNodes.filter((node) => !node.is_container);
      return {
        batches: [],
        singles: leaves,
        captionNodes: leaves,
        leafCount: leaves.length,
        visibleContainers: visibleStopNodes.filter((node) => node.is_container),
      };
    }

    const leaves = flattenLeaves(layout.nodes);
    const { batches, singles } = partitionLeavesForInstancing(leaves, {
      highlightedNodeId: highlightNodeId,
      selectedNodeId,
      activeNodeId,
    }, INSTANCED_BATCH_MIN);

    return {
      batches,
      singles,
      captionNodes: leaves,
      leafCount: leaves.length,
      visibleContainers: [],
    };
  }, [activeNodeId, highlightNodeId, layout, selectedNodeId, visibleNodeIds]);

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
            onHoverNodeId={setHoveredCaptionNodeId}
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
          onHoverNodeId={setHoveredCaptionNodeId}
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
          onHoverNodeId={setHoveredCaptionNodeId}
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
          onHoverNodeId={setHoveredCaptionNodeId}
          onHover={onHover}
          onClickNode={onClickNode}
          onOpenLayerInsight={onOpenLayerInsight}
        />
      ))}
      <LeafCaptionsLayer
        nodes={captionNodes}
        hoveredNodeId={hoveredCaptionNodeId}
        selectedNodeId={selectedNodeId}
        activeNodeId={activeNodeId}
        labelMode={labelMode}
        leafCount={leafCount}
      />
    </group>
  );
});
