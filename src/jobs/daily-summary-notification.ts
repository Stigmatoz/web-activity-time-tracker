import { useWebUsageSummaryForDay } from '../functions/useWebUsageSummaryForDay';
import { convertLimitTimeToString } from '../utils/converter';
import { Settings } from '../functions/settings';
import { StorageParams } from '../storage/storage-params';
import { NotificationType, useNotification } from '../functions/useNotification';
import { getMessagesFromLocale } from '../plugins/i18n';

export async function dailySummaryNotification() {
  console.log('[dailySummaryNotification] Starting daily summary notification check');
  
  const showDailyNotification = (await Settings.getInstance().getSetting(
    StorageParams.DAILY_NOTIFICATION,
  )) as boolean;

  console.log('[dailySummaryNotification] Daily notification enabled:', showDailyNotification);

  if (showDailyNotification) {
    const data = await useWebUsageSummaryForDay();
    console.log('[dailySummaryNotification] Usage data:', data);
    
    if (data == null) {
      console.log('[dailySummaryNotification] No usage data available, skipping notification');
      return;
    }

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

    console.log('[dailySummaryNotification] Sending notification:', { title, message });
    const result = await useNotification(NotificationType.DailySummaryNotification, title, message);
    console.log('[dailySummaryNotification] Notification result:', result);
    return result;
  } else {
    console.log('[dailySummaryNotification] Daily notifications disabled, skipping');
  }
}
