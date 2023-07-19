import { useWebUsageSummaryForDay } from '../compositions/summary-data-today';
import { convertLimitTimeToString } from '../utils/converter';
import { Settings } from '../compositions/settings';
import { StorageParams } from '../storage/storage-params';
import { NotificationType, showNotification } from '../compositions/show-notification';
import i18n from '../plugins/i18n';

export async function dailySummaryNotification() {
  const showDailyNotifacation = (await Settings.getInstance().getSetting(
    StorageParams.DAILY_NOTIFICATION,
  )) as boolean;

  if (showDailyNotifacation) {
    const data = await useWebUsageSummaryForDay();
    if (data == null) return;

    const title = `${i18n.global.t('todayUsageTime.message')} ${convertLimitTimeToString(
      data.time!,
    )}`;
    const message = `${data?.percentageFromYesterday} ${i18n.global.t(
      'comparedToYesterday.message',
    )} \n${data.mostVisitedSite} ${i18n.global.t('mostVisited.message')} ${convertLimitTimeToString(
      data.mostVisitedSiteTime!,
    )}`;

    await showNotification(NotificationType.DailySummaryNotification, title, message);
  }
}
