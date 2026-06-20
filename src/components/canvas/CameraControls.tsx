import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { LayoutData } from '../../lib/irTypes';
import { useStore } from '../../store/useStore';
import { getStrings } from '../../lib/localization';
import { Z_INDEX_RECENTER_BUTTON } from '../../lib/constants';
import {
  DEFAULT_CAMERA_OFFSET,
  DEFAULT_CAMERA_ZOOM,
  DEFAULT_MIN_ZOOM,
  collectLayoutNodes,
} from '../../lib/canvasUtils';

const DEFAULT_VIEW_PADDING = 0.8;

type CameraControls = {
  target?: THREE.Vector3;
  update?: () => void;
};

function getLayoutView(layout: LayoutData, viewport: { width: number; height: number }) {
  const nodes = collectLayoutNodes(layout.nodes);
  if (!nodes.length) {
    return { target: new THREE.Vector3(), zoom: DEFAULT_CAMERA_ZOOM };
  }

  const box = new THREE.Box3();
  const minPoint = new THREE.Vector3();
  const maxPoint = new THREE.Vector3();
  for (const node of nodes) {
    box.expandByPoint(minPoint.set(node.x - node.width / 2, node.y - node.height / 2, node.z - node.depth / 2));
    box.expandByPoint(maxPoint.set(node.x + node.width / 2, node.y + node.height / 2, node.z + node.depth / 2));
  }

  const size = box.getSize(new THREE.Vector3());
  const projectedWidth = Math.max(size.x + size.z * 0.7, 1);
  const projectedHeight = Math.max(size.y + size.z * 0.45, 1);
  const zoom = Math.max(
    DEFAULT_MIN_ZOOM,
    Math.min(
      DEFAULT_CAMERA_ZOOM,
      viewport.width / (projectedWidth * DEFAULT_VIEW_PADDING),
      viewport.height / (projectedHeight * DEFAULT_VIEW_PADDING),
    ),
  );

  return { target: box.getCenter(new THREE.Vector3()), zoom };
}

export function applyDefaultView(
  camera: THREE.Camera,
  controls: CameraControls | undefined,
  layout: LayoutData,
  viewport: { width: number; height: number },
) {
  const { target, zoom } = getLayoutView(layout, viewport);
  camera.position.copy(target).add(DEFAULT_CAMERA_OFFSET);
  if (camera instanceof THREE.OrthographicCamera || camera instanceof THREE.PerspectiveCamera) {
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
  }
  controls?.target?.copy(target);
  controls?.update?.();
}

export const BoundsAutoFit: React.FC<{
  layout: LayoutData;
  layoutKey: string;
  onFit: (layoutKey: string) => void;
}> = React.memo(({ layout, layoutKey, onFit }) => {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls) as CameraControls | undefined;
  const size = useThree((state) => state.size);
  const prevKey = useRef('');

  useEffect(() => {
    const viewKey = `${layoutKey}:${controls ? 'ready' : 'pending'}`;
    if (!layoutKey || !controls || viewKey === prevKey.current) return;
    prevKey.current = viewKey;
    applyDefaultView(camera, controls, layout, size);
    onFit(layoutKey);
  }, [layout, layoutKey, camera, controls, size, onFit]);

  return null;
});

export const ViewResetEffect: React.FC<{
  layout: LayoutData;
  resetViewToken: number;
}> = React.memo(({ layout, resetViewToken }) => {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls) as CameraControls | undefined;
  const size = useThree((state) => state.size);
  const prevToken = useRef(resetViewToken);

  useEffect(() => {
    if (!controls || resetViewToken === prevToken.current) return;
    prevToken.current = resetViewToken;
    applyDefaultView(camera, controls, layout, size);
  }, [layout, resetViewToken, camera, controls, size]);

  return null;
});

export const RecenterButton: React.FC<{ layout: LayoutData }> = React.memo(({ layout }) => {
  const language = useStore((s) => s.language);
  const t = getStrings(language);
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls) as CameraControls | undefined;
  const size = useThree((state) => state.size);

  const resetView = () => {
    applyDefaultView(camera, controls, layout, size);
  };

  return (
    <Html
      position={[0, 0, 0]}
      style={{ pointerEvents: 'auto' }}
      zIndexRange={[Z_INDEX_RECENTER_BUTTON, 0]}
      calculatePosition={(_, __, { width }) => [width - 48, 16]}
    >
      <div
        data-tour="reset-view"
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/15 bg-black/10"
      >
        <button
          className="w-8 h-8 flex items-center justify-center bg-zinc-900/55 hover:bg-zinc-800/75 border border-zinc-600/60 text-zinc-300 rounded-md shadow-md backdrop-blur-sm transition-all hover:text-white select-none"
          onClick={resetView}
          title={t.inspector.resetCameraView}
          aria-label={t.inspector.resetCameraView}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <path d="M3 12a9 9 0 0 1 15.3-6.4" />
            <path d="M18 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-15.3 6.4" />
            <path d="M6 21v-5h5" />
          </svg>
        </button>
      </div>
    </Html>
  );
});
