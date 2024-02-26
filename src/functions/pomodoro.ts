import { addSeconds } from 'date-fns';
import { injectStorage } from '../storage/inject-storage';
import { StorageParams } from '../storage/storage-params';
import { useBadge, BadgeIcon, BadgeColor } from './useBadge';
import { Settings } from './settings';
import Browser from 'webextension-polyfill';
import { logger } from '../utils/logger';
import { Messages } from '../utils/messages';
import { isDateEqual } from '../utils/date';
import { createOffscreen } from '../offscreen/index';

export async function checkPomodoro() {
  type PomodoroPeriod = {
    period: Period;
    isTargetPeriod: boolean;
    isTargetPeriodFinishedNow: boolean;
  };

  enum Period {
    work = 'WORK',
    rest = 'REST',
    finished = 'FINISH',
  }

  function isTargetPeriod(period: Period): PomodoroPeriod {
    let isPomodoroTargetPeriodEnd;
    for (let index = 1; index <= frequency; index++) {
      let ind = period == Period.work ? index - 1 : index;
      const plusWorkingTime = workTime * ind;
      const plusRestTime = (restTime + 1) * (index - 1);
      const isPomodoroTargetPeriodStart = addSeconds(startTime, plusWorkingTime + plusRestTime);
      isPomodoroTargetPeriodEnd = addSeconds(startTime, plusWorkingTime + plusRestTime + workTime);
      const isTargetPeriod =
        now >= isPomodoroTargetPeriodStart &&
        (addSeconds(now, -1) <= isPomodoroTargetPeriodEnd || now <= isPomodoroTargetPeriodEnd);

      if (isTargetPeriod) {
        return {
          period: period,
          isTargetPeriod: isTargetPeriod,
          isTargetPeriodFinishedNow:
            isDateEqual(addSeconds(now, -1), isPomodoroTargetPeriodEnd) ||
            isDateEqual(now, isPomodoroTargetPeriodEnd),
        };
      }
    }
    return {
      period: Period.finished,
      isTargetPeriod: false,
      isTargetPeriodFinishedNow: false,
    };
  }

  async function play(period: Period) {
    function getSound() {
      switch (period) {
        case Period.work:
          return StorageParams.POMODORO_AUDIO_AFTER_WORK;
        case Period.rest:
          return StorageParams.POMODORO_AUDIO_AFTER_REST;
        case Period.finished:
          return StorageParams.POMODORO_AUDIO_AFTER_FINISHED;
      }
    }
    logger.log(`[Pomodoro] ${period}`);
    const sound = await storage.getValue(getSound());
    await createOffscreen();
    await Browser.runtime.sendMessage({
      message: Messages.PlayAudio,
      sound: sound,
      offscreen: true,
    });
  }

  const storage = injectStorage();
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

  if (now >= pomodoroEndTime) {
    if (isDateEqual(now, pomodoroEndTime)) {
      logger.log(`[Pomodoro] Pomodoro finished`);
      await play(Period.finished);
    }

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

  let target = isTargetPeriod(Period.work);
  const isWork = target.isTargetPeriod;

  if (isWork) {
    await useBadge({
      tabId: activeTab[0].id,
      text: null,
      color: BadgeColor.none,
      icon: BadgeIcon.pomodoroWorkingTime,
    });
  } else {
    target = isTargetPeriod(Period.rest);
    if (target.isTargetPeriod) {
      await useBadge({
        tabId: activeTab[0].id,
        text: null,
        color: BadgeColor.none,
        icon: BadgeIcon.pomodoroRestTime,
      });
    }
  }

  if (target.isTargetPeriodFinishedNow) await play(target.period);

  return {
    isWork,
  };
}
