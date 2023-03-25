import { injecStorage } from "../storage/inject-storage";
import { StorageParams } from "../storage/storage-params";

export async function isInBlackList(url: string): Promise<boolean>{
    const storage = injecStorage();
    const blackList = await storage.getValue(StorageParams.BLACK_LIST) as string[];
    return blackList.indexOf(url) != -1 ? true : false;
}