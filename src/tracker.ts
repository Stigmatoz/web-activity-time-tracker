import Browser from "webextension-polyfill";
import { isValidPage } from "./compositions/valid-page";
import { extractHostname } from "./compositions/extract-hostname";
import { injectTabsRepository } from "./repository/inject-tabs-repository";
import { isInBlackList } from "./compositions/black-list";
import { useBadge } from "./compositions/set-badge";
import { BadgeColor } from "./compositions/types";
import { INTERVAL_INACTIVITY_DEFAULT, INTERVAL_SAVE_STORAGE_DEFAULT, StorageParams, VIEW_TIME_IN_BADGE_DEFAULT,  } from "./storage/storage-params";
import { injecStorage } from "./storage/inject-storage";
import { closeInterval } from "./compositions/daily-intervals";
import { ActiveTab } from "./compositions/activeTab";
import { isLimitExceeded } from "./compositions/limit-list";
import { Tab } from "./entity/tab";
import { useBlockPage } from "./compositions/block-page";
import { convertSummaryTimeToBadgeString } from "./common/utility";

const activeTabInstance = ActiveTab.getInstance();
const storage = injecStorage();

export async function initTracker() {
    setInterval(trackTime, 1000);
    setInterval(saveTabs, INTERVAL_SAVE_STORAGE_DEFAULT);
}

async function trackTime(){
    const repo = await injectTabsRepository();
    const window = await Browser.windows.getLastFocused({ populate: true });
    if (window.focused) {
        const activeTab = window.tabs?.find((t) => t.active === true);
        if (isValidPage(activeTab)) {
            const activeUrl = extractHostname(activeTab!.url);
            activeTabInstance.setActiveTab(activeUrl);

            if (await isInBlackList(activeUrl)) {
                useBadge({
                    tabId: activeTab!.id!,
                    text: "n/a",
                    color: BadgeColor.red,
                });
            } else {
                const tab = repo.getTab(activeUrl);
                if (tab == undefined) {
                    await repo.addTab(activeTab!);
                } else {
                    const inactivityInterval = (await storage.getValue(
                        StorageParams.INTERVAL_INACTIVITY,
                        INTERVAL_INACTIVITY_DEFAULT
                    )) as number;
                    const state = await Browser.idle.queryState(inactivityInterval);
                    mainTracker(state, activeTab!, activeUrl, tab);
                }
            }
        }
    } else {
        await closeInterval(activeTabInstance.getActiveTab());
        activeTabInstance.setActiveTab(null);
    }
}

async function mainTracker(state: Browser.Idle.IdleState, activeTab: Browser.Tabs.Tab, activeUrl: string, tab: Tab){
    function isAudible(){
        return state === 'idle' && activeTab.audible;
    }

    if (state === 'active' || isAudible()){
        if (await isLimitExceeded(activeUrl, tab)){
            const summaryTime = tab.days.at(-1)!.summary;
            const summaryCounter = tab.days.at(-1)!.counter;
            await useBlockPage(activeUrl, summaryTime, summaryCounter);
            return;
        }

        tab.incSummaryTime();

        const storage = injecStorage();
        const viewInBadge = (await storage.getValue(
            StorageParams.VIEW_TIME_IN_BADGE,
            VIEW_TIME_IN_BADGE_DEFAULT
        )) as boolean;

        if (viewInBadge)
            useBadge({
                tabId: activeTab!.id!,
                text: convertSummaryTimeToBadgeString(tab.days.at(-1)!.summary),
                color: BadgeColor.green,
            });
        else 
            useBadge({
                tabId: activeTab!.id!,
                text: "",
                color: BadgeColor.red,
            });
    }
}

async function saveTabs(){
    const storage = injecStorage();
    const repo = await injectTabsRepository();
    const tabs = repo.getTabs();
    await storage.saveTabs(tabs);
}
