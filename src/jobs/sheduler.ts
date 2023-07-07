import Browser, { Alarms } from 'webextension-polyfill';
import { log } from '../compositions/logger';
import { StorageParams } from '../storage/storage-params';
import { DAY_MINUTES, SECOND, getNextTimeOfDay } from '../utils/time';
import { Settings } from '../compositions/settings';
import { dailySummaryNotification } from './daily-summary-notification';

export enum JobId {
  DailySummaryNotification = '@alarm/daily-summary-notification',
}

export function scheduleJobs(): void {
  Browser.alarms.onAlarm.addListener(async alarm => {
    log(`[schedule-jobs] Alarm ${alarm.name} triggered`, alarm);
    switch (alarm.name) {
      case JobId.DailySummaryNotification: {
        await dailySummaryNotification();
        break;
      }
    }
    log(`[schedule-jobs] ${alarm.name} finished`);
  });

  rescheduleJobs();
}

export async function rescheduleJobs(): Promise<void> {
  log('Reschedule jobs');
  const dailySummaryNotificationTime = (await Settings.getInstance().getSetting(
    StorageParams.DAILY_SUMMARY_NOTIFICATION_TIME,
  )) as number;
  await Browser.alarms.clear(JobId.DailySummaryNotification);
  Browser.alarms.create(JobId.DailySummaryNotification, {
    when: getNextTimeOfDay(dailySummaryNotificationTime * SECOND),
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
