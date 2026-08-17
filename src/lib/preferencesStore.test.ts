import test from 'node:test';
import assert from 'node:assert/strict';

import { usePreferencesStore } from '../store/usePreferencesStore.ts';
import { useStore } from '../store/useStore.ts';

test('language changes stay global without resetting Workspace state', () => {
  const initialLanguage = usePreferencesStore.getState().language;
  const workspaceBefore = useStore.getState();

  usePreferencesStore.getState().setLanguage(initialLanguage === 'vi' ? 'en' : 'vi');

  assert.notEqual(usePreferencesStore.getState().language, initialLanguage);
  assert.equal(useStore.getState().code, workspaceBefore.code);
  assert.equal(useStore.getState().ir, workspaceBefore.ir);
  assert.equal(useStore.getState().layout, workspaceBefore.layout);
  assert.equal(useStore.getState().selectedNodeId, workspaceBefore.selectedNodeId);

  usePreferencesStore.getState().setLanguage(initialLanguage);
});
