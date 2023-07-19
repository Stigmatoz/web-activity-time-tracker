import { Notifications } from '../entity/notification';
import { Tab } from '../entity/tab';
import { StorageParams } from '../storage/storage-params';
import { isDomainEquals } from '../utils/common';
import { todayLocalDate } from '../utils/date';
import { log } from './logger';
import { Settings } from './settings';

export type LimitExceed = {
  IsLimitExceeded: boolean;
  LimitTime: number | null;
};

export async function isNeedToShowNotification(url: string, tab: Tab): Promise<boolean> {
  const notificationList = (await Settings.getInstance().getSetting(
    StorageParams.NOTIFICATION_LIST,
  )) as Notifications[];
  const array = Object.values(notificationList);
  const item = array?.find(x => isDomainEquals(x.domain, url));
  if (item != undefined) {
    const date = tab.days.find(x => x.date == todayLocalDate());
    if (date != undefined) {
      if (date.summary != 0 && (date.summary == item.time || date.summary % item.time == 0)) {
        log(`Time for notification: website ${url} time ${item.time} summary time ${date.summary}`);
        return true;
      }
    }
  }

  return false;
}

export async function isDomainInNotificationsLimit(url: string): Promise<boolean> {
  const notificationList = (await Settings.getInstance().getSetting(
    StorageParams.NOTIFICATION_LIST,
  )) as Notifications[];
  const array = Object.values(notificationList);
  const item = array?.find(x => isDomainEquals(x.domain, url));
  return item != undefined;
}
