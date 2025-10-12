import { Notifications } from '../entity/notification';
import { Tab } from '../entity/tab';
import { StorageParams } from '../storage/storage-params';
import { isDomainEquals } from '../utils/common';
import { todayLocalDate } from '../utils/date';
import { log } from '../utils/logger';
import { Settings } from './settings';

export type LimitExceed = {
  IsLimitExceeded: boolean;
  LimitTime: number | null;
};

export function useNotificationList() {
  async function isNeedToShowNotification(url: string, tab: Tab): Promise<boolean> {
    const notificationList = (await Settings.getInstance().getSetting(
      StorageParams.NOTIFICATION_LIST,
    )) as Notifications[];
    const array = Object.values(notificationList);
    const item = array?.find(x => isDomainEquals(x.domain, url));
    if (item != undefined) {
      const date = tab.days.find(x => x.date == todayLocalDate());
      if (date != undefined) {
        // Check if we've exceeded the threshold and haven't shown notification for this interval yet
        const currentInterval = Math.floor(date.summary / item.time);
        const previousSummary = date.summary - 1; // Previous second
        const previousInterval = Math.floor(previousSummary / item.time);
        
        // Show notification when we cross into a new interval (threshold exceeded)
        if (date.summary >= item.time && currentInterval > previousInterval) {
          log(
            `Notification threshold exceeded: website ${url} threshold ${item.time}s, current time ${date.summary}s, interval ${currentInterval}`,
          );
          return true;
        }
      }
    }

    return false;
  }

  async function isDomainInNotificationsLimit(url: string): Promise<boolean> {
    const notificationList = (await Settings.getInstance().getSetting(
      StorageParams.NOTIFICATION_LIST,
    )) as Notifications[];
    const array = Object.values(notificationList);
    const item = array?.find(x => isDomainEquals(x.domain, url));
    return item != undefined;
  }

  return {
    isNeedToShowNotification,
    isDomainInNotificationsLimit,
  };
}
