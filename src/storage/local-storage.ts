import { IStorage } from "./storage";
import { StorageParams } from "./storage-params";
import { Tab } from "./tab";
import Browser from 'webextension-polyfill';

export class LocalStorage implements IStorage {
    getTabs(): Promise<Tab[]> {
        return new Promise(async resolve => {
            const { tabs } = await Browser.storage.local.get(StorageParams.TABS);
            if (tabs != undefined)
                return resolve(tabs);
            else resolve([]);
        });
    }

    saveTabs(value: Tab[]): Promise<void> {
        return Browser.storage.local.set({ tabs: value });
    }

    saveValue(name: StorageParams, value: object): Promise<void> {
        return Browser.storage.local.set({
            [name]: value
        });
    }

    getValue(name: StorageParams): Promise<object> {
        return Browser.storage.local.get(name);
    }
}