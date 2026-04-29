import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserPreferences, PersonaType, ExplanationMode, ThemeMode, AppLanguage } from '../types';

interface UIState extends UserPreferences {
  setPersona: (persona: PersonaType) => void;
  setExplanationMode: (mode: ExplanationMode) => void;
  setTheme: (theme: ThemeMode) => void;
  setFontScale: (scale: number) => void;
  setLanguage: (lang: AppLanguage) => void;
  setCurrentView: (view: string) => void;
  toggleSimpleMode: () => void;
  toggleVoiceEnabled: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      persona: 'first-time',
      explanationMode: 'simple',
      theme: 'light',
      fontScale: 1,
      simpleMode: false,
      voiceEnabled: false,
      language: 'English',
      currentView: 'home',

      setPersona: (persona) => set({ persona }),
      setExplanationMode: (explanationMode) => set({ explanationMode }),
      setTheme: (theme) => set({ theme }),
      setFontScale: (fontScale) => set({ fontScale }),
      setLanguage: (language) => set({ language }),
      setCurrentView: (currentView) => set({ currentView }),
      toggleSimpleMode: () => set((state) => ({ simpleMode: !state.simpleMode })),
      toggleVoiceEnabled: () => set((state) => ({ voiceEnabled: !state.voiceEnabled })),
    }),
    {
      name: 'voteguide-ui-storage',
    }
  )
);
