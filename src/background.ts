import Browser from 'webextension-polyfill';
import { initTracker } from './tracker';
import { logger } from './compositions/logger';
import { scheduleJobs } from './jobs/sheduler';
import { Settings } from './compositions/settings';
import { StorageParams } from './storage/storage-params';

logger.log('Start background script');

Browser.runtime.onInstalled.addListener(details => {
  logger.log('Extension installed:', details);
});

Browser.storage.onChanged.addListener((changes, namespace) => {
  for (var key in changes) {
    if (Object.values(StorageParams).includes(key as StorageParams))
      Settings.getInstance().reloadSetting(key as StorageParams);
  }
});

scheduleJobs();
initTracker();
