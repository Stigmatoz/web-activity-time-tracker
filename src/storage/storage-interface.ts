import { StorageParams } from "./storage-params";
import { Tab } from "../entity/tab";

export interface IStorage {
    getTabs(): Promise<Tab[]>;
    saveTabs(value:Tab[]): Promise<void>;
    saveValue(name:StorageParams, value: any): Promise<void>;
    getValue(name:StorageParams): Promise<any>;
}