import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Layers, Layers2, RefreshCcw } from 'lucide-react';
import * as THREE from 'three';
import { LayoutData } from '../../lib/irTypes';
import { usePreferencesStore } from '../../store/usePreferencesStore';
import { getStrings } from '../../lib/localization';
import { Z_INDEX_RECENTER_BUTTON } from '../../lib/constants';
import {
  DEFAULT_CAMERA_OFFSET,
  DEFAULT_CAMERA_ZOOM,
  DEFAULT_MAX_ZOOM,
  DEFAULT_MIN_ZOOM,
} from '../../lib/canvasUtils';
import { getLayoutWorldBounds, type WorldBounds } from '../../lib/renderBounds';

const DEFAULT_VIEW_PADDING = 1.15;
const CONTAIN_PADDING = 1.04;
const FIT_ANIMATION_SECONDS = 0.42;
const UP = new THREE.Vector3(0, 1, 0);

type CameraControls = {
  target?: THREE.Vector3;
  update?: () => void;
};

type FitView = {
  target: THREE.Vector3;
  position: THREE.Vector3;
  zoom: number;
};

type CameraAnimation = {
  fromPosition: THREE.Vector3;
  toPosition: THREE.Vector3;
  fromTarget: THREE.Vector3;
  toTarget: THREE.Vector3;
  fromZoom: number;
  toZoom: number;
  elapsed: number;
  duration: number;
};

function getBoundsCenter(bounds: WorldBounds): THREE.Vector3 {
  return new THREE.Vector3(
    (bounds.minX + bounds.maxX) / 2,
    (bounds.minY + bounds.maxY) / 2,
    (bounds.minZ + bounds.maxZ) / 2,
  );
}

function getBoundsCorners(bounds: WorldBounds): THREE.Vector3[] {
  return [
    new THREE.Vector3(bounds.minX, bounds.minY, bounds.minZ),
    new THREE.Vector3(bounds.minX, bounds.minY, bounds.maxZ),
    new THREE.Vector3(bounds.minX, bounds.maxY, bounds.minZ),
    new THREE.Vector3(bounds.minX, bounds.maxY, bounds.maxZ),
    new THREE.Vector3(bounds.maxX, bounds.minY, bounds.minZ),
    new THREE.Vector3(bounds.maxX, bounds.minY, bounds.maxZ),
    new THREE.Vector3(bounds.maxX, bounds.maxY, bounds.minZ),
    new THREE.Vector3(bounds.maxX, bounds.maxY, bounds.maxZ),
  ];
}

function getProjectedSize(bounds: WorldBounds, matrixWorldInverse: THREE.Matrix4) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const corner of getBoundsCorners(bounds)) {
    corner.applyMatrix4(matrixWorldInverse);
    minX = Math.min(minX, corner.x);
    maxX = Math.max(maxX, corner.x);
    minY = Math.min(minY, corner.y);
    maxY = Math.max(maxY, corner.y);
  }

  return {
    minX,
    maxX,
    minY,
    maxY,
    width: Math.max(1, maxX - minX),
    height: Math.max(1, maxY - minY),
  };
}

function getFitView(
  layout: LayoutData,
  viewport: { width: number; height: number },
  cameraOffset: THREE.Vector3,
): FitView {
  const bounds = getLayoutWorldBounds(layout, { includeEdges: true });
  const target = getBoundsCenter(bounds);
  const position = target.clone().add(cameraOffset);

  const probe = new THREE.OrthographicCamera();
  probe.position.copy(position);
  probe.up.copy(UP);
  probe.lookAt(target);
  probe.updateMatrixWorld();

  const projected = getProjectedSize(bounds, probe.matrixWorldInverse);
  const zoom = THREE.MathUtils.clamp(
    Math.min(
      DEFAULT_CAMERA_ZOOM,
      viewport.width / (projected.width * DEFAULT_VIEW_PADDING),
      viewport.height / (projected.height * DEFAULT_VIEW_PADDING),
    ),
    DEFAULT_MIN_ZOOM,
    DEFAULT_MAX_ZOOM,
  );

  return { target, position, zoom };
}

