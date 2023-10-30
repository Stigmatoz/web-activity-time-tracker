import Browser from 'webextension-polyfill';
import { injecStorage } from '../storage/inject-storage';
import { Messages } from '../utils/messages';

export async function useRemoveAllData() {
  const storage = injecStorage();
  await storage.saveIntervalList([]);
  await Browser.runtime.sendMessage(Messages.ClearAllData);
}
