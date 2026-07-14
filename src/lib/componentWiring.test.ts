import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function readSource(path: string): string {
  return readFileSync(path, 'utf8');
}

test('workspace forwards selected node state into the canvas renderer', () => {
  const workspace = readSource('src/components/workspace/TorchVizWorkspace.tsx');
  const canvas = readSource('src/components/canvas/Canvas3D.tsx');

  assert.match(
    canvas,
    /selectedNodeId\?: string \| null;/,
    'Canvas3DProps should expose selectedNodeId separately from highlightNodeId',
  );
  assert.match(
    workspace,
    /<Canvas3D[\s\S]*selectedNodeId=\{selectedNodeId\}/,
    'TorchVizWorkspace should pass selectedNodeId from the store into Canvas3D',
  );
  assert.match(
    canvas,
    /<SceneWithInstancing[\s\S]*selectedNodeId=\{selectedNodeId\}/,
    'Canvas3D should pass selectedNodeId through to SceneWithInstancing',
  );
  assert.doesNotMatch(
    canvas,
    /selectedNodeId=\{highlightNodeId\}/,
    'highlightNodeId must not be reused as selectedNodeId',
  );
});

test('AppShell lazy-loads Learning Lab instead of importing it into the landing bundle', () => {
  const appShell = readSource('src/components/AppShell.tsx');

  assert.doesNotMatch(
    appShell,
    /import\s+LearningLabView\s+from\s+['"]\.\/learning\/LearningLabView['"]/,
    'AppShell should not statically import LearningLabView',
  );
  assert.match(
    appShell,
    /lazy\(\(\) => import\(['"]\.\/learning\/LearningLabView['"]\)\)/,
    'AppShell should lazy-load LearningLabView at the route boundary',
  );
  assert.match(
    appShell,
    /<Suspense[\s\S]*<LearningLabView/,
    'Lazy LearningLabView should render inside Suspense',
  );
});

test('Learning Lab feedback scroll uses one shared helper', () => {
  const quizBlock = readSource('src/components/learning/lesson/QuizBlock.tsx');
  const domainRenderer = readSource('src/components/learning/domains/llm-ai-engineering/renderers.tsx');

  assert.match(
    quizBlock,
    /import\s+\{\s*scrollLearningLabElementIntoView\s*\}\s+from\s+['"]\.\/scrolling['"]/,
    'QuizBlock should import the shared Learning Lab scroll helper',
  );
  assert.match(
    domainRenderer,
    /import\s+\{\s*scrollLearningLabElementIntoView\s*\}\s+from\s+['"]\.\.\/\.\.\/lesson\/scrolling['"]/,
    'LLM domain renderer should import the shared Learning Lab scroll helper',
  );
  assert.doesNotMatch(
    `${quizBlock}\n${domainRenderer}`,
    /function\s+scrollLearningLabElementIntoView/,
    'feedback scroll helper should not be duplicated across renderers',
  );
});

test('Learning Home avoids fragment links that replace the HashRouter route', () => {
  const domainCatalog = readSource('src/components/learning/shell/DomainCatalog.tsx');

  assert.doesNotMatch(
    domainCatalog,
    /href=["']#/,
    'in-page links must not replace the HashRouter fragment',
  );
});

test('Learning Lab rail toggle and quiz labels use shared theme/localization surfaces', () => {
  const learningLabView = readSource('src/components/learning/LearningLabView.tsx');
  const lessonRail = readSource('src/components/learning/lesson/LessonRail.tsx');
  const quizBlock = readSource('src/components/learning/lesson/QuizBlock.tsx');
  const theme = readSource('src/components/learning/theme.ts');
  const localization = readSource('src/lib/localization.ts');

  assert.match(
    theme,
    /railToggleButton:\s*cx\(/,
    'theme should own the shared lesson rail toggle button class',
  );
  assert.doesNotMatch(
    `${learningLabView}\n${lessonRail}`,
    /function\s+get(?:Lesson)?RailToggleButtonClass/,
    'LearningLabView and LessonRail should not duplicate rail toggle class helpers',
  );
  assert.match(
    localization,
    /lessonRailOpenLabel:\s*\{\s*en:\s*'Table of contents'/,
    'localized strings should own the open lesson rail label',
  );
  assert.match(
    localization,
    /lessonRailCloseLabel:\s*\{\s*en:\s*'Hide table of contents'/,
    'localized strings should own the close lesson rail label',
  );
  assert.doesNotMatch(
    `${learningLabView}\n${lessonRail}\n${quizBlock}`,
    /language === 'vi' \? '(?:Kiểm tra|Làm lại|Token chưa phân loại|Tất cả token đã được kéo vào nhóm\.|Lý thuyết cốt lõi)'/,
    'new Learning Lab controls should use localization or content text helpers instead of inline language checks',
  );
});
