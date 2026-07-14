import test from 'node:test';
import assert from 'node:assert/strict';
import type { LayoutNode } from './irTypes.ts';
import {
  getExerciseById,
  getExercisesForNode,
} from '../components/exercises/exerciseRegistry.ts';
import { learningCatalog } from '../content/learning/index.ts';
import { getReviewableLearningLessons } from '../core/learning/selectors.ts';
import type { ExerciseId } from '../components/exercises/types.ts';

function node(opType: string): LayoutNode {
  return {
    id: `${opType}_1`,
    name: `${opType}_1`,
    op_type: opType,
    in_shape: [],
    out_shape: [],
    params: 0,
    x: 0,
    y: 0,
    z: 0,
    width: 1,
    height: 1,
    depth: 1,
    color: '#ffffff',
    is_container: false,
    collapsed: false,
    children: [],
  };
}

test('registry exposes the existing Conv exercise by id', () => {
  const exercise = getExerciseById('conv-value');

  assert.ok(exercise);
  assert.equal(exercise.id, 'conv-value');
});

test('registry returns Shape and value exercises for convolution nodes', () => {
  assert.deepEqual(getExercisesForNode(node('Conv2d')).map((exercise) => exercise.id), ['shape-output', 'conv-value']);
});

test('registry returns Shape exercise for pool nodes', () => {
  assert.deepEqual(getExercisesForNode(node('MaxPool')).map((exercise) => exercise.id), ['shape-output', 'pool-value']);
  assert.deepEqual(getExercisesForNode(node('AvgPool2d')).map((exercise) => exercise.id), ['shape-output', 'pool-value']);
  assert.deepEqual(getExercisesForNode(node('AdaptiveAvgPool')).map((exercise) => exercise.id), ['shape-output']);
});

test('registry returns value exercises for Linear and ReLU nodes', () => {
  assert.deepEqual(getExercisesForNode(node('Linear')).map((exercise) => exercise.id), ['linear-value']);
  assert.deepEqual(getExercisesForNode(node('ReLU')).map((exercise) => exercise.id), ['activation-value']);
});

test('registry returns shape exercises for BatchNorm and Attention nodes', () => {
  assert.deepEqual(getExercisesForNode(node('BatchNorm')).map((exercise) => exercise.id), ['shape-output']);
  assert.deepEqual(getExercisesForNode(node('MultiheadAttention')).map((exercise) => exercise.id), ['attention-shape']);
});

test('registry excludes nodes without matching exercises', () => {
  assert.deepEqual(getExercisesForNode(node('Dropout')).map((exercise) => exercise.id), []);
});

test('every reviewable Learning lesson points at a registered exercise surface', () => {
  for (const lesson of getReviewableLearningLessons(learningCatalog)) {
    assert.equal(lesson.entryPoints.length, 1);
    assert.ok(getExerciseById(lesson.entryPoints[0].exerciseId as ExerciseId), `missing exercise ${lesson.entryPoints[0].exerciseId}`);
  }
});
