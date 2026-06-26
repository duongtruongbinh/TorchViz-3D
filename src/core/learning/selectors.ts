import type {
  LearningCatalog,
  LearningDomainId,
  LearningLesson,
  LearningPracticeRef,
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

export function getLearningLessonsForTrack(catalog: LearningCatalog, track: LearningTrack): LearningLesson[] {
  return track.lessonIds
    .map((lessonId) => catalog.lessons.find((lesson) => lesson.domainId === track.domainId && lesson.id === lessonId))
    .filter((lesson): lesson is LearningLesson => Boolean(lesson));
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
