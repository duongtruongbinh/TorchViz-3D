import { create } from 'zustand';

import type { Language } from '../lib/localization.ts';

type PreferencesState = {
  language: Language;
  setLanguage: (language: Language) => void;
};

export const usePreferencesStore = create<PreferencesState>((set) => ({
  language: 'vi',
  setLanguage: (language) => set({ language }),
}));
