import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import katex from 'katex';

const LINEAR_ALGEBRA_CONTENT_DIR = path.resolve(
  process.cwd(),
  'src/content/learning/linear-algebra',
);

test('Linear Algebra KaTeX Math Validation', async (t) => {
  const mdxFiles = fs
    .readdirSync(LINEAR_ALGEBRA_CONTENT_DIR)
    .filter((f) => f.endsWith('.vi.mdx'));

  await t.test('finds Linear Algebra MDX files to validate', () => {
    assert.ok(
      mdxFiles.length >= 13,
      `Expected at least 13 Linear Algebra MDX files, found ${mdxFiles.length}`,
    );
  });

  await t.test(
    'renders all InlineMath and BlockMath formulas with KaTeX throwOnError: true',
    () => {
      let totalFormulasTested = 0;
      const errors: Array<{ file: string; formula: string; error: string }> = [];

      for (const fileName of mdxFiles) {
        const filePath = path.join(LINEAR_ALGEBRA_CONTENT_DIR, fileName);
        const content = fs.readFileSync(filePath, 'utf8');

        // Match all InlineMath and BlockMath occurrences
        const formulaRegex = /<(InlineMath|BlockMath)\s+formula="([^"]+)"/g;
        let match: RegExpExecArray | null;

        while ((match = formulaRegex.exec(content)) !== null) {
          const isBlock = match[1] === 'BlockMath';
          const rawFormula = match[2];
          totalFormulasTested++;

          try {
            katex.renderToString(rawFormula, {
              displayMode: isBlock,
              throwOnError: true,
            });
          } catch (err: unknown) {
            errors.push({
              file: fileName,
              formula: rawFormula,
              error: err instanceof Error ? err.message : String(err),
            });
          }
        }
      }

      if (errors.length > 0) {
        const details = errors
          .map((e) => `[${e.file}] "${e.formula}": ${e.error}`)
          .join('\n');
        assert.fail(`Found ${errors.length} invalid KaTeX formulas:\n${details}`);
      }

      assert.ok(
        totalFormulasTested >= 150,
        `Expected at least 150 formulas tested, found ${totalFormulasTested}`,
      );
    },
  );

  await t.test(
    'ensures MDX formulas do not contain overescaped TeX commands',
    () => {
      const overescapedErrors: Array<{ file: string; match: string }> = [];

      for (const fileName of mdxFiles) {
        const filePath = path.join(LINEAR_ALGEBRA_CONTENT_DIR, fileName);
        const content = fs.readFileSync(filePath, 'utf8');

        const formulaRegex = /<(?:InlineMath|BlockMath)\s+formula="([^"]+)"/g;
        let match: RegExpExecArray | null;

        while ((match = formulaRegex.exec(content)) !== null) {
          const formula = match[1];

          // A TeX command like \\mathbf, \\lVert, \\begin at start or after delimiters is overescaped.
          // Valid TeX row breaks inside environments (e.g. \\y in cases or \\\mathbf in bmatrix) are not overescaped commands.
          const commandMatch = formula.match(/(?:^|[\s{(=+,_-])\\\\([a-zA-Z]+)/);
          if (commandMatch) {
            overescapedErrors.push({
              file: fileName,
              match: commandMatch[0],
            });
          }
        }
      }

      if (overescapedErrors.length > 0) {
        const details = overescapedErrors
          .map((e) => `[${e.file}] overescaped: ${e.match}`)
          .join('\n');
        assert.fail(
          `Found ${overescapedErrors.length} overescaped LaTeX commands in MDX:\n${details}`,
        );
      }
    },
  );
});
