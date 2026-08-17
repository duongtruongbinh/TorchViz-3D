import test from 'node:test';
import assert from 'node:assert/strict';
import type { LearningLesson } from '../core/learning/types.ts';
import { resolveRailLearningLesson } from '../components/learning/lesson/visibleLesson.ts';

function lesson(id: string): LearningLesson {
  return {
    id,
    domainId: 'cv',
    trackId: 'cnn-shape-value',
    status: 'available',
    contentStatus: 'missing',
    tags: [],
    entryPoints: [],
    sections: [],
  };
}

test('visible lesson policy relies on route resolution instead of inventing a detail lesson', () => {
  const route = lesson('route');
  const firstFiltered = lesson('filtered');
  const result = resolveRailLearningLesson({
    routeSelectedLesson: route,
    firstFilteredLesson: firstFiltered,
    filteredLessonIds: new Set(['filtered']),
    isLessonRailFiltered: true,
  });

  assert.equal(result?.id, 'filtered');

  const fallback = resolveRailLearningLesson({
    routeSelectedLesson: null,
    firstFilteredLesson: null,
    filteredLessonIds: new Set(),
    isLessonRailFiltered: false,
  });

  assert.equal(fallback, null);
});
