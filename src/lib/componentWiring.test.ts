import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function readSource(path: string): string {
  return readFileSync(path, 'utf8');
}

function readLlmRendererSources(): string {
  return [
    'conceptRenderers.tsx',
    'languageModelRenderers.tsx',
    'tokenizerRenderers.tsx',
  ].map((fileName) => readSource(`src/components/learning/domains/llm-ai-engineering/${fileName}`)).join('\n');
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

test('canvas loading feedback stays transparent over the persistent scene', () => {
  const canvas = readSource('src/components/canvas/Canvas3D.tsx');
  const overlays = readSource('src/components/canvas/CanvasOverlays.tsx');
  const loadingOverlay = overlays.slice(
    overlays.indexOf('export const CanvasLoadingOverlay'),
    overlays.indexOf('export const CanvasErrorOverlay'),
  );

  assert.match(canvas, /aria-busy=\{loading\}/, 'Canvas3D should expose its busy state');
  assert.match(loadingOverlay, /data-torchviz-canvas-loading/);
  assert.doesNotMatch(
    loadingOverlay,
    /bg-zinc-950\/70|backdrop-blur/,
    'loading must not dim or backdrop-filter the full canvas surface',
  );
});

test('canvas backgrounds and leaf outlines cannot masquerade as flow connectors', () => {
  const canvas = readSource('src/components/canvas/Canvas3D.tsx');
  const sceneBlocks = readSource('src/components/canvas/SceneBlocks.tsx');
  const leafRendering = sceneBlocks.slice(
    sceneBlocks.indexOf('const ActivationBlock'),
    sceneBlocks.indexOf('function sameNodeRenderFields'),
  );

  assert.match(canvas, /<GroundLineGrid/);
  assert.doesNotMatch(canvas, /<gridHelper/);
  assert.doesNotMatch(leafRendering, /LeafFaceOutline|<lineSegments|<Line/);
  assert.doesNotMatch(
    leafRendering,
    /<Edges/,
    'leaf blocks should rely on solid shading instead of supplemental outlines',
  );
});

test('forward pass input uses a moving packet without a persistent dashed connector', () => {
  const demo = readSource('src/components/mnist-demo/MnistFlowDemo.tsx');

  assert.match(demo, /const packetRoutes = getDataPacketRoutes/);
  assert.match(demo, /<DataPacket key=/);
  assert.doesNotMatch(demo, /VirtualInputRoute|getVirtualInputRoutePoints/);
  assert.doesNotMatch(demo, /\bdashed\b/);
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

test('Learning Home defers authored lesson runtime until a lesson is selected', () => {
  const learningLabView = readSource('src/components/learning/LearningLabView.tsx');
  const learningSearch = readSource('src/components/learning/learningSearch.ts');

  assert.doesNotMatch(
    learningLabView,
    /import\s+LessonDetail\s+from\s+['"]\.\/lesson\/LessonDetail['"]/,
    'LearningLabView should not statically import the authored lesson runtime',
  );
  assert.match(
    learningLabView,
    /lazy\(\(\) => import\(['"]\.\/lesson\/LessonDetail['"]\)\)/,
    'LearningLabView should lazy-load LessonDetail behind the selected-lesson branch',
  );
  assert.match(
    learningLabView,
    /selectedLesson[\s\S]*<Suspense[\s\S]*<LessonDetail/,
    'the deferred lesson detail should render inside Suspense only when a lesson is selected',
  );
  assert.doesNotMatch(
    learningSearch,
    /virtual:learning-mdx-search-documents\//,
    'the browser adapter should not statically import any domain search payload',
  );
  assert.match(
    learningSearch,
    /from ['"]virtual:learning-mdx-search-loaders['"]/,
    'Learning should import only the generated domain-loader manifest',
  );
  assert.match(
    learningSearch,
    /searchDocumentLoaders\[domainId\]\(\)/,
    'authored search documents should load on demand for the active domain',
  );
});

test('Learning Home stays outside Workspace and full-catalog dependency graphs', () => {
  const landing = readSource('src/components/landing/LandingPage.tsx');
  const learningLabView = readSource('src/components/learning/LearningLabView.tsx');
  const learningLabHeader = readSource('src/components/learning/LearningLabHeader.tsx');
  const workspace = readSource('src/components/workspace/TorchVizWorkspace.tsx');
  const domainCatalog = readSource('src/components/learning/shell/DomainCatalog.tsx');
  const learningText = readSource('src/components/learning/learningText.ts');
  const learningSearch = readSource('src/components/learning/learningSearch.ts');
  const learningCatalogLoader = readSource('src/components/learning/learningCatalogLoader.ts');
  const learningMdxComponents = readSource('src/components/learning/learningMdxComponents.tsx');
  const learningMdxRegistry = readSource('src/components/learning/learningMdxRegistry.tsx');
  const cvMdxComponents = readSource('src/components/learning/domains/cv/mdxComponents.tsx');
  const preferencesStore = readSource('src/store/usePreferencesStore.ts');
  const workspaceStore = readSource('src/store/useStore.ts');

  for (const source of [landing, learningLabView, learningLabHeader]) {
    assert.doesNotMatch(source, /store\/useStore['"]/);
    assert.match(source, /store\/usePreferencesStore['"]/);
  }
  assert.match(workspace, /store\/usePreferencesStore['"]/, 'Workspace should consume the shared language preference');
  assert.doesNotMatch(preferencesStore, /templates\/|lib\/(?:irTypes|layout)|worker|canvas/i);
  assert.doesNotMatch(workspaceStore, /\blanguage\s*:|\bsetLanguage\s*:/);

  assert.match(learningLabView, /from ['"]virtual:learning-home-catalog['"]/);
  assert.match(learningLabView, /from ['"]\.\/learningCatalogLoader['"]/);
  assert.match(learningCatalogLoader, /import\(['"]\.\.\/\.\.\/content\/learning\/index\.ts['"]\)/);
  assert.match(learningCatalogLoader, /import\.meta\.glob<LearningTocModule>/);
  assert.doesNotMatch(learningCatalogLoader, /eager:\s*true/);
  assert.doesNotMatch(learningLabView, /^import[^\n]+content\/learning/m);
  for (const source of [domainCatalog, learningText, learningSearch]) {
    assert.doesNotMatch(source, /^import[^\n]+content\/learning/m);
  }
  assert.match(learningMdxRegistry, /import\.meta\.glob<MdxModule>/);
  assert.doesNotMatch(learningMdxRegistry, /eager:\s*true/);
  assert.doesNotMatch(learningMdxRegistry, /^import[^\n]+content\/learning\/index/m);
  assert.match(learningMdxRegistry, /loadLessonModule\(selectedModule\.filePath\)/);
  assert.match(learningMdxRegistry, /import\(['"]\.\/domains\/cv\/mdxComponents['"]\)/);
  assert.match(learningMdxRegistry, /domainId !== ['"]continual-learning-llm['"]/);
  assert.match(learningMdxComponents, /LESSON_IMAGE_LOADERS\s*=\s*import\.meta\.glob/);
  assert.doesNotMatch(
    learningMdxComponents,
    /LESSON_IMAGE_LOADERS\s*=\s*import\.meta\.glob[\s\S]{0,240}eager:\s*true/,
    'authored lesson images should load only when their LessonImage renders',
  );
  assert.doesNotMatch(cvMdxComponents, /content\/learning\/index/);
  assert.match(learningLabView, /!routeDomainId \|\| !lessonSearchQuery\.trim\(\)/);
});

test('Learning Lab shared infrastructure avoids duplicated navigation and UI logic', () => {
  const quizBlock = readSource('src/components/learning/lesson/QuizBlock.tsx');
  const domainRenderer = readLlmRendererSources();
  const domainCatalog = readSource('src/components/learning/shell/DomainCatalog.tsx');
  const learningLabView = readSource('src/components/learning/LearningLabView.tsx');
  const lessonRail = readSource('src/components/learning/lesson/LessonRail.tsx');
  const localization = readSource('src/lib/localization.ts');

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
  assert.doesNotMatch(
    domainCatalog,
    /href=["']#/,
    'in-page links must not replace the HashRouter fragment',
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

test('CV review and Workspace handoff derive from catalog exercise lessons', () => {
  const reviewMode = readSource('src/components/learning/shell/ReviewMode.tsx');
  const cvComponents = readSource('src/components/learning/domains/cv/mdxComponents.tsx');
  const canvas = readSource('src/components/canvas/Canvas3D.tsx');

  assert.match(reviewMode, /getReviewableLearningLessons\(catalog\)/);
  assert.doesNotMatch(reviewMode, /conv2d-shape-exercise|pooling-value-exercise/);
  assert.match(cvComponents, /lazy\(\(\) => import\(['"]\.\.\/\.\.\/\.\.\/exercises\/ShapeExercise['"]\)/);
  assert.match(cvComponents, /lazy\(\(\) => import\(['"]\.\.\/\.\.\/\.\.\/exercises\/ValueExercise['"]\)/);
  assert.match(cvComponents, /lazy\(\(\) => import\(['"]\.\.\/\.\.\/\.\.\/exercises\/ConvExercise['"]\)/);
  assert.match(canvas, /resolveLearningExerciseLessonTarget/);
  assert.doesNotMatch(`${reviewMode}\n${cvComponents}\n${canvas}`, /practiceId|[?&]practice=/);
});
