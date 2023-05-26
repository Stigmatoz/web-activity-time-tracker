import { injecStorage } from '../storage/inject-storage';
import { StorageParams } from '../storage/storage-params';
import { isDomainEquals } from '../utils/common';
import { extractHostname } from './extract-hostname';

export async function isInBlackList(url: string): Promise<boolean> {
  const storage = injecStorage();
  const blackList = (await storage.getValue(StorageParams.BLACK_LIST)) as string[];
  return (
    blackList?.find(x => isDomainEquals(extractHostname(x), extractHostname(url))) !== undefined
  );
}
