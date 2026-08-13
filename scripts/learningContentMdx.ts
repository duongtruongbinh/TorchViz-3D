import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import type { Plugin } from 'vite';
import {
  parseLearningMdxPath,
  type LearningMdxMetadata,
  type LearningMdxSearchDocument,
} from '../src/core/learning/mdxContract.ts';
import { getAllowedLearningMdxComponentNames } from '../src/content/learning/mdxComponents.ts';
import type { LearningCatalog } from '../src/core/learning/types.ts';

const STRUCTURAL_KEYS = new Set([
  'id', 'kind', 'locale', 'domainId', 'sectionRefId', 'image', 'href', 'depth', 'mode',
  'interactionPlacement', 'categoryId', 'correctOrder', 'isCorrect', 'compact',
  'hideUnsortedLabel', 'page', 'pageCount', 'step', 'icon',
  'evidence',
  'opType', 'inputShape', 'outputShape', 'config', 'kernel', 'stride', 'padding', 'dilation',
]);
const ALLOWED_EXPORTS = new Set(['lessonMetadata']);

type Node = { type?: string; name?: string; value?: unknown; children?: Node[]; attributes?: Node[]; data?: { estree?: Node }; body?: Node[]; declarations?: Node[]; id?: Node; init?: Node; key?: Node; computed?: boolean; properties?: Node[]; elements?: Array<Node | null>; expression?: Node; argument?: Node; operator?: string; source?: Node };

function walk(node: Node | null | undefined, visit: (node: Node, parent?: Node) => void, parent?: Node): void {
  if (!node || typeof node !== 'object') return;
  visit(node, parent);
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach((child) => walk(child as Node, visit, node));
    else if (value && typeof value === 'object') walk(value as Node, visit, node);
  }
}

function propertyName(node: Node | undefined): string | null {
  if (!node) return null;
  if (node.type === 'Identifier') return node.name ?? null;
  if (node.type === 'Literal' && typeof node.value === 'string') return node.value;
  return null;
}

function assertStaticExpression(node: Node | null | undefined, label: string): void {
  if (!node) throw new Error(`${label}: empty MDX expression`);
  if (node.type === 'Literal') return;
  if (node.type === 'ArrayExpression') {
    node.elements?.forEach((item) => assertStaticExpression(item, label));
    return;
  }
  if (node.type === 'ObjectExpression') {
    node.properties?.forEach((property) => {
      if (property.type !== 'Property' || property.computed) throw new Error(`${label}: unsupported object property`);
      if (!propertyName(property.key)) throw new Error(`${label}: invalid object key`);
      assertStaticExpression(property.value as Node, label);
    });
    return;
  }
  if (node.type === 'UnaryExpression' && node.operator === '-' && typeof node.argument?.value === 'number') return;
  throw new Error(`${label}: executable or unsupported MDX expression (${node.type ?? 'unknown'})`);
}

function stringsFromExpression(node: Node | null | undefined, output: string[], parentKey?: string): void {
  if (!node) return;
  if (node.type === 'Literal' && typeof node.value === 'string' && !STRUCTURAL_KEYS.has(parentKey ?? '')) {
    output.push(node.value);
    return;
  }
  if (node.type === 'Identifier') return;
  if (node.type === 'Property') {
    const key = propertyName(node.key) ?? parentKey;
    stringsFromExpression(node.value as Node, output, key ?? undefined);
    return;
  }
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach((child) => stringsFromExpression(child as Node, output, parentKey));
    else if (value && typeof value === 'object') stringsFromExpression(value as Node, output, parentKey);
  }
}

function staticValue(node: Node | null | undefined): unknown {
  if (!node) return undefined;
  if (node.type === 'Literal') return node.value;
  if (node.type === 'ArrayExpression') return node.elements?.map(staticValue) ?? [];
  if (node.type === 'ObjectExpression') return Object.fromEntries((node.properties ?? []).map((property) => [propertyName(property.key)!, staticValue(property.value as Node)]));
  if (node.type === 'UnaryExpression' && node.operator === '-') return -Number(staticValue(node.argument));
  return undefined;
}

export type LearningMdxInspection = {
  metadata: Record<string, unknown>;
  pageIndexes: number[];
  quizQuestionIds: string[];
  quizQuestions: LearningMdxQuizQuestionInspection[];
  cvExerciseFixtures: unknown[];
  paperReferenceIds: string[];
  citationReferences: LearningMdxCitationInspection[];
  searchText: string;
};

export type LearningMdxCitationInspection = {
  paperId: string;
  locator?: string;
  evidenceId?: string;
};

