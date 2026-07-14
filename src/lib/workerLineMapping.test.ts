import test from 'node:test';
import assert from 'node:assert/strict';
import {
  countPythonPreambleLines,
  mapWrappedPythonLineToUserLine,
} from './workerLineMapping.ts';

test('counts the generated Python preamble instead of relying on a hard-coded offset', () => {
  const preamble = `import torchstub
import torchstub.nn as nn
import torchstub.nn.functional as F
from torchstub import Tensor
import math

`;

  assert.equal(countPythonPreambleLines(preamble), 6);
});

test('maps syntax, runtime, and wrapper lines back to editor lines', () => {
  const preambleLineCount = 6;
  const cases = [
    { wrapped: 7, expected: 1, label: 'syntax line 1' },
    { wrapped: 11, expected: 5, label: 'syntax line 5' },
    { wrapped: 21, expected: 15, label: 'runtime line 15' },
    { wrapped: 4, expected: 1, label: 'wrapper clamp' },
  ];
  for (const scenario of cases) {
    assert.equal(mapWrappedPythonLineToUserLine(scenario.wrapped, preambleLineCount), scenario.expected, scenario.label);
  }
});
