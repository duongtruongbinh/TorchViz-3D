import type { LearningLesson } from '../../../core/learning/types.ts';

type ResolveVisibleLearningLessonArgs = {
  routeSelectedLesson: LearningLesson | null;
  firstFilteredLesson: LearningLesson | null;
  filteredLessonIds: Set<string>;
  isLessonRailFiltered: boolean;
};

export function resolveRailLearningLesson({
  routeSelectedLesson,
  firstFilteredLesson,
  filteredLessonIds,
  isLessonRailFiltered,
}: ResolveVisibleLearningLessonArgs): LearningLesson | null {
  if (!routeSelectedLesson) return null;
  if (!isLessonRailFiltered || filteredLessonIds.has(routeSelectedLesson.id)) {
    return routeSelectedLesson;
  }
  return firstFilteredLesson ?? routeSelectedLesson;
}
