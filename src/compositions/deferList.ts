import { differenceInHours } from 'date-fns';
import { StorageParams } from '../storage/storage-params';
import { isDomainEquals } from '../utils/common';
import { Settings } from './settings';
import { Deffering } from '../entity/deffering';
import { injecStorage } from '../storage/inject-storage';
import { MINUTE } from '../utils/time';
import { log } from './logger';

export async function isInDeferList(url: string): Promise<boolean> {
  const deferList = (await Settings.getInstance().getSetting(
    StorageParams.BLOCK_DEFERRAL_TIME,
  )) as Deffering[];
  const array = Object.values(deferList);
  const item = array?.find(x => isDomainEquals(x.domain, url));
  if (item != undefined)
    log(
      `Deferring time ${url} ${new Date(item.time)} diff ${differenceInHours(
        new Date(item.time),
        new Date(),
      )}`,
    );
  return item != undefined && item.time > Date.now();
}

export async function canDefering(url: string): Promise<boolean> {
  const deferList = (await Settings.getInstance().getSetting(
    StorageParams.BLOCK_DEFERRAL_TIME,
  )) as Deffering[];
  const array = Object.values(deferList);
  const item = array?.find(x => isDomainEquals(x.domain, url));
  if (item != undefined)
    log(
      `Deferring time ${url} ${new Date(item.time)} diff ${differenceInHours(
        new Date(item.time),
        new Date(),
      )}`,
    );
  if (item == undefined) return true;

  return item != undefined && differenceInHours(new Date(item.time), new Date()) > 24;
}

export async function defering(url: string, timeInMinutes: number): Promise<void> {
  const settingsStorage = injecStorage();

  const deferList = (await Settings.getInstance().getSetting(
    StorageParams.BLOCK_DEFERRAL_TIME,
  )) as Deffering[];
  const array = Object.values(deferList);
  const item = array?.find(x => isDomainEquals(x.domain, url));
  if (item != undefined) item.time = Date.now() + timeInMinutes * MINUTE;
  else array.push(new Deffering(url, 5));

  await settingsStorage.saveValue(StorageParams.BLOCK_DEFERRAL_TIME, array);
}
