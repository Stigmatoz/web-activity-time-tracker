import { IStorage } from "./storage-interface";
import { StorageParams } from "./storage-params";
import { Tab } from "../entity/tab";
import Browser from 'webextension-polyfill';
import { isEmpty } from "../common/utility";

export class LocalStorage implements IStorage {
    async getTabs(): Promise<Tab[]> {
        return new Promise(async resolve => {
            const { tabs } = await Browser.storage.local.get(StorageParams.TABS);
            if (tabs != undefined){
                let tempTabs: Tab[] = [];
                for (let i = 0; i < tabs.length; i++) {
                    tempTabs.push(new Tab().deserialize(tabs[i]));
                }
                return resolve(tempTabs);
            }
            else resolve([]);
        });
    }

    async saveTabs(value: Tab[]): Promise<void> {
        return await Browser.storage.local.set({ tabs: value });
    }

    async saveValue(name: StorageParams, value: any): Promise<void> {
        return await Browser.storage.local.set({
            [name]: value
        });
    }

    async getValue(name: StorageParams, defaultValue?: any): Promise<any> {
        let value = await Browser.storage.local.get(name);
        if (isEmpty(value) && defaultValue != undefined){
            await this.saveValue(name, defaultValue);
            return defaultValue;
        }
        return value[name];
    }
}