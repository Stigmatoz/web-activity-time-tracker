import { computed } from 'vue';

export const QUERY_PARAMS_DASHBOARD = 'dashboard.html';
export const QUERY_PARAMS_DASHBOARD_TAB = 'tab';
export const QUERY_PARAMS_DASHBOARD_TAB_SETTINGS = 'settings';
export const QUERY_PARAMS_BLOCK = 'block.html';
export const QUERY_PARAMS_BLOCK_DOMAIN = 'domain';

export function useExtensionPage() {
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

  return {
    isLimitPage,
    isBlockPage,
  };
}
