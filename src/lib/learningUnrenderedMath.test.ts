import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import katex from 'katex';

const LEARNING_CONTENT_DIR = path.resolve(process.cwd(), 'src/content/learning');

// Regex patterns to identify raw unrendered math symbols
const UNRENDERED_MATH_PATTERNS = [
  { name: 'Greek Sigma (Σ)', regex: /Σ/ },
  { name: 'Greek sigma (σ)', regex: /σ/ },
  { name: 'Greek theta (θ)', regex: /θ/ },
  { name: 'Greek lambda (λ)', regex: /λ/ },
  { name: 'Greek Delta (Δ)', regex: /Δ/ },
  { name: 'Superscript T (ᵀ)', regex: /ᵀ/ },
  { name: 'Superscript minus (⁻)', regex: /⁻/ },
  { name: 'Superscript plus (⁺)', regex: /⁺/ },
  { name: 'Superscript numbers (⁰¹²³⁴⁵⁶⁷⁸⁹)', regex: /[⁰¹²³⁴⁵⁶⁷⁸⁹]/ },
  { name: 'Subscript numbers (₀₁₂₃₄₅₆₇₈₉)', regex: /[₀₁₂₃₄₅₆₇₈₉]/ },
  { name: 'Subscript letters (ᵢⱼₖₙₘ)', regex: /[ᵢⱼₖₙₘ]/ },
  { name: 'Square root (√)', regex: /√/ },
  { name: 'Infinity (∞)', regex: /∞/ },
  { name: 'Hadamard product (⊙)', regex: /⊙/ },
  { name: 'Product symbol (∏)', regex: /∏/ },
  { name: 'Sum symbol (∑)', regex: /∑/ },
  { name: 'Double vertical bar (‖)', regex: /‖/ },
];

function getAllMdxFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllMdxFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      results.push(fullPath);
    }
  }

  return results;
}

test('Learning Content Math & KaTeX Validation', async (t) => {
  const mdxFiles = getAllMdxFiles(LEARNING_CONTENT_DIR);

  await t.test('discovers all MDX lessons and quizzes across all domains', () => {
    assert.ok(
      mdxFiles.length >= 240,
      `Expected at least 240 MDX files across learning domains, found ${mdxFiles.length}`,
    );
  });

  await t.test(
    'ensures no raw unrendered math symbols exist outside KaTeX blocks',
    () => {
      const errors: Array<{ file: string; line: number; character: string; lineContent: string }> = [];

      for (const filePath of mdxFiles) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        let inCodeBlock = false;

        for (let i = 0; i < lines.length; i++) {
          const rawLine = lines[i];
          const trimmed = rawLine.trim();

          if (trimmed.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            continue;
          }
          if (inCodeBlock) continue;

          // Strip formulas that are already properly wrapped in KaTeX:
          // 1. <InlineMath formula="..." />
          // 2. <BlockMath formula="..." />
          // 3. $ ... $ or $$ ... $$
          const textOnly = rawLine
            .replace(/<(InlineMath|BlockMath)\s+formula="[^"]*"\s*\/>/g, '')
            .replace(/\$\$[\s\S]*?\$\$/g, '')
            .replace(/\$[^$]+?\$/g, '');

          // Check for unrendered mathematical characters
          for (const pattern of UNRENDERED_MATH_PATTERNS) {
            const match = pattern.regex.exec(textOnly);
            if (match) {
              const relPath = path.relative(process.cwd(), filePath);
              errors.push({
                file: relPath,
                line: i + 1,
                character: pattern.name,
                lineContent: trimmed,
              });
            }
          }
        }
      }

      if (errors.length > 0) {
        const details = errors
          .map((e) => `[${e.file}:${e.line}] Found raw ${e.character}\n   Line: ${e.lineContent}`)
          .join('\n');
        assert.fail(
          `Found ${errors.length} unrendered math characters outside KaTeX across MDX files:\n${details}`,
        );
      }
    },
  );

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
