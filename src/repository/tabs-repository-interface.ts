import { Tab } from '../entity/tab';

export interface ITabsRepository {
  initAsync(): void;
  getTabs(): Tab[];
  removeAllTabs(): void;
  getTodayTabs(): Tab[];
  getTab(domain: string): Tab | undefined;
  addTab(domain: string, favicon: string | undefined): Promise<Tab | undefined>;
}
