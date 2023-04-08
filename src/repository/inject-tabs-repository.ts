import { ITabsRepository } from "./tabs-repository-interface";
import { TabsRepository } from "./tabs-repository";

let instanse: ITabsRepository | null = null;

async function createAndInitInstance() {
  let repo = new TabsRepository();
  await repo.initAsync();
  return repo;
}

export async function injectTabsRepository(): Promise<ITabsRepository> {
  if (instanse == null) {
    console.log("test");
    instanse = await createAndInitInstance();
  }
  return instanse;
}