function getCurrentOffset(camera: THREE.Camera, controls: CameraControls | undefined): THREE.Vector3 {
  const target = controls?.target ?? new THREE.Vector3();
  const offset = camera.position.clone().sub(target);
  return offset.lengthSq() > 0.0001 ? offset : DEFAULT_CAMERA_OFFSET.clone();
}

function isLayoutContained(
  camera: THREE.Camera,
  layout: LayoutData,
  viewport: { width: number; height: number },
): boolean {
  if (!(camera instanceof THREE.OrthographicCamera)) return false;
  const bounds = getLayoutWorldBounds(layout, { includeEdges: true });
  camera.updateMatrixWorld();
  const projected = getProjectedSize(bounds, camera.matrixWorldInverse);
  const halfW = viewport.width / (2 * camera.zoom);
  const halfH = viewport.height / (2 * camera.zoom);
  return (
    projected.minX * CONTAIN_PADDING >= -halfW &&
    projected.maxX * CONTAIN_PADDING <= halfW &&
    projected.minY * CONTAIN_PADDING >= -halfH &&
    projected.maxY * CONTAIN_PADDING <= halfH
  );
}

function setCameraView(
  camera: THREE.Camera,
  controls: CameraControls | undefined,
  view: FitView,
) {
  camera.position.copy(view.position);
  if (camera instanceof THREE.OrthographicCamera || camera instanceof THREE.PerspectiveCamera) {
    camera.zoom = view.zoom;
    camera.updateProjectionMatrix();
  }
  controls?.target?.copy(view.target);
  controls?.update?.();
}

function getCurrentZoom(camera: THREE.Camera): number {
  return camera instanceof THREE.OrthographicCamera || camera instanceof THREE.PerspectiveCamera
    ? camera.zoom
    : DEFAULT_CAMERA_ZOOM;
}

export function applyDefaultView(
  camera: THREE.Camera,
  controls: CameraControls | undefined,
  layout: LayoutData,
  viewport: { width: number; height: number },
) {
  setCameraView(camera, controls, getFitView(layout, viewport, DEFAULT_CAMERA_OFFSET.clone()));
}

