import { TimeInterval } from '../entity/time-interval';
import { injectStorage } from '../storage/inject-storage';
import { StorageDeserializeParam } from '../storage/storage-params';
import { todayLocalDate } from '../utils/date';

export async function useDailyIntervals() {
  async function closeInterval(domain: string | null): Promise<void> {
    if (domain == null) return;
    const storage = injectStorage();
    const timeIntervalList = (await storage.getDeserializeList(
      StorageDeserializeParam.TIMEINTERVAL_LIST,
    )) as TimeInterval[];
    const item = timeIntervalList?.find(x => x.domain === domain && x.day == todayLocalDate());
    item?.closeInterval();
    await storage.saveIntervalList(timeIntervalList);
  }

  async function addInterval(domain: string | null): Promise<void> {
    if (domain == null) return;

    const storage = injectStorage();
    let timeIntervalList = (await storage.getDeserializeList(
      StorageDeserializeParam.TIMEINTERVAL_LIST,
    )) as TimeInterval[];
    if (timeIntervalList == undefined) timeIntervalList = [];
    const item = timeIntervalList?.find(x => x.domain === domain && x.day == todayLocalDate());
    if (item != undefined) {
      if (item.day == todayLocalDate()) item.addInterval();
      else {
        const newInterval = new TimeInterval();
        newInterval.init(todayLocalDate(), domain);
        newInterval.addInterval();
        timeIntervalList.push(newInterval);
      }
    } else {
      const newInterval = new TimeInterval();
      newInterval.init(todayLocalDate(), domain);
      newInterval.addInterval();
      timeIntervalList.push(newInterval);
    }
    await storage.saveIntervalList(timeIntervalList);
  }

  return {
    closeInterval,
    addInterval,
  };
}
