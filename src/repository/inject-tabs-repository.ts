import { ITabsRepository } from "./tabs-repository-interface";
import { TabsRepository } from "./tabs-repository";

export async function injectTabsRepository(): Promise<ITabsRepository> {
    const repo = new TabsRepository();
    await repo.initAsync();
    return repo;
  }