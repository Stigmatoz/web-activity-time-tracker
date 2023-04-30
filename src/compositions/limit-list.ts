import { Restriction } from "../entity/restriction";
import { Tab } from "../entity/tab";
import { injecStorage } from "../storage/inject-storage";
import { StorageParams } from "../storage/storage-params";
import { todayLocalDate } from "../utils/today";

export async function isLimitExceeded(url: string, tab: Tab): Promise<boolean>{
    const storage = injecStorage();
    const limitList = await storage.getValue(StorageParams.RESTRICTION_LIST) as Restriction[];
    const item = limitList?.find(x => x.domain == url);
    if (item != undefined){
        const date = tab.days.find(x => x.date == todayLocalDate());
        if (date != undefined){
            return date.summary >= item.time;
        }
    }

    return false;
}