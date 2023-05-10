import { ITabsRepository } from "./tabs-repository-interface";
import { Tab } from "../entity/tab";
import { injecStorage } from "../storage/inject-storage";
import { isInBlackList } from "../compositions/black-list";
import { StorageDeserializeParam } from "../storage/storage-params";

export class TabsRepository implements ITabsRepository {
  private tabs: Tab[];

  constructor() {
    this.tabs = [];
  }

  async initAsync() {
    this.tabs = (await injecStorage().getDeserializeList(
      StorageDeserializeParam.TABS
    )) as Tab[];
  }

  getTabs(): Tab[] {
    return this.tabs;
  }

  getTab(domain: string): Tab | undefined {
    return this.tabs?.find((x) => x.url === domain);
  }

  async addTab(domain: string, favicon: string | undefined): Promise<Tab | undefined> {
    const tabFromStorage = this.getTab(domain);
    const isInBlackListFlag = await isInBlackList(domain);

    if (!isInBlackListFlag) {
      if (!tabFromStorage) {
        if (!favicon) {
          favicon = "chrome://favicon/" + domain;
        }
        const newTab = new Tab();
        newTab.init(domain, favicon);
        this.tabs.push(newTab);
        return newTab;
      }
    }

    return undefined;
  }
}
