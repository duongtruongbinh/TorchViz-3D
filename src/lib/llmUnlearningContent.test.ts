import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { llmUnlearningCitationEvidence } from '../content/learning/llm-unlearning/citationEvidence.ts';
import { llmUnlearningPaperById, llmUnlearningLessonReferenceCoverage } from '../content/learning/llm-unlearning/papers.ts';
import { llmUnlearningLessonPairs } from '../content/learning/llm-unlearning/table-of-contents.ts';

const contentDir = path.resolve('src/content/learning/llm-unlearning');
const assetDir = path.resolve('src/assets/learning/llm-unlearning');
const mdxFiles = readdirSync(contentDir).filter((file) => file.endsWith('.mdx')).sort();
const sources = new Map(mdxFiles.map((file) => [file, readFileSync(path.join(contentDir, file), 'utf8')]));

const expectedAssets = [
  '01-unlearning-objective-overview.png',
  '01-system-prompt-bypass-doodle.png',
  '01-llm-training-megaproject-cost.png',
  '01-differential-privacy-epsilon-delta.png',
  '01-harry-potter-unlearning-concept.png',
  '02-sisa-architecture-sharding.png',
  '02-kmeans-quantized-centroids.png',
  '02-transformer-entanglement.png',
  '03-tofu-synthetic-authors.png',
  '03-tofu-dataset-splits.png',
  '03-gold-retrained-distribution.png',
  '04-gradient-ascent-fluency-collapse.png',
  '04-gradient-difference-balance-scale.png',
  '04-kl-mode-covering-vs-mode-seeking.png',
  '04-dpo-preference-pairs.png',
  '05-tripartite-evaluation-metrics.png',
  '05-tofu-empirical-behavior.png',
  '05-forget-quality-utility-pareto.png',
  '06-entangled-knowledge-representations.png',
  '06-relearning-jailbreak-probes.png',
  '06-llm-lifecycle-management.png',
] as const;

test('LLM unlearning publishes 33 theory-quiz pairs and leaves code labs unauthored', () => {
  assert.equal(mdxFiles.length, 66);
  const quizFiles = mdxFiles.filter((file) => file.includes('-quiz.vi.mdx'));
  assert.equal(quizFiles.length, 33);
  assert.equal(llmUnlearningLessonPairs.length, 33);
  assert.equal(mdxFiles.filter((file) => file.includes('code-lab')).length, 0);
  for (const file of quizFiles) {
    assert.match(sources.get(file)!, /<MdxQuiz\b/, `${file} must use MdxQuiz`);
  }
});

