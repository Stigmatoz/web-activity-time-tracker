import { IStorage } from "./storage-interface";
import { StorageParams } from "./storage-params";
import { Tab } from "../entity/tab";
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

    saveValue(name: StorageParams, value: any): Promise<void> {
        return Browser.storage.local.set({
            [name]: value
        });
    }

    async getValue(name: StorageParams): Promise<any> {
        const value = await Browser.storage.local.get(name);
        return value[name];
    }
}