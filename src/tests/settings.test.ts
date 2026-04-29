import { describe, it, expect } from 'vitest';
import { useUIStore } from '../store/useUIStore';
import { translations } from '../i18n/translations';

describe('Settings & UI State', () => {
  it('should toggle dark mode theme correctly', () => {
    const { setTheme } = useUIStore.getState();
    setTheme('dark');
    expect(useUIStore.getState().theme).toBe('dark');
    setTheme('light');
    expect(useUIStore.getState().theme).toBe('light');
  });

  it('should correctly determine dark mode label based on state', () => {
    const lang = 'English';
    expect(translations[lang]['settings.dark_mode_off']).toBe('Enable Dark Mode');
    expect(translations[lang]['settings.dark_mode_on']).toBe('Switch to Light Mode');
  });

  it('should update font scale within reasonable bounds', () => {
    const { setFontScale } = useUIStore.getState();
    setFontScale(1.5);
    expect(useUIStore.getState().fontScale).toBe(1.5);
  });

  it('should toggle simple mode flag', () => {
    const { toggleSimpleMode } = useUIStore.getState();
    const initial = useUIStore.getState().simpleMode;
    toggleSimpleMode();
    expect(useUIStore.getState().simpleMode).toBe(!initial);
  });

  it('should change language correctly', () => {
    const { setLanguage } = useUIStore.getState();
    setLanguage('Hindi');
    expect(useUIStore.getState().language).toBe('Hindi');
  });
});
