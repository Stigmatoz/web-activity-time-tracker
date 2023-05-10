import { Tab } from "../entity/tab";
import Browser from 'webextension-polyfill';

export interface ITabsRepository {
    getTabs(): Tab[];
    getTab(domain:string): Tab | undefined;
    addTab(domain: string, favicon: string | undefined): Promise<Tab | undefined>;
}