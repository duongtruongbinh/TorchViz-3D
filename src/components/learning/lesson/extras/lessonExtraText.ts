import type { LearningLocalizedText } from '../../../../core/learning/types';
import type { Language } from '../../../../lib/localization';

export function text(value: LearningLocalizedText, language: Language): string {
  return value[language] ?? value.en;
}
