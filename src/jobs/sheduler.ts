import Browser, { Alarms } from 'webextension-polyfill';
import { logger } from '../compositions/logger';
import { StorageParams } from '../storage/storage-params';
import { DAY_MINUTES, getNextTimeOfDay } from '../utils/time';
import { Settings } from '../compositions/settings';

export enum JobId {
  DailySummaryNotification = '@alarm/daily-summary-notification',
}

export function scheduleJobs(): void {
  Browser.alarms.onAlarm.addListener(async alarm => {
    logger.log(`[schedule-jobs] Alarm ${alarm.name} triggered`, alarm);
    switch (alarm.name) {
      case JobId.DailySummaryNotification: {
        //await dailySummaryNotification();
        break;
      }
    }
    logger.log(`[schedule-jobs] ${alarm.name} finished`);
  });

  Browser.runtime.onInstalled.addListener(rescheduleJobs);
}

async function rescheduleJobs(): Promise<void> {
  const dailySummaryNotificationTime = (await Settings.getInstance().getSetting(
    StorageParams.DAILY_SUMMARY_NOTIFICATION_TIME,
  )) as number;
  await Browser.alarms.clear(JobId.DailySummaryNotification);
  Browser.alarms.create(JobId.DailySummaryNotification, {
    when: getNextTimeOfDay(dailySummaryNotificationTime),
    periodInMinutes: DAY_MINUTES,
  });
}

async function createAlarmIfMissing(
  name: string,
  alarmInfo: Alarms.CreateAlarmInfoType,
): Promise<void> {
  const existing = await Browser.alarms.get(name).catch(() => undefined);
  if (existing == null) {
    Browser.alarms.create(name, alarmInfo);
  }
}
