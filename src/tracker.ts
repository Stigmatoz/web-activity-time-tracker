import Browser from 'webextension-polyfill';
import { isValidPage } from './compositions/valid-page';
import { extractHostname } from './compositions/extract-hostname';
import { injectTabsRepository } from './repository/inject-tabs-repository';
import { isInBlackList } from './compositions/black-list';
import { useBadge } from './compositions/set-badge';
import { BadgeColor } from './compositions/types';

export async function initTracker(){
    const window = await Browser.windows.getLastFocused({ populate: true });
    if (window.focused){
        const activeTab = window.tabs?.find(t => t.active === true);
        if (isValidPage(activeTab)) {
            const activeUrl = extractHostname(activeTab!.url);

            if (await isInBlackList(activeUrl)) {
                useBadge({ tabId: activeTab!.id!, text: 'n/a', color: BadgeColor.green });
            } else{
                const repo = await injectTabsRepository();
                let tab = repo.getTab(activeUrl);
                if (tab === undefined)
                    tab = await repo.addTab(activeTab!);

                    if (currentTab !== tab.url) {
                        activity.setCurrentActiveTab(tab.url);
                    }
                    const state = await Browser.idle.queryState(parseInt(setting_interval_inactivity));
                        if (state === 'active') {
                            mainTRacker(activeUrl, tab, activeTab);
                        } else checkDOM(state, activeUrl, tab, activeTab);
            }
        }
    } else activity.closeIntervalForCurrentTab(); 
}