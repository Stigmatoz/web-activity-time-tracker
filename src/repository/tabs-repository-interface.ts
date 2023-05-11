import { Tab } from "../entity/tab";

export interface ITabsRepository {
    getTabs(): Tab[];
    getTodayTabs(): Tab[];
    getTab(domain:string): Tab | undefined;
    addTab(domain: string, favicon: string | undefined): Promise<Tab | undefined>;
}