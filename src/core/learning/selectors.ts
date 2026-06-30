import type {
  LearningCatalog,
  LearningDomainId,
  LearningLesson,
  LearningPracticeRef,
  LearningRouteAlias,
  LearningTrack,
  TensorExerciseId,
  TensorPracticeRef,
} from './types.ts';

export function getLearningDomain(catalog: LearningCatalog, domainId: LearningDomainId) {
  return catalog.domains.find((domain) => domain.id === domainId) ?? null;
}

export function getLearningTracksForDomain(catalog: LearningCatalog, domainId: LearningDomainId): LearningTrack[] {
  const domain = getLearningDomain(catalog, domainId);
  if (!domain) return [];
  return domain.trackIds
    .map((trackId) => catalog.tracks.find((track) => track.domainId === domainId && track.id === trackId))
    .filter((track): track is LearningTrack => Boolean(track));
}

export function getLearningTrack(catalog: LearningCatalog, domainId: LearningDomainId, trackId: string) {
  return catalog.tracks.find((track) => track.domainId === domainId && track.id === trackId) ?? null;
}

export function getLearningLesson(catalog: LearningCatalog, domainId: LearningDomainId, lessonId: string) {
  return catalog.lessons.find((lesson) => lesson.domainId === domainId && lesson.id === lessonId) ?? null;
}

export function getLearningLessonsForTrack(catalog: LearningCatalog, track: LearningTrack): LearningLesson[] {
  return track.lessonIds
    .map((lessonId) => catalog.lessons.find((lesson) => lesson.domainId === track.domainId && lesson.id === lessonId))
    .filter((lesson): lesson is LearningLesson => Boolean(lesson));
}

export type GroupedLearningLessons = {
  track: LearningTrack;
  lessons: LearningLesson[];
};

export function getGroupedLearningLessonsForDomain(
  catalog: LearningCatalog,
  domainId: LearningDomainId,
): GroupedLearningLessons[] {
  const seen = new Set<string>();
  return getLearningTracksForDomain(catalog, domainId).map((track) => ({
    track,
    lessons: getLearningLessonsForTrack(catalog, track).filter((lesson) => {
      if (seen.has(lesson.id)) return false;
      seen.add(lesson.id);
      return true;
    }),
  }));
}

export function getFirstLearningLessonRoute(
  catalog: LearningCatalog,
  domainId: LearningDomainId,
  trackId?: string,
): { track: LearningTrack; lesson: LearningLesson } | null {
  const groups = getGroupedLearningLessonsForDomain(catalog, domainId);
  const orderedGroups = trackId
    ? [
      ...groups.filter((group) => group.track.id === trackId),
      ...groups.filter((group) => group.track.id !== trackId),
    ]
    : groups;
  for (const { track, lessons } of orderedGroups) {
    const lesson = lessons[0];
    if (lesson) return { track, lesson };
  }
  return null;
}

export type LearningRouteResolution = {
  track: LearningTrack;
  lesson: LearningLesson;
  isCanonical: boolean;
};

export function resolveLearningLessonRoute(
  catalog: LearningCatalog,
  {
    domainId,
    trackId,
    lessonId,
  }: {
    domainId: LearningDomainId;
    trackId?: string | null;
    lessonId?: string | null;
  },
): LearningRouteResolution | null {
  const trackAlias = trackId ? findTrackAlias(catalog, domainId, trackId) : null;
  const canonicalTrackId = trackAlias?.toTrackId ?? trackId ?? undefined;
  const lessonAlias = lessonId ? findLessonAlias(catalog, domainId, lessonId) : null;
  const canonicalLessonId = lessonAlias?.toLessonId ?? lessonId ?? undefined;
  const preferredTrackId = lessonAlias?.toTrackId ?? canonicalTrackId;

  if (canonicalLessonId) {
    const lesson = getLearningLesson(catalog, domainId, canonicalLessonId);
    if (lesson) {
      const track = getLearningTrack(catalog, domainId, lesson.trackId);
      if (track) {
        return {
          track,
          lesson,
          isCanonical: track.id === trackId && lesson.id === lessonId,
        };
      }
    }
  }

  const fallback = getFirstLearningLessonRoute(catalog, domainId, preferredTrackId);
  if (!fallback) return null;
  return {
    ...fallback,
    isCanonical: fallback.track.id === trackId && (!lessonId || fallback.lesson.id === lessonId),
  };
}

