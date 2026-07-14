import React, { useEffect, useMemo } from 'react';
import { Billboard, Line, Text } from '@react-three/drei';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import * as THREE from 'three';
import { clamp01, getEasedSegmentProgress } from '../../lib/mnistAnimation';
import type { LayoutEdge } from '../../lib/irTypes';
import type { getStrings } from '../../lib/localization';
import { DEMO_PLAY_SPEED } from '../operation-effects/effectData';
import {
  CIFAR_SAMPLES,
  deriveSampleMatrix,
  pickCifarSampleIndex,
  renderCifarSampleCanvas,
} from './cifarSamples';
import type { DemoStop } from '../operation-effects/effectMath';
import {
  getDataPacketRoutes,
  getSegmentState,
  type DataPacketRoute,
  type DemoPose,
} from '../operation-effects/effectMath';
import {
  hasOperationEffect as hasOperationDemo,
  OperationEffect as OperationDemo,
} from '../operation-effects';
import {
  TEXT_BASE_PROPS,
  RENDER_ORDER_INPUT_TILE_BILLBOARD,
  RENDER_ORDER_INPUT_TILE_TEXT,
  RENDER_ORDER_DATA_PACKET,
} from '../../lib/constants';
import { ExerciseLauncher } from '../exercises/ExerciseLauncher';
import type { ExerciseDefinition, ExerciseId } from '../exercises/types';

const MIN_ANIMATION_SPEED = 0.25;
const MAX_ANIMATION_SPEED = 2.5;

type DemoLabels = ReturnType<typeof getStrings>['canvas']['demo'];

export { DEMO_PLAY_SPEED };

export type ForwardPassInput = {
  texture: THREE.Texture;
  dataUrl: string;
  /** Normalized 8x8 grayscale of the sample; the Conv effect's input map. */
  sampleMatrix: number[][];
  /** CIFAR-10 class label of the chosen sample. */
  label: string;
  /** CIFAR-10 class index of the chosen sample; the output highlights it. */
  classIndex: number;
};

/**
 * Builds the forward-pass input packet: a CIFAR-10-style colour image chosen
 * from a small rotating set (keyed on the active template/layout), grayscaled
 * when the model declares a 1-channel input.
 */
export function useForwardPassInput(rotationKey: string, channels: number): ForwardPassInput | null {
  const input = useMemo(() => {
    const sample = CIFAR_SAMPLES[pickCifarSampleIndex(rotationKey)];
    const canvas = renderCifarSampleCanvas(sample, 128, channels === 1);
    if (!canvas) return null;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return {
      texture,
      dataUrl: canvas.toDataURL('image/png'),
      sampleMatrix: deriveSampleMatrix(canvas, 8),
      label: sample.label,
      classIndex: sample.classIndex,
    };
  }, [rotationKey, channels]);

  useEffect(() => () => {
    input?.texture.dispose();
  }, [input]);

  return input;
}

// R/G/B channel tints for the volumetric input. Additively blended, the three
// tinted copies of the RGB image recombine into the original colour while the
// depth offset exposes them as separate C×H×W channel slices.
const CHANNEL_TINTS = ['#ff3030', '#30ff5a', '#3080ff'];

const DemoInputTile: React.FC<{
  texture: THREE.Texture;
  channels: number;
  position: THREE.Vector3;
  rotation: [number, number, number];
  size: [number, number];
  label: string;
}> = React.memo(({ texture, channels, position, rotation, size, label }) => {
  const [w, h] = size;
  const isRgb = channels === 3;
  const sliceCount = channels <= 1 ? 1 : isRgb ? 3 : Math.min(channels, 6);
  const gap = Math.min(w, h) * 0.13;
  const totalDepth = gap * (sliceCount - 1);
  const frameGeometry = useMemo(
    () => new THREE.BoxGeometry(w, h, Math.max(totalDepth, 0.001)),
    [w, h, totalDepth],
  );

  return (
    <group position={position} rotation={rotation}>
      {/* Background plane behind the whole stack */}
      <mesh position={[0, 0, -totalDepth / 2 - 0.05]}>
        <planeGeometry args={[w + 0.35, h + 0.35]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.92} toneMapped={false} />
      </mesh>

      {/* Channel slices stacked along local Z to read as a C×H×W volume */}
      {Array.from({ length: sliceCount }, (_, i) => (
        <mesh key={i} position={[0, 0, totalDepth / 2 - i * gap]}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial
            map={texture}
            color={isRgb ? CHANNEL_TINTS[i] : '#ffffff'}
            toneMapped={false}
            transparent
            opacity={isRgb ? 0.92 : 1}
            blending={isRgb ? THREE.AdditiveBlending : THREE.NormalBlending}
            depthWrite={!isRgb}
          />
        </mesh>
      ))}

      {/* Volume frame so it reads as a 3D tensor, not a flat tile */}
      {sliceCount > 1 && (
        <lineSegments>
          <edgesGeometry args={[frameGeometry]} />
          <lineBasicMaterial color="#7dd3fc" transparent opacity={0.45} />
        </lineSegments>
      )}

      {/* Label Text remains billboarded for camera readability */}
      <Billboard position={[-2.95, -h / 2 - 0.9, 0.28]} renderOrder={RENDER_ORDER_INPUT_TILE_BILLBOARD}>
        <Text
          {...TEXT_BASE_PROPS}
          fontSize={0.5}
          color="#e5e7eb"
          outlineWidth={0.025}
          renderOrder={RENDER_ORDER_INPUT_TILE_TEXT}
        >
          {label}
        </Text>
      </Billboard>
    </group>
  );
});

