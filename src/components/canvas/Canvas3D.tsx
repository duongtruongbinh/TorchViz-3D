import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { LayoutData, LayoutNode } from '../../lib/irTypes';
import { getStrings } from '../../lib/localization';
import { getPlaybackProgress, shouldSyncAnimationState } from '../../lib/mnistAnimation';
import { useStore } from '../../store/useStore';
import {
  DataFlowDemo,
  DemoControls,
  DEMO_PLAY_SPEED,
  useMnistTexture,
} from '../mnist-demo/MnistFlowDemo';
import { ConvExerciseModal } from '../mnist-demo/ConvExerciseModal';
import {
  collectDemoStops,
  isMnistDemoCompatible,
} from '../mnist-demo/demoStops';
import { getSegmentState, getDemoInputPose } from '../operation-effects/effectMath';
import { SceneWithInstancing } from './SceneBlocks';
import { EdgeLine } from './EdgeRendering';
import { BoundsAutoFit, ViewResetEffect, RecenterButton } from './CameraControls';

export interface Canvas3DProps {
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

const DEFAULT_CAMERA_OFFSET = new THREE.Vector3(50, 40, 50);
const DEFAULT_CAMERA_ZOOM = 42;
const DEFAULT_MIN_ZOOM = 6;

function collectLayoutNodes(nodes: LayoutNode[], out: LayoutNode[] = []): LayoutNode[] {
  for (const node of nodes) {
    out.push(node);
    if (node.children?.length) collectLayoutNodes(node.children, out);
  }
  return out;
}

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
  const activeTemplate = useStore((s) => s.activeTemplate);
  const shapeInput = useStore((s) => s.shapeInput);
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
  const [exerciseOpen, setExerciseOpen] = useState(false);
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

  const demoStops = useMemo(() => (layout ? collectDemoStops(layout) : []), [layout]);
  const maxDemoProgress = demoStops.length;
  const demoCompatible = useMemo(() => isMnistDemoCompatible(demoStops), [demoStops]);
  const useOperationBlocks = demoModeEnabled && !loading && demoCompatible && maxDemoProgress > 0;

  // Pre-calculate input tile pose to avoid redundant object creations
  const inputPose = useMemo(() => getDemoInputPose(demoStops), [demoStops]);

  const demoSegmentState = useMemo(() => {
    return getSegmentState(demoStops, demoProgress, inputPose.position);
  }, [demoProgress, demoStops, inputPose.position]);

  const activeDemoNodeId = useOperationBlocks ? demoSegmentState.activeStop?.node.id ?? null : null;
  const activeDemoOpType = demoSegmentState.activeStop?.node.op_type ?? '';
  const exerciseSupported = /conv/i.test(activeDemoOpType);

  const progressiveDemoNodeIds = useMemo(() => {
    if (!useOperationBlocks || demoSegmentState.activeStopIndex < 0) return new Set<string>();
    return new Set(demoStops.slice(0, demoSegmentState.activeStopIndex + 1).map((stop) => stop.node.id));
  }, [demoSegmentState.activeStopIndex, demoStops, useOperationBlocks]);

  // Precompute Vector3 mappings for layout edges once layout changes
  const memoizedEdges = useMemo(() => {
    if (!layout) return [];
    return layout.edges.map((edge) => ({
      ...edge,
      vectorPoints: edge.points.map((p) => new THREE.Vector3(p.x, p.y, p.z)),
    }));
  }, [layout]);

  const progressiveDemoEdges = useMemo(() => {
    if (!useOperationBlocks || progressiveDemoNodeIds.size < 2) return [];
    return memoizedEdges.filter((edge) => (
      progressiveDemoNodeIds.has(edge.from) && progressiveDemoNodeIds.has(edge.to)
    ));
  }, [progressiveDemoNodeIds, useOperationBlocks, memoizedEdges]);

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

  // Reset demo progress/playing state when layout, active template, or input shape changes
  useEffect(() => {
    demoProgressRef.current = 0;
    demoLastSyncRef.current = 0;
    setDemoProgress(0);
    setDemoPlaying(false);
    setExerciseOpen(false);
  }, [layoutKey, activeTemplate, shapeInput]);

  useEffect(() => {
    if (!demoModeEnabled || loading) setDemoPlaying(false);
  }, [demoModeEnabled, loading]);

  useEffect(() => {
    if (!exerciseSupported) setExerciseOpen(false);
  }, [exerciseSupported]);

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
            exerciseSupported={exerciseSupported}
            t={t.canvas.demo}
            onProgressChange={handleDemoProgressChange}
            onPlayingChange={setDemoPlaying}
            onAnimationSpeedChange={setDemoAnimationSpeed}
            onOpenExercise={() => {
              setDemoPlaying(false);
              setExerciseOpen(true);
            }}
          />
          <ConvExerciseModal
            isOpen={exerciseOpen}
            t={t.canvas.demo}
            onClose={() => setExerciseOpen(false)}
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
                    {memoizedEdges.map((e, i) => (
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
