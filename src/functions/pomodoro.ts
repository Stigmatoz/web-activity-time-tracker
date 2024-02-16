import { addSeconds } from 'date-fns';
import { injecStorage } from '../storage/inject-storage';
import { StorageParams } from '../storage/storage-params';
import { useBadge, BadgeIcon, BadgeColor } from './useBadge';
import { Settings } from './settings';
import Browser from 'webextension-polyfill';
import { logger } from '../utils/logger';

export async function checkPomodoro() {
  function isTargetPeriod() {
    for (let index = 1; index <= frequency; index++) {
      const plusWorkingTime = workTime * (index - 1);
      const plusRestTime = restTime * (index - 1);
      const isPomodoroTargetPeriodStart = addSeconds(startTime, plusWorkingTime + plusRestTime);
      const isPomodoroTargetPeriodEnd = addSeconds(
        startTime,
        plusWorkingTime + plusRestTime + workTime,
      );
      const isTargetPeriod =
        now.getTime() >= isPomodoroTargetPeriodStart.getTime() &&
        now.getTime() <= isPomodoroTargetPeriodEnd.getTime();

      if (isTargetPeriod) return true;
    }
    return false;
  }

  const storage = injecStorage();
  const isPomodoroEnabled = (await Settings.getInstance().getSetting(
    StorageParams.IS_POMODORO_ENABLED,
  )) as boolean;

  if (!isPomodoroEnabled) return;

  const startTime = new Date(
    (await Settings.getInstance().getSetting(StorageParams.POMODORO_START_TIME)) as string,
  );
  const workTime = (await Settings.getInstance().getSetting(
    StorageParams.POMODORO_INTERVAL_WORK,
  )) as number;
  const restTime = (await Settings.getInstance().getSetting(
    StorageParams.POMODORO_INTERVAL_REST,
  )) as number;
  const frequency = (await Settings.getInstance().getSetting(
    StorageParams.POMODORO_FREQUENCY,
  )) as number;

  const now = new Date();

  const pomodoroEndTime = addSeconds(startTime, workTime * frequency + restTime * frequency);

  const activeTab = await Browser.tabs.query({ active: true });

  if (now > pomodoroEndTime) {
    await storage.saveValue(StorageParams.IS_POMODORO_ENABLED, false);
    await storage.saveValue(StorageParams.POMODORO_START_TIME, null);
    await useBadge({
      tabId: activeTab[0].id,
      text: null,
      color: BadgeColor.none,
      icon: BadgeIcon.default,
    });
    return;
  }

  const isWork = isTargetPeriod();

  if (isWork) {
    logger.log('[Pomodoro] Work Time');
    await useBadge({
      tabId: activeTab[0].id,
      text: null,
      color: BadgeColor.none,
      icon: BadgeIcon.pomodoroWorkingTime,
    });
  } else {
    logger.log('[Pomodoro] Rest Time');
    await useBadge({
      tabId: activeTab[0].id,
      text: null,
      color: BadgeColor.none,
      icon: BadgeIcon.pomodoroRestTime,
    });
  }

  return {
    isWork,
  };
}
