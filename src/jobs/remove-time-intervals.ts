import { StorageDeserializeParam } from '../storage/storage-params';
import { injecStorage } from '../storage/inject-storage';
import { TimeInterval } from '../entity/time-interval';
import { todayLocalDate } from '../utils/date';

export async function removeOldTimeIntervals() {
  const storage = injecStorage();
  let timeIntervalList = (await storage.getDeserializeList(
    StorageDeserializeParam.TIMEINTERVAL_LIST,
  )) as TimeInterval[];
  if (timeIntervalList == undefined) timeIntervalList = [];
  const arrayToRemove: number[] = [];
  timeIntervalList.forEach(interval => {
    if (new Date(interval.day) < new Date(todayLocalDate()))
      arrayToRemove.push(timeIntervalList.indexOf(interval));
  });

  arrayToRemove.forEach(index => {
    if (index > -1) timeIntervalList.splice(index, 1);
  });

  await storage.saveIntervalList(timeIntervalList);
}