function findTrackAlias(
  catalog: LearningCatalog,
  domainId: LearningDomainId,
  trackId: string,
): LearningRouteAlias | null {
  return catalog.routeAliases?.find((alias) => (
    alias.domainId === domainId
    && alias.fromTrackId === trackId
    && Boolean(alias.toTrackId)
  )) ?? null;
}

function findLessonAlias(
  catalog: LearningCatalog,
  domainId: LearningDomainId,
  lessonId: string,
): LearningRouteAlias | null {
  return catalog.routeAliases?.find((alias) => (
    alias.domainId === domainId
    && alias.fromLessonId === lessonId
    && Boolean(alias.toLessonId)
  )) ?? null;
}

export function getLearningPracticeForDomain(catalog: LearningCatalog, domainId: LearningDomainId): LearningPracticeRef[] {
  const seen = new Set<string>();
  return catalog.lessons
    .filter((lesson) => lesson.domainId === domainId)
    .flatMap((lesson) => lesson.practice)
    .filter((practice) => {
      if (seen.has(practice.id)) return false;
      seen.add(practice.id);
      return true;
    });
}

export type LearningPracticeTarget = {
  domainId: LearningDomainId;
  trackId: string;
  lessonId: string;
  practiceId: string;
};

type ResolveTensorPracticeTargetArgs = {
  exerciseId: TensorExerciseId;
  operation: string;
};

export function resolveTensorPracticeTarget(
  catalog: LearningCatalog,
  { exerciseId, operation }: ResolveTensorPracticeTargetArgs,
): LearningPracticeTarget | null {
  const normalizedOperation = normalizePracticeText(operation);
  const candidates = catalog.lessons.flatMap((lesson) => (
    lesson.practice
      .filter((practice): practice is TensorPracticeRef => (
        practice.family === 'tensor'
        && practice.exerciseId === exerciseId
        && practice.approval?.status === 'approved'
        && Boolean(practice.approval.implementedBy)
      ))
      .map((practice) => ({
        domainId: lesson.domainId,
        trackId: lesson.trackId,
        lessonId: lesson.id,
        practiceId: practice.id,
        score: getOperationMatchScore(normalizedOperation, practice),
      }))
  ));

  const match = candidates
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score)[0] ?? null;
  if (!match) return null;
  return {
    domainId: match.domainId,
    trackId: match.trackId,
    lessonId: match.lessonId,
    practiceId: match.practiceId,
  };
}

function getOperationMatchScore(operation: string, practice: TensorPracticeRef): number {
  const target = normalizePracticeText(practice.targetOperation);
  if (!operation) return 1;
  if (target === operation) return 5;
  const targetTokens = practice.targetOperation
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .map(normalizePracticeText)
    .filter(Boolean);
  if (targetTokens.includes(operation)) return targetTokens.length > 2 ? 3 : 4;
  if (target.includes(operation) || operation.includes(target)) {
    return practice.targetOperation.includes('/') ? 3 : 4;
  }
  if (operation.includes('conv') && target.includes('conv')) return 3;
  if (operation.includes('pool') && target.includes('pool')) return 3;
  if (operation.includes('batchnorm') && target.includes('batchnorm')) return 3;
  if (operation.includes('relu') && target.includes('relu')) return 3;
  if (operation.includes('attention') && target.includes('attention')) return 3;
  return 0;
}

function normalizePracticeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}
