import { useUIStore } from '@/store/uiStore';
import { translations } from '@/i18n/translations';

export const useTranslation = () => {
  const language = useUIStore((s) => s.language);
  const t = translations[language];
  const isRTL = language === 'ar';
  const locale = language === 'ar' ? 'ar-MA' : 'fr-FR';
  return { t, language, isRTL, locale };
};
