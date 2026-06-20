import React, { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { LayoutData, LayoutNode } from '../../lib/irTypes';
import { getStrings } from '../../lib/localization';
import { useStore } from '../../store/useStore';
import {
  DataFlowDemo,
  DemoControls,
  useMnistTexture,
} from '../mnist-demo/MnistFlowDemo';
import { ConvExerciseModal } from '../mnist-demo/ConvExerciseModal';
import { ShapeExercise } from '../exercises/ShapeExercise';
import { ValueExercise } from '../exercises/ValueExercise';
import type { ValueExerciseId } from '../../lib/valueExerciseModels';
import { collectDemoStops } from '../mnist-demo/demoStops';
import { useMnistDemoState } from '../mnist-demo/useMnistDemoState';
import { SceneWithInstancing } from './SceneBlocks';
import { EdgeLine } from './EdgeRendering';
import { BoundsAutoFit, ViewResetEffect, RecenterButton } from './CameraControls';
import { CanvasEmptyOverlay, CanvasErrorOverlay, CanvasLoadingOverlay } from './CanvasOverlays';
import { useCanvasLayoutKey } from './useCanvasLayoutKey';
import {
  DEFAULT_CAMERA_POSITION,
  DEFAULT_CAMERA_ZOOM,
  DEFAULT_MAX_ZOOM,
  DEFAULT_MIN_ZOOM,
  getVectorizedLayoutEdges,
} from '../../lib/canvasUtils';
import type { AppError } from '../../lib/appError';

export interface Canvas3DProps {
  layout: LayoutData | null;
  loading: boolean;
  error?: AppError | null;
  highlightNodeId?: string | null;
  onToggleCollapse?: (nodeId: string) => void;
  onHoverNode?: (lineno: number | null) => void;
  onClickNode?: (nodeId: string) => void;
  onOpenLayerInsight?: (node: LayoutNode) => void;
  resetViewToken?: number;
  resetViewDisabled?: boolean;
  demoModeEnabled?: boolean;
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shortExerciseFallbackModal, setShortExerciseFallbackModal] = useState(false);

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
  const mnist = useMnistTexture();

  const layoutKey = useCanvasLayoutKey(layout);
  const viewReady = !!layout && fittedLayoutKey === layoutKey;
  const showLoadingOverlay = loading || (!!layout && !viewReady);

  const demoStops = useMemo(() => (layout ? collectDemoStops(layout) : []), [layout]);
  const memoizedEdges = useMemo(() => getVectorizedLayoutEdges(layout), [layout]);
  const demo = useMnistDemoState({
    demoModeEnabled,
    loading,
    layoutKey,
    activeTemplate,
    shapeInput,
    demoStops,
    edges: memoizedEdges,
  });
  const effectiveHighlightNodeId = demo.activeNodeId ?? highlightNodeId;

  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => {
      setShortExerciseFallbackModal(entry.contentRect.width < 760);
    });
    observer.observe(element);
    setShortExerciseFallbackModal(element.clientWidth < 760);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative" style={{ background: 'var(--canvas-bg, radial-gradient(circle at center, #18181b 0%, #09090b 100%))' }}>
      {layout && viewReady && demoModeEnabled && demo.compatibility.ok && (
        <>
          <DemoControls
            stops={demoStops}
            progress={demo.progress}
            playing={demo.playing}
            dataUrl={mnist?.dataUrl}
            animationSpeed={demo.animationSpeed}
            availableExercises={demo.availableExercises}
            t={t.canvas.demo}
            onProgressChange={demo.setProgress}
            onPlayingChange={demo.setPlaying}
            onAnimationSpeedChange={demo.setAnimationSpeed}
            onOpenExercise={demo.openExercise}
          />
          <ConvExerciseModal
            isOpen={demo.activeExerciseId === 'conv-value'}
            t={t.canvas.demo}
            onClose={demo.closeExercise}
          />
          <ShapeExercise
            isOpen={demo.activeExerciseId === 'shape-output' || demo.activeExerciseId === 'attention-shape'}
            exerciseId={demo.activeExerciseId === 'attention-shape' ? 'attention-shape' : 'shape-output'}
            node={demo.segmentState.activeStop?.node}
            t={t.canvas.demo}
            language={language}
            onClose={demo.closeExercise}
          />
          <ValueExercise
            isOpen={isValueExerciseId(demo.activeExerciseId)}
            exerciseId={isValueExerciseId(demo.activeExerciseId) ? demo.activeExerciseId : null}
            node={demo.segmentState.activeStop?.node}
            fallbackModal={shortExerciseFallbackModal}
            t={t.canvas.demo}
            language={language}
            onClose={demo.closeExercise}
          />
        </>
      )}

      {showLoadingOverlay && <CanvasLoadingOverlay t={t.canvas} />}
      {!layout && !loading && error && <CanvasErrorOverlay error={error} t={t.canvas} />}
      {!layout && !loading && !error && <CanvasEmptyOverlay canvas={t.canvas} header={t.header} help={t.help} />}

      <Canvas
        orthographic
        camera={{ zoom: DEFAULT_CAMERA_ZOOM, position: DEFAULT_CAMERA_POSITION, near: -1000, far: 2000 }}
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
                  selectedNodeId={highlightNodeId}
                  activeNodeId={demo.activeNodeId}
                  labelMode="auto"
                  visibleNodeIds={demo.useOperationBlocks ? demo.visibleNodeIds : undefined}
                  onToggle={handleToggle}
                  onHover={handleHover}
                  onClickNode={handleClick}
                  onOpenLayerInsight={handleOpenLayerInsight}
                />
                {demo.useOperationBlocks && (
                  <group>
                    {demo.visibleEdges.map((e, i) => (
                      <EdgeLine key={`${e.from}-${e.to}-${i}`} edge={e} />
                    ))}
                  </group>
                )}
                {mnist && demo.useOperationBlocks && (
                  <DataFlowDemo
                    stops={demoStops}
                    edges={demo.visibleEdges}
                    progress={demo.progress}
                    texture={mnist.texture}
                    inputPose={demo.inputPose}
                    t={t.canvas.demo}
                  />
                )}
                {!demo.useOperationBlocks && (
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
          maxZoom={DEFAULT_MAX_ZOOM}
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

function isValueExerciseId(id: string | null): id is ValueExerciseId {
  return id === 'pool-value' || id === 'linear-value' || id === 'activation-value';
}
