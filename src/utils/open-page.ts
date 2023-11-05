import Browser from 'webextension-polyfill';
import { SettingsTab } from './enums';

export async function openPage(tab: SettingsTab, domain?: string) {
  function getDomain() {
    return domain != undefined && tab == SettingsTab.WebsiteStats ? `&website=${domain}` : '';
  }

  let tabName = '';
  switch (tab) {
    case SettingsTab.Dashboard:
      tabName = 'dashboard';
      break;
    case SettingsTab.WebsiteStats:
      tabName = 'website-stats';
      break;
    case SettingsTab.GeneralSettings:
      tabName = 'settings';
      break;
  }
  const url = Browser.runtime.getURL(
    `src/dashboard.html${tabName != '' ? `?tab=${tabName}` : ''}${getDomain()}`,
  );
  const currentPage = await Browser.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  if (currentPage[0].url?.startsWith(`chrome-extension://${__APP_ID__}/src/dashboard.html`))
    await Browser.tabs.update({
      url: url,
      active: true,
    });
  else
    await Browser.tabs.create({
      url: url,
      active: true,
    });
}
