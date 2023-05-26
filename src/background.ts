import Browser from 'webextension-polyfill';
import { initTracker } from './tracker';
import { logger } from './compositions/logger';
import { scheduleJobs } from './jobs/sheduler';

logger.log('Start background script');

Browser.runtime.onInstalled.addListener(details => {
  logger.log('Extension installed:', details);
});

scheduleJobs();
initTracker();
