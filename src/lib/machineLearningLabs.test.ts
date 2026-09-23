import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { discoverLearningMdxFiles } from '../../scripts/learningContentMdx.ts';
import { parseLearningMdxPath } from '../core/learning/mdxContract.ts';

test('Machine Learning lab code blocks match the downloadable Python implementation', () => {
  const files = discoverLearningMdxFiles('src/content/learning');
  const source = readFileSync('public/learning/fundamentals/labs/ml_labs.py', 'utf8').replaceAll('\r\n', '\n');
  const labs = [
    ['leakage-code-lab', 'leakage_lab'],
    ['linear-regression-code-lab', 'regression_lab'],
    ['mixed-classification-code-lab', 'classification_lab'],
    ['model-comparison-code-lab', 'comparison_lab'],
    ['clustering-code-lab', 'clustering_lab'],
    ['nested-cv-code-lab', 'nested_lab'],
  ];
  for (const [id, functionName] of labs) {
    const file = files.find((path) => {
      const parsed = parseLearningMdxPath(path);
      return parsed?.domainId === 'fundamentals' && parsed.lessonId === id;
    });
    assert.ok(file, id);
    const mdx = readFileSync(file, 'utf8').replaceAll('\r\n', '\n');
    const blocks = [...mdx.matchAll(/```python\n([\s\S]*?)\n```/g)].map((match) => match[1]);
    assert.ok(blocks.some((block) => block.startsWith(`def ${functionName}(`)), id);
    for (const block of blocks) assert.ok(source.includes(block), `${id}: stale Python block`);
    for (const [, asset] of mdx.matchAll(/\]\((\/learning\/fundamentals\/labs\/[^)]+)\)/g)) {
      assert.ok(existsSync(`public${asset}`), `missing download: ${asset}`);
    }
  }
});
