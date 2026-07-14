import { learningCatalog } from '../../content/learning/index.ts';
import type {
  LearningDomain,
  LearningDomainId,
  LearningLocalizedText,
  LearningLesson,
  LearningTrack,
} from '../../core/learning/types';
import {
  getLearningLessonText,
  getStrings,
  type Language,
} from '../../lib/localization';

type BasicText = {
  title: string;
  description: string;
};

export function getLearningLocalizedText(value: LearningLocalizedText, language: Language): string {
  return value[language] ?? value.en;
}

export function getDomainText(language: Language, domain: LearningDomain): BasicText {
  return {
    title: getLearningLocalizedText(domain.text.title, language),
    description: getLearningLocalizedText(domain.text.description, language),
  };
}

export function getTrackText(language: Language, track: LearningTrack): BasicText {
  return {
    title: getLearningLocalizedText(track.text.title, language),
    description: getLearningLocalizedText(track.text.description, language),
  };
}

export function getDomainTextById(language: Language, domainId: LearningDomainId): BasicText {
  const domain = learningCatalog.domains.find((item) => item.id === domainId);
  return domain ? getDomainText(language, domain) : { title: domainId, description: '' };
}

export function getUnifiedLessonText(language: Language, lesson: LearningLesson) {
  const strings = getStrings(language);
  return getLearningLessonText(strings.learningLab, lesson, language);
}
