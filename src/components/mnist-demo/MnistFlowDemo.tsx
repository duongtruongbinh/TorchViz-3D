import React, { useEffect, useMemo } from 'react';
import { Billboard, Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import { clamp01, getEasedSegmentProgress } from '../../lib/mnistAnimation';
import type { LayoutEdge } from '../../lib/irTypes';
import type { getStrings } from '../../lib/localization';
import {
  DEMO_PLAY_SPEED,
  DEMO_MNIST_MATRIX,
} from '../operation-effects/effectData';
import type { DemoStop } from '../operation-effects/effectMath';
import {
  getDataPacketRoute,
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

const MIN_ANIMATION_SPEED = 0.25;
const MAX_ANIMATION_SPEED = 2.5;

type DemoLabels = ReturnType<typeof getStrings>['canvas']['demo'];

export { DEMO_PLAY_SPEED };

/**
 * Creates texture canvas directly from canonical 8x8 matrix
 * to ensure 100% semantic consistency.
 */
function createMnistCanvasFromMatrix(matrix: number[][], size = 112): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const rows = matrix.length;
  const cols = matrix[0].length;
  const cellW = size / cols;
  const cellH = size / rows;

  // Background
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, size, size);

  // Draw scaled cells matching the active color palette logic
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const val = matrix[r][c];
      if (val > 0.001) {
        const red = Math.floor((0.03 + val * 0.70) * 255);
        const green = Math.floor((0.06 + val * 0.82) * 255);
        const blue = Math.floor((0.10 + val * 0.92) * 255);
        ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
      }
    }
  }

  // Add low-res screen/pixel glow structure
  ctx.globalCompositeOperation = 'screen';
  for (let y = 0; y < size; y += 4) {
    for (let x = 0; x < size; x += 4) {
      const n = (x * 17 + y * 31) % 19;
      if (n !== 0 && n !== 7) continue;
      ctx.fillStyle = n === 0 ? 'rgba(255,255,255,0.045)' : 'rgba(125,178,232,0.035)';
      ctx.fillRect(x, y, 4, 4);
    }
  }
  ctx.globalCompositeOperation = 'source-over';

  return canvas;
}

export function useMnistTexture() {
  const mnist = useMemo(() => {
    const canvas = createMnistCanvasFromMatrix(DEMO_MNIST_MATRIX);
    if (!canvas) return null;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.needsUpdate = true;
    return { texture, dataUrl: canvas.toDataURL('image/png') };
  }, []);

  useEffect(() => () => {
    mnist?.texture.dispose();
  }, [mnist]);

  return mnist;
}

