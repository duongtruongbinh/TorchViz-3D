export type MathVisualTheme = {
  bg: string;
  gridLine: string;
  axisLine: string;
  axisText: string;
  originDot: string;
  vectorU: string;
  vectorV: string;
  vectorW: string;
  matrixBracket: string;
  matrixCellText: string;
  matrixHighlightRow: string;
  matrixHighlightCol: string;
  matrixHighlightCell: string;
  matrixPivotCell: string;
  matrixActiveRow: string;
};

export const MATH_VISUAL_THEME: MathVisualTheme = {
  bg: '#F8FAFC',
  gridLine: '#E2E8F0',
  axisLine: '#64748B',
  axisText: '#475569',
  originDot: '#334155',
  vectorU: '#2563EB', // Blue-600
  vectorV: '#D97706', // Amber-600
  vectorW: '#059669', // Emerald-600
  matrixBracket: '#334155',
  matrixCellText: '#0F172A',
  matrixHighlightRow: 'bg-blue-100/80 border-blue-400 text-blue-900',
  matrixHighlightCol: 'bg-amber-100/80 border-amber-400 text-amber-900',
  matrixHighlightCell: 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold',
  matrixPivotCell: 'bg-amber-100 border-amber-500 text-amber-900 font-bold',
  matrixActiveRow: 'bg-indigo-100/80 border-indigo-400 text-indigo-900',
};
