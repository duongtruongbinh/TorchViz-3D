import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { inspectLearningMdx } from '../../scripts/learningContentMdx.ts';
import { getLearningMdxLocaleCandidates, normalizeLearningSearch } from '../core/learning/mdxContract.ts';

test('learning search normalizes queries and resolves locale fallback order', () => {
  assert.equal(normalizeLearningSearch('  YÊU CẦU Chuẩn Bị  '), 'yeu cau chuan bi');
  assert.equal(normalizeLearningSearch('Đăng ký GPU'), 'dang ky gpu');
  assert.deepEqual(getLearningMdxLocaleCandidates('en', ['vi']), ['en', 'vi']);
  assert.deepEqual(getLearningMdxLocaleCandidates('vi', ['vi']), ['vi']);
  assert.deepEqual(getLearningMdxLocaleCandidates('vi', ['en']), ['vi', 'en']);
});

test('authored search documents retain prose and remove implementation syntax', async () => {
  const { searchText: document } = await inspectLearningMdx(`export const lessonMetadata = { domainId: 'cv', id: 'x', locale: 'vi', title: 'Setup', headings: ['Tools'], keywords: ['GPU', 'notebook'] };

<RequirementCard name="Google Colab">Bật GPU khi train.</RequirementCard>
[Document](https://example.com/setup)
`, 'fixture.mdx', 'cv');
  assert.match(document, /GPU/);
  assert.match(document, /Google Colab/);
  assert.match(document, /Bật GPU khi train/);
  assert.doesNotMatch(document, /https:|RequirementCard|lessonMetadata|keywords|name=/);

  const source = readFileSync('src/content/learning/llm-ai-engineering/1.1.2-llm-from-scratch-roadmap.vi.mdx', 'utf8');
  const { searchText } = await inspectLearningMdx(source, 'src/content/learning/llm-ai-engineering/roadmap.vi.mdx');
  assert.match(searchText, /Tokenization/);
  assert.doesNotMatch(searchText, /MdxRoadmap|sectionRefId|llm-roadmap-motivation/);
});
