import { useWebUsageSummaryForDay } from '../compositions/summary-data-today';
import { convertLimitTimeToString } from '../utils/converter';
import { Settings } from '../compositions/settings';
import { StorageParams } from '../storage/storage-params';
import { NotificationType, showNotification } from '../compositions/show-notification';

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

    await showNotification(NotificationType.DailySummaryNotification, title, message);
  }
}
