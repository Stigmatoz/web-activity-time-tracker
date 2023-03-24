import { ITabsRepository } from "./tabs-repository-interface";
import { Tab } from "../storage/tab";
import Browser from 'webextension-polyfill';
import { injecStorage } from "../storage/inject-storage";

export class TabsRepository implements ITabsRepository {
    static tabs: Tab[];

    constructor(){}
    
    static async Create(): Promise<TabsRepository> {
        const instance = new TabsRepository();
        this.tabs = await injecStorage().getTabs();
        return instance;
      }

    getTab(domain: string): Promise<Tab> {
        throw new Error("Method not implemented.");
    }

    addTab(value: Browser.Tabs.Tab): Promise<void> {
        throw new Error("Method not implemented.");
    }
}