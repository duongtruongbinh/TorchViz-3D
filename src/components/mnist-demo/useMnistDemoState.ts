import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { getPlaybackProgress, shouldSyncAnimationState } from '../../lib/mnistAnimation';
import type { LayoutEdgeWithVectors } from '../../lib/canvasUtils';
import type { LayoutNode } from '../../lib/irTypes';
import { getForwardPassCompatibility } from '../../lib/mnistCompatibility';
import { getExerciseById, getExercisesForNode } from '../exercises/exerciseRegistry';
import type { ExerciseId } from '../exercises/types';
import { getDemoInputPose, getSegmentState, type DemoStop } from '../operation-effects/effectMath';
import { buildDemoFlowEdges, buildVisibleDemoNodeIds } from './demoStops';
import { DEMO_PLAY_SPEED } from './MnistFlowDemo';

type UseMnistDemoStateArgs = {
  demoModeEnabled: boolean;
  loading: boolean;
  layoutKey: string;
  activeTemplate: string;
  shapeInput: string;
  demoStops: DemoStop[];
  edges: LayoutEdgeWithVectors[];
  layoutNodes: LayoutNode[];
};

export function useMnistDemoState({
  demoModeEnabled,
  loading,
  layoutKey,
  activeTemplate,
  shapeInput,
  demoStops,
  edges,
  layoutNodes,
}: UseMnistDemoStateArgs) {
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [activeExerciseId, setActiveExerciseId] = useState<ExerciseId | null>(null);
  const [animationSpeed, setAnimationSpeed] = useState(DEMO_PLAY_SPEED);
  const progressRef = useRef(0);
  const lastSyncRef = useRef(0);

  const compatibility = useMemo(
    () => getForwardPassCompatibility(demoStops, { loading }),
    [demoStops, loading],
  );
  const maxProgress = demoStops.length;
  const useOperationBlocks = demoModeEnabled && compatibility.ok && maxProgress > 0;
  const inputPose = useMemo(() => getDemoInputPose(demoStops), [demoStops]);
  const segmentState = useMemo(
    () => getSegmentState(demoStops, progress, inputPose.position),
    [demoStops, progress, inputPose.position],
  );
  const activeNodeId = useOperationBlocks ? segmentState.activeStop?.node.id ?? null : null;
  const availableExercises = useMemo(
    () => getExercisesForNode(useOperationBlocks ? segmentState.activeStop?.node : null),
    [segmentState.activeStop?.node, useOperationBlocks],
  );

  const flowEdges = useMemo(() => buildDemoFlowEdges(demoStops, edges, layoutNodes), [demoStops, edges, layoutNodes]);

  const visibleNodeIds = useMemo(() => {
    if (!useOperationBlocks) return new Set<string>();
    return buildVisibleDemoNodeIds(demoStops, flowEdges, segmentState.activeStopIndex);
  }, [demoStops, flowEdges, segmentState.activeStopIndex, useOperationBlocks]);

  const visibleEdges = useMemo(() => {
    if (!useOperationBlocks || segmentState.activeStopIndex < 1) return [];
    // An edge (main chain or skip/residual branch) is visible once the stop at
    // its revealIndex has been reached.
    return flowEdges
      .filter((flow) => flow.revealIndex <= segmentState.activeStopIndex)
      .map((flow) => flow.edge);
  }, [flowEdges, useOperationBlocks, segmentState.activeStopIndex]);

  const handleProgressChange = useCallback((nextProgress: number) => {
    const clampedProgress = THREE.MathUtils.clamp(nextProgress, 0, maxProgress);
    progressRef.current = clampedProgress;
    lastSyncRef.current = performance.now();
    setProgress(clampedProgress);
  }, [maxProgress]);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    progressRef.current = 0;
    lastSyncRef.current = 0;
    setProgress(0);
    setPlaying(false);
    setActiveExerciseId(null);
  }, [layoutKey, activeTemplate, shapeInput]);

  useEffect(() => {
    if (!demoModeEnabled || loading || !compatibility.ok) setPlaying(false);
  }, [compatibility.ok, demoModeEnabled, loading]);

  const openExercise = useCallback((id: ExerciseId) => {
    const exercise = getExerciseById(id);
    if (!exercise || !availableExercises.some((available) => available.id === id)) return;
    setPlaying(false);
    setActiveExerciseId(id);
  }, [availableExercises]);

  const closeExercise = useCallback(() => {
    setActiveExerciseId(null);
  }, []);

  useEffect(() => {
    if (!activeExerciseId) return;
    if (!availableExercises.some((exercise) => exercise.id === activeExerciseId)) {
      setActiveExerciseId(null);
    }
  }, [activeExerciseId, availableExercises]);

  useEffect(() => {
    if (!demoModeEnabled || !playing || maxProgress <= 0) return;
    let frameId = 0;
    let prevTime = performance.now();
    lastSyncRef.current = 0;

    const tick = (time: number) => {
      const deltaMs = time - prevTime;
      prevTime = time;
      const nextProgress = getPlaybackProgress(
        progressRef.current,
        deltaMs,
        animationSpeed,
        maxProgress,
      );
      progressRef.current = nextProgress;
      if (shouldSyncAnimationState(time, lastSyncRef.current) || nextProgress >= maxProgress) {
        lastSyncRef.current = time;
        setProgress(nextProgress);
      }
      if (nextProgress >= maxProgress) {
        setPlaying(false);
        return;
      }
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [animationSpeed, demoModeEnabled, playing, maxProgress]);

  return {
    activeNodeId,
    activeExerciseId,
    animationSpeed,
    availableExercises,
    compatibility,
    inputPose,
    maxProgress,
    playing,
    progress,
    segmentState,
    useOperationBlocks,
    visibleEdges,
    visibleNodeIds,
    closeExercise,
    openExercise,
    setAnimationSpeed,
    setPlaying,
    setProgress: handleProgressChange,
  };
}
