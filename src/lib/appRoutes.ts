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

export function getLearningLessonPath(domainId: string, trackId: string, lessonId: string): string {
  return `${getLearningTrackPath(domainId, trackId)}?lesson=${encodeURIComponent(lessonId)}`;
}

export function getHashRouterUrl(currentUrl: string, appPath: string): string {
  const url = new URL(currentUrl);
  url.hash = `#${appPath.startsWith('/') ? appPath : `/${appPath}`}`;
  return url.toString();
}

export function getLegacyReinforcementLearningRedirectPath(trackId?: string): string {
  if (trackId === 'robot-learning') return getLearningDomainPath('robot-learning');
  if (trackId === 'reinforcement-learning') return getLearningDomainPath('reinforcement-learning');
  if (trackId === 'tabular-control') return getLearningTrackPath('reinforcement-learning', 'rl-fundamentals');
  if (trackId === 'policy-behavior') return getLearningTrackPath('reinforcement-learning', 'value-based-methods');
  return getLearningTrackPath('reinforcement-learning', trackId ?? 'rl-fundamentals');
}
