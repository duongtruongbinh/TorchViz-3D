import type {
  LearningCatalog,
  LearningDomainId,
  LearningDomainReadiness,
  LearningDomainReadinessState,
  LearningHomeDomainSummary,
  LearningLesson,
  LearningRouteAlias,
  LearningTrack,
} from './types.ts';

export type { LearningDomainReadiness, LearningDomainReadinessState };

export type LearningExerciseLessonTarget = {
  domainId: LearningDomainId;
  trackId: string;
  lessonId: string;
};

export function getReviewableLearningLessons(catalog: LearningCatalog): LearningLesson[] {
  return catalog.lessons.filter((lesson) => (
    lesson.contentStatus === 'published' && lesson.tags.includes('exercise')
  ));
}

export function resolveLearningExerciseLessonTarget(
  catalog: LearningCatalog,
  { exerciseId, operation }: { exerciseId: string; operation: string },
): LearningExerciseLessonTarget | null {
  const operationFamily = getLearningExerciseOperationFamily(operation);
  if (!operationFamily) return null;
  const lesson = getReviewableLearningLessons(catalog).find((candidate) => (
    candidate.entryPoints.some((entryPoint) => (
      entryPoint.kind === 'torchviz-exercise'
      && entryPoint.exerciseId === exerciseId
      && entryPoint.operationFamily === operationFamily
    ))
  ));
  return lesson ? { domainId: lesson.domainId, trackId: lesson.trackId, lessonId: lesson.id } : null;
}

function getLearningExerciseOperationFamily(operation: string): 'conv2d' | 'pool2d' | null {
  if (/conv2d/i.test(operation)) return 'conv2d';
  if (/maxpool(?:2d)?|avgpool(?:2d)?/i.test(operation)) return 'pool2d';
  return null;
}

export function getLearningDomain(catalog: LearningCatalog, domainId: LearningDomainId) {
  return catalog.domains.find((domain) => domain.id === domainId) ?? null;
}

export function getDomainReadinessState(catalog: LearningCatalog, domainId: LearningDomainId): LearningDomainReadinessState {
  const domain = getLearningDomain(catalog, domainId);
  if (domain?.status === 'placeholder') return 'unupdated';
  if (domain?.status === 'partial') return 'updating';
  const lessons = catalog.lessons.filter((lesson) => lesson.domainId === domainId);
  if (lessons.length === 0) return 'unupdated';
  const publishedCount = lessons.filter((lesson) => lesson.contentStatus === 'published').length;
  if (publishedCount === lessons.length) return 'ready';
  if (publishedCount > 0) return 'updating';
  return 'unupdated';
}

const READINESS_STATE_RANK: Record<LearningDomainReadinessState, number> = {
  ready: 0,
  updating: 1,
  unupdated: 2,
};

export function getLearningDomainReadiness(catalog: LearningCatalog): LearningDomainReadiness[] {
  return catalog.domains
    .map((domain, catalogIndex) => {
      const readinessState = getDomainReadinessState(catalog, domain.id);
      return {
        domain,
        catalogIndex,
        isReady: readinessState === 'ready',
        readinessState,
      };
    })
    .sort((left, right) => (
      READINESS_STATE_RANK[left.readinessState] - READINESS_STATE_RANK[right.readinessState]
      || left.catalogIndex - right.catalogIndex
    ))
    .map(({ domain, isReady, readinessState }) => ({ domain, isReady, readinessState }));
}

export function getLearningHomeDomainSummaries(catalog: LearningCatalog): LearningHomeDomainSummary[] {
  const lessonCountByDomain = new Map<LearningDomainId, number>();
  for (const lesson of catalog.lessons) {
    lessonCountByDomain.set(lesson.domainId, (lessonCountByDomain.get(lesson.domainId) ?? 0) + 1);
  }
  return getLearningDomainReadiness(catalog).map(({ domain, isReady, readinessState }) => ({
    domain,
    lessonCount: lessonCountByDomain.get(domain.id) ?? 0,
    isReady,
    readinessState,
  }));
}

export function isDomainReady(catalog: LearningCatalog, domainId: LearningDomainId): boolean {
  return getDomainReadinessState(catalog, domainId) === 'ready';
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
