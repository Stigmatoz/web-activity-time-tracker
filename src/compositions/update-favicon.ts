import Browser from 'webextension-polyfill';
import { isValidPage } from './valid-page';
import { extractHostname } from './extract-hostname';
import { injectTabsRepository } from '../repository/inject-tabs-repository';

export async function useFavicon(tabId: number): Promise<void>{
    const repo = await injectTabsRepository();
    const tab = await Browser.tabs.get(tabId);
    if (isValidPage(tab)) {
        const activeDomain = extractHostname(tab?.url);
        let tabFromStoage = repo.getTab(activeDomain);
        if (tabFromStoage != undefined && tabFromStoage.favicon != null){
            tabFromStoage.setFavicon(tab?.favIconUrl);
        }
    }
}