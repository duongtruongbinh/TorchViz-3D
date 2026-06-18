import React, { useEffect, useMemo } from 'react';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import { clamp01, getEasedSegmentProgress } from '../../lib/mnistAnimation';
import type { LayoutEdge } from '../../lib/irTypes';
import type { getStrings } from '../../lib/localization';
import {
  DEMO_INPUT_TILE_SIZE,
  DEMO_PLAY_SPEED,
} from '../operation-effects/effectData';
import type { DemoStop } from '../operation-effects/effectMath';
import {
  getDataPacketRoute,
  getSegmentState,
  type DataPacketRoute,
} from '../operation-effects/effectMath';
import {
  hasOperationEffect as hasOperationDemo,
  OperationEffect as OperationDemo,
} from '../operation-effects';

const FONT_URL = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff';
const MIN_ANIMATION_SPEED = 0.25;
const MAX_ANIMATION_SPEED = 2.5;

const textBaseProps = {
  font: FONT_URL,
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

type DemoLabels = ReturnType<typeof getStrings>['canvas']['demo'];

export { DEMO_PLAY_SPEED };

function createMnistCanvas(size = 112): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null;

  const source = document.createElement('canvas');
  source.width = 28;
  source.height = 28;
  const sourceCtx = source.getContext('2d');
  if (!sourceCtx) return null;

  sourceCtx.fillStyle = '#030712';
  sourceCtx.fillRect(0, 0, 28, 28);
  sourceCtx.lineCap = 'round';
  sourceCtx.lineJoin = 'round';
  sourceCtx.strokeStyle = '#f8fafc';
  sourceCtx.shadowColor = '#ffffff';
  sourceCtx.shadowBlur = 1.2;
  sourceCtx.lineWidth = 3.2;
  sourceCtx.beginPath();
  sourceCtx.moveTo(7.5, 8.0);
  sourceCtx.bezierCurveTo(10.0, 4.6, 18.4, 4.4, 20.4, 8.1);
  sourceCtx.bezierCurveTo(23.1, 13.0, 15.7, 15.1, 11.0, 19.2);
  sourceCtx.bezierCurveTo(9.3, 20.7, 7.8, 22.1, 6.4, 23.8);
  sourceCtx.lineTo(21.8, 23.8);
  sourceCtx.stroke();

  sourceCtx.globalAlpha = 0.35;
  sourceCtx.lineWidth = 1.4;
  sourceCtx.beginPath();
  sourceCtx.moveTo(8.0, 8.7);
  sourceCtx.bezierCurveTo(11.0, 7.0, 16.5, 7.1, 19.0, 9.2);
  sourceCtx.stroke();
  sourceCtx.globalAlpha = 1;

  const output = document.createElement('canvas');
  output.width = size;
  output.height = size;
  const ctx = output.getContext('2d');
  if (!ctx) return null;
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(source, 0, 0, size, size);

  ctx.globalCompositeOperation = 'screen';
  for (let y = 0; y < 28; y++) {
    for (let x = 0; x < 28; x++) {
      const n = (x * 17 + y * 31) % 19;
      if (n !== 0 && n !== 7) continue;
      ctx.fillStyle = n === 0 ? 'rgba(255,255,255,0.045)' : 'rgba(125,178,232,0.035)';
      ctx.fillRect(x * 4, y * 4, 4, 4);
    }
  }
  ctx.globalCompositeOperation = 'source-over';

  return output;
}

