const APPROVED_LESSON_IDS = new Set<string>([
  'llm-from-scratch-roadmap',
  'llm-component-checkpoint-quiz',
  'minimal-llm-project-skeleton',
  'llm-data-pipeline-overview',
  'tokenization-why-it-matters',
  'tokenization-regex-tokenizer',
  'tokenization-token-ids-vocabulary',
  'tokenization-bpe-tiktoken',
  'tokenization-special-tokens',
  'tokenization-data-pipeline',
]);

export function isApprovedLesson(lessonId: string): boolean {
  return APPROVED_LESSON_IDS.has(lessonId);
}