export type LearningMdxQuizQuestionInspection = {
  id: string;
  mode: string;
  optionCount: number;
  correctOptionIndexes: number[];
};

export async function inspectLearningMdx(
  source: string,
  filePath: string,
  domainId = parseLearningMdxPath(filePath)?.domainId ?? '',
): Promise<LearningMdxInspection> {
  const allowedComponents = new Set(getAllowedLearningMdxComponentNames(domainId));
  const searchParts: string[] = [];
  let metadataExports = 0;
  let metadata: Record<string, unknown> = {};
  const pageIndexes: number[] = [];
  const quizQuestionIds: string[] = [];
  const quizQuestions: LearningMdxQuizQuestionInspection[] = [];
  const cvExerciseFixtures: unknown[] = [];
  const paperReferenceIds: string[] = [];
  const citationReferences: LearningMdxCitationInspection[] = [];
  await compile(source, {
    remarkPlugins: [remarkGfm, () => (tree: Node) => {
      walk(tree, (node) => {
        if (node.type === 'text' && typeof node.value === 'string') searchParts.push(node.value);
        if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
          if (!node.name || !allowedComponents.has(node.name)) {
            throw new Error(`${filePath}: unexpected MDX component ${node.name ?? '<fragment>'}`);
          }
          if (node.name === 'Cite') {
            const attributes = new Map((node.attributes ?? []).flatMap((attribute) => {
              if (!attribute.name) return [];
              const expression = attribute.value && typeof attribute.value === 'object'
                ? (attribute.value as Node).data?.estree?.body?.[0]?.expression
                : undefined;
              return [[attribute.name, typeof attribute.value === 'string' ? attribute.value : staticValue(expression)]];
            }));
            const paperId = attributes.get('paper');
            if (typeof paperId === 'string') {
              const locator = attributes.get('locator');
              const evidenceId = attributes.get('evidence');
              citationReferences.push({
                paperId,
                ...(typeof locator === 'string' ? { locator } : {}),
                ...(typeof evidenceId === 'string' ? { evidenceId } : {}),
              });
            }
          }
          for (const attribute of node.attributes ?? []) {
            if (attribute.type === 'mdxJsxExpressionAttribute') throw new Error(`${filePath}: spread attributes are not allowed`);
            if (typeof attribute.value === 'string' && !STRUCTURAL_KEYS.has(attribute.name ?? '')) searchParts.push(attribute.value);
            const expression = attribute.value && typeof attribute.value === 'object'
              ? (attribute.value as Node).data?.estree?.body?.[0]?.expression
              : undefined;
            if ((node.name === 'Cite' || node.name === 'PaperSummary') && attribute.name === 'paper') {
              const paperId = typeof attribute.value === 'string' ? attribute.value : staticValue(expression);
              if (typeof paperId === 'string') paperReferenceIds.push(paperId);
            }
            if (!expression) continue;
            assertStaticExpression(expression, filePath);
            stringsFromExpression(expression, searchParts, attribute.name);
            if (node.name === 'MdxPage' && attribute.name === 'page') pageIndexes.push(Number(staticValue(expression)));
            if (node.name === 'MdxQuiz' && attribute.name === 'questions') {
              const questions = staticValue(expression) as Array<{
                id?: unknown;
                mode?: unknown;
                options?: Array<{ isCorrect?: unknown }>;
              }>;
              for (const question of questions) {
                const options = Array.isArray(question.options) ? question.options : [];
                const id = String(question.id ?? '');
                quizQuestionIds.push(id);
                quizQuestions.push({
                  id,
                  mode: String(question.mode ?? ''),
                  optionCount: options.length,
                  correctOptionIndexes: options.flatMap((option, index) => option.isCorrect === true ? [index] : []),
                });
              }
            }
            if (node.name === 'CvExercise' && attribute.name === 'fixture') {
              cvExerciseFixtures.push(staticValue(expression));
            }
          }
        }
        if (node.type !== 'mdxjsEsm') return;
        const program = node.data?.estree;
        for (const statement of program?.body ?? []) {
          if (statement.type === 'ImportDeclaration' || statement.type === 'ExportAllDeclaration' || statement.source) {
            throw new Error(`${filePath}: MDX imports/re-exports are not allowed`);
          }
          if (statement.type !== 'ExportNamedDeclaration' || !(statement as Node & { declaration?: Node }).declaration) {
            throw new Error(`${filePath}: only named data exports are allowed`);
          }
          const declaration = (statement as Node & { declaration: Node }).declaration;
          if (declaration.type !== 'VariableDeclaration' || (declaration as Node & { kind?: string }).kind !== 'const') {
            throw new Error(`${filePath}: exports must be const data`);
          }
          for (const item of declaration.declarations ?? []) {
            const name = item.id?.name;
            if (!name || !ALLOWED_EXPORTS.has(name)) throw new Error(`${filePath}: unexpected export ${name ?? '<unknown>'}`);
            assertStaticExpression(item.init, filePath);
            stringsFromExpression(item.init, searchParts);
            if (name === 'lessonMetadata') {
              metadataExports += 1;
              metadata = staticValue(item.init) as Record<string, unknown>;
            }
          }
        }
      });
    }],
  });
  if (metadataExports !== 1) throw new Error(`${filePath}: expected exactly one lessonMetadata export`);
  return {
    metadata,
    pageIndexes,
    quizQuestionIds,
    quizQuestions,
    cvExerciseFixtures,
    paperReferenceIds,
    citationReferences,
    searchText: [...new Set(searchParts.map((value) => value.trim()).filter(Boolean))].join(' '),
  };
}