const DemoInputTile: React.FC<{
  texture: THREE.Texture;
  position: THREE.Vector3;
  rotation: [number, number, number];
  size: [number, number];
  label: string;
}> = React.memo(({ texture, position, rotation, size, label }) => {
  const [w, h] = size;
  return (
    <group position={position} rotation={rotation}>
      {/* Background Plane */}
      <mesh position={[0, 0, -0.035]}>
        <planeGeometry args={[w + 0.35, h + 0.35]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.92} toneMapped={false} />
      </mesh>
      {/* MNIST Plane (fixed world mesh) */}
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* Label Text remains billboarded for camera readability */}
      <Billboard position={[0, -h / 2 - 0.42, 0]} renderOrder={RENDER_ORDER_INPUT_TILE_BILLBOARD}>
        <Text
          {...TEXT_BASE_PROPS}
          fontSize={0.34}
          color="#dbeafe"
          outlineWidth={0.018}
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
  return (
    <mesh position={route.position} renderOrder={RENDER_ORDER_DATA_PACKET}>
      <sphereGeometry args={[0.18 + route.pulse * 0.05, 16, 16]} />
      <meshBasicMaterial color="#bae6fd" transparent opacity={0.7 + route.pulse * 0.2} toneMapped={false} />
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
  inputPose: DemoPose;
  t: DemoLabels;
}> = React.memo(({ stops, edges, progress, texture, inputPose, t }) => {
  if (!stops.length) return null;

  const segment = getSegmentState(stops, progress, inputPose.position);
  const operationActive = !!segment.activeStop && hasOperationDemo(segment.activeStop.node.op_type);
  const packetRoute = getDataPacketRoute(stops, segment, edges);
  const easedOperationProgress = getEasedSegmentProgress(segment.segmentProgress);
  const virtualInputRoutePoints = useMemo(
    () => [inputPose.position, stops[0].position],
    [inputPose.position, stops],
  );

  return (
    <group>
      <DemoInputTile
        texture={texture}
        position={inputPose.position}
        rotation={inputPose.rotation}
        size={inputPose.size}
        label={t.input}
      />
      <VirtualInputRoute points={virtualInputRoutePoints} />
      {packetRoute && <DataPacket route={packetRoute} />}
      {segment.activeStop && operationActive && (
        <OperationDemo
          node={segment.activeStop.node}
          segmentProgress={clamp01((easedOperationProgress - 0.10) / 0.90)}
          t={t}
        />
      )}
    </group>
  );
});

const DemoIcon: React.FC<{ playing: boolean }> = ({ playing }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
    {playing ? (
      <path d="M6.25 4.5A1.25 1.25 0 0 1 7.5 5.75v8.5a1.25 1.25 0 1 1-2.5 0v-8.5A1.25 1.25 0 0 1 6.25 4.5Zm7 0a1.25 1.25 0 0 1 1.25 1.25v8.5a1.25 1.25 0 1 1-2.5 0v-8.5a1.25 1.25 0 0 1 1.25-1.25Z" />
    ) : (
      <path d="M6.5 4.4v11.2c0 .6.66.96 1.16.63l8.35-5.6a.75.75 0 0 0 0-1.25L7.66 3.77A.75.75 0 0 0 6.5 4.4Z" />
    )}
  </svg>
);

const DemoStepIcon: React.FC<{ direction: 'prev' | 'next' }> = ({ direction }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
    {direction === 'prev' ? (
      <path d="M5.25 4.75A.75.75 0 0 1 6 5.5v3.18l6.35-3.93a.75.75 0 0 1 1.15.64v9.22a.75.75 0 0 1-1.15.64L6 11.32v3.18a.75.75 0 0 1-1.5 0v-9a.75.75 0 0 1 .75-.75Z" />
    ) : (
      <path d="M14.75 4.75A.75.75 0 0 0 14 5.5v3.18L7.65 4.75a.75.75 0 0 0-1.15.64v9.22a.75.75 0 0 0 1.15.64L14 11.32v3.18a.75.75 0 0 0 1.5 0v-9a.75.75 0 0 0-.75-.75Z" />
    )}
  </svg>
);

export const DemoControls: React.FC<{
  stops: DemoStop[];
  progress: number;
  playing: boolean;
  dataUrl?: string;
  animationSpeed: number;
  exerciseSupported?: boolean;
  t: DemoLabels;
  onProgressChange: (progress: number) => void;
  onPlayingChange: (playing: boolean) => void;
  onAnimationSpeedChange: (speed: number) => void;
  onOpenExercise?: () => void;
}> = React.memo(({
  stops,
  progress,
  playing,
  dataUrl,
  animationSpeed,
  exerciseSupported = false,
  t,
  onProgressChange,
  onPlayingChange,
  onAnimationSpeedChange,
  onOpenExercise,
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
    <div className="absolute left-4 top-4 z-30 w-[min(20rem,calc(100%-5.5rem))] rounded-lg border border-white/15 bg-zinc-950/72 shadow-2xl backdrop-blur-md pointer-events-auto">
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

        <div className="grid grid-cols-2 gap-2">
          <div className="min-w-0 rounded-md border border-zinc-700/60 bg-zinc-950/55 p-1.5">
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

          <div className={`min-w-0 rounded-md p-1.5 ${
            exerciseSupported
              ? 'border border-emerald-300/25 bg-emerald-400/10'
              : 'border border-zinc-700/60 bg-zinc-950/55'
          }`} title={exerciseSupported ? undefined : t.noExercisesTooltip}>
            <span className={`block px-0.5 pb-1 text-[9px] font-bold uppercase tracking-[0.18em] ${
              exerciseSupported ? 'text-emerald-300/80' : 'text-zinc-500'
            }`}>
              {t.exercises}
            </span>
            <select
              className={`h-8 w-full min-w-0 rounded-md border px-2 text-xs outline-none transition-colors ${
                exerciseSupported
                  ? 'border-emerald-300/45 bg-emerald-950/45 text-emerald-100 focus:border-emerald-300'
                  : 'border-zinc-700/70 bg-zinc-900/50 text-zinc-500 cursor-not-allowed'
              }`}
              value=""
              disabled={!exerciseSupported}
              aria-label={t.exercises}
              title={exerciseSupported ? t.chooseExercise : t.noExercisesTooltip}
              onChange={(event) => {
                if (!event.currentTarget.value) return;
                onOpenExercise?.();
              }}
            >
              <option value="">{exerciseSupported ? t.chooseExercise : t.noExercises}</option>
              {exerciseSupported && <option value="conv">{t.convExercise}</option>}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
});
