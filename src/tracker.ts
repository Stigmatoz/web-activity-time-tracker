import Browser from 'webextension-polyfill';
import { isValidPage } from './compositions/valid-page';
import { extractHostname } from './compositions/extract-hostname';
import { injectTabsRepositorySingleton } from './repository/inject-tabs-repository';
import { isInBlackList } from './compositions/black-list';
import { useBadge } from './compositions/set-badge';
import {
  INTERVAL_INACTIVITY_DEFAULT,
  INTERVAL_SAVE_STORAGE_DEFAULT,
  StorageParams,
  VIEW_TIME_IN_BADGE_DEFAULT,
} from './storage/storage-params';
import { BadgeColor } from './compositions/set-badge';
import { injecStorage } from './storage/inject-storage';
import { addInterval, closeInterval } from './compositions/daily-intervals';
import { ActiveTab } from './compositions/active-tab';
import { isLimitExceeded } from './compositions/limit-list';
import { Tab } from './entity/tab';
import { useBlockPage } from './compositions/block-page';
import { convertSummaryTimeToBadgeString } from './utils/converter';

const activeTabInstance = ActiveTab.getInstance();
const storage = injecStorage();

interface CurrentObj {
  tab: Tab;
  activeDomain: string;
}

let currentObj: CurrentObj | null;

export async function initTracker() {
  setInterval(trackTime, 1000);
  setInterval(saveTabs, INTERVAL_SAVE_STORAGE_DEFAULT);
}

async function trackTime() {
  const repo = await injectTabsRepositorySingleton();
  const window = await Browser.windows.getLastFocused({ populate: true });
  if (window.focused) {
    const activeTab = window.tabs?.find(t => t.active === true);
    if (isValidPage(activeTab)) {
      const activeDomain = extractHostname(activeTab!.url);

      if (
        currentObj != null &&
        currentObj.activeDomain == activeDomain &&
        !isActiveTabWasChanged(activeDomain)
      ) {
        await mainTrackerWrapper(activeTab!, activeDomain, currentObj.tab);
        return;
      }

      if (await isInBlackList(activeDomain)) {
        useBadge({
          tabId: activeTab!.id!,
          text: 'n/a',
          color: BadgeColor.red,
        });
      } else {
        let tab = repo.getTab(activeDomain);
        if (tab == undefined) {
          tab = await repo.addTab(activeDomain, activeTab?.favIconUrl);
        }
        if (tab != undefined) {
          await mainTrackerWrapper(activeTab!, activeDomain, tab);
        }
      }
    }
  } else {
    await closeInterval(activeTabInstance.getActiveTabDomain());
    activeTabInstance.setActiveTab(null);
    currentObj = null;
  }
}

async function mainTracker(
  state: Browser.Idle.IdleState,
  activeTab: Browser.Tabs.Tab,
  activeDomain: string,
  tab: Tab,
) {
  function isAudible() {
    return state === 'idle' && activeTab.audible;
  }

  currentObj = {
    tab: tab,
    activeDomain: activeDomain,
  };

  const isAudibleValue = isAudible();
  if (state === 'active' || isAudibleValue) {
    if (await isLimitExceeded(activeDomain, tab)) {
      const summaryTime = tab.days.at(-1)!.summary;
      const summaryCounter = tab.days.at(-1)!.counter;
      await useBlockPage(activeDomain, summaryTime, summaryCounter);
      return;
    }

    if (isActiveTabWasChanged(activeDomain)) {
      tab.incCounter();
      await closeInterval(activeTabInstance.getActiveTabDomain());
      activeTabInstance.setActiveTab(activeTab.url!);
      await addInterval(activeTabInstance.getActiveTabDomain());
    }
    if (tab.favicon == '' && activeTab.favIconUrl != undefined)
      tab.setFavicon(activeTab.favIconUrl);

    tab.incSummaryTime();

    const viewInBadge = (await storage.getValue(
      StorageParams.VIEW_TIME_IN_BADGE,
      VIEW_TIME_IN_BADGE_DEFAULT,
    )) as boolean;

    if (viewInBadge)
      useBadge({
        tabId: activeTab!.id!,
        text: convertSummaryTimeToBadgeString(tab.days.at(-1)!.summary),
        color: BadgeColor.blue,
      });
    else
      useBadge({
        tabId: activeTab!.id!,
        text: '',
        color: BadgeColor.red,
      });
  }
}

async function mainTrackerWrapper(activeTab: Browser.Tabs.Tab, activeDomain: string, tab: Tab) {
  const inactivityInterval = (await storage.getValue(
    StorageParams.INTERVAL_INACTIVITY,
    INTERVAL_INACTIVITY_DEFAULT,
  )) as number;
  const state = await Browser.idle.queryState(inactivityInterval);
  await mainTracker(state, activeTab!, activeDomain, tab);
}

function isActiveTabWasChanged(activeDomain: string) {
  return activeDomain != activeTabInstance.getActiveTabDomain();
}

async function saveTabs() {
  const storage = injecStorage();
  const repo = await injectTabsRepositorySingleton();
  const tabs = repo.getTabs();
  await storage.saveTabs(tabs);
}
