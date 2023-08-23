import Browser from 'webextension-polyfill';
import { initTracker } from './tracker';
import { logger } from './compositions/logger';
import { scheduleJobs } from './jobs/sheduler';
import { Settings } from './compositions/settings';
import { StorageParams } from './storage/storage-params';
import { injecStorage } from './storage/inject-storage';
import { todayLocalDate } from './utils/date';

logger.log('Start background script');

self.onerror = err => {
  console.error('Unhandled error:', err);
};

Browser.storage.onChanged.addListener((changes, namespace) => {
  for (var key in changes) {
    if (Object.values(StorageParams).includes(key as StorageParams))
      Settings.getInstance().reloadSetting(key as StorageParams);
  }
});

Browser.runtime.setUninstallURL('https://webtracker.online/goodbye.html');

Browser.runtime.onInstalled.addListener(async details => {
  if (details.reason == 'install') {
    logger.log('Extension installed:', details);
    const settingsStorage = injecStorage();
    await settingsStorage.saveValue(StorageParams.INSTALL_DATE, todayLocalDate());

    const initialPageUrl = Browser.runtime.getURL('src/welcome.html');
    await Browser.tabs.create({
      url: initialPageUrl,
      active: true,
    });
  }
  if (details.reason == 'update') {
    const showChangelog = (await Settings.getInstance().getSetting(
      StorageParams.SHOW_CHANGELOG,
    )) as boolean;
    if (showChangelog)
      await Browser.tabs.create({
        url: 'https://webtracker.online/releasenotes.html',
        active: true,
      });
  }
});

Browser.runtime.onStartup.addListener(() => {
  logger.log(`onStartup event`);
});

Browser.windows.onFocusChanged.addListener(() => {
  logger.log('onFocusChanged');
});

scheduleJobs();
initTracker();
