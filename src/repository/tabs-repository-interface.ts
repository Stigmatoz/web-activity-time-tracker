import { Tab } from "../storage/tab";
import Browser from 'webextension-polyfill';

export interface ITabsRepository {
    getTab(domain:string): Promise<Tab>;
    addTab(value:Browser.Tabs.Tab): Promise<void>;
}