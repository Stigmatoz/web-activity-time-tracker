import { LocalStorage } from './local-storage';
import { IStorage } from './storage-interface';

export function injectStorage(): IStorage {
  return new LocalStorage();
}
