import { LocalStorage } from './local-storage';
import { IStorage } from './storage-interface';

export function injecStorage(): IStorage {
  return new LocalStorage();
}
