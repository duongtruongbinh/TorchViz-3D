import test from 'node:test';
import assert from 'node:assert/strict';

import { TEMPLATES, useStore } from '../store/useStore.ts';
import { WorkerService } from './workerService.ts';

class FakeWorker {
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  messages: unknown[] = [];
  terminated = false;

  postMessage(message: unknown) {
    this.messages.push(message);
  }

  emit(message: unknown) {
    this.onmessage?.({ data: message } as MessageEvent);
  }

  terminate() {
    this.terminated = true;
  }
}

function resetStore(shapeInput: string) {
  useStore.setState({
    activeTemplate: 'lenet',
    code: TEMPLATES.lenet.code.trim(),
    shapeInput,
    loading: false,
    error: null,
    criticalError: null,
  });
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test('run rejects invalid shape input instead of falling back to template shape', () => {
  resetStore('not-json');
  const worker = new FakeWorker();
  const service = new WorkerService(() => worker as unknown as Worker, 50);

  service.init();
  service.run();

  assert.equal(worker.messages.length, 0);
  assert.equal(useStore.getState().loading, false);
  assert.match(useStore.getState().error?.message ?? '', /Invalid input shape/);

  service.terminate();
});

test('run timeout terminates and recreates a stuck worker', async () => {
  resetStore('[1, 1, 32, 32]');
  const firstWorker = new FakeWorker();
  const secondWorker = new FakeWorker();
  const workers = [firstWorker, secondWorker];
  const service = new WorkerService(() => workers.shift() as unknown as Worker, 5);

  service.init();
  service.run();
  firstWorker.emit({ type: 'ready' });

  assert.equal(workers.length, 1);
  assert.equal(useStore.getState().loading, true);

  await delay(25);

  assert.equal(workers.length, 0);
  assert.equal(firstWorker.terminated, true);
  assert.equal(secondWorker.terminated, false);
  assert.equal(useStore.getState().loading, false);
  assert.equal(useStore.getState().error?.message, 'Python execution timed out.');

  service.terminate();
});

test('run timeout starts after worker ready when run is requested during init', async () => {
  resetStore('[1, 1, 32, 32]');
  const worker = new FakeWorker();
  const service = new WorkerService(() => worker as unknown as Worker, 10, 50);

  service.init();
  service.run();
  await delay(25);
  assert.equal(worker.terminated, false);
  assert.equal(useStore.getState().loading, true);

  worker.emit({ type: 'ready' });
  await delay(25);
  assert.equal(worker.terminated, true);
  assert.equal(useStore.getState().error?.message, 'Python execution timed out.');

  service.terminate();
});

test('init timeout reports runtime initialization failure before ready', async () => {
  resetStore('[1, 1, 32, 32]');
  const worker = new FakeWorker();
  const service = new WorkerService(() => worker as unknown as Worker, 50, 5);

  service.init();
  await delay(25);

  assert.equal(worker.terminated, true);
  assert.match(useStore.getState().criticalError ?? '', /Python Runtime Error/);

  service.terminate();
});