const DataPacket: React.FC<{
  route: DataPacketRoute;
}> = React.memo(({ route }) => {
  const isResidual = route.kind === 'residual';
  return (
    <mesh position={route.position} renderOrder={RENDER_ORDER_DATA_PACKET}>
      <sphereGeometry args={[0.18 + route.pulse * 0.05, 16, 16]} />
      <meshBasicMaterial
        color={isResidual ? '#fecaca' : '#bae6fd'}
        transparent
        opacity={0.7 + route.pulse * 0.2}
        toneMapped={false}
      />
    </mesh>
  );
});

const VirtualInputRoute: React.FC<{ points: THREE.Vector3[] }> = React.memo(({ points }) => (
  <Line
    points={points}
    color="#7dd3fc"
    lineWidth={1.5}
    dashed
    dashScale={1.4}
    dashSize={0.32}
    gapSize={0.18}
    transparent
    opacity={0.78}
  />
));

export const DataFlowDemo: React.FC<{
  stops: DemoStop[];
  edges: LayoutEdge[];
  progress: number;
  texture: THREE.Texture;
  sampleMatrix: number[][];
  channels: number;
  targetClass: number;
  inputPose: DemoPose;
  t: DemoLabels;
}> = React.memo(({ stops, edges, progress, texture, sampleMatrix, channels, targetClass, inputPose, t }) => {
  if (!stops.length) return null;

  const segment = getSegmentState(stops, progress, inputPose.position);
  const operationActive = !!segment.activeStop && hasOperationDemo(segment.activeStop.node.op_type);
  const packetRoutes = getDataPacketRoutes(stops, segment, edges);
  const easedOperationProgress = getEasedSegmentProgress(segment.segmentProgress);
  const virtualInputRoutePoints = useMemo(
    () => [inputPose.position, stops[0].position],
    [inputPose.position, stops],
  );

  return (
    <group>
      <DemoInputTile
        texture={texture}
        channels={channels}
        position={inputPose.position}
        rotation={inputPose.rotation}
        size={inputPose.size}
        label={t.input}
      />
      <VirtualInputRoute points={virtualInputRoutePoints} />
      {packetRoutes.map((route, index) => (
        <DataPacket key={`${route.kind}-${index}`} route={route} />
      ))}
      {segment.activeStop && operationActive && (
        <OperationDemo
          node={segment.activeStop.node}
          segmentProgress={clamp01((easedOperationProgress - 0.10) / 0.90)}
          sampleMatrix={sampleMatrix}
          targetClass={targetClass}
          t={t}
        />
      )}
    </group>
  );
});

const DemoIcon: React.FC<{ playing: boolean }> = ({ playing }) => (
  playing
    ? <Pause className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
    : <Play className="h-3.5 w-3.5 fill-current" strokeWidth={1.8} aria-hidden="true" />
);

const DemoStepIcon: React.FC<{ direction: 'prev' | 'next' }> = ({ direction }) => (
  direction === 'prev'
    ? <SkipBack className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
    : <SkipForward className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
);

