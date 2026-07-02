import type { LearningLesson } from './types.ts';

type ResolveVisibleLearningLessonArgs = {
  routeSelectedLesson: LearningLesson | null;
  firstFilteredLesson: LearningLesson | null;
  filteredLessonIds: Set<string>;
  isLessonRailFiltered: boolean;
  firstDomainLesson: LearningLesson | null;
};

export function resolveVisibleLearningLesson({
  routeSelectedLesson,
  firstFilteredLesson,
  filteredLessonIds,
  isLessonRailFiltered,
  firstDomainLesson,
}: ResolveVisibleLearningLessonArgs) {
  const detailLesson = routeSelectedLesson ?? firstFilteredLesson ?? firstDomainLesson;
  const railLesson = routeSelectedLesson
    && (!isLessonRailFiltered || filteredLessonIds.has(routeSelectedLesson.id))
    ? routeSelectedLesson
    : firstFilteredLesson ?? routeSelectedLesson ?? firstDomainLesson;

  return {
    detailLesson,
    railLesson,
    shouldNavigateToDetailLesson: false,
  };
}
