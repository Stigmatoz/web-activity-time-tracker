import Browser from 'webextension-polyfill';
import { Messages } from '../utils/messages';

export async function useRestoreData(json: string) {
  if (json != null && json != undefined && json != '') {
    const data = JSON.parse(json);
    await Browser.runtime.sendMessage({
      message: Messages.Restore,
      data: data,
    });
  }
}