export const CameraFitController: React.FC<{
  layout: LayoutData;
  graphRevision: number;
  layoutRevision: number;
  manualFitToken: number;
}> = React.memo(({ layout, graphRevision, layoutRevision, manualFitToken }) => {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls) as CameraControls | undefined;
  const size = useThree((state) => state.size);
  const invalidate = useThree((state) => state.invalidate);
  const previous = useRef({ graphRevision: -1, layoutRevision: -1, manualFitToken });
  const previousSize = useRef({ width: size.width, height: size.height });
  const animation = useRef<CameraAnimation | null>(null);

  const startAnimation = (view: FitView, duration = FIT_ANIMATION_SECONDS) => {
    animation.current = {
      fromPosition: camera.position.clone(),
      toPosition: view.position,
      fromTarget: controls?.target?.clone() ?? new THREE.Vector3(),
      toTarget: view.target,
      fromZoom: getCurrentZoom(camera),
      toZoom: view.zoom,
      elapsed: 0,
      duration,
    };
    invalidate();
  };

  useFrame((_, delta) => {
    const active = animation.current;
    if (!active) return;

    active.elapsed += delta;
    const t = Math.min(1, active.elapsed / active.duration);
    const eased = 1 - Math.pow(1 - t, 3);

    camera.position.lerpVectors(active.fromPosition, active.toPosition, eased);
    controls?.target?.lerpVectors(active.fromTarget, active.toTarget, eased);
    if (camera instanceof THREE.OrthographicCamera || camera instanceof THREE.PerspectiveCamera) {
      camera.zoom = THREE.MathUtils.lerp(active.fromZoom, active.toZoom, eased);
      camera.updateProjectionMatrix();
    }
    controls?.update?.();
    invalidate();

    if (t >= 1) {
      setCameraView(camera, controls, {
        position: active.toPosition,
        target: active.toTarget,
        zoom: active.toZoom,
      });
      animation.current = null;
    }
  });

  useEffect(() => {
    if (!controls) return;

    const graphChanged = previous.current.graphRevision !== graphRevision;
    const layoutChanged = previous.current.layoutRevision !== layoutRevision;
    const sizeChanged = previousSize.current.width !== size.width || previousSize.current.height !== size.height;
    previousSize.current = { width: size.width, height: size.height };

    if (graphChanged) {
      previous.current.graphRevision = graphRevision;
      previous.current.layoutRevision = layoutRevision;
      animation.current = null;
      setCameraView(camera, controls, getFitView(layout, size, DEFAULT_CAMERA_OFFSET.clone()));
      invalidate();
      return;
    }

    if (layoutChanged) {
      previous.current.layoutRevision = layoutRevision;
      startAnimation(getFitView(layout, size, DEFAULT_CAMERA_OFFSET.clone()));
      return;
    }

    if (sizeChanged && !isLayoutContained(camera, layout, size)) {
      previous.current.layoutRevision = layoutRevision;
      const offset = getCurrentOffset(camera, controls);
      const fit = getFitView(layout, size, offset);
      startAnimation({
        ...fit,
        zoom: Math.min(getCurrentZoom(camera), fit.zoom),
      });
      return;
    }

    previous.current.layoutRevision = layoutRevision;
  }, [layout, graphRevision, layoutRevision, camera, controls, size, invalidate]);

  useEffect(() => {
    if (!controls || manualFitToken === previous.current.manualFitToken) return;
    previous.current.manualFitToken = manualFitToken;
    startAnimation(getFitView(layout, size, DEFAULT_CAMERA_OFFSET.clone()));
  }, [layout, manualFitToken, camera, controls, size, invalidate]);

  return null;
});

const ToolbarButton: React.FC<{
  title: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ title, disabled = false, onClick, children }) => (
  <button
    type="button"
    className="w-8 h-8 flex items-center justify-center bg-zinc-900/55 hover:bg-zinc-800/75 disabled:bg-zinc-900/30 border border-zinc-600/60 text-zinc-300 disabled:text-zinc-600 rounded-md shadow-md backdrop-blur-sm transition-all hover:text-white disabled:cursor-not-allowed select-none"
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-label={title}
  >
    {children}
  </button>
);

export const ArchitectureControls: React.FC<{
  disabled: boolean;
  showRecenter: boolean;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onRecenter: () => void;
}> = React.memo(({ disabled, showRecenter, onExpandAll, onCollapseAll, onRecenter }) => {
  const language = usePreferencesStore((s) => s.language);
  const t = getStrings(language);

  return (
    <Html
      position={[0, 0, 0]}
      style={{ pointerEvents: 'auto' }}
      zIndexRange={[Z_INDEX_RECENTER_BUTTON, 0]}
      calculatePosition={(_, __, { width }) => [width - (showRecenter ? 120 : 84), 16]}
    >
      <div
        data-tour="reset-view"
        className="h-10 px-1 flex items-center gap-1 rounded-lg border border-white/15 bg-black/10"
      >
        <ToolbarButton title={t.inspector.expandAll} disabled={disabled} onClick={onExpandAll}>
          <Layers className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton title={t.inspector.collapseAll} disabled={disabled} onClick={onCollapseAll}>
          <Layers2 className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
        </ToolbarButton>
        {showRecenter && (
          <ToolbarButton title={t.inspector.resetCameraView} onClick={onRecenter}>
            <RefreshCcw className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
          </ToolbarButton>
        )}
      </div>
    </Html>
  );
});
