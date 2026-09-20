import assert from 'node:assert/strict';
import test from 'node:test';
import { prepareCodeBlockCopySource } from './codeBlockCopy.ts';

test('code copy is a byte-for-byte identity transform', () => {
  const source = [
    'if left == right or current != previous:',
    '    message = "==literal text=="',
    '    values = [item <= limit for item in items]',
    '',
  ].join('\n');

  assert.equal(prepareCodeBlockCopySource(source, false), source);
});

test('output copy removes presentation-only highlight markers', () => {
  assert.equal(prepareCodeBlockCopySource('accuracy: ==0.8125==', true), 'accuracy: 0.8125');
});
