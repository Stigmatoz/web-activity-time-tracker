import { StorageParams } from '../storage/storage-params';
import { isDomainEquals } from '../utils/common';
import { Settings } from './settings';
import { Deffering } from '../entity/deffering';
import { injectStorage } from '../storage/inject-storage';
import { MINUTE } from '../utils/time';
import { log } from '../utils/logger';
import { millisecondsInHour } from 'date-fns';

export async function isInDeferList(url: string): Promise<boolean> {
  const deferList = (await Settings.getInstance().getSetting(
    StorageParams.BLOCK_DEFERRAL_TIME,
  )) as Deffering[];
  const item = deferList?.find(x => isDomainEquals(x.domain, url));
  if (item != undefined) log(`Deferring time ${url} ${new Date(item.time)}`);
  return item != undefined && item.time > Date.now();
}

export async function canDefering(url: string): Promise<boolean> {
  const deferList = (await Settings.getInstance().getSetting(
    StorageParams.BLOCK_DEFERRAL_TIME,
  )) as Deffering[];
  const item = deferList?.find(x => isDomainEquals(x.domain, url));
  if (item != undefined) log(`Deferring time ${url} ${new Date(item.time)}`);
  if (item == undefined) return true;

  return item != undefined && Date.now() - new Date(item.time).getTime() > millisecondsInHour * 24;
}

export async function defering(url: string, timeInMinutes: number): Promise<void> {
  const settingsStorage = injectStorage();

  const deferList = (await Settings.getInstance().getSetting(
    StorageParams.BLOCK_DEFERRAL_TIME,
  )) as Deffering[];
  const item = deferList?.find(x => isDomainEquals(x.domain, url));
  if (item != undefined) item.time = Date.now() + timeInMinutes * MINUTE;
  else deferList.push(new Deffering(url, 5));

  await settingsStorage.saveValue(StorageParams.BLOCK_DEFERRAL_TIME, deferList);
}
