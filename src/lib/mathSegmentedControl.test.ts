import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('MathSegmentedControl implements WAI-ARIA radiogroup contract and roving focus', () => {
  const source = readFileSync(
    'src/components/learning/domains/linear-algebra/primitives/MathSegmentedControl.tsx',
    'utf8',
  );

  // WAI-ARIA role semantics
  assert.match(source, /role="radiogroup"/, 'Container must have role="radiogroup"');
  assert.match(source, /role="radio"/, 'Buttons must have role="radio"');
  assert.match(source, /aria-checked=\{isSelected\}/, 'Buttons must declare aria-checked state');
  assert.match(source, /aria-label=\{option\.ariaLabel\}/, 'Buttons must support option aria-label');

  // Roving tabindex synchronization: tabIndex is 0 only on selected or first option
  assert.match(source, /tabIndex=\{isSelected \|\| \(selectedIndex === -1 && idx === 0\) \? 0 : -1\}/);

  // Keyboard navigation: Arrow keys, Home, End
  assert.match(source, /e\.key === 'ArrowRight' \|\| e\.key === 'ArrowDown'/);
  assert.match(source, /e\.key === 'ArrowLeft' \|\| e\.key === 'ArrowUp'/);
  assert.match(source, /e\.key === 'Home'/);
  assert.match(source, /e\.key === 'End'/);

  // Focus management
  assert.match(source, /focusOption\(/);
  assert.match(source, /buttonRefs\.current\[clampedIndex\]\?\.focus\(\)/);

  // Per-option colorScheme support
  assert.match(source, /const optionScheme = option\.colorScheme \?\? colorScheme/);
});

test('matrixPrimitives centralizes MatrixFrame, MatrixDivider, MatrixCell, and getMatrixCellClasses', () => {
  const source = readFileSync(
    'src/components/learning/domains/linear-algebra/primitives/matrixPrimitives.tsx',
    'utf8',
  );

  assert.match(source, /export function MatrixFrame/);
  assert.match(source, /export function MatrixDivider/);
  assert.match(source, /export function MatrixCell/);
  assert.match(source, /export function MatrixBracket/);
  assert.match(source, /export function MatrixNameLabel/);
  assert.match(source, /export function getMatrixCellClasses/);
});

test('MathVisualCard co-locates MathInfoPanel for domain explanatory surfaces', () => {
  const source = readFileSync(
    'src/components/learning/domains/linear-algebra/primitives/MathVisualCard.tsx',
    'utf8',
  );

  assert.match(source, /export function MathVisualCard/);
  assert.match(source, /export function MathInfoPanel/);
});

test('Linear Algebra MDX components are modularly lazy loaded with lazyNamed', () => {
  const source = readFileSync(
    'src/components/learning/domains/linear-algebra/mdxComponents.tsx',
    'utf8',
  );

  assert.match(source, /function lazyNamed/);
  assert.match(source, /VisualSkeleton/);
  assert.match(source, /loadOverview = \(\) => import\('\.\/overviewRenderers'\)/);
  assert.match(source, /loadVector = \(\) => import\('\.\/vectorRenderers'\)/);
  assert.match(source, /loadSystem = \(\) => import\('\.\/systemRenderers'\)/);
  assert.match(source, /loadSpace = \(\) => import\('\.\/spaceRenderers'\)/);
  assert.match(source, /loadOrthogonality = \(\) => import\('\.\/orthogonalityRenderers'\)/);
  assert.match(source, /loadDeterminant = \(\) => import\('\.\/determinantRenderers'\)/);
  assert.match(source, /loadEigen = \(\) => import\('\.\/eigenRenderers'\)/);
  assert.match(source, /loadSvd = \(\) => import\('\.\/svdRenderers'\)/);
});
