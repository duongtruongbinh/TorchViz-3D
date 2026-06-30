export const APP_ROUTES = {
  landing: '/',
  workspace: '/workspace',
  learning: '/learning',
  learningDomain: '/learning/:domainId',
  learningTrack: '/learning/:domainId/:trackId',
  legacyReinforcementLearning: '/reinforcement-learning',
  legacyReinforcementLearningTrack: '/reinforcement-learning/roadmap/:trackId',
} as const;

export function getLearningDomainPath(domainId: string): string {
  return `/learning/${domainId}`;
}

export function getLearningTrackPath(domainId: string, trackId: string): string {
  return `/learning/${domainId}/${trackId}`;
}

export function getLearningPracticePath(target: {
  domainId: string;
  trackId: string;
  lessonId: string;
  practiceId: string;
}): string {
  const params = new URLSearchParams({
    lesson: target.lessonId,
    practice: target.practiceId,
  });
  return `${getLearningTrackPath(target.domainId, target.trackId)}?${params.toString()}`;
}

export function getHashRouterUrl(baseHref: string, appPath: string): string {
  const url = new URL(baseHref);
  url.search = '';
  url.hash = appPath.startsWith('/') ? appPath : `/${appPath}`;
  return url.toString();
}

export function getLegacyReinforcementLearningRedirectPath(trackId?: string): string {
  if (trackId === 'robot-learning') return getLearningDomainPath('robot-learning');
  if (trackId === 'reinforcement-learning') return getLearningDomainPath('reinforcement-learning');
  if (trackId === 'tabular-control') return getLearningTrackPath('reinforcement-learning', 'rl-fundamentals');
  if (trackId === 'policy-behavior') return getLearningTrackPath('reinforcement-learning', 'value-based-methods');
  return getLearningTrackPath('reinforcement-learning', trackId ?? 'rl-fundamentals');
}
