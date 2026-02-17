import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  RoundedBox,
  Html,
  CubicBezierLine,
  Edges,
  ContactShadows,
  Bounds,
  useBounds,
} from '@react-three/drei';
import * as THREE from 'three';
import { LayoutData, LayoutNode, LayoutEdge } from '../lib/irTypes';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      meshPhysicalMaterial: any;
      lineBasicMaterial: any;
      boxGeometry: any;
      ambientLight: any;
      directionalLight: any;
      gridHelper: any;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      meshPhysicalMaterial: any;
      lineBasicMaterial: any;
      boxGeometry: any;
      ambientLight: any;
      directionalLight: any;
      gridHelper: any;
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
}

const HEADER_BAR_HEIGHT = 0.6;

/* ─── Pulsing emissive intensity for error nodes ─── */
function useErrorPulse(hasError: boolean): number {
  const ref = useRef(0);
  useFrame((_, delta) => {
    if (hasError) ref.current += delta * 3;
  });
  if (!hasError) return 0;
  return 0.5 + Math.sin(ref.current) * 0.4;
}

/* ─── Leaf Node Block ─── */
const NodeBlock: React.FC<{
  node: LayoutNode;
  highlighted: boolean;
  onHover: (lineno: number | null) => void;
  onClickNode: (nodeId: string) => void;
}> = ({ node, highlighted, onHover, onClickNode }) => {
  const [hovered, setHover] = useState(false);
  const args = useMemo(
    () => [node.width, node.height, node.depth] as [number, number, number],
    [node.width, node.height, node.depth],
  );

  const hasError = !!node.error;
  const baseColor = hasError ? '#ef4444' : node.color;
  const isActive = hovered || highlighted;
  const errorPulse = useErrorPulse(hasError);

  return (
    <group position={[node.x, node.y, node.z]}>
      <RoundedBox
        args={args}
        radius={0.02}
        smoothness={2}
        onClick={(e: any) => {
          e.stopPropagation();
          onClickNode(node.id);
        }}
        onPointerOver={(e: any) => {
          e.stopPropagation();
          setHover(true);
          onHover(node.lineno ?? null);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHover(false);
          onHover(null);
          document.body.style.cursor = '';
        }}
      >
        <meshPhysicalMaterial
          color={baseColor}
          metalness={0.05}
          roughness={0.5}
          clearcoat={0}
          emissive={hasError ? '#ef4444' : baseColor}
          emissiveIntensity={hasError ? errorPulse : isActive ? 0.25 : 0.0}
        />
      </RoundedBox>

      <Edges
        threshold={15}
        color={isActive ? '#ffffff' : hasError ? '#ef4444' : '#525252'}
        scale={1.001}
        renderOrder={1}
      >
        <lineBasicMaterial transparent opacity={isActive ? 0.9 : hasError ? 0.6 : 0.4} />
      </Edges>

      {/* Error floating label */}
      {hasError && (
        <Html
          position={[0, node.height / 2 + 0.8, 0]}
          center
          style={{ pointerEvents: 'none', zIndex: 1100, whiteSpace: 'nowrap' }}
        >
          <div className="bg-red-900/95 border border-red-500 text-red-200 px-3 py-2 rounded-lg text-xs font-mono shadow-xl shadow-red-900/40 max-w-[260px] text-center leading-tight">
            {node.error}
          </div>
        </Html>
      )}

      {/* Hover tooltip */}
      {hovered && !hasError && (
        <Html
          position={[0, node.height / 2, 0]}
          center
          style={{ pointerEvents: 'none', zIndex: 1000, whiteSpace: 'nowrap' }}
        >
          <div className="flex flex-col items-center pb-4">
            <div className="bg-zinc-900/95 text-white border border-zinc-600 px-4 py-3 rounded-lg shadow-2xl min-w-[140px] text-center backdrop-blur-sm">
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 border-b border-zinc-700/50 pb-2">
                {node.op_type}
              </div>
              <div className="text-sm font-mono font-medium text-zinc-100">
                {node.out_shape?.join(' × ')}
              </div>
              {node.params > 0 && (
                <div className="text-xs text-zinc-400 mt-1.5">
                  {node.params.toLocaleString()} params
                </div>
              )}
            </div>
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-zinc-900 -mt-[1px]" />
          </div>
        </Html>
      )}

      {/* Static label (when not hovered) */}
      {!hovered && !hasError && (
        <Html position={[0, -node.height / 2 - 0.5, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="text-xs font-semibold text-zinc-400 select-none tracking-wide">
            {node.op_type}
          </div>
        </Html>
      )}

    </group>
  );
};

/* ─── Container Block ─── */
const ContainerBlock: React.FC<{
  node: LayoutNode;
  isRoot?: boolean;
  highlightNodeId: string | null;
  onToggle: (id: string) => void;
  onHover: (lineno: number | null) => void;
  onClickNode: (nodeId: string) => void;
}> = ({ node, isRoot, highlightNodeId, onToggle, onHover, onClickNode }) => {
  const [hovered, setHover] = useState(false);
  const args = useMemo(
    () => [node.width, node.height, node.depth] as [number, number, number],
    [node.width, node.height, node.depth],
  );
  const hasError = !!node.has_error;
  const borderColor = hasError ? '#ef4444' : node.color;

  // Root container: skip visual chrome, always expanded, render children directly
  if (isRoot) {
    return (
      <group>
        {node.children?.map((child) => (
          <SceneNode
            key={child.id}
            node={child}
            highlightNodeId={highlightNodeId}
            onToggle={onToggle}
            onHover={onHover}
            onClickNode={onClickNode}
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
          }}
          onPointerOver={(e: any) => {
            e.stopPropagation();
            setHover(true);
            onHover(node.lineno ?? null);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHover(false);
            onHover(null);
            document.body.style.cursor = '';
          }}
        >
          <meshPhysicalMaterial
            color={borderColor}
            transparent
            opacity={hovered ? 0.9 : 0.8}
            metalness={0}
            roughness={0.7}
            emissive={borderColor}
            emissiveIntensity={hovered ? 0.2 : 0.08}
          />
        </RoundedBox>

        <Edges threshold={15} color="#6b7280" scale={1.001} renderOrder={1}>
          <lineBasicMaterial transparent opacity={hovered ? 0.8 : 0.5} />
        </Edges>

        {/* Label */}
        <Html position={[0, 0, 0]} center style={{ pointerEvents: 'none', zIndex: 900 }}>
          <div className="flex flex-col items-center select-none" style={{ opacity: hovered ? 1 : 0.95 }}>
            <div
              className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg border backdrop-blur-sm"
              style={{ color: '#fff', borderColor, background: 'rgba(9,9,11,0.92)' }}
            >
              {node.op_type}
            </div>
            {node.params > 0 && (
              <div className="text-xs text-zinc-400 font-mono mt-0.5">
                {node.params.toLocaleString()} params
              </div>
            )}
          </div>
        </Html>

        {/* Expand button — top-right of block */}
        <Html
          position={[node.width / 2 + 0.2, node.height / 2 + 0.15, 0]}
          center
          style={{ pointerEvents: 'auto', zIndex: 950 }}
        >
          <button
            type="button"
            title="Expand"
            className="text-xs font-medium px-2 py-1 rounded-lg bg-blue-600/95 hover:bg-blue-500 text-white shadow cursor-pointer transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
          >
            ▶
          </button>
        </Html>
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
        <RoundedBox args={args} radius={0.03} smoothness={2} raycast={() => {}}>
          <meshPhysicalMaterial
            color={borderColor}
            transparent
            opacity={0.18}
            metalness={0}
            roughness={1}
          />
        </RoundedBox>

        <Edges threshold={15} color="#6b7280" scale={1.001} renderOrder={1}>
          <lineBasicMaterial transparent opacity={0.5} />
        </Edges>

        {/* Top-left label */}
        <Html
          position={[-node.width / 2 + 0.4, node.height / 2 + 0.35, 0]}
          style={{ pointerEvents: 'none', zIndex: 800 }}
        >
          <div
            className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg select-none backdrop-blur-sm"
            style={{ color: borderColor, background: 'rgba(9,9,11,0.85)' }}
          >
            {node.op_type}
          </div>
        </Html>

        {/* Collapse button — top-right of container */}
        <Html
          position={[node.width / 2 - 0.15, node.height / 2 + 0.15, 0]}
          center
          style={{ pointerEvents: 'auto', zIndex: 850 }}
        >
          <button
            type="button"
            title="Collapse"
            className="text-xs font-medium px-2 py-1 rounded-lg bg-blue-600/95 hover:bg-blue-500 text-white shadow cursor-pointer transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
          >
            ▼
          </button>
        </Html>

        {/* Hover sensor at top — click = select container */}
        <mesh
          position={[0, node.height / 2 - HEADER_BAR_HEIGHT / 2, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onClickNode(node.id);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHover(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHover(false);
            document.body.style.cursor = '';
          }}
        >
          <boxGeometry args={headerArgs} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>

      {/* Render children recursively — fully accessible to mouse events */}
      {node.children?.map((child) => (
        <SceneNode
          key={child.id}
          node={child}
          highlightNodeId={highlightNodeId}
          onToggle={onToggle}
          onHover={onHover}
          onClickNode={onClickNode}
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
  onToggle: (id: string) => void;
  onHover: (lineno: number | null) => void;
  onClickNode: (nodeId: string) => void;
}> = ({ node, isRoot, highlightNodeId, onToggle, onHover, onClickNode }) => {
  if (node.is_container) {
    return (
      <ContainerBlock
        node={node}
        isRoot={isRoot}
        highlightNodeId={highlightNodeId}
        onToggle={onToggle}
        onHover={onHover}
        onClickNode={onClickNode}
      />
    );
  }
  return (
    <NodeBlock
      node={node}
      highlighted={node.id === highlightNodeId}
      onHover={onHover}
      onClickNode={onClickNode}
    />
  );
};

/* ─── Edge Line ─── */
const EdgeLine: React.FC<{ edge: LayoutEdge }> = ({ edge }) => {
  const { points, kind } = edge;
  if (points.length < 4) return null;

  const color = kind === 'residual' ? '#a1a1aa' : '#52525b';
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
      lineWidth={kind === 'residual' ? 1 : 2}
      dashed={kind === 'residual'}
      dashScale={2}
    />
  );
};

/* ─── Auto-fit camera when layout changes ─── */
const BoundsAutoFit: React.FC<{ layoutKey: string }> = ({ layoutKey }) => {
  const bounds = useBounds();
  const prevKey = useRef('');
  useEffect(() => {
    if (layoutKey && layoutKey !== prevKey.current) {
      prevKey.current = layoutKey;
      // Slight delay to let geometry settle before measuring
      const id = setTimeout(() => bounds.refresh().clip().fit(), 80);
      return () => clearTimeout(id);
    }
  }, [layoutKey, bounds]);
  return null;
};

/* ─── Recenter button (lives inside Canvas to access useBounds) ─── */
const RecenterButton: React.FC = () => {
  const bounds = useBounds();
  const { size } = useThree();
  return (
    <Html
      position={[0, 0, 0]}
      style={{ pointerEvents: 'auto' }}
      zIndexRange={[50, 0]}
      calculatePosition={(_, __, { width, height }) => [width - 90, height - 50]}
    >
      <button
        className="fixed bottom-4 right-4 bg-zinc-800/95 hover:bg-zinc-700 border border-zinc-600 text-zinc-200 px-3 py-2 rounded-lg text-xs font-medium shadow-lg backdrop-blur-sm transition-all hover:text-white select-none"
        onClick={() => bounds.refresh().clip().fit()}
        title="Recenter camera"
      >
        <span className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
            <path fillRule="evenodd" d="M9.638 1.093a.75.75 0 01.724 0l2 1.104a.75.75 0 11-.724 1.313L10 2.607l-1.638.903a.75.75 0 11-.724-1.313l2-1.104zM5.403 4.287a.75.75 0 01-.295 1.019l-.805.444.805.444a.75.75 0 01-.724 1.313L3.19 6.86a.75.75 0 010-1.313l1.194-.66a.75.75 0 011.019.295zm9.194 0a.75.75 0 011.019-.295l1.194.66a.75.75 0 010 1.313l-1.194.659a.75.75 0 11-.724-1.313l.805-.444-.805-.444a.75.75 0 01-.295-1.019zM7.343 8.284a.75.75 0 011.019-.295L10 8.893l1.638-.904a.75.75 0 11.724 1.313l-2 1.104a.75.75 0 01-.724 0l-2-1.104a.75.75 0 01-.295-1.018z" clipRule="evenodd" />
          </svg>
          Recenter
        </span>
      </button>
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
}) => {
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

  // Stable key that changes when the graph structure changes
  const layoutKey = useMemo(() => {
    if (!layout) return '';
    return layout.nodes.map((n) => `${n.id}:${n.collapsed}`).join(',');
  }, [layout]);

  return (
    <div className="w-full h-full relative" style={{ background: 'var(--canvas-bg, radial-gradient(circle at center, #18181b 0%, #09090b 100%))' }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-zinc-950/70 backdrop-blur-sm transition-all duration-300">
          <div className="flex flex-col items-center gap-5 p-8 bg-zinc-900/95 rounded-2xl border border-zinc-700/60 shadow-2xl">
            <div className="relative">
              <div className="w-11 h-11 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin" />
            </div>
            <span className="text-zinc-200 font-mono text-sm tracking-wider animate-pulse">
              Running TorchScript...
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
              Compilation Failed
            </h3>
            <p className="text-red-300/90 text-sm leading-relaxed font-mono break-words max-h-36 overflow-auto">
              {error.message || 'Unknown error'}
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
              Ready to Visualize
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-5">
              Select a template or write PyTorch code on the left, then press
              <span className="text-blue-400 font-bold ml-1">Visualize</span>.
            </p>
            <div className="flex items-center justify-center gap-5 text-xs text-zinc-500">
              <span className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-lg bg-zinc-800/90 border border-zinc-600/50 text-zinc-300 font-medium">Left</span>
                Rotate
              </span>
              <span className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-lg bg-zinc-800/90 border border-zinc-600/50 text-zinc-300 font-medium">Right</span>
                Pan
              </span>
              <span className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-lg bg-zinc-800/90 border border-zinc-600/50 text-zinc-300 font-medium">Scroll</span>
                Zoom
              </span>
            </div>
          </div>
        </div>
      )}

      <Canvas
        orthographic
        camera={{ zoom: 40, position: [50, 40, 50], near: -1000, far: 2000 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
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
          <Bounds fit clip observe margin={0.15}>
            <BoundsAutoFit layoutKey={layoutKey} />
            <RecenterButton />
            <group>
              {layout.nodes.map((n) => {
                const isRoot = !n.parentId && n.is_container && layout.nodes.length === 1;
                return (
                  <SceneNode
                    key={n.id}
                    node={n}
                    isRoot={isRoot}
                    highlightNodeId={highlightNodeId}
                    onToggle={handleToggle}
                    onHover={handleHover}
                    onClickNode={handleClick}
                  />
                );
              })}
              {layout.edges.map((e, i) => (
                <EdgeLine key={`${e.from}-${e.to}-${i}`} edge={e} />
              ))}
            </group>
            <gridHelper args={[400, 80, 0x3f3f46, 0x18181b]} position={[0, -5, 0]} />
          </Bounds>
        )}

        <OrbitControls
          makeDefault
          minZoom={10}
          maxZoom={150}
          enableDamping
          dampingFactor={0.1}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={0}
        />
      </Canvas>
    </div>
  );
};

export default Canvas3D;
