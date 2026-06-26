import type { LearningCatalog, LearningDomainId, LearningLesson, LearningPracticeRef, LearningTrack } from './types.ts';

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
