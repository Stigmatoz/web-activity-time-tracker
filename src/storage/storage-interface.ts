import { StorageDeserializeParam, StorageDeserializeType, StorageParams } from './storage-params';
import { Tab } from '../entity/tab';
import { TimeInterval } from '../entity/time-interval';

export interface IStorage {
  getDeserializeList(param: StorageDeserializeParam): Promise<StorageDeserializeType[]>;
  saveTabs(value: Tab[]): Promise<void>;
  saveIntervalList(value: TimeInterval[]): Promise<void>;
  saveValue(name: StorageParams, value: any): Promise<void>;
  getValue(name: StorageParams, defaultValue?: any): Promise<any>;
}
