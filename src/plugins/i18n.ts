import { createI18n } from 'vue-i18n';
import Browser from 'webextension-polyfill';
import en from '../_locales/en/messages.json';
import ru from '../_locales/ru/messages.json';
import de from '../_locales/de/messages.json';
import zh from '../_locales/zh_CN/messages.json';
import es from '../_locales/es/messages.json';

const locales = {
  en,
  ru,
  de,
  zh,
  es,
};

export type Languages = keyof typeof locales;

const i18n = createI18n({
  legacy: false,
  locale: Browser.i18n.getUILanguage(),
  fallbackLocale: 'en',
  globalInjection: true,
  messages: locales,
});

export default i18n;

export function getMessagesFromLocale() {
  let locale = i18n.global.locale.value;
  if (Object.keys(locales).indexOf(locale) == -1) locale = 'en';
  return i18n.global.getLocaleMessage(locale);
}
