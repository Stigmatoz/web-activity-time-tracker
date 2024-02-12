import { useWebUsageSummaryForDay } from '../functions/useWebUsageSummaryForDay';
import { convertLimitTimeToString } from '../utils/converter';
import { Settings } from '../functions/settings';
import { StorageParams } from '../storage/storage-params';
import { NotificationType, useNotification } from '../functions/useNotification';
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
    const messageWithMostVisitedWebsite =
      data.mostVisitedSite == undefined
        ? ''
        : `${data.mostVisitedSite} ${
            getMessagesFromLocale()['mostVisited']['message']
          }${convertLimitTimeToString(data.mostVisitedSiteTime!)}`;

    const message = [
      `${data.percentageFromYesterday}${getMessagesFromLocale()['comparedToYesterday']['message']}`,
      messageWithMostVisitedWebsite,
    ].join('\n');

    return await useNotification(NotificationType.DailySummaryNotification, title, message);
  }
}
