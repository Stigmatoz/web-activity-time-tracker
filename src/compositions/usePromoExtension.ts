import { computed } from 'vue';
import { Restriction } from '../entity/restriction';
import { injecStorage } from '../storage/inject-storage';
import { StorageParams } from '../storage/storage-params';

export const QUERY_PARAMS_DASHBOARD = 'dashboard.html';
export const QUERY_PARAMS_DASHBOARD_TAB = 'tab';
export const QUERY_PARAMS_DASHBOARD_TAB_SETTINGS = 'settings';
export const QUERY_PARAMS_BLOCK = 'block.html';
export const QUERY_PARAMS_BLOCK_DOMAIN = 'domain';

export async function usePromoExtension() {
  const settingsStorage = injecStorage();

  const hasReview = await settingsStorage.getValue(StorageParams.PROMO_CLEAR_YOUTUBE);

  if (hasReview != undefined && hasReview == true) return false;

  const whitelist = Object.values(
    await settingsStorage.getValue(StorageParams.RESTRICTION_LIST, []),
  ) as Restriction[];

  const isIncludeYoutube = computed(
    () => whitelist.find(x => x.domain == 'youtube.com') != undefined,
  );

  const urlObj = new URL(location.href);
  const isLimitPage = computed(
    () =>
      urlObj.hostname == __APP_ID__ &&
      urlObj.pathname.includes(QUERY_PARAMS_DASHBOARD) &&
      urlObj.searchParams.get(QUERY_PARAMS_DASHBOARD_TAB) == QUERY_PARAMS_DASHBOARD_TAB_SETTINGS,
  );

  const isBlockPage = computed(
    () =>
      urlObj.hostname == __APP_ID__ &&
      urlObj.pathname.includes(QUERY_PARAMS_BLOCK) &&
      urlObj.searchParams.get(QUERY_PARAMS_BLOCK_DOMAIN) == 'youtube.com',
  );

  const showOnLimitPage = computed(() => isLimitPage.value && isIncludeYoutube.value);
  const showOnBlockPage = computed(() => isBlockPage.value);

  return showOnLimitPage || showOnBlockPage;
}
