import { ITabsRepository } from "./tabs-repository-interface";
import { TabsRepository } from "./tabs-repository";

export async function injectTabsRepository(): Promise<ITabsRepository> {
    return await TabsRepository.Create();
  }