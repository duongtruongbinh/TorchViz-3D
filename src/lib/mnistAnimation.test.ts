import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getEasedSegmentProgress,
  getPlaybackProgress,
  shouldSyncAnimationState,
} from './mnistAnimation.ts';

test('animation math covers easing, playback clamping, and state-sync throttling', () => {
  assert.equal(getEasedSegmentProgress(0), 0);
  assert.equal(getEasedSegmentProgress(1), 1);

  const early = getEasedSegmentProgress(0.25);
  const middle = getEasedSegmentProgress(0.5);
  const late = getEasedSegmentProgress(0.75);

  assert.ok(early > 0.1 && early < 0.3);
  assert.equal(middle, 0.5);
  assert.ok(late > 0.7 && late < 0.9);
  assert.equal(Number(getPlaybackProgress(1, 10, 1, 4).toFixed(3)), 1.005);
  assert.equal(Number(getPlaybackProgress(1, 10, 4, 4).toFixed(3)), 1.02);
  assert.equal(Number(getPlaybackProgress(1, 1000, 1, 4).toFixed(3)), 1.04);
  assert.equal(getPlaybackProgress(3.99, 1000, 1, 4), 4);
  assert.equal(shouldSyncAnimationState(100, 0), true);
  assert.equal(shouldSyncAnimationState(110, 100), false);
  assert.equal(shouldSyncAnimationState(134, 100), true);
});