export function discoverLearningMdxFiles(contentRoot: string): string[] {
  const files: string[] = [];
  const visit = (directory: string) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(entryPath);
      else if (entry.isFile() && entry.name.endsWith('.mdx')) files.push(entryPath);
    }
  };
  visit(contentRoot);
  return files.sort();
}

export async function validateLearningMdxFiles(
  filePaths: readonly string[],
  catalog: LearningCatalog,
): Promise<LearningMdxSearchDocument[]> {
  const documents: LearningMdxSearchDocument[] = [];
  const localeKeys = new Set<string>();
  for (const filePath of filePaths) {
    const document = await validateLearningMdxSource(readFileSync(filePath, 'utf8'), filePath, catalog);
    const localeKey = `${document.domainId}:${document.lessonId}:${document.locale}`;
    if (localeKeys.has(localeKey)) throw new Error(`${filePath}: duplicate lesson locale ${localeKey}`);
    localeKeys.add(localeKey);
    documents.push(document);
  }

  for (const lesson of catalog.lessons.filter((item) => item.contentStatus === 'published')) {
    if (!documents.some((document) => document.domainId === lesson.domainId && document.lessonId === lesson.id)) {
      throw new Error(`${lesson.domainId}/${lesson.id}: published lesson has no locale-specific MDX file`);
    }
  }
  return documents;
}

export async function validateLearningMdxSource(
  source: string,
  filePath: string,
  catalog: LearningCatalog,
): Promise<LearningMdxSearchDocument> {
  const parsed = parseLearningMdxPath(filePath);
  if (!parsed) throw new Error(`${filePath}: expected src/content/learning/<domain>/<lesson>.<locale>.mdx`);
  const domain = catalog.domains.find((item) => item.id === parsed.domainId);
  if (!domain) throw new Error(`${filePath}: unknown Learning Lab domain ${parsed.domainId}`);
  const lesson = catalog.lessons.find((item) => item.domainId === parsed.domainId && item.id === parsed.lessonId);
  if (!lesson) throw new Error(`${filePath}: lesson does not exist in the catalog`);
  if (lesson.contentStatus !== 'published') {
    throw new Error(`${filePath}: lesson is not published for MDX content`);
  }
  const inspection = await inspectLearningMdx(source, filePath, parsed.domainId);
  assertLearningMdxMetadata(inspection.metadata, parsed, filePath);
  const catalogTitle = (lesson.text?.title as Record<string, string> | undefined)?.[parsed.locale];
  if (catalogTitle && inspection.metadata.title !== catalogTitle) {
    throw new Error(`${filePath}: metadata title does not match the catalog title for ${parsed.locale}`);
  }
  const pageCount = Number(inspection.metadata.pageCount ?? 1);
  if (inspection.pageIndexes.length) {
    const expectedPages = Array.from({ length: pageCount }, (_, index) => index);
    if (JSON.stringify(inspection.pageIndexes) !== JSON.stringify(expectedPages)) throw new Error(`${filePath}: invalid or missing MDX page indexes`);
  }
  if (pageCount > 1 && !inspection.pageIndexes.length && !inspection.quizQuestionIds.length) {
    throw new Error(`${filePath}: multi-page lessons require explicit MdxPage indexes or one quiz question per page`);
  }
  if (inspection.quizQuestionIds.length) {
    if (inspection.quizQuestionIds.some((id) => !id) || inspection.quizQuestionIds.length !== pageCount || new Set(inspection.quizQuestionIds).size !== pageCount) {
      throw new Error(`${filePath}: quiz question ids must be unique and match pageCount`);
    }
  }
  const isCvExerciseLesson = lesson.tags.includes('exercise') && lesson.domainId === 'cv';
  if (isCvExerciseLesson) {
    if (lesson.entryPoints.length !== 1 || inspection.cvExerciseFixtures.length !== 1) {
      throw new Error(`${filePath}: CV exercise lessons require one catalog entry point and one CvExercise fixture`);
    }
    assertCvExerciseFixture(inspection.cvExerciseFixtures[0], lesson.entryPoints[0].operationFamily, filePath);
  } else if (inspection.cvExerciseFixtures.length) {
    throw new Error(`${filePath}: CvExercise is only allowed on tagged CV exercise lessons`);
  }
  return { ...parsed, text: inspection.searchText };
}

