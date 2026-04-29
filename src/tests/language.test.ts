import { describe, it, expect } from 'vitest';
import { translations } from '../i18n/translations';
import type { AppLanguage } from '../types';

describe('Language Support', () => {
  const languages: AppLanguage[] = ['English', 'Hindi', 'Bengali', 'Tamil', 'Telugu'];

  it('should have all 5 supported languages', () => {
    const keys = Object.keys(translations);
    languages.forEach(lang => {
      expect(keys).toContain(lang);
    });
  });

  it('should have specific nav labels for English', () => {
    expect(translations['English']['nav.home']).toBe('Home');
  });

  it('should have specific nav labels for Hindi', () => {
    expect(translations['Hindi']['nav.home']).toBe('होम');
  });

  it('should have specific nav labels for Tamil', () => {
    expect(translations['Tamil']['nav.home']).toBe('முகப்பு');
  });

  it('should have specific nav labels for Telugu', () => {
    expect(translations['Telugu']['nav.home']).toBe('హోమ్');
  });

  it('should have specific nav labels for Bengali', () => {
    expect(translations['Bengali']['nav.home']).toBe('হোম');
  });

  it('should not include Hinglish', () => {
    expect(Object.keys(translations)).not.toContain('Hinglish');
  });

  it('should have greeting translations for every language', () => {
    languages.forEach(lang => {
      expect(translations[lang]['ans.greeting']).toBeDefined();
    });
  });

  it('should have consistent button labels across all languages', () => {
    const requiredButtons = ['btn.ask_ai', 'btn.start_journey', 'btn.find_booth'];
    languages.forEach(lang => {
      requiredButtons.forEach(btn => {
        expect(translations[lang][btn]).toBeDefined();
      });
    });
  });
});
