import { useWebUsageSummaryForDay } from '../compositions/summary-data-today';
import { convertLimitTimeToString } from '../utils/converter';
import { Settings } from '../compositions/settings';
import { StorageParams } from '../storage/storage-params';
import { NotificationType, showNotification } from '../compositions/show-notification';
import { getMessagesFromLocale } from '../plugins/i18n';

export async function dailySummaryNotification() {
  const showDailyNotifacation = (await Settings.getInstance().getSetting(
    StorageParams.DAILY_NOTIFICATION,
  )) as boolean;

  if (showDailyNotifacation) {
    const data = await useWebUsageSummaryForDay();
    if (data == null) return;

    const title = `${
      getMessagesFromLocale()['todayUsageTime']['message']
    }${convertLimitTimeToString(data.time!)}`;
    const message = [
      `${data?.percentageFromYesterday}${
        getMessagesFromLocale()['comparedToYesterday']['message']
      }`,
      `${data.mostVisitedSite} ${
        getMessagesFromLocale()['mostVisited']['message']
      }${convertLimitTimeToString(data.mostVisitedSiteTime!)}`,
    ].join('\n');

    return await showNotification(NotificationType.DailySummaryNotification, title, message);
  }
}
