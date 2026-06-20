import test from 'node:test';
import assert from 'node:assert/strict';
import { getStrings } from './localization.ts';

test('help guide covers the current core workflows concisely in both languages', () => {
  const en = getStrings('en').help;
  const vi = getStrings('vi').help;

  assert.equal(en.workflow, 'Workflow');
  assert.equal(en.workflowItems.length, 3);
  assert.equal(en.canvasItems.length, 3);
  assert.equal(en.blockItems.length, 3);
  assert.equal(en.mnistItems.length, 3);
  assert.equal(en.exportItems.length, 2);

  assert.equal(vi.workflow, 'Quy trình');
  assert.equal(vi.workflowItems.length, en.workflowItems.length);
  assert.equal(vi.canvasItems.length, en.canvasItems.length);
  assert.equal(vi.blockItems.length, en.blockItems.length);
  assert.equal(vi.mnistItems.length, en.mnistItems.length);
  assert.equal(vi.exportItems.length, en.exportItems.length);
});
