const MAX_FRAME_DELTA_MS = 80;
const PLAYBACK_STEP_SCALE = 0.5;
const STATE_SYNC_INTERVAL_MS = 33;

export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function getEasedSegmentProgress(progress: number): number {
  const t = clamp01(progress);
  return t * t * (3 - 2 * t);
}

export function getPlaybackProgress(
  currentProgress: number,
  deltaMs: number,
  animationSpeed: number,
  maxProgress: number,
): number {
  const clampedDeltaSeconds = Math.min(Math.max(deltaMs, 0), MAX_FRAME_DELTA_MS) / 1000;
  const nextProgress = currentProgress + clampedDeltaSeconds * animationSpeed * PLAYBACK_STEP_SCALE;
  return Math.min(nextProgress, maxProgress);
}

export function shouldSyncAnimationState(nowMs: number, lastSyncMs: number): boolean {
  return nowMs - lastSyncMs >= STATE_SYNC_INTERVAL_MS;
}
