import { addSeconds } from 'date-fns';
import { injecStorage } from '../storage/inject-storage';
import { StorageParams } from '../storage/storage-params';
import { Time, timeToSeconds } from '../utils/time';
import { useBadge, BadgeIcon, BadgeColor } from './useBadge';

export async function checkPomodoro() {
  function isTargetPeriod(isRest: boolean) {
    for (let index = 1; index <= frequency; index++) {
      const plusWorkingTime = timeToSeconds(workTime) * (isRest ? index : index--);
      const plusRestTime = timeToSeconds(restTime) * index--;
      const isPomodoroTargetPeriodStart = addSeconds(startTime, plusWorkingTime + plusRestTime);
      const isPomodoroTargetPeriodEnd = addSeconds(
        startTime,
        plusWorkingTime + plusRestTime + timeToSeconds(workTime),
      );
      const isTargetPeriod =
        now.getTime() >= isPomodoroTargetPeriodStart.getTime() &&
        now.getTime() <= isPomodoroTargetPeriodEnd.getTime();

      if (isTargetPeriod) return true;
    }
    return false;
  }

  const storage = injecStorage();
  const isPomodoroEnabled = (await storage.getValue(StorageParams.IS_POMODORO_ENABLED)) as boolean;

  if (!isPomodoroEnabled) return;

  const startTime = (await storage.getValue(StorageParams.POMODORO_START_TIME)) as Date;
  const workTime = (await storage.getValue(StorageParams.POMODORO_INTERVAL_WORK)) as Time;
  const restTime = (await storage.getValue(StorageParams.POMODORO_INTERVAL_REST)) as Time;
  const frequency = (await storage.getValue(StorageParams.POMODORO_FREQUENCY)) as number;

  const now = new Date();

  const pomodoroEndTime = addSeconds(
    startTime,
    timeToSeconds(workTime) * frequency + timeToSeconds(restTime) * frequency,
  );

  if (pomodoroEndTime > now) {
    await storage.saveValue(StorageParams.IS_POMODORO_ENABLED, false);
    await storage.saveValue(StorageParams.POMODORO_START_TIME, null);
    return;
  }

  const isWork = isTargetPeriod(false);
  const isRest = isTargetPeriod(true);

  if (isWork)
    await useBadge({
      text: '',
      color: BadgeColor.none,
      icon: BadgeIcon.pomodoroWorkingTime,
    });
  if (isRest)
    await useBadge({
      text: '',
      color: BadgeColor.none,
      icon: BadgeIcon.pomodoroRestTime,
    });
}
