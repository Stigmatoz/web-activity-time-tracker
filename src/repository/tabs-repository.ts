import { ITabsRepository } from "./tabs-repository-interface";
import { Tab } from "../entity/tab";
import Browser from 'webextension-polyfill';
import { injecStorage } from "../storage/inject-storage";
import { isValidPage } from '../compositions/valid-page';
import { isInBlackList } from "../compositions/black-list";
import { extractHostname } from "../compositions/extract-hostname";
import { StorageDeserializeParam } from "../storage/storage-params";

export class TabsRepository implements ITabsRepository {
    private tabs: Tab[];

    constructor() {
        this.tabs = [];
    }
    
    async initAsync(){
        this.tabs = await injecStorage().getDeserializeList(StorageDeserializeParam.TABS) as Tab[];
    }

    getTabs(): Tab[] {
        return this.tabs;
    }

    getTab(domain: string): Tab | undefined {
        return this.tabs?.find(x => x.url === domain);
    }

    async addTab(tab: Browser.Tabs.Tab): Promise<Tab | undefined> {
        if (isValidPage(tab)) {
            if (tab.id && (tab.id != 0)) {
                const domain = extractHostname(tab.url);
                const tabFromStorage = this.getTab(domain);
                const isInBlackListFlag = await isInBlackList(domain);

                if (!isInBlackListFlag){
                    if (!tabFromStorage) {
                        let favicon = tab.favIconUrl;
                        if (!favicon) {
                            favicon = 'chrome://favicon/' + domain;
                        }
                        const newTab = new Tab();
                        newTab.init(domain, favicon);
                        this.tabs.push(newTab);
                        return newTab;
                    }
                }
            }
        }

        return undefined;
    }
}