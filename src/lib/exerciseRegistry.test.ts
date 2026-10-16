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

test('registry maps supported operation families to exercise ids', () => {
  const cases: Array<[string, string[]]> = [
    ['Conv2d', ['shape-output', 'conv-value']],
    ['MaxPool', ['shape-output', 'pool-value']],
    ['AvgPool2d', ['shape-output', 'pool-value']],
    ['AdaptiveAvgPool', ['shape-output']],
    ['Linear', ['linear-value']],
    ['ReLU', ['activation-value']],
    ['BatchNorm', ['shape-output']],
    ['MultiheadAttention', ['attention-shape']],
    ['Dropout', []],
  ];
  for (const [opType, expected] of cases) {
    assert.deepEqual(getExercisesForNode(node(opType)).map((exercise) => exercise.id), expected, opType);
  }
});

test('reviewable Learning lesson entry points reference registered exercise surfaces', () => {
  for (const lesson of getReviewableLearningLessons(learningCatalog)) {
    for (const entryPoint of lesson.entryPoints) {
      assert.ok(getExerciseById(entryPoint.exerciseId as ExerciseId), `missing exercise ${entryPoint.exerciseId}`);
    }
  }
});
