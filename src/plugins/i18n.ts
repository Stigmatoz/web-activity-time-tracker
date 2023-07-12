import { createI18n } from 'vue-i18n';
import en from '../_locales/en/messages.json';
import ru from '../_locales/ru/messages.json';

const i18n = createI18n({
  legacy: false,
  locale: import.meta.env.VITE_I18N_LOCALE || 'ru',
  fallbackLocale: import.meta.env.VITE_I18N_FALLBACK_LOCALE || 'en',
  messages: {
    en,
    ru,
  },
});

export default i18n;
