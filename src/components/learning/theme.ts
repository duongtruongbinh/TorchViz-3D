import type { LearningLessonStatus } from '../../core/learning/types';

export type LearningLabTheme = 'dark' | 'light';

export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function getLearningLabTheme(theme: LearningLabTheme) {
  const isLight = theme === 'light';
  const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#517FCB]/30';

  const radius = {
    icon: 'rounded-lg',
    button: 'rounded-lg',
    card: 'rounded-xl',
    panel: 'rounded-xl',
    pill: 'rounded-full',
    sidebarEdge: 'rounded-r-lg',
    headerEdge: 'rounded-b-lg',
  };

  const surface = {
    card: isLight
      ? 'border-[#205089]/14 bg-[#DCE6F1] text-[#030509] shadow-[0_8px_18px_rgba(32,80,137,0.07)]'
      : 'border-[#A8B8C8]/20 bg-[#172232] text-[#F2F6FA] shadow-[0_10px_24px_rgba(0,0,0,0.18)]',
    interactiveCard: isLight
      ? 'border-[#205089]/14 bg-gradient-to-br from-[#E3EAF2] to-[#B8C8DA]/58 text-[#030509] shadow-[0_8px_18px_rgba(32,80,137,0.07)] hover:border-[#205089]/30 hover:from-[#DCE6F1] hover:to-[#B8C8DA]/70'
      : 'border-[#A8B8C8]/20 bg-gradient-to-br from-[#172232] to-[#223247] text-[#F2F6FA] shadow-[0_10px_24px_rgba(0,0,0,0.18)] hover:border-[#A8B8C8]/42 hover:from-[#1E2D3F] hover:to-[#2A3B52]',
    unavailable: isLight
      ? 'border-[#205089]/10 bg-[#B8C8DA]/42 text-[#030509]/58'
      : 'border-[#A8B8C8]/14 bg-[#A8B8C8]/10 text-[#F2F6FA]/62',
  };

  const button = {
    primary: cx(
      'font-black shadow-[0_8px_24px_rgba(32,80,137,0.24)] transition-colors',
      focusRing,
      isLight
        ? 'bg-[#205089]/95 text-[#EBEFF4] hover:bg-[#205089]'
        : 'bg-[#496F98] text-[#F2F6FA] hover:bg-[#5A7FA8]',
    ),
    secondary: cx(
      'border font-black shadow-[0_8px_24px_rgba(32,80,137,0.12)] transition-colors',
      focusRing,
      isLight
        ? 'border-[#205089]/16 bg-[#B8C8DA]/58 text-[#030509] hover:border-[#205089]/28 hover:bg-[#DCE6F1]'
        : 'border-[#A8B8C8]/20 bg-[#A8B8C8]/10 text-[#F2F6FA]/84 hover:border-[#A8B8C8]/40 hover:bg-[#496F98]/28 hover:text-[#F2F6FA]',
    ),
    ghost: cx(
      'font-black transition-colors',
      focusRing,
      isLight
        ? 'text-[#030509]/68 hover:bg-[#B8C8DA]/48 hover:text-[#205089]'
        : 'text-[#F2F6FA]/70 hover:bg-[#A8B8C8]/14 hover:text-[#F2F6FA]',
    ),
    icon: cx(
      'border shadow-[0_8px_24px_rgba(32,80,137,0.10)] transition-colors',
      focusRing,
      isLight
        ? 'border-[#205089]/14 bg-[#DCE6F1] text-[#030509]/76 hover:border-[#205089]/28 hover:bg-[#B8C8DA]/50 hover:text-[#205089]'
        : 'border-[#A8B8C8]/20 bg-[#172232] text-[#F2F6FA]/80 hover:border-[#A8B8C8]/42 hover:bg-[#496F98]/26 hover:text-[#F2F6FA]',
    ),
    nav: (isActive: boolean) => cx(
      'font-black transition-colors',
      focusRing,
      isActive
        ? isLight ? 'bg-[#B8C8DA]/70 text-[#123B68]' : 'bg-[#496F98]/42 text-[#F2F6FA]'
        : isLight ? 'text-[#030509]/72 hover:bg-[#9FB4CA]/70 hover:text-[#123B68]' : 'text-[#F2F6FA]/78 hover:bg-[#A8B8C8]/18 hover:text-[#F2F6FA]',
    ),
    card: cx(
      'border text-left shadow-sm transition-transform duration-150 hover:-translate-y-0.5',
      focusRing,
      surface.interactiveCard,
    ),
    segmented: (isActive: boolean) => cx(
      'font-black transition-colors',
      focusRing,
      isActive
        ? isLight ? 'bg-[#DCE6F1] text-[#123B68] shadow-[0_8px_18px_rgba(32,80,137,0.07)]' : 'bg-[#496F98]/76 text-[#F2F6FA] shadow-[0_8px_16px_rgba(0,0,0,0.14)]'
        : isLight ? 'text-[#030509]/62 hover:text-[#123B68]' : 'text-[#F2F6FA]/66 hover:text-[#F2F6FA]',
    ),
  };

  return {
    isLight,
    radius,
    surface,
    button,
    page: isLight ? 'learning-lab-light bg-[#D3DEEA] text-[#030509]' : 'bg-[#121A24] text-[#F2F6FA]',
    sidebar: isLight
      ? 'border-[#205089]/14 bg-gradient-to-b from-[#DCE6F1] via-[#D3DEEA] to-[#B8C8DA] text-[#030509] shadow-[0_12px_28px_rgba(32,80,137,0.07)]'
      : 'border-[#A8B8C8]/18 bg-gradient-to-b from-[#223247] via-[#172232] to-[#121A24] text-[#F2F6FA] shadow-[0_10px_24px_rgba(0,0,0,0.18)]',
    sidebarHover: isLight ? 'hover:bg-[#B8C8DA]/55' : 'hover:bg-[#A8B8C8]/16',
    brandTile: isLight
      ? 'border-[#205089]/16 bg-[#B8C8DA]/70 text-[#123B68]'
      : 'border-[#A8B8C8]/24 bg-[#172232] text-[#A8B8C8]',
    accentText: isLight ? 'text-[#123B68]' : 'text-[#A8B8C8]',
    mutedText: isLight ? 'text-[#030509]/56' : 'text-[#F2F6FA]/60',
    bodyText: isLight ? 'text-[#030509]/72' : 'text-[#F2F6FA]/78',
    titleText: isLight ? 'text-[#030509]' : 'text-white',
    eyebrowText: isLight ? 'text-[#123B68]' : 'text-[#A8B8C8]',
    card: surface.card,
    interactiveCard: surface.interactiveCard,
    iconTile: isLight ? 'bg-[#B8C8DA]/70 text-[#123B68]' : 'bg-[#496F98]/32 text-[#F2F6FA]',
    focusRing,
    primaryAction: button.primary,
    unavailable: surface.unavailable,
    header: isLight
      ? 'border-[#205089]/14 bg-[#DCE6F1]/95 text-[#030509] shadow-[0_8px_18px_rgba(32,80,137,0.07)]'
      : 'border-[#A8B8C8]/18 bg-[#172232]/96 text-[#F2F6FA] shadow-[0_10px_20px_rgba(0,0,0,0.14)]',
    searchBox: isLight ? 'border-[#205089]/16 bg-[#B8C8DA]/48 text-[#030509]/60' : 'border-[#A8B8C8]/28 bg-[#121A24] text-[#F2F6FA]/72',
    segmented: isLight ? 'border-[#205089]/14 bg-[#B8C8DA]/45' : 'border-[#A8B8C8]/22 bg-[#121A24]',
    segmentActive: button.segmented(true),
    segmentIdle: button.segmented(false),
    iconButton: button.icon,
    plainIconButton: button.ghost,
    navItem: button.nav,
    statusPill: (isPlaceholder: boolean) => isPlaceholder
      ? isLight ? 'bg-[#B8C8DA]/52 text-[#030509]/58' : 'bg-[#A8B8C8]/10 text-[#F2F6FA]/60'
      : isLight ? 'bg-[#205089]/12 text-[#123B68]' : 'bg-[#496F98]/22 text-[#F2F6FA]',
    lessonCard: (isSelected: boolean) => isSelected
      ? isLight
        ? 'border-[#205089]/38 bg-[#B8C8DA]/72 shadow-[0_8px_18px_rgba(32,80,137,0.10)]'
        : 'border-[#A8B8C8]/40 bg-[#496F98]/24 shadow-[0_10px_24px_rgba(0,0,0,0.18)]'
      : isLight
        ? 'border-[#205089]/14 bg-[#DCE6F1] hover:border-[#205089]/28 hover:bg-[#B8C8DA]/48'
        : 'border-[#A8B8C8]/18 bg-[#172232] hover:border-[#A8B8C8]/38 hover:bg-[#223247]',
    lessonStatus: (status: LearningLessonStatus) => {
      if (status === 'available') {
        return isLight
          ? 'border-[#205089]/24 bg-[#205089]/12 text-[#123B68]'
          : 'border-[#A8B8C8]/32 bg-[#496F98]/18 text-[#F2F6FA]';
      }
      if (status === 'next') {
        return isLight
          ? 'border-[#205089]/22 bg-[#B8C8DA]/58 text-[#123B68]'
          : 'border-[#A8B8C8]/28 bg-[#496F98]/16 text-[#F2F6FA]';
      }
      return isLight
        ? 'border-[#205089]/12 bg-[#B8C8DA]/42 text-[#030509]/58'
        : 'border-[#A8B8C8]/12 bg-[#A8B8C8]/8 text-[#F2F6FA]/58';
    },
  };
}