export function useMnistTexture() {
  const mnist = useMemo(() => {
    const canvas = createMnistCanvas();
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

const MnistPlane: React.FC<{ texture: THREE.Texture; size: number }> = ({ texture, size }) => (
  <mesh>
    <planeGeometry args={[size, size]} />
    <meshBasicMaterial map={texture} toneMapped={false} />
  </mesh>
);

const DemoInputTile: React.FC<{ texture: THREE.Texture; position: THREE.Vector3; label: string }> = ({ texture, position, label }) => (
  <Billboard position={position.toArray()} renderOrder={2100}>
    <group>
      <mesh position={[0, 0, -0.035]}>
        <planeGeometry args={[DEMO_INPUT_TILE_SIZE + 0.35, DEMO_INPUT_TILE_SIZE + 0.35]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.92} toneMapped={false} />
      </mesh>
      <MnistPlane texture={texture} size={DEMO_INPUT_TILE_SIZE} />
      <Text
        {...textBaseProps}
        fontSize={0.34}
        color="#dbeafe"
        outlineWidth={0.018}
        position={[0, -DEMO_INPUT_TILE_SIZE / 2 - 0.42, 0]}
        renderOrder={2101}
      >
        {label}
      </Text>
    </group>
  </Billboard>
);

const DataPacket: React.FC<{
  route: DataPacketRoute;
}> = ({ route }) => {
  return (
    <mesh position={route.position.toArray()} renderOrder={2200}>
      <sphereGeometry args={[0.18 + route.pulse * 0.05, 16, 16]} />
      <meshBasicMaterial color="#bae6fd" transparent opacity={0.7 + route.pulse * 0.2} toneMapped={false} />
    </mesh>
  );
};

export const DataFlowDemo: React.FC<{
  stops: DemoStop[];
  edges: LayoutEdge[];
  progress: number;
  texture: THREE.Texture;
  t: DemoLabels;
}> = ({ stops, edges, progress, texture, t }) => {
  if (!stops.length) return null;

  const segment = getSegmentState(stops, progress);
  const operationActive = !!segment.activeStop && hasOperationDemo(segment.activeStop.node.op_type);
  const packetRoute = getDataPacketRoute(stops, segment, edges);
  const easedOperationProgress = getEasedSegmentProgress(segment.segmentProgress);

  return (
    <group>
      <DemoInputTile texture={texture} position={segment.inputPosition} label={t.input} />
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
};

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
  t: DemoLabels;
  onProgressChange: (progress: number) => void;
  onPlayingChange: (playing: boolean) => void;
  onAnimationSpeedChange: (speed: number) => void;
}> = ({
  stops,
  progress,
  playing,
  dataUrl,
  animationSpeed,
  t,
  onProgressChange,
  onPlayingChange,
  onAnimationSpeedChange,
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
    <div className="absolute left-4 top-4 z-30 w-[min(15rem,calc(100%-5.5rem))] rounded-lg border border-white/15 bg-zinc-950/72 shadow-2xl backdrop-blur-md pointer-events-auto">
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
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-md border border-zinc-600/70 bg-zinc-900/70 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
            onClick={() => stepBy(-1)}
            title={t.previous}
            aria-label={t.previous}
          >
            <DemoStepIcon direction="prev" />
          </button>
          <button
            type="button"
            className="w-9 h-8 flex items-center justify-center rounded-md border border-sky-400/60 bg-sky-500/20 text-sky-100 hover:bg-sky-500/30 transition-colors shrink-0"
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
            className="w-8 h-8 flex items-center justify-center rounded-md border border-zinc-600/70 bg-zinc-900/70 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
            onClick={() => stepBy(1)}
            title={t.next}
            aria-label={t.next}
          >
            <DemoStepIcon direction="next" />
          </button>
          <input
            className="min-w-0 flex-1 accent-sky-400"
            type="range"
            min={0}
            max={maxProgress}
            step={0.01}
            value={progress}
            aria-label={t.scrub}
            onPointerDown={() => onPlayingChange(false)}
            onChange={(event) => {
              onPlayingChange(false);
              onProgressChange(Number(event.currentTarget.value));
            }}
          />
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_4.5rem] gap-2">
          <select
            className="h-8 min-w-0 rounded-md border border-zinc-600/70 bg-zinc-950/80 px-2 text-xs text-zinc-200 outline-none focus:border-sky-400"
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
          <div className="flex flex-col gap-1">
            <span className="px-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400 leading-none">
              {t.speed}
            </span>
            <input
              id="mnist-demo-speed"
              className="w-full accent-sky-400"
              type="range"
              min={MIN_ANIMATION_SPEED}
              max={MAX_ANIMATION_SPEED}
              step={0.05}
              value={animationSpeed}
              aria-label={t.speed}
              onChange={(event) => onAnimationSpeedChange(Number(event.currentTarget.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
