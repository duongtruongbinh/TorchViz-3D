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
  useForwardPassInput,
} from '../mnist-demo/MnistFlowDemo';
import { collectDemoStops } from '../mnist-demo/demoStops';
import { useMnistDemoState } from '../mnist-demo/useMnistDemoState';
import { SceneWithInstancing } from './SceneBlocks';
import { EdgeLine } from './EdgeRendering';
import { ArchitectureControls, CameraFitController } from './CameraControls';
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
import { getAdaptiveGridSpec, getLayoutWorldBounds } from '../../lib/renderBounds';
import { resolveLearningExerciseLessonTarget, type LearningExerciseLessonTarget } from '../../core/learning/selectors';
import { getHashRouterUrl, getLearningLessonPath } from '../../lib/appRoutes';
import type { ExerciseId } from '../exercises/types';

export interface Canvas3DProps {
  layout: LayoutData | null;
  graphRevision?: number;
  layoutRevision?: number;
  loading: boolean;
  error?: AppError | null;
  highlightNodeId?: string | null;
  selectedNodeId?: string | null;
  onToggleCollapse?: (nodeId: string) => void;
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
  onHoverNode?: (lineno: number | null) => void;
  onClickNode?: (nodeId: string) => void;
  onOpenLayerInsight?: (node: LayoutNode) => void;
  resetViewToken?: number;
  resetViewDisabled?: boolean;
  demoModeEnabled?: boolean;
}

const Canvas3D: React.FC<Canvas3DProps> = ({
  layout,
  graphRevision = 0,
  layoutRevision = 0,
  loading,
  error = null,
  highlightNodeId = null,
  selectedNodeId = null,
  onToggleCollapse,
  onExpandAll,
  onCollapseAll,
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
  const [manualFitToken, setManualFitToken] = useState(0);

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

  const layoutKey = useCanvasLayoutKey(layout);
  const showLoadingOverlay = loading;
  const worldBounds = useMemo(
    () => (layout ? getLayoutWorldBounds(layout, { includeEdges: true }) : null),
    [layout],
  );
  const gridSpec = useMemo(
    () => (worldBounds ? getAdaptiveGridSpec(worldBounds) : null),
    [worldBounds],
  );

  const demoStops = useMemo(() => (layout ? collectDemoStops(layout) : []), [layout]);
  const inputChannels = useMemo(() => {
    const firstLeaf = demoStops.find((stop) => !stop.node.is_container && stop.node.in_shape?.length);
    return firstLeaf?.node.in_shape?.[1] ?? 3;
  }, [demoStops]);
  const mnist = useForwardPassInput(`${activeTemplate}:${layoutKey}`, inputChannels);
  const memoizedEdges = useMemo(() => getVectorizedLayoutEdges(layout), [layout]);
  const demo = useMnistDemoState({
    demoModeEnabled,
    loading,
    layoutKey,
    activeTemplate,
    shapeInput,
    demoStops,
    edges: memoizedEdges,
    layoutNodes: layout?.nodes ?? [],
  });
  const effectiveHighlightNodeId = demo.activeNodeId ?? highlightNodeId;
  const [learningExerciseTargets, setLearningExerciseTargets] = useState<Map<ExerciseId, LearningExerciseLessonTarget>>(() => new Map());
  useEffect(() => {
    const activeNode = demo.segmentState.activeStop?.node;
    if (!activeNode) {
      setLearningExerciseTargets(new Map());
      return;
    }
    let cancelled = false;
    void import('../../core/learning/content').then(({ learningCatalog }) => {
      if (cancelled) return;
      const targets = new Map<ExerciseId, LearningExerciseLessonTarget>();
      for (const exercise of demo.availableExercises) {
        const target = resolveLearningExerciseLessonTarget(learningCatalog, { exerciseId: exercise.id, operation: activeNode.op_type });
        if (target) targets.set(exercise.id, target);
      }
      setLearningExerciseTargets(targets);
    });
    return () => {
      cancelled = true;
    };
  }, [demo.availableExercises, demo.segmentState.activeStop?.node]);
  const learningExercises = useMemo(
    () => demo.availableExercises.filter((exercise) => learningExerciseTargets.has(exercise.id)),
    [demo.availableExercises, learningExerciseTargets],
  );
  const openLearningExercise = useCallback((exerciseId: ExerciseId) => {
    const target = learningExerciseTargets.get(exerciseId);
    if (!target) return;
    demo.setPlaying(false);
    const path = getLearningLessonPath(target.domainId, target.trackId, target.lessonId);
    window.open(getHashRouterUrl(window.location.href, path), '_blank', 'noopener,noreferrer');
  }, [demo.setPlaying, learningExerciseTargets]);

  return (
    <div ref={containerRef} data-tour="mnist-demo-flow" className="w-full h-full relative" style={{ background: 'var(--canvas-bg, radial-gradient(circle at center, #18181b 0%, #09090b 100%))' }}>
      {layout && demoModeEnabled && demo.compatibility.ok && (
        <DemoControls
          stops={demoStops}
          progress={demo.progress}
          playing={demo.playing}
          dataUrl={mnist?.dataUrl}
          animationSpeed={demo.animationSpeed}
          t={t.canvas.demo}
          onProgressChange={demo.setProgress}
          onPlayingChange={demo.setPlaying}
          onAnimationSpeedChange={demo.setAnimationSpeed}
          availableExercises={learningExercises}
          onSelectExercise={openLearningExercise}
        />
      )}

      {showLoadingOverlay && <CanvasLoadingOverlay t={t.canvas} />}
      {!layout && !showLoadingOverlay && error && <CanvasErrorOverlay error={error} t={t.canvas} />}
      {!layout && !showLoadingOverlay && !error && <CanvasEmptyOverlay canvas={t.canvas} header={t.header} help={t.help} />}

      <Canvas
        orthographic
        camera={{ zoom: DEFAULT_CAMERA_ZOOM, position: DEFAULT_CAMERA_POSITION, near: -1000, far: 2000 }}
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

        <ArchitectureControls
          disabled={!layout}
          showRecenter={!resetViewDisabled && !!layout}
          onExpandAll={() => onExpandAll?.()}
          onCollapseAll={() => onCollapseAll?.()}
          onRecenter={() => setManualFitToken((token) => token + 1)}
        />

        <ContactShadows
          key={`contact-shadows-${layoutRevision}`}
          opacity={0.4}
          scale={gridSpec?.size ?? 40}
          blur={2}
          far={10}
          resolution={256}
          frames={1}
          color="#000000"
        />

        {layout && (
          <>
            <CameraFitController
              layout={layout}
              graphRevision={graphRevision}
              layoutRevision={layoutRevision}
              manualFitToken={resetViewToken + manualFitToken}
            />
            <SceneWithInstancing
              layout={layout}
              highlightNodeId={effectiveHighlightNodeId}
              selectedNodeId={selectedNodeId}
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
                sampleMatrix={mnist.sampleMatrix}
                channels={inputChannels}
                targetClass={mnist.classIndex}
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
            {gridSpec && (
              <gridHelper
                args={[gridSpec.size, gridSpec.divisions, 0x3f3f46, 0x18181b]}
                position={gridSpec.center}
              />
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

export default React.memo(Canvas3D);
