import Browser from 'webextension-polyfill';
import { injecStorage } from '../storage/inject-storage';
import { Messages } from '../utils/messages';

export async function removeAllData() {
  const storage = injecStorage();
  await storage.saveIntervalList([]);

  Browser.runtime.sendMessage(Messages.ClearAllData);
}
