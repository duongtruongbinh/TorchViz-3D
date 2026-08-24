import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { learningCatalog } from '../content/learning/index.ts';
import { LINEAR_ALGEBRA_MDX_COMPONENT_NAMES } from '../content/learning/mdxComponents.ts';
import { getLearningMdxComponentNames } from '../core/learning/mdxContract.ts';

const EXPECTED_CHAPTER_2_LESSONS = [
  'systems-of-linear-equations',
  'systems-of-linear-equations-quiz',
  'gaussian-elimination',
  'gaussian-elimination-quiz',
  'lu-decomposition',
  'lu-decomposition-quiz',
  'identity-inverse-matrix',
  'identity-inverse-matrix-quiz',
] as const;

const EXPECTED_CHAPTER_2_SHA256_MAP: Record<string, string> = {
  '2.1.1-systems-of-linear-equations.vi.mdx': '14e5779c7afbf87b51eb7f4de06a1f96be385a6ac3d43b048e608417935f973e',
  '2.1.2-systems-of-linear-equations-quiz.vi.mdx': 'a16f6ba9d4be469a95c5eea7766eb8ab64974ca75d9d3c738844cb1f7c20398a',
  '2.1.3-gaussian-elimination.vi.mdx': '987d7da298fa3fecb6b1a53bfb434f537b1ca0558e9fc04b01a31778984b4e59',
  '2.1.4-gaussian-elimination-quiz.vi.mdx': 'a0f71479a2fb8687f378d0ae16bf3fd36734f3beb104d64dab6d62b08ed26a3f',
  '2.1.5-lu-decomposition.vi.mdx': '4f769aeb687ef3cc351e15bf51476ad214bc4413a316cdd0f47acbaf82a1af42',
  '2.1.6-lu-decomposition-quiz.vi.mdx': '13d4d4cc7bd15d6ce3cccdbaf2cf3f296e651c6802ac065b7529500cdf441b54',
  '2.1.7-identity-inverse-matrix.vi.mdx': 'a72d39748157f9dc422ca258a03503008d53d6e3832ed65ab8fc3febb4aae39a',
  '2.1.8-identity-inverse-matrix-quiz.vi.mdx': '5a954d1cd31cca26d7f09bdff86a878b62bcf402d82b44fb280737e9115c05b1',
};

test('Linear Algebra Chapter 2 contains exactly 8 published lessons in locked theory-quiz order', () => {
  const chapter2Track = learningCatalog.tracks.find(
    (track) => track.domainId === 'linear-algebra' && track.id === 'solving-linear-equations',
  );
  assert.ok(chapter2Track, 'Chapter 2 track exists');
  assert.deepEqual(chapter2Track.lessonIds, EXPECTED_CHAPTER_2_LESSONS);

  for (const lessonId of EXPECTED_CHAPTER_2_LESSONS) {
    const lesson = learningCatalog.lessons.find(
      (item) => item.domainId === 'linear-algebra' && item.id === lessonId,
    );
    assert.ok(lesson, `Lesson ${lessonId} exists in catalog`);
    assert.equal(lesson.contentStatus, 'published', `Lesson ${lessonId} is published`);
  }
});

test('Chapter 2 MDX files have valid structure and substantive content', async () => {
  const contentDir = path.resolve(process.cwd(), 'src/content/learning/linear-algebra');

  for (const filename of Object.keys(EXPECTED_CHAPTER_2_SHA256_MAP)) {
    const filePath = path.join(contentDir, filename);
    const content = await readFile(filePath, 'utf8');
    assert.ok(content.length > 300, `File ${filename} must contain substantive content`);
    assert.ok(content.includes('lessonMetadata'), `File ${filename} must declare lessonMetadata`);
  }
});

test('All 4 Chapter 2 quiz files use canonical MdxQuiz with questions array', async () => {
  const contentDir = path.resolve(process.cwd(), 'src/content/learning/linear-algebra');

  for (const lessonId of EXPECTED_CHAPTER_2_LESSONS) {
    if (!lessonId.endsWith('-quiz')) continue;
    const nodeIndex = EXPECTED_CHAPTER_2_LESSONS.indexOf(lessonId) + 1;
    const filePath = path.join(contentDir, `2.1.${nodeIndex}-${lessonId}.vi.mdx`);
    const source = await readFile(filePath, 'utf8');
    const componentNames = getLearningMdxComponentNames(source);

    assert.ok(
      componentNames.includes('MdxQuiz'),
      `${lessonId} must use canonical MdxQuiz`,
    );
    assert.ok(
      !componentNames.includes('LegacyMathQuiz'),
      `${lessonId} must not use LegacyMathQuiz`,
    );
  }
});

