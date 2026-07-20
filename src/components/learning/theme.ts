import type { LearningLessonStatus } from '../../core/learning/types';

export type LearningLabTheme = 'dark' | 'light';
export type LearningRailLessonTone = 'selected' | 'past' | 'future' | 'quiet';

export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (target.closest('[data-quiz]')) return true;
  return false;
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
  };

  const surface = {
    card: isLight
      ? 'learning-lab-surface-elevated border-[#205089]/14 bg-[#DCE6F1] text-[#030509] shadow-[0_8px_18px_rgba(32,80,137,0.07)]'
      : 'border-[#A8B8C8]/20 bg-[#172232] text-[#F2F6FA] shadow-[0_10px_24px_rgba(0,0,0,0.18)]',
    interactiveCard: isLight
      ? 'border-[#205089]/14 bg-gradient-to-br from-[#E3EAF2] to-[#B8C8DA]/58 text-[#030509] shadow-[0_8px_18px_rgba(32,80,137,0.07)] hover:border-[#205089]/30 hover:from-[#DCE6F1] hover:to-[#B8C8DA]/70'
      : 'border-[#A8B8C8]/20 bg-gradient-to-br from-[#1A2636] to-[#26384E] text-[#F2F6FA] shadow-[0_10px_24px_rgba(0,0,0,0.18)] hover:border-[#A8B8C8]/42 hover:from-[#213148] hover:to-[#2D425B]',
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
        ? isLight ? 'bg-[#B8C8DA]/70 text-[#123B68]' : 'bg-[#D7DCE2]/16 text-[#F4EFE6] shadow-[inset_0_0_0_1px_rgba(215,220,226,0.18)]'
        : isLight ? 'text-[#030509]/72 hover:bg-[#9FB4CA]/70 hover:text-[#123B68]' : 'text-[#F2F6FA]/72 hover:bg-[#D7DCE2]/10 hover:text-[#F4EFE6]',
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
        ? isLight ? 'bg-white text-[#123B68] shadow-[inset_0_0_0_1px_rgba(32,80,137,0.18),0_6px_14px_rgba(32,80,137,0.10)]' : 'bg-[#D7DCE2] text-[#121A24] shadow-[0_6px_14px_rgba(0,0,0,0.24)]'
        : isLight ? 'text-[#030509]/48 hover:text-[#123B68]' : 'text-[#F2F6FA]/48 hover:text-[#F2F6FA]',
    ),
  };

  const rail = {
    railToggleButton: cx(
      'flex h-11 w-11 shrink-0 items-center justify-center rounded-md border transition-colors',
      focusRing,
      isLight
        ? 'border-[#205089]/10 bg-[#DCE6F1]/34 text-[#123B68]/52 hover:bg-[#DCE6F1]/70 hover:text-[#123B68]'
        : 'border-[#A8B8C8]/12 bg-[#A8B8C8]/8 text-[#F2F6FA]/52 hover:bg-[#A8B8C8]/14 hover:text-[#F2F6FA]',
    ),
    trackHeading: (isCurrentTrack: boolean) => (
      isLight
        ? isCurrentTrack
          ? 'text-[#254F70] hover:text-[#173F5F]'
          : 'text-[#5F6F7F] hover:text-[#254F70]'
        : isCurrentTrack
          ? 'text-[#C8D4DF] hover:text-[#F2F6FA]'
          : 'text-[#A8B4C0] hover:text-[#D8E3EC]'
    ),
    trackTitle: (isCurrentTrack: boolean) => (
      isLight
        ? isCurrentTrack
          ? 'text-[#254F70] group-hover:text-[#173F5F]'
          : 'text-[#5F6F7F] group-hover:text-[#254F70]'
        : isCurrentTrack
          ? 'text-[#C8D4DF] group-hover:text-[#F2F6FA]'
          : 'text-[#A8B4C0] group-hover:text-[#D8E3EC]'
    ),
    lessonRowSurface: (tone: LearningRailLessonTone) => {
      if (tone === 'selected') {
        return isLight
          ? 'border-transparent bg-white/80 shadow-[0_8px_18px_rgba(32,80,137,0.10)]'
          : 'border-transparent bg-[#A8B8C8]/20 shadow-[0_10px_18px_rgba(0,0,0,0.16)]';
      }
      return isLight
        ? 'border-transparent bg-transparent hover:border-[#205089]/10 hover:bg-white/50 hover:text-[#123B68]'
        : 'border-transparent bg-transparent hover:border-[#A8B8C8]/10 hover:bg-[#A8B8C8]/10';
    },
    lessonNumber: (tone: LearningRailLessonTone, isCompleted: boolean) => {
      if (isCompleted) {
        return tone === 'quiet'
          ? isLight
            ? 'border-[#2FBF71]/42 bg-[#DDF7EA] text-[#2FBF71]'
            : 'border-[#2FBF71]/40 bg-[#123D28] text-[#A6E8C1]'
          : 'border-[#2FBF71] bg-[#2FBF71] text-white shadow-[0_4px_10px_rgba(47,191,113,0.24)]';
      }
      if (tone === 'selected') {
        return isLight
          ? 'border-transparent bg-[#2F6F9F] text-white shadow-[0_5px_12px_rgba(47,111,159,0.18)]'
          : 'border-transparent bg-[#F2F6FA] text-[#121A24]';
      }
      return isLight
        ? tone === 'quiet'
          ? 'border-[#8A94A3]/20 bg-[#E7EDF4]/50 text-[#5F6B7A]/60'
          : 'border-[#8A94A3]/40 bg-[#E7EDF4] text-[#5F6B7A]'
        : tone === 'quiet'
          ? 'border-[#A8B8C8]/10 bg-[#A8B8C8]/5 text-[#F2F6FA]/40'
          : 'border-[#A8B8C8]/25 bg-[#A8B8C8]/10 text-[#F2F6FA]/60';
    },
    lessonConnector: (tone: LearningRailLessonTone, isCompleted: boolean) => {
      if (isCompleted) {
        return tone === 'quiet' ? 'bg-[#2FBF71]/30' : 'bg-[#2FBF71]';
      }
      return isLight
        ? tone === 'quiet' ? 'bg-[#8A94A3]/10' : 'bg-[#8A94A3]/30'
        : tone === 'quiet' ? 'bg-[#A8B8C8]/10' : 'bg-[#A8B8C8]/20';
    },
  };

  const sectionAccent = {
    section: isLight
      ? '[--learning-lab-section-accent-bg:rgba(255,255,255,0.88)] [--learning-lab-section-accent-text:#030509] shadow-none'
      : '[--learning-lab-section-accent-bg:#17304A] [--learning-lab-section-accent-text:#F2F6FA] shadow-none',
    heading: isLight ? 'text-[#123B68]' : 'text-[#A8D4FF]',
    note: isLight ? 'bg-[#205089]/8 text-[#123B68]' : 'bg-[#A8D4FF]/10 text-[#D7EAFE]',
  };

  return {
    isLight,
    radius,
    surface,
    button,
    rail,
    sectionAccent,
    page: isLight ? 'learning-lab-light bg-[#D3DEEA] text-[#030509]' : 'bg-[#121A24] text-[#F2F6FA]',
    content: isLight ? 'learning-lab-surface-content bg-[#D3DEEA]' : 'bg-[#121A24]',
    sidebar: isLight
      ? 'border-[#9A9A9A]/16 bg-gradient-to-b from-[#DCE6F1] via-[#D3DEEA] to-[#B8C8DA] text-[#030509] shadow-[0_12px_28px_rgba(32,80,137,0.07)]'
      : 'border-[#3A414A] bg-gradient-to-b from-[#223247] via-[#172232] to-[#121A24] text-[#F2F6FA] shadow-[0_10px_24px_rgba(0,0,0,0.18)]',
    sidebarHover: isLight ? 'hover:bg-[#B8C8DA]/55' : 'hover:bg-[#A8B8C8]/16',
    brandTile: isLight
      ? 'border-[#205089]/16 bg-[#B8C8DA]/70 text-[#123B68]'
      : 'border-[#A8B8C8]/24 bg-[#172232] text-[#A8B8C8]',
    accentText: isLight ? 'text-[#123B68]' : 'text-[#A8B8C8]',
    mutedText: isLight ? 'text-[#030509]/56' : 'text-[#F2F6FA]/60',
    backLink: isLight ? 'text-[#5F6B7A]' : 'text-[#9AA6B2]',
    bodyText: isLight ? 'text-[#030509]/72' : 'text-[#F2F6FA]/78',
    titleText: isLight ? 'text-[#030509]' : 'text-[#F4EFE6]',
    lessonTitleText: isLight ? '[--learning-lab-lesson-title:#1F5F5B]' : '[--learning-lab-lesson-title:#D8E3EC]',
    lessonPageViewport: isLight ? 'bg-white' : 'bg-[#172232]',
    eyebrowText: isLight ? 'text-[#123B68]' : 'text-[#A8B8C8]',
    iconTile: isLight ? 'bg-[#B8C8DA]/70 text-[#123B68]' : 'bg-[#496F98]/32 text-[#F2F6FA]',
    focusRing,
    ctaPill: isLight
      ? 'bg-[#F2C94C] text-[#444444] shadow-[0_8px_20px_rgba(242,201,76,0.24)] hover:bg-[#FFD65A]'
      : 'bg-[#F2C94C] text-[#444444] shadow-[0_8px_22px_rgba(242,201,76,0.22)] hover:bg-[#FFD65A]',
    unavailable: surface.unavailable,
    header: isLight
      ? 'learning-lab-surface-elevated border-[#205089]/8 bg-white/90 text-[#030509] shadow-[0_8px_18px_rgba(32,80,137,0.07)]'
      : 'border-[#A8B8C8]/10 bg-[#172232]/96 text-[#F2F6FA] shadow-[0_10px_20px_rgba(0,0,0,0.14)]',
    searchBox: isLight ? 'border-[#205089]/16 bg-[#B8C8DA]/48 text-[#030509]/60' : 'border-[#A8B8C8]/28 bg-[#121A24] text-[#F2F6FA]/72',
    segmented: isLight ? 'border-[#205089]/14 bg-[#B8C8DA]/45' : 'border-[#A8B8C8]/22 bg-[#121A24]',
    segmentActive: button.segmented(true),
    segmentIdle: button.segmented(false),
    iconButton: button.icon,
    plainIconButton: button.ghost,
    navItem: button.nav,
    statusPill: (isPlaceholder: boolean) => isPlaceholder
      ? isLight ? 'border border-[#8A94A3]/24 bg-[#8A94A3]/10 text-[#5F6B7A]' : 'border border-[#8A94A3]/26 bg-[#8A94A3]/12 text-[#B4BDC7]'
      : isLight ? 'border border-[#2FBF71]/34 bg-[#2FBF71]/15 text-[#2E8A5A]' : 'border border-[#2FBF71]/38 bg-[#2FBF71]/20 text-[#A6E8C1]',
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
