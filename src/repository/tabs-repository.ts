import { ITabsRepository } from "./tabs-repository-interface";
import { Tab } from "../entity/tab";
import Browser from 'webextension-polyfill';
import { injecStorage } from "../storage/inject-storage";
import { isValidPage } from '../compositions/valid-page';
import { isInBlackList } from "../compositions/black-list";
import { extractHostname } from "../compositions/extract-hostname";
import { addInterval, closeInterval } from "../compositions/daily-intervals";
import { ActiveTab } from "../compositions/activeTab"

export class TabsRepository implements ITabsRepository {
    private tabs: Tab[];
    private activeTab = ActiveTab.getInstance();

    constructor() {
        this.tabs = [];
    }
    
    async initAsync(){
        this.tabs = await injecStorage().getTabs();
    }

    getTabs(): Tab[] {
        return this.tabs;
    }

    getTab(domain: string): Tab | undefined {
        return this.tabs?.find(x => x.url === domain);
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
                        if (this.activeTab.getActiveTab() != domain) this.setCurrentActiveTab(domain);
                        await closeInterval(this.activeTab.getActiveTab());
                        await addInterval(this.activeTab.getActiveTab());
                    }
                }
                else await closeInterval(this.activeTab.getActiveTab());
            }
        } else await closeInterval(this.activeTab.getActiveTab());
    }

    private setCurrentActiveTab(domain:string){
        this.activeTab.setActiveTab(domain);
    }
}