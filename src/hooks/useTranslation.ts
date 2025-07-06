import { useStore } from '../store';
import { translations, Language } from '../i18n/translations';

export const useTranslation = () => {
  const { language } = useStore();
  
  const t = (path: string): string => {
    const keys = path.split('.');
    let value: any = translations[language as Language];
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        // Fallback to French if translation not found
        value = translations.fr;
        for (const k of keys) {
          if (value && typeof value === 'object' && k in value) {
            value = value[k];
          } else {
            return path; // Return the path if translation not found
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : path;
  };
  
  return { t, language };
};