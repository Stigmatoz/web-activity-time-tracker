import Browser from 'webextension-polyfill';
import { isValidPage } from './utils/valid-page';
import { extractHostname } from './utils/extract-hostname';
import { injectTabsRepositorySingleton } from './repository/inject-tabs-repository';
import { isInBlackList } from './compositions/black-list';
import { useBadge, BadgeColor } from './compositions/useBadge';
import { INTERVAL_SAVE_STORAGE_DEFAULT, StorageParams } from './storage/storage-params';
import { injecStorage } from './storage/inject-storage';
import { useDailyIntervals } from './compositions/useDailyIntervals';
import { ActiveTab } from './utils/active-tab';
import { isLimitExceeded } from './compositions/limit-list';
import { Tab } from './entity/tab';
import { useBlockPage } from './compositions/useBlockPage';
import { convertSummaryTimeToBadgeString } from './utils/converter';
import { Settings } from './compositions/settings';
import { useNotificationList } from './compositions/useNotificationList';
import { NotificationType, useNotification } from './compositions/useNotification';
import { Messages } from './utils/messages';

const activeTabInstance = ActiveTab.getInstance();

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

      if (await isInBlackList(activeDomain)) {
        await useBadge({
          tabId: activeTab?.id,
          text: 'n/a',
          color: BadgeColor.green,
        });
      } else {
        if (
          currentObj != null &&
          currentObj.activeDomain == activeDomain &&
          !isActiveTabWasChanged(activeDomain)
        ) {
          await mainTrackerWrapper(activeTab!, activeDomain, currentObj.tab);
          return;
        }

        let tab = repo.getTab(activeDomain);
        if (tab == undefined) {
          tab = await repo.addTab(activeDomain, activeTab?.favIconUrl);
        }
        if (tab != undefined) {
          await mainTrackerWrapper(activeTab!, activeDomain, tab);
        }
      }
    } else await closeOpenInterval();
  } else {
    await closeOpenInterval();
  }
}

async function closeOpenInterval() {
  (await useDailyIntervals()).closeInterval(activeTabInstance.getActiveTabDomain());
  activeTabInstance.setActiveTab(null);
  currentObj = null;
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
    const limitExceeded = await isLimitExceeded(activeDomain, tab);
    if (limitExceeded.IsLimitExceeded) {
      const summaryCounter = tab.days.at(-1)!.counter;
      await useBlockPage(
        activeDomain,
        activeTab.url!,
        limitExceeded.LimitTime!,
        summaryCounter,
        activeTab.favIconUrl,
      );
      return;
    }

    if (isActiveTabWasChanged(activeDomain)) {
      tab.incCounter();
      (await useDailyIntervals()).closeInterval(activeTabInstance.getActiveTabDomain());
      activeTabInstance.setActiveTab(activeTab.url!);
      (await useDailyIntervals()).addInterval(activeTabInstance.getActiveTabDomain());
    }
    if (tab.favicon == '' && activeTab.favIconUrl != undefined)
      tab.setFavicon(activeTab.favIconUrl);

    if (await useNotificationList().isNeedToShowNotification(activeDomain, tab)) {
      const message = (await Settings.getInstance().getSetting(
        StorageParams.NOTIFICATION_MESSAGE,
      )) as string;
      const title = `${activeDomain} notification`;
      await useNotification(NotificationType.WebSiteNotification, title, message);
    }

    tab.incSummaryTime();

    const viewInBadge = await Settings.getInstance().getSetting(StorageParams.VIEW_TIME_IN_BADGE);

    if (viewInBadge)
      await useBadge({
        tabId: activeTab?.id,
        text: convertSummaryTimeToBadgeString(tab.days.at(-1)!.summary),
        color: BadgeColor.blue,
      });
    else
      await useBadge({
        tabId: activeTab?.id,
        text: '',
        color: BadgeColor.red,
      });
  } else await closeOpenInterval();
}

async function mainTrackerWrapper(activeTab: Browser.Tabs.Tab, activeDomain: string, tab: Tab) {
  const inactivityInterval = (await Settings.getInstance().getSetting(
    StorageParams.INTERVAL_INACTIVITY,
  )) as number;
  const number = Number(inactivityInterval);
  const state = await Browser.idle.queryState(number);
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

Browser.runtime.onMessage.addListener(async message => {
  if (message == Messages.ClearAllData) {
    const storage = injecStorage();
    const repo = await injectTabsRepositorySingleton();
    repo.removeAllTabs();
    await storage.saveTabs([]);
  }
  if (message.message == Messages.Restore) {
    const storage = injecStorage();
    await storage.saveTabs(message.data);
    const repo = await injectTabsRepositorySingleton();
    repo.initAsync();
  }
});
