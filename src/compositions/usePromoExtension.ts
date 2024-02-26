import { computed } from 'vue';
import { Restriction } from '../entity/restriction';
import { injectStorage } from '../storage/inject-storage';
import { StorageParams } from '../storage/storage-params';
import { useExtensionPage } from './useExtensionPage';

export const QUERY_PARAMS_DASHBOARD = 'dashboard.html';
export const QUERY_PARAMS_DASHBOARD_TAB = 'tab';
export const QUERY_PARAMS_DASHBOARD_TAB_SETTINGS = 'settings';
export const QUERY_PARAMS_BLOCK = 'block.html';
export const QUERY_PARAMS_BLOCK_DOMAIN = 'domain';

export async function usePromoExtension() {
  const settingsStorage = injectStorage();
  const extensionPage = useExtensionPage();

  const hasReviewOnLimits = await settingsStorage.getValue(
    StorageParams.PROMO_CLEAR_YOUTUBE_ON_LIMITS,
  );
  const hasReviewOnBlock = await settingsStorage.getValue(
    StorageParams.PROMO_CLEAR_YOUTUBE_ON_BLOCK,
  );

  const whitelist = Object.values(
    await settingsStorage.getValue(StorageParams.RESTRICTION_LIST, []),
  ) as Restriction[];

  const isIncludeYoutube = computed(
    () => whitelist.find(x => x.domain == 'youtube.com') != undefined,
  );

  const showOnLimitPage = computed(
    () =>
      (hasReviewOnLimits == undefined || hasReviewOnLimits == false) &&
      extensionPage.isLimitPage.value &&
      isIncludeYoutube.value,
  );
  const showOnBlockPage = computed(
    () =>
      (hasReviewOnBlock == undefined || hasReviewOnBlock == false) &&
      extensionPage.isBlockPage.value,
  );

  return showOnLimitPage.value || showOnBlockPage.value;
}
