import test from 'node:test';
import assert from 'node:assert/strict';
import type { LearningLesson } from '../core/learning/types.ts';
import { resolveVisibleLearningLesson } from '../core/learning/visibleLesson.ts';

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

test('keeps route lesson as detail while rail filter points at first visible lesson', () => {
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
});

test('uses first domain lesson when route has no lesson', () => {
  const first = lesson('first');
  const result = resolveVisibleLearningLesson({
    routeSelectedLesson: null,
    firstFilteredLesson: null,
    filteredLessonIds: new Set(),
    isLessonRailFiltered: false,
    firstDomainLesson: first,
  });

  assert.equal(result.detailLesson?.id, 'first');
  assert.equal(result.railLesson?.id, 'first');
});