function assertCvExerciseFixture(value: unknown, operationFamily: string, filePath: string): void {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${filePath}: CvExercise fixture must be an object`);
  const fixture = value as Record<string, unknown>;
  const opType = fixture.opType;
  if (typeof opType !== 'string') throw new Error(`${filePath}: CvExercise fixture opType is required`);
  for (const key of ['inputShape', 'outputShape'] as const) {
    const shape = fixture[key];
    if (!Array.isArray(shape) || shape.length !== 4 || shape.some((item) => typeof item !== 'number' || item <= 0)) {
      throw new Error(`${filePath}: CvExercise fixture ${key} must be a positive NCHW shape`);
    }
  }
  const actualFamily = /conv2d/i.test(opType)
    ? 'conv2d'
    : /maxpool(?:2d)?|avgpool(?:2d)?/i.test(opType)
      ? 'pool2d'
      : null;
  if (actualFamily !== operationFamily) throw new Error(`${filePath}: CvExercise fixture operation does not match its catalog entry point`);
}

function assertLearningMdxMetadata(
  metadata: Record<string, unknown>,
  parsed: { domainId: string; lessonId: string; locale: string },
  filePath: string,
): asserts metadata is LearningMdxMetadata {
  if (metadata.domainId !== parsed.domainId || metadata.id !== parsed.lessonId || metadata.locale !== parsed.locale) {
    throw new Error(`${filePath}: metadata does not match its domain path and filename`);
  }
  if (typeof metadata.title !== 'string' || !metadata.title.trim()) throw new Error(`${filePath}: title is required`);
  for (const key of ['headings', 'keywords'] as const) {
    const values = metadata[key];
    if (!Array.isArray(values) || !values.length || values.some((value) => typeof value !== 'string' || !value.trim())) {
      throw new Error(`${filePath}: ${key} must be a non-empty string array`);
    }
  }
  if (metadata.conceptIds !== undefined) {
    const conceptIds = metadata.conceptIds;
    if (!Array.isArray(conceptIds) || !conceptIds.length || conceptIds.some((value) => typeof value !== 'string' || !value.trim())) {
      throw new Error(`${filePath}: conceptIds must be a non-empty string array when provided`);
    }
    if (new Set(conceptIds).size !== conceptIds.length) {
      throw new Error(`${filePath}: conceptIds must be unique`);
    }
  }
  if (metadata.referenceIds !== undefined) {
    const referenceIds = metadata.referenceIds;
    if (!Array.isArray(referenceIds) || !referenceIds.length || referenceIds.some((value) => typeof value !== 'string' || !value.trim())) {
      throw new Error(`${filePath}: referenceIds must be a non-empty string array when provided`);
    }
    if (new Set(referenceIds).size !== referenceIds.length) {
      throw new Error(`${filePath}: referenceIds must be unique`);
    }
  }
  const pageCount = Number(metadata.pageCount ?? 1);
  if (!Number.isInteger(pageCount) || pageCount < 1) throw new Error(`${filePath}: pageCount must be a positive integer`);
}

export function learningMdxSearchPlugin(contentRoot: string, catalog: LearningCatalog): Plugin {
  const virtualId = 'virtual:learning-mdx-search-documents';
  const resolvedId = `\0${virtualId}`;
  return {
    name: 'torchviz-learning-mdx-search',
    resolveId(id) { return id === virtualId ? resolvedId : null; },
    async load(id) {
      if (id !== resolvedId) return null;
      const documents = await validateLearningMdxFiles(discoverLearningMdxFiles(contentRoot), catalog);
      return `export default ${JSON.stringify(documents)};`;
    },
  };
}
