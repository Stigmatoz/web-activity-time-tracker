import Browser from 'webextension-polyfill';
import { buildBlockQuery } from '../utils/block-page';

export async function useBlockPage(
  domain: string,
  url: string,
  liimitTime: number,
  summaryCounter: number,
): Promise<void> {
  const blockUrl =
    Browser.runtime.getURL('src/block.html') +
    buildBlockQuery(domain, url, liimitTime, summaryCounter);
  const tab = await Browser.tabs.query({ currentWindow: true, active: true });
  Browser.tabs.update(tab[0].id, { url: blockUrl });
}
