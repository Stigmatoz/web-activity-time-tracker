import { StorageParams } from '../storage/storage-params';
import { isDomainEquals } from '../utils/common';
import { extractHostname } from './extract-hostname';
import { Settings } from './settings';

export async function isInBlackList(url: string): Promise<boolean> {
  const blackList = (await Settings.getInstance().getSetting(StorageParams.BLACK_LIST)) as string[];
  return (
    blackList?.find(x => isDomainEquals(extractHostname(x), extractHostname(url))) !== undefined
  );
}
