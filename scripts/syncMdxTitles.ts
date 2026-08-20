import { readFileSync, writeFileSync } from 'node:fs';
import { discoverLearningMdxFiles } from './learningContentMdx.ts';
import { parseLearningMdxPath } from '../src/core/learning/mdxContract.ts';
import { learningCatalog } from '../src/content/learning/index.ts';

interface TitleSyncResult {
  file: string;
  lessonId: string;
  catalogTitle: string;
  currentTitle: string;
  status: 'matched' | 'mismatched' | 'missing-in-catalog' | 'fixed';
}

export function syncMdxTitles(options: { fix?: boolean } = {}): TitleSyncResult[] {
  const files = discoverLearningMdxFiles('src/content/learning');
  const results: TitleSyncResult[] = [];

  for (const file of files) {
    const parsed = parseLearningMdxPath(file);
    if (!parsed) continue;

    const { domainId, lessonId, locale } = parsed;
    const lesson = learningCatalog.lessons.find(
      (l) => l.domainId === domainId && l.id === lessonId,
    );

    if (!lesson) {
      results.push({
        file,
        lessonId,
        catalogTitle: '',
        currentTitle: '',
        status: 'missing-in-catalog',
      });
      continue;
    }

    const catalogTitle = (locale === 'vi' ? lesson.text?.title?.vi : lesson.text?.title?.en) ?? '';
    const content = readFileSync(file, 'utf8');
    const titleMatch = content.match(/title\s*:\s*["']([^"']+)["']/);
    const currentTitle = titleMatch ? titleMatch[1] : '';

    if (currentTitle === catalogTitle) {
      results.push({
        file,
        lessonId,
        catalogTitle,
        currentTitle,
        status: 'matched',
      });
    } else {
      if (options.fix && titleMatch) {
        const updatedContent = content.replace(
          /title\s*:\s*["'][^"']+["']/,
          `title: "${catalogTitle}"`,
        );
        writeFileSync(file, updatedContent, 'utf8');
        results.push({
          file,
          lessonId,
          catalogTitle,
          currentTitle,
          status: 'fixed',
        });
      } else {
        results.push({
          file,
          lessonId,
          catalogTitle,
          currentTitle,
          status: 'mismatched',
        });
      }
    }
  }

  return results;
}

// Run CLI directly if executed from node
if (process.argv[1] && process.argv[1].endsWith('syncMdxTitles.ts')) {
  const shouldFix = process.argv.includes('--fix');
  const results = syncMdxTitles({ fix: shouldFix });
  const mismatches = results.filter((r) => r.status === 'mismatched');
  const fixed = results.filter((r) => r.status === 'fixed');

  console.log(`Audited ${results.length} Learning Lab MDX files.`);
  if (fixed.length > 0) {
    console.log(`✅ Fixed ${fixed.length} title mismatches.`);
  }
  if (mismatches.length > 0) {
    console.warn(`⚠️ Found ${mismatches.length} title mismatches:`);
    for (const m of mismatches) {
      console.warn(`  - ${m.file}: MDX "${m.currentTitle}" vs TOC "${m.catalogTitle}"`);
    }
    console.log('Run with --fix to automatically synchronize titles.');
    process.exit(1);
  } else {
    console.log('✨ All MDX titles match Table of Contents perfectly!');
  }
}
