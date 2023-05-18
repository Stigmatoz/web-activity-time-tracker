import Browser from 'webextension-polyfill';
import { initTracker } from './tracker';
import { logger } from './compositions/logger';
import { useFavicon } from './compositions/update-favicon';

logger.log('Start background script');

Browser.runtime.onInstalled.addListener(details => {
  logger.log('Extension installed:', details);
});

Browser.webNavigation.onCompleted.addListener(async function (details) {
  await useFavicon(details.tabId);
});

initTracker();
