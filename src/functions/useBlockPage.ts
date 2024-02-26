import Browser from 'webextension-polyfill';
import { buildBlockQuery } from '../utils/block-page';
import { NO_FAVICON } from '../utils/consts';

export async function useBlockPage(
  domain: string,
  url: string,
  limitTime: number,
  summaryCounter: number,
  favIconUrl: string | undefined,
): Promise<void> {
  const favicon =
    favIconUrl == undefined || favIconUrl == '' || favIconUrl.startsWith('chrome://favicon/')
      ? NO_FAVICON
      : favIconUrl;
  const blockUrl =
    Browser.runtime.getURL('src/block.html') +
    buildBlockQuery(domain, url, limitTime, summaryCounter, favicon);
  const tab = await Browser.tabs.query({ currentWindow: true, active: true });
  await Browser.tabs.update(tab[0].id, { url: blockUrl });
}