test('Chapter 2 theory lessons do not embed LegacyMathQuiz or any quiz component', async () => {
  const contentDir = path.resolve(process.cwd(), 'src/content/learning/linear-algebra');

  for (const lessonId of EXPECTED_CHAPTER_2_LESSONS) {
    if (lessonId.endsWith('-quiz')) continue;
    const nodeIndex = EXPECTED_CHAPTER_2_LESSONS.indexOf(lessonId) + 1;
    const filePath = path.join(contentDir, `2.1.${nodeIndex}-${lessonId}.vi.mdx`);
    const source = await readFile(filePath, 'utf8');
    const componentNames = getLearningMdxComponentNames(source);

    assert.ok(
      !componentNames.includes('LegacyMathQuiz'),
      `Theory lesson ${lessonId} must not use LegacyMathQuiz`,
    );
    assert.ok(
      !componentNames.includes('MdxQuiz'),
      `Theory lesson ${lessonId} must not use MdxQuiz`,
    );
  }
});

test('Linear Algebra component allowlist includes all 5 Chapter 2 public visual components', () => {
  const chapter2Components = [
    'ColumnCombinationExplorer',
    'LinearSystemCasesExplorer',
    'GaussianEliminationStepper',
    'LUFactorizationExplorer',
    'GaussJordanInverseStepper',
  ] as const;

  for (const name of chapter2Components) {
    assert.ok(
      LINEAR_ALGEBRA_MDX_COMPONENT_NAMES.includes(name),
      `Allowlist must include Chapter 2 component: ${name}`,
    );
  }
});

test('Lazy boundary: Chapter 2 and Mafs visuals are only loaded through linear-algebra domain loader', async () => {
  const registryPath = path.resolve(
    process.cwd(),
    'src/components/learning/learningMdxRegistry.tsx',
  );
  const registrySource = await readFile(registryPath, 'utf8');

  // Verify learningMdxRegistry uses lazy domain loader for linear-algebra
  assert.match(
    registrySource,
    /'linear-algebra':\s*\(\)\s*=>\s*import\('\.\/domains\/linear-algebra\/mdxComponents'\)/,
    'linear-algebra must be loaded via on-demand dynamic import in learningMdxRegistry',
  );
  assert.doesNotMatch(
    registrySource,
    /import.*from.*systemRenderers/,
    'systemRenderers must not be eagerly imported in learningMdxRegistry',
  );
  assert.doesNotMatch(
    registrySource,
    /import.*from.*['"]mafs['"]/,
    'mafs must not be imported in learningMdxRegistry',
  );
});

test('Mafs constraint purity: Mafs constrain callbacks do not mutate React state', async () => {
  const domainDir = path.resolve(
    process.cwd(),
    'src/components/learning/domains/linear-algebra',
  );
  const vectorRenderers = await readFile(path.join(domainDir, 'vectorRenderers.tsx'), 'utf8');
  const systemRenderers = await readFile(path.join(domainDir, 'systemRenderers.tsx'), 'utf8');

  for (const [name, source] of [['vectorRenderers', vectorRenderers], ['systemRenderers', systemRenderers]]) {
    // Check that constrain callbacks do not call setState or callbacks
    const constrainRegex = /constrain:\s*\([^)]*\)\s*=>\s*\{([^}]*)\}/g;
    for (let match = constrainRegex.exec(source); match !== null; match = constrainRegex.exec(source)) {
      const body = match[1];
      assert.ok(
        !body.includes('set') && !body.includes('onPosChange'),
        `Constrain callback in ${name} must be pure and not call setters: ${body}`,
      );
    }
  }
});

test('Punctuation regression: 8 Chapter 2 MDX files do not contain semicolons, em dashes, or en dashes', async () => {
  const contentDir = path.resolve(process.cwd(), 'src/content/learning/linear-algebra');

  for (const filename of Object.keys(EXPECTED_CHAPTER_2_SHA256_MAP)) {
    const filePath = path.join(contentDir, filename);
    const content = await readFile(filePath, 'utf8');

    // Reject em dash and en dash
    assert.ok(!content.includes('—'), `${filename} must not contain em dash (—)`);
    assert.ok(!content.includes('–'), `${filename} must not contain en dash (–)`);
    // Reject ASCII semicolon outside of code blocks/metadata if any
    // Notice: authoritative files don't have semicolon
    assert.ok(!content.includes(';'), `${filename} must not contain semicolon (;)`);
  }
});

