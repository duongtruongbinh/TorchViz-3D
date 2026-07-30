export const SHARED_LEARNING_MDX_COMPONENT_NAMES = [
  'LessonNote',
  'MdxCode',
  'MdxConceptContrast',
  'MdxFormula',
  'MdxQuiz',
  'MdxPage',
  'RequirementCard',
  'RequirementsGrid',
  'InlineMath',
  'BlockMath',
] as const;

export type LearningMdxMetadata = {
  domainId: string;
  id: string;
  locale: string;
  title: string;
  headings: string[];
  keywords: string[];
  pageCount?: number;
};

export type LearningMdxPath = {
  domainId: string;
  lessonId: string;
  locale: string;
};

export type LearningMdxSearchDocument = LearningMdxPath & {
  text: string;
};

export function parseLearningMdxPath(filePath: string): LearningMdxPath | null {
  const normalizedPath = filePath.replaceAll('\\', '/');
  const match = normalizedPath.match(/(?:^|\/)learning\/([^/]+)\/([^/]+?)\.([a-z]{2,3}(?:-[a-z0-9]+)*)\.mdx$/i);
  return match ? {
    domainId: match[1],
    lessonId: match[2].replace(/^\d+(?:\.\d+)+-/, ''),
    locale: match[3].toLowerCase(),
  } : null;
}

export function getLearningMdxComponentNames(source: string): string[] {
  const sourceWithoutCodeOrDoubleQuotedLiterals = source
    .replace(/`[^`\n]*`/g, '``')
    .replace(/"(?:\\.|[^"\\])*"/g, '""');
  return [...new Set(
    [...sourceWithoutCodeOrDoubleQuotedLiterals.matchAll(/(?<!['"])<\/?([A-Z][A-Za-z0-9]*)\b/g)].map((match) => match[1]),
  )];
}

export function getLearningMdxLocaleCandidates(
  requestedLocale: string,
  fallbackLocales: readonly string[] = [],
): string[] {
  return [...new Set([requestedLocale, ...fallbackLocales].map((locale) => locale.toLowerCase()))];
}

export function normalizeLearningSearch(value: string): string {
  return value.trim().toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
}
