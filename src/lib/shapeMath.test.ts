import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getConv2dOutputShape,
  getLinearOutputShape,
  getPassthroughOutputShape,
  getPool2dOutputShape,
  normalize2DParam,
} from './shapeMath.ts';

test('normalizes scalar and tuple 2D params', () => {
  assert.deepEqual(normalize2DParam(3), [3, 3]);
  assert.deepEqual(normalize2DParam([2, 5]), [2, 5]);
});

test('computes Conv2d output shape with stride and padding', () => {
  assert.deepEqual(getConv2dOutputShape([1, 3, 32, 32], {
    outChannels: 16,
    kernelSize: 3,
    stride: 2,
    padding: 1,
  }), [1, 16, 16, 16]);
});

test('computes Conv2d output shape with tuple params and dilation', () => {
  assert.deepEqual(getConv2dOutputShape([4, 3, 32, 28], {
    outChannels: 8,
    kernelSize: [3, 5],
    stride: [2, 1],
    padding: [1, 2],
    dilation: [2, 1],
  }), [4, 8, 15, 28]);
});

test('computes Pool2d output shape with tuple kernel and padding', () => {
  assert.deepEqual(getPool2dOutputShape([2, 6, 15, 17], {
    kernelSize: [3, 5],
    stride: [2, 3],
    padding: [1, 0],
  }), [2, 6, 8, 5]);
});

test('throws for invalid spatial output', () => {
  assert.throws(() => getConv2dOutputShape([1, 3, 4, 4], {
    outChannels: 8,
    kernelSize: 7,
  }), /invalid output/i);
});

test('computes Linear and passthrough output shapes', () => {
  assert.deepEqual(getLinearOutputShape([4, 128], 10), [4, 10]);
  assert.deepEqual(getLinearOutputShape([2, 3, 128], 64), [2, 3, 64]);
  assert.deepEqual(getPassthroughOutputShape([1, 8, 16, 16]), [1, 8, 16, 16]);
});
