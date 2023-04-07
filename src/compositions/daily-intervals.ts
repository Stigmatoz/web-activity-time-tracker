import { TimeInterval } from "../entity/time-interval";
import { injecStorage } from "../storage/inject-storage";
import { StorageParams } from "../storage/storage-params";
import { todayLocalDate } from "../utils/common";

export async function closeInterval(domain:string | null): Promise<void>{
    if (domain == null) return;
    const storage = injecStorage();
    const timeIntervalList = await storage.getValue(StorageParams.TIMEINTERVAL_LIST) as TimeInterval[];
    const item = timeIntervalList.find(x => x.domain === domain && x.day == todayLocalDate());
    item?.closeInterval();
    await storage.saveValue(StorageParams.TIMEINTERVAL_LIST, timeIntervalList);
}

export async function addInterval(domain:string | null): Promise<void>{
    if (domain == null) return;

    const storage = injecStorage();
    const timeIntervalList = await storage.getValue(StorageParams.TIMEINTERVAL_LIST) as TimeInterval[];
    const item = timeIntervalList.find(x => x.domain === domain && x.day == todayLocalDate());
    if (item != undefined) {
        if (item.day == todayLocalDate())
            item.addInterval();
        else {
            const newInterval = new TimeInterval(todayLocalDate(), domain);
            newInterval.addInterval();
            timeIntervalList.push(newInterval);
        }
    } else {
        const newInterval = new TimeInterval(todayLocalDate(), domain);
        newInterval.addInterval();
        timeIntervalList.push(newInterval);
    }
    await storage.saveValue(StorageParams.TIMEINTERVAL_LIST, timeIntervalList);
}