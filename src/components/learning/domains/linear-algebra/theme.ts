import type { LearningLabTheme } from '../../theme';

export type MathVisualTheme = {
  isLight: boolean;
  bg: string;
  cardBorder: string;
  gridLine: string;
  axisLine: string;
  axisText: string;
  originDot: string;
  vectorU: string;
  vectorV: string;
  vectorW: string;
  vectorResult: string;
  vectorDim: string;
  vectorUnit: string;
  angleArc: string;
  projectionLine: string;
  rightAngle: string;
  matrixBracket: string;
  matrixCellBg: string;
  matrixCellBorder: string;
  matrixCellText: string;
  matrixHighlightRow: string;
  matrixHighlightCol: string;
  matrixHighlightCell: string;
  matrixPivotCell: string;
  matrixActiveRow: string;
  accentBadge: string;
  controlBg: string;
  controlText: string;
};

export function getMathVisualTheme(theme: LearningLabTheme): MathVisualTheme {
  const isLight = theme === 'light';

  return {
    isLight,
    bg: isLight ? '#F8FAFC' : '#0F172A',
    cardBorder: isLight ? 'border-slate-200' : 'border-slate-800',
    gridLine: isLight ? '#E2E8F0' : '#1E293B',
    axisLine: isLight ? '#64748B' : '#94A3B8',
    axisText: isLight ? '#475569' : '#94A3B8',
    originDot: isLight ? '#334155' : '#CBD5E1',
    vectorU: '#2563EB', // Blue-600
    vectorV: '#D97706', // Amber-600
    vectorW: '#059669', // Emerald-600
    vectorResult: '#059669', // Emerald-600
    vectorDim: '#7C3AED', // Purple-600
    vectorUnit: '#0284C7', // Sky-600
    angleArc: '#EC4899', // Pink-500
    projectionLine: isLight ? '#94A3B8' : '#64748B',
    rightAngle: isLight ? '#64748B' : '#94A3B8',
    matrixBracket: isLight ? '#334155' : '#94A3B8',
    matrixCellBg: isLight ? '#FFFFFF' : '#1E293B',
    matrixCellBorder: isLight ? '#CBD5E1' : '#334155',
    matrixCellText: isLight ? '#0F172A' : '#F8FAFC',
    matrixHighlightRow: isLight ? 'bg-blue-100/80 border-blue-400 text-blue-900' : 'bg-blue-900/40 border-blue-500 text-blue-200',
    matrixHighlightCol: isLight ? 'bg-amber-100/80 border-amber-400 text-amber-900' : 'bg-amber-900/40 border-amber-500 text-amber-200',
    matrixHighlightCell: isLight ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold' : 'bg-emerald-900/50 border-emerald-400 text-emerald-200 font-bold',
    matrixPivotCell: isLight ? 'bg-amber-100 border-amber-500 text-amber-900 font-bold' : 'bg-amber-900/60 border-amber-400 text-amber-200 font-bold',
    matrixActiveRow: isLight ? 'bg-indigo-100/80 border-indigo-400 text-indigo-900' : 'bg-indigo-900/40 border-indigo-500 text-indigo-200',
    accentBadge: isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-800 text-slate-300 border-slate-700',
    controlBg: isLight ? 'bg-white border-slate-300' : 'bg-slate-800 border-slate-700',
    controlText: isLight ? 'text-slate-800' : 'text-slate-200',
  };
}
