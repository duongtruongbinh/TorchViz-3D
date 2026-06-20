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

test('maps wrapped syntax errors on user line 1 and line 5 back to editor lines', () => {
  const preambleLineCount = 6;

  assert.equal(mapWrappedPythonLineToUserLine(7, preambleLineCount), 1);
  assert.equal(mapWrappedPythonLineToUserLine(11, preambleLineCount), 5);
});

test('maps runtime errors inside forward back to the original user line', () => {
  const preambleLineCount = 6;

  assert.equal(mapWrappedPythonLineToUserLine(21, preambleLineCount), 15);
});

test('clamps wrapper/internal runtime errors to the first user line', () => {
  assert.equal(mapWrappedPythonLineToUserLine(4, 6), 1);
});
