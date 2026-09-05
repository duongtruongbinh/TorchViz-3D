import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import katex from 'katex';

const LEARNING_CONTENT_DIR = path.resolve(process.cwd(), 'src/content/learning');
const LEARNING_RENDERER_FILES = [
  path.resolve(process.cwd(), 'src/components/learning/learningMdxComponents.tsx'),
  ...getAllFiles(
    path.resolve(process.cwd(), 'src/components/learning/domains/evolutionary-algorithms'),
    '.tsx',
  ),
];

// Regex patterns to identify raw unrendered math symbols
const UNRENDERED_MATH_PATTERNS = [
  { name: 'Greek letter', regex: /[\u0370-\u03FF\u1F00-\u1FFF]/u },
  { name: 'superscript or subscript character', regex: /[\u1D2C-\u1D6A\u2070-\u209F]/u },
  { name: 'relation or set operator', regex: /[≈≠≤≥∈∉⊂⊆∪∩]/u },
  { name: 'number-set symbol', regex: /[ℝℤℕℚℂ]/u },
  { name: 'mathematical operator', regex: /[√∞⊙∏∑‖∥]/u },
];

function getAllFiles(dir: string, extension: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllFiles(fullPath, extension));
    } else if (entry.isFile() && entry.name.endsWith(extension)) {
      results.push(fullPath);
    }
  }

  return results;
}

type UnrenderedMathError = {
  file: string;
  line: number;
  character: string;
  lineContent: string;
};

function findUnrenderedMath(
  filePaths: string[],
  skipCodeBlocks: boolean,
): UnrenderedMathError[] {
  const errors: UnrenderedMathError[] = [];

  for (const filePath of filePaths) {
    const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const trimmed = rawLine.trim();

      if (skipCodeBlocks && trimmed.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        continue;
      }
      if (inCodeBlock) continue;

      const textOnly = rawLine
        .replace(/<(InlineMath|BlockMath)\s+formula="[^"]*"\s*\/>/g, '')
        .replace(/\$\$[\s\S]*?\$\$/g, '')
        .replace(/\$[^$]+?\$/g, '');

      for (const pattern of UNRENDERED_MATH_PATTERNS) {
        if (pattern.regex.test(textOnly)) {
          errors.push({
            file: path.relative(process.cwd(), filePath),
            line: i + 1,
            character: pattern.name,
            lineContent: trimmed,
          });
        }
      }
    }
  }

  return errors;
}

function assertNoUnrenderedMath(errors: UnrenderedMathError[], scope: string): void {
  if (errors.length === 0) return;

  const details = errors
    .map((error) =>
      `[${error.file}:${error.line}] Found raw ${error.character}\n   Line: ${error.lineContent}`,
    )
    .join('\n');
  assert.fail(
    `Found ${errors.length} unrendered math characters outside KaTeX in ${scope}:\n${details}`,
  );
}

test('Learning Content Math & KaTeX Validation', async (t) => {
  const mdxFiles = getAllFiles(LEARNING_CONTENT_DIR, '.mdx');

  await t.test('discovers all MDX lessons and quizzes across all domains', () => {
    assert.ok(
      mdxFiles.length >= 240,
      `Expected at least 240 MDX files across learning domains, found ${mdxFiles.length}`,
    );
  });

  await t.test(
    'ensures no raw unrendered math symbols exist outside KaTeX blocks',
    () => {
      assertNoUnrenderedMath(findUnrenderedMath(mdxFiles, true), 'MDX files');
    },
  );

  await t.test('checks shared and evolutionary visual renderers for raw math symbols', () => {
    assertNoUnrenderedMath(
      findUnrenderedMath(LEARNING_RENDERER_FILES, false),
      'Learning renderer files',
    );
  });

  await t.test('validates all KaTeX formulas inside quiz blocks ($ ... $)', () => {
    let totalQuizFormulas = 0;
    const formulaErrors: Array<{ file: string; formula: string; error: string }> = [];

    for (const filePath of mdxFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const relPath = path.relative(process.cwd(), filePath);

      // Match all $...$ inline math inside the quiz
      const mathRegex = /\$([^$\n]+?)\$/g;

      for (let match = mathRegex.exec(content); match !== null; match = mathRegex.exec(content)) {
        let formula = match[1].trim();
        if (!formula) continue;

        // Unescape double backslashes in raw file string to simulate evaluated JS string in MDX
        formula = formula.replace(/\\\\/g, '\\');

        totalQuizFormulas++;
        try {
          katex.renderToString(formula, {
            displayMode: false,
            throwOnError: true,
          });
        } catch (err: unknown) {
          formulaErrors.push({
            file: relPath,
            formula,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }
    }

    if (formulaErrors.length > 0) {
      const details = formulaErrors
        .map((e) => `[${e.file}] "$${e.formula}$": ${e.error}`)
        .join('\n');
      assert.fail(`Found ${formulaErrors.length} invalid KaTeX formulas in quizzes:\n${details}`);
    }

    assert.ok(
      totalQuizFormulas >= 50,
      `Expected at least 50 quiz KaTeX formulas tested, found ${totalQuizFormulas}`,
    );
  });
});
