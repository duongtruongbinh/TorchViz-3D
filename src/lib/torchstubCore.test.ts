import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  PY_INIT,
  PY_NN_INIT,
  PY_OPS,
  PY_RECORDER,
  PY_TENSOR,
} from './python_sources.ts';

function runPython(snippet: string): string {
  const root = mkdtempSync(join(tmpdir(), 'torchstub-core-'));
  const packageDir = join(root, 'torchstub');
  const nnDir = join(packageDir, 'nn');
  mkdirSync(nnDir, { recursive: true });
  writeFileSync(join(packageDir, '__init__.py'), PY_INIT);
  writeFileSync(join(packageDir, 'tensor.py'), PY_TENSOR);
  writeFileSync(join(packageDir, 'ops.py'), PY_OPS);
  writeFileSync(join(packageDir, 'recorder.py'), PY_RECORDER);
  writeFileSync(join(nnDir, '__init__.py'), PY_NN_INIT);
  writeFileSync(join(nnDir, 'functional.py'), 'from ..ops import *');

  try {
    const result = spawnSync('python3', ['-c', snippet], {
      cwd: root,
      env: { ...process.env, PYTHONPATH: root },
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    return result.stdout.trim();
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('supports requested module shape inference and rank validation', () => {
  const out = runPython(`
from torchstub import Tensor, nn
from torchstub.recorder import GraphError, get_recorder
x = Tensor((1, 4, 8, 8))
assert nn.ConvTranspose2d(4, 2, 3, stride=2, padding=1)(x).shape == (1, 2, 15, 15)
assert nn.Identity()(x).shape == x.shape
assert nn.Dropout2d(p=0.25)(x).shape == x.shape
assert nn.GroupNorm(2, 4)(x).shape == x.shape
assert nn.InstanceNorm2d(4)(x).shape == x.shape
for layer in (nn.LeakyReLU(), nn.ELU(), nn.Hardswish()):
    assert layer(x).shape == x.shape
try:
    nn.ConvTranspose2d(4, 2, 3)(Tensor((4, 8)))
except GraphError:
    data = get_recorder().to_dict()
    assert data["error_node_id"]
    assert "expects 4D" in data["nodes"][-1]["error"]
print("ok")
`);
  assert.equal(out, 'ok');
});

test('supports tuple Conv2d and Pool2d spatial parameters', () => {
  const out = runPython(`
from torchstub import Tensor, nn
x = Tensor((1, 3, 32, 28))
assert nn.Conv2d(3, 8, (3, 5), stride=(2, 1), padding=(1, 2))(x).shape == (1, 8, 16, 28)
assert nn.MaxPool2d((2, 4), stride=(2, 3), padding=(0, 1))(x).shape == (1, 3, 16, 9)
assert nn.AvgPool2d((4, 2), stride=(4, 2), padding=(0, 0))(x).shape == (1, 3, 8, 14)
print("ok")
`);
  assert.equal(out, 'ok');
});

test('handles robust flatten, reshape inference, and broadcasting Add', () => {
  const out = runPython(`
from torchstub import Tensor, add
from torchstub.ops import flatten
from torchstub.recorder import GraphError, get_recorder
x = Tensor((2, 3, 4))
assert flatten(x, 1).shape == (2, 12)
assert flatten(x, -2, -1).shape == (2, 12)
assert x.view(2, -1).shape == (2, 12)
assert x.reshape(-1, 6).shape == (4, 6)
assert add(Tensor((2, 3, 1)), Tensor((1, 3, 4))).shape == (2, 3, 4)
try:
    x.view(-1, -1)
except GraphError:
    assert "only one dimension" in get_recorder().to_dict()["nodes"][-1]["error"]
try:
    add(Tensor((2, 3)), Tensor((4, 3)))
except GraphError:
    assert "broadcast" in get_recorder().to_dict()["nodes"][-1]["error"]
try:
    flatten(x, 4)
except GraphError:
    assert "start_dim" in get_recorder().to_dict()["nodes"][-1]["error"]
print("ok")
`);
  assert.equal(out, 'ok');
});