test('every theory node is followed by a quiz over exactly the taught concepts', () => {
  const sourceByLessonId = new Map<string, string>();
  for (const source of sources.values()) {
    const lessonId = source.match(/\bid:\s*['"]([^'"]+)['"]/)?.[1];
    assert.ok(lessonId, 'every MDX file must declare an id');
    sourceByLessonId.set(lessonId, source);
  }

  for (const pair of llmUnlearningLessonPairs) {
    const theory = sourceByLessonId.get(pair.theoryId);
    const quiz = sourceByLessonId.get(pair.quizId);
    assert.ok(theory, `missing theory ${pair.theoryId}`);
    assert.ok(quiz, `missing quiz ${pair.quizId}`);
    const taught = parseStringArray(theory, 'conceptIds');
    const assessed = parseStringArray(quiz, 'conceptIds');
    const questionIds = [...quiz.matchAll(/\{\s*id:\s*['"]([^'"]+)['"],\s*title:/g)].map((match) => match[1]);
    assert.deepEqual(assessed, taught, `${pair.quizId} metadata must match taught concepts`);
    assert.deepEqual(questionIds, taught, `${pair.quizId} questions must only assess taught concepts`);
  }
});

test('theory pages use the constrained lesson design vocabulary and remain scannable', () => {
  const allowedComponents = new Set([
    'BlockMath', 'Cite', 'ConceptFlow', 'ConceptHierarchy', 'InlineMath',
    'LessonImage', 'LessonNote', 'MdxPage',
  ]);
  for (const [file, source] of sources) {
    if (file.includes('-quiz.vi.mdx')) continue;
    const withoutInlineCode = source.replace(/`[^`\n]+`/g, '');
    const components = [...withoutInlineCode.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)].map((match) => match[1]);
    for (const component of components) {
      assert.ok(allowedComponents.has(component), `${file} uses unsupported authored component ${component}`);
    }
    for (const [pageIndex, page] of [...source.matchAll(/<MdxPage\s+page=\{\d+\}>([\s\S]*?)<\/MdxPage>/g)].map((match) => match[1]).entries()) {
      assert.equal((page.match(/^##\s+/gm) ?? []).length, 1, `${file} page ${pageIndex} must have one main idea heading`);
      assert.ok((page.match(/^###\s+/gm) ?? []).length <= 2, `${file} page ${pageIndex} has too many secondary ideas`);
      const prose = page.replace(/<[^>]+>/g, ' ').replace(/\{[\s\S]*?\}/g, ' ');
      const wordCount = prose.match(/\b[\wÀ-ỹ]+\b/g)?.length ?? 0;
      assert.ok(wordCount <= 650, `${file} page ${pageIndex} is too dense (${wordCount} prose words)`);
    }
  }
});

test('reference coverage is complete and every inline survey citation resolves without orphan evidence', () => {
  const evidenceById = new Map(llmUnlearningCitationEvidence.map((item) => [item.id, item]));
  const citedEvidenceIds = new Set<string>();
  assert.equal(llmUnlearningLessonReferenceCoverage.length, 33);
  for (const coverage of llmUnlearningLessonReferenceCoverage) {
    for (const claim of coverage.claims) {
      for (const reference of claim.papers) {
        assert.ok(llmUnlearningPaperById.has(reference.paperId), `${coverage.lessonId} references unknown paper ${reference.paperId}`);
      }
    }
  }
  for (const [file, source] of sources) {
    const lessonId = source.match(/\bid:\s*['"]([^'"]+)['"]/)?.[1];
    const citations = [...source.matchAll(/<Cite\s+paper="([^"]+)"\s+evidence="([^"]+)"\s*\/>/g)];
    if (file.includes('-quiz.vi.mdx')) {
      assert.equal(citations.length, 0, `${file} must not introduce untaught reference content`);
      continue;
    }
    for (const citation of citations) {
      const [, paperId, evidenceId] = citation;
      assert.ok(llmUnlearningPaperById.has(paperId), `${file} cites unknown paper ${paperId}`);
      const evidence = evidenceById.get(evidenceId);
      assert.ok(evidence, `${file} cites unknown evidence ${evidenceId}`);
      assert.equal(evidence.lessonId, lessonId, `${file} uses evidence owned by another lesson`);
      assert.equal(evidence.paperId, paperId, `${file} citation paper and evidence disagree`);
      citedEvidenceIds.add(evidenceId);
    }
  }
  assert.deepEqual(
    [...citedEvidenceIds].sort(),
    [...evidenceById.keys()].sort(),
    'every stored evidence record must support an inline citation',
  );
  assert.equal(citedEvidenceIds.size, 16);
  assert.doesNotMatch(
    [...sources.values()].join('\n'),
    /Survey nền tảng đặt chủ đề này trong khung LLM unlearning tổng thể/,
    'generic survey boilerplate must not return',
  );
});

test('LLM unlearning content contains no checked Markdown answers or legacy math props', () => {
  for (const [file, source] of sources) {
    assert.doesNotMatch(source, /<BlockMath\s+math=/, `${file} uses the legacy BlockMath prop`);
    assert.doesNotMatch(source, /^\s*[-*]\s+\[[xX]\]/m, `${file} contains a checked Markdown answer`);
    assert.doesNotMatch(source, /\$[^$\n]+\$/, `${file} contains raw inline math`);
  }
});

test('LLM unlearning uses every approved 16:9 illustration exactly once', () => {
  const allSource = [...sources.values()].join('\n');
  const referenced = [...allSource.matchAll(/assetPath="llm-unlearning\/([^"]+\.(?:png|webp))"/g)].map((match) => match[1]);
  assert.deepEqual(
    [...referenced].map((f) => f.replace(/\.webp$/, '.png')).sort(),
    [...expectedAssets].sort(),
  );

  for (const asset of referenced) {
    const fileBuf = readFileSync(path.join(assetDir, asset));
    if (asset.endsWith('.png')) {
      assert.equal(fileBuf.toString('ascii', 1, 4), 'PNG', `${asset} must be a PNG`);
      const width = fileBuf.readUInt32BE(16);
      const height = fileBuf.readUInt32BE(20);
      assert.ok(Math.abs(width / height - 16 / 9) < 0.02, `${asset} must be 16:9, received ${width}x${height}`);
    } else if (asset.endsWith('.webp')) {
      assert.equal(fileBuf.toString('ascii', 0, 4), 'RIFF', `${asset} must be a RIFF WebP`);
      assert.equal(fileBuf.toString('ascii', 8, 12), 'WEBP', `${asset} must be a RIFF WebP`);
    }
  }
});

test('LLM unlearning quiz answer positions are balanced across A-D', () => {
  const positions = [0, 0, 0, 0];
  for (const source of sources.values()) {
    for (const optionsMatch of source.matchAll(/options:\s*\[([\s\S]*?)\]\s*,\s*success:/g)) {
      const options = [...optionsMatch[1].matchAll(/\{[^{}]*\}/g)].map((match) => match[0]);
      const correctIndex = options.findIndex((option) => /isCorrect:\s*true/.test(option));
      if (correctIndex >= 0) positions[correctIndex] += 1;
    }
  }
  assert.equal(positions.reduce((sum, count) => sum + count, 0), 132);
  assert.ok(Math.max(...positions) - Math.min(...positions) <= 1, `unbalanced answer positions: ${positions.join(', ')}`);
});

function parseStringArray(source: string, field: string): string[] {
  const match = source.match(new RegExp(`${field}:\\s*\\[([^\\]]*)\\]`));
  assert.ok(match, `missing ${field}`);
  return [...match[1].matchAll(/['"]([^'"]+)['"]/g)].map((item) => item[1]);
}
