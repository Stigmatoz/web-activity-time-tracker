import { ITabsRepository } from './tabs-repository-interface';
import { Tab } from '../entity/tab';
import { injecStorage } from '../storage/inject-storage';
import { isInBlackList } from '../compositions/black-list';
import { StorageDeserializeParam } from '../storage/storage-params';
import { todayLocalDate } from '../utils/date';

export class TabsRepository implements ITabsRepository {
  private tabs: Tab[];

  constructor() {
    this.tabs = [];
  }

  async initAsync() {
    this.tabs = (await injecStorage().getDeserializeList(StorageDeserializeParam.TABS)) as Tab[];
  }

  getTabs(): Tab[] {
    return this.tabs;
  }

  removeAllTabs(): void {
    this.tabs = [];
  }

  getTodayTabs(): Tab[] {
    return this.tabs.filter(x => x.days.find(s => s.date === todayLocalDate()));
  }

  getTab(domain: string): Tab | undefined {
    return this.tabs?.find(x => x.url === domain);
  }

  async addTab(domain: string, favicon: string | undefined): Promise<Tab | undefined> {
    const tabFromStorage = this.getTab(domain);
    const isInBlackListFlag = await isInBlackList(domain);

    if (!isInBlackListFlag && !tabFromStorage) {
      const newTab = new Tab();
      newTab.init(domain);
      this.tabs.push(newTab);
      return newTab;
    }

    return undefined;
  }
}
