import { Restriction } from '../entity/restriction';
import { Tab } from '../entity/tab';
import { StorageParams } from '../storage/storage-params';
import { isDomainEquals } from '../utils/common';
import { todayLocalDate } from '../utils/date';
import { isInDeferList } from './deferList';
import { log } from './logger';
import { Settings } from './settings';

export type LimitExceed = {
  IsLimitExceeded: boolean;
  LimitTime: number | null;
};

export async function isLimitExceeded(url: string, tab: Tab): Promise<LimitExceed> {
  const limitList = (await Settings.getInstance().getSetting(
    StorageParams.RESTRICTION_LIST,
  )) as Restriction[];
  const array = Object.values(limitList);
  const item = array?.find(x => isDomainEquals(x.domain, url));
  if (item != undefined) {
    const date = tab.days.find(x => x.date == todayLocalDate());
    if (date != undefined) {
      if (date.summary >= item.time) {
        log(`Limit Exceeded: website ${url} limit ${item.time} summary time ${date.summary}`);
        if (await isInDeferList(url)) {
          log(`Page ${url} is in deffering list`);
          return {
            IsLimitExceeded: false,
            LimitTime: null,
          };
        }

        return {
          IsLimitExceeded: true,
          LimitTime: item.time,
        };
      }
    }
  }

  return {
    IsLimitExceeded: false,
    LimitTime: null,
  };
}

export async function isDomainInLimits(url: string): Promise<boolean> {
  const limitList = (await Settings.getInstance().getSetting(
    StorageParams.RESTRICTION_LIST,
  )) as Restriction[];
  const array = Object.values(limitList);
  const item = array?.find(x => isDomainEquals(x.domain, url));
  return item != undefined;
}
