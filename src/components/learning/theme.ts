import type { LearningLessonStatus } from '../../core/learning/types';

export type LearningLabTheme = 'dark' | 'light';

export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function getLearningLabTheme(theme: LearningLabTheme) {
  const isLight = theme === 'light';

  return {
    isLight,
    page: isLight ? 'learning-lab-light bg-[#f6fbff] text-slate-950' : 'bg-[#050b16] text-slate-100',
    sidebar: isLight
      ? 'border-sky-100 bg-gradient-to-b from-white via-[#f6fbff] to-[#eef6ff] text-slate-950 shadow-sky-100/70'
      : 'border-slate-800 bg-gradient-to-b from-[#101827] via-[#0b1220] to-[#050b16] text-slate-100 shadow-black/30',
    sidebarHover: isLight ? 'hover:bg-sky-50' : 'hover:bg-slate-800/80',
    brandTile: isLight
      ? 'border-sky-100 bg-[#eef6ff] text-sky-700'
      : 'border-slate-700 bg-slate-950 text-sky-300',
    accentText: isLight ? 'text-sky-600' : 'text-sky-300',
    mutedText: isLight ? 'text-slate-500' : 'text-slate-400',
    bodyText: isLight ? 'text-slate-600' : 'text-slate-300',
    titleText: isLight ? 'text-slate-950' : 'text-white',
    eyebrowText: isLight ? 'text-sky-700' : 'text-sky-300',
    card: isLight
      ? 'border-sky-100 bg-white text-slate-950 shadow-sky-100/70'
      : 'border-slate-800 bg-slate-900 text-slate-100 shadow-black/30',
    interactiveCard: isLight
      ? 'border-sky-100 bg-gradient-to-br from-white to-[#f6fbff] text-slate-950 shadow-sky-100/70 hover:border-sky-300'
      : 'border-slate-800 bg-gradient-to-br from-slate-900 to-[#101827] text-slate-100 shadow-black/30 hover:border-sky-500/70',
    iconTile: isLight ? 'bg-[#eef6ff] text-sky-700' : 'bg-slate-800 text-sky-200',
    focusRing: 'focus:outline-none focus:ring-2 focus:ring-sky-300',
    primaryAction: isLight
      ? 'bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-300'
      : 'bg-sky-500 text-slate-950 hover:bg-sky-400 focus:ring-sky-300',
    unavailable: isLight
      ? 'border-slate-200 bg-slate-50 text-slate-500'
      : 'border-slate-700 bg-slate-800 text-slate-400',
    header: isLight
      ? 'border-sky-100 bg-white/95 text-slate-950 shadow-sky-100/70'
      : 'border-slate-800 bg-[#0f172a] text-slate-100 shadow-black/20',
    searchBox: isLight ? 'bg-[#eef6ff] text-slate-500' : 'bg-slate-900 text-slate-400',
    segmented: isLight ? 'border-sky-100 bg-[#eef6ff]' : 'border-slate-800 bg-slate-900',
    segmentActive: isLight ? 'bg-white text-sky-700 shadow-sm' : 'bg-slate-700 text-sky-100 shadow-sm',
    segmentIdle: isLight ? 'text-slate-500 hover:text-sky-700' : 'text-slate-400 hover:text-sky-200',
    iconButton: isLight
      ? 'border-sky-100 bg-white text-slate-700 shadow-sm hover:bg-sky-50 hover:text-sky-700'
      : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white',
    plainIconButton: isLight
      ? 'text-slate-500 hover:bg-sky-50 hover:text-sky-700'
      : 'text-slate-400 hover:bg-slate-800 hover:text-white',
    navItem: (isActive: boolean) => isActive
      ? isLight ? 'bg-sky-50 text-sky-700' : 'bg-slate-800/90 text-sky-200'
      : isLight ? 'text-slate-600 hover:bg-sky-50 hover:text-sky-700' : 'text-slate-300 hover:bg-slate-800 hover:text-white',
    statusPill: (isPlaceholder: boolean) => isPlaceholder
      ? isLight ? 'bg-slate-100 text-slate-500' : 'bg-slate-800 text-slate-400'
      : isLight ? 'bg-sky-100 text-sky-700' : 'bg-sky-500/15 text-sky-200',
    lessonCard: (isSelected: boolean) => isSelected
      ? isLight
        ? 'border-sky-300 bg-sky-50 shadow-sky-100/80'
        : 'border-sky-500/70 bg-slate-800 shadow-black/30'
      : isLight
        ? 'border-sky-100 bg-white hover:border-sky-200 hover:bg-sky-50/60'
        : 'border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800/80',
    lessonStatus: (status: LearningLessonStatus) => {
      if (status === 'available') {
        return isLight
          ? 'border-sky-200 bg-sky-50 text-sky-700'
          : 'border-sky-500/40 bg-sky-500/15 text-sky-200';
      }
      if (status === 'next') {
        return isLight
          ? 'border-violet-200 bg-violet-50 text-violet-700'
          : 'border-violet-500/40 bg-violet-500/15 text-violet-200';
      }
      return isLight
        ? 'border-slate-200 bg-slate-50 text-slate-500'
        : 'border-slate-700 bg-slate-800 text-slate-400';
    },
  };
}
