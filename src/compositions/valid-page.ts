import Browser from 'webextension-polyfill';

export function isValidPage(tab: Browser.Tabs.Tab | undefined): boolean {
  if (tab == null || tab == undefined || !tab.url || !tab.id) return false;

  if (
    (!tab.url.startsWith('http:') &&
      !tab.url.startsWith('https:') &&
      !tab.url.startsWith('file:')) ||
    tab.url.startsWith('chrome://') ||
    tab.url.startsWith('chrome-extension://')
  )
    return false;
  return true;
}
