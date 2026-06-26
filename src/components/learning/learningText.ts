import { learningCatalog } from '../../core/learning/content';
import type {
  LearningDomain,
  LearningDomainId,
  LearningLesson,
  LearningPracticeRef,
  LearningTrack,
} from '../../core/learning/types';
import {
  getLearningLessonText,
  getLearningPracticeText,
  getStrings,
  type Language,
} from '../../lib/localization';

type BasicText = {
  title: string;
  description: string;
};

export function getDomainText(language: Language, domain: LearningDomain): BasicText {
  const strings = getStrings(language).learningLab;
  const domains = strings.domains as Record<string, BasicText>;
  return domains[domain.textKey] ?? { title: domain.id, description: '' };
}

export function getTrackText(language: Language, track: LearningTrack): BasicText {
  const strings = getStrings(language).learningLab;
  const tracks = strings.tracks as Record<string, BasicText>;
  return tracks[track.textKey] ?? { title: track.id, description: '' };
}

export function getDomainTextById(language: Language, domainId: LearningDomainId): BasicText {
  const domain = learningCatalog.domains.find((item) => item.id === domainId);
  return domain ? getDomainText(language, domain) : { title: domainId, description: '' };
}

export function getUnifiedLessonText(language: Language, lesson: LearningLesson) {
  const strings = getStrings(language);
  if (lesson.domainId === 'reinforcement-learning') {
    const lessons = strings.reinforcementLearning.lessons as Record<string, LessonText>;
    return lessons[toContentKey(lesson.id)] ?? { title: lesson.id, eyebrow: '', duration: '', theory: [] };
  }
  return getLearningLessonText(strings.learningLab, lesson);
}

export function getUnifiedPracticeText(language: Language, practice: LearningPracticeRef) {
  const strings = getStrings(language);
  if (practice.family === 'reinforcement-learning') {
    const practiceItems = strings.reinforcementLearning.practiceItems as Record<string, PracticeText>;
    return practiceItems[toContentKey(practice.id)] ?? { title: practice.id };
  }
  if (practice.family === 'tensor') {
    return getLearningPracticeText(strings.learningLab, practice);
  }
  return { title: practice.id };
}

type LessonText = {
  title: string;
  eyebrow: string;
  duration: string;
  theory: string[];
};

type PracticeText = {
  title: string;
};

function toContentKey(id: string): string {
  return id.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}
