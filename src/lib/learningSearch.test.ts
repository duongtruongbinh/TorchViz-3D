import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { inspectLearningMdx } from '../../scripts/learningContentMdx.ts';
import { getLearningMdxLocaleCandidates, normalizeLearningSearch } from '../core/learning/mdxContract.ts';

test('learning search is case, whitespace, and Vietnamese-diacritic insensitive', () => {
  assert.equal(normalizeLearningSearch('  YÊU CẦU Chuẩn Bị  '), 'yeu cau chuan bi');
  assert.equal(normalizeLearningSearch('Đăng ký GPU'), 'dang ky gpu');
});

test('learning content search documents retain authored text but remove implementation syntax', async () => {
  const { searchText: document } = await inspectLearningMdx(`export const lessonMetadata = { domainId: 'cv', id: 'x', locale: 'vi', title: 'Setup', headings: ['Tools'], keywords: ['GPU', 'notebook'] };

<RequirementCard name="Google Colab">Bật GPU khi train.</RequirementCard>
[Document](https://example.com/setup)
`, 'fixture.mdx', 'cv');
  assert.match(document, /GPU/);
  assert.match(document, /Google Colab/);
  assert.match(document, /Bật GPU khi train/);
  assert.doesNotMatch(document, /https:|RequirementCard|lessonMetadata|keywords|name=/);
});

test('roadmap search excludes component, prop, and internal id names', async () => {
  const source = readFileSync('src/content/learning/llm-ai-engineering/llm-from-scratch-roadmap.vi.mdx', 'utf8');
  const { searchText } = await inspectLearningMdx(source, 'src/content/learning/llm-ai-engineering/roadmap.vi.mdx');
  assert.match(searchText, /Tokenization/);
  assert.doesNotMatch(searchText, /MdxRoadmap|sectionRefId|llm-roadmap-motivation/);
});

test('locale selection prefers the request and then the configured domain fallback', () => {
  assert.deepEqual(getLearningMdxLocaleCandidates('en', ['vi']), ['en', 'vi']);
  assert.deepEqual(getLearningMdxLocaleCandidates('vi', ['vi']), ['vi']);
});
