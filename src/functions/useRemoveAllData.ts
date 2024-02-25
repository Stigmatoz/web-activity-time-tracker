import Browser from 'webextension-polyfill';
import { injectStorage } from '../storage/inject-storage';
import { Messages } from '../utils/messages';

export async function useRemoveAllData() {
  const storage = injectStorage();
  await storage.saveIntervalList([]);
  await Browser.runtime.sendMessage(Messages.ClearAllData);
}
