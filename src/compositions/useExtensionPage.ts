import { computed, ref } from 'vue';
import { SettingsTab } from '../utils/enums';
import { getStringTab } from '../utils/extension-tabs';

export const QUERY_PARAMS_DASHBOARD = 'dashboard.html';
export const QUERY_PARAMS_TAB = 'tab';
export const QUERY_PARAMS_TAB_LIMITS = 'limits';
export const QUERY_PARAMS_BLOCK = 'block.html';
export const QUERY_PARAMS_BLOCK_DOMAIN = 'domain';

export function useExtensionPage() {
  const urlObj = ref(new URL(location.href));

  const isLimitPage = computed(
    () =>
      urlObj.value.hostname == __APP_ID__ &&
      urlObj.value.pathname.includes(QUERY_PARAMS_DASHBOARD) &&
      urlObj.value.searchParams.get(QUERY_PARAMS_TAB) == QUERY_PARAMS_TAB_LIMITS,
  );

  const isBlockPage = computed(
    () =>
      urlObj.value.hostname == __APP_ID__ &&
      urlObj.value.pathname.includes(QUERY_PARAMS_BLOCK) &&
      urlObj.value.searchParams.get(QUERY_PARAMS_BLOCK_DOMAIN)?.includes('youtube.com'),
  );

  function updateTab(tab: SettingsTab) {
    let targetTab = getStringTab(tab);
    const currentTab = urlObj.value.searchParams.get(QUERY_PARAMS_TAB);
    if (window.history.replaceState && currentTab) {
      const sourceUrl = `tab=${currentTab}`;
      const targetUrl = `tab=${targetTab}`;
      window.history.replaceState(
        location.href,
        document.title,
        location.href.replace(sourceUrl, targetUrl),
      );
      urlObj.value = new URL(location.href);
    }
  }

  return {
    isLimitPage,
    isBlockPage,
    updateTab,
  };
}
