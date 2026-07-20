import type { LlmRendererTheme } from './rendererTypes';

export function getLlmRendererTheme(themeClasses: LlmRendererTheme) {
  return {
    connector: themeClasses.isLight ? '#205089' : '#A8B8C8',
    tokenChip: themeClasses.isLight
      ? 'bg-[#DCE8F4] text-[#205089]'
      : 'bg-[#263B5B] text-[#DCE8F4]',
    tokenId: themeClasses.isLight
      ? 'bg-[#FFF0CF] text-[#674518]'
      : 'bg-[#8B6734]/40 text-[#FFE5B4]',
    rawText: themeClasses.isLight
      ? 'bg-white text-[#263B5B] ring-1 ring-[#205089]/10'
      : 'bg-[#263B5B] text-[#E5EEF8]',
    callout: {
      info: themeClasses.isLight
        ? 'border-[#205089]/14 bg-[#EFF6FC]'
        : 'border-[#7FB0FF]/18 bg-[#7FB0FF]/8',
      accent: themeClasses.isLight
        ? 'border-[#8D436F]/16 bg-[#FAEFF6]'
        : 'border-[#D58AB5]/18 bg-[#6C4B66]/20',
    },
    playback: {
      secondary: themeClasses.isLight
        ? 'bg-[#EEF2F6] text-[#263B5B]'
        : 'bg-[#263B5B] text-[#E5EEF8]',
      primary: themeClasses.isLight
        ? 'bg-[#205089] text-white'
        : 'bg-[#A8B8C8] text-[#121A24]',
    },
  };
}

export type LlmRendererSemanticTheme = ReturnType<typeof getLlmRendererTheme>;
