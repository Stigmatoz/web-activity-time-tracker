import { ITabsRepository } from "./tabs-repository-interface";
import { Tab } from "../entity/tab";
import Browser from 'webextension-polyfill';
import { injecStorage } from "../storage/inject-storage";
import { isValidPage } from '../compositions/valid-page';
import { isInBlackList } from "../compositions/black-list";
import { extractHostname } from "../compositions/extract-hostname";
import { addInterval, closeInterval } from "../compositions/daily-intervals";

export class TabsRepository implements ITabsRepository {
    private tabs: Tab[];
    private currentTabDomain: string | null;

    constructor() {
        this.tabs = [];
        this.currentTabDomain = null;
    }
    
    async initAsync(){
        this.tabs = await injecStorage().getTabs();
    }

    getTab(domain: string): Tab | undefined {
        const tab = this.tabs?.find(x => x.url === domain);
        return !tab ? tab : undefined;
    }

    async addTab(tab: Browser.Tabs.Tab): Promise<void> {
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
                        this.tabs.push(new Tab(domain, favicon));
                    }
                    else {
                        tabFromStorage.incCounter();
                        if (this.currentTabDomain != domain) this.setCurrentActiveTab(domain);
                        await closeInterval(this.currentTabDomain);
                        await addInterval(this.currentTabDomain);
                    }
                }
                else await closeInterval(this.currentTabDomain);
            }
        } else await closeInterval(this.currentTabDomain);
    }

    private setCurrentActiveTab(domain:string){
        this.currentTabDomain = domain;
    }
}