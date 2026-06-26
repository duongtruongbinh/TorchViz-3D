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

export function getLegacyReinforcementLearningRedirectPath(trackId?: string): string {
  if (trackId === 'robot-learning') return getLearningDomainPath('robot-learning');
  if (trackId === 'reinforcement-learning') return getLearningDomainPath('reinforcement-learning');
  return getLearningTrackPath('reinforcement-learning', trackId ?? 'tabular-control');
}
