import Browser from 'webextension-polyfill';
import { initTracker } from './tracker';
import { logger } from './compositions/logger';
import { scheduleJobs } from './jobs/sheduler';
import { Settings } from './compositions/settings';
import { StorageParams } from './storage/storage-params';

logger.log('Start background script');

self.onerror = err => {
  console.error('Unhandled error:', err);
};

Browser.runtime.onInstalled.addListener(details => {
  logger.log('Extension installed:', details);
});

Browser.storage.onChanged.addListener((changes, namespace) => {
  for (var key in changes) {
    if (Object.values(StorageParams).includes(key as StorageParams))
      Settings.getInstance().reloadSetting(key as StorageParams);
  }
});

Browser.runtime.setUninstallURL('https://webtracker.online/goodbye.html');

Browser.runtime.onStartup.addListener(() => {
  logger.log(`onStartup event`);
});

scheduleJobs();
initTracker();
