import Browser from 'webextension-polyfill';
import { useWebUsageSummaryForDay } from '../compositions/summary-data-today';
import { convertLimitTimeToString } from '../utils/converter';
import { Settings } from '../compositions/settings';
import { StorageParams } from '../storage/storage-params';

const NOTIFICATION_ID = 'daily-summary-notification';

export async function dailySummaryNotification() {
  const showDailyNotifacation = (await Settings.getInstance().getSetting(
    StorageParams.DAILY_NOTIFICATION,
  )) as boolean;

  if (showDailyNotifacation) {
    const data = await useWebUsageSummaryForDay();
    if (data == null) return;

    const title = `Today's total usage time ${convertLimitTimeToString(data.time)}`;
    const message = `${data?.percentageFromYesterday} compared to yesterday \n${
      data.mostVisitedSite
    } most visited website ${convertLimitTimeToString(data.mostVisitedSiteTime)}`;

    await showNotification(title, message);
  }
}

async function showNotification(title: string, message: string) {
  await Browser.notifications.clear(NOTIFICATION_ID);
  await Browser.notifications.create(NOTIFICATION_ID, {
    type: 'basic',
    title: title,
    message: message,
    iconUrl: Browser.runtime.getURL('128x128.png'),
    isClickable: false,
  });
}
