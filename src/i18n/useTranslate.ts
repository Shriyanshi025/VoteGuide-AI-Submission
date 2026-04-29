import { useUIStore } from '../store/useUIStore';
import { translations } from './translations';

/**
 * Hook to retrieve translated strings based on the current language in useUIStore.
 */
export const useTranslate = () => {
  const language = useUIStore(state => state.language);
  
  const t = (key: string): string => {
    const langSet = translations[language] || translations['English'];
    return langSet[key] || key;
  };

  return { t, language };
};
