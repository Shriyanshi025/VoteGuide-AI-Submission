import { describe, it, expect } from 'vitest';
import { translations } from '../i18n/translations';
import type { AppLanguage } from '../types';

describe('Language Support', () => {
  it('should have labels for English', () => {
    expect(translations['English']).toBeDefined();
    expect(translations['English']['nav.home']).toBe('Home');
  });

  it('should have labels for Hindi', () => {
    expect(translations['Hindi']).toBeDefined();
    expect(translations['Hindi']['nav.home']).toBe('होम');
  });

  it('should not include Hinglish as a language option', () => {
    const supportedLanguages = Object.keys(translations);
    expect(supportedLanguages).not.toContain('Hinglish');
  });

  it('should have greeting translations for all supported languages', () => {
    (Object.keys(translations) as AppLanguage[]).forEach(lang => {
      expect(translations[lang]['ans.greeting']).toBeDefined();
    });
  });
});