export const DemoControls: React.FC<{
  stops: DemoStop[];
  progress: number;
  playing: boolean;
  dataUrl?: string;
  animationSpeed: number;
  t: DemoLabels;
  onProgressChange: (progress: number) => void;
  onPlayingChange: (playing: boolean) => void;
  onAnimationSpeedChange: (speed: number) => void;
  availableExercises?: ExerciseDefinition[];
  onSelectExercise?: (exerciseId: ExerciseId) => void;
}> = React.memo(({
  stops,
  progress,
  playing,
  dataUrl,
  animationSpeed,
  t,
  onProgressChange,
  onPlayingChange,
  onAnimationSpeedChange,
  availableExercises = [],
  onSelectExercise,
}) => {
  if (!stops.length) return null;

  const maxProgress = stops.length;
  const segment = getSegmentState(stops, progress);
  const selectedIndex = segment.activeStopIndex < 0 ? 0 : segment.activeStopIndex + 1;
  const progressPct = maxProgress > 0 ? Math.round((progress / maxProgress) * 100) : 0;

  const stepBy = (delta: number) => {
    onPlayingChange(false);
    const base = Math.abs(progress - Math.round(progress)) < 0.000001
      ? progress + delta
      : delta > 0
        ? Math.ceil(progress)
        : Math.floor(progress);
    onProgressChange(THREE.MathUtils.clamp(base, 0, maxProgress));
  };

  const speedMultiplier = animationSpeed / DEMO_PLAY_SPEED;

  return (
    <div data-tour="mnist-demo-controls" className="absolute left-4 top-4 z-30 w-[min(20rem,calc(100%-5.5rem))] rounded-lg border border-white/15 bg-zinc-950/72 shadow-2xl backdrop-blur-md pointer-events-auto">
      <div className="flex items-center gap-2.5 px-2.5 py-2 border-b border-white/10">
        <div className="w-9 h-9 rounded-md overflow-hidden border border-sky-300/40 bg-black shrink-0">
          {dataUrl && <img src={dataUrl} alt="" className="w-full h-full object-cover [image-rendering:pixelated]" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase text-sky-200 tracking-wider leading-none">{t.title}</p>
          <div className="mt-1 flex items-center gap-2 text-[10px] font-mono tabular-nums">
            <span className="text-zinc-300">{progressPct}%</span>
            <span className="text-zinc-600">/</span>
            <span className="text-sky-100">{speedMultiplier.toFixed(1)}x</span>
          </div>
        </div>
      </div>

      <div className="px-2.5 py-2 flex flex-col gap-2">
        <div className="grid grid-cols-[6.75rem_minmax(0,1fr)] gap-2">
          <div className="rounded-md border border-zinc-700/60 bg-zinc-950/55 p-1.5">
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                className="h-8 flex items-center justify-center rounded-md border border-zinc-600/70 bg-zinc-900/70 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                onClick={() => stepBy(-1)}
                title={t.previous}
                aria-label={t.previous}
              >
                <DemoStepIcon direction="prev" />
              </button>
              <button
                data-tour="mnist-demo-play"
                type="button"
                className="h-8 flex items-center justify-center rounded-md border border-sky-400/60 bg-sky-500/20 text-sky-100 hover:bg-sky-500/30 transition-colors"
                onClick={() => {
                  if (playing) {
                    onPlayingChange(false);
                    return;
                  }
                  if (progress >= maxProgress) onProgressChange(0);
                  onPlayingChange(true);
                }}
                title={playing ? t.pause : t.play}
                aria-label={playing ? t.pause : t.play}
              >
                <DemoIcon playing={playing} />
              </button>
              <button
                type="button"
                className="h-8 flex items-center justify-center rounded-md border border-zinc-600/70 bg-zinc-900/70 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                onClick={() => stepBy(1)}
                title={t.next}
                aria-label={t.next}
              >
                <DemoStepIcon direction="next" />
              </button>
            </div>
          </div>

          <div className="rounded-md border border-zinc-700/60 bg-zinc-950/55 px-2 py-1.5 flex items-center">
            <div className="flex w-full items-center gap-2">
              <span className="w-12 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400 leading-none">
                {t.speed}
              </span>
              <input
                id="mnist-demo-speed"
                className="min-w-0 flex-1 accent-sky-400"
                type="range"
                min={MIN_ANIMATION_SPEED}
                max={MAX_ANIMATION_SPEED}
                step={0.05}
                value={animationSpeed}
                aria-label={t.speed}
                onChange={(event) => onAnimationSpeedChange(Number(event.currentTarget.value))}
              />
              <span className="w-8 text-right text-[10px] font-mono text-sky-100 tabular-nums">
                {speedMultiplier.toFixed(1)}x
              </span>
            </div>
          </div>
        </div>

        <div className={availableExercises.length ? 'grid grid-cols-[1fr_1.1fr] gap-2' : 'grid grid-cols-1 gap-2'}>
          <div className="min-w-0 rounded-md border border-zinc-700/60 bg-zinc-950/55 p-1.5 flex flex-col justify-between">
            <span className="block px-0.5 pb-1 text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-500">
              {t.step}
            </span>
            <select
              className="h-8 w-full min-w-0 rounded-md border border-zinc-600/70 bg-zinc-950/80 px-2 text-xs text-zinc-200 outline-none focus:border-sky-400"
              value={selectedIndex}
              aria-label={t.jumpTo}
              onChange={(event) => {
                onPlayingChange(false);
                onProgressChange(Number(event.currentTarget.value));
              }}
            >
              <option value={0}>{t.input}</option>
              {stops.map((stop, index) => (
                <option key={stop.node.id} value={index + 1}>
                  {index + 1}. {stop.label}
                </option>
              ))}
            </select>
          </div>
          {availableExercises.length && onSelectExercise ? (
            <ExerciseLauncher exercises={availableExercises} t={t} onSelectExercise={onSelectExercise} />
          ) : null}
        </div>
      </div>
    </div>
  );
});
