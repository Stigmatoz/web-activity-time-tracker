import { ITabsRepository } from "./tabs-repository-interface";
import { Tab } from "../storage/tab";
import Browser from 'webextension-polyfill';
import { injecStorage } from "../storage/inject-storage";
import { isValidPage } from '../compositions/valid-page';
import { isInBlackList } from "../compositions/black-list";
import { extractHostname } from "../compositions/extract-hostname";

export class TabsRepository implements ITabsRepository {
    private tabs: Tab[];

    constructor() {
        this.tabs = [];
    }
    
    async initAsync(){
        this.tabs = await injecStorage().getTabs();
    }

    getTab(domain: string): Tab | undefined {
        const tab = this.tabs?.find(x => x.url === domain);
        return !tab ? tab : undefined;
    }

    async addTab(tab: Browser.Tabs.Tab): Promise<Tab> {
        if (isValidPage(tab)) {
            if (tab.id && (tab.id != 0)) {
                tabs = tabs || [];
                var domain = extractHostname(tab.url);
                var isDifferentUrl = false;
                if (currentTab !== tab.url) {
                    isDifferentUrl = true;
                }

                if (this.isNewUrl(domain) && !await isInBlackList(domain)) {
                    var favicon = tab.favIconUrl;
                    if (favicon === undefined) {
                        favicon = 'chrome://favicon/' + domain;
                    }
                    var newTab = new Tab(domain, favicon);
                    tabs.push(newTab);
                }

                if (isDifferentUrl && await !isInBlackList(domain)) {
                    this.setCurrentActiveTab(domain);
                    var tabUrl = this.getTab(domain);
                    if (tabUrl !== undefined)
                        tabUrl.incCounter();
                    this.addTimeInterval(domain);
                }
            }
        } else this.closeIntervalForCurrentTab();
    }
}