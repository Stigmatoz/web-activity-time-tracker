import { Tab } from "../storage/tab";
import Browser from 'webextension-polyfill';

export interface ITabsRepository {
    getTab(domain:string): Tab | undefined;
    addTab(tab:Browser.Tabs.Tab): void;
}