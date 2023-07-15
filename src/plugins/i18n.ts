import { createI18n } from 'vue-i18n';
import Browser from 'webextension-polyfill';
import en from '../_locales/en/messages.json';
import ru from '../_locales/ru/messages.json';

const i18n = createI18n({
  legacy: false,
  locale: Browser.i18n.getUILanguage(),
  fallbackLocale: 'en',
  globalInjection: true,
  messages: {
    en,
    ru,
  },
});

export default i18n;
