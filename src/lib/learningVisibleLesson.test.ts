import test from 'node:test';
import assert from 'node:assert/strict';
import type { LearningLesson } from '../core/learning/types.ts';
import { resolveVisibleLearningLesson } from '../components/learning/lesson/visibleLesson.ts';

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

test('visible lesson policy preserves routes and falls back to the first domain lesson', () => {
  const route = lesson('route');
  const firstFiltered = lesson('filtered');
  const result = resolveVisibleLearningLesson({
    routeSelectedLesson: route,
    firstFilteredLesson: firstFiltered,
    filteredLessonIds: new Set(['filtered']),
    isLessonRailFiltered: true,
    firstDomainLesson: lesson('first'),
  });

  assert.equal(result.detailLesson?.id, 'route');
  assert.equal(result.railLesson?.id, 'filtered');
  assert.equal(result.shouldNavigateToDetailLesson, false);

  const first = lesson('first');
  const fallback = resolveVisibleLearningLesson({
    routeSelectedLesson: null,
    firstFilteredLesson: null,
    filteredLessonIds: new Set(),
    isLessonRailFiltered: false,
    firstDomainLesson: first,
  });

  assert.equal(fallback.detailLesson?.id, 'first');
  assert.equal(fallback.railLesson?.id, 'first');
});
