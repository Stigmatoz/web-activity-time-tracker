import Browser from 'webextension-polyfill';
import { isValidPage } from './compositions/valid-page';
import { extractHostname } from './compositions/extract-hostname';

export async function initTracker(){
    const window = await Browser.windows.getLastFocused({ populate: true });
    if (window.focused){
        const activeTab = window.tabs?.find(t => t.active === true);
        if (isValidPage(activeTab)) {
            var activeUrl = extractHostname(activeTab?.url);
            var tab = activity.getTab(activeUrl);
            if (tab === undefined) {
                activity.addTab(activeTab);
            }

            if (activity.isInBlackList(activeUrl)) {
                chrome.action.setBadgeBackgroundColor({ color: '#fdb8b8' })
                chrome.action.setBadgeText({
                    tabId: activeTab.id,
                    text: 'n/a'
                });
            } else {
                if (tab !== undefined) {
                    if (currentTab !== tab.url) {
                        activity.setCurrentActiveTab(tab.url);
                    }
                    chrome.idle.queryState(parseInt(setting_interval_inactivity), function(state) {
                        if (state === 'active') {
                            mainTRacker(activeUrl, tab, activeTab);
                        } else checkDOM(state, activeUrl, tab, activeTab);
                    });
                }
            }
        } 
    } else activity.closeIntervalForCurrentTab(); 
}