test('Numerical example verification for Chapter 2 lessons', () => {
  // 1. System: [[1, 2], [3, -1]] @ [1, 2] = [5, 1]
  const A_sys = [[1, 2], [3, -1]];
  const x_sys = [1, 2];
  const b_sys = [
    A_sys[0][0] * x_sys[0] + A_sys[0][1] * x_sys[1],
    A_sys[1][0] * x_sys[0] + A_sys[1][1] * x_sys[1],
  ];
  assert.deepEqual(b_sys, [5, 1]);

  // 2. Gaussian elimination: [[1,1,1],[2,3,1],[1,-1,2]] @ [1,2,3] = [6,11,5]
  const A_gauss = [
    [1, 1, 1],
    [2, 3, 1],
    [1, -1, 2],
  ];
  const x_gauss = [1, 2, 3];
  const b_gauss = A_gauss.map(
    (row) => row[0] * x_gauss[0] + row[1] * x_gauss[1] + row[2] * x_gauss[2],
  );
  assert.deepEqual(b_gauss, [6, 11, 5]);

  // 3. LU decomposition: L @ U = A
  const L = [
    [1, 0, 0],
    [2, 1, 0],
    [1, -2, 1],
  ];
  const U = [
    [1, 1, 1],
    [0, 1, -1],
    [0, 0, -1],
  ];
  const LU = [
    [
      L[0][0] * U[0][0] + L[0][1] * U[1][0] + L[0][2] * U[2][0],
      L[0][0] * U[0][1] + L[0][1] * U[1][1] + L[0][2] * U[2][1],
      L[0][0] * U[0][2] + L[0][1] * U[1][2] + L[0][2] * U[2][2],
    ],
    [
      L[1][0] * U[0][0] + L[1][1] * U[1][0] + L[1][2] * U[2][0],
      L[1][0] * U[0][1] + L[1][1] * U[1][1] + L[1][2] * U[2][1],
      L[1][0] * U[0][2] + L[1][1] * U[1][2] + L[1][2] * U[2][2],
    ],
    [
      L[2][0] * U[0][0] + L[2][1] * U[1][0] + L[2][2] * U[2][0],
      L[2][0] * U[0][1] + L[2][1] * U[1][1] + L[2][2] * U[2][1],
      L[2][0] * U[0][2] + L[2][1] * U[1][2] + L[2][2] * U[2][2],
    ],
  ];
  assert.deepEqual(LU, A_gauss);

  // 4. Forward substitution L @ c = b for b = [6, 11, 5] -> c = [6, -1, -3]
  const c = [6, -1, -3];
  const Lc = [
    L[0][0] * c[0] + L[0][1] * c[1] + L[0][2] * c[2],
    L[1][0] * c[0] + L[1][1] * c[1] + L[1][2] * c[2],
    L[2][0] * c[0] + L[2][1] * c[1] + L[2][2] * c[2],
  ];
  assert.deepEqual(Lc, [6, 11, 5]);

  // Back substitution U @ x = c -> x = [1, 2, 3]
  const Ux = [
    U[0][0] * x_gauss[0] + U[0][1] * x_gauss[1] + U[0][2] * x_gauss[2],
    U[1][0] * x_gauss[0] + U[1][1] * x_gauss[1] + U[1][2] * x_gauss[2],
    U[2][0] * x_gauss[0] + U[2][1] * x_gauss[1] + U[2][2] * x_gauss[2],
  ];
  assert.deepEqual(Ux, c);

  // 5. Inverse: A = [[1, 2], [3, 4]], A_inv = [[-2, 1], [1.5, -0.5]]
  const A_inv_input = [
    [1, 2],
    [3, 4],
  ];
  const A_inv = [
    [-2, 1],
    [1.5, -0.5],
  ];
  const AA_inv = [
    [
      A_inv_input[0][0] * A_inv[0][0] + A_inv_input[0][1] * A_inv[1][0],
      A_inv_input[0][0] * A_inv[0][1] + A_inv_input[0][1] * A_inv[1][1],
    ],
    [
      A_inv_input[1][0] * A_inv[0][0] + A_inv_input[1][1] * A_inv[1][0],
      A_inv_input[1][0] * A_inv[0][1] + A_inv_input[1][1] * A_inv[1][1],
    ],
  ];
  assert.deepEqual(AA_inv, [
    [1, 0],
    [0, 1],
  ]);
});
