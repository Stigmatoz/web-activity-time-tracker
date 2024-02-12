import Browser, { Alarms } from 'webextension-polyfill';
import { log } from '../utils/logger';
import { StorageParams } from '../storage/storage-params';
import { DAY_MINUTES, SECOND, getNextTimeOfDay } from '../utils/time';
import { Settings } from '../functions/settings';
import { dailySummaryNotification } from './daily-summary-notification';
import { removeOldTimeIntervals } from './remove-time-intervals';
import { startOfTomorrow } from 'date-fns';
import { Messages } from '../utils/messages';

export enum JobId {
  DailySummaryNotification = '@alarm/daily-summary-notification',
  RemoveOldTimeIntervals = '@alarm/remove-old-time-intervals',
}

export function scheduleJobs(): void {
  Browser.alarms.onAlarm.addListener(async alarm => {
    log(`[schedule-jobs] Alarm ${alarm.name} triggered`, alarm);
    switch (alarm.name) {
      case JobId.DailySummaryNotification: {
        await dailySummaryNotification();
        break;
      }
      case JobId.RemoveOldTimeIntervals: {
        await removeOldTimeIntervals();
        break;
      }
    }
    log(`[schedule-jobs] ${alarm.name} finished`);
  });

  Browser.runtime.onMessage.addListener(message => {
    if (message == Messages.RescheduleJobs) rescheduleJobs();
  });

  rescheduleJobs();
}

async function rescheduleJobs(): Promise<void> {
  log('Reschedule jobs');
  const dailySummaryNotificationTime = (await Settings.getInstance().getSetting(
    StorageParams.DAILY_SUMMARY_NOTIFICATION_TIME,
  )) as number;
  await Browser.alarms.clear(JobId.DailySummaryNotification);
  const nextTime = getNextTimeOfDay(dailySummaryNotificationTime * SECOND);
  log(`[schedule-jobs] ${JobId.DailySummaryNotification} start time ${new Date(nextTime)}`);
  Browser.alarms.create(JobId.DailySummaryNotification, {
    when: nextTime,
    periodInMinutes: DAY_MINUTES,
  });

  await createAlarmIfMissing(JobId.RemoveOldTimeIntervals, {
    when: startOfTomorrow().getTime(),
    periodInMinutes: DAY_MINUTES,
  });
}

async function createAlarmIfMissing(
  name: string,
  alarmInfo: Alarms.CreateAlarmInfoType,
): Promise<void> {
  const existing = await Browser.alarms.get(name).catch(() => undefined);
  if (existing == null) {
    log(
      `[schedule-jobs] ${name} start time ${
        alarmInfo.when != undefined ? new Date(alarmInfo.when) : null
      }`,
    );
    Browser.alarms.create(name, alarmInfo);
  }
